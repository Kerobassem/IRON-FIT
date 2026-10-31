const MUSCLES={
chest:{en:'Chest',ar:'الصدر',fe:'Pushes the arms forward and across the body.',fa:'يدفع الذراعين للأمام وعبر الجسم.'},
delts:{en:'Shoulders (deltoids)',ar:'الأكتاف (الدالية)',fe:'Raises the arm forward, sideways and backward.',fa:'يرفع الذراع للأمام وللجانب وللخلف.'},
biceps:{en:'Biceps',ar:'العضلة ذات الرأسين',fe:'Bends the elbow and turns the forearm.',fa:'تثني المرفق وتدوّر الساعد.'},
triceps:{en:'Triceps',ar:'العضلة ثلاثية الرؤوس',fe:'Straightens the elbow.',fa:'تفرد المرفق.'},
forearms:{en:'Forearms',ar:'الساعدان',fe:'Grip strength and wrist movement.',fa:'قوة القبضة وحركة الرسغ.'},
abs:{en:'Abs',ar:'عضلات البطن',fe:'Flexes the spine and braces the core.',fa:'تثني العمود الفقري وتثبّت الجذع.'},
obliques:{en:'Obliques',ar:'العضلات المائلة',fe:'Rotates and bends the trunk sideways.',fa:'تدوّر الجذع وتثنيه جانباً.'},
quads:{en:'Quadriceps',ar:'الفخذ الأمامي',fe:'Straightens the knee and helps flex the hip.',fa:'تفرد الركبة وتساعد على ثني الورك.'},
calves:{en:'Calves',ar:'السمانة',fe:'Lifts the heel and points the foot.',fa:'ترفع الكعب وتشير بالقدم للأسفل.'},
traps:{en:'Trapezius',ar:'العضلة شبه المنحرفة',fe:'Lifts and pulls back the shoulder blades.',fa:'ترفع لوحي الكتف وتسحبهما للخلف.'},
lats:{en:'Lats',ar:'عضلات الظهر العريضة',fe:'Pulls the arm down and back toward the body.',fa:'تسحب الذراع للأسفل والخلف نحو الجسم.'},
lowback:{en:'Lower back',ar:'أسفل الظهر',fe:'Extends the spine and keeps the torso upright.',fa:'تمدّ العمود الفقري وتبقي الجذع منتصباً.'},
glutes:{en:'Glutes',ar:'الأرداف',fe:'Extends and rotates the hip.',fa:'تمدّ الورك وتدوّره.'},
hamstrings:{en:'Hamstrings',ar:'الفخذ الخلفي',fe:'Bends the knee and extends the hip.',fa:'تثني الركبة وتمدّ الورك.'}};

const EQN={barbell:{en:'Barbell',ar:'بار'},bench:{en:'Bench',ar:'بنش'},dumbbell:{en:'Dumbbells',ar:'دمبل'},machine:{en:'Machine',ar:'جهاز'},cable:{en:'Cable',ar:'كابل'},bodyweight:{en:'Bodyweight',ar:'وزن الجسم'},chair:{en:'Chair',ar:'كرسي'},rack:{en:'Rack',ar:'ستاند'}};

const EX={
bench:{en:'Barbell Bench Press',ar:'ضغط البار على البنش',p:['chest'],s:['triceps','delts'],sets:4,reps:'8–12',rest:90,eq:['barbell','bench'],lvl:1,env:'gym',
 ie:'Lie on the bench with feet flat. Lower the bar to mid-chest with elbows about 45° from the body, then press up.',ia:'استلقِ على البنش وقدماك ثابتتان على الأرض. أنزل البار إلى منتصف الصدر بزاوية مرفقين نحو 45° عن الجسم ثم ادفع للأعلى.',me:'Bouncing the bar off the chest or lifting the hips off the bench.',ma:'ارتداد البار عن الصدر أو رفع الحوض عن البنش.'},
incdb:{en:'Incline Dumbbell Press',ar:'ضغط الدمبل المائل',p:['chest'],s:['delts','triceps'],sets:3,reps:'8–12',rest:90,eq:['dumbbell','bench'],lvl:1,env:'db',
 ie:'Set the bench to a low incline. Press the dumbbells up and slightly together, then lower under control.',ia:'اضبط البنش على ميل خفيف. ادفع الدمبل للأعلى مع تقاربهما قليلاً ثم أنزلهما بتحكم.',me:'Setting the incline too steep, which shifts work to the shoulders.',ma:'رفع ميل البنش كثيراً فينتقل الجهد إلى الأكتاف.'},
pushup:{en:'Push-Up',ar:'تمرين الضغط',p:['chest'],s:['triceps','delts','abs'],sets:3,reps:'10–15',rest:60,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Hands under the shoulders, body in a straight line. Lower the chest to the floor and press back up.',ia:'ضع يديك تحت الكتفين وحافظ على جسم مستقيم. انزل بصدرك نحو الأرض ثم ادفع للأعلى.',me:'Sagging hips or flaring the elbows wide.',ma:'هبوط الحوض أو فتح المرفقين للخارج كثيراً.'},
pulldown:{en:'Lat Pulldown',ar:'سحب علوي (لات بول داون)',p:['lats'],s:['biceps','traps'],sets:3,reps:'10–12',rest:90,eq:['cable','machine'],lvl:0,env:'gym',
 ie:'Grip slightly wider than the shoulders. Pull the bar to the upper chest by driving the elbows down.',ia:'امسك البار بعرض أوسع قليلاً من الكتفين. اسحبه إلى أعلى الصدر مع دفع المرفقين للأسفل.',me:'Leaning far back and pulling with the arms instead of the back.',ma:'الميل للخلف كثيراً والسحب بالذراعين بدل الظهر.'},
row:{en:'Barbell Row',ar:'تجديف بالبار',p:['lats'],s:['traps','biceps','lowback'],sets:4,reps:'8–10',rest:90,eq:['barbell'],lvl:2,env:'gym',
 ie:'Hinge at the hips with a flat back. Pull the bar to the lower ribs, then lower it with control.',ia:'انحنِ من الحوض مع ظهر مستقيم. اسحب البار إلى أسفل الأضلاع ثم أنزله بتحكم.',me:'Rounding the lower back or using body swing to lift.',ma:'تقوس أسفل الظهر أو استخدام زخم الجسم للرفع.'},
dbrow:{en:'One-Arm Dumbbell Row',ar:'تجديف بدمبل بذراع واحدة',p:['lats'],s:['traps','biceps'],sets:3,reps:'10–12',per:'side',rest:60,eq:['dumbbell','bench'],lvl:0,env:'db',
 ie:'Support one hand on a bench. Pull the dumbbell toward the hip, keeping the back flat.',ia:'استند بيد واحدة على بنش. اسحب الدمبل نحو الورك مع ظهر مستقيم.',me:'Twisting the torso to move the weight.',ma:'لف الجذع لتحريك الوزن.'},
squat:{en:'Barbell Back Squat',ar:'سكوات بالبار',p:['quads'],s:['glutes','hamstrings','lowback'],sets:4,reps:'6–10',rest:120,eq:['barbell','rack'],lvl:2,env:'gym',
 ie:'Bar on the upper back, feet shoulder-width. Sit down and back until the thighs are parallel, then stand.',ia:'البار على أعلى الظهر والقدمان بعرض الكتفين. اجلس للخلف والأسفل حتى يوازي الفخذان الأرض ثم قف.',me:'Knees caving in or heels lifting off the floor.',ma:'انهيار الركبتين للداخل أو رفع الكعبين.'},
legpress:{en:'Leg Press',ar:'ضغط الأرجل',p:['quads'],s:['glutes','hamstrings'],sets:3,reps:'10–12',rest:90,eq:['machine'],lvl:0,env:'gym',
 ie:'Feet shoulder-width on the platform. Lower until the knees reach about 90°, then press without locking out hard.',ia:'القدمان بعرض الكتفين على المنصة. انزل حتى تبلغ الركبتان نحو 90° ثم ادفع دون قفل قوي للركبتين.',me:'Letting the lower back round off the pad at the bottom.',ma:'ارتفاع أسفل الظهر عن المقعد عند أسفل الحركة.'},
bwsquat:{en:'Bodyweight Squat',ar:'سكوات بوزن الجسم',p:['quads'],s:['glutes','hamstrings'],sets:3,reps:'15–20',rest:45,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Feet shoulder-width, chest up. Sit back and down, then drive through the whole foot to stand.',ia:'القدمان بعرض الكتفين والصدر مرتفع. اجلس للخلف والأسفل ثم ادفع بكامل القدم للوقوف.',me:'Knees drifting inward or rushing the movement.',ma:'ميل الركبتين للداخل أو التسرّع في الحركة.'},
lunge:{en:'Walking Lunge',ar:'اندفاع للأمام (لنج)',p:['quads'],s:['glutes','hamstrings'],sets:3,reps:'10–12',per:'leg',rest:60,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Step forward and lower the back knee toward the floor. Push through the front foot into the next step.',ia:'خطوة للأمام وأنزل الركبة الخلفية نحو الأرض. ادفع بالقدم الأمامية للخطوة التالية.',me:'Steps that are too short, so the front knee travels far past the toes.',ma:'خطوات قصيرة جداً فتتقدم الركبة كثيراً أمام الأصابع.'},
rdl:{en:'Romanian Deadlift',ar:'ديدلفت روماني',p:['hamstrings'],s:['glutes','lowback'],sets:3,reps:'8–10',rest:120,eq:['barbell'],lvl:2,env:'gym',
 ie:'Soft knees, bar close to the legs. Push the hips back until you feel a hamstring stretch, then stand tall.',ia:'ركبتان مرنتان والبار قريب من الساقين. ادفع الحوض للخلف حتى تشعر بشد في الفخذ الخلفي ثم قف.',me:'Rounding the back or letting the bar drift away from the legs.',ma:'تقوس الظهر أو ابتعاد البار عن الساقين.'},
hipthrust:{en:'Barbell Hip Thrust',ar:'هيب ثرست بالبار',p:['glutes'],s:['hamstrings'],sets:3,reps:'8–12',rest:90,eq:['barbell','bench'],lvl:1,env:'gym',
 ie:'Upper back on a bench, bar over the hips. Drive the hips up until the torso is level, then lower.',ia:'أعلى الظهر على بنش والبار فوق الحوض. ارفع الحوض حتى يصبح الجذع مستوياً ثم انزل.',me:'Overarching the lower back at the top instead of squeezing the glutes.',ma:'تقعير أسفل الظهر في القمة بدل شد الأرداف.'},
glutebridge:{en:'Glute Bridge',ar:'جسر الأرداف',p:['glutes'],s:['hamstrings'],sets:3,reps:'12–15',rest:45,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Lie on your back with knees bent. Lift the hips by squeezing the glutes, pause, then lower.',ia:'استلقِ على ظهرك مع ثني الركبتين. ارفع الحوض بشد الأرداف وتوقف لحظة ثم انزل.',me:'Pushing with the lower back instead of the hips.',ma:'الدفع بأسفل الظهر بدل الحوض.'},
ohp:{en:'Dumbbell Shoulder Press',ar:'ضغط الكتف بالدمبل',p:['delts'],s:['triceps','traps'],sets:3,reps:'8–12',rest:90,eq:['dumbbell'],lvl:1,env:'db',
 ie:'Hold the dumbbells at shoulder height. Press overhead until the arms are straight, then lower slowly.',ia:'أمسك الدمبل عند مستوى الكتفين. ادفع للأعلى حتى تستقيم الذراعان ثم انزل ببطء.',me:'Arching the lower back to push the weight up.',ma:'تقوس أسفل الظهر لدفع الوزن.'},
lateral:{en:'Lateral Raise',ar:'رفع جانبي',p:['delts'],s:['traps'],sets:3,reps:'12–15',rest:60,eq:['dumbbell'],lvl:0,env:'db',
 ie:'Raise the dumbbells out to the sides to shoulder height with a slight elbow bend, then lower slowly.',ia:'ارفع الدمبل جانباً حتى مستوى الكتف مع ثني خفيف بالمرفقين ثم انزل ببطء.',me:'Swinging the weights with momentum or shrugging.',ma:'تأرجح الأوزان بالزخم أو رفع الكتفين.'},
curl:{en:'Dumbbell Biceps Curl',ar:'تبادل بايسبس بالدمبل',p:['biceps'],s:['forearms'],sets:3,reps:'10–12',rest:60,eq:['dumbbell'],lvl:0,env:'db',
 ie:'Elbows by your sides. Curl the dumbbells up, squeeze, and lower under control.',ia:'المرفقان بجانب الجسم. اثنِ الدمبل للأعلى واضغط ثم أنزله بتحكم.',me:'Swinging the torso or letting the elbows drift forward.',ma:'تأرجح الجذع أو تقدّم المرفقين للأمام.'},
pushdown:{en:'Cable Triceps Pushdown',ar:'سحب التراي بالكابل',p:['triceps'],s:['forearms'],sets:3,reps:'10–15',rest:60,eq:['cable'],lvl:0,env:'gym',
 ie:'Elbows pinned to your sides. Push the handle down until the arms are straight, then return slowly.',ia:'ثبّت المرفقين بجانب الجسم. ادفع المقبض للأسفل حتى تستقيم الذراعان ثم عد ببطء.',me:'Flaring the elbows or leaning over the handle.',ma:'فتح المرفقين أو الانحناء فوق المقبض.'},
dip:{en:'Chair Dip',ar:'ديبس على كرسي',p:['triceps'],s:['chest','delts'],sets:3,reps:'8–12',rest:60,eq:['bodyweight','chair'],lvl:1,env:'none',
 ie:'Hands on the edge of a sturdy chair, legs forward. Lower until the elbows reach about 90°, then press up.',ia:'ضع يديك على حافة كرسي ثابت والساقان للأمام. انزل حتى تبلغ المرفقان نحو 90° ثم ادفع للأعلى.',me:'Dropping too deep, which strains the shoulders.',ma:'النزول عميقاً جداً مما يرهق الكتفين.'},
plank:{en:'Plank',ar:'بلانك',p:['abs'],s:['obliques','lowback','delts'],sets:3,reps:'30–45',secs:true,rest:45,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Forearms on the floor, body in one line. Brace the core and hold without letting the hips sag.',ia:'الساعدان على الأرض والجسم في خط مستقيم. شد البطن واثبت دون هبوط الحوض.',me:'Letting the hips rise or sag.',ma:'ارتفاع الحوض أو هبوطه.'},
crunch:{en:'Crunch',ar:'كرنش',p:['abs'],s:['obliques'],sets:3,reps:'12–20',rest:45,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Lie on your back with knees bent. Curl the ribs toward the hips, then lower slowly.',ia:'استلقِ على ظهرك وركبتاك مثنيتان. قرّب القفص الصدري من الحوض ثم انزل ببطء.',me:'Pulling on the neck with the hands.',ma:'سحب الرقبة باليدين.'},
calf:{en:'Standing Calf Raise',ar:'رفع السمانة واقفاً',p:['calves'],s:[],sets:3,reps:'12–20',rest:45,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Stand on the edge of a step. Rise onto the toes, pause, then lower the heels below the step.',ia:'قف على حافة درجة. ارتفع على أصابع القدمين وتوقف ثم اخفض الكعبين تحت مستوى الدرجة.',me:'Bouncing instead of pausing at the top.',ma:'الارتداد بدل التوقف في القمة.'}
};

const PROGRAMS={
beginner:{en:'Beginner Fitness',ar:'لياقة للمبتدئين',tags:['beginner','gym'],env:'gym',days:[
 {en:'Full Body A',ar:'جسم كامل أ',ex:['legpress','pulldown','incdb','plank']},
 {en:'Full Body B',ar:'جسم كامل ب',ex:['lunge','dbrow','ohp','crunch']},
 {en:'Full Body C',ar:'جسم كامل ج',ex:['legpress','pulldown','pushup','calf']}]},
fullbody:{en:'Full Body',ar:'الجسم الكامل',tags:['hypertrophy','fatloss','gym'],env:'gym',days:[
 {en:'Full Body A',ar:'جسم كامل أ',ex:['squat','bench','row','ohp','curl','plank']},
 {en:'Full Body B',ar:'جسم كامل ب',ex:['rdl','incdb','pulldown','lateral','pushdown','crunch']},
 {en:'Full Body C',ar:'جسم كامل ج',ex:['legpress','pushup','dbrow','hipthrust','curl','calf']}]},
upperlower:{en:'Upper / Lower',ar:'علوي / سفلي',tags:['hypertrophy','strength','gym'],env:'gym',days:[
 {en:'Upper A',ar:'علوي أ',ex:['bench','row','ohp','pulldown','curl','pushdown']},
 {en:'Lower A',ar:'سفلي أ',ex:['squat','rdl','legpress','calf','crunch']},
 {en:'Upper B',ar:'علوي ب',ex:['incdb','pulldown','lateral','row','curl','pushdown']},
 {en:'Lower B',ar:'سفلي ب',ex:['lunge','hipthrust','legpress','calf','plank']}]},
ppl:{en:'Push / Pull / Legs',ar:'دفع / سحب / أرجل',tags:['hypertrophy','gym'],env:'gym',days:[
 {en:'Push',ar:'دفع',ex:['bench','incdb','ohp','lateral','pushdown']},
 {en:'Pull',ar:'سحب',ex:['pulldown','row','dbrow','curl']},
 {en:'Legs',ar:'أرجل',ex:['squat','rdl','legpress','hipthrust','calf']}]},
bro:{en:'Bro Split',ar:'تقسيم العضلات',tags:['hypertrophy','gym'],env:'gym',days:[
 {en:'Chest',ar:'صدر',ex:['bench','incdb','pushup']},
 {en:'Back',ar:'ظهر',ex:['pulldown','row','dbrow']},
 {en:'Shoulders',ar:'أكتاف',ex:['ohp','lateral']},
 {en:'Arms',ar:'ذراعان',ex:['curl','pushdown','dip']},
 {en:'Legs',ar:'أرجل',ex:['squat','legpress','rdl','calf']}]},
strength:{en:'Strength Training',ar:'تدريب القوة',tags:['strength','gym'],env:'gym',days:[
 {en:'Strength A',ar:'قوة أ',ex:['squat','bench','row','plank']},
 {en:'Strength B',ar:'قوة ب',ex:['rdl','ohp','pulldown','curl']},
 {en:'Strength C',ar:'قوة ج',ex:['legpress','incdb','dbrow','pushdown']}]},
homedb:{en:'Home Workouts (Dumbbells)',ar:'تمارين منزلية (دمبل)',tags:['home','hypertrophy','fatloss'],env:'db',days:[
 {en:'Home A',ar:'منزل أ',ex:['lunge','incdb','dbrow','ohp','plank']},
 {en:'Home B',ar:'منزل ب',ex:['glutebridge','pushup','curl','lateral','crunch']},
 {en:'Home C',ar:'منزل ج',ex:['bwsquat','dip','dbrow','ohp','calf']}]},
noequip:{en:'No Equipment Workouts',ar:'تمارين بدون معدات',tags:['noequip','home','fatloss'],env:'none',days:[
 {en:'Bodyweight A',ar:'وزن الجسم أ',ex:['bwsquat','pushup','lunge','glutebridge','plank']},
 {en:'Bodyweight B',ar:'وزن الجسم ب',ex:['dip','calf','crunch','pushup','bwsquat']}]}
};

