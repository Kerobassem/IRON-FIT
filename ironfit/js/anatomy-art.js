/* ===== Anatomy artwork =====
   One half-body is authored (x < 100) and mirrored. Every muscle is built from its real heads/bellies,
   with fibre texture, shading, tendon lines and non-interactive context muscles for realism.
   Entry format: 'id|kind|fibre|path'
   kind: m muscle · c context muscle · l line · C centre line · e centre ellipse · E mirrored ellipse
   fibre: v vertical · d diagonal · h horizontal · (empty) none                                      */

const AN_OUT='M100 9C91 9 86 16 86 27C86 35 89 41 93 45L93 51C86 53 76 55 67 58C55 61 47 67 45 79C42 99 40 113 40 129C38 147 36 163 34 177C32 187 30 195 32 201L41 203L46 193C48 185 50 178 53 170C56 155 58 141 60 129C62 114 64 101 66 90C67 108 68 124 72 138C73 148 72 156 70 163C66 182 64 210 66 236C66 250 66 258 68 268C66 290 64 318 68 336L66 350C64 356 62 361 66 363L90 363C94 361 93 355 92 349L92 331C92 307 92 291 90 272C90 258 92 246 94 236C96 214 98 192 100 178Z';

const AN_CTX={scm:{en:'Sternocleidomastoid',ar:'القترائية الترقوية'},serr:{en:'Serratus anterior',ar:'المنشارية الأمامية'},sart:{en:'Sartorius',ar:'العضلة الخياطية'},patella:{en:'Kneecap (patella)',ar:'الرضفة'},tib:{en:'Tibialis anterior',ar:'الظنبوبية الأمامية'},neck:{en:'Neck extensors',ar:'باسطات الرقبة'},infra:{en:'Infraspinatus',ar:'تحت الشوكة'},teres:{en:'Teres major',ar:'المدورة الكبرى'},glmed:{en:'Gluteus medius',ar:'الألوية المتوسطة'}};

const AN_ABS=[[106,10,91.5],[120,10,91],[134,10,91.5],[148,10,93]].map(r=>{const[y,h,a]=r,x=(a+99)/2;return`abs|m|v|M${a} ${y}Q${x} ${y-1.4} 99 ${y}L99 ${y+h}Q${x} ${y+h+1.4} ${a} ${y+h}Z`});

const AN_FRONT=[
'-|e||100 141 1.6 2.6',
'~scm|c|v|M90 40L94 46L99 59L95 60L89 47Z',
'~serr|c|d|M70 99L78 100L79 107L71 106Z','~serr|c|d|M71 108L79 108L79 115L72 115Z','~serr|c|d|M72 116L79 116L79 123L73 122Z',
'traps|m|d|M94 50C86 53 77 56 68 59C74 64 84 65 92 65C96 62 98 60 99 58Z',
'chest|m|d|M99 66C88 63 78 63 70 68C66 78 67 91 73 99C82 105 93 105 99 99Z',
'chest|l||M99 78C90 76 80 74 69 72',
'chest|l||M99 89C90 87 80 85 70 83',
...AN_ABS,
'abs|l||M91 117H99M91 131H99M91 145H99M93 159H99',
'obliques|m|d|M73 123C73 136 73 148 75 157L90 156L90 126C83 129 77 128 73 123Z',
'obliques|l||M76 132Q81 135 87 136M76 141Q82 144 88 145M77 150Q83 153 89 153',
'-|l||M75 157C83 161 92 167 99 176',
'-|l||M92 46C89 52 87 58 86 64M91 46C94 52 97 55 100 57',
'quads|m|v|M69 170C65 190 64 215 66 240L79 242C77 220 76 196 77 172Z',
'quads|m|v|M77 170C76 196 78 222 80 242L88 242C88 222 88 196 88 170Z',
'quads|m|v|M88 172C94 172 99 178 99 182C97 206 96 224 93 240C91 243 87 243 84 241C87 222 88 196 88 172Z',
'quads|l||M77 172C76 196 78 222 80 242M88 172C88 196 88 222 85 241',
'~sart|c|d|M71 167L75 166C83 184 90 208 94 236L90 238C86 214 79 190 71 167Z',
'~patella|c|v|M78 245C78 241 84 240 90 242C92 248 90 255 84 256C79 254 77 250 78 245Z',
'~tib|c|v|M70 262C69 290 70 316 72 334L78 334C78 312 78 286 76 262Z',
'calves|m|v|M66 262C63 276 65 292 68 308L72 308C71 290 71 274 71 262Z',
'calves|m|v|M86 264C90 280 90 300 89 318L84 318C85 298 84 280 82 264Z',
'delts|m|d|M69 60C57 60 47 66 45 80C44 91 47 98 53 100C57 90 62 74 70 66Z',
'delts|l||M56 64C52 76 51 88 53 99',
'biceps|m|v|M51 98C46 108 45 120 46 131L58 132C60 120 62 108 60 97Z',
'biceps|l||M52 100C52 112 52 122 52 131M57 102C58 113 57 123 56 131',
'triceps|m|v|M43 98C41 110 41 122 42 131L46 131C45 120 46 108 51 98Z',
'forearms|m|v|M42 134C39 148 37 162 36 176L45 178C48 164 52 150 56 134Z',
'forearms|l||M47 137C46 150 44 164 42 177M51 139C49 151 47 164 46 176',
'-|l||M89 36C92 42 96 45 100 46M35 190L36 200M38 191L39 202M41 192L42 202M68 358L68 363M72 358L72 363M76 357L76 363M80 357L80 363M84 357L84 363',
'-|E||86.5 28 2 4',
'-|C||M100 66V100M100 104V172'
];

const AN_BACK=[
'~neck|c|v|M92 44L100 44L100 57L93 52Z',
'~infra|c|h|M70 74C76 78 82 84 86 88C84 96 78 100 72 98C68 90 68 80 70 74Z',
'~teres|c|d|M70 100C76 101 82 103 84 106C82 112 76 114 70 112Z',
'lats|m|d|M71 108C80 104 90 106 98 116C99 128 100 140 100 152C90 150 80 154 74 158C72 142 71 124 71 108Z',
'lowback|m|v|M92 104L99 104L99 166L91 166C90 144 90 122 92 104Z',
'lowback|l||M95 108C94 126 94 146 95 164',
'traps|m|d|M100 48L93 51C84 54 76 57 68 60C74 68 82 76 88 84C94 94 98 104 100 114Z',
'traps|l||M100 67C90 69 80 66 70 62M100 92C94 88 86 80 80 72M74 81C80 84 85 89 88 95M88 95C84 101 78 104 72 106',
'delts|m|d|M69 60C57 60 47 66 45 80C44 91 47 98 53 100C57 90 62 74 70 66Z',
'delts|l||M56 64C52 76 51 88 53 99',
'triceps|m|v|M45 98C41 110 40 124 42 134L57 134C60 120 62 108 60 96Z',
'triceps|l||M51 100C49 112 50 124 51 133',
'forearms|m|v|M42 136C39 150 37 164 36 177L46 179C49 164 53 150 56 136Z',
'forearms|l||M47 139C46 152 44 166 42 178',
'hamstrings|m|v|M70 190C66 210 65 228 67 244L79 246C79 226 80 206 82 192Z',
'hamstrings|m|v|M82 192C90 193 98 188 100 184C98 210 96 230 94 246L80 246C80 226 82 206 82 192Z',
'~glmed|c|d|M71 152C76 146 84 146 91 150C85 154 78 158 74 165Z',
'glutes|m|d|M100 152C88 147 76 152 71 163C68 174 72 187 82 193C92 195 98 189 100 181Z',
'glutes|l||M72 185C82 190 92 190 100 183',
'calves|m|v|M84 258C90 266 92 282 90 304C86 309 82 307 80 301C80 283 82 268 84 258Z',
'calves|m|v|M70 258C66 268 66 284 68 302C72 308 77 306 78 300C78 282 76 268 74 258Z',
'calves|m|v|M71 306C71 318 72 327 74 336L84 336C86 324 86 314 85 306Z',
'calves|l||M79 308L79 336',
'-|l||M72 246C78 249 86 249 92 246M35 190L36 200M38 191L39 202M41 192L42 202',
'-|E||86.5 28 2 4',
'-|C||M100 50V168'
];

const AN_FEMALE_OUT='M100 9C91 9 86 16 86 27C86 35 89 41 93 45L93 51C88 53 80 55 74 57C68 58 62 61 57 66C54 72 52 82 52 94C52 107 53 119 55 131C53 147 51 163 48 178C46 187 45 194 47 200L54 202L59 190C62 180 65 168 68 157C71 147 73 138 75 130C78 118 78 106 76 94C79 106 80 118 82 128C84 137 82 145 78 153C76 160 72 166 68 172C64 179 62 188 62 197C63 205 66 212 70 218C72 226 69 235 64 242C62 250 64 259 68 268C66 290 64 318 68 336L66 350C64 356 62 361 66 363L90 363C94 361 93 355 92 349L92 331C92 307 92 291 90 272C90 259 92 249 94 240C96 229 97 215 98 203C99 194 100 185 100 178Z';
const AN_FEMALE_ABS=[[106,10,84],[120,10,83],[134,10,84],[148,10,86]].map(r=>{const[y,h,a]=r,x=(a+99)/2;return`abs|m|v|M${a} ${y}Q${x} ${y-1.4} 99 ${y}L99 ${y+h}Q${x} ${y+h+1.4} ${a} ${y+h}Z`});
const AN_FEMALE_FRONT=[
'-|e||100 141 1.6 2.6',
'~scm|c|v|M91 40L95 46L99 58L96 59L90 47Z',
'~serr|c|d|M75 99L82 100L83 107L76 106Z','~serr|c|d|M76 108L83 108L83 115L77 115Z','~serr|c|d|M77 116L83 116L83 123L78 122Z',
'traps|m|d|M95 50C89 52 81 55 74 59C80 64 88 65 94 63C97 61 99 59 100 57Z',
'chest|m|d|M99 67C93 64 85 64 78 67C73 69 70 74 70 80C70 87 74 93 80 97C85 100 92 100 99 97Z',
'chest|l||M99 76C92 72 84 71 77 74',
'chest|l||M70 82C72 88 77 94 83 97C88 99 94 99 98 96',
...AN_FEMALE_ABS,
'abs|l||M91 117H99M90 131H99M90 145H99M92 159H99',
'obliques|m|d|M78 123C78 136 77 149 76 157L91 157L92 126C86 129 82 128 78 123Z',
'obliques|l||M80 132Q86 135 91 136M79 141Q85 144 91 145M78 150Q84 153 91 154',
'-|l||M76 157C84 163 93 169 99 176',
'-|l||M92 46C90 52 88 58 87 64M92 46C95 52 98 55 100 57',
'quads|m|v|M63 178C61 197 62 219 63 239L77 242C77 220 77 198 79 178Z',
'quads|m|v|M79 177C78 198 79 221 80 242L89 242C89 220 89 198 90 177Z',
'quads|m|v|M90 178C96 178 100 183 100 187C98 207 96 225 94 240C92 243 88 243 84 241C87 220 89 198 90 178Z',
'quads|l||M77 179C76 199 78 222 80 242M90 179C90 199 89 221 85 241',
'~sart|c|d|M70 167L75 166C84 184 91 209 95 236L91 238C86 212 79 189 70 167Z',
'~patella|c|v|M78 245C78 241 84 240 90 242C92 248 90 255 84 256C79 254 77 250 78 245Z',
'tibialis|m|v|M68 262C68 290 70 316 72 334L78 334C78 311 77 286 75 262Z',
'calves|m|v|M65 262C62 277 64 293 68 308L73 308C72 290 71 274 71 262Z',
'calves|m|v|M87 264C91 280 91 300 89 318L84 318C85 298 84 280 82 264Z',
'delts|m|d|M75 58C65 59 57 65 54 79C53 89 55 96 60 99C64 88 68 73 76 65Z',
'delts|l||M62 64C58 76 57 88 60 99',
'biceps|m|v|M55 98C55 109 55 122 55 135L61 135C63 119 64 108 62 97Z',
'biceps|l||M55 100C55 112 55 124 55 134M60 102C61 114 59 126 58 134',
'triceps|m|v|M51 99C48 111 47 123 48 135L53 135C52 120 54 108 58 98Z',
'forearms|m|v|M55 135C52 149 50 163 49 177L58 179C60 164 63 150 66 135Z',
'forearms|l||M56 138C55 151 53 165 51 178M60 139C59 152 57 165 55 177',
'-|l||M90 36C93 42 97 45 100 46M47 191L48 199M50 192L51 200M53 193L54 201M68 358L68 363M72 358L72 363M76 357L76 363M80 357L80 363M84 357L84 363',
'-|E||86.5 28 2 4',
'-|C||M100 66V100M100 104V172'
];
const AN_FEMALE_BACK=[
'~neck|c|v|M93 44L100 44L100 57L94 52Z',
'~infra|c|h|M75 74C81 78 86 84 89 88C87 96 82 100 77 98C73 90 73 80 75 74Z',
'~teres|c|d|M76 100C82 101 87 103 89 106C87 112 82 114 76 112Z',
'lats|m|d|M77 108C84 105 93 107 99 116C100 128 100 140 100 152C92 150 83 153 79 158C77 142 76 124 77 108Z',
'lowback|m|v|M93 104L99 104L99 166L92 166C91 144 91 122 93 104Z',
'lowback|l||M96 108C95 126 95 146 96 164',
'traps|m|d|M100 48L94 51C87 54 80 57 74 60C80 68 85 76 89 84C94 94 98 104 100 114Z',
'traps|l||M100 67C91 69 83 66 76 62M100 92C94 88 87 80 82 72M78 81C83 84 88 89 89 95M89 95C85 101 81 104 77 106',
'delts|m|d|M75 58C65 59 57 65 54 79C53 89 55 96 60 99C64 88 68 73 76 65Z',
'delts|l||M62 64C58 76 57 88 60 99',
'triceps|m|v|M55 98C51 109 49 123 50 135L62 135C64 120 64 108 62 97Z',
'triceps|l||M55 100C53 112 54 124 54 134',
'forearms|m|v|M55 135C52 150 50 164 49 177L58 179C60 164 63 150 66 135Z',
'forearms|l||M56 139C55 152 53 166 51 178',
'hamstrings|m|v|M66 190C62 210 61 229 63 245L78 247C78 226 80 206 82 192Z',
'hamstrings|m|v|M82 192C90 193 98 188 100 184C98 210 96 230 94 246L79 246C79 226 82 206 82 192Z',
'~glmed|c|d|M72 152C78 147 87 147 94 150C88 156 81 160 75 165Z',
'glutes|m|d|M100 156C91 152 80 153 71 157C67 160 64 165 65 172C66 180 73 186 81 190C91 192 97 187 100 182Z',
'glutes|l||M66 174C76 181 89 181 99 175',
'gastrocnemius|m|v|M85 258C90 266 92 282 90 304C86 309 82 307 80 301C81 283 82 268 85 258Z',
'gastrocnemius|m|v|M70 258C66 268 66 284 68 302C72 308 77 306 78 300C78 282 76 268 74 258Z',
'soleus|m|v|M71 306C71 318 72 327 74 336L84 336C86 324 86 314 85 306Z',
'calves|l||M79 308L79 336',
'-|l||M72 246C78 249 86 249 92 246M47 191L48 199M50 192L51 200M53 193L54 201',
'-|E||86.5 28 2 4',
'-|C||M100 50V168'
];

const AN_FEMALE_HAIR_CAP='M100 8C92 8 86 15 86 24C89 22 91 19 94 18C96 16 98 16 100 17Z';
const AN_FEMALE_PONYTAIL='M110 18C117 17 120 22 117 28C115 32 117 35 122 39C129 45 135 51 138 57C141 63 137 68 132 67C127 66 124 61 125 55C125 50 120 45 116 42C110 38 107 33 110 28C113 24 114 21 110 18Z';

const AN_DEFS='<defs><linearGradient id="anSh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--anat-shine)" stop-opacity=".16"/><stop offset=".55" stop-color="var(--anat-shine)" stop-opacity="0"/><stop offset="1" stop-color="var(--anat-shadow)" stop-opacity="var(--anat-shadow-opacity)"/></linearGradient>'
+[['v',0],['d',32],['h',80]].map(([k,a])=>`<pattern id="anF${k}" width="2.6" height="2.6" patternUnits="userSpaceOnUse" patternTransform="rotate(${a})"><line x1="0" y1="0" x2="0" y2="2.6" stroke="var(--anat-fibre)" stroke-opacity="var(--anat-fibre-opacity)" stroke-width=".55"/></pattern>`).join('')+'</defs>';

function anat(view,P,S,sel,model){
  const MIR=' transform="translate(200 0) scale(-1 1)"';
  const both=s=>s+s.replace(/<(path|ellipse)/,'<$1'+MIR);
  const cl=id=>{const target=id==='gastrocnemius'||id==='soleus'?'calves':id;return'm'+(P.includes(target)?' p':S.includes(target)?' s':'')+(sel===id?' sel':'')};
  let out='',open=null;
  const shut=()=>{if(open){out+='</g>';open=null}};
  (model==='female'?(view==='front'?AN_FEMALE_FRONT:AN_FEMALE_BACK):(view==='front'?AN_FRONT:AN_BACK)).forEach(e=>{
    const[id0,k,f,d]=e.split('|'),ctx=id0[0]==='~',id=ctx?id0.slice(1):id0,mus=!ctx&&MUSCLES[id]?id:null;
    if(mus!==open){shut();if(mus){const nm=esc(bi(MUSCLES[mus]));out+=`<g class="mg" data-act="muscle" data-id="${mus}" tabindex="0" role="button" aria-pressed="${sel===mus}" aria-label="${nm}">`;open=mus}}
    if(k==='m'||k==='c'){
      const nm=esc(bi(k==='m'?MUSCLES[id]:AN_CTX[id])),c=k==='m'?cl(id):'m d';
      out+=both(`<path class="${c}" d="${d}"><title>${nm}</title></path>`)+both(`<path class="sh" d="${d}"/>`)+(f?both(`<path class="fb" fill="url(#anF${f})" d="${d}"/>`):'')}
    else if(k==='l')out+=both(`<path class="absl" d="${d}"/>`);
    else if(k==='C')out+=`<path class="absl sp" d="${d}"/>`;
    else{const[x,y,rx,ry]=d.split(' ');out+=(k==='E'?both:s=>s)(`<ellipse class="${k==='E'?'sil':'absl'}" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`)}
  });
  shut();
  const hair=model==='female'?both(`<path class="anat-hair" d="${AN_FEMALE_HAIR_CAP}"/>`)+`<path class="anat-hair" d="${AN_FEMALE_PONYTAIL}"/><path class="anat-hairband" d="M111 28Q114 30 117 27"/><path class="anat-hair-strand" d="M119 37Q129 49 133 60"/>`:'';
  const breastContour=model==='female'&&view==='front'?both(`<path class="anat-breast-contour" d="M71 80C72 87 76 93 82 96C87 99 93 98 98 95"/>`):'';
  const sil=both(`<path class="sil" d="${model==='female'?AN_FEMALE_OUT:AN_OUT}"/>`);
  return`<svg class="${model==='female'?'female-anatomy':''}" viewBox="0 0 200 372" role="group" aria-label="${t(view)}">${AN_DEFS}${sil}${out}${breastContour}${hair}</svg>`}
