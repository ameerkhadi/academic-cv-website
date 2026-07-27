/**
 * طبقة الاتصال بواجهة Apps Script (تحل محل google.script.run)
 */

// قراءة (GET) — لأي عملية لا تعدّل بيانات
async function apiGet(action, params) {
  params = params || {};
  const url = new URL(SCRIPT_URL);
  url.searchParams.set('action', action);
  Object.keys(params).forEach(k => url.searchParams.set(k, params[k]));
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'حدث خطأ غير متوقع.');
  return json.data;
}

// كتابة (POST) — لأي عملية تعدّل بيانات
// ملاحظة: نستخدم text/plain عمداً لتفادي مشاكل CORS الخاصة بـ Apps Script
async function apiPost(action, params) {
  params = params || {};
  const body = Object.assign({ action }, params);
  const res = await fetch(SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'حدث خطأ غير متوقع.');
  return json.data;
}

function getTokenFromUrl() {
  return new URLSearchParams(window.location.search).get('token') || '';
}

/**
 * يتحقق من التوكن، ويتأكد أن دوره يطابق الدور المطلوب لهذه الصفحة.
 * يستدعى في بداية كل صفحة (admin/graduate/finance/dean).
 * عند الفشل، يعرض شاشة "وصول مرفوض" ويرمي خطأ لإيقاف باقي الكود.
 */
async function guardPage(requiredRole) {
  const token = getTokenFromUrl();
  let auth;
  try {
    auth = await apiGet('whoami', { token });
  } catch (err) {
    auth = { valid: false };
  }
  if (!auth.valid || auth.role !== requiredRole) {
    document.body.innerHTML = `
      <div style="font-family:Tahoma,Arial;text-align:center;padding:80px 20px;">
        <div style="font-size:48px;margin-bottom:16px;">🚫</div>
        <h1 style="color:#c0392b;font-size:22px;">الرابط غير صالح أو منتهي الصلاحية</h1>
        <p style="color:#666;font-size:15px;">تأكد من الرابط الذي بحوزتك، أو تواصل مع مسؤول النظام (الأدمن) للحصول على رابط جديد.</p>
      </div>`;
    throw new Error('access-denied');
  }
  return { token, ...auth };
}
