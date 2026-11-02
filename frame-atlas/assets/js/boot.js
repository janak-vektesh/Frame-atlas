/* Loads libraries with CDN fallbacks, then the site scripts. If anything fails, a plain readable page remains. */
(function(){var d=document,H=d.documentElement;
function fail(){H.classList.add('fail');H.classList.remove('lenis-stopped');var p=d.getElementById('pre');if(p)p.style.display='none'}
window.addEventListener('error',function(){setTimeout(function(){if(!window.__intro)fail()},3500)});
setTimeout(function(){if(!window.__intro)fail()},10000);
var L=[[['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js'],'THREE'],
[['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js','https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js'],'gsap'],
[['https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js','https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js'],'ScrollTrigger'],
[['https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js','https://unpkg.com/lenis@1.1.13/dist/lenis.min.js'],'Lenis']];
var F=['assets/js/core.js','assets/js/scenes.js','assets/js/media.js','assets/js/effects.js'];
function load(u,cb){var s=d.createElement('script');s.src=u;s.onload=function(){cb()};s.onerror=function(){cb()};d.head.appendChild(s)}
function seq(i){if(i<F.length)load(F[i],function(){seq(i+1)})}
function step(i){if(i===L.length)return seq(0);var l=L[i],j=0;(function t(){if(window[l[1]])return step(i+1);if(j>=l[0].length)return fail();load(l[0][j++],t)})()}
step(0)})();
