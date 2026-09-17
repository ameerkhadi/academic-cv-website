import { hmac, b64url, timingEqual } from './util.js';

/**
 * رمز QR المتحرك.
 *
 * الشكل: <checkId>.<slot>.<signature>  بترميز base36 لتبقى الرقعة صغيرة وسريعة المسح.
 * الرمز موقّع بـ HMAC-SHA256 ولا يُخزَّن في قاعدة البيانات، فهو مشتق من
 * (معرّف التدقيق + رقم الشريحة الزمنية) ولا يمكن تزويره من دون السر.
 *
 * تتغيّر الشريحة كل slotSeconds ثانية (30 افتراضياً)، فلا تنفع صورة الرمز
 * المرسلة إلى خارج القاعة إلا لثوانٍ معدودة.
 */

const SIG_LEN = 12; // 12 حرفاً من base64url ≈ 72 بت

export function slotOf(atMs, slotSeconds) {
  return Math.floor(atMs / (slotSeconds * 1000));
}

function signature(secret, checkId, slot) {
  return b64url(hmac(secret, `${checkId}.${slot}`)).slice(0, SIG_LEN);
}

export function makeToken(secret, checkId, slot) {
  return `${checkId.toString(36)}.${slot.toString(36)}.${signature(secret, checkId, slot)}`;
}

export function currentToken(secret, checkId, slotSeconds, atMs = Date.now()) {
  const slot = slotOf(atMs, slotSeconds);
  const slotMs = slotSeconds * 1000;
  return {
    token: makeToken(secret, checkId, slot),
    slot,
    expiresAt: (slot + 1) * slotMs,
    slotSeconds
  };
}

/**
 * يفكّ الرمز ويتحقق من توقيعه فقط. صلاحية الوقت تُفحص في طبقة أعلى
 * لأنها تعتمد على نافذة التدقيق وسياسة الإرسال المتأخر.
 */
export function parseToken(secret, raw, slotSeconds) {
  if (typeof raw !== 'string') return null;
  const parts = raw.trim().split('.');
  if (parts.length !== 3) return null;

  const checkId = parseInt(parts[0], 36);
  const slot = parseInt(parts[1], 36);
  if (!Number.isInteger(checkId) || checkId <= 0) return null;
  if (!Number.isInteger(slot) || slot <= 0) return null;
  if (!timingEqual(parts[2], signature(secret, checkId, slot))) return null;

  const slotMs = slotSeconds * 1000;
  return {
    checkId,
    slot,
    slotStart: slot * slotMs,
    slotEnd: (slot + 1) * slotMs
  };
}
