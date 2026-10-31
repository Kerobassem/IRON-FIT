/* ---------- input / change ---------- */
function liveCalc(){const c=calc(),a=$('#tk'),b=$('#tp');if(a)a.textContent=fmt(c.kcal);if(b)b.textContent=fmt(c.protein)+' '+t('g')}
const INP={
  mini(el){const g=num(el.value),ok=g>0&&g<=3000,s=(id,v,d)=>{const n=$('#'+id);if(n)n.textContent=ok?fmt(v*g/100,d):'—'};s('mk',165,0);s('mp',31,1);s('mc',0,1)},
  fsearch(el){ui.add.q=el.value;$('#fres').innerHTML=foodResults(el.value)},
  fgrams(el){const g=num(el.value);if(g>=1&&g<=3000){ui.add.grams=g;const n=$('#fnut');if(n)n.innerHTML=nutBlock(FOOD[ui.add.foodId],g)}},
  cmpr(el){const b=$('#cmpbox');if(b)b.style.setProperty('--p',el.value+'%')},
  ibcrop(el){ui.ib.file.crop[el.dataset.k]=+el.value;drawIb()},
  adjv(el){D.adj=+el.value;const n=$('#adjv');if(n)n.textContent=t('adjustP',{n:(D.adj>0?'+':'')+fmt(D.adj)});liveCalc()},
  prov(el){D.pro=+el.value;const n=$('#prov');if(n)n.textContent=fmt(D.pro,1)+' '+t('g')+' / '+t('kg');liveCalc()}
};
document.addEventListener('input',e=>{const el=e.target;
  if(el.dataset&&el.dataset.on&&INP[el.dataset.on])INP[el.dataset.on](el);
  if(el.dataset&&el.dataset.stf){const n=$('[data-st="'+el.dataset.stf+'"]');if(n)n.innerHTML=stHint(el.value!=='',!!ui.ib.file)}});
const CH={
  cmpsel(el){ui.cmp[el.dataset.k]=el.value;render()},
  phview(el){ui.ph.view=el.value;ui.ph.a=ui.ph.b=null;render()},
  phsel(el){ui.ph[el.dataset.k]=el.value;render()},
  wweight(el){const w=getWip(),v=num(el.value);if(v>0)w.w[el.dataset.ex]=v;else delete w.w[el.dataset.ex];save()},
  editlog(el){const g=num(el.value),dt=ui.ndate||today(),e=(D.logs[dt]||[]).find(x=>x.id===el.dataset.id);if(e&&g>=1&&g<=3000){e.grams=g;save()}else toast(t('errGrams'),true);render()},
  adj(){save();render()},
  pro(){save();render()},
  ibfile(el){const f=el.files&&el.files[0];el.value='';handleIbFile(f)},
  ibunits(el){captureIb();const from=ui.ib.units,to=el.value;if(from!==to){const k=from==='kg'?2.20462262:1/2.20462262,f=ui.ib.form;
      IBF.filter(r=>r[4]==='m').map(r=>r[0]).concat(SEGS.map(s=>'seg_'+s)).forEach(key=>{const v=num(f[key]);if(v!=null)f[key]=String(+(v*k).toFixed(2))});ui.ib.units=to}render()},
  async photo(el){const file=el.files&&el.files[0];el.value='';if(!file)return;if(!/^image\//.test(file.type)||file.size>12*1048576){toast(t('errFile'),true);return}
    try{const im=await loadImg(file),data=shrink(im,900,.78);D.photos.push({id:uid(),date:today(),view:ui.ph.view,data});
      if(!sset('sf_data_'+CUR.id,D)){D.photos.pop();return}toast(t('photoSaved'));render()}catch(e){toast(t('errFile'),true)}}
};
document.addEventListener('change',e=>{const el=e.target;
  if(el.id==='fm'&&ui.add){ui.add.meal=el.value;return}
  if(el.dataset&&el.dataset.ch&&CH[el.dataset.ch])CH[el.dataset.ch](el)});

/* drag & drop for InBody upload */
['dragenter','dragover'].forEach(n=>document.addEventListener(n,e=>{const z=e.target.closest&&e.target.closest('#dz');if(z){e.preventDefault();z.classList.add('over')}}));
document.addEventListener('dragleave',e=>{const z=e.target.closest&&e.target.closest('#dz');if(z)z.classList.remove('over')});
document.addEventListener('drop',e=>{const z=e.target.closest&&e.target.closest('#dz');if(z){e.preventDefault();z.classList.remove('over');handleIbFile(e.dataTransfer.files&&e.dataTransfer.files[0])}
  else if(e.dataTransfer&&e.dataTransfer.types&&[...e.dataTransfer.types].includes('Files'))e.preventDefault()});
document.addEventListener('dragover',e=>{if(!e.target.closest('#dz')&&e.dataTransfer&&[...(e.dataTransfer.types||[])].includes('Files'))e.preventDefault()});

/* ---------- forms ---------- */
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMS={
  async signup(f){const v=Object.fromEntries(new FormData(f)),name=(v.name||'').trim(),email=(v.email||'').trim().toLowerCase();
    if(name.length<2)return errBox(t('errName'));if(!EMAIL.test(email))return errBox(t('errEmail'));if((v.password||'').length<8)return errBox(t('errPw'));
    if(v.password!==v.confirm)return errBox(t('errMatch'));if(!v.terms)return errBox(t('errTerms'));if(ACC.some(a=>a.email===email))return errBox(t('errExists'));
    const a={id:uid(),name,email,hash:await sha(email+':'+v.password)};ACC.push(a);saveAcc();setSession(a.id,true);loadUser(a.id);save();ui.ob=null;go('onboarding')},
  async login(f){const v=Object.fromEntries(new FormData(f)),email=(v.email||'').trim().toLowerCase();
    if(!EMAIL.test(email))return errBox(t('errEmail'));if(!v.password)return errBox(t('errPw'));
    const a=ACC.find(x=>x.email===email&&!x.demo);if(!a||a.hash!==await sha(email+':'+v.password))return errBox(t('errCreds'));
    setSession(a.id,!!v.remember);loadUser(a.id);ui.ob=null;go('dashboard')},
  profile(f){const v=Object.fromEntries(new FormData(f)),n=k=>num(v[k]),p=D.profile;
    const age=n('age'),h=n('height'),w=n('weight');
    if(!(v.name||'').trim())return errBox(t('nameShort'));
    if(!(age>=13&&age<=100&&h>=120&&h<=230&&w>=30&&w<=300))return errBox(t('errBody'));
    const eqChanged=p.equipment!==v.equipment||p.days!==+v.days,wChanged=Math.abs(w-curWeight())>=0.05;
    Object.assign(p,{name:v.name.trim(),age,gender:v.gender,height:h,weight:w,goal:v.goal,activity:v.activity,experience:v.experience,days:+v.days,equipment:v.equipment,meals:+v.meals,diet:f.querySelectorAll('[name=diet]:checked').length?[...f.querySelectorAll('[name=diet]:checked')].map(x=>x.value):[],allergies:[...f.querySelectorAll('[name=allergies]:checked')].map(x=>x.value)});
    if(eqChanged){p.programId=null;ui.wp=null;ui.wd=null;ui.wex=null;D.wip=null}
    if(wChanged)upsertM(today(),{weight:w},'weight');
    CUR.name=p.name;const a=ACC.find(x=>x.id===CUR.id);if(a){a.name=p.name;saveAcc()}
    save();toast(t('saved'));render()},
  logw(f){const v=Object.fromEntries(new FormData(f)),w=num(v.weight);if(!(w>=30&&w<=300))return errBox(t('errRange',{f:t('weight'),a:'30',b:'300'}));
    const dt=v.date&&v.date<=today()?v.date:today();upsertM(dt,{weight:w},'weight');D.profile.weight=w;save();closeModal();toast(t('saved'));render()},
  inbody(f){captureIb();const v=Object.fromEntries(new FormData(f)),lb=ui.ib.units==='lb',k=lb?0.45359237:1,out={},seg={};
    for(const r of IBF){const raw=num(v[r[0]]);if(raw==null)continue;const val=r[4]==='m'?raw*k:raw;
      if(!(val>=r[2]&&val<=r[3]))return errBox(t('errRange',{f:t(r[1]),a:fmt(r[2]),b:fmt(r[3])}));out[r[0]]=+val.toFixed(2)}
    for(const s of SEGS){const raw=num(v['seg_'+s]);if(raw==null)continue;const val=raw*k;if(!(val>0&&val<=80))return errBox(t('errRange',{f:t('sg_'+s),a:'0',b:fmt(80)}));seg[s]=+val.toFixed(2)}
    if(!Object.keys(out).length&&!Object.keys(seg).length)return errBox(t('errNeed'));
    const date=v.date&&v.date<=today()?v.date:today();
    let mismatch=false;if(out.weight&&out.bf!=null&&out.fatMass!=null&&Math.abs(out.fatMass-out.weight*out.bf/100)>1.5)mismatch=true;
    if(out.weight&&((out.muscle&&out.muscle>out.weight)||(out.fatMass&&out.fatMass>out.weight)))mismatch=true;
    const old=D.measurements.find(m=>m.date===date);if(old){D.measurements=D.measurements.filter(m=>m!==old);D.reports=D.reports.filter(r=>r.mid!==old.id)}
    const fileUsed=!!ui.ib.file,m=upsertM(date,Object.assign({seg,mismatch},out),fileUsed?'inbody':'manual');
    if(fileUsed){const fl=ui.ib.file;D.reports.push({mid:m.id,name:fl.name,type:fl.type,uploaded:today(),data:fl.type==='img'?ibCanvasData():null})}
    if(out.weight)D.profile.weight=out.weight;if(out.height)D.profile.height=out.height;
    if(!sset('sf_data_'+CUR.id,D)){const r=D.reports.find(x=>x.mid===m.id);if(r){r.data=null;save()}}
    ui.report=m.id;ui.ib={units:'kg',form:{},file:null};ibImg=null;ui.pend='report';toast(t('savedReport'));render()}
};
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset||!f.dataset.form)return;e.preventDefault();
  const fn=FORMS[f.dataset.form];if(fn){const eb=$('#ferr');if(eb){eb.textContent='';eb.classList.remove('on')}const r=fn(f);if(r&&r.catch)r.catch(()=>errBox(t('errStorage')))}});

