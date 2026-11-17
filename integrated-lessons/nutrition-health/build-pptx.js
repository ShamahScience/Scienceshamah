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
    { text: { text: '', options: { shape: 'roundRect', rectRadius: 0.2, x: 0.45, y: 0.36, w: 2.9, h: 0.74, fill: { color: ROSELT }, line: { color: ROSEL, width: 1.5 } } } },
    { placeholder: { options: { name: 'title', type: 'title', x: 4.05, y: 0.34, w: 5.23, h: 0.78, align: 'center', valign: 'middle', fontSize: 30, bold: true, color: MAROON, rtlMode: true, margin: 0 }, text: '' } },
    { placeholder: { options: { name: 'strat', type: 'body', x: 0.45, y: 0.36, w: 2.9, h: 0.74, align: 'center', valign: 'middle', fontSize: 15, bold: true, color: ROSE, rtlMode: true, margin: 2 }, text: '' } },
    { text: { text: '', options: { shape: 'roundRect', rectRadius: 0.2, x: 5.22, y: 6.86, w: 2.9, h: 0.42, fill: { color: PLAQUE }, line: { color: WOODD, width: 1 } } } },
    { text: { text: SIG, options: { x: 5.22, y: 6.86, w: 2.9, h: 0.42, align: 'center', valign: 'middle', fontSize: 16, bold: true, color: MAROON, rtlMode: true, margin: 0 } } },
  ],
});
pres.defineSlideMaster({ title: 'FULL', background: { color: 'FFFFFF' }, objects: [] });

/* ---------- helpers ---------- */
let rvCount = 0, curSlide = null;
function slideOf(master, title, strat, section) {
  const s = pres.addSlide({ masterName: master, sectionTitle: section });
  rvCount = 0; curSlide = s;
  if (master === 'BOARD') {
    s.addText(title, { placeholder: 'title', bold: true, fontSize: 30, color: MAROON });
    if (strat) s.addText(strat, { placeholder: 'strat', bold: true, fontSize: 15, color: ROSE });
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
function numDot(s, n, x, y, fill) {
  s.addText(AR(n), { shape: pres.shapes.OVAL, x, y, w: 0.42, h: 0.42, fill: { color: fill || ROSE }, color: WHITE, bold: true, fontSize: 15, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
}

/* ================= SLIDES ================= */
// 1 opening
pres.addSection({ title: 'البداية' });
let s = slideOf('FULL', '', '', 'البداية');
s.background = { path: im('slide-opening') };
T(s, '', { x: 2.29, y: 0.74, w: 1.36, h: 0.32, align: 'center', fontSize: 16, bold: true, color: MAROON, objectName: 'day' });
T(s, '', { x: 8.96, y: 0.74, w: 1.36, h: 0.32, align: 'center', fontSize: 16, bold: true, color: MAROON, objectName: 'date' });
s.addNotes('الافتتاحية (دقيقتان): اكتبي اليوم والتاريخ في الخانتين أعلى الشريحة (في وضع التحرير). اقرئي القوانين الصفية مع الطالبات، وأشيري إلى مخطط الدرس واستراتيجيات التعلم.');

// 2 warm-up
s = slideOf('BOARD', 'التهيئة', 'فكّر وأجب\nمراجعة التعلم السابق', 'البداية');
s.addImage({ path: im('girl-present'), x: 0.55, y: 1.3, w: 2.95, h: 5.28 });
textBox(s, 'لماذا نحتاج إلى تناول الطعام وشرب الماء كل يوم؟', { x: 3.9, y: 1.4, w: 8.9, h: 1.3, fontSize: 30, bold: true, color: MAROON, align: 'center', line: { color: ROSEL, width: 2 }, rectRadius: 0.3 });
['أفكّر بصمت', 'أرفع يدي', 'أجيب'].forEach((t, i) => {
  const x = 9.9 - i * 3.0;
  box(s, { x, y: 2.95, w: 2.9, h: 0.62, fill: { color: LEAFLT }, line: { color: LEAFLT } });
  numDot(s, i + 1, x + 2.38, 3.05, LEAF);
  T(s, t, { x: x + 0.1, y: 2.95, w: 2.2, h: 0.62, fontSize: 18, bold: true });
});
T(s, 'الإجابات المتوقعة تظهر بالنقر:', { x: 8.3, y: 3.75, w: 4.5, h: 0.4, fontSize: 15, color: LEAF, bold: true });
[['الطاقة', 'لنتحرك ونلعب ونتعلم'], ['النمو', 'لتكبر أجسامنا بشكل سليم'], ['الصحة', 'لنحافظ على أجسامنا سليمة']].forEach((a, i) => {
  reveal(s, [{ text: a[0], options: { fontSize: 26, bold: true, breakLine: true } }, { text: a[1], options: { fontSize: 15, bold: false, color: INK } }],
    { x: 9.9 - i * 3.0, y: 4.2, w: 2.9, h: 1.25, align: 'center' });
});
textBox(s, 'سؤال إضافي: ماذا تناولتِ على الإفطار اليوم؟ هل كان مفيدًا لجسمك؟', { x: 3.9, y: 5.75, w: 8.9, h: 0.6, fontSize: 17, bold: true, color: LEAF, fill: { color: LEAFLT }, line: { color: LEAFLT }, rectRadius: 0.3 });
s.addNotes('التهيئة: فكّر وأجب (٤ دقائق). اعرضي السؤال، وامنحي الطالبات ٣٠ ثانية تفكير دون رفع الأيدي. استقبلي ٣–٤ إجابات، ثم انقري لإظهار الإجابات المتوقعة (الطاقة، النمو، الصحة). اربطي: «سنتعرّف اليوم كيف نختار غذاءً يمنحنا هذه الثلاثة». فروق فردية: للطالبة المتعثرة اطرحي السؤال الإضافي عن الإفطار.');

// 3 outcomes
s = slideOf('BOARD', 'نواتج التعلم', 'نواتج التعلم\nنعود إليها في نهاية الدرس', 'البداية');
guide(s, 'في نهاية الدرس سنضع علامة على ما حققناه!');
const outc = [['أوضّح', ' أهمية الغذاء المتوازن لصحة الجسم.'], ['أتعرّف', ' مجموعات المواد الغذائية الست وفوائدها ومصادرها.'], ['أصنّف', ' الأطعمة حسب مجموعات المواد الغذائية.'], ['أقرأ', ' الملصقات الغذائية وأستفيد منها في اختيار غذائي.'], ['أكوّن', ' وجبة متوازنة، وأستخدم الهرم الغذائي في اختيار الطعام الصحي.']];
outc.forEach((o, i) => {
  const col = i % 2, row = Math.floor(i / 2);
  let x = col === 0 ? 6.75 : 0.6, w = 6.0, y = 1.55 + row * 1.6;
  if (i === 4) { x = 3.2; w = 6.9; }
  box(s, { x, y, w, h: 1.3 });
  s.addShape(pres.shapes.OVAL, { x: x + w - 0.85, y: y + 0.37, w: 0.56, h: 0.56, fill: { color: WHITE }, line: { color: ROSEL, width: 3 } });
  T(s, [{ text: o[0], options: { color: ROSE, bold: true } }, { text: o[1] }], { x: x + 0.2, y, w: w - 1.15, h: 1.3, fontSize: 20, bold: true });
});
s.addNotes('نواتج التعلم (دقيقة). اقرئي النواتج، وركّزي على الأفعال الملوّنة لأنها ما ستقيسه التقويمات. في نهاية الحصة عودي لهذه الشريحة وضعي علامة صح بقلم السبورة على كل ناتج تحقق.');

// 4 vocabulary
pres.addSection({ title: 'الاستكشاف' });
s = slideOf('BOARD', 'مفردات الدرس', 'البطاقات المصوّرة\nأخمّن ثم أنقر لأتحقق', 'الاستكشاف');
guide(s, 'أخمّن المعنى أولًا، ثم أنقر لأرى التعريف.');
const vocab = [
  ['الغذاء المتوازن', 'healthy-plate', 'F6C9A4', 'غذاء يحتوي على جميع أنواع المواد الغذائية التي يحتاج إليها الجسم بكميات مناسبة.'],
  ['الكربوهيدرات', 'book-carbs', G.carb[0], 'المصدر الرئيس للطاقة في الجسم غالبًا.'],
  ['البروتينات', 'book-protein', G.prot[0], 'تساعد الجسم على النمو وتعويض الخلايا التالفة.'],
  ['الدهون', 'book-fats', G.fat[0], 'تزوّد الجسم بالطاقة والدفء، وتساعد الخلايا على العمل بشكل سليم.'],
  ['الفيتامينات', 'book-vitamins', G.vit[0], 'تحافظ على صحة الجسم، وتبني خلايا جديدة، وتقي من الأمراض.'],
  ['الأملاح المعدنية', 'book-minerals', G.min[0], 'تساعد على تكوين العظام وخلايا الدم الجديدة، مثل الكالسيوم والحديد.'],
  ['الهرم الغذائي', 'book-pyramid', 'E7CFA8', 'دليل غذائي على شكل مثلث يحدد حاجات الأفراد الغذائية التي يجب تناولها.'],
];
vocab.forEach((v, i) => {
  const row = i < 4 ? 0 : 1, idx = row ? i - 4 : i, n = row ? 3 : 4, w = 2.85, gap = 0.25;
  const total = n * w + (n - 1) * gap, x0 = (13.333 + total) / 2 - w - idx * (w + gap);
  const y = 1.4 + row * 2.72;
  box(s, { x: x0, y, w, h: 2.5, line: { color: v[2], width: 3 } });
  s.addImage({ path: im(v[1]), x: x0 + 0.08, y: y + 0.08, w: w - 0.16, h: 1.6, sizing: { type: v[1] === 'book-pyramid' ? 'contain' : 'cover', w: w - 0.16, h: 1.6 } });
  T(s, v[0], { x: x0, y: y + 1.72, w, h: 0.7, align: 'center', fontSize: 22, bold: true, color: MAROON });
  rvCount++;
  s.addText([{ text: v[0], options: { bold: true, fontSize: 20, color: MAROON, breakLine: true } }, { text: v[3], options: { fontSize: 16, color: INK, bold: true } }],
    { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.14, x: x0, y, w, h: 2.5, fill: { color: v[2] }, line: { color: v[2], width: 3 }, align: 'center', valign: 'middle', rtlMode: true, margin: 10, objectName: 'rv' + String(rvCount).padStart(2, '0') });
});
s.addNotes('المفردات (٣ دقائق). اطلبي من طالبة أن تخمّن معنى المفردة من الصورة، ثم انقري ليظهر التعريف فوق البطاقة (بالترتيب من اليمين). فروق فردية: اطلبي من المتميزات ذكر مثال لكل مفردة من وجبات البيت.');

// 5 look & wonder
s = slideOf('BOARD', 'أنظر وأتساءل', 'أنظر وأتساءل\nالكتاب ص ١٧٢', 'الاستكشاف');
pic(s, im('book-plate'), 0.6, 1.4, 4.3, 5.2, WHITE);
textBox(s, [{ text: 'أنظرُ وأتساءلُ', options: { bold: true, fontSize: 20, color: '1F6FA5', breakLine: true } }, { text: 'يحتاج الإنسان إلى تناول مجموعة من الأطعمة التي تشكّل الغذاء الصحي الأكثر توازنًا. هل يمكن أن تُعدّد الأطعمة التي تشكّل غذاءً متوازنًا لصحة الجسم؟', options: { fontSize: 17 } }],
  { x: 5.25, y: 1.4, w: 7.55, h: 1.45, line: { color: '3A9BD5', width: 2.5 } });
T(s, 'ماذا أرى في الطبق؟', { x: 10.0, y: 3.0, w: 2.8, h: 0.45, fontSize: 19, bold: true });
[['خضراوات', 1.5], ['ملفوف وخس', 1.6], ['دجاج', 1.1], ['بقوليات', 1.3]].reduce((x, a) => { reveal(s, a[0], { x: x - a[1], y: 3.02, w: a[1], h: 0.42, align: 'center', fontSize: 15, rectRadius: 0.2, margin: 2 }); return x - a[1] - 0.15; }, 9.9);
textBox(s, [{ text: 'السؤال الأساسي', options: { fontSize: 14, color: ROSE, bold: true, breakLine: true } }, { text: 'كيف يكون غذائي صحيًا؟', options: { fontSize: 32, bold: true, color: MAROON } }],
  { x: 5.25, y: 3.65, w: 7.55, h: 1.25, align: 'center', fill: { color: ROSELT }, line: { color: ROSEL, width: 2, dashType: 'dash' }, rectRadius: 0.25 });
textBox(s, 'تساؤلات الطالبات:', { x: 5.25, y: 5.05, w: 7.55, h: 1.55, valign: 'top', fontSize: 16, color: '7A6660', line: { color: WOOD, width: 2 } });
s.addNotes('أنظر وأتساءل (٣ دقائق). اطلبي من الطالبات تأمل الطبق، ثم تسمية ما فيه، وانقري لإظهار مكوناته واحدًا تلو الآخر. اطرحي السؤال الأساسي، واكتبي تساؤلات الطالبات في المساحة المخصصة. لا تجيبي عن السؤال الأساسي الآن؛ ستجيب عنه الطالبات في تذكرة الخروج.');

// 6 explore
s = slideOf('BOARD', 'أستكشف', 'الاستقصاء\nنشاط استقصائي ص ١٧٣', 'الاستكشاف');
const labels = [['f-milk', 'حليب كامل الدسم · ١٠٠ مل', ['٤٫٨ جم', '٣٫٣ جم', '٣٫٣ جم', '٠٫٧ جم', 'أ، د']], ['f-bread', 'خبز البُر · ١٠٠ جم', ['٤١ جم', '٣٫٤ جم', '١٣ جم', '٢ جم', 'مجموعة ب']], ['f-oil', 'زيت الزيتون · ١٠٠ مل', ['٠ جم', '١٠٠ جم', '٠ جم', '٠ جم', 'هـ']]];
const nut = ['كربوهيدرات', 'دهون', 'بروتين', 'أملاح', 'فيتامينات'];
labels.forEach((l, i) => {
  const y = 1.35 + i * 1.78;
  box(s, { x: 0.55, y, w: 4.3, h: 1.65, line: { color: '222222', width: 2 }, rectRadius: 0.08 });
  s.addImage({ path: im(l[0]), x: 0.65, y: y + 0.3, w: 1.15, h: 1.05, sizing: { type: 'contain', w: 1.15, h: 1.05 } });
  T(s, l[1], { x: 1.85, y: y + 0.03, w: 2.95, h: 0.33, fontSize: 14, bold: true });
  T(s, nut.map((n, k) => ({ text: n + ': ' + l[2][k], options: { breakLine: k < 4 } })), { x: 1.85, y: y + 0.36, w: 2.95, h: 1.25, fontSize: 13, bold: true, valign: 'top', margin: [0, 4, 0, 4] });
});
T(s, 'كيف تساعدنا ملصقات المنتجات الغذائية على اختيار الغذاء المتوازن؟', { x: 5.15, y: 1.32, w: 7.65, h: 0.55, fontSize: 20, bold: true, color: '1F6FA5' });
['ألاحظ', 'أتواصل', 'أستنتج'].forEach((t, i) => {
  const x = 10.3 - i * 2.55;
  chip(s, t, x, 1.95, 2.4, i === 0 ? '3A9BD5' : 'E5F1FB', { color: i === 0 ? WHITE : '1F6FA5', fontSize: 17, h: 0.46 });
});
T(s, '١ ألاحظ: أسجّل كمية المواد الغذائية بالجرام من الملصقات:', { x: 5.15, y: 2.5, w: 7.65, h: 0.4, fontSize: 15, bold: true });
const hdr = ['المنتج', 'الكربوهيدرات', 'الدهون', 'البروتين', 'الأملاح', 'الفيتامينات'].map(t => ({ text: t, options: { bold: true, color: WHITE, fill: { color: '3A9BD5' }, align: 'center' } }));
const rows = ['الحليب', 'الخبز', 'الزيت'].map(n => [{ text: n, options: { bold: true, fill: { color: 'EEF7FD' }, align: 'center' } }, '', '', '', '', '']);
s.addTable([hdr, ...rows], { x: 5.15, y: 2.92, w: 7.65, colW: [1.25, 1.35, 1.2, 1.2, 1.2, 1.45], rowH: 0.36, fontSize: 14, fontFace: 'Arial', color: INK, border: { type: 'solid', color: '9FCBE8', pt: 1 }, rtlMode: true, align: 'center', valign: 'middle' });
reveal(s, '٢ أتواصل: الخبز أكثرها كربوهيدرات، والزيت كله تقريبًا دهون، ولا يوجد منتج واحد فيه جميع المواد الغذائية بكميات مناسبة.', { x: 5.15, y: 4.5, w: 7.65, h: 0.85, fontSize: 15 });
reveal(s, '٣ أستنتج: الغذاء المتوازن يجمع أطعمة متنوعة، كالخبز مع الحليب وقليل من الزيت والخضراوات والفواكه والماء، والملصق يعرّفني ما في الطعام قبل اختياره.', { x: 5.15, y: 5.45, w: 7.65, h: 0.85, fontSize: 15 });
T(s, 'أستكشف أكثر: أختار ثلاث مواد غذائية في منزلي، وأتفحّص ملصقاتها.', { x: 5.15, y: 6.33, w: 7.65, h: 0.4, fontSize: 14, bold: true, color: '1F6FA5' });
s.addNotes('أستكشف (٧ دقائق). وزّعي الطالبات في مجموعات؛ كل مجموعة تقرأ ملصقًا وتكتب قيمه في الجدول بقلم السبورة. ثم ناقشي (أتواصل) وانقري للإجابة، ثم الاستنتاج. القيم تقريبية لمنتجات شائعة، ويمكن استبدالها بملصقات حقيقية. فروق فردية: المتعثرة تقرأ رقمًا واحدًا (الكربوهيدرات)، والمتميزة تقارن بين المنتجات الثلاثة.');

/* concept slide builder */
function concept({ title, plaque, strat, key, name, tag, fnLabel, fn, warn, sources, chips, life, img, imgCap, contain, check, notes }) {
  const s = slideOf('BOARD', plaque || 'مجموعات المواد الغذائية', strat, 'الشرح');
  const [gl, gd] = key ? G[key] : ['F6C9A4', 'A2552A'];
  pic(s, im(img), 0.6, 1.4, 4.3, 3.0, gl);
  if (contain) { s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.4, w: 4.3, h: 3.0, fill: { color: WHITE }, line: { color: WHITE } }); s.addImage({ path: im(img), x: 0.6, y: 1.4, w: 4.3, h: 3.0, sizing: { type: 'contain', w: 4.3, h: 3.0 } }); }
  T(s, imgCap, { x: 0.6, y: 4.42, w: 4.3, h: 0.32, fontSize: 12, align: 'center', color: '7A6660', bold: true });
  T(s, [{ text: name, options: { fontSize: 30, bold: true, color: gd } }, ...(tag ? [{ text: '   ' + tag, options: { fontSize: 14, color: '7A6660' } }] : [])], { x: 5.2, y: 1.3, w: 7.6, h: 0.6 });
  let y = 1.95;
  fn.forEach((f, i) => {
    const h = f[1];
    textBox(s, [{ text: (fnLabel[i] || 'فائدتها'), options: { fontSize: 13, bold: true, color: gd, breakLine: true } }, ...f[0]], { x: 5.2, y, w: 7.6, h, fontSize: 17, bold: true, line: { color: gl, width: 2 } });
    y += h + 0.12;
  });
  if (warn) { textBox(s, warn, { x: 5.2, y, w: 7.6, h: 0.42, fontSize: 13, bold: true, color: '8D2B3E', fill: { color: 'FBE3E7' }, line: { color: 'FBE3E7' } }); y += 0.5; }
  if (sources) {
    const allChips = sources.every(q => !q.img); const sh = allChips ? 0.85 : 1.05;
    box(s, { x: 5.2, y, w: 7.6, h: sh, line: { color: gl, width: 2 } });
    T(s, chips === 'groups' ? 'مجموعات المواد الغذائية الست' : 'مصادرها', { x: 9.3, y: y + 0.02, w: 3.45, h: 0.3, fontSize: 13, bold: true, color: gd });
    let x = 12.65;
    sources.forEach(src => {
      if (src.img) { x -= 0.95; s.addImage({ path: im(src.img), x, y: y + 0.28, w: 0.88, h: 0.5, sizing: { type: 'cover', w: 0.88, h: 0.5 } }); T(s, src.t, { x: x - 0.1, y: y + 0.78, w: 1.08, h: 0.25, fontSize: 11, align: 'center', bold: true, margin: 0 }); x -= 0.1; }
      else { const w = chips === 'groups' ? 1.12 : 0.25 + src.t.length * 0.1; x -= w; chip(s, src.t, x, y + (allChips ? 0.36 : 0.4), w, src.c || gl, { fontSize: chips === 'groups' ? 11 : 13, h: 0.38, margin: 0 }); x -= 0.1; }
    });
    y += sh + 0.12;
  }
  if (life && y < 4.5) textBox(s, 'من حياتي: ' + life, { x: 5.2, y, w: 7.6, h: 0.46, fontSize: 14, bold: true, color: LEAF, fill: { color: LEAFLT }, line: { color: LEAFLT } });
  // quick check
  box(s, { x: 0.6, y: 4.85, w: 12.2, h: 1.85, line: { color: gl, width: 2, dashType: 'dash' }, rectRadius: 0.2 });
  chip(s, 'تحقق سريع', 11.2, 4.95, 1.45, gl, { fontSize: 14 });
  T(s, check.type, { x: 8.0, y: 4.95, w: 3.1, h: 0.42, fontSize: 14, bold: true, color: gd });
  T(s, check.q, { x: 0.8, y: 5.4, w: 11.85, h: 0.5, fontSize: 19, bold: true });
  let ox = 12.65;
  check.opts.forEach(o => { const w = 0.5 + o.length * 0.15; ox -= w; chip(s, o, ox, 6.0, w, WHITE, { line: { color: WOOD, width: 2 }, fontSize: 16, h: 0.48 }); ox -= 0.15; });
  reveal(s, check.a, { x: 0.8, y: 5.98, w: Math.max(3.2, ox - 0.95), h: 0.55, fontSize: 15 });
  s.addNotes(notes);
  return s;
}
const R = (t, o) => ({ text: t, options: o || {} });
const M = t => ({ text: t, options: { highlight: 'FBEFC8' } });

pres.addSection({ title: 'الشرح' });
concept({ plaque: 'الغذاء وصحة الجسم', strat: 'الشرح والأنشطة\nأقرأ وأتعلم ص ١٧٤', name: 'الغذاء المتوازن', img: 'book-groups', contain: true, imgCap: 'يزوّد الغذاء الجسم بالطاقة اللازمة للأنشطة المختلفة',
  fnLabel: ['لماذا نأكل؟', 'متى يكون غذائي متوازنًا؟'],
  fn: [[[R('توجد '), M('المواد الغذائية'), R(' في الطعام الذي نتناوله، وهي ضرورية لنمو الجسم، وإمداده بالطاقة، والمحافظة عليه سليمًا.')], 0.88],
       [[R('عندما يحتوي على جميع أنواع الغذاء الذي يحتاج إليه الجسم، '), M('وبكميات مناسبة'), R('.')], 0.72]],
  chips: 'groups', sources: [{ t: 'الكربوهيدرات', c: G.carb[0] }, { t: 'البروتينات', c: G.prot[0] }, { t: 'الدهون', c: G.fat[0] }, { t: 'الفيتامينات', c: G.vit[0] }, { t: 'الأملاح المعدنية', c: G.min[0] }, { t: 'الماء', c: G.wat[0] }],
  check: { type: 'أكمل العبارة', q: 'يُسمّى الغذاء الذي يحتوي على جميع أنواع المواد الغذائية بكميات مناسبة: ..................', opts: ['الغذاء السريع', 'الغذاء المتوازن', 'الهرم الغذائي'], a: 'الإجابة: الغذاء المتوازن' },
  notes: 'الغذاء وصحة الجسم (٣ دقائق). اقرئي النص مع الطالبات، وأشيري إلى الكلمات المظللة، وعدّي المجموعات الست بالأصابع. تحقق سريع: تختار الطالبة الكلمة المناسبة من بنك الكلمات، ثم انقري لإظهار الإجابة.' });

concept({ strat: 'الشرح والأنشطة\nالكتاب ص ١٧٥', key: 'carb', name: 'الكربوهيدرات', tag: 'المجموعة ١ من ٦', img: 'book-carbs', imgCap: 'أطعمة غنية بالكربوهيدرات', fnLabel: [],
  fn: [[[R('هي '), M('المصدر الرئيس للطاقة'), R(' في الجسم غالبًا.')], 0.75]],
  sources: [{ img: 'f-rice', t: 'الأرز' }, { img: 'f-bread', t: 'الخبز' }, { t: 'رقائق الذرة' }, { t: 'الحبوب' }, { t: 'التمر' }, { t: 'البطاطس' }],
  life: 'من تتناول إفطارها تجد طاقة للتركيز واللعب في المدرسة.',
  check: { type: 'أختار الإجابة الصحيحة', q: 'المصدر الرئيس للطاقة في الجسم غالبًا هو:', opts: ['البروتينات', 'الكربوهيدرات', 'الماء'], a: 'الإجابة: الكربوهيدرات' },
  notes: 'الكربوهيدرات (دقيقتان). اسألي: ما الطعام الذي يمنحك طاقة قبل حصة التربية البدنية؟ بعد الشرح تختار طالبة الإجابة، ثم انقري لإظهار الإجابة الصحيحة.' });

concept({ strat: 'الشرح والأنشطة\nالكتاب ص ١٧٥', key: 'prot', name: 'البروتينات', tag: 'المجموعة ٢ من ٦', img: 'book-protein', imgCap: 'أطعمة غنية بالبروتين', fnLabel: [],
  fn: [[[R('تساعد الجسم على '), M('النمو'), R(' و'), M('تعويض الخلايا التالفة'), R(' في الجسم.')], 0.75]],
  sources: [{ img: 'f-eggs', t: 'البيض' }, { img: 'f-salmon', t: 'الأسماك' }, { img: 'f-cheese', t: 'الجبن' }, { img: 'f-milk', t: 'الحليب' }, { t: 'البقوليات' }, { t: 'اللحوم' }, { t: 'الدواجن' }],
  life: 'عندما يُجرح إصبعي، تساعد البروتينات على بناء خلايا جديدة.',
  check: { type: 'أصحّح المفهوم', q: '«تساعد الكربوهيدرات الجسم على النمو وتعويض الخلايا التالفة.» العبارة:', opts: ['صحيحة', 'خاطئة'], a: 'خاطئة، والتصحيح: تساعد البروتينات الجسم على النمو وتعويض الخلايا التالفة.' },
  notes: 'البروتينات (دقيقتان). اربطي بالنمو: لماذا يحتاج الأطفال إلى البروتين؟ لأنهم في مرحلة نمو. تحدد الطالبات صحة العبارة وتصححها، ثم انقري لإظهار التصحيح.' });

concept({ strat: 'الشرح والأنشطة\nالكتاب ص ١٧٥', key: 'fat', name: 'الدهون', tag: 'المجموعة ٣ من ٦', img: 'book-fats', imgCap: 'أطعمة غنية بالدهون', fnLabel: [],
  fn: [[[R('تساعد الخلايا على العمل بشكل سليم، وتزوّد الجسم '), M('بالطاقة'), R('، وتمنحه '), M('الدفء'), R('، وتساعد على الاستفادة من الغذاء وتخزين الفيتامينات.')], 1.15]],
  warn: 'انتبهي: الإكثار من الوجبات الغنية بالدهون يسبب الإصابة بالسمنة وبأمراض القلب.',
  sources: [{ img: 'f-oil', t: 'الزيوت النباتية' }, { img: 'f-butter', t: 'الزبدة' }, { t: 'اللحوم' }, { t: 'زيوت الأسماك' }],
  check: { type: 'أصحّح المفهوم', q: '«كلما أكثرنا من تناول الدهون كانت أجسامنا أكثر صحة.» العبارة:', opts: ['صحيحة', 'خاطئة'], a: 'خاطئة: نحتاج كمية مناسبة من الدهون، والإكثار منها يسبب السمنة وأمراض القلب.' },
  notes: 'الدهون (دقيقتان). وضّحي أن الدهون مفيدة بكمية مناسبة، والمشكلة في الإكثار منها. اسألي: ما الوجبات التي فيها دهون كثيرة؟ (المقليات، الوجبات السريعة).' });

// test 1
s = slideOf('BOARD', 'أختبر نفسي (١)', 'التصنيف\nالكتاب ص ١٧٥', 'الشرح');
guide(s, 'أصنّف أولًا، ثم ننقر للتحقق.');
T(s, 'أصنّف: المواد الغذائية التالية إلى مجموعتين', { x: 6.6, y: 1.35, w: 6.2, h: 0.5, fontSize: 21, bold: true, color: MAROON });
const t1 = [['f-eggs', 'بيض', 'prot'], ['f-salmon', 'سمك', 'prot'], ['f-rice', 'أرز', 'carb'], ['f-bread', 'خبز', 'carb']];
t1.forEach((f, i) => { const x = 11.45 - i * 1.5; pic(s, im(f[0]), x, 1.95, 1.3, 0.85, WOOD); T(s, f[1], { x, y: 2.85, w: 1.3, h: 0.32, align: 'center', fontSize: 15, bold: true }); });
[['carb', 'مجموعة الكربوهيدرات', 9.8], ['prot', 'مجموعة البروتينات', 6.6]].forEach(b => {
  box(s, { x: b[2], y: 3.35, w: 3.0, h: 3.3, fill: { color: 'FFFFFF' }, line: { color: G[b[0]][0], width: 3 } });
  textBox(s, b[1], { x: b[2], y: 3.35, w: 3.0, h: 0.5, fill: { color: G[b[0]][0] }, line: { color: G[b[0]][0] }, align: 'center', fontSize: 17, bold: true });
});
let cnt = { carb: 0, prot: 0 };
t1.forEach(f => { const b = f[2] === 'carb' ? 9.8 : 6.6; const k = cnt[f[2]]++; revealImg(s, im(f[0]), { x: b + 0.2 + k * 1.35, y: 4.1, w: 1.25, h: 0.82, sizing: { type: 'cover', w: 1.25, h: 0.82 } }); });
box(s, { x: 0.6, y: 1.4, w: 5.6, h: 5.25, line: { color: ROSELT, width: 2 } });
chip(s, 'التفكير الناقد', 4.4, 1.6, 1.6, ROSELT, { color: ROSE });
T(s, 'ماذا يحدث للجسم إذا اعتمد الإنسان في غذائه على صنف واحد فقط من المواد الغذائية؟', { x: 0.8, y: 2.15, w: 5.2, h: 1.5, fontSize: 22, bold: true, color: MAROON });
['أفكّر', 'أناقش زميلتي', 'أشارك'].forEach((t, i) => chip(s, AR(i + 1) + ' ' + t, 4.35 - i * 1.75, 3.8, 1.65, LEAFLT, { color: LEAF, fontSize: 14 }));
reveal(s, 'لن يحصل الجسم على جميع المواد الغذائية التي يحتاج إليها؛ فقد يشعر بالتعب، ولا ينمو بشكل سليم، ويصبح أكثر عرضة للأمراض.', { x: 0.8, y: 4.45, w: 5.2, h: 1.9, fontSize: 17 });
s.addNotes('أختبر نفسي ١ (٣ دقائق). تذكر الطالبات مجموعة كل طعام، ثم انقري لتنتقل الصور إلى صناديقها (البيض، السمك، الأرز، الخبز). سؤال التفكير الناقد: دقيقة تفكير فردي ثم مناقشة مع الزميلة، ثم انقري لإظهار الإجابة النموذجية.');

concept({ strat: 'الشرح والأنشطة\nالكتاب ص ١٧٦', key: 'vit', name: 'الفيتامينات', tag: 'المجموعة ٤ من ٦', img: 'book-vitamins', imgCap: 'الفواكه والخضراوات غنية بالفيتامينات', fnLabel: [],
  fn: [[[R('تساعد على '), M('المحافظة على صحة الجسم'), R('، وبناء خلايا جديدة، و'), M('الوقاية من الأمراض'), R('، مثل: فيتامين ج وفيتامين د.')], 1.0]],
  sources: [{ img: 'f-fruits', t: 'الفواكه' }, { img: 'f-veg', t: 'الخضراوات' }, { img: 'f-milk', t: 'الحليب' }, { t: 'الحبوب' }],
  life: 'البرتقال غني بفيتامين ج، وأشعة الشمس الصباحية تساعد الجسم على تكوين فيتامين د.',
  check: { type: 'أكمل العبارة', q: 'من أمثلة الفيتامينات: فيتامين ........ وفيتامين ........', opts: ['ج', 'الكالسيوم', 'د'], a: 'الإجابة: فيتامين ج، وفيتامين د' },
  notes: 'الفيتامينات (دقيقتان). اسألي: لماذا ينصحنا الأطباء بالفواكه والخضراوات؟ في التحقق السريع: الكالسيوم ليس فيتامينًا بل من الأملاح المعدنية، وهذا يمهد للمفهوم التالي.' });

concept({ strat: 'الشرح والأنشطة\nالكتاب ص ١٧٦', key: 'min', name: 'الأملاح المعدنية', tag: 'المجموعة ٥ من ٦', img: 'book-minerals', imgCap: 'أطعمة غنية بالأملاح المعدنية', fnLabel: [],
  fn: [[[R('تساعد على تكوين '), M('العظام'), R(' و'), M('خلايا الدم الجديدة'), R('، ومنها: الكالسيوم والحديد.')], 0.8]],
  sources: [{ img: 'f-dairy', t: 'منتجات الألبان' }, { img: 'f-greens', t: 'الخضراوات' }, { t: 'اللحوم' }, { t: 'الحبوب' }],
  life: 'كوب الحليب يوميًا يقوّي عظامي وأسناني لأنه غني بالكالسيوم.',
  check: { type: 'أختار الإجابة الصحيحة', q: 'من الأملاح المعدنية التي تساعد على تكوين العظام:', opts: ['الكالسيوم', 'الزيت', 'فيتامين ج'], a: 'الإجابة: الكالسيوم' },
  notes: 'الأملاح المعدنية (دقيقتان). اربطي الحديد بالدم، والكالسيوم بالعظام والأسنان.' });

// test 2 + read the picture
s = slideOf('BOARD', 'أختبر نفسي (٢)', 'التصنيف\nالكتاب ص ١٧٦', 'الشرح');
T(s, 'أصنّف: الأرز، الزبدة، الزيت، البطاطس', { x: 6.6, y: 1.35, w: 6.2, h: 0.5, fontSize: 20, bold: true, color: MAROON });
[['carb', 'الكربوهيدرات', 9.8], ['fat', 'الدهون', 6.6]].forEach(b => {
  box(s, { x: b[2], y: 1.95, w: 3.0, h: 2.65, line: { color: G[b[0]][0], width: 3 } });
  textBox(s, b[1], { x: b[2], y: 1.95, w: 3.0, h: 0.5, fill: { color: G[b[0]][0] }, line: { color: G[b[0]][0] }, align: 'center', fontSize: 17, bold: true });
});
[['الأرز', 9.95, 2.6], ['البطاطس', 9.95, 3.5], ['الزبدة', 6.75, 2.6], ['الزيت', 6.75, 3.5]].forEach(a => reveal(s, a[0], { x: a[1], y: a[2], w: 2.7, h: 0.75, align: 'center', fontSize: 20 }));
box(s, { x: 6.6, y: 4.8, w: 6.2, h: 1.85, line: { color: ROSELT, width: 2 } });
T(s, [R('التفكير الناقد: ', { color: ROSE }), R('لماذا يُعد تناول الفيتامينات مهمًا لصحة الإنسان؟')], { x: 6.75, y: 4.88, w: 5.9, h: 0.6, fontSize: 17, bold: true });
reveal(s, 'لأنها تحافظ على صحة الجسم، وتبني خلايا جديدة، وتقيه من الأمراض.', { x: 6.75, y: 5.55, w: 5.9, h: 0.95, fontSize: 16 });
T(s, 'اقرأ الصورة: صنّفي مكونات الوجبة', { x: 0.6, y: 1.35, w: 5.7, h: 0.5, fontSize: 20, bold: true, color: MAROON });
pic(s, im('book-lunch'), 0.65, 1.95, 5.6, 2.5, '3A9BD5');
[['الخبز', 'كربوهيدرات', 'carb'], ['الطماطم والخس', 'فيتامينات وأملاح', 'vit'], ['المكسرات', 'دهون وبروتينات', 'fat'], ['كأس الماء', 'الماء', 'wat']].forEach((a, i) => {
  const x = i % 2 ? 0.6 : 3.5, y = 4.65 + Math.floor(i / 2) * 0.95;
  textBox(s, a[0] + ' ←', { x, y, w: 2.8, h: 0.8, line: { color: G[a[2]][0], width: 2.5 }, fontSize: 16, bold: true, valign: 'top' });
  reveal(s, a[1], { x: x + 0.1, y: y + 0.38, w: 2.6, h: 0.36, fontSize: 14, align: 'left', fill: { color: G[a[2]][0] }, line: { color: G[a[2]][0] }, color: INK, margin: 2 });
});
s.addNotes('أختبر نفسي ٢ واقرأ الصورة (٤ دقائق). التصنيف من الكتاب ص ١٧٦: تذكر الطالبات المجموعة ثم انقري لإظهار كل طعام في صندوقه (الأرز، البطاطس، الزبدة، الزيت)، ثم إجابة التفكير الناقد، ثم مكونات «اقرأ الصورة» بالترتيب. إرشاد الكتاب: توجد المواد الغذائية في الطعام الذي نتناوله. فروق فردية: المتميزة تقترح ما ينقص الوجبة.');

concept({ strat: 'الشرح والأنشطة\nالكتاب ص ١٧٧', key: 'wat', name: 'الماء', tag: 'المجموعة ٦ من ٦', img: 'book-water', contain: true, imgCap: 'الكتاب ص ١٧٧', fnLabel: ['أهميته'],
  fn: [[[R('يشكّل الماء '), M('ثلثي جسم الإنسان'), R(' تقريبًا، فهو يساعد الجسم على الهضم، والتخلص من الفضلات، والمحافظة على درجة حرارة الجسم ثابتة.')], 1.15]],
  sources: [{ img: 'f-water', t: 'الماء النقي' }, { img: 'f-milk', t: 'الحليب' }, { img: 'f-orange', t: 'العصيرات' }, { t: 'الخضراوات والفواكه' }],
  check: { type: 'أصحّح المفهوم', q: '«يشكّل الماء نصف جسم الإنسان تقريبًا، ولا يحتاج إليه الجسم إلا عند العطش الشديد.» العبارة:', opts: ['صحيحة', 'خاطئة'], a: 'خاطئة: يشكّل الماء ثلثي الجسم، ونحتاج إليه يوميًا.' },
  notes: 'الماء (دقيقتان). اسألي: كم كوب ماء شربتِ اليوم؟ نشاط «تحليل غذائي اليومي» ص ١٧٧ مناسب واجبًا منزليًا: تكتب الطالبة ما تناولته خلال ٢٤ ساعة ومكوناته وفائدته.' });
// water bar on the water slide
(() => { const sw = curSlide; [['ماء', '3A8FD0', WHITE], ['ماء', '3A8FD0', WHITE], ['مواد أخرى', 'EEEEEE', INK]].forEach((b, i) => chip(sw, b[0], 10.6 - i * 1.2, 4.35, 1.1, b[1], { color: b[2], fontSize: 13, h: 0.38 })); T(sw, 'ثلثا الجسم ماء تقريبًا', { x: 5.9, y: 4.33, w: 2.4, h: 0.4, fontSize: 14, bold: true, color: G.wat[1] }); })();

/* six boxes */
function sixBoxes(level, foods, notes) {
  const s = slideOf('BOARD', 'صناديق الغذاء الستة', 'التصنيف\nنشاط تعلم نشط', 'الأنشطة');
  const bins = [['carb', 'الكربوهيدرات'], ['prot', 'البروتينات'], ['fat', 'الدهون'], ['vit', 'الفيتامينات'], ['min', 'الأملاح المعدنية'], ['wat', 'الماء']];
  const pos = {};
  bins.forEach((b, i) => {
    const x = 9.7 - (i % 3) * 3.05, y = 1.35 + Math.floor(i / 3) * 1.95; pos[b[0]] = [x, y, 0];
    box(s, { x, y, w: 2.9, h: 1.8, fill: { color: 'FFFFFF' }, line: { color: G[b[0]][0], width: 3 } });
    textBox(s, b[1], { x, y, w: 2.9, h: 0.45, fill: { color: G[b[0]][0] }, line: { color: G[b[0]][0] }, align: 'center', fontSize: 17, bold: true });
  });
  box(s, { x: 3.6, y: 5.3, w: 9.2, h: 1.4, fill: { color: 'FFFFFF' }, line: { color: WOOD, width: 2, dashType: 'dash' } });
  foods.forEach((f, i) => { const x = 11.55 - i * 1.5; pic(s, im(f[0]), x, 5.38, 1.2, 0.85); T(s, f[1], { x: x - 0.1, y: 6.27, w: 1.4, h: 0.33, align: 'center', fontSize: 14, bold: true }); });
  foods.forEach(f => f[2].forEach(g => { const p = pos[g]; const k = p[2]++; revealImg(s, im(f[0]), { x: p[0] + 0.12 + k * 0.92, y: p[1] + 0.6, w: 0.85, h: 0.6, sizing: { type: 'cover', w: 0.85, h: 0.6 } }); }));
  textBox(s, [R('الهدف', { bold: true, color: ROSE, breakLine: true }), R('أصنّف الأطعمة إلى مجموعات المواد الغذائية الست.')], { x: 0.6, y: 1.35, w: 2.8, h: 1.25, fontSize: 15, bold: true, line: { color: ROSELT, width: 2 } });
  textBox(s, [R('الخطوات', { bold: true, color: ROSE, breakLine: true }), R('١ أتأمل صور الأطعمة.', { breakLine: true }), R('٢ أحدد المجموعة الغنية بها.', { breakLine: true }), R('٣ أشير إلى الصندوق المناسب، ثم ننقر للتحقق.')], { x: 0.6, y: 2.75, w: 2.8, h: 2.1, fontSize: 15, bold: true, line: { color: ROSELT, width: 2 }, valign: 'top' });
  chip(s, level, 0.6, 5.05, 2.8, LEAF, { color: WHITE, fontSize: 16, h: 0.5 });
  s.addNotes(notes);
}
pres.addSection({ title: 'الأنشطة' });
sixBoxes('المستوى الأساسي', [['f-rice', 'الأرز', ['carb']], ['f-eggs', 'البيض', ['prot']], ['f-oil', 'الزيت', ['fat']], ['f-orange', 'البرتقال', ['vit']], ['f-milk', 'الحليب', ['min']], ['f-water', 'الماء', ['wat']]],
  'صناديق الغذاء الستة، المستوى الأساسي (٣ دقائق). تتقدم الطالبات بالتناوب؛ كل طالبة تختار طعامًا وتشير إلى صندوقه أو تكتب اسمه فيه بقلم السبورة، ثم انقري لتظهر الصورة في صندوقها الصحيح (بالترتيب: الأرز، البيض، الزيت، البرتقال، الحليب، الماء). الحليب غني بالبروتينات والأملاح والفيتامينات؛ ظهر هنا في الأملاح (الكالسيوم)، ناقشي ذلك. فروق فردية: ابدئي بهذا المستوى ثم انتقلي للمتقدم مع المتميزات.');
sixBoxes('المستوى المتقدم', [['f-bread', 'الخبز', ['carb']], ['f-salmon', 'السمك', ['prot', 'fat']], ['f-butter', 'الزبدة', ['fat']], ['f-cheese', 'الجبن', ['prot', 'min']], ['f-greens', 'الخضراوات', ['vit', 'min']], ['f-fruits', 'الفواكه', ['vit', 'wat']]],
  'صناديق الغذاء الستة، المستوى المتقدم (٣ دقائق). بعض الأطعمة تنتمي لأكثر من مجموعة: السمك (بروتينات ودهون)، والجبن (بروتينات وأملاح)، والخضراوات (فيتامينات وأملاح)، والفواكه (فيتامينات وماء). كل نقرة تُظهر صورة الطعام في إحدى مجموعاته.');

// tree
s = slideOf('BOARD', 'شجرة الغذاء المتوازن', 'خريطة مفاهيمية\nأكمل الشجرة', 'الأنشطة');
s.addShape(pres.shapes.OVAL, { x: 3.6, y: 2.0, w: 6.1, h: 3.6, fill: { color: '86AD5E', transparency: 60 }, line: { color: 'FFFFFF', transparency: 100 } });
const TR = 'A57447', cx = 6.67, cy = 5.3;
s.addShape(pres.shapes.TRAPEZOID, { x: 6.3, y: 5.0, w: 0.75, h: 1.3, fill: { color: TR }, line: { color: TR }, flipV: true });
const leaves = [['carb', 'الكربوهيدرات', 'طاقة', 10.6, 4.5], ['prot', 'البروتينات', 'نمو وتعويض الخلايا', 10.0, 3.0], ['fat', 'الدهون', 'طاقة ودفء', 8.1, 2.1], ['vit', 'الفيتامينات', 'وقاية من الأمراض', 5.2, 2.1], ['min', 'الأملاح المعدنية', 'عظام ودم', 3.3, 3.0], ['wat', 'الماء', 'هضم وتنظيم الحرارة', 2.7, 4.5]];
leaves.forEach(l => {
  const lx = l[3], ly = l[4];
  const x1 = Math.min(cx, lx), x2 = Math.max(cx, lx), y1 = Math.min(cy, ly), y2 = Math.max(cy, ly);
  s.addShape(pres.shapes.LINE, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: TR, width: 9 }, flipV: lx > cx });
});
leaves.forEach(l => {
  const x = l[3] - 1.15, y = l[4] - 0.5;
  s.addText('؟', { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.4, x, y, w: 2.3, h: 1.0, fill: { color: 'FFFFFF' }, line: { color: G[l[0]][1], width: 3 }, fontSize: 36, bold: true, color: G[l[0]][1], align: 'center', valign: 'middle', isTextBox: true });
});
leaves.forEach(l => reveal(s, [R(l[1], { fontSize: 19, bold: true, color: INK, breakLine: true }), R(l[2], { fontSize: 14, color: INK })], { x: l[3] - 1.15, y: l[4] - 0.5, w: 2.3, h: 1.0, align: 'center', rectRadius: 0.4, fill: { color: G[l[0]][0] }, line: { color: G[l[0]][1], width: 3 } }));
textBox(s, 'الغذاء المتوازن', { x: 5.2, y: 6.25, w: 2.95, h: 0.55, fill: { color: '7B1D2C' }, line: { color: '7B1D2C' }, color: WHITE, align: 'center', fontSize: 22, bold: true, rectRadius: 0.27 });
s.addNotes('شجرة الغذاء المتوازن (٣ دقائق). تبدأ الشجرة بفراغات (؟). اسألي عن كل ورقة: ما المجموعة التي تمنحنا الطاقة؟ ثم انقري لتظهر الإجابة ووظيفتها. الترتيب: الكربوهيدرات، البروتينات، الدهون، الفيتامينات، الأملاح المعدنية، الماء. تصلح الشجرة مراجعة ختامية أيضًا.');

// reading
s = slideOf('BOARD', 'فهم قرائي', 'اقرأ – أفهم – أجيب\nفهم قرائي', 'الأنشطة');
textBox(s, [R('غذائي وصحتي', { bold: true, color: LEAF, fontSize: 22, breakLine: true }), R('يحتاج جسم الإنسان إلى غذاء متوازن ليحصل على الطاقة وينمو ويحافظ على صحته. وتساعد البروتينات على النمو وتعويض الخلايا التالفة، بينما تمد الكربوهيدرات الجسم بالطاقة. وتساعد الفيتامينات والأملاح المعدنية على المحافظة على صحة الجسم، ويحتاج الإنسان أيضًا إلى الماء للقيام بوظائفه الحيوية.')],
  { x: 6.9, y: 1.4, w: 5.9, h: 5.25, fontSize: 22, lineSpacingMultiple: 1.35, valign: 'top', line: { color: LEAFL, width: 3 }, margin: 14 });
['١ أقرأ', '٢ أفهم', '٣ أجيب'].forEach((t, i) => chip(s, t, 4.6 - i * 2.0, 1.4, 1.85, LEAFLT, { color: LEAF, fontSize: 16 }));
const rq = [['لماذا يحتاج الإنسان إلى الغذاء المتوازن؟', 'ليحصل على الطاقة، وينمو، ويحافظ على صحته. (الجملة الأولى)'], ['ما المادة الغذائية التي تساعد على النمو وتعويض الخلايا التالفة؟', 'البروتينات. (الجملة الثانية)'], ['استنتجي: ماذا يحدث إذا لم يحصل الجسم على غذاء متنوع؟', 'لن يحصل على جميع المواد الغذائية؛ فيقلّ نشاطه، ولا ينمو بشكل سليم، ويصبح أكثر عرضة للأمراض.']];
rq.forEach((q, i) => {
  const y = 2.0 + i * 1.56;
  box(s, { x: 0.6, y, w: 6.1, h: 1.45, line: { color: ROSELT, width: 2 } });
  numDot(s, i + 1, 6.15, y + 0.12);
  T(s, q[0], { x: 0.75, y: y + 0.05, w: 5.35, h: 0.65, fontSize: 16, bold: true });
  reveal(s, q[1], { x: 0.75, y: y + 0.74, w: 5.8, h: 0.62, fontSize: 14 });
});
s.addNotes('فهم قرائي (٥ دقائق). أقرأ: قراءة صامتة دقيقة، ثم قراءة جهرية. أفهم: اسألي عن معنى «الخلايا التالفة» و«الوظائف الحيوية». أجيب: بعد المناقشة انقري لإظهار الإجابة، واطلبي من طالبة تظليل الجملة التي فيها الإجابة بقلم السبورة. فروق فردية: للسؤال الثالث، ساعدي المتعثرة بالرجوع إلى الجملتين الأولى والرابعة.');

// plate
s = slideOf('FULL', '', '', 'الأنشطة');
s.background = { path: im('slide-plate') };
T(s, '', { x: 9.57, y: 0.49, w: 1.52, h: 0.29, align: 'center', fontSize: 14, bold: true, color: MAROON, objectName: 'day' });
T(s, '', { x: 9.57, y: 0.94, w: 1.52, h: 0.29, align: 'center', fontSize: 14, bold: true, color: MAROON, objectName: 'date' });
reveal(s, 'الأرز كربوهيدرات، والدجاج بروتين. نُكمل الوجبة بالخضراوات والفواكه (فيتامينات وأملاح)، ومنتجات الألبان (كالسيوم)، والماء.', { x: 4.75, y: 5.95, w: 4.1, h: 0.8, fontSize: 13, align: 'center', fill: { color: 'FFFFFF' } });
s.addNotes('الطبق الناقص: فكّر – زاوج – شارك (٦ دقائق). فكّر: دقيقة تفكير فردي: ماذا ينقص طبق الأرز والدجاج؟ زاوج: تناقش كل طالبة زميلتها وتتفقان على اختيارين مع التفسير. شارك: تخرج ثنائية وتحيط اختيارها بقلم السبورة وتفسره. ثم انقري لإظهار التغذية الراجعة.');

// pyramid
s = slideOf('BOARD', 'الهرم الغذائي', 'الشرح والأنشطة\nالكتاب ص ١٧٨', 'الأنشطة');
guide(s, 'ننقر لنكشف المستويات من القاعدة إلى القمة.');
pic(s, im('book-pyramid'), 4.75, 1.45, 3.85, 4.1);
textBox(s, 'لا توجد جميع المواد الغذائية في نوع واحد من الأطعمة؛ لذا يجب أن يشتمل طعامنا على جميع المواد الغذائية بكميات محددة. والهرم الغذائي نموذج يوضّح أنواع الأطعمة التي يحتاجها الإنسان يوميًا.', { x: 0.6, y: 1.45, w: 3.9, h: 2.8, fontSize: 17, bold: true, valign: 'top' });
textBox(s, 'الهرم الغذائي: دليل غذائي على شكل مثلث يحدد حاجات الأفراد الغذائية التي يجب تناولها.', { x: 0.6, y: 4.4, w: 3.9, h: 1.3, fontSize: 16, bold: true, color: MAROON, fill: { color: ROSELT }, line: { color: ROSELT } });
const lv = [['carb', '١', 'القاعدة: الحبوب (نُكثر منها)', 5.0], ['vit', '٢', 'الخضراوات والفواكه', 3.95], ['prot', '٣', 'اللحوم والأسماك، والحليب ومشتقاته', 2.9], ['fat', '٤', 'القمة: الدهون (نقلل منها)', 1.85]];
lv.forEach(l => { textBox(s, '', { x: 8.85, y: l[3], w: 3.95, h: 0.8, line: { color: G[l[0]][0], width: 2.5 } }); s.addText(l[1], { shape: pres.shapes.OVAL, x: 12.25, y: l[3] + 0.17, w: 0.46, h: 0.46, fill: { color: G[l[0]][0] }, line: { color: G[l[0]][0] }, fontSize: 15, bold: true, align: 'center', valign: 'middle', color: INK, isTextBox: true }); });
lv.forEach(l => reveal(s, l[2], { x: 8.95, y: l[3] + 0.1, w: 3.2, h: 0.6, fontSize: 15, fill: { color: 'FFFFFF' }, line: { color: 'FFFFFF' } }));
textBox(s, 'كلما اتسع المستوى احتجنا إلى كمية أكبر منه.', { x: 4.75, y: 5.7, w: 3.85, h: 0.6, align: 'center', fontSize: 15, bold: true, color: LEAF, fill: { color: LEAFLT }, line: { color: LEAFLT } });
s.addNotes('الهرم الغذائي (٤ دقائق). يقسّم الكتاب الأطعمة إلى خمس مجموعات: الحبوب، الخضراوات والفواكه، اللحوم والأسماك، الحليب ومشتقاته، الدهون. انقري لكشف المستويات من القاعدة إلى القمة، ووضّحي: كلما اتسع المستوى احتجنا كمية أكبر، والقمة نتناول منها القليل.');

// test 3
pres.addSection({ title: 'التقويم' });
s = slideOf('BOARD', 'أختبر نفسي (٣)', 'التصنيف والتفكير الناقد\nالكتاب ص ١٧٨', 'التقويم');
T(s, 'أصنّف: المواد الغذائية إلى مجموعتين حسب فوائدها', { x: 5.4, y: 1.35, w: 7.4, h: 0.5, fontSize: 20, bold: true, color: MAROON });
['البروتينات', 'الدهون', 'الكربوهيدرات', 'الأملاح المعدنية'].reduce((x, t) => { const w = 0.45 + t.length * 0.11; chip(s, t, x - w, 1.95, w, WHITE, { line: { color: WOOD, width: 2 }, fontSize: 15, h: 0.5 }); return x - w - 0.12; }, 12.8);
[['fat', 'إمداد الجسم بالطاقة', 9.2], ['min', 'النمو وبناء العظام', 5.4]].forEach(b => {
  box(s, { x: b[2], y: 2.7, w: 3.6, h: 3.95, line: { color: G[b[0]][0], width: 3 } });
  textBox(s, b[1], { x: b[2], y: 2.7, w: 3.6, h: 0.5, fill: { color: G[b[0]][0] }, line: { color: G[b[0]][0] }, align: 'center', fontSize: 17, bold: true });
});
[['الكربوهيدرات', 9.4, 3.4], ['الدهون', 9.4, 4.25], ['البروتينات', 5.6, 3.4], ['الأملاح المعدنية', 5.6, 4.25]].forEach(a => reveal(s, a[0], { x: a[1], y: a[2], w: 3.2, h: 0.7, align: 'center', fontSize: 18 }));
box(s, { x: 0.6, y: 1.4, w: 4.55, h: 5.25, line: { color: ROSELT, width: 2 } });
chip(s, 'التفكير الناقد', 3.35, 1.6, 1.6, ROSELT, { color: ROSE });
T(s, 'لماذا يُعد الهرم الغذائي مهمًا في تناول الغذاء المتوازن؟', { x: 0.8, y: 2.2, w: 4.15, h: 1.4, fontSize: 21, bold: true, color: MAROON });
reveal(s, 'لأنه يوضح أنواع الأطعمة التي نحتاجها يوميًا والكمية المناسبة من كل مجموعة؛ فنُكثر من القاعدة ونقلل من القمة.', { x: 0.8, y: 3.8, w: 4.15, h: 2.0, fontSize: 16 });
s.addNotes('أختبر نفسي ٣ (٣ دقائق). الطاقة: الكربوهيدرات والدهون. النمو وبناء العظام: البروتينات والأملاح المعدنية. تصنّف الطالبات شفهيًا أو بقلم السبورة، ثم انقري للتحقق، ثم إجابة التفكير الناقد.');

/* 2x2 question grid */
function qgrid(title, strat, cards, notes) {
  const s = slideOf('BOARD', title, strat, 'التقويم');
  cards.forEach((c, i) => {
    const x = i % 2 ? 0.6 : 6.8, y = 1.4 + Math.floor(i / 2) * 2.68, w = 5.95, h = 2.5;
    box(s, { x, y, w, h, line: { color: LEAFLT, width: 2 } });
    numDot(s, i + 1, x + w - 0.55, y + 0.12);
    T(s, c.lab, { x: x + 0.2, y: y + 0.1, w: w - 0.85, h: 0.42, fontSize: 15, bold: true, color: ROSE });
    let tx = x + 0.2, tw = w - 0.4;
    if (c.img) { pic(s, im(c.img), x + 0.2, y + 0.65, 1.55, 1.1, WOOD); tw = w - 2.0; }
    if (c.mini) {
      c.mini.forEach((m, k) => { const mx = x + w - 1.9 - k * 1.9; pic(s, im(m[0]), mx + 0.2, y + 0.6, 1.3, 0.8, WOOD); T(s, m[1], { x: mx, y: y + 1.45, w: 1.7, h: 0.35, align: 'center', fontSize: 14, bold: true, color: '7A6660' }); });
      c.mini.forEach((m, k) => { const mx = x + w - 1.9 - k * 1.9; reveal(s, m[2], { x: mx + 0.1, y: y + 1.85, w: 1.5, h: 0.45, align: 'center', fontSize: 14, margin: 2 }); });
      return;
    }
    T(s, c.q, { x: tx + (c.img ? 1.75 : 0), y: y + 0.55, w: tw, h: c.opts ? 0.85 : 1.0, fontSize: 17, bold: true, valign: 'top' });
    if (c.opts) { c.opts.reduce((ox, o) => { const ow = 0.35 + o.length * 0.105; chip(s, o, ox - ow, y + 1.42, ow, WHITE, { line: { color: WOOD, width: 2 }, fontSize: 13, h: 0.4 }); return ox - ow - 0.1; }, x + w - 0.2); }
    reveal(s, c.a, { x: x + 0.2, y: y + (c.opts ? 1.9 : 1.6), w: w - 0.4, h: c.opts ? 0.5 : 0.8, fontSize: 14 });
  });
  s.addNotes(notes);
  return s;
}
qgrid('مراجعة الدرس', 'أفكّر وأتحدّث وأكتب\nمراجعة الدرس ص ١٧٩', [
  { lab: 'المفردات', q: '................ يشكّل ثلثي جسم الإنسان تقريبًا، ويساعد على التخلص من الفضلات، ويحافظ على درجة حرارة الجسم.', a: 'الماء' },
  { lab: 'أصنّف مكونات فطيرة التفاح', q: 'الدقيق – الزبدة – البيض – التفاح – السكر – الماء', a: 'كربوهيدرات: الدقيق والسكر · دهون: الزبدة · بروتينات: البيض · فيتامينات: التفاح · ماء: الماء' },
  { lab: 'التفكير الناقد', q: 'لماذا يجب شرب الحليب بشكل عام، وفي السنوات الأولى من عمر الطفل بشكل خاص؟', a: 'لأنه غني بالبروتينات للنمو وبالكالسيوم لبناء العظام والأسنان، والطفل في مرحلة نمو سريع.' },
  { lab: 'أختار الإجابة الصحيحة', q: 'تساعد الجسم على النمو وتعويض الخلايا التالفة فيه:', opts: ['الدهون', 'الأملاح المعدنية', 'البروتينات', 'الألياف'], a: 'الإجابة: البروتينات' },
], 'مراجعة الدرس (٤ دقائق). أسئلة الكتاب ص ١٧٩. يمكن توزيعها على أربع مجموعات، كل مجموعة تجيب عن سؤال، ثم انقري لإظهار الإجابات بالترتيب. إثراء: «العلوم والكتابة» مقال قصير عن أهمية الغذاء المتوازن، و«العلوم والفن» لوحة صور أطعمة مصنفة.');

qgrid('التقويم الختامي المصوّر', 'التقويم الختامي\nتقويم مصوّر', [
  { lab: 'اختيار من متعدد', img: 'f-bread', q: 'الخبز مصدر غني بـ:', opts: ['الكربوهيدرات', 'الدهون', 'الماء'], a: 'الإجابة: الكربوهيدرات' },
  { lab: 'تصنيف مصوّر: أختار مجموعة كل طعام', mini: [['f-oil', 'الزيت', 'دهون'], ['f-eggs', 'البيض', 'بروتينات'], ['f-orange', 'البرتقال', 'فيتامينات']] },
  { lab: 'أصحّح المفهوم', q: '«الفيتامينات هي المصدر الرئيس للطاقة في الجسم.»', opts: ['صحيحة', 'خاطئة'], a: 'خاطئة: الكربوهيدرات هي المصدر الرئيس للطاقة.' },
  { lab: 'تفكير ناقد', q: 'تتناول ريم البطاطس المقلية والحلوى كل يوم، ولا تأكل الخضراوات. بماذا تنصحينها؟ ولماذا؟', a: 'تقلل المقليات والحلوى لأن الإكثار من الدهون يسبب السمنة، وتضيف الخضراوات والفواكه لتكوّن وجبة متوازنة.' },
], 'التقويم الختامي (٥ دقائق). تجيب الطالبات كتابيًا في ورقة أو على السبورة، ثم انقري لإظهار الإجابات بالترتيب. سؤال التفكير الناقد شفهي: استمعي لأكثر من نصيحة قبل إظهار الإجابة النموذجية.');

// exit ticket
s = slideOf('BOARD', 'ماذا تعلمت اليوم؟', 'تذكرة الخروج\nماذا تعلمت اليوم؟', 'التقويم');
const ex = [[[R('أصنّف: ', { color: ROSE }), R('البيض من مصادر أي مادة غذائية؟')], 'f-eggs', 'البروتينات'], [[R('أختار: ', { color: ROSE }), R('أيهما مصدر للكربوهيدرات: الأرز أم الزيت؟')], 'f-rice', 'الأرز'], [[R('أفسّر: ', { color: ROSE }), R('لماذا يحتاج جسمي إلى الماء؟')], 'f-water', 'لأنه يشكّل ثلثي الجسم، ويساعد على الهضم والتخلص من الفضلات وتنظيم الحرارة.']];
ex.forEach((e, i) => {
  const y = 1.4 + i * 1.32;
  box(s, { x: 3.9, y, w: 8.9, h: 1.2, line: { color: ROSELT, width: 2 } });
  T(s, e[0], { x: 6.2, y: y + 0.05, w: 6.45, h: 0.6, fontSize: 19, bold: true });
  if (i === 1) { pic(s, im('f-rice'), 4.95, y + 0.12, 1.0, 0.7, WOOD); pic(s, im('f-oil'), 4.05, y + 0.12, 0.8, 0.7, WOOD); }
  else pic(s, im(e[1]), 4.5, y + 0.12, 1.2, 0.85, WOOD);
  reveal(s, e[2], { x: 6.2, y: y + 0.66, w: 6.45, h: 0.45, fontSize: 14 });
});
textBox(s, [R('السؤال الأساسي: كيف يكون غذائي صحيًا؟ ', { color: ROSE }), R('عندما يكون متوازنًا ومتنوعًا ويحتوي على المجموعات الست بكميات مناسبة.', { color: INK })], { x: 3.9, y: 5.4, w: 8.9, h: 1.2, fontSize: 17, bold: true, line: { color: LEAFLT, width: 2 } });
textBox(s, 'أقيّم فهمي', { x: 0.6, y: 1.4, w: 3.05, h: 0.5, fill: { color: 'B14F68' }, line: { color: 'B14F68' }, color: WHITE, align: 'center', fontSize: 17, bold: true, rectRadius: 0.25 });
[['فهمت جيدًا', 'BFE3A9'], ['فهمت بعض الأجزاء', 'F8E3A1'], ['أحتاج إلى مساعدة', 'F6C2CC']].forEach((f, i) => {
  const y = 2.05 + i * 0.85;
  box(s, { x: 0.6, y, w: 3.05, h: 0.72, line: { color: WOOD, width: 2 } });
  s.addShape(pres.shapes.OVAL, { x: 3.0, y: y + 0.11, w: 0.5, h: 0.5, fill: { color: f[1] }, line: { color: f[1] } });
  T(s, f[0], { x: 0.7, y, w: 2.25, h: 0.72, fontSize: 15, bold: true });
});
s.addImage({ path: im('healthy-plate'), x: 0.9, y: 4.65, w: 2.45, h: 2.0, sizing: { type: 'contain', w: 2.45, h: 2.0 } });
s.addNotes('تذكرة الخروج (٣ دقائق). تجيب كل طالبة عن الأسئلة الثلاثة في بطاقة ورقية أو شفهيًا قبل الخروج، ثم انقري لإظهار الإجابات. «أقيّم فهمي»: ترفع كل طالبة يدها عند مستواها؛ توجّهي في الحصة القادمة لمن اخترن «أحتاج إلى مساعدة». عودي إلى شريحة نواتج التعلم وضعي علامة على ما تحقق. الشريحة التالية نسخة مصوّرة من تذكرة الخروج للطباعة.');

// printable exit ticket
s = slideOf('FULL', '', '', 'التقويم');
s.background = { path: im('slide-exit') };
s.addNotes('تذكرة الخروج المصوّرة: نسخة جاهزة للطباعة أو العرض.');

/* ---------- write + add click-to-reveal animations ---------- */
(async () => {
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  const zip = await JSZip.loadAsync(fs.readFileSync(OUT));
  let total = 0;
  for (const f of Object.keys(zip.files).filter(f => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
    let xml = await zip.file(f).async('string');
    const ids = [];
    const re = /<p:cNvPr id="(\d+)" name="(rv\d\d)"/g; let m;
    while ((m = re.exec(xml))) ids.push([m[2], m[1]]);
    if (!ids.length) continue;
    ids.sort((a, b) => a[0].localeCompare(b[0]));
    let id = 3, pars = '';
    for (const [, spid] of ids) {
      pars += `<p:par><p:cTn id="${id++}" fill="hold"><p:stCondLst><p:cond delay="indefinite"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${id++}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="${id++}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" nodeType="clickEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:set><p:cBhvr><p:cTn id="${id++}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set><p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="${id++}" dur="400"/><p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl></p:cBhvr></p:animEffect></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`;
    }
    const timing = `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>${pars}</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>`;
    xml = xml.replace(/(<\/p:clrMapOvr>)/, '$1' + timing);
    if (!xml.includes('<p:timing>')) throw new Error('no clrMapOvr in ' + f);
    zip.file(f, xml); total += ids.length;
  }
  fs.writeFileSync(OUT, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
  console.log('written', OUT, 'reveal animations:', total);
})();
