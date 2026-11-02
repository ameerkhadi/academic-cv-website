// sim3d.js — «محاكاة ثلاثية الأبعاد» engine for Dr. Ameer's lectures (generalised from cloudsec Breach Night, 31 Oct 2026).
// Needs three.js r128 loaded first (vendor/three.min.js next to the page).
// Usage: Sim3D.mount(document.getElementById('sim3d'), CONFIG)   — CONFIG shape is documented in SKILL.md.
(function () {
'use strict';
const CSS = `
.s3d{--s3-bg:#fffdf8;--s3-panel:#fff;--s3-ink:#1d2430;--s3-ink2:#3d4757;--s3-ink3:#6b7686;--s3-rule:#d9dde3;--s3-ok:#0b746d;--s3-okS:rgba(11,116,109,.10);--s3-okL:rgba(11,116,109,.45);
 --s3-bad:#b3322d;--s3-badS:rgba(179,50,45,.10);--s3-badL:rgba(179,50,45,.45);--s3-blue:#1d5fa8;--s3-stage:#0b1620;font-family:inherit;color:var(--s3-ink)}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .s3d{--s3-bg:#141820;--s3-panel:#1a1f29;--s3-ink:#eef1f6;--s3-ink2:#c4ccd8;--s3-ink3:#8e99ab;--s3-rule:#2c3443;--s3-ok:#45c4b8;--s3-okS:rgba(69,196,184,.13);--s3-okL:rgba(69,196,184,.5);--s3-bad:#f0766d;--s3-badS:rgba(240,118,109,.13);--s3-badL:rgba(240,118,109,.5);--s3-blue:#7fb2ef}}
:root[data-theme=dark] .s3d{--s3-bg:#141820;--s3-panel:#1a1f29;--s3-ink:#eef1f6;--s3-ink2:#c4ccd8;--s3-ink3:#8e99ab;--s3-rule:#2c3443;--s3-ok:#45c4b8;--s3-okS:rgba(69,196,184,.13);--s3-okL:rgba(69,196,184,.5);--s3-bad:#f0766d;--s3-badS:rgba(240,118,109,.13);--s3-badL:rgba(240,118,109,.5);--s3-blue:#7fb2ef}
.s3d *{box-sizing:border-box}
.s3d .s3-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(280px,1fr);gap:16px;align-items:start}
@media (max-width:900px){.s3d .s3-grid{grid-template-columns:minmax(0,1fr)}}
.s3d .s3-stage{position:relative;height:clamp(320px,62vh,660px);border-radius:14px;overflow:hidden;background:var(--s3-stage);touch-action:none;cursor:grab}
.s3d .s3-stage canvas{display:block}
.s3d .s3-lb{position:absolute;transform:translate(-50%,-100%);font-size:12px;padding:2px 8px;border-radius:6px;background:rgba(11,22,32,.86);border:1px solid #2f4a5c;color:#b8cad6;white-space:nowrap;pointer-events:none;transition:opacity .3s;line-height:1.6}
.s3d .s3-lb.hot{color:#ffb3ad;border-color:#E24B4A}.s3d .s3-lb.ok{color:#9FE1CB;border-color:#1D9E75}
.s3d .s3-hud{position:absolute;top:10px;right:12px;left:12px;display:flex;justify-content:space-between;pointer-events:none;font-size:12px;color:#8fa6b5}
.s3d .s3-hud .big{font-size:22px;color:#ffd2cc}
.s3d .s3-meta{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px}
.s3d .s3-met{background:var(--s3-panel);border:1px solid var(--s3-rule);border-radius:10px;padding:8px 12px}
.s3d .s3-met span{font-size:12.5px;color:var(--s3-ink3)}.s3d .s3-met b{display:block;font-size:22px;line-height:1.4}.s3d .s3-met.red b{color:var(--s3-bad)}
.s3d .s3-dots{display:flex;gap:6px;justify-content:center;margin:10px 0;flex-wrap:wrap}
.s3d .s3-dots button{width:34px;height:28px;padding:0;font:inherit;font-size:13px;border-radius:7px;border:1px solid var(--s3-rule);background:var(--s3-panel);color:var(--s3-ink);cursor:pointer}
.s3d .s3-dots button:disabled{opacity:.4;cursor:default}
.s3d .s3-dots .d{background:var(--s3-okS);color:var(--s3-ok);border-color:var(--s3-okL)}.s3d .s3-dots .x{background:var(--s3-badS);color:var(--s3-bad);border-color:var(--s3-badL)}
.s3d .s3-dots .a{border:1.5px solid var(--s3-blue);color:var(--s3-blue)}.s3d .s3-dots .v{outline:2px solid var(--s3-blue);outline-offset:2px}
.s3d .s3-tools{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.s3d .s3-tools button{font:inherit;border:1px solid var(--s3-rule);background:var(--s3-panel);border-radius:8px;padding:6px 12px;cursor:pointer;font-size:14px;color:var(--s3-ink2)}
.s3d .s3-tools button[aria-pressed=true]{background:var(--s3-ink);color:var(--s3-panel)}
.s3d .s3-card{border:1px solid var(--s3-rule);background:var(--s3-panel);border-radius:14px;padding:14px 16px}
.s3d .s3-kick{font-size:12.5px;color:var(--s3-ink3)}.s3d .s3-card h3{margin:2px 0 6px;font-size:21px;line-height:1.4}
.s3d .s3-story{font-size:15.5px;color:var(--s3-ink2);margin:0 0 6px;line-height:1.8}.s3d .s3-turn{font-size:13.5px;color:var(--s3-blue);font-weight:700}
.s3d .s3-opt{display:block;width:100%;text-align:start;margin:7px 0;padding:10px 12px;font:inherit;font-size:15px;line-height:1.6;border:1px solid var(--s3-rule);background:var(--s3-bg);color:var(--s3-ink);border-radius:9px;cursor:pointer}
.s3d .s3-opt:disabled{cursor:default}.s3d .s3-opt.good{background:var(--s3-okS);color:var(--s3-ok);border-color:var(--s3-okL)}.s3d .s3-opt.bad{background:var(--s3-badS);color:var(--s3-bad);border-color:var(--s3-badL)}
.s3d .s3-fb{font-size:14.5px;line-height:1.8;margin:8px 0 0;min-height:1em}
.s3d .s3-nx{margin-top:10px;font:inherit;border:1px solid var(--s3-ink);background:var(--s3-ink);color:var(--s3-panel);border-radius:8px;padding:8px 16px;cursor:pointer}
.s3d .s3-stamp{display:inline-block;border:3px solid currentColor;border-radius:8px;padding:4px 14px;font-weight:800;font-size:20px;transform:rotate(-3deg)}
.s3d .s3-help{font-size:13px;color:var(--s3-ink3);margin-top:10px}`;

function mount(root, C) {
  const SRC = JSON.stringify(C);   // clean copy for «إعادة المحاكاة» (stages get three.js objects attached below)
  if (!document.getElementById('s3d-css')) { const st = document.createElement('style'); st.id = 's3d-css'; st.textContent = CSS; document.head.appendChild(st); }
  const AR = new Intl.NumberFormat('ar-u-nu-arab'), ar = n => AR.format(n);
  const STAGES = C.stages, NS = STAGES.length, TEAMS = C.teams || ['الفريق الأزرق', 'الفريق الأحمر'];
  root.classList.add('s3d'); root.dir = 'rtl';
  root.innerHTML = `<div class="s3-grid"><div><div class="s3-stage"><canvas aria-label="${C.aria || 'مشهد ثلاثي الأبعاد، يُدوَّر بالسحب ويُقرَّب بالعجلة'}"></canvas>
   <div class="s3-hud"><span class="s3-mode"></span><span class="s3-tm big"></span></div></div><div class="s3-dots"></div></div>
   <div><div class="s3-meta"><div class="s3-met red"><span>${C.metric ? C.metric.label : 'الخسارة'}</span><b class="s3-m1">٠</b></div><div class="s3-met"><span>${TEAMS.map(t => t.replace('الفريق ', '')).join(' : ')}</span><b class="s3-m2">٠ : ٠</b></div></div>
   <div class="s3-tools"><button class="s3-tb">مؤقّت النقاش ${ar(C.timer || 60)} ث</button><button class="s3-ab" aria-pressed="false">الخريطة الكاملة</button></div>
   <div class="s3-card s3-q"><div class="s3-kick"></div><h3></h3><p class="s3-story"></p><div class="s3-turn"></div><div class="s3-opts"></div><p class="s3-fb"></p><button class="s3-nx" hidden></button></div>
   <div class="s3-card s3-rep" hidden></div></div></div>
   <p class="s3-help">التحكّم: السحب يدوّر المشهد، والعجلة أو إصبعان تقرّبه. أرقام المراحل تحت المشهد تفتح أيّ مرحلة محلولة للمراجعة.${C.simNote ? ' ' + C.simNote : ''}</p>`;
  const q = s => root.querySelector(s), st = q('.s3-stage'), cv = q('canvas');
  if (!window.THREE) { st.innerHTML = '<div style="color:#b8cad6;padding:24px;line-height:1.9">تعذّر تحميل مكتبة الرسم ثلاثيّ الأبعاد. أعد تحميل الصفحة.</div>'; return; }
  const T = THREE, R = new T.WebGLRenderer({ canvas: cv, antialias: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2)); R.setClearColor(0x0b1620);
  const sc = new T.Scene(); sc.fog = new T.Fog(0x0b1620, 13, 26);
  const cam = new T.PerspectiveCamera(40, 1, .1, 60);
  sc.add(new T.HemisphereLight(0xcfe0ff, 0x0b1620, .6)); const dl = new T.DirectionalLight(0xffffff, .85); dl.position.set(4, 9, 6); sc.add(dl);
  const W = new T.Group(); sc.add(W);
  const mat = (c, o = {}) => new T.MeshStandardMaterial(Object.assign({ color: c, roughness: .55, metalness: .25 }, o));
  const bx = (p, w, h, d, m, x = 0, y = 0, z = 0) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); p.add(b); return b; };
  const hex = c => typeof c === 'string' ? parseInt(c.replace('#', ''), 16) : c;
  function ctex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new T.CanvasTexture(c); t.draw = () => { draw(c.getContext('2d'), w, h); t.needsUpdate = true; }; t.draw(); return t; }
  const FONT = '"Noto Naskh Arabic",Tahoma,sans-serif';
  // screen with lines of text: lines = [[text, '#color'], …]; Arabic is drawn right-to-left
  function screenTex(lines, w = 512, h = 330, title) {
    return ctex(w, h, (c) => { c.fillStyle = '#0d1117'; c.fillRect(0, 0, w, h); let y0 = 30;
      if (title) { c.fillStyle = '#161b22'; c.fillRect(0, 0, w, 34); c.fillStyle = '#c9d1d9'; c.font = '18px ' + FONT; c.fillText(title, 14, 23); y0 = 48; }
      lines.forEach((l, i) => { const t = Array.isArray(l) ? l[0] : l, col = Array.isArray(l) ? l[1] || '#c9d1d9' : '#c9d1d9', rtl = /[؀-ۿ]/.test(t);
        if (Array.isArray(l) && l[2]) { c.fillStyle = 'rgba(255,123,114,.16)'; c.fillRect(0, y0 + i * 38, w, 34); }
        c.fillStyle = col; c.font = '20px ' + (rtl ? FONT : 'monospace'); c.direction = rtl ? 'rtl' : 'ltr'; c.textAlign = rtl ? 'right' : 'left'; c.fillText(t, rtl ? w - 14 : 14, y0 + 24 + i * 38); }); });
  }
  function sprite(txt, col, s = 1) { const t = ctex(512, 96, (c, w, h) => { c.fillStyle = 'rgba(11,22,32,.88)'; c.fillRect(0, 0, w, h); c.strokeStyle = col; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4); c.fillStyle = col; c.font = 'bold 44px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h / 2); });
    const sp = new T.Sprite(new T.SpriteMaterial({ map: t, depthWrite: false })); sp.scale.set(1.3 * s, .245 * s, 1); return sp; }
  function floorLabel(txt, col, x, z, w = 2.4) { const t = ctex(512, 80, (c, W2, H) => { c.fillStyle = col; c.font = 'bold 40px ' + FONT; c.textBaseline = 'middle'; c.fillText(txt, 10, H / 2); });
    const m = new T.Mesh(new T.PlaneGeometry(w, w * 80 / 512), new T.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(x, .03, z); W.add(m); }
  function zone(z) { const [x1, x2, z1, z2] = z.box;
    const p = new T.Mesh(new T.PlaneGeometry(x2 - x1, z2 - z1), new T.MeshStandardMaterial({ color: hex(z.fill || 0x121a22), roughness: .95 })); p.rotation.x = -Math.PI / 2; p.position.set((x1 + x2) / 2, .01, (z1 + z2) / 2); W.add(p);
    const g = new T.BufferGeometry().setFromPoints([[x1, z1], [x2, z1], [x2, z2], [x1, z2], [x1, z1]].map(a => new T.Vector3(a[0], .02, a[1])));
    const l = new T.Line(g, z.dash ? new T.LineDashedMaterial({ color: hex(z.edge), dashSize: .2, gapSize: .12 }) : new T.LineBasicMaterial({ color: hex(z.edge) })); l.computeLineDistances(); W.add(l);
    if (z.label) floorLabel(z.label, z.edge, x1 + .2, z2 - .3, z.lw || 2.6); }
  const base = new T.Mesh(new T.PlaneGeometry(40, 40), mat(0x0c1822, { roughness: 1 })); base.rotation.x = -Math.PI / 2; W.add(base);
  (C.zones || []).forEach(zone); (C.floorLabels || []).forEach(f => floorLabel(f[0], f[1], f[2], f[3], f[4]));

  // ---- the 3D object library: every node picks a kind ----
  const leds = [], spin = [];
  const KINDS = {
    person(g, o) { const m = mat(hex(o.color || 0x1b1f24), { roughness: .9 }); const b = new T.Mesh(new T.CylinderGeometry(.22, .42, 1.1, 20), m); b.position.y = .55; g.add(b);
      const hd = new T.Mesh(new T.SphereGeometry(.27, 20, 16), m); hd.position.y = 1.32; g.add(hd);
      if (o.hood) { const fc = new T.Mesh(new T.SphereGeometry(.17, 16, 12), mat(0x050608)); fc.position.set(0, 1.28, .12); g.add(fc); }
      if (o.light) { const pl = new T.PointLight(hex(o.light), 1.3, 3); pl.position.set(0, .9, .4); g.add(pl); } return 1.75; },
    laptop(g, o) { bx(g, 1.3, .62, .8, mat(0x3a3f47), 0, .31, 0); bx(g, 1.12, .04, .72, mat(0xb7bcc4, { metalness: .6 }), 0, .64, 0);
      const sg = new T.Group(); sg.position.set(0, .66, -.34); sg.rotation.x = -.28; g.add(sg); bx(sg, 1.12, .72, .03, mat(0xb7bcc4, { metalness: .6 }), 0, .36, 0);
      const sp = new T.Mesh(new T.PlaneGeometry(1.02, .65), new T.MeshBasicMaterial({ map: screenTex(o.lines || [], 512, 330, o.title) })); sp.position.set(0, .36, .02); sg.add(sp); return 1.55; },
    monitor(g, o) { bx(g, .12, .7, .12, mat(0x2a2f36), 0, .35, 0); bx(g, .6, .04, .4, mat(0x2a2f36), 0, .02, 0); bx(g, 1.5, .95, .06, mat(0x15181c), 0, 1.15, 0);
      const sp = new T.Mesh(new T.PlaneGeometry(1.4, .86), new T.MeshBasicMaterial({ map: screenTex(o.lines || [], 560, 344, o.title) })); sp.position.set(0, 1.15, .035); g.add(sp); return 1.85; },
    phone(g, o) { bx(g, .55, .1, .4, mat(0x2a2f36), 0, .05, 0); const ph = new T.Group(); ph.position.set(0, .1, 0); ph.rotation.x = -.2; g.add(ph);
      bx(ph, .52, 1.0, .06, mat(0x15181c, { metalness: .6, roughness: .3 }), 0, .5, 0);
      const ps = new T.Mesh(new T.PlaneGeometry(.46, .92), new T.MeshBasicMaterial({ map: screenTex(o.lines || [], 256, 512, o.title) })); ps.position.set(0, .5, .032); ph.add(ps); return 1.35; },
    server(g, o) { bx(g, .9, 2.0, .8, mat(0x22272e, { metalness: .5 }), 0, 1.0, 0);
      for (let u = 0; u < 6; u++) { bx(g, .8, .22, .04, mat(0x3a414b, { metalness: .6 }), 0, .35 + u * .28, .41); for (let k = 0; k < 3; k++) leds.push(bx(g, .04, .04, .02, new T.MeshBasicMaterial({ color: k ? 0x1D9E75 : 0x378ADD }), -.3 + k * .07, .35 + u * .28, .44)); } return 2.55; },
    firewall(g, o) { const fm = mat(hex(o.color || 0x534AB7), { metalness: .5, roughness: .35 }); bx(g, .14, 1.5, .14, fm, -.55, .75, 0); bx(g, .14, 1.5, .14, fm, .55, .75, 0); bx(g, 1.24, .14, .14, fm, 0, 1.5, 0); bx(g, 1.4, .06, .5, mat(0x2a2f36), 0, .03, 0);
      for (let k = 0; k < 5; k++) bx(g, .96, .02, .02, new T.MeshBasicMaterial({ color: 0xAFA9EC }), 0, .3 + k * .25, 0); return 1.75; },
    chip(g, o) { bx(g, .5, .08, .5, mat(0x0e0f12, { roughness: .4 }), 0, .06, 0); const gold = mat(0xd4af37, { metalness: .9, roughness: .3 });
      for (let k = -2; k <= 2; k++) { bx(g, .04, .03, .1, gold, k * .09, .03, .29); bx(g, .04, .03, .1, gold, k * .09, .03, -.29); bx(g, .1, .03, .04, gold, .29, .03, k * .09); bx(g, .1, .03, .04, gold, -.29, .03, k * .09); }
      const t = ctex(256, 256, c => { c.fillStyle = '#0e0f12'; c.fillRect(0, 0, 256, 256); c.fillStyle = '#c9d1d9'; c.textAlign = 'center'; c.font = 'bold 46px monospace'; c.fillText(o.text || 'CPU', 128, 118); c.font = '22px monospace'; c.fillText(o.sub || '', 128, 166); });
      const tp = new T.Mesh(new T.PlaneGeometry(.46, .46), new T.MeshBasicMaterial({ map: t })); tp.rotation.x = -Math.PI / 2; tp.position.y = .105; g.add(tp); return .6; },
    key(g, o) { const ped = new T.Mesh(new T.CylinderGeometry(.32, .4, .55, 24), mat(0x2a2f36)); ped.position.y = .27; g.add(ped);
      const kg = new T.Group(); kg.position.y = 1.0; g.add(kg); spin.push(kg); const gold = mat(0xd9a520, { metalness: .85, roughness: .25 });
      kg.add(new T.Mesh(new T.TorusGeometry(.2, .06, 16, 40), gold)); const s = new T.Mesh(new T.CylinderGeometry(.045, .045, .75, 16), gold); s.rotation.z = Math.PI / 2; s.position.x = .57; kg.add(s);
      bx(kg, .06, .16, .05, gold, .82, -.09, 0); bx(kg, .06, .11, .05, gold, .92, -.07, 0);
      if (o.tag) { let okT = false; const tt = ctex(256, 110, (c, w, h) => { c.fillStyle = okT ? '#E1F5EE' : '#FCEBEB'; c.fillRect(0, 0, w, h); c.fillStyle = okT ? '#085041' : '#791F1F'; c.font = 'bold 30px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(okT ? (o.tagOk || o.tag) : o.tag, w / 2, h / 2); });
        const tag = new T.Mesh(new T.PlaneGeometry(.5, .21), new T.MeshBasicMaterial({ map: tt, side: T.DoubleSide })); tag.position.set(-.05, -.38, 0); kg.add(tag); g.userData.fix = () => { okT = true; tt.draw(); }; } return 1.85; },
    gates(g, o) { (o.gates || []).forEach((a, k, A) => { const c = hex(a[1]); const m = mat(c, { emissive: c, emissiveIntensity: .25 }); const x = (k - (A.length - 1) / 2) * .8;
      bx(g, .1, 1.1, .1, m, x, .55, -.35); bx(g, .1, 1.1, .1, m, x, .55, .35); bx(g, .12, .1, .82, m, x, 1.12, 0); const s = sprite(a[0], a[2] || '#fff', .7); s.position.set(x, 1.45 + (k % 2) * .22, 0); g.add(s); }); return 1.95; },
    buckets(g, o) { const bm = mat(hex(o.color || 0xC8553D), { roughness: .5, side: T.DoubleSide }); const n = o.count || 6, cols = Math.ceil(n / 2);
      for (let i = 0; i < n; i++) { const r = i % 2, c = Math.floor(i / 2); const b = new T.Group(); b.position.set(-.4 + r * .85, 0, (c - (cols - 1) / 2) * .8); g.add(b);
        const cy = new T.Mesh(new T.CylinderGeometry(.32, .24, .6, 28, 1, true), bm); cy.position.y = .3; b.add(cy);
        const dat = new T.Mesh(new T.CylinderGeometry(.29, .24, .42, 24), mat(0x5DCAA5, { emissive: 0x0F6E56, emissiveIntensity: .4 })); dat.position.y = .22; b.add(dat); } return 1.35; },
    database(g, o) { const m = mat(hex(o.color || 0x378ADD), { metalness: .4 }); for (let i = 0; i < 3; i++) { const d = new T.Mesh(new T.CylinderGeometry(.5, .5, .32, 32), m); d.position.y = .2 + i * .38; g.add(d);
      const ring = new T.Mesh(new T.TorusGeometry(.5, .02, 8, 32), new T.MeshBasicMaterial({ color: 0x9fd3ff })); ring.rotation.x = Math.PI / 2; ring.position.y = .36 + i * .38; g.add(ring); } return 1.45; },
    building(g, o) { const m = mat(hex(o.color || 0x8d8678), { roughness: .8 }); bx(g, 1.4, 1.3, 1, m, 0, .65, 0); bx(g, 1.6, .1, 1.2, mat(0x5a554c), 0, 1.35, 0);
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) bx(g, .25, .25, .02, new T.MeshBasicMaterial({ color: 0xffe9a8 }), -.4 + c * .4, .5 + r * .45, .51);
      if (o.sign) { const s = sprite(o.sign, '#ffd34d', .8); s.position.set(0, 1.7, 0); g.add(s); } return 1.9; },
    document(g, o) { for (let i = 0; i < 4; i++) bx(g, .8, .03, 1.05, mat(0xf3efe4, { roughness: 1 }), (i % 2) * .03, .03 + i * .035, i * .02);
      const t = screenTex(o.lines || [], 300, 400); t.needsUpdate = true; const p = new T.Mesh(new T.PlaneGeometry(.76, 1.0), new T.MeshBasicMaterial({ map: t })); p.rotation.x = -Math.PI / 2; p.position.y = .17; g.add(p); return .6; },
    router(g, o) { bx(g, 1.1, .22, .7, mat(0x22272e), 0, .11, 0); for (let k = 0; k < 3; k++) { const a = new T.Mesh(new T.CylinderGeometry(.025, .025, .6, 8), mat(0x15181c)); a.position.set(-.35 + k * .35, .52, -.25); g.add(a); }
      for (let k = 0; k < 6; k++) leds.push(bx(g, .05, .03, .02, new T.MeshBasicMaterial({ color: 0x1D9E75 }), -.4 + k * .16, .15, .36)); return .95; },
    sensor(g, o) { const p = new T.Mesh(new T.CylinderGeometry(.05, .05, 1.2, 10), mat(0x8a929c)); p.position.y = .6; g.add(p); bx(g, .4, .3, .25, mat(0xe8e4da), 0, 1.25, 0);
      const l = bx(g, .08, .08, .02, new T.MeshBasicMaterial({ color: 0x39ff14 }), .1, 1.3, .13); leds.push(l); return 1.6; },
    cloud(g, o) { const m = mat(0xdfe7f2, { roughness: .9 }); [[0, 0, .55], [.5, -.05, .42], [-.5, -.05, .42], [.25, .25, .4], [-.22, .22, .38]].forEach(a => { const s = new T.Mesh(new T.SphereGeometry(a[2], 20, 14), m); s.position.set(a[0], 1.4 + a[1], 0); g.add(s); }); return 2.1; },
    box(g, o) { bx(g, o.w || .9, o.h || .9, o.d || .9, mat(hex(o.color || 0x3a414b)), 0, (o.h || .9) / 2, 0); if (o.text) { const s = sprite(o.text, o.textColor || '#fff', .8); s.position.y = (o.h || .9) + .3; g.add(s); } return (o.h || .9) + .5; }
  };

  const N = {};
  C.nodes.forEach(n => { const g = new T.Group(); g.position.set(n.x, n.y || 0, n.z); if (n.rot) g.rotation.y = n.rot; W.add(g);
    const yl = (KINDS[n.kind] || KINDS.box)(g, n) + (n.y || 0); N[n.k] = { g, t: n.label, yl: n.labelY || yl, r: n.r || .85, s: 0, want: 0 }; });
  const L = {}; for (const k in N) { const d = document.createElement('div'); d.className = 's3-lb'; d.textContent = N[k].t; st.appendChild(d); L[k] = d; }

  STAGES.forEach(s => { s.c = new T.CatmullRomCurve3(s.path.map(a => new T.Vector3(...a))); s.tube = new T.Mesh(new T.TubeGeometry(s.c, 60, .025, 6), new T.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: .8 })); s.tube.visible = false; W.add(s.tube); });
  const pk = new T.Group(); W.add(pk); const core = new T.Mesh(new T.SphereGeometry(.1, 16, 12), new T.MeshBasicMaterial({ color: 0xff3b30 })); pk.add(core); pk.add(new T.PointLight(0xff3b30, 1.5, 2.5));
  const trail = []; for (let j = 0; j < 10; j++) { const m = new T.Mesh(new T.SphereGeometry(.065 * (1 - j / 12), 10, 8), new T.MeshBasicMaterial({ color: 0xff3b30, transparent: true, opacity: .5 * (1 - j / 10) })); W.add(m); trail.push(m); }
  const shields = {}, alarms = {};
  function shield(k) { const n = N[k], g = new T.SphereGeometry(n.r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2); const s = new T.Mesh(g, new T.MeshBasicMaterial({ color: 0x5DCAA5, transparent: true, opacity: .14, side: T.DoubleSide, depthWrite: false }));
    s.add(new T.Mesh(g, new T.MeshBasicMaterial({ color: 0x5DCAA5, wireframe: true, transparent: true, opacity: .3 }))); s.scale.setScalar(.01); n.g.add(s); shields[k] = s; if (n.g.userData.fix) n.g.userData.fix(); }
  function alarm(k) { const ms = []; N[k].g.traverse(o => { if (o.isMesh && o.material.isMeshStandardMaterial) { o.material = o.material.clone(); o.material.emissive = new T.Color(0xE24B4A); ms.push(o.material); } }); alarms[k] = ms; }

  // camera: drag = orbit, wheel / pinch = zoom
  let yaw = .75, pitch = .62, dist = 9, drag = null, pinch = null; const tgt = new T.Vector3(0, .6, 0), want = tgt.clone(); let wantD = 9; const ptrs = new Map();
  st.addEventListener('pointerdown', e => { ptrs.set(e.pointerId, [e.clientX, e.clientY]); try { st.setPointerCapture(e.pointerId); } catch (_) {}
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = [Math.hypot(a[0] - b[0], a[1] - b[1]), wantD]; drag = null; } else drag = [e.clientX, e.clientY, yaw, pitch]; st.style.cursor = 'grabbing'; });
  st.addEventListener('pointermove', e => { if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()]; wantD = Math.max(4, Math.min(16, pinch[1] * pinch[0] / Math.max(20, Math.hypot(a[0] - b[0], a[1] - b[1])))); return; }
    if (!drag) return; yaw = drag[2] - (e.clientX - drag[0]) * .008; pitch = Math.max(.2, Math.min(1.25, drag[3] + (e.clientY - drag[1]) * .005)); });
  const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) { drag = null; st.style.cursor = 'grab'; } };
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  st.addEventListener('wheel', e => { e.preventDefault(); wantD = Math.max(4, Math.min(16, wantD + e.deltaY * .01)); }, { passive: false });
  function size() { const w = st.clientWidth, h = st.clientHeight; if (!w || !h) return; R.setSize(w, h, false); cv.style.width = w + 'px'; cv.style.height = h + 'px'; cam.aspect = w / h; cam.updateProjectionMatrix(); }
  new ResizeObserver(size).observe(st); size();

  let cur = 0, view = 0, all = false, done = false, loss = 0, sc0 = 0, sc1 = 0; const ans = []; let pkC = null, pkK = 0, pkStop = 1; const hist = [];
  const perWrong = C.metric ? C.metric.perWrong : 1, unit = C.metric && C.metric.unit ? ' ' + C.metric.unit : '';
  function frame(keys) { const b = new T.Box3(); keys.forEach(k => b.expandByPoint(N[k].g.position.clone().setY(N[k].yl * .5))); const c = b.getCenter(new T.Vector3()), sz = b.getSize(new T.Vector3());
    want.copy(c); want.y = .7; wantD = Math.max(5.2, Math.max(sz.x, sz.z) * 1.35 + 3.2) * Math.max(1, 1.05 / cam.aspect); }
  function scene() { const s = STAGES[view], keys = all ? Object.keys(N) : s.vis;
    for (const k in N) N[k].want = keys.includes(k) ? 1 : 0;
    STAGES.forEach((x, j) => x.tube.visible = all ? (j < ans.length || j === cur) : j === view);
    if (all) { const b = new T.Box3(); for (const k in N) b.expandByPoint(N[k].g.position); want.copy(b.getCenter(new T.Vector3())); want.y = .6; wantD = Math.min(16, Math.max(9, b.getSize(new T.Vector3()).x * 1.15)) * Math.max(1, 1.05 / cam.aspect); } else frame(s.vis);
    for (const k in L) { const j = STAGES.findIndex(x => x.target === k), a = j >= 0 ? ans[j] : undefined; L[k].className = 's3-lb' + (a !== undefined ? (STAGES[j].options[a][1] ? ' ok' : ' hot') : (k === s.target && !all ? ' hot' : '')); }
    const a = ans[view]; pk.visible = !done && !all; pkC = s.c; pkK = 0; hist.length = 0; pkStop = a !== undefined && s.options[a][1] ? .82 : 1; trail.forEach(m => m.visible = pk.visible);
    q('.s3-mode').textContent = all ? 'الخريطة الكاملة' : 'المرحلة ' + ar(view + 1); q('.s3-ab').setAttribute('aria-pressed', all); }
  const v = new T.Vector3(), flow = []; let flowC = null;
  (function loop(t) { requestAnimationFrame(loop); if (!st.offsetParent) return;
    if (!drag && !pinch) yaw += .001; tgt.lerp(want, .06); dist += (wantD - dist) * .06;
    cam.position.set(tgt.x + Math.sin(yaw) * dist * Math.cos(pitch), tgt.y + dist * Math.sin(pitch), tgt.z + Math.cos(yaw) * dist * Math.cos(pitch)); cam.lookAt(tgt);
    for (const k in N) { const n = N[k]; n.s += (n.want - n.s) * .12; n.g.scale.setScalar(Math.max(.001, n.s)); n.g.visible = n.s > .02;
      v.copy(n.g.position); v.y = n.yl; v.project(cam); const d = L[k]; d.style.opacity = n.s > .6 && v.z < 1 ? 1 : 0; d.style.left = ((v.x + 1) / 2 * st.clientWidth) + 'px'; d.style.top = ((1 - v.y) / 2 * st.clientHeight) + 'px'; }
    leds.forEach((l, j) => l.visible = Math.sin(t / (140 + j * 7) + j) > -.3); spin.forEach(g => g.rotation.y += .012);
    if (pkC && pk.visible) { pkK = Math.min(pkStop, pkK + .006); const p = pkC.getPoint(pkK); hist.unshift(p.clone()); hist.length = 12; pk.position.copy(p); trail.forEach((m, j) => { if (hist[j + 1]) m.position.copy(hist[j + 1]); }); }
    core.scale.setScalar(1 + .25 * Math.sin(t / 150));
    for (const k in shields) { const s = shields[k]; if (s.scale.x < 1) s.scale.setScalar(Math.min(1, s.scale.x + .04)); }
    for (const k in alarms) alarms[k].forEach(m => m.emissiveIntensity = .45 + .45 * Math.sin(t / 120));
    flow.forEach(m => { m.userData.t = (m.userData.t + .004) % 1; m.position.copy(flowC.getPoint(m.userData.t)); m.rotation.x += .05; });
    R.render(sc, cam); })(0);

  function dots() { const D = q('.s3-dots'); D.innerHTML = ''; STAGES.forEach((s, j) => { const b = document.createElement('button'); b.textContent = ar(j + 1); const a = ans[j];
    b.className = (a !== undefined ? (s.options[a][1] ? 'd' : 'x') : j === cur ? 'a' : '') + (j === view && !done ? ' v' : ''); b.setAttribute('aria-label', 'المرحلة ' + ar(j + 1));
    if (j <= cur && !done) b.onclick = () => { view = j; all = false; card(); scene(); dots(); }; else b.disabled = true; D.appendChild(b); }); }
  function card() { const s = STAGES[view], a = ans[view];
    q('.s3-kick').textContent = 'المرحلة ' + ar(view + 1) + ' من ' + ar(NS) + (view !== cur ? ' · مراجعة' : ''); q('.s3-q h3').textContent = s.title; q('.s3-story').textContent = s.story;
    q('.s3-turn').textContent = 'دور ' + TEAMS[view % 2]; const O = q('.s3-opts'); O.innerHTML = '';
    s.options.forEach((o, j) => { const b = document.createElement('button'); b.className = 's3-opt'; b.textContent = o[0];
      if (a !== undefined) { b.disabled = true; if (o[1]) b.classList.add('good'); else if (j === a) b.classList.add('bad'); } else b.onclick = () => pick(j); O.appendChild(b); });
    const fb = q('.s3-fb'); if (a !== undefined) { fb.textContent = s.options[a][2]; fb.style.color = s.options[a][1] ? 'var(--s3-ok)' : 'var(--s3-bad)'; } else fb.textContent = '';
    const nx = q('.s3-nx'); if (view !== cur) { nx.hidden = false; nx.textContent = 'العودة إلى المرحلة ' + ar(cur + 1); } else if (a !== undefined) { nx.hidden = false; nx.textContent = cur < NS - 1 ? 'المرحلة التالية' : (C.reportTitle || 'التقرير النهائي'); } else nx.hidden = true; }
  function pick(j) { const s = STAGES[view], o = s.options[j]; ans[view] = j; stopT();
    if (o[1]) { shield(s.target); s.tube.material.color.setHex(0x1D9E75); view % 2 ? sc1++ : sc0++; } else { alarm(s.target); loss += perWrong; }
    q('.s3-m1').textContent = ar(loss) + unit; q('.s3-m2').textContent = ar(sc0) + ' : ' + ar(sc1); card(); scene(); dots(); }
  q('.s3-nx').onclick = () => { if (view !== cur) view = cur; else if (cur < NS - 1) { cur++; view = cur; } else return report(); all = false; card(); scene(); dots(); };
  q('.s3-ab').onclick = () => { if (done) return; all = !all; scene(); };
  let tmr = null; function stopT() { clearInterval(tmr); tmr = null; q('.s3-tm').textContent = ''; }
  q('.s3-tb').onclick = () => { stopT(); let n = C.timer || 60; q('.s3-tm').textContent = ar(n); tmr = setInterval(() => { n--; q('.s3-tm').textContent = n > 0 ? ar(n) : 'انتهى الوقت'; if (n <= 0) { clearInterval(tmr); tmr = null; } }, 1000); };
  function report() { done = true; all = true; scene(); q('.s3-q').hidden = true;
    const ok = ans.filter((a, j) => STAGES[j].options[a][1]).length, pass = ok >= (C.passAt || Math.ceil(NS * .8)), Rp = C.report || {};
    if (loss && Rp.flow) { flowC = new T.CatmullRomCurve3(Rp.flow.map(a => new T.Vector3(...a))); for (let j = 0; j < 26; j++) { const m = new T.Mesh(new T.BoxGeometry(.08, .08, .08), new T.MeshBasicMaterial({ color: 0x5DCAA5 })); m.userData.t = j / 26; W.add(m); flow.push(m); } }
    const r = q('.s3-rep'); r.hidden = false;
    r.innerHTML = `<span class="s3-stamp" style="color:var(--s3-${pass ? 'ok' : 'bad'})">${pass ? (Rp.pass || 'نجحتم') : (Rp.fail || 'لم تنجحوا هذه المرّة')}</span>
     <h3 style="margin:14px 0 4px">${C.reportTitle || 'التقرير النهائي'}</h3><p class="s3-story">قرارات صحيحة: ${ar(ok)} من ${ar(NS)} · ${C.metric ? C.metric.label : 'الخسارة'}: ${ar(loss)}${unit} · ${TEAMS[0]} ${ar(sc0)} مقابل ${TEAMS[1]} ${ar(sc1)}</p>
     <div style="font-size:14.5px;line-height:1.8">${(Rp.items || []).map(l => `<div style="border-top:1px solid var(--s3-rule);padding:8px 0"><b>${l[0]}</b><br><span style="color:var(--s3-ink2)">${l[1]}</span></div>`).join('')}</div>
     ${Rp.lesson ? `<p class="s3-story" style="margin:8px 0">${Rp.lesson}</p>` : ''}<button class="s3-nx s3-again">إعادة المحاكاة</button>`;
    q('.s3-again').onclick = () => mount(root, JSON.parse(SRC)); dots(); }
  card(); scene(); dots();
}
window.Sim3D = { mount };
})();
