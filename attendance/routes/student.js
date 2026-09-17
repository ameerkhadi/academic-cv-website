import {
  ok, fail, readBody, parseCookies, setCookie, randomId, signValue, unsignValue,
  distanceMeters, round5, clientIp, now
} from '../lib/util.js';
import { parseToken, slotOf } from '../lib/tokens.js';
import { computeFlags } from '../lib/flags.js';
import { sessionRoster, STATUS_AR } from '../lib/report.js';

const DEVICE_COOKIE = 'att_dev';
const DEVICE_MAX_AGE = 60 * 60 * 24 * 365;

/* ---------- الجهاز المربوط ---------- */

export function deviceFromRequest(app, req) {
  const raw = parseCookies(req)[DEVICE_COOKIE];
  const deviceId = unsignValue(app.secret, raw);
  if (!deviceId) return null;
  const device = app.db
    .prepare(
      `SELECT d.*, s.name, s.student_no, s.active
         FROM devices d JOIN students s ON s.id = d.student_id
        WHERE d.id = ? AND d.revoked = 0`
    )
    .get(deviceId);
  return device && device.active ? device : null;
}

function bindDevice(app, res, studentId, meta) {
  const id = randomId(24);
  app.db
    .prepare('INSERT INTO devices(id, student_id, fp, ua, ip, created_at, last_seen) VALUES(?,?,?,?,?,?,?)')
    .run(id, studentId, meta.fp || null, meta.ua || null, meta.ip || null, now(), now());
  setCookie(res, DEVICE_COOKIE, signValue(app.secret, id), {
    maxAge: DEVICE_MAX_AGE,
    secure: app.secureCookies
  });
  return id;
}

/* ---------- التحقق من الرمز والموقع ---------- */

/**
 * يتحقق من رمز QR ويحدّد ما إذا كان إرسالاً آنياً أم متأخراً.
 * الإرسال المتأخر مسموح ضمن مهلة، لأن الرمز نفسه لا يمكن الحصول عليه
 * إلا من داخل القاعة أثناء النافذة، فتأخر الشبكة لا يفتح ثغرة.
 */
function validateToken(app, rawToken) {
  const slotSeconds = app.store.getNum('slot_seconds') || 30;
  const parsed = parseToken(app.secret, rawToken, slotSeconds);
  if (!parsed) return { error: ['bad-token', 'الرمز غير صالح. أعد مسح رمز القاعة.'] };

  const check = app.db.prepare('SELECT * FROM checks WHERE id = ?').get(parsed.checkId);
  if (!check) return { error: ['no-check', 'نافذة الحضور غير موجودة.'] };

  const session = app.db.prepare('SELECT * FROM sessions WHERE id = ?').get(check.session_id);
  const subject = app.db.prepare('SELECT * FROM subjects WHERE id = ?').get(session.subject_id);

  const t = now();
  const slotMs = slotSeconds * 1000;
  const currentSlot = slotOf(t, slotSeconds);
  const windowEnd = check.closed_at || check.closes_at;

  // آني: شريحة حالية أو التي قبلها مباشرة، والنافذة ما تزال مفتوحة.
  const fresh = parsed.slot >= currentSlot - 1 && t <= windowEnd + slotMs;
  if (fresh) return { check, session, subject, late: false, slotSeconds };

  // متأخر: الشريحة تقع فعلاً داخل نافذة التدقيق، والإرسال ضمن المهلة المسموحة.
  const lateMs = (app.store.getNum('late_minutes') || 60) * 60 * 1000;
  const slotInsideWindow =
    parsed.slotEnd >= check.opened_at && parsed.slotStart <= windowEnd + slotMs;
  if (slotInsideWindow && t <= windowEnd + lateMs) {
    return { check, session, subject, late: true, slotSeconds };
  }

  return { error: ['token-expired', 'انتهت صلاحية الرمز. امسح الرمز المعروض الآن.'] };
}

/** يفحص الموقع مقابل سياج القاعة. */
function checkGeo(app, body) {
  const requireGeo = app.store.getBool('require_geo');
  const hallLat = Number(app.store.get('hall_lat'));
  const hallLng = Number(app.store.get('hall_lng'));
  const hasHall = isFinite(hallLat) && isFinite(hallLng) && (hallLat !== 0 || hallLng !== 0);

  const lat = round5(Number(body.lat));
  const lng = round5(Number(body.lng));
  const acc = isFinite(Number(body.acc)) ? Math.round(Number(body.acc)) : null;
  const hasPoint = lat !== null && lng !== null;

  if (!hasPoint) {
    if (requireGeo && hasHall) {
      return { error: ['geo-required', 'فعّل خدمة الموقع واسمح للمتصفح بالوصول إليها، ثم أعد المحاولة.'] };
    }
    return { lat: null, lng: null, acc: null, dist: null };
  }

  if (!hasHall) return { lat, lng, acc, dist: null };

  const radius = app.store.getNum('radius_m') || 120;
  const maxAccuracy = app.store.getNum('max_accuracy_m') || 150;
  const dist = Math.round(distanceMeters(hallLat, hallLng, lat, lng));

  // نتساهل بمقدار خطأ القياس المعلن حتى لا نعاقب ضعف الإشارة داخل البناية.
  const tolerance = Math.min(acc ?? 0, maxAccuracy);
  if (requireGeo && dist > radius + tolerance) {
    return { error: ['outside-hall', `يبدو أنك خارج القاعة (تبعد نحو ${dist} متراً). التسجيل مسموح من داخل القاعة فقط.`] };
  }
  return { lat, lng, acc, dist };
}

/* ---------- تسجيل الحضور ---------- */

function recordMark(app, req, { check, session, late }, device, geo, fp) {
  const ip = clientIp(req, app.trustProxy);
  const existing = app.db
    .prepare('SELECT id, ts FROM marks WHERE check_id = ? AND student_id = ?')
    .get(check.id, device.student_id);
  if (existing) return { already: true };

  const flags = computeFlags(app.db, {
    studentId: device.student_id,
    deviceId: device.id,
    fp,
    ip,
    lat: geo.lat,
    lng: geo.lng,
    acc: geo.acc,
    dist: geo.dist,
    checkId: check.id,
    requireGeo: app.store.getBool('require_geo'),
    radius: app.store.getNum('radius_m') || 120,
    maxAccuracy: app.store.getNum('max_accuracy_m') || 150,
    late
  });

  app.db
    .prepare(
      `INSERT OR IGNORE INTO marks
       (check_id, session_id, student_id, device_id, ts, captured_at, ip, fp, lat, lng, acc, dist, late, flags)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    )
    .run(
      check.id, session.id, device.student_id, device.id, now(),
      Number(check.opened_at) || null, ip, fp || null,
      geo.lat, geo.lng, geo.acc, geo.dist, late ? 1 : 0, flags.join(',')
    );

  app.db.prepare('UPDATE devices SET last_seen = ?, ip = ? WHERE id = ?').run(now(), ip, device.id);
  return { already: false, flags };
}

function summaryFor(app, sessionId, studentId) {
  const rule = app.store.get('present_rule');
  const row = sessionRoster(app.db, sessionId, rule).find((r) => r.id === studentId);
  if (!row) return null;
  return {
    attended: row.attended,
    totalChecks: row.totalChecks,
    status: row.status,
    statusText: STATUS_AR[row.status]
  };
}

/* ---------- المسارات ---------- */

export async function handleStudentApi(app, req, res, url) {
  const p = url.pathname;
  const ip = clientIp(req, app.trustProxy);

  /* من أنا وسجلّي */
  if (p === '/api/me' && req.method === 'GET') {
    const device = deviceFromRequest(app, req);
    if (!device) return ok(res, { bound: false });

    const history = app.db
      .prepare(
        `SELECT sub.name AS subject, s.date, s.id AS session_id,
                (SELECT COUNT(*) FROM checks c WHERE c.session_id = s.id) AS checks,
                (SELECT COUNT(*) FROM marks m WHERE m.session_id = s.id AND m.student_id = ?) AS attended,
                (SELECT o.status FROM overrides o WHERE o.session_id = s.id AND o.student_id = ?) AS override_status
           FROM sessions s JOIN subjects sub ON sub.id = s.subject_id
          ORDER BY s.date DESC, s.id DESC LIMIT 40`
      )
      .all(device.student_id, device.student_id);

    const rule = app.store.get('present_rule');
    return ok(res, {
      bound: true,
      student: { id: device.student_id, name: device.name, studentNo: device.student_no || '' },
      history: history.map((h) => {
        const computed = h.attended === 0 ? 'absent'
          : rule === 'any' || h.attended >= h.checks ? 'present' : 'partial';
        const status = h.override_status || computed;
        return { subject: h.subject, date: h.date, attended: h.attended, checks: h.checks, status, statusText: STATUS_AR[status] };
      })
    });
  }

  /* حالة الرمز الممسوح: هل النافذة مفتوحة، وهل الجهاز مربوط */
  if (p === '/api/scan' && req.method === 'GET') {
    const result = validateToken(app, url.searchParams.get('t'));
    if (result.error) return fail(res, 400, result.error[0], result.error[1]);
    const device = deviceFromRequest(app, req);
    return ok(res, {
      subject: result.subject.name,
      date: result.session.date,
      late: result.late,
      bound: !!device,
      student: device ? { id: device.student_id, name: device.name } : null,
      enrollmentOpen: app.store.getBool('enrollment_open'),
      requireGeo: app.store.getBool('require_geo')
    });
  }

  /* تسجيل الحضور */
  if (p === '/api/attend' && req.method === 'POST') {
    if (!app.limitAttend(ip)) return fail(res, 429, 'rate', 'طلبات كثيرة جداً. انتظر قليلاً ثم أعد المحاولة.');
    const body = await readBody(req);

    const result = validateToken(app, body.t);
    if (result.error) return fail(res, 400, result.error[0], result.error[1]);

    const device = deviceFromRequest(app, req);
    if (!device) {
      return fail(res, 409, 'needs-enroll', 'هذا الجهاز غير مرتبط بأي طالب بعد.');
    }

    const geo = checkGeo(app, body);
    if (geo.error) return fail(res, 403, geo.error[0], geo.error[1]);

    const marked = recordMark(app, req, result, device, geo, body.fp);
    return ok(res, {
      already: marked.already,
      late: result.late,
      subject: result.subject.name,
      student: { id: device.student_id, name: device.name },
      summary: summaryFor(app, result.session.id, device.student_id)
    });
  }

  /* قائمة الأسماء للتسجيل الأولي */
  if (p === '/api/roster' && req.method === 'GET') {
    const result = validateToken(app, url.searchParams.get('t'));
    if (result.error) return fail(res, 400, result.error[0], result.error[1]);

    const rows = app.db
      .prepare(
        `SELECT s.id, s.name, s.student_no,
                (SELECT COUNT(*) FROM devices d WHERE d.student_id = s.id AND d.revoked = 0) AS bound
           FROM students s WHERE s.active = 1 ORDER BY s.name COLLATE NOCASE`
      )
      .all();

    return ok(res, {
      enrollmentOpen: app.store.getBool('enrollment_open'),
      needsCode: !!app.db.prepare("SELECT 1 FROM students WHERE (code IS NOT NULL AND code <> '') OR (student_no IS NOT NULL AND student_no <> '') LIMIT 1").get(),
      students: rows.map((r) => ({ id: r.id, name: r.name, bound: !!r.bound }))
    });
  }

  /* ربط الجهاز بالطالب (يجري داخل القاعة وأثناء نافذة مفتوحة) */
  if (p === '/api/enroll' && req.method === 'POST') {
    // يُحسب الحدّ على المحاولات الفاشلة فقط، لأن طلبة القاعة قد يتشاركون عنوان IP واحداً.
    if (!app.limitEnroll.check(ip)) return fail(res, 429, 'rate', 'محاولات كثيرة. انتظر دقيقة ثم أعد المحاولة.');
    const reject = (status, code, message) => {
      app.limitEnroll.hit(ip);
      return fail(res, status, code, message);
    };
    const body = await readBody(req);

    const result = validateToken(app, body.t);
    if (result.error) return reject(400, result.error[0], result.error[1]);
    if (result.late) return reject(400, 'token-expired', 'الرمز قديم. امسح الرمز المعروض الآن.');

    const existing = deviceFromRequest(app, req);
    if (existing) return reject(409, 'already-bound', `هذا الجهاز مرتبط أصلاً بالطالب: ${existing.name}`);

    const student = app.db
      .prepare('SELECT * FROM students WHERE id = ? AND active = 1')
      .get(Number(body.studentId));
    if (!student) return reject(404, 'no-student', 'الاسم غير موجود في القائمة.');

    const bound = app.db
      .prepare('SELECT 1 FROM devices WHERE student_id = ? AND revoked = 0')
      .get(student.id);
    if (bound) {
      return reject(409, 'student-bound', 'هذا الاسم مرتبط بجهاز آخر. راجع التدريسي لفكّ الارتباط.');
    }

    const approved = app.db
      .prepare(
        "SELECT 1 FROM rebind_requests WHERE student_id = ? AND status = 'approved' AND created_at > ?"
      )
      .get(student.id, now() - 24 * 60 * 60 * 1000);
    if (!app.store.getBool('enrollment_open') && !approved) {
      return reject(403, 'enrollment-closed', 'التسجيل الأولي مغلق حالياً. اطلب من التدريسي فتحه.');
    }

    const expected = (student.code || student.student_no || '').trim();
    if (expected) {
      const given = String(body.code || '').trim();
      if (given.toLowerCase() !== expected.toLowerCase()) {
        return reject(403, 'bad-code', 'الرقم الجامعي أو الرمز غير مطابق.');
      }
    }

    const geo = checkGeo(app, body);
    if (geo.error) return reject(403, geo.error[0], geo.error[1]);

    const deviceId = bindDevice(app, res, student.id, {
      fp: body.fp,
      ua: req.headers['user-agent'],
      ip
    });
    app.store.log('student:' + student.id, 'enroll', { deviceId, ip });

    const device = { id: deviceId, student_id: student.id, name: student.name };
    const marked = recordMark(app, req, result, device, geo, body.fp);

    return ok(res, {
      student: { id: student.id, name: student.name },
      already: marked.already,
      subject: result.subject.name,
      summary: summaryFor(app, result.session.id, student.id)
    });
  }

  /* طلب فكّ ارتباط الجهاز (تغيير الهاتف) */
  if (p === '/api/rebind' && req.method === 'POST') {
    if (!app.limitEnroll.check(ip)) return fail(res, 429, 'rate', 'محاولات كثيرة. انتظر دقيقة ثم أعد المحاولة.');
    const body = await readBody(req);
    const student = app.db
      .prepare('SELECT * FROM students WHERE id = ? AND active = 1')
      .get(Number(body.studentId));
    if (!student) { app.limitEnroll.hit(ip); return fail(res, 404, 'no-student', 'الاسم غير موجود.'); }

    const expected = (student.code || student.student_no || '').trim();
    if (expected && String(body.code || '').trim().toLowerCase() !== expected.toLowerCase()) {
      app.limitEnroll.hit(ip);
      return fail(res, 403, 'bad-code', 'الرقم الجامعي أو الرمز غير مطابق.');
    }

    app.db
      .prepare(
        'INSERT INTO rebind_requests(student_id, fp, ua, ip, reason, created_at) VALUES(?,?,?,?,?,?)'
      )
      .run(student.id, body.fp || null, req.headers['user-agent'] || null, ip,
        String(body.reason || '').slice(0, 300), now());

    return ok(res, { message: 'أُرسل الطلب إلى التدريسي. راجعه لاعتماد الجهاز الجديد.' });
  }

  return false;
}
