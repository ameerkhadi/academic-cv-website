/* أدوات مشتركة بين صفحات الطالب والتدريسي */

export async function api(path, options = {}) {
  const res = await fetch(path, {
    method: options.method || 'GET',
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'same-origin',
    cache: 'no-store'
  });
  let data = {};
  try { data = await res.json(); } catch { /* ردّ غير JSON */ }
  if (!res.ok || data.ok === false) {
    const err = new Error(data.error || 'تعذّر الاتصال بالخادم.');
    err.code = data.code || String(res.status);
    err.status = res.status;
    throw err;
  }
  return data;
}

/**
 * بصمة جهاز تقريبية. لا تُستخدم للمصادقة إطلاقاً، بل لرفع راية
 * عند استخدام هاتف واحد لتسجيل أكثر من طالب.
 */
export async function fingerprint() {
  const bits = [
    navigator.userAgent,
    navigator.language,
    navigator.languages?.join(','),
    screen.width + 'x' + screen.height + 'x' + (screen.colorDepth || ''),
    window.devicePixelRatio,
    new Date().getTimezoneOffset(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency || '',
    navigator.maxTouchPoints || ''
  ].join('|');

  if (window.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(bits));
    return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0;
  for (let i = 0; i < bits.length; i++) h = (h * 31 + bits.charCodeAt(i)) | 0;
  return 'f' + (h >>> 0).toString(16);
}

/** يطلب الموقع بدقة عالية. لا يرمي خطأ، بل يعيد سبب الفشل ليقرره الخادم. */
export function getPosition(timeout = 12000) {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ error: 'unsupported' });
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        acc: pos.coords.accuracy
      }),
      (err) => resolve({ error: err.code === 1 ? 'denied' : err.code === 3 ? 'timeout' : 'unavailable' }),
      { enableHighAccuracy: true, timeout, maximumAge: 0 }
    );
  });
}

export const GEO_MESSAGES = {
  denied: 'رفضتَ إذن الموقع. افتح إعدادات المتصفح واسمح بالوصول إلى الموقع، ثم أعد المحاولة.',
  timeout: 'تعذّر تحديد موقعك في الوقت المتاح. اقترب من نافذة أو أعد المحاولة.',
  unavailable: 'خدمة الموقع غير متاحة على هذا الجهاز الآن. فعّل GPS ثم أعد المحاولة.',
  unsupported: 'متصفحك لا يدعم خدمة الموقع. استخدم Chrome أو Safari.'
};

/* ---------- طابور الإرسال المؤجل ---------- */
/* الرمز لا يُلتقط إلا داخل القاعة، فتأجيل الإرسال عند ضعف الشبكة آمن. */

const QUEUE_KEY = 'att_queue_v1';

const readQueue = () => {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]'); } catch { return []; }
};
const writeQueue = (list) => {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(list.slice(-20))); } catch { /* وضع التصفح الخاص */ }
};

export function queueAttendance(payload) {
  const list = readQueue();
  if (!list.some((item) => item.t === payload.t)) list.push({ ...payload, queuedAt: Date.now() });
  writeQueue(list);
}

export function queueSize() {
  return readQueue().length;
}

/** يحاول إرسال ما تبقّى في الطابور. يعيد عدد ما نجح إرساله. */
export async function flushQueue() {
  const list = readQueue();
  if (!list.length) return 0;
  const remaining = [];
  let sent = 0;
  for (const item of list) {
    try {
      await api('/api/attend', { method: 'POST', body: item });
      sent++;
    } catch (err) {
      // الرموز المنتهية أو المكررة تُسقط، وأخطاء الشبكة تبقى للمحاولة لاحقاً
      if (err.status && err.status !== 429 && err.status < 500) continue;
      remaining.push(item);
    }
  }
  writeQueue(remaining);
  return sent;
}

export function el(id) { return document.getElementById(id); }

export function show(node, html, cls) {
  node.className = 'msg ' + (cls || 'info');
  node.innerHTML = html;
  node.hidden = false;
}

export function fmtTime(ms) {
  if (!ms) return '';
  return new Date(ms).toLocaleTimeString('ar-IQ', { hour: '2-digit', minute: '2-digit' });
}

export function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/* تسجيل عامل الخدمة: يجعل صفحة التسجيل تفتح حتى مع شبكة متذبذبة */
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
