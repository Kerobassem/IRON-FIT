/* ---------- calculations (deterministic) ---------- */
const AF={sedentary:1.2,light:1.375,moderate:1.55,very:1.725,extra:1.9};
const GOALS=['muscle','fatloss','recomp','bulk','fit','maintain','strength'];
const GADJ={muscle:10,fatloss:-15,recomp:0,bulk:15,fit:0,maintain:0,strength:5};
const GPRO={muscle:1.8,fatloss:2.0,recomp:2.0,bulk:1.8,fit:1.6,maintain:1.6,strength:1.8};
const latestM=()=>D.measurements.length?D.measurements[D.measurements.length-1]:null;
const curWeight=()=>{const m=[...D.measurements].reverse().find(x=>x.weight!=null);return m?m.weight:D.profile.weight};
function calc(){const p=D.profile,w=curWeight(),h=p.height,a=p.age;
  const bmr=10*w+6.25*h-5*a+(p.gender==='male'?5:-161);
  const tdee=bmr*AF[p.activity];
  let adj=D.adj!=null?D.adj:GADJ[p.goal];const notes=[];
  const bmi=w/Math.pow(h/100,2);
  if(a<18){if(adj<0)adj=0;notes.push('noteMinor')}
  if(bmi<18.5&&adj<0){adj=0;notes.push('noteLowBmi')}
  let kcal=Math.round(tdee*(1+adj/100));
  const floor=p.gender==='male'?1500:1200;if(kcal<floor){kcal=floor;notes.push('noteFloor')}
  const perKg=D.pro!=null?D.pro:GPRO[p.goal];
  const protein=Math.round(w*perKg),fat=Math.round(kcal*.25/9),carbs=Math.max(0,Math.round((kcal-protein*4-fat*9)/4));
  return{bmr,tdee,kcal,protein,fat,carbs,adj,bmi,notes,w,perKg}}
function entryN(e){const f=FOOD[e.foodId];if(!f)return null;const k=e.grams/100,p=f.per,m=x=>x==null?null:x*k;return{kcal:p[0]*k,p:p[1]*k,c:p[2]*k,f:p[3]*k,fi:m(p[4]),su:m(p[5]),na:m(p[6])}}
function totals(date){const r={kcal:0,p:0,c:0,f:0,fi:0,na:0,n:0};for(const e of D.logs[date]||[]){const n=entryN(e);if(!n)continue;r.n++;r.kcal+=n.kcal;r.p+=n.p;r.c+=n.c;r.f+=n.f;r.fi+=n.fi||0;r.na+=n.na||0}return r}
const MEALS=['breakfast','lunch','dinner','snack'];
const excluded=f=>f.tags.some(x=>D.profile.allergies.includes(x))||(D.profile.diet.includes('vegetarian')&&f.tags.some(x=>x==='meat'||x==='fish'));
function suggestions(){const g=D.profile.goal;let l=FOODS.filter(f=>!excluded(f)&&f.per[1]>=8&&f.per[0]<400);
  if(g==='fatloss'||g==='recomp')l.sort((a,b)=>(b.per[1]/b.per[0])-(a.per[1]/a.per[0]));else l.sort((a,b)=>b.per[1]-a.per[1]);
  return l.slice(0,6).map(f=>({f,g:clamp(Math.round(30/(f.per[1]/100)/5)*5,50,300)}))}
function recommend(){const p=D.profile;if(p.equipment==='none')return'noequip';if(p.equipment==='db')return'homedb';if(p.goal==='strength'&&p.days<=4)return'strength';if(p.experience==='beginner'&&p.days<=3)return'beginner';if(p.days<=3)return'fullbody';if(p.days===4)return'upperlower';if(p.days===5)return'bro';return'ppl'}
const curProgId=()=>ui.wp||D.profile.programId||recommend();
function nextDay(pid){const n=PROGRAMS[pid].days.length;return D.sessions.filter(s=>s.prog===pid).length%n}
function dayMinutes(day){let s=0;day.ex.forEach(id=>{const e=EX[id];s+=e.sets*(40+e.rest)});return Math.round(s/60)}
const repsLabel=e=>e.reps+(e.secs?' '+t('secs'):'')+(e.per?' / '+t('per_'+e.per):'');
function getWip(){const pid=curProgId(),d=ui.wd!=null?ui.wd:nextDay(pid),key=pid+'|'+d+'|'+today();if(!D.wip||D.wip.key!==key)D.wip={key,sets:{},w:{}};return D.wip}

