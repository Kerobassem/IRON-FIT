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

const EQN={barbell:{en:'Barbell',ar:'بار'},bench:{en:'Bench',ar:'بنش'},dumbbell:{en:'Dumbbells',ar:'دمبل'},machine:{en:'Machine',ar:'جهاز'},cable:{en:'Cable',ar:'كابل'},bodyweight:{en:'Bodyweight',ar:'وزن الجسم'},chair:{en:'Chair',ar:'كرسي'},rack:{en:'Rack',ar:'ستاند'},pullupbar:{en:'Pull-up bar',ar:'بار العقلة'}};

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
calf:{en:'Standing Calf Raises',ar:'رفع السمانة واقفاً',p:['calves'],s:[],sets:3,reps:'12–20',rest:45,eq:['bodyweight'],lvl:0,env:'none',
 ie:'Stand tall with the balls of your feet on a step. Lower your heels, then rise onto your toes and pause without bouncing.',ia:'قف مستقيماً مع مقدمة القدم على درجة. اخفض الكعبين ثم ارتفع على أطراف الأصابع وتوقف دون ارتداد.',me:'Using momentum or shortening the controlled range of motion.',ma:'استخدام الزخم أو تقصير مدى الحركة المتحكم به.'},
fly:{en:'Dumbbell Fly',ar:'تفتيح الصدر بالدمبل',p:['chest'],s:['delts'],sets:3,reps:'10–12',rest:60,eq:['dumbbell','bench'],lvl:1,env:'db',
 ie:'Lie on a flat bench with a slight bend in each elbow. Open your arms until you feel a comfortable chest stretch, then bring the dumbbells together above your chest.',ia:'استلقِ على بنش مستوٍ مع ثني بسيط للمرفقين. افتح الذراعين حتى تشعر بتمدد مريح للصدر ثم قرّب الدمبل فوقه.',me:'Lowering too far or turning the fly into a press by bending the elbows more.',ma:'النزول أكثر من اللازم أو تحويل التفتيح إلى ضغط بزيادة ثني المرفقين.'},
seatedrow:{en:'Seated Cable Row',ar:'تجديف بالكابل جلوساً',p:['lats'],s:['traps','biceps','lowback'],sets:3,reps:'10–12',rest:75,eq:['cable','machine'],lvl:1,env:'gym',
 ie:'Sit tall with a neutral spine. Pull the handle toward your lower ribs by driving your elbows back, then return slowly without rocking.',ia:'اجلس منتصباً مع ظهر محايد. اسحب المقبض نحو أسفل الأضلاع بتحريك المرفقين للخلف ثم عد ببطء دون تأرجح.',me:'Rounding the back or leaning far back to move the weight.',ma:'تقويس الظهر أو الميل للخلف كثيراً لتحريك الوزن.'},
pullup:{en:'Pull-Up',ar:'عقلة',p:['lats'],s:['biceps','traps'],sets:3,reps:'6–10',rest:90,eq:['pullupbar'],lvl:2,env:'gym',
 ie:'Hang from a secure bar with an overhand grip. Pull your chest toward the bar with your elbows moving down, then lower under control to a full hang.',ia:'تعلّق بقبضة علوية من بار ثابت. اسحب صدرك نحو البار مع توجيه المرفقين للأسفل ثم انزل بتحكم حتى التعلق الكامل.',me:'Kipping or shortening the lowering phase instead of controlling each repetition.',ma:'استخدام التأرجح أو اختصار مرحلة النزول بدلاً من التحكم بكل تكرار.'},
frontraise:{en:'Dumbbell Front Raise',ar:'رفع أمامي بالدمبل',p:['delts'],s:['chest','traps'],sets:3,reps:'10–15',rest:60,eq:['dumbbell'],lvl:0,env:'db',
 ie:'Stand with light dumbbells in front of your thighs. Raise one or both arms to shoulder height with a soft elbow, then lower slowly.',ia:'قف مع دمبل خفيف أمام الفخذين. ارفع ذراعاً أو الذراعين حتى مستوى الكتف مع ثني بسيط للمرفق ثم اخفض ببطء.',me:'Swinging the torso or raising the weights above shoulder height.',ma:'تأرجح الجذع أو رفع الأوزان فوق مستوى الكتف.'},
reversefly:{en:'Dumbbell Reverse Fly',ar:'تفتيح خلفي بالدمبل',p:['delts'],s:['traps'],sets:3,reps:'12–15',rest:60,eq:['dumbbell'],lvl:1,env:'db',
 ie:'Hinge at the hips with a flat back. With elbows softly bent, raise the dumbbells out to the sides, squeeze the rear shoulders, and lower slowly.',ia:'انحنِ من الورك مع ظهر مستقيم. ارفع الدمبل جانباً مع ثني خفيف للمرفقين، واضغط عضلات الكتف الخلفية ثم اخفض ببطء.',me:'Rounding the back or using momentum instead of moving the arms under control.',ma:'تقويس الظهر أو استخدام الزخم بدلاً من تحريك الذراعين بتحكم.'},
hammercurl:{en:'Hammer Curl',ar:'ثني المطرقة بالدمبل',p:['biceps'],s:['forearms'],sets:3,reps:'10–12',rest:60,eq:['dumbbell'],lvl:0,env:'db',
 ie:'Stand tall with palms facing inward. Curl the dumbbells without moving your elbows, then lower under control.',ia:'قف مستقيماً مع توجيه راحتي اليدين للداخل. اثنِ المرفقين لرفع الدمبل دون تحريكهما ثم اخفض بتحكم.',me:'Swinging the weights or letting the elbows drift forward.',ma:'تأرجح الأوزان أو تحريك المرفقين للأمام.'},
preachercurl:{en:'Preacher Curl',ar:'ثني البايسبس على مسند',p:['biceps'],s:['forearms'],sets:3,reps:'10–12',rest:60,eq:['dumbbell','bench'],lvl:1,env:'gym',
 ie:'Brace your upper arms against the preacher pad. Curl the bar or dumbbells without lifting your elbows, then lower slowly before the elbows lock.',ia:'ثبّت أعلى الذراعين على مسند البايسبس. ارفع البار أو الدمبل دون رفع المرفقين ثم اخفض ببطء قبل قفل المرفق.',me:'Bouncing out of the bottom or lifting the upper arms off the pad.',ma:'الارتداد من أسفل الحركة أو رفع أعلى الذراعين عن المسند.'},
overheadtri:{en:'Overhead Triceps Extension',ar:'مدّ الترايسبس فوق الرأس',p:['triceps'],s:['delts'],sets:3,reps:'10–12',rest:60,eq:['dumbbell'],lvl:1,env:'db',
 ie:'Hold one dumbbell overhead with elbows pointing forward. Bend the elbows to lower it behind your head, then extend without flaring the elbows.',ia:'أمسك دمبلاً فوق الرأس مع توجيه المرفقين للأمام. اثنِ المرفقين لإنزال الوزن خلف الرأس ثم افردهما دون فتحهما للخارج.',me:'Arching the lower back or allowing the elbows to flare widely.',ma:'تقويس أسفل الظهر أو فتح المرفقين كثيراً للخارج.'},
skullcrusher:{en:'Skull Crushers',ar:'مدّ الترايسبس مستلقياً',p:['triceps'],s:['delts'],sets:3,reps:'8–12',rest:75,eq:['dumbbell','bench'],lvl:1,env:'db',
 ie:'Lie on a bench and hold dumbbells above your shoulders. Keep upper arms steady, bend the elbows to lower the weights beside your head, then extend.',ia:'استلقِ على بنش وأمسك الدمبل فوق الكتفين. ثبّت أعلى الذراعين واثنِ المرفقين لإنزال الوزن بجانب الرأس ثم افردهما.',me:'Moving the upper arms excessively or lowering the weights toward the face.',ma:'تحريك أعلى الذراعين كثيراً أو إنزال الأوزان باتجاه الوجه.'},
legextension:{en:'Leg Extension',ar:'مدّ الأرجل على الجهاز',p:['quads'],s:[],sets:3,reps:'10–15',rest:60,eq:['machine'],lvl:0,env:'gym',
 ie:'Sit with your knees aligned to the machine pivot and the pad above your ankles. Extend the knees smoothly, pause, then lower slowly.',ia:'اجلس مع محاذاة الركبتين لمحور الجهاز والوسادة فوق الكاحلين. افرد الركبتين بسلاسة وتوقف ثم اخفض ببطء.',me:'Using momentum or locking the knees forcefully at the top.',ma:'استخدام الزخم أو قفل الركبتين بقوة في أعلى الحركة.'},
legcurl:{en:'Leg Curl',ar:'ثني الأرجل على الجهاز',p:['hamstrings'],s:['calves'],sets:3,reps:'10–15',rest:60,eq:['machine'],lvl:0,env:'gym',
 ie:'Align your knees with the machine pivot and place the pad just above your heels. Curl smoothly, pause, and return with control.',ia:'حاذِ الركبتين مع محور الجهاز وضع الوسادة فوق الكعبين. اثنِ الساقين بسلاسة وتوقف ثم عد بتحكم.',me:'Lifting the hips off the pad or letting the weight drop.',ma:'رفع الحوض عن الوسادة أو ترك الوزن يهبط بسرعة.'},
hangingleg:{en:'Hanging Leg Raises',ar:'رفع الساقين معلقاً',p:['abs'],s:[],sets:3,reps:'8–12',rest:75,eq:['pullupbar'],lvl:2,env:'gym',
 ie:'Hang from a secure bar and brace your core. Raise your legs without swinging, then lower slowly while keeping control of your trunk.',ia:'تعلّق ببار ثابت وشد عضلات الجذع. ارفع الساقين دون تأرجح ثم اخفضهما ببطء مع تثبيت الجذع.',me:'Swinging the body to generate momentum or arching the lower back.',ma:'تأرجح الجسم لاستخدام الزخم أو تقويس أسفل الظهر.'}
};

const EXERCISE_VIDEOS={
  bench:'rT7DgCr-3pg',incdb:'8iPEnn-ltC8',fly:'eozdVDA78K0',pushup:'IODxDxX7oi4',
  pulldown:'CAwf7n6Luuc',seatedrow:'GZbfZ033f74',row:'vT2GjY_Umpw',pullup:'ylVmNQlKdAI',
  ohp:'qEwKCR5JCog',lateral:'3VcKaXpzqRo',frontraise:'-t7fuZ0KhDA',reversefly:'JoCRRZ3zRtI',
  curl:'ykJmrZ5v0Oo',hammercurl:'zC3nLlEvin4',preachercurl:'3YUIUnWsV2s',
  pushdown:'2-LAMcpzODU',overheadtri:'-Vyt2QdsR7E',skullcrusher:'d_KZxkY_0cM',
  squat:'ultWZbUMPL8',legpress:'8EMbB0tCn7Q',legextension:'YyvSfVjQeL0',legcurl:'F488k67BTNo',
  rdl:'JCXUYuzwNrM',calf:'YMmgqO8Jo-k',plank:'pSHjTRCQxIw',crunch:'Xyd_fa5zoEU',hangingleg:'Pr1ieGZ5atk'
};
const EX_LIBRARY=['bench','incdb','fly','pushup','pulldown','seatedrow','row','pullup','ohp','lateral','frontraise','reversefly','curl','hammercurl','preachercurl','pushdown','overheadtri','skullcrusher','squat','legpress','legextension','legcurl','rdl','calf','plank','crunch','hangingleg'];

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

const EX_CATEGORY={chest:'chest',lats:'back',traps:'back',lowback:'back',delts:'shoulders',biceps:'biceps',triceps:'triceps',forearms:'arms',abs:'core',obliques:'core',quads:'legs',calves:'legs',glutes:'legs',hamstrings:'legs'};
Object.keys(EX).forEach(id=>{
  const e=EX[id];
  e.id=id;
  e.category=EX_CATEGORY[e.p[0]]||'legs';
  e.youtubeId=EXERCISE_VIDEOS[id]||'';
  e.primaryMuscles=e.p;
  e.secondaryMuscles=e.s;
  e.equipment=e.eq;
  e.repetitions=e.reps;
  e.restDuration=e.rest;
  e.difficulty=e.lvl;
  e.instructions={en:e.ie,ar:e.ia};
});
const EX_VIEW_BACK=new Set(['lats','traps','lowback','glutes','hamstrings','triceps']);
Object.keys(EX).forEach(id=>{
  const targets=[...EX[id].p,...EX[id].s];
  EX[id].view=targets.every(m=>EX_VIEW_BACK.has(m))?'back':targets.some(m=>EX_VIEW_BACK.has(m))?'both':'front';
});
