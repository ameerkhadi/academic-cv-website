/* محرّكُ العرض بالقلم — طبقةٌ فوق المحاضرة، لا تمسُّ محتواها.
   يقرأ window.LECTURE_TIMELINE، ويمرّر الصفحة، ويحرّك مؤشّرَ الفأرة،
   ويرسم بالقلم عند رأس المؤشّر، ويعرض ترجمةً تتتابع مع الكلام. */
(()=>{
const TL=window.LECTURE_TIMELINE, P=TL.pen||{color:'#d62828',width:4};
const q=new URLSearchParams(location.search), AUTO=q.has('autoplay');
if(AUTO) document.body.classList.add('presenting');

/* ── لوحةُ الرسم ── */
const cv=document.createElement('canvas');
Object.assign(cv.style,{position:'fixed',inset:0,width:'100vw',height:'100vh',pointerEvents:'none',zIndex:99998});
document.body.appendChild(cv); const g=cv.getContext('2d');
function fit(){const d=devicePixelRatio||1;cv.width=innerWidth*d;cv.height=innerHeight*d;g.setTransform(d,0,0,d,0,0);}
fit(); addEventListener('resize',fit);

/* ── شريطُ الترجمة ── */
const cap=document.createElement('div'); cap.dir='rtl';
Object.assign(cap.style,{position:'fixed',left:'50%',bottom:'26px',transform:'translateX(-50%)',maxWidth:'76vw',
 background:'rgba(10,20,35,.88)',color:'#fff',font:'600 24px/1.7 "IBM Plex Sans Arabic","Noto Naskh Arabic",Tahoma,sans-serif',
 padding:'11px 22px',borderRadius:'13px',zIndex:99999,textAlign:'center',display:'none'});
document.body.appendChild(cap);

/* ── مؤشّرُ الفأرة ── */
const cur=document.createElement('div');
cur.innerHTML='<svg width="26" height="36" viewBox="0 0 26 36"><path d="M3 2 L3 27 L9.5 21.5 L13.8 31.5 L18 29.7 L13.8 20 L21.5 19.6 Z" fill="#141821" stroke="#fff" stroke-width="2.1" stroke-linejoin="round"/></svg>';
Object.assign(cur.style,{position:'fixed',left:'0',top:'0',zIndex:100000,pointerEvents:'none',
 filter:'drop-shadow(0 2px 4px rgba(0,0,0,.5))',opacity:'0',transition:'opacity .35s',willChange:'transform'});
document.body.appendChild(cur);
let cx=innerWidth*0.62, cy=innerHeight*0.55;
const place=()=>{ cur.style.transform='translate('+(cx-3)+'px,'+(cy-2)+'px)'; };
place();
function ripple(){
 const d=document.createElement('div');
 Object.assign(d.style,{position:'fixed',left:cx+'px',top:cy+'px',width:'10px',height:'10px',margin:'-5px 0 0 -5px',
  borderRadius:'50%',border:'2.5px solid '+P.color,zIndex:99997,pointerEvents:'none',opacity:'.9',
  transition:'width .45s ease-out, height .45s ease-out, margin .45s ease-out, opacity .45s ease-out'});
 document.body.appendChild(d);
 requestAnimationFrame(()=>{ d.style.width='46px'; d.style.height='46px'; d.style.margin='-23px 0 0 -23px'; d.style.opacity='0'; });
 setTimeout(()=>d.remove(),520);
}

const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const raf=()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
function rafLoop(ms,fn){ return new Promise(res=>{ const t0=performance.now();
 (function step(){ const k=Math.min(1,(performance.now()-t0)/ms); fn(k);
   if(k<1) requestAnimationFrame(step); else res(); })(); }); }
async function moveTo(x,y,ms){
 const x0=cx,y0=cy; if(!isFinite(x)||!isFinite(y)) return;
 cur.style.opacity='1';
 await rafLoop(Math.max(160,ms||620),k=>{ const e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  cx=x0+(x-x0)*e; cy=y0+(y-y0)*e; place(); });
}

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
function capBox(list){
  if(!list.length) return 0;
  const keep=cap.textContent, d=cap.style.display;
  cap.style.display='block';
  let h=0; for(const c of list){ cap.textContent=c; h=Math.max(h,cap.getBoundingClientRect().height); }
  cap.textContent=keep; cap.style.display=d;
  return h+42;
}

/* ── التمرير: كلُّ ما سيُعلَّم عليه داخل المنطقة الآمنة ── */
function noteTop(m,r){ return (m.type==='note' && m.side!=='left' && m.side!=='right' && m.side!=='below') ? r.top-104 : r.top; }
function noteBot(m,r){ return (m.type==='note' && m.side==='below') ? r.bottom+64 : r.bottom; }
function fitScene(s,capH){
  const items=[{type:'_',target:s.target},...(s.marks||[])];
  let top=Infinity, bot=-Infinity;
  for(const m of items){ const r=R(m.target||m.from); if(!r) continue;
    top=Math.min(top,noteTop(m,r)-10); bot=Math.max(bot,noteBot(m,r)+10); }
  if(!isFinite(top)) return;
  const ST=54, SB=innerHeight-capH-14, H=bot-top;
  const dy=(H<=SB-ST)? top-(ST+(SB-ST-H)/2) : top-ST;
  scrollBy(0,dy);
}

/* ── نقاطُ كلّ علامة ── */
function pts(m){const r=R(m.target||m.from); if(!r) return []; const o=[]; const N=48;
 if(m.type==='underline'||m.type==='strike'){const y=m.type==='strike'?r.top+r.height/2:r.bottom+3; for(let i=0;i<=N;i++) o.push([r.right-(r.width*i/N),jit(y)]);}
 else if(m.type==='circle'){const cx2=r.left+r.width/2,cy2=r.top+r.height/2,rx=r.width/2+14,ry=r.height/2+10; for(let i=0;i<=N+6;i++){const t=-Math.PI/2+i/N*2*Math.PI; o.push([jit(cx2+rx*Math.cos(t)),jit(cy2+ry*Math.sin(t))]);}}
 else if(m.type==='box'){const p=8,a=[[r.right+p,r.top-p],[r.left-p,r.top-p],[r.left-p,r.bottom+p],[r.right+p,r.bottom+p],[r.right+p,r.top-p]]; for(let k=0;k<4;k++) for(let i=0;i<=12;i++){const t=i/12; o.push([jit(a[k][0]+(a[k+1][0]-a[k][0])*t),jit(a[k][1]+(a[k+1][1]-a[k][1])*t)]);}}
 else if(m.type==='check'){const x=r.left-30,y=r.top+r.height/2; [[x,y],[x+8,y+10],[x+26,y-14]].forEach((p,i,a)=>{if(i) for(let j=0;j<=10;j++){const t=j/10;o.push([a[i-1][0]+(p[0]-a[i-1][0])*t,a[i-1][1]+(p[1]-a[i-1][1])*t]);}});}
 else if(m.type==='highlight'){for(let i=0;i<=30;i++) o.push([r.right-r.width*i/30,r.top+r.height/2]);}
 else if(m.type==='arrow'){const b=R(m.to); if(!b) return []; const x1=r.left+r.width/2,y1=r.bottom+6,x2=b.left+b.width/2,y2=b.top-6; const mx=(x1+x2)/2+40,my=(y1+y2)/2; for(let i=0;i<=N;i++){const t=i/N; o.push([(1-t)*(1-t)*x1+2*(1-t)*t*mx+t*t*x2,(1-t)*(1-t)*y1+2*(1-t)*t*my+t*t*y2]);} const a=Math.atan2(y2-my,x2-mx); o.push(null,[x2-16*Math.cos(a-.5),y2-16*Math.sin(a-.5)],[x2,y2],[x2-16*Math.cos(a+.5),y2-16*Math.sin(a+.5)]);}
 return o;}
function notePos(m,r){
 g.font='700 34px "Aref Ruqaa",serif'; const w=g.measureText(m.text).width;
 let x=r.right, y=r.top-30;
 if(m.side==='below'){ x=r.right; y=r.bottom+48; }
 if(m.side==='left'){ x=r.left-16; y=r.top+34; }
 if(m.side==='right'){ x=Math.min(r.right+16+w, innerWidth-20); y=r.top+34; }
 x=Math.max(Math.min(x, innerWidth-14), w+14); y=Math.max(y, 46);
 return {x,y,w};
}
function anchorPoint(m){
 const r=R(m.target||m.from); if(!r) return null;
 if(m.type==='note'){ const p=notePos(m,r); return [p.x,p.y-12]; }
 const o=pts(m); return o.length?o[0]:[r.right,r.top+r.height/2];
}

/* ── الرسمُ محكومٌ بالزمن، والمؤشّرُ يتبع رأسَ القلم ── */
async function stroke(o,ms,style){ if(!o.length) return;
 g.lineCap=g.lineJoin='round'; Object.assign(g,style); let drawn=0;
 return rafLoop(ms,k=>{ const n=Math.floor(k*(o.length-1));
  for(let i=drawn+1;i<=n;i++){ const a=o[i-1],b=o[i]; if(a&&b){g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke();} }
  if(n>drawn){ drawn=n; const p=o[n]; if(p){ cx=p[0]; cy=p[1]; place(); } } }); }
async function mark(m){
 if(m.type==='highlight') return stroke(pts(m),800,{strokeStyle:'rgba(255,212,0,.45)',
   lineWidth:Math.min((R(m.target)||{height:18}).height+6,40),globalCompositeOperation:'multiply'});
 if(m.type==='note'){const r=R(m.target); if(!r) return;
  const {x,y,w}=notePos(m,r);
  g.globalCompositeOperation='source-over'; g.font='700 34px "Aref Ruqaa",serif'; g.fillStyle=P.color; g.textAlign='right';
  await rafLoop(900,k=>{ g.save(); g.beginPath(); g.rect(x-w*k,y-42,w*k,58); g.clip(); g.fillText(m.text,x,y); g.restore();
    cx=x-w*k; cy=y-14; place(); }); return;}
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
const LEAD=700;                                   /* زمنُ وصول المؤشّر قبل نزول القلم */
async function play(){ if(!t0){ t0=performance.now(); window.__t0abs=performance.timeOrigin+t0; }
 for(;i<TL.scenes.length&&!stop;i++){ const s=TL.scenes[i]; clear();
  if(s.click) document.querySelector(s.click)?.click();
  document.documentElement.style.setProperty('--pz', s.zoom||1.4);
  await raf();
  const el=document.querySelector(s.target); if(el) el.scrollIntoView({block:'center'});
  await raf();
  const list=chunks(s.text), capH=capBox(list);
  fitScene(s,capH); await sleep(700);
  const start=performance.now()-t0;
  window.__sceneTimes.push({id:s.id,start,text:s.text,title:s.title||''});
  let dur=s.minMs||8000; if(s.audioMs) dur=Math.max(dur,s.audioMs+600);
  window.__cues.push(...runCaptions(list,dur,start));
  const st=performance.now();
  for(const m of s.marks||[]){
   const at=m.at||0;
   let w=at-LEAD-(performance.now()-st); if(w>0) await sleep(w);
   const ap=anchorPoint(m);
   if(ap) { await moveTo(ap[0],ap[1],Math.max(200,at-(performance.now()-st))); ripple(); }
   const w2=at-(performance.now()-st); if(w2>0) await sleep(w2);
   audit(s.id,m,capH,performance.now()-st); await mark(m);
  }
  const rest=dur-(performance.now()-st); if(rest>0) await sleep(rest);}
 clear(); cap.style.display='none'; cur.style.opacity='0'; window.__presenterDone=true;}

addEventListener('keydown',e=>{
 if(e.key==='ArrowLeft'){stop=true;setTimeout(()=>{stop=false;i++;play();},50);}
 if(e.key==='ArrowRight'&&i>0){stop=true;setTimeout(()=>{stop=false;i--;play();},50);}});
if(AUTO) setTimeout(play,1200);
else { const b=document.createElement('button'); b.textContent='▶ ابدأ الشرح';
 Object.assign(b.style,{position:'fixed',top:'16px',left:'16px',zIndex:100001,font:'700 18px Tahoma',padding:'10px 18px',
  borderRadius:'10px',border:0,background:P.color,color:'#fff',cursor:'pointer'});
 b.onclick=()=>{b.remove();document.body.classList.add('presenting');play();}; document.body.appendChild(b);}
})();
