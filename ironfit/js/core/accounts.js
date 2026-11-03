/* ---------- accounts ---------- */
async function sha(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return 'x'+btoa(unescape(encodeURIComponent(s)))}}
function newData(acc){return{profile:{name:acc.name,email:acc.email,gender:'male',anatomyPreference:null,age:25,height:175,weight:75,goal:'fit',activity:'moderate',experience:'beginner',days:3,equipment:'gym',diet:[],allergies:[],meals:4,programId:null},onboarded:false,measurements:[],reports:[],logs:{},water:{},sessions:[],prs:{},photos:[],wip:null,workoutOrders:{},adj:null,pro:null,prefs:{lang:LANG,theme:PREF.theme}}}
function save(){if(CUR&&D)sset('sf_data_'+CUR.id,D)}
function saveAcc(){sset('sf_users',ACC)}
function setSession(id,remember){try{sessionStorage.removeItem('sf_session')}catch(e){}sdel('sf_session');if(remember)sset('sf_session',id);else{try{sessionStorage.setItem('sf_session',id)}catch(e){mem.sf_session=id}}}
function getSession(){let id=null;try{id=sessionStorage.getItem('sf_session')}catch(e){}return id||sget('sf_session')}
function loadUser(id){const a=ACC.find(x=>x.id===id);if(!a)return false;CUR=a;D=sget('sf_data_'+id)||newData(a);if(D.prefs){if(D.prefs.lang){LANG=D.prefs.lang;PREF.lang=LANG}if(D.prefs.theme)PREF.theme=D.prefs.theme}applyPrefs();return true}
function logout(){try{sessionStorage.removeItem('sf_session')}catch(e){}sdel('sf_session');CUR=null;D=null;ui.ob=null;ui.notif=false;location.hash='#home';render()}
