import {
  ok, fail, readBody, parseCookies, setCookie, clearCookie, signValue, unsignValue,
  verifyPassword, hashPassword, clientIp, now, localDate, localClock, hhmm, parseHhmm
} from '../lib/util.js';
import { currentToken } from '../lib/tokens.js';
import { sessionRoster, subjectReport, STATUS_AR, STATUS } from '../lib/report.js';
import { FLAG_LABELS, describeFlags } from '../lib/flags.js';

const ADMIN_COOKIE = 'att_adm';
const ADMIN_TTL_MS = 12 * 60 * 60 * 1000;

export function isAdmin(app, req) {
  const value = unsignValue(app.secret, parseCookies(req)[ADMIN_COOKIE]);
  if (!value) return false;
  const [tag, expiry] = value.split('|');
  return tag === 'admin' && Number(expiry) > now();
}

const tz = (app) => app.store.get('timezone') || 'Asia/Baghdad';

function activeSession(app) {
  const id = Number(app.store.get('active_session_id'));
  if (!id) return null;
  const session = app.db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
  if (!session || session.closed_at) return null;
  const subject = app.db.prepare('SELECT * FROM subjects WHERE id = ?').get(session.subject_id);
  return { ...session, subject };
}

function openCheck(app, sessionId) {
  return app.db
    .prepare(
      'SELECT * FROM checks WHERE session_id = ? AND closed_at IS NULL AND closes_at > ? ORDER BY id DESC LIMIT 1'
    )
    .get(sessionId, now());
}

function todaySubjects(app) {
  const clock = localClock(tz(app));
  const date = localDate(tz(app));
  return app.db
    .prepare('SELECT * FROM subjects WHERE active = 1 AND day_of_week = ? ORDER BY start_min, sort')
    .all(clock.dayOfWeek)
    .map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code || '',
      time: s.start_min === null ? '' : `${hhmm(s.start_min)} - ${hhmm(s.end_min)}`,
      nowInside: s.start_min !== null && clock.minutes >= s.start_min - 20 && clock.minutes <= s.end_min + 20,
      sessionId: app.db.prepare('SELECT id FROM sessions WHERE subject_id = ? AND date = ?').get(s.id, date)?.id || null
    }));
}

function csvEscape(v) {
  const s = v === null || v === undefined ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function sendCsv(res, filename, rows) {
  const body = '﻿' + rows.map((r) => r.map(csvEscape).join(',')).join('\r\n');
  res.writeHead(200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

/** يقرأ CSV بسيطاً يدعم الاقتباس المزدوج. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  const push = () => { row.push(field); field = ''; };
  const endRow = () => { push(); if (row.some((c) => c.trim() !== '')) rows.push(row); row = []; };
  const src = String(text).replace(/\r\n?/g, '\n');
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') { if (src[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',' || c === ';' || c === '\t') push();
    else if (c === '\n') endRow();
    else field += c;
  }
  endRow();
  return rows;
}

export async function handleAdminApi(app, req, res, url) {
  const p = url.pathname;
  const ip = clientIp(req, app.trustProxy);

  /* ---------- الدخول ---------- */

  if (p === '/api/admin/login' && req.method === 'POST') {
    if (!app.limitLogin(ip)) return fail(res, 429, 'rate', 'محاولات دخول كثيرة. انتظر دقيقة.');
    const body = await readBody(req);
    if (!verifyPassword(body.password, app.store.get('admin_hash'))) {
      app.store.log('admin', 'login-failed', { ip });
      return fail(res, 401, 'bad-password', 'كلمة المرور غير صحيحة.');
    }
    setCookie(res, ADMIN_COOKIE, signValue(app.secret, `admin|${now() + ADMIN_TTL_MS}`), {
      maxAge: ADMIN_TTL_MS / 1000,
      secure: app.secureCookies
    });
    app.store.log('admin', 'login', { ip });
    return ok(res);
  }

  if (p === '/api/admin/logout' && req.method === 'POST') {
    clearCookie(res, ADMIN_COOKIE);
    return ok(res);
  }

  if (!isAdmin(app, req)) return fail(res, 401, 'unauthorized', 'يلزم تسجيل دخول التدريسي.');

  /* ---------- الحالة العامة ---------- */

  if (p === '/api/admin/state' && req.method === 'GET') {
    const session = activeSession(app);
    const check = session ? openCheck(app, session.id) : null;
    const total = app.db.prepare('SELECT COUNT(*) AS n FROM students WHERE active = 1').get().n;
    const boundCount = app.db.prepare('SELECT COUNT(*) AS n FROM devices WHERE revoked = 0').get().n;
    const pending = app.db.prepare("SELECT COUNT(*) AS n FROM rebind_requests WHERE status = 'pending'").get().n;

    let live = null;
    if (session) {
      const checksCount = app.db.prepare('SELECT COUNT(*) AS n FROM checks WHERE session_id = ?').get(session.id).n;
      const marked = check
        ? app.db.prepare('SELECT COUNT(*) AS n FROM marks WHERE check_id = ?').get(check.id).n
        : 0;
      live = { checksCount, markedInCheck: marked };
    }

    return ok(res, {
      settings: app.store.settings(),
      today: { date: localDate(tz(app)), subjects: todaySubjects(app) },
      session: session && {
        id: session.id, date: session.date, subject: session.subject.name, openedAt: session.opened_at
      },
      check: check && { id: check.id, seq: check.seq, opensAt: check.opened_at, closesAt: check.closes_at },
      live,
      totals: { students: total, boundDevices: boundCount, pendingRebinds: pending }
    });
  }

  /* رمز العرض المتحرك - محمي بالدخول حتى لا يلتقطه أحد من خارج القاعة */
  if (p === '/api/admin/token' && req.method === 'GET') {
    const session = activeSession(app);
    if (!session) return ok(res, { active: false, reason: 'no-session' });
    const check = openCheck(app, session.id);
    if (!check) return ok(res, { active: false, reason: 'no-check', subject: session.subject.name });

    const slotSeconds = app.store.getNum('slot_seconds') || 30;
    const t = currentToken(app.secret, check.id, slotSeconds);
    const marked = app.db.prepare('SELECT COUNT(*) AS n FROM marks WHERE check_id = ?').get(check.id).n;
    const total = app.db.prepare('SELECT COUNT(*) AS n FROM students WHERE active = 1').get().n;

    return ok(res, {
      active: true,
      subject: session.subject.name,
      token: t.token,
      expiresAt: t.expiresAt,
      slotSeconds,
      closesAt: check.closes_at,
      seq: check.seq,
      marked,
      total
    });
  }

  /* ---------- الجلسات والتدقيقات ---------- */

  if (p === '/api/admin/session/open' && req.method === 'POST') {
    const body = await readBody(req);
    const subject = app.db.prepare('SELECT * FROM subjects WHERE id = ? AND active = 1').get(Number(body.subjectId));
    if (!subject) return fail(res, 404, 'no-subject', 'المادة غير موجودة.');

    const date = String(body.date || localDate(tz(app)));
    let session = app.db.prepare('SELECT * FROM sessions WHERE subject_id = ? AND date = ?').get(subject.id, date);
    if (!session) {
      const info = app.db
        .prepare('INSERT INTO sessions(subject_id, date, opened_at) VALUES(?,?,?)')
        .run(subject.id, date, now());
      session = app.db.prepare('SELECT * FROM sessions WHERE id = ?').get(Number(info.lastInsertRowid));
    } else if (session.closed_at) {
      app.db.prepare('UPDATE sessions SET closed_at = NULL WHERE id = ?').run(session.id);
    }
    app.store.set('active_session_id', session.id);
    app.store.log('admin', 'session-open', { sessionId: session.id, subject: subject.name, date });
    return ok(res, { sessionId: session.id, subject: subject.name, date });
  }

  if (p === '/api/admin/session/close' && req.method === 'POST') {
    const session = activeSession(app);
    if (session) {
      app.db.prepare('UPDATE checks SET closed_at = ? WHERE session_id = ? AND closed_at IS NULL').run(now(), session.id);
      app.db.prepare('UPDATE sessions SET closed_at = ? WHERE id = ?').run(now(), session.id);
      app.store.log('admin', 'session-close', { sessionId: session.id });
    }
    app.store.set('active_session_id', '');
    return ok(res);
  }

  if (p === '/api/admin/check/open' && req.method === 'POST') {
    const body = await readBody(req);
    const session = activeSession(app);
    if (!session) return fail(res, 400, 'no-session', 'افتح المحاضرة أولاً.');
    if (openCheck(app, session.id)) return fail(res, 409, 'check-open', 'هناك نافذة مفتوحة بالفعل.');

    const seconds = Math.max(30, Math.min(900, Number(body.seconds) || app.store.getNum('check_seconds') || 120));
    const seq = app.db.prepare('SELECT COUNT(*) AS n FROM checks WHERE session_id = ?').get(session.id).n + 1;
    const info = app.db
      .prepare('INSERT INTO checks(session_id, seq, opened_at, closes_at) VALUES(?,?,?,?)')
      .run(session.id, seq, now(), now() + seconds * 1000);
    app.store.log('admin', 'check-open', { sessionId: session.id, seq, seconds });
    return ok(res, { checkId: Number(info.lastInsertRowid), seq, closesAt: now() + seconds * 1000 });
  }

  if (p === '/api/admin/check/close' && req.method === 'POST') {
    const session = activeSession(app);
    const check = session && openCheck(app, session.id);
    if (check) {
      app.db.prepare('UPDATE checks SET closed_at = ? WHERE id = ?').run(now(), check.id);
      app.store.log('admin', 'check-close', { checkId: check.id });
    }
    return ok(res);
  }

  if (p === '/api/admin/check/extend' && req.method === 'POST') {
    const body = await readBody(req);
    const session = activeSession(app);
    const check = session && openCheck(app, session.id);
    if (!check) return fail(res, 400, 'no-check', 'لا توجد نافذة مفتوحة.');
    const add = Math.max(15, Math.min(600, Number(body.seconds) || 60));
    app.db.prepare('UPDATE checks SET closes_at = ? WHERE id = ?').run(check.closes_at + add * 1000, check.id);
    return ok(res, { closesAt: check.closes_at + add * 1000 });
  }

  /* ---------- كشف الحضور ---------- */

  if (p === '/api/admin/roster' && req.method === 'GET') {
    const sessionId = Number(url.searchParams.get('sessionId')) || activeSession(app)?.id;
    if (!sessionId) return fail(res, 400, 'no-session', 'لا توجد محاضرة مفتوحة.');
    const session = app.db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
    if (!session) return fail(res, 404, 'no-session', 'المحاضرة غير موجودة.');
    const subject = app.db.prepare('SELECT name FROM subjects WHERE id = ?').get(session.subject_id);

    const rows = sessionRoster(app.db, sessionId, app.store.get('present_rule'));
    return ok(res, {
      session: { id: sessionId, date: session.date, subject: subject.name, closed: !!session.closed_at },
      flagLabels: FLAG_LABELS,
      statusText: STATUS_AR,
      rows: rows.map((r) => ({ ...r, flagsText: describeFlags(r.flags.join(',')) }))
    });
  }

  if (p === '/api/admin/mark' && req.method === 'POST') {
    const body = await readBody(req);
    const sessionId = Number(body.sessionId);
    const studentId = Number(body.studentId);
    const status = String(body.status || '');
    if (!Object.values(STATUS).includes(status) && status !== 'clear') {
      return fail(res, 400, 'bad-status', 'حالة غير معروفة.');
    }
    if (status === 'clear') {
      app.db.prepare('DELETE FROM overrides WHERE session_id = ? AND student_id = ?').run(sessionId, studentId);
    } else {
      app.db
        .prepare(
          'INSERT INTO overrides(session_id, student_id, status, note, ts) VALUES(?,?,?,?,?) ' +
          'ON CONFLICT(session_id, student_id) DO UPDATE SET status = excluded.status, note = excluded.note, ts = excluded.ts'
        )
        .run(sessionId, studentId, status, String(body.note || '').slice(0, 200), now());
    }
    app.store.log('admin', 'override', { sessionId, studentId, status });
    return ok(res);
  }

  /* ---------- الطلبة والأجهزة ---------- */

  if (p === '/api/admin/students' && req.method === 'GET') {
    const rows = app.db
      .prepare(
        `SELECT s.*, d.id AS device_id, d.created_at AS bound_at, d.ua
           FROM students s LEFT JOIN devices d ON d.student_id = s.id AND d.revoked = 0
          ORDER BY s.name COLLATE NOCASE`
      )
      .all();
    return ok(res, {
      students: rows.map((r) => ({
        id: r.id, name: r.name, studentNo: r.student_no || '', code: r.code || '',
        active: !!r.active, bound: !!r.device_id, boundAt: r.bound_at || null,
        device: r.ua ? String(r.ua).slice(0, 80) : ''
      }))
    });
  }

  if (p === '/api/admin/students/import' && req.method === 'POST') {
    const body = await readBody(req, 2 * 1024 * 1024);
    const rows = parseCsv(body.csv || '');
    if (!rows.length) return fail(res, 400, 'empty', 'لا توجد بيانات.');

    // تخطّي سطر العناوين إن وُجد
    const head = rows[0].map((c) => c.trim().toLowerCase());
    const hasHeader = head.some((c) => ['name', 'الاسم', 'اسم الطالب', 'الاسم الكامل', 'student_no', 'الرقم', 'الرقم الجامعي', 'code'].includes(c));
    const data = hasHeader ? rows.slice(1) : rows;

    const insert = app.db.prepare('INSERT INTO students(student_no, name, code, active, created_at) VALUES(?,?,?,1,?)');
    const update = app.db.prepare('UPDATE students SET name = ?, code = ? WHERE id = ?');
    const byNo = app.db.prepare("SELECT id FROM students WHERE student_no = ? AND student_no <> ''");
    const byName = app.db.prepare('SELECT id FROM students WHERE name = ?');

    let added = 0, updated = 0, skipped = 0;
    app.db.exec('BEGIN');
    try {
      for (const row of data) {
        const name = (row[0] || '').trim();
        const studentNo = (row[1] || '').trim();
        const code = (row[2] || '').trim();
        if (!name) { skipped++; continue; }
        const found = (studentNo && byNo.get(studentNo)) || byName.get(name);
        if (found) { update.run(name, code || null, found.id); updated++; }
        else { insert.run(studentNo || null, name, code || null, now()); added++; }
      }
      app.db.exec('COMMIT');
    } catch (err) {
      app.db.exec('ROLLBACK');
      return fail(res, 400, 'import-failed', 'فشل الاستيراد: ' + err.message);
    }
    app.store.log('admin', 'import-students', { added, updated, skipped });
    return ok(res, { added, updated, skipped });
  }

  if (p === '/api/admin/student/toggle' && req.method === 'POST') {
    const body = await readBody(req);
    app.db.prepare('UPDATE students SET active = ? WHERE id = ?').run(body.active ? 1 : 0, Number(body.studentId));
    return ok(res);
  }

  if (p === '/api/admin/device/revoke' && req.method === 'POST') {
    const body = await readBody(req);
    app.db.prepare('UPDATE devices SET revoked = 1 WHERE student_id = ? AND revoked = 0').run(Number(body.studentId));
    app.store.log('admin', 'device-revoke', { studentId: Number(body.studentId) });
    return ok(res);
  }

  if (p === '/api/admin/rebinds' && req.method === 'GET') {
    const rows = app.db
      .prepare(
        `SELECT r.*, s.name FROM rebind_requests r JOIN students s ON s.id = r.student_id
          WHERE r.status = 'pending' ORDER BY r.created_at DESC LIMIT 100`
      )
      .all();
    return ok(res, { requests: rows });
  }

  if (p === '/api/admin/rebind/decide' && req.method === 'POST') {
    const body = await readBody(req);
    const request = app.db.prepare('SELECT * FROM rebind_requests WHERE id = ?').get(Number(body.id));
    if (!request) return fail(res, 404, 'not-found', 'الطلب غير موجود.');
    if (body.approve) {
      app.db.prepare('UPDATE devices SET revoked = 1 WHERE student_id = ? AND revoked = 0').run(request.student_id);
      app.db.prepare("UPDATE rebind_requests SET status = 'approved', created_at = ? WHERE id = ?").run(now(), request.id);
    } else {
      app.db.prepare("UPDATE rebind_requests SET status = 'rejected' WHERE id = ?").run(request.id);
    }
    app.store.log('admin', 'rebind-decide', { id: request.id, approve: !!body.approve });
    return ok(res);
  }

  /* ---------- المواد والإعدادات ---------- */

  if (p === '/api/admin/subjects' && req.method === 'GET') {
    const rows = app.db.prepare('SELECT * FROM subjects ORDER BY day_of_week, start_min, sort').all();
    return ok(res, {
      subjects: rows.map((s) => ({
        id: s.id, name: s.name, code: s.code || '', dayOfWeek: s.day_of_week,
        start: s.start_min === null ? '' : hhmm(s.start_min),
        end: s.end_min === null ? '' : hhmm(s.end_min),
        active: !!s.active
      }))
    });
  }

  if (p === '/api/admin/subjects' && req.method === 'POST') {
    const body = await readBody(req);
    const list = Array.isArray(body.subjects) ? body.subjects : [];
    app.db.exec('BEGIN');
    try {
      const upd = app.db.prepare(
        'UPDATE subjects SET name=?, code=?, day_of_week=?, start_min=?, end_min=?, active=? WHERE id=?'
      );
      const ins = app.db.prepare(
        'INSERT INTO subjects(name, code, day_of_week, start_min, end_min, sort, active) VALUES(?,?,?,?,?,?,?)'
      );
      list.forEach((s, i) => {
        const name = String(s.name || '').trim();
        if (!name) return;
        const day = s.dayOfWeek === '' || s.dayOfWeek === null ? null : Number(s.dayOfWeek);
        const start = parseHhmm(s.start);
        const end = parseHhmm(s.end);
        const active = s.active === false ? 0 : 1;
        if (s.id) upd.run(name, s.code || null, day, start, end, active, Number(s.id));
        else ins.run(name, s.code || null, day, start, end, i, active);
      });
      app.db.exec('COMMIT');
    } catch (err) {
      app.db.exec('ROLLBACK');
      return fail(res, 400, 'save-failed', 'فشل الحفظ: ' + err.message);
    }
    return ok(res);
  }

  if (p === '/api/admin/settings' && req.method === 'POST') {
    const body = await readBody(req);
    const allowed = [
      'term_name', 'hall_name', 'hall_lat', 'hall_lng', 'radius_m', 'max_accuracy_m',
      'require_geo', 'check_seconds', 'slot_seconds', 'late_minutes', 'enrollment_open',
      'timezone', 'present_rule'
    ];
    for (const key of allowed) {
      if (body[key] !== undefined) app.store.set(key, body[key]);
    }
    if (body.newPassword) {
      app.store.set('admin_hash', hashPassword(String(body.newPassword)));
      app.store.log('admin', 'password-change', {});
    }
    return ok(res, { settings: app.store.settings() });
  }

  if (p === '/api/admin/enrollment' && req.method === 'POST') {
    const body = await readBody(req);
    app.store.set('enrollment_open', body.enabled ? '1' : '0');
    app.store.log('admin', 'enrollment', { enabled: !!body.enabled });
    return ok(res, { enrollmentOpen: !!body.enabled });
  }

  /* ---------- التقارير والتصدير ---------- */

  if (p === '/api/admin/sessions' && req.method === 'GET') {
    const rows = app.db
      .prepare(
        `SELECT s.id, s.date, s.closed_at, sub.name AS subject,
                (SELECT COUNT(*) FROM checks c WHERE c.session_id = s.id) AS checks,
                (SELECT COUNT(DISTINCT m.student_id) FROM marks m WHERE m.session_id = s.id) AS attendees
           FROM sessions s JOIN subjects sub ON sub.id = s.subject_id
          ORDER BY s.date DESC, s.id DESC LIMIT 200`
      )
      .all();
    return ok(res, { sessions: rows });
  }

  if (p === '/api/admin/report' && req.method === 'GET') {
    const subjectId = Number(url.searchParams.get('subjectId')) || null;
    const report = subjectReport(app.db, subjectId, app.store.get('present_rule'));
    return ok(res, report);
  }

  if (p === '/api/admin/export.csv' && req.method === 'GET') {
    const kind = url.searchParams.get('kind') || 'summary';
    if (kind === 'session') {
      const sessionId = Number(url.searchParams.get('sessionId'));
      const session = app.db.prepare('SELECT * FROM sessions WHERE id = ?').get(sessionId);
      if (!session) return fail(res, 404, 'no-session', 'المحاضرة غير موجودة.');
      const subject = app.db.prepare('SELECT name FROM subjects WHERE id = ?').get(session.subject_id);
      const rows = sessionRoster(app.db, sessionId, app.store.get('present_rule'));
      return sendCsv(res, `attendance-${session.date}-${sessionId}.csv`, [
        ['الاسم', 'الرقم الجامعي', 'المادة', 'التاريخ', 'الحالة', 'التدقيقات المحضورة', 'مجموع التدقيقات', 'ملاحظات النظام'],
        ...rows.map((r) => [
          r.name, r.studentNo, subject.name, session.date, STATUS_AR[r.status],
          r.attended, r.totalChecks, describeFlags(r.flags.join(',')).join(' | ')
        ])
      ]);
    }
    const subjectId = Number(url.searchParams.get('subjectId')) || null;
    const subject = subjectId ? app.db.prepare('SELECT name FROM subjects WHERE id = ?').get(subjectId) : null;
    const report = subjectReport(app.db, subjectId, app.store.get('present_rule'));
    return sendCsv(res, `attendance-summary-${subjectId || 'all'}.csv`, [
      ['الاسم', 'الرقم الجامعي', 'المادة', 'عدد المحاضرات', 'حاضر', 'حاضر جزئياً', 'غائب', 'بعذر', 'النسبة %'],
      ...report.rows.map((r) => [
        r.name, r.student_no || '', subject ? subject.name : 'كل المواد',
        report.sessionCount, r.present, r.partial, r.absent, r.excused, r.percent
      ])
    ]);
  }

  if (p === '/api/admin/purge-geo' && req.method === 'POST') {
    const info = app.db.prepare('UPDATE marks SET lat = NULL, lng = NULL WHERE lat IS NOT NULL').run();
    app.store.log('admin', 'purge-geo', { cleared: info.changes });
    return ok(res, { cleared: info.changes });
  }

  return false;
}
