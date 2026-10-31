/* ---------- render ---------- */
let lastRoute=null;
function render(){const y=window.scrollY;let r=route();
  if(!D&&(APPR.includes(r)||r==='onboarding')){location.hash='#login';return}
  if(D){if(r==='login'||r==='signup'){location.hash='#dashboard';return}if(!D.onboarded&&APPR.includes(r)){location.hash='#onboarding';return}if(D.onboarded&&r==='onboarding'){location.hash='#dashboard';return}}
  const R={home:viewHome,about:()=>viewStatic('about'),privacy:()=>viewStatic('privacy'),terms:()=>viewStatic('terms'),login:()=>viewAuth('login'),signup:()=>viewAuth('signup'),onboarding:viewOb,dashboard:viewDash,inbody:viewIb,nutrition:viewNut,workouts:viewWk,progress:viewProg,profile:viewProfile,'app-settings':viewSettings};
  $('#app').innerHTML=R[r]();
  if(r==='inbody')drawIb();
  if(r!==lastRoute&&!ui.pend)window.scrollTo(0,0);else window.scrollTo(0,y);lastRoute=r;
  if(ui.pend){const id=ui.pend;ui.pend=null;setTimeout(()=>{const n=document.getElementById(id);n&&n.scrollIntoView({behavior:'smooth',block:'start'})},30)}}
