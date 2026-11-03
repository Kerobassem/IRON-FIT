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

/* mobile pull-to-refresh: redraw the current view from the current app state */
const pullRefresh=document.createElement('div'),pullSpinner=document.createElement('span'),pullLabel=document.createElement('span');
pullRefresh.className='pull-refresh';pullRefresh.setAttribute('role','status');pullRefresh.setAttribute('aria-live','polite');pullSpinner.className='pull-spinner';pullSpinner.setAttribute('aria-hidden','true');pullRefresh.append(pullSpinner,pullLabel);document.body.appendChild(pullRefresh);
let pullGesture=null,pullRefreshTimer=null;
function resetPullGesture(){
  const main=$('.main');if(main){main.style.transition='transform .24s cubic-bezier(.16,1,.3,1)';main.style.transform=''}
  pullRefresh.classList.remove('visible','refreshing');pullRefresh.style.removeProperty('--pull-offset');pullGesture=null;
}
document.addEventListener('touchstart',e=>{
  if(!matchMedia('(max-width: 919px)').matches||window.scrollY>0||!$('.main')||!e.touches.length)return;
  if(e.target.closest('button,a,input,select,textarea,[contenteditable="true"],.exercise-list,.scroll'))return;
  pullGesture={startY:e.touches[0].clientY,distance:0};
},{passive:true});
document.addEventListener('touchmove',e=>{
  if(!pullGesture||!e.touches.length)return;
  const distance=e.touches[0].clientY-pullGesture.startY;if(distance<=0){resetPullGesture();return}
  pullGesture.distance=Math.min(distance,140);
  const offset=pullGesture.distance*.35,main=$('.main');
  if(main){main.style.transition='none';main.style.transform=`translateY(${offset}px)`}
  pullRefresh.style.setProperty('--pull-offset',`${offset}px`);pullRefresh.classList.add('visible');
  pullLabel.textContent=pullGesture.distance>=80?t('pullReady'):t('pullDown');
  if(e.cancelable)e.preventDefault();
},{passive:false});
document.addEventListener('touchend',()=>{
  if(!pullGesture)return;
  const refresh=pullGesture.distance>=80;
  if(!refresh){resetPullGesture();return}
  clearTimeout(pullRefreshTimer);pullLabel.textContent=t('pullRefreshing');pullRefresh.classList.add('refreshing');
  const main=$('.main');if(main){main.style.transition='transform .24s cubic-bezier(.16,1,.3,1)';main.style.transform=''}
  render();pullRefreshTimer=setTimeout(resetPullGesture,520);
},{passive:true});
document.addEventListener('touchcancel',resetPullGesture,{passive:true});

/* pointer + keyboard sorting for the selected workout day's exercise cards */
let sorting=null;
function sortedExerciseCards(list){return Array.from(list.children).filter(child=>child.matches('.excard'))}
function saveExerciseOrder(list,focusId){
  if(!D||!list.isConnected)return;
  const program=list.dataset.program,day=Number(list.dataset.day);
  if(program!==curProgId()||!Number.isInteger(day)||!PROGRAMS[program]||!PROGRAMS[program].days[day])return;
  const cards=sortedExerciseCards(list);
  D.workoutOrders=D.workoutOrders||{};D.workoutOrders[program+':'+day]=cards.map(card=>card.dataset.exerciseId);save();
  cards.forEach((card,index)=>{const handle=card.querySelector('.drag-handle');if(handle)handle.setAttribute('aria-label',t('reorderExercise',{name:bi(EX[card.dataset.exerciseId]),position:fmt(index+1),total:fmt(cards.length)}))});
  if(focusId)list.querySelector(`[data-sort-handle="${focusId}"]`)?.focus();
}
document.addEventListener('pointerdown',e=>{
  const handle=e.target.closest&&e.target.closest('.drag-handle'),card=handle&&handle.closest('.excard'),list=card&&card.closest('[data-sort-list]');
  if(!handle||!card||!list||e.button!==0)return;
  sorting={handle,card,list,pointerId:e.pointerId,startY:e.clientY,moved:false,originalCards:sortedExerciseCards(list)};
  if(e.pointerType==='touch'&&handle.setPointerCapture)handle.setPointerCapture(e.pointerId);
});
document.addEventListener('pointermove',e=>{
  if(!sorting||e.pointerId!==sorting.pointerId)return;
  if(!sorting.moved&&Math.abs(e.clientY-sorting.startY)<6)return;
  sorting.moved=true;e.preventDefault();sorting.card.classList.add('is-dragging');
  const siblings=sortedExerciseCards(sorting.list).filter(card=>card!==sorting.card);
  const previousTops=new Map(siblings.map(card=>[card,card.getBoundingClientRect().top]));
  const target=siblings.find(card=>e.clientY<card.getBoundingClientRect().top+card.getBoundingClientRect().height/2);
  const before=target||null;
  if((before&&sorting.card.nextElementSibling!==before)||(!before&&sorting.card!==sorting.list.lastElementChild)){
    sorting.list.insertBefore(sorting.card,before);
    if(!RM)sortedExerciseCards(sorting.list).filter(card=>card!==sorting.card).forEach(card=>{
      card.getAnimations().filter(animation=>animation.id==='exercise-reorder').forEach(animation=>animation.cancel());
      const offset=previousTops.get(card)-card.getBoundingClientRect().top;
      if(Math.abs(offset)>1&&typeof card.animate==='function'){const animation=card.animate([{transform:`translateY(${offset}px)`},{transform:'translateY(0)'}],{duration:350,easing:'cubic-bezier(.16,1,.3,1)'});animation.id='exercise-reorder'}
    });
  }
},{passive:false});
document.addEventListener('pointerup',e=>{
  if(!sorting||e.pointerId!==sorting.pointerId)return;
  const state=sorting;sorting=null;state.card.classList.remove('is-dragging');
  if(state.moved)saveExerciseOrder(state.list,state.card.dataset.exerciseId);
});
document.addEventListener('pointercancel',e=>{
  if(!sorting||e.pointerId!==sorting.pointerId)return;
  const state=sorting;sorting=null;state.card.classList.remove('is-dragging');
  state.list.querySelectorAll('.excard').forEach(card=>card.getAnimations().filter(animation=>animation.id==='exercise-reorder').forEach(animation=>animation.cancel()));
  state.originalCards.forEach(card=>state.list.appendChild(card));
});
document.addEventListener('keydown',e=>{
  const handle=e.target.closest&&e.target.closest('.drag-handle');
  if(!handle||(e.key!=='ArrowUp'&&e.key!=='ArrowDown'))return;
  const card=handle.closest('.excard'),list=card&&card.closest('[data-sort-list]');if(!card||!list)return;
  const cards=sortedExerciseCards(list),index=cards.indexOf(card),next=cards[index+(e.key==='ArrowUp'?-1:1)];
  e.preventDefault();if(!next)return;
  list.insertBefore(card,e.key==='ArrowUp'?next:next.nextElementSibling);saveExerciseOrder(list,card.dataset.exerciseId);
});
