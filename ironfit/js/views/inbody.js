/* ---------- inbody ---------- */
const IBF=[['height','f_height',100,250,''],['weight','f_weight',20,400,'m'],['bmi','f_bmi',10,70,''],['bf','f_bf',2,75,''],['fatMass','f_fatMass',1,250,'m'],['muscle','f_muscle',5,120,'m'],['ffm','f_ffm',10,250,'m'],['tbw','f_tbw',10,120,''],['visceral','f_visceral',1,30,''],['bmrDevice','f_bmrDevice',600,4500,''],['waist','f_waist',40,200,'']];
const SEGS=['rArm','lArm','trunk','rLeg','lLeg'];
let ibImg=null,ibPdf=null;
const stHint=(has,file,key)=>{const ocr=ui.ib.ocr||{},reading=ocr.readings&&ocr.readings[key];
  if(has&&ocr.fields&&ocr.fields.includes(key)){
    const level=reading&&reading.level;
    if(level==='high')return`<span class="chip ok">${t('ocrHigh',{n:Math.round(reading.confidence)})}</span>`;
    if(level==='medium')return`<span class="chip warn">${reading.estimated?t('ocrEstimated'):t('ocrMedium',{n:Math.round(reading.confidence)})}</span>`;
    return`<span class="chip warn">${t('ocrSuggestion')}</span>`
  }
  if(has)return`<span class="ok xs" style="color:var(--ok)">✓ ${t('entered')}</span>`;
  if(reading&&reading.level==='low')return`<span class="chip red">${reading.conflict?t('ocrConflict'):t('ocrLow')}</span>`;
  return file&&['done','error'].includes(ocr.status)?`<span class="xs" style="color:var(--warn)">${t('unclear')}</span>`:`<span class="xs muted">${t('optional')}</span>`};
const IB_MASS_KEYS=IBF.filter(r=>r[4]==='m').map(r=>r[0]).concat(SEGS.map(s=>'seg_'+s));
const LB_TO_KG=0.45359237;
const ibToKg=(key,value,units)=>IB_MASS_KEYS.includes(key)&&units==='lb'&&num(value)!=null?String(+(num(value)*LB_TO_KG).toFixed(6)):value;
const ibFromKg=(key,value,units)=>IB_MASS_KEYS.includes(key)&&units==='lb'&&num(value)!=null?String(+(num(value)/LB_TO_KG).toFixed(2)):value;
function ibField(key,label,val,step,min,max){const file=!!ui.ib.file,hasValue=val!=null&&val!=='',reading=ui.ib.ocr&&ui.ib.ocr.readings&&ui.ib.ocr.readings[key],suggested=ui.ib.ocr&&ui.ib.ocr.fields&&ui.ib.ocr.fields.includes(key);
  const confidenceClass=reading&&reading.level==='low'&&!hasValue?'ib-ocr-low':suggested&&reading&&reading.level==='medium'?'ib-ocr-medium':'';
  return`<div class="fld"><label class="lbl" for="ib_${key}">${label}</label><input id="ib_${key}" name="${key}" type="number" class="${confidenceClass}" step="${step||'0.1'}" min="${min==null?0:min}" ${max==null?'':`max="${max}"`} inputmode="decimal" value="${esc(val==null?'':val)}" data-stf="${key}"><div class="hint" data-st="${key}">${stHint(hasValue,file,key)}</div></div>`}
function captureIb(){const f=$('#ibform');if(!f)return;const o={};new FormData(f).forEach((v,k)=>{o[k]=v});
  const canonical=Object.assign({},ui.ib.form||{}),display=ui.ib.displayForm||{};
  Object.keys(o).forEach(k=>{canonical[k]=IB_MASS_KEYS.includes(k)&&o[k]===display[k]&&canonical[k]!=null?canonical[k]:ibToKg(k,o[k],ui.ib.units)});
  ui.ib.form=canonical;ui.ib.displayForm=Object.assign({},o)}
function ibForm(){const f=ui.ib.form||{},u=ui.ib.units;
  const shown={};IBF.forEach(r=>{shown[r[0]]=ibFromKg(r[0],f[r[0]],u)});SEGS.forEach(s=>{shown['seg_'+s]=ibFromKg('seg_'+s,f['seg_'+s],u)});ui.ib.displayForm=Object.assign({},shown,{date:f.date||today()});
  return`<form id="ibform" data-form="inbody" class="col" novalidate><div class="fgrid"><div class="fld"><label class="lbl" for="ib_date">${t('f_date')}</label><input id="ib_date" name="date" type="date" value="${esc(f.date||today())}" max="${today()}" data-stf="date"><div class="hint" data-st="date">${stHint(!!ui.ib.ocr&&ui.ib.ocr.fields&&ui.ib.ocr.fields.includes('date'),!!ui.ib.file,'date')}</div></div><div class="fld"><label class="lbl" for="ib_units">${t('units')}</label><select id="ib_units" data-ch="ibunits"><option value="kg" ${u==='kg'?'selected':''}>kg</option><option value="lb" ${u==='lb'?'selected':''}>lb</option></select></div></div>
<div class="fgrid">${IBF.map(r=>{const factor=u==='lb'&&r[4]==='m'?1/LB_TO_KG:1;return ibField(r[0],r[4]==='m'?t(r[1])+' ('+u+')':t(r[1]),shown[r[0]],null,r[2]*factor,r[3]*factor)}).join('')}</div><p class="lbl" style="margin-top:6px">${t('segT')} (${u})</p><div class="fgrid">${SEGS.map(s=>ibField('seg_'+s,t('sg_'+s),shown['seg_'+s],null,.01,u==='lb'?80/LB_TO_KG:80)).join('')}</div><div class="err" id="ferr" role="alert"></div><button class="btn red" type="submit">${ico('check',16)}${t('saveReport')}</button></form>`}
function ibUpload(){const f=ui.ib.file;
  return`<div class="card"><h3>${t('upload')}</h3><div class="dz" id="dz">${ico('upload',28)}<p style="margin:8px 0 14px">${t('dropHere')}</p><div class="row" style="justify-content:center"><label class="btn" for="ibcam">${ico('camera',16)}${t('camera')}</label><label class="btn" for="ibgal">${ico('file',16)}${t('gallery')}</label></div></div><input id="ibcam" type="file" accept="image/*" capture="environment" data-ch="ibfile"><input id="ibgal" type="file" accept="image/*,application/pdf" data-ch="ibfile">
${f?`<div class="row sb" style="margin-top:14px"><span class="chip">${ico('file',14)}${esc(f.name)}</span><button class="btn sm ghost" data-act="ibclear">${ico('trash',14)}${t('clearFile')}</button></div>${f.type==='pdf'?ibPdf?`<canvas id="ibpdfprev" class="ibprev" style="margin-top:12px;width:100%" aria-label="${t('reportPreview')}"></canvas>`:`<p class="note" style="margin-top:12px">${t('previewNA')}</p>`:`<canvas id="ibc" class="ibprev" style="margin-top:12px;width:100%" aria-label="${esc(f.name)}"></canvas><div class="row" style="margin-top:10px"><button class="btn sm" data-act="ibrot">${ico('rotate',16)}${t('rotate')}</button></div><p class="lbl" style="margin:14px 0 4px">${t('crop')}</p><div class="fgrid">${[['t','cT'],['b','cB'],['l','cL'],['r','cR']].map(c=>`<div class="fld"><label class="xs muted" for="cr_${c[0]}">${t(c[1])}</label><input id="cr_${c[0]}" type="range" min="0" max="40" value="${f.crop[c[0]]}" data-on="ibcrop" data-k="${c[0]}"></div>`).join('')}</div>`}<div class="col" style="margin-top:12px"><button class="btn" data-act="ibocr" ${ui.ib.ocr&&ui.ib.ocr.status==='running'?'disabled':''}>${ico('scan',16)}${t('readReport')}</button><p class="note">${t('ocrNote')}</p><p class="small muted" id="ibocrstatus" role="status" aria-live="polite">${ui.ib.ocr?esc(ui.ib.ocr.message||''):''}</p>${ui.ib.ocr&&ui.ib.ocr.warnings&&ui.ib.ocr.warnings.length?`<div class="col" style="gap:6px">${ui.ib.ocr.warnings.map(key=>`<p class="note">${t('ocrQuality_'+key)}</p>`).join('')}</div>`:''}</div>`:''}
</div>`}
function measurementMismatch(m){const close=(a,b,tolerance)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)>tolerance;
  if(m.weight!=null&&m.bf!=null&&m.fatMass!=null&&close(m.fatMass,m.weight*m.bf/100,1.5))return true;
  if(m.weight!=null&&((m.muscle!=null&&m.muscle>m.weight)||(m.fatMass!=null&&m.fatMass>m.weight)))return true;
  if(m.weight!=null&&m.height!=null&&m.bmi!=null&&close(m.bmi,m.weight/Math.pow(m.height/100,2),2))return true;
  if(m.weight!=null&&m.ffm!=null&&m.fatMass!=null&&close(m.weight,m.ffm+m.fatMass,2))return true;
  if(m.ffm!=null&&m.muscle!=null&&m.muscle>m.ffm+1)return true;
  if(m.ffm!=null&&m.tbw!=null&&m.tbw>m.ffm+1)return true;
  return !!(m.ffm!=null&&m.seg&&Object.values(m.seg).reduce((sum,n)=>sum+(Number.isFinite(n)?n:0),0)>m.ffm+2.5)}
function reportProfile(m){const snapshot=m.profileSnapshot||{},p=Object.assign({},D.profile,snapshot),ordered=[...D.measurements].filter(x=>x.date<=m.date).sort((a,b)=>a.date.localeCompare(b.date));
  const priorWeight=[...ordered].reverse().find(x=>x.weight!=null),priorHeight=[...ordered].reverse().find(x=>x.height!=null);
  p.weight=m.weight??snapshot.weight??(priorWeight&&priorWeight.weight)??D.profile.weight;
  p.height=m.height??snapshot.height??(priorHeight&&priorHeight.height)??D.profile.height;
  if(!Object.prototype.hasOwnProperty.call(snapshot,'reportAdjustment'))p.reportAdjustment=D.adj;
  if(!Object.prototype.hasOwnProperty.call(snapshot,'reportProteinPerKg'))p.reportProteinPerKg=D.pro;
  p.goal=GT[p.goal]?p.goal:D.profile.goal;return p}
function reportHTML(m){const p=reportProfile(m),c=calc({profile:p,measurement:m,adjustment:p.reportAdjustment,proteinPerKg:p.reportProteinPerKg});
  const ordered=[...D.measurements].sort((a,b)=>a.date.localeCompare(b.date)),idx=ordered.findIndex(x=>x.id===m.id),prev=idx>0?ordered[idx-1]:null;
  const bmiV=m.bmi!=null?m.bmi:c.bmi,bmiCalc=m.bmi==null;
  const kp=(label,val,unit,d,extra)=>val==null||!Number.isFinite(val)?'':`<div class="kpi"><span class="l">${label}</span><span class="num">${fmt(val,d)} <span class="small muted" style="font-style:normal;font-family:var(--f-body)">${unit}</span></span>${extra?`<span class="xs muted">${extra}</span>`:''}`;
  const comp=[kp(t('weight'),m.weight,t('kg'),1),kp(t('bmi'),bmiV,'',1,bmiCalc?t('bmiCalc'):''),kp(t('bf'),m.bf,'%',1),kp(t('fatMassL'),m.fatMass,t('kg'),1),kp(t('muscle'),m.muscle,t('kg'),1),kp(t('ffm'),m.ffm,t('kg'),1),kp(t('tbw'),m.tbw,'L',1),kp(t('visceral'),m.visceral,'',0)].join('');
  const seg=m.seg&&Object.keys(m.seg).length?`<p class="lbl" style="margin:18px 0 8px">${t('segT')}</p><div class="scroll"><table class="tbl"><tbody>${SEGS.filter(s=>m.seg[s]!=null).map(s=>`<tr><td>${t('sg_'+s)}</td><td>${fmt(m.seg[s],2)} ${t('kg')}</td></tr>`).join('')}</tbody></table></div>`:'';
  const g=GT[p.goal];
  const keys=['weight','bf','muscle','fatMass','waist'];const cmp=prev?`<div class="scroll"><table class="tbl"><thead><tr><th></th><th>${fdate(prev.date)}</th><th>${fdate(m.date)}</th><th>${t('change')}</th></tr></thead><tbody>${keys.map(k=>{const a=prev[k],b=m[k],d=Number.isFinite(a)&&Number.isFinite(b)?b-a:null;return`<tr><td>${t('m_'+k)}</td><td>${fmt(a,1)}</td><td>${fmt(b,1)}</td><td>${d==null?'—':(d>0?'+':'')+fmt(d,1)}</td></tr>`}).join('')}</tbody></table></div>`:`<p class="muted small">${t('noPrev')}</p>`;
  const rep=D.reports.find(r=>r.mid===m.id);
  return`<div class="card up" id="report"><div class="row sb"><h3 style="margin:0">${t('reportT')} · ${fdateL(m.date)}</h3><span class="chip">${t('src_'+(m.source||'manual'))}</span></div>
<p class="lbl" style="margin:18px 0 8px">${t('compOverview')}</p><div class="grid c4" style="gap:12px">${comp}</div>${m.mismatch?`<p class="note" style="margin-top:12px">${t('warnMismatch')}</p>`:''}${seg}
<p class="lbl" style="margin:22px 0 8px">${t('energy')}</p><div class="grid c4" style="gap:12px">${kp(t('bmrFormula'),c.bmr,t('kcalDay'),0)}${m.bmrDevice!=null?kp(t('bmrDevice'),m.bmrDevice,t('kcalDay'),0):''}${kp(t('tdeeL'),c.tdee,t('kcalDay'),0)}${kp(t('targetKcal'),c.kcal,t('kcalDay'),0,`${t('g_'+p.goal)} · ${c.adj>0?'+':''}${fmt(c.adj)}%`)}</div>
<div class="row" style="margin-top:12px"><span class="chip">${t('protein')} ${fmt(c.protein)} ${t('g')}</span><span class="chip">${t('carbs')} ${fmt(c.carbs)} ${t('g')}</span><span class="chip">${t('fat')} ${fmt(c.fat)} ${t('g')}</span></div>
<p class="lbl" style="margin:22px 0 8px">${t('direction')} · ${t('g_'+p.goal)}</p><div class="grid c2"><div class="card flat" style="background:var(--card-2)"><h4>${t('nutDir')}</h4><p class="small" style="margin-top:6px">${LANG==='ar'?g.na:g.ne}</p></div><div class="card flat" style="background:var(--card-2)"><h4>${t('trnDir')}</h4><p class="small" style="margin-top:6px">${LANG==='ar'?g.ta:g.te}</p></div></div>
<p class="lbl" style="margin:22px 0 8px">${t('vsPrev')}</p>${cmp}${rep?`<p class="xs muted" style="margin-top:14px">${ico('lock',12)} ${t('fileKept')}</p>`:''}
<div class="col" style="margin-top:16px;gap:8px">${c.notes.map(n=>`<p class="note red">${t(n)}</p>`).join('')}<p class="note">${t('estimateNote')}</p></div></div>`}
function viewIb(){const ms=[...D.measurements].reverse(),rm=ui.report&&D.measurements.find(m=>m.id===ui.report);
  const hist=ms.map(m=>`<tr><td>${fdate(m.date)}</td><td>${fmt(m.weight,1)}</td><td>${fmt(m.bf,1)}</td><td>${fmt(m.muscle,1)}</td><td>${fmt(m.fatMass,1)}</td><td>${fmt(m.waist,1)}</td><td><span class="chip">${t('src_'+(m.source||'manual'))}</span></td><td><button class="btn sm ghost" data-act="mrep" data-id="${m.id}">${t('reportT')}</button><button class="btn icon sm ghost" data-act="mdel" data-id="${m.id}" aria-label="${t('delete')}">${ico('trash',14)}</button></td></tr>`).join('');
  return shell('inbody',t('ibTitle'),`<p class="muted" style="margin:-8px 0 18px;max-width:70ch">${t('ibSub')}</p><div class="split" style="align-items:start;gap:20px">${ibUpload()}<div class="card"><h3>${t('ibTitle')}</h3>${ibForm()}</div></div>${rm?`<div style="margin-top:20px">${reportHTML(rm)}</div>`:''}
<div class="card" style="margin-top:20px"><h3>${t('histT')}</h3>${hist?`<div class="scroll"><table class="tbl"><thead><tr><th>${t('date')}</th><th>${t('weight')}</th><th>${t('bf')}</th><th>${t('muscle')}</th><th>${t('fatMassL')}</th><th>${t('waist')}</th><th>${t('source')}</th><th></th></tr></thead><tbody>${hist}</tbody></table></div>`:`<div class="empty">${t('noMeasure')}</div>`}</div>`)}
function drawIb(){const pdf=$('#ibpdfprev');if(pdf&&ibPdf){pdf.width=ibPdf.width;pdf.height=ibPdf.height;pdf.getContext('2d').drawImage(ibPdf,0,0)}
  const cv=$('#ibc');if(!cv||!ibImg||!ui.ib.file)return;const{rot,crop}=ui.ib.file,sw=ibImg.width,sh=ibImg.height,rw=rot%180===0?sw:sh,rh=rot%180===0?sh:sw;
  const tmp=document.createElement('canvas');tmp.width=rw;tmp.height=rh;const c=tmp.getContext('2d');c.translate(rw/2,rh/2);c.rotate(rot*Math.PI/180);c.drawImage(ibImg,-sw/2,-sh/2);
  const x=rw*crop.l/100,y=rh*crop.t/100,w=Math.max(1,rw*(1-(crop.l+crop.r)/100)),h=Math.max(1,rh*(1-(crop.t+crop.b)/100)),sc=Math.min(1,900/w);
  cv.width=Math.round(w*sc);cv.height=Math.round(h*sc);cv.getContext('2d').drawImage(tmp,x,y,w,h,0,0,cv.width,cv.height)}
