/* ===== nutrition+: category icons for foods, macro split bar, glass tracker, meal icons, category filter ===== */
const FIC={chicken:'f_drum',beef:'f_meat',salmon:'f_fish',cod:'f_fish',tuna:'f_fish',egg:'f_egg',rice:'f_bowl',oats:'f_bowl',potato:'f_root',sweetpotato:'f_root',pasta:'f_bowl',bread:'f_bread',lentils:'f_bowl',chickpeas:'f_bean',fava:'f_bean',cottage:'f_cheese',yogurt:'f_carton',milk:'f_carton',feta:'f_cheese',banana:'f_banana',apple:'f_apple',dates:'f_apple',avocado:'f_avo',broccoli:'f_broc',tomato:'f_tomato',cucumber:'f_cuc',almonds:'f_nut',pbutter:'f_jar',tahini:'f_jar',olive:'f_oil'};
function fpic(f,s){const c=(FPIC[f.id]||['','#94a3b8'])[1];return`<span class="fpic" aria-hidden="true" style="width:${s}px;height:${s}px;color:${c};background:${c}1f;border-color:${c}55">${ico(FIC[f.id]||'food',Math.round(s*.58))}</span>`}

const FCAT={protein:['chicken','beef','salmon','cod','tuna','egg','cottage'],carbs:['rice','oats','potato','sweetpotato','pasta','bread','lentils','chickpeas','fava'],veg:['broccoli','tomato','cucumber'],fruit:['banana','apple','dates','avocado'],dairy:['yogurt','milk','feta','cottage'],fats:['almonds','pbutter','tahini','olive','avocado']};
const FCAT_L={all:['All','الكل'],protein:['Protein','بروتين'],carbs:['Carbs','كربوهيدرات'],veg:['Veg','خضار'],fruit:['Fruit','فاكهة'],dairy:['Dairy','ألبان'],fats:['Fats','دهون']};
const MEAL_IC={breakfast:'sun',lunch:'bowl',dinner:'moon',snack:'bolt'};
const catChips=()=>Object.keys(FCAT_L).map(k=>`<button type="button" class="chip ${(ui.add&&ui.add.cat||'all')===k?'red':''}" data-act="fcat" data-c="${k}">${FCAT_L[k][LANG==='ar'?1:0]}</button>`).join('');
A.fcat=function(e){ui.add.cat=e.dataset.c==='all'?null:e.dataset.c;$('#fcats').innerHTML=catChips();$('#fres').innerHTML=foodResults(ui.add.q)};

/* stacked share of calories: protein / carbs / fat */
const splitBar=(p,c,f)=>`<div class="splitbar" role="img" aria-label="${fmt(p)}% / ${fmt(c)}% / ${fmt(f)}%"><i style="width:${p}%;background:var(--red)"></i><i style="width:${c}%;background:#3b82f6"></i><i style="width:${f}%;background:var(--warn)"></i></div>`;
/* eight glasses, filled as you drink */
const glasses=n=>`<div class="glasses" role="img" aria-label="${n}/8">${Array.from({length:8},(_,i)=>`<span class="${i<n?'on':''}">${ico('glass',22)}</span>`).join('')}${n>8?`<b class="small">+${n-8}</b>`:''}</div>`;
