// Frame-deterministic animation: window.render(t) draws the frame at time t (seconds).
const W = 1920, H = 1080;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const F = 'Cairo';
const DURATION = 236;

// ---------- narration cues (also used for subtitles / SRT) ----------
const CUES = [
  [2.0, 7.4, 'مرحبًا يا عالماتي الصغيرات! أهلًا بكنّ في مختبر العلوم.'],
  [7.8, 14.4, 'هل تساءلتنّ ماذا يحدث للماء الموجود في بقايا الطعام داخل أجسامنا؟'],
  [14.8, 19.4, 'هيا نكتشف ذلك بتجربة ممتعة!'],
  [20.8, 23.8, 'قبل أن نبدأ… لنتوقّع!'],
  [24.2, 31.0, 'أمامنا أربعة أنواع من الورق: مناشف ورقية من الألياف، ومناشف ورقية عادية، وورق طباعة، وورق تجليد.'],
  [31.4, 37.6, 'أي نوع من الورق تتوقعين أن يمتص أكبر كمية من الماء؟'],
  [40.4, 46.0, 'هذه أدوات تجربتنا: مقص، وأنواع من الورق، ومخبار مدرج، وماء، وساعة إيقاف.'],
  [46.4, 51.8, 'تذكّري: الأمان أولًا! نستخدم المقص بحذر وتحت إشراف المعلمة.'],
  [52.4, 58.0, 'الخطوة الأولى: نقص قطعًا متساوية من كل نوع من الورق في الحجم والشكل.'],
  [58.4, 63.8, 'نجعل القطع متساوية حتى تكون المقارنة عادلة.'],
  [64.4, 70.0, 'الخطوة الثانية: نضع خمسين مليلترًا من الماء في المخبار المدرج.'],
  [70.4, 75.8, 'ننظر إلى التدريج بمستوى العين لنقرأ الكمية بدقة.'],
  [76.4, 83.0, 'الآن نغمس قطعة الورق في الماء، ونتركها مدة دقيقة واحدة.'],
  [83.4, 91.4, 'لاحظي كيف يتسلل الماء بين ألياف الورق ويبلّله شيئًا فشيئًا!'],
  [92.4, 98.4, 'الخطوة الثالثة: نُخرج الورقة، وننتظر حتى تتوقف قطرات الماء.'],
  [98.8, 105.6, 'الخطوة الرابعة: نقرأ مستوى الماء المتبقي في المخبار ونسجّله.'],
  [106.4, 113.0, 'نكرر التجربة نفسها مع بقية أنواع الورق، بالكمية نفسها والمدة نفسها.'],
  [113.4, 123.4, 'انظري! مستوى الماء المتبقي مختلف في كل مخبار.'],
  [124.4, 131.0, 'هذه نتائج توضيحية افتراضية تساعدنا على الفهم، وليست قياسات حقيقية.'],
  [131.4, 138.0, 'نحسب كمية الماء الممتص: الكمية الأولى ناقص الكمية المتبقية.'],
  [138.4, 145.6, 'امتصت مناشف الألياف أربعين مليلترًا، والمناشف العادية ثمانية وعشرين، وورق الطباعة اثني عشر، وورق التجليد أربعة فقط.'],
  [146.0, 151.8, 'نلاحظ أن أنواع الورق تختلف في قدرتها على امتصاص الماء.'],
  [152.4, 158.0, 'والآن… ما علاقة الورق الماصّ بأجسامنا؟'],
  [158.4, 165.0, 'هذا هو الجهاز الهضمي: المريء، ثم المعدة، ثم الأمعاء الدقيقة، ثم الأمعاء الغليظة.'],
  [165.4, 171.8, 'تخيّلي يا صغيرتي! عندما تصل بقايا الطعام إلى الأمعاء الغليظة…'],
  [172.2, 179.6, 'يُمتص جزء من الماء الموجود فيها عبر جدار الأمعاء، فينتقل إلى الدم ويستفيد منه الجسم.'],
  [180.0, 186.0, 'وبذلك يقل الماء في الفضلات، وتصبح أكثر صلابة.'],
  [186.4, 195.6, 'تذكّري: الورق نموذج مبسّط لفكرة امتصاص الماء فقط، وليس مطابقًا لتركيب الأمعاء.'],
  [196.4, 201.8, 'والآن أستنتج: كيف تساعد الأمعاء الغليظة على عملية الهضم؟'],
  [207.4, 215.6, 'تمتص الأمعاء الغليظة الماء من بقايا الطعام، وتساعد على تكوين الفضلات الصلبة.'],
  [216.4, 221.8, 'أحسنتنّ يا عالماتي!'],
  [222.2, 229.4, 'اليوم تعلّمنا كيف تساعد الأمعاء الغليظة أجسامنا على امتصاص الماء.'],
];
window.CUES = CUES;
window.DURATION = DURATION;

// ---------- helpers ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, p) => a + (b - a) * p;
const pr = (t, a, b) => clamp((t - a) / (b - a));
const eio = p => { p = clamp(p); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
const eout = p => { p = clamp(p); return 1 - Math.pow(1 - p, 3); };
const back = p => { p = clamp(p); const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const AR = '٠١٢٣٤٥٦٧٨٩';
const ar = n => String(n).replace(/\d/g, d => AR[d]);
function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }

function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function txt(s, x, y, size, color, o = {}) {
  ctx.save();
  ctx.font = `${o.w || 700} ${size}px ${F}`;
  ctx.direction = 'rtl';
  ctx.textAlign = o.align || 'center';
  ctx.textBaseline = 'middle';
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  if (o.shadow) { ctx.shadowColor = 'rgba(40,40,90,.25)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4; }
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.sw || 10; ctx.strokeStyle = o.stroke; ctx.strokeText(s, x, y); }
  ctx.fillStyle = color; ctx.fillText(s, x, y);
  ctx.restore();
}
function wrap(s, maxW, size, w = 700) {
  ctx.save(); ctx.font = `${w} ${size}px ${F}`; ctx.direction = 'rtl';
  const words = s.split(' '); const lines = []; let cur = '';
  for (const wd of words) {
    const tryS = cur ? cur + ' ' + wd : wd;
    if (ctx.measureText(tryS).width > maxW && cur) { lines.push(cur); cur = wd; } else cur = tryS;
  }
  if (cur) lines.push(cur);
  ctx.restore(); return lines;
}
function measure(s, size, w = 700) { ctx.save(); ctx.font = `${w} ${size}px ${F}`; const m = ctx.measureText(s).width; ctx.restore(); return m; }
function pop(t, a, d = .5) { return back(pr(t, a, a + d)); }

function withAlpha(a, fn) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= clamp(a); fn(); ctx.restore(); }
function scaled(x, y, s, fn) { if (s <= 0.001) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); }

// pill label
function chip(s, x, y, size, bg, fg, o = {}) {
  const w = measure(s, size, o.w || 700) + size * 1.2, h = size * 1.75;
  ctx.save();
  ctx.shadowColor = 'rgba(50,60,120,.22)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
  rr(x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  ctx.restore();
  if (o.border) { rr(x - w / 2, y - h / 2, w, h, h / 2); ctx.lineWidth = 3; ctx.strokeStyle = o.border; ctx.stroke(); }
  txt(s, x, y + size * 0.04, size, fg, { w: o.w || 700 });
  return w;
}

// soft 3D panel/card
function card(x, y, w, h, r, fill, o = {}) {
  ctx.save();
  ctx.shadowColor = 'rgba(60,60,130,.22)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
  rr(x, y, w, h, r); ctx.fillStyle = fill; ctx.fill();
  ctx.restore();
  if (o.border) { rr(x, y, w, h, r); ctx.lineWidth = o.bw || 4; ctx.strokeStyle = o.border; ctx.stroke(); }
  // top gloss
  ctx.save(); rr(x, y, w, h, r); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h * .5);
  g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h * .5); ctx.restore();
}

function arrow(x1, y1, x2, y2, color, lw = 6, head = 20) {
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath(); ctx.moveTo(x2 + Math.cos(a) * 4, y2 + Math.sin(a) * 4);
  ctx.lineTo(x2 - Math.cos(a - .5) * head, y2 - Math.sin(a - .5) * head);
  ctx.lineTo(x2 - Math.cos(a + .5) * head, y2 - Math.sin(a + .5) * head); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drop(x, y, r, color = '#3FA4E8', alpha = 1) {
  ctx.save(); ctx.globalAlpha *= alpha;
  const g = ctx.createRadialGradient(x - r * .3, y - r * .1, r * .1, x, y, r * 1.2);
  g.addColorStop(0, '#BFE6FF'); g.addColorStop(1, color);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.moveTo(x, y - r * 1.9);
  ctx.bezierCurveTo(x + r * .4, y - r * 1.1, x + r, y - r * .5, x + r, y);
  ctx.arc(x, y, r, 0, Math.PI);
  ctx.bezierCurveTo(x - r, y - r * .5, x - r * .4, y - r * 1.1, x, y - r * 1.9);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.ellipse(x - r * .38, y - r * .2, r * .18, r * .32, -.3, 0, 7); ctx.fill();
  ctx.restore();
}

function sparkle(x, y, r, color = '#FFD54F', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = i * Math.PI / 2;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    ctx.lineTo(Math.cos(a + Math.PI / 4) * r * .28, Math.sin(a + Math.PI / 4) * r * .28);
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

function warnTri(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(42, 32); ctx.lineTo(-42, 32); ctx.closePath();
  ctx.fillStyle = '#FFC107'; ctx.lineJoin = 'round'; ctx.lineWidth = 8; ctx.strokeStyle = '#E65100'; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#5D2A00'; ctx.fillRect(-4, -18, 8, 30); ctx.beginPath(); ctx.arc(0, 22, 5, 0, 7); ctx.fill();
  ctx.restore();
}

function check(x, y, s, color = '#2E9E5B') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fillStyle = color; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-13, 1); ctx.lineTo(-3, 12); ctx.lineTo(15, -10); ctx.stroke();
  ctx.restore();
}
function cross(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 30, 0, 7); ctx.fillStyle = '#E25555'; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-11, -11); ctx.lineTo(11, 11); ctx.moveTo(11, -11); ctx.lineTo(-11, 11); ctx.stroke();
  ctx.restore();
}

function atom(x, y, r, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.lineWidth = r * .09; ctx.strokeStyle = '#3B7DD8';
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.rotate(i * Math.PI / 3 + t * .4); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .38, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  for (let i = 0; i < 3; i++) {
    const a = t * 2.2 + i * 2.1, rot = i * Math.PI / 3 + t * .4;
    const ex = Math.cos(a) * r, ey = Math.sin(a) * r * .38;
    ctx.beginPath(); ctx.arc(ex * Math.cos(rot) - ey * Math.sin(rot), ex * Math.sin(rot) + ey * Math.cos(rot), r * .1, 0, 7); ctx.fillStyle = '#29B6F6'; ctx.fill();
  }
  ctx.beginPath(); ctx.arc(0, 0, r * .2, 0, 7); ctx.fillStyle = '#EF5350'; ctx.fill();
  ctx.restore();
}

function flask(g, x, y, s, liquid) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.moveTo(-12, -90); g.lineTo(-12, -45); g.lineTo(-45, 0); g.quadraticCurveTo(-50, 10, -40, 10); g.lineTo(40, 10); g.quadraticCurveTo(50, 10, 45, 0); g.lineTo(12, -45); g.lineTo(12, -90); g.closePath();
  g.fillStyle = 'rgba(255,255,255,.6)'; g.fill();
  g.save(); g.clip(); g.fillStyle = liquid; g.fillRect(-60, -28, 120, 50); g.restore();
  g.lineWidth = 4; g.strokeStyle = '#9DB9D3'; g.stroke();
  g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(-6, -84, 4, 34);
  g.restore();
}

// ---------- cached backgrounds ----------
let BG = null, COUNTER = null;
function buildBG() {
  BG = document.createElement('canvas'); BG.width = W; BG.height = H;
  const g = BG.getContext('2d');
  let gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, '#DDF0FA'); gr.addColorStop(.55, '#EFE9FA'); gr.addColorStop(1, '#FBEAF1');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // wall tiles
  g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 2;
  for (let y = 520; y < 800; y += 70) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  for (let y = 520, r = 0; y < 800; y += 70, r++) for (let x = (r % 2) * 70; x < W; x += 140) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 70); g.stroke(); }
  // window
  g.save(); g.shadowColor = 'rgba(80,90,150,.2)'; g.shadowBlur = 25; g.fillStyle = '#FFFFFF'; g.beginPath(); g.roundRect(110, 80, 440, 350, 30); g.fill(); g.restore();
  let sky = g.createLinearGradient(0, 100, 0, 410); sky.addColorStop(0, '#9ED8F7'); sky.addColorStop(1, '#D8F1FF');
  g.fillStyle = sky; g.beginPath(); g.roundRect(130, 100, 400, 310, 20); g.fill();
  g.fillStyle = 'rgba(255,255,255,.95)';
  for (const [cx, cy, s] of [[230, 180, 1], [420, 260, .8], [300, 330, .6]]) { for (const [dx, dy, r] of [[0, 0, 30], [32, -12, 36], [66, 0, 28], [30, 10, 30]]) { g.beginPath(); g.arc(cx + dx * s, cy + dy * s, r * s, 0, 7); g.fill(); } }
  g.fillStyle = '#FFFFFF'; g.fillRect(323, 100, 14, 310); g.fillRect(130, 248, 400, 14);
  // pendant lamps
  for (const lx of [800, 1120]) {
    g.strokeStyle = '#B9B4D6'; g.lineWidth = 4; g.beginPath(); g.moveTo(lx, 0); g.lineTo(lx, 60); g.stroke();
    let lg = g.createLinearGradient(lx - 60, 0, lx + 60, 0); lg.addColorStop(0, '#F8C6D8'); lg.addColorStop(1, '#F3A6C2');
    g.fillStyle = lg; g.beginPath(); g.moveTo(lx - 22, 60); g.lineTo(lx + 22, 60); g.lineTo(lx + 60, 110); g.lineTo(lx - 60, 110); g.closePath(); g.fill();
    let cone = g.createLinearGradient(0, 110, 0, 600); cone.addColorStop(0, 'rgba(255,248,210,.45)'); cone.addColorStop(1, 'rgba(255,248,210,0)');
    g.fillStyle = cone; g.beginPath(); g.moveTo(lx - 55, 110); g.lineTo(lx + 55, 110); g.lineTo(lx + 230, 620); g.lineTo(lx - 230, 620); g.closePath(); g.fill();
  }
  // shelves
  for (const sy of [250, 430]) {
    g.save(); g.shadowColor = 'rgba(80,60,120,.25)'; g.shadowBlur = 12; g.shadowOffsetY = 6;
    g.fillStyle = '#E8D5F2'; g.fillRect(1380, sy, 450, 18); g.restore();
  }
  const liq = ['#9AE6C8', '#F7B2CC', '#AFC8FF', '#FFE08A', '#C5A8F0', '#8ED8F2'];
  [[1430, 250, .8], [1530, 250, 1], [1640, 250, .7], [1740, 250, .9], [1450, 430, .9], [1570, 430, .7], [1680, 430, 1.05], [1785, 430, .75]].forEach(([x, y, s], i) => flask(g, x, y - 10 * s, s, liq[i % liq.length]));
  // atom poster
  g.save(); g.shadowColor = 'rgba(80,90,150,.18)'; g.shadowBlur = 18; g.fillStyle = '#FFFDF4'; g.beginPath(); g.roundRect(1440, 500, 300, 220, 20); g.fill(); g.restore();
  // microscope silhouette on counter left
  COUNTER = document.createElement('canvas'); COUNTER.width = W; COUNTER.height = H;
  const c = COUNTER.getContext('2d');
  let top = c.createLinearGradient(0, 790, 0, 840); top.addColorStop(0, '#FFFFFF'); top.addColorStop(1, '#E7E1F4');
  c.fillStyle = top; c.fillRect(0, 790, W, 50);
  let front = c.createLinearGradient(0, 840, 0, H); front.addColorStop(0, '#C9E1F4'); front.addColorStop(1, '#B4D2EC');
  c.fillStyle = front; c.fillRect(0, 840, W, H - 840);
  c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(0, 790, W, 4);
  c.fillStyle = 'rgba(90,110,170,.18)'; c.fillRect(0, 838, W, 4);
  c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 4;
  for (let x = 0; x < W; x += 320) { c.beginPath(); c.roundRect(x + 20, 870, 280, 200, 16); c.stroke(); c.fillStyle = '#FFFFFF'; c.beginPath(); c.roundRect(x + 140, 890, 40, 10, 5); c.fill(); }
}
function drawPosterAtom(t) { atom(1590, 610, 70, t); }

function lab(t, o = {}) {
  ctx.drawImage(BG, 0, 0);
  drawPosterAtom(t);
  // bubbles rising in shelf flasks
  for (let i = 0; i < 8; i++) {
    const bx = [1430, 1530, 1640, 1740, 1450, 1570, 1680, 1785][i], by = i < 4 ? 240 : 420;
    const ph = (t * .6 + hash(i)) % 1;
    ctx.beginPath(); ctx.arc(bx + Math.sin(t * 3 + i) * 4, by - 20 - ph * 40, 4, 0, 7);
    ctx.fillStyle = `rgba(255,255,255,${.8 * (1 - ph)})`; ctx.fill();
  }
  if (o.teacher) o.teacher();
  ctx.drawImage(COUNTER, 0, 0);
}

// ---------- teacher character ----------
function isTalking(t) {
  for (const [a, b] of CUES) if (t >= a && t <= b) return true;
  return false;
}
function teacher(x, y, s, t, o = {}) {
  const talk = o.talk !== undefined ? o.talk : isTalking(t);
  const arm = o.arm || 'rest';
  ctx.save();
  ctx.translate(x, y + Math.sin(t * 2.1) * 4 * s);
  ctx.scale(s * (o.flip ? -1 : 1), s);
  ctx.rotate(Math.sin(t * 1.3) * .015);
  // hair back
  let hg = ctx.createLinearGradient(-200, -400, 200, 0); hg.addColorStop(0, '#7A4A32'); hg.addColorStop(1, '#5A3322');
  ctx.fillStyle = hg;
  ctx.beginPath(); ctx.moveTo(-120, -400);
  ctx.bezierCurveTo(-215, -330, -200, -150, -175, -30); ctx.quadraticCurveTo(-120, 10, -60, -80);
  ctx.lineTo(60, -80); ctx.quadraticCurveTo(120, 10, 175, -30);
  ctx.bezierCurveTo(200, -150, 215, -330, 120, -400); ctx.closePath(); ctx.fill();
  // torso / lab coat
  let cg = ctx.createLinearGradient(-180, 0, 180, 0); cg.addColorStop(0, '#E9EEF7'); cg.addColorStop(.5, '#FFFFFF'); cg.addColorStop(1, '#DCE3F0');
  ctx.fillStyle = cg;
  ctx.beginPath(); ctx.moveTo(-185, 60); ctx.lineTo(-170, -120); ctx.quadraticCurveTo(-160, -190, -90, -200); ctx.lineTo(90, -200); ctx.quadraticCurveTo(160, -190, 170, -120); ctx.lineTo(185, 60); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#C5CEE0'; ctx.lineWidth = 3; ctx.stroke();
  // blouse
  ctx.fillStyle = '#7FB8EC'; ctx.beginPath(); ctx.moveTo(-48, -200); ctx.lineTo(0, -95); ctx.lineTo(48, -200); ctx.closePath(); ctx.fill();
  // lapels
  ctx.fillStyle = '#F4F7FC'; ctx.strokeStyle = '#C5CEE0';
  ctx.beginPath(); ctx.moveTo(-50, -200); ctx.lineTo(-85, -140); ctx.lineTo(-40, -120); ctx.lineTo(0, -60); ctx.lineTo(-10, -100); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50, -200); ctx.lineTo(85, -140); ctx.lineTo(40, -120); ctx.lineTo(0, -60); ctx.lineTo(10, -100); ctx.closePath(); ctx.fill(); ctx.stroke();
  // pocket + pens
  ctx.fillStyle = '#FF8FAB'; ctx.fillRect(95, -110, 7, 30); ctx.fillStyle = '#64B5F6'; ctx.fillRect(107, -106, 7, 26);
  ctx.strokeStyle = '#C5CEE0'; ctx.strokeRect(85, -85, 45, 40);
  // name badge
  ctx.fillStyle = '#FFE08A'; rr(-125, -80, 50, 26, 6); ctx.fill();
  // neck
  ctx.fillStyle = '#F5C7A9'; ctx.fillRect(-30, -240, 60, 50);
  // head
  let sk = ctx.createRadialGradient(-25, -350, 20, 0, -320, 130); sk.addColorStop(0, '#FFE6D5'); sk.addColorStop(1, '#F7C9AA');
  ctx.fillStyle = sk; ctx.beginPath(); ctx.ellipse(0, -325, 108, 118, 0, 0, 7); ctx.fill();
  // ears
  ctx.beginPath(); ctx.ellipse(-106, -315, 16, 24, 0, 0, 7); ctx.ellipse(106, -315, 16, 24, 0, 0, 7); ctx.fillStyle = '#F5C2A2'; ctx.fill();
  // bangs
  ctx.fillStyle = hg;
  ctx.beginPath(); ctx.moveTo(-118, -300);
  ctx.bezierCurveTo(-130, -420, -40, -470, 10, -450); ctx.bezierCurveTo(90, -460, 140, -400, 118, -300);
  ctx.quadraticCurveTo(100, -360, 60, -385); ctx.quadraticCurveTo(20, -350, -30, -385);
  ctx.quadraticCurveTo(-80, -360, -118, -300); ctx.closePath(); ctx.fill();
  // hair clip
  ctx.fillStyle = '#FF8FAB'; ctx.beginPath(); ctx.ellipse(80, -405, 18, 11, .5, 0, 7); ctx.fill();
  // eyes
  const bl = (t % 3.7) < .13 ? .12 : 1;
  for (const ex of [-42, 42]) {
    ctx.save(); ctx.translate(ex, -318); ctx.scale(1, bl);
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(0, 0, 24, 30, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#6B3E26'; ctx.beginPath(); ctx.arc(2, 4, 19, 0, 7); ctx.fill();
    ctx.fillStyle = '#2B160C'; ctx.beginPath(); ctx.arc(2, 5, 10, 0, 7); ctx.fill();
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(-5, -4, 6, 0, 7); ctx.arc(8, 11, 3, 0, 7); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = '#3A1F12'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(ex, -318, 30, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(ex - 20, -368 - (talk ? Math.abs(Math.sin(t * 3)) * 4 : 0)); ctx.quadraticCurveTo(ex, -378, ex + 20, -368); ctx.stroke();
  }
  // cheeks
  ctx.fillStyle = 'rgba(255,140,160,.35)'; ctx.beginPath(); ctx.ellipse(-68, -272, 20, 12, 0, 0, 7); ctx.ellipse(68, -272, 20, 12, 0, 0, 7); ctx.fill();
  // nose
  ctx.strokeStyle = '#E3A584'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -282, 7, .2, Math.PI - .2); ctx.stroke();
  // mouth
  if (talk) {
    const m = 5 + Math.abs(Math.sin(t * 13)) * 13 + Math.abs(Math.sin(t * 7.3)) * 4;
    ctx.fillStyle = '#B23A48'; ctx.beginPath(); ctx.ellipse(0, -248, 20, m * .7, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#FF8A9A'; ctx.beginPath(); ctx.ellipse(0, -248 + m * .35, 11, m * .3, 0, 0, 7); ctx.fill();
  } else {
    ctx.strokeStyle = '#B23A48'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, -262, 24, .35, Math.PI - .35); ctx.stroke();
  }
  // arms
  const drawArm = (side, ang) => {
    ctx.save(); ctx.translate(side * 150, -165); ctx.rotate(ang);
    let ag = ctx.createLinearGradient(-30, 0, 30, 0); ag.addColorStop(0, '#E4EAF5'); ag.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = ag; rr(-30, -10, 60, 175, 30); ctx.fill(); ctx.strokeStyle = '#C5CEE0'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#F7C9AA'; ctx.beginPath(); ctx.arc(0, 180, 27, 0, 7); ctx.fill();
    if (o.pointer && side === 1) { ctx.strokeStyle = '#8D5A3B'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(0, 185); ctx.lineTo(0, 330); ctx.stroke(); ctx.fillStyle = '#FFD54F'; ctx.beginPath(); ctx.arc(0, 332, 10, 0, 7); ctx.fill(); }
    ctx.restore();
  };
  drawArm(-1, .12 + Math.sin(t * 1.5) * .03);
  let ang = .1;
  if (arm === 'wave') ang = -2.55 + Math.sin(t * 9) * .32;
  else if (arm === 'point') ang = -2.15 + Math.sin(t * 2) * .05;
  else if (arm === 'up') ang = -2.9 + Math.sin(t * 2) * .05;
  if (o.armBlend !== undefined) ang = lerp(.1, ang, o.armBlend);
  drawArm(1, ang);
  ctx.restore();
}

// ---------- paper ----------
const PAPERS = [
  { name: 'مناشف ورقية من الألياف', color: '#FFFFFF', edge: '#CBD6E2', tex: 'quilt', absorb: 40, final: 10, bar: '#4FA3E0' },
  { name: 'مناشف ورقية عادية', color: '#F4E7D1', edge: '#D2BC97', tex: 'dots', absorb: 28, final: 22, bar: '#F2A65A' },
  { name: 'ورق طباعة', color: '#F6F8FC', edge: '#B9C6D6', tex: 'plain', absorb: 12, final: 38, bar: '#9C8CF0' },
  { name: 'ورق تجليد', color: '#E53935', edge: '#A91B1B', tex: 'gloss', absorb: 4, final: 46, bar: '#E8505B' },
];
function paper(i, x, y, w, h, wet = 0, o = {}) {
  const p = PAPERS[i];
  ctx.save();
  if (!o.noShadow) { ctx.shadowColor = 'rgba(60,60,110,.25)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6; }
  ctx.fillStyle = p.color; ctx.fillRect(x, y, w, h);
  ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (p.tex === 'quilt') {
    ctx.strokeStyle = 'rgba(150,170,195,.45)'; ctx.lineWidth = 2;
    for (let k = -h; k < w + h; k += 22) { ctx.beginPath(); ctx.moveTo(x + k, y); ctx.lineTo(x + k + h, y + h); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + k, y + h); ctx.lineTo(x + k + h, y); ctx.stroke(); }
  } else if (p.tex === 'dots') {
    ctx.fillStyle = 'rgba(170,130,80,.35)';
    for (let yy = y + 8; yy < y + h; yy += 16) for (let xx = x + 8 + ((yy - y) / 16 % 2) * 8; xx < x + w; xx += 16) { ctx.beginPath(); ctx.arc(xx, yy, 2.4, 0, 7); ctx.fill(); }
  } else if (p.tex === 'gloss') {
    const g = ctx.createLinearGradient(x, y, x + w, y + h); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.45, 'rgba(255,255,255,.35)'); g.addColorStop(.55, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  } else {
    ctx.strokeStyle = 'rgba(160,175,200,.25)'; ctx.lineWidth = 1.5;
    for (let yy = y + 14; yy < y + h; yy += 14) { ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + w, yy); ctx.stroke(); }
  }
  if (wet > 0) {
    const wy = y + h - h * wet;
    const g = ctx.createLinearGradient(0, wy, 0, y + h); g.addColorStop(0, 'rgba(70,150,225,.28)'); g.addColorStop(1, 'rgba(40,120,210,.45)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y + h);
    for (let xx = 0; xx <= w; xx += 6) ctx.lineTo(x + xx, wy + Math.sin(xx * .09 + (o.t || 0) * 2) * 4);
    ctx.lineTo(x + w, y + h); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  ctx.strokeStyle = p.edge; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, w, h);
}

// ---------- graduated cylinder ----------
// x = centre, y = base bottom, h = glass height. level in mL (scale 0..60)
function cylinder(x, y, w, h, level, o = {}) {
  const top = y - h, inner = h - 40, bottomIn = y - 30;
  const lvlY = bottomIn - inner * level / 60;
  // base
  ctx.save(); ctx.shadowColor = 'rgba(60,70,130,.25)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#D8E8F7'; ctx.beginPath(); ctx.ellipse(x, y - 8, w * .85, 16, 0, 0, 7); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#C2DAF0'; ctx.fillRect(x - w * .85, y - 18, w * 1.7, 10);
  // back glass
  ctx.fillStyle = 'rgba(220,238,252,.45)'; rr(x - w / 2, top, w, h - 18, [10, 10, 16, 16]); ctx.fill();
  // paper inside (behind front glass)
  if (o.drawInside) o.drawInside(lvlY);
  // water
  if (level > 0.05) {
    ctx.save(); rr(x - w / 2 + 5, top, w - 10, h - 22, [8, 8, 14, 14]); ctx.clip();
    const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
    g.addColorStop(0, 'rgba(70,160,230,.78)'); g.addColorStop(.5, 'rgba(120,200,250,.62)'); g.addColorStop(1, 'rgba(50,140,215,.8)');
    ctx.fillStyle = g;
    const wob = o.wobble || 0, tt = o.t || 0;
    ctx.beginPath(); ctx.moveTo(x - w / 2, y);
    for (let k = 0; k <= 20; k++) { const xx = x - w / 2 + w * k / 20; ctx.lineTo(xx, lvlY + Math.sin(k * .7 + tt * 8) * wob); }
    ctx.lineTo(x + w / 2, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(200,235,255,.7)'; ctx.beginPath(); ctx.ellipse(x, lvlY, w / 2 - 6, 7, 0, 0, 7); ctx.fill();
    ctx.restore();
  }
  if (o.drawFront) o.drawFront(lvlY);
  if (o.paper) { const P = o.paper; paper(P.i, P.x, P.y, P.w, P.h, P.wet, { t: o.t, noShadow: true }); const yy = Math.max(P.y, lvlY); if (level > .05 && yy < P.y + P.h) { ctx.fillStyle = 'rgba(60,150,225,.38)'; ctx.fillRect(P.x - 1, yy, P.w + 2, P.y + P.h - yy); } }
  // graduations
  ctx.strokeStyle = '#4A6E92'; ctx.fillStyle = '#35587A'; ctx.lineWidth = 2.5;
  for (let m = 0; m <= 60; m += 2) {
    const yy = bottomIn - inner * m / 60; const L = m % 10 === 0 ? w * .38 : w * .2;
    ctx.beginPath(); ctx.moveTo(x + w / 2 - 6 - L, yy); ctx.lineTo(x + w / 2 - 6, yy); ctx.stroke();
    if (m % 10 === 0 && m > 0 && !o.noNums) txt(ar(m), x + w / 2 - 14 - L - (o.numSize || 16) * .8, yy, o.numSize || 16, '#35587A', { w: 700 });
  }
  // front glass
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(120,160,200,.9)'; rr(x - w / 2, top, w, h - 18, [10, 10, 16, 16]); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x - w / 2 + 9, top + 14, 7, h - 60);
  // rim + spout
  ctx.fillStyle = 'rgba(200,225,245,.95)'; ctx.beginPath(); ctx.ellipse(x, top, w / 2 + 4, 8, 0, 0, 7); ctx.fill(); ctx.stroke();
  return lvlY;
}

function scissors(x, y, ang, open, s) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  for (const sd of [1, -1]) {
    ctx.save(); ctx.rotate(sd * open);
    let bg = ctx.createLinearGradient(0, -10, 0, 10); bg.addColorStop(0, '#F1F4F8'); bg.addColorStop(1, '#A7B3C2');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(0, -7 * sd); ctx.lineTo(160, -2 * sd); ctx.quadraticCurveTo(165, 0, 160, 3 * sd); ctx.lineTo(0, 9 * sd); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#7D8A9A'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.strokeStyle = '#E53935'; ctx.lineWidth = 16; ctx.beginPath(); ctx.ellipse(-70, 20 * sd, 46, 26, sd * .25, 0, 7); ctx.stroke();
    ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-26, 12 * sd); ctx.lineTo(0, 4 * sd); ctx.stroke();
    ctx.restore();
  }
  ctx.fillStyle = '#5E6B7A'; ctx.beginPath(); ctx.arc(0, 0, 8, 0, 7); ctx.fill();
  ctx.restore();
}

function stopwatch(x, y, r, sec, o = {}) {
  ctx.save();
  ctx.shadowColor = 'rgba(40,40,80,.3)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#2F3540'; ctx.beginPath(); ctx.arc(x, y, r * 1.12, 0, 7); ctx.fill();
  ctx.restore();
  ctx.fillStyle = '#2F3540'; rr(x - r * .14, y - r * 1.38, r * .28, r * .24, 6); ctx.fill();
  ctx.fillRect(x - r * .07, y - r * 1.18, r * .14, r * .12);
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
  if (sec > 0) {
    ctx.fillStyle = 'rgba(255,120,140,.28)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r * .92, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.min(sec, 60) / 60); ctx.closePath(); ctx.fill();
  }
  ctx.strokeStyle = '#2F3540';
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, L = i % 5 === 0 ? r * .14 : r * .06;
    ctx.lineWidth = i % 5 === 0 ? 4 : 2;
    ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * (r * .95), y - Math.cos(a) * (r * .95)); ctx.lineTo(x + Math.sin(a) * (r * .95 - L), y - Math.cos(a) * (r * .95 - L)); ctx.stroke();
  }
  const a = Math.min(sec, 60) / 60 * Math.PI * 2;
  ctx.strokeStyle = '#E53935'; ctx.lineWidth = Math.max(3, r * .04); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - Math.sin(a) * r * .15, y + Math.cos(a) * r * .15); ctx.lineTo(x + Math.sin(a) * r * .8, y - Math.cos(a) * r * .8); ctx.stroke();
  ctx.fillStyle = '#E53935'; ctx.beginPath(); ctx.arc(x, y, r * .07, 0, 7); ctx.fill();
  if (o.label) txt(ar(Math.floor(Math.min(sec, 60))) + ' ث', x, y + r * .45, r * .2, '#2F3540', { w: 800 });
}

function beaker(x, y, s, ang, level) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
  // body from (-70,-180) to (70,0)
  ctx.fillStyle = 'rgba(225,240,252,.6)'; rr(-70, -180, 140, 180, [6, 6, 18, 18]); ctx.fill();
  ctx.save(); rr(-70, -180, 140, 180, [6, 6, 18, 18]); ctx.clip();
  // water stays level with world: counter-rotate
  ctx.rotate(-ang);
  ctx.fillStyle = 'rgba(70,160,230,.72)'; ctx.fillRect(-300, -180 * level + 0, 600, 400);
  ctx.restore();
  ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(120,160,200,.95)'; rr(-70, -180, 140, 180, [6, 6, 18, 18]); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-70, -180); ctx.lineTo(-92, -196); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(-58, -165, 8, 140);
  ctx.restore();
}

// ---------- subtitles & headers ----------
function subtitles(t) {
  if (window.NOSUBS) return;
  let cue = null;
  for (const c of CUES) if (t >= c[0] - .15 && t <= c[1] + .25) cue = c;
  if (!cue) return;
  const a = Math.min(pr(t, cue[0] - .15, cue[0] + .2), 1 - pr(t, cue[1], cue[1] + .25));
  const lines = wrap(cue[2], 1500, 44);
  const lh = 64, h = lines.length * lh + 34, w = Math.max(...lines.map(l => measure(l, 44))) + 90;
  withAlpha(a, () => {
    ctx.save(); ctx.shadowColor = 'rgba(30,30,70,.35)'; ctx.shadowBlur = 24;
    rr(960 - w / 2, 1052 - h, w, h, 28); ctx.fillStyle = 'rgba(44,40,92,.86)'; ctx.fill(); ctx.restore();
    lines.forEach((l, i) => txt(l, 960, 1052 - h + 17 + lh / 2 + i * lh + 2, 44, '#FFFFFF', { w: 700 }));
  });
}

function header(t, a, b, num, title, color = '#1E7FD8') {
  const s = pop(t, a + .1) * (1 - pr(t, b - .3, b));
  if (s <= 0) return;
  scaled(1700, 70, s, () => {
    const w = measure(title, 40, 800) + 70 + (num ? 70 : 0);
    ctx.save(); ctx.shadowColor = 'rgba(30,60,140,.3)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
    rr(1860 - w, 34, w, 74, 37); ctx.fillStyle = color; ctx.fill(); ctx.restore();
    if (num) {
      ctx.beginPath(); ctx.arc(1860 - 38, 71, 28, 0, 7); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      txt(ar(num), 1860 - 38, 73, 36, color, { w: 800 });
      txt(title, 1860 - 76 - (w - 76) / 2 + 6, 72, 40, '#FFFFFF', { w: 800 });
    } else txt(title, 1860 - w / 2, 72, 40, '#FFFFFF', { w: 800 });
  });
}

function hypoBadge(t, a, x = 960, y = 150) {
  const s = pop(t, a);
  scaled(x, y, s, () => {
    const s1 = 'نتائج توضيحية افتراضية — ليست قياسات حقيقية';
    const w = measure(s1, 32, 800) + 130;
    card(x - w / 2, y - 36, w, 72, 36, '#FFF4D6', { border: '#F2B53A', bw: 3 });
    warnTri(x + w / 2 - 50, y + 2, .55);
    txt(s1, x - 30, y + 2, 32, '#8A4B00', { w: 800 });
  });
}

// ---------- SCENES ----------
function scene1(t) { // 0-20 opening
  const z = lerp(1.14, 1, eio(pr(t, .4, 4.5)));
  scaled(960, 540, z, () => {
    lab(t, { teacher: () => {
      const ex = pr(t, 3.2, 5.0);
      if (ex > 0) teacher(lerp(2250, 1480, back(ex)), 830, 1.0, t, { arm: t < 9.5 ? 'wave' : (t < 15 ? 'rest' : 'point') });
    } });
  });
  // title banner
  const s = pop(t, 4.4, .7);
  scaled(780, 190, s, () => {
    card(330, 105, 900, 170, 40, '#FFF7E8', { border: '#E8C891', bw: 6 });
    txt('مختبر العلوم', 780, 192, 104, '#173A7A', { w: 900, stroke: '#FFFFFF', sw: 12 });
    atom(400, 190, 48, t);
    // magnifier
    ctx.save(); ctx.translate(1160, 180); ctx.lineWidth = 12; ctx.strokeStyle = '#1E6FC2';
    ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.fillStyle = 'rgba(180,225,255,.7)'; ctx.fill(); ctx.stroke();
    ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(30, 30); ctx.lineTo(62, 62); ctx.stroke(); ctx.restore();
  });
  const s2 = pop(t, 6.0, .6);
  scaled(780, 345, s2, () => {
    card(250, 300, 1060, 92, 46, '#FFFFFF', { border: '#F4C66B', bw: 5 });
    txt('كيف تساعد الأمعاء الغليظة على عملية الهضم؟', 780, 348, 48, '#2C2A5A', { w: 800 });
  });
  // floating sparkles & bubbles
  for (let i = 0; i < 14; i++) {
    const ph = (t * .12 + hash(i + 3)) % 1;
    withAlpha(Math.sin(ph * Math.PI) * pr(t, 4, 6), () => sparkle(100 + hash(i) * 1700, 760 - ph * 650, 10 + hash(i + 9) * 12, ['#FFD54F', '#F48FB1', '#81D4FA'][i % 3], t + i));
  }
  // doors
  const op = eio(pr(t, .9, 3.4));
  if (op < 1) {
    for (const sd of [-1, 1]) {
      const dx = sd * op * 980;
      ctx.save(); ctx.translate(dx, 0);
      const x0 = sd < 0 ? 0 : 960;
      let dg = ctx.createLinearGradient(x0, 0, x0 + 960, 0); dg.addColorStop(0, '#B7DCF5'); dg.addColorStop(1, '#A3CDEE');
      ctx.fillStyle = dg; ctx.fillRect(x0, 0, 960, H);
      ctx.strokeStyle = '#86B6DD'; ctx.lineWidth = 10; ctx.strokeRect(x0 + 60, 140, 840, 860);
      ctx.fillStyle = '#E3F4FF'; ctx.beginPath(); ctx.arc(x0 + 480, 380, 150, 0, 7); ctx.fill(); ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 14; ctx.stroke();
      ctx.fillStyle = '#F7B3C9'; rr(sd < 0 ? 900 : 990, 520, 30, 140, 15); ctx.fill();
      atom(x0 + 480, 380, 80, t);
      ctx.restore();
    }
    withAlpha(1 - op * 2, () => {
      card(560, 50, 800, 110, 30, '#FFFFFF', { border: '#F4A7C0', bw: 6 });
      txt('مختبر العلوم', 960, 106, 70, '#173A7A', { w: 900 });
    });
  }
}

function scene2(t) { // 20-40 predict
  lab(t, { teacher: () => teacher(250, 830, .92, t, { arm: t > 31.2 ? 'up' : 'point' }) });
  header(t, 20, 40, 0, 'أتوقّع', '#8E5BD6');
  const xs = [1580, 1260, 940, 620];
  PAPERS.forEach((p, i) => {
    const a = 24.2 + i * 1.5;
    const k = back(pr(t, a, a + .7));
    if (k <= 0) return;
    const fy = lerp(-300, 470, k) + Math.sin(t * 2 + i) * 8;
    ctx.save(); ctx.translate(xs[i], fy); ctx.rotate(Math.sin(t * 1.5 + i) * .04);
    paper(i, -110, -150, 220, 300, 0);
    ctx.restore();
    // shadow on table
    ctx.fillStyle = `rgba(80,80,140,${.15 * k})`; ctx.beginPath(); ctx.ellipse(xs[i], 800, 100 * k, 12, 0, 0, 7); ctx.fill();
    withAlpha(pr(t, a + .4, a + .8), () => chip(p.name, xs[i], 700, 28, '#FFFFFF', '#2C2A5A', { border: PAPERS[i].bar }));
  });
  // big question mark
  const q = pop(t, 31.4, .8);
  if (q > 0) {
    const pul = 1 + Math.sin(t * 4) * .05;
    scaled(1100, 200, q * pul, () => {
      const g = ctx.createRadialGradient(1100, 200, 10, 1100, 200, 150); g.addColorStop(0, 'rgba(255,240,170,.9)'); g.addColorStop(1, 'rgba(255,240,170,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(1100, 200, 150, 0, 7); ctx.fill();
      txt('؟', 1100, 205, 200, '#8E5BD6', { w: 900, stroke: '#FFFFFF', sw: 16 });
    });
    for (let i = 0; i < 6; i++) { const a = t * 1.6 + i * Math.PI / 3; withAlpha(q, () => sparkle(1100 + Math.cos(a) * 160, 200 + Math.sin(a) * 110, 16, ['#FFD54F', '#F48FB1', '#81D4FA'][i % 3], t * 2 + i)); }
    withAlpha(pr(t, 35.5, 36.2), () => chip('فكّري… واكتبي توقّعك!', 600, 210, 34, '#8E5BD6', '#FFFFFF'));
  }
}

function toolRow(t, a, scale = 1) {
  // tools on the counter
  const items = [
    { x: 1640, lab: 'مقص (أحذري)', d: () => scissors(1640, 700, -.3, .25, .9) },
    { x: 1340, lab: 'أنواع من الورق', d: () => { paper(0, 1230, 610, 120, 150); paper(1, 1260, 625, 120, 150); paper(3, 1290, 640, 120, 150); paper(2, 1320, 655, 110, 140); } },
    { x: 1030, lab: 'مخبار مدرج', d: () => cylinder(1030, 800, 90, 300, 0, { noNums: true }) },
    { x: 780, lab: 'ماء', d: () => beaker(780, 790, .9, 0, .75) },
    { x: 520, lab: 'ساعة إيقاف', d: () => stopwatch(520, 690, 85, 0) },
  ];
  items.forEach((it, i) => {
    const s = pop(t, a + i * 1.0, .6);
    scaled(it.x, 760, s, it.d);
    withAlpha(pr(t, a + i + .3, a + i + .7), () => chip(it.lab, it.x, 470 + (i % 2) * 0, 30, '#FFFFFF', '#2C2A5A', { border: '#9BC8EE' }));
  });
}

function scene3a(t) { // 40-52 tools + safety
  lab(t, { teacher: () => teacher(200, 830, .8, t, { arm: 'point' }) });
  header(t, 40, 52, 0, 'أحتاج إلى', '#3E9E52');
  toolRow(t, 40.6);
  const s = pop(t, 46.4, .6) * (1 + Math.sin(t * 10) * .03 * pr(t, 46.4, 47) * (1 - pr(t, 48, 49)));
  scaled(960, 230, s, () => {
    card(600, 170, 720, 120, 30, '#FFF3D9', { border: '#F2B53A', bw: 5 });
    warnTri(1250, 228, .9);
    txt('الأمان أولًا', 930, 205, 40, '#B54800', { w: 900 });
    txt('استخدمي المقص بحذر وتحت إشراف المعلمة', 915, 255, 30, '#5B3A00', { w: 700 });
  });
}

function scene3b(t) { // 52-64 cutting
  lab(t);
  ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(0, 0, W, H);
  header(t, 52, 64, 1, 'أقصّ الورق');
  const cx = 960, cy = 450, S = 520;
  const sep = eio(pr(t, 59.0, 60.3)) * 40;
  const enter = back(pr(t, 52.2, 52.9));
  scaled(cx, cy, enter, () => {
    for (let qx = 0; qx < 2; qx++) for (let qy = 0; qy < 2; qy++) {
      const dx = (qx ? 1 : -1) * sep, dy = (qy ? 1 : -1) * sep;
      paper(3, cx - S / 2 + qx * S / 2 + dx, cy - S / 2 + qy * S / 2 + dy, S / 2, S / 2, 0);
    }
    // cut guide lines
    const c1 = pr(t, 53.2, 55.8), c2 = pr(t, 56.2, 58.8);
    ctx.save(); ctx.setLineDash([16, 12]); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 4;
    if (sep < 1) {
      ctx.beginPath(); ctx.moveTo(cx, cy - S / 2); ctx.lineTo(cx, cy + S / 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + S / 2, cy); ctx.lineTo(cx - S / 2, cy); ctx.stroke();
    }
    ctx.restore();
    if (sep < 1) {
      ctx.strokeStyle = '#7A1010'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(cx, cy - S / 2); ctx.lineTo(cx, cy - S / 2 + S * c1); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + S / 2, cy); ctx.lineTo(cx + S / 2 - S * c2, cy); ctx.stroke();
    }
    // scissors
    const snip = Math.abs(Math.sin(t * 9)) * .32 + .04;
    if (t < 56.0) scissors(cx, cy - S / 2 + S * c1 - 10, -Math.PI / 2 - Math.PI, t > 53.2 ? snip : .3, 1.1);
    else if (t < 59.0) scissors(cx + S / 2 - S * c2 + 10, cy, Math.PI, t > 56.2 && t < 58.8 ? snip : .3, 1.1);
  });
  // equal markers
  withAlpha(pr(t, 60.2, 60.8), () => {
    chip('أربع قطع متساوية في الحجم والشكل', 960, 790, 34, '#1E7FD8', '#FFFFFF');
    for (const [x, y] of [[cx - S / 4 - sep, cy - S / 4 - sep], [cx + S / 4 + sep, cy - S / 4 - sep], [cx - S / 4 - sep, cy + S / 4 + sep], [cx + S / 4 + sep, cy + S / 4 + sep]]) txt('=', x, y, 70, 'rgba(255,255,255,.95)', { w: 900 });
  });
  // other paper types get a piece too
  withAlpha(pr(t, 60.8, 61.3), () => card(1420, 200, 290, 560, 30, 'rgba(255,255,255,.92)', { border: '#9BC8EE', bw: 3 }));
  withAlpha(pr(t, 61, 61.6), () => {
    [0, 1, 2].forEach((i, k) => {
      const s = pop(t, 61 + k * .35);
      scaled(1560 - k * 0, 300 + k * 170, s, () => { paper(i, 1500, 240 + k * 170, 120, 120); chip(PAPERS[i].name, 1560, 390 + k * 170, 22, '#FFFFFF', '#2C2A5A'); });
    });
    
  });
}

function scene3c(t) { // 64-76 pour 50 mL
  lab(t, { teacher: () => teacher(260, 830, .85, t, { arm: 'point' }) });
  header(t, 64, 76, 2, 'أضيف الماء');
  const level = 50 * eio(pr(t, 65.6, 69.4));
  const cx = 1080, base = 860, ch = 640;
  const tilt = eio(pr(t, 64.8, 65.6)) * (1 - eio(pr(t, 69.4, 70.2)));
  // jug
  const jx = lerp(1420, 1303, tilt), jy = lerp(560, 92, tilt);
  const jang = -tilt * 1.6, spx = jx + (-92 * Math.cos(jang) + 196 * Math.sin(jang)), spy = jy + (-92 * Math.sin(jang) - 196 * Math.cos(jang));
  const pouring = t > 65.6 && t < 69.4;
  const lvlY = cylinder(cx, base, 150, ch, level, { t, wobble: pouring ? 4 : (t < 71 ? 2 * (1 - pr(t, 69.4, 71)) : 0), numSize: 22 });
  if (pouring) {
    ctx.save(); ctx.strokeStyle = 'rgba(70,160,230,.8)'; ctx.lineWidth = 16 + Math.sin(t * 20) * 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(spx, spy); ctx.quadraticCurveTo(spx - 15, spy + 40, 1085 + Math.sin(t * 15) * 3, lvlY); ctx.stroke(); ctx.restore();
    for (let i = 0; i < 5; i++) { const ph = (t * 2 + i / 5) % 1; ctx.beginPath(); ctx.arc(1080 + (hash(i) - .5) * 70, lvlY - ph * 30, 5 * (1 - ph), 0, 7); ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.fill(); }
  }
  beaker(jx, jy, 1.0, jang, .8 - .45 * pr(t, 65.6, 69.4));
  // level label
  withAlpha(pr(t, 69.4, 70), () => {
    arrow(cx - 260, lvlY, cx - 90, lvlY, '#1E7FD8', 6, 22);
    chip('٥٠ مل', cx - 340, lvlY, 40, '#1E7FD8', '#FFFFFF');
  });
  // eye-level magnifier
  const m = pop(t, 70.6, .6);
  if (m > 0) {
    const mx = 1560, my = 420, R = 190;
    ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = '#7C6BD6'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(cx + 80, lvlY); ctx.lineTo(mx - R * m, my); ctx.stroke(); ctx.restore();
    scaled(mx, my, m, () => {
      ctx.save(); ctx.beginPath(); ctx.arc(mx, my, R, 0, 7); ctx.fillStyle = '#EEF7FF'; ctx.fill(); ctx.clip();
      // zoomed scale
      ctx.translate(mx, my); ctx.scale(3, 3); ctx.translate(-cx, -lvlY);
      cylinder(cx, base, 150, ch, 50, { t, numSize: 22 });
      ctx.restore();
      ctx.lineWidth = 14; ctx.strokeStyle = '#7C6BD6'; ctx.beginPath(); ctx.arc(mx, my, R, 0, 7); ctx.stroke();
      ctx.lineCap = 'round'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(mx + R * .72, my + R * .72); ctx.lineTo(mx + R * 1.05, my + R * 1.05); ctx.stroke();
      // eye line
      ctx.save(); ctx.setLineDash([14, 10]); ctx.strokeStyle = '#E8505B'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(mx - R, my); ctx.lineTo(mx + R, my); ctx.stroke(); ctx.restore();
    });
    withAlpha(pr(t, 71.2, 71.8), () => chip('اقرئي التدريج بمستوى العين', mx, my - R - 50, 30, '#7C6BD6', '#FFFFFF'));
  }
}

function fibreMagnifier(t, x, y, R, a0, label) {
  const m = pop(t, a0, .6);
  if (m <= 0) return;
  scaled(x, y, m, () => {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.fillStyle = '#FBF8F2'; ctx.fill(); ctx.clip();
    // fibres
    for (let i = 0; i < 26; i++) {
      ctx.strokeStyle = i % 3 ? 'rgba(200,190,170,.95)' : 'rgba(225,215,195,.95)'; ctx.lineWidth = 10 + hash(i) * 6; ctx.lineCap = 'round';
      const y0 = y - R + hash(i + 1) * 2 * R, ang = (hash(i + 2) - .5) * 1.4;
      ctx.beginPath(); ctx.moveTo(x - R - 20, y0); ctx.bezierCurveTo(x - R / 2, y0 + Math.sin(ang) * 120, x + R / 2, y0 - Math.sin(ang) * 120, x + R + 20, y0 + ang * 60); ctx.stroke();
    }
    // water molecules creeping upward through gaps
    for (let i = 0; i < 40; i++) {
      const sp = .18 + hash(i + 7) * .12;
      const ph = (t * sp + hash(i)) % 1;
      const px = x - R + hash(i + 11) * 2 * R + Math.sin(t * 2 + i) * 14;
      const py = y + R - ph * 2 * R;
      drop(px, py, 9, '#2F8FE0', Math.sin(ph * Math.PI));
    }
    ctx.restore();
    ctx.lineWidth = 12; ctx.strokeStyle = '#4FA3E0'; ctx.beginPath(); ctx.arc(x, y, R, 0, 7); ctx.stroke();
    arrow(x - R - 40, y + 80, x - R - 40, y - 80, '#1E7FD8', 8, 24);
  });
  withAlpha(pr(t, a0 + .4, a0 + .9), () => chip(label, x, y + R + 50, 30, '#1E7FD8', '#FFFFFF'));
}

function scene3d(t) { // 76-92 dip 1 minute
  lab(t);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(0, 0, W, H);
  header(t, 76, 92, 2, 'أضيف الماء');
  const cx = 1000, base = 860, ch = 620;
  const dip = eio(pr(t, 76.8, 78.6));
  const wet = eout(pr(t, 78.6, 90));
  const pY = lerp(-380, 360, dip);
  cylinder(cx, base, 150, ch, 50 - 1.5 * wet, {
    t, wobble: t < 79.5 ? 3 * (1 - pr(t, 78.6, 79.5)) : 0, numSize: 22,
    paper: { i: 0, x: cx - 45, y: pY, w: 90, h: 420, wet: clamp(wet * 1.05) }
  });
  // clip & hanger above
  ctx.fillStyle = '#9AA6B5'; ctx.fillRect(cx - 50, pY - 14, 100, 16);
  ctx.strokeStyle = '#9AA6B5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, pY - 14); ctx.lineTo(cx, pY - 600); ctx.stroke();
  // stopwatch
  const sec = 60 * pr(t, 78.6, 90);
  const sw = pop(t, 77.0);
  scaled(1500, 380, sw, () => {
    stopwatch(1500, 380, 150, sec, { label: true });
  });
  withAlpha(pr(t, 77.6, 78.2), () => {
    chip('دقيقة واحدة', 1500, 610, 34, '#E8505B', '#FFFFFF');
    txt('(الزمن مُسرَّع في الفيديو)', 1500, 680, 26, '#6A6A8A', { w: 600 });
  });
  withAlpha(pr(t, 90, 90.5), () => check(1640, 250, 1.1));
  fibreMagnifier(t, 470, 400, 210, 83.6, 'الماء يتسلّل بين الألياف');
  if (t > 83.6) withAlpha(pr(t, 84, 84.6), () => { ctx.save(); ctx.setLineDash([10, 10]); ctx.strokeStyle = '#4FA3E0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(680, 420); ctx.lineTo(cx - 50, 640); ctx.stroke(); ctx.restore(); });
}

function scene3e(t) { // 92-106 lift, drip, record
  lab(t);
  ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(0, 0, W, H);
  if (t < 98.6) header(t, 92, 98.6, 3, 'أُخرج الورق'); else header(t, 98.6, 106, 4, 'أسجّل النتائج');
  const cx = 1000, base = 860, ch = 620;
  const lift = eio(pr(t, 92.6, 95));
  const pY = lerp(360, -40, lift);
  const level = lerp(48.5, 9.4, eio(pr(t, 92.8, 95))) + .6 * pr(t, 95, 98);
  const lvlY = cylinder(cx, base, 150, ch, level, {
    t, wobble: t > 92.6 && t < 98.5 ? 2 : 0, numSize: 22,
    paper: { i: 0, x: cx - 45, y: pY, w: 90, h: 420, wet: 1 }
  });
  ctx.fillStyle = '#9AA6B5'; ctx.fillRect(cx - 50, pY - 14, 100, 16);
  ctx.strokeStyle = '#9AA6B5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, pY - 14); ctx.lineTo(cx, -10); ctx.stroke();
  // drips with decreasing frequency, stop at ~98
  if (t > 94.6) {
    for (let k = 0; k < 14; k++) {
      const tb = 94.6 + 3.4 * Math.pow(k / 14, 1.6);
      const age = t - tb;
      if (age < 0 || age > .9) continue;
      const yy = pY + 420 + 400 * age * age * 2;
      if (yy < lvlY) drop(cx + (hash(k) - .5) * 50, yy, 11);
    }
  }
  withAlpha(pr(t, 97.9, 98.4), () => { chip('توقّف التقاطر', 1420, 300, 32, '#2E9E5B', '#FFFFFF'); check(1610, 300, .9); });
  // reading + record
  if (t > 98.8) {
    withAlpha(pr(t, 98.8, 99.4), () => { arrow(cx - 260, lvlY, cx - 90, lvlY, '#1E7FD8', 6, 22); chip('المتبقي: ١٠ مل', cx - 380, lvlY, 36, '#1E7FD8', '#FFFFFF'); });
    const k = pop(t, 100.2, .6);
    scaled(1480, 600, k, () => {
      card(1180, 440, 620, 330, 26, '#FFFFFF', { border: '#9BC8EE', bw: 4 });
      ctx.fillStyle = '#E8F3FC'; rr(1180, 440, 620, 70, [26, 26, 0, 0]); ctx.fill();
      txt('بطاقة التسجيل', 1490, 476, 34, '#1E5FA8', { w: 900 });
      txt('مناشف ورقية من الألياف', 1490, 545, 30, '#2C2A5A', { w: 800 });
      const rows = [['المستوى الأول', '٥٠ مل', 101], ['المستوى النهائي', '١٠ مل', 101.8], ['الكمية الممتصة', '٥٠ − ١٠ = ٤٠ مل', 102.8]];
      rows.forEach(([a, b, tt], i) => withAlpha(pr(t, tt, tt + .4), () => {
        txt(a, 1770, 610 + i * 52, 28, '#555577', { w: 700, align: 'right' });
        txt(b, 1210, 610 + i * 52, 30, i === 2 ? '#1E7FD8' : '#2C2A5A', { w: 800, align: 'left' });
      }));
    });
    withAlpha(pr(t, 103.2, 103.8), () => hypoBadge(t, 103.2, 1490, 830));
  }
}

function scene3f(t) { // 106-124 repeat x4
  lab(t, { teacher: () => teacher(170, 830, .72, t, { arm: 'point' }) });
  const xs = [1640, 1310, 980, 650];
  const dip = eio(pr(t, 107.2, 108.6));
  const soak = eout(pr(t, 108.6, 113.2));
  const lift = eio(pr(t, 113.6, 115.6));
  const sec = 60 * pr(t, 108.6, 113.2);
  PAPERS.forEach((p, i) => {
    const appear = pop(t, 106.3 + i * .25);
    scaled(xs[i], 860, appear, () => {
      const pY = lerp(-350, 400, dip) - lift * 420;
      const lvl = lerp(50, p.final, eio(pr(t, 113.8, 115.8)));
      const wetMax = [1, .85, .55, .25][i];
      const lvlY = cylinder(xs[i], 860, 120, 560, lvl, {
        t, numSize: 18,
        paper: { i, x: xs[i] - 36, y: pY, w: 72, h: 330, wet: soak * wetMax },
      });
      ctx.fillStyle = '#9AA6B5'; ctx.fillRect(xs[i] - 40, pY - 12, 80, 14);
      ctx.strokeStyle = '#9AA6B5'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xs[i], pY - 12); ctx.lineTo(xs[i], -10); ctx.stroke();
      // drips proportional to absorption
      const nd = [10, 7, 4, 1][i];
      for (let k = 0; k < nd; k++) {
        const tb = 115.4 + 2.6 * Math.pow(k / nd, 1.5), age = t - tb;
        if (age > 0 && age < .8) { const yy = pY + 330 + 380 * age * age * 2; if (yy < lvlY) drop(xs[i] + (hash(k + i * 9) - .5) * 30, yy, 8); }
      }
      withAlpha(pr(t, 116.5 + i * .4, 117 + i * .4), () => chip('المتبقي: ' + ar(p.final) + ' مل', xs[i], lvlY - 50 > 330 ? lvlY - 48 : 330, 24, '#1E7FD8', '#FFFFFF'));
    });
    withAlpha(appear, () => chip(p.name, xs[i], 925, 24, '#FFFFFF', '#2C2A5A', { border: p.bar }));
  });
  scaled(400, 230, pop(t, 107.6) * (1 - pr(t, 114, 114.5)), () => stopwatch(400, 230, 90, sec, { label: true }));
  header(t, 106, 124, 0, 'نكرّر التجربة', '#3E9E52');
  if (t > 118.6) hypoBadge(t, 118.6, 960, 140);
}

function scene4(t) { // 124-152 results
  lab(t);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(0, 0, W, H);
  header(t, 124, 152, 0, 'النتائج', '#7B5CC9');
  hypoBadge(t, 124.6, 900, 70);
  const tableOut = eio(pr(t, 137.6, 138.6));
  // table
  if (tableOut < 1) {
    const ty = 190 - tableOut * 900;
    withAlpha(pop(t, 125.2), () => {
      const X = 230, Wd = 1460, rh = 92;
      const cols = [['نوع الورق', 470], ['المستوى الأول (مل)', 320], ['المستوى النهائي (مل)', 330], ['الكمية الممتصة (مل)', 340]];
      card(X, ty, Wd, rh * 5 + 10, 26, '#FFFFFF', { border: '#B7A6EA', bw: 4 });
      ctx.fillStyle = '#7B5CC9'; rr(X, ty, Wd, rh, [26, 26, 0, 0]); ctx.fill();
      let cx = X + Wd;
      const colX = [];
      cols.forEach(([c, w]) => { colX.push(cx - w / 2); txt(c, cx - w / 2, ty + rh / 2, 28, '#FFFFFF', { w: 800 }); cx -= w; });
      PAPERS.forEach((p, i) => {
        const ry = ty + rh * (i + 1);
        if (i % 2 === 0) { ctx.fillStyle = '#F5F1FF'; ctx.fillRect(X + 4, ry, Wd - 8, rh); }
        const ra = pr(t, 126 + i * .5, 126.4 + i * .5);
        withAlpha(ra, () => {
          txt(p.name, colX[0], ry + rh / 2, 30, '#2C2A5A', { w: 700 });
          txt('٥٠', colX[1], ry + rh / 2, 32, '#2C2A5A', { w: 700 });
          txt(ar(p.final), colX[2], ry + rh / 2, 32, '#2C2A5A', { w: 700 });
        });
        withAlpha(pr(t, 132.4 + i * 1.2, 132.9 + i * 1.2), () => {
          scaled(colX[3], ry + rh / 2, pop(t, 132.4 + i * 1.2), () => txt(ar(p.absorb), colX[3], ry + rh / 2, 40, '#1E7FD8', { w: 900 }));
        });
      });
      withAlpha(pr(t, 131.6, 132.2), () => {
        card(560, ty + rh * 5 + 50, 800, 80, 40, '#E8F3FC', { border: '#4FA3E0', bw: 3 });
        txt('الماء الممتص = المستوى الأول − المستوى النهائي', 960, ty + rh * 5 + 92, 32, '#1E5FA8', { w: 800 });
      });
    });
  }
  // bar chart
  if (t > 138) {
    lab; // noop
    const appear = pr(t, 138, 138.8);
    withAlpha(appear, () => {
      teacher(1730, 900, .7, t, { arm: 'point' });
      const X0 = 230, X1 = 1450, Y0 = 700, Y1 = 290;
      card(150, 170, 1380, 660, 30, 'rgba(255,255,255,.92)', { border: '#D8CDF7', bw: 3 });
      // axes
      ctx.strokeStyle = '#8C88B0'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(X1, Y1 - 20); ctx.lineTo(X1, Y0); ctx.lineTo(X0, Y0); ctx.stroke();
      for (let v = 0; v <= 50; v += 10) {
        const yy = Y0 - (Y0 - Y1) * v / 50;
        ctx.strokeStyle = 'rgba(140,136,176,.25)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, yy); ctx.lineTo(X1, yy); ctx.stroke();
        txt(ar(v), X1 + 35, yy, 26, '#5A5680', { w: 700 });
      }
      txt('كمية الماء الممتص (مل)', 840, 215, 32, '#4A3E8C', { w: 800 });
      const bxs = [1300, 1020, 740, 460];
      PAPERS.forEach((p, i) => {
        const g = eout(pr(t, 139 + i * 1.6, 140.4 + i * 1.6));
        const v = p.absorb * g, hh = (Y0 - Y1) * v / 50, bw = 170;
        const bx = bxs[i] - bw / 2;
        // 3D bar
        const grd = ctx.createLinearGradient(bx, 0, bx + bw, 0); grd.addColorStop(0, p.bar); grd.addColorStop(.5, '#FFFFFF'); grd.addColorStop(.55, p.bar); grd.addColorStop(1, p.bar);
        ctx.save(); ctx.shadowColor = 'rgba(60,60,120,.25)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
        ctx.globalAlpha *= .95; rr(bx, Y0 - hh, bw, hh, [16, 16, 0, 0]); ctx.fillStyle = p.bar; ctx.fill(); ctx.restore();
        ctx.save(); rr(bx, Y0 - hh, bw, hh, [16, 16, 0, 0]); ctx.clip();
        const gl = ctx.createLinearGradient(bx, 0, bx + bw, 0); gl.addColorStop(0, 'rgba(255,255,255,.0)'); gl.addColorStop(.3, 'rgba(255,255,255,.45)'); gl.addColorStop(.5, 'rgba(255,255,255,0)');
        ctx.fillStyle = gl; ctx.fillRect(bx, Y0 - hh, bw, hh); ctx.restore();
        if (g > 0) txt(ar(Math.round(v)) + ' مل', bxs[i], Y0 - hh - 32, 34, '#2C2A5A', { w: 900 });
        const lines = wrap(p.name, 230, 26);
        lines.forEach((l, k) => txt(l, bxs[i], Y0 + 40 + k * 36, 26, '#2C2A5A', { w: 700 }));
      });
      // most absorbent
      const s = pop(t, 146.2);
      scaled(1300, 230, s, () => { chip('الأكثر امتصاصًا', 1300, 230, 26, '#2E9E5B', '#FFFFFF'); sparkle(1170, 220, 16, '#FFD54F', t * 2); sparkle(1430, 230, 13, '#FFD54F', t * 2 + 1); });
      const s2 = pop(t, 147.2);
      scaled(460, 560, s2, () => chip('الأقل امتصاصًا', 460, 560, 26, '#E8505B', '#FFFFFF'));
    });
  }
}

// --- digestive system diagram ---
const DC = { cx: 760 };
function colonPts(cx) {
  return [[cx - 150, 850], [cx - 155, 760], [cx - 160, 660], [cx - 130, 605], [cx - 40, 590], [cx + 60, 592], [cx + 140, 605], [cx + 165, 670], [cx + 160, 770], [cx + 150, 840], [cx + 90, 880], [cx + 20, 880], [cx + 10, 940]];
}
function smoothPath(pts) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); }
  const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]);
}
function digestive(t, cx, hl) {
  // body silhouette
  ctx.save();
  let bg = ctx.createLinearGradient(cx - 260, 0, cx + 260, 0); bg.addColorStop(0, '#FFE3D3'); bg.addColorStop(.5, '#FFF0E6'); bg.addColorStop(1, '#FBD9C6');
  ctx.fillStyle = bg; ctx.shadowColor = 'rgba(120,80,80,.2)'; ctx.shadowBlur = 30;
  ctx.beginPath(); ctx.arc(cx, 170, 92, 0, 7); ctx.fill();
  ctx.fillRect(cx - 40, 240, 80, 60);
  rr(cx - 260, 290, 520, 720, [150, 150, 60, 60]); ctx.fill();
  ctx.restore();
  // face
  ctx.fillStyle = '#5A3A2A'; ctx.beginPath(); ctx.arc(cx - 30, 160, 8, 0, 7); ctx.arc(cx + 30, 160, 8, 0, 7); ctx.fill();
  ctx.strokeStyle = '#C9706A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cx, 195, 22, .3, Math.PI - .3); ctx.stroke();
  // esophagus
  ctx.strokeStyle = '#F29BB0'; ctx.lineWidth = 22; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx, 215); ctx.bezierCurveTo(cx, 300, cx + 10, 380, cx + 30, 440); ctx.stroke();
  // stomach
  let sg = ctx.createRadialGradient(cx + 60, 480, 10, cx + 70, 500, 120); sg.addColorStop(0, '#FFC4D2'); sg.addColorStop(1, '#EE8AA5');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(cx + 20, 440);
  ctx.bezierCurveTo(cx + 160, 400, cx + 200, 500, cx + 150, 545); ctx.bezierCurveTo(cx + 100, 590, cx - 10, 580, cx - 30, 545);
  ctx.bezierCurveTo(cx - 10, 530, cx + 60, 540, cx + 70, 500); ctx.bezierCurveTo(cx + 70, 470, cx + 40, 460, cx + 20, 440); ctx.fill();
  // large intestine
  const pts = colonPts(cx);
  const glow = hl ? .5 + .5 * Math.sin(t * 5) : 0;
  if (hl) { ctx.save(); ctx.shadowColor = `rgba(255,200,60,${.6 + glow * .4})`; ctx.shadowBlur = 40; ctx.strokeStyle = 'rgba(255,215,90,.9)'; ctx.lineWidth = 70; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; smoothPath(pts); ctx.stroke(); ctx.restore(); }
  ctx.strokeStyle = '#D98E6B'; ctx.lineWidth = 54; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; smoothPath(pts); ctx.stroke();
  ctx.strokeStyle = '#EBAA87'; ctx.lineWidth = 38; smoothPath(pts); ctx.stroke();
  // haustra marks
  ctx.strokeStyle = 'rgba(170,95,70,.55)'; ctx.lineWidth = 3;
  for (let i = 0; i < pts.length - 2; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    for (let k = 0; k < 2; k++) {
      const px = lerp(x1, x2, k / 2 + .25), py = lerp(y1, y2, k / 2 + .25), a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(px - Math.cos(a) * 20, py - Math.sin(a) * 20); ctx.lineTo(px + Math.cos(a) * 20, py + Math.sin(a) * 20); ctx.stroke();
    }
  }
  // small intestine coil
  ctx.strokeStyle = '#F7A99B'; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(cx + 120, 560);
  let dir = -1;
  for (let r = 0; r < 5; r++) {
    const y = 650 + r * 42;
    for (let k = 0; k <= 10; k++) { const x = cx + dir * (-95 + 190 * k / 10); ctx.lineTo(x, y + Math.sin(k * 1.2) * 10); }
    dir *= -1;
  }
  ctx.stroke();
  ctx.strokeStyle = '#FFC7BC'; ctx.lineWidth = 8; ctx.stroke();
}
function organLabels(t, cx, a0) {
  const L = [
    ['المريء', cx + 10, 330, 1200, 330, '#E57399'],
    ['المعدة', cx + 120, 490, 1200, 470, '#E57399'],
    ['الأمعاء الدقيقة', cx + 60, 720, 1200, 610, '#E9806E'],
    ['الأمعاء الغليظة', cx + 160, 760, 1200, 750, '#B4643E'],
  ];
  L.forEach(([s, ox, oy, lx, ly, c], i) => {
    const a = pr(t, a0 + i * 1.5, a0 + i * 1.5 + .5);
    if (a <= 0) return;
    withAlpha(a, () => {
      ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(lx - 10, ly); ctx.stroke();
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(ox, oy, 8, 0, 7); ctx.fill();
      const w = measure(s, 36, 800) + 50;
      scaled(lx + w / 2, ly, back(a), () => chip(s, lx + w / 2, ly, 36, i === 3 ? '#B4643E' : '#FFFFFF', i === 3 ? '#FFFFFF' : '#2C2A5A', { border: c }));
    });
  });
}

function crossSection(t, t0) {
  const tt = t - t0;
  const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#FDE7EC'); bg.addColorStop(1, '#F9DCE6');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const topWallY = 300, botWallY = 720, wallT = 95;
  // blood vessels
  for (const vy of [190, 860]) {
    let vg = ctx.createLinearGradient(0, vy - 34, 0, vy + 34); vg.addColorStop(0, '#E57373'); vg.addColorStop(.5, '#F7A1A1'); vg.addColorStop(1, '#C94F4F');
    ctx.fillStyle = vg; rr(-20, vy - 34, W + 40, 68, 34); ctx.fill();
    for (let i = 0; i < 14; i++) { const x = ((i * 150 - tt * 120) % (W + 150) + W + 150) % (W + 150) - 75; ctx.fillStyle = 'rgba(200,40,60,.55)'; ctx.beginPath(); ctx.ellipse(x, vy + Math.sin(i) * 10, 18, 11, 0, 0, 7); ctx.fill(); }
  }
  // walls
  for (const [wy, dirn] of [[topWallY, 1], [botWallY, -1]]) {
    let wg = ctx.createLinearGradient(0, wy - wallT, 0, wy + wallT); wg.addColorStop(0, '#F3A3B4'); wg.addColorStop(.5, '#F7BCC7'); wg.addColorStop(1, '#EE96A9');
    ctx.fillStyle = wg;
    const y0 = dirn > 0 ? wy - wallT : wy, y1 = dirn > 0 ? wy : wy + wallT;
    ctx.fillRect(0, y0, W, wallT);
    // cell outlines
    ctx.strokeStyle = 'rgba(200,90,120,.35)'; ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 46) { ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.fillStyle = 'rgba(190,80,120,.35)'; ctx.beginPath(); ctx.arc(x + 23, (y0 + y1) / 2, 7, 0, 7); ctx.fill(); }
    // inner fold bumps
    ctx.fillStyle = '#F7BCC7';
    for (let x = 0; x < W + 200; x += 200) { ctx.beginPath(); ctx.ellipse(x, wy, 110, 22, 0, dirn > 0 ? 0 : Math.PI, dirn > 0 ? Math.PI : Math.PI * 2); ctx.fill(); }
  }
  // lumen
  const lum = ctx.createLinearGradient(0, topWallY, 0, botWallY); lum.addColorStop(0, '#FFF6EE'); lum.addColorStop(1, '#FBEBDD');
  ctx.fillStyle = lum; ctx.fillRect(0, topWallY + 20, W, botWallY - topWallY - 40);
  // food remains moving right -> left
  const N = 7, sp = 120;
  const blobs = [];
  for (let i = 0; i < N; i++) {
    const x = 2100 - ((tt * sp + i * 330) % 2400);
    const d = clamp(1 - (x - (-100)) / 2100); // dryness 0 at right, 1 at left
    blobs.push({ x, y: 510 + Math.sin(i * 2.3) * 60, d, i });
  }
  for (const b of blobs) {
    const r = lerp(78, 52, b.d);
    const col = `rgb(${Math.round(lerp(205, 120, b.d))},${Math.round(lerp(165, 78, b.d))},${Math.round(lerp(110, 45, b.d))})`;
    ctx.save(); ctx.translate(b.x, b.y);
    ctx.fillStyle = col; ctx.beginPath();
    for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 2; const rr2 = r * (1 + (1 - b.d) * .12 * Math.sin(a * 3 + tt * 3 + b.i) + .06 * Math.sin(a * 5 + b.i)); ctx.lineTo(Math.cos(a) * rr2 * 1.25, Math.sin(a) * rr2); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.beginPath(); ctx.ellipse(-r * .4, -r * .4, r * .35, r * .18, -.4, 0, 7); ctx.fill();
    // water inside the remains
    const nw = Math.round(8 * (1 - b.d));
    for (let k = 0; k < nw; k++) drop(Math.cos(k * 2.1 + b.i) * r * .7, Math.sin(k * 1.7 + b.i) * r * .55 + 6, 8, '#3FA4E8');
    ctx.restore();
  }
  // water droplets leaving through the wall into blood
  for (let i = 0; i < 46; i++) {
    const period = 3.2, tb = (hash(i) * period);
    const age = ((tt - tb) % period + period) % period;
    const cycle = Math.floor((tt - tb) / period);
    if (tt - tb < 0) continue;
    const sx = 300 + hash(i * 3 + cycle * 7) * 1500;
    const up = (i + cycle) % 2 === 0;
    const sy = 510 + (up ? -40 : 40);
    const ty = up ? 190 : 860;
    const p1 = clamp(age / 2.0);
    let x = sx - age * 30, y = lerp(sy, ty, eio(p1));
    if (age > 2.0) x -= (age - 2.0) * 220;
    const a = Math.min(clamp(age / .3), 1 - clamp((age - 2.6) / .6));
    drop(x, y, 12, '#2F8FE0', a);
  }
  // labels
  const L = (a, fn) => withAlpha(pr(t, a, a + .5), fn);
  L(t0 + .3, () => chip('الأمعاء الغليظة (مقطع مكبَّر)', 960, 60, 34, '#B4643E', '#FFFFFF'));
  L(t0 + 1.5, () => { chip('بقايا طعام بها ماء كثير', 1620, 420, 28, '#FFFFFF', '#5A3A1A', { border: '#D8A46B' }); });
  L(t0 + 2.5, () => { arrow(1100, 640, 820, 640, '#8C6A4A', 6, 20); txt('اتجاه الحركة', 960, 680, 26, '#8C6A4A', { w: 800 }); });
  L(t0 + 4.5, () => { chip('جدار الأمعاء', 1500, 285, 28, '#FFFFFF', '#B0405E', { border: '#E57399' }); });
  L(t0 + 6.5, () => { chip('الماء يُمتص إلى الدم ثم إلى الجسم', 960, 190, 30, '#2F8FE0', '#FFFFFF'); });
  L(t0 + 7.5, () => { chip('الأوعية الدموية', 1700, 860, 26, '#FFFFFF', '#B23A48', { border: '#E57373' }); });
  L(t0 + 12.6, () => { chip('فضلات أكثر صلابة (ماء أقل)', 330, 420, 28, '#7A4E2D', '#FFFFFF'); });
}

function modelNote(t, a) {
  const s = pop(t, a, .6);
  scaled(960, 520, s, () => {
    card(250, 190, 1420, 640, 40, 'rgba(255,255,255,.96)', { border: '#B7A6EA', bw: 5 });
    txt('نموذج مبسَّط', 960, 260, 50, '#4A3E8C', { w: 900 });
    // paper icon
    paper(0, 1300, 320, 160, 200, .7, { t });
    for (let i = 0; i < 4; i++) drop(1340 + i * 26, 360 + Math.sin(t * 3 + i) * 10, 10);
    txt('الورق', 1380, 560, 34, '#2C2A5A', { w: 800 });
    txt('≈', 960, 420, 90, '#7B5CC9', { w: 900 });
    // intestine icon
    ctx.save(); ctx.translate(540, 420); ctx.scale(.75, .75); ctx.translate(-760, -740);
    ctx.strokeStyle = '#D98E6B'; ctx.lineWidth = 54; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; smoothPath(colonPts(760)); ctx.stroke();
    ctx.strokeStyle = '#EBAA87'; ctx.lineWidth = 38; smoothPath(colonPts(760)); ctx.stroke();
    ctx.restore();
    txt('الأمعاء الغليظة', 540, 560, 34, '#2C2A5A', { w: 800 });
    withAlpha(pr(t, a + 1.2, a + 1.7), () => { check(1500, 650, .9); txt('يشبهها في: امتصاص الماء', 1150, 652, 36, '#2E7D4F', { w: 800 }); });
    withAlpha(pr(t, a + 3.4, a + 3.9), () => { cross(1500, 750, .9); txt('ويختلف عنها في: التركيب وطريقة العمل', 1060, 752, 36, '#B23A48', { w: 800 }); });
  });
}

function scene5(t) { // 152-196
  if (t < 158.2) {
    // wet paper towel, then morph toward body
    lab(t);
    ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(0, 0, W, H);
    header(t, 152, 196, 0, 'الربط بجسم الإنسان', '#D0607E');
    const m = eio(pr(t, 156.2, 158.2));
    const k = pop(t, 152.4);
    scaled(960, 470, k * lerp(1, .2, m), () => {
      ctx.save(); ctx.translate(lerp(960, 760, m) - 960 * (1 - 1), 0); ctx.restore();
      paper(0, 810, 290, 300, 360, .8, { t });
      for (let i = 0; i < 6; i++) { const ph = (t * .8 + i / 6) % 1; drop(840 + i * 45, 300 - ph * 0 + 360 + ph * 120, 12, '#3FA4E8', 1 - ph); }
    });
    withAlpha(pop(t, 153.4) * (1 - m), () => { txt('؟', 1300, 380, 160, '#D0607E', { w: 900, stroke: '#FFFFFF', sw: 14 }); txt('؟', 600, 330, 110, '#8E5BD6', { w: 900, stroke: '#FFFFFF', sw: 12 }); });
    withAlpha(m, () => { ctx.fillStyle = '#FDF1F5'; ctx.fillRect(0, 0, W, H); scaled(760, 120, .86, () => digestive(t, 760, false)); });
    return;
  }
  if (t < 171.2) {
    const zoom = eio(pr(t, 167.6, 171.2));
    ctx.fillStyle = '#FDF1F5'; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 12; i++) { ctx.fillStyle = 'rgba(240,180,200,.25)'; ctx.beginPath(); ctx.arc(hash(i) * W, hash(i + 4) * H, 40 + hash(i + 8) * 80, 0, 7); ctx.fill(); }
    const fx = 622, fy = 619;
    const s = lerp(1, 6, zoom * zoom);
    ctx.save(); ctx.translate(lerp(0, 960 - fx * s, 1) * zoom + 0, 0);
    ctx.restore();
    ctx.save();
    ctx.translate(lerp(0, 960, zoom), lerp(0, 540, zoom)); ctx.scale(s, s); ctx.translate(-lerp(0, fx, zoom), -lerp(0, fy, zoom));
    scaled(760, 120, .86, () => { digestive(t, 760, t > 163.4); withAlpha(1 - zoom * 3, () => organLabels(t, 760, 158.6)); });
    ctx.restore();
    if (t < 167.6) teacher(1650, 1000, .8, t, { arm: 'point' });
    header(t, 152, 196, 0, 'الربط بجسم الإنسان', '#D0607E');
    withAlpha(pr(t, 170.0, 171.2), () => crossSection(t, 170.0));
    return;
  }
  crossSection(t, 170.0);
  header(t, 152, 196, 0, 'الربط بجسم الإنسان', '#D0607E');
  if (t > 186.2) {
    withAlpha(pr(t, 186.2, 186.8), () => { ctx.fillStyle = 'rgba(255,245,250,.75)'; ctx.fillRect(0, 0, W, H); });
    modelNote(t, 186.4);
  }
}

function scene6(t) { // 196-216 conclude
  lab(t, { teacher: () => teacher(1620, 830, .95, t, { arm: t < 207 ? 'up' : 'point', talk: isTalking(t) }) });
  ctx.fillStyle = 'rgba(255,250,235,.45)'; ctx.fillRect(0, 0, W, H);
  header(t, 196, 216, 0, 'أستنتج', '#E39B1B');
  const q = pop(t, 196.6);
  scaled(760, 250, q, () => {
    card(170, 150, 1180, 200, 40, '#FFF8E1', { border: '#F2C14E', bw: 5 });
    // bulb
    ctx.save(); ctx.translate(1270, 245);
    const gl = .5 + .5 * Math.sin(t * 4);
    ctx.fillStyle = `rgba(255,220,80,${.3 + .3 * gl})`; ctx.beginPath(); ctx.arc(0, -10, 62, 0, 7); ctx.fill();
    ctx.fillStyle = '#FFD54F'; ctx.beginPath(); ctx.arc(0, -15, 40, 0, 7); ctx.fill();
    ctx.fillStyle = '#9AA6B5'; ctx.fillRect(-18, 22, 36, 26); ctx.restore();
    const ls = wrap('كيف تساعد الأمعاء الغليظة على عملية الهضم؟', 900, 50);
    ls.forEach((l, i) => txt(l, 690, 250 - (ls.length - 1) * 33 + i * 66, 50, '#5A3B00', { w: 900 }));
  });
  // 5-second countdown 202-207
  if (t > 201.9 && t < 207.4) {
    const c = 5 - Math.floor(t - 202);
    const fr = (t - 202) % 1;
    const p = pr(t, 202, 207);
    withAlpha(Math.min(pr(t, 201.9, 202.3), 1 - pr(t, 207, 207.4)), () => {
      ctx.lineWidth = 22; ctx.strokeStyle = '#EDE6FA'; ctx.beginPath(); ctx.arc(760, 590, 140, 0, 7); ctx.stroke();
      ctx.strokeStyle = '#8E5BD6'; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(760, 590, 140, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - p)); ctx.stroke();
      ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(760, 590, 125, 0, 7); ctx.fill();
      if (c >= 1) scaled(760, 590, 1 + .25 * (1 - eout(fr * 3)), () => txt(ar(c), 760, 598, 130, '#8E5BD6', { w: 900 }));
      txt('فكّري…', 760, 800, 46, '#8E5BD6', { w: 800 });
    });
  }
  // answer
  const a = pop(t, 207.4, .7);
  scaled(760, 590, a, () => {
    card(150, 430, 1220, 330, 40, '#E9F8EE', { border: '#3DAE6A', bw: 5 });
    check(1300, 500, 1.2);
    const ls = wrap('تمتص الأمعاء الغليظة الماء من بقايا الطعام، وتساعد على تكوين الفضلات الصلبة.', 900, 50);
    ls.forEach((l, i) => txt(l, 690, 600 - (ls.length - 1) * 37 + i * 74, 50, '#1F5E3A', { w: 900 }));
  });
  if (a > 0) for (let i = 0; i < 8; i++) { const ph = ((t - 207.4) * .7 + hash(i)) % 1; withAlpha(Math.sin(ph * Math.PI) * clamp(t - 207.4), () => sparkle(200 + hash(i + 2) * 1100, 760 - ph * 380, 14, ['#FFD54F', '#81D4FA', '#A5D6A7'][i % 3], t * 3 + i)); }
}

function scene7(t) { // 216-236 outro
  lab(t, { teacher: () => teacher(960, 830, 1.05, t, { arm: t < 228 ? 'wave' : 'rest' }) });
  // confetti
  for (let i = 0; i < 90; i++) {
    const sp = 120 + hash(i) * 160, x = hash(i + 1) * W + Math.sin(t * 2 + i) * 30;
    const y = ((t - 216) * sp + hash(i + 2) * H) % (H + 100) - 50;
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * 3 + i);
    ctx.fillStyle = ['#F48FB1', '#81D4FA', '#FFD54F', '#A5D6A7', '#CE93D8'][i % 5];
    ctx.fillRect(-9, -5, 18, 10); ctx.restore();
  }
  const s = pop(t, 216.4, .7) * (1 - pr(t, 228.6, 229.2));
  scaled(960, 150, s, () => txt('أحسنتنّ يا عالماتي!', 960, 150, 96, '#D0607E', { w: 900, stroke: '#FFFFFF', sw: 16 }));
  const s2 = pop(t, 222.6) * (1 - pr(t, 228.6, 229.2));
  scaled(960, 300, s2, () => {
    card(330, 250, 1260, 100, 50, '#FFFFFF', { border: '#4FA3E0', bw: 4 });
    drop(1530, 302, 16);
    txt('الأمعاء الغليظة تمتص الماء من بقايا الطعام', 930, 302, 44, '#1E5FA8', { w: 800 });
  });
  // credits
  const c = eio(pr(t, 229.2, 230.4));
  if (c > 0) {
    withAlpha(c, () => {
      ctx.fillStyle = 'rgba(250,246,255,.86)'; ctx.fillRect(0, 0, W, H);
      scaled(960, 520, back(pr(t, 229.4, 230.4)), () => {
        card(460, 300, 1000, 440, 50, '#FFFFFF', { border: '#E8C891', bw: 6 });
        atom(960, 390, 55, t);
        txt('مختبر العلوم', 960, 500, 96, '#173A7A', { w: 900 });
        ctx.fillStyle = '#F4C66B'; ctx.fillRect(700, 570, 520, 5);
        txt('إعداد المعلمة / شامه البقمي', 960, 640, 52, '#7B5CC9', { w: 800 });
      });
    });
    for (let i = 0; i < 8; i++) withAlpha(c, () => sparkle(960 + Math.cos(t + i * .8) * 560, 520 + Math.sin(t + i * .8) * 260, 16, ['#FFD54F', '#F48FB1', '#81D4FA'][i % 3], t * 2 + i));
  }
  // final fade
  withAlpha(pr(t, 235.0, 236), () => { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, W, H); });
}

const SCENES = [
  [0, 20, scene1], [20, 40, scene2], [40, 52, scene3a], [52, 64, scene3b], [64, 76, scene3c],
  [76, 92, scene3d], [92, 106, scene3e], [106, 124, scene3f], [124, 152, scene4], [152, 196, scene5],
  [196, 216, scene6], [216, 236.1, scene7],
];

window.render = function (t) {
  if (!BG) buildBG();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);
  for (const [a, b, fn] of SCENES) if (t >= a && t < b) { ctx.save(); fn(t); ctx.restore(); break; }
  // soft transition flash between scenes
  for (const [a] of SCENES) {
    const d = Math.abs(t - a);
    if (a > 0 && d < .45) { ctx.fillStyle = `rgba(252,248,255,${1 - d / .45})`; ctx.fillRect(0, 0, W, H); }
  }
  subtitles(t);
};
