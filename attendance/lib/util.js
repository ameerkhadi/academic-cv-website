import crypto from 'node:crypto';

export const now = () => Date.now();

/* ---------- HTTP helpers ---------- */

export function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
}

export const ok = (res, data = {}) => sendJson(res, 200, { ok: true, ...data });
export const fail = (res, status, code, message) =>
  sendJson(res, status, { ok: false, code, error: message });

export async function readBody(req, limit = 256 * 1024) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw new Error('body-too-large');
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  const text = Buffer.concat(chunks).toString('utf8');
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('bad-json');
  }
}

/* ---------- cookies ---------- */

export function parseCookies(req) {
  const out = {};
  const header = req.headers.cookie;
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function setCookie(res, name, value, opts = {}) {
  const bits = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (opts.maxAge !== undefined) bits.push(`Max-Age=${opts.maxAge}`);
  if (opts.secure !== false) bits.push('Secure');
  const prev = res.getHeader('Set-Cookie');
  const list = prev ? (Array.isArray(prev) ? prev.slice() : [prev]) : [];
  list.push(bits.join('; '));
  res.setHeader('Set-Cookie', list);
}

export function clearCookie(res, name) {
  setCookie(res, name, '', { maxAge: 0 });
}

/* ---------- crypto ---------- */

export const randomId = (bytes = 16) => crypto.randomBytes(bytes).toString('hex');

export function hmac(secret, data) {
  return crypto.createHmac('sha256', secret).update(data).digest();
}

export const b64url = (buf) => buf.toString('base64url');

export function timingEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

/** توقيع قيمة نصية لوضعها في كوكي (value.signature) */
export function signValue(secret, value) {
  return `${value}.${b64url(hmac(secret, value)).slice(0, 27)}`;
}

export function unsignValue(secret, signed) {
  if (typeof signed !== 'string') return null;
  const i = signed.lastIndexOf('.');
  if (i < 1) return null;
  const value = signed.slice(0, i);
  return timingEqual(signed.slice(i + 1), b64url(hmac(secret, value)).slice(0, 27)) ? value : null;
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(String(password), salt, 32).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password, stored) {
  if (!stored) return false;
  const [scheme, salt, derived] = String(stored).split('$');
  if (scheme !== 'scrypt' || !salt || !derived) return false;
  return timingEqual(crypto.scryptSync(String(password), salt, 32).toString('hex'), derived);
}

/* ---------- geo ---------- */

/** المسافة بالأمتار بين نقطتين (صيغة هافرساين) */
export function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

export const round5 = (n) => (typeof n === 'number' && isFinite(n) ? Math.round(n * 1e5) / 1e5 : null);

/* ---------- misc ---------- */

export function clientIp(req, trustProxy) {
  if (trustProxy) {
    const cf = req.headers['cf-connecting-ip'];
    if (cf) return String(cf).trim();
    const xff = req.headers['x-forwarded-for'];
    if (xff) return String(xff).split(',')[0].trim();
  }
  return (req.socket.remoteAddress || '').replace(/^::ffff:/, '');
}

/**
 * حدّ بسيط لمعدل الطلبات في الذاكرة (نافذة منزلقة).
 *
 * ملاحظة مهمة: طلبة القاعة كلهم قد يظهرون بعنوان IP واحد خلف شبكة القاعة،
 * لذلك يفصل هذا الحدّ بين "الفحص" و"التسجيل": المسارات الحساسة تعدّ
 * المحاولات الفاشلة فقط، فلا يُعاقب 122 طالباً بسبب مشاركتهم عنواناً واحداً.
 */
export function createRateLimiter({ windowMs, max }) {
  const hits = new Map();

  const prune = (key, t) => {
    const arr = (hits.get(key) || []).filter((ts) => t - ts < windowMs);
    if (arr.length) hits.set(key, arr);
    else hits.delete(key);
    return arr;
  };

  const sweep = (t) => {
    if (hits.size <= 5000) return;
    for (const [k, v] of hits) if (!v.length || t - v[v.length - 1] > windowMs) hits.delete(k);
  };

  /** هل ما يزال المفتاح ضمن الحدّ؟ من دون تسجيل محاولة. */
  const check = (key) => prune(key, now()).length < max;

  /** يسجّل محاولة واحدة. */
  const hit = (key) => {
    const t = now();
    const arr = prune(key, t);
    arr.push(t);
    hits.set(key, arr);
    sweep(t);
  };

  /** يسجّل ويفحص معاً، للمسارات التي تعدّ كل الطلبات. */
  const allow = (key) => { hit(key); return prune(key, now()).length <= max; };

  allow.check = check;
  allow.hit = hit;
  return allow;
}

/** التاريخ المحلي بصيغة YYYY-MM-DD حسب منطقة زمنية IANA */
export function localDate(tz, at = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(at);
}

/** الدقائق منذ منتصف الليل ورقم اليوم (0=الأحد) في المنطقة الزمنية المحددة */
export function localClock(tz, at = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false
  }).formatToParts(at);
  const get = (t) => parts.find((p) => p.type === t)?.value;
  const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    dayOfWeek: days[get('weekday')] ?? 0
  };
}

export const hhmm = (mins) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;

export function parseHhmm(text) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(text || '').trim());
  if (!m) return null;
  const mins = Number(m[1]) * 60 + Number(m[2]);
  return mins >= 0 && mins < 1440 ? mins : null;
}
