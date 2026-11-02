/* ===== behaviour: prefs, events, forms, demo data, boot ===== */
Object.assign(T.en,{errNoSets:'Tick at least one set before finishing.',sessionSaved:'Workout saved to your history.',notInProg:'That exercise is not in the selected program.',nameShort:'Enter your name.'});
Object.assign(T.ar,{errNoSets:'علّم مجموعة واحدة على الأقل قبل الإنهاء.',sessionSaved:'تم حفظ التمرين في سجلّك.',notInProg:'هذا التمرين ليس ضمن البرنامج المختار.',nameShort:'اكتب اسمك.'});

function applyPrefs(){const h=document.documentElement;h.classList.add('tt');
  h.lang=LANG;h.dir=LANG==='ar'?'rtl':'ltr';
  if(PREF.theme==='dark'||PREF.theme==='light')h.setAttribute('data-theme',PREF.theme);else h.removeAttribute('data-theme');
  setTimeout(()=>h.classList.remove('tt'),350)}
function setPrefs(o){Object.assign(PREF,o);if(o.lang)LANG=o.lang;sset('sf_prefs',{lang:PREF.lang,theme:PREF.theme,sounds:!!PREF.sounds});
  if(D){D.prefs={lang:LANG,theme:PREF.theme,sounds:!!PREF.sounds};save()}applyPrefs();render()}
function go(h){if(location.hash==='#'+h)render();else location.hash='#'+h}
const errBox=m=>{const e=$('#ferr');if(e){e.textContent=m;e.classList.add('on')}else toast(m,true)};
const dateInView=()=>route()==='nutrition'?(ui.ndate||today()):today();
function upsertM(date,fields,source,data=D){const matches=data.measurements.filter(x=>x.date===date);let m=matches[0];
  if(!m){m={id:uid(),date,source:source||'manual'};data.measurements.push(m)}
  else if(matches.length>1){
    matches.slice(1).forEach(duplicate=>{
      Object.keys(duplicate).forEach(k=>{if(m[k]==null)m[k]=duplicate[k]});
      if(duplicate.seg)m.seg=Object.assign({},duplicate.seg,m.seg||{});
      (data.reports||[]).forEach(report=>{if(report.mid===duplicate.id)report.mid=m.id});
    });
    data.measurements=data.measurements.filter(x=>x.date!==date||x===m);
  }
  Object.assign(m,fields);
  data.measurements.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:0);return m}

/* ---------- demo data ---------- */
function seedDemo(d){const T0=today();
  d.profile=Object.assign(d.profile,{name:'Demo Athlete',gender:'male',age:27,height:178,weight:82,goal:'muscle',activity:'moderate',experience:'intermediate',days:4,equipment:'gym',meals:4,diet:[],allergies:[]});
  d.onboarded=true;
  const W=[80.4,80.7,80.9,81.2,81.1,81.6,81.9,82.0,82.1],BF=[20.8,20.6,20.5,20.2,20.2,19.9,19.8,19.7,19.6],MU=[34.6,34.7,34.8,35.0,35.0,35.3,35.4,35.6,35.7],WA=[86,85.6,85.4,85,85.2,84.6,84.4,84.1,84];
  d.measurements=W.map((w,i)=>{const date=addDays(T0,-(8-i)*7+2),fm=+(w*BF[i]/100).toFixed(1);
    const m={id:uid(),date,weight:w,height:178,bmi:+(w/1.7778**2).toFixed(1),bf:BF[i],fatMass:fm,muscle:MU[i],ffm:+(w-fm).toFixed(1),tbw:+(w*.57).toFixed(1),visceral:6,bmrDevice:1780+i*6,waist:WA[i],source:i%4===0?'demo':'weight'};
    if(i===W.length-1)m.seg={rArm:3.5,lArm:3.4,trunk:28.1,rLeg:10.9,lLeg:10.8};return m});
  const plan={breakfast:[['oats',60],['milk',250],['banana',120]],lunch:[['chicken',180],['rice',200],['broccoli',100]],dinner:[['salmon',150],['sweetpotato',200],['tomato',120]],snack:[['yogurt',200],['almonds',30]]};
  d.logs={};for(let k=1;k<=5;k++){const dt=addDays(T0,-k);d.logs[dt]=[];Object.keys(plan).forEach(m=>plan[m].forEach(x=>{if(FOOD[x[0]])d.logs[dt].push({id:uid(),foodId:x[0],grams:x[1]+(k%2?0:10),meal:m})}))}
  d.logs[T0]=[{id:uid(),foodId:'oats',grams:60,meal:'breakfast'},{id:uid(),foodId:'milk',grams:250,meal:'breakfast'},{id:uid(),foodId:'egg',grams:100,meal:'breakfast'}];
  d.water={};d.water[T0]=3;for(let k=1;k<=5;k++)d.water[addDays(T0,-k)]=6+k%3;
  const days=PROGRAMS.upperlower.days;d.sessions=[];for(let k=0;k<10;k++){const dt=addDays(T0,-(k*3+1)),day=days[(9-k)%4],tot=day.ex.reduce((s,id)=>s+EX[id].sets,0);d.sessions.push({date:dt,prog:'upperlower',name:day.en,done:tot-(k%4===3?1:0),total:tot})}
  d.sessions.sort((a,b)=>a.date<b.date?-1:1);
  d.prs={bench:{w:72.5,date:addDays(T0,-4)},squat:{w:100,date:addDays(T0,-7)},rdl:{w:110,date:addDays(T0,-7)},ohp:{w:45,date:addDays(T0,-11)}};
  d.profile.programId='upperlower';d.wip=null;d.photos=[];d.reports=[];d.adj=null;d.pro=null}
async function startDemo(){let a=ACC.find(x=>x.demo);
  if(!a){a={id:'demo'+uid(),name:'Demo Athlete',email:'demo@ironfit.app',hash:null,demo:true};ACC.push(a);saveAcc();const nd=newData(a);seedDemo(nd);sset('sf_data_'+a.id,nd)}
  setSession(a.id,false);loadUser(a.id);ui.ob=null;go('dashboard')}

/* ---------- images ---------- */
function loadImg(file){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),im=new Image();im.onload=()=>{URL.revokeObjectURL(u);res(im)};im.onerror=()=>{URL.revokeObjectURL(u);rej()};im.src=u})}
function shrink(im,max,q){const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);return c.toDataURL('image/jpeg',q)}
async function handleIbFile(file){if(!file)return;const pdf=file.type==='application/pdf'||/\.pdf$/i.test(file.name),img=/^image\//.test(file.type);
  if((!pdf&&!img)||file.size>12*1048576){toast(t('errFile'),true);return}
  captureIb();const base={name:file.name,rot:0,crop:{t:0,b:0,l:0,r:0},blob:file};
  if(pdf){ibImg=null;ibPdf=null;ui.ib.file=Object.assign(base,{type:'pdf'});ui.ib.ocr=null;render();return}
  try{ibImg=await loadImg(file);ibPdf=null;ui.ib.file=Object.assign(base,{type:'img'});ui.ib.ocr=null;render()}catch(e){toast(t('errFile'),true)}}
function ibCanvasData(){const cv=$('#ibc');if(!cv||!ibImg)return null;const s=Math.min(1,900/Math.max(cv.width,cv.height)),c=document.createElement('canvas');c.width=Math.round(cv.width*s);c.height=Math.round(cv.height*s);c.getContext('2d').drawImage(cv,0,0,c.width,c.height);return c.toDataURL('image/jpeg',.7)}
let ibOcrScriptPromises={};
function loadIbScript(key,src,globalName){if(window[globalName])return Promise.resolve(window[globalName]);if(ibOcrScriptPromises[key])return ibOcrScriptPromises[key];
  const pending=new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=src;script.async=true;script.onload=()=>window[globalName]?resolve(window[globalName]):reject(new Error(globalName+' failed to initialize'));script.onerror=()=>reject(new Error('Could not load '+globalName));document.head.appendChild(script)});
  ibOcrScriptPromises[key]=pending.catch(error=>{delete ibOcrScriptPromises[key];throw error});return ibOcrScriptPromises[key]}
function ibOcrTokens(text){const tokens=String(text||'').match(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:[.,]\d+)?/g)||[];
  return tokens.map(raw=>({value:Number(raw.includes(',')&&/,\d{3}/.test(raw)?raw.replace(/,/g,''):raw.replace(',','.')),decimal:/[.,]\d/.test(raw)})).filter(x=>Number.isFinite(x.value))}
