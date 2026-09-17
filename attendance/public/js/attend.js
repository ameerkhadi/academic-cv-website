import {
  api, fingerprint, getPosition, GEO_MESSAGES, queueAttendance, flushQueue,
  el, show, escapeHtml
} from './common.js';

const token = new URLSearchParams(location.search).get('t') || '';
const nodes = {
  msg: el('msg'), working: el('working'), workingTitle: el('workingTitle'), workingText: el('workingText'),
  result: el('result'), resIcon: el('resIcon'), resTitle: el('resTitle'), resText: el('resText'),
  resSummary: el('resSummary'), retry: el('retry'), enroll: el('enroll'), rebindBox: el('rebindBox'),
  subLine: el('subLine')
};

let fp = '';
let roster = [];
let chosen = null;
let requireGeo = true;

const busy = (title, text) => {
  nodes.working.hidden = false;
  nodes.workingTitle.textContent = title;
  nodes.workingText.textContent = text || '';
};

function finish(icon, title, text, cls, summary) {
  nodes.working.hidden = true;
  nodes.retry.hidden = true;
  nodes.enroll.hidden = true;
  nodes.result.hidden = false;
  nodes.resIcon.textContent = icon;
  nodes.resTitle.textContent = title;
  nodes.resText.textContent = text || '';
  nodes.resSummary.textContent = summary || '';
  nodes.result.style.borderColor =
    cls === 'ok' ? 'var(--ok)' : cls === 'bad' ? 'var(--bad)' : 'var(--border)';
}

function problem(message, { allowRetry = true, showRebind = false } = {}) {
  nodes.working.hidden = true;
  show(nodes.msg, escapeHtml(message), 'bad');
  nodes.retry.hidden = !allowRetry;
  nodes.rebindBox.hidden = !showRebind;
}

/** يجمع الموقع ويحوّل رفضه إلى رسالة عربية واضحة. */
async function collectGeo() {
  busy('جارٍ تحديد موقعك…', 'اسمح بالوصول إلى الموقع إن طُلب منك ذلك.');
  const pos = await getPosition();
  if (pos.error) {
    if (requireGeo) return { error: GEO_MESSAGES[pos.error] };
    return { lat: null, lng: null, acc: null };
  }
  return pos;
}

async function markAttendance() {
  const geo = await collectGeo();
  if (geo.error) return problem(geo.error);

  const payload = { t: token, fp, lat: geo.lat, lng: geo.lng, acc: geo.acc };
  busy('جارٍ تسجيل حضورك…');
  try {
    const data = await api('/api/attend', { method: 'POST', body: payload });
    const summary = data.summary
      ? `التدقيقات المحضورة في هذه المحاضرة: ${data.summary.attended} من ${data.summary.totalChecks} (${data.summary.statusText})`
      : '';
    if (data.already) {
      finish('✅', 'حضورك مسجّل مسبقاً', `${data.student.name} — ${data.subject}`, 'ok', summary);
    } else {
      finish('✅', 'تم تسجيل حضورك', `${data.student.name} — ${data.subject}`, 'ok', summary);
    }
  } catch (err) {
    if (err.code === 'needs-enroll') return startEnrollment();
    if (!err.status) {
      // انقطاع الشبكة: نحفظ الإثبات ونرسله لاحقاً
      queueAttendance(payload);
      finish('📶', 'حُفظ حضورك على الجهاز', 'الشبكة ضعيفة الآن. سيُرسل تلقائياً عند عودة الاتصال.', 'warn',
        'افتح هذه الصفحة مرة أخرى بعد عودة الإنترنت للتأكيد.');
      return;
    }
    problem(err.message, { allowRetry: err.code !== 'outside-hall' });
  }
}

/* ---------- التسجيل الأولي ---------- */

function renderNames(filter = '') {
  const term = filter.trim();
  const list = term ? roster.filter((s) => s.name.includes(term)) : roster;
  el('names').innerHTML = list
    .slice(0, 200)
    .map((s) =>
      `<button type="button" data-id="${s.id}" ${s.bound ? 'disabled' : ''}>` +
      `${escapeHtml(s.name)}<span class="tag">${s.bound ? 'مرتبط بجهاز' : ''}</span></button>`
    )
    .join('') || '<div style="padding:14px" class="muted">لا يوجد اسم مطابق.</div>';
}

async function startEnrollment() {
  nodes.working.hidden = true;
  nodes.retry.hidden = true;
  try {
    const data = await api('/api/roster?t=' + encodeURIComponent(token));
    roster = data.students;
    if (!data.enrollmentOpen) {
      show(nodes.msg,
        'هذا الجهاز غير مرتبط باسمك، والتسجيل الأولي مغلق حالياً. اطلب من التدريسي فتحه أو اعتماد جهازك.',
        'warn');
      fillRebindNames();
      nodes.rebindBox.hidden = false;
      return;
    }
    el('codeField').hidden = !data.needsCode;
    nodes.enroll.hidden = false;
    renderNames();
  } catch (err) {
    problem(err.message);
  }
}

async function submitEnrollment() {
  if (!chosen) return;
  const code = el('code').value;
  const geo = await collectGeo();
  if (geo.error) return problem(geo.error);

  busy('جارٍ ربط جهازك…');
  try {
    const data = await api('/api/enroll', {
      method: 'POST',
      body: { t: token, studentId: chosen.id, code, fp, lat: geo.lat, lng: geo.lng, acc: geo.acc }
    });
    const summary = data.summary
      ? `التدقيقات المحضورة: ${data.summary.attended} من ${data.summary.totalChecks}`
      : '';
    finish('🎉', 'تم ربط جهازك وتسجيل حضورك', `${data.student.name} — ${data.subject}`, 'ok', summary);
  } catch (err) {
    nodes.working.hidden = true;
    nodes.enroll.hidden = false;
    show(nodes.msg, escapeHtml(err.message), 'bad');
  }
}

function fillRebindNames() {
  el('rbStudent').innerHTML =
    '<option value="">— اختر اسمك —</option>' +
    roster.map((s) => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
}

/* ---------- الإقلاع ---------- */

async function boot() {
  fp = await fingerprint();
  flushQueue().catch(() => {});

  if (!token) {
    nodes.subLine.textContent = 'لا يوجد رمز';
    return problem('افتح هذه الصفحة بمسح رمز QR المعروض في القاعة.', { allowRetry: false });
  }

  try {
    const info = await api('/api/scan?t=' + encodeURIComponent(token));
    requireGeo = info.requireGeo;
    nodes.subLine.textContent = `${info.subject} — ${info.date}`;
    if (info.late) show(nodes.msg, 'الرمز من نافذة سابقة. سيُسجّل حضورك مع إشارة "إرسال متأخر".', 'warn');
    if (info.bound) await markAttendance();
    else await startEnrollment();
  } catch (err) {
    nodes.subLine.textContent = 'رمز غير صالح';
    problem(err.message);
  }
}

el('retryBtn').addEventListener('click', () => {
  nodes.msg.hidden = true;
  nodes.retry.hidden = true;
  boot();
});

el('search').addEventListener('input', (e) => renderNames(e.target.value));

el('names').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-id]');
  if (!btn || btn.disabled) return;
  chosen = roster.find((s) => s.id === Number(btn.dataset.id));
  el('chosenName').textContent = chosen.name;
  el('confirm').hidden = false;
  el('confirm').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

el('enrollBtn').addEventListener('click', submitEnrollment);

el('rebindBtn').addEventListener('click', async () => {
  const studentId = Number(el('rbStudent').value);
  if (!studentId) return show(nodes.msg, 'اختر اسمك من القائمة أولاً.', 'bad');
  try {
    const data = await api('/api/rebind', {
      method: 'POST',
      body: { studentId, code: el('rbCode').value, reason: el('rbReason').value, fp }
    });
    show(nodes.msg, escapeHtml(data.message), 'ok');
  } catch (err) {
    show(nodes.msg, escapeHtml(err.message), 'bad');
  }
});

boot();
