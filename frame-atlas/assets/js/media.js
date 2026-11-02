/* Media showcase: each page has its own presentation (data-fx). Videos load lazily and fall back to their poster image. */
(function(){try{
const $=s=>document.querySelector(s),$$=s=>[].slice.call(document.querySelectorAll(s)),g=window.gsap,M=$('#media');if(!M)return;
const fx=M.dataset.fx,F=$$('#media figure'),mf=$('#media .mf');
const io=new IntersectionObserver(es=>es.forEach(e=>{const f=e.target,v=f.querySelector('video');
 if(e.isIntersecting){f.classList.add('in');if(v){if(!v.getAttribute('src')&&v.dataset.src){v.onloadeddata=()=>v.classList.add('on');v.onerror=()=>v.classList.remove('on');v.src=v.dataset.src}const p=v.play();if(p&&p.catch)p.catch(()=>{})}}
 else if(v&&!v.paused){v.pause()}}),{rootMargin:'160px',threshold:.12});
F.forEach(f=>io.observe(f));
const E={
 pan(){g.to(mf,{x:()=>-(mf.scrollWidth-innerWidth*.9),ease:'none',scrollTrigger:{trigger:M,start:'top 85%',end:'bottom 15%',scrub:.7,invalidateOnRefresh:true}})},
 spot(){M.addEventListener('pointermove',e=>{const r=mf.getBoundingClientRect();mf.style.setProperty('--mx',(e.clientX-r.left)+'px');mf.style.setProperty('--my',(e.clientY-r.top)+'px')})},
 shake(){const k=F.map(f=>g.quickTo(f,'skewY',{duration:.45})),y=F.map(f=>g.quickTo(f,'y',{duration:.55}));
  g.ticker.add(()=>{const v=window.__vel||0;k.forEach(q=>q(Math.max(-6,Math.min(6,v*.25))));y.forEach((q,i)=>q(Math.max(-28,Math.min(28,v*.8))*(i%2?1:-1)))});
  ScrollTrigger.create({trigger:M,start:'top 60%',once:true,onEnter:()=>g.fromTo(mf,{x:-16},{x:0,duration:1.4,ease:'elastic.out(1,.25)'})})},
 stack(){let o=F.slice();const lay=()=>o.forEach((f,i)=>{const d=i-(o.length-1);g.to(f,{rotate:d*4+(i%2?3:-3),x:d*26,y:d*-8,zIndex:i,scale:1+d*.03,duration:.9,ease:'expo.out',overwrite:'auto'})});lay();
  mf.addEventListener('click',()=>{const top=o[o.length-1];g.to(top,{x:460,rotate:14,duration:.45,ease:'power2.in',onComplete:()=>{o.unshift(o.pop());lay()}})})},
 grade(){const mw=F[1].querySelector('.mw'),raw=mw.querySelector('img.m').cloneNode();raw.className='raw';raw.removeAttribute('loading');mw.appendChild(raw);const h=document.createElement('i');h.className='hd';mw.appendChild(h);
  const set=p=>{raw.style.clipPath='inset(0 '+(100-p)+'% 0 0)';h.style.left=p+'%'},mv=e=>{const r=mw.getBoundingClientRect();set(Math.max(2,Math.min(98,(e.clientX-r.left)/r.width*100)))};set(50);
  mw.addEventListener('pointermove',mv);mw.addEventListener('pointerdown',mv);const o={p:4};ScrollTrigger.create({trigger:mw,start:'top 70%',once:true,onEnter:()=>g.to(o,{p:50,duration:2.4,ease:'power3.inOut',onUpdate:()=>set(o.p)})})},
 glitch(){F.forEach(f=>{const mw=f.querySelector('.mw');f.addEventListener('pointerenter',()=>{mw.style.filter='url(#rgb)';g.fromTo('#ro',{attr:{dx:16}},{attr:{dx:2},duration:.7,ease:'power4.out'});g.fromTo('#bo',{attr:{dx:-16}},{attr:{dx:-2},duration:.7,ease:'power4.out'})});f.addEventListener('pointerleave',()=>{mw.style.filter='none'})})},
 timeline(){let d=0,sx=0,sl=0;mf.addEventListener('pointerdown',e=>{d=1;sx=e.clientX;sl=mf.scrollLeft});addEventListener('pointerup',()=>d=0);mf.addEventListener('pointermove',e=>{if(d)mf.scrollLeft=sl-(e.clientX-sx)});
  const up=()=>{const c=mf.getBoundingClientRect(),m=c.left+c.width/2;F.forEach(f=>{const r=f.getBoundingClientRect(),k=1-Math.min(1,Math.abs(r.left+r.width/2-m)/c.width)*.2;f.style.transform='scale('+k+')';f.style.opacity=.55+.45*k})};mf.addEventListener('scroll',up,{passive:true});up()}
};
if(E[fx])E[fx]();
}catch(e){console.warn('media.js',e)}})();
