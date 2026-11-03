/* Anatomy helpers: exercise block + muscle info card (artwork lives in anatomy-art.js) */
function anatomyModel(){const p=D&&D.profile;if(p&&['male','female'].includes(p.anatomyPreference))return p.anatomyPreference;if(p&&p.anatomyPreference==='choose')return'male';return p&&p.gender==='female'?'female':'male'}
function anatBlock(exId){const e=EX[exId],v=ui.view,sel=ui.muscle;
  const model=anatomyModel(),one=vw=>`<figure>${anat(vw,e.p,e.s,sel,model)}<figcaption>${t(vw)}</figcaption></figure>`;
  const seg=['front','back','both'].map(x=>`<button class="${v===x?'on':''}" data-act="view" data-v="${x}" aria-pressed="${v===x}">${t(x)}</button>`).join('');
  return`<div class="col"><div class="row sb"><div class="seg" role="group" aria-label="${t('anaT')}">${seg}</div><div class="legend"><span><i style="background:var(--anat-primary)"></i>${t('primary')}</span><span><i style="background:var(--anat-secondary)"></i>${t('secondary')}</span></div></div><div class="anat" data-model="${model}" data-view="${v}">${v!=='back'?one('front'):''}${v!=='front'?one('back'):''}</div>${muscleInfo(sel)}</div>`}
function muscleInfo(id){if(!id||!MUSCLES[id])return`<p class="muted small">${t('tap')}</p>`;const m=MUSCLES[id];
  const exerciseId=id==='gastrocnemius'||id==='soleus'?'calves':id;
  const rel=Object.keys(EX).filter(k=>EX[k].p.includes(exerciseId)||EX[k].s.includes(exerciseId)).slice(0,8);
  return`<div class="card flat" style="padding:14px;background:var(--card-2)"><h4>${esc(bi(m))}</h4><p class="lbl" style="margin:10px 0 4px">${t('muscleFn')}</p><p class="small">${esc(LANG==='ar'?m.fa:m.fe)}</p><p class="lbl" style="margin:12px 0 6px">${t('related')}</p><div class="row gap-s">${rel.map(k=>`<button class="chip ${EX[k].p.includes(id)?'red':''}" data-act="exsel" data-id="${k}">${esc(bi(EX[k]))}</button>`).join('')}</div><p class="hint">${t('recText')}</p></div>`}
