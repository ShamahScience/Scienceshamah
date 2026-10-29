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

  const SCENES = {
    volcano: { title: '🌋 البركان', steps: [[0, 'وادٍ أخضر جميل فيه أشجار وبيوت…'], [2.2, 'فجأة يثور البركان! 🔥'], [4.5, 'يخرج منه دخان ورماد كثير…'], [7, 'الرماد يملأ الوادي، فتتغيّر الأشجار ويتغيّر النظام البيئي.']],
      svg: () => `${sky('#9fd8fb', '#e8f6ff')}<rect class="v-dark" width="800" height="450" fill="#3a2f2f" opacity="0"/>
        <path d="M250,330 L400,110 L550,330 Z" fill="#8d6e63" stroke="${INK}" stroke-width="4"/>
        <path d="M370,150 L400,110 L430,150 Q400,165 370,150 Z" fill="#5d4037" stroke="${INK}" stroke-width="3"/>
        <path class="v-lava" d="M385,140 Q380,200 360,260 L380,262 Q400,200 415,140 Z" fill="#ff7043" stroke="#bf360c" stroke-width="2"/>
        ${range(7, (i) => `<circle class="v-smoke" cx="${390 + (i % 3) * 12}" cy="105" r="${26 + i * 4}" fill="#9e9e9e" stroke="#616161" stroke-width="3" style="animation-delay:${2.4 + i * 0.5}s;--dx:${(i % 2 ? 1 : -1) * (30 + i * 18)}px"/>`)}
        <path d="M0,330 Q200,300 400,330 T800,330 L800,450 L0,450 Z" fill="#7cc576" stroke="${INK}" stroke-width="4"/>
        ${tree(90, 360, 1, 'v-tree')}${tree(170, 380, .8, 'v-tree')}${tree(640, 365, 1, 'v-tree')}${tree(720, 385, .8, 'v-tree')}${house(560, 395, 1)}${house(250, 400, .9)}
        ${range(60, (i) => `<circle class="v-ash" cx="${rnd() * 800}" cy="-10" r="${2 + rnd() * 3}" fill="#5f5f5f" style="animation-delay:${4.5 + rnd() * 3}s"/>`)}
        <rect class="v-fill" x="0" y="450" width="800" height="120" fill="#8a8a8a" opacity=".85"/>`,
      css: `.v-lava{opacity:0;animation:fadeIn .6s 2.2s forwards}.v-smoke{opacity:0;transform-box:fill-box;transform-origin:center;animation:smoke 3.5s ease-out forwards}
        @keyframes smoke{0%{opacity:0;transform:translate(0,0) scale(.3)}20%{opacity:.95}100%{opacity:.9;transform:translate(var(--dx),-120px) scale(1.6)}}
        .v-ash{animation:fall 2.8s linear forwards}@keyframes fall{to{transform:translateY(470px)}}
        .v-fill{animation:rise 4s 6.5s forwards}@keyframes rise{to{transform:translateY(-110px)}}
        .v-tree .leaf{animation:grey 3s 6.5s forwards}@keyframes grey{to{fill:#9e9e9e}}.v-dark{animation:dark 4s 4s forwards}@keyframes dark{to{opacity:.35}}` },

    hurricane: { title: '🌀 الإعصار', steps: [[0, 'شاطئ هادئ فيه نخيل وبيوت…'], [2, 'يقترب إعصار قوي يدور بسرعة! 🌀'], [4.5, 'الرياح تهزّ النخيل، والأمواج ترتفع…'], [7, 'الإعصار يدمّر الشواطئ والبيوت، ويتغيّر النظام البيئي.']],
      svg: () => `${sky('#90a4ae', '#cfd8dc')}
        <g class="h-swirl" style="transform-origin:640px 120px">${range(4, (i) => `<path d="M640,120 m-${40 + i * 25},0 a${40 + i * 25},${40 + i * 25} 0 1,1 ${(40 + i * 25) * 1.6},${(40 + i * 25) * .6}" fill="none" stroke="#eceff1" stroke-width="${10 - i}" stroke-linecap="round" opacity=".9"/>`)}</g>
        <path class="h-sea" d="M0,300 Q100,280 200,300 T400,300 T600,300 T800,300 L800,450 L0,450 Z" fill="#4f8fc0" stroke="${INK}" stroke-width="3"/>
        <path d="M0,360 L800,360 L800,450 L0,450 Z" fill="#f2d49b" stroke="${INK}" stroke-width="3"/>
        ${[120, 300, 470].map((x, i) => `<g class="h-palm" style="transform-origin:${x}px 380px;animation-delay:${i * .2}s"><path d="M${x},380 Q${x + 8},330 ${x},270" fill="none" stroke="#8a5a2b" stroke-width="12"/>${range(5, (k) => `<path d="M${x},270 q${-60 + k * 30},${-20 + Math.abs(k - 2) * 12} ${-70 + k * 35},${10 + Math.abs(k - 2) * 15}" fill="none" stroke="#3f8f3a" stroke-width="9" stroke-linecap="round"/>`)}</g>`).join('')}
        ${house(650, 395, 1, 'h-house')}${house(740, 400, .9, 'h-house', .4)}
        ${range(14, (i) => `<path class="h-wind" d="M-80,${60 + i * 22} q40,-12 80,0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" style="animation-delay:${2 + i * .25}s"/>`)}`,
      css: `.h-swirl{opacity:0;animation:fadeIn .8s 1.8s forwards,spin 1.2s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
        .h-palm{animation:bend 1s 4s ease-in-out infinite alternate}@keyframes bend{to{transform:rotate(-14deg)}}
        .h-sea{animation:wave 1.4s 4s ease-in-out infinite alternate}@keyframes wave{to{transform:translateY(-38px)}}
        .h-wind{animation:wind 1.6s linear infinite}@keyframes wind{to{transform:translateX(960px)}}
        .h-house .roof{transform-box:fill-box;transform-origin:center;animation:fly 2s 7s forwards}@keyframes fly{to{transform:translate(-260px,-220px) rotate(-200deg);opacity:0}}` },

    rain: { title: '🌧️ شدة هطول الأمطار', steps: [[0, 'تلّ أخضر عليه بيوت…'], [2, 'أمطار شديدة جدًّا تهطل! 🌧️'], [5, 'التربة تتشبّع بالماء وتبدأ بالانزلاق…'], [7.5, 'انزلاق أرضي! التلّ يتحوّل إلى نهر من الطين.']],
      svg: () => `${sky('#78909c', '#b0bec5')}
        ${range(3, (i) => `<ellipse cx="${180 + i * 220}" cy="70" rx="110" ry="40" fill="#607d8b" stroke="${INK}" stroke-width="3"/>`)}
        <path d="M0,420 L0,220 Q200,120 420,240 Q600,330 800,330 L800,450 L0,450 Z" fill="#7cc576" stroke="${INK}" stroke-width="4"/>
        ${house(150, 205, .9)}${house(260, 200, .8)}
        <path class="r-mud" d="M300,220 Q380,260 430,300 Q520,360 800,370 L800,450 L380,450 Q330,360 300,220 Z" fill="#8d6e63" stroke="#5d4037" stroke-width="3"/>
        ${range(90, (i) => { const x = rnd() * 840; return `<line class="r-drop" x1="${x}" y1="-30" x2="${x - 8}" y2="0" stroke="#e3f2fd" stroke-width="2.5" style="animation-delay:${2 + rnd() * 1.2}s"/>`; })}`,
      css: `.r-drop{opacity:0;animation:rain .7s linear infinite}@keyframes rain{0%{opacity:.9}100%{transform:translate(-30px,470px);opacity:.9}}
        .r-mud{transform:translate(-160px,-120px) scale(.2);transform-box:fill-box;transform-origin:top left;opacity:0;animation:slide 3.5s 5s ease-in forwards}
        @keyframes slide{0%{opacity:1;transform:translate(-40px,-40px) scale(.3)}100%{opacity:1;transform:none}}` },

    drought: { title: '☀️ الجفاف', steps: [[0, 'أرض خضراء فيها بركة ماء…'], [2, 'لا تهطل الأمطار مدة طويلة ☀️'], [4.5, 'البركة تجفّ، والنباتات تذبل…'], [7, 'التربة تتشقّق… إنه الجفاف.']],
      svg: () => `${sky('#ffe0a3', '#fff6dc')}<circle class="d-sun" cx="680" cy="90" r="55" fill="#ffd54f" stroke="#f9a825" stroke-width="5"/>
        <rect class="d-ground" y="270" width="800" height="180" fill="#7cc576" stroke="${INK}" stroke-width="3"/>
        <ellipse class="d-pond" cx="400" cy="350" rx="160" ry="40" fill="#4fa3e0" stroke="${INK}" stroke-width="3"/>
        ${[90, 180, 600, 700].map((x, i) => `<g class="d-plant" style="transform-origin:${x}px 300px;animation-delay:${4 + i * .3}s"><path d="M${x},300 L${x},250" stroke="#3f8f3a" stroke-width="6"/><ellipse class="leaf" cx="${x - 14}" cy="262" rx="16" ry="7" fill="#4caf50"/><ellipse class="leaf" cx="${x + 14}" cy="255" rx="16" ry="7" fill="#4caf50"/></g>`).join('')}
        ${range(9, (i) => `<path class="d-crack" d="M${60 + i * 85},${300 + (i % 3) * 40} l${18},${22} l${-14},${18} l${20},${24}" fill="none" stroke="#5d4037" stroke-width="4" pathLength="1" style="animation-delay:${6.8 + i * .15}s"/>`)}`,
      css: `.d-sun{transform-box:fill-box;transform-origin:center;animation:pulse 1.2s 2s ease-in-out infinite alternate}@keyframes pulse{to{transform:scale(1.25)}}
        .d-ground{animation:dry 4s 3s forwards}@keyframes dry{to{fill:#d7b47a}}
        .d-pond{transform-box:fill-box;transform-origin:center;animation:shrink 3.5s 4s forwards}@keyframes shrink{to{transform:scale(.05);opacity:.2}}
        .d-plant{animation:wilt 2.5s forwards}@keyframes wilt{to{transform:rotate(35deg) scaleY(.7)}}.d-plant .leaf{animation:yel 2.5s 4s forwards}@keyframes yel{to{fill:#c9a23a}}
        .d-crack{stroke-dasharray:1;stroke-dashoffset:1;animation:draw .8s forwards}@keyframes draw{to{stroke-dashoffset:0}}` },

    locusts: { title: '🦗 أسراب الجراد', steps: [[0, 'حقل مليء بالنباتات الخضراء 🌾'], [2, 'يقترب سرب كبير من الجراد…'], [4, 'الجراد يأكل كل النباتات في طريقه!'], [7.5, 'لم يبقَ غذاء للمخلوقات الأخرى… تغيّر النظام البيئي.']],
      svg: () => `${sky('#bfe6ff', '#effaff')}<rect y="300" width="800" height="150" fill="#a5d66f" stroke="${INK}" stroke-width="3"/>
        ${range(16, (i) => `<g class="l-plant" style="transform-origin:${40 + i * 48}px 330px;animation-delay:${3.8 + i * .22}s"><path d="M${40 + i * 48},330 L${40 + i * 48},270 M${40 + i * 48},300 L${26 + i * 48},282 M${40 + i * 48},292 L${54 + i * 48},276" stroke="#2e7d32" stroke-width="6" stroke-linecap="round"/></g>`)}
        <g class="l-swarm">${range(55, () => locust(rnd() * 260, 120 + rnd() * 170))}</g>`,
      css: `.l-swarm{transform:translateX(900px);animation:swarm 7s 1.8s linear forwards}@keyframes swarm{to{transform:translateX(-320px)}}
        .l-swarm g{animation:buzz .2s infinite alternate}@keyframes buzz{to{translate:0 -4px}}
        .l-plant{animation:eaten .8s forwards}@keyframes eaten{to{transform:scaleY(.05);opacity:.3}}` },

    croc: { title: '🐊 التماسيح', steps: [[0, 'أرض رطبة يعيش فيها التمساح…'], [2, 'التمساح يحفر ممرات وحفرًا في الأرض.'], [4.5, 'تمتلئ الحفر بالماء…'], [7, 'وقت الجفاف تشرب منها الحيوانات والطيور! 💧']],
      svg: () => `${sky('#ffe7b3', '#fff6e0')}<rect y="260" width="800" height="190" fill="#c8a46a" stroke="${INK}" stroke-width="3"/>
        <ellipse class="c-hole" cx="300" cy="350" rx="130" ry="38" fill="#6d4c2f" stroke="${INK}" stroke-width="3"/>
        <ellipse class="c-water" cx="300" cy="350" rx="118" ry="30" fill="#4fa3e0"/>
        <g class="c-croc"><path d="M0,0 q60,-26 150,-6 q40,8 70,0 l-10,14 q-30,6 -60,0 q-90,20 -150,-8 z" fill="#5a8f3a" stroke="${INK}" stroke-width="3"/><circle cx="150" cy="-12" r="4" fill="${INK}"/>${range(4, (i) => `<path d="M${30 + i * 26},4 l-6,16" stroke="${INK}" stroke-width="4"/>`)}</g>
        <g class="c-bird"><path d="M0,0 q20,-14 40,0 q-20,-4 -40,0 z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M40,0 l14,3 l-14,3" fill="#ff9800"/></g>
        <g class="c-deer"><text font-size="64">🦌</text></g>`,
      css: `.c-croc{transform:translate(820px,320px);animation:crawl 4s .5s forwards}@keyframes crawl{to{transform:translate(200px,330px)}}
        .c-hole{transform-box:fill-box;transform-origin:center;transform:scale(0);animation:dig 2s 2s forwards}@keyframes dig{to{transform:scale(1)}}
        .c-water{transform-box:fill-box;transform-origin:center;transform:scale(0);animation:dig 2s 4.5s forwards}
        .c-bird{transform:translate(-80px,120px);animation:flyin 2.5s 6.8s forwards}@keyframes flyin{to{transform:translate(380px,318px)}}
        .c-deer{transform:translate(-120px,330px);animation:walk 2.5s 7s forwards}@keyframes walk{to{transform:translate(110px,330px)}}` },

    crowd: { title: '🏘️ الاكتظاظ السكاني', steps: [[0, 'مكان فيه بيوت قليلة وأشجار كثيرة 🌳'], [2, 'يزداد عدد الناس، فيبنون بيوتًا أكثر…'], [5, 'تقلّ الأشجار، ويصعب الحصول على المكان والماء.'], [7.5, 'عدد كبير من الناس في مكان صغير = اكتظاظ سكاني.']],
      svg: () => `${sky('#bfe6ff', '#effaff')}<rect y="300" width="800" height="150" fill="#9ccc65" stroke="${INK}" stroke-width="3"/>
        ${range(8, (i) => tree(60 + i * 95, 330 + (i % 2) * 20, .8, 'cr-tree', 4.5 + i * .3))}
        ${house(120, 420, .9)}${house(620, 420, .9)}
        ${range(14, (i) => house(60 + (i % 7) * 112, 360 + Math.floor(i / 7) * 70, .8, 'cr-house', 2 + i * .35))}
        ${range(26, (i) => `<g class="cr-p" style="animation-delay:${2.5 + i * .2}s">${person(30 + rnd() * 740, 425 + rnd() * 20, ['#e57373', '#64b5f6', '#81c784', '#ffb74d'][i % 4])}</g>`)}`,
      css: `.cr-house,.cr-p{opacity:0;transform-box:fill-box;transform-origin:bottom center;animation:pop .5s forwards}@keyframes pop{0%{opacity:1;transform:scale(0)}100%{opacity:1;transform:scale(1)}}
        .cr-tree{animation:gone .6s forwards}@keyframes gone{to{opacity:0;transform:scale(.2)}}` },

    forest: { title: '🪓 إزالة الغابات', steps: [[0, 'غابة كثيفة تعيش فيها الطيور والحيوانات 🌳'], [2, 'يقطع الإنسان الأشجار لبناء البيوت والأثاث…'], [5, 'الطيور تفقد أعشاشها وتهرب!'], [7.5, 'المخلوقات فقدت موطنها وغذاءها.']],
      svg: () => `${sky('#bfe6ff', '#effaff')}<rect y="320" width="800" height="130" fill="#8bc34a" stroke="${INK}" stroke-width="3"/>
        ${range(9, (i) => tree(60 + i * 85, 360, 1.1, 'f-tree', 2 + i * .45))}
        ${range(5, (i) => `<g class="f-bird" style="animation-delay:${4.6 + i * .3}s"><path d="M${150 + i * 120},170 q12,-12 24,0 q12,-12 24,0" fill="none" stroke="${INK}" stroke-width="4"/></g>`)}
        ${range(9, (i) => `<rect class="f-stump" x="${54 + i * 85}" y="350" width="13" height="12" fill="#8a5a2b" stroke="${INK}" stroke-width="2" style="animation-delay:${2.6 + i * .45}s"/>`)}`,
      css: `.f-tree{animation:fall 1s ease-in forwards}@keyframes fall{0%{transform:rotate(0)}100%{transform:rotate(88deg);opacity:0}}
        .f-stump{opacity:0;animation:fadeIn .3s forwards}.f-bird{animation:flee 2.5s forwards}@keyframes flee{to{transform:translate(-500px,-200px)}}` },

    pollution: { title: '🏭 التلوّث', steps: [[0, 'سماء صافية ونهر نظيف…'], [2, 'المصانع والسيارات تُخرج غازات ودخانًا 🏭'], [5, 'الهواء يتلوّث، ويتغيّر لون السماء والنهر.'], [7.5, 'التلوّث: إضافة أشياء ضارة إلى الماء أو الهواء أو التربة.']],
      svg: () => `${sky('#9fd8fb', '#e8f6ff')}<rect class="p-dim" width="800" height="450" fill="#6d6d5f" opacity="0"/>
        <rect y="300" width="800" height="150" fill="#9ccc65" stroke="${INK}" stroke-width="3"/>
        <path class="p-river" d="M0,390 Q200,360 400,390 T800,390 L800,430 Q600,400 400,430 T0,430 Z" fill="#4fa3e0"/>
        <g><rect x="470" y="200" width="200" height="100" fill="#b0bec5" stroke="${INK}" stroke-width="4"/><rect x="500" y="130" width="28" height="80" fill="#90a4ae" stroke="${INK}" stroke-width="4"/><rect x="580" y="110" width="28" height="100" fill="#90a4ae" stroke="${INK}" stroke-width="4"/></g>
        ${range(10, (i) => `<circle class="p-smoke" cx="${514 + (i % 2) * 80}" cy="${120 - (i % 2) * 20}" r="${18 + (i % 4) * 5}" fill="#757575" style="animation-delay:${2 + i * .45}s"/>`)}
        <g class="p-car"><rect x="0" y="-26" width="90" height="26" rx="8" fill="#ef5350" stroke="${INK}" stroke-width="3"/><circle cx="20" cy="2" r="9" fill="${INK}"/><circle cx="70" cy="2" r="9" fill="${INK}"/><circle class="p-exh" cx="-10" cy="-8" r="10" fill="#9e9e9e"/></g>`,
      css: `.p-smoke{opacity:0;transform-box:fill-box;transform-origin:center;animation:drift 4s ease-out infinite}@keyframes drift{0%{opacity:.9;transform:translate(0,0) scale(.5)}100%{opacity:0;transform:translate(-160px,-120px) scale(2.4)}}
        .p-car{transform:translate(-120px,330px);animation:drive 5s 2s linear infinite}@keyframes drive{to{transform:translate(900px,330px)}}
        .p-exh{animation:puff .6s infinite}@keyframes puff{0%{opacity:.9;transform:scale(.5)}100%{opacity:0;transform:translate(-30px,-14px) scale(1.6)}}
        .p-dim{animation:dark 4s 4.5s forwards}@keyframes dark{to{opacity:.4}}.p-river{animation:dirty 4s 5s forwards}@keyframes dirty{to{fill:#7d7a52}}` },
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
