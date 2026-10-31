/* ===== fx: splash, scroll reveal, count-up, spotlight, page transitions ===== */
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
let fxLast=null,fxIO=null;
const toLatin=s=>s.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[٬,]/g,'').replace('٫','.');
function fxInit(){const r=route(),app=$('#app');app.classList.toggle('pgin',r!==fxLast&&!RM);fxLast=r;
  if(RM)return;
  if(fxIO)fxIO.disconnect();
  fxIO=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;fxIO.unobserve(e.target);const n=e.target;n.classList.add('in');
    const num=n.classList.contains('stat')&&n.querySelector('.num');if(num&&!num.dataset.done){num.dataset.done=1;const raw=toLatin(num.textContent),v=parseFloat(raw);if(isFinite(v)&&v>0){const t0=performance.now();(function f(now){const k=Math.min(1,(now-t0)/1000),e2=1-Math.pow(1-k,3);num.textContent=fmt(Math.round(v*e2));if(k<1)requestAnimationFrame(f)})(t0)}}}),{threshold:.12});
  if(r==='home'){$$('.section h2,.section .lead,.section .grid>.card,.section .split>*,.section .faq,.cta,.stat,.marq').forEach((n,i)=>{n.classList.add('rv');n.style.setProperty('--d',String(i%4));fxIO.observe(n)})}
  const hero=$('.hero');if(hero&&!hero.dataset.fx){hero.dataset.fx=1;hero.addEventListener('pointermove',e=>{const b=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-b.left)+'px');hero.style.setProperty('--my',(e.clientY-b.top)+'px')})}}
const _render=render;render=function(){_render();fxInit()};
(function splash(){let seen=false;try{seen=sessionStorage.getItem('sf_splash')}catch(e){}if(seen||RM)return;try{sessionStorage.setItem('sf_splash','1')}catch(e){}
  const s=document.createElement('div');s.id='splash';s.innerHTML=`${logoLockup(true)}`;document.body.appendChild(s);setTimeout(()=>s.classList.add('out'),1300);setTimeout(()=>s.remove(),2000)})();
fxInit();
