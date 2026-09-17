import { api, el } from './common.js';

let lastToken = null;
let closesAt = 0;
let expiresAt = 0;
let slotSeconds = 30;

function drawQr(token) {
  const url = `${location.origin}/a?t=${encodeURIComponent(token)}`;
  // مستوى تصحيح الأخطاء M مناسب لرمز يُقرأ من مسافة، والحجم يتحدد بالـ CSS
  const qr = window.qrcode(0, 'M');
  qr.addData(url);
  qr.make();
  el('qr').innerHTML = qr.createSvgTag({ cellSize: 8, margin: 0, scalable: true });
}

async function refresh() {
  let data;
  try {
    data = await api('/api/admin/token');
  } catch (err) {
    if (err.status === 401) { location.href = '/admin?next=display'; return; }
    return;
  }

  if (!data.active) {
    el('live').hidden = true;
    el('idle').hidden = false;
    el('count').textContent = '—';
    el('subject').textContent = data.subject || 'شاشة الحضور';
    el('idleTitle').textContent =
      data.reason === 'no-session' ? 'لم تُفتح محاضرة بعد' : 'نافذة الحضور مغلقة';
    el('idleText').textContent =
      data.reason === 'no-session'
        ? 'اختر المادة من لوحة التدريسي واضغط "افتح المحاضرة".'
        : 'اضغط "افتح نافذة الحضور" في لوحة التدريسي ليظهر الرمز هنا.';
    lastToken = null;
    return;
  }

  el('idle').hidden = true;
  el('live').hidden = false;
  el('subject').textContent = data.subject;
  el('hall').textContent = `التدقيق رقم ${data.seq}`;
  el('count').textContent = `${data.marked} / ${data.total}`;
  el('slotSec').textContent = data.slotSeconds;
  slotSeconds = data.slotSeconds;
  closesAt = data.closesAt;
  expiresAt = data.expiresAt;

  if (data.token !== lastToken) {
    lastToken = data.token;
    drawQr(data.token);
  }
}

function tick() {
  if (!lastToken) {
    el('remain').textContent = '—';
    el('bar').style.width = '0';
    return;
  }
  const left = Math.max(0, closesAt - Date.now());
  const mm = Math.floor(left / 60000);
  const ss = Math.floor((left % 60000) / 1000);
  el('remain').textContent = `${mm}:${String(ss).padStart(2, '0')}`;
  const slotLeft = Math.max(0, expiresAt - Date.now());
  el('bar').style.width = `${(slotLeft / (slotSeconds * 1000)) * 100}%`;
}

refresh();
setInterval(refresh, 2000);
setInterval(tick, 250);
