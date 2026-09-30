# -*- coding: utf-8 -*-
"""يبني نسخة عرضٍ بالقلم من دفتر «قادة المستقبل» — الأسبوع الثالث، ثلاثة مشاهد تجريبيّة."""
import re, shutil, os

SRC = '/home/user/academic-cv-website/digital/week1.html'
OUT = os.path.join(os.environ.get('LV_WORK', '/tmp/lecture-video'), 'week3-presenter.html')

os.makedirs(os.path.dirname(OUT), exist_ok=True)
s = open(SRC, encoding='utf-8').read()

# ── 1) معرّفات الأهداف (لا يتغيّر أيُّ نصٍّ علميّ) ──
IDS = [
 ('<div class="takeaway">\n          <b>الفرقُ عن الأسبوع الماضي في سطر:</b>',
  '<div class="takeaway" id="v-def">\n          <b>الفرقُ عن الأسبوع الماضي في سطر:</b>'),
 ('<span class="hl hl-yellow">كيف نحفظ هذه الورقة؟</span>',
  '<span class="hl hl-yellow" id="v-how">كيف نحفظ هذه الورقة؟</span>'),
 ('<span class="hl hl-pink">لماذا هذه الورقة أصلًا؟</span>',
  '<span class="hl hl-pink" id="v-why">لماذا هذه الورقة أصلًا؟</span>'),
 ('<b>ثلاثُ آليّاتٍ لا رابعَ لها</b>',
  '<b id="v-three">ثلاثُ آليّاتٍ لا رابعَ لها</b>'),
 ('<div class="ex-c"><b>✕ الحذف</b>',
  '<div class="ex-c" id="v-del"><b>✕ الحذف</b>'),
 ('<div class="ex-c"><b>⚙ الأتمتة</b>',
  '<div class="ex-c" id="v-auto"><b>⚙ الأتمتة</b>'),
 ('<div class="ex-c"><b>⇄ الدمج</b>',
  '<div class="ex-c" id="v-merge"><b>⇄ الدمج</b>'),
 ('<div class="dgm-t">طلبُ الإجازة — إجراءٌ واحدٌ قبل رقمنة الأعمال وبعدها</div>',
  '<div class="dgm-t" id="v-dgmt">طلبُ الإجازة — إجراءٌ واحدٌ قبل رقمنة الأعمال وبعدها</div>'),
 ('<div class="dgm-c">الخطُّ الأحمرُ المشطوب',
  '<div class="dgm-c" id="v-dgmc">الخطُّ الأحمرُ المشطوب'),
 ('<rect x="30" y="18" width="310" height="52" rx="11" fill="rgba(31,122,61,.10)" stroke="#1f7a3d" stroke-width="2.2"/>',
  '<rect id="v-after" x="30" y="18" width="310" height="52" rx="11" fill="rgba(31,122,61,.10)" stroke="#1f7a3d" stroke-width="2.2"/>'),
]
for a, b in IDS:
    assert s.count(a) == 1, 'anchor %r count=%d' % (a[:40], s.count(a))
    s = s.replace(a, b)

# ── 2) المشاهد ──
TIMELINE = r'''
<link href="https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@700&display=swap" rel="stylesheet">
<style id="presenter-chrome">
  body.presenting .reader-btn, body.presenting .reader-panel,
  body.presenting .print-btn, body.presenting .ann-bar,
  body.presenting .timer, body.presenting .sheet,
  body.presenting .print-foot, body.presenting .pin-badge { display:none !important; }
  body.presenting .tabs-row, body.presenting .tab { visibility:hidden; }
  /* تكبيرُ الورقة لتُقرَأ على الشاشة — عرضٌ فقط، لا يمسُّ المحتوى */
  body.presenting .paper-wrapper{ zoom:var(--pz,1.4); }
  /* فُسحةٌ بيضاءُ تحت سطر الخلاصة ليقع الخطُّ اليدويُّ في فراغ */
  body.presenting #v-def{ margin-bottom:64px; }
</style>
<script>
window.LECTURE_TIMELINE = {
  pen: { color: "#ff1f3d", width: 3.6 },
  scenes: [
    { id: "s01",
      click: '.tab[data-target="slide-3"]',
      target: "#v-def",
      zoom: 1.45,
      text: "مديرٌ اشترى ماسحاتٍ ضوئيّة ومسح أرشيفَه كلَّه، ثمّ سُئل: كم قصُر زمنُ إنجاز المعاملة؟ فلم يكن هناك جواب. لماذا؟ لأنّه غيّر الورقة ولم يغيّر الطريق. الأسبوعُ الماضي كان عن الورقة، واليوم عن الطريق نفسِه — وسؤالٌ واحدٌ يفصل بينهما.",
      minMs: 26000,
      marks: [
        { at: 6000,  type: "underline", target: "#v-how" },
        { at: 11000, type: "circle",    target: "#v-why" },
        { at: 16000, type: "note",      target: "#v-def", text: "هنا الفرق", side: "below" }
      ] },

    { id: "s02",
      target: "#v-three",
      zoom: 1.3,
      text: "وكلُّ مشروعٍ ناجحٍ في هذا الباب يرجع إلى ثلاثٍ لا رابعَ لها. خطوةٌ تُحذَف — ونقلُ المعاملة بين مكتبين وُجد لأنّ الورقة تنتقل. وخطوةٌ تُؤتمَت — وما يُتَّخذ بقاعدةٍ ثابتة يستطيع الحاسوبُ أن يتّخذه. وخطوتان تُدمَجان. والسؤال: في إجراءٍ عندكم، أيُّ خطوةٍ تقع في أيٍّ من الثلاث؟",
      minMs: 28000,
      marks: [
        { at: 3000,  type: "underline", target: "#v-three" },
        { at: 9000,  type: "box",       target: "#v-del" },
        { at: 16000, type: "box",       target: "#v-auto" },
        { at: 22000, type: "note",      target: "#v-merge", text: "لا رابعَ لها", side: "above" }
      ] },

    { id: "s03",
      target: "#v-dgmt",
      zoom: 1.0,
      text: "وهذا الإجراءُ نفسُه في صورتين. على الورق ثماني خطواتٍ وثلاثةُ أيّامٍ إلى خمسة. وبعد الفحص أربعُ خطواتٍ ودقائق. ولاحظوا أنّنا لم نشترِ شيئًا — حذفنا ما وُجد لأجل الورقة وحدها. والقاعدةُ قبل فتح أيّ أداة: يُرسَم الإجراءُ ويُسأل عن كلّ خطوةٍ لِمَ هي موجودة.",
      minMs: 28000,
      marks: [
        { at: 4000,  type: "underline", target: "#v-dgmt" },
        { at: 13000, type: "circle",    target: "#v-after" },
        { at: 20000, type: "highlight", target: "#v-dgmc" }
      ] }
  ]
};
</script>
'''

# ── 3) المحرّك ──
ENGINE = r'''
<script>
(()=>{
const TL=window.LECTURE_TIMELINE, P=TL.pen||{color:'#d62828',width:4};
const q=new URLSearchParams(location.search), AUTO=q.has('autoplay');
if(AUTO) document.body.classList.add('presenting');
const cv=document.createElement('canvas'); Object.assign(cv.style,{position:'fixed',inset:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:99998});
document.body.appendChild(cv); const g=cv.getContext('2d');
function fit(){const d=devicePixelRatio||1;cv.width=innerWidth*d;cv.height=innerHeight*d;g.setTransform(d,0,0,d,0,0);} fit(); addEventListener('resize',fit);
const cap=document.createElement('div'); cap.dir='rtl';
Object.assign(cap.style,{position:'fixed',left:'50%',bottom:'26px',transform:'translateX(-50%)',maxWidth:'76vw',background:'rgba(10,20,35,.88)',color:'#fff',font:'600 24px/1.7 "IBM Plex Sans Arabic","Noto Naskh Arabic",Tahoma,sans-serif',padding:'11px 22px',borderRadius:'13px',zIndex:99999,textAlign:'center',display:'none'});
document.body.appendChild(cap);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const raf=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
const R=s=>{const e=typeof s==='string'?document.querySelector(s):s; return e&&e.getBoundingClientRect();};
const jit=(v,a=1.6)=>v+(Math.random()-.5)*a;

/* ── الترجمةُ مقاطعُ قصيرةٌ تتتابع مع الكلام ── */
function chunks(t){
  const parts=(t||'').split(/(?<=[.؟!])\s+/).filter(Boolean), out=[];
  for(const p of parts){ if(out.length && (out[out.length-1]+' '+p).length<=112) out[out.length-1]+=' '+p; else out.push(p); }
  return out;
}
function runCaptions(list,dur,t0){
  if(!list.length){ cap.style.display='none'; return []; }
  const tot=list.reduce((a,b)=>a+b.length,0); const cues=[]; let acc=0;
  for(const c of list){ const d=Math.max(1600,dur*c.length/tot); cues.push({text:c,start:t0+acc,end:t0+acc+d}); acc+=d; }
  cap.style.display='block';
  cues.forEach(c=>{ setTimeout(()=>{ cap.textContent=c.text; }, c.start-t0); });
  setTimeout(()=>{ cap.style.display='none'; }, acc);
  return cues;
}
function capBox(list){           /* أطولُ مقطعٍ يحدّد ارتفاعَ الشريط */
  if(!list.length) return 0;
  const keep=cap.textContent, d=cap.style.display;
  cap.style.display='block';
  let h=0; for(const c of list){ cap.textContent=c; h=Math.max(h,cap.getBoundingClientRect().height); }
  cap.textContent=keep; cap.style.display=d;
  return h+42;                   /* + المسافةُ من أسفل الشاشة */
}

/* ── ضبطُ التمرير: كلُّ ما سيُعلَّم عليه داخل المنطقة الآمنة ── */
function noteTop(m,r){ return (m.type==='note' && m.side!=='left' && m.side!=='right' && m.side!=='below') ? r.top-72 : r.top; }
function noteBot(m,r){ return (m.type==='note' && m.side==='below') ? r.bottom+64 : r.bottom; }
function fitScene(s,capH){
  const items=[{type:'_',target:s.target},...(s.marks||[])];
  let top=Infinity, bot=-Infinity;
  for(const m of items){ const r=R(m.target||m.from); if(!r) continue;
    top=Math.min(top,noteTop(m,r)-10); bot=Math.max(bot,noteBot(m,r)+10); }
  if(!isFinite(top)) return;
  const ST=54, SB=innerHeight-capH-14, H=bot-top;
  const dy = (H<=SB-ST) ? top-(ST+(SB-ST-H)/2) : top-ST;
  scrollBy(0,dy);
}

function pts(m){const r=R(m.target||m.from); if(!r) return []; const o=[]; const N=48;
 if(m.type==='underline'||m.type==='strike'){const y=m.type==='strike'?r.top+r.height/2:r.bottom+3; for(let i=0;i<=N;i++) o.push([r.right-(r.width*i/N),jit(y)]);}
 else if(m.type==='circle'){const cx=r.left+r.width/2,cy=r.top+r.height/2,rx=r.width/2+14,ry=r.height/2+10; for(let i=0;i<=N+6;i++){const t=-Math.PI/2+i/N*2*Math.PI; o.push([jit(cx+rx*Math.cos(t)),jit(cy+ry*Math.sin(t))]);}}
 else if(m.type==='box'){const p=8,a=[[r.right+p,r.top-p],[r.left-p,r.top-p],[r.left-p,r.bottom+p],[r.right+p,r.bottom+p],[r.right+p,r.top-p]]; for(let k=0;k<4;k++) for(let i=0;i<=12;i++){const t=i/12; o.push([jit(a[k][0]+(a[k+1][0]-a[k][0])*t),jit(a[k][1]+(a[k+1][1]-a[k][1])*t)]);}}
 else if(m.type==='check'){const x=r.left-30,y=r.top+r.height/2; [[x,y],[x+8,y+10],[x+26,y-14]].forEach((p,i,a)=>{if(i) for(let j=0;j<=10;j++){const t=j/10;o.push([a[i-1][0]+(p[0]-a[i-1][0])*t,a[i-1][1]+(p[1]-a[i-1][1])*t]);}});}
 else if(m.type==='arrow'){const b=R(m.to); if(!b) return []; const x1=r.left+r.width/2,y1=r.bottom+6,x2=b.left+b.width/2,y2=b.top-6; const mx=(x1+x2)/2+40,my=(y1+y2)/2; for(let i=0;i<=N;i++){const t=i/N; o.push([(1-t)*(1-t)*x1+2*(1-t)*t*mx+t*t*x2,(1-t)*(1-t)*y1+2*(1-t)*t*my+t*t*y2]);} const a=Math.atan2(y2-my,x2-mx); o.push(null,[x2-16*Math.cos(a-.5),y2-16*Math.sin(a-.5)],[x2,y2],[x2-16*Math.cos(a+.5),y2-16*Math.sin(a+.5)]);}
 return o;}
/* الرسمُ محكومٌ بالزمن لا بعدد النقاط، كي لا ينزلق التوقيتُ أثناء التسجيل */
function rafLoop(ms,fn){ return new Promise(res=>{ const t0=performance.now();
 (function step(){ const k=Math.min(1,(performance.now()-t0)/ms); fn(k);
   if(k<1) requestAnimationFrame(step); else res(); })(); }); }
async function stroke(o,ms,style){ if(!o.length) return;
 g.lineCap=g.lineJoin='round'; Object.assign(g,style); let drawn=0;
 return rafLoop(ms,k=>{ const n=Math.floor(k*(o.length-1));
  for(let i=drawn+1;i<=n;i++){ const a=o[i-1],b=o[i]; if(a&&b){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();} }
  if(n>drawn) drawn=n; }); }
async function mark(m){
 if(m.type==='highlight'){const r=R(m.target); if(!r) return; const o=[]; for(let i=0;i<=30;i++) o.push([r.right-r.width*i/30,r.top+r.height/2]); return stroke(o,800,{strokeStyle:'rgba(255,212,0,.45)',lineWidth:Math.min(r.height+6,40),globalCompositeOperation:'multiply'});}
 if(m.type==='note'){const r=R(m.target); if(!r) return; g.globalCompositeOperation='source-over'; g.font='700 34px "Aref Ruqaa",serif'; g.fillStyle=P.color; g.textAlign='right';
  const w=g.measureText(m.text).width;
  let x=r.right, y=r.top-16;
  if(m.side==='below'){ x=r.right; y=r.bottom+48; }
  if(m.side==='left'){ x=r.left-16; y=r.top+34; }
  if(m.side==='right'){ x=Math.min(r.right+16+w, innerWidth-20); y=r.top+34; }
  x=Math.max(Math.min(x, innerWidth-14), w+14); y=Math.max(y, 46);
  await rafLoop(900,k=>{ g.save(); g.beginPath(); g.rect(x-w*k,y-42,w*k,58); g.clip(); g.fillText(m.text,x,y); g.restore(); }); return;}
 return stroke(pts(m),m.ms||900,{strokeStyle:m.color||P.color,lineWidth:m.width||P.width,globalCompositeOperation:'source-over'});}
const clear=()=>g.clearRect(0,0,cv.width,cv.height);

/* ── تدقيقٌ آليّ: هل وقعت كلُّ علامةٍ داخل المنطقة الآمنة؟ ── */
window.__audit=[];
function audit(sc,m,capH,el){ const r=R(m.target||m.from);
 const ok = !!r && noteTop(m,r)>=0 && noteBot(m,r)<=innerHeight-capH && r.left>=0 && r.right<=innerWidth;
 window.__audit.push({scene:sc,type:m.type,target:m.target||m.from,ok,
   sched:m.at||0, actual:Math.round(el), drift:Math.round(el-(m.at||0)),
   top:r?Math.round(noteTop(m,r)):null, bottom:r?Math.round(noteBot(m,r)):null, lim:Math.round(innerHeight-capH)}); }

let i=0, stop=false; window.__sceneTimes=[]; window.__cues=[]; let t0=0;
async function play(){ if(!t0){ t0=performance.now(); window.__t0abs=performance.timeOrigin+t0; }
 for(;i<TL.scenes.length&&!stop;i++){const s=TL.scenes[i]; clear();
  if(s.click) document.querySelector(s.click)?.click();
  document.documentElement.style.setProperty('--pz', s.zoom||1.4);
  await raf();
  const el=document.querySelector(s.target); if(el) el.scrollIntoView({block:'center'});
  await raf();
  const list=chunks(s.text), capH=capBox(list);
  fitScene(s,capH); await sleep(700);
  const start=performance.now()-t0;
  window.__sceneTimes.push({id:s.id,start,text:s.text});
  let dur=s.minMs||8000; if(s.audioMs) dur=Math.max(dur,s.audioMs+600);
  window.__cues.push(...runCaptions(list,dur,start));
  const st=performance.now();
  for(const m of s.marks||[]){const w=(m.at||0)-(performance.now()-st); if(w>0) await sleep(w); audit(s.id,m,capH,performance.now()-st); await mark(m);}
  const rest=dur-(performance.now()-st); if(rest>0) await sleep(rest);}
 clear(); cap.style.display='none'; window.__presenterDone=true;}
addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){stop=true;setTimeout(()=>{stop=false;i++;play();},50);} if(e.key==='ArrowRight'&&i>0){stop=true;setTimeout(()=>{stop=false;i--;play();},50);}});
if(AUTO) setTimeout(play,1200); else { const b=document.createElement('button'); b.textContent='▶ ابدأ الشرح'; Object.assign(b.style,{position:'fixed',top:'16px',left:'16px',zIndex:99999,font:'700 18px Tahoma',padding:'10px 18px',borderRadius:'10px',border:0,background:P.color,color:'#fff',cursor:'pointer'}); b.onclick=()=>{b.remove();document.body.classList.add('presenting');play();}; document.body.appendChild(b);}
})();
</script>
'''

k = s.rfind('</body>')
assert k > 0
s = s[:k] + TIMELINE + ENGINE + s[k:]
open(OUT, 'w', encoding='utf-8').write(s)
print('presenter written: %s (%s chars)' % (os.path.basename(OUT), format(len(s), ',')))
