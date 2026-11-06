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

  const AR = 'font-family="Noto Naskh Arabic, Tahoma" font-weight="700"';
  const label = (x, y, t, c, cls, w) => `<g class="${cls || ''}"><rect x="${x - (w || 150)}" y="${y - 30}" width="${(w || 150) * 2}" height="46" rx="16" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="${x}" y="${y + 2}" text-anchor="middle" font-size="24" ${AR} fill="${c || '#8e2a6b'}">${t}</text></g>`;
  const girl = (x, y, s, o) => { o = o || {}; return `<g transform="translate(${x},${y}) scale(${o.flip ? -s : s},${s})"><g class="${o.cls || ''}">
    <path d="M-34,0 Q-38,-58 0,-62 Q38,-58 34,0 Z" fill="${o.coat || '#f48fb1'}" stroke="${INK}" stroke-width="3"/>
    ${o.doc ? `<path d="M-34,0 Q-38,-58 0,-62 Q38,-58 34,0 Z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M-8,-60 L0,-30 L8,-60" fill="#f48fb1" stroke="${INK}" stroke-width="2"/><path d="M-14,-46 q-6,20 6,26" fill="none" stroke="#455a64" stroke-width="3"/><circle cx="-8" cy="-20" r="4" fill="#90a4ae"/>` : ''}
    <path d="M-30,-56 Q-42,-100 -22,-122 Q0,-136 22,-122 Q42,-100 30,-56 Q0,-44 -30,-56 Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="0" cy="-92" rx="17" ry="20" fill="#ffd9bf" stroke="${INK}" stroke-width="2"/>
    <circle cx="-6" cy="-95" r="2.6" fill="${INK}"/><circle cx="6" cy="-95" r="2.6" fill="${INK}"/>
    <circle class="cheek" cx="-10" cy="-86" r="4" fill="#ff8a80" opacity=".5"/><circle class="cheek" cx="10" cy="-86" r="4" fill="#ff8a80" opacity=".5"/>
    ${o.sad ? `<path d="M-6,-80 q6,-5 12,0" fill="none" stroke="${INK}" stroke-width="2.5"/>` : `<path d="M-6,-83 q6,6 12,0" fill="none" stroke="${INK}" stroke-width="2.5"/>`}
    ${o.extra || ''}</g></g>`; };
  const germ = (x, y, r, c, cls, st) => `<g class="${cls || ''}" style="${st || ''}"><g transform="translate(${x},${y})">${range(8, (i) => { const a = i * Math.PI / 4; return `<line x1="${Math.cos(a) * r}" y1="${Math.sin(a) * r}" x2="${Math.cos(a) * (r + 7)}" y2="${Math.sin(a) * (r + 7)}" stroke="${INK}" stroke-width="2.5"/><circle cx="${Math.cos(a) * (r + 8)}" cy="${Math.sin(a) * (r + 8)}" r="3" fill="${c}"/>`; })}<circle r="${r}" fill="${c}" stroke="${INK}" stroke-width="2.5"/><circle cx="-4" cy="-3" r="2" fill="${INK}"/><circle cx="4" cy="-3" r="2" fill="${INK}"/></g></g>`;
  const rod = (x, y, rot, c, cls, st) => `<g class="${cls || ''}" style="${st || ''}"><rect x="${x - 16}" y="${y - 7}" width="32" height="14" rx="7" fill="${c || '#ff8a65'}" stroke="${INK}" stroke-width="2" transform="rotate(${rot} ${x} ${y})"/></g>`;
  const room = (c1, c2) => `${sky(c1 || '#fde4ef', c2 || '#fff8fb')}<rect y="360" width="800" height="90" fill="#f3d9c4" stroke="${INK}" stroke-width="3"/>`;

  const SCENES = {
    disease: { title: '🤒 ما المرض؟', steps: [[0, 'هذه طالبة سليمة ونشيطة 😊'], [2.5, 'تدخل جسمها مخلوقات دقيقة من الخارج… (أسباب خارجية)'], [5, 'فتظهر عليها أعراض وعلامات مختلفة: حرارة وتعب 🤒'], [7.5, 'المرض: حالة غير طبيعية تؤثّر على جسم المخلوق الحي.']],
      svg: () => `${room()}${girl(400, 380, 1.9, { cls: 'd-girl' })}
        <g class="d-sick">${girl(400, 380, 1.9, { sad: 1, coat: '#ce93d8' })}<circle cx="400" cy="205" r="60" fill="#ff5252" opacity=".18"/>
        <g transform="translate(470,170) rotate(25)"><rect x="-6" y="-50" width="12" height="70" rx="6" fill="#fff" stroke="${INK}" stroke-width="3"/><rect x="-2" y="-30" width="4" height="40" fill="#e53935"/><circle cy="24" r="10" fill="#e53935" stroke="${INK}" stroke-width="3"/></g>
        ${range(3, (i) => `<path class="d-sw" d="M${350 + i * 18},${150 + i * 10} q5,10 0,16 q-5,-6 0,-16z" fill="#4fc3f7" style="animation-delay:${5.5 + i * .3}s"/>`)}</g>
        ${range(6, (i) => germ(720 + (i % 2) * 30, 80 + i * 40, 13, ['#81c784', '#ba68c8', '#ffb74d'][i % 3], 'd-germ', `--tx:${-300 - (i % 3) * 20}px;--ty:${120 - i * 30}px;animation-delay:${2.5 + i * .25}s`))}
        ${label(400, 425, 'حالة غير طبيعية', '#c2366f', 'd-tag', 130)}`,
      css: `.d-germ{animation:fly 2s ease-in forwards}@keyframes fly{70%{opacity:1}to{transform:translate(var(--tx),var(--ty)) scale(.5);opacity:0}}
        .d-sick{opacity:0;animation:fadeIn 1s 5s forwards}.d-girl{animation:fadeOut 1s 5s forwards}@keyframes fadeOut{to{opacity:0}}
        .d-sw{opacity:0;animation:fadeIn .5s forwards,drip 1s infinite}@keyframes drip{to{transform:translateY(10px)}}.d-tag{opacity:0;animation:fadeIn 1s 7.5s forwards}` },

    diabetes: { title: '🍬 السكري', steps: [[0, 'البنكرياس يفرز الأنسولين في الجسم 💧'], [3, 'إذا حدث خلل في مستويات الأنسولين…'], [5.5, 'يُصاب الإنسان بمرض السكري، ويقيس السكر في الدم بجهاز القياس 🩸'], [8, 'السكري: مرض مزمن غير معدٍ، وقد ينتج عن عوامل وراثية.']],
      svg: () => `${sky('#fff3e0', '#fffaf3')}
        <path d="M60,150 q60,-60 170,-30 q60,20 40,60 q-40,40 -120,20 q-80,-10 -90,-50z" fill="#f8bbd0" stroke="${INK}" stroke-width="4"/>
        <text x="160" y="160" text-anchor="middle" font-size="24" ${AR} fill="#8e2a6b">البنكرياس</text>
        <path d="M0,300 L800,300 L800,380 L0,380 Z" fill="#ef9a9a" stroke="${INK}" stroke-width="4"/><text x="560" y="410" font-size="20" ${AR} fill="${INK}">الدم</text>
        ${range(6, (i) => `<path class="b-ins" d="M${150 + i * 14},200 q6,12 0,18 q-6,-6 0,-18z" fill="#29b6f6" stroke="${INK}" stroke-width="1.5" style="animation-delay:${i * .45}s"/>`)}
        ${range(14, (i) => `<rect class="b-sug" x="${40 + i * 52}" y="${318 + (i % 3) * 14}" width="20" height="20" rx="3" fill="#fff" stroke="${INK}" stroke-width="2" style="animation-delay:${5.5 + i * .15}s"/>`)}
        <g transform="translate(650,140)"><rect x="-60" y="-80" width="120" height="150" rx="20" fill="#4fc3f7" stroke="${INK}" stroke-width="4"/><rect x="-44" y="-62" width="88" height="54" rx="8" fill="#e0f7fa" stroke="${INK}" stroke-width="3"/>
          <text class="b-n1" x="0" y="-24" text-anchor="middle" font-size="34" font-weight="700" fill="${INK}">94</text><text class="b-n2" x="0" y="-24" text-anchor="middle" font-size="34" font-weight="700" fill="#e53935">250</text></g>
        ${label(400, 60, 'خلل في مستويات الأنسولين ⚠️', '#e53935', 'b-tag', 190)}`,
      css: `.b-ins{animation:fall 1.4s ease-in 2}@keyframes fall{from{transform:translateY(0)}to{transform:translateY(110px);opacity:0}}
        .b-sug{opacity:0;animation:fadeIn .5s forwards}.b-n2{opacity:0;animation:fadeIn .6s 6s forwards}.b-n1{animation:fadeOut .6s 6s forwards}@keyframes fadeOut{to{opacity:0}}.b-tag{opacity:0;animation:fadeIn 1s 3s forwards}` },

    obesity: { title: '⚖️ السمنة', steps: [[0, 'طعام كثير 🍔🍟 وجلوس طويل أمام الشاشة 📱'], [3, 'الإفراط في تناول الأكل وقلّة النشاط البدني…'], [5.5, 'تتراكم الدهون في الجسم بشكل مفرط'], [8, 'السمنة: تراكم مفرط أو غير طبيعي للدهون في الجسم، وهي مرض غير معدٍ.']],
      svg: () => `${room('#e3f2fd', '#f7fbff')}
        <defs><clipPath id="obc"><path d="M330,360 q-20,-120 30,-150 q-30,-30 0,-60 a40,40 0 1 1 80,0 q30,30 0,60 q50,30 30,150z"/></clipPath></defs>
        <path d="M330,360 q-20,-120 30,-150 q-30,-30 0,-60 a40,40 0 1 1 80,0 q30,30 0,60 q50,30 30,150z" fill="#fff" stroke="${INK}" stroke-width="4"/>
        <g clip-path="url(#obc)"><rect class="o-fat" x="300" y="110" width="200" height="250" fill="#ffd54f" opacity=".85"/></g>
        <text x="400" y="330" text-anchor="middle" font-size="22" ${AR} fill="${INK}">الدهون</text>
        ${['🍔', '🍟', '🍩', '🥤', '🍕', '🍫'].map((f, i) => `<text class="o-food" x="${80 + (i % 3) * 60}" y="${80 + Math.floor(i / 3) * 60}" font-size="44" style="animation-delay:${1 + i * .6}s">${f}</text>`).join('')}
        <g transform="translate(640,250)"><rect x="-60" y="-60" width="120" height="110" rx="14" fill="#90a4ae" stroke="${INK}" stroke-width="3"/><rect x="-40" y="-40" width="80" height="50" rx="6" fill="#fff"/><text x="0" y="-5" text-anchor="middle" font-size="30">📱</text></g>
        <g transform="translate(400,420)"><rect x="-70" y="-14" width="140" height="28" rx="8" fill="#b0bec5" stroke="${INK}" stroke-width="3"/><line class="o-ndl" x1="0" y1="0" x2="-40" y2="0" stroke="#e53935" stroke-width="5"/></g>`,
      css: `.o-food{animation:eat 1.6s ease-in forwards}@keyframes eat{to{transform:translate(260px,180px) scale(.2);opacity:0}}
        .o-fat{transform-box:fill-box;transform-origin:bottom;transform:scaleY(.08);animation:up 5s 2s ease-out forwards}@keyframes up{to{transform:scaleY(.75)}}
        .o-ndl{transform-box:fill-box;transform-origin:right center;animation:spin2 4s 4s forwards}@keyframes spin2{to{transform:rotate(150deg)}}` },

    allergy: { title: '🌸 الحساسية', steps: [[0, 'طالبة تلعب مع قطة 🐱'], [2.5, 'يصل وبر القطة إلى جسمها… وهو مادة غريبة'], [5, 'جهاز المناعة يتفاعل بشدّة ضد هذه المادة الغريبة! 🛡️'], [7.5, 'فيظهر احمرار وتهيّج في الجلد… هذه هي الحساسية.']],
      svg: () => `${room()}${girl(280, 380, 1.9, { extra: `<g class="a-red">${range(6, (i) => `<circle cx="${-14 + (i % 3) * 14}" cy="${-88 + Math.floor(i / 3) * 12}" r="3.5" fill="#e53935"/>`)}${range(5, (i) => `<circle cx="${-20 + i * 10}" cy="${-30 + (i % 2) * 8}" r="4" fill="#e53935"/>`)}</g>` })}
        <circle class="a-shield" cx="280" cy="240" r="140" fill="none" stroke="#42a5f5" stroke-width="8" stroke-dasharray="20 10"/>
        <g transform="translate(560,360)"><ellipse cx="0" cy="-30" rx="60" ry="34" fill="#ffb74d" stroke="${INK}" stroke-width="3"/><circle cx="-56" cy="-70" r="30" fill="#ffb74d" stroke="${INK}" stroke-width="3"/><path d="M-80,-90 l6,-26 l14,18 M-44,-96 l8,-24 l10,22" fill="#ffb74d" stroke="${INK}" stroke-width="3"/><circle cx="-66" cy="-72" r="3" fill="${INK}"/><circle cx="-48" cy="-72" r="3" fill="${INK}"/><path d="M60,-36 q40,-30 30,-70" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/></g>
        ${range(16, (i) => `<path class="a-fur" d="M${520 + (i % 4) * 14},${290 + Math.floor(i / 4) * 14} l6,-4" stroke="#8d6e63" stroke-width="3" stroke-linecap="round" style="animation-delay:${2.5 + i * .12}s"/>`)}
        ${label(560, 70, 'تفاعل بشدّة ضد المادة الغريبة', '#1e5fd8', 'a-tag', 200)}`,
      css: `.a-fur{animation:drift 2.4s ease-in forwards}@keyframes drift{to{transform:translate(-250px,-80px);opacity:.2}}
        .a-shield{opacity:0;animation:fadeIn .5s 5s forwards,pulse .5s 5s infinite alternate}@keyframes pulse{to{stroke-width:14}}
        .a-red{opacity:0;animation:fadeIn 1s 7s forwards}.a-tag{opacity:0;animation:fadeIn 1s 5.2s forwards}` },

    anemia: { title: '🩸 فقر الدم', steps: [[0, 'خلايا الدم الحمراء تنقل الأكسجين والغذاء إلى أنسجة الجسم 🔴'], [3, 'عند نقص الحديد… تقلّ خلايا الدم الحمراء'], [5.5, 'فلا يصل ما يكفي من الأكسجين والغذاء إلى الأنسجة 😴'], [8, 'فقر الدم: حالة يفتقر فيها الدم إلى ما يكفي من خلايا الدم الحمراء.']],
      svg: () => `${sky('#fce4ec', '#fff')}
        <path d="M0,150 L640,150 L640,330 L0,330 Z" fill="#ffcdd2" stroke="${INK}" stroke-width="4"/>
        <g class="n-tis"><rect x="640" y="110" width="150" height="260" rx="20" fill="#ffab91" stroke="${INK}" stroke-width="4"/><text x="715" y="250" text-anchor="middle" font-size="26" ${AR} fill="${INK}">الأنسجة</text></g>
        ${range(10, (i) => `<g class="n-cell ${i % 2 ? 'n-few' : ''}" style="animation-delay:${-i * .5}s,3s"><g transform="translate(-60,${190 + (i % 3) * 50})"><ellipse rx="26" ry="18" fill="#e53935" stroke="${INK}" stroke-width="2.5"/><ellipse rx="11" ry="7" fill="#c62828"/><circle cx="0" cy="-26" r="8" fill="#81d4fa" stroke="${INK}" stroke-width="1.5"/><text x="0" y="-22" text-anchor="middle" font-size="10" font-weight="700">O₂</text></g></g>`)}
        ${label(330, 70, 'نقص الحديد ⚠️', '#e53935', 'n-tag', 110)}`,
      css: `.n-cell{animation:flow 5s linear infinite}@keyframes flow{to{transform:translateX(720px)}}
        .n-few{animation:flow 5s linear infinite,gone 1s forwards}@keyframes gone{to{opacity:0}}
        .n-tis{animation:dim 2s 5.5s forwards}@keyframes dim{to{opacity:.45}}.n-tag{opacity:0;animation:fadeIn 1s 3s forwards}` },

    spread: { title: '🤧 كيف تنتقل العدوى بالهواء؟', steps: [[0, 'طالبة مصابة بالزكام تعطس قريبًا من زميلتها 🤧'], [2.5, 'ينتقل الرذاذ والفيروسات بالهواء إلى زميلتها… خطورة عالية ⚠️'], [5.5, 'عندما تبتعد زميلتها مسافة مترين تقريبًا…'], [7.5, 'يسقط الرذاذ قبل أن يصل إليها… خطورة منخفضة لانتقال الفيروس ✔']],
      svg: () => `${room()}${girl(250, 380, 1.7, { sad: 1, coat: '#ce93d8' })}
        <g class="s-move">${girl(440, 380, 1.7, { flip: 1 })}</g>
        ${range(12, (i) => `<circle class="s-a" cx="282" cy="${222 + (i % 4) * 4}" r="${3 + (i % 3)}" fill="#4fc3f7" stroke="${INK}" stroke-width="1" style="--dx:${120 + (i % 4) * 25}px;--dy:${-20 + (i % 5) * 10}px;animation-delay:${2.3 + i * .06}s"/>`)}
        ${range(12, (i) => germ(282, 225, 5, '#81c784', 's-a', `--dx:${110 + (i % 4) * 22}px;--dy:${-10 + (i % 3) * 10}px;animation-delay:${2.4 + i * .08}s`))}
        ${range(14, (i) => `<circle class="s-b" cx="282" cy="${222 + (i % 4) * 4}" r="${3 + (i % 3)}" fill="#4fc3f7" stroke="${INK}" stroke-width="1" style="--dx:${80 + (i % 5) * 25}px;animation-delay:${6 + i * .06}s"/>`)}
        <g class="s-m"><line x1="290" y1="420" x2="640" y2="420" stroke="${INK}" stroke-width="3" marker-end="url(#sa)" marker-start="url(#sa)"/><defs><marker id="sa" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10z" fill="${INK}"/></marker></defs>
          <rect x="420" y="398" width="90" height="34" rx="10" fill="#fff" stroke="${INK}" stroke-width="2"/><text x="465" y="422" text-anchor="middle" font-size="20" ${AR}>٢ متر</text></g>
        ${label(400, 60, 'خطورة عالية ⚠️', '#e53935', 's-hi', 110)}${label(400, 60, 'خطورة منخفضة ✔', '#2f8a3a', 's-lo', 120)}`,
      css: `.s-a{opacity:0;animation:spray 1.5s ease-out forwards}@keyframes spray{10%{opacity:1}to{opacity:1;transform:translate(var(--dx),var(--dy))}}
        .s-a{animation-fill-mode:forwards}.s-move{animation:away 1.5s 5.5s ease-in-out forwards}@keyframes away{to{transform:translateX(210px)}}
        .s-b{opacity:0;animation:drop2 1.8s ease-in forwards}@keyframes drop2{10%{opacity:1}60%{transform:translate(var(--dx),10px)}to{opacity:.6;transform:translate(calc(var(--dx) + 20px),150px)}}
        .s-m{opacity:0;animation:fadeIn 1s 6.5s forwards}.s-hi{opacity:0;animation:fadeIn .5s 3.5s forwards,fadeOut .5s 5.5s forwards}@keyframes fadeOut{to{opacity:0}}.s-lo{opacity:0;animation:fadeIn 1s 8s forwards}` },

    cholera: { title: '💧 الكوليرا', steps: [[0, 'ماء ملوّث فيه بكتيريا 💧🦠'], [2.5, 'شُرب الماء الملوّث…'], [5, 'تنتقل بكتيريا الكوليرا إلى الجسم'], [7.5, 'فتسبّب إسهالًا وجفافًا شديدًا… لذلك نشرب الماء النظيف فقط ✔']],
      svg: () => `${room('#e0f7fa', '#f7feff')}${girl(520, 380, 1.9, { cls: 'c-ok' })}<g class="c-sad">${girl(520, 380, 1.9, { sad: 1, coat: '#ce93d8' })}</g>
        <g class="c-cup"><path d="M180,200 L280,200 L265,330 L195,330 Z" fill="#e0f2f1" stroke="${INK}" stroke-width="4"/><path d="M186,230 L274,230 L265,330 L195,330 Z" fill="#a1887f" opacity=".8"/>
          ${range(5, (i) => rod(205 + (i % 3) * 25, 260 + Math.floor(i / 3) * 30, i * 35, '#66bb6a'))}</g>
        <g class="c-bar"><rect x="680" y="150" width="40" height="200" rx="10" fill="#fff" stroke="${INK}" stroke-width="3"/><rect class="c-lvl" x="684" y="154" width="32" height="192" rx="8" fill="#29b6f6"/><text x="700" y="380" text-anchor="middle" font-size="18" ${AR}>الماء</text></g>
        ${range(6, (i) => rod(300, 220, i * 30, '#66bb6a', 'c-in', `animation-delay:${5 + i * .2}s`))}`,
      css: `.c-cup{transform-origin:230px 260px;animation:tilt 2s 2.5s forwards}@keyframes tilt{to{transform:translate(170px,-60px) rotate(-40deg)}}
        .c-in{opacity:0;animation:inb 1.4s forwards}@keyframes inb{20%{opacity:1}to{opacity:1;transform:translate(220px,30px)}}
        .c-sad{opacity:0;animation:fadeIn 1s 6.5s forwards}.c-ok{animation:fadeOut 1s 6.5s forwards}@keyframes fadeOut{to{opacity:0}}
        .c-lvl{transform-origin:700px 346px;animation:drain 3s 7s forwards}@keyframes drain{to{transform:scaleY(.2);fill:#ef5350}}` },

    virus: { title: '🦠 الفيروسات', steps: [[0, 'خلية في جسم مخلوق حي'], [2.5, 'فيروس يلتصق بالخلية… ويستعدّ لمهاجمتها والدخول إليها'], [5, 'يدخل الفيروس إلى الخلية ويهاجمها 🦠'], [7.5, 'تهاجم الفيروسات جسم المخلوق الحي وتسبّب له المرض، مثل الأنفلونزا وكورونا المستجد.']],
      svg: () => `${sky('#ede7f6', '#fff')}<circle class="v-cell" cx="420" cy="230" r="130" fill="#b39ddb" stroke="${INK}" stroke-width="5"/><circle cx="440" cy="220" r="40" fill="#7e57c2" stroke="${INK}" stroke-width="3"/>
        ${germ(740, 90, 20, '#9ccc65', 'v-one')}
        ${range(6, (i) => germ(420 + Math.cos(i) * 60, 230 + Math.sin(i) * 60, 12, '#9ccc65', 'v-many', `--tx:${Math.cos(i) * 230}px;--ty:${Math.sin(i) * 170}px;animation-delay:${7 + i * .15}s`))}`,
      css: `.v-one{animation:att 2.5s 1s ease-in-out forwards,ent 1.5s 5s forwards}@keyframes att{to{transform:translate(-210px,40px)}}@keyframes ent{from{transform:translate(-210px,40px)}to{transform:translate(-300px,100px) scale(.4);opacity:.6}}
        .v-cell{animation:sick 2s 5.5s forwards}@keyframes sick{to{fill:#8e6fb8}}
        .v-many{opacity:0;animation:out 1.5s forwards}@keyframes out{20%{opacity:1}to{opacity:1;transform:translate(var(--tx),var(--ty))}}` },

    bacteria: { title: '🧫 البكتيريا', steps: [[0, 'البكتيريا مخلوقات حيّة وحيدة الخلية مجهرية 🔬'], [2.5, 'توجد في التربة والهواء والماء والأطعمة، وداخل أجسامنا وعلى الجلد'], [5, 'منها النافعة: مثل بكتيريا الجهاز الهضمي وبكتيريا اللبن ✔'], [7.5, 'ومنها الضارة: تسبّب السل والكوليرا والتهاب الحلق والالتهاب الرئوي ✘']],
      svg: () => `${sky('#e8f5e9', '#fff')}<circle cx="400" cy="200" r="140" fill="#f1f8e9" stroke="#37474f" stroke-width="14"/>
        ${range(9, (i) => rod(320 + (i % 3) * 70, 140 + Math.floor(i / 3) * 60, i * 40, '#ff8a65', 'b-wig', `animation-delay:${i * .1}s;transform-origin:${320 + (i % 3) * 70}px ${140 + Math.floor(i / 3) * 60}px`))}
        <g class="b-good"><rect x="20" y="300" width="250" height="130" rx="20" fill="#c8e6c9" stroke="#2f8a3a" stroke-width="4"/><text x="145" y="340" text-anchor="middle" font-size="24" ${AR} fill="#2f8a3a">✔ نافعة</text><text x="145" y="395" text-anchor="middle" font-size="40">🥛</text></g>
        <g class="b-bad"><rect x="530" y="300" width="250" height="130" rx="20" fill="#ffcdd2" stroke="#e53935" stroke-width="4"/><text x="655" y="340" text-anchor="middle" font-size="24" ${AR} fill="#e53935">✘ ضارة</text><text x="655" y="395" text-anchor="middle" font-size="40">🫁</text></g>`,
      css: `.b-wig{animation:wig .6s infinite alternate}@keyframes wig{to{transform:rotate(25deg) translateX(6px)}}.b-good{opacity:0;animation:fadeIn 1s 5s forwards}.b-bad{opacity:0;animation:fadeIn 1s 7.5s forwards}` },

    fungi: { title: '🍄 الفطريات', steps: [[0, 'الفطريات مخلوقات حيّة واسعة الانتشار 🍄'], [2.5, 'منها النافعة مثل الكمأة ✔'], [5, 'ومنها الضارة… تنتشر في الأماكن الدافئة والمعرّضة للتعرّق'], [7.5, 'فتسبّب القدم الرياضي: طفح جلدي معدٍ يصيب القدم بسبب عدوى فطرية.']],
      svg: () => `${sky('#fff8e1', '#fffdf5')}<rect y="330" width="800" height="120" fill="#a1887f" stroke="${INK}" stroke-width="3"/>
        ${[90, 170, 250].map((x, i) => `<g class="f-mush" style="transform-origin:${x}px 330px;animation-delay:${i * .4}s"><rect x="${x - 8}" y="285" width="16" height="45" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M${x - 40},290 q40,-60 80,0z" fill="#e53935" stroke="${INK}" stroke-width="3"/><circle cx="${x - 12}" cy="275" r="5" fill="#fff"/><circle cx="${x + 10}" cy="270" r="4" fill="#fff"/></g>`).join('')}
        <g class="f-truf">${range(3, (i) => `<ellipse cx="${100 + i * 70}" cy="${380}" rx="26" ry="20" fill="#795548" stroke="${INK}" stroke-width="3"/>`)}<text x="170" y="430" text-anchor="middle" font-size="22" ${AR} fill="#fff">الكمأة ✔</text></g>
        <g class="f-foot"><path d="M470,320 q-10,-140 40,-200 l50,0 q20,80 10,120 q60,10 150,30 q30,10 20,50 z" fill="#ffd9bf" stroke="${INK}" stroke-width="4"/>
          ${range(5, (i) => `<ellipse cx="${640 + i * 22}" cy="${286 - i * 2}" rx="11" ry="9" fill="#ffd9bf" stroke="${INK}" stroke-width="3"/>`)}
          ${range(4, (i) => `<path class="f-sw" d="M${600 + i * 30},230 q5,10 0,16 q-5,-6 0,-16z" fill="#4fc3f7" style="animation-delay:${5 + i * .3}s"/>`)}
          ${range(10, (i) => `<circle class="f-sp" cx="${630 + (i % 5) * 22}" cy="${300 + Math.floor(i / 5) * 8}" r="4" fill="#7cb342" stroke="${INK}" stroke-width="1" style="animation-delay:${6 + i * .15}s"/>`)}
          ${range(4, (i) => `<circle class="f-rd" cx="${640 + i * 24}" cy="300" r="7" fill="#e53935" opacity=".6" style="animation-delay:${7.5 + i * .2}s"/>`)}</g>`,
      css: `.f-mush{transform:scale(0);animation:grow 1s forwards}@keyframes grow{to{transform:scale(1)}}.f-truf{opacity:0;animation:fadeIn 1s 2.5s forwards}
        .f-foot{opacity:0;animation:fadeIn 1s 4.5s forwards}.f-sw{opacity:0;animation:fadeIn .4s forwards,drip 1s infinite}@keyframes drip{to{transform:translateY(12px)}}
        .f-sp,.f-rd{opacity:0;animation:fadeIn .6s forwards}` },

    waste: { title: '🗑️ النفايات وانتقال الأمراض', steps: [[0, 'نفايات متراكمة في المقصف 🗑️'], [2.5, 'تجذب الحشرات والقوارض 🪰🐭'], [5, 'وتتكاثر فيها الجراثيم 🦠'], [7.5, 'فتنتقل الأمراض بالملامسة أو عبر الطعام… لنضع النفايات في سلّتها ✔']],
      svg: () => `${room('#fffde7', '#fffff5')}
        <path d="M150,370 q30,-90 110,-100 q80,10 120,100z" fill="#8d6e63" stroke="${INK}" stroke-width="4"/>
        ${['🧃', '🍌', '📄', '🥤', '🍬'].map((e, i) => `<text x="${180 + i * 40}" y="${330 - (i % 2) * 20}" font-size="34">${e}</text>`).join('')}
        ${range(5, (i) => `<text class="w-fly" x="${700 - i * 20}" y="${60 + i * 30}" font-size="30" style="--tx:${-420 + i * 30}px;--ty:${210 - i * 30}px;animation-delay:${2.5 + i * .3}s">🪰</text>`)}
        <text class="w-rat" x="820" y="395" font-size="46">🐭</text>
        ${range(6, (i) => germ(200 + i * 30, 300 + (i % 2) * 20, 9, '#81c784', 'w-germ', `animation-delay:${5 + i * .2}s`))}
        <g transform="translate(600,330)"><rect x="-90" y="0" width="180" height="20" rx="6" fill="#bcaaa4" stroke="${INK}" stroke-width="3"/><text x="-20" y="-6" font-size="50">🥪</text></g>
        <text class="w-fly2" x="330" y="250" font-size="30">🪰</text>`,
      css: `.w-fly{opacity:0;animation:wf 2s forwards,buzz .3s infinite alternate}@keyframes wf{10%{opacity:1}to{opacity:1;transform:translate(var(--tx),var(--ty))}}@keyframes buzz{to{margin-top:3px}}
        .w-rat{animation:run 2s 3.2s forwards}@keyframes run{to{transform:translateX(-480px)}}.w-germ{opacity:0;animation:fadeIn .6s forwards}
        .w-fly2{opacity:0;animation:fadeIn .3s 7.5s forwards,tofood 1.5s 7.6s forwards}@keyframes tofood{to{transform:translate(260px,40px)}}` },
  };

  const css = document.createElement('style');
  css.textContent = `
    .watch{display:inline-flex;align-items:center;gap:4px;border:2px solid #8e2a6b;background:#8e2a6b;color:#fff;border-radius:20px;padding:1px 10px;font:inherit;font-size:14px;cursor:pointer;vertical-align:middle;margin:0 4px}
    .scene{position:fixed;inset:0;background:rgba(20,30,22,.9);display:none;flex-direction:column;align-items:center;justify-content:center;gap:8px;z-index:25;padding:10px}
    .scene.on{display:flex}.scene .stagebox{width:min(96vw,calc((100vh - 170px) * 16 / 9));background:#fff;border-radius:18px;border:4px solid #c2366f;overflow:hidden}
    .scene svg{display:block;width:100%;height:auto}.scene h3{margin:0;color:#fff;font-size:26px}
    .scene .say{background:#fff3c4;border:3px dashed #f5c242;border-radius:16px;padding:6px 18px;font-size:22px;min-height:48px;text-align:center;max-width:96vw;color:#23293a}
    .scene .row{display:flex;gap:10px}.scene .row button{font:inherit;font-size:18px;border-radius:14px;padding:6px 16px;cursor:pointer;border:3px solid #fff}
    .scene .again{background:#c2366f;color:#fff}.scene .x{background:#d23b3b;color:#fff}
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
