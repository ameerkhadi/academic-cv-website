/* Course assistant — floating, draggable chat for Dr. Ameer's course notebooks (4 Nov 2026).
   Usage: <script src="../assets/course-assistant.js" data-course="ai" data-name="هادي" data-icon="🧭" defer></script>
   Answers come from the notebook text only (server: ameer.itbabylon.org/sensors-api/course/*). No names or accounts. */
(function () {
  var me = document.currentScript, C = me.dataset.course, NAME = me.dataset.name || 'Assistant', ICON = me.dataset.icon || '🤖';
  var API = 'https://ameer.itbabylon.org/sensors-api/course/';
  var LS = 'ca:' + C + ':';
  function g(k) { try { return localStorage.getItem(LS + k); } catch (e) { return null; } }
  function s(k, v) { try { localStorage.setItem(LS + k, v); } catch (e) {} }
  var did = g('did'); if (!did) { did = (Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 20); s('did', did); }
  function L() { var l = document.documentElement.dataset.lang || document.documentElement.lang || 'ar'; return l === 'en' ? 'en' : (l === 'ku' ? 'ku' : 'ar'); }
  var T = {
    ar: { hi: 'أهلًا، أنا «' + NAME + '». أجيبك من دفتر المادة نفسه، وأقول لك في أيّ أسبوع وأيّ فقرة. اكتب سؤالك أو اختر من الأزرار.', ph: 'اكتب سؤالك…', send: 'إرسال', wait: 'يفكّر…', doc: '👨‍🏫 اسأل الدكتور', sent: '✓ وصل سؤالك للدكتور. سيظهر ردّه هنا عندما يجيب.', replies: '📬 ردود الدكتور', noRep: 'لم يصل ردّ بعد.', you: 'سؤالك', dr: 'ردّ الدكتور', note: 'المساعد قد يخطئ؛ المرجع هو الدفتر والمحاضرة.', err: 'تعذّر الاتصال الآن، حاول بعد قليل.', limit: 'وصلت إلى حدّ الأسئلة لهذا اليوم. نلتقي غدًا 🌙', busy: 'المساعد مشغول بسؤال آخر، أعد المحاولة بعد ثوانٍ.', off: 'المساعد متوقّف مؤقتًا (فترة امتحانات).', close: 'إغلاق', drag: 'اسحبني إلى أيّ مكان', ask: 'اكتب سؤالك للدكتور (يمكنك تعديله):', by: 'تمّ تطويري من قِبَل د. أمير هادي لمساعدتك 🌟' },
    en: { hi: 'Hi, I am «' + NAME + '». I answer from this course notebook and tell you which week and section. Type a question or tap a button.', ph: 'Type your question…', send: 'Send', wait: 'Thinking…', doc: '👨‍🏫 Ask the doctor', sent: '✓ Your question reached the doctor. His reply will appear here.', replies: '📬 Doctor\'s replies', noRep: 'No reply yet.', you: 'Your question', dr: 'Doctor\'s reply', note: 'The assistant can make mistakes; the notebook and the lecture are the reference.', err: 'Could not connect now, please try again shortly.', limit: 'You reached today\'s question limit. See you tomorrow 🌙', busy: 'The assistant is busy, try again in a few seconds.', off: 'The assistant is paused (exam period).', close: 'Close', drag: 'Drag me anywhere', ask: 'Your question for the doctor (you can edit it):', by: 'I was developed by Dr. Ameer Hadi to help you 🌟' },
    ku: { hi: 'سڵاو، من «' + NAME + '»م. لە دەفتەری وانەکەوە وەڵام دەدەمەوە. پرسیارەکەت بنووسە.', ph: 'پرسیارەکەت بنووسە…', send: 'ناردن', wait: 'بیر دەکاتەوە…', doc: '👨‍🏫 پرسیار لە مامۆستا', sent: '✓ پرسیارەکەت گەیشت. وەڵامی مامۆستا لێرە دەردەکەوێت.', replies: '📬 وەڵامی مامۆستا', noRep: 'هێشتا وەڵام نییە.', you: 'پرسیارەکەت', dr: 'وەڵامی مامۆستا', note: 'یاریدەدەر هەڵە دەکات؛ سەرچاوە دەفتەر و وانەکەیە.', err: 'پەیوەندی نەکرا، دواتر هەوڵ بدەوە.', limit: 'سنووری پرسیاری ئەمڕۆت تەواو بوو.', busy: 'سەرقاڵە، چەند چرکەیەکی تر هەوڵ بدەوە.', off: 'یاریدەدەر ڕاگیراوە (کاتی تاقیکردنەوە).', close: 'داخستن', drag: 'ڕامبکێشە', ask: 'پرسیارەکەت بۆ مامۆستا:', by: 'لەلایەن د. ئەمیر هادی دروستکراوم بۆ یارمەتیدانت 🌟' }
  };
  var CHIPS = {
    ai: { ar: ['اشرح لي هذا الأسبوع ببساطة', 'ما أهم ثلاث أفكار في هذا الأسبوع؟', 'اختبرني بثلاثة أسئلة قصيرة', 'كيف أطبّق هذا في دائرتي؟'] },
    cloudsec: { en: ['Explain this week simply', 'What are the 3 key ideas here?', 'Quiz me with 3 short questions', 'Which job suits me?'],
                ar: ['اشرح لي هذا الأسبوع ببساطة', 'ما أهم ثلاث أفكار هنا؟', 'اختبرني بثلاثة أسئلة قصيرة', 'أيّ وظيفة تناسبني؟'],
                ku: ['ئەم هەفتەیە بە سادەیی ڕوون بکەرەوە', 'سێ پرسیارم لێ بکە'] }
  };
  var t = function (k) { return (T[L()] || T.ar)[k]; };

  var css = document.createElement('style');
  css.textContent = [
    '#ca-fab{position:fixed;z-index:9500;display:flex;align-items:center;gap:7px;padding:10px 15px 10px 12px;border:0;border-radius:999px;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;',
    'background:linear-gradient(135deg,#4a2f9e,#1857a4);color:#fff;font:700 15px "Segoe UI",Tahoma,sans-serif;box-shadow:0 6px 18px rgba(30,40,110,.38)}',
    '#ca-fab:active{cursor:grabbing}#ca-fab .i{font-size:20px;line-height:1}#ca-fab .b{min-width:9px;height:9px;border-radius:50%;background:#ffcf33;display:none}#ca-fab.has .b{display:inline-block}',
    '#ca-fab .grip{opacity:.65;font-size:12px;letter-spacing:-2px}',
    '#ca-p{position:fixed;z-index:9600;width:370px;max-width:calc(100vw - 16px);height:min(560px,calc(100vh - 24px));display:none;flex-direction:column;background:#fff;color:#1d2b3a;border-radius:16px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.32);font:15px/1.6 "Segoe UI",Tahoma,sans-serif}',
    '#ca-p.open{display:flex}#ca-h{display:flex;align-items:center;gap:8px;padding:10px 12px;background:linear-gradient(135deg,#4a2f9e,#1857a4);color:#fff;cursor:move;touch-action:none;user-select:none}',
    '#ca-h b{flex:1;font-size:16px}#ca-h button{background:rgba(255,255,255,.18);border:0;color:#fff;border-radius:8px;padding:4px 9px;cursor:pointer;font:inherit}',
    '#ca-m{flex:1;overflow-y:auto;padding:12px;background:#f5f7fb}.ca-b{max-width:88%;padding:8px 11px;border-radius:12px;margin:6px 0;white-space:pre-wrap;word-wrap:break-word}',
    '.ca-b a{color:#1857a4;text-decoration:underline;word-break:break-all;unicode-bidi:isolate}.ca-b.bot{background:#fff;border:1px solid #e1e6ef}.ca-b.me{background:#e8e2ff;margin-inline-start:auto}.ca-b.sys{background:#fff7e0;border:1px solid #f0dca0;font-size:14px}',
    '.ca-act{display:flex;gap:6px;margin:-2px 0 8px}.ca-act button,.ca-chips button{border:1px solid #cdd6e4;background:#fff;color:#3b3a8f;border-radius:999px;padding:3px 10px;font:13px "Segoe UI",Tahoma,sans-serif;cursor:pointer}',
    '.ca-chips{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 8px}#ca-f{display:flex;gap:6px;padding:8px;border-top:1px solid #e1e6ef;background:#fff}',
    '#ca-f textarea{flex:1;resize:none;height:44px;border:1px solid #cdd6e4;border-radius:10px;padding:8px;font:15px "Segoe UI",Tahoma,sans-serif;color:#1d2b3a;background:#fff}',
    '#ca-f button{border:0;border-radius:10px;padding:0 14px;background:#4a2f9e;color:#fff;font:700 14px "Segoe UI",Tahoma,sans-serif;cursor:pointer}',
    '#ca-n{font-size:11.5px;color:#7a8696;text-align:center;padding:3px 8px 6px;background:#fff}',
    '.ca-rep{background:#eaf7ee;border:1px solid #bfe3c9;border-radius:10px;padding:8px 10px;margin:6px 0;font-size:14px}.ca-rep i{font-style:normal;color:#5a6b7d;font-size:12.5px}',
    '@media(max-width:600px){#ca-p.open{left:0!important;right:0!important;top:auto!important;bottom:0!important;width:100%;max-width:100%;height:78vh;border-radius:16px 16px 0 0}#ca-h{cursor:default}}',
    '@media print{#ca-fab,#ca-p{display:none!important}}'
  ].join('');
  document.head.appendChild(css);

  var fab = document.createElement('button'); fab.id = 'ca-fab'; fab.type = 'button';
  fab.innerHTML = '<span class="grip">⋮⋮</span><span class="i">' + ICON + '</span><span class="n"></span><span class="b"></span>';
  var p = document.createElement('div'); p.id = 'ca-p'; p.setAttribute('role', 'dialog');
  p.innerHTML = '<div id="ca-h"><span>' + ICON + '</span><b></b><button type="button" id="ca-r"></button><button type="button" id="ca-x">✕</button></div><div id="ca-m"></div><div id="ca-f"><textarea id="ca-q"></textarea><button type="button" id="ca-s"></button></div><div id="ca-n"></div>';
  document.body.appendChild(fab); document.body.appendChild(p);
  var M = p.querySelector('#ca-m'), Q = p.querySelector('#ca-q'), hist = [], started = false;

  function texts() {
    var dir = L() === 'en' ? 'ltr' : 'rtl'; p.dir = dir; fab.dir = dir;
    fab.querySelector('.n').textContent = NAME; fab.title = t('drag'); fab.setAttribute('aria-label', NAME);
    p.querySelector('#ca-h b').textContent = NAME; p.querySelector('#ca-r').textContent = t('replies');
    p.querySelector('#ca-x').title = t('close'); Q.placeholder = t('ph'); p.querySelector('#ca-s').textContent = t('send');
    p.querySelector('#ca-n').textContent = t('note');
  }
  texts(); new MutationObserver(texts).observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang', 'lang'] });

  // ---- position: draggable anywhere, remembered on this device ----
  function clamp(x, y, el) { var w = el.offsetWidth, h = el.offsetHeight; return [Math.max(6, Math.min(innerWidth - w - 6, x)), Math.max(6, Math.min(innerHeight - h - 6, y))]; }
  function place(x, y) { var c = clamp(x, y, fab); fab.style.left = c[0] + 'px'; fab.style.top = c[1] + 'px'; fab.style.right = 'auto'; fab.style.bottom = 'auto'; }
  var pos = (g('pos') || '').split(',');
  requestAnimationFrame(function () { if (pos.length === 2 && !isNaN(+pos[0])) place(+pos[0] * innerWidth, +pos[1] * innerHeight); else place(innerWidth - fab.offsetWidth - 18, innerHeight - fab.offsetHeight - 92); });
  addEventListener('resize', function () { place(fab.offsetLeft, fab.offsetTop); if (p.classList.contains('open')) anchor(); });
  function dragify(handle, target, onEnd) {
    var sx, sy, ox, oy, moved = false, id = null;
    handle.addEventListener('pointerdown', function (e) {
      if (e.target.closest && e.target.closest('button') && e.target.closest('button') !== handle) return;
      if (target === p && innerWidth <= 600) return;
      id = e.pointerId; sx = e.clientX; sy = e.clientY; ox = target.offsetLeft; oy = target.offsetTop; moved = false; handle.setPointerCapture(id);
    });
    handle.addEventListener('pointermove', function (e) {
      if (id !== e.pointerId) return; var dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) + Math.abs(dy) < 6) return; moved = true;
      var c = clamp(ox + dx, oy + dy, target); target.style.left = c[0] + 'px'; target.style.top = c[1] + 'px'; target.style.right = 'auto'; target.style.bottom = 'auto';
    });
    handle.addEventListener('pointerup', function (e) { if (id !== e.pointerId) return; id = null; onEnd(moved); });
    handle.addEventListener('pointercancel', function () { id = null; });
  }
  dragify(fab, fab, function (moved) {
    if (moved) { s('pos', (fab.offsetLeft / innerWidth).toFixed(4) + ',' + (fab.offsetTop / innerHeight).toFixed(4)); return; }
    toggle();
  });
  dragify(p.querySelector('#ca-h'), p, function () {});
  function anchor() {
    if (innerWidth <= 600) return; var w = p.offsetWidth, h = p.offsetHeight, fx = fab.offsetLeft, fy = fab.offsetTop;
    var x = fx + fab.offsetWidth / 2 - w / 2, y = fy - h - 10; if (y < 6) y = fy + fab.offsetHeight + 10;
    var c = clamp(x, y, p); p.style.left = c[0] + 'px'; p.style.top = c[1] + 'px';
  }
  function toggle() {
    if (p.classList.toggle('open')) { anchor(); if (!started) start(); fab.style.visibility = innerWidth <= 600 ? 'hidden' : ''; setTimeout(function () { Q.focus(); }, 50); loadReplies(false); }
    else fab.style.visibility = '';
  }
  p.querySelector('#ca-x').onclick = function () { p.classList.remove('open'); fab.style.visibility = ''; };

  // ---- chat ----
  function clean(x) { return String(x || '').replace(/\*\*|__|^#+\s*/gm, '').replace(/^\s*[-*]\s+/gm, '• ').trim(); }
  function bubble(cls, text) { var d = document.createElement('div'); d.className = 'ca-b ' + cls; d.textContent = text; M.appendChild(d); M.scrollTop = M.scrollHeight; return d; }
  // links in an answer become clickable (built as DOM nodes, never innerHTML); trailing punctuation stays outside the link
  function linked(el, text) {
    el.textContent = ''; var re = /https?:\/\/[^\s<>"«»]+/g, last = 0, m;
    while ((m = re.exec(text))) {
      var url = m[0].replace(/[.,،؛:!?)\]]+$/, ''), end = m.index + url.length;
      if (m.index > last) el.appendChild(document.createTextNode(text.slice(last, m.index)));
      var a = document.createElement('a'); a.href = url; a.textContent = url; a.target = '_blank'; a.rel = 'noopener'; a.dir = 'ltr'; el.appendChild(a);
      last = end; re.lastIndex = end;
    }
    if (last < text.length) el.appendChild(document.createTextNode(text.slice(last)));
  }
  function chips() {
    var list = (CHIPS[C] || {})[L()] || (CHIPS[C] || {}).ar || []; if (!list.length) return;
    var w = document.createElement('div'); w.className = 'ca-chips';
    list.forEach(function (c) { var b = document.createElement('button'); b.type = 'button'; b.textContent = c; b.onclick = function () { ask(c); }; w.appendChild(b); });
    M.appendChild(w);
  }
  function start() {
    started = true;
    if (!g('intro')) { bubble('sys', t('by')); s('intro', '1'); }
    bubble('bot', t('hi')); chips();
    fetch(API + 'status?course=' + C).then(function (r) { return r.json(); }).then(function (j) { if (j && j.on === false) bubble('sys', t('off')); }).catch(function () {});
  }
  function tab() { var a = document.querySelector('.slide.active'); return a ? a.id : ''; }
  function ask(q) {
    q = String(q || Q.value).trim(); if (!q) return; Q.value = '';
    bubble('me', q); var w = bubble('bot', t('wait'));
    fetch(API + 'ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course: C, q: q, lang: L(), tab: tab(), history: hist.slice(-4), did: did }) })
      .then(function (r) { return r.json().then(function (j) { return [r.status, j]; }); })
      .then(function (x) {
        var j = x[1];
        if (!j.ok) { w.className = 'ca-b sys'; w.textContent = t(j.error === 'limit' ? 'limit' : j.error === 'busy' ? 'busy' : j.error === 'off' ? 'off' : 'err'); return; }
        var a = clean(j.answer); linked(w, a); hist.push({ who: 'me', text: q }, { who: 'bot', text: a });
        var act = document.createElement('div'); act.className = 'ca-act';
        var b = document.createElement('button'); b.type = 'button'; b.textContent = t('doc'); b.onclick = function () { doctor(q, a, b); };
        act.appendChild(b); M.appendChild(act); M.scrollTop = M.scrollHeight;
      })
      .catch(function () { w.className = 'ca-b sys'; w.textContent = t('err'); });
  }
  function doctor(q, a, btn) {
    var edited = prompt(t('ask'), q); if (edited === null) return; edited = edited.trim(); if (!edited) return;
    btn.disabled = true;
    fetch(API + 'doctor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ course: C, q: edited, a: a, did: did, tab: tab() }) })
      .then(function (r) { return r.json(); }).then(function (j) { bubble('sys', j.ok ? t('sent') : t(j.error === 'limit' ? 'limit' : 'err')); if (!j.ok) btn.disabled = false; })
      .catch(function () { bubble('sys', t('err')); btn.disabled = false; });
  }
  p.querySelector('#ca-s').onclick = function () { ask(); };
  Q.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } });

  // ---- doctor's replies (badge on the button when a new reply arrives) ----
  function loadReplies(show) {
    return fetch(API + 'replies?course=' + C + '&did=' + did).then(function (r) { return r.json(); }).then(function (j) {
      var items = (j.items || []), got = items.filter(function (x) { return x.reply; });
      var seen = +(g('seen') || 0); fab.classList.toggle('has', got.length > seen);
      if (show) {
        if (!items.length) { bubble('sys', t('noRep')); return; }
        items.forEach(function (x) {
          var d = document.createElement('div'); d.className = 'ca-rep';
          d.innerHTML = '<i></i><div class="q"></div>' + (x.reply ? '<i></i><div class="r"></div>' : '');
          var is = d.querySelectorAll('i'); is[0].textContent = t('you') + ' · ' + x.t.slice(0, 10); d.querySelector('.q').textContent = x.q;
          if (x.reply) { is[1].textContent = t('dr'); d.querySelector('.r').textContent = x.reply; } else d.appendChild(document.createTextNode('⏳ ' + t('noRep')));
          M.appendChild(d);
        });
        M.scrollTop = M.scrollHeight; s('seen', got.length); fab.classList.remove('has');
      }
    }).catch(function () {});
  }
  p.querySelector('#ca-r').onclick = function () { loadReplies(true); };
  loadReplies(false);
})();
