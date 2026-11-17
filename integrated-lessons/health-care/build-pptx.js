const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const SKILL = '/root/.claude/skills/synced/eee5607a-cee3-4438-a82f-eabe29e012fc_ee537774-4764-45c3-bec0-37d9da460347/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');

const IMG = '/home/user/Scienceshamah/integrated-lessons/health-care/img/';
const OUT = '/home/user/Scienceshamah/integrated-lessons/health-care/درس-المحافظة-على-الصحة.pptx';
const im = n => IMG + n + '.jpg';
const SIG = 'أ/ شامه البقمي';

const THEME = {
  name: 'Nutrition Board', headFontFace: 'Arial', bodyFontFace: 'Arial',
  colors: { dk1: '43302C', lt1: 'FFFFFF', dk2: '7B1D2C', lt2: 'FBF7EF',
    accent1: '4E7A34', accent2: 'B14F68', accent3: '86AD5E', accent4: 'D98FA0',
    accent5: 'E7CFA8', accent6: 'B98E5B', hlink: '3F72B5', folHlink: '6B4FB3' } };

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5
pres.rtlMode = true;
pres.title = 'درس المحافظة على الصحة'; pres.author = SIG; pres.subject = 'العلوم - الصف الرابع الابتدائي';
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
const C = pres.SchemeColor;
const INK = C.text1, MAROON = C.text2, LEAF = C.accent1, ROSE = C.accent2, LEAFL = C.accent3, ROSEL = C.accent4, WOOD = C.accent5, WOODD = C.accent6, WHITE = C.background1, CREAM = C.background2;
// fixed category colours (the six food groups) and soft tints
const G = { carb: ['A9C8EF', '3F72B5'], prot: ['F4B4C4', 'B9466A'], fat: ['F4D77F', 'A87B0F'], vit: ['B6DC96', '4C8A2B'], min: ['B3DCEC', '2F7D9C'], wat: ['CDBDF0', '6B4FB3'] };
const OKL = 'E3F3E2', OK = '3D8B4C', ROSELT = 'FBECEF', LEAFLT = 'EEF5E4', BUTTER = 'FBEFC8', PLAQUE = 'F6E5C6';
const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

/* ---------- layouts ---------- */
pres.defineSlideMaster({
  title: 'BOARD', background: { path: IMG + 'board-bg.jpg' },
  objects: [
    { text: { text: '', options: { shape: 'roundRect', rectRadius: 0.15, x: 4.0, y: 0.32, w: 5.33, h: 0.82, fill: { color: PLAQUE }, line: { color: WOODD, width: 1.5, dashType: 'dash' } } } },
    { text: { text: '', options: { shape: 'roundRect', rectRadius: 0.2, x: 0.4, y: 0.33, w: 3.4, h: 0.8, fill: { color: ROSELT }, line: { color: ROSEL, width: 1.5 } } } },
    { placeholder: { options: { name: 'title', type: 'title', x: 4.05, y: 0.34, w: 5.23, h: 0.78, align: 'center', valign: 'middle', fontSize: 30, bold: true, color: MAROON, rtlMode: true, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'strat', type: 'body', x: 0.45, y: 0.35, w: 3.3, h: 0.76, align: 'center', valign: 'middle', fontSize: 15, bold: true, color: ROSE, rtlMode: true, margin: 2 }, text: '' } },
    { text: { text: '', options: { shape: 'roundRect', rectRadius: 0.2, x: 5.22, y: 6.86, w: 2.9, h: 0.42, fill: { color: PLAQUE }, line: { color: WOODD, width: 1 } } } },
    { text: { text: SIG, options: { x: 5.22, y: 6.86, w: 2.9, h: 0.42, align: 'center', valign: 'middle', fontSize: 16, bold: true, color: MAROON, rtlMode: true, margin: 0 } } },
  ],
});
pres.defineSlideMaster({ title: 'FULL', background: { color: 'FFFFFF' }, objects: [] });

/* ---------- helpers ---------- */
let rvCount = 0, curSlide = null;
function slideOf(master, title, strat, section) {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  TRANS.push(master === 'FULL' ? 'ripple' : ({ 'البداية': 'ripple', 'الاستكشاف': 'prism', 'الشرح': 'gallery', 'الأنشطة': 'honeycomb', 'الختام': 'ripple' })[section]);
  rvCount = 0; curSlide = s;
  if (master === 'BOARD') {
    s.addText(title, { placeholder: 'title', bold: true, fontSize: 30, color: MAROON });
    if (strat) s.addText(strat, { placeholder: 'strat', bold: true, fontSize: 14, color: ROSE });
  }
  return s;
}
function T(s, text, o) {
  const opt = Object.assign({ isTextBox: true, rtlMode: true, lang: 'ar-SA', align: 'right', valign: 'middle', fontSize: 18, color: INK, margin: 4, fontFace: 'Arial' }, o);
  s.addText(text, opt);
}
function box(s, o) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, Object.assign({ fill: { color: WHITE }, line: { color: LEAFLT, width: 1.5 }, rectRadius: 0.14 }, o));
}
function textBox(s, text, o) { // filled rounded box with text
  const opt = Object.assign({ shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.14, fill: { color: WHITE }, line: { color: LEAFLT, width: 1.5 }, rtlMode: true, lang: 'ar-SA', align: 'right', valign: 'middle', fontSize: 18, color: INK, margin: 8, fontFace: 'Arial' }, o);
  s.addText(text, opt);
}
function reveal(s, text, o) { // appears on click, in order
  rvCount++;
  textBox(s, text, Object.assign({ fill: { color: OKL }, line: { color: OK, width: 2 }, color: OK, bold: true, objectName: 'rv' + String(rvCount).padStart(2, '0') }, o));
}
function revealImg(s, file, o) {
  rvCount++;
  s.addImage(Object.assign({ path: file, objectName: 'rv' + String(rvCount).padStart(2, '0') }, o));
}
function pic(s, file, x, y, w, h, frame) {
  if (frame) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: WHITE }, line: { color: frame, width: 2.5 }, rectRadius: 0.12 });
  s.addImage({ path: file, x, y, w, h, sizing: { type: 'cover', w, h } });
}
function chip(s, text, x, y, w, fill, o) {
  textBox(s, text, Object.assign({ x, y, w, h: 0.42, fill: { color: fill }, line: { color: fill, width: 1 }, align: 'center', fontSize: 15, bold: true, rectRadius: 0.2, margin: 2 }, o));
}
function guide(s, text) {
  s.addImage({ path: im('girl-face'), x: 12.0, y: 0.3, w: 0.85, h: 0.85, rounding: true });
  textBox(s, text, { x: 9.55, y: 0.34, w: 2.35, h: 0.78, fontSize: 13, bold: true, color: MAROON, line: { color: ROSEL, width: 1.5 }, rectRadius: 0.2, margin: 4 });
}
let qn = 0; const newQ = () => 'q' + (++qn);
function star(s, ids, x, y, sz) { s.addShape(pres.shapes.STAR_5_POINT, { x, y, w: sz || 0.45, h: sz || 0.45, fill: { color: 'FFC83D' }, line: { color: 'D99A00', width: 1.5 }, objectName: 'tt_' + ids + '_s' + (++qn) }); }
function target(s, ids, text, o) { textBox(s, text, Object.assign({ fill: { color: OKL }, line: { color: OK, width: 2 }, color: OK, bold: true, objectName: 'tt_' + ids + '_t' + (++qn) }, o)); }
function targetImg(s, ids, file, o) { s.addImage(Object.assign({ path: file, objectName: 'tt_' + ids + '_i' + (++qn) }, o)); }
function hotspot(s, id, x, y, w, h) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.15, fill: { color: 'FFFFFF', transparency: 99 }, line: { color: 'FFFFFF', transparency: 100 }, objectName: 'tg_' + id }); }
function hint(s, text, x, y, w) { T(s, text, { x, y, w, h: 0.34, fontSize: 13, bold: true, color: LEAF }); }
const TRANS = [];
function numDot(s, n, x, y, fill) {
  s.addText(AR(n), { shape: pres.shapes.OVAL, x, y, w: 0.42, h: 0.42, fill: { color: fill || ROSE }, color: WHITE, bold: true, fontSize: 15, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
}

/* ================= SLIDES ================= */
const R = (t, o) => ({ text: t, options: o || {} });
const ST = (strategy, stage) => strategy ? [R('الاستراتيجية: ' + strategy, { breakLine: true }), R(stage, { fontSize: 12, color: '7A6660' })] : [R(stage, { fontSize: 14 })];
const GOLD = 'FFC83D';
const TEAMS = ' عبر Teams: شاركي الشاشة في وضع العرض، واطلبي من الطالبات كتابة إجاباتهن في الدردشة أو رفع اليد، ثم اضغطي أنتِ على الإجابة التي اختارتها الطالبة (أو امنحيها التحكم في العرض).';
let auN = 0;
const AU = () => 'au' + String(++auN).padStart(2, '0');
function girl(s, say, o) {
  const g = Object.assign({ x: 0.4, y: 3.05, w: 1.95 }, o);
  if (say) textBox(s, say, { x: 0.4, y: g.y - 1.62, w: 1.95, h: 1.48, fontSize: 14, bold: true, color: MAROON, align: 'center', line: { color: ROSEL, width: 2 }, rectRadius: 0.3 });
  s.addImage({ path: IMG + 'girl-point.png', x: g.x, y: g.y, w: g.w, h: g.w * 716 / 495 });
}
function bookPic(s, file, x, y, w, h, cap, contain, auto) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: WHITE }, line: { color: '3A9BD5', width: 2.5 }, rectRadius: 0.12 });
  s.addImage({ path: im(file), x, y, w, h, sizing: { type: contain ? 'contain' : 'cover', w, h }, objectName: auto ? AU() : undefined });
  if (cap) T(s, cap, { x, y: y + h + 0.05, w, h: 0.28, fontSize: 11, align: 'center', color: '1F6FA5', bold: true });
}
function binBox(s, color, title, x, y, w, h) {
  box(s, { x, y, w, h, line: { color, width: 3 } });
  textBox(s, title, { x, y, w, h: 0.48, fill: { color }, line: { color }, align: 'center', fontSize: 16, bold: true });
}
function stepChip(s, n, label, x, y) { chip(s, AR(n) + ' ' + label, x, y, 1.15, ROSE, { color: WHITE, fontSize: 13, h: 0.34 }); }
function mcq(s, check, CX, CY, CW, fs) { // options are clicked; right = star + answer, wrong = shake
  const q = newQ(), ans = [].concat(check.ans), okIds = ans.map(i => q + 'o' + i).join('-');
  let ox = CX + CW - 0.15;
  check.opts.forEach((o, i) => { const w = 0.45 + o.length * 0.12; ox -= w; const ok = ans.includes(i);
    chip(s, o, ox, CY, w, WHITE, { line: { color: WOOD, width: 2 }, fontSize: fs || 15, h: 0.46, objectName: (ok ? 'tg_' : 'tw_') + q + 'o' + i });
    if (ok) star(s, q + 'o' + i, ox - 0.16, CY + 0.28, 0.38); ox -= 0.15; });
  const room = ox - CX - 0.4;
  if (room >= 2.5) target(s, okIds, check.a, { x: CX + 0.15, y: CY - 0.04, w: room, h: 0.56, fontSize: 13 });
  else target(s, okIds, check.a, { x: CX + 0.15, y: CY + 0.55, w: CW - 0.3, h: 0.48, fontSize: 13 });
}
function backBtn(s) {
  textBox(s, [R('العودة إلى فرق الصحة', { hyperlink: { slide: 7, tooltip: 'شريحة فرق الصحة الأربع' }, color: WHITE, bold: true })], { x: 0.55, y: 6.28, w: 3.0, h: 0.46, fill: { color: '7B1D2C' }, line: { color: '7B1D2C' }, align: 'center', fontSize: 14, rectRadius: 0.23 });
}
function taskHeader(s, color, group, level, task) {
  textBox(s, [R('مهمة مجموعة ' + group, { bold: true, color: MAROON, fontSize: 17, breakLine: true }), R(level, { fontSize: 12, color: '7A6660' })], { x: 9.75, y: 0.34, w: 3.1, h: 0.8, fill: { color }, line: { color: WHITE, width: 2 }, align: 'center', rectRadius: 0.25 });
  textBox(s, task, { x: 0.6, y: 1.32, w: 12.2, h: 0.62, fontSize: 15, bold: true, fill: { color: LEAFLT }, line: { color: LEAFLT } });
}
// book text as typed (identical to the book) + the same text with key phrases highlighted, shown on click
function bookText(s, parts, o) {
  const plain = parts.map(p => R(p[0])), hl = parts.map(p => R(p[0], p[1] ? { highlight: 'FFEB3B' } : {}));
  const base = Object.assign({ fontSize: 16, bold: true, valign: 'top', line: { color: '3A9BD5', width: 2 }, margin: 8 }, o);
  textBox(s, plain, Object.assign({}, base, { objectName: AU() }));
  rvCount++; textBox(s, hl, Object.assign({}, base, { objectName: 'rv' + String(rvCount).padStart(2, '0') }));
}

/* explanation slide: ألاحظ (book image) – أقرأ (book text) – أفهم (in simple words) – أجيب (quick check) */
function concept({ plaque, page, name, imgs, imgCap, parts, textH, fs, simple, say, check, notes }) {
  const s = slideOf('BOARD', plaque, ST('ألاحظ – أقرأ – أفهم – أجيب', 'الشرح والتفسير · ص ' + page), 'الشرح');
  girl(s, say);
  const IX = 2.55, IW = 3.55, IH = 2.95;
  if (imgs.length === 1) bookPic(s, imgs[0], IX, 1.42, IW, IH, imgCap, false, true);
  else { const h = (IH - 0.12) / 2; imgs.forEach((f, i) => bookPic(s, f, IX, 1.42 + i * (h + 0.12), IW, h, i === imgs.length - 1 ? imgCap : null, false, true)); }
  stepChip(s, 1, 'ألاحظ', IX + IW - 1.2, 1.2);
  const X = 6.35, W = 6.45;
  T(s, name, { x: X + 1.3, y: 1.3, w: W - 1.3, h: 0.5, fontSize: 22, bold: true, color: MAROON });
  stepChip(s, 2, 'أقرأ', X + 0.05, 1.38);
  bookText(s, parts, { x: X, y: 1.85, w: W, h: textH || 1.75, fontSize: fs || 16 });
  const sy = 1.85 + (textH || 1.75) + 0.1;
  textBox(s, [R('ببساطة: ', { color: LEAF }), R(simple)], { x: X, y: sy, w: W, h: 4.75 - sy, fontSize: 14, bold: true, fill: { color: LEAFLT }, line: { color: LEAFLT }, objectName: AU() });
  stepChip(s, 3, 'أفهم', X + 0.05, sy - 0.18);
  box(s, { x: IX, y: 4.9, w: 12.8 - IX, h: 1.8, line: { color: ROSEL, width: 2, dashType: 'dash' }, rectRadius: 0.2 });
  stepChip(s, 4, 'أجيب', 12.8 - 1.3, 4.98);
  T(s, [R('تقويم تكويني · ' + check.type, { color: ROSE }), R('  · المسي الإجابة الصحيحة', { color: '7A6660', fontSize: 12 })], { x: IX + 3.0, y: 4.98, w: 6.0, h: 0.38, fontSize: 14, bold: true });
  T(s, check.q, { x: IX + 0.15, y: 5.4, w: 12.8 - IX - 0.3, h: 0.5, fontSize: 18, bold: true });
  mcq(s, check, IX, 6.02, 12.8 - IX);
  s.addNotes(notes + ' الصورة والنص يظهران تلقائيًا؛ انقري على الشريحة ليُظلَّل الأصفر على الجمل المهمة في نص الكتاب.' + TEAMS);
  return s;
}

/* ---------- 1 opening ---------- */
pres.addSection({ title: 'البداية' });
let s = slideOf('FULL', '', '', 'البداية');
s.background = { path: im('opening') };
T(s, '', { x: 10.72, y: 0.83, w: 1.05, h: 0.38, align: 'center', fontSize: 14, bold: true, color: MAROON, objectName: 'date' });
T(s, '', { x: 10.72, y: 1.4, w: 1.05, h: 0.38, align: 'center', fontSize: 14, bold: true, color: MAROON, objectName: 'day' });
s.addNotes('الافتتاح (دقيقتان): اكتبي اليوم والتاريخ في الخانتين (في وضع التحرير). اقرئي القوانين الصفية، وعرّفي الطالبات بفرق التعلم التعاوني الأربع وبعادات الدرس الخمس: النظافة الشخصية، والغذاء المتوازن، وممارسة الرياضة، والنوم الكافي، وزيارة الطبيب.');

/* ---------- 2 warm-up (video) ---------- */
s = slideOf('BOARD', 'التمهيد', ST('الملاحظة والتوقع', 'التهيئة'), 'البداية');
s.addMedia({ type: 'video', path: IMG + 'warmup-sport.mp4', x: 0.6, y: 1.45, w: 7.4, h: 4.16, cover: 'data:image/jpeg;base64,' + fs.readFileSync(IMG + 'warmup-poster.jpg').toString('base64') });
T(s, 'مشهد الطابور الصباحي: «أبدأ يومي بالرياضة»', { x: 0.6, y: 5.68, w: 7.4, h: 0.4, fontSize: 14, bold: true, color: '1F6FA5', align: 'center' });
textBox(s, 'ما فائدة ممارسة الرياضة للجسم؟', { x: 8.25, y: 1.45, w: 4.55, h: 1.1, fontSize: 24, bold: true, color: MAROON, align: 'center', line: { color: ROSEL, width: 2 }, rectRadius: 0.3 });
T(s, 'أتوقع، ثم تظهر الإجابات بالنقر:', { x: 8.25, y: 2.65, w: 4.55, h: 0.36, fontSize: 14, bold: true, color: LEAF });
['تقوية عضلات الجسم', 'زيادة كفاءة الجهاز التنفسي', 'السيطرة على وزن الجسم', 'المشاركة وتكوين الصداقات'].forEach((t, i) => reveal(s, t, { x: 8.25, y: 3.05 + i * 0.72, w: 4.55, h: 0.6, fontSize: 17, align: 'center' }));
s.addNotes('التمهيد (٤ دقائق): اضغطي على الفيديو لتشغيله (١٠ ثوانٍ). اسألي: ما فائدة ممارسة الرياضة للجسم؟ امنحي الطالبات وقتًا للتوقع، ثم انقري لإظهار الفوائد كما وردت في الكتاب ص ١٧٠ (أهمية الرياضة). تأكدي من صوت الفيديو قبل العرض عبر Teams (فعّلي «مشاركة صوت الكمبيوتر»).');

/* ---------- 3 look & wonder ---------- */
s = slideOf('BOARD', 'أنظر وأتساءل', ST('الملاحظة والتوقع', 'التهيئة · ص ١٦٤'), 'البداية');
bookPic(s, 'b-look-photo', 0.6, 1.42, 4.2, 5.0, 'صورة الكتاب · ص ١٦٤', false, true);
bookPic(s, 'b-look-box', 5.15, 1.42, 7.65, 2.5, null, true, true);
T(s, [R('أتوقع: ', { color: ROSE }), R('ما التغيرات التي تحدث في جسمي عند ممارسة الرياضة؟')], { x: 5.15, y: 4.05, w: 7.65, h: 0.45, fontSize: 17, bold: true });
[['يزداد عدد نبضات القلب', 2.0], ['يتسارع التنفس', 1.6], ['يتعرق الجسم', 1.5], ['ترتفع حرارة الجسم', 1.85]].reduce((x, a) => { reveal(s, a[0], { x: x - a[1], y: 4.55, w: a[1], h: 0.5, align: 'center', fontSize: 14, rectRadius: 0.25, margin: 2 }); return x - a[1] - 0.12; }, 12.8);
textBox(s, [R('السؤال الأساسي', { fontSize: 13, color: ROSE, breakLine: true }), R('كيف نحافظ على صحة أجسامنا؟', { fontSize: 28, color: MAROON })], { x: 5.15, y: 5.25, w: 7.65, h: 1.2, align: 'center', bold: true, fill: { color: ROSELT }, line: { color: ROSEL, width: 2, dashType: 'dash' }, rectRadius: 0.25 });
s.addNotes('أنظر وأتساءل (٣ دقائق): تتأمل الطالبات صورة الطالب يركض، ونقرأ سؤال الكتاب: «ممارسة الرياضة تحدث تغيرات في جسمك. صف هذه التغيرات؟». تتوقع الطالبات، ثم انقري لإظهار التغيرات المتوقعة (سنتحقق من تغيّر نبضات القلب عمليًا في «أستكشف»). السؤال الأساسي من الكتاب ص ١٦٦، ونجيب عنه في مراجعة الدرس.');

/* ---------- 4 vocabulary (p163) ---------- */
s = slideOf('BOARD', 'مفردات الدرس', ST('البطاقات المصوّرة', 'مفردات الفكرة العامة · ص ١٦٣'), 'البداية');
bookPic(s, 'b-vocab163', 0.6, 1.42, 3.0, 4.95, 'مفردات الفكرة العامة · ص ١٦٣', true);
const vocab = [
  ['الصحة', 'v-health', 'F6C2CC', 'هي حالة اكتمال السلامة جسديًا وعقليًا ونفسيًا.'],
  ['العادات الصحية', 'v-habits', 'B6DC96', 'سلوكيات تفيد وتساعد الإنسان على المحافظة على جسمه بصحة سليمة بعيدًا عن الأمراض.'],
  ['الرياضة', 'v-sport', 'A9C8EF', 'هي مجموعة من الحركات المنتظمة تهدف إلى تحسين الصحة، وتحقق المتعة والتسلية.'],
  ['النظام الغذائي المتوازن', 'v-diet', 'F4D77F', 'هو نظام غذائي يتكون من مجموعة العناصر اللازمة لأجسامنا بشكل متوازن.'],
  ['الهرم الغذائي', 'v-pyramid', 'CDBDF0', 'عبارة عن خريطة أو دليل يومي للعناصر الغذائية، بحيث يوضح أنواع الغذاء المختلفة التي يجب أن يتناولها الإنسان.'],
];
vocab.forEach((v, i) => {
  const w = 2.9, x0 = 9.9 - (i % 3) * (w + 0.2), y = 1.42 + Math.floor(i / 3) * 2.6;
  box(s, { x: x0, y, w, h: 2.45, line: { color: v[2], width: 3 } });
  s.addImage({ path: im(v[1]), x: x0 + 0.08, y: y + 0.08, w: w - 0.16, h: 1.55, sizing: { type: 'cover', w: w - 0.16, h: 1.55 } });
  T(s, v[0], { x: x0, y: y + 1.68, w, h: 0.7, align: 'center', fontSize: 19, bold: true, color: MAROON });
  hotspot(s, 'vc' + i, x0, y, w, 2.45);
  s.addText([R(v[0], { bold: true, fontSize: 18, color: MAROON, breakLine: true }), R(v[3], { fontSize: 14, color: INK, bold: true })],
    { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.14, x: x0, y, w, h: 2.45, fill: { color: v[2] }, line: { color: v[2], width: 3 }, align: 'center', valign: 'middle', rtlMode: true, margin: 8, objectName: 'tt_vc' + i + '_t' });
});
textBox(s, 'تخمّن الطالبة المعنى من الصورة، ثم المسي البطاقة ليظهر تعريف الكتاب.', { x: 3.75, y: 4.6, w: 2.75, h: 1.3, fontSize: 12, bold: true, color: LEAF, fill: { color: LEAFLT }, line: { color: LEAFLT } });
s.addNotes('المفردات (٣ دقائق): مفردات الفكرة العامة من الكتاب ص ١٦٣. تخمّن الطالبة معنى المفردة من الصورة، ثم المسي البطاقة ليظهر التعريف كما في الكتاب. مفردات الدرس في «أقرأ وأتعلم» ص ١٦٦: الصحة، العادات الصحية، الرياضة.' + TEAMS);

/* ---------- 5 outcomes ---------- */
s = slideOf('BOARD', 'نواتج التعلم', ST(null, 'نواتج التعلم'), 'البداية');
guide(s, 'في نهاية الدرس نضع علامة على ما حققناه!');
const outc = [['أعرّف', ' الصحة والعادات الصحية.'], ['أذكر', ' عادات النظافة الشخصية التي تجنبني الأمراض.'], ['أوضّح', ' أهمية الغذاء المتوازن والنوم الكافي وزيارة الطبيب.'], ['أستنتج', ' أثر ممارسة الرياضة على نبضات القلب وصحة الجسم.'], ['أصمّم', ' يومًا صحيًا، وأقترح تغيير عادة غير صحية.']];
outc.forEach((o, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  let x = col === 0 ? 6.75 : 0.6, w = 6.0, y = 1.55 + row * 1.6;
  if (i === 4) { x = 3.2; w = 6.9; }
  box(s, { x, y, w, h: 1.3 });
  s.addShape(pres.shapes.OVAL, { x: x + w - 0.85, y: y + 0.37, w: 0.56, h: 0.56, fill: { color: WHITE }, line: { color: ROSEL, width: 3 } });
  T(s, [R(o[0], { color: ROSE, bold: true }), R(o[1])], { x: x + 0.2, y, w: w - 1.15, h: 1.3, fontSize: 20, bold: true });
});
s.addNotes('نواتج التعلم (دقيقة): اقرئي النواتج، وركّزي على الأفعال الملوّنة. في نهاية الحصة عودي لهذه الشريحة وضعي علامة صح على كل ناتج تحقق (أدوات القلم في وضع العرض).');

/* ---------- 6 explore (p165) ---------- */
pres.addSection({ title: 'الاستكشاف' });
s = slideOf('BOARD', 'أستكشف', ST('الاستقصاء العلمي', 'الاستكشاف · نشاط استقصائي ص ١٦٥'), 'الاستكشاف');
bookPic(s, 'b-explore', 0.6, 1.42, 4.0, 4.9, 'نشاط أستكشف · ص ١٦٥', false, true);
T(s, 'ما التغيرات التي تحدث في جسمك عندما تركض؟', { x: 4.85, y: 1.32, w: 7.95, h: 0.45, fontSize: 20, bold: true, color: '1F6FA5' });
T(s, [R('الهدف: ', { color: ROSE }), R('أستكشف أثر ممارسة الرياضة على نبضات القلب.')], { x: 4.85, y: 1.77, w: 7.95, h: 0.38, fontSize: 14, bold: true });
[['أتوقع', 'ما التغيير الذي قد يحدث في جسمي عند ممارسة التمارين الرياضية؟'], ['أجرّب', 'أقيس نبضي دون حركة، ثم أمشي دقيقة وأقيسه، ثم أركض دقيقة بعد استراحة قصيرة وأقيسه.'], ['أسجّل', 'أسجّل عدد نبضات القلب في الجدول.'], ['أستنتج', 'هل اختلف عدد نبضات قلبي عند تغيير التمارين الرياضية؟']].forEach((st, i) => {
  const y = 2.2 + i * 0.5; chip(s, AR(i + 1) + ' ' + st[0], 11.55, y, 1.25, i === 3 ? 'E0634F' : '3A9BD5', { color: WHITE, fontSize: 14, h: 0.42 });
  T(s, st[1], { x: 4.85, y, w: 6.6, h: 0.42, fontSize: 13, bold: true });
});
const eh = ['الاسم', 'بدون حركة', 'عند المشي', 'عند الركض'].map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: '3A9BD5' }, align: 'center' } }));
s.addTable([eh, ['', '', '', ''], ['', '', '', '']], { x: 4.85, y: 4.28, w: 7.95, colW: [2.15, 1.9, 1.9, 2.0], rowH: 0.36, fontSize: 14, fontFace: 'Arial', color: INK, border: { type: 'solid', color: '9FCBE8', pt: 1 }, rtlMode: true, align: 'center', valign: 'middle' });
T(s, 'عدد نبضات القلب في الدقيقة', { x: 4.85, y: 5.38, w: 7.95, h: 0.28, fontSize: 11, bold: true, color: '7A6660', align: 'center' });
reveal(s, 'أستنتج: يزداد عدد نبضات القلب عند المشي، ويزداد أكثر عند الركض؛ فممارسة الرياضة تُحدث تغيرات في الجسم، منها زيادة نبضات القلب.', { x: 4.85, y: 5.7, w: 7.95, h: 0.75, fontSize: 14 });
s.addNotes('أستكشف (٧ دقائق): أحتاج إلى أوراق، وأقلام، وساعة إيقاف، ومقياس النبض الإلكتروني (إن توفر). تتعاون كل طالبتين: تقيس الأولى نبض الأخرى وتسجله، ثم يتبادلان. إن لم يتوفر المقياس: تضع الطالبة إصبعيها على الرسغ أو جانب الرقبة، وتعدّ النبضات ١٥ ثانية ثم تضرب العدد في ٤. أستكشف أكثر (الكتاب): هل يختلف معدل نبض القلب باختلاف عمر الإنسان؟ ضعي خطة للإجابة عن ذلك. عبر Teams: تقيس كل طالبة نبضها في بيتها وتكتب الأرقام الثلاثة في الدردشة، وتسجلينها في الجدول.');

/* ---------- 7 four health teams (links to tasks) ---------- */
s = slideOf('FULL', '', '', 'الاستكشاف');
s.background = { path: im('groups') };
[[0.32, 12, 'سفيرات الصحة'], [3.55, 21, 'نجمات النشاط'], [6.66, 17, 'خبيرات العادات'], [9.93, 22, 'مبدعات الصحة']].forEach(g => {
  s.addImage({ path: IMG + 'clear.png', x: g[0], y: 2.7, w: 3.0, h: 3.85, hyperlink: { slide: g[1], tooltip: 'الانتقال إلى مهمة مجموعة ' + g[2] } });
});
textBox(s, 'المسي بطاقة المجموعة للانتقال إلى مهمتها', { x: 4.6, y: 1.98, w: 4.15, h: 0.4, fontSize: 13, bold: true, color: WHITE, fill: { color: 'B14F68' }, line: { color: WHITE, width: 1.5 }, align: 'center', rectRadius: 0.2 });
s.addNotes('فرق الصحة الأربع (التعلم التعاوني): قسّمي الطالبات إلى أربع مجموعات. تظهر مهمة كل مجموعة بعد الجزئية المرتبطة بها: سفيرات الصحة بعد النظافة الشخصية (الشريحة ١٢)، وخبيرات العادات بعد النوم وزيارة الطبيب (الشريحة ١٧)، ونجمات النشاط بعد الرياضة (الشريحة ٢١)، ومبدعات الصحة قبل الختام (الشريحة ٢٢). يمكنك أيضًا لمس بطاقة أي مجموعة هنا للانتقال إلى مهمتها مباشرة، وفي كل مهمة زر للعودة. تبدأ المجموعة المسؤولة بالمهمة، وتشارك بقية المجموعات في المناقشة. عبر Teams: استخدمي غرف الاجتماعات الجانبية (Breakout rooms) أو اجعلي كل مجموعة ترد في الدردشة باسمها.');

/* ---------- 8–10 health, hygiene ---------- */
pres.addSection({ title: 'الشرح' });
concept({ plaque: 'الصحة والعادات الصحية', page: '١٦٦', name: 'كيف تحافظ على صحة جسمك؟', imgs: ['v-health', 'v-habits'], imgCap: 'صور الكتاب · ص ١٦٣',
  parts: [['الصحة: ', 1], ['هي حالة اكتمال السلامة الجسدية والعقلية والنفسية وليست مجرد انعدام المرض أو العجز. ', 0], ['ولكي تحافظ على صحتك لا بد من اتباع ', 0], ['العادات الصحية', 1], [' وهي سلوكيات تفيد وتساعد الإنسان على المحافظة على جسمه بصحة سليمة بعيدًا عن الأمراض.', 0]],
  simple: 'الصحة سلامة الجسم والعقل والنفس معًا، ونحافظ عليها بالعادات الصحية.', say: 'صحتي سلامة جسمي وعقلي ونفسي!',
  check: { type: 'أصحّح المفهوم', q: '«الصحة هي انعدام المرض فقط.» العبارة:', opts: ['صحيحة', 'خاطئة'], ans: 1, a: 'خاطئة: الصحة اكتمال السلامة الجسدية والعقلية والنفسية.' },
  notes: 'الصحة والعادات الصحية (٣ دقائق): ألاحظ الصور، أقرأ نص الكتاب ص ١٦٦، أفهم بالعبارة المبسطة، أجيب عن التقويم التكويني.' });

concept({ plaque: 'النظافة الشخصية', page: '١٦٦–١٦٧', name: 'الاهتمام بالنظافة', imgs: ['i-hands', 'i-teeth'], imgCap: 'صور الكتاب · ص ١٦٦–١٦٧', textH: 2.15, fs: 14,
  parts: [['تنتقل الأوساخ إلى أيدينا، وتسبب لنا الأمراض عند ملامستنا للأشياء غير النظيفة؛ لذا يجب علينا ', 0], ['غسل اليدين باستمرار', 1], [' وبعد مسك الأشياء الملوثة، وقبل تناول الطعام وبعد الانتهاء منه. كما تجب العناية ', 0], ['بتقليم الأظافر وغسل الشعر والمحافظة على نظافة الأسنان', 1], [' بالفرشاة والمعجون بشكل منتظم لوقايتها من التسوس وزيارة طبيب الأسنان بشكل دوري. إن ', 0], ['الاستحمام أفضل طريقة للتخلص من كافة الأوساخ', 1], [' التي تتراكم على أجسامنا.', 0]],
  simple: 'أغسل يدي، وأقلّم أظافري، وأنظف أسناني، وأستحم؛ لأتخلص من الأوساخ والجراثيم.', say: 'أغسل يديّ قبل الأكل وبعده!',
  check: { type: 'أختار الإجابة الصحيحة', q: 'أفضل طريقة للتخلص من كافة الأوساخ التي تتراكم على أجسامنا:', opts: ['النوم', 'الاستحمام', 'تقليم الأظافر'], ans: 1, a: 'الاستحمام' },
  notes: 'النظافة الشخصية (١) (٣ دقائق): النص من الكتاب ص ١٦٦–١٦٧.' });

concept({ plaque: 'النظافة الشخصية', page: '١٦٧', name: 'الأدوات الشخصية والملابس', imgs: ['i-tools', 'i-hat'], imgCap: 'صور الكتاب · ص ١٦٧', textH: 2.15, fs: 14,
  parts: [['تعد ', 0], ['الأدوات الشخصية من أكثر مسببات نقل العدوى', 1], [' بين الأشخاص، حيث تنتقل العديد من الأمراض المعدية بسبب تبادل الأدوات الشخصية. لذا يجب ', 0], ['عدم استخدام أدوات الآخرين الشخصية', 1], ['. وعلينا أن نحرص على ', 0], ['ارتداء الملابس المناسبة لدرجة حرارة الجو', 1], ['، وحماية الجلد وتقليل التعرض لأشعة الشمس الحارة في فصل الصيف وارتداء النظارة الشمسية؛ لحماية العينين من أشعة الشمس.', 0]],
  simple: 'لا أستخدم فرشاة أو منشفة غيري، وألبس ما يناسب الجو، وأحمي جلدي وعينيّ من الشمس.', say: 'أدواتي الشخصية لي وحدي!',
  check: { type: 'أختار الإجابة الصحيحة', q: 'لحماية العينين من أشعة الشمس في الصيف نرتدي:', opts: ['النظارة الشمسية', 'القفازات', 'المعطف'], ans: 0, a: 'النظارة الشمسية' },
  notes: 'النظافة الشخصية (٢) (٣ دقائق): النص من الكتاب ص ١٦٧.' });

/* ---------- 11 self-test p167 ---------- */
s = slideOf('BOARD', 'أختبر نفسي (١)', ST('حل المشكلات والتفكير الناقد', 'الشرح والتفسير · ص ١٦٧'), 'الشرح');
bookPic(s, 'b-test167', 0.6, 1.42, 5.9, 2.08, 'أختبر نفسي · ص ١٦٧', true);
T(s, [R('ألخّص: ', { color: ROSE }), R('العادات الصحية التي تجنبني المرض.')], { x: 6.8, y: 1.38, w: 6.0, h: 0.42, fontSize: 16, bold: true });
reveal(s, 'غسل اليدين، وتقليم الأظافر، وغسل الشعر، وتنظيف الأسنان بالفرشاة والمعجون، والاستحمام، وعدم استخدام أدوات الآخرين الشخصية، وارتداء الملابس المناسبة لحرارة الجو.', { x: 6.8, y: 1.82, w: 6.0, h: 1.2, fontSize: 14 });
T(s, [R('التفكير الناقد: ', { color: ROSE }), R('لماذا يجب علينا غسل اليدين بصورة متكررة؟')], { x: 6.8, y: 3.12, w: 6.0, h: 0.42, fontSize: 16, bold: true });
reveal(s, 'لأن الأوساخ تنتقل إلى أيدينا عند ملامسة الأشياء غير النظيفة، وتسبب لنا الأمراض.', { x: 6.8, y: 3.56, w: 6.0, h: 0.85, fontSize: 14 });
bookPic(s, 'b-family', 0.6, 3.95, 2.55, 2.1, 'نشاط أسري · ص ١٦٧', true);
T(s, [R('نشاط أسري: ', { color: ROSE }), R('أتذكر مع أسرتي سنن يوم الجمعة التي سنّها الرسول ﷺ، وأطبقها.')], { x: 3.4, y: 4.0, w: 3.1, h: 1.0, fontSize: 13, bold: true, valign: 'top' });
reveal(s, 'من سنن يوم الجمعة: الاغتسال، والتطيب، ولبس أحسن الثياب، والتبكير إلى الصلاة، وقراءة سورة الكهف، والإكثار من الصلاة على النبي ﷺ.', { x: 6.8, y: 4.55, w: 6.0, h: 1.2, fontSize: 14 });
s.addNotes('أختبر نفسي من الكتاب ص ١٦٧ (٣ دقائق): تجيب الطالبات، ثم انقري لإظهار الإجابات بالترتيب. بعدها تنتقل مجموعة «سفيرات الصحة» إلى مهمتها في الشريحة التالية.' + TEAMS);

/* ---------- 12 task: health ambassadors ---------- */
s = slideOf('BOARD', 'سفيرات الصحة', ST('التصنيف', 'التعلم التعاوني · التذكر والفهم'), 'الشرح');
taskHeader(s, 'F6C2CC', 'سفيرات الصحة', 'التذكر والفهم', 'المهمة: نحدد العادات الصحية، ونصنّف الصور إلى «عادة صحية» و«عادة غير صحية». تختار الطالبة البطاقة وتذكر السبب، ثم تلمسها لتنتقل إلى مكانها.');
binBox(s, 'B6DC96', 'عادة صحية', 6.95, 2.1, 5.85, 2.8); binBox(s, 'F6C2CC', 'عادة غير صحية', 0.6, 2.1, 6.1, 2.8);
const amb = [['i-hands', 'غسل اليدين', 1], ['t', 'استخدام أدوات الآخرين الشخصية', 0], ['i-teeth', 'تنظيف الأسنان', 1], ['t', 'الإكثار من المشروبات الغازية', 0], ['i-nails', 'تقليم الأظافر', 1], ['t', 'السهر ليلًا', 0], ['i-hat', 'حماية الجلد والعينين من الشمس', 1]];
const slot = { 1: 0, 0: 0 };
amb.forEach((a, i) => {
  const x = 11.3 - i * 1.78, y = 5.05, q = 'am' + i;
  if (a[0] === 't') textBox(s, a[1], { x, y, w: 1.65, h: 1.1, fontSize: 13, bold: true, align: 'center', fill: { color: PLAQUE }, line: { color: WOODD, width: 1.5 } });
  else { s.addImage({ path: im(a[0]), x, y, w: 1.65, h: 0.8, sizing: { type: 'cover', w: 1.65, h: 0.8 } }); T(s, a[1], { x: x - 0.1, y: y + 0.8, w: 1.85, h: 0.32, fontSize: 11, bold: true, align: 'center', margin: 0 }); }
  hotspot(s, q, x - 0.04, y - 0.04, 1.73, 1.18);
  const k = slot[a[2]]++, bx = a[2] ? 6.95 : 0.6, tx = bx + 0.15 + (k % 3) * 1.92, ty = 2.7 + Math.floor(k / 3) * 1.1;
  if (a[0] === 't') target(s, q, a[1], { x: tx, y: ty, w: 1.8, h: 0.95, fontSize: 12, align: 'center', fill: { color: 'FBE3E7' }, line: { color: 'C2445B', width: 2 }, color: '8D2B3E' });
  else targetImg(s, q, im(a[0]), { x: tx, y: ty, w: 1.8, h: 0.95, sizing: { type: 'cover', w: 1.8, h: 0.95 } });
  star(s, q, tx + 1.5, ty - 0.15, 0.4);
});
backBtn(s);
s.addNotes('مهمة سفيرات الصحة (٤ دقائق): تقود المجموعة التصنيف، وتشرح سبب كل اختيار، وتشارك بقية المجموعات بالموافقة أو التصحيح. المسي البطاقة لتنتقل إلى مكانها الصحيح مع نجمة.' + TEAMS);

/* ---------- 13–15 food, sleep, doctor ---------- */
concept({ plaque: 'الغذاء الصحي المتوازن', page: '١٦٨', name: 'الغذاء الصحي المتوازن', imgs: ['i-juice'], imgCap: 'صورة الكتاب · ص ١٦٨',
  parts: [['للمحافظة على صحة الجسم يجب تناول ', 0], ['الغذاء الصحي المتوازن', 1], ['، وتجنب ', 0], ['الإكثار من تناول الدهون والسكريات', 1], ['، وشرب ', 0], ['كميات كافية من الماء', 1], [' وتجنب تناول ', 0], ['المشروبات الغازية', 1], ['.', 0]],
  simple: 'أتناول طعامًا متنوعًا ومتوازنًا، وأشرب الماء، وأقلل الدهون والسكريات والمشروبات الغازية.', say: 'أختار طعامي الصحي وأشرب الماء!',
  check: { type: 'أختار الإجابة الصحيحة', q: 'للمحافظة على صحة الجسم نتجنب تناول:', opts: ['الماء', 'المشروبات الغازية', 'الخضروات'], ans: 1, a: 'المشروبات الغازية' },
  notes: 'الغذاء الصحي المتوازن (٣ دقائق): النص من الكتاب ص ١٦٨. اربطي بدرس «التغذية والصحة» ومجموعات المواد الغذائية الست.' });

concept({ plaque: 'النوم الكافي', page: '١٦٩', name: 'النوم', imgs: ['i-sleep'], imgCap: 'صورة الكتاب · ص ١٦٩', textH: 2.15, fs: 14,
  parts: [['إن أخذ قسط كاف من الراحة مهم لصحة الجسم، ', 0], ['فالنوم المبكر يريح الجسم ويحافظ على حيويته ونشاطه', 1], ['، كما يحافظ على سلامة الجسم العقلية والجسدية، ويحتاج الجسم إلى ', 0], ['٨ ساعات تقريبًا من النوم ليلًا', 1], ['، لذا يجب أن نحرص على النوم المبكر؛ لنصحو مبكرًا ونستقبل يومنا الدراسي بنشاط.', 0]],
  simple: 'أنام مبكرًا نحو ٨ ساعات؛ فأستيقظ نشيطة ومستعدة ليومي الدراسي.', say: 'أنام مبكرًا لأصحو نشيطة!',
  check: { type: 'أختار الإجابة الصحيحة', q: 'يحتاج الجسم من النوم ليلًا تقريبًا إلى:', opts: ['٤ ساعات', '٨ ساعات', '١٢ ساعة'], ans: 1, a: '٨ ساعات تقريبًا' },
  notes: 'النوم الكافي (٣ دقائق): النص من الكتاب ص ١٦٩.' });

concept({ plaque: 'زيارة الطبيب', page: '١٦٩', name: 'زيارة الطبيب', imgs: ['v-health'], imgCap: 'صورة الكتاب · ص ١٦٣', textH: 1.45,
  parts: [['لا بد من ', 0], ['زيارة الطبيب عند شعورنا بالمرض', 1], ['، و', 0], ['اتباع تعليماته عند تناول الأدوية', 1], ['، كما يجب ', 0], ['أخذ التطعيمات اللازمة في وقتها', 1], ['.', 0]],
  simple: 'إذا مرضت أزور الطبيب، وأتناول الدواء كما يقول، وآخذ تطعيماتي في موعدها.', say: 'أتبع تعليمات طبيبي!',
  check: { type: 'أصحّح المفهوم', q: '«أتناول الدواء بالكمية التي أريدها دون اتباع تعليمات الطبيب.» العبارة:', opts: ['صحيحة', 'خاطئة'], ans: 1, a: 'خاطئة: أتبع تعليمات الطبيب عند تناول الأدوية.' },
  notes: 'زيارة الطبيب (دقيقتان): النص من الكتاب ص ١٦٩.' });

/* ---------- 16 self-test p169 + sleep activity ---------- */
s = slideOf('BOARD', 'أختبر نفسي (٢)', ST('حل المشكلات والتفكير الناقد', 'الشرح والتفسير · ص ١٦٩'), 'الشرح');
bookPic(s, 'b-sleepact', 0.6, 1.42, 2.3, 4.95, 'نشاط النوم الكافي · ص ١٦٩', true);
bookPic(s, 'b-test169', 3.2, 1.42, 4.3, 1.9, 'أختبر نفسي · ص ١٦٩', true);
T(s, [R('ألخّص: ', { color: ROSE }), R('أهم فوائد النوم المبكر على صحتي.')], { x: 7.75, y: 1.38, w: 5.05, h: 0.42, fontSize: 15, bold: true });
reveal(s, 'يريح الجسم، ويحافظ على حيويته ونشاطه، ويحافظ على سلامة الجسم العقلية والجسدية، فأصحو مبكرًا بنشاط.', { x: 7.75, y: 1.82, w: 5.05, h: 1.1, fontSize: 13 });
T(s, [R('التفكير الناقد: ', { color: ROSE }), R('لماذا ينصح الأطباء بالنوم ليلًا؟')], { x: 7.75, y: 3.0, w: 5.05, h: 0.42, fontSize: 15, bold: true });
reveal(s, 'لأن النوم ليلًا يريح الجسم ويحافظ على سلامته العقلية والجسدية، فنصحو مبكرًا ونستقبل يومنا بنشاط.', { x: 7.75, y: 3.44, w: 5.05, h: 1.0, fontSize: 13 });
textBox(s, [R('نشاط: النوم الكافي', { color: ROSE, breakLine: true }), R('١ ألاحظ عدد ساعات نومي خلال أسبوع.  ٢ أسجّلها في الجدول.  ٣ تفسير البيانات: هل هي مناسبة؟  ٤ أستنتج مع زميلاتي العدد الكافي لساعات النوم اليومية.')], { x: 3.2, y: 3.75, w: 4.3, h: 2.1, fontSize: 13, bold: true, valign: 'top', line: { color: '3A9BD5', width: 2 } });
reveal(s, 'أستنتج: العدد الكافي لساعات النوم نحو ٨ ساعات يوميًا.', { x: 7.75, y: 4.55, w: 5.05, h: 0.65, fontSize: 13 });
s.addNotes('أختبر نفسي ص ١٦٩ ونشاط «النوم الكافي» (٤ دقائق): يُنفّذ النشاط واجبًا منزليًا لمدة أسبوع، وتسجل كل طالبة ساعات نومها في جدول الكتاب. انقري لإظهار الإجابات بالترتيب. بعدها تنتقل مجموعة «خبيرات العادات» إلى مهمتها.' + TEAMS);

/* ---------- 17 task: habit experts — my healthy day ---------- */
s = slideOf('BOARD', 'يومي الصحي', ST('بناء النماذج', 'التعلم التعاوني · التطبيق'), 'الشرح');
taskHeader(s, 'F4D77F', 'خبيرات العادات', 'التطبيق', 'المهمة: نركّب نموذجًا مصورًا بعنوان «يومي الصحي»: نختار العادة المناسبة لكل وقت من اليوم ونرتّبها. تذكر الطالبة الوقت المناسب للعادة، ثم تلمس البطاقة لتنتقل إلى مكانها.');
const day = [['الصباح الباكر', 'i-teeth', 'أنظّف أسناني بالفرشاة والمعجون'], ['في المدرسة', 'i-hands', 'أغسل يديّ قبل تناول الطعام'], ['وقت الغداء', 'i-juice', 'أتناول غذاءً صحيًا متوازنًا وأشرب الماء'], ['العصر', 'v-sport', 'أمارس الرياضة'], ['الليل', 'i-sleep', 'أنام مبكرًا نحو ٨ ساعات']];
day.forEach((d, i) => {
  const x = 10.4 - i * 2.45;
  chip(s, d[0], x, 2.08, 2.3, 'F4D77F', { fontSize: 15, h: 0.44 });
  box(s, { x, y: 2.58, w: 2.3, h: 2.0, line: { color: 'F2D27A', width: 2, dashType: 'dash' } });
  if (i < 4) s.addShape(pres.shapes.LEFT_ARROW, { x: x - 0.18, y: 2.15, w: 0.2, h: 0.3, fill: { color: 'D99A00' }, line: { color: 'D99A00' } });
});
const order = [2, 4, 0, 3, 1];
order.forEach((di, k) => {
  const d = day[di], x = 10.75 - k * 2.45, y = 4.85, q = 'dy' + di, sx = 10.4 - di * 2.45;
  s.addImage({ path: im(d[1]), x, y, w: 1.6, h: 0.75, sizing: { type: 'cover', w: 1.6, h: 0.75 } });
  T(s, d[2], { x: x - 0.3, y: y + 0.77, w: 2.2, h: 0.5, fontSize: 11, bold: true, align: 'center', margin: 0 });
  hotspot(s, q, x - 0.3, y - 0.05, 2.2, 1.35);
  targetImg(s, q, im(d[1]), { x: sx + 0.1, y: 2.68, w: 2.1, h: 1.05, sizing: { type: 'cover', w: 2.1, h: 1.05 } });
  target(s, q, d[2], { x: sx + 0.1, y: 3.77, w: 2.1, h: 0.72, fontSize: 12, align: 'center' });
  star(s, q, sx + 1.85, 2.48, 0.4);
});
backBtn(s);
s.addNotes('مهمة خبيرات العادات «يومي الصحي» (٥ دقائق): تقود المجموعة بناء النموذج: تذكر الطالبة وقت العادة، ثم المسي بطاقتها لتنتقل إلى مكانها في اليوم مع نجمة. لتحريك البطاقات بحرية وتركيب نموذج خاص بالمجموعة: افتحي الشريحة في وضع التحرير واسحبي بطاقات الصف السفلي إلى الخانات. تناقش بقية المجموعات: ما العادة التي تضيفينها إلى يومك؟' + TEAMS);

/* ---------- 18 sport ---------- */
concept({ plaque: 'الرياضة', page: '١٧٠', name: 'الرياضة', imgs: ['i-runner'], imgCap: 'الرياضة تنشط الجسم، وتجعله يتمتع بصحة جيدة · ص ١٧٠', textH: 1.75,
  parts: [['الرياضة', 1], [' هي عبارة عن مجهود جسدي عادي أو مهارة تمارس بموجب قواعد متفق عليها بهدف ', 0], ['الترفيه أو المنافسة أو تطوير المهارات أو تقوية الثقة بالنفس', 1], ['.', 0]],
  simple: 'الرياضة حركة ومهارة لها قواعد، أمارسها للمتعة والمنافسة وتقوية مهاراتي وثقتي بنفسي.', say: 'الرياضة تنشّط جسمي!',
  check: { type: 'أكمل العبارة', q: 'الرياضة تنشط الجسم، وتجعله يتمتع بصحة ..............', opts: ['ضعيفة', 'جيدة', 'متعبة'], ans: 1, a: 'جيدة' },
  notes: 'الرياضة (٣ دقائق): النص من الكتاب ص ١٧٠. اربطي بنتائج «أستكشف»: تزداد نبضات القلب عند الركض.' });
curSlide.addImage({ path: IMG + 'girl-run.png', x: 0.35, y: 1.3, w: 2.05, h: 1.27 });

/* ---------- 19 reading comprehension (p170 importance of sport) ---------- */
s = slideOf('BOARD', 'فهم قرائي', ST('الفهم القرائي وتظليل النص', 'الشرح والتفسير · ص ١٧٠'), 'الشرح');
const SENT = ['إن المواظبة على ممارسة الرياضة تحقق للإنسان فوائد صحية عديدة، منها: ', 'تقوية عضلات الجسم. ', 'زيادة كفاءة الجهاز التنفسي، مما يؤدي إلى زيادة نشاط الجسم. ', 'السيطرة على وزن الجسم والتخلص من الوزن الزائد. ', 'تساعد على المشاركة وتكوين صداقات مع الآخرين.'];
const PASS = { x: 6.9, y: 1.4, w: 5.9, h: 5.25, fontSize: 21, lineSpacingMultiple: 1.35, valign: 'top', line: { color: LEAFL, width: 3 }, margin: 14, color: INK, bold: false };
const passage = hl => [R('أهمية الرياضة', { bold: true, color: LEAF, fontSize: 22, breakLine: true }), ...SENT.map((t, i) => R(t, Object.assign(hl.includes(i) ? { highlight: 'FFEB3B' } : {}, i > 0 && i < 4 ? { breakLine: true } : {})))];
textBox(s, passage([]), PASS);
['١ ألاحظ', '٢ أقرأ', '٣ أفهم', '٤ أجيب'].forEach((t, i) => chip(s, t, 5.15 - i * 1.5, 1.4, 1.4, LEAFLT, { color: LEAF, fontSize: 15 }));
const rq = [['ما الفائدة التي تعود على عضلات الجسم من ممارسة الرياضة؟', 'تقوية عضلات الجسم.', [1], 'فهم'], ['كيف تؤدي الرياضة إلى زيادة نشاط الجسم؟', 'بزيادة كفاءة الجهاز التنفسي.', [2], 'فهم'], ['استنتجي: لماذا يُنصح من يعاني من الوزن الزائد بممارسة الرياضة؟', 'لأن الرياضة تساعد على السيطرة على وزن الجسم والتخلص من الوزن الزائد.', [3], 'استنتاج']];
rq.forEach((q, i) => {
  const y = 2.0 + i * 1.56;
  box(s, { x: 0.6, y, w: 6.1, h: 1.45, line: { color: ROSELT, width: 2 } });
  numDot(s, i + 1, 6.15, y + 0.12);
  T(s, [R(q[0]), R('  (' + q[3] + ')', { color: '7A6660', fontSize: 12 })], { x: 0.75, y: y + 0.05, w: 5.35, h: 0.65, fontSize: 16, bold: true });
  reveal(s, q[1], { x: 0.75, y: y + 0.74, w: 5.8, h: 0.62, fontSize: 14 });
  rvCount++; textBox(s, passage(q[2]), Object.assign({}, PASS, { objectName: 'rv' + String(rvCount).padStart(2, '0') }));
});
s.addNotes('فهم قرائي (٥ دقائق): نص «أهمية الرياضة» من الكتاب ص ١٧٠. قراءة صامتة ثم جهرية. بعد مناقشة كل سؤال انقري مرة لإظهار الإجابة، ومرة ثانية ليُظلَّل بالأصفر في النص الجزء الذي يدل على الإجابة. الأسئلة متدرجة: فهم ← فهم ← استنتاج.' + TEAMS);

/* ---------- 20 self-test p170 ---------- */
s = slideOf('BOARD', 'أختبر نفسي (٣)', ST('حل المشكلات والتفكير الناقد', 'الشرح والتفسير · ص ١٧٠'), 'الشرح');
bookPic(s, 'b-test170', 0.6, 1.42, 5.6, 2.9, 'أختبر نفسي · ص ١٧٠', true);
bookPic(s, 'i-marathon', 0.6, 4.65, 5.6, 1.75, null);
T(s, [R('ألخّص: ', { color: ROSE }), R('أهمية ممارسة الرياضة في المحافظة على صحتي.')], { x: 6.55, y: 1.38, w: 6.25, h: 0.42, fontSize: 16, bold: true });
reveal(s, 'تقوّي عضلات الجسم، وتزيد كفاءة الجهاز التنفسي فيزداد نشاط الجسم، وتساعد على السيطرة على الوزن، وعلى المشاركة وتكوين صداقات.', { x: 6.55, y: 1.85, w: 6.25, h: 1.25, fontSize: 14 });
T(s, [R('التفكير الناقد: ', { color: ROSE }), R('لماذا تشجع وزارة الرياضة على المشاركة في مسابقات الماراثون؟')], { x: 6.55, y: 3.3, w: 6.25, h: 0.7, fontSize: 16, bold: true });
reveal(s, 'لتشجيع أفراد المجتمع على ممارسة الرياضة والمحافظة على صحتهم، ولأن الرياضة تساعد على المشاركة وتكوين صداقات مع الآخرين.', { x: 6.55, y: 4.05, w: 6.25, h: 1.2, fontSize: 14 });
s.addNotes('أختبر نفسي من الكتاب ص ١٧٠ (٣ دقائق): تجيب الطالبات، ثم انقري لإظهار الإجابات. بعدها تنتقل مجموعة «نجمات النشاط» إلى مهمتها.' + TEAMS);

pres.addSection({ title: 'الأنشطة' });
/* ---------- 21 task: activity stars — compare & explain ---------- */
s = slideOf('BOARD', 'نجمات النشاط', ST('المقارنة والتفكير الناقد', 'التعلم التعاوني · الفهم والتحليل'), 'الأنشطة');
taskHeader(s, 'B6DC96', 'نجمات النشاط', 'الفهم والتحليل', 'المهمة: نقارن بين سلوكين مختلفين، ونفسّر أثر كل منهما على الصحة، ونحلل نتائج قياس نبضات القلب.');
textBox(s, [R('ريم', { color: LEAF, fontSize: 18, breakLine: true }), R('تمشي ٣٠ دقيقة يوميًا، وتلعب مع أخواتها في الهواء الطلق، وتنام مبكرًا.')], { x: 9.55, y: 2.1, w: 3.25, h: 1.65, fontSize: 14, bold: true, align: 'center', line: { color: 'B6DC96', width: 3 } });
textBox(s, [R('هند', { color: ROSE, fontSize: 18, breakLine: true }), R('تجلس أمام الشاشة ساعات طويلة، ولا تمارس الرياضة، وتسهر ليلًا.')], { x: 6.15, y: 2.1, w: 3.25, h: 1.65, fontSize: 14, bold: true, align: 'center', line: { color: 'F6C2CC', width: 3 } });
T(s, '١ أيهما تحافظ على صحتها أكثر؟ (المسي الإجابة)', { x: 6.15, y: 3.85, w: 6.65, h: 0.4, fontSize: 15, bold: true });
mcq(s, { opts: ['ريم', 'هند'], ans: 0, a: 'ريم؛ لأنها تمارس الرياضة وتنام مبكرًا.' }, 6.15, 4.3, 6.65, 16);
T(s, '٢ فسّري: لماذا تشعر ريم بالنشاط أكثر من هند؟', { x: 6.15, y: 4.95, w: 6.65, h: 0.4, fontSize: 15, bold: true });
reveal(s, 'الرياضة تقوي العضلات وتزيد كفاءة الجهاز التنفسي فيزداد نشاط الجسم، والنوم المبكر يريح الجسم ويحافظ على حيويته.', { x: 6.15, y: 5.38, w: 6.65, h: 0.82, fontSize: 13 });
T(s, '٣ أحلّل: نتائج قياس نبض طالبة (مثال)', { x: 0.6, y: 2.05, w: 5.3, h: 0.4, fontSize: 15, bold: true });
const nh = ['بدون حركة', 'عند المشي', 'عند الركض'].map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: '3A9BD5' }, align: 'center' } }));
s.addTable([nh, ['٨٥', '١٠٥', '١٣٠']], { x: 0.6, y: 2.5, w: 5.3, colW: [1.75, 1.75, 1.8], rowH: 0.45, fontSize: 16, fontFace: 'Arial', color: INK, border: { type: 'solid', color: '9FCBE8', pt: 1 }, rtlMode: true, align: 'center', valign: 'middle' });
T(s, 'نبضة في الدقيقة · قيم للتوضيح', { x: 0.6, y: 3.42, w: 5.3, h: 0.3, fontSize: 11, bold: true, color: '7A6660', align: 'center' });
T(s, 'ماذا تلاحظين؟ وبماذا تفسّرين ذلك؟', { x: 0.6, y: 3.8, w: 5.3, h: 0.4, fontSize: 15, bold: true });
reveal(s, 'يزداد عدد نبضات القلب كلما زاد مجهود الجسم: أقلها دون حركة، وأكثرها عند الركض؛ لأن الجسم يحتاج إلى نشاط أكبر عند ممارسة الرياضة.', { x: 0.6, y: 4.25, w: 5.3, h: 1.2, fontSize: 13 });
backBtn(s);
s.addNotes('مهمة نجمات النشاط (٥ دقائق): تقرأ المجموعة الحالتين وتقارن بينهما، ثم تحلل جدول النبض (القيم للتوضيح؛ يمكن استبدالها بنتائج الطالبات في «أستكشف»). المسي الإجابة في السؤال الأول، وانقري لإظهار إجابتي السؤالين الثاني والثالث.' + TEAMS);

/* ---------- 22 task: health creators — picture story ---------- */
s = slideOf('BOARD', 'مبدعات الصحة', ST('القصة المصوّرة', 'التعلم التعاوني · الإبداع والتقويم'), 'الأنشطة');
taskHeader(s, 'CDBDF0', 'مبدعات الصحة', 'الإبداع والتقويم', 'المهمة: نؤلف قصة مصورة قصيرة من ثلاثة مشاهد عن تغيير عادة غير صحية إلى عادة صحية، ونصف نتيجتها. نبدأ بقصة مثال، ثم تؤلف المجموعة قصتها.');
[['١ العادة غير الصحية', null, 'كانت لمى تسهر أمام الشاشة حتى وقت متأخر، فتستيقظ متعبة وتتأخر عن المدرسة.'], ['٢ التغيير', 'i-sleep', 'قررت لمى أن تطفئ الشاشة مبكرًا، وتنام نحو ٨ ساعات كل ليلة.'], ['٣ النتيجة', 'girl-run', 'أصبحت لمى تصحو مبكرًا بنشاط، وتشارك زميلاتها في الرياضة الصباحية.']].forEach((p, i) => {
  const x = 8.95 - i * 4.0;
  box(s, { x, y: 2.1, w: 3.85, h: 3.55, line: { color: 'CDBDF0', width: 3 } });
  chip(s, p[0], x + 0.85, 2.0, 2.15, 'CDBDF0', { fontSize: 14, color: MAROON });
  if (p[1] === 'girl-run') s.addImage({ path: IMG + 'girl-run.png', x: x + 0.6, y: 2.55, w: 2.65, h: 1.63 });
  else if (p[1]) s.addImage({ path: im(p[1]), x: x + 0.15, y: 2.55, w: 3.55, h: 1.63, sizing: { type: 'cover', w: 3.55, h: 1.63 } });
  else { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.6, y: 2.6, w: 2.65, h: 1.5, fill: { color: '2E3A59' }, line: { color: '9AA5C4', width: 3 }, rectRadius: 0.1 }); s.addShape(pres.shapes.MOON, { x: x + 1.65, y: 2.85, w: 0.55, h: 0.9, fill: { color: 'FFE08A' }, line: { color: 'FFE08A' } }); }
  reveal(s, p[2], { x: x + 0.15, y: 4.3, w: 3.55, h: 1.25, fontSize: 13, align: 'center' });
});
textBox(s, [R('معايير القصة: ', { color: ROSE }), R('عادة واضحة · تغيير مقنع · نتيجة صحية · رسم أو صورة لكل مشهد · عنوان جذاب')], { x: 3.65, y: 5.85, w: 9.15, h: 0.45, fontSize: 13, bold: true, fill: { color: 'F5F1FC' }, line: { color: 'F5F1FC' } });
backBtn(s);
s.addNotes('مهمة مبدعات الصحة (٥ دقائق داخل الحصة، وتُستكمل واجبًا): انقري لإظهار مشاهد القصة المثال بالترتيب، ثم تختار المجموعة عادة غير صحية أخرى (مثل الإكثار من المشروبات الغازية أو عدم غسل اليدين) وتؤلف قصتها في ثلاثة مشاهد. عبر Teams: تكتب المجموعة قصتها في Whiteboard أو في الدردشة، وتعرضها إحدى الطالبات. تقيّم بقية المجموعات القصة وفق المعايير.' + TEAMS);

/* ---------- 23 what did I learn? tree of healthy habits ---------- */
pres.addSection({ title: 'الختام' });
s = slideOf('BOARD', 'ماذا تعلمت؟', ST('الخريطة المفاهيمية', 'شجرة العادات الصحية'), 'الختام');
s.addShape(pres.shapes.OVAL, { x: 3.6, y: 2.0, w: 6.1, h: 3.6, fill: { color: '86AD5E', transparency: 60 }, line: { color: 'FFFFFF', transparency: 100 } });
const TR = 'A57447', cx = 6.67, cy = 5.3;
s.addShape(pres.shapes.TRAPEZOID, { x: 6.3, y: 5.0, w: 0.75, h: 1.3, fill: { color: TR }, line: { color: TR }, flipV: true });
const leaves = [['F6C2CC', 'B9466A', 'النظافة الشخصية', 'تمنع الأمراض', 10.6, 4.5], ['F4D77F', 'A87B0F', 'الغذاء المتوازن', 'صحة ونمو', 10.0, 3.0], ['A9C8EF', '3F72B5', 'ممارسة الرياضة', 'تنشط الجسم', 8.1, 2.1], ['CDBDF0', '6B4FB3', 'النوم الكافي', 'حيوية ونشاط', 5.2, 2.1], ['B3DCEC', '2F7D9C', 'زيارة الطبيب', 'علاج ووقاية', 3.3, 3.0], ['B6DC96', '4C8A2B', 'أدواتي الشخصية', 'تمنع العدوى', 2.7, 4.5]];
leaves.forEach(l => { const lx = l[4], ly = l[5]; const x1 = Math.min(cx, lx), x2 = Math.max(cx, lx), y1 = Math.min(cy, ly), y2 = Math.max(cy, ly); s.addShape(pres.shapes.LINE, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: TR, width: 9 }, flipV: lx > cx }); });
leaves.forEach((l, i) => s.addText('؟', { objectName: 'tg_tr' + i, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.4, x: l[4] - 1.15, y: l[5] - 0.5, w: 2.3, h: 1.0, fill: { color: 'FFFFFF' }, line: { color: l[1], width: 3 }, fontSize: 36, bold: true, color: l[1], align: 'center', valign: 'middle', isTextBox: true }));
leaves.forEach((l, i) => { target(s, 'tr' + i, [R(l[2], { fontSize: 18, bold: true, color: INK, breakLine: true }), R(l[3], { fontSize: 13, color: INK })], { x: l[4] - 1.15, y: l[5] - 0.5, w: 2.3, h: 1.0, align: 'center', rectRadius: 0.4, fill: { color: l[0] }, line: { color: l[1], width: 3 } }); star(s, 'tr' + i, l[4] + 0.85, l[5] - 0.7, 0.45); });
textBox(s, 'العادات الصحية', { x: 5.2, y: 6.25, w: 2.95, h: 0.55, fill: { color: '7B1D2C' }, line: { color: '7B1D2C' }, color: WHITE, align: 'center', fontSize: 22, bold: true, rectRadius: 0.27 });
hint(s, 'المسي علامة الاستفهام بعد أن تذكر الطالبة العادة.', 0.6, 1.35, 4.8);
s.addImage({ path: IMG + 'girl-point.png', x: 11.2, y: 4.35, w: 1.6, h: 2.31 });
s.addNotes('ماذا تعلمت؟ شجرة العادات الصحية (٣ دقائق): تذكر كل طالبة عادة صحية وفائدتها، ثم المسي علامة الاستفهام لتكتمل فروع الشجرة مع نجمة.' + TEAMS);

/* ---------- 24 final assessment ---------- */
s = slideOf('BOARD', 'أزرع عادة… وأحصد صحة', ST('التقويم الختامي', 'تقويم مصوّر'), 'الختام');
const fcards = [
  { lab: 'أختار الإجابة الصحيحة', q: 'من العادات التي تجنبنا الأمراض المعدية:', opts: ['مشاركة المنشفة', 'غسل اليدين', 'السهر'], ans: 1, a: 'غسل اليدين' },
  { lab: 'أصنّف: صحية أم غير صحية؟', mini: [['i-teeth', 'تنظيف الأسنان', 'صحية'], ['i-tools', 'تبادل الأدوات الشخصية', 'غير صحية'], ['i-sleep', 'النوم المبكر', 'صحية']] },
  { lab: 'أصحّح المفهوم', q: '«لا بأس باستخدام فرشاة أسنان صديقتي إذا بدت نظيفة.»', opts: ['صحيحة', 'خاطئة'], ans: 1, a: 'خاطئة: الأدوات الشخصية تنقل العدوى.' },
  { lab: 'التفكير الناقد', q: 'تشرب صديقتك المشروبات الغازية يوميًا وتسهر ليلًا. بماذا تنصحينها؟ ولماذا؟', a: 'أنصحها بشرب الماء بدل المشروبات الغازية، والنوم المبكر نحو ٨ ساعات؛ لتحافظ على صحتها وتصحو بنشاط.' },
];
fcards.forEach((c, i) => {
  const x = i % 2 ? 0.6 : 6.8, y = 1.4 + Math.floor(i / 2) * 2.68, w = 5.95;
  box(s, { x, y, w, h: 2.5, line: { color: 'B6DC96', width: 2 } });
  s.addShape(pres.shapes.OVAL, { x: x + w - 0.55, y: y + 0.12, w: 0.42, h: 0.42, fill: { color: LEAF }, line: { color: LEAF } });
  T(s, AR(i + 1), { x: x + w - 0.55, y: y + 0.12, w: 0.42, h: 0.42, align: 'center', color: WHITE, bold: true, fontSize: 14, margin: 0 });
  T(s, '🌱 ' + c.lab, { x: x + 0.2, y: y + 0.1, w: w - 0.85, h: 0.42, fontSize: 15, bold: true, color: LEAF });
  if (c.mini) {
    c.mini.forEach((m, k) => { const mx = x + w - 1.95 - k * 1.92, q = newQ();
      pic(s, im(m[0]), mx + 0.15, y + 0.6, 1.5, 0.82, WOOD); T(s, m[1], { x: mx - 0.05, y: y + 1.45, w: 1.9, h: 0.35, align: 'center', fontSize: 12, bold: true, color: '7A6660' });
      hotspot(s, q, mx + 0.1, y + 0.55, 1.6, 0.92);
      target(s, q, m[2], { x: mx + 0.1, y: y + 1.85, w: 1.6, h: 0.45, align: 'center', fontSize: 14, margin: 2, fill: { color: m[2] === 'صحية' ? OKL : 'FBE3E7' }, line: { color: m[2] === 'صحية' ? OK : 'C2445B', width: 2 }, color: m[2] === 'صحية' ? OK : '8D2B3E' });
      star(s, q, mx + 1.4, y + 0.42, 0.38); });
    return;
  }
  T(s, c.q, { x: x + 0.2, y: y + 0.55, w: w - 0.4, h: c.opts ? 0.8 : 1.0, fontSize: 16, bold: true, valign: 'top' });
  if (c.opts) mcq(s, c, x, y + 1.4, w, 14);
  else reveal(s, c.a, { x: x + 0.2, y: y + 1.55, w: w - 0.4, h: 0.85, fontSize: 13 });
});
s.addNotes('التقويم الختامي «أزرع عادة… وأحصد صحة» (٥ دقائق): المسي الإجابة الصحيحة في السؤالين ١ و٣، والمسي صور السؤال ٢ لإظهار التصنيف، وانقري على الشريحة لإظهار الإجابة النموذجية للسؤال ٤ بعد الاستماع لنصائح الطالبات.' + TEAMS);

/* ---------- 25 exit ticket ---------- */
s = slideOf('BOARD', 'تذكرة الخروج', ST('تذكرة الخروج', 'ماذا تعلمت اليوم؟'), 'الختام');
[['ماذا تعلمت؟', 'تعلمت أن الصحة اكتمال السلامة الجسدية والعقلية والنفسية، وأن العادات الصحية تحافظ عليها.'], ['لماذا تُعد إحدى العادات الصحية مهمة؟', 'غسل اليدين مهم لأن الأوساخ تنتقل إلى أيدينا وتسبب الأمراض.'], ['ما العادة الصحية التي سأحرص عليها؟', 'سأحرص على النوم المبكر نحو ٨ ساعات لأصحو بنشاط.']].forEach((e, i) => {
  const y = 1.4 + i * 1.62;
  box(s, { x: 3.9, y, w: 8.9, h: 1.48, line: { color: ROSELT, width: 2 } });
  numDot(s, i + 1, 12.25, y + 0.15);
  T(s, e[0], { x: 4.05, y: y + 0.08, w: 8.1, h: 0.55, fontSize: 21, bold: true });
  reveal(s, 'مثال: ' + e[1], { x: 4.05, y: y + 0.72, w: 8.6, h: 0.62, fontSize: 14 });
});
textBox(s, 'أقيّم فهمي', { x: 0.6, y: 1.4, w: 3.05, h: 0.5, fill: { color: 'B14F68' }, line: { color: 'B14F68' }, color: WHITE, align: 'center', fontSize: 17, bold: true, rectRadius: 0.25 });
[['فهمت جيدًا', 'BFE3A9'], ['فهمت بعض الأجزاء', 'F8E3A1'], ['أحتاج إلى مساعدة', 'F6C2CC']].forEach((f, i) => {
  const y = 2.05 + i * 0.85;
  box(s, { x: 0.6, y, w: 3.05, h: 0.72, line: { color: WOOD, width: 2 } });
  s.addShape(pres.shapes.OVAL, { x: 3.0, y: y + 0.11, w: 0.5, h: 0.5, fill: { color: f[1] }, line: { color: f[1] } });
  T(s, f[0], { x: 0.7, y, w: 2.25, h: 0.72, fontSize: 15, bold: true });
});
s.addImage({ path: IMG + 'girl-point.png', x: 1.15, y: 4.65, w: 1.45, h: 2.1 });
s.addNotes('تذكرة الخروج (٣ دقائق): تجيب كل طالبة عن الأسئلة الثلاثة كتابيًا أو في الدردشة. الإجابات شخصية؛ الأمثلة تظهر بالنقر للمساعدة فقط. «أقيّم فهمي»: تكتب كل طالبة رقم مستواها (١ أو ٢ أو ٣) في الدردشة، وتابعي في الحصة القادمة من اخترن «أحتاج إلى مساعدة».');

/* ---------- 26 lesson review (last) ---------- */
s = slideOf('BOARD', 'مراجعة الدرس', ST(null, 'التقويم · مراجعة الدرس ص ١٧١'), 'الختام');
bookPic(s, 'b-reviewq', 0.6, 1.42, 2.55, 5.1, 'أفكّر وأتحدّث وأكتب · ص ١٧١', true);
const RV = [
  ['١ المفردات: ............ حالة اكتمال السلامة الجسدية والعقلية والنفسية وليست مجرد انعدام المرض أو العجز.', 'الصحة'],
  ['٢ ألخّص: السلوكيات اليومية التي تعزز الصحة الجيدة.', 'النظافة الشخصية، الغذاء الصحي المتوازن، النوم الكافي، زيارة الطبيب، ممارسة الرياضة.'],
  ['٣ التفكير الناقد: لماذا يجب علينا تجنب الإكثار من شرب المشروبات الغازية؟', 'لأنها غنية بالسكريات التي تضر بصحة الجسم والأسنان، ونستبدلها بالماء.'],
  null,
  ['٥ السؤال الأساسي: كيف نحافظ على صحة أجسامنا؟', 'باتباع العادات الصحية: النظافة الشخصية، والغذاء المتوازن، والنوم الكافي، وزيارة الطبيب، وممارسة الرياضة.'],
  ['العلوم والرياضيات: إذا كان معدل ساعات النوم المناسبة ٨ ساعات يوميًا، فكم معدلها خلال أسبوع؟', '٨ × ٧ = ٥٦ ساعة تقريبًا.'],
  ['العلوم والكتابة: أكتب تقريرًا عن أهمية المحافظة على نظافة الأسنان.', 'أنظف أسناني بالفرشاة والمعجون بانتظام لوقايتها من التسوس، وأزور طبيب الأسنان بشكل دوري.'],
];
let ry = 1.38;
RV.forEach((r, i) => {
  const h = i === 3 ? 0.98 : 0.66;
  box(s, { x: 3.45, y: ry, w: 9.35, h, line: { color: i > 4 ? 'F2D27A' : LEAFLT, width: 1.5 }, rectRadius: 0.1 });
  if (i === 3) {
    T(s, '٤ أختار الإجابة الصحيحة: من العادات غير الصحية:', { x: 7.6, y: ry + 0.03, w: 5.1, h: 0.4, fontSize: 13, bold: true });
    const q = newQ(), op = ['أ- ممارسة الرياضة', 'ب- شرب الماء بكميات كافية', 'ج- النوم مبكرًا', 'د- الإكثار من تناول السكريات'];
    op.forEach((o, k) => { const ow = 2.25, ox = 12.7 - (k + 1) * (ow + 0.07) + 0.07; chip(s, o, ox, ry + 0.5, ow, WHITE, { line: { color: WOOD, width: 1.5 }, fontSize: 11, h: 0.38, objectName: (k === 3 ? 'tg_' : 'tw_') + q + 'o' + k }); if (k === 3) star(s, q + 'o' + k, ox - 0.12, ry + 0.3, 0.32); });
    target(s, q + 'o3', 'د- الإكثار من تناول السكريات', { x: 3.55, y: ry + 0.05, w: 3.95, h: 0.4, fontSize: 12 });
  } else {
    T(s, r[0], { x: 7.35, y: ry + 0.02, w: 5.35, h: h - 0.04, fontSize: 12, bold: true });
    reveal(s, r[1], { x: 3.55, y: ry + 0.07, w: 3.7, h: h - 0.14, fontSize: 11, margin: 3 });
  }
  ry += h + 0.06;
});
s.addNotes('مراجعة الدرس من الكتاب ص ١٧١ (الشريحة الأخيرة): تجيب الطالبات عن كل سؤال، ثم انقري لإظهار الإجابات بالترتيب. السؤال ٤: المسي الإجابة الصحيحة (د). الملخص المصور في الكتاب: العادات الصحية سلوكيات تساعد على البقاء بصحة جيدة، وممارسة الرياضة تؤثر في نبض القلب وتحافظ على صحة الجسم، والتنظيف المنتظم بالفرشاة يمنع تسوس الأسنان. المطويات: تعمل كل طالبة مطوية تلخص فيها طرق المحافظة على الصحة.' + TEAMS);

/* ---------- write, then add animations: click order, triggers, stars, shake, transitions ---------- */
(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  const files = Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f)).sort((a, b) => +a.match(/(\d+)\.xml/)[1] - +b.match(/(\d+)\.xml/)[1]);
  const P14 = { ripple: '<p14:ripple/>', prism: '<p14:prism/>', gallery: '<p14:gallery dir="l"/>', honeycomb: '<p14:honeycomb/>' };
  const DUR = { ripple: 1400, prism: 1200, gallery: 1400, honeycomb: 2000 };
  let stats = { rv: 0, trig: 0, wrong: 0 };
  for (const [n, f] of files.entries()) {
    let xml = await zip.file(f).async('string');
    let id = 2;
    const nid = () => ++id;
    const all = {}, isSp = new Set();
    let m; const re = /<p:(nvSpPr|nvPicPr)><p:cNvPr id="(\d+)" name="([^"]*)"/g;
    while ((m = re.exec(xml))) { all[m[3]] = m[2]; if (m[1] === 'nvSpPr') isSp.add(m[2]); }
    const tgt = sp => `<p:tgtEl><p:spTgt spid="${sp}"/></p:tgtEl>`;
    const show = sp => `<p:set><p:cBhvr><p:cTn id="${nid()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>${tgt(sp)}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>`;
    const fade = sp => show(sp) + `<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${nid()}" dur="450"/>${tgt(sp)}</p:cBhvr></p:animEffect>`;
    const grow = (sp, a) => `<p:anim calcmode="lin" valueType="num"><p:cBhvr><p:cTn id="${nid()}" dur="600" fill="hold"/>${tgt(sp)}<p:attrNameLst><p:attrName>${a}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst><p:tav tm="0"><p:val><p:fltVal val="0"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="#${a}"/></p:val></p:tav></p:tavLst></p:anim>`;
    const starFx = sp => show(sp) + grow(sp, 'ppt_w') + grow(sp, 'ppt_h') + `<p:animRot by="21600000"><p:cBhvr><p:cTn id="${nid()}" dur="700" fill="hold"/>${tgt(sp)}<p:attrNameLst><p:attrName>r</p:attrName></p:attrNameLst></p:cBhvr></p:animRot>`;
    const shake = sp => [[120000, 0], [-240000, 100], [240000, 200], [-240000, 300], [120000, 400]].map(([by, d]) => `<p:animRot by="${by}"><p:cBhvr><p:cTn id="${nid()}" dur="100" fill="hold"><p:stCondLst><p:cond delay="${d}"/></p:stCondLst></p:cTn>${tgt(sp)}<p:attrNameLst><p:attrName>r</p:attrName></p:attrNameLst></p:cBhvr></p:animRot>`).join('');
    const eff = (sp, kind, node, dl) => {
      const [pid, cls, body] = kind === 'star' ? [53, 'entr', starFx(sp)] : kind === 'shake' ? [32, 'emph', shake(sp)] : [10, 'entr', fade(sp)];
      return `<p:par><p:cTn id="${nid()}" presetID="${pid}" presetClass="${cls}" presetSubtype="0" fill="hold"${isSp.has(sp) ? ' grpId="0"' : ''} nodeType="${node}"><p:stCondLst><p:cond delay="${dl || 0}"/></p:stCondLst><p:childTnLst>${body}</p:childTnLst></p:cTn></p:par>`;
    };
    const animated = new Set();
    // main click sequence (rv01, rv02, ...)
    const rv = Object.keys(all).filter(k => /^rv\d\d$/.test(k)).sort();
    let main = '';
    const au = Object.keys(all).filter(k => /^au\d\d$/.test(k)).sort();
    if (au.length) { au.forEach(k => animated.add(all[k])); main += `<p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst><p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${au.map((k, i) => eff(all[k], 'fade', i ? 'withEffect' : 'afterEffect', i * 500)).join('')}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`; }
    for (const k of rv) { animated.add(all[k]); main += `<p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${eff(all[k], 'fade', 'clickEffect')}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`; }
    // triggers: tg_<id> reveals every tt_<ids>_x whose ids include <id>; tw_<id> shakes itself
    const seqs = [];
    const inter = (trig, inner) => `<p:seq concurrent="1" nextAc="seek"><p:cTn id="${nid()}" restart="whenNotActive" fill="hold" evtFilter="cancelBubble" nodeType="interactiveSeq"><p:stCondLst><p:cond evt="onClick" delay="0">${tgt(trig)}</p:cond></p:stCondLst><p:endSync evt="end" delay="0"><p:rtn val="all"/></p:endSync><p:childTnLst><p:par><p:cTn id="${nid()}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${inner}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn><p:nextCondLst><p:cond evt="onClick" delay="0">${tgt(trig)}</p:cond></p:nextCondLst></p:seq>`;
    for (const k of Object.keys(all).filter(k => /^tg_/.test(k))) {
      const qid = k.slice(3);
      const ts = Object.keys(all).filter(t => { const mm = t.match(/^tt_(.+)_([a-z]\d*)$/); return mm && mm[1].split('-').includes(qid); });
      if (!ts.length) throw new Error(`trigger ${k} on ${f} has no targets`);
      ts.sort((a, b) => (/_s\d+$/.test(a) ? 1 : 0) - (/_s\d+$/.test(b) ? 1 : 0));
      const inner = ts.map((t, i) => { animated.add(all[t]); return eff(all[t], /_s\d+$/.test(t) ? 'star' : 'fade', i ? 'withEffect' : 'clickEffect'); }).join('');
      seqs.push(inter(all[k], inner)); stats.trig++;
    }
    for (const k of Object.keys(all).filter(k => /^tw_/.test(k))) { animated.add(all[k]); seqs.push(inter(all[k], eff(all[k], 'shake', 'clickEffect'))); stats.wrong++; }
    stats.rv += rv.length; stats.auto = (stats.auto || 0) + au.length;
    // transition
    const kind = TRANS[n] || 'ripple';
    const trans = `<mc:AlternateContent xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"><mc:Choice xmlns:p14="http://schemas.microsoft.com/office/powerpoint/2010/main" Requires="p14"><p:transition spd="slow" p14:dur="${DUR[kind]}">${P14[kind]}</p:transition></mc:Choice><mc:Fallback><p:transition spd="slow"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`;
    let timing = '';
    if (main || seqs.length) {
      const mainSeq = main ? `<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${main}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>` : '';
      const bld = [...animated].filter(sp => isSp.has(sp)).map(sp => `<p:bldP spid="${sp}" grpId="0" animBg="1"/>`).join('');
      timing = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>${mainSeq}${seqs.join('')}</p:childTnLst></p:cTn></p:par></p:tnLst>${bld ? `<p:bldLst>${bld}</p:bldLst>` : ''}</p:timing>`;
    }
    if (!/<\/p:clrMapOvr>/.test(xml)) throw new Error('no clrMapOvr in ' + f);
    xml = xml.replace(/(<\/p:clrMapOvr>)/, '$1' + trans + timing);
    zip.file(f, xml);
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('written', OUT, JSON.stringify(stats));
})();
