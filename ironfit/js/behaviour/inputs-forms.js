/* ---------- input / change ---------- */
Object.assign(T.en,{errDate:'Choose a report date that is today or earlier.',errNumber:'Check {f}: enter a valid number.'});
Object.assign(T.ar,{errDate:'اختر تاريخاً للتقرير لا يتجاوز اليوم.',errNumber:'راجع {f}: أدخل رقماً صحيحاً.'});
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
  if(el.closest&&el.closest('#ibform'))captureIb();
  if(el.dataset&&el.dataset.on&&INP[el.dataset.on])INP[el.dataset.on](el);
  if(el.dataset&&el.dataset.stf){if(ui.ib.ocr){if(ui.ib.ocr.fields)ui.ib.ocr.fields=ui.ib.ocr.fields.filter(k=>k!==el.dataset.stf);if(ui.ib.ocr.readings)delete ui.ib.ocr.readings[el.dataset.stf]}const n=$('[data-st="'+el.dataset.stf+'"]');if(n)n.innerHTML=stHint(el.value!=='',!!ui.ib.file,el.dataset.stf)}});
const CH={
  cmpsel(el){ui.cmp[el.dataset.k]=el.value;render()},
  phview(el){ui.ph.view=el.value;ui.ph.a=ui.ph.b=null;render()},
  phsel(el){ui.ph[el.dataset.k]=el.value;render()},
  wweight(el){const w=getWip(),v=num(el.value);if(v>0)w.w[el.dataset.ex]=v;else delete w.w[el.dataset.ex];save()},
  editlog(el){const g=num(el.value),dt=ui.ndate||today(),e=(D.logs[dt]||[]).find(x=>x.id===el.dataset.id);if(e&&g>=1&&g<=3000){e.grams=g;save()}else toast(t('errGrams'),true);render()},
  adj(){save();render()},
  pro(){save();render()},
  ibfile(el){const f=el.files&&el.files[0];el.value='';handleIbFile(f)},
  ibunits(el){captureIb();if(ui.ib.units!==el.value){ui.ib.units=el.value;render()}},
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
    const a={id:uid(),name,email,hash:await sha(email+':'+v.password)};ACC.push(a);saveAcc();setSession(a.id,true);loadUser(a.id);D.profile.anatomyPreference=['male','female','choose'].includes(v.anatomyPreference)?v.anatomyPreference:null;save();ui.ob=null;go('onboarding')},
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
  inbody(f){captureIb();const v=Object.fromEntries(new FormData(f)),lb=ui.ib.units==='lb',out={},seg={};
    if(!v.date||v.date>today())return errBox(t('errDate'));
    for(const r of IBF){const text=v[r[0]],raw=num(text);if(text!=null&&String(text).trim()!==''&&raw==null)return errBox(t('errNumber',{f:t(r[1])}));if(raw==null)continue;
      const val=r[4]==='m'&&lb?raw*LB_TO_KG:raw,factor=r[4]==='m'&&lb?1/LB_TO_KG:1,label=t(r[1])+(r[4]==='m'?' ('+ui.ib.units+')':'');
      if(!(val>=r[2]&&val<=r[3]))return errBox(t('errRange',{f:label,a:fmt(r[2]*factor,lb&&r[4]==='m'?1:0),b:fmt(r[3]*factor,lb&&r[4]==='m'?1:0)}));out[r[0]]=+val.toFixed(2)}
    for(const s of SEGS){const key='seg_'+s,text=v[key],raw=num(text);if(text!=null&&String(text).trim()!==''&&raw==null)return errBox(t('errNumber',{f:t('sg_'+s)}));if(raw==null)continue;
      const val=lb?raw*LB_TO_KG:raw,max=lb?80/LB_TO_KG:80;if(!(val>0&&val<=80))return errBox(t('errRange',{f:t('sg_'+s)+' ('+ui.ib.units+')',a:fmt(lb?0.01/LB_TO_KG:0.01,lb?1:2),b:fmt(max,lb?1:0)}));seg[s]=+val.toFixed(2)}
    if(!Object.keys(out).length&&!Object.keys(seg).length)return errBox(t('errNeed'));
    const date=v.date,prior=D.measurements.find(m=>m.date===date);
    const measurementsBefore=D.measurements.map(m=>({object:m,data:Object.assign({},m,{
      seg:m.seg&&Object.assign({},m.seg),profileSnapshot:m.profileSnapshot&&Object.assign({},m.profileSnapshot)})}));
    const reportsBefore=D.reports.map(r=>({object:r,data:Object.assign({},r)}));
    const profileBefore={weight:D.profile.weight,height:D.profile.height},fileUsed=!!ui.ib.file,fl=ui.ib.file;
    const reportData=fileUsed&&fl.type==='img'?ibCanvasData():null,fields=Object.assign({},out);
    if(Object.keys(seg).length)fields.seg=Object.assign({},prior&&prior.seg||{},seg);
    const priorRecords=[...D.measurements].filter(m=>m.date<=date).sort((a,b)=>a.date.localeCompare(b.date));
    const oldWeight=[...priorRecords].reverse().find(m=>m.weight!=null),oldHeight=[...priorRecords].reverse().find(m=>m.height!=null);
    const m=upsertM(date,fields,fileUsed?'inbody':'manual');
    m.source=fileUsed?'inbody':'manual';
    m.profileSnapshot={age:D.profile.age,gender:D.profile.gender,goal:D.profile.goal,activity:D.profile.activity,
      weight:m.weight??(oldWeight&&oldWeight.weight)??D.profile.weight,
      height:m.height??(oldHeight&&oldHeight.height)??D.profile.height,
      reportAdjustment:D.adj,reportProteinPerKg:D.pro};
    m.mismatch=measurementMismatch(m);
    if(fileUsed){let report=D.reports.find(r=>r.mid===m.id);if(!report){report={mid:m.id};D.reports.push(report)}
      Object.assign(report,{name:fl.name,type:fl.type,uploaded:today(),data:reportData})}
    if(date===today()){if(out.weight)D.profile.weight=out.weight;if(out.height)D.profile.height=out.height}
    if(!sset('sf_data_'+CUR.id,D)){
      D.measurements=measurementsBefore.map(x=>{Object.keys(x.object).forEach(k=>delete x.object[k]);Object.assign(x.object,x.data);return x.object});
      D.reports=reportsBefore.map(x=>{Object.keys(x.object).forEach(k=>delete x.object[k]);Object.assign(x.object,x.data);return x.object});
      D.profile.weight=profileBefore.weight;D.profile.height=profileBefore.height;return}
    ui.report=m.id;ui.ib={units:'kg',form:{},file:null};ibImg=null;ui.pend='report';toast(t('savedReport'));render()}
};
document.addEventListener('submit',e=>{const f=e.target;if(!f.dataset||!f.dataset.form)return;e.preventDefault();
  const fn=FORMS[f.dataset.form];if(fn){const eb=$('#ferr');if(eb){eb.textContent='';eb.classList.remove('on')}const r=fn(f);if(r&&r.catch)r.catch(()=>errBox(t('errStorage')))}});
