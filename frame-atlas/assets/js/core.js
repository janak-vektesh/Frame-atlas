/* Core motion: smooth scroll, cursor, menu, per-page reveals and page transitions. */
(function(){
const PG=window.PG||{},$=s=>document.querySelector(s),$$=s=>[].slice.call(document.querySelectorAll(s));
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({limitCallbacks:true,ignoreMobileResize:true});
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis=new Lenis({lerp:RM?1:.068,wheelMultiplier:.85,touchMultiplier:1.5,smoothWheel:true});window.lenis=lenis;window.__vel=0;
const hd=document.querySelector('header'),setSp=gsap.quickSetter('#sp','scaleX');
lenis.on('scroll',e=>{ScrollTrigger.update();window.__vel=e.velocity;setSp(e.limit?e.scroll/e.limit:0);hd.classList.toggle('solid',e.scroll>40);hd.classList.toggle('hide',e.direction===1&&e.scroll>260&&!window.__menu)});
gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);lenis.stop();
const mob=()=>innerWidth<800;

/* ----- text splitting ----- */
$$('#h1 .ln,#end .ln').forEach(l=>{const f=document.createDocumentFragment();[...l.textContent].forEach(k=>{const s=document.createElement('span');s.className='ch';s.textContent=k===' '?'\u00a0':k;f.appendChild(s)});l.textContent='';l.appendChild(f)});
$$('#qt .ln').forEach(l=>{l.innerHTML='<span style="display:block">'+l.textContent+'</span>'});
const mf=$('#mf');if(mf)mf.innerHTML=mf.textContent.split(' ').map(w=>'<span class="w">'+w+'</span>').join(' ');

/* ----- per-page character reveal ----- */
const RV={rise:{yPercent:120,rotate:10},mask:{scaleY:0,yPercent:30,transformOrigin:'50% 100%'},slide:{xPercent:-130,opacity:0},blur:{opacity:0,filter:'blur(24px)',scale:1.25},fadeup:{opacity:0,y:50},flip:{rotateX:-95,transformPerspective:700,opacity:0,yPercent:40},slam:{scale:2.8,opacity:0},drop:{yPercent:-130,rotate:-8},skew:{skewX:50,xPercent:-60,opacity:0},glitch:{xPercent:'random(-70,70)',opacity:0},type:{opacity:0}};
const TM={slam:[.07,.7,'expo.out'],glitch:[.03,.9,'steps(6)'],type:[.028,.05,'none'],blur:[.05,1.6,'expo.out'],fadeup:[.04,1.6,'power3.out']};
const rvk=RV[PG.rv]?PG.rv:'rise',RS={yPercent:0,xPercent:0,rotate:0,rotateX:0,scale:1,scaleY:1,skewX:0,y:0,opacity:1};if(rvk==='blur')RS.filter='blur(0px)';
const hide=s=>gsap.set(s,RV[rvk]);
const show=(s,d)=>{const t=TM[rvk]||[.035,1.3,'expo.out'];return gsap.to(s,Object.assign({},RS,{stagger:t[0],duration:t[1],ease:t[2],delay:d||0}))};
hide('#h1 .ch,#end .ch');gsap.set('#qt .ln>span',{yPercent:110});

/* ----- page transitions (each page has its own shape) ----- */
const TX={up:['inset(100% 0 0 0)','inset(0% 0 0 0)'],down:['inset(0 0 100% 0)','inset(0% 0 0 0)'],left:['inset(0 0 0 100%)','inset(0% 0 0 0)'],right:['inset(0 100% 0 0)','inset(0% 0 0 0)'],circle:['circle(0% at 50% 50%)','circle(150% at 50% 50%)'],corner:['circle(0% at 100% 100%)','circle(150% at 100% 100%)'],center:['inset(50% 50% 50% 50% round 60px)','inset(0% 0% 0% 0% round 0px)'],diag:['polygon(0 0,0 0,0 0)','polygon(0 0,300% 0,0 300%)'],diag2:['polygon(100% 0,100% 0,100% 0)','polygon(100% 0,-200% 0,100% 300%)'],ellipse:['ellipse(0% 0% at 50% 100%)','ellipse(140% 140% at 50% 100%)'],fade:['inset(0% 0% 0% 0%)','inset(0% 0% 0% 0%)']};
const tk=TX[PG.tx]?PG.tx:'up',pre=$('#pre');
function cover(k,enter,done,dur){pre.style.display='grid';const a=TX[k][0],b=TX[k][1];
  if(k==='fade'){gsap.set(pre,{clipPath:'none',opacity:enter?0:1});gsap.to(pre,{opacity:enter?1:0,duration:.9,ease:'power2.inOut',onComplete:done});return}
  gsap.set(pre,{opacity:1,clipPath:enter?a:b});gsap.to(pre,{clipPath:enter?b:a,duration:dur||1.3,ease:'expo.inOut',onComplete:done})}
document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a[href$=".html"]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();lenis.stop();
  const slug=a.getAttribute('href').replace('.html',''),k=(PG.tmap&&PG.tmap[slug])||tk,w=(PG.pw&&PG.pw[slug])||['',''];
  $('#cnt').textContent=w[0];$('#cnt').classList.add('w');$('#pre span').textContent=w[1];$('#bar').style.width='0';cover(TX[k]?k:'up',1,()=>{location.href=a.href},1)});
addEventListener('pageshow',e=>{if(e.persisted)location.reload()});

/* ----- cursor + magnetic ----- */
let cx=innerWidth/2,cy=innerHeight/2,px=cx,py=cy;const cur=$('#cur');
addEventListener('pointermove',e=>{cx=e.clientX;cy=e.clientY});
gsap.ticker.add(()=>{px+=(cx-px)*.2;py+=(cy-py)*.2;cur.style.transform='translate('+px+'px,'+py+'px)'});
$$('[data-h]').forEach(e=>{
  e.addEventListener('pointerenter',()=>{const c=!!e.dataset.t;gsap.to(cur,{width:c?96:54,height:c?96:54,margin:c?'-48px 0 0 -48px':'-27px 0 0 -27px',duration:.4,ease:'power3'});if(c)cur.textContent=e.dataset.t});
  e.addEventListener('pointerleave',()=>{gsap.to(cur,{width:16,height:16,margin:'-8px 0 0 -8px',duration:.4,ease:'power3'});cur.textContent=''})});
$$('.mag').forEach(b=>{
  b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();gsap.to(b,{x:(e.clientX-r.left-r.width/2)*.4,y:(e.clientY-r.top-r.height/2)*.5,duration:.4})});
  b.addEventListener('pointerleave',()=>gsap.to(b,{x:0,y:0,duration:.9,ease:'elastic.out(1,.35)'}))});

/* ----- menu + in-page anchors ----- */
let open=false;const menu=$('#menu');
function toggle(){open=!open;window.__menu=open;hd.classList.remove('hide');$('#mbtn').textContent=open?'Close':'Menu';
  gsap.to(menu,{clipPath:open?'circle(150% at calc(100% - 7vw) 46px)':'circle(0% at calc(100% - 7vw) 46px)',duration:.9,ease:'power4.inOut'});
  open?lenis.stop():lenis.start();
  if(open)gsap.from('#menu a',{yPercent:60,opacity:0,stagger:.06,delay:.35,duration:.8,ease:'power3.out'})}
$('#mbtn').onclick=toggle;
$$('.badge,footer a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const h=a.getAttribute('href');if(!h||h[0]!=='#')return;e.preventDefault();lenis.scrollTo(h.length>1?h:0,{duration:2})}));

/* ----- premium UI: menu image preview, button roll, link prefetch ----- */
const mp=$('#mprev'),mpi=mp&&mp.querySelector('img');
if(mp&&matchMedia('(pointer:fine)').matches){const qx=gsap.quickTo(mp,'x',{duration:.6,ease:'power3'}),qy=gsap.quickTo(mp,'y',{duration:.6,ease:'power3'});
  addEventListener('pointermove',e=>{qx(e.clientX+30);qy(e.clientY-mp.offsetHeight/2)});
  $$('#menu a').forEach(a=>{a.addEventListener('pointerenter',()=>{mpi.src=a.dataset.img;mp.classList.add('on')});a.addEventListener('pointerleave',()=>mp.classList.remove('on'))})}
$$('a[href$=".html"]').forEach(a=>a.addEventListener('pointerenter',()=>{if(a.dataset.pf)return;a.dataset.pf=1;const l=document.createElement('link');l.rel='prefetch';l.href=a.href;document.head.appendChild(l)},{once:true}));
/* fit big type to its box so nothing is ever cut off or overflows */
function fit(){$$('#hero h1,#end h2').forEach(h=>{h.style.fontSize='';const w=h.clientWidth;let m=0;$$('.ln').filter(l=>h.contains(l)).forEach(l=>m=Math.max(m,l.scrollWidth));if(m>w+1){h.style.fontSize=(parseFloat(getComputedStyle(h).fontSize)*w/m*.96)+'px'}});
  const b=$('footer .big');if(b){if(!b.firstElementChild)b.innerHTML='<span style="display:inline-block">'+b.textContent+'</span>';const s=b.firstElementChild;b.style.fontSize='100px';b.style.fontSize=(100*b.clientWidth/s.offsetWidth*.985)+'px'}}
let ft;const fitSoon=()=>{clearTimeout(ft);ft=setTimeout(()=>{fit();ScrollTrigger.refresh()},150)};
fit();addEventListener('resize',fitSoon);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{fit();ScrollTrigger.refresh()});
/* ----- scroll choreography ----- */
$$('[data-bg]').forEach(s=>ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%',onToggle:self=>self.isActive&&gsap.to(document.body,{backgroundColor:s.dataset.bg,duration:1.4,ease:'power2.out'})}));
if($('#mq')){const mqw=gsap.quickTo('#mq','skewX',{duration:.6});gsap.to('#mq',{xPercent:-33.3,ease:'none',scrollTrigger:{trigger:'.mq',start:'top bottom',end:'bottom top',scrub:true,onUpdate:()=>mqw(Math.max(-12,Math.min(12,window.__vel*.6)))}})}
if(mf){gsap.to('#mf .w',{color:'#12162b',stagger:.09,duration:.8,ease:'power2.out',scrollTrigger:{trigger:'#manifesto',start:'top 65%',once:true}});
  gsap.fromTo('#mf',{y:80,skewY:5},{y:0,skewY:0,duration:1.5,ease:'expo.out',scrollTrigger:{trigger:'#manifesto',start:'top 85%',once:true}})}
const tr=$('#track');
if(tr){const dist=()=>tr.scrollWidth-innerWidth;
  gsap.to(tr,{x:()=>-dist(),ease:'none',scrollTrigger:{trigger:'#work',start:'top top',end:()=>'+='+dist(),pin:true,scrub:1,invalidateOnRefresh:true}});
  $$('.card').forEach((c,i)=>{const st={trigger:'#work',start:'top top',end:()=>'+='+dist(),scrub:true};
    gsap.fromTo(c.querySelector('.art'),{xPercent:-7},{xPercent:7,ease:'none',scrollTrigger:st});
    gsap.fromTo(c,{rotateY:-16,y:i%2?60:-60},{rotateY:16,y:i%2?-60:60,ease:'none',scrollTrigger:st});
    c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();gsap.to(c,{rotateX:-((e.clientY-r.top)/r.height-.5)*12,duration:.5,overwrite:'auto'})});
    c.addEventListener('pointerleave',()=>gsap.to(c,{rotateX:0,duration:.8}));
    c.addEventListener('pointerenter',()=>gsap.fromTo('#tb',{attr:{baseFrequency:'.002 .004'}},{attr:{baseFrequency:'.012 .02'},duration:1.3,ease:'power3.out'}))})}
/* panel reveals: a different entrance on every page */
const PV={clip:{y:90,clipPath:'inset(100% 0 0 0)'},wipe:{clipPath:'inset(0 100% 0 0)',x:-30},slide:{x:-140,opacity:0},scale:{scale:.78,opacity:0},blur:{opacity:0,filter:'blur(18px)',y:30},tilt:{rotateX:-45,transformPerspective:900,opacity:0,y:60},pop:{scale:.4,opacity:0,ease:'back.out(1.8)'},drop:{y:-140,opacity:0},flick:{opacity:0,ease:'steps(6)'},glitch:{x:'random(-50,50)',opacity:0,ease:'steps(5)'},zoom:{scale:1.3,opacity:0}};
const pv=PV[PG.pv]||PV.clip;
const grp=(sel,trg)=>{if($(sel))gsap.from(sel,Object.assign({stagger:.13,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:trg,start:'top 88%',once:true}},pv))};
grp('.stp','#method .stg');grp('#stats>div','#stats');grp('.row','#caps .row');
$$('#stats b').forEach(b=>{const o={v:0};ScrollTrigger.create({trigger:b,start:'top 88%',once:true,onEnter:()=>gsap.to(o,{v:+b.dataset.n,duration:2.2,ease:'power3.out',onUpdate:()=>b.textContent=Math.round(o.v)})})});
if($('#caps'))gsap.fromTo('#caps',{scale:.9,borderRadius:'12vw'},{scale:1,borderRadius:'6vw',duration:1.6,ease:'expo.out',scrollTrigger:{trigger:'#caps',start:'top 92%',once:true}});
gsap.to('#qt .ln>span',{yPercent:0,stagger:.18,duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'#quote',start:'top 55%',once:true}});
gsap.fromTo('#end',{scale:.92},{scale:1,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:'#end',start:'top 92%',once:true}});
ScrollTrigger.create({trigger:'#end',start:'top 50%',once:true,onEnter:()=>show('#end .ch')});
gsap.from('footer .big',{yPercent:45,duration:1.6,ease:'expo.out',scrollTrigger:{trigger:'footer',start:'top 92%',once:true}});

/* ----- opening sequence ----- */
let quick;try{quick=sessionStorage.getItem('seen');sessionStorage.setItem('seen',1)}catch(e){}
const c={v:0};
gsap.timeline()
 .to(c,{v:100,duration:quick?.7:2.2,ease:'power2.inOut',onUpdate:()=>{$('#cnt').textContent=Math.round(c.v);$('#bar').style.width=c.v+'%'}})
 .call(()=>{$('#cnt').classList.remove('w');cover(tk,0,()=>{pre.style.display='none';window.__intro=1})})
 .call(()=>{lenis.start();show('#h1 .ch',.15)},null,'+=.35')
 .from('.sub>*,header>*',{opacity:0,y:30,stagger:.15,duration:1.1,ease:'expo.out'},'<.4');
})();
