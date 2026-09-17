import { api, getPosition, GEO_MESSAGES, el, show, escapeHtml, fmtTime } from './common.js';

const DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const STATUS_TEXT = { present: 'حاضر', partial: 'حاضر جزئياً', absent: 'غائب', excused: 'بعذر' };

let state = null;
let roster = { rows: [], session: null };
let students = [];
let subjects = [];
let pollTimer = null;
let settingsFilled = false;

const msg = (text, cls = 'info') => show(el('msg'), escapeHtml(text), cls);

/* ---------- الدخول ---------- */

async function boot() {
  try {
    await refreshState();
    el('appView').hidden = false;
    startPolling();
    loadStudents();
    loadSubjects();
  } catch (err) {
    if (err.status === 401) el('loginView').hidden = false;
    else { el('loginView').hidden = false; show(el('loginMsg'), escapeHtml(err.message), 'bad'); }
  }
}

el('loginBtn').addEventListener('click', async () => {
  try {
    await api('/api/admin/login', { method: 'POST', body: { password: el('password').value } });
    const next = new URLSearchParams(location.search).get('next');
    if (next === 'display') return (location.href = '/display');
    el('loginView').hidden = true;
    boot();
  } catch (err) {
    show(el('loginMsg'), escapeHtml(err.message), 'bad');
  }
});
el('password').addEventListener('keydown', (e) => { if (e.key === 'Enter') el('loginBtn').click(); });

el('logoutBtn').addEventListener('click', async () => {
  await api('/api/admin/logout', { method: 'POST' }).catch(() => {});
  location.reload();
});

/* ---------- التبويبات ---------- */

document.querySelectorAll('.tabs button').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    el('tab-' + btn.dataset.tab).classList.add('active');
    if (btn.dataset.tab === 'reports') loadReport();
    if (btn.dataset.tab === 'students') loadStudents();
  });
});

/* ---------- الحالة الحيّة ---------- */

function startPolling() {
  clearInterval(pollTimer);
  pollTimer = setInterval(() => {
    refreshState().catch(() => {});
    if (state?.session) loadRoster();
  }, 4000);
}

async function refreshState() {
  state = await api('/api/admin/state');
  const s = state.settings;

  el('termLine').textContent = `${s.term_name} — ${s.hall_name}`;
  el('stTotal').textContent = state.totals.students;
  el('stChecks').textContent = state.live ? state.live.checksCount : '—';
  el('stPresent').textContent = state.live ? state.live.markedInCheck : '—';
  el('enrollToggle').checked = s.enrollment_open === '1';

  el('subjectButtons').innerHTML = state.today.subjects.length
    ? state.today.subjects
        .map((sub) =>
          `<button class="btn ${sub.nowInside ? 'gold' : 'ghost'} sm" data-subject="${sub.id}">` +
          `${escapeHtml(sub.name)}${sub.time ? ` <span class="muted">(${sub.time})</span>` : ''}</button>`
        )
        .join('')
    : `<span class="muted">لا توجد مواد مجدولة اليوم (${DAYS[new Date().getDay()]}). اختر من تبويب المواد أو أضف الجدول.</span>`;

  const hasSession = !!state.session;
  const hasCheck = !!state.check;
  el('sessionTitle').textContent = hasSession
    ? `${state.session.subject} — ${state.session.date}`
    : 'لم تُفتح محاضرة';
  el('openCheckBtn').disabled = !hasSession || hasCheck;
  el('closeCheckBtn').disabled = !hasCheck;
  el('extendBtn').disabled = !hasCheck;
  el('closeSessionBtn').disabled = !hasSession;

  if (hasCheck) {
    const left = Math.max(0, Math.round((state.check.closesAt - Date.now()) / 1000));
    show(el('checkState'),
      `نافذة الحضور رقم ${state.check.seq} مفتوحة. تُغلق بعد ${left} ثانية. ` +
      `اعرض الرمز على شاشة القاعة من رابط "شاشة العرض".`, 'ok');
  } else if (hasSession) {
    show(el('checkState'), 'المحاضرة مفتوحة والنافذة مغلقة. افتح النافذة في الوقت الذي تختاره.', 'info');
  } else {
    el('checkState').hidden = true;
  }

  if (state.totals.pendingRebinds) loadRebinds();
  else el('rebindCard').hidden = true;

  if (!settingsFilled) { fillSettings(s); settingsFilled = true; }
}

el('subjectButtons').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-subject]');
  if (!btn) return;
  try {
    await api('/api/admin/session/open', { method: 'POST', body: { subjectId: Number(btn.dataset.subject) } });
    await refreshState();
    await loadRoster();
    msg('فُتحت المحاضرة. افتح نافذة الحضور عندما تريد.', 'ok');
  } catch (err) { msg(err.message, 'bad'); }
});

const action = (id, path, bodyFn) =>
  el(id).addEventListener('click', async () => {
    try {
      await api(path, { method: 'POST', body: bodyFn ? bodyFn() : {} });
      await refreshState();
      await loadRoster();
    } catch (err) { msg(err.message, 'bad'); }
  });

action('openCheckBtn', '/api/admin/check/open');
action('closeCheckBtn', '/api/admin/check/close');
action('extendBtn', '/api/admin/check/extend', () => ({ seconds: 60 }));

el('closeSessionBtn').addEventListener('click', async () => {
  if (!confirm('إنهاء المحاضرة وإغلاق كل النوافذ؟')) return;
  await api('/api/admin/session/close', { method: 'POST' }).catch((e) => msg(e.message, 'bad'));
  await refreshState();
});

el('enrollToggle').addEventListener('change', async (e) => {
  try {
    await api('/api/admin/enrollment', { method: 'POST', body: { enabled: e.target.checked } });
    msg(e.target.checked
      ? 'التسجيل الأولي مفتوح. اطلب من الطلبة مسح الرمز الآن لربط أجهزتهم.'
      : 'أُغلق التسجيل الأولي.', 'ok');
  } catch (err) { msg(err.message, 'bad'); }
});

/* ---------- كشف الحضور ---------- */

async function loadRoster() {
  if (!state?.session) return;
  try {
    roster = await api('/api/admin/roster?sessionId=' + state.session.id);
    renderRoster();
  } catch { /* الجلسة أُغلقت */ }
}

function renderRoster() {
  const term = el('rosterSearch').value.trim();
  const filter = el('rosterFilter').value;
  let rows = roster.rows;
  if (term) rows = rows.filter((r) => r.name.includes(term));
  if (filter === 'absent') rows = rows.filter((r) => r.status === 'absent');
  if (filter === 'present') rows = rows.filter((r) => r.status === 'present');
  if (filter === 'flagged') rows = rows.filter((r) => r.flags.length);

  el('stFlags').textContent = roster.rows.filter((r) => r.flags.length).length;

  el('rosterBody').innerHTML = rows.length
    ? rows
        .map((r, i) =>
          `<tr><td class="mono">${i + 1}</td>` +
          `<td>${escapeHtml(r.name)}${r.bound ? '' : ' <span class="pill flag">بلا جهاز</span>'}</td>` +
          `<td><span class="pill ${r.status}">${STATUS_TEXT[r.status]}</span>${r.overridden ? ' <span class="muted">يدوي</span>' : ''}</td>` +
          `<td class="mono">${r.attended} / ${r.totalChecks}${r.firstAt ? `<div class="muted">${fmtTime(r.firstAt)}</div>` : ''}</td>` +
          `<td>${r.flagsText.map((f) => `<span class="pill flag">${escapeHtml(f)}</span>`).join('')}</td>` +
          `<td><select data-student="${r.id}" class="markSel" style="min-height:32px;padding:4px 6px;font-size:13px">` +
          ['clear', 'present', 'absent', 'excused']
            .map((v) => `<option value="${v}" ${r.overridden && r.status === v ? 'selected' : ''}>` +
              `${v === 'clear' ? 'تلقائي' : STATUS_TEXT[v]}</option>`).join('') +
          `</select></td></tr>`
        )
        .join('')
    : '<tr><td colspan="6" class="muted">لا توجد نتائج.</td></tr>';
}

el('rosterSearch').addEventListener('input', renderRoster);
el('rosterFilter').addEventListener('change', renderRoster);

el('rosterBody').addEventListener('change', async (e) => {
  const sel = e.target.closest('.markSel');
  if (!sel || !roster.session) return;
  try {
    await api('/api/admin/mark', {
      method: 'POST',
      body: { sessionId: roster.session.id, studentId: Number(sel.dataset.student), status: sel.value, note: 'تعديل يدوي' }
    });
    await loadRoster();
  } catch (err) { msg(err.message, 'bad'); }
});

el('exportSessionBtn').addEventListener('click', () => {
  if (!roster.session) return msg('لا توجد محاضرة مفتوحة.', 'warn');
  location.href = `/api/admin/export.csv?kind=session&sessionId=${roster.session.id}`;
});

/* ---------- الطلبة ---------- */

async function loadStudents() {
  try {
    const data = await api('/api/admin/students');
    students = data.students;
    renderStudents();
  } catch (err) { msg(err.message, 'bad'); }
}

function renderStudents() {
  const term = el('studentSearch').value.trim();
  const rows = term ? students.filter((s) => s.name.includes(term) || s.studentNo.includes(term)) : students;
  el('studentsBody').innerHTML = rows
    .map((s, i) =>
      `<tr><td class="mono">${i + 1}</td><td>${escapeHtml(s.name)}</td><td class="mono">${escapeHtml(s.studentNo)}</td>` +
      `<td>${s.bound
        ? `<span class="pill present">مرتبط</span> <span class="muted">${fmtTime(s.boundAt)}</span>`
        : '<span class="pill absent">غير مرتبط</span>'}</td>` +
      `<td>${s.bound ? `<button class="btn sm ghost" data-revoke="${s.id}">فكّ الارتباط</button>` : ''}</td></tr>`
    )
    .join('') || '<tr><td colspan="5" class="muted">لا يوجد طلبة. استورد الأسماء أولاً.</td></tr>';
}

el('studentSearch').addEventListener('input', renderStudents);

el('studentsBody').addEventListener('click', async (e) => {
  const btn = e.target.closest('button[data-revoke]');
  if (!btn) return;
  if (!confirm('فكّ ارتباط جهاز هذا الطالب؟ سيحتاج إلى ربط جهاز جديد عند فتح التسجيل.')) return;
  try {
    await api('/api/admin/device/revoke', { method: 'POST', body: { studentId: Number(btn.dataset.revoke) } });
    loadStudents();
  } catch (err) { msg(err.message, 'bad'); }
});

el('importBtn').addEventListener('click', async () => {
  const csv = el('csv').value.trim();
  if (!csv) return msg('الصق الأسماء أولاً.', 'warn');
  try {
    const data = await api('/api/admin/students/import', { method: 'POST', body: { csv } });
    msg(`أُضيف ${data.added} طالباً، وحُدّث ${data.updated}، وتُخطّي ${data.skipped}.`, 'ok');
    el('csv').value = '';
    loadStudents();
    refreshState();
  } catch (err) { msg(err.message, 'bad'); }
});

async function loadRebinds() {
  const data = await api('/api/admin/rebinds').catch(() => null);
  if (!data || !data.requests.length) { el('rebindCard').hidden = true; return; }
  el('rebindCard').hidden = false;
  el('rebindList').innerHTML = data.requests
    .map((r) =>
      `<div class="msg warn"><strong>${escapeHtml(r.name)}</strong> — ${escapeHtml(r.reason || 'بلا سبب')}` +
      `<div class="muted">${fmtTime(r.created_at)} — ${escapeHtml(String(r.ip || ''))}</div>` +
      `<div class="row" style="margin-top:8px">` +
      `<button class="btn sm" data-approve="${r.id}">موافقة</button>` +
      `<button class="btn sm ghost" data-reject="${r.id}">رفض</button></div></div>`
    )
    .join('');
}

el('rebindList').addEventListener('click', async (e) => {
  const approve = e.target.closest('button[data-approve]');
  const reject = e.target.closest('button[data-reject]');
  if (!approve && !reject) return;
  const id = Number((approve || reject).dataset.approve || (approve || reject).dataset.reject);
  try {
    await api('/api/admin/rebind/decide', { method: 'POST', body: { id, approve: !!approve } });
    loadRebinds();
    loadStudents();
  } catch (err) { msg(err.message, 'bad'); }
});

/* ---------- المواد ---------- */

async function loadSubjects() {
  const data = await api('/api/admin/subjects').catch(() => null);
  if (!data) return;
  subjects = data.subjects;
  renderSubjects();
  el('reportSubject').innerHTML =
    '<option value="">كل المواد</option>' +
    subjects.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
}

function subjectRow(s = {}) {
  const days = DAYS.map((d, i) =>
    `<option value="${i}" ${Number(s.dayOfWeek) === i ? 'selected' : ''}>${d}</option>`).join('');
  return `<tr data-id="${s.id || ''}">
    <td><input class="s-name" value="${escapeHtml(s.name || '')}" placeholder="اسم المادة"></td>
    <td><input class="s-code" value="${escapeHtml(s.code || '')}" placeholder="اختياري" style="max-width:110px"></td>
    <td><select class="s-day"><option value="">—</option>${days}</select></td>
    <td><input class="s-start" value="${escapeHtml(s.start || '')}" placeholder="09:00" style="max-width:100px"></td>
    <td><input class="s-end" value="${escapeHtml(s.end || '')}" placeholder="10:30" style="max-width:100px"></td>
    <td class="center"><input type="checkbox" class="s-active" ${s.active === false ? '' : 'checked'} style="width:auto;min-height:auto"></td>
  </tr>`;
}

function renderSubjects() {
  el('subjectsBody').innerHTML = subjects.map(subjectRow).join('') || subjectRow();
}

el('addSubjectBtn').addEventListener('click', () => {
  el('subjectsBody').insertAdjacentHTML('beforeend', subjectRow());
});

el('saveSubjectsBtn').addEventListener('click', async () => {
  const list = [...el('subjectsBody').querySelectorAll('tr')].map((tr) => ({
    id: tr.dataset.id || null,
    name: tr.querySelector('.s-name').value,
    code: tr.querySelector('.s-code').value,
    dayOfWeek: tr.querySelector('.s-day').value,
    start: tr.querySelector('.s-start').value,
    end: tr.querySelector('.s-end').value,
    active: tr.querySelector('.s-active').checked
  }));
  try {
    await api('/api/admin/subjects', { method: 'POST', body: { subjects: list } });
    msg('حُفظ الجدول.', 'ok');
    loadSubjects();
    refreshState();
  } catch (err) { msg(err.message, 'bad'); }
});

/* ---------- التقارير ---------- */

async function loadReport() {
  const subjectId = el('reportSubject').value;
  const [report, sessions] = await Promise.all([
    api('/api/admin/report' + (subjectId ? '?subjectId=' + subjectId : '')),
    api('/api/admin/sessions')
  ]).catch(() => [null, null]);
  if (!report) return;

  el('reportHint').textContent = `عدد المحاضرات المحتسبة: ${report.sessionCount}. الحضور الجزئي يُحتسب بنصف درجة.`;
  el('reportBody').innerHTML = report.rows
    .map((r, i) =>
      `<tr><td class="mono">${i + 1}</td><td>${escapeHtml(r.name)}</td>` +
      `<td class="mono">${r.present}</td><td class="mono">${r.partial}</td>` +
      `<td class="mono">${r.absent}</td><td class="mono">${r.excused}</td>` +
      `<td class="mono"><strong>${r.percent}%</strong></td></tr>`
    )
    .join('') || '<tr><td colspan="7" class="muted">لا توجد بيانات.</td></tr>';

  el('sessionsBody').innerHTML = sessions.sessions
    .map((s) =>
      `<tr><td class="mono">${escapeHtml(s.date)}</td><td>${escapeHtml(s.subject)}</td>` +
      `<td class="mono">${s.checks}</td><td class="mono">${s.attendees}</td>` +
      `<td><a class="btn sm ghost" href="/api/admin/export.csv?kind=session&sessionId=${s.id}">CSV</a></td></tr>`
    )
    .join('') || '<tr><td colspan="5" class="muted">لا توجد محاضرات.</td></tr>';
}

el('reportSubject').addEventListener('change', loadReport);
el('exportSummaryBtn').addEventListener('click', () => {
  const subjectId = el('reportSubject').value;
  location.href = '/api/admin/export.csv?kind=summary' + (subjectId ? '&subjectId=' + subjectId : '');
});

/* ---------- الإعدادات ---------- */

const SETTING_FIELDS = [
  'hall_lat', 'hall_lng', 'radius_m', 'max_accuracy_m', 'check_seconds',
  'slot_seconds', 'late_minutes', 'term_name', 'hall_name', 'timezone'
];

function fillSettings(s) {
  SETTING_FIELDS.forEach((k) => { if (el(k)) el(k).value = s[k] ?? ''; });
  el('require_geo').checked = s.require_geo === '1';
  el('present_rule').value = s.present_rule || 'all';
}

el('saveSettingsBtn').addEventListener('click', async () => {
  const body = {};
  SETTING_FIELDS.forEach((k) => { body[k] = el(k).value.trim(); });
  body.require_geo = el('require_geo').checked ? '1' : '0';
  body.present_rule = el('present_rule').value;
  if (el('newPassword').value) body.newPassword = el('newPassword').value;
  try {
    const data = await api('/api/admin/settings', { method: 'POST', body });
    el('newPassword').value = '';
    fillSettings(data.settings);
    msg('حُفظت الإعدادات.', 'ok');
    refreshState();
  } catch (err) { msg(err.message, 'bad'); }
});

el('useLocationBtn').addEventListener('click', async () => {
  msg('جارٍ قراءة موقعك…', 'info');
  const pos = await getPosition();
  if (pos.error) return msg(GEO_MESSAGES[pos.error], 'bad');
  el('hall_lat').value = pos.lat.toFixed(6);
  el('hall_lng').value = pos.lng.toFixed(6);
  msg(`أُخذ الموقع بدقة ±${Math.round(pos.acc)} متر. اضغط "حفظ الإعدادات" لتثبيته.`, 'ok');
});

el('purgeGeoBtn').addEventListener('click', async () => {
  if (!confirm('حذف كل الإحداثيات المخزّنة نهائياً؟')) return;
  try {
    const data = await api('/api/admin/purge-geo', { method: 'POST' });
    msg(`حُذفت إحداثيات ${data.cleared} تسجيلاً.`, 'ok');
  } catch (err) { msg(err.message, 'bad'); }
});

/* ---------- بدء ---------- */

boot();
