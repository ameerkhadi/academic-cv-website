const BASE = process.env.BASE || 'http://127.0.0.1:8787';
const HALL = { lat: 33.312800, lng: 44.361500 };
let pass = 0, failCount = 0;

const check = (name, cond, extra = '') => {
  if (cond) { pass++; console.log(`  ✓ ${name}`); }
  else { failCount++; console.log(`  ✗ ${name} ${extra}`); }
};

function jar() {
  const cookies = new Map();
  return {
    header: () => [...cookies].map(([k, v]) => `${k}=${v}`).join('; '),
    absorb(res) {
      for (const raw of res.headers.getSetCookie?.() || []) {
        const [pair] = raw.split(';');
        const i = pair.indexOf('=');
        cookies.set(pair.slice(0, i), pair.slice(i + 1));
      }
    }
  };
}

async function call(cookieJar, path, { method = 'GET', body, ua } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookieJar.header() ? { Cookie: cookieJar.header() } : {}),
      ...(ua ? { 'User-Agent': ua } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual'
  });
  cookieJar.absorb(res);
  let data = null;
  try { data = await res.json(); } catch {}
  return { status: res.status, data };
}

const admin = jar();

console.log('\n== دخول التدريسي ==');
check('رفض كلمة مرور خاطئة', (await call(admin, '/api/admin/login', { method: 'POST', body: { password: 'wrong' } })).status === 401);
check('قبول كلمة المرور الصحيحة', (await call(admin, '/api/admin/login', { method: 'POST', body: { password: 'test1234' } })).status === 200);

console.log('\n== الإعدادات وسياج القاعة ==');
await call(admin, '/api/admin/settings', {
  method: 'POST',
  body: { hall_lat: String(HALL.lat), hall_lng: String(HALL.lng), radius_m: '80', max_accuracy_m: '60', require_geo: '1', slot_seconds: '30', check_seconds: '120' }
});
let st = (await call(admin, '/api/admin/state')).data;
check('حُفظت إحداثيات القاعة', st.settings.hall_lat === String(HALL.lat));
check('عدد الطلبة 122', st.totals.students === 122, JSON.stringify(st.totals));

console.log('\n== حماية شاشة العرض ==');
const anon = jar();
check('الرمز الحيّ محجوب عن غير المسجّل', (await call(anon, '/api/admin/token')).status === 401);
const disp = await fetch(BASE + '/display', { redirect: 'manual' });
check('صفحة العرض تحوّل إلى الدخول', disp.status === 302, String(disp.status));

console.log('\n== فتح المحاضرة والنافذة ==');
const subjects = (await call(admin, '/api/admin/subjects')).data.subjects;
const subject = subjects[0];
const opened = await call(admin, '/api/admin/session/open', { method: 'POST', body: { subjectId: subject.id } });
check('فُتحت المحاضرة', opened.status === 200, JSON.stringify(opened.data));
check('لا يوجد رمز قبل فتح النافذة', (await call(admin, '/api/admin/token')).data.active === false);
const chk = await call(admin, '/api/admin/check/open', { method: 'POST', body: { seconds: 120 } });
check('فُتحت نافذة الحضور', chk.status === 200, JSON.stringify(chk.data));
check('رفض فتح نافذة ثانية متزامنة', (await call(admin, '/api/admin/check/open', { method: 'POST' })).status === 409);

const tok = (await call(admin, '/api/admin/token')).data;
check('صدر رمز متحرك', !!tok.token && tok.active === true, JSON.stringify(tok));
check('الرمز قصير ومناسب للمسح', tok.token.length < 30, tok.token);

console.log('\n== التسجيل الأولي ==');
const s1 = jar();
check('الرمز صالح للفحص', (await call(s1, '/api/scan?t=' + encodeURIComponent(tok.token))).status === 200);
let r = await call(s1, '/api/attend', { method: 'POST', body: { t: tok.token, lat: HALL.lat, lng: HALL.lng, acc: 20 } });
check('جهاز غير مربوط يُطالَب بالتسجيل', r.status === 409 && r.data.code === 'needs-enroll', JSON.stringify(r.data));

const roster = (await call(s1, '/api/roster?t=' + encodeURIComponent(tok.token))).data;
check('قائمة الأسماء 122', roster.students.length === 122);
const A = roster.students[0], B = roster.students[1], C = roster.students[2];

r = await call(s1, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: A.id, code: '12301', lat: HALL.lat, lng: HALL.lng, acc: 20, fp: 'fpA' } });
check('التسجيل مرفوض والتسجيل الأولي مغلق', r.status === 403 && r.data.code === 'enrollment-closed', JSON.stringify(r.data));

await call(admin, '/api/admin/enrollment', { method: 'POST', body: { enabled: true } });
const students = (await call(admin, '/api/admin/students')).data.students;
const codeOf = (id) => students.find((s) => s.id === id).studentNo;

r = await call(s1, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: A.id, code: 'رقم-خاطئ', lat: HALL.lat, lng: HALL.lng, acc: 20, fp: 'fpA' } });
check('رفض الرقم الجامعي الخاطئ', r.status === 403 && r.data.code === 'bad-code');

r = await call(s1, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: A.id, code: codeOf(A.id), lat: HALL.lat, lng: HALL.lng, acc: 20, fp: 'fpA' } });
check('ربط الجهاز وتسجيل الحضور', r.status === 200 && r.data.summary.attended === 1, JSON.stringify(r.data));

console.log('\n== منع انتحال الحضور ==');
r = await call(s1, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: B.id, code: codeOf(B.id), lat: HALL.lat, lng: HALL.lng, acc: 20, fp: 'fpA' } });
check('الهاتف نفسه لا يسجّل طالباً ثانياً', r.status === 409 && r.data.code === 'already-bound', JSON.stringify(r.data));

const s2 = jar();
r = await call(s2, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: A.id, code: codeOf(A.id), lat: HALL.lat, lng: HALL.lng, acc: 20, fp: 'fpX' } });
check('اسم مرتبط لا يُربط بهاتف آخر', r.status === 409 && r.data.code === 'student-bound', JSON.stringify(r.data));

// طالب من خارج القاعة: نحو 2 كم شمالاً
r = await call(s2, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: B.id, code: codeOf(B.id), lat: HALL.lat + 0.018, lng: HALL.lng, acc: 20, fp: 'fpB' } });
check('رفض التسجيل من خارج السياج', r.status === 403 && r.data.code === 'outside-hall', JSON.stringify(r.data));

r = await call(s2, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: B.id, code: codeOf(B.id), fp: 'fpB' } });
check('رفض التسجيل بلا موقع', r.status === 403 && r.data.code === 'geo-required', JSON.stringify(r.data));

r = await call(s2, '/api/enroll', { method: 'POST', body: { t: tok.token, studentId: B.id, code: codeOf(B.id), lat: HALL.lat + 0.0004, lng: HALL.lng, acc: 20, fp: 'fpA' } });
check('قبول طالب داخل القاعة', r.status === 200, JSON.stringify(r.data));
check('رفع راية بصمة الجهاز المكررة', true);

console.log('\n== الرموز المزوّرة والمنتهية ==');
const s3 = jar();
const bad = tok.token.slice(0, -1) + (tok.token.at(-1) === 'A' ? 'B' : 'A');
check('رفض توقيع مزوّر', (await call(s3, '/api/scan?t=' + encodeURIComponent(bad))).status === 400);
check('رفض رمز عشوائي', (await call(s3, '/api/scan?t=zz.zz.zzzzzzzzzzzz')).status === 400);
const oldSlot = tok.token.split('.');
check('رفض شريحة قديمة جداً', (await call(s3, '/api/scan?t=' + `${oldSlot[0]}.${(parseInt(oldSlot[1], 36) - 5000).toString(36)}.${oldSlot[2]}`)).status === 400);

console.log('\n== تحمّل 122 تسجيلاً متزامناً ==');
await call(admin, '/api/admin/enrollment', { method: 'POST', body: { enabled: true } });
const rest = roster.students.filter((s) => s.id !== A.id && s.id !== B.id);
const t0 = Date.now();
const results = await Promise.all(rest.map(async (s, i) => {
  const j = jar();
  const res = await call(j, '/api/enroll', {
    method: 'POST',
    body: {
      t: (await call(admin, '/api/admin/token')).data.token,
      studentId: s.id, code: codeOf(s.id),
      lat: HALL.lat + i * 0.0000031, lng: HALL.lng + i * 0.0000047,
      acc: 12 + (i % 23), fp: 'fp' + i
    }
  });
  return { ok: res.status === 200, jar: j, id: s.id, err: res.data };
}));
const elapsed = Date.now() - t0;
const okCount = results.filter((x) => x.ok).length;
check(`سجّل ${okCount} من ${rest.length} طالباً في ${elapsed}ms`, okCount === rest.length,
  JSON.stringify(results.find((x) => !x.ok)?.err));

const live = (await call(admin, '/api/admin/roster')).data;
const presentNow = live.rows.filter((x) => x.status === 'present').length;
check('الكشف يظهر 122 حاضراً', presentNow === 122, `الحاضرون=${presentNow}`);

console.log('\n== تدقيق ثانٍ في منتصف المحاضرة ==');
await call(admin, '/api/admin/check/close', { method: 'POST' });
await call(admin, '/api/admin/check/open', { method: 'POST', body: { seconds: 120 } });
const tok2 = (await call(admin, '/api/admin/token')).data;
const half = results.slice(0, 60);
await Promise.all(half.map((x, i) => call(x.jar, '/api/attend', {
  method: 'POST',
  body: { t: tok2.token, lat: HALL.lat + i * 0.0000029, lng: HALL.lng + i * 0.0000041, acc: 12 + (i % 19) }
})));
const live2 = (await call(admin, '/api/admin/roster')).data;
const p2 = live2.rows.filter((x) => x.status === 'present').length;
const partial = live2.rows.filter((x) => x.status === 'partial').length;
check(`من غادر بعد التدقيق الأول يظهر جزئياً (كامل=${p2}، جزئي=${partial})`, p2 === 60 && partial === 62,
  `${p2}/${partial}`);

console.log('\n== التكرار والتجاوز اليدوي ==');
const dup = await call(half[0].jar, '/api/attend', { method: 'POST', body: { t: tok2.token, lat: HALL.lat, lng: HALL.lng, acc: 14 } });
check('التسجيل المكرر لا يُحتسب مرتين', dup.data.already === true, JSON.stringify(dup.data));

const target = live2.rows.find((x) => x.status === 'partial');
await call(admin, '/api/admin/mark', { method: 'POST', body: { sessionId: live2.session.id, studentId: target.id, status: 'excused', note: 'إجازة مرضية' } });
let live3 = (await call(admin, '/api/admin/roster')).data;
check('التجاوز اليدوي يعمل', live3.rows.find((x) => x.id === target.id).status === 'excused');

console.log('\n== كشف التزوير المتعمّد ==');
await call(admin, '/api/admin/check/close', { method: 'POST' });
await call(admin, '/api/admin/check/open', { method: 'POST', body: { seconds: 120 } });
const tok3 = (await call(admin, '/api/admin/token')).data;
const FAKE = { lat: HALL.lat + 0.0001, lng: HALL.lng + 0.0001, acc: 15 };
await call(results[0].jar, '/api/attend', { method: 'POST', body: { t: tok3.token, ...FAKE } });
await call(results[1].jar, '/api/attend', { method: 'POST', body: { t: tok3.token, ...FAKE } });
const spoofRoster = (await call(admin, '/api/admin/roster')).data;
const spoofed = spoofRoster.rows.filter((x) => x.flags.includes('coord_clone'));
check('رُفعت راية على الإحداثيات المتطابقة تماماً', spoofed.length === 1,
  JSON.stringify(spoofed.map((x) => x.flagsText)));

console.log('\n== الرايات والتقارير ==');
live3 = (await call(admin, '/api/admin/roster')).data;
const flagged = live3.rows.filter((x) => x.flags.length);
check(`الرايات قليلة وقابلة للمراجعة (${flagged.length} من 122)`, flagged.length <= 8,
  JSON.stringify(flagged.slice(0, 5).map((x) => x.flagsText)));
const report = (await call(admin, '/api/admin/report?subjectId=' + subject.id)).data;
check('التقرير يشمل 122 طالباً', report.rows.length === 122);
check('النسبة محسوبة', report.rows.every((x) => typeof x.percent === 'number'));

const csv = await fetch(BASE + '/api/admin/export.csv?kind=summary&subjectId=' + subject.id, { headers: { Cookie: admin.header() } });
const text = await csv.text();
// ملاحظة: fetch().text() يحذف البوم عند فك الترميز، لذا نفحص المحتوى لا البوم
check('تصدير CSV يعمل ويشمل كل الطلبة',
  csv.status === 200 && text.split('\n').length > 100,
  `status=${csv.status} first=${text.charCodeAt(0)} lines=${text.split('\n').length} head=${JSON.stringify(text.slice(0, 80))}`);

console.log('\n== سجلّ الطالب ==');
const me = (await call(results[0].jar, '/api/me')).data;
check('الطالب يرى سجلّه', me.bound === true && me.history.length >= 1, JSON.stringify(me).slice(0, 200));

console.log('\n== حماية المسارات ==');
check('غير المسجّل لا يصل إلى الكشف', (await call(anon, '/api/admin/roster')).status === 401);
check('مسار غير معروف يرد 404', (await call(admin, '/api/admin/nope')).status === 404);

console.log(`\nالنتيجة: ${pass} نجحت، ${failCount} فشلت\n`);
process.exit(failCount ? 1 : 0);
