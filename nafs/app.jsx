const {useState,useEffect,useRef,useCallback} = React;

/* ================= الأسئلة — منقولة حرفيًا من عرض المراجعة ================= */
const GROUPS = [
  {title:'صف وتركيب الخلية وربطها بوظائفها الحيوية', c:'#f2a93b', tint:'#fff4dc', name:'الأولى'},
  {title:'صف وتراكيب الخلية وربطها بوظائفها الحيوية', c:'#e07a9b', tint:'#fde8ef', name:'الثانية'},
  {title:'تحديد الاختلافات الأساسية من حيث التركيب والوظيفة بين الخلية النباتية والخلية الحيوانية', c:'#4f9fd8', tint:'#e3f0fb', name:'الثالثة'},
  {title:'تحديد الاختلافات الأساسية من حيث التركيب والوظيفة بين الخلية النباتية والخلية الحيوانية', c:'#8e6fd1', tint:'#efe9fb', name:'الرابعة'},
];
const QUESTIONS = [
  // المجموعة الأولى (الشريحة 3)
  {g:0,art:'human',q:'أي من المخلوقات الحية التالية يعتبر مثالاً على مخلوق عديد الخلايا؟',o:['البكتيريا','الإنسان','البراميسيوم','اليوجلينا'],a:1,
   e:'الإنسان يتكوّن من ملايين الخلايا، أما البكتيريا والبراميسيوم واليوجلينا فكلٌّ منها خلية واحدة فقط.'},
  {g:0,art:'organs',q:'ما الذي يشكله مجموعة من الأعضاء مثل القلب والمعدة والأمعاء التي تعمل معاً؟',o:['نسيج','عنصر','جهاز حيوي','خلية'],a:2,
   e:'الأعضاء التي تعمل معًا لأداء وظيفة واحدة تُكوِّن جهازًا حيويًا، مثل الجهاز الهضمي.'},
  {g:0,art:'mito',q:'ماذا يحدث لو فقدت الخلية الميتوكوندريا الخاصة بها؟',o:['لن تتمكن من تخزين الماء والغذاء.','ستتوقف عملية البناء الضوئي.','لن تتمكن من حماية نفسها.','لن تتمكن من تحويل الغذاء إلى طاقة.'],a:3,
   e:'الميتوكوندريا «مصنع الطاقة» في الخلية؛ فيها يتحول الغذاء إلى طاقة.'},
  {g:0,art:'microbe',q:'إذا لاحظت مخلوقًا مجهريًا تحت المجهر يتكون من خلية واحدة، أي مما يلي يمكن أن يكون؟',o:['نسيج عضلي','جهاز هضمي','جلد إنسان','براميسيوم'],a:3,
   e:'البراميسيوم مخلوق وحيد الخلية، أما النسيج العضلي والجهاز الهضمي وجلد الإنسان فتتكون من خلايا كثيرة.'},
  {g:0,art:'plantcell',q:'أي من التراكيب التالية مسؤول عن إعطاء الخلية النباتية شكلها الثابت وحمايتها؟',o:['الجدار الخلوي','الفجوات','النواة','السيتوبلازم'],a:0,
   e:'الجدار الخلوي غلاف قوي يحيط بالخلية النباتية، فيعطيها شكلها الثابت ويحميها.'},
  // المجموعة الثانية (الشريحة 4)
  {g:1,art:'levels',q:'ما التسلسل الصحيح لمستويات التنظيم في المخلوقات الحية عدة الخلايا، من الأصغر إلى الأكبر؟',o:['نسيج ↔ خلية ↔ عضو ↔ جهاز','خلية ↔ نسيج → عضو → جهاز','عضو → نسيج → خلية → جهاز','جهاز → عضو → نسيج → خلية'],a:1,
   e:'نبدأ بالأصغر: الخلية، ثم النسيج، ثم العضو، ثم الجهاز.'},
  {g:1,art:'chloro',q:'ماذا يمكن أن يحدث لنبات إذا اختفت البلاستيدات الخضراء من خلاياه؟',o:['سينمو بشكل أسرع','لن يتمكن من صنع غذائه','سيصبح أكثر قدرة على امتصاص الماء','سيزداد سمك جدار الخلوي'],a:1,
   e:'في البلاستيدات الخضراء يصنع النبات غذاءه بعملية البناء الضوئي، فبدونها لا يستطيع صنع غذائه.'},
  {g:1,art:'plantcell',q:'ما الوظيفة الرئيسية للجدار الخلوي؟',o:['صنع الغذاء','امتصاص الطاقة الشمسية','الدعم والحماية للخلية','تنظيم الأنشطة الخلوية'],a:2,
   e:'الجدار الخلوي يدعم الخلية النباتية ويحميها.'},
  {g:1,art:'leaf',q:'أي من التراكيب التالية يعتبر مسؤولاً بشكل مباشر عن إعطاء الخلية النباتية لونها الأخضر؟',o:['الغشاء البلازمي','الكلوروفيل','النواة','الجدار الخلوي'],a:1,
   e:'الكلوروفيل صبغة خضراء داخل البلاستيدات الخضراء، وهي التي تعطي النبات لونه الأخضر.'},
  {g:1,art:'membrane',q:'لماذا تحتاج الخلية النباتية إلى وجود كل من الغشاء البلازمي والجدار الخلوي معاً؟',o:['لتنظيم حركة المواد وتوفير الصلابة والحماية','يقومان بنفس الوظيفة','الجدار الخلوي يحل محل الغشاء البلازمي','الغشاء البلازمي يحمي الخلية'],a:0,
   e:'الغشاء البلازمي ينظم دخول المواد وخروجها، والجدار الخلوي يعطي الخلية الصلابة والحماية؛ فلكلٍّ منهما دور.'},
  // المجموعة الثالثة (الشريحة 5)
  {g:2,art:'battery',q:'ما نوع النقل الذي لا يستخدم طاقة الخلية؟',o:['الإخراج الخلوي','البلعمة','النقل السلبي','النقل النشط'],a:2,
   e:'في النقل السلبي تتحرك المواد دون أن تستخدم الخلية شيئًا من طاقتها.'},
  {g:2,art:'osmosis',q:'إذا انتقلت جسيمات الماء من تركيز مرتفع إلى منخفض، فما نوع النقل؟',o:['الخاصية الاسموزية','النقل النشط','النقل العام','الانتشار'],a:0,
   e:'انتقال الماء عبر الغشاء من التركيز المرتفع إلى المنخفض يُسمّى الخاصية الأسموزية، وهي نوع خاص من الانتشار خاصٌّ بالماء.'},
  {g:2,art:'exo',q:'ما العملية التي تستخدمها الخلية للتخلص من الفضلات؟',o:['النقل النشط','النقل السلبي','الإخراج الخلوي','الانتشار'],a:2,
   e:'تتخلص الخلية من فضلاتها بعملية الإخراج الخلوي.'},
  {g:2,art:'diffusion',q:'ما الفرق بين الانتشار والنقل النشط؟',o:['الانتشار يحتاج طاقة، والنقل النشط لا يحتاج طاقة','كلاهما ينقل الماء فقط','الانتشار يحتاج طاقة، النقل النشط لا يحتاج','النقل النشط يحتاج طاقة، والانتشار لا يحتاج'],a:3,
   e:'النقل النشط يحتاج إلى طاقة، أما الانتشار فيحدث دون طاقة.'},
  {g:2,art:'oxygen',q:'أي مما يلي مثال على النقل السلبي؟',o:['إخراج المواد عبر الطاقة','انتقال الأكسجين','إدخال البروتينات الكبيرة','التخلص من الفضلات'],a:1,
   e:'الأكسجين ينتقل إلى داخل الخلية بالانتشار دون طاقة، لذلك هو مثال على النقل السلبي.'},
  // المجموعة الرابعة (الشريحة 6)
  {g:3,art:'photo',q:'أين يحدث البناء الضوئي؟',o:['المخلوقات الخضراء','جدار الخلية','النواة','السيتوبلازم'],a:0,
   e:'يحدث البناء الضوئي في المخلوقات الخضراء، داخل البلاستيدات الخضراء في خلاياها.'},
  {g:3,art:'mito',q:'ماذا يحدث أثناء التنفس الخلوي؟',o:['يستقبل الضوء','ينتج الجلوكوز','تحرر الأكسجين','تحرر طاقة من الغذاء'],a:3,
   e:'في التنفس الخلوي تتحرر الطاقة من الغذاء داخل الميتوكوندريا.'},
  {g:3,art:'water',q:'كيف يساعد الماء في البناء الضوئي؟',o:['ينتج ثاني أكسيد الكربون','يمنع امتصاص الضوء','ينتج الطاقة','يستخدم لإتتاج الغذاء'],a:3,
   e:'يستخدم النبات الماء مع ثاني أكسيد الكربون وضوء الشمس لإنتاج الغذاء.'},
  {g:3,art:'leafo2',q:'ما الذي يمكن استنتاجه من أن النبات ينتج الأكسجين؟',o:['النباتات لا تحتاج إلى ضوء','النباتات لا تحتاج إلى ماء','يساعد الحيوانات في التنفس','النباتات لا تحتاج إلى الأكسجين'],a:2,
   e:'الأكسجين الذي ينتجه النبات تتنفسه الحيوانات والإنسان.'},
  {g:3,art:'oxygen',q:'ما الذي يستخدمه في التنفس الخلوي؟',o:['الضوء','الجلوكوز فقط','الكلوروفيل','الأكسجين'],a:3,
   e:'تستخدم الخلية الأكسجين في التنفس الخلوي لتحرير الطاقة من الغذاء.'},
];
const LETTERS=['أ','ب','ج','د'];
const AR=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const PER=10;

/* ================= sound ================= */
const Sound=(()=>{let ctx=null,on=true;
  const ac=()=>{if(!ctx){try{ctx=new (window.AudioContext||window.webkitAudioContext)();}catch(e){}}if(ctx&&ctx.state==='suspended')ctx.resume();return ctx;};
  const tone=(f,t0,d,type='sine',v=.18,slide)=>{const c=ac();if(!c||!on)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,c.currentTime+t0);if(slide)o.frequency.exponentialRampToValueAtTime(slide,c.currentTime+t0+d);g.gain.setValueAtTime(0,c.currentTime+t0);g.gain.linearRampToValueAtTime(v,c.currentTime+t0+.015);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+t0+d);o.connect(g).connect(c.destination);o.start(c.currentTime+t0);o.stop(c.currentTime+t0+d+.05);};
  return{
    toggle(){on=!on;return on;},get on(){return on;},unlock(){ac();},
    click(){tone(660,0,.08,'triangle',.12);},
    good(){[784,988,1175,1568].forEach((f,i)=>tone(f,i*.09,.45,'triangle',.16));tone(2093,.38,.6,'sine',.08);},
    bad(){tone(392,0,.25,'sine',.14,330);tone(330,.22,.35,'sine',.12,294);},
    fanfare(){[523,659,784,1047,784,1047,1319].forEach((f,i)=>tone(f,i*.12,.5,'triangle',.15));},
    whoosh(){tone(300,0,.25,'sine',.05,900);},
  };})();

/* ================= decorative scene ================= */
function Scene(){
  const clouds=[[8,12,140,46,70],[30,22,110,36,95],[55,8,170,52,80],[75,26,120,40,110]];
  const petals=['🌸','🌼','🍃'];
  return (
    <div className="scene" aria-hidden="true">
      {clouds.map(([t,dl,w,h,d],i)=><div key={i} className="cloud" style={{top:t+'vh',width:w,height:h,animationDuration:d+'s',animationDelay:-dl*1.5+'s'}}/>)}
      {[...Array(7)].map((_,i)=><span key={i} className="petal" style={{left:(i*14+4)+'vw',animationDuration:(14+i*3)+'s',animationDelay:-i*2.3+'s'}}>{petals[i%3]}</span>)}
      <Flag/>
      <svg className="skyline" viewBox="0 0 560 300">
        <g fill="#b9d3e3">
          <rect x="20" y="170" width="40" height="130"/><rect x="70" y="150" width="34" height="150"/><rect x="250" y="160" width="46" height="140"/><rect x="300" y="190" width="30" height="110"/>
        </g>
        {/* Kingdom Centre */}
        <path d="M140 300 L150 40 Q175 10 200 40 L210 300 Z M160 60 Q175 90 190 60 Q182 40 175 40 Q168 40 160 60Z" fill="#9fc0d6" fillRule="evenodd"/>
        <path d="M168 50 Q175 80 182 50" fill="none" stroke="#cde7f6" strokeWidth="6"/>
        {/* Al Faisaliah */}
        <path d="M222 300 L238 70 L254 300 Z" fill="#a8c7da"/><circle cx="238" cy="120" r="10" fill="#e8d7a8"/><path d="M238 40 L238 70" stroke="#a8c7da" strokeWidth="3"/>
        {/* palms */}
        {[[90,300],[350,300],[420,300]].map(([x,y],i)=><Palm key={i} x={x} y={y} s={i?1:1.15}/>)}
        <path d="M0 300 C120 270 240 280 360 268 S520 280 560 270 L560 300Z" fill="#9fc98a" opacity=".8"/>
      </svg>
      <svg className="fort" viewBox="0 0 500 300">
        <path d="M60 300 V170 h20 v-12 h12 v12 h16 v-12 h12 v12 h16 V150 h14 v-12 h10 v12 h14 v20 h70 v-12 h12 v12 h16 v-12 h12 v12 h20 V130 h14 v-12 h12 v12 h14 V300Z" fill="#e8c99a"/>
        <path d="M120 300 V230 a18 18 0 0 1 36 0 V300Z M300 300 V240 a14 14 0 0 1 28 0 V300Z" fill="#c9a26e"/>
        <g fill="#c9a26e">{[[100,200],[180,190],[250,200],[350,180]].map(([x,y],i)=><rect key={i} x={x} y={y} width="10" height="16" rx="2"/>)}</g>
        <Palm x={40} y={300} s={1.1}/><Palm x={450} y={300} s={1.25}/>
        <path d="M0 290 C120 270 300 285 500 268 L500 300 L0 300Z" fill="#a9d293" opacity=".85"/>
      </svg>
      <div className="desk"/>
    </div>
  );
}
function Palm({x,y,s=1}){
  return <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-4 0 C-2 -40 -6 -80 0 -110 L6 -110 C2 -80 6 -40 4 0Z" fill="#a37a4a"/>
    <g fill="#5fae84" transform="translate(3 -110)">
      {[-150,-110,-70,-30,10,40].map((a,i)=><path key={i} d="M0 0 C20 -18 45 -14 62 4 C40 -4 20 -2 0 0Z" transform={`rotate(${a})`}/>)}
    </g>
  </g>;
}
function Flag(){
  return <svg className="flag" viewBox="0 0 250 200">
    <rect x="6" y="0" width="7" height="200" rx="3" fill="#b9b9b9"/><circle cx="9.5" cy="4" r="6" fill="#e5c25a"/>
    <g className="cloth">
      <clipPath id="fc"><rect x="13" y="12" width="230" height="150" rx="4"/></clipPath>
      <g clipPath="url(#fc)">
        <rect x="13" y="12" width="230" height="150" fill="#0b6b3a"/>
        <text x="128" y="78" textAnchor="middle" fill="#fff" fontFamily="'Aref Ruqaa','Amiri',serif" fontSize="25" fontWeight="700" textLength="196" lengthAdjust="spacingAndGlyphs">لا إله إلا الله محمد رسول الله</text>
        <path d="M60 112 H186 l10 -4 v8 l-10 -4 M186 112 h8 M62 106 v12" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round"/>
        <rect className="shine" x="0" y="12" width="60" height="150" fill="url(#sh)"/>
      </g>
      <linearGradient id="sh" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset=".5" stopColor="#fff" stopOpacity=".18"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
    </g>
  </svg>;
}

/* ================= cartoon student ================= */
function Buddy({mood='idle',say}){
  const happy=mood==='happy',sad=mood==='sad';
  return (
    <div className="buddy">
      {say && <div className="bubble" key={say}>{say}</div>}
      <svg viewBox="0 0 220 330" className={'b-'+mood} role="img" aria-label="طالبة كرتونية">
        {/* hair back */}
        <path d="M52 110 C40 200 46 260 60 290 L160 290 C174 260 180 200 168 110 Z" fill="#3b2418"/>
        {/* body */}
        <path d="M70 200 C70 180 150 180 150 200 L166 300 L54 300 Z" fill="#11633a"/>
        <path d="M86 186 L110 214 L134 186 Z" fill="#fff"/>
        <path d="M100 196 L110 206 L120 196 L116 214 L104 214Z" fill="#0b4f2d"/>
        {/* legs */}
        <rect x="80" y="296" width="18" height="26" rx="6" fill="#f3cdb5"/><rect x="122" y="296" width="18" height="26" rx="6" fill="#f3cdb5"/>
        <ellipse cx="88" cy="324" rx="16" ry="7" fill="#2a2a2a"/><ellipse cx="132" cy="324" rx="16" ry="7" fill="#2a2a2a"/>
        {/* left arm holding book */}
        <path d="M72 205 C52 230 54 255 76 262" stroke="#fff" strokeWidth="16" fill="none" strokeLinecap="round"/>
        <rect x="58" y="236" width="38" height="46" rx="5" fill="#f4a7bf" transform="rotate(-8 77 259)"/>
        <text x="77" y="263" textAnchor="middle" fontSize="16" fill="#fff" transform="rotate(-8 77 259)">🌴</text>
        {/* right arm with pointer */}
        <g className="arm">
          <path d="M150 205 C172 192 182 172 186 152" stroke="#fff" strokeWidth="16" fill="none" strokeLinecap="round"/>
          <circle cx="187" cy="148" r="9" fill="#f3cdb5"/>
          <path d="M189 146 L210 70" stroke="#3a2a1a" strokeWidth="5" strokeLinecap="round"/>
          <circle cx="210" cy="68" r="5" fill={happy?'#f5b82e':'#e07a9b'}/>
        </g>
        {/* head */}
        <circle cx="110" cy="118" r="58" fill="#f6d5bf"/>
        {/* bangs */}
        <path d="M52 112 C54 60 90 46 112 48 C140 48 168 66 168 112 C150 92 130 80 112 84 C96 78 70 88 52 112Z" fill="#3b2418"/>
        {/* bow */}
        <g transform="translate(150 66)"><path d="M0 0 L-22 -14 L-22 14Z M0 0 L22 -14 L22 14Z" fill="#11633a"/><circle r="6" fill="#0b4f2d"/></g>
        {/* eyes */}
        {happy ? <g stroke="#2b1a10" strokeWidth="5" fill="none" strokeLinecap="round"><path d="M80 124 q10 -12 20 0"/><path d="M120 124 q10 -12 20 0"/></g>
          : <g className="blink"><ellipse cx="90" cy="124" rx="10" ry="13" fill="#2b1a10"/><ellipse cx="130" cy="124" rx="10" ry="13" fill="#2b1a10"/><circle cx="93" cy="119" r="4" fill="#fff"/><circle cx="133" cy="119" r="4" fill="#fff"/></g>}
        {sad && <g stroke="#2b1a10" strokeWidth="3" strokeLinecap="round"><path d="M80 104 l16 -4"/><path d="M140 104 l-16 -4"/></g>}
        {/* cheeks */}
        <ellipse cx="76" cy="146" rx="10" ry="6" fill="#f4a7bf" opacity=".7"/><ellipse cx="144" cy="146" rx="10" ry="6" fill="#f4a7bf" opacity=".7"/>
        {/* mouth */}
        {happy ? <path d="M94 148 q16 22 32 0 z" fill="#c94f6d"/> : sad ? <path d="M98 156 q12 -6 24 0" stroke="#c94f6d" strokeWidth="4" fill="none" strokeLinecap="round"/> : <path d="M96 150 q14 12 28 0" stroke="#c94f6d" strokeWidth="4" fill="none" strokeLinecap="round"/>}
        {happy && <g fill="#f5b82e"><text x="20" y="70" fontSize="24">✦</text><text x="186" y="40" fontSize="18">✦</text></g>}
      </svg>
    </div>
  );
}

/* ================= animated science illustrations ================= */
const Spin=({cx,cy,dur=8,children})=><g>{children}<animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur={dur+'s'} repeatCount="indefinite"/></g>;
const Float=({dy=6,dur=2.4,delay=0,children})=><g>{children}<animateTransform attributeName="transform" type="translate" values={`0 0;0 ${-dy};0 0`} dur={dur+'s'} begin={delay+'s'} repeatCount="indefinite"/></g>;
function Art({k}){
  const P={viewBox:'0 0 200 200'};
  switch(k){
  case 'human': return <svg {...P}>
      <circle cx="100" cy="46" r="22" fill="#f6d5bf"/><path d="M70 80 h60 l10 70 h-80z" fill="#7fbfe0"/><rect x="74" y="150" width="18" height="40" rx="6" fill="#4d6a9a"/><rect x="108" y="150" width="18" height="40" rx="6" fill="#4d6a9a"/>
      {[...Array(12)].map((_,i)=><Float key={i} dy={4} dur={1.6+i%4*.3} delay={i*.15}><circle cx={78+(i%4)*15} cy={92+Math.floor(i/4)*18} r="6" fill="#fff" stroke="#e07a9b" strokeWidth="2"/><circle cx={78+(i%4)*15} cy={92+Math.floor(i/4)*18} r="2" fill="#e07a9b"/></Float>)}
    </svg>;
  case 'organs': return <svg {...P}>
      <Float><path d="M100 40 c-20 -20 -50 0 -30 25 l30 28 l30 -28 c20 -25 -10 -45 -30 -25z" fill="#e8607e"><animateTransform attributeName="transform" type="scale" values="1;1.06;1" dur=".9s" repeatCount="indefinite" additive="sum"/></path></Float>
      <path d="M118 100 c30 0 40 40 10 55 c-20 10 -30 -5 -42 0 c-14 6 -22 -8 -10 -20 c14 -14 10 -35 42 -35z" fill="#f4a07a"/>
      <path d="M70 160 c20 10 40 -10 60 0 c20 10 0 25 -20 22 c-20 -3 -40 10 -50 -5 z" fill="#f2c08a"/>
      <text x="100" y="196" textAnchor="middle" fontSize="15" fontWeight="800" fill="#4d6a59">جهاز حيوي</text>
    </svg>;
  case 'mito': return <svg {...P}>
      <Float dy={5}><ellipse cx="100" cy="100" rx="78" ry="46" fill="#f08a5d" stroke="#c4542a" strokeWidth="5"/>
      <path d="M38 100 q10 -30 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" fill="none" stroke="#ffd6a0" strokeWidth="6" strokeLinejoin="round"/></Float>
      {[0,1,2].map(i=><text key={i} x={150+i*12} y="40" fontSize="22" fill="#f5b82e">⚡<animate attributeName="opacity" values="0;1;0" dur="1.5s" begin={i*.5+'s'} repeatCount="indefinite"/></text>)}
    </svg>;
  case 'microbe': return <svg {...P}>
      <circle cx="100" cy="100" r="86" fill="#e8f6ff" stroke="#9cc6e0" strokeWidth="6"/>
      <g><animateTransform attributeName="transform" type="translate" values="-10 0;14 6;-10 0" dur="5s" repeatCount="indefinite"/>
      <path d="M50 100 C50 70 150 60 156 96 C162 130 60 140 50 100Z" fill="#c9b6f0" stroke="#8e6fd1" strokeWidth="4"/>
      <circle cx="96" cy="98" r="12" fill="#8e6fd1"/><circle cx="130" cy="94" r="6" fill="#fff" stroke="#8e6fd1" strokeWidth="2"/>
      {[...Array(14)].map((_,i)=>{const a=i/14*6.28;return <line key={i} x1={103+Math.cos(a)*52} y1={98+Math.sin(a)*32} x2={103+Math.cos(a)*60} y2={98+Math.sin(a)*38} stroke="#8e6fd1" strokeWidth="2"><animate attributeName="x2" values={`${103+Math.cos(a)*60};${103+Math.cos(a+.2)*60};${103+Math.cos(a)*60}`} dur=".6s" repeatCount="indefinite"/></line>;})}</g>
    </svg>;
  case 'plantcell': return <svg {...P}>
      <rect x="22" y="30" width="156" height="140" rx="14" fill="#9fd67a" stroke="#4f9a3a" strokeWidth="9"><animate attributeName="stroke-width" values="9;12;9" dur="1.6s" repeatCount="indefinite"/></rect>
      <rect x="34" y="42" width="132" height="116" rx="10" fill="#e9f7d9" stroke="#7fbf5f" strokeWidth="2"/>
      <ellipse cx="96" cy="100" rx="38" ry="30" fill="#cfe9f7" stroke="#8cc4e3" strokeWidth="3"/>
      <circle cx="140" cy="70" r="14" fill="#c9b6f0" stroke="#8e6fd1" strokeWidth="3"/>
      {[[56,60],[60,140],[140,130],[150,104]].map(([x,y],i)=><Float key={i} dy={3} delay={i*.3}><ellipse cx={x} cy={y} rx="10" ry="6" fill="#3f9a3f"/></Float>)}
    </svg>;
  case 'levels': return <svg {...P}>
      {[['🔵','خلية'],['🧫','نسيج'],['🫀','عضو'],['🧍‍♀️','جهاز']].map(([e,t],i)=><g key={i} opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.15;.85;1" dur="6s" begin={i*.6+'s'} repeatCount="indefinite"/>
        <text x={166-i*44} y={90} textAnchor="middle" fontSize={20+i*6}>{e}</text><text x={166-i*44} y={130} textAnchor="middle" fontSize="15" fontWeight="800" fill="#4d6a59">{t}</text></g>)}
      <path d="M180 160 H24" stroke="#e07a9b" strokeWidth="4" strokeDasharray="6 6"><animate attributeName="stroke-dashoffset" from="0" to="24" dur="1s" repeatCount="indefinite"/></path>
      <text x="100" y="186" textAnchor="middle" fontSize="13" fontWeight="800" fill="#e07a9b">من الأصغر إلى الأكبر</text>
    </svg>;
  case 'chloro': return <svg {...P}>
      <Float><ellipse cx="100" cy="100" rx="80" ry="50" fill="#9fd67a" stroke="#3f8f3a" strokeWidth="6"/>
      {[60,90,120,150].map((x,i)=><g key={i}>{[0,1,2].map(j=><rect key={j} x={x-14} y={84+j*10} width="28" height="8" rx="4" fill="#2f7d2f"/>)}</g>)}</Float>
      <text x="40" y="36" fontSize="26">☀️<animateTransform attributeName="transform" type="rotate" from="0 54 28" to="360 54 28" dur="10s" repeatCount="indefinite"/></text>
    </svg>;
  case 'leaf': return <svg {...P}>
      <path d="M30 170 C30 80 100 30 176 30 C176 110 120 170 30 170Z" fill="#5fbf55"><animate attributeName="fill" values="#9bd88f;#3f9a3f;#9bd88f" dur="3s" repeatCount="indefinite"/></path>
      <path d="M30 170 C80 120 120 80 176 30" stroke="#2f7d2f" strokeWidth="5" fill="none"/>
      {[[80,110],[110,80],[130,110],[90,140]].map(([x,y],i)=><Float key={i} delay={i*.4}><circle cx={x} cy={y} r="7" fill="#1f6b2a"/></Float>)}
    </svg>;
  case 'membrane': return <svg {...P}>
      <rect x="16" y="20" width="168" height="160" rx="18" fill="none" stroke="#4f9a3a" strokeWidth="12"/>
      <rect x="32" y="36" width="136" height="128" rx="12" fill="#eef9e6" stroke="#e07a9b" strokeWidth="4" strokeDasharray="8 5"/>
      {[0,1,2].map(i=><circle key={i} r="7" fill="#4f9fd8"><animateMotion dur="3s" begin={i+'s'} repeatCount="indefinite" path="M100 0 L100 100"/></circle>)}
      <text x="100" y="196" textAnchor="middle" fontSize="12" fontWeight="800" fill="#4d6a59">جدار + غشاء</text>
    </svg>;
  case 'battery': return <svg {...P}>
      <rect x="60" y="40" width="80" height="130" rx="14" fill="#fff" stroke="#3f8f3a" strokeWidth="7"/><rect x="85" y="26" width="30" height="16" rx="4" fill="#3f8f3a"/>
      <rect x="70" y="110" width="60" height="50" rx="8" fill="#9fd67a"><animate attributeName="height" values="50;20;50" dur="3s" repeatCount="indefinite"/><animate attributeName="y" values="110;140;110" dur="3s" repeatCount="indefinite"/></rect>
      <path d="M104 64 l-16 30 h14 l-6 26 l20 -34 h-14z" fill="#f5b82e"/>
    </svg>;
  case 'osmosis': return <svg {...P}>
      <line x1="100" y1="20" x2="100" y2="180" stroke="#e07a9b" strokeWidth="5" strokeDasharray="10 8"/>
      {[...Array(10)].map((_,i)=><circle key={i} r="7" fill="#4f9fd8"><animateMotion dur={2.4+i%3*.5+'s'} begin={i*.3+'s'} repeatCount="indefinite" path={`M${30+(i%3)*18} ${30+i*15} L${130+(i%3)*18} ${36+i*14}`}/></circle>)}
      <text x="50" y="196" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4d6a59">مرتفع</text><text x="150" y="196" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4d6a59">منخفض</text>
    </svg>;
  case 'exo': return <svg {...P}>
      <path d="M10 150 Q100 110 190 150" stroke="#8e6fd1" strokeWidth="10" fill="none"/>
      <Float dy={4}><circle cx="100" cy="170" r="18" fill="#c9b6f0" stroke="#8e6fd1" strokeWidth="4"/></Float>
      {[0,1,2,3].map(i=><circle key={i} r="7" fill="#e8607e"><animateMotion dur="2.4s" begin={i*.6+'s'} repeatCount="indefinite" path={`M100 165 Q${70+i*20} 90 ${40+i*40} 20`}/></circle>)}
    </svg>;
  case 'diffusion': return <svg {...P}>
      <rect x="10" y="40" width="85" height="120" rx="12" fill="#fff4dc"/><rect x="105" y="40" width="85" height="120" rx="12" fill="#e3f0fb"/>
      {[0,1,2,3].map(i=><circle key={i} r="7" fill="#f2a93b"><animateMotion dur="3s" begin={i*.7+'s'} repeatCount="indefinite" path={`M30 ${60+i*25} L170 ${70+i*22}`}/></circle>)}
      <text x="52" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4d6a59">انتشار</text>
      <text x="148" y="30" textAnchor="middle" fontSize="13" fontWeight="800" fill="#4d6a59">نشط ⚡</text>
      <text x="100" y="186" textAnchor="middle" fontSize="20">🔋</text>
    </svg>;
  case 'oxygen': return <svg {...P}>
      {[0,1,2].map(i=><g key={i}><animateTransform attributeName="transform" type="translate" values={`0 40;0 -30`} dur="3.6s" begin={i*1.2+'s'} repeatCount="indefinite"/>
        <circle cx={60+i*40} cy={120} r="20" fill="#7fc4ef"/><circle cx={80+i*40} cy={120} r="20" fill="#4f9fd8"/>
        <text x={70+i*40} y={126} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">O₂</text>
        <animate attributeName="opacity" values="0;1;0" dur="3.6s" begin={i*1.2+'s'} repeatCount="indefinite"/></g>)}
    </svg>;
  case 'photo': return <svg {...P}>
      <Spin cx={44} cy={44} dur={12}><circle cx="44" cy="44" r="22" fill="#f5c84a"/>{[...Array(8)].map((_,i)=><line key={i} x1="44" y1="44" x2={44+Math.cos(i*.785)*36} y2={44+Math.sin(i*.785)*36} stroke="#f5c84a" strokeWidth="4"/>)}</Spin>
      {[0,1,2].map(i=><line key={i} x1={60+i*12} y1={70+i*6} x2={110+i*12} y2={120+i*6} stroke="#f5c84a" strokeWidth="4" strokeDasharray="6 6"><animate attributeName="stroke-dashoffset" from="24" to="0" dur=".8s" repeatCount="indefinite"/></line>)}
      <path d="M90 180 C90 120 140 96 186 96 C186 150 150 180 90 180Z" fill="#5fbf55"/><path d="M90 180 C120 150 150 120 186 96" stroke="#2f7d2f" strokeWidth="4" fill="none"/>
    </svg>;
  case 'water': return <svg {...P}>
      <path d="M40 180 C40 110 100 70 170 70 C170 140 120 180 40 180Z" fill="#5fbf55"/>
      {[0,1,2].map(i=><path key={i} d="M0 -14 C6 -4 10 2 10 8 a10 10 0 0 1 -20 0 C-10 2 -6 -4 0 -14Z" fill="#4f9fd8"><animateMotion dur="2.4s" begin={i*.8+'s'} repeatCount="indefinite" path={`M${50+i*35} 10 L${70+i*30} 130`}/><animate attributeName="opacity" values="1;1;0" dur="2.4s" begin={i*.8+'s'} repeatCount="indefinite"/></path>)}
      <text x="140" y="170" fontSize="26">🍞</text>
    </svg>;
  case 'leafo2': return <svg {...P}>
      <path d="M20 190 C20 110 80 60 150 60 C150 140 100 190 20 190Z" fill="#5fbf55"/>
      {[0,1].map(i=><g key={i}><animateTransform attributeName="transform" type="translate" values="0 0;30 -60" dur="3s" begin={i*1.5+'s'} repeatCount="indefinite"/>
        <circle cx={110+i*20} cy={100} r="16" fill="#7fc4ef"/><text x={110+i*20} y={105} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff">O₂</text>
        <animate attributeName="opacity" values="0;1;0" dur="3s" begin={i*1.5+'s'} repeatCount="indefinite"/></g>)}
      <text x="150" y="190" fontSize="34">🐑</text>
    </svg>;
  default: return null;
  }
}

/* ================= effects ================= */
function useFx(){
  const [items,setItems]=useState([]);
  const add=useCallback((list,ms=1800)=>{const id=Math.random();setItems(s=>[...s,{id,list}]);setTimeout(()=>setItems(s=>s.filter(x=>x.id!==id)),ms);},[]);
  const stars=useCallback((x,y)=>{add([...Array(26)].map((_,i)=>{const a=Math.random()*6.283,d=80+Math.random()*220;
    return <span key={i} className="star" style={{'--x':x+'px','--y':y+'px','--dx':Math.cos(a)*d+'px','--dy':Math.sin(a)*d+'px','--r':(Math.random()*720-360)+'deg','--s':(16+Math.random()*30)+'px',animationDelay:Math.random()*.12+'s'}}>{Math.random()<.7?'★':'✦'}</span>;})
    .concat(<span key="p" className="plus" style={{'--x':x+'px','--y':y+'px'}}>+{AR(PER)}</span>));},[add]);
  const confetti=useCallback(()=>{const cols=['#f5b82e','#e07a9b','#5fae84','#4f9fd8','#8e6fd1','#0b6b3a'];
    add([...Array(90)].map((_,i)=><span key={i} className="conf" style={{'--x':Math.random()*100+'vw','--c':cols[i%6],'--d':(2.2+Math.random()*2)+'s','--sx':(Math.random()*120-60)+'px',animationDelay:Math.random()*.8+'s'}}/>),4200);},[add]);
  const layer=<div className="fx" aria-hidden="true">{items.map(it=><React.Fragment key={it.id}>{it.list}</React.Fragment>)}</div>;
  return {stars,confetti,layer};
}

/* ================= result image ================= */
const downloadsP = (window.claude && window.claude.use) ? window.claude.use('downloads').catch(()=>null) : Promise.resolve(null);
function rr(ctx,x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
async function drawResult(r){
  try{await Promise.all(['800 60px "Baloo Bhaijaan 2"','800 30px Tajawal','700 30px "Aref Ruqaa"'].map(f=>document.fonts.load(f)));}catch(e){}
  const W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#cde7f6');g.addColorStop(.7,'#fdf1e4');x.fillStyle=g;x.fillRect(0,0,W,H);
  // flag
  x.fillStyle='#0b6b3a';rr(x,W-300,50,240,160,10);x.fill();x.fillStyle='#fff';x.font='700 28px "Aref Ruqaa", serif';x.textAlign='center';x.direction='rtl';x.fillText('لا إله إلا الله محمد رسول الله',W-180,125,200);
  x.strokeStyle='#fff';x.lineWidth=6;x.lineCap='round';x.beginPath();x.moveTo(W-250,165);x.lineTo(W-110,165);x.stroke();
  // board
  x.fillStyle='#d9a96b';rr(x,60,240,W-120,1000,40);x.fill();x.fillStyle='#fffdf8';rr(x,84,264,W-168,952,26);x.fill();
  x.textAlign='center';x.fillStyle='#0b6b3a';x.font='800 64px "Baloo Bhaijaan 2", Tajawal, sans-serif';x.fillText('🏆 نتيجة عالمة نافس',W/2,370);
  x.fillStyle='#e07a9b';x.font='800 40px "Baloo Bhaijaan 2", Tajawal, sans-serif';x.fillText('🌟 بمهاراتي أنافس 🌟',W/2,440);
  x.fillStyle='#f8cfdc';rr(x,240,480,W-480,90,24);x.fill();x.fillStyle='#1f3b2c';x.font='800 50px "Baloo Bhaijaan 2", Tajawal, sans-serif';x.fillText(r.name,W/2,542);
  const rows=[['عدد الأسئلة',AR(r.total),'#fff4dc'],['الإجابات الصحيحة',AR(r.right),'#e3f6ea'],['الإجابات الخاطئة',AR(r.wrong),'#fde8ef'],['النسبة المئوية',AR(r.pct)+'٪','#e3f0fb'],['النقاط',AR(r.points),'#efe9fb']];
  rows.forEach(([k,v,bg],i)=>{const y=610+i*96;x.fillStyle=bg;rr(x,150,y,W-300,80,22);x.fill();x.textAlign='right';x.fillStyle='#4d6a59';x.font='800 36px Tajawal, sans-serif';x.fillText(k,W-185,y+53);x.textAlign='left';x.fillStyle='#1f3b2c';x.font='800 46px "Baloo Bhaijaan 2", Tajawal, sans-serif';x.fillText(v,185,y+56);});
  x.textAlign='center';x.fillStyle='#0b6b3a';x.font='800 38px "Baloo Bhaijaan 2", Tajawal, sans-serif';
  const words=r.cheer.split(' ');let line='',lines=[];words.forEach(w=>{const t=line?line+' '+w:w;if(x.measureText(t).width>W-260){lines.push(line);line=w;}else line=t;});lines.push(line);
  lines.slice(0,2).forEach((l,i)=>x.fillText(l,W/2,1130+i*50));
  x.fillStyle='#5b3712';x.font='800 34px Tajawal, sans-serif';x.fillText('إعداد المعلمة: أ/ شامه البقمي',W/2,1290);
  x.fillStyle='#4d6a59';x.font='700 28px Tajawal, sans-serif';x.fillText('الابتدائية العشرون لتحفيظ القرآن · '+new Date().toLocaleDateString('ar-SA'),W/2,1330);
  return await new Promise(res=>c.toBlob(res,'image/png'));
}
function cheerFor(p){
  if(p===100) return 'مذهلة! أجبتِ عن جميع الأسئلة بشكل صحيح، أنتِ عالمة نافس الأولى 🏆';
  if(p>=80) return 'ممتازة يا بطلة! مستواكِ رائع، واصلي التألق 🌟';
  if(p>=60) return 'جيد جدًا! أنتِ على الطريق الصحيح، راجعي الأسئلة القليلة التي أخطأتِ فيها 💚';
  if(p>=40) return 'بداية جميلة! بالمراجعة والتدريب ستصبحين أقوى 🌷';
  return 'لا بأس يا عالمة المستقبل، كل محاولة تعلّمكِ شيئًا جديدًا. أعيدي المحاولة وستتفوقين 🌸';
}

/* ================= screens ================= */
function Start({onStart}){
  const [name,setName]=useState('');const [err,setErr]=useState('');
  const go=e=>{e.preventDefault();const n=name.trim();if(!n){setErr('اكتبي اسمكِ أولًا 🌸');return;}Sound.unlock();Sound.fanfare();onStart(n);};
  return <form className="card" onSubmit={go}>
    <div className="meta"><span className="chip">العلوم</span><span className="chip">الصف السادس الابتدائي</span><span className="chip">مراجعة مهارات نافس</span></div>
    <h1>🌟 بمهاراتي أنافس 🌟</h1>
    <h2>مغامرة العلوم التفاعلية</h2>
    <div className="startrow">
      <Buddy mood="happy"/>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        <p style={{fontSize:'clamp(20px,2.8vw,28px)',fontFamily:'var(--f-display)',fontWeight:800}}>🌸 مرحبًا يا عالمة المستقبل!</p>
        <p>هل أنتِ مستعدة لتحدي نافس؟<br/>اكتبي اسمكِ وابدئي المغامرة.</p>
        <div className="field"><label htmlFor="studentName">اسم الطالبة</label>
          <input id="studentName" value={name} maxLength={40} autoComplete="off" placeholder="اكتبي اسمكِ هنا" onChange={e=>{setName(e.target.value);setErr('');}}/></div>
        <div className="hint" role="alert">{err}</div>
      </div>
    </div>
    <button className="btn" type="submit">🚀 ابدئي اللعب</button>
    <p style={{fontSize:'clamp(14px,1.8vw,17px)',color:'var(--ink-soft)'}}>{AR(QUESTIONS.length)} سؤالًا في {AR(GROUPS.length)} مجموعات · لكل إجابة صحيحة {AR(PER)} نقاط</p>
    <p style={{fontSize:'clamp(15px,1.9vw,18px)'}}>إعداد المعلمة: أ/ شامه البقمي<br/><span style={{color:'var(--ink-soft)'}}>الابتدائية العشرون لتحفيظ القرآن</span></p>
  </form>;
}

function Play({name,onDone,fx}){
  const [i,setI]=useState(0);const [pick,setPick]=useState(null);const [answers,setAnswers]=useState([]);const [bump,setBump]=useState(0);const [group,setGroup]=useState(null);
  const q=QUESTIONS[i],G=GROUPS[q.g];const right=answers.filter(Boolean).length;const done=pick!==null;const ok=done&&pick===q.a;
  const choose=(k,e)=>{if(done)return;setPick(k);const good=k===q.a;setAnswers(a=>[...a,good]);
    if(good){const r=e.currentTarget.getBoundingClientRect();fx.stars(r.left+r.width/2,r.top+r.height/2);Sound.good();setBump(b=>b+1);}else Sound.bad();};
  const next=()=>{Sound.whoosh();const lastInGroup=i===QUESTIONS.length-1||QUESTIONS[i+1].g!==q.g;
    if(lastInGroup){const gq=QUESTIONS.map((x,j)=>j).filter(j=>QUESTIONS[j].g===q.g);const gr=gq.filter(j=>answers[j]).length;setGroup({g:q.g,right:gr,total:gq.length,last:i===QUESTIONS.length-1});fx.confetti();Sound.fanfare();return;}
    setPick(null);setI(i+1);};
  const cont=()=>{const last=group.last;setGroup(null);if(last){onDone(answers);return;}setPick(null);setI(i+1);};
  const fbRef=useRef(null);
  useEffect(()=>{if(done&&fbRef.current&&fbRef.current.scrollIntoView)setTimeout(()=>fbRef.current&&fbRef.current.scrollIntoView({behavior:'smooth',block:'nearest'}),150);},[done]);
  useEffect(()=>{window.scrollTo&&window.scrollTo({top:0,behavior:'smooth'});},[i]);
  const mood=!done?'idle':ok?'happy':'sad';
  const say=!done?(i===0?`هيا يا ${name}! اقرئي السؤال جيدًا 📖`:'ركّزي، أنتِ قادرة! 💪'):ok?'أحسنتِ! إجابة رائعة ⭐':'لا بأس، نتعلم من أخطائنا 🌷';
  return <>
    <div className="topbar">
      <div className="brand">🌟 بمهاراتي أنافس 🌟<small>مغامرة العلوم التفاعلية</small></div>
      <div className="chips"><span className="chip">👧 {name}</span><span key={bump} className={'chip score'+(bump?' bump':'')}>💚 {AR(right*PER)} نقطة</span></div>
    </div>
    <div className="progress" aria-label="تقدم الطالبة">
      <div className="plabel"><span>المجموعة {G.name} · السؤال {AR(i+1)} من {AR(QUESTIONS.length)}</span><span>{AR(Math.round(answers.length/QUESTIONS.length*100))}٪</span></div>
      <div className="track"><div className="fill" style={{width:(answers.length/QUESTIONS.length*100)+'%'}}/></div>
      <div className="dots">{QUESTIONS.map((x,j)=><span key={j} className={'dot'+(j<answers.length?(answers[j]?' ok':' no'):j===i?' now':'')+(j>0&&QUESTIONS[j-1].g!==x.g?' gap':'')}/>)}</div>
    </div>
    <div className="stage">
      <section className="board qenter" key={i} style={{'--c':G.c,'--tint':G.tint}}>
        <div className="qhead">
          <div className="qnum">{AR(i%5+1)}</div>
          <div style={{minWidth:0}}><span className="qmeta">{G.title}</span><h2 className="qtext">{q.q}</h2></div>
        </div>
        <div className="qbody">
          <div className="opts">
            {q.o.map((t,k)=>{let cls='opt';if(done){if(k===q.a)cls+=' right';else if(k===pick)cls+=' wrong';else cls+=' dim';}
              return <button key={k} className={cls} disabled={done} onClick={e=>choose(k,e)}><span className="let">{LETTERS[k]}</span><span>{t}</span>{done&&k===q.a&&<span className="mark">✅</span>}{done&&k===pick&&k!==q.a&&<span className="mark">❌</span>}</button>;})}
          </div>
          <div className="illus"><Art k={q.art}/></div>
        </div>
        {done && <div ref={fbRef} className={'feedback '+(ok?'good':'bad')} aria-live="polite">
          <div className="msg">{ok?<><h3>🎉 أحسنتِ يا بطلة!</h3><p>+{AR(PER)} نقاط 💚 {q.e}</p></>:<><h3>🌷 حاولي التعلم من الخطأ</h3><p>الإجابة الصحيحة: <b style={{color:'var(--good)'}}>{LETTERS[q.a]}. {q.o[q.a]}</b><br/>{q.e}</p></>}</div>
          <button className="btn" onClick={next} autoFocus>{i===QUESTIONS.length-1?'🏁 النتيجة':'التالي ⬅'}</button>
        </div>}
      </section>
      <Buddy mood={mood} say={say}/>
    </div>
    {group && <div className="modal" role="dialog" aria-modal="true">
      <div className="card">
        <Buddy mood="happy"/>
        <h1>🎉 أنهيتِ المجموعة {GROUPS[group.g].name}!</h1>
        <p className="cheer">أجبتِ {AR(group.right)} من {AR(group.total)} إجابات صحيحة {group.right===group.total?'— علامة كاملة! 🏅':'👏'}</p>
        <p>{group.last?'أكملتِ جميع المجموعات، لنرَ نتيجتكِ النهائية!':`استعدي للمجموعة ${GROUPS[group.g+1].name} 🚀`}</p>
        <button className="btn gold" onClick={cont} autoFocus>{group.last?'🏆 عرض النتيجة':'تابعي المغامرة ⬅'}</button>
      </div>
    </div>}
  </>;
}

function Result({name,answers,onRetry,fx}){
  const total=QUESTIONS.length,right=answers.filter(Boolean).length,wrong=total-right,pct=Math.round(right/total*100),points=right*PER,cheer=cheerFor(pct);
  const [img,setImg]=useState(null);const [blob,setBlob]=useState(null);const [toast,setToast]=useState('');const [busy,setBusy]=useState(false);
  useEffect(()=>{fx.confetti();Sound.fanfare();},[]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(t);},[toast]);
  const fname=`نتيجة-${name}-بمهاراتي-أنافس.png`.replace(/[\\/:*?"<>|]/g,'');
  const capture=async()=>{setBusy(true);const b=await drawResult({name,total,right,wrong,pct,points,cheer});setBusy(false);if(!b)return;setBlob(b);setImg(URL.createObjectURL(b));};
  const save=async()=>{const dl=await downloadsP;
    if(dl){try{await dl.save({filename:fname,data:blob});setToast('تم حفظ صورة النتيجة ✅');}catch(e){if(e&&e.code==='declined')return;setToast('تعذّر الحفظ هنا، اضغطي مطولًا على الصورة واحفظيها');}return;}
    const a=document.createElement('a');a.href=img;a.download=fname;document.body.appendChild(a);a.click();a.remove();setToast('إذا لم تُحفظ الصورة، اضغطي مطولًا عليها واختاري «حفظ الصورة»');};
  const S=[['عدد الأسئلة',AR(total),'#fff4dc'],['الإجابات الصحيحة',AR(right),'#e3f6ea'],['الإجابات الخاطئة',AR(wrong),'#fde8ef'],['النسبة المئوية',AR(pct)+'٪','#e3f0fb'],['النقاط',AR(points),'#efe9fb']];
  return <>
    <div className="card">
      <h1>🏆 نتيجة عالمة نافس</h1>
      <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',justifyContent:'center'}}><span style={{fontWeight:800,fontSize:'clamp(17px,2.2vw,22px)'}}>اسم الطالبة:</span><span className="namebar">{name}</span></div>
      <div className="stats">{S.map(([k,v,bg])=><div key={k} className="stat" style={{'--tint':bg}}><b>{v}</b><span>{k}</span></div>)}</div>
      <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:110,flex:'none'}}><Buddy mood={pct>=60?'happy':'idle'}/></div><p className="cheer">{cheer}</p></div>
      <div className="row">
        <button className="btn pink" onClick={onRetry}>🔄 أعيدي المحاولة</button>
        <button className="btn" onClick={capture} disabled={busy}>{busy?'⏳ جارٍ التجهيز…':'📸 احفظي نتيجتكِ'}</button>
      </div>
      <p style={{fontSize:'clamp(14px,1.8vw,17px)',color:'var(--ink-soft)'}}>إعداد المعلمة: أ/ شامه البقمي · الابتدائية العشرون لتحفيظ القرآن</p>
    </div>
    {img && <div className="modal" role="dialog" aria-modal="true" onClick={e=>{if(e.target===e.currentTarget)setImg(null);}}>
      <div className="card">
        <h2>📸 صورة نتيجتكِ جاهزة</h2>
        <img src={img} alt={'صورة نتيجة '+name}/>
        <p style={{fontSize:'clamp(15px,1.9vw,18px)'}}>احفظيها ثم أرسليها إلى معلمتكِ. على الآيفون والآيباد يمكنكِ أيضًا الضغط مطولًا على الصورة واختيار «حفظ في الصور».</p>
        <div className="row"><button className="btn" onClick={save}>💾 حفظ الصورة</button><button className="btn ghost" onClick={()=>setImg(null)}>إغلاق</button></div>
      </div>
    </div>}
    {toast && <div className="toast" role="status">{toast}</div>}
  </>;
}

function App(){
  const [screen,setScreen]=useState('start');const [name,setName]=useState('');const [answers,setAnswers]=useState([]);const [snd,setSnd]=useState(true);const [run,setRun]=useState(0);
  const fx=useFx();
  return <>
    <Scene/>
    <button className="sound" aria-label="الصوت" onClick={()=>{setSnd(Sound.toggle());}}>{snd?'🔊':'🔇'}</button>
    <main className="wrap" style={screen!=='play'?{justifyContent:'center'}:null}>
      {screen==='start' && <Start onStart={n=>{setName(n);setScreen('play');}}/>}
      {screen==='play' && <Play key={run} name={name} fx={fx} onDone={a=>{setAnswers(a);setScreen('result');}}/>}
      {screen==='result' && <Result name={name} answers={answers} fx={fx} onRetry={()=>{Sound.click();setRun(r=>r+1);setAnswers([]);setScreen('play');}}/>}
    </main>
    <div className="credit">إعداد المعلمة: أ/ شامه البقمي · الابتدائية العشرون لتحفيظ القرآن</div>
    {fx.layer}
  </>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
