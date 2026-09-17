/**
 * كشف الحالات المشبوهة.
 *
 * الفلسفة: لا نمنع الطالب إلا عند خرق واضح (خارج السياج الجغرافي، أو جهاز
 * مربوط بطالب آخر). ما عدا ذلك نُسجّل الحضور ونرفع راية للتدريسي يراجعها
 * بعينه، فقائمة من خمسة أسماء أسهل من الشك في 122 طالباً.
 */

export const FLAG_LABELS = {
  geo_missing: 'بلا موقع جغرافي',
  geo_weak: 'دقة الموقع ضعيفة',
  geo_edge: 'قُبل بهامش خطأ القياس فقط',
  dup_fp: 'بصمة جهاز مكررة',
  coord_clone: 'إحداثيات مطابقة لطالب آخر',
  late_submit: 'إرسال متأخر بعد إغلاق النافذة'
};

export function computeFlags(db, ctx) {
  const flags = [];
  const { studentId, fp, lat, lng, acc, dist, checkId, requireGeo, radius, maxAccuracy, late } = ctx;

  if (lat === null || lng === null) {
    if (!requireGeo) flags.push('geo_missing');
  } else {
    if (acc !== null && acc > maxAccuracy) flags.push('geo_weak');
    // قُبل رغم تجاوزه نصف القطر، لأن هامش خطأ الهاتف غطّى الفارق
    if (dist !== null && dist > radius) flags.push('geo_edge');
  }

  if (late) flags.push('late_submit');

  if (fp) {
    const clash = db
      .prepare('SELECT COUNT(*) AS n FROM devices WHERE fp = ? AND revoked = 0 AND student_id <> ?')
      .get(fp, studentId);
    if (clash && clash.n > 0) flags.push('dup_fp');
  }

  // قراءتان متطابقتان تماماً في الموقع وهامش الخطأ معاً مؤشر تزوير،
  // بينما تطابق الإحداثيات وحدها وارد في قاعة مزدحمة.
  if (lat !== null && lng !== null && acc !== null) {
    const twin = db
      .prepare(
        'SELECT COUNT(*) AS n FROM marks ' +
        'WHERE check_id = ? AND student_id <> ? AND lat = ? AND lng = ? AND acc = ?'
      )
      .get(checkId, studentId, lat, lng, acc);
    if (twin && twin.n > 0) flags.push('coord_clone');
  }

  // ما لا يُرفع عمداً:
  // - عنوان الشبكة: طلبة القاعة كلهم خلف عنوان واحد إن استخدموا شبكتها.
  // - سرعة التسجيل: مسح 122 طالباً للرمز فور فتح النافذة هو السلوك الطبيعي.
  // - حداثة ربط الجهاز: التسجيل الأولي وتغيير الجهاز يمرّان بموافقة التدريسي أصلاً.
  // عنوان IP يبقى مخزّناً في سجل التسجيل للمراجعة اليدوية عند الحاجة.

  return flags;
}

export const describeFlags = (csv) =>
  String(csv || '')
    .split(',')
    .filter(Boolean)
    .map((f) => FLAG_LABELS[f] || f);
