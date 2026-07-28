/**
 * طباعة كشف المستحقات الشهري بشكل جاهز للتوقيع (مدير المالية + العميد)
 * يفتح نافذة جديدة بتنسيق طباعة، ويشغّل نافذة الطباعة تلقائياً
 * (المستخدم يقدر يختار "حفظ كـ PDF" من نافذة الطباعة نفسها بدل الطابعة الفعلية)
 */

// 👉 عدّل اسم المؤسسة هنا ليظهر برأس كل تقرير مطبوع
const INSTITUTION_NAME = "المعهد العالي للقيادة";

function fmtMoney_(n) {
  return Number(n || 0).toLocaleString('ar-IQ');
}

function openPrintableReport(report) {
  if (!report || !report.exists) {
    alert('لا يوجد تقرير محتسب لهذا الشهر بعد.');
    return;
  }

  const today = new Date().toLocaleDateString('ar-IQ');
  const rowsHtml = report.rows.map((r, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="text-align:right;">${r.instructorName}</td>
      <td>${r.hours}</td>
      <td>${fmtMoney_(r.hourlyTotal)}</td>
      <td>${r.supervisionCount || '—'}</td>
      <td>${r.scientificReviewCount || '—'}</td>
      <td>${r.languageReviewCount || '—'}</td>
      <td>${r.discussionMembershipCount || '—'}</td>
      <td><strong>${fmtMoney_(r.grandTotal)}</strong></td>
    </tr>
  `).join('');

  const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>كشف مستحقات - ${report.month}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Tahoma', Arial, sans-serif; direction: rtl; padding: 30px 40px; color: #1a1a1a; }
  .letterhead { text-align: center; border-bottom: 3px solid #2c3e6b; padding-bottom: 14px; margin-bottom: 22px; }
  .letterhead h1 { font-size: 20px; color: #2c3e6b; margin-bottom: 4px; }
  .letterhead h2 { font-size: 15px; color: #444; font-weight: normal; }
  .meta { display: flex; justify-content: space-between; margin-bottom: 18px; font-size: 13.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-bottom: 24px; }
  th, td { border: 1px solid #999; padding: 7px 6px; text-align: center; }
  th { background: #eef0f6; }
  tfoot td { font-weight: bold; background: #f5f6fa; }
  .signatures { display: flex; justify-content: space-between; margin-top: 60px; page-break-inside: avoid; }
  .sig-box { width: 45%; text-align: center; }
  .sig-line { border-top: 1px solid #333; margin-top: 50px; padding-top: 6px; font-size: 13px; }
  .sig-title { font-weight: bold; font-size: 14px; margin-bottom: 4px; }
  .status-note { font-size: 12px; color: #666; margin-top: 4px; }
  @media print {
    body { padding: 10px 20px; }
    .no-print { display: none; }
  }
  .print-btn {
    display: block; margin: 0 auto 20px; padding: 10px 22px; background: #3d5a99; color: #fff;
    border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-family: inherit;
  }
</style>
</head>
<body>

  <button class="print-btn no-print" onclick="window.print()">🖨️ طباعة / حفظ كـ PDF</button>

  <div class="letterhead">
    <h1>${INSTITUTION_NAME}</h1>
    <h2>كشف مستحقات الأساتذة — دراسات عليا</h2>
  </div>

  <div class="meta">
    <span><strong>الشهر:</strong> ${report.month}</span>
    <span><strong>حالة التقرير:</strong> ${report.statusLabel}</span>
    <span><strong>تاريخ الطباعة:</strong> ${today}</span>
  </div>

  <table>
    <thead>
      <tr>
        <th>ت</th>
        <th>اسم الأستاذ</th>
        <th>ساعات</th>
        <th>قيمة الساعات</th>
        <th>إشراف</th>
        <th>مراجعة علمية</th>
        <th>مراجعة لغوية</th>
        <th>عضوية مناقشة</th>
        <th>الإجمالي</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="8">الإجمالي الكلي</td>
        <td>${fmtMoney_(report.totalAll)}</td>
      </tr>
    </tfoot>
  </table>

  <div class="signatures">
    <div class="sig-box">
      <div class="sig-title">مدير المالية</div>
      <div class="sig-line">التوقيع والتاريخ</div>
    </div>
    <div class="sig-box">
      <div class="sig-title">العميد</div>
      <div class="sig-line">التوقيع والتاريخ</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>
  `;

  const win = window.open('', '_blank');
  win.document.open();
  win.document.write(html);
  win.document.close();
}
