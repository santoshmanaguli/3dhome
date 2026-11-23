import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { R } from './data.js';
import './style.css';

new MutationObserver(()=>{for(const c of document.querySelectorAll('.stack td:not([data-l])')){let i=0,p=c;while(p=p.previousElementSibling)i+=p.colSpan;c.dataset.l=c.closest('table').rows[0].cells[i]?.textContent||''}}).observe(document,{childList:true,subtree:true})

const D=document,$=s=>D.querySelector(s);


const view=$('#view');
let ok=true;
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true})}catch(e){ok=false}
const S={floor:"ground",mode:"now",vastu:false,labels:true,roof:true,hour:10,sel:"court"};

function li(t){return "<li>"+t.replace(/\(([^)]*₹[^)]*)\)/g,'<span class="cost">$1</span>')+"</li>"}
function renderInfo(){const r=R[S.sel];$('#info').innerHTML='<div class="ihead"><h2>'+r.name+'</h2><span class="zone">'+r.zone+'</span></div><div class="cols"><div class="now"><h3>Now</h3><ul>'+r.now.map(li).join('')+'</ul></div><div class="fix"><h3>Change</h3><ul>'+r.fix.map(li).join('')+'</ul></div></div>'+(r.vastu?'<p class="vastu"><b>Vastu</b>'+r.vastu+'</p>':'');
 D.querySelectorAll('#chips button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.id===S.sel))}
$('#chips').innerHTML=Object.keys(R).map(k=>'<button data-id="'+k+'" aria-pressed="false">'+R[k].name+'</button>').join('');

if(!ok){$('#err').style.display='grid';renderInfo();D.querySelectorAll('#chips button').forEach(b=>b.onclick=()=>{S.sel=b.dataset.id;renderInfo()})}
else{
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
view.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const skyC=D.createElement("canvas");skyC.width=2;skyC.height=256;const skyG=skyC.getContext("2d"),skyT=new THREE.CanvasTexture(skyC);
scene.background=skyT;scene.fog=new THREE.Fog(0xe6eef2,150,380);
function paintSky(a,b){const gr=skyG.createLinearGradient(0,0,0,256);gr.addColorStop(0,a);gr.addColorStop(1,b);skyG.fillStyle=gr;skyG.fillRect(0,0,2,256);skyT.needsUpdate=true}
const cam=new THREE.PerspectiveCamera(40,1,.5,600);cam.position.set(150,120,165);
const ctl=new OrbitControls(cam,renderer.domElement);
ctl.target.set(17,3,9);ctl.enableDamping=true;ctl.maxPolarAngle=Math.PI*.48;ctl.enableZoom=false;ctl.screenSpacePanning=false;ctl.rotateSpeed=.7;ctl.panSpeed=.8;ctl.dampingFactor=.08;

function ctex(n,draw){const c=D.createElement("canvas");c.width=c.height=n;draw(c.getContext("2d"),n);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t}
const rnd=(a,b)=>a+Math.random()*(b-a);
const speck=(base,cols,count,rmax)=>(g,n)=>{g.fillStyle=base;g.fillRect(0,0,n,n);for(let i=0;i<count;i++){g.fillStyle=cols[i%cols.length];g.globalAlpha=rnd(.35,.9);g.beginPath();g.arc(rnd(0,n),rnd(0,n),rnd(.6,rmax),0,7);g.fill()}g.globalAlpha=1};
const tileT=ctex(256,(g,n)=>{speck("#9d9a92",["#6f6b63","#cfcbc1","#57534c","#b8a990"],1100,2.3)(g,n);g.strokeStyle="rgba(55,50,44,.4)";g.lineWidth=3;g.strokeRect(0,0,n,n)});
const concT=ctex(256,speck("#b3ada2",["#9c968b","#c9c3b8","#a69f94","#8f897e"],2600,1.7));
const grassT=ctex(256,speck("#7f8b5d",["#6a7a4a","#97a46c","#8c7b59","#5d6b3f"],3200,2.3));grassT.repeat.set(90,90);
const tinT=ctex(128,(g,n)=>{for(let y=0;y<n;y++){const v=Math.sin(y/n*Math.PI*16),c=Math.round(168+v*34);g.fillStyle="rgb("+c+","+(c+5)+","+(c+9)+")";g.fillRect(0,y,n,1)}});tinT.repeat.set(1,2);
const mat=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.9,metalness:0},o||{}));
const wallMat=mat(0xd4cf95),floorMat=mat(0xffffff,{map:tileT}),courtMat=mat(0xffffff,{map:concT}),conc=mat(0xd2ccc1,{map:concT}),ledge=mat(0xeae5db),doorM=mat(0x6e4429,{roughness:.7}),lineMat=new THREE.LineBasicMaterial({color:0x2e2a23,transparent:true,opacity:.22}),
 slab1M=mat(0xcfc9be,{transparent:true}),slab2M=mat(0xcfc9be,{transparent:true}),
 glass=mat(0x9cc7da,{transparent:true,opacity:.3,roughness:.1}),wood=mat(0x5b3b27),dark=mat(0x2b2b2b),white=mat(0xefefeb),
 blue=mat(0x2a6fc4),card=mat(0xb98b56),tinM=mat(0xffffff,{map:tinT,metalness:.3,roughness:.55,side:THREE.DoubleSide,transparent:true}),
 polyM=mat(0xf2fbfa,{transparent:true,opacity:.3,roughness:.2,side:THREE.DoubleSide}),dampM=mat(0x6d6242),
 leaf=mat(0x48703a,{flatShading:true}),trunk=mat(0x8a7a66),grass=mat(0xffffff,{map:grassT}),road=mat(0x3b3d41),mattress=mat(0xd6c8ae),
 neighA=mat(0xbfd8cc,{transparent:true,opacity:.16,depthWrite:false}),neighB=mat(0xd8c7b2,{transparent:true,opacity:.16,depthWrite:false}),
 gateM=mat(0x8a4b22),bound=mat(0xd9b8a6),mari=mat(0xf0a020,{emissive:0x8a4200,emissiveIntensity:.5}),
 fanM=mat(0x1f6f68,{emissive:0x0e3a36,emissiveIntensity:.6}),ledM=mat(0xffffff,{emissive:0xfff4e0,emissiveIntensity:1}),
 curtain=mat(0x6b2b2b),clothes=[0xc0392b,0x2e86c1,0x7d3c98,0xd4ac0d,0x5d6d7e].map(c=>mat(c));

const mosaic=mat(0x6e645a),tileW=mat(0xf1f2f6);
const G={};["site","g","u","gNow","gFix","uNow","uFix","xNow","xFix","vastu"].forEach(k=>G[k]=new THREE.Group());
scene.add(G.site,G.g,G.u,G.vastu);G.g.add(G.gNow,G.gFix);G.u.add(G.uNow,G.uFix);G.site.add(G.xNow,G.xFix);

function bx(x1,y1,z1,x2,y2,z2,m,p,sh){const o=new THREE.Mesh(new THREE.BoxGeometry(Math.abs(x2-x1),Math.abs(y2-y1),Math.abs(z2-z1)),m);
 o.position.set((x1+x2)/2,(y1+y2)/2,(z1+z2)/2);o.castShadow=sh!==false;o.receiveShadow=true;p.add(o);return o}
function cyl(x,z,r,h,y,m,p){const o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,18),m);o.position.set(x,y+h/2,z);o.castShadow=o.receiveShadow=true;p.add(o);return o}
function wall(p,ax,c,a,b,ops,H,y0){const t=.5;let cur=a;
 const seg=(s,e,y1,y2)=>{if(e-s<.02||y2-y1<.02)return;const o=ax==="x"?bx(s,y0+y1,c-t/2,e,y0+y2,c+t/2,wallMat,p):bx(c-t/2,y0+y1,s,c+t/2,y0+y2,e,wallMat,p);o.add(new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry),lineMat))};
 (ops||[]).slice().sort((u,v)=>u[0]-v[0]).forEach(([s,e,sill,head,k])=>{seg(cur,s,0,H);seg(s,e,0,sill);seg(s,e,head,H);
  if(k==="w"){ax==="x"?bx(s,y0+sill,c-.04,e,y0+head,c+.04,glass,p,false):bx(c-.04,y0+sill,s,c+.04,y0+head,e,glass,p,false);
   ax==="x"?bx(s-.25,y0+sill-.14,c-.5,e+.25,y0+sill,c+.5,ledge,p):bx(c-.5,y0+sill-.14,s-.25,c+.5,y0+sill,e+.25,ledge,p);
   ax==="x"?bx(s-.3,y0+head,c-.75,e+.3,y0+head+.16,c+.75,ledge,p):bx(c-.75,y0+head,s-.3,c+.75,y0+head+.16,e+.3,ledge,p)}
  if(k==="d"&&head>5){const w=e-s,lf=new THREE.Mesh(new THREE.BoxGeometry(w-.1,head-.08,.14),doorM);lf.castShadow=lf.receiveShadow=true;lf.position.set(w/2,head/2,0);
   const pv=new THREE.Group();ax==="x"?pv.position.set(s,y0,c):pv.position.set(c,y0,s);pv.rotation.y=ax==="x"?-1.2:-Math.PI/2-1.2;pv.add(lf);p.add(pv)}cur=e});seg(cur,b,0,H)}

const pick=[],floors={};
function fl(id,x1,z1,x2,z2,y,p,m){const base=m||floorMat,mm=base.clone(),u=base===floorMat?.82:7;if(mm.map){mm.map=mm.map.clone();mm.map.needsUpdate=true;mm.map.repeat.set(Math.abs(x2-x1)/u,Math.abs(z2-z1)/u)}const o=bx(x1,y,z1,x2,y+.12,z2,mm,p,false);o.userData.room=id;pick.push(o);(floors[id]=floors[id]||[]).push(o);return o}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
const labels=[];
const LQ=[],dots={g:"#1f8f84",u:"#e8891c",x:"#5b6b7a",og:"#a7b0b8",ou:"#a7b0b8",ox:"#a7b0b8"};
function lab(){LQ.push(arguments)}
function mkLab(id,text,x,y,z,tag,p,sc,dot){const c=D.createElement("canvas");c.width=1024;c.height=256;const g=c.getContext("2d");
 g.font="600 74px Mukta, system-ui, sans-serif";dot=dot===undefined?dots[tag]:dot;const tw=g.measureText(text).width,w=Math.min(1000,tw+(dot?150:100)),x0=(1024-w)/2;
 g.shadowColor="rgba(0,0,0,.28)";g.shadowBlur=22;g.shadowOffsetY=8;g.fillStyle="rgba(255,255,255,.95)";rr(g,x0,50,w,148,74);g.fill();g.shadowColor="transparent";
 if(dot){g.fillStyle=dot;g.beginPath();g.arc(x0+64,124,18,0,7);g.fill()}
 g.fillStyle="#1f1c18";g.textBaseline="middle";g.fillText(text,x0+(dot?104:50),128);
 const tx=new THREE.CanvasTexture(c);tx.anisotropy=4;const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tx,depthTest:false,transparent:true,fog:false}));
 const k=sc||1;sp.scale.set(9.5*k,2.375*k,1);sp.position.set(x,y,z);sp.renderOrder=10;sp.userData={room:id,tag:tag};(p||scene).add(sp);labels.push(sp);if(id)pick.push(sp);return sp}

/* site */
bx(-300,-.4,-300,300,0,300,grass,G.site,false);bx(39.5,0,-300,60.5,.04,300,road,G.site,false);bx(40.1,.04,-300,40.5,.06,300,ledge,G.site,false);
fl("court",24.2,-3.2,38.5,24.6,0,G.site,courtMat);fl("spass",-3.4,21.65,24.2,24.6,0,G.site,courtMat);fl("pass",-3.4,-3.2,24.2,0,0,G.site,courtMat);fl("pass",-3.4,0,0,21.65,0,G.site,courtMat);
bx(38.3,0,-3.2,38.8,4.5,9,bound,G.site);bx(38.3,0,14,38.8,4.5,24.6,bound,G.site);bx(38.4,0,9,38.6,4.2,14,gateM,G.site);
bx(24.2,0,-3.4,38.8,4.5,-3.2,bound,G.site);bx(-3.6,0,24.6,38.8,4.5,24.8,bound,G.site);bx(-3.6,0,-3.2,-3.4,6,24.6,bound,G.site);
bx(-10,0,-18,38.8,13,-3.6,neighB,G.site);bx(-10,0,24.9,38.8,32,38,neighA,G.site);bx(-24,0,-3.2,-3.8,18,22.3,neighB,G.site);
const roofP=[];for(let i=0;i<6;i++){const z1=-3.2+i*4.63,z2=z1+4.63;[[24.3,30.5,true],[30.5,37.8,false]].forEach(([x1,x2,n])=>{const o=bx(x1,10.6,z1+.03,x2,10.75,z2-.03,tinM,G.site);o.userData.near=n;roofP.push(o)})}
[[37.6,-3],[37.6,9],[37.6,24.3]].forEach(([x,z])=>bx(x-.15,0,z-.15,x+.15,10.6,z+.15,gateM,G.site));
cyl(36.3,1.2,.5,7,0,trunk,G.site);
const crownA=new THREE.Mesh(new THREE.IcosahedronGeometry(7,1),leaf);crownA.position.set(35.8,12.5,1.2);crownA.castShadow=true;G.xNow.add(crownA);
const crownB=new THREE.Mesh(new THREE.IcosahedronGeometry(4.6,1),leaf);crownB.position.set(36.6,11.8,1.4);crownB.castShadow=true;G.xFix.add(crownB);
const palm=new THREE.Group();palm.position.set(33,0,17);palm.rotation.z=.1;G.site.add(palm);cyl(0,0,.55,30,0,trunk,palm);
for(let i=0;i<8;i++){const lf=new THREE.Mesh(new THREE.BoxGeometry(7,.15,1.1),leaf);const a=i/8*Math.PI*2;lf.position.set(Math.cos(a)*3,29.4,Math.sin(a)*3);lf.rotation.y=-a;lf.rotation.z=-.35;lf.castShadow=true;palm.add(lf)}
for(let i=0;i<8;i++){const x2=7.5-i*.9375;bx(x2-.9375,0,-3.1,x2,(i+1)*.656,-.3,conc,G.site)}
bx(-3.3,0,-3.1,0,5.25,0,conc,G.site);
for(let i=0;i<8;i++)bx(-3.3,0,i,-.4,5.25+(i+1)*.656,i+1,conc,G.site);
bx(-3.3,0,8,0,10.5,11.6,conc,G.site);

/* ground floor */
const H=10,gw=(ax,c,a,b,ops)=>wall(G.g,ax,c,a,b,ops,H,0);
gw("x",0,-.25,24.45,[[2,3.5,5,6.5,"w"],[8,10.5,0,7,"d"],[17,21,3,7,"w"]]);
gw("z",24.2,0,21.4,[[3,7,3,7,"w"],[12,15,0,7.5,"d"],[16.5,20,3,7,"w"]]);
gw("x",21.4,-.25,24.45,[[4,8,3,7,"w"],[17,21,3,7,"w"]]);
gw("z",0,0,21.4,[[14,18,3,7,"w"]]);
gw("z",13.5,0,21.4,[[3,6.5,0,7.5,"a"],[14,17.5,0,8,"a"]]);
gw("x",10.3,0,24.2,[[8,11.5,0,8,"a"],[15,18,0,7,"d"]]);
gw("z",6,0,10.3,[[1.5,4,0,7,"d"],[6.5,8.5,0,7,"d"]]);
gw("x",5,0,6,[]);
fl("hall",13.5,10.3,24.2,21.4,0,G.g);fl("bed",13.5,0,24.2,10.3,0,G.g);fl("kitchen",0,10.3,13.5,21.4,0,G.g);
fl("util",6,0,13.5,10.3,0,G.g);fl("bath",0,0,6,5,0,G.g,mosaic);fl("toilet",0,5,6,10.3,0,G.g,tileW);
const slab1=bx(-.25,10,-.25,24.45,10.5,21.65,slab1M,G.site);

/* upstairs */
const y0=10.5,uw=(ax,c,a,b,ops,h)=>wall(G.u,ax,c,a,b,ops,h||9,y0);
uw("x",10.3,6.5,24.45,[[19,22,0,7,"d"]]);uw("z",24.2,10.3,21.4,[[13,17,3,7,"w"]]);uw("x",21.4,6.5,24.45,[[8.5,11.5,3,7,"w"],[16,20,3,7,"w"]]);
uw("z",6.75,10.3,21.4,[[12.5,15,0,7,"d"],[17,19.5,3,7,"w"]]);uw("z",13.5,10.3,21.4,[[11,13.5,0,7,"d"]]);
uw("x",0,-.25,6.25,[[2,3.5,5,6.5,"w"]]);uw("z",0,0,10.3,[]);uw("x",10.3,-.25,6.25,[]);uw("z",6,0,10.3,[[4,6.5,0,7,"d"]]);
uw("x",0,6,24.45,[],3);uw("z",24.2,0,10.3,[],3);uw("z",0,10.3,21.4,[[10.3,11.6,0,3,"d"]],3);uw("x",21.4,-.25,6.75,[],3);
fl("study",13.5,10.3,24.2,21.4,y0,G.u);fl("room2",6.75,10.3,13.5,21.4,y0,G.u);fl("upwash",0,0,6,10.3,y0,G.u);
fl("terrace",6,0,24.2,10.3,y0,G.u,courtMat);fl("terrace",0,10.3,6.75,21.4,y0,G.u,courtMat);
const slab2=[bx(6.5,19.5,10.05,24.45,20,21.65,slab2M,G.u),bx(-.25,19.5,-.25,6.25,20,10.55,slab2M,G.u)];

/* furniture and objects */
const steel=mat(0x9aa3ab,{metalness:.5,roughness:.4}),plastic=mat(0xe9e1cf),red=mat(0xb8312a),
 ropeM=mat(0xd27a2c),black=mat(0x1c1c1c),soil=mat(0x5a4632),purple=mat(0x7b2f6b),sofaM=mat(0x7a5236),granite=mat(0x3a3430),bagM=mat(0xd9d4c7);
const ol=(t,x,y,z,tag,p)=>lab(null,t,x,y,z,tag,p||scene,.6);
const fanW=mat(0xcfcac0);function fan(x,y,z,p){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);const rod=new THREE.Mesh(new THREE.CylinderGeometry(.06,.06,.8,6),white);rod.position.y=.4;g.add(rod);
 g.add(new THREE.Mesh(new THREE.CylinderGeometry(.35,.35,.25,12),white));for(let i=0;i<3;i++){const b=new THREE.Mesh(new THREE.BoxGeometry(1.5,.04,.32),fanW),a=i*2.094;b.position.set(Math.cos(a)*.95,0,Math.sin(a)*.95);b.rotation.y=-a;g.add(b)}}
function chair(x,z,ry,p,y){const g=new THREE.Group();g.position.set(x,y||0,z);g.rotation.y=ry||0;p.add(g);bx(-.8,1.4,-.8,.8,1.55,.8,plastic,g);bx(-.8,1.55,.62,.8,3,.8,plastic,g);
 [[-.7,-.7],[.7,-.7],[-.7,.7],[.7,.7]].forEach(([a,b])=>bx(a-.06,0,b-.06,a+.06,1.4,b+.06,plastic,g))}
function bike(x,z,p){const g=new THREE.Group();g.position.set(x,0,z);p.add(g);const tg=new THREE.TorusGeometry(.95,.18,8,20);
 [-2,2].forEach(dx=>{const w=new THREE.Mesh(tg,black);w.position.set(dx,.95,0);w.castShadow=true;g.add(w)});
 bx(-2,1.4,-.2,2,1.7,.2,red,g);bx(-.2,1.7,-.35,1.3,2.6,.35,red,g);bx(-1.9,2.3,-.4,-.1,2.7,.4,black,g);bx(1.8,1,-.08,2.05,3.4,.08,steel,g);bx(1.9,3.3,-1,2.05,3.45,1,black,g);bx(-.5,.8,-.35,1,1.5,.35,steel,g)}
function pot(x,z,r,p,y){cyl(x,z,r,1.4,y||0,white,p);const b=new THREE.Mesh(new THREE.IcosahedronGeometry(r*1.5,0),leaf);b.position.set(x,(y||0)+2.5,z);b.castShadow=true;p.add(b)}
function damp(x1,z1,x2,z2,y1,y2){const t=.34;[[x1+.25,z1+.25,x2-.25,z1+t],[x1+.25,z2-t,x2-.25,z2-.25],[x1+.25,z1+.25,x1+t,z2-.25],[x2-t,z1+.25,x2-.25,z2-.25]].forEach(([a,b,c,d])=>bx(a,y1,b,c,y2,d,dampM,G.gNow,false))}
function dado(x1,z1,x2,z2,h){const t=.3;[[x1+.25,z1+.25,x2-.25,z1+t],[x1+.25,z2-t,x2-.25,z2-.25],[x1+.25,z1+.25,x1+t,z2-.25],[x2-t,z1+.25,x2-.25,z2-.25]].forEach(([a,b,c,d])=>bx(a,0,b,c,h,d,tileW,G.g,false))}

/* hall */
bx(16.6,0,19.2,22.6,1.4,21.1,sofaM,G.g);bx(16.6,1.4,20.5,22.6,3,21.1,sofaM,G.g);bx(16.6,1.4,19.2,17.1,2.2,20.5,sofaM,G.g);bx(22.1,1.4,19.2,22.6,2.2,20.5,sofaM,G.g);
bx(18.2,0,16.8,21,1.3,18.2,wood,G.g);bx(19.2,0,10.6,23,1.8,11.9,wood,G.g);bx(19.7,1.8,11.15,22.5,3.8,11.3,black,G.g);
chair(15.1,19.8,Math.PI/2,G.g);fan(18.8,9.1,15.8,G.g);
for(let i=0;i<10;i++){const zz=i<5?18.2+(i%3)*.95:10.9+(i%3)*.95,yy=5+(i%2)*1.4;bx(13.76,yy,zz,13.84,yy+1.1,zz+.85,clothes[i%5],G.gNow,false)}
[[18.6],[19.8]].forEach(([z])=>bx(13.76,5.6,z,13.84,6.8,z+1,clothes[3],G.gFix,false));
bx(13.4,0,14,13.6,8,17.5,curtain,G.gNow);
ol("Sofa",19.6,4.2,20.2,"og",G.g);ol("TV",21.1,5,11.2,"og",G.g);ol("Frames: 10 now",14.2,8.2,19.2,"og",G.gNow);ol("Arch curtain",13.6,8.8,15.8,"og",G.gNow);

/* bedroom */
bx(17.4,0,4,23.7,1.4,9.2,wood,G.g);bx(23.4,1.4,4,23.7,3.6,9.2,wood,G.g);bx(17.6,1.4,4.2,23.4,1.9,9,mattress,G.g);
bx(22.2,1.9,4.6,23.2,2.3,6.3,white,G.g);bx(22.2,1.9,6.9,23.2,2.3,8.6,white,G.g);
bx(13.8,0,.35,16.6,6.4,2.2,steel,G.g);bx(13.75,7.4,.25,24,7.6,2.3,conc,G.g);fan(18.8,9.1,5.1,G.g);
[[18.5,6],[20.2,7.4],[19.4,4.6]].forEach(([x,z],i)=>bx(x,1.9,z,x+1.4,2.6,z+1.1,clothes[i],G.gNow));bx(20.6,1.9,5,21.8,2,5.9,black,G.gNow);
[[14,.4],[16.2,.4],[19,.4],[21.4,.4]].forEach(([x,z])=>bx(x,7.6,z,x+2,9.2,z+1.8,card,G.gNow));
bx(13.8,0,7.6,14.9,4,9.8,mat(0x9a8d7a),G.gFix);
ol("Bed · head east",20.4,4.3,6.6,"og",G.g);ol("Steel almirah",15.2,5.4,1.3,"og",G.g);ol("Cartons on loft",19,9.8,1.3,"og",G.gNow);ol("Clothes rack",14.4,5.2,8.7,"og",G.gFix);

/* kitchen */
bx(.3,0,19.3,9.6,2.8,21.15,conc,G.g);bx(.3,0,12,2.3,2.8,19.3,conc,G.g);bx(.3,2.8,19.3,9.6,2.95,21.15,granite,G.g);bx(.3,2.8,12,2.3,2.95,19.3,granite,G.g);
bx(7.4,2.95,19.7,9.2,3.15,20.8,black,G.g);cyl(7.9,20.25,.28,.06,3.15,steel,G.g);cyl(8.7,20.25,.28,.06,3.15,steel,G.g);
bx(.5,2.6,13,1.9,2.97,14.8,steel,G.g);bx(.35,2.95,13.8,.55,3.8,14,steel,G.g);
bx(11.2,0,19.2,13.2,5.5,21.1,white,G.g);cyl(10.3,20.4,.5,2.1,0,red,G.g);
bx(.3,4.8,18.3,.9,6.4,19.1,white,G.g);bx(1,5.6,20.5,6.6,5.75,21.15,steel,G.g);[1.6,2.6,3.6,4.6,5.6].forEach((x,i)=>cyl(x,20.85,.3,.5,5.75,steel,G.g));
fan(6.7,9.1,15.8,G.g);
bx(5.4,4,20.6,6.9,5.6,21.15,mari,G.gNow);bx(11.6,4,10.6,13.1,5.6,11.3,mari,G.gFix);bx(12.1,5.6,10.7,12.6,5.8,11.1,mat(0xffd27a,{emissive:0xffa000,emissiveIntensity:1}),G.gFix);
ol("Stove",8.3,4.7,20.2,"og",G.g);ol("Fridge",12.2,6.6,20.1,"og",G.g);ol("Sink",1.2,4.3,13.9,"og",G.g);ol("Water filter",.6,7.4,18.7,"og",G.g);ol("Gas cylinder",10.3,3.1,20.4,"og",G.g);
ol("Pooja (next to stove)",6.1,6.6,20.9,"og",G.gNow);ol("Pooja shelf (NE of kitchen)",12.3,6.8,11,"og",G.gFix);

/* utility */
bx(11.6,0,7.9,13.2,3,9.9,white,G.g);bx(11.8,3,8.1,13,3.05,9.7,mat(0x555555),G.g);cyl(12.3,1.4,1,3,0,blue,G.g);cyl(12.3,1.4,1.05,.15,3,blue,G.gFix);
{const t=new THREE.Mesh(new THREE.TorusGeometry(.7,.09,6,20),ropeM);t.rotation.x=Math.PI/2;t.position.set(10.6,.2,1.8);G.gNow.add(t)}
cyl(9.6,4.6,.65,1.5,0,plastic,G.g);chair(7.3,9.3,0,G.g);
bx(10,0,5,11.4,.9,6.4,mat(0xeeeeee),G.gNow);bx(10.4,0,6.8,11.6,1.2,7.6,clothes[4],G.gNow);
ol("Washing machine",12.4,4.5,8.9,"og",G.g);ol("Water drum",12.3,4.7,1.4,"og",G.g);ol("Bags on floor",10.8,2.4,6,"og",G.gNow);

/* bath + toilet */
dado(0,0,6,5,3.6);dado(0,5,6,10.3,3);
cyl(1.1,1.1,.7,1.4,.12,white,G.g);cyl(2.6,1,.7,1.4,.12,mat(0x8b2b2b),G.g);cyl(4,1.1,.75,1.2,.12,steel,G.g);
bx(.25,4.3,.8,.85,4.45,4.2,wood,G.g);bx(.28,4.6,2.6,.36,6.2,3.6,clothes[3],G.g,false);
bx(1.2,.12,7.2,2.8,.4,9.3,white,G.g);cyl(2,8.6,.35,.03,.4,black,G.g);cyl(1,6,.6,1.2,.12,steel,G.g);
damp(0,0,6,5,3.6,5.4);damp(0,5,6,10.3,3,4.8);damp(6,0,13.5,10.3,0,2.8);
[[4.4,7.6,.3,"x"],[.3,7.6,8,"z"],[.3,7.6,19.5,"z"]].forEach(([x,y,z,a])=>{a==="x"?bx(x-.6,y-.6,z-.05,x+.6,y+.6,z+.15,fanM,G.gFix,false):bx(x-.05,y-.6,z-.6,x+.15,y+.6,z+.6,fanM,G.gFix,false)});
ol("Buckets",2.6,3.4,1.2,"og",G.g);ol("Indian toilet",2,2.6,8.2,"og",G.g);ol("Exhaust fan",4.4,9.2,.5,"og",G.gFix);ol("Exhaust fan",.6,9.2,8,"og",G.gFix);ol("Exhaust fan",.6,9.2,19.5,"og",G.gFix);
ol("Damp patches",9.8,3.6,.6,"og",G.gNow);

/* courtyard + passage */
bx(24.4,0,11.6,26.2,.5,15.4,conc,G.site);
bx(24.7,0,16,26,1.6,17.3,steel,G.site);bx(24.7,0,17.6,26,1.6,18.9,steel,G.site);
bx(24.5,0,19.4,25.7,3,21.5,gateM,G.site);[[.6],[1.4],[2.2]].forEach(([y])=>bx(24.6,y,19.6,25.6,y+.35,21.3,black,G.site));
cyl(27.4,20.7,1,3,0,blue,G.site);bike(33.8,19.6,G.site);
[[29.5,4,1.1],[31.3,5.4,.9],[28.6,6.6,.8],[30.6,7.1,.7],[32.2,3.4,.8]].forEach(([x,z,r])=>pot(x,z,r,G.site));
bx(30,0,-3,38.1,.45,-.8,soil,G.site);[31.5,33.5,35].forEach(x=>{const b=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,0),leaf);b.position.set(x,1.3,-1.9);b.castShadow=true;G.site.add(b)});
bx(25.5,1,-3.08,29,4.8,-2.98,purple,G.site);
bx(35.6,0,21,37.8,1.6,23,bagM,G.xNow);bx(26,4.5,24.3,37.4,10.5,24.5,dark,G.xNow);
[0,1,2,3].forEach(i=>bx(28+i*1.3,5.4,19.9,29+i*1.3,7.6,20.05,clothes[i],G.xNow,false));
cyl(11.6,-1.6,1,3,.1,blue,G.site);cyl(15.5,-1.6,1,.6,.1,mat(0xf0c8a8),G.site);
for(let i=0;i<4;i++){const x1=i*6.05,o=bx(x1+.03,10.6,21.75,x1+6.02,10.72,24.55,tinM,G.site);o.userData.near=(i===0||i===3);roofP.push(o)}
cyl(14.2,23.4,1,.6,.1,mat(0xf0c8a8),G.site);bx(13.6,.7,22.9,14.8,1.3,23.8,red,G.site);bx(5,0,24.15,7.4,6.5,24.45,wood,G.site);bx(19.5,0,24.2,19.7,4.5,24.4,mat(0xb08a4a),G.site);
bx(1.5,.12,22,4.5,1.2,24.3,bagM,G.site);[0,1,2].forEach(i=>bx(9+i*1.5,5.4,23,10+i*1.5,7.4,23.12,clothes[i+1],G.xNow,false));bx(16.5,4.2,24.3,18.6,7.2,24.45,mat(0x6b4a2a),G.site);
ol("Basin",14.2,2.6,23.4,"ox");ol("Boards",6.2,7.4,24.2,"ox");ol("Clothes",10.6,8.4,23,"ox",G.xNow);
ol("Main door",25.2,8.6,13.5,"ox");ol("Gate",38.5,5.6,11.5,"ox");ol("Steel trunks",25.3,3,17.4,"ox");ol("Shoe rack",25.1,4.4,20.4,"ox");ol("Water drum",27.4,4.6,20.7,"ox");
ol("Bike",33.8,4.4,19.6,"ox");ol("Coconut palm",33.6,13.6,16.2,"ox");ol("Tree",36.3,19.6,1.2,"ox");ol("Plants",30.4,4.6,5.2,"ox");ol("Back door",9.2,8.4,-.6,"ox");
ol("Drum by back door",11.6,4.6,-1.6,"ox");ol("Stairs up",3.5,7,-1.6,"ox");ol("Cement bags",36.7,3.1,22,"ox",G.xNow);ol("Black sheets",32,11.6,24.3,"ox",G.xNow);ol("Clear roof sheets",27.4,12.2,9,"ox",G.xFix);

/* upstairs */
bx(22.3,y0,12.3,23.9,y0+2.5,16.7,wood,G.u);chair(20.9,14.5,-Math.PI/2,G.u,y0);
bx(14.2,y0,15.2,20.4,y0+1.4,21,wood,G.u);bx(14.4,y0+1.4,15.4,20.2,y0+1.9,20.8,mattress,G.u);bx(14.4,y0+1.9,15.8,15.4,y0+2.3,17.4,white,G.u);
bx(20.6,y0,20.3,23.8,y0+6,21.1,wood,G.u);for(let r=0;r<3;r++)for(let i=0;i<6;i++)bx(20.8+i*.48,y0+.6+r*1.9,20.45,21.15+i*.48,y0+1.9+r*1.9,20.95,clothes[(i+r)%5],G.u,false);
fan(18.8,y0+8.1,15.8,G.u);
bx(16,y0+1.9,17,17.4,y0+2,18,black,G.uNow);[[17.8,16.2],[15.8,19]].forEach(([x,z],i)=>bx(x,y0+1.9,z,x+1.4,y0+2.5,z+1,clothes[i+2],G.uNow));
bx(22.7,y0+2.5,13.8,23.5,y0+2.56,15,black,G.uFix);bx(23.45,y0+2.56,13.8,23.52,y0+3.4,15,black,G.uFix);bx(23,y0+2.5,12.6,23.5,y0+3.8,13,mari,G.uFix);
bx(7.3,y0,18.4,10,y0+2.6,21,card,G.u);bx(10.6,y0,18.6,13.2,y0+2.6,21.1,card,G.u);cyl(2.5,3,.7,1.4,y0+.1,white,G.u);
[[10,1.5],[20,1.5]].forEach(([x,z])=>bx(x-.1,y0,z-.1,x+.1,y0+6,z+.1,gateM,G.uFix));bx(10,y0+5.9,1.48,20,y0+5.95,1.52,black,G.uFix);
[0,1,2,3,4].forEach(i=>bx(11+i*1.8,y0+3.6,1.45,12.2+i*1.8,y0+5.9,1.55,clothes[i],G.uFix,false));
ol("Desk · face east",23,y0+4.7,14.5,"ou",G.u);ol("Bed",17.2,y0+3.6,18.2,"ou",G.u);ol("Bookshelf",22.2,y0+7,20.7,"ou",G.u);ol("Laptop on bed",16.7,y0+3.2,17.5,"ou",G.uNow);
ol("Storage boxes",10.2,y0+4,19.8,"ou",G.u);ol("Drying line",15,y0+7.4,1.5,"ou",G.uFix);

/* lights */
const hemi=new THREE.HemisphereLight(0xe2ebf3,0x6b604f,.45);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xfff1d6,1.6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
Object.assign(sun.shadow.camera,{left:-50,right:50,top:50,bottom:-50,near:1,far:260});sun.shadow.bias=-.0006;sun.target.position.set(17,0,10);scene.add(sun,sun.target);
[["hall",18.8,8.2,15.8,"g"],["bed",18.8,8.2,5.1,"g"],["kitchen",6.7,8.2,15.8,"g"],["util",9.7,8.2,5,"g"],["bath",3,8.2,2.5,"g"],["study",18.8,17.6,15.8,"u"]].forEach(([id,x,y,z,f])=>{
 const pn=f==="g"?G.gNow:G.uNow,pf=f==="g"?G.gFix:G.uFix;
 const a=new THREE.PointLight(0xffc98a,.45,12,1);a.position.set(x,y,z);pn.add(a);const b=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),ledM);b.position.set(x,y+.6,z);pn.add(b);
 const l=new THREE.PointLight(0xfff4e6,1.2,20,1);l.position.set(x,y,z);pf.add(l);const oz=["hall","bed","kitchen","study"].includes(id)?-3:0;bx(x-2,y+1.3,z+oz-.15,x+2,y+1.45,z+oz+.15,ledM,pf,false)});

/* vastu grid */
const zn=[["NW · Vāyavya","N · Uttara","NE · Īśānya"],["W · Paścima","Brahmasthāna","E · Pūrva"],["SW · Nairṛtya","S · Dakṣiṇa","SE · Āgneya"]];
const cw=24.2/3,cd=21.4/3;
zn.forEach((row,r)=>row.forEach((n,c)=>{const ne=r===0&&c===2,ctr=r===1&&c===1;
 const m=new THREE.MeshBasicMaterial({color:ne?0x2bb3a3:ctr?0xe8891c:((r+c)%2?0xffffff:0xc9d6e2),transparent:true,opacity:ne||ctr?.45:.32,depthWrite:false});
 const p=new THREE.Mesh(new THREE.PlaneGeometry(cw-.25,cd-.25),m);p.rotation.x=-Math.PI/2;p.position.set(c*cw+cw/2,0,r*cd+cd/2);G.vastu.add(p);
 lab(null,n,c*cw+cw/2,1.4,r*cd+cd/2,"v",G.vastu,.8,ne?"#1f9e90":ctr?"#e8891c":"#8a96a3")}));
lab(null,"North",10,3,-9,"c",scene,1,"#1f6f68");lab(null,"Road · east",49.5,2.5,9.5,"c",scene,1,"#5b6b7a");

[["hall","Hall",18.8,6,15.8,"g"],["bed","Bedroom",18.8,6,5,"g"],["kitchen","Kitchen + pooja",6.7,6,15.8,"g"],["util","Utility",9.8,6,5,"g"],["bath","Bath",3,6,2.5,"g"],["toilet","Toilet",3,6,7.6,"g"],
 ["study","Your study",18.8,15.5,15.8,"u"],["room2","Room 2",10.1,15.5,15.8,"u"],["upwash","Washroom",3,15.5,5,"u"],["terrace","Terrace",15,13.5,5,"u"],
 ["court","Courtyard",31.5,13.5,9,"x"],["spass","South passage",12,12.5,23.1,"x"],["pass","Passage + stairs",8,8,-1.6,"x"]].forEach(a=>lab(a[0],a[1],a[2],a[3],a[4],a[5]));

const sunC=D.createElement("canvas");sunC.width=sunC.height=128;{const g=sunC.getContext("2d"),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,"rgba(255,251,240,1)");gr.addColorStop(.16,"rgba(255,238,195,.95)");gr.addColorStop(.42,"rgba(255,205,130,.28)");gr.addColorStop(1,"rgba(255,190,110,0)");g.fillStyle=gr;g.fillRect(0,0,128,128)}
const sunS=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(sunC),depthWrite:false,fog:false,transparent:true}));sunS.scale.set(46,46,1);scene.add(sunS);
const CC=h=>new THREE.Color(h),SK={nT:CC(0x0d1320),nB:CC(0x283043),dT:CC(0x7887b4),dB:CC(0xf3c58f),yT:CC(0x7fb0dc),yB:CC(0xe8f0f3)},sc1=new THREE.Color(),sc2=new THREE.Color(),warm=CC(0xffcf9a),whiteC=CC(0xfff6ea);
const bgDay=new THREE.Color(),bgNight=new THREE.Color(0x1b2029),isDark=()=>{const t=D.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches};
const dirs=["north","north-north-east","north-east","east-north-east","east","east-south-east","south-east","south-south-east","south","south-south-west","south-west","west-south-west","west","west-north-west","north-west","north-north-west"];
function setSun(h){const rise=6.8,set=17.9,f=(h-rise)/(set-rise),up=f>0&&f<1,az=(113+Math.min(Math.max(f,0),1)*134)*Math.PI/180,alt=(up?Math.sin(Math.PI*f)*51:0)*Math.PI/180,r=130;
 sun.position.set(17+r*Math.sin(az)*Math.cos(alt),Math.max(3,r*Math.sin(alt)),10-r*Math.cos(az)*Math.cos(alt));
 const k=up?Math.sin(Math.PI*f):0;sun.intensity=up?.35+1.55*k:0;hemi.intensity=.14+.36*Math.sqrt(k);
 const dawn=up?Math.max(0,1-k*2.4):0;if(up){sc1.copy(SK.yT).lerp(SK.dT,dawn);sc2.copy(SK.yB).lerp(SK.dB,dawn)}else{sc1.copy(SK.nT);sc2.copy(SK.nB)}
 paintSky("#"+sc1.getHexString(),"#"+sc2.getHexString());scene.fog.color.copy(sc2);sun.color.copy(warm).lerp(whiteC,Math.min(1,k*1.7));
 sunS.visible=up;sunS.position.set(17+260*Math.sin(az)*Math.cos(alt),Math.max(6,260*Math.sin(alt)),10-260*Math.cos(az)*Math.cos(alt));
 const hh=Math.floor(h),mm=Math.round((h-hh)*60),ap=hh>=12?"pm":"am",h12=((hh+11)%12)+1;
 $('#clock').textContent=h12+":"+String(mm).padStart(2,"0")+" "+ap;
 $('#sunTxt').textContent=up?"Sun in the "+dirs[Math.round(az*180/Math.PI/22.5)%16]+", "+Math.round(alt*180/Math.PI)+"° high (late November)":"Sun below the horizon"}

function shown(o){let p=o;while(p){if(!p.visible)return false;p=p.parent}return true}
function apply(){const f=S.floor,fix=S.mode==="fix";
 G.u.visible=f!=="ground";slab1M.opacity=f==="ground"?0:1;slab1M.depthWrite=f!=="ground";slab2M.opacity=f==="whole"?1:0;slab2M.depthWrite=f==="whole";
 G.gNow.visible=G.uNow.visible=G.xNow.visible=!fix;G.gFix.visible=G.uFix.visible=G.xFix.visible=fix;
 wallMat.color.set(fix?0xf2eee5:0xd4cf95);
 roofP.forEach(o=>{const t=o.userData.near&&fix;o.material=t?polyM:tinM;o.castShadow=!t});tinM.opacity=S.roof?1:.12;tinM.depthWrite=S.roof;polyM.opacity=S.roof?.3:.08;$('#tRoof').setAttribute('aria-pressed',S.roof);
 labels.forEach(s=>{const t=s.userData.tag;if(t==="v")return;if(t[0]==="o"){s.userData.base=S.labels&&(t==="ox"||(t==="og"&&f==="ground")||(t==="u"&&false)||(t==="ou"&&f==="upper"));return}s.visible=t==="c"||(S.labels&&(t==="x"||(t==="g"&&f==="ground")||(t==="u"&&f==="upper")))});
 G.vastu.visible=S.vastu;G.vastu.position.y=f==="ground"?.3:f==="upper"?10.8:20.2;
 D.querySelectorAll('[data-floor]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.floor===f));
 D.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.mode===S.mode));
 $('#modeTxt').textContent=fix?'Improved: clear roof sheets near the house, trimmed tree, off-white walls, LED battens, exhaust fans (teal), pooja shelf moved, clutter and damp gone.':'Now: as photographed. Brown bands at the wall bottoms mark rising damp.';$('#tVastu').setAttribute('aria-pressed',S.vastu);$('#tLab').setAttribute('aria-pressed',S.labels)}
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,HOME={p:new THREE.Vector3(58,52,64),t:new THREE.Vector3(13,2,9)};let tw=null;
function fly(p1,t1,d){if(RM){cam.position.copy(p1);ctl.target.copy(t1);return}tw={p0:cam.position.clone(),t0:ctl.target.clone(),p1:p1.clone(),t1:t1.clone(),s:performance.now(),d:d||950}}
ctl.addEventListener("start",()=>{tw=null});
function focus(id){if(id==="court"){fly(HOME.p,HOME.t);return}const b=new THREE.Box3();floors[id].forEach(o=>b.expandByObject(o));const c=b.getCenter(new THREE.Vector3()),sz=b.getSize(new THREE.Vector3());
 const dir=new THREE.Vector3(.3,.88,.45).normalize();fly(c.clone().add(dir.multiplyScalar(Math.max(sz.x,sz.z)*1.15+15)),c)}
function select(id,nofly){S.sel=id;const f=R[id].f;if(f==="g"&&S.floor!=="ground")S.floor="ground";if(f==="u"&&S.floor!=="upper")S.floor="upper";
 Object.keys(floors).forEach(k=>floors[k].forEach(o=>{o.material.emissive.set(k===id?0x1f6f68:0x000000);o.material.emissiveIntensity=k===id?.45:0}));apply();renderInfo();if(!nofly)focus(id)}

D.querySelectorAll('[data-floor]').forEach(b=>b.onclick=()=>{S.floor=b.dataset.floor;apply()});
D.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{S.mode=b.dataset.mode;apply()});
$('#tVastu').onclick=()=>{S.vastu=!S.vastu;apply()};$('#tLab').onclick=()=>{S.labels=!S.labels;apply()};$('#tRoof').onclick=()=>{S.roof=!S.roof;apply()};
$('#hour').oninput=e=>{S.hour=+e.target.value;setSun(S.hour)};
D.querySelectorAll('#chips button').forEach(b=>b.onclick=()=>select(b.dataset.id));
const ray=new THREE.Raycaster(),mv=new THREE.Vector2();let down=null,lastTap=0;
const zPlane=new THREE.Plane(new THREE.Vector3(0,1,0),0),zp=new THREE.Vector3(),wv=new THREE.Vector3();
function pointAt(cx,cy){const r=renderer.domElement.getBoundingClientRect();mv.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(mv,cam);ray.camera=cam;
 const hits=ray.intersectObjects(pick.filter(o=>o.isMesh&&shown(o)),false);if(hits.length)return hits[0].point.clone();zPlane.constant=-ctl.target.y;return ray.ray.intersectPlane(zPlane,zp)?zp.clone():null}
function zoomAt(cx,cy,s){const P=pointAt(cx,cy)||ctl.target.clone();tw=null;const dist=cam.position.distanceTo(ctl.target);s=Math.min(Math.max(s,3/dist),170/dist);
 cam.position.sub(P).multiplyScalar(s).add(P);ctl.target.sub(P).multiplyScalar(s).add(P)}
renderer.domElement.addEventListener("wheel",e=>{e.preventDefault();let dy=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?400:1);dy=Math.max(-100,Math.min(100,dy));zoomAt(e.clientX,e.clientY,Math.exp(dy*.0012))},{passive:false});
let pinch=0;renderer.domElement.addEventListener("touchmove",e=>{if(e.touches.length!==2){pinch=0;return}const a=e.touches[0],b=e.touches[1],d=Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
 if(pinch&&d>0)zoomAt((a.clientX+b.clientX)/2,(a.clientY+b.clientY)/2,Math.min(1.15,Math.max(.87,pinch/d)));pinch=d},{passive:true});
renderer.domElement.addEventListener("touchend",()=>{pinch=0});
function jumpTo(cx,cy){const P=pointAt(cx,cy);if(!P)return;const dir=cam.position.clone().sub(ctl.target).normalize();fly(P.clone().add(dir.multiplyScalar(16)),P,700)}
renderer.domElement.addEventListener("dblclick",e=>jumpTo(e.clientX,e.clientY));
function zoomBtn(k){const v=cam.position.clone().sub(ctl.target);fly(ctl.target.clone().add(v.multiplyScalar(k)),ctl.target.clone(),350)}
$('#zin').onclick=()=>zoomBtn(.6);$('#zout').onclick=()=>zoomBtn(1.6);
renderer.domElement.addEventListener("pointerdown",e=>{down=[e.clientX,e.clientY]});
renderer.domElement.addEventListener("pointerup",e=>{if(!down)return;const d=Math.hypot(e.clientX-down[0],e.clientY-down[1]);down=null;if(d>6)return;
 if(e.pointerType==="touch"){const now=performance.now();if(now-lastTap<320){lastTap=0;jumpTo(e.clientX,e.clientY);return}lastTap=now}
 const r=renderer.domElement.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,cam);ray.camera=cam;
 const hits=ray.intersectObjects(pick.filter(shown),false);if(hits.length)select(hits[0].object.userData.room)});
const ro=new ResizeObserver(()=>{const w=view.clientWidth,h=view.clientHeight;renderer.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()});ro.observe(view);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>setSun(S.hour));
new MutationObserver(()=>setSun(S.hour)).observe(D.documentElement,{attributes:true,attributeFilter:["data-theme"]});
setSun(S.hour);select("court",true);fly(HOME.p,HOME.t,1800);
$('#home').onclick=()=>fly(HOME.p,HOME.t);
const stage=D.querySelector('.stage');
function setBig(on){D.body.classList.toggle('big',on);$('#big').textContent=on?'Exit full view':'Full view';$('#big').setAttribute('aria-pressed',on)}
function setHide(on){stage.classList.toggle('hide',on);$('#hidePanels').textContent=on?'Show panels':'Hide panels';$('#hidePanels').setAttribute('aria-pressed',on)}
$('#big').onclick=()=>setBig(!D.body.classList.contains('big'));$('#hidePanels').onclick=()=>setHide(!stage.classList.contains('hide'));
D.addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.key==='Escape'&&D.body.classList.contains('big'))setBig(false);if(e.key==='h'||e.key==='H')setHide(!stage.classList.contains('hide'));if(e.key==='f'||e.key==='F')setBig(!D.body.classList.contains('big'))});
Promise.race([D.fonts.load("600 74px Mukta"),new Promise(r=>setTimeout(r,1500))]).catch(()=>{}).then(()=>{LQ.forEach(a=>mkLab.apply(null,a));apply()});
(function loop(now){if(tw){let u=Math.min(1,((now||performance.now())-tw.s)/tw.d);u=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;cam.position.lerpVectors(tw.p0,tw.p1,u);ctl.target.lerpVectors(tw.t0,tw.t1,u);if(u>=1)tw=null}
 ctl.update();for(const l of labels){const t=l.userData.tag;if(t&&t[0]==='o'){l.getWorldPosition(wv);l.visible=!!l.userData.base&&wv.distanceTo(cam.position)<44}}renderer.render(scene,cam);requestAnimationFrame(loop)})();
}
