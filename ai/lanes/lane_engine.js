// lane_engine.js — «مثال المسارات»: a message card travels between lanes (actors) step by step, with narration.
// One engine for every explainer; each page only supplies window.LANES = { title, sub, lanes, scenarios, lesson, live? }.
// Fix bugs here once; never fork per page.
(function () {
  const C = window.LANES; if (!C) return;
  const $ = s => document.querySelector(s);
  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  const css = `
  :root{--bg:#f7f5ef;--ink:#14202b;--muted:#5b6b7b;--line:#e3e0d6;--teal:#0f766e;--acc:#e07b00;--bad:#dc2626;--ok:#15803d;--purple:#7c3aed;--card:#fffbeb;--cardb:#f59e0b;--cardk:#92400e;--code:#fde68a}
  *{box-sizing:border-box} body{margin:0;background:var(--bg);color:var(--ink);font-family:Tajawal,Tahoma,Arial,sans-serif}
  .le-wrap{max-width:1250px;margin:0 auto;padding:14px 16px 30px}
  .le-wrap h1{margin:0;font-size:30px}.le-sub{color:var(--muted)}
  .le-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:12px 0}
  .le-bar button{font:inherit;font-weight:700;border:1.5px solid var(--line);background:#fff;border-radius:12px;padding:7px 14px;cursor:pointer}
  .le-bar button.on{border-color:var(--teal);background:color-mix(in srgb,var(--teal) 8%,#fff);color:var(--teal)}
  .le-bar .go{background:var(--teal);color:#fff;border-color:var(--teal)}.le-bar .live{background:var(--purple);color:#fff;border-color:var(--purple)}
  .le-stage{position:relative;display:grid;gap:14px;min-height:430px}
  .le-lane{background:#fff;border:2px solid var(--line);border-radius:18px;padding:12px;text-align:center;position:relative;transition:.3s}
  .le-lane.active{border-color:var(--acc);box-shadow:0 0 0 4px color-mix(in srgb,var(--acc) 18%,transparent)}
  .le-lane h3{margin:4px 0 0;font-size:19px}.le-lane .role{color:var(--muted);font-size:13.5px}
  .le-lane .ic{font-size:54px;line-height:1.2}
  .le-lane .panel{margin-top:8px;font-size:13.5px;text-align:right}
  .le-lane .think{min-height:40px;margin-top:8px;font-size:14px;color:var(--purple);font-weight:700}
  .le-list div{border:1.5px solid var(--line);border-radius:8px;padding:3px 7px;margin:4px 0;background:#fafaf9;transition:.3s}
  .le-list div.hit{border-color:var(--ok);background:#dcfce7}.le-list div.miss{border-color:var(--bad);background:#fee2e2}
  .le-card{position:absolute;z-index:5;width:230px;background:var(--card);border:2px solid var(--cardb);border-radius:12px;padding:8px 10px;font-size:13.5px;box-shadow:0 8px 20px rgba(0,0,0,.15);
    transition:left .9s cubic-bezier(.5,0,.3,1),top .9s cubic-bezier(.5,0,.3,1),opacity .3s;text-align:right;line-height:1.6}
  .le-card .k{display:block;font-weight:900;color:var(--cardk);font-size:12.5px;margin-bottom:2px}
  .le-card code,.le-narr code,.le-lane code{direction:ltr;unicode-bidi:embed;background:var(--code);border-radius:4px;padding:0 4px}
  .le-card.bad{background:#fef2f2;border-color:var(--bad)}.le-card.bad .k{color:var(--bad)}
  .le-card.ok{background:#f0fdf4;border-color:var(--ok)}.le-card.ok .k{color:var(--ok)}
  .le-narr{margin-top:14px;background:#fff;border:2px solid var(--line);border-radius:16px;padding:12px 16px;display:flex;gap:14px;align-items:center;min-height:86px}
  .le-narr .n{flex:0 0 auto;width:46px;height:46px;border-radius:50%;background:var(--acc);color:#fff;font-weight:900;font-size:22px;display:flex;align-items:center;justify-content:center}
  .le-narr .t{font-size:18px;line-height:1.8}
  .le-dots{display:flex;gap:6px;justify-content:center;margin-top:10px}.le-dots i{width:11px;height:11px;border-radius:50%;background:#d6d3d1}.le-dots i.on{background:var(--acc)}
  .le-lesson{margin-top:12px;background:color-mix(in srgb,var(--card) 70%,#fff);border:1px solid var(--code);border-radius:12px;padding:10px 14px;font-size:16px}
  .le-foot{text-align:center;color:var(--muted);font-size:12.5px;margin-top:14px}
  @media (max-width:820px){.le-stage{grid-template-columns:1fr 1fr!important}.le-card{width:180px;font-size:12.5px}}`;
  // optional palette: theme: { bg, teal (buttons/links), acc (active lane + step number), card, cardb, cardk, code }
  const th = C.theme ? ':root{' + Object.entries(C.theme).map(([k, v]) => `--${k}:${v}`).join(';') + '}' : '';
  const st = document.createElement('style'); st.textContent = css + th; document.head.appendChild(st);

  const root = document.createElement('div'); root.className = 'le-wrap';
  root.innerHTML = `${C.back ? `<a href="${C.back.href}" style="color:var(--teal);font-weight:700;text-decoration:none">→ ${C.back.label}</a>` : ''}
    <h1>${C.title}</h1><div class="le-sub">${C.sub || ''}</div>
    <div class="le-bar"><b>السيناريو:</b>${C.scenarios.map((s, k) => `<button data-s="${k}" class="${k ? '' : 'on'}">${s.label}</button>`).join('')}
      <span style="flex:1"></span><button id="le-prev">→ السابق</button><button id="le-next" class="go">التالي ←</button>
      <button id="le-auto">▶ تشغيل تلقائي</button><button id="le-reset">↺ إعادة</button>${C.live ? `<button id="le-live" class="live">${C.live.label || '⚡ شغّل حقيقيًّا'}</button>` : ''}</div>
    <div class="le-stage" id="le-stage" style="grid-template-columns:repeat(${C.lanes.length},1fr)">
      ${C.lanes.map(l => `<div class="le-lane" id="le-${l.id}">${l.iconHTML || `<div class="ic">${l.icon || ''}</div>`}<h3>${l.title}</h3><div class="role">${l.role || ''}</div>${l.html || ''}<div class="panel" id="le-panel-${l.id}"></div><div class="think" id="le-think-${l.id}"></div></div>`).join('')}
      <div class="le-card" id="le-card" style="opacity:0"></div></div>
    <div class="le-narr"><div class="n" id="le-num">١</div><div class="t" id="le-text"></div></div>
    <div class="le-dots" id="le-dots"></div>
    <div class="le-lesson" id="le-lesson">${C.lesson || ''}</div>
    <div class="le-foot">${C.footer || 'تطوير د. أمير هادي'}</div>`;
  document.body.appendChild(root);

  let sc = 0, steps = C.scenarios[0].steps, i = 0, timer = null;
  // carried state: the latest think / panel / highlight shown so far stays on screen until replaced
  function latest(key, laneId) { for (let k = i; k >= 0; k--) { const v = steps[k][key]; if (v && (laneId === undefined || v[laneId] !== undefined)) return laneId === undefined ? v : v[laneId]; } return undefined; }
  function place() {
    const s = steps[i], card = $('#le-card'), stage = $('#le-stage').getBoundingClientRect(), lane = $('#le-' + s.at).getBoundingClientRect();
    document.querySelectorAll('.le-lane').forEach(l => l.classList.remove('active')); $('#le-' + s.at).classList.add('active');
    card.className = 'le-card' + (s.cls ? ' ' + s.cls : ''); card.innerHTML = s.card; card.style.opacity = 1;
    card.style.left = (lane.left - stage.left + (lane.width - card.offsetWidth) / 2) + 'px'; card.style.top = (lane.height - card.offsetHeight - 12) + 'px';
    C.lanes.forEach(l => { $('#le-think-' + l.id).innerHTML = latest('think', l.id) || ''; $('#le-panel-' + l.id).innerHTML = latest('panel', l.id) || ''; });
    document.querySelectorAll('.le-list [data-k]').forEach(d => d.className = '');
    if (s.hit) [].concat(s.hit).forEach(k => { const el = $(`.le-list [data-k="${k}"]`); if (el) el.className = 'hit'; });
    if (s.miss) [].concat(s.miss).forEach(k => { const el = $(`.le-list [data-k="${k}"]`); if (el) { el.className = 'miss'; el.style.display = 'block'; } });
    $('#le-num').textContent = ar(i + 1); $('#le-text').innerHTML = s.text;
    $('#le-dots').innerHTML = steps.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
  }
  const go = k => { i = Math.max(0, Math.min(steps.length - 1, k)); place(); };
  const stop = () => { clearInterval(timer); timer = null; $('#le-auto').textContent = '▶ تشغيل تلقائي'; };
  $('#le-next').onclick = () => { stop(); go(i + 1); }; $('#le-prev').onclick = () => { stop(); go(i - 1); }; $('#le-reset').onclick = () => { stop(); go(0); };
  $('#le-auto').onclick = () => { if (timer) return stop(); $('#le-auto').textContent = '⏸ إيقاف'; if (i >= steps.length - 1) go(0);
    timer = setInterval(() => { if (i >= steps.length - 1) return stop(); go(i + 1); }, C.autoMs || 3200); };
  document.querySelectorAll('.le-bar [data-s]').forEach(b => b.onclick = () => { stop(); document.querySelectorAll('.le-bar [data-s]').forEach(x => x.classList.toggle('on', x === b));
    sc = +b.dataset.s; steps = C.scenarios[sc].steps; if (C.scenarios[sc].lesson) $('#le-lesson').innerHTML = C.scenarios[sc].lesson; else $('#le-lesson').innerHTML = C.lesson || ''; go(0); });
  document.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; if (e.key === 'ArrowLeft' || e.key === ' ') { e.preventDefault(); stop(); go(i + 1); } if (e.key === 'ArrowRight') { stop(); go(i - 1); } });
  window.addEventListener('resize', place);
  // optional live mode: C.live.run(scenarioIndex) returns a Promise of { steps, lesson } built from a real call
  if (C.live) $('#le-live').onclick = async () => {
    stop(); const b = $('#le-live'), label = b.textContent; b.disabled = true; b.textContent = '⏳ يعمل…';
    try { const r = await C.live.run(sc); if (r && r.steps) { steps = r.steps; if (r.lesson) $('#le-lesson').innerHTML = r.lesson; go(0); } }
    catch (e) { $('#le-lesson').innerHTML = '⚠️ تعذّر التشغيل الحقيقيّ: ' + (e.message || e); }
    b.disabled = false; b.textContent = label;
  };
  // ?s=N opens scenario N directly (links from a lecture table: page.html?s=2)
  const s0 = +new URLSearchParams(location.search).get('s'); const b0 = document.querySelector(`.le-bar [data-s="${s0}"]`);
  if (s0 && b0) b0.click(); else go(0);
})();
