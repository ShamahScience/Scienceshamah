// Animated cartoon scenes for each ecosystem change. watch(key) returns the button; openScene(key) plays it.
(function () {
  const INK = '#2b3245';
  const rnd = (() => { let s = 7; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })();
  const range = (n, f) => Array.from({ length: n }, (_, i) => f(i)).join('');
  const sky = (top, bottom) => `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient></defs><rect width="800" height="450" fill="url(#sk)"/>`;
  const tree = (x, y, s, cls, d) => `<g class="${cls || ''}" style="transform-origin:${x}px ${y}px;animation-delay:${d || 0}s"><rect x="${x - 6 * s}" y="${y - 40 * s}" width="${12 * s}" height="${40 * s}" fill="#8a5a2b" stroke="${INK}" stroke-width="3"/><circle class="leaf" cx="${x}" cy="${y - 55 * s}" r="${28 * s}" fill="#5cb85c" stroke="${INK}" stroke-width="3"/></g>`;
  const house = (x, y, s, cls, d) => `<g class="${cls || ''}" style="transform-origin:${x}px ${y}px;animation-delay:${d || 0}s"><rect x="${x - 22 * s}" y="${y - 34 * s}" width="${44 * s}" height="${34 * s}" fill="#ffe0b2" stroke="${INK}" stroke-width="3"/><path d="M${x - 28 * s},${y - 32 * s} L${x},${y - 56 * s} L${x + 28 * s},${y - 32 * s} Z" fill="#e57373" stroke="${INK}" stroke-width="3" class="roof"/><rect x="${x - 6 * s}" y="${y - 18 * s}" width="${12 * s}" height="${18 * s}" fill="#8d6e63"/></g>`;
  const locust = (x, y) => `<g transform="translate(${x},${y})"><ellipse rx="11" ry="5" fill="#9e8a3a" stroke="${INK}" stroke-width="2"/><path d="M-4,-3 L-14,-12 M2,-3 L-2,-14" stroke="${INK}" stroke-width="2"/><ellipse cx="-2" cy="-5" rx="9" ry="3" fill="#d9cf8a" opacity=".8"/></g>`;
  const person = (x, y, c) => `<g transform="translate(${x},${y})"><circle cy="-22" r="7" fill="#ffd7b8" stroke="${INK}" stroke-width="2"/><rect x="-7" y="-15" width="14" height="18" rx="5" fill="${c}" stroke="${INK}" stroke-width="2"/></g>`;

  const gazelle = (x, y, s, cls, f) => `<g transform="translate(${x},${y}) scale(${f ? -s : s},${s})"><g class="${cls || ''}">
    <path d="M30,-44 q14,-4 16,6" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    ${[-26, -14, 16, 28].map((lx) => `<rect x="${lx}" y="-34" width="6" height="34" rx="3" fill="#c98b4f" stroke="${INK}" stroke-width="2"/>`).join('')}
    <ellipse cx="0" cy="-42" rx="40" ry="17" fill="#d9a066" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="2" cy="-34" rx="30" ry="7" fill="#fff3e0"/>
    <g class="gz-head"><path d="M-30,-50 L-44,-84" stroke="#d9a066" stroke-width="13" stroke-linecap="round"/>
    <path d="M-30,-50 L-44,-84" stroke="${INK}" stroke-width="2" fill="none" opacity=".4"/>
    <ellipse cx="-52" cy="-86" rx="14" ry="9" fill="#d9a066" stroke="${INK}" stroke-width="3"/>
    <path d="M-46,-94 q2,-18 12,-26 M-40,-93 q4,-16 14,-22" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="-54" cy="-89" r="2.5" fill="${INK}"/></g></g></g>`;
  const flame = (x, y, s, d) => `<g transform="translate(${x},${y}) scale(${s})"><g class="f-fl" style="animation-delay:${d}s"><path d="M0,0 q-24,-30 0,-70 q24,40 0,70z" fill="#ff7043" stroke="#bf360c" stroke-width="3"/><path d="M0,-4 q-12,-18 0,-38 q12,22 0,38z" fill="#ffd54f"/></g></g>`;
  const bird = (x, y, c) => `<path d="M${x},${y} q12,-12 24,0 q12,-12 24,0" fill="none" stroke="${c || INK}" stroke-width="4" stroke-linecap="round"/>`;
  const bamboo = (x, y, h, cls, d) => `<g class="${cls || ''}" style="transform-origin:${x}px ${y}px;animation-delay:${d || 0}s"><rect x="${x - 6}" y="${y - h}" width="12" height="${h}" fill="#7cb342" stroke="${INK}" stroke-width="2.5"/>${range(Math.floor(h / 40), (i) => `<line x1="${x - 6}" x2="${x + 6}" y1="${y - 40 * (i + 1)}" y2="${y - 40 * (i + 1)}" stroke="${INK}" stroke-width="2"/>`)}<path d="M${x},${y - h + 20} q24,-6 34,-20 q-20,2 -34,20 M${x},${y - h + 50} q-24,-6 -34,-20 q20,2 34,20" fill="#9ccc65" stroke="${INK}" stroke-width="2"/></g>`;
  const panda = (x, y, s, cls, d) => `<g transform="translate(${x},${y}) scale(${s})"><g class="${cls || ''}" style="animation-delay:${d || 0}s">
    <ellipse cx="0" cy="-30" rx="34" ry="30" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="-22" rx="34" ry="12" fill="#222"/>
    <circle cx="0" cy="-74" r="24" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="-18" cy="-94" r="9" fill="#222"/><circle cx="18" cy="-94" r="9" fill="#222"/>
    <ellipse cx="-9" cy="-76" rx="6" ry="8" fill="#222"/><ellipse cx="9" cy="-76" rx="6" ry="8" fill="#222"/><circle cx="-9" cy="-77" r="2" fill="#fff"/><circle cx="9" cy="-77" r="2" fill="#fff"/><ellipse cx="0" cy="-64" rx="4" ry="3" fill="#222"/></g></g>`;
  const oryx = (x, y, s, cls) => `<g transform="translate(${x},${y}) scale(${-s},${s})"><g class="${cls || ''}">
    ${[-24, -12, 16, 28].map((lx) => `<rect x="${lx}" y="-34" width="6" height="34" rx="3" fill="#fff" stroke="${INK}" stroke-width="2"/><rect x="${lx}" y="-22" width="6" height="10" fill="#5d4037"/>`).join('')}
    <ellipse cx="0" cy="-44" rx="40" ry="18" fill="#fafafa" stroke="${INK}" stroke-width="3"/>
    <path d="M-28,-54 L-42,-84" stroke="#fafafa" stroke-width="14" stroke-linecap="round"/><ellipse cx="-50" cy="-86" rx="13" ry="9" fill="#fafafa" stroke="${INK}" stroke-width="3"/>
    <path d="M-50,-86 h-10" stroke="#5d4037" stroke-width="5"/><path d="M-46,-94 L-28,-150 M-40,-93 L-20,-146" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/></g></g>`;

  const SCENES = {
    fire: { title: '🔥 حريق في الغابة', steps: [[0, 'غابة خضراء تعيش فيها الغزلان والطيور…'], [2, 'فجأة يندلع حريق! 🔥 الغزال يرفع رأسه ويشمّ الدخان.'], [4.5, 'الحريق يدمّر الأشجار ومصادر الغذاء…'], [7, 'المخلوقات الحية في صراع من أجل البقاء: بعضها يهرب إلى مكان آخر.']],
      svg: () => `${sky('#9fd8fb', '#e8f6ff')}<rect class="f-dark" width="800" height="450" fill="#5a2a12" opacity="0"/>
        <path d="M0,330 Q200,300 400,330 T800,330 L800,450 L0,450 Z" fill="#7cc576" stroke="${INK}" stroke-width="4" class="f-ground"/>
        ${[60, 150, 250, 340, 440, 520].map((x, i) => tree(x, 350 + (i % 2) * 18, 1.1 - (i % 2) * .2, 'f-tree')).join('')}
        ${range(9, (i) => flame(40 + i * 60, 360 + (i % 2) * 14, .8 + (i % 3) * .25, 2 + i * .35))}
        ${range(6, (i) => `<circle class="f-smoke" cx="${80 + i * 90}" cy="260" r="${30 + i * 3}" fill="#8d8d8d" style="animation-delay:${3 + i * .4}s"/>`)}
        ${bird(560, 120)}${bird(620, 90)}
        <g class="f-run">${gazelle(680, 400, 1, 'gz-alert', 1)}</g>`,
      css: `.f-fl{opacity:0;transform-box:fill-box;transform-origin:bottom;animation:fadeIn .5s forwards,flick .35s infinite alternate}
        @keyframes flick{from{transform:scaleY(.85)}to{transform:scaleY(1.15)}}
        .f-tree .leaf{animation:burn 3s 4s forwards}@keyframes burn{to{fill:#3e2a1e}}
        .f-dark{animation:dark 4s 2.5s forwards}@keyframes dark{to{opacity:.35}}.f-ground{animation:ash 4s 4.5s forwards}@keyframes ash{to{fill:#6d5a46}}
        .f-smoke{opacity:0;animation:smk 3.5s ease-out forwards}@keyframes smk{0%{opacity:0;transform:translateY(0)}30%{opacity:.85}100%{opacity:.7;transform:translateY(-200px) scale(1.8)}}
        .gz-alert .gz-head{transform-origin:-30px -50px;animation:lift .6s 2s 3 alternate}@keyframes lift{to{transform:rotate(12deg)}}
        .f-run{animation:run 2.5s 6.5s ease-in forwards}@keyframes run{to{transform:translateX(300px)}}` },

    adapt: { title: '🦌 المواءمة', steps: [[0, 'بعد الحريق احترقت الحشائش والأوراق التي يأكلها الغزال…'], [2.5, 'هل يموت الغزال جوعًا؟ 🤔'], [4.5, 'لا! الغزال يغيّر نوع غذائه ويأكل لحاء الأشجار بدل الأوراق.'], [7.5, 'هذه هي المواءمة: استجابة الحيوان للتغيّر الحادث في بيئته. ✔']],
      svg: () => `${sky('#cfd8dc', '#eceff1')}
        <path d="M0,330 Q200,310 400,330 T800,330 L800,450 L0,450 Z" fill="#8d7b68" stroke="${INK}" stroke-width="4"/>
        ${range(12, (i) => `<path d="M${30 + i * 65},335 l4,-14 l4,14" fill="none" stroke="#4e3b2b" stroke-width="3"/>`)}
        <g><rect x="300" y="170" width="34" height="200" fill="#6d4c33" stroke="${INK}" stroke-width="4"/>
          ${range(6, (i) => `<path d="M304,${190 + i * 28} q12,-6 26,0" fill="none" stroke="#3e2a1e" stroke-width="3"/>`)}
          <path d="M317,175 L280,120 M317,190 L360,130 M317,175 L320,110" stroke="#3e2a1e" stroke-width="8" stroke-linecap="round"/>
          <rect class="a-bark" x="334" y="268" width="0" height="0"/></g>
        <g class="a-walk">${gazelle(560, 390, 1.15, 'a-eat')}</g>
        <g class="a-tag"><rect x="470" y="70" width="290" height="70" rx="18" fill="#fff3c4" stroke="${INK}" stroke-width="3"/><text x="615" y="115" text-anchor="middle" font-size="30" font-family="Noto Naskh Arabic, Tahoma" font-weight="700" fill="#1b5e20">أوراق ⬅ لحاء 🌳</text></g>`,
      css: `.a-walk{animation:walkin 3s 1s ease-out forwards}@keyframes walkin{to{transform:translateX(-160px)}}
        .a-eat .gz-head{transform-origin:-30px -50px;animation:bob .5s 4.5s infinite alternate}@keyframes bob{to{transform:rotate(-10deg) translate(-2px,4px)}}
        .a-tag{opacity:0;animation:fadeIn .8s 5s forwards}` },

    move: { title: '🐦 الانتقال إلى أماكن جديدة', steps: [[0, 'غابة احترقت، ولم يبقَ فيها غذاء ولا ماء ولا مسكن…'], [2.5, 'بعض المخلوقات لا تستطيع التعايش مع هذا التغيّر.'], [4.5, 'فتنتقل إلى مكان جديد تجد فيه الغذاء والماء والمسكن المناسب. 🕊️'], [7.5, 'والنباتات المتبقية تحصل على احتياجاتها بوفرة، فلا تحتاج إلى التنافس.']],
      svg: () => `${sky('#b3e5fc', '#f1f8e9')}
        <path d="M0,330 L360,330 L360,450 L0,450 Z" fill="#6d5a46" stroke="${INK}" stroke-width="4"/>
        <path d="M360,330 Q580,300 800,330 L800,450 L360,450 Z" fill="#7cc576" stroke="${INK}" stroke-width="4"/>
        ${[70, 170, 270].map((x) => `<rect x="${x - 6}" y="250" width="12" height="90" fill="#3e2a1e" stroke="${INK}" stroke-width="3"/><path d="M${x},270 l-24,-28 M${x},285 l22,-24" stroke="#3e2a1e" stroke-width="5"/>`).join('')}
        ${tree(470, 350, 1.1)}${tree(580, 360, .9)}${tree(690, 345, 1.2)}
        <path d="M640,360 q40,-16 90,0 q-40,18 -90,0z" fill="#4fc3f7" stroke="${INK}" stroke-width="3"/>
        <g class="m-birds">${bird(60, 160)}${bird(120, 130)}${bird(90, 200)}${bird(160, 175)}${bird(30, 120)}</g>
        <g class="m-gz">${gazelle(250, 410, .9, 'm-legs', 1)}</g>
        <text x="180" y="60" text-anchor="middle" font-size="28" font-family="Noto Naskh Arabic, Tahoma" font-weight="700" fill="#5d4037">❌ لا غذاء ولا مسكن</text>
        <text class="m-ok" x="610" y="60" text-anchor="middle" font-size="28" font-family="Noto Naskh Arabic, Tahoma" font-weight="700" fill="#1b5e20">✔ غذاء وماء ومسكن</text>`,
      css: `.m-birds{animation:fly 5s 3.5s ease-in-out forwards}@keyframes fly{to{transform:translate(520px,-30px)}}
        .m-gz{animation:go 4s 4s ease-in-out forwards}@keyframes go{to{transform:translateX(300px)}}
        .m-ok{opacity:0;animation:fadeIn 1s 6s forwards}` },

    extinct: { title: '🦖 الانقراض', steps: [[0, 'منذ ملايين السنين عاشت الديناصورات على سطح الأرض…'], [2.5, 'تغيّرت بيئتها، ولم تتكيّف مع التغيّر، ولم تجد الغذاء والمأوى…'], [5, 'فاختفت تمامًا ولم تعد! هذا هو الانقراض.'], [7.5, 'عرفناها من الأحافير: بقايا وآثار المخلوقات في الصخور. 🦴']],
      svg: () => `${sky('#ffe0b2', '#fff8e1')}
        <path d="M0,300 L800,300 L800,450 L0,450 Z" fill="#c9a77c" stroke="${INK}" stroke-width="4"/>
        <path d="M0,350 L800,350 M0,400 L800,400" stroke="#a6845c" stroke-width="4"/>
        <g class="x-dino"><path d="M200,300 l10,-70 q20,-60 90,-60 l60,-40 q40,-10 50,20 l-30,20 l-20,0 q10,40 -20,70 l-10,80 l-25,0 l5,-60 l-60,0 l0,60 l-25,0 l0,-60 q-60,10 -120,40 q60,-50 75,-80 z" fill="#81c784" stroke="${INK}" stroke-width="4"/><circle cx="380" cy="138" r="5" fill="${INK}"/></g>
        <g class="x-bones" opacity="0">${range(7, (i) => `<rect x="${180 + i * 34}" y="${372 + (i % 2) * 6}" width="26" height="8" rx="4" fill="#fff8e1" stroke="${INK}" stroke-width="2"/>`)}
          <path d="M440,370 q30,-14 52,4 l-8,12 q-20,-10 -44,-4 z" fill="#fff8e1" stroke="${INK}" stroke-width="2"/>${range(5, (i) => `<path d="M${200 + i * 50},370 q6,-16 0,-24" fill="none" stroke="#fff8e1" stroke-width="5"/>`)}</g>
        <g class="x-tag" opacity="0"><rect x="500" y="40" width="270" height="70" rx="18" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="635" y="85" text-anchor="middle" font-size="30" font-family="Noto Naskh Arabic, Tahoma" font-weight="700" fill="#c2366f">أحفورة 🦴</text></g>`,
      css: `.x-dino{animation:fade 2.5s 4.5s forwards}@keyframes fade{to{opacity:0;transform:translateY(20px)}}
        .x-bones{animation:fadeIn 1.5s 6.5s forwards}.x-tag{animation:fadeIn 1s 7.5s forwards}` },

    protect: { title: '🐼 كيف نمنع الانقراض؟', steps: [[0, 'الدببة العملاقة (الباندا) تأكل نبات الخيزران…'], [2.5, 'بدأ الناس يقطعون أشجار الخيزران، فلم تجد الباندا غذاءها… فأصبحت مهدّدة بالانقراض. 😟'], [6, 'حاول العلماء حمايتها: أنشؤوا لها محميات، وحموا صغارها. 💚'], [9, 'نما الخيزران من جديد، وزاد عدد الباندا! 🎉']],
      svg: () => `${sky('#c8e6c9', '#f1f8e9')}
        <path d="M0,340 Q400,320 800,340 L800,450 L0,450 Z" fill="#8bc34a" stroke="${INK}" stroke-width="4"/>
        ${[80, 150, 220, 600, 670, 740].map((x, i) => bamboo(x, 350, 200 + (i % 2) * 40, 'p-cut', 3 + i * .2)).join('')}
        ${[80, 150, 220, 600, 670, 740].map((x, i) => bamboo(x, 350, 200 + (i % 2) * 40, 'p-grow', 7 + i * .2)).join('')}
        <g class="p-fence" opacity="0">${range(16, (i) => `<rect x="${10 + i * 50}" y="300" width="8" height="70" fill="#8d6e63" stroke="${INK}" stroke-width="2"/>`)}
          <rect x="0" y="315" width="800" height="7" fill="#8d6e63"/><rect x="0" y="345" width="800" height="7" fill="#8d6e63"/>
          <rect x="300" y="30" width="200" height="50" rx="12" fill="#1b5e20" stroke="#fff" stroke-width="3"/><text x="400" y="65" text-anchor="middle" font-size="28" font-family="Noto Naskh Arabic, Tahoma" font-weight="700" fill="#fff">محميّة 🛡️</text></g>
        ${panda(400, 400, 1.2)}
        ${panda(315, 415, .6, 'p-baby', 9)}${panda(485, 417, .6, 'p-baby', 9.5)}
`,
      css: `.p-cut{animation:cut 1s ease-in forwards}@keyframes cut{to{transform:rotate(80deg);opacity:0}}
        .p-grow{transform:scaleY(0);animation:grow 2s ease-out forwards}@keyframes grow{to{transform:scaleY(1)}}
        .p-fence{animation:fadeIn 1s 6s forwards}.p-baby{opacity:0;animation:fadeIn 1s forwards}` },

    oryx: { title: '🇸🇦 المملكة تحمي الحياة الفطرية', steps: [[0, 'المها العربي كان مهدّدًا بالانقراض في شبه الجزيرة العربية…'], [2.5, 'أنشأت المملكة المحميات الملكية، وسنّت قوانين تمنع الصيد الجائر. 🛡️'], [5.5, 'وأعادت توطين الحيوانات: أطلقت المها والوعول والظباء في المحميات.'], [8.5, 'فعادت تعيش وتتكاثر في بيئتها من جديد! 💚']],
      svg: () => `${sky('#ffe082', '#fff8e1')}
        <circle cx="680" cy="90" r="45" fill="#ffca28" stroke="#f57f17" stroke-width="4"/>
        <path d="M0,320 Q200,280 420,320 T800,310 L800,450 L0,450 Z" fill="#f2c27b" stroke="${INK}" stroke-width="4"/>
        <g class="o-fence" opacity="0">${range(16, (i) => `<rect x="${10 + i * 50}" y="330" width="7" height="50" fill="#8d6e63"/>`)}<rect x="0" y="345" width="800" height="6" fill="#8d6e63"/>
          <rect x="40" y="40" width="300" height="56" rx="14" fill="#1b5e20" stroke="#fff" stroke-width="3"/><text x="190" y="78" text-anchor="middle" font-size="27" font-family="Noto Naskh Arabic, Tahoma" font-weight="700" fill="#fff">محمية ملكية 🛡️</text></g>
        <g class="o-a">${oryx(-100, 420, 1)}</g><g class="o-b">${oryx(-100, 440, .8)}</g><g class="o-c">${oryx(-100, 430, .65)}</g>`,
      css: `.o-fence{animation:fadeIn 1s 2.5s forwards}
        .o-a{animation:in 3s 5.5s ease-out forwards}@keyframes in{to{transform:translateX(620px)}}
        .o-b{animation:in2 3s 6.2s ease-out forwards}@keyframes in2{to{transform:translateX(480px)}}
        .o-c{animation:in3 3s 7s ease-out forwards}@keyframes in3{to{transform:translateX(330px)}}` },
  };

  const css = document.createElement('style');
  css.textContent = `
    .watch{display:inline-flex;align-items:center;gap:4px;border:2px solid #1b5e20;background:#1b5e20;color:#fff;border-radius:20px;padding:1px 10px;font:inherit;font-size:14px;cursor:pointer;vertical-align:middle;margin:0 4px}
    .scene{position:fixed;inset:0;background:rgba(20,30,22,.9);display:none;flex-direction:column;align-items:center;justify-content:center;gap:8px;z-index:25;padding:10px}
    .scene.on{display:flex}.scene .stagebox{width:min(96vw,calc((100vh - 170px) * 16 / 9));background:#fff;border-radius:18px;border:4px solid #2f8a3a;overflow:hidden}
    .scene svg{display:block;width:100%;height:auto}.scene h3{margin:0;color:#fff;font-size:26px}
    .scene .say{background:#fff3c4;border:3px dashed #f5c242;border-radius:16px;padding:6px 18px;font-size:22px;min-height:48px;text-align:center;max-width:96vw;color:#23293a}
    .scene .row{display:flex;gap:10px}.scene .row button{font:inherit;font-size:18px;border-radius:14px;padding:6px 16px;cursor:pointer;border:3px solid #fff}
    .scene .again{background:#2f8a3a;color:#fff}.scene .x{background:#d23b3b;color:#fff}
    @keyframes fadeIn{to{opacity:1}}`;
  document.head.appendChild(css);
  const box = document.createElement('div');
  box.className = 'scene';
  box.innerHTML = `<h3 id="scT"></h3><div class="stagebox" id="scBox"></div><div class="say" id="scSay"></div>
    <div class="row"><button class="again" onclick="openScene()">🔄 أعيدي المشاهدة</button><button class="x" onclick="closeScene()">✕ إغلاق</button></div>`;
  document.body.appendChild(box);
  let timers = [], cur = null;
  window.openScene = (k) => {
    if (k) cur = k;
    const s = SCENES[cur];
    timers.forEach(clearTimeout); timers = [];
    document.getElementById('scT').textContent = s.title;
    document.getElementById('scBox').innerHTML = `<svg viewBox="0 0 800 450" role="img" aria-label="${s.title}"><style>${s.css}</style>${s.svg()}</svg>`;
    s.steps.forEach(([t, text]) => timers.push(setTimeout(() => { document.getElementById('scSay').textContent = text; }, t * 1000)));
    box.classList.add('on');
  };
  window.closeScene = () => { timers.forEach(clearTimeout); box.classList.remove('on'); document.getElementById('scBox').innerHTML = ''; };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && box.classList.contains('on')) closeScene(); });
  window.watch = (k) => `<button class="watch" onclick="event.stopPropagation();openScene('${k}')">▶ شاهدي</button>`;
  window.SCENE_KEYS = Object.keys(SCENES);
})();
