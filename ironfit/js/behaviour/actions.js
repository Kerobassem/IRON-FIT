/* ---------- click actions ---------- */
const A={
  theme(){const o=['dark','light','system'];setPrefs({theme:o[(o.indexOf(PREF.theme)+1)%3]})},
  lang(){setPrefs({lang:LANG==='ar'?'en':'ar'})},
  settheme(e){setPrefs({theme:e.dataset.v})},
  setlang(e){setPrefs({lang:e.dataset.v})},
  setanatomy(e){if(!['male','female'].includes(e.dataset.v))return;D.profile.anatomyPreference=e.dataset.v;ui.muscle=null;save();render()},
  soundToggle(){const sounds=!PREF.sounds;setPrefs({sounds});if(sounds)playUiSound('notice')},
  soundTest(){playUiSound('notice')},
  scroll(e){const id=e.dataset.to;if(route()!=='home'){ui.pend=id;go('home');return}const n=document.getElementById(id);n&&n.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'})},
  demo(){startDemo()},
  forgot(){ui.forgot=true;render()},
  contact(){toast(t('contactNote'))},
  demoex(e){ui.demoEx=e.dataset.id;ui.muscle=null;render()},
  notif(){if(!ui.notif)playUiSound('notice');ui.notif=!ui.notif;render()},
  logout(){logout()},
  obpick(e){const k=e.dataset.k;let v=e.dataset.v;if(['days','meals'].includes(k))v=+v;obCap();ui.ob.d[k]=v;render()},
  obtoggle(e){obCap();const a=ui.ob.d[e.dataset.k],v=e.dataset.v,i=a.indexOf(v);i<0?a.push(v):a.splice(i,1);render()},
  obnext(){obCap();const d=ui.ob.d;if(ui.ob.step===1&&!(d.age>=13&&d.age<=100&&d.height>=120&&d.height<=230&&d.weight>=30&&d.weight<=300)){errBox(t('errBody'));return}ui.ob.step++;render()},
  obback(){obCap();ui.ob.step=Math.max(0,ui.ob.step-1);render()},
  obdone(e){const d=ui.ob.d;Object.assign(D.profile,{goal:d.goal,gender:d.gender,age:d.age,height:d.height,weight:d.weight,experience:d.experience,activity:d.activity,days:d.days,equipment:d.equipment,diet:d.diet,allergies:d.allergies,meals:d.meals,programId:null});
    D.onboarded=true;if(!D.measurements.length)upsertM(today(),{weight:d.weight,height:d.height},'onboarding');save();ui.ob=null;go(e.dataset.go||'dashboard')},
  water(e){const dt=dateInView();D.water[dt]=clamp((D.water[dt]||0)+(+e.dataset.d),0,20);save();render()},
  openadd(e){const dt=dateInView();ui.add={q:'',foodId:e.dataset.food||null,grams:e.dataset.g?+e.dataset.g:100,meal:e.dataset.meal||'snack',date:dt};openModal(addModal())},
  fpick(e){ui.add.foodId=e.dataset.id;$('#fres').innerHTML=foodResults(ui.add.q);$('#fdet').innerHTML=foodDetail()},
  fquick(e){ui.add.grams=+e.dataset.g;$('#fdet').innerHTML=foodDetail()},
  fadd(){const a=ui.add,g=num($('#fg').value);if(!(g>=1&&g<=3000)){toast(t('errGrams'),true);return}
    a.meal=$('#fm').value;(D.logs[a.date]=D.logs[a.date]||[]).push({id:uid(),foodId:a.foodId,grams:g,meal:a.meal});save();closeModal();toast(t('foodAdded'));render()},
  ldel(e){const dt=ui.ndate||today();D.logs[dt]=(D.logs[dt]||[]).filter(x=>x.id!==e.dataset.id);save();render()},
  closem(){closeModal()},
  ndate(e){const n=addDays(ui.ndate||today(),+e.dataset.d);ui.ndate=n>today()?today():n;render()},
  startw(){ui.wd=null;ui.wex=null;ui.collapsedExercises={};go('workouts')},
  wprog(e){ui.wp=e.dataset.id;D.profile.programId=e.dataset.id;ui.wd=null;ui.wex=null;ui.libex=null;ui.collapsedExercises={};D.wip=null;save();render()},
  wday(e){ui.wd=+e.dataset.i;ui.wex=null;ui.libex=null;ui.muscle=null;ui.collapsedExercises={};render()},
  toggleExercise(e){const id=e.dataset.id;ui.collapsedExercises[id]=!ui.collapsedExercises[id];render()},
  wset(e){const w=getWip(),id=e.dataset.ex,i=+e.dataset.i,a=w.sets[id]||(w.sets[id]=[]);for(let k=0;k<EX[id].sets;k++)a[k]=!!a[k];a[i]=!a[i];playUiSound(a[i]?'success':'tap');save();render()},
  exsel(e){const id=e.dataset.id;ui.muscle=null;playUiSound('tap');
    if(route()==='home'){ui.demoEx=id;render();return}
    const pid=curProgId(),days=PROGRAMS[pid].days,di=days.findIndex(d=>d.ex.includes(id));
    if(di<0){toast(t('notInProg'),true);return}
    const cur=ui.wd!=null?ui.wd:nextDay(pid);if(di!==cur)ui.wd=di;ui.wex=id;ui.libex=null;ui.view=EX[id].view;ui.animateDetail=true;render()},
  libfilter(e){ui.libcat=e.dataset.category;render()},
  libexsel(e){const id=e.dataset.id;if(!EX_LIBRARY.includes(id)){toast(t('exerciseMissing'),true);return}playUiSound('tap');ui.libex=id;ui.muscle=null;ui.view=EX[id].view;ui.pend='exercise-detail-card';ui.animateDetail=true;render()},
  view(e){ui.view=e.dataset.v;render()},
  muscle(e){ui.muscle=ui.muscle===e.dataset.id?null:e.dataset.id;render()},
  wfinish(){const pid=curProgId(),prog=PROGRAMS[pid],di=clamp(ui.wd!=null?ui.wd:nextDay(pid),0,prog.days.length-1),day=prog.days[di],w=getWip();
    let done=0,tot=0;day.ex.forEach(id=>{tot+=EX[id].sets;done+=(w.sets[id]||[]).filter(Boolean).length});
    if(!done){toast(t('errNoSets'),true);return}
    let pr=0;day.ex.forEach(id=>{const x=w.w[id];if(x>0&&(w.sets[id]||[]).some(Boolean)&&(!D.prs[id]||x>D.prs[id].w)){D.prs[id]={w:x,date:today()};pr++}});
    D.sessions.push({date:today(),prog:pid,name:day.en,done,total:tot});D.wip=null;ui.wd=null;ui.wex=null;save();
    toast(pr?t('newPR',{n:fmt(pr)}):t('sessionSaved'));render()},
  metric(e){ui.metric=e.dataset.v;render()},
  range(e){ui.range=e.dataset.v;render()},
  pdel(e){D.photos=D.photos.filter(x=>x.id!==e.dataset.id);save();toast(t('photoDeleted'));render()},
  ibocr(){extractIbReport()},
  ibclear(){captureIb();ui.ib.file=null;ui.ib.ocr=null;ibImg=null;ibPdf=null;render()},
  ibrot(){captureIb();ui.ib.file.rot=(ui.ib.file.rot+90)%360;drawIb()},
  mrep(e){ui.report=e.dataset.id;ui.pend='report';render()},
  mdel(e){const id=e.dataset.id;D.measurements=D.measurements.filter(m=>m.id!==id);D.reports=D.reports.filter(r=>r.mid!==id);if(ui.report===id)ui.report=null;save();toast(t('saved'));render()},
  openlog(){openModal(modalWrap(t('qa_weight'),`<form data-form="logw" class="col" novalidate>${fld('lw_w',t('weightKg'),'number',curWeight(),'name="weight" min="30" max="300" step="0.1" inputmode="decimal"')}${fld('lw_d',t('f_date'),'date',today(),'name="date" max="'+today()+'"')}<div class="err" id="ferr" role="alert"></div><button class="btn red" type="submit">${t('save')}</button></form>`));const i=$('#lw_w');i&&i.select()},
  resetadj(){D.adj=null;D.pro=null;save();render()},
  delacct(){if(!ui.delArm){ui.delArm=true;render();setTimeout(()=>{if(ui.delArm){ui.delArm=false;if(D&&route()==='app-settings')render()}},5000);return}
    const id=CUR.id;sdel('sf_data_'+id);ACC=ACC.filter(a=>a.id!==id);saveAcc();ui.delArm=false;logout();toast(t('deleted'))}
};
function obCap(){$$('[data-ob]').forEach(i=>{const v=num(i.value);if(v!=null)ui.ob.d[i.dataset.ob]=v})}

document.addEventListener('click',e=>{
  if(ui.notif&&!e.target.closest('.notif')){ui.notif=false;if(D)render()}
  if(e.target.classList&&e.target.classList.contains('modal')){closeModal();return}
  const el=e.target.closest('[data-act]');if(!el)return;const f=A[el.dataset.act];if(f){f(el,e)}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if($('#modal').innerHTML)closeModal();else if(ui.notif){ui.notif=false;render()}return}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('[data-act][role=button],[data-act][role=link]')){e.preventDefault();e.target.click()}});
