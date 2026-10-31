/* ===== site enhancements: scroll progress bar + active section in the public nav ===== */
(function(){
  const bar=document.createElement('div');bar.id='sp';bar.setAttribute('aria-hidden','true');document.body.appendChild(bar);
  let tick=false;
  const update=()=>{tick=false;
    const h=document.documentElement,max=h.scrollHeight-h.clientHeight;
    bar.style.transform=`scaleX(${max>0?Math.min(1,h.scrollTop/max):0})`;
    let cur=null;document.querySelectorAll('section[id^="sec-"]').forEach(s=>{if(s.getBoundingClientRect().top<=140)cur=s.id});
    document.querySelectorAll('.pubnav a[data-to]').forEach(a=>a.classList.toggle('on',a.dataset.to===cur))};
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener('hashchange',()=>setTimeout(update,50));update();
})();
