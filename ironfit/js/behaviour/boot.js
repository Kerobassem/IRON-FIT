/* ---------- boot ---------- */
window.addEventListener('hashchange',()=>{ui.notif=false;ui.forgot=false;render()});
(function boot(){const id=getSession();if(id&&ACC.find(a=>a.id===id))loadUser(id);else applyPrefs();
  if(!location.hash)history.replaceState(null,'',D?(D.onboarded?'#dashboard':'#onboarding'):'#home');
  render()})();
/* extra Arabic/English search words */
var SYN={chicken:'دجاج فراخ بانيه chicken breast poultry',beef:'لحم لحمة بقري steak',salmon:'سالمون سلمون',cod:'سمك قد',tuna:'تونة تونا سمك',egg:'بيض بيضه eggs',rice:'رز ارز',oats:'شوفان اوتس',potato:'بطاطس بطاطا',sweetpotato:'بطاطا حلوة',pasta:'مكرونة معكرونة',bread:'عيش خبز',lentils:'عدس',chickpeas:'حمص',fava:'فول',cottage:'جبنة قريش جبنه',yogurt:'زبادي لبن',milk:'لبن حليب',feta:'جبنة بيضاء جبنه فيتا',banana:'موز',apple:'تفاح',dates:'بلح تمر',avocado:'افوكادو',broccoli:'بروكلي',tomato:'طماطم قوطة',cucumber:'خيار',almonds:'لوز مكسرات',pbutter:'زبدة فول سوداني',tahini:'طحينة',olive:'زيت زيتون'};
