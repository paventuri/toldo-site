(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ss=(a,b,v)=>{const x=clamp((v-a)/(b-a));return x*x*(3-2*x)},lerp=(a,b,t)=>a+(b-a)*t;
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,B=document.body,page=B.dataset.page||'',simple=B.dataset.nav==='simple';
/* ---------- chrome ---------- */
const L=[['/services/','Services'],['/work/','Work'],['/about/','About'],['/contact/','Contact']];
B.insertAdjacentHTML('afterbegin',(simple?'':'<a class="annc grad" href="/mini-x-ray/">Free Mini X-Ray of your store, ready in 24 hours. 10 per week.&nbsp;<u>Get yours</u></a>')+
`<nav id="nav"><div class="in"><a class="wm" href="/">Toldo</a><div class="links">${simple?'<a href="/">← Back to site</a>':L.map(([h,l])=>`<a href="${h}"${page===l.toLowerCase()?' class="on"':''}>${l}</a>`).join('')+'<a class="btn mag" href="/mini-x-ray/">Free Mini X-Ray</a><a href="mailto:toldostudio@gmail.com" class="mob">toldostudio@gmail.com</a>'}</div>${simple?'':'<button class="burger" type="button" aria-label="Open menu">Menu</button>'}</div></nav><div class="cur" id="cur"></div><div id="light" aria-hidden="true"></div>`);
if(simple)B.classList.add('no-annc');
$$('.mob').forEach(m=>m.style.display=matchMedia('(max-width:860px)').matches?'':'none');
const bg=$('.burger');bg&&bg.addEventListener('click',()=>$('#nav').classList.toggle('open'));
if(B.dataset.close!=='no'&&!simple){const t=B.dataset.closeTitle||'Start with a free look<br><span class="m">at your store.</span>';const cb=B.dataset.closeBody||'Send us your link. Within 24 hours you get a score from 0 to 100, the 3 issues costing you sales, and a 3-minute video.';
B.insertAdjacentHTML('beforeend',`<div class="gband grad"></div><section class="closing dark" data-bars="floor"><div data-art></div><div class="wrap"><span class="lbl eyebrow rv">Start here</span><h2 class="d h2 split">${t}</h2><p class="lead rv">${cb}</p><div class="acts rv"><a class="btn solid mag" href="/mini-x-ray/">Get my free Mini X-Ray <span class="arw">→</span></a><a class="tl" href="/contact/">Or tell us about a project</a></div><p class="small rv" style="position:relative;z-index:41">We do 10 Mini X-Rays a week.</p></div></section>`);}
if(!simple)B.insertAdjacentHTML('beforeend',`<footer class="foot"><div class="wrap"><div class="g"><div><a class="wm" href="/">Toldo</a><div class="tag">Storefronts that sell.</div><p>Toldo Studio designs brands and online stores for small and medium businesses.</p></div>
<div class="c"><b>Studio</b>${L.map(([h,l])=>`<a href="${h}">${l}</a>`).join('')}</div>
<div class="c"><b>Start here</b><a href="/mini-x-ray/">Free Mini X-Ray</a><a href="/services/#xray">Full X-Ray · $490</a><a href="/services/#projects">Store Redesign</a></div>
<div class="c"><b>Get in touch</b><a href="mailto:toldostudio@gmail.com">toldostudio@gmail.com</a><a href="https://www.instagram.com/toldostudio/" target="_blank" rel="noopener">Instagram</a><a href="https://www.linkedin.com/company/toldo-studio/" target="_blank" rel="noopener">LinkedIn</a><span style="margin-top:14px;color:var(--mute)">Austin, TX</span></div></div>
<div class="legal"><span>© 2026 Toldo Studio. All rights reserved.</span><a href="/privacy/">Privacy policy</a><span>Toldo Studio is independent and not affiliated with Shopify. Platform names belong to their owners.</span></div></div></footer>`);
/* ---------- split + reveal ---------- */
$$('.split').forEach(h=>{let i=0;const walk=(node,cls)=>{let o='';node.childNodes.forEach(n=>{if(n.nodeType===3)o+=n.textContent.split(/(\s+)/).map(w=>w.trim()?`<span class="w"><span class="${cls||''}" style="transition-delay:${(i++)*.06}s">${w}</span></span>`:w).join('');else if(n.tagName==='BR')o+='<br>';else o+=walk(n,n.className);});return o;};h.innerHTML=walk(h,'');});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add(e.target.classList.contains('split')?'in-view':'in');io.unobserve(e.target);}}),{threshold:.15});
const hero=$('.hero');
$$('.rv,.split,.eyebrow').forEach(el=>{if(!(hero&&hero.contains(el)))io.observe(el);});
const showHero=()=>{if(!hero)return;$$('.split',hero).forEach(e=>e.classList.add('in-view'));$$('.rv,.eyebrow',hero).forEach((e,i)=>setTimeout(()=>e.classList.add('in'),300+i*120));intro=performance.now();};
/* ---------- loader ---------- */
let intro=0;
if(B.dataset.loader&&!RM&&!sessionStorage.getItem('toldo-seen')){B.classList.add('loading');B.insertAdjacentHTML('afterbegin','<div class="loader" id="loader"><span class="lbl">Toldo Studio</span><span class="pct" id="pct">0</span></div>');
 const t0=performance.now(),pct=$('#pct');const ld=()=>{const p=Math.min(1,(performance.now()-t0)/1300);pct.textContent=Math.round((1-Math.pow(1-p,3))*100);if(p<1)return requestAnimationFrame(ld);$('#loader').classList.add('done');B.classList.remove('loading');sessionStorage.setItem('toldo-seen',1);setTimeout(showHero,250);};requestAnimationFrame(ld);}
else setTimeout(showHero,80);
/* ---------- light bars ---------- */
const N=7,LL=$('#light'),chs=[],glow=document.createElement('div');glow.className='glow';LL.appendChild(glow);
['r','a','m'].forEach(k=>{const c=document.createElement('div');c.className='ch '+k;const bars=[];for(let i=0;i<N;i++){const b=document.createElement('div');b.className='b';c.appendChild(b);bars.push(b);}LL.appendChild(c);chs.push({el:c,bars});});
const cs=[...Array(N)].map(()=>({x:innerWidth/2,y:innerHeight*.2,w:40,h:0,o:0}));
const R=el=>el.getBoundingClientRect();let T=0,tx=0,ty=0;
const anchors=$$('[data-bars]').map(el=>({el,type:el.dataset.bars,art:$('[data-art]',el)||el,at:0,done:false}));
const spreadX=(r,i,w)=>r.left+(r.width-w)*(i/(N-1));
const lay={
 awning(a){const r=R(a.art);const ie=a.el.classList.contains('hero')?(intro?1-Math.pow(1-clamp((performance.now()-intro)/1600),3):0):1;return[...Array(N)].map((_,i)=>{const ph=i*.7,w=r.width*.07;const sy=(.78+.22*Math.sin(T*.9+ph)+ty*.15)*ie;return{x:spreadX(r,i,w)+Math.sin(T*.6+ph)*6+tx*(i-3)*10,y:r.top,w,h:r.height*Math.max(.001,sy),o:.75+.25*Math.sin(T*1.3+ph)};});},
 rise(a){const r=R(a.art);const el=a.at?(performance.now()-a.at)/1000:0;return[...Array(N)].map((_,i)=>{const g=1-Math.pow(1-clamp((el-i*.25)/.9),3),w=Math.max(8,r.width*.06);const h=Math.max(1,r.height*(.16+i*.14)*g*(.97+.03*Math.sin(T*1.2+i)));return{x:spreadX(r,i,w),y:r.bottom-h,w,h,o:g>0?1:0};});},
 floor(a){const r=R(a.art);const el=a.at?(performance.now()-a.at)/1000:0,w=r.width/8.2;return[...Array(N)].map((_,i)=>{const ph=i*.7,g=1-Math.pow(1-clamp((el-Math.abs(i-3)*.14)/1),3);const h=r.height*g*(.86+.14*Math.sin(T*.9+ph));return{x:spreadX(r,i,w)+Math.sin(T*.6+ph)*4,y:r.bottom-h,w,h,o:g>0?.9:0};});},
 rows(a){const rs=$$('.row',a.el);if(!a.wired){a.wired=1;a.hov=-1;rs.forEach((r,k)=>{r.addEventListener('pointerenter',()=>a.hov=k);r.addEventListener('pointerleave',()=>a.hov=-1);});}
   const k=a.hov>=0?a.hov:(a.at?Math.floor(Math.max(0,performance.now()-a.at)/2400)%rs.length:0);rs.forEach((r,i)=>r.classList.toggle('act',i===k));
   const row=rs[k],rr=R(row),tx=el=>{const g=document.createRange();g.selectNodeContents(el);return g.getBoundingClientRect();};const L0=tx($('.nm',row)).right+32,R0=R($('.ds',row)).left-32,W=Math.max(40,R0-L0);
   return[...Array(N)].map((_,i)=>{const ph=i*.7,h=rr.height*(.62+.14*Math.sin(T*1.1+ph)),w=Math.max(4,W*.08);return{x:L0+(W-w)*(i/(N-1)),y:rr.top+(rr.height-h)/2,w,h,o:.95};});},
tuck(a){const e=$('.eyebrow',a.el),g=document.createRange();g.selectNodeContents(e);const r=g.getBoundingClientRect(),x0=r.right+20;return[...Array(N)].map((_,i)=>{const h=22*(.8+.2*Math.sin(T*1.1+i*.7));return{x:x0+i*9,y:r.top+r.height/2-11,w:5,h,o:.9};});},
 cells(a){const cs=$('.cl',a.el);if(!a.wired){a.wired=1;a.hov=-1;cs.forEach((c,k)=>{c.addEventListener('pointerenter',()=>a.hov=k);c.addEventListener('pointerleave',()=>a.hov=-1);});}
   const k=a.hov>=0?a.hov:(a.at?Math.floor(Math.max(0,performance.now()-a.at)/1800)%cs.length:0);cs.forEach((c,i)=>c.classList.toggle('act',i===k));const r=R(cs[k]),pw=r.width*.84,x0=r.left+(r.width-pw)/2,w=pw*.09;
   return[...Array(N)].map((_,i)=>{const ph=i*.7,hh=r.height*(.78+.14*Math.sin(T*1.1+ph));return{x:x0+(pw-w)*(i/(N-1)),y:r.top+(r.height-hh)/2,w,h:hh,o:.75};});},
 eq(a){const r=R(a.art),w=r.width*.08;return[...Array(N)].map((_,i)=>{const h=r.height*(.3+.6*Math.abs(Math.sin(T*1.2+i*.9)));return{x:spreadX(r,i,w),y:r.bottom-h,w,h,o:.95};});},
 scan(a){const r=R(a.art);const q=a.at?clamp((performance.now()-a.at)/7000):0,SW=5,sg=Math.min(SW-1e-6,q*SW),k=Math.floor(sg),f=sg-k,ef=f*f*(3-2*f);const eq=q>=1?1:(k%2===0?ef:1-ef);
   const by=r.top+8+eq*(r.height-12);a.art.style.setProperty('--sy',(by-r.top)+'px');
   if(a.at){$$('.r',a.art).forEach(rw=>{const b=R(rw);const on=by>=b.top-6&&by<=b.bottom+6;rw.classList.toggle('scan',on&&q<1);if(on)rw.classList.add('hit');});if(q>=1&&!a.done){a.done=true;a.art.classList.add('done');const s=$('[data-stat]',a.art);s&&(s.textContent=s.dataset.stat);}}
   const rest=q>=1?.85+.15*Math.sin(T*2):1,on=a.at?1:0;return[...Array(N)].map((_,i)=>i===3?{x:r.left-10,y:by-1.5,w:r.width+20,h:3,o:on*rest}:(i===2||i===4)?{x:r.left-10,y:by-16,w:r.width+20,h:32,o:on*.4*rest}:{x:r.left+r.width/2,y:by,w:r.width*.6,h:2,o:0});},
 handle(a){const f=R(a.art),hd=R($('.ba-h',a.art));const L0=hd.left+f.width*.03,W=Math.max(8,f.right-L0-f.width*.03);return[...Array(N)].map((_,i)=>{const ph=i*.7,sy=.78+.22*Math.sin(T*.9+ph);return{x:L0+W*(i/(N-1))*.93+Math.sin(T*.6+ph)*4,y:f.top+f.height*.04,w:W*.07,h:f.height*.8*sy,o:.8+.2*Math.sin(T*1.3+ph)};});}
};
const lights=$$('section.light');
/* sticker (home) */
const stk=$('.sticker'),h1=$('.hero h1');let sx=0,sy2=0,sS=1,stOn=false;if(stk)B.appendChild(stk);
/* pointer */
let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my,vel=0,lx=mx,ly=my;const cur=$('#cur');
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY;});
document.addEventListener('mouseover',e=>{cur.classList.toggle('big',!!e.target.closest('a,button,summary,.ba-frame,label'));});
$$('.mag').forEach(b=>{b.addEventListener('pointermove',e=>{const r=R(b);b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;});b.addEventListener('pointerleave',()=>b.style.transform='');});
/* marquees */
const mqs=$$('.mq>div').map(d=>{d.innerHTML=d.innerHTML.repeat(4);return{d,x:0,dir:+(d.parentNode.dataset.dir||1)};});
/* before/after */
$$('.ba-frame').forEach(f=>{const a=$('.ba-a',f),h=$('.ba-h',f);let dr=false;const set=x=>{const r=R(f);const p=clamp((x-r.left)/r.width)*100;a.style.clipPath=`inset(0 0 0 ${p}%)`;h.style.left=p+'%';};
 f.addEventListener('pointerdown',e=>{dr=true;f.setPointerCapture(e.pointerId);set(e.clientX)});f.addEventListener('pointermove',e=>dr&&set(e.clientX));f.addEventListener('pointerup',()=>dr=false);});
$$('.tabs').forEach(tb=>{const bs=$$('button',tb);bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.toggle('on',x===b));const f=$(tb.dataset.for);if(b.dataset.b){$('.ba-b img',f).src=b.dataset.b;$('.ba-a img',f).src=b.dataset.a;f.classList.toggle('mob',!!b.dataset.mob);}$$('[data-lab]',f).forEach(s=>s.textContent=s.dataset.lab.replace('{v}',b.textContent));}));});
/* filters */
$$('.filters').forEach(fl=>{const bs=$$('button',fl);bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.toggle('on',x===b));$$('[data-kind]').forEach(c=>c.style.display=(b.dataset.f==='all'||c.dataset.kind===b.dataset.f)?'':'none');}));});
$$('.cl').forEach(c=>{c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');});});
/* forms */
$$('form[data-thanks]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;const C=window.TOLDO_CONFIG||{},b=$('button[type=submit]',f),lab=b.firstChild.textContent,go=()=>location.href=f.dataset.thanks;const old=$('.form-err',f);old&&old.remove();b.disabled=true;b.firstChild.textContent='Sending… ';
 if(!C.formEndpoint){console.warn('[toldo] No form endpoint configured (demo mode): nothing was sent.');setTimeout(go,900);return;}
 const fd=new FormData(f),body=new FormData();[...new Set([...fd.keys()])].forEach(k=>body.append(k,fd.getAll(k).join(', ')));
 fetch(C.formEndpoint,{method:'POST',body,headers:{Accept:'application/json'}}).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json().catch(()=>({}));}).then(j=>{if(j&&(j.success===false||j.success==='false'))throw new Error(j.message||'rejected');go();}).catch(err=>{console.warn('[toldo] Form submit failed:',err);b.disabled=false;b.firstChild.textContent=lab;const m=C.email||'';f.insertAdjacentHTML('beforeend',`<p class="note full form-err" role="alert" style="margin:0;border-color:var(--k1)"><b>Something went wrong.</b> Please email us at <a class="tl" href="mailto:${m}">${m}</a>.</p>`);});}));
const qf=new URLSearchParams(location.search).get('need');if(qf){const c=$(`input[value="${qf}"]`);c&&(c.checked=true);}
/* loop */
let lastY=0,last=0;const nav=$('#nav');
const tick=now=>{
 const dt=Math.min(.05,(now-(last||now))/1000);last=now;T+=dt;const y=scrollY;
 if(Math.abs(y-lastY)>4){nav.classList.toggle('hide',y>lastY&&y>240);lastY=y;}B.classList.toggle('scrolled',y>40);
 const cf=1-Math.exp(-dt*14);cx+=(mx-cx)*cf;cy+=(my-cy)*cf;cur.style.transform=`translate(${cx}px,${cy}px)`;
 const dx=mx-lx,dy=my-ly;lx=mx;ly=my;vel+=(Math.min(50,Math.hypot(dx,dy))-vel)*(1-Math.exp(-dt*6));
 const pf=1-Math.exp(-dt*3);tx+=((mx/innerWidth-.5)-tx)*pf;ty+=((my/innerHeight-.5)-ty)*pf;
 if(anchors.length){
  const mid=innerHeight*.5,cc=anchors.map(a=>{const r=R(a.el);return r.top+r.height/2;});
  let i0=0;while(i0<anchors.length-1&&cc[i0+1]<=mid)i0++;
  const p=i0<anchors.length-1?clamp((mid-cc[i0])/(cc[i0+1]-cc[i0])):0;
  anchors.forEach((a,k)=>{const near=(k===i0&&p<.5)||(k===i0+1&&p>.5);if(near&&!a.at)a.at=now+200;if(!near&&a.type!=='scan'&&Math.abs(k-i0)>1)a.at=0;});
  const act=p<.5?anchors[i0]:anchors[Math.min(anchors.length-1,i0+1)];
  const isLight=act.el.dataset.blend?act.el.dataset.blend==='multiply':lights.some(s=>{const r=R(s);return r.top<mid&&r.bottom>mid;});LL.classList.toggle('on-light',isLight);
  const A=lay[anchors[i0].type](anchors[i0]),Bb=i0<anchors.length-1?lay[anchors[i0+1].type](anchors[i0+1]):A,df=1-Math.exp(-dt*9);
  for(let i=0;i<N;i++){const st=i*.03,q=ss(.3+st,.66+st,p),a=A[i],b=Bb[i],arc=Math.sin(q*Math.PI)*(i-3)*22;const c=cs[i];
   c.x+=(lerp(a.x,b.x,q)+arc-c.x)*df;c.y+=(lerp(a.y,b.y,q)-c.y)*df;c.w+=(lerp(a.w,b.w,q)-c.w)*df;c.h+=(lerp(a.h,b.h,q)-c.h)*df;c.o+=(lerp(a.o,b.o,q)-c.o)*df;}
  const sp=6+vel*.5,off=[[-1,0],[1,.3],[0,-.6]];
  chs.forEach((ch,j)=>{ch.el.style.transform=`translate(${off[j][0]*sp}px,${off[j][1]*sp}px) skewX(${tx*-14}deg)`;ch.bars.forEach((el,i)=>{const c=cs[i];el.style.transform=`translate(${c.x}px,${c.y}px)`;el.style.width=Math.max(1,c.w)+'px';el.style.height=Math.max(0,c.h)+'px';el.style.opacity=clamp(c.o);});});
  const gx=cs.reduce((s,c)=>s+c.x+c.w/2,0)/N,gy=cs.reduce((s,c)=>s+c.y+c.h/2,0)/N;glow.style.transform=`translate(${gx}px,${gy}px)`;glow.style.opacity=.7+.3*Math.sin(T*.8);
 }
 if(stk&&h1){if(!stOn&&intro){stOn=true;setTimeout(()=>stk.classList.add('on'),1200);}const hr=R(h1),k=ss(.05,.6,y/innerHeight);const gx=lerp(hr.right+70,innerWidth-84,k),gy=lerp(hr.bottom-80,innerHeight-84,k),gs=lerp(1,.72,k);const f2=sx?1-Math.exp(-dt*10):1;sx+=(gx-sx)*f2;sy2+=(gy-sy2)*f2;sS+=(gs-sS)*f2;stk.style.transform=`translate(${sx-75}px,${sy2-75}px) scale(${sS})`;}
 mqs.forEach(m=>{m.x-=(60*dt+vel*.04)*m.dir;const half=m.d.scrollWidth/4;if(m.x<-half)m.x+=half;if(m.x>0)m.x-=half;m.d.style.transform=`translateX(${m.x}px)`;});
 requestAnimationFrame(tick);
};
requestAnimationFrame(tick);
})();
