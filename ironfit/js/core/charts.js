/* ---------- charts ---------- */
let cid=0;
function ring(pct,size=120,sw=12){const r=(size-sw)/2,c=2*Math.PI*r,p=clamp(pct,0,100),m=size/2,g=sw*.9;return`<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="${Math.round(p)}%"><circle cx="${m}" cy="${m}" r="${r}" fill="none" stroke="var(--silver)" stroke-opacity=".2" stroke-width="${sw}" stroke-dasharray="${(c-g).toFixed(1)} ${g.toFixed(1)}" transform="rotate(-78 ${m} ${m})"/><circle class="rg" cx="${m}" cy="${m}" r="${r}" fill="none" stroke="var(--red)" stroke-width="${sw}" stroke-dasharray="${((c-g)*p/100).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-78 ${m} ${m})"/></svg>`}
function bar(pct,color){return`<div class="bar"><i style="width:${clamp(pct,0,100)}%;--c:${color||'var(--red)'}"></i></div>`}
function lineChart(pts,o){o=o||{};if(!pts.length)return`<div class="empty">${t('noData')}</div>`;
  const W=640,H=250,ml=46,mr=46,mt=16,mb=30,rtl=LANG==='ar',id='g'+(++cid),dec=o.dec==null?1:o.dec;
  let lo=Math.min(...pts.map(p=>p.y)),hi=Math.max(...pts.map(p=>p.y));if(lo===hi){lo-=1;hi+=1}const pad=(hi-lo)*.15;lo-=pad;hi+=pad;
  const t0=pts[0].t,t1=pts[pts.length-1].t,span=Math.max(t1-t0,1),iw=W-ml-mr,ih=H-mt-mb;
  const X=tm=>{const f=pts.length===1?.5:(tm-t0)/span;return rtl?W-mr-f*iw:ml+f*iw};
  const Y=v=>mt+ih-(v-lo)/(hi-lo)*ih;
  let g='';for(let i=0;i<=3;i++){const v=lo+(hi-lo)*i/3,y=Y(v);g+=`<line class="grid-l" x1="${ml}" x2="${W-mr}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"/><text x="${rtl?W-mr+8:ml-8}" y="${(y+4).toFixed(1)}" text-anchor="${rtl?'start':'end'}">${fmt(v,dec)}</text>`}
  const nt=pts.length===1?1:Math.min(4,pts.length);let xl='';for(let i=0;i<nt;i++){const tm=nt===1?t0:t0+span*i/(nt-1),d=iso(new Date(tm));xl+=`<text x="${X(tm).toFixed(1)}" y="${H-8}" text-anchor="middle">${fdate(d)}</text>`}
  const xy=pts.map(p=>[X(p.t),Y(p.y)]);const path=xy.map((q,i)=>(i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)).join(' ');
  const base=mt+ih;const area=xy.length>1?path+` L${xy[xy.length-1][0].toFixed(1)} ${base} L${xy[0][0].toFixed(1)} ${base} Z`:'';
  const dots=pts.map((p,i)=>(pts.length<=40||i===pts.length-1)?`<circle class="pt${i===pts.length-1?' last':''}" cx="${xy[i][0].toFixed(1)}" cy="${xy[i][1].toFixed(1)}" r="${i===pts.length-1?5:3.5}"><title>${fdateL(p.d)}: ${fmt(p.y,dec)} ${esc(o.unit||'')}</title></circle>`:'').join('');
  return`<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label||'')}"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--red);stop-opacity:.32"/><stop offset="1" style="stop-color:var(--red);stop-opacity:0"/></linearGradient></defs>${g}${area?`<path d="${area}" fill="url(#${id})" stroke="none"/>`:''}${xy.length>1?`<path class="ln draw" pathLength="1" d="${path}"/>`:''}${dots}${xl}</svg>`}
const METRICS={weight:{u:'kg',d:1},bf:{u:'%',d:1},muscle:{u:'kg',d:1},fatMass:{u:'kg',d:1},waist:{u:'cm',d:1},cal:{u:'kcal',d:0},protein:{u:'g',d:0},workouts:{u:'',d:0}};
function series(metric,days){const cut=days==='all'?'0000-01-01':addDays(today(),-parseInt(days,10));let a=[];
  if(['weight','bf','muscle','fatMass','waist'].includes(metric))a=D.measurements.filter(m=>m[metric]!=null&&m.date>=cut).map(m=>({d:m.date,y:m[metric]}));
  else if(metric==='cal'||metric==='protein'){Object.keys(D.logs).sort().forEach(dt=>{if(dt<cut)return;const x=totals(dt);if(x.n)a.push({d:dt,y:metric==='cal'?x.kcal:x.p})})}
  else if(metric==='workouts'){const m={};D.sessions.forEach(s=>{const w=weekStart(s.date);m[w]=(m[w]||0)+1});Object.keys(m).sort().forEach(w=>{if(w>=cut||days==='all')a.push({d:w,y:m[w]})})}
  a.sort((x,y)=>x.d<y.d?-1:1);return a.map(p=>({t:new Date(p.d+'T12:00:00').getTime(),y:+p.y,d:p.d}))}

