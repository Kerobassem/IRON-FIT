/* ---------- render ---------- */
let lastRoute=null;
let youtubeApiPromise=null,youtubePlayer=null;
function loadYouTubeAPI(){if(window.YT&&window.YT.Player)return Promise.resolve(window.YT);if(youtubeApiPromise)return youtubeApiPromise;
  youtubeApiPromise=new Promise((resolve,reject)=>{let timer;window.onYouTubeIframeAPIReady=()=>{clearTimeout(timer);if(window.YT&&window.YT.Player)resolve(window.YT);else reject(new Error('YouTube IFrame Player API did not initialize'))};
    const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>{clearTimeout(timer);reject(new Error('YouTube IFrame Player API failed to load'))};timer=setTimeout(()=>reject(new Error('YouTube IFrame Player API timed out')),15000);document.head.appendChild(script)});
  youtubeApiPromise=youtubeApiPromise.catch(error=>{youtubeApiPromise=null;throw error});
  return youtubeApiPromise}
function setupExerciseVideo(){const iframe=$('.exercise-video iframe');if(!iframe)return;const host=iframe.closest('.youtube-player'),loading=host.querySelector('.youtube-loading'),fallback=host.querySelector('.video-error');
  const showError=()=>{loading.hidden=true;iframe.hidden=true;fallback.hidden=false};
  iframe.addEventListener('error',showError,{once:true});
  loadYouTubeAPI().then(YT=>{if(!iframe.isConnected)return;youtubePlayer=new YT.Player(iframe,{events:{
    onReady:()=>{if(iframe.isConnected)loading.hidden=true},
    onError:event=>{if(!iframe.isConnected)return;showError();console.warn('YouTube exercise embed failed with player error '+event.data+': '+iframe.title)}
  }})}).catch(error=>{console.error('Exercise video error handling could not initialize:',error);if(iframe.isConnected)loading.hidden=true})}
function rollDashboardNumbers(root){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  $$('.kpi .num',root).forEach(number=>{
    const walker=document.createTreeWalker(number,NodeFilter.SHOW_TEXT),nodes=[];let node;
    while((node=walker.nextNode()))nodes.push(node);
    if(!nodes.some(text=>/[0-9٠-٩۰-۹]/.test(text.data)))return;
    number.setAttribute('aria-label',number.textContent);
    nodes.forEach(text=>{
      const fragment=document.createDocumentFragment();let index=0;
      Array.from(text.data).forEach(char=>{
        if(/[0-9٠-٩۰-۹]/.test(char)){const digit=document.createElement('span');digit.className='roll-digit';digit.style.setProperty('--roll-delay',`${index++*100}ms`);digit.textContent=char;fragment.appendChild(digit)}
        else fragment.appendChild(document.createTextNode(char));
      });
      text.replaceWith(fragment);
    });
  });
}
function render(){const y=window.scrollY;let r=route();
  if(!D&&(APPR.includes(r)||r==='onboarding')){location.hash='#login';return}
  if(D){if(r==='login'||r==='signup'){location.hash='#dashboard';return}if(!D.onboarded&&APPR.includes(r)){location.hash='#onboarding';return}if(D.onboarded&&r==='onboarding'){location.hash='#dashboard';return}}
  const R={home:viewHome,about:()=>viewStatic('about'),privacy:()=>viewStatic('privacy'),terms:()=>viewStatic('terms'),login:()=>viewAuth('login'),signup:()=>viewAuth('signup'),onboarding:viewOb,dashboard:viewDash,inbody:viewIb,nutrition:viewNut,workouts:viewWk,progress:viewProg,profile:viewProfile,'app-settings':viewSettings};
  if(youtubePlayer){youtubePlayer.destroy();youtubePlayer=null}
  $('#app').innerHTML=R[r]();
  if(r==='inbody')drawIb();
  if(r==='workouts')setupExerciseVideo();
  if(r!==lastRoute&&!ui.pend)window.scrollTo(0,0);else window.scrollTo(0,y);lastRoute=r;
  if(ui.notif&&matchMedia('(max-width: 600px)').matches){const trigger=$('[data-act="notif"]'),pop=$('.notif .pop');if(trigger&&pop)pop.style.setProperty('--notif-top',`${Math.ceil(trigger.getBoundingClientRect().bottom+8)}px`)}
  if(r==='dashboard')rollDashboardNumbers($('#app'));
  ui.animateDetail=false;
  if(ui.pend){const id=ui.pend;ui.pend=null;setTimeout(()=>{const n=document.getElementById(id);n&&n.scrollIntoView({behavior:'smooth',block:'start'})},30)}}
