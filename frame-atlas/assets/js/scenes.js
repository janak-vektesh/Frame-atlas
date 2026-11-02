/* One WebGL concept per page. Objects live BEHIND the content and automatically move into empty space / fade when text is near. */
(function(){try{
const T=THREE,PG=window.PG||{},$=s=>document.querySelector(s);
let R;try{R=new T.WebGLRenderer({canvas:$('#gl'),antialias:true,alpha:true})}catch(e){return}
let dpr=Math.min(devicePixelRatio,1.75),ft=16,fl=0,lt=performance.now();R.setPixelRatio(dpr);
const sc=new T.Scene(),cam=new T.PerspectiveCamera(35,1,.1,60);cam.position.z=8;
const AC=new T.Color(PG.acc||'#3a4bff'),UT={value:0},FM=[];
const reg=(m,b)=>{m.userData.b=b==null?1:b;FM.push(m);return m};
const BS=(c,o)=>reg(new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,side:T.DoubleSide}),o);
const LN=(c,o)=>reg(new T.LineBasicMaterial({color:c,transparent:true,opacity:o}),o);
const GV='varying vec3 vN,vW;void main(){vec4 w=modelMatrix*vec4(position,1.);vW=w.xyz;vN=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*w;}';
const GF=`uniform float uT,uOp;uniform vec3 uA;varying vec3 vN,vW;
vec3 env(vec3 d){float az=atan(d.x,d.z)+uT*.05,el=d.y;
vec3 c=mix(vec3(.98,.97,.96),vec3(.8,.87,1.)*.9+uA*.1,smoothstep(-.4,.9,el));c=mix(c,vec3(1.,.84,.76),smoothstep(.1,-.9,el)*.7);
c=mix(c,uA*.22+vec3(.02),smoothstep(.18,.02,abs(el+.08))*.85);
c=mix(c,uA*.38,smoothstep(.24,.05,abs(sin(az*1.5)-.4))*smoothstep(.7,.3,abs(el-.15))*.8);
c+=smoothstep(.3,.1,abs(az+.7))*smoothstep(.45,.2,abs(el-.55))*1.4;return c;}
void main(){vec3 V=normalize(vW-cameraPosition),N=normalize(vN);if(!gl_FrontFacing)N=-N;
float f=pow(1.-abs(dot(-V,N)),3.);vec3 rf=reflect(V,N),col;
vec3 a=refract(V,N,1./1.35),b=refract(V,N,1./1.5),c=refract(V,N,1./1.7);
if(dot(a,a)<.1){a=rf;b=rf;c=rf;}
col=vec3(env(a).r,env(b).g,env(c).b);col=mix(col,env(rf),f*.75+.08);
col+=pow(max(dot(rf,normalize(vec3(-.4,.8,.6))),0.),90.)*1.6;
float lum=dot(col,vec3(.333));gl_FragColor=vec4(col,clamp(f*.8+(1.-lum)*.85+.07,0.,.95)*uOp);}`;
const GL=()=>reg(new T.ShaderMaterial({uniforms:{uT:UT,uOp:{value:1},uA:{value:AC}},vertexShader:GV,fragmentShader:GF,transparent:true,depthWrite:false,side:T.DoubleSide}),1);
const V3=(a,b,c)=>new T.Vector3(a,b,c||0),geo=a=>new T.BufferGeometry().setFromPoints(a);
const S={};
S.home=()=>{const g=new T.Group(),it=[new T.TorusKnotGeometry(.5,.17,160,24,2,3),new T.SphereGeometry(.4,40,32),new T.TorusGeometry(.42,.16,32,64),new T.OctahedronGeometry(.45),new T.DodecahedronGeometry(.42)].map(x=>{const m=new T.Mesh(x,GL());g.add(m);return m});
 return{g,u(t,P,v){it.forEach((m,i)=>{const k=t*.3+i*1.256;m.position.set(Math.cos(k)*1.1,Math.sin(k*1.3)*.8,Math.sin(k)*.5);m.rotation.x+=.01+Math.abs(v)*.002;m.rotation.y+=.013})}}};
S.frames=()=>{const g=new T.Group(),fr=[];
 for(let i=0;i<5;i++){const w=1.6-i*.26,h=w/2.39,l=new T.LineLoop(geo([V3(-w,-h),V3(w,-h),V3(w,h),V3(-w,h)]),LN(i?0x12162b:AC,.8-i*.12));l.position.z=-i*.35;g.add(l);fr.push(l)}
 g.add(new T.LineSegments(geo([V3(-.53,-.67,0),V3(-.53,.67,0),V3(.53,-.67,0),V3(.53,.67,0),V3(-1.6,-.22,0),V3(1.6,-.22,0),V3(-1.6,.22,0),V3(1.6,.22,0)]),LN(AC,.5)));
 const f=new T.Mesh(new T.SphereGeometry(.15,32,24),GL());g.add(f);const tg=[[-.53,.22],[.53,.22],[.53,-.22],[-.53,-.22]];
 return{g,u(t){const q=tg[Math.floor(t*.5)%4];f.position.x+=(q[0]-f.position.x)*.06;f.position.y+=(q[1]-f.position.y)*.06;fr.forEach((l,i)=>l.rotation.z=Math.sin(t*.4+i)*.04*i)}}};
S.rig=()=>{const g=new T.Group(),m=LN(0x12162b,.7);
 [-.45,.45].forEach(z=>g.add(new T.Line(geo([V3(-1.7,-.55,z),V3(1.7,-.55,z)]),m)));
 for(let i=0;i<14;i++){const x=-1.6+i*.246;g.add(new T.Line(geo([V3(x,-.55,-.5),V3(x,-.55,.5)]),m))}
 const c=new T.Group(),b=new T.Mesh(new T.BoxGeometry(.7,.45,.5),GL()),l=new T.Mesh(new T.CylinderGeometry(.16,.2,.4,24),GL());l.rotation.z=Math.PI/2;l.position.x=.5;c.add(b,l);c.position.y=-.2;g.add(c);
 return{g,u(t,P,v){c.position.x=Math.sin(P*7+t*.2)*1.1;c.rotation.z=-v*.004;c.rotation.y=Math.sin(t*.5)*.1}}};
S.iris=()=>{const g=new T.Group(),bl=[],m=BS(AC,.42);
 for(let i=0;i<6;i++){const b=new T.Mesh(new T.PlaneGeometry(1.1,.5),m);g.add(b);bl.push(b)}
 const rg=[1.25,.95].map(r=>{const o=new T.Mesh(new T.TorusGeometry(r,.035,16,96),GL());g.add(o);return o});
 return{g,u(t,P){const o=.5+.5*Math.sin(P*9+t*.5);bl.forEach((b,i)=>{const a=i/6*6.283+t*.05,d=.28+o*.38;b.position.set(Math.cos(a)*d,Math.sin(a)*d,i*.01);b.rotation.z=a+2.07});rg.forEach((r,i)=>{r.rotation.x=Math.sin(t*.3+i)*.5;r.rotation.y=t*.2*(i?-1:1)})}}};
S.beam=()=>{const g=new T.Group(),A=new T.Color('#ffb870'),B=new T.Color('#9fc4ff');
 const cm=reg(new T.ShaderMaterial({uniforms:{uOp:{value:1},uC:{value:new T.Color('#ffb870')}},vertexShader:'varying float vY;void main(){vY=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform float uOp;uniform vec3 uC;varying float vY;void main(){float t=clamp((vY+1.1)/2.2,0.,1.);gl_FragColor=vec4(uC,pow(t,1.3)*.42*uOp);}',transparent:true,depthWrite:false,side:T.DoubleSide}),1);
 const pv=new T.Group();pv.position.y=1.35;g.add(pv);
 const cone=new T.Mesh(new T.ConeGeometry(.8,2.2,48,1,true),cm);cone.position.y=-1.1;pv.add(cone);
 const lamp=new T.Mesh(new T.CylinderGeometry(.18,.28,.4,24),GL());lamp.position.y=.12;pv.add(lamp);
 const ball=new T.Mesh(new T.SphereGeometry(.42,48,32),GL());ball.position.y=-1.2;g.add(ball);
 return{g,u(t,P){cm.uniforms.uC.value.copy(A).lerp(B,P);pv.rotation.z=Math.sin(t*.5)*.14;ball.position.x=Math.sin(t*.5)*.3}}};
S.strip=()=>{const g=new T.Group(),fm=[],m=BS(AC,.38),em=LN(0x12162b,.7),bm=BS(0x12162b,.65),bars=[];
 for(let i=0;i<7;i++){const f=new T.Group();f.add(new T.Mesh(new T.PlaneGeometry(.62,.44),m),new T.LineLoop(geo([V3(-.31,-.22),V3(.31,-.22),V3(.31,.22),V3(-.31,.22)]),em));g.add(f);fm.push(f)}
 for(let i=0;i<18;i++){const b=new T.Mesh(new T.BoxGeometry(.06,1,.06),bm);b.position.set(-.9+i*.106,-1.05,0);g.add(b);bars.push(b)}
 return{g,u(t,P,v){fm.forEach((f,i)=>{const k=(i/7*8+t*.25+P*6)%8-4;f.position.set(k*.55,Math.sin(k*.8)*.25+.35,-Math.abs(k)*.1);f.rotation.y=-k*.12});bars.forEach((b,i)=>{const h=.12+.35*Math.abs(Math.sin(t*2+i*.6)*Math.sin(t*.7+i)+v*.01);b.scale.y=h*2;b.position.y=-1.05+h})}}};
S.shards=()=>{const g=new T.Group(),sh=[];
 for(let i=0;i<14;i++){const m=new T.Mesh(new T.TetrahedronGeometry(.16+Math.random()*.16),GL()),d=new T.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize();g.add(m);sh.push({m,d,s:Math.random()*2+1})}
 let e=0;return{g,u(t,P,v){e+=(Math.min(1,.15+Math.abs(v)*.05+(Math.sin(t*.9)>.92?.8:0))-e)*.07;sh.forEach(o=>{o.m.position.copy(o.d).multiplyScalar(.35+e*1.5);o.m.rotation.x+=.02*o.s*(1+e*4);o.m.rotation.y+=.017*o.s})}}};
S.clap=()=>{const g=new T.Group(),bm=BS(0xffffff,.85),em=LN(0x12162b,.8);
 const body=new T.Mesh(new T.BoxGeometry(1.7,1.1,.1),bm);body.add(new T.LineSegments(new T.EdgesGeometry(body.geometry),em));body.position.y=-.2;g.add(body);
 const pv=new T.Group();pv.position.set(-.85,.4,0);const arm=new T.Mesh(new T.BoxGeometry(1.7,.28,.1),bm);arm.position.x=.85;arm.add(new T.LineSegments(new T.EdgesGeometry(arm.geometry),em));pv.add(arm);
 const sm=BS(0x12162b,.8);for(let i=0;i<5;i++){const s=new T.Mesh(new T.PlaneGeometry(.2,.27),sm);s.position.set(-.6+i*.34,0,.06);arm.add(s)}
 g.add(pv);const bl=[0,1,2].map(()=>{const b=new T.Mesh(new T.SphereGeometry(.18,24,16),GL());g.add(b);return b});
 return{g,u(t){const c=(t*.4)%1;pv.rotation.z=c<.85?.75*c/.85:.75*Math.max(0,1-(c-.85)/.04);bl.forEach((b,i)=>b.position.set(1.4+i*.1,.9-i*.55+Math.sin(t+i)*.08,0))}}};
S.grid=()=>{const g=new T.Group(),n=8,im=new T.InstancedMesh(new T.BoxGeometry(.2,1,.2),reg(new T.MeshBasicMaterial({transparent:true,opacity:.8,depthWrite:false}),.8),n*n),d=new T.Object3D(),c=new T.Color();g.add(im);g.rotation.x=.9;
 return{g,u(t,P){let k=0;for(let i=0;i<n;i++)for(let j=0;j<n;j++){const h=.15+(Math.sin(i*.9+t*1.1)+Math.cos(j*.8+t*.8)+2)*.18;d.position.set((i-n/2+.5)*.3,h/2-.3,(j-n/2+.5)*.3);d.scale.set(1,h,1);d.updateMatrix();im.setMatrixAt(k,d.matrix);c.setHSL((i/n*.25+P*.9+j/n*.1)%1,.7,.62);im.setColorAt(k,c);k++}im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;g.rotation.y=t*.12}}};
S.cloud=()=>{const N=700,g=new T.Group(),A=[[],[],[]];
 for(let i=0;i<N;i++){const u=Math.random()*6.283,v=Math.acos(2*Math.random()-1),a=Math.random()*6.283,b=Math.random()*6.283;
  A[0].push(Math.sin(v)*Math.cos(u)*1.1,Math.sin(v)*Math.sin(u)*1.1,Math.cos(v)*1.1);
  A[1].push((Math.random()*2-1)*.9,(Math.random()*2-1)*.9,(Math.random()*2-1)*.9);
  A[2].push((1+.4*Math.cos(b))*Math.cos(a)*.85,(1+.4*Math.cos(b))*Math.sin(a)*.85,.55*Math.sin(b))}
 const pos=new Float32Array(N*3),ge=new T.BufferGeometry();ge.setAttribute('position',new T.BufferAttribute(pos,3));
 const mk=(c,o)=>{const p=new T.Points(ge,reg(new T.PointsMaterial({color:c,size:.035,transparent:true,opacity:o,depthWrite:false}),o));g.add(p);return p};
 mk(0x12162b,.8);const r=mk(0xff3b6b,.45),b=mk(0x2bd4ff,.45);
 return{g,u(t,P,v){const f=Math.min(2.999,P*2.999),i=Math.floor(f),k=f-i,e=k*k*(3-2*k),a0=A[i],a1=A[Math.min(2,i+1)];for(let q=0;q<N*3;q++)pos[q]=a0[q]+(a1[q]-a0[q])*e+(Math.random()-.5)*.012;ge.attributes.position.needsUpdate=true;const j=Math.abs(v)*.01;r.position.x=.03+j;b.position.x=-.03-j;g.rotation.y=t*.2}}};
S.reel=()=>{const g=new T.Group();
 [0,-.35].forEach(z=>{const d=new T.Mesh(new T.CylinderGeometry(1.05,1.05,.12,56),GL());d.rotation.x=Math.PI/2;d.position.z=z;g.add(d)});
 const hm=BS(0x12162b,.7);for(let i=0;i<6;i++){const a=i/6*6.283,h=new T.Mesh(new T.TorusGeometry(.26,.03,10,36),hm);h.position.set(Math.cos(a)*.6,Math.sin(a)*.6,.1);g.add(h)}
 const hub=new T.Mesh(new T.TorusGeometry(.12,.04,12,32),BS(AC,.9));hub.position.z=.1;g.add(hub);
 return{g,u(t,P){g.rotation.z=-t*.3-P*6;g.rotation.y=.5+Math.sin(t*.3)*.2}}};
let def;try{def=(S[PG.scene]||S.home)()}catch(e){def=S.home()}
const W=new T.Group();W.add(def.g);sc.add(W);

/* ambient particles: behaviour changes per page */
const spr=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)})();
const PN=320,pp=new Float32Array(PN*3),ps=new Float32Array(PN),pm=PG.pm||'drift',pge=new T.BufferGeometry();
const bk=pm==='bokeh';for(let i=0;i<PN;i++){pp[i*3]=(Math.random()*2-1)*7;pp[i*3+1]=(Math.random()*2-1)*3.6;pp[i*3+2]=-5+Math.random()*6;ps[i]=Math.random()}
pge.setAttribute('position',new T.BufferAttribute(pp,3));
const pmat=reg(new T.PointsMaterial({map:spr,color:AC,size:bk?.5:.07,transparent:true,opacity:bk?.16:.42,depthWrite:false}),bk?.16:.42);sc.add(new T.Points(pge,pmat));

/* layout-aware placement */
const SEL='h1,h2,h3,.sub p,#mf,.stp,.row,#stats>div,.card,.cap,.st-b p,.vf,.ctl,.pill,#qt,.scope-cap,figure,.tag,.intro p,.mag,.badge';
const PA=[[.66,.28],[-.72,.25],[.7,-.15],[-.7,-.3],[.7,.2],[.68,-.2]],PB=[[-.68,.3],[.72,.22],[-.72,-.1],[.7,-.3],[-.7,.2],[-.66,-.2]],PC=[[.7,.35],[.7,-.05],[-.72,-.2],[-.72,.3],[.7,.1],[.7,-.3]];
const path=[PA,PB,PC][[].reduce.call(String(PG.page||'x'),(a,c)=>a+c.charCodeAt(0),0)%3];
const hh=Math.tan(17.5*Math.PI/180)*8;let hw=hh,rc=[],fr=0,P=0,PT=0,kF=1,cur={x:.66,y:.28},tg={x:.66,y:.28},sx=.5;
const mob=()=>innerWidth<800;
function size(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();hw=hh*cam.aspect}addEventListener('resize',size);size();
ScrollTrigger.create({trigger:document.body,start:0,end:'max',onUpdate:s=>PT=s.progress});
const ms={x:0,y:0};addEventListener('pointermove',e=>{ms.x=e.clientX/innerWidth*2-1;ms.y=-(e.clientY/innerHeight)*2+1});
const ez=gsap.parseEase('power2.inOut');
function scan(rad){rc=[].slice.call(document.querySelectorAll(SEL)).map(e=>e.getBoundingClientRect()).filter(r=>r.width>24&&r.height>12&&r.bottom>-40&&r.top<innerHeight+40);
 const n=5,i=Math.min(Math.floor(P*n),n-1),f=ez(P*n-i),a=path[i],b=path[i+1],px=a[0]+(b[0]-a[0])*f,py=a[1]+(b[1]-a[1])*f;let best=1e9,bx=tg.x,by=tg.y;
 for(let cx=-.88;cx<=.88;cx+=.16)for(let cy=-.78;cy<=.78;cy+=.26){const X=(cx+1)/2*innerWidth,Y=(1-cy)/2*innerHeight;let free=true;
  for(let k=0;k<rc.length;k++){const r=rc[k],dx=Math.max(r.left-X,0,X-r.right),dy=Math.max(r.top-Y,0,Y-r.bottom);if(Math.hypot(dx,dy)<rad*.9){free=false;break}}
  if(free){const d=(cx-px)*(cx-px)+(cy-py)*(cy-py);if(d<best){best=d;bx=cx;by=cy}}}
 tg.x=bx;tg.y=by}
gsap.ticker.add(t=>{try{
 const nw=performance.now();ft+=((nw-lt)-ft)*.05;lt=nw;if(++fl%90===0){if(ft>24&&dpr>1){dpr=Math.max(1,dpr-.25);R.setPixelRatio(dpr);size()}else if(ft<13&&dpr<Math.min(devicePixelRatio,1.75)){dpr+=.25;R.setPixelRatio(dpr);size()}}
 const v=window.__vel||0;UT.value=t;P+=(PT-P)*.06;
 const s0=(mob()?.34:.5)*(1-Math.min(.25,Math.abs(v)*.004));sx+=(s0-sx)*.1;const rad=1.5*sx*innerHeight/(2*hh);
 if(fr++%8===0)scan(rad);
 cur.x+=(tg.x-cur.x)*.045;cur.y+=(tg.y-cur.y)*.045;
 W.position.set(cur.x*hw,cur.y*hh+Math.sin(t*.7)*.08,0);W.scale.setScalar(sx);
 W.rotation.y+=((ms.x*.4)-W.rotation.y)*.05;W.rotation.x+=((-ms.y*.25)-W.rotation.x)*.05;
 const X=innerWidth/2+W.position.x/hw*innerWidth/2,Y=innerHeight/2-W.position.y/hh*innerHeight/2;let hit=false;
 for(let k=0;k<rc.length;k++){const r=rc[k],dx=Math.max(r.left-X,0,X-r.right),dy=Math.max(r.top-Y,0,Y-r.bottom);if(Math.hypot(dx,dy)<rad*.7){hit=true;break}}
 kF+=((hit?.06:1)-kF)*.06;FM.forEach(m=>{const o=m.userData.b*kF;if(m.uniforms)m.uniforms.uOp.value=o;else m.opacity=pm&&m===pmat?pmat.userData.b:o});
 def.u(t,P,v);
 const a=pge.attributes.position.array;
 for(let i=0;i<PN;i++){const j=i*3,q=ps[i];
  if(pm==='rise'||pm==='sparks'){a[j+1]+=(pm==='sparks'?.02+q*.03:.004+q*.006);a[j]+=pm==='sparks'?Math.sin(t*3+i)*.004:0;if(a[j+1]>3.8){a[j+1]=-3.8;a[j]=(Math.random()*2-1)*7}}
  else if(pm==='streak'){a[j+2]+=.03+q*.05+Math.abs(v)*.002;if(a[j+2]>6){a[j+2]=-8}}
  else if(pm==='grain'||pm==='jit'){if(Math.random()<.06){a[j]=(Math.random()*2-1)*7;a[j+1]=(Math.random()*2-1)*3.6}}
  else{a[j]+=Math.sin(t*.3+i)*.0025;a[j+1]+=Math.cos(t*.25+i*.7)*.0025}}
 pge.attributes.position.needsUpdate=true;
 R.render(sc,cam)}catch(e){console.warn('scene',e);$('#gl').style.display='none'}});
}catch(e){console.warn('scenes.js',e)}})();
