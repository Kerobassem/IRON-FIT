/* ===== core: helpers, storage, accounts, calculations, charts, anatomy ===== */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let LS=true;try{localStorage.setItem('__t','1');localStorage.removeItem('__t')}catch(e){LS=false}
const mem={};
function sget(k){try{if(LS){const v=localStorage.getItem(k);return v?JSON.parse(v):null}}catch(e){}return k in mem?mem[k]:null}
function sset(k,v){if(!LS){mem[k]=v;return true}try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast(t('errStorage'),true);return false}}
function sdel(k){try{if(LS)localStorage.removeItem(k)}catch(e){}delete mem[k]}

let ACC=sget('sf_users')||[],CUR=null,D=null;
let PREF=Object.assign({lang:/^ar/i.test(navigator.language||'')?'ar':'en',theme:'system',sounds:false},sget('sf_prefs')||{});
let LANG=PREF.lang==='ar'?'ar':'en';
const ui={ndate:null,range:'30',metric:'weight',view:'both',muscle:null,notif:false,demoEx:'bench',ob:null,ib:{units:'kg',form:{}},add:null,wp:null,wd:null,wex:null,libex:null,libcat:'all',cmp:{},ph:{view:'front'},delArm:false,forgot:false,collapsedExercises:{},animateDetail:false};

const loc=()=>LANG==='ar'?'ar-EG':'en-US';
const t=(k,v)=>{let s=(T[LANG]&&T[LANG][k]);if(s==null)s=T.en[k];if(s==null)s=k;if(v)for(const x in v)s=s.split('{'+x+'}').join(v[x]);return s};
const bi=o=>LANG==='ar'?(o.ar||o.en):o.en;
const fmt=(n,d=0)=>n==null||!isFinite(n)?'—':new Intl.NumberFormat(loc(),{minimumFractionDigits:d,maximumFractionDigits:d}).format(n);
const fdate=(s,o)=>new Intl.DateTimeFormat(loc(),o||{day:'numeric',month:'short'}).format(new Date(s+'T12:00:00'));
const fdateL=s=>fdate(s,{day:'numeric',month:'long',year:'numeric'});
const iso=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*60000);return z.toISOString().slice(0,10)};
const today=()=>iso(new Date());
const addDays=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return iso(d)};
const weekStart=s=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()-((d.getDay()+6)%7));return iso(d)};
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const num=v=>{if(v==null||v==='')return null;const n=parseFloat(String(v).replace(',','.'));return isFinite(n)?n:null};
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36);
const norm=s=>String(s).toLowerCase().replace(/[ً-ْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه').trim();
const FOOD={};FOODS.forEach(f=>FOOD[f.id]=f);

const IC={home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',scan:'<path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10"/>',food:'<path d="M7 3v8a2 2 0 0 0 2 2v8M11 3v8a2 2 0 0 1-2 2M17 3c-2 2-2 6 0 8v10"/>',dumb:'<path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/>',chart:'<path d="M4 20V4M4 20h16"/><path d="M8 15l4-5 3 3 5-7"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>',bell:'<path d="M6 17v-6a6 6 0 1 1 12 0v6l2 2H4z"/><path d="M10 21h4"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>',moon:'<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',check:'<path d="M5 13l4 4L19 7"/>',trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',rotate:'<path d="M20 12a8 8 0 1 1-3-6.2M20 4v5h-5"/>',upload:'<path d="M12 16V4M7 9l5-5 5 5M4 20h16"/>',camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',play:'<path d="M8 5l11 7-11 7z"/>',drop:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',flame:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-9z"/>',out:'<path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M16 8l4 4-4 4M20 12H9"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',scale:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 10a4 4 0 0 1 8 0M12 10l2-2"/>',file:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'};
const ico=(n,s=20)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">${IC[n]||''}</svg>`;
const logoSvg=(s=34)=>logoMark(Math.round(s*1.2));
const logo=(s=34)=>`${logoSvg(s)}<span class="wordmark">IRON <b>FIT</b></span>`;

/* ---------- toast / modal ---------- */
let uiAudio=null;
function playUiSound(type='tap'){
  if(!PREF.sounds)return;
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext){console.warn('UI sounds are unavailable because Web Audio is not supported.');return}
  try{
    uiAudio=uiAudio||new AudioContext();
    const ctx=uiAudio,notes=type==='error'?[420,330]:type==='success'?[520,660,780]:type==='notice'?[620,820]:[560];
    const play=()=>notes.forEach((frequency,index)=>{
      const start=ctx.currentTime+index*.085,osc=ctx.createOscillator(),gain=ctx.createGain();
      osc.type='sine';osc.frequency.setValueAtTime(frequency,start);
      gain.gain.setValueAtTime(.0001,start);gain.gain.exponentialRampToValueAtTime(.035,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+.11);
      osc.connect(gain);gain.connect(ctx.destination);osc.start(start);osc.stop(start+.12);
    });
    if(ctx.state==='suspended')ctx.resume().then(play).catch(error=>console.warn('UI sound could not be started:',error));else play();
  }catch(error){console.warn('UI sound could not be played:',error)}
}
function toast(msg,err){const h=$('#toast');if(!h)return;playUiSound(err?'error':'success');const d=document.createElement('div');d.className='toast'+(err?' err':'');d.textContent=msg;h.appendChild(d);setTimeout(()=>d.remove(),2600)}
function openModal(html){$('#modal').innerHTML=html;const f=$('#modal input,#modal button.btn');if(f&&f.id==='fq')f.focus()}
function closeModal(){$('#modal').innerHTML='';ui.add=null}
