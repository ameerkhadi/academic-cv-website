import { api, flushQueue, queueSize, el, show, escapeHtml } from './common.js';

const STATUS_CLASS = { present: 'present', partial: 'partial', absent: 'absent', excused: 'excused' };

async function load() {
  const pending = queueSize();
  if (pending) {
    const sent = await flushQueue().catch(() => 0);
    if (sent) show(el('msg'), `أُرسل ${sent} تسجيل حضور كان محفوظاً على جهازك.`, 'ok');
    else if (queueSize()) show(el('msg'), 'يوجد تسجيل حضور محفوظ على جهازك بانتظار عودة الإنترنت.', 'warn');
  }

  let data;
  try {
    data = await api('/api/me');
  } catch (err) {
    el('who').textContent = 'تعذّر الاتصال';
    return show(el('msg'), escapeHtml(err.message), 'bad');
  }

  if (!data.bound) {
    el('who').textContent = 'جهاز غير مرتبط بعد';
    show(el('msg'), 'هذا الجهاز غير مرتبط بأي طالب. امسح رمز القاعة أثناء نافذة الحضور لربطه باسمك.', 'info');
    return;
  }

  el('who').textContent = data.student.name + (data.student.studentNo ? ` — ${data.student.studentNo}` : '');

  const rows = data.history;
  el('historyCard').hidden = false;
  const present = rows.filter((r) => r.status === 'present').length;
  el('historyHint').textContent = rows.length
    ? `حضور كامل في ${present} من ${rows.length} محاضرة مسجّلة.`
    : 'لا توجد محاضرات مسجّلة بعد.';

  el('historyBody').innerHTML = rows
    .map((r) =>
      `<tr><td>${escapeHtml(r.subject)}</td><td class="mono">${escapeHtml(r.date)}</td>` +
      `<td><span class="pill ${STATUS_CLASS[r.status] || ''}">${escapeHtml(r.statusText)}</span></td>` +
      `<td class="mono">${r.attended} / ${r.checks}</td></tr>`
    )
    .join('');
}

load();
window.addEventListener('online', () => flushQueue().then((n) => n && load()));
