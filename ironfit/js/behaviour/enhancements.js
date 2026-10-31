/* ===== enhancements: weekly insights + streak, rest timer, logo tilt ===== */
Object.assign(T.en,{weekT:'This week',streak:'Day streak',wkWorkouts:'Workouts',avgProt:'Avg protein',weekNote:'Bars: calories vs your target. Dot: workout done.',restGo:'Go!',restSkip:'Skip',streakNote:'Counts days with a logged meal or workout.'});
Object.assign(T.ar,{weekT:'هذا الأسبوع',streak:'أيام متتالية',wkWorkouts:'التمارين',avgProt:'متوسط البروتين',weekNote:'الأعمدة: السعرات مقابل هدفك. النقطة: تم التمرين.',restGo:'ابدأ!',restSkip:'تخطَّ',streakNote:'يُحتسب اليوم الذي سجّلت فيه وجبة أو تمرينًا.'});
const actDay=dt=>D.sessions.some(x=>x.date===dt)||(D.logs[dt]||[]).length>0;
function weekCard(){const c=calc(),T0=today(),days=[];let prot=0,pn=0;
  for(let i=6;i>=0;i--){const dt=addDays(T0,-i),tt=totals(dt);if(tt.n){prot+=tt.p;pn++}days.push({dt,pct:c.kcal?tt.kcal/c.kcal*100:0,w:D.sessions.some(s=>s.date===dt)})}
  let st=0,d=T0;if(!actDay(d))d=addDays(d,-1);while(st<365&&actDay(d)){st++;d=addDays(d,-1)}
  const ws=D.sessions.filter(s=>s.date>=weekStart(T0)).length,kp=(l,v,u)=>`<div class="kpi"><span class="l">${l}</span><span class="num">${v}${u?`<span class="small muted" style="font-style:normal;font-family:var(--f-body)"> ${u}</span>`:''}</span></div>`;
  return`<div class="card up" style="--i:4"><h3>${t('weekT')}</h3><div class="grid c3" style="gap:10px;margin-bottom:16px">${kp(t('streak'),fmt(st),'🔥')}${kp(t('wkWorkouts'),fmt(ws)+' / '+fmt(D.profile.days),'')}${kp(t('avgProt'),pn?fmt(prot/pn):'—',pn?t('g'):'')}</div>
<div class="wbars">${days.map(x=>`<div class="wb"><div class="colb" title="${fdateL(x.dt)}"><i style="height:${clamp(x.pct,0,100)}%${x.pct>105?';background:var(--warn)':''}"></i></div><span class="dot${x.w?' on':''}"></span><small>${fdate(x.dt,{weekday:'short'})}</small></div>`).join('')}</div><p class="xs muted" style="margin-top:12px">${t('weekNote')} ${t('streakNote')}</p></div>`}
const _vd=viewDash;viewDash=function(){const h=_vd(),k='<div class="card up" style="--i:5">',i=h.indexOf(k);return i<0?h:h.slice(0,i)+weekCard()+h.slice(i)};

/* rest timer (lives outside #app so re-renders don't reset it) */
let restEnd=0,restTimer=null,restHide=null;
const pill=document.createElement('div');pill.id='rest';pill.hidden=true;document.body.appendChild(pill);
const mmss=s=>fmt(Math.floor(s/60))+':'+(s%60<10?fmt(0):'')+fmt(s%60);
function beep(){try{const A=new(window.AudioContext||window.webkitAudioContext)(),o=A.createOscillator(),g=A.createGain();o.frequency.value=880;g.gain.value=.08;o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+.25)}catch(e){}try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}}
function drawRest(){const left=Math.max(0,Math.ceil((restEnd-Date.now())/1000));
  if(left>0){pill.className='';pill.innerHTML=`<span class="small muted">${t('rest')}</span><b class="num" style="font-size:1.5rem">${mmss(left)}</b><button class="btn sm" data-rest="30">+30</button><button class="btn sm ghost" data-rest="x">${t('restSkip')}</button>`}
  else{clearInterval(restTimer);restTimer=null;pill.className='go';pill.innerHTML=`<b class="num" style="font-size:1.4rem">${t('restGo')}</b>`;beep();restHide=setTimeout(()=>{pill.hidden=true},3500)}}
function startRest(sec){clearTimeout(restHide);restEnd=Date.now()+sec*1000;pill.hidden=false;drawRest();clearInterval(restTimer);restTimer=setInterval(drawRest,250)}
pill.addEventListener('click',e=>{const b=e.target.closest('[data-rest]');if(!b)return;if(b.dataset.rest==='x'){clearInterval(restTimer);restTimer=null;pill.hidden=true}else{restEnd+=30000;drawRest()}});
const _ws=A.wset;A.wset=function(e,ev){const id=e.dataset.ex,i=+e.dataset.i;_ws(e,ev);const w=D&&D.wip;if(w&&w.sets[id]&&w.sets[id][i]&&EX[id])startRest(EX[id].rest)};

/* logo tilt */
document.addEventListener('pointermove',e=>{if(RM)return;const l=e.target.closest&&e.target.closest('.logoglow');const img=document.querySelector('.herologo');if(!img)return;
  if(l){const b=img.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;img.style.animation='none';img.style.transform=`perspective(700px) rotateY(${x*18}deg) rotateX(${-y*18}deg) scale(1.04)`}
  else if(img.style.transform){img.style.transform='';img.style.animation=''}});
