const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const SKILL = '/root/.claude/skills/synced/eee5607a-cee3-4438-a82f-eabe29e012fc_ee537774-4764-45c3-bec0-37d9da460347/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');

const IMG = '/home/user/Scienceshamah/integrated-lessons/nutrition-health/img/';
const OUT = '/home/user/Scienceshamah/integrated-lessons/nutrition-health/درس-التغذية-والصحة.pptx';
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
pres.title = 'درس التغذية والصحة'; pres.author = SIG; pres.subject = 'العلوم - الصف الرابع الابتدائي';
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
  TRANS.push(master === 'FULL' ? 'ripple' : ({ 'البداية': 'ripple', 'الاستكشاف': 'prism', 'الشرح': 'gallery', 'الأنشطة': 'honeycomb', 'التقويم': 'ripple', 'المراجعة': 'prism' })[section]);
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
  s.addImage({ path: im('girl-head'), x: 12.0, y: 0.3, w: 0.85, h: 0.85, rounding: true });
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
const M = t => ({ text: t, options: { highlight: 'FFF176' } });
const ST = (strategy, stage) => strategy ? [R('الاستراتيجية: ' + strategy, { breakLine: true }), R(stage, { fontSize: 12, color: '7A6660' })] : [R(stage, { fontSize: 14 })];
function girl(s, say, o) { // the lesson's student character, standing at the left edge with a speech bubble
  const g = Object.assign({ x: 0.45, y: 3.0, w: 2.25, file: 'girl-cut-point' }, o);
  const h = g.w * 700 / 440;
  if (say) textBox(s, say, { x: 0.45, y: g.y - 1.6, w: 2.25, h: 1.45, fontSize: 15, bold: true, color: MAROON, align: 'center', line: { color: ROSEL, width: 2 }, rectRadius: 0.3, objectName: 'bubble' });
  s.addImage({ path: IMG + g.file + '.png', x: g.x, y: g.y, w: g.w, h, objectName: 'girl' });
}
function bookPic(s, file, x, y, w, h, cap) { // a cropped textbook image in a blue book frame
  pic(s, im(file), x, y, w, h, '3A9BD5');
  if (cap) T(s, cap, { x, y: y + h + 0.06, w, h: 0.3, fontSize: 12, align: 'center', color: '1F6FA5', bold: true });
}
function binBox(s, key, title, x, y, w, h) {
  box(s, { x, y, w, h, line: { color: G[key][0], width: 3 } });
  textBox(s, title, { x, y, w, h: 0.48, fill: { color: G[key][0] }, line: { color: G[key][0] }, align: 'center', fontSize: 16, bold: true });
}

// 1 opening
pres.addSection({ title: 'البداية' });
let s = slideOf('FULL', '', '', 'البداية');
s.background = { path: im('slide-opening') };
T(s, '', { x: 2.29, y: 0.74, w: 1.36, h: 0.32, align: 'center', fontSize: 16, bold: true, color: MAROON, objectName: 'day' });
T(s, '', { x: 8.96, y: 0.74, w: 1.36, h: 0.32, align: 'center', fontSize: 16, bold: true, color: MAROON, objectName: 'date' });
s.addNotes('الافتتاحية (دقيقتان): اكتبي اليوم والتاريخ في الخانتين أعلى الشريحة (في وضع التحرير). اقرئي القوانين الصفية مع الطالبات، وأشيري إلى مخطط الدرس واستراتيجيات التعلم.');

// 2 warm-up
s = slideOf('BOARD', 'التهيئة', ST('فكّر وأجب', 'التهيئة · مراجعة التعلم السابق'), 'البداية');
s.addImage({ path: IMG + 'girl-cut-present.png', x: 0.45, y: 1.45, w: 3.2, h: 4.76 });
textBox(s, 'لماذا نحتاج إلى تناول الطعام وشرب الماء كل يوم؟', { x: 3.9, y: 1.4, w: 8.9, h: 1.3, fontSize: 30, bold: true, color: MAROON, align: 'center', line: { color: ROSEL, width: 2 }, rectRadius: 0.3 });
['أفكّر بصمت', 'أرفع يدي', 'أجيب'].forEach((t, i) => {
  const x = 9.9 - i * 3.0;
  box(s, { x, y: 2.95, w: 2.9, h: 0.62, fill: { color: LEAFLT }, line: { color: LEAFLT } });
  numDot(s, i + 1, x + 2.38, 3.05, LEAF);
  T(s, t, { x: x + 0.1, y: 2.95, w: 2.2, h: 0.62, fontSize: 18, bold: true });
});
T(s, 'الإجابات المتوقعة تظهر بالنقر:', { x: 8.3, y: 3.75, w: 4.5, h: 0.4, fontSize: 15, color: LEAF, bold: true });
[['الطاقة', 'لنتحرك ونلعب ونتعلم'], ['النمو', 'لتنمو أجسامنا بشكل سليم'], ['الصحة', 'لنحافظ على أجسامنا سليمة']].forEach((a, i) => {
  reveal(s, [R(a[0], { fontSize: 26, bold: true, breakLine: true }), R(a[1], { fontSize: 15, bold: false, color: INK })], { x: 9.9 - i * 3.0, y: 4.2, w: 2.9, h: 1.25, align: 'center' });
});
textBox(s, 'سؤال إضافي: ماذا تناولتِ على الإفطار اليوم؟ هل كان مفيدًا لجسمك؟', { x: 3.9, y: 5.75, w: 8.9, h: 0.6, fontSize: 17, bold: true, color: LEAF, fill: { color: LEAFLT }, line: { color: LEAFLT }, rectRadius: 0.3 });
s.addNotes('التهيئة: فكّر وأجب (٤ دقائق). اعرضي السؤال، وامنحي الطالبات ٣٠ ثانية تفكير دون رفع الأيدي، ثم استقبلي ٣–٤ إجابات، وانقري لإظهار الإجابات المتوقعة. الربط بالكتاب (ص ١٧٤): المواد الغذائية ضرورية لنمو الجسم، وإمداده بالطاقة، والمحافظة عليه سليمًا. فروق فردية: للطالبة المتعثرة اطرحي السؤال الإضافي عن الإفطار.');

// 3 outcomes
s = slideOf('BOARD', 'نواتج التعلم', ST(null, 'نواتج التعلم'), 'البداية');
guide(s, 'في نهاية الدرس سنضع علامة على ما حققناه!');
const outc = [['أوضّح', ' أهمية الغذاء المتوازن لصحة الجسم.'], ['أتعرّف', ' مجموعات المواد الغذائية الست وفوائدها ومصادرها.'], ['أصنّف', ' الأطعمة حسب مجموعات المواد الغذائية.'], ['أقرأ', ' الملصقات الغذائية وأستفيد منها في اختيار غذائي.'], ['أكوّن', ' وجبة متوازنة، وأستخدم الهرم الغذائي في اختيار الطعام الصحي.']];
outc.forEach((o, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  let x = col === 0 ? 6.75 : 0.6, w = 6.0, y = 1.55 + row * 1.6;
  if (i === 4) { x = 3.2; w = 6.9; }
  box(s, { x, y, w, h: 1.3 });
  s.addShape(pres.shapes.OVAL, { x: x + w - 0.85, y: y + 0.37, w: 0.56, h: 0.56, fill: { color: WHITE }, line: { color: ROSEL, width: 3 } });
  T(s, [R(o[0], { color: ROSE, bold: true }), R(o[1])], { x: x + 0.2, y, w: w - 1.15, h: 1.3, fontSize: 20, bold: true });
});
s.addNotes('نواتج التعلم (دقيقة). اقرئي النواتج، وركّزي على الأفعال الملوّنة لأنها ما ستقيسه التقويمات. في نهاية الحصة عودي لهذه الشريحة وضعي علامة صح بقلم السبورة على كل ناتج تحقق.');

// 4 vocabulary (the book's six words, p174)
pres.addSection({ title: 'الاستكشاف' });
s = slideOf('BOARD', 'مفردات الدرس', ST('البطاقات المصوّرة', 'الشرح والتفسير · ص ١٧٤'), 'الاستكشاف');
bookPic(s, 'book-vocab', 0.6, 1.4, 2.35, 5.0, 'أقرأ وأتعلم · ص ١٧٤');
const vocab = [
  ['الغذاء المتوازن', 'healthy-plate', 'F6C9A4', 'تناول الكمية المناسبة من الأطعمة كل يوم، بحيث تحتوي على جميع أنواع الغذاء الذي يحتاج إليه الجسم.'],
  ['الكربوهيدرات', 'book-carbs', G.carb[0], 'المصدر الرئيس للطاقة في الجسم غالبًا.'],
  ['البروتينات', 'book-protein', G.prot[0], 'تساعد الجسم على النمو وتعويض الخلايا التالفة.'],
  ['الدهون', 'book-fats', G.fat[0], 'تساعد الخلايا على العمل بشكل سليم، وتزوّد الجسم بالطاقة، وتمنحه الدفء.'],
  ['الفيتامينات', 'book-vitamins', G.vit[0], 'تحافظ على صحة الجسم، وتبني خلايا جديدة، وتقي من الأمراض.'],
  ['الهرم الغذائي', 'book-pyramid', 'E7CFA8', 'دليل غذائي على شكل مثلث يحدد حاجات الأفراد الغذائية التي يجب تناولها.'],
];
vocab.forEach((v, i) => {
  const w = 3.1, x0 = 9.7 - (i % 3) * (w + 0.22), y = 1.4 + Math.floor(i / 3) * 2.7;
  box(s, { x: x0, y, w, h: 2.5, line: { color: v[2], width: 3 } });
  s.addImage({ path: im(v[1]), x: x0 + 0.08, y: y + 0.08, w: w - 0.16, h: 1.6, sizing: { type: v[1] === 'book-pyramid' ? 'contain' : 'cover', w: w - 0.16, h: 1.6 } });
  T(s, v[0], { x: x0, y: y + 1.72, w, h: 0.7, align: 'center', fontSize: 22, bold: true, color: MAROON });
  hotspot(s, 'vc' + i, x0, y, w, 2.5);
  s.addText([R(v[0], { bold: true, fontSize: 20, color: MAROON, breakLine: true }), R(v[3], { fontSize: 16, color: INK, bold: true })],
    { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.14, x: x0, y, w, h: 2.5, fill: { color: v[2] }, line: { color: v[2], width: 3 }, align: 'center', valign: 'middle', rtlMode: true, margin: 10, objectName: 'tt_vc' + i + '_t' });
});
s.addNotes('المفردات (٣ دقائق). هذه مفردات الكتاب الست في «أقرأ وأتعلم» ص ١٧٤. اطلبي من طالبة أن تخمّن معنى المفردة من الصورة، ثم المسي البطاقة ليظهر التعريف فوقها. مهارة القراءة في الكتاب: التصنيف. فروق فردية: اطلبي من المتميزات ذكر مثال لكل مفردة من وجبات البيت.');

// 5 look & wonder (p172)
s = slideOf('BOARD', 'أنظر وأتساءل', ST('أرى – أفكّر – أتساءل', 'التهيئة · ص ١٧٢'), 'الاستكشاف');
bookPic(s, 'book-plate', 0.6, 1.4, 4.3, 4.95, 'صورة الكتاب · ص ١٧٢');
textBox(s, [R('أنظرُ وأتساءلُ', { bold: true, fontSize: 20, color: '1F6FA5', breakLine: true }), R('يحتاج الإنسان إلى تناول مجموعة من الأطعمة التي تشكّل الغذاء الصحي الأكثر توازنًا. هل يمكن أن تُعدّد الأطعمة التي تشكّل غذاءً متوازنًا لصحة الجسم؟', { fontSize: 17 })],
  { x: 5.25, y: 1.4, w: 7.55, h: 1.45, line: { color: '3A9BD5', width: 2.5 } });
T(s, [R('أرى: ', { color: ROSE }), R('ماذا في الطبق؟')], { x: 10.0, y: 3.0, w: 2.8, h: 0.45, fontSize: 18, bold: true });
[['خضروات', 1.4], ['دجاج', 1.1], ['بقوليات', 1.3]].reduce((x, a) => { reveal(s, a[0], { x: x - a[1], y: 3.02, w: a[1], h: 0.42, align: 'center', fontSize: 15, rectRadius: 0.2, margin: 2 }); return x - a[1] - 0.15; }, 9.9);
T(s, [R('أفكّر: ', { color: ROSE }), R('هل تكفي هذه الأطعمة لغذاء متوازن؟ لماذا؟')], { x: 5.25, y: 3.55, w: 7.55, h: 0.45, fontSize: 18, bold: true });
textBox(s, [R('أتساءل · السؤال الأساسي', { fontSize: 14, color: ROSE, bold: true, breakLine: true }), R('كيف يكون غذاؤنا صحيًا؟', { fontSize: 32, bold: true, color: MAROON })],
  { x: 5.25, y: 4.1, w: 7.55, h: 1.2, align: 'center', fill: { color: ROSELT }, line: { color: ROSEL, width: 2, dashType: 'dash' }, rectRadius: 0.25 });
textBox(s, 'تساؤلات الطالبات:', { x: 5.25, y: 5.45, w: 7.55, h: 1.2, valign: 'top', fontSize: 16, color: '7A6660', line: { color: WOOD, width: 2 } });
s.addNotes('أنظر وأتساءل باستراتيجية «أرى – أفكّر – أتساءل» (٣ دقائق). أرى: تسمّي الطالبات ما في الطبق، وانقري لإظهار مكوناته. أفكّر: هل تكفي هذه الأطعمة؟ أتساءل: اكتبي تساؤلات الطالبات. السؤال الأساسي كما في الكتاب ص ١٧٤: «كيف يكون غذاؤنا صحيًا؟»، وتجيب عنه الطالبات في تذكرة الخروج.');

// 6 explore (p173)
s = slideOf('BOARD', 'أستكشف', ST('الاستقصاء', 'الاستكشاف · نشاط استقصائي ص ١٧٣'), 'الاستكشاف');
bookPic(s, 'book-explore', 0.6, 1.4, 4.0, 5.0, 'نشاط أستكشف · ص ١٧٣');
T(s, 'كيف تساعدنا ملصقات المنتجات الغذائية على اختيار الغذاء المتوازن؟', { x: 4.85, y: 1.32, w: 7.95, h: 0.5, fontSize: 19, bold: true, color: '1F6FA5' });
T(s, [R('الهدف: ', { color: ROSE }), R('أحدد الأطعمة التي تشكّل غذاءً متوازنًا لصحة الجسم من خلال ملصقات منتجات غذائية.')], { x: 4.85, y: 1.82, w: 7.95, h: 0.45, fontSize: 14, bold: true });
T(s, [R('١ ألاحظ: ', { color: ROSE }), R('بعد فحص الملصقات الثلاثة وقراءة معلوماتها الغذائية، أسجّل ملاحظاتي (كمية المواد بالجرام):')], { x: 4.85, y: 2.3, w: 7.95, h: 0.45, fontSize: 14, bold: true });
const hdr = ['م', 'الكربوهيدرات', 'الدهون', 'البروتين', 'الأملاح', 'الماء', 'الفيتامينات'].map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: '3A9BD5' }, align: 'center' } }));
const rows = ['١', '٢', '٣'].map(n => [{ text: n, options: { bold: true, fill: { color: 'EEF7FD' }, align: 'center' } }, '', '', '', '', '', '']);
s.addTable([hdr, ...rows], { x: 4.85, y: 2.8, w: 7.95, colW: [0.55, 1.35, 1.15, 1.15, 1.15, 1.15, 1.45], rowH: 0.36, fontSize: 14, fontFace: 'Arial', color: INK, border: { type: 'solid', color: '9FCBE8', pt: 1 }, rtlMode: true, align: 'center', valign: 'middle' });
T(s, [R('٢ أتواصل: ', { color: ROSE }), R('أناقش زميلاتي حول ما قرأته في ملصقات المنتجات الغذائية.')], { x: 4.85, y: 4.32, w: 7.95, h: 0.4, fontSize: 14, bold: true });
reveal(s, 'لكل منتج كميات مختلفة من المواد الغذائية، ولا يوجد منتج واحد يحتوي على جميع المواد الغذائية بكميات مناسبة.', { x: 4.85, y: 4.72, w: 7.95, h: 0.6, fontSize: 14 });
T(s, [R('٣ أستنتج: ', { color: ROSE }), R('أي الأطعمة تشكّل غذاءً متوازنًا لصحتي؟ ولماذا؟')], { x: 4.85, y: 5.38, w: 7.95, h: 0.4, fontSize: 14, bold: true });
reveal(s, 'الأطعمة المتنوعة معًا، لأن الغذاء المتوازن يحتوي على جميع أنواع الغذاء الذي يحتاج إليه الجسم بكميات مناسبة.', { x: 4.85, y: 5.78, w: 7.95, h: 0.6, fontSize: 14 });
T(s, 'أستكشف أكثر: أختار ثلاث مواد غذائية في منزلي، وأتفحّص محتوى ملصقاتها.', { x: 4.85, y: 6.38, w: 7.95, h: 0.35, fontSize: 13, bold: true, color: '1F6FA5' });
s.addNotes('أستكشف: نشاط استقصائي (٧ دقائق). أحتاج إلى: ثلاثة ملصقات لثلاث مواد غذائية مختلفة (الكتاب ص ١٧٣، أو ملصقات حقيقية تحضرها الطالبات). وزّعي الطالبات في مجموعات؛ كل مجموعة تقرأ ملصقًا وتسجّل الكميات في صف من الجدول بقلم السبورة (الأعمدة كما في جدول الكتاب). ثم ناقشي (أتواصل) وانقري للإجابة، ثم الاستنتاج. فروق فردية: المتعثرة تقرأ رقمًا واحدًا (الكربوهيدرات)، والمتميزة تقارن بين المنتجات الثلاثة.');

/* explanation slide: student on the left, book image, the book's text, a quick check */
function concept({ plaque, page, key, name, tag, say, fnLabel, fn, warn, sources, life, img, imgCap, contain, groups, check, notes, fs }) {
  const s = slideOf('BOARD', plaque || 'مجموعات المواد الغذائية', ST('التعلم التعاوني', 'الشرح والتفسير · ص ' + page), 'الشرح');
  const [gl, gd] = key ? G[key] : ['F6C9A4', 'A2552A'];
  girl(s, say, { y: 3.0 });
  // book image
  const IX = 2.95, IW = 3.6, IH = 3.05;
  pic(s, im(img), IX, 1.4, IW, IH, '3A9BD5');
  if (contain) { s.addShape(pres.shapes.RECTANGLE, { x: IX, y: 1.4, w: IW, h: IH, fill: { color: WHITE }, line: { color: WHITE } }); s.addImage({ path: im(img), x: IX, y: 1.4, w: IW, h: IH, sizing: { type: 'contain', w: IW, h: IH } }); }
  T(s, imgCap, { x: IX, y: 4.5, w: IW, h: 0.3, fontSize: 12, align: 'center', color: '1F6FA5', bold: true });
  // text column
  const X = 6.8, W = 6.0;
  T(s, [R(name, { fontSize: 28, bold: true, color: gd }), ...(tag ? [R('   ' + tag, { fontSize: 13, color: '7A6660' })] : [])], { x: X, y: 1.3, w: W, h: 0.55 });
  let y = 1.88;
  fn.forEach((f, i) => {
    textBox(s, [R(fnLabel[i] || 'فائدتها', { fontSize: 12, bold: true, color: gd, breakLine: true }), ...f[0]], { x: X, y, w: W, h: f[1], fontSize: fs || 16, bold: true, line: { color: gl, width: 2 } });
    y += f[1] + 0.1;
  });
  if (warn) { textBox(s, warn, { x: X, y, w: W, h: 0.55, fontSize: 13, bold: true, color: '8D2B3E', fill: { color: 'FBE3E7' }, line: { color: 'FBE3E7' } }); y += 0.63; }
  if (sources) {
    const sh = groups ? 0.72 : 1.05;
    box(s, { x: X, y, w: W, h: sh, line: { color: gl, width: 2 } });
    T(s, groups ? 'مجموعات المواد الغذائية الست' : (key === 'wat' ? 'مصادره' : 'مصادرها'), { x: X + W - 3.0, y: y + 0.02, w: 2.9, h: 0.28, fontSize: 12, bold: true, color: gd });
    let x = X + W - 0.1;
    sources.filter(q => q.img).forEach(src => { x -= 0.85; s.addImage({ path: im(src.img), x, y: y + 0.28, w: 0.8, h: 0.5, sizing: { type: 'cover', w: 0.8, h: 0.5 } }); T(s, src.t, { x: x - 0.1, y: y + 0.78, w: 1.0, h: 0.24, fontSize: 10, align: 'center', bold: true, margin: 0 }); x -= 0.1; });
    const right = x; let cx = right, row = 0;
    sources.filter(q => !q.img).forEach(src => {
      const w = groups ? 0.88 : 0.3 + src.t.length * 0.1;
      if (cx - w < X + 0.08) { row++; cx = right; }
      cx -= w; chip(s, src.t, cx, y + (groups ? 0.32 : 0.3 + row * 0.38), w, src.c || gl, { fontSize: groups ? 10 : 12, h: 0.33, margin: 0 }); cx -= 0.08;
    });
    y += sh + 0.1;
  }
  if (life && y < 4.4) textBox(s, 'من حياتي: ' + life, { x: X, y, w: W, h: 0.42, fontSize: 13, bold: true, color: LEAF, fill: { color: LEAFLT }, line: { color: LEAFLT } });
  // quick check
  const CX = 2.95, CW = 9.85;
  box(s, { x: CX, y: 4.9, w: CW, h: 1.8, line: { color: gl, width: 2, dashType: 'dash' }, rectRadius: 0.2 });
  chip(s, 'تحقق سريع', CX + CW - 1.6, 4.98, 1.45, gl, { fontSize: 14 });
  T(s, [R(check.type, { color: gd }), R('  · المسي الإجابة الصحيحة', { color: '7A6660', fontSize: 12 })], { x: CX + CW - 7.2, y: 4.98, w: 5.5, h: 0.42, fontSize: 14, bold: true });
  T(s, check.q, { x: CX + 0.15, y: 5.42, w: CW - 0.3, h: 0.5, fontSize: 18, bold: true });
  let ox = CX + CW - 0.15;
  const q = newQ(), ans = [].concat(check.ans), okIds = ans.map(i => q + 'o' + i).join('-');
  check.opts.forEach((o, i) => { const w = 0.45 + o.length * 0.12; ox -= w; const ok = ans.includes(i);
    chip(s, o, ox, 6.02, w, WHITE, { line: { color: WOOD, width: 2 }, fontSize: 15, h: 0.46, objectName: (ok ? 'tg_' : 'tw_') + q + 'o' + i });
    if (ok) star(s, q + 'o' + i, ox - 0.16, 6.3, 0.38); ox -= 0.15; });
  target(s, okIds, check.a, { x: CX + 0.15, y: 5.98, w: ox - CX - 0.4, h: 0.56, fontSize: ox - CX < 4 ? 13 : 14 });
  s.addNotes(notes);
  return s;
}
const COOP = ' التعلم التعاوني: تعرض المجموعة المسؤولة عن هذه المادة الغذائية فقرتها من الكتاب مستعينة بالصورة، ثم تلمس طالبة الإجابة الصحيحة في التحقق السريع (الصحيحة تُظهر نجمة، والخاطئة تهتز).';
const COOP_FULL = ' استراتيجية التعلم التعاوني (جيجسو): وزّعي المواد الغذائية الست على ست مجموعات من الطالبات؛ تقرأ كل مجموعة فقرتها من الكتاب (ص ١٧٥–١٧٧)، ثم تعرضها على زميلاتها في شريحتها. في كل تحقق سريع تلمس طالبة الإجابة على السبورة: الإجابة الصحيحة تُظهر نجمة والإجابة، والخاطئة تهتز.';

pres.addSection({ title: 'الشرح' });
concept({ plaque: 'الغذاء وصحة الجسم', page: '١٧٤', name: 'الغذاء وصحة الجسم', say: 'الغذاء المتوازن يمدّني بالطاقة، ويساعدني على النمو والصحة!', img: 'book-groups', contain: true, imgCap: 'صورة الكتاب · ص ١٧٤',
  fnLabel: ['لماذا نأكل؟', 'الغذاء المتوازن'],
  fn: [[[R('توجد '), M('المواد الغذائية'), R(' في الطعام الذي نتناوله، وهي ضرورية لنمو الجسم، وإمداده بالطاقة، والمحافظة عليه سليمًا.')], 0.85],
       [[R('تناول الكمية المناسبة من الأطعمة كل يوم يحافظ على صحة الجسم ونموه، ويسمّى '), M('غذاءً متوازنًا'), R('. وتكون الوجبة متوازنة عندما تحتوي على جميع أنواع الغذاء الذي يحتاج إليه الجسم وبكميات مناسبة.')], 1.18]],
  groups: true, fs: 15, sources: [{ t: 'الكربوهيدرات', c: G.carb[0] }, { t: 'البروتينات', c: G.prot[0] }, { t: 'الدهون', c: G.fat[0] }, { t: 'الفيتامينات', c: G.vit[0] }, { t: 'الأملاح', c: G.min[0] }, { t: 'الماء', c: G.wat[0] }],
  check: { type: 'أكمل العبارة', q: 'يُسمّى تناول الكمية المناسبة من الأطعمة كل يوم: ..................', opts: ['الغذاء السريع', 'الغذاء المتوازن', 'الهرم الغذائي'], ans: 1, a: 'الإجابة: الغذاء المتوازن' },
  notes: 'الغذاء وصحة الجسم (٣ دقائق). النص من الكتاب ص ١٧٤: يتضمن الطعام ست مجموعات من المواد الغذائية: الكربوهيدرات والبروتينات والدهون والفيتامينات والأملاح والماء. عدّي المجموعات الست مع الطالبات، ثم التحقق السريع.' + COOP_FULL });

concept({ page: '١٧٥', key: 'carb', name: 'الكربوهيدرات', tag: 'المجموعة ١ من ٦', say: 'الكربوهيدرات تمنحني الطاقة!', img: 'book-carbs', imgCap: 'أطعمة غنية بالكربوهيدرات · ص ١٧٥', fnLabel: [],
  fn: [[[R('هي '), M('المصدر الرئيس للطاقة'), R(' في الجسم غالبًا.')], 0.72]],
  sources: [{ img: 'f-rice', t: 'الأرز' }, { img: 'f-bread', t: 'الخبز' }, { t: 'رقائق الذرة' }, { t: 'الحبوب' }, { t: 'التمر' }, { t: 'البطاطس' }],
  life: 'إفطار الصباح يمنحني طاقة للتركيز واللعب في المدرسة.',
  check: { type: 'أختار الإجابة الصحيحة', q: 'المصدر الرئيس للطاقة في الجسم غالبًا هو:', opts: ['البروتينات', 'الكربوهيدرات', 'الماء'], ans: 1, a: 'الإجابة: الكربوهيدرات' },
  notes: 'الكربوهيدرات (دقيقتان). من الكتاب ص ١٧٥: هي المصدر الرئيس للطاقة في الجسم غالبًا. مصادرها: رقائق الذرة، والحبوب، والخبز، والتمر، والبطاطس، والأرز.' + COOP });

concept({ page: '١٧٥', key: 'prot', name: 'البروتينات', tag: 'المجموعة ٢ من ٦', say: 'البروتينات تساعدني على النمو!', img: 'book-protein', imgCap: 'أطعمة غنية بالبروتين · ص ١٧٥', fnLabel: [],
  fn: [[[R('تساعد الجسم على '), M('النمو'), R(' و'), M('تعويض الخلايا التالفة'), R(' في الجسم.')], 0.72]],
  sources: [{ img: 'f-eggs', t: 'البيض' }, { img: 'f-salmon', t: 'الأسماك' }, { img: 'f-cheese', t: 'الجبن' }, { img: 'f-milk', t: 'الحليب' }, { t: 'البقوليات' }, { t: 'اللحوم' }, { t: 'الدواجن' }],
  life: 'بعد الجرح، تساعد البروتينات على تعويض الخلايا التالفة.',
  check: { type: 'أصحّح المفهوم', q: '«تساعد الكربوهيدرات الجسم على النمو وتعويض الخلايا التالفة.» العبارة:', opts: ['صحيحة', 'خاطئة'], ans: 1, a: 'خاطئة، والصواب: تساعد البروتينات الجسم على النمو وتعويض الخلايا التالفة.' },
  notes: 'البروتينات (دقيقتان). من الكتاب ص ١٧٥: تساعد الجسم على النمو وتعويض الخلايا التالفة. مصادرها: البقوليات، واللحوم، والأسماك، والدواجن، والبيض، والجبن، والحليب.' + COOP });

concept({ page: '١٧٥', key: 'fat', name: 'الدهون', tag: 'المجموعة ٣ من ٦', say: 'الدهون مفيدة، لكن بكمية مناسبة!', img: 'book-fats', imgCap: 'أطعمة غنية بالدهون · ص ١٧٥', fnLabel: [],
  fn: [[[R('تساعد الخلايا على العمل بشكل سليم، وتزوّد الجسم '), M('بالطاقة'), R('، وتمنحه '), M('الدفء'), R('، وتساعده على الاستفادة من الغذاء وتخزين الفيتامينات.')], 1.12]],
  warn: 'يسبّب الإكثار من تناول الوجبات الغذائية الغنية بالدهون الإصابة بالسمنة وبأمراض القلب.',
  sources: [{ img: 'f-oil', t: 'الزيوت النباتية' }, { img: 'f-salmon', t: 'زيوت الأسماك' }, { t: 'اللحوم' }],
  check: { type: 'أصحّح المفهوم', q: '«كلما أكثرنا من تناول الدهون كانت أجسامنا أكثر صحة.» العبارة:', opts: ['صحيحة', 'خاطئة'], ans: 1, a: 'خاطئة: الإكثار من الدهون يسبب السمنة وأمراض القلب.' },
  notes: 'الدهون (دقيقتان). من الكتاب ص ١٧٥: تساعد الدهون الخلايا على العمل بشكل سليم، وتزوّد الجسم بالطاقة، وتمنحه الدفء، وتساعده على الاستفادة من الغذاء وتخزين الفيتامينات، والإكثار منها يسبب السمنة وأمراض القلب. مصادرها: اللحوم، وزيوت الأسماك، والزيوت النباتية.' + COOP });

// test 1 (p175)
s = slideOf('BOARD', 'أختبر نفسي (١)', ST('التصنيف', 'الشرح والتفسير · أختبر نفسي ص ١٧٥'), 'الشرح');
bookPic(s, 'book-test1', 0.6, 1.4, 5.7, 2.06, 'أختبر نفسي · ص ١٧٥');
T(s, [R('التفكير الناقد: ', { color: ROSE }), R('إجابة نموذجية')], { x: 0.6, y: 3.9, w: 5.7, h: 0.4, fontSize: 16, bold: true });
const t1 = [['f-eggs', 'بيض', 'prot'], ['f-salmon', 'سمك', 'prot'], ['f-rice', 'أرز', 'carb'], ['f-bread', 'خبز', 'carb']];
t1.forEach((f, i) => { const x = 11.45 - i * 1.55; pic(s, im(f[0]), x, 1.45, 1.3, 0.85, WOOD); T(s, f[1], { x, y: 2.35, w: 1.3, h: 0.32, align: 'center', fontSize: 15, bold: true }); hotspot(s, 't1' + i, x - 0.05, 1.4, 1.4, 1.3); });
binBox(s, 'carb', 'مجموعة الكربوهيدرات', 9.9, 2.9, 2.9, 3.4); binBox(s, 'prot', 'مجموعة البروتينات', 6.8, 2.9, 2.9, 3.4);
let cnt = { carb: 0, prot: 0 };
t1.forEach((f, i) => { const b = f[2] === 'carb' ? 9.9 : 6.8; const k = cnt[f[2]]++; targetImg(s, 't1' + i, im(f[0]), { x: b + 0.15 + k * 1.37, y: 3.7, w: 1.25, h: 0.82, sizing: { type: 'cover', w: 1.25, h: 0.82 } }); star(s, 't1' + i, b + 0.15 + k * 1.37 + 0.4, 4.6, 0.45); });
hint(s, 'المسي صورة الطعام لتنتقل إلى مجموعتها الصحيحة.', 6.8, 6.35, 6.0);
reveal(s, 'لن يحصل الجسم على جميع المواد الغذائية التي يحتاج إليها؛ فيضعف، ولا ينمو بشكل سليم، ويصبح أكثر عرضة للأمراض.', { x: 0.6, y: 4.35, w: 5.7, h: 1.4, fontSize: 17 });
s.addNotes('أختبر نفسي ١ من الكتاب ص ١٧٥ (٣ دقائق). أصنّف (بيض – سمك – أرز – خبز) إلى مجموعتين: مجموعة الكربوهيدرات ومجموعة البروتينات. تذكر الطالبات مجموعة كل طعام، ثم تلمس صورته فتنتقل إلى صندوقها الصحيح مع نجمة. ثم سؤال التفكير الناقد: ماذا يحدث للجسم إذا اعتمد الإنسان في غذائه على صنف واحد فقط؟ ثم انقري للإجابة النموذجية.');

concept({ page: '١٧٦', key: 'vit', name: 'الفيتامينات', tag: 'المجموعة ٤ من ٦', say: 'الفيتامينات تحميني من الأمراض!', img: 'book-vitamins', imgCap: 'الفواكه والخضروات غنية بالفيتامينات · ص ١٧٦', fnLabel: [],
  fn: [[[R('تساعد على '), M('المحافظة على صحة الجسم'), R('، وبناء خلايا جديدة، و'), M('الوقاية من الأمراض'), R('. ومن أمثلتها: فيتامين ج وفيتامين د.')], 0.95]],
  sources: [{ img: 'f-fruits', t: 'الفواكه' }, { img: 'f-veg', t: 'الخضروات' }, { img: 'f-milk', t: 'الحليب' }, { t: 'الحبوب' }],
  life: 'أتناول الفواكه والخضروات يوميًا لأحافظ على صحتي.',
  check: { type: 'أكمل العبارة', q: 'من أمثلة الفيتامينات: فيتامين ........ وفيتامين ........', opts: ['ج', 'الكالسيوم', 'د'], ans: [0, 2], a: 'الإجابة: فيتامين ج، وفيتامين د' },
  notes: 'الفيتامينات (دقيقتان). من الكتاب ص ١٧٦: تساعد على المحافظة على صحة الجسم، وبناء خلايا جديدة، والوقاية من الأمراض، مثل فيتامين ج وفيتامين د. مصادرها: الحبوب، والفواكه، والخضروات، والحليب. في التحقق السريع: الكالسيوم ليس فيتامينًا بل من الأملاح المعدنية، وهذا يمهد للمفهوم التالي.' + COOP });

concept({ page: '١٧٦', key: 'min', name: 'الأملاح المعدنية', tag: 'المجموعة ٥ من ٦', say: 'الأملاح المعدنية تساعد على تكوين عظامي ودمي!', img: 'book-minerals', imgCap: 'أطعمة غنية بالأملاح المعدنية · ص ١٧٦', fnLabel: [],
  fn: [[[R('تساعد على تكوين '), M('العظام'), R(' و'), M('خلايا الدم الجديدة'), R('، ومنها: الكالسيوم والحديد.')], 0.72]],
  sources: [{ img: 'f-dairy', t: 'منتجات الألبان' }, { img: 'f-greens', t: 'الخضروات' }, { t: 'اللحوم' }, { t: 'الحبوب' }],
  life: 'منتجات الألبان غنية بالكالسيوم الذي يساعد على تكوين العظام.',
  check: { type: 'أختار الإجابة الصحيحة', q: 'من الأملاح المعدنية التي تساعد على تكوين العظام:', opts: ['الكالسيوم', 'الزيت', 'فيتامين ج'], ans: 0, a: 'الإجابة: الكالسيوم' },
  notes: 'الأملاح المعدنية (دقيقتان). من الكتاب ص ١٧٦: تساعد على تكوين العظام وخلايا الدم الجديدة، ومنها الكالسيوم والحديد. مصادرها: اللحوم، ومنتجات الألبان، والخضروات، والحبوب.' + COOP });

// test 2 (p176)
s = slideOf('BOARD', 'أختبر نفسي (٢)', ST('التصنيف', 'الشرح والتفسير · أختبر نفسي ص ١٧٦'), 'الشرح');
bookPic(s, 'book-test2', 0.6, 1.4, 5.7, 1.53, 'أختبر نفسي · ص ١٧٦');
T(s, [R('التفكير الناقد: ', { color: ROSE }), R('إجابة نموذجية')], { x: 0.6, y: 3.4, w: 5.7, h: 0.4, fontSize: 16, bold: true });
binBox(s, 'carb', 'مجموعة الكربوهيدرات', 9.9, 1.4, 2.9, 3.1); binBox(s, 'fat', 'مجموعة الدهون', 6.8, 1.4, 2.9, 3.1);
const t2 = [['الأرز', 10.05, 2.05], ['الزبدة', 6.95, 2.05], ['الزيت', 6.95, 3.3], ['البطاطس', 10.05, 3.3]];
t2.forEach((a, i) => chip(s, a[0], 11.35 - i * 1.5, 4.7, 1.4, PLAQUE, { line: { color: WOODD, width: 1.5 }, fontSize: 17, h: 0.5, objectName: 'tg_t2' + i }));
t2.forEach((a, i) => { target(s, 't2' + i, a[0], { x: a[1], y: a[2], w: 2.6, h: 1.0, align: 'center', fontSize: 22 }); star(s, 't2' + i, a[1] + 2.2, a[2] - 0.15, 0.45); });
hint(s, 'المسي البطاقة لتنتقل إلى مجموعتها الصحيحة.', 6.8, 5.3, 6.0);
reveal(s, 'لأنها تحافظ على صحة الجسم، وتبني خلايا جديدة، وتقيه من الأمراض.', { x: 0.6, y: 3.85, w: 5.7, h: 1.1, fontSize: 17 });
girl(s, null, { x: 3.0, y: 5.05, w: 1.0 });
s.addNotes('أختبر نفسي ٢ من الكتاب ص ١٧٦ (٣ دقائق). أصنّف (الأرز – الزبدة – الزيت – البطاطس) إلى مجموعة الكربوهيدرات ومجموعة الدهون. تلمس الطالبة البطاقة فتنتقل إلى مجموعتها الصحيحة مع نجمة. ثم سؤال التفكير الناقد: لماذا يُعد تناول الفيتامينات مهمًا لصحة الإنسان؟ ثم انقري للإجابة.');

// read the picture (p176)
s = slideOf('BOARD', 'اقرأ الصورة', ST('التصنيف', 'الشرح والتفسير · ص ١٧٦'), 'الشرح');
bookPic(s, 'book-readpic', 1.6, 1.4, 10.1, 3.27, 'اقرأ الصورة · ص ١٧٦');
[['الخبز (الشطيرة)', 'الكربوهيدرات', 'carb'], ['الطماطم والخس', 'الفيتامينات والأملاح المعدنية', 'vit'], ['المكسرات', 'الدهون والبروتينات', 'fat'], ['كأس الماء', 'الماء', 'wat']].forEach((a, i) => {
  const x = 9.75 - i * 3.05, y = 5.05;
  textBox(s, a[0], { x, y, w: 2.9, h: 1.55, line: { color: G[a[2]][0], width: 2.5 }, fontSize: 17, bold: true, valign: 'top', align: 'center', objectName: 'tg_rp' + i });
  target(s, 'rp' + i, a[1], { x: x + 0.12, y: y + 0.6, w: 2.66, h: 0.8, fontSize: 15, align: 'center', fill: { color: G[a[2]][0] }, line: { color: G[a[2]][0] }, color: INK });
  star(s, 'rp' + i, x + 2.45, y - 0.2, 0.45);
});
s.addNotes('اقرأ الصورة من الكتاب ص ١٧٦ (دقيقتان). صنّف المواد الغذائية في الصورة حسب المجموعات الغذائية. إرشاد الكتاب: توجد المواد الغذائية في الطعام الذي نتناوله. تسمّي الطالبة المكوّن وتتوقع مجموعته، ثم تلمس بطاقته للتحقق. فروق فردية: المتميزة تقترح ما يمكن إضافته للوجبة.');

concept({ page: '١٧٧', key: 'wat', name: 'الماء', tag: 'المجموعة ٦ من ٦', say: 'الماء يشكّل ثلثي جسمي تقريبًا!', img: 'book-water', contain: true, imgCap: 'صورة الكتاب · ص ١٧٧', fnLabel: ['أهميته'],
  fn: [[[R('يشكّل الماء '), M('ثلثي جسم الإنسان'), R(' تقريبًا، فهو يساعد الجسم على الهضم، وعلى التخلص من الفضلات، وعلى المحافظة على درجة حرارة الجسم ثابتة.')], 1.12]],
  sources: [{ img: 'f-water', t: 'الماء النقي' }, { img: 'f-orange', t: 'العصيرات' }, { img: 'f-milk', t: 'الحليب' }, { t: 'الخضروات والفواكه' }],
  check: { type: 'أصحّح المفهوم', q: '«يشكّل الماء نصف جسم الإنسان تقريبًا.» العبارة:', opts: ['صحيحة', 'خاطئة'], ans: 1, a: 'خاطئة، والصواب: يشكّل الماء ثلثي جسم الإنسان تقريبًا.' },
  notes: 'الماء (دقيقتان). من الكتاب ص ١٧٧: يشكّل الماء ثلثي جسم الإنسان تقريبًا، ويساعد على الهضم والتخلص من الفضلات والمحافظة على درجة حرارة الجسم ثابتة. مصادره: شرب الماء النقي والسوائل المختلفة كالعصيرات والحليب، وتناول الخضروات والفواكه. اسألي: كم كوبًا من الماء شربتِ اليوم؟' + COOP });
(() => { const sw = curSlide; [['ماء', '3A8FD0', WHITE], ['ماء', '3A8FD0', WHITE], ['أخرى', 'EEEEEE', INK]].forEach((b, i) => chip(sw, b[0], 12.0 - i * 0.85, 4.38, 0.8, b[1], { color: b[2], fontSize: 12, h: 0.36 })); T(sw, 'ثلثا الجسم ماء تقريبًا', { x: 8.6, y: 4.36, w: 1.95, h: 0.4, fontSize: 13, bold: true, color: G.wat[1] }); })();

// daily food analysis (p177)
s = slideOf('BOARD', 'تحليل غذائي اليومي', ST('الاستقصاء', 'الشرح والتفسير · نشاط ص ١٧٧'), 'الشرح');
bookPic(s, 'book-daily', 0.6, 1.4, 2.65, 5.05, 'نشاط · ص ١٧٧');
T(s, [R('١ ', { color: ROSE }), R('أُعدّ قائمة بالأطعمة التي تناولتُها خلال ٢٤ ساعة، موضِّحةً عليها أهم مكوناتها الغذائية وفوائدها للجسم:')], { x: 3.5, y: 1.35, w: 9.3, h: 0.6, fontSize: 16, bold: true });
const dh = ['نوع الطعام', 'مكوناته الغذائية', 'فائدته للجسم'].map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: '3A9BD5' }, align: 'center' } }));
s.addTable([dh, ['', '', ''], ['', '', ''], ['', '', '']], { x: 3.5, y: 2.0, w: 9.3, colW: [2.6, 3.2, 3.5], rowH: 0.42, fontSize: 15, fontFace: 'Arial', color: INK, border: { type: 'solid', color: '9FCBE8', pt: 1 }, rtlMode: true, align: 'center', valign: 'middle' });
T(s, 'مثال (يظهر بالنقر):', { x: 10.3, y: 3.82, w: 2.5, h: 0.35, fontSize: 13, bold: true, color: '7A6660' });
[['خبز البُر', 'كربوهيدرات', 'يمدّ الجسم بالطاقة'], ['البيض', 'بروتينات', 'النمو وتعويض الخلايا التالفة'], ['البرتقال', 'فيتامينات', 'المحافظة على الصحة والوقاية من الأمراض']].forEach((r, i) => {
  reveal(s, r[0] + '  ←  ' + r[1] + '  ←  ' + r[2], { x: 3.5, y: 4.2 + i * 0.5, w: 9.3, h: 0.44, fontSize: 14, margin: 4 });
});
T(s, [R('٢ ', { color: ROSE }), R('أي أنواع الأطعمة أفضّلها أكثر من غيرها؟ ولماذا؟')], { x: 3.5, y: 5.75, w: 9.3, h: 0.4, fontSize: 15, bold: true });
T(s, [R('٣ أستنتج: ', { color: ROSE }), R('أيها أفضل من حيث القيمة الغذائية لجسمي؟')], { x: 3.5, y: 6.15, w: 9.3, h: 0.4, fontSize: 15, bold: true });
s.addNotes('نشاط «تحليل غذائي اليومي» من الكتاب ص ١٧٧ (٤ دقائق أو واجب منزلي). تكتب كل طالبة ما تناولته خلال ٢٤ ساعة في الجدول، مع مكوناته الغذائية وفائدته. انقري لإظهار ثلاثة أمثلة توضيحية. السؤال ٢ رأي شخصي، والسؤال ٣ استنتاج: الأفضل الطعام الغني بأكثر من مادة غذائية ضمن وجبة متوازنة.');

/* six boxes */
function sixBoxes(level, foods, notes) {
  const s = slideOf('BOARD', 'صناديق الغذاء الستة', ST('التصنيف', 'نشاط تعلم نشط · ' + level), 'الأنشطة');
  const bins = [['carb', 'الكربوهيدرات'], ['prot', 'البروتينات'], ['fat', 'الدهون'], ['vit', 'الفيتامينات'], ['min', 'الأملاح المعدنية'], ['wat', 'الماء']];
  const pos = {};
  bins.forEach((b, i) => { const x = 9.7 - (i % 3) * 3.05, y = 1.35 + Math.floor(i / 3) * 1.95; pos[b[0]] = [x, y, 0]; binBox(s, b[0], b[1], x, y, 2.9, 1.8); });
  box(s, { x: 3.6, y: 5.3, w: 9.2, h: 1.4, line: { color: WOOD, width: 2, dashType: 'dash' } });
  const fq = foods.map(() => newQ());
  foods.forEach((f, i) => { const x = 11.55 - i * 1.5; pic(s, im(f[0]), x, 5.38, 1.2, 0.85); T(s, f[1], { x: x - 0.1, y: 6.27, w: 1.4, h: 0.33, align: 'center', fontSize: 14, bold: true }); hotspot(s, fq[i], x - 0.1, 5.33, 1.4, 1.3); });
  foods.forEach((f, i) => f[2].forEach(g => { const p = pos[g]; const k = p[2]++; const tx = p[0] + 0.12 + k * 0.92; targetImg(s, fq[i], im(f[0]), { x: tx, y: p[1] + 0.6, w: 0.85, h: 0.6, sizing: { type: 'cover', w: 0.85, h: 0.6 } }); star(s, fq[i], tx + 0.25, p[1] + 1.25, 0.4); }));
  textBox(s, [R('الهدف', { bold: true, color: ROSE, breakLine: true }), R('أصنّف الأطعمة إلى مجموعات المواد الغذائية الست.')], { x: 0.6, y: 1.35, w: 2.8, h: 1.2, fontSize: 15, bold: true, line: { color: ROSELT, width: 2 } });
  textBox(s, [R('الخطوات', { bold: true, color: ROSE, breakLine: true }), R('١ أتأمل صور الأطعمة.', { breakLine: true }), R('٢ أحدد المادة الغذائية التي يغنى بها.', { breakLine: true }), R('٣ ألمس صورة الطعام، فينتقل إلى صندوقه.')], { x: 0.6, y: 2.7, w: 2.8, h: 2.0, fontSize: 15, bold: true, line: { color: ROSELT, width: 2 }, valign: 'top' });
  chip(s, level, 0.6, 4.85, 2.8, LEAF, { color: WHITE, fontSize: 16, h: 0.5 });
  s.addNotes(notes);
}
pres.addSection({ title: 'الأنشطة' });
sixBoxes('المستوى الأساسي', [['f-rice', 'الأرز', ['carb']], ['f-eggs', 'البيض', ['prot']], ['f-oil', 'الزيت', ['fat']], ['f-orange', 'البرتقال', ['vit']], ['f-dairy', 'منتجات الألبان', ['min']], ['f-water', 'الماء', ['wat']]],
  'صناديق الغذاء الستة، المستوى الأساسي (٣ دقائق). تتقدم الطالبات بالتناوب؛ كل طالبة تختار طعامًا وتتوقع صندوقه، ثم تلمس صورته على السبورة فتنتقل إلى صندوقها الصحيح مع نجمة. جميع التصنيفات من مصادر الكتاب ص ١٧٥–١٧٧. فروق فردية: ابدئي بهذا المستوى ثم انتقلي للمتقدم مع المتميزات.');
sixBoxes('المستوى المتقدم', [['f-bread', 'الخبز', ['carb']], ['f-salmon', 'الأسماك', ['prot', 'fat']], ['f-butter', 'الزبدة', ['fat']], ['f-milk', 'الحليب', ['prot', 'vit']], ['f-greens', 'الخضروات', ['vit', 'min']], ['f-fruits', 'الفواكه', ['vit', 'wat']]],
  'صناديق الغذاء الستة، المستوى المتقدم (٣ دقائق). بعض الأطعمة مصدر لأكثر من مجموعة حسب الكتاب: الأسماك (بروتينات، وزيوت الأسماك دهون)، والحليب (بروتينات وفيتامينات)، والخضروات (فيتامينات وأملاح معدنية)، والفواكه (فيتامينات وماء). والزبدة من الدهون كما في «أختبر نفسي» ص ١٧٦. عند لمس صورة الطعام تظهر في كل مجموعة ينتمي إليها.');

// concept tree
s = slideOf('BOARD', 'شجرة الغذاء المتوازن', ST('الخريطة المفاهيمية', 'أكمل الشجرة'), 'الأنشطة');
s.addShape(pres.shapes.OVAL, { x: 3.6, y: 2.0, w: 6.1, h: 3.6, fill: { color: '86AD5E', transparency: 60 }, line: { color: 'FFFFFF', transparency: 100 } });
const TR = 'A57447', cx = 6.67, cy = 5.3;
s.addShape(pres.shapes.TRAPEZOID, { x: 6.3, y: 5.0, w: 0.75, h: 1.3, fill: { color: TR }, line: { color: TR }, flipV: true });
const leaves = [['carb', 'الكربوهيدرات', 'طاقة', 10.6, 4.5], ['prot', 'البروتينات', 'النمو وتعويض الخلايا', 10.0, 3.0], ['fat', 'الدهون', 'طاقة ودفء', 8.1, 2.1], ['vit', 'الفيتامينات', 'الوقاية من الأمراض', 5.2, 2.1], ['min', 'الأملاح المعدنية', 'العظام وخلايا الدم', 3.3, 3.0], ['wat', 'الماء', 'الهضم وثبات الحرارة', 2.7, 4.5]];
leaves.forEach(l => { const lx = l[3], ly = l[4]; const x1 = Math.min(cx, lx), x2 = Math.max(cx, lx), y1 = Math.min(cy, ly), y2 = Math.max(cy, ly); s.addShape(pres.shapes.LINE, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: TR, width: 9 }, flipV: lx > cx }); });
leaves.forEach((l, i) => s.addText('؟', { objectName: 'tg_tr' + i, shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.4, x: l[3] - 1.15, y: l[4] - 0.5, w: 2.3, h: 1.0, fill: { color: 'FFFFFF' }, line: { color: G[l[0]][1], width: 3 }, fontSize: 36, bold: true, color: G[l[0]][1], align: 'center', valign: 'middle', isTextBox: true }));
leaves.forEach((l, i) => target(s, 'tr' + i, [R(l[1], { fontSize: 19, bold: true, color: INK, breakLine: true }), R(l[2], { fontSize: 14, color: INK })], { x: l[3] - 1.15, y: l[4] - 0.5, w: 2.3, h: 1.0, align: 'center', rectRadius: 0.4, fill: { color: G[l[0]][0] }, line: { color: G[l[0]][1], width: 3 } }));
leaves.forEach((l, i) => star(s, 'tr' + i, l[3] + 0.85, l[4] - 0.7, 0.45));
hint(s, 'المسي علامة الاستفهام لتظهر المجموعة.', 0.6, 1.35, 4.5);
textBox(s, 'الغذاء المتوازن', { x: 5.2, y: 6.25, w: 2.95, h: 0.55, fill: { color: '7B1D2C' }, line: { color: '7B1D2C' }, color: WHITE, align: 'center', fontSize: 22, bold: true, rectRadius: 0.27 });
s.addNotes('شجرة الغذاء المتوازن: خريطة مفاهيمية (٣ دقائق). تبدأ الشجرة بفراغات (؟). اسألي عن كل ورقة، ثم تلمس الطالبة علامة الاستفهام لتظهر المجموعة ووظيفتها مع نجمة.');

// reading comprehension with yellow highlighting of the answer sentences
s = slideOf('BOARD', 'فهم قرائي', ST('أقرأ – أفهم – أجيب', 'فهم قرائي'), 'الأنشطة');
const SENT = ['يحتاج جسم الإنسان إلى غذاء متوازن ليحصل على الطاقة وينمو ويحافظ على صحته. ', 'وتساعد البروتينات على النمو وتعويض الخلايا التالفة، ', 'بينما تمد الكربوهيدرات الجسم بالطاقة. ', 'وتساعد الفيتامينات والأملاح المعدنية على المحافظة على صحة الجسم، ', 'ويحتاج الإنسان أيضًا إلى الماء للقيام بوظائفه الحيوية.'];
const PASS = { x: 6.9, y: 1.4, w: 5.9, h: 5.25, fontSize: 22, lineSpacingMultiple: 1.35, valign: 'top', line: { color: LEAFL, width: 3 }, margin: 14, color: INK, bold: false };
const passage = hl => [R('غذائي وصحتي', { bold: true, color: LEAF, fontSize: 22, breakLine: true }), ...SENT.map((t, i) => R(t, hl.includes(i) ? { highlight: 'FFEB3B' } : {}))];
textBox(s, passage([]), PASS);
['١ أقرأ', '٢ أفهم', '٣ أجيب'].forEach((t, i) => chip(s, t, 4.6 - i * 2.0, 1.4, 1.85, LEAFLT, { color: LEAF, fontSize: 16 }));
const rq = [['لماذا يحتاج الإنسان إلى الغذاء المتوازن؟', 'ليحصل على الطاقة، وينمو، ويحافظ على صحته.', [0]], ['ما المادة الغذائية التي تساعد على النمو وتعويض الخلايا التالفة؟', 'البروتينات.', [1]], ['استنتجي: ماذا يحدث إذا لم يحصل الجسم على غذاء متنوع؟', 'لن يحصل على جميع المواد الغذائية؛ فيضعف، ولا ينمو بشكل سليم، ويصبح أكثر عرضة للأمراض.', [0, 3]]];
rq.forEach((q, i) => {
  const y = 2.0 + i * 1.56;
  box(s, { x: 0.6, y, w: 6.1, h: 1.45, line: { color: ROSELT, width: 2 } });
  numDot(s, i + 1, 6.15, y + 0.12);
  T(s, q[0], { x: 0.75, y: y + 0.05, w: 5.35, h: 0.65, fontSize: 16, bold: true });
  reveal(s, q[1], { x: 0.75, y: y + 0.74, w: 5.8, h: 0.62, fontSize: 14 });
  rvCount++; // the passage again, with this answer's sentences highlighted in yellow, appears over the plain one
  textBox(s, passage(q[2]), Object.assign({}, PASS, { objectName: 'rv' + String(rvCount).padStart(2, '0') }));
});
s.addNotes('فهم قرائي: أقرأ – أفهم – أجيب (٥ دقائق). أقرأ: قراءة صامتة دقيقة، ثم قراءة جهرية. أفهم: اسألي عن معنى «الخلايا التالفة» و«الوظائف الحيوية». أجيب: بعد مناقشة كل سؤال انقري مرة لإظهار الإجابة، ومرة ثانية ليظهر تظليل أصفر على الجملة التي تتضمن الإجابة في النص. السؤال الثالث استنتاجي: يُظلَّل فيه ما يساعد على الاستنتاج من النص.');

// plate
s = slideOf('FULL', '', '', 'الأنشطة');
s.background = { path: im('slide-plate') };
T(s, '', { x: 9.57, y: 0.49, w: 1.52, h: 0.29, align: 'center', fontSize: 14, bold: true, color: MAROON, objectName: 'day' });
T(s, '', { x: 9.57, y: 0.94, w: 1.52, h: 0.29, align: 'center', fontSize: 14, bold: true, color: MAROON, objectName: 'date' });
[[3.2, 3.77, 1.87, 1.35], [3.15, 5.31, 1.87, 1.4], [8.13, 3.77, 1.8, 1.35], [8.25, 5.31, 1.72, 1.4]].forEach((r, i) => {
  hotspot(s, 'pl' + i, r[0], r[1], r[2], r[3]);
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: r[0] - 0.05, y: r[1] - 0.05, w: r[2] + 0.1, h: r[3] + 0.1, rectRadius: 0.2, fill: { color: 'FFFFFF', transparency: 100 }, line: { color: OK, width: 5 }, objectName: 'tt_pl' + i + '_f' });
  star(s, 'pl' + i, r[0] - 0.2, r[1] - 0.2, 0.5);
});
reveal(s, 'الأرز كربوهيدرات، والدجاج بروتينات. نُكمل الوجبة بالخضروات والفواكه (فيتامينات وأملاح معدنية)، ومنتجات الألبان، والماء.', { x: 4.75, y: 5.95, w: 4.1, h: 0.8, fontSize: 13, align: 'center', fill: { color: 'FFFFFF' } });
s.addNotes('الطبق الناقص: فكّر – زاوج – شارك (٦ دقائق). فكّر: دقيقة تفكير فردي: ماذا ينقص طبق الأرز والدجاج؟ زاوج: تناقش كل طالبة زميلتها وتتفقان على اختيارين مع التفسير. شارك: تتقدم كل ثنائية إلى السبورة، وتلمس الأطعمة التي اختارتاها فيظهر حولها إطار أخضر ونجمة، وتفسّران اختيارهما. ثم انقري على الشريحة لإظهار التغذية الراجعة.');

// pyramid (p178)
s = slideOf('BOARD', 'الهرم الغذائي', ST('التعلم التعاوني', 'الشرح والتفسير · ص ١٧٨'), 'الأنشطة');
girl(s, 'أُكثر من قاعدة الهرم، وأقلّل من قمته.', { y: 3.0 });
bookPic(s, 'book-pyramid', 6.35, 1.4, 3.0, 3.2, 'يساعدنا الهرم الغذائي على اختيار الطعام الصحي · ص ١٧٨');
textBox(s, 'لا توجد جميع المواد الغذائية في نوع واحد من الأطعمة؛ لذا يجب أن يكون الطعام الذي نتناوله مشتملًا على جميع المواد الغذائية بكميات محددة. وقد استُخدم الهرم الغذائي سابقًا نموذجًا يوضّح أنواع الأطعمة التي يحتاجها الإنسان يوميًا لبناء جسم يتمتع بصحة جيدة.', { x: 2.95, y: 1.4, w: 3.2, h: 3.55, fontSize: 14, bold: true, valign: 'top' });
textBox(s, 'الهرم الغذائي: دليل غذائي على شكل مثلث يحدد حاجات الأفراد الغذائية التي يجب تناولها.', { x: 2.95, y: 5.1, w: 6.4, h: 0.75, fontSize: 15, bold: true, color: MAROON, fill: { color: ROSELT }, line: { color: ROSELT } });
T(s, 'يقسّم الأطعمة إلى خمس مجموعات رئيسة:', { x: 9.55, y: 1.35, w: 3.25, h: 0.4, fontSize: 14, bold: true, color: LEAF });
const lv = [['carb', '١', 'مجموعة الحبوب', 5.45], ['vit', '٢', 'مجموعة الخضروات والفواكه', 4.5], ['prot', '٣', 'مجموعة اللحوم والأسماك', 3.55], ['min', '٤', 'مجموعة الحليب ومشتقاته', 2.6], ['fat', '٥', 'مجموعة الدهون', 1.8]];
lv.forEach((l, i) => { textBox(s, '', { x: 9.55, y: l[3], w: 3.25, h: 0.7, line: { color: G[l[0]][0], width: 2.5 }, objectName: 'tg_pv' + i }); s.addText(l[1], { shape: pres.shapes.OVAL, x: 12.3, y: l[3] + 0.14, w: 0.42, h: 0.42, fill: { color: G[l[0]][0] }, line: { color: G[l[0]][0] }, fontSize: 14, bold: true, align: 'center', valign: 'middle', color: INK, isTextBox: true }); });
lv.forEach((l, i) => { target(s, 'pv' + i, l[2], { x: 9.62, y: l[3] + 0.08, w: 2.62, h: 0.54, fontSize: 14, fill: { color: 'FFFFFF' }, line: { color: 'FFFFFF' } }); star(s, 'pv' + i, 9.3, l[3] + 0.15, 0.38); });
textBox(s, 'في الصورة: الحبوب في القاعدة، ثم الخضروات والفواكه، ثم اللحوم والأسماك والحليب ومشتقاته، والدهون في القمة.', { x: 2.95, y: 6.0, w: 9.85, h: 0.62, fontSize: 14, bold: true, color: LEAF, fill: { color: LEAFLT }, line: { color: LEAFLT } });
s.addNotes('الهرم الغذائي (٤ دقائق) باستراتيجية التعلم التعاوني: تتأمل كل مجموعة طالبات مستوى من الهرم في صورة الكتاب ص ١٧٨ وتسمّي أطعمته. تلمس الطالبة كل مستطيل لكشف المجموعات الخمس كما وردت في الكتاب: الحبوب، الخضروات والفواكه، اللحوم والأسماك، الحليب ومشتقاته، الدهون. وضّحي: كلما اتسع المستوى في الهرم احتجنا كمية أكبر منه، والقمة نتناول منها القليل.');

// test 3 (p178)
pres.addSection({ title: 'التقويم' });
s = slideOf('BOARD', 'أختبر نفسي (٣)', ST('التصنيف', 'الشرح والتفسير · أختبر نفسي ص ١٧٨'), 'التقويم');
bookPic(s, 'book-test3', 0.6, 1.4, 5.7, 1.5, 'أختبر نفسي · ص ١٧٨');
T(s, [R('التفكير الناقد: ', { color: ROSE }), R('إجابة نموذجية')], { x: 0.6, y: 3.35, w: 5.7, h: 0.4, fontSize: 16, bold: true });
binBox(s, 'fat', 'إمداد الجسم بالطاقة', 9.9, 1.4, 2.9, 3.4); binBox(s, 'min', 'النمو وبناء العظام', 6.8, 1.4, 2.9, 3.4);
const t3 = [['البروتينات', 6.95, 2.05], ['الدهون', 10.05, 3.3], ['الكربوهيدرات', 10.05, 2.05], ['الأملاح المعدنية', 6.95, 3.3]];
t3.reduce((x, a, i) => { const w = 0.45 + a[0].length * 0.11; chip(s, a[0], x - w, 5.0, w, PLAQUE, { line: { color: WOODD, width: 1.5 }, fontSize: 15, h: 0.5, objectName: 'tg_t3' + i }); return x - w - 0.12; }, 12.8);
t3.forEach((a, i) => { target(s, 't3' + i, a[0], { x: a[1], y: a[2], w: 2.6, h: 1.0, align: 'center', fontSize: 19 }); star(s, 't3' + i, a[1] + 2.2, a[2] - 0.15, 0.45); });
hint(s, 'المسي البطاقة لتنتقل إلى مجموعتها الصحيحة.', 6.8, 5.6, 6.0);
reveal(s, 'لأنه يوضح أنواع الأطعمة التي يحتاجها الإنسان يوميًا وكمياتها؛ فيساعدنا على اختيار الطعام الصحي.', { x: 0.6, y: 3.8, w: 5.7, h: 1.2, fontSize: 17 });
girl(s, null, { x: 3.0, y: 5.05, w: 1.0 });
s.addNotes('أختبر نفسي ٣ من الكتاب ص ١٧٨ (٣ دقائق). أصنّف (البروتينات – الدهون – الكربوهيدرات – الأملاح المعدنية) إلى مجموعتين حسب فوائدها: إمداد الجسم بالطاقة (الكربوهيدرات والدهون)، والنمو وبناء العظام (البروتينات والأملاح المعدنية). تلمس الطالبة البطاقة فتنتقل إلى مجموعتها مع نجمة، ثم سؤال التفكير الناقد (بالنقر): لماذا يعد الهرم الغذائي مهمًا في تناول الغذاء المتوازن؟');

qgrid('التقويم الختامي المصوّر', ST(null, 'التقويم الختامي المصوّر'), [
  { lab: 'اختيار من متعدد', img: 'f-bread', q: 'الخبز من مصادر:', opts: ['الكربوهيدرات', 'الدهون', 'الماء'], ans: 0, a: 'الإجابة: الكربوهيدرات' },
  { lab: 'تصنيف مصوّر: أختار مجموعة كل طعام', mini: [['f-oil', 'الزيت', 'الدهون'], ['f-eggs', 'البيض', 'البروتينات'], ['f-orange', 'البرتقال', 'الفيتامينات']] },
  { lab: 'أصحّح المفهوم', q: '«الفيتامينات هي المصدر الرئيس للطاقة في الجسم.»', opts: ['صحيحة', 'خاطئة'], ans: 1, a: 'خاطئة: الكربوهيدرات هي المصدر الرئيس للطاقة غالبًا.' },
  { lab: 'تفكير ناقد', q: 'تتناول ريم الوجبات الغنية بالدهون كل يوم، ولا تأكل الخضروات. بماذا تنصحينها؟ ولماذا؟', a: 'أنصحها بأن تقلّل الدهون؛ لأن الإكثار منها يسبب السمنة وأمراض القلب، وأن تأكل الخضروات لتحصل على الفيتامينات والأملاح المعدنية.' },
], 'التقويم الختامي (٥ دقائق). تجيب الطالبات كتابيًا في ورقة أو على السبورة، ثم انقري لإظهار الإجابات بالترتيب. سؤال التفكير الناقد شفهي: استمعي لأكثر من نصيحة قبل إظهار الإجابة النموذجية.');

// exit ticket
s = slideOf('BOARD', 'ماذا تعلمت اليوم؟', ST('تذكرة الخروج', 'التقويم'), 'التقويم');
const ex = [[[R('أصنّف: ', { color: ROSE }), R('البيض من مصادر أي مادة غذائية؟')], 'f-eggs', 'البروتينات'], [[R('أختار: ', { color: ROSE }), R('أيهما مصدر للكربوهيدرات: الأرز أم الزيت؟')], 'f-rice', 'الأرز'], [[R('أفسّر: ', { color: ROSE }), R('لماذا يحتاج جسمي إلى الماء؟')], 'f-water', 'يساعد الجسم على الهضم، والتخلص من الفضلات، والمحافظة على درجة حرارته ثابتة.']];
ex.forEach((e, i) => {
  const y = 1.4 + i * 1.32;
  box(s, { x: 3.9, y, w: 8.9, h: 1.2, line: { color: ROSELT, width: 2 } });
  T(s, e[0], { x: 6.2, y: y + 0.05, w: 6.45, h: 0.6, fontSize: 19, bold: true });
  if (i === 0) {
    pic(s, im('f-eggs'), 4.1, y + 0.17, 1.2, 0.85, WOOD);
    const q = 'ex0'; [['الدهون', 0], ['البروتينات', 1], ['الماء', 0]].reduce((x, o, k) => { const w = 0.4 + o[0].length * 0.12; chip(s, o[0], x - w, y + 0.68, w, WHITE, { line: { color: WOOD, width: 2 }, fontSize: 14, h: 0.4, objectName: (o[1] ? 'tg_' : 'tw_') + q + (o[1] ? '' : 'w' + k) }); if (o[1]) star(s, q, x - 0.22, y + 0.52, 0.32); return x - w - 0.12; }, 12.65);
    target(s, q, 'صحيح! البيض من مصادر البروتينات.', { x: 5.4, y: y + 0.66, w: 3.25, h: 0.45, fontSize: 12, margin: 2 });
  } else if (i === 1) {
    pic(s, im('f-rice'), 5.0, y + 0.12, 1.0, 0.7, WOOD); pic(s, im('f-oil'), 4.05, y + 0.12, 0.8, 0.7, WOOD);
    hotspot(s, 'ex1', 4.95, y + 0.07, 1.1, 0.8); s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 4.0, y: y + 0.07, w: 0.9, h: 0.8, rectRadius: 0.1, fill: { color: 'FFFFFF', transparency: 99 }, line: { color: 'FFFFFF', transparency: 100 }, objectName: 'tw_ex1w' });
    star(s, 'ex1', 5.75, y - 0.05, 0.38);
    target(s, 'ex1', 'صحيح! الأرز من مصادر الكربوهيدرات.', { x: 6.2, y: y + 0.66, w: 6.45, h: 0.45, fontSize: 14 });
    T(s, 'المسي الصورة الصحيحة', { x: 3.95, y: y + 0.84, w: 2.2, h: 0.3, fontSize: 11, bold: true, color: LEAF, align: 'center', margin: 0 });
  } else {
    pic(s, im(e[1]), 4.5, y + 0.12, 1.2, 0.85, WOOD);
    reveal(s, e[2], { x: 6.2, y: y + 0.66, w: 6.45, h: 0.45, fontSize: 14 });
  }
});
textBox(s, [R('السؤال الأساسي: كيف يكون غذاؤنا صحيًا؟', { color: ROSE }), R('  (تجيب الطالبات بكلماتهن)', { color: '7A6660', fontSize: 13 })], { x: 3.9, y: 5.4, w: 8.9, h: 0.55, fontSize: 17, bold: true, line: { color: LEAFLT, width: 2 } });
reveal(s, 'عندما يكون غذاءً متوازنًا يحتوي على جميع أنواع الغذاء الذي يحتاج إليه الجسم وبكميات مناسبة.', { x: 3.9, y: 6.0, w: 8.9, h: 0.6, fontSize: 15 });
textBox(s, 'أقيّم فهمي', { x: 0.6, y: 1.4, w: 3.05, h: 0.5, fill: { color: 'B14F68' }, line: { color: 'B14F68' }, color: WHITE, align: 'center', fontSize: 17, bold: true, rectRadius: 0.25 });
[['فهمت جيدًا', 'BFE3A9'], ['فهمت بعض الأجزاء', 'F8E3A1'], ['أحتاج إلى مساعدة', 'F6C2CC']].forEach((f, i) => {
  const y = 2.05 + i * 0.85;
  box(s, { x: 0.6, y, w: 3.05, h: 0.72, line: { color: WOOD, width: 2 } });
  s.addShape(pres.shapes.OVAL, { x: 3.0, y: y + 0.11, w: 0.5, h: 0.5, fill: { color: f[1] }, line: { color: f[1] } });
  T(s, f[0], { x: 0.7, y, w: 2.25, h: 0.72, fontSize: 15, bold: true });
});
s.addImage({ path: IMG + 'girl-cut-present.png', x: 0.95, y: 4.65, w: 1.45, h: 2.16 });
s.addNotes('تذكرة الخروج (٣ دقائق). تجيب كل طالبة عن الأسئلة الثلاثة في بطاقة ورقية أو شفهيًا قبل الخروج، ثم انقري لإظهار الإجابات، ثم أجيبي معهن عن السؤال الأساسي. «أقيّم فهمي»: ترفع كل طالبة يدها عند مستواها؛ تابعي في الحصة القادمة الطالبات اللاتي اخترن «أحتاج إلى مساعدة». عودي إلى شريحة نواتج التعلم وضعي علامة على ما تحقق. الشريحة التالية نسخة مصوّرة من تذكرة الخروج للطباعة، وبعدها الملخص المصوّر ومراجعة الدرس بحلولها.');

// printable exit ticket
s = slideOf('FULL', '', '', 'التقويم');
s.background = { path: im('slide-exit') };
s.addNotes('تذكرة الخروج المصوّرة: نسخة جاهزة للطباعة أو العرض.');

pres.addSection({ title: 'المراجعة' });
// picture summary + foldable (p179)
s = slideOf('BOARD', 'ملخص مصوّر', ST('المطويات', 'التقويم · ص ١٧٩'), 'المراجعة');
bookPic(s, 'book-summary', 0.6, 1.4, 3.45, 5.0, 'ملخص مصوّر · ص ١٧٩');
girl(s, null, { x: 10.85, y: 3.45, w: 1.95 });
[['يتكوّن الغذاء الصحي المتوازن من الكربوهيدرات والبروتينات والدهون والألياف والأملاح المعدنية والماء.', 'F6C9A4'], ['تساعد البروتينات على بناء خلايا الجسم، كما تزوّد الكربوهيدرات والدهون الجسم بالطاقة اللازمة للقيام بالأنشطة الحياتية اليومية.', G.prot[0]], ['الهرم الغذائي: هو دليل غذائي على شكل مثلث يحدد حاجات الأفراد الغذائية التي يجب تناولها.', G.carb[0]]].forEach((t, i) =>
  textBox(s, t[0], { x: 4.3, y: 1.4 + i * 1.15, w: 6.35, h: 1.02, fontSize: 16, bold: true, line: { color: t[1], width: 2.5 } }));
textBox(s, [R('المطويات · أنظّم أفكاري', { color: ROSE, breakLine: true }), R('أعمل مطوية ألخّص فيها ما تعلمته عن المواد الغذائية: الكربوهيدرات، البروتينات، الدهون، الفيتامينات، الماء، الأملاح المعدنية.')], { x: 4.3, y: 4.95, w: 6.35, h: 1.45, fontSize: 15, bold: true, fill: { color: LEAFLT }, line: { color: LEAFL, width: 2 } });
s.addNotes('ملخص مصوّر والمطويات من الكتاب ص ١٧٩ (٤ دقائق). اقرئي جمل الملخص مع الطالبات. المطويات: تصمم كل طالبة مطوية بست طيات، تكتب على كل طية اسم مادة غذائية وفائدتها ومثالًا من مصادرها. تنبيه: جملة الملخص في الكتاب تذكر الألياف ولا تذكر الفيتامينات، فذكّري الطالبات بأن المجموعات الست في ص ١٧٤ هي: الكربوهيدرات والبروتينات والدهون والفيتامينات والأملاح والماء. إثراء من الكتاب: «العلوم والكتابة» مقال عن أهمية الغذاء الصحي المتوازن، و«العلوم والفن» لوحة صور لأطعمة مصنّفة حسب مجموعاتها.');

qgrid('مراجعة الدرس (١)', ST('التعلم التعاوني', 'التقويم · مراجعة الدرس ص ١٧٩'), [
  { lab: 'المفردات', q: '................ يشكّل ثلثي جسم الإنسان تقريبًا، ويساعد على التخلص من الفضلات، ويحافظ على درجة حرارة الجسم.', a: 'الماء' },
  { lab: 'أصنّف مكونات فطيرة التفاح', q: 'الدقيق – الزبدة – البيض – التفاح – السكر – الماء', a: 'كربوهيدرات: الدقيق والسكر · دهون: الزبدة · بروتينات: البيض · فيتامينات: التفاح · ماء: الماء' },
  { lab: 'التفكير الناقد', q: 'لماذا يجب شرب الحليب بشكل عام، وفي السنوات الأولى من عمر الطفل بشكل خاص؟', a: 'لأنه مصدر للبروتينات التي تساعد على النمو، وللكالسيوم الذي يكوّن العظام، والطفل في مرحلة نمو.' },
  { lab: 'أختار الإجابة الصحيحة', q: 'تساعد الجسم على النمو وتعويض الخلايا التالفة فيه:', opts: ['الدهون', 'الأملاح المعدنية', 'البروتينات', 'الألياف'], ans: 2, a: 'الإجابة: ج- البروتينات' },
], 'مراجعة الدرس من الكتاب ص ١٧٩ (٤ دقائق) باستراتيجية التعلم التعاوني: وزّعي الأسئلة على أربع مجموعات، كل مجموعة تجيب عن سؤال وتعرض إجابتها، ثم انقري لإظهار الإجابات بالترتيب. والسؤال الخامس (السؤال الأساسي) في الشريحة التالية.', ['book-review', 'مراجعة الدرس · ص ١٧٩'], 'المراجعة');

// lesson review (2): essential question + science & writing + science & art, with answers
s = slideOf('BOARD', 'مراجعة الدرس (٢)', ST('التعلم التعاوني', 'التقويم · مراجعة الدرس ص ١٧٩'), 'المراجعة');
bookPic(s, 'book-review', 0.6, 1.4, 3.3, 4.95, 'مراجعة الدرس · ص ١٧٩');
box(s, { x: 4.1, y: 1.4, w: 8.7, h: 2.3, line: { color: LEAFLT, width: 2 } });
numDot(s, 5, 12.25, 1.52);
T(s, [R('السؤال الأساسي: ', { color: ROSE }), R('كيف يكون غذاؤنا صحيًا؟')], { x: 4.3, y: 1.5, w: 7.85, h: 0.5, fontSize: 20, bold: true });
reveal(s, 'يكون غذاؤنا صحيًا عندما يكون متوازنًا؛ أي نتناول الكمية المناسبة من الأطعمة كل يوم، بحيث تحتوي على جميع أنواع الغذاء الذي يحتاج إليه الجسم: الكربوهيدرات والبروتينات والدهون والفيتامينات والأملاح والماء، ويساعدنا الهرم الغذائي على اختيارها.', { x: 4.3, y: 2.1, w: 8.3, h: 1.45, fontSize: 15 });
[[8.6, 'العلوم والكتابة', 'أهمية الغذاء: أكتب مقالًا أوضّح فيه أهمية الغذاء الصحي المتوازن، وأعرضه على زميلاتي في الصف.', 'عناصر المقال: مقدمة تعرّف الغذاء المتوازن، ثم فوائده (الطاقة، والنمو، والمحافظة على صحة الجسم)، ثم مثال لوجبة متوازنة، وخاتمة بنصيحة.'],
 [4.1, 'العلوم والفن', 'لوحة صور: أجمع صورًا لأطعمة مختلفة، وأصنّفها حسب المجموعة الغذائية التي تنتمي إليها، ثم أنظّمها على لوحة.', 'أقسّم اللوحة إلى ست خانات بأسماء المجموعات الست، وألصق كل صورة في خانتها، مثل: الخبز في الكربوهيدرات، والبيض في البروتينات، والبرتقال في الفيتامينات.']].forEach(c => {
  box(s, { x: c[0], y: 3.9, w: 4.2, h: 2.75, line: { color: 'F2D27A', width: 2.5 } });
  textBox(s, c[1], { x: c[0] + 0.15, y: 4.0, w: 3.9, h: 0.45, fill: { color: 'FBEFC8' }, line: { color: 'FBEFC8' }, align: 'center', fontSize: 17, bold: true, color: MAROON });
  T(s, c[2], { x: c[0] + 0.15, y: 4.5, w: 3.9, h: 0.85, fontSize: 14, bold: true, valign: 'top' });
  reveal(s, c[3], { x: c[0] + 0.15, y: 5.4, w: 3.9, h: 1.15, fontSize: 13 });
});
s.addNotes('مراجعة الدرس (٢) من الكتاب ص ١٧٩ (٤ دقائق). السؤال الخامس (السؤال الأساسي): تجيب الطالبات بكلماتهن، ثم انقري لإظهار الإجابة النموذجية. «العلوم والكتابة» و«العلوم والفن» مهمتان إثرائيتان يمكن تكليف الطالبات بهما واجبًا منزليًا؛ انقري لإظهار ما يُنتظر في كل منهما.');

/* 2x2 question grid next to an optional book image */
function qgrid(title, strat, cards, notes, book, section) {
  const s = slideOf('BOARD', title, strat, section || 'التقويم');
  const X0 = book ? 4.1 : 0.6, CW = book ? 4.25 : 5.95, GAP = 0.25;
  if (book) bookPic(s, book[0], 0.6, 1.4, 3.3, 4.95, book[1]);
  cards.forEach((c, i) => {
    const x = i % 2 ? X0 : X0 + CW + GAP, y = 1.4 + Math.floor(i / 2) * 2.68, w = CW, h = 2.5;
    box(s, { x, y, w, h, line: { color: LEAFLT, width: 2 } });
    numDot(s, i + 1, x + w - 0.55, y + 0.12);
    T(s, c.lab, { x: x + 0.2, y: y + 0.1, w: w - 0.85, h: 0.42, fontSize: 15, bold: true, color: ROSE });
    if (c.mini) {
      c.mini.forEach((m, k) => { const mx = x + w - 1.9 - k * 1.9; pic(s, im(m[0]), mx + 0.2, y + 0.6, 1.3, 0.8, WOOD); T(s, m[1], { x: mx, y: y + 1.45, w: 1.7, h: 0.35, align: 'center', fontSize: 14, bold: true, color: '7A6660' }); });
      c.mini.forEach((m, k) => { const mx = x + w - 1.9 - k * 1.9, q = newQ(); hotspot(s, q, mx + 0.15, y + 0.55, 1.4, 0.9); target(s, q, m[2], { x: mx + 0.1, y: y + 1.85, w: 1.5, h: 0.45, align: 'center', fontSize: 14, margin: 2 }); star(s, q, mx + 1.3, y + 0.45, 0.4); });
      return;
    }
    if (c.img) pic(s, im(c.img), x + 0.2, y + 0.65, 1.55, 1.1, WOOD);
    T(s, c.q, { x: x + 0.2 + (c.img ? 1.75 : 0), y: y + 0.55, w: w - 0.4 - (c.img ? 1.75 : 0), h: c.opts ? 0.85 : 1.0, fontSize: book ? 15 : 17, bold: true, valign: 'top' });
    if (c.opts) { const q = newQ();
      const total = c.opts.reduce((t, o) => t + 0.45 + o.length * 0.105, 0), two = total > w - 0.4;
      c.opts.forEach((o, i) => {
        const ow = two ? (w - 0.6) / 2 : 0.35 + o.length * 0.105, ok = i === c.ans;
        const ox = two ? x + w - 0.2 - (i % 2 + 1) * ow - (i % 2) * 0.2 : x + w - 0.2 - c.opts.slice(0, i + 1).reduce((t, p) => t + 0.35 + p.length * 0.105, 0) - i * 0.1;
        const oy = two ? y + 1.2 + Math.floor(i / 2) * 0.42 : y + 1.42;
        chip(s, (two ? 'أ ب ج د'.split(' ')[i] + '- ' : '') + o, ox, oy, ow, WHITE, { line: { color: WOOD, width: 2 }, fontSize: 13, h: two ? 0.36 : 0.4, objectName: (ok ? 'tg_' : 'tw_') + q + 'o' + i });
        if (ok) star(s, q + 'o' + i, ox - 0.12, oy - 0.25, 0.36);
      });
      target(s, q + 'o' + c.ans, c.a, { x: x + 0.2, y: y + (two ? 2.05 : 1.9), w: w - 0.4, h: two ? 0.4 : 0.5, fontSize: 13 }); }
    else reveal(s, c.a, { x: x + 0.2, y: y + 1.6, w: w - 0.4, h: 0.8, fontSize: 13 });
  });
  s.addNotes(notes);
  return s;
}


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
    const eff = (sp, kind, node) => {
      const [pid, cls, body] = kind === 'star' ? [53, 'entr', starFx(sp)] : kind === 'shake' ? [32, 'emph', shake(sp)] : [10, 'entr', fade(sp)];
      return `<p:par><p:cTn id="${nid()}" presetID="${pid}" presetClass="${cls}" presetSubtype="0" fill="hold"${isSp.has(sp) ? ' grpId="0"' : ''} nodeType="${node}"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>${body}</p:childTnLst></p:cTn></p:par>`;
    };
    const animated = new Set();
    // main click sequence (rv01, rv02, ...)
    const rv = Object.keys(all).filter(k => /^rv\d\d$/.test(k)).sort();
    let main = '';
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
    stats.rv += rv.length;
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
