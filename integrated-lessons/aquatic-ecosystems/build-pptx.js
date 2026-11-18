const pptxgen = require('pptxgenjs');
const path = require('path');
const fs = require('fs');
const JSZip = require('jszip');
const SKILL = '/root/.claude/skills/synced/eee5607a-cee3-4438-a82f-eabe29e012fc_ee537774-4764-45c3-bec0-37d9da460347/pptx';
const { applyTheme } = require(SKILL + '/scripts/apply_theme.js');

const IMG = '/home/user/Scienceshamah/integrated-lessons/aquatic-ecosystems/img/';
const OUT = '/home/user/Scienceshamah/integrated-lessons/aquatic-ecosystems/درس-الأنظمة-البيئية-المائية.pptx';
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
pres.title = 'درس الأنظمة البيئية المائية'; pres.author = SIG; pres.subject = 'العلوم - الصف السادس الابتدائي';
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
  TRANS.push(master === 'FULL' ? 'ripple' : ({ 'البداية': 'ripple', 'التمهيد': 'gallery', 'الاستكشاف': 'prism', 'الشرح': 'gallery', 'التنظيم': 'honeycomb', 'التقويم': 'ripple' })[section] || 'ripple');
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

/* ================= SLIDES: الأنظمة البيئية المائية ================= */
const R = (t, o) => ({ text: t, options: o || {} });
const ST = (strategy, stage) => [R(stage, { fontSize: 14 })];
const SEA = '1F78A8', SEAL = 'DDF1F8', SEA2 = '0E4F72', SAND = 'F3E2BF', LEAFG = '4E8A3A', INKC = '23293A';
const TEAMS = ' عبر Teams: شاركي الشاشة في وضع العرض، واطلبي الإجابة في الدردشة، ثم اضغطي أنتِ على الإجابة التي اختارتها الطالبة.';
let auN = 0;
const AU = () => 'au' + String(++auN).padStart(2, '0');
function full(file, notes, section) { const s = slideOf('FULL', '', '', section); s.background = { path: im(file) }; s.addNotes(notes); return s; }
function bookPic(s, file, x, y, w, h, cap, contain) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x - 0.06, y: y - 0.06, w: w + 0.12, h: h + 0.12, fill: { color: WHITE }, line: { color: '3A9BD5', width: 2.5 }, rectRadius: 0.12 });
  s.addImage({ path: im(file), x, y, w, h, sizing: { type: contain ? 'contain' : 'cover', w, h } });
  if (cap) T(s, cap, { x, y: y + h + 0.04, w, h: 0.28, fontSize: 11, align: 'center', color: '1F6FA5', bold: true });
}
function mcq(s, check, CX, CY, CW, fs) {
  const q = newQ(), ans = [].concat(check.ans), okIds = ans.map(i => q + 'o' + i).join('-');
  let ox = CX + CW - 0.15;
  check.opts.forEach((o, i) => { const w = 0.45 + o.length * 0.115; ox -= w; const ok = ans.includes(i);
    chip(s, o, ox, CY, w, WHITE, { line: { color: WOOD, width: 2 }, fontSize: fs || 14, h: 0.44, objectName: (ok ? 'tg_' : 'tw_') + q + 'o' + i });
    if (ok) star(s, q + 'o' + i, ox - 0.16, CY + 0.26, 0.36); ox -= 0.12; });
  const room = ox - CX - 0.3;
  if (room >= 2.4) target(s, okIds, check.a, { x: CX + 0.15, y: CY - 0.03, w: room, h: 0.5, fontSize: 13 });
  else target(s, okIds, check.a, { x: CX + 0.15, y: CY + 0.52, w: CW - 0.3, h: CW < 4 ? 0.95 : 0.44, fontSize: CW < 4 ? 11 : 13 });
}
function badge(s, text, x, y, w, color) { chip(s, text, x, y, w, color || SEA, { color: WHITE, fontSize: 13, h: 0.36 }); }

/* ---------- 1–5: opening visuals ---------- */
pres.addSection({ title: 'البداية' });
full('s3_cover', 'الغلاف: بعثة المستكشفات إلى أسرار الأرض وأعماق البحار. درس «مقارنة الأنظمة البيئية»: نبدأ اليوم بالأنظمة البيئية المائية (الكتاب ص ١٥٤–١٥٧).', 'البداية');
full('s2_welcome', 'الترحيب: «مرحبًا بكنّ عالماتي الصغيرات… اليوم سننطلق في رحلة علمية ممتعة لاكتشاف المناطق الحيوية البرية والأنظمة البيئية المائية».', 'البداية');
full('s1_rules', 'قوانين الرحلة: أستمع باهتمام، أرفع يدي للمشاركة، أحترم آراء زميلاتي، ألتزم بالوقت، أتعاون في العمل.', 'البداية');
const sGoals = full('s6_goals', 'نواتج التعلم (الأهداف): أتعرّف المناطق الحيوية على اليابسة، وأميّز خصائص كل منطقة، وأتعرّف الأنظمة البيئية المائية، وأقارن بين الأراضي الرطبة ومصبات الأنهار.', 'البداية');
T(sGoals, 'نواتج التعلم', { x: 5.12, y: 0.33, w: 4.68, h: 1.03, align: 'center', fontSize: 40, bold: true, color: 'FFFFFF', fontFace: 'Arial' });
T(sGoals, 'الأهداف', { x: 5.39, y: 1.75, w: 6.07, h: 0.7, align: 'center', fontSize: 28, bold: true, color: '2B2B2B', fontFace: 'Arial' });
full('s8_stations', 'محطات رحلتنا: ١ مراجعة وتمهيد ← ٢ استكشاف الأنظمة المائية ← ٣ الغوص إلى المناطق الحيوية ← ٤ التقويم والتحدي.', 'البداية');

/* ---------- 6: review of last week (land biomes) ---------- */
let s = slideOf('BOARD', 'مراجعة: تعلّمناها الأسبوع الماضي', ST('ملخص بصري', 'المناطق الحيوية على اليابسة'), 'البداية');
guide(s, 'المسي البطاقة لتظهر ميزة المنطقة!');
const land = [['b_tundra', 'التندرا', 'باردة جدًا، وتربتها متجمدة معظم العام.'], ['b_taiga', 'التايجا', 'تكثر فيها الأشجار المخروطية دائمة الخضرة.'], ['b_desert2', 'الصحراء', 'جافة، وأمطارها قليلة جدًا.'],
  ['b_grass', 'الأراضي العشبية', 'تغطيها الأعشاب، وأشجارها قليلة.'], ['b_rain', 'الغابات الاستوائية المطيرة', 'قرب خط الاستواء، حارة رطبة، أمطارها غزيرة.'], ['b_decid', 'الغابات المتساقطة الأوراق', 'تتساقط أوراق أشجارها في الخريف.']];
land.forEach((b, i) => {
  const w = 1.93, x = 12.8 - (i + 1) * w - i * 0.12, y = 1.4, q = newQ();
  box(s, { x, y, w, h: 2.45, line: { color: SEA, width: 2 } });
  s.addImage({ path: im(b[0]), x: x + 0.06, y: y + 0.06, w: w - 0.12, h: 1.3, sizing: { type: 'cover', w: w - 0.12, h: 1.3 } });
  T(s, b[1], { x, y: y + 1.38, w, h: 0.5, align: 'center', fontSize: 14, bold: true, color: MAROON });
  hotspot(s, q, x, y, w, 2.45);
  target(s, q, b[2], { x: x + 0.05, y: y + 1.86, w: w - 0.1, h: 0.55, fontSize: 11, align: 'center', margin: 2 });
  star(s, q, x + w - 0.42, y - 0.15, 0.38);
});
box(s, { x: 0.6, y: 4.05, w: 12.2, h: 2.65, line: { color: ROSEL, width: 2, dashType: 'dash' } });
T(s, [R('من مراجعة الدرس ص ١٥٧ · ', { color: ROSE }), R('المسي الإجابة الصحيحة', { color: '7A6660', fontSize: 12 })], { x: 0.8, y: 4.1, w: 11.8, h: 0.36, fontSize: 14, bold: true });
T(s, '١ المنطقة الحيوية التي تكثر فيها الأشجار المخروطية الدائمة الخضرة هي:', { x: 0.8, y: 4.5, w: 11.8, h: 0.4, fontSize: 16, bold: true });
mcq(s, { opts: ['التندرا', 'الأراضي العشبية', 'الغابات المتساقطة الأوراق', 'التايجا'], ans: 3, a: 'د. التايجا' }, 0.6, 4.95, 12.2, 13);
T(s, '٢ درجة الحرارة وتساقط الأمطار هما العاملان اللذان يحددان لأي منطقة:', { x: 0.8, y: 5.55, w: 11.8, h: 0.4, fontSize: 16, bold: true });
mcq(s, { opts: ['المناخ', 'خط الطول', 'الارتفاع', 'خط العرض'], ans: 0, a: 'أ. المناخ' }, 0.6, 6.0, 12.2, 13);
s.addNotes('مراجعة الأسبوع الماضي (٣ دقائق): تذكر الطالبة ميزة كل منطقة حيوية، ثم تلمس البطاقة للتحقق. السؤالان من مراجعة الدرس ص ١٥٧ (٤ و٥).' + TEAMS);

full('s9_start', 'الآن… لنبدأ الرحلة! انتقلي من اليابسة إلى الماء: نركب الغواصة الصفراء لنستكشف الأنظمة البيئية المائية.', 'البداية');

/* ---------- 8: warm-up + look & wonder as manga panels ---------- */
pres.addSection({ title: 'التمهيد' });
s = slideOf('BOARD', 'التمهيد · أنظر وأتساءل', ST('قصة مصوّرة (مانجا)', 'التهيئة'), 'التمهيد');
const K = '1A1A1A';
const panel = (x, y, w, h) => s.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: WHITE }, line: { color: K, width: 4 } });
const bubble = (t, x, y, w, h, fs, shape) => s.addText(t, { shape: shape || pres.shapes.OVAL_CALLOUT, x, y, w, h, fill: { color: WHITE }, line: { color: K, width: 2.5 }, fontSize: fs || 15, bold: true, color: INKC, align: 'center', valign: 'middle', rtlMode: true, isTextBox: true, margin: 6, objectName: AU() });
const caption = (t, x, y, w) => s.addText(t, { x, y, w, h: 0.36, fill: { color: 'FFF3B0' }, line: { color: K, width: 2 }, fontSize: 12, bold: true, color: INKC, align: 'center', valign: 'middle', rtlMode: true, isTextBox: true, margin: 2 });
// panel 1 (right, tall): explorer at the shore
panel(9.15, 1.35, 3.7, 5.35);
s.addImage({ path: im('w_shore'), x: 9.2, y: 1.4, w: 3.6, h: 5.25, sizing: { type: 'cover', w: 3.6, h: 5.25 } });
s.addImage({ path: IMG + 'girl-a.png', x: 9.6, y: 3.4, w: 2.4, h: 2.74, objectName: AU() });
caption('١ على الشاطئ', 11.45, 1.45, 1.3);
bubble('الماء يغطي معظم سطح الأرض! هل كله متشابه؟', 9.3, 1.95, 3.4, 1.25, 15);
// panel 2 (top middle): fresh water otters
panel(4.75, 1.35, 4.25, 2.55);
s.addImage({ path: im('w_otter'), x: 4.8, y: 1.4, w: 4.15, h: 2.45, sizing: { type: 'cover', w: 4.15, h: 2.45 } });
caption('٢ في المياه العذبة', 7.45, 1.45, 1.45);
bubble('ثعالب الماء تعيش في الأنهار والبرك!', 4.85, 2.85, 2.6, 0.95, 13, pres.shapes.ROUNDED_RECTANGULAR_CALLOUT);
// panel 3 (bottom middle): ocean depths
panel(4.75, 4.05, 4.25, 2.65);
s.addImage({ path: im('w_ocean'), x: 4.8, y: 4.1, w: 4.15, h: 2.55, sizing: { type: 'cover', w: 4.15, h: 2.55 } });
caption('٣ في أعماق المحيط', 7.45, 4.15, 1.45);
s.addText('واو!', { shape: pres.shapes.EXPLOSION1, x: 4.85, y: 4.15, w: 1.55, h: 1.15, fill: { color: 'FFD54F' }, line: { color: K, width: 2 }, fontSize: 20, bold: true, color: 'C62828', align: 'center', valign: 'middle', isTextBox: true, objectName: AU() });
bubble('قرش الحوت يسبح في المياه المالحة!', 6.1, 5.65, 2.8, 0.95, 13, pres.shapes.ROUNDED_RECTANGULAR_CALLOUT);
// panel 4 (left): look & wonder question
panel(0.55, 1.35, 4.05, 5.35);
s.addShape(pres.shapes.RECTANGLE, { x: 0.6, y: 1.4, w: 3.95, h: 5.25, fill: { color: 'EAF6FB' }, line: { color: 'EAF6FB' } });
caption('٤ أنظر وأتساءل', 2.9, 1.45, 1.55);
T(s, 'هل تعيش المخلوقات الحية نفسها في البركة والنهر والمحيط؟ وما الذي يجعل كل نظام بيئي مائي مختلفًا؟', { x: 0.7, y: 1.9, w: 3.75, h: 1.75, fontSize: 17, bold: true, color: SEA2 });
T(s, 'أتوقّع، ثم تظهر الأفكار بالنقر:', { x: 0.7, y: 3.65, w: 3.75, h: 0.32, fontSize: 12, bold: true, color: LEAFG });
['الماء عذب أو مالح', 'الماء ساكن أو جارٍ', 'العمق وضوء الشمس'].forEach((t, i) => reveal(s, t, { x: 0.75, y: 4.02 + i * 0.5, w: 3.65, h: 0.42, fontSize: 13, align: 'center' }));
s.addText([R('السؤال الأساسي', { fontSize: 11, color: ROSE, breakLine: true }), R('ما خصائص الأنظمة البيئية المختلفة على اليابسة وفي الماء؟', { fontSize: 13, color: MAROON })], { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.15, x: 0.7, y: 5.6, w: 3.75, h: 0.95, fill: { color: ROSELT }, line: { color: ROSEL, width: 1.5, dashType: 'dash' }, bold: true, align: 'center', valign: 'middle', rtlMode: true, isTextBox: true, margin: 4 });
s.addNotes('التمهيد وأنظر وأتساءل (٤ دقائق) بأسلوب القصة المصوّرة: تظهر فقاعات الكلام تلقائيًا. اقرئي المشاهد بالترتيب من اليمين: الشاطئ ← المياه العذبة ← أعماق المحيط ← سؤال «أنظر وأتساءل». تتوقع الطالبات، ثم انقري لإظهار الأفكار. السؤال الأساسي من مراجعة الدرس ص ١٥٧ (سؤال ٦).' + TEAMS);

/* ---------- 9–10: vocabulary & strategies ---------- */
s = slideOf('BOARD', 'مفرداتنا الجديدة', ST('البطاقات المصوّرة', 'المفردات'), 'التمهيد');
s.addImage({ path: im('s4_vocab'), x: 0.6, y: 1.4, w: 6.6, h: 3.62 });
const vocab = [['المناطق الحيوية', 'منطقة من الأرض لها مناخ محدد، تحوي أنواعًا معينة من المخلوقات الحية.'], ['مصبّات الأنهار', 'الأماكن التي تصب فيها مياه الأنهار في المحيطات أو البحار.'],
  ['الأراضي الرطبة (السبخات)', 'مناطق يكون مستوى الماء فيها قريبًا من سطح التربة في معظم الأوقات، وتشمل المستنقعات والسبخات.'], ['المحيطات', 'تغطي أكثر من ٧٠٪ من سطح الأرض، وتؤدي دورًا مهمًا في دورة الماء في الطبيعة.']];
vocab.forEach((v, i) => {
  const y = 1.4 + i * 1.33, q = newQ();
  box(s, { x: 7.45, y, w: 5.35, h: 1.2, line: { color: SEA, width: 2 } });
  T(s, v[0], { x: 7.55, y: y + 0.05, w: 5.15, h: 0.4, fontSize: 17, bold: true, color: SEA2 });
  T(s, 'المسي لتظهر المعنى…', { x: 7.55, y: y + 0.5, w: 5.15, h: 0.55, fontSize: 12, color: '9A8F95' });
  hotspot(s, q, 7.45, y, 5.35, 1.2);
  target(s, q, v[1], { x: 7.55, y: y + 0.45, w: 5.15, h: 0.68, fontSize: 13 });
  star(s, q, 7.3, y - 0.1, 0.36);
});
T(s, 'التعريفات من الكتاب: ص ١٥٥ و١٥٦ و١٥٧.', { x: 0.6, y: 5.15, w: 6.6, h: 0.35, fontSize: 12, bold: true, color: '1F6FA5', align: 'center' });
s.addImage({ path: IMG + 'girl-a.png', x: 2.95, y: 5.5, w: 1.1, h: 1.25 });
s.addNotes('المفردات (٣ دقائق): تخمّن الطالبة المعنى من الصورة، ثم تلمس البطاقة ليظهر التعريف كما في الكتاب.' + TEAMS);
full('s5_strat', 'استراتيجيات التعلم اليوم: التعلم الاستقصائي، والعمل في مجموعة، والذكاء الاصطناعي، ومشاهدة فيديو تعليمي.', 'التمهيد');

/* ---------- 11: explore — exploded view of the wetland model ---------- */
pres.addSection({ title: 'الاستكشاف' });
s = slideOf('BOARD', 'أستكشف', ST('منظر تفكيكي', 'الاستكشاف · نشاط ص ١٥٥'), 'الاستكشاف');
bookPic(s, 'bk-activity', 10.15, 1.42, 2.65, 4.05, 'نشاط · ص ١٥٥', true);
const CX = 4.9, cw = 2.4; // exploded stack, top to bottom
const layers = [
  ['كأس ماء ملوّن (ماء ملوّث)', '9FC5E8', 'D8577A', 'يمثّل الماء الملوّث الذي يصل إلى الأرض الرطبة.'],
  ['نباتات منزلية', '9CCB7A', '4E8A3A', 'تمثّل نباتات الأرض الرطبة مثل القصب.'],
  ['تربة وجذور', 'B98A57', '6B4A2B', 'تحبس الملوّثات وتبطئ حركة الماء.'],
  ['الأصيص بفتحاته', 'E3D3C0', '8A6E52', 'يخرج منه الماء المترشّح.'],
  ['ماء مترشّح أصفى', 'CFEFFF', '1F78A8', 'نقارن لونه بلون الماء قبل التجربة.']];
layers.forEach((l, i) => {
  const y = 1.42 + i * 0.86, h = 0.52;
  s.addShape(i === 0 ? pres.shapes.CAN : pres.shapes.FLOWCHART_MANUAL_OPERATION, { x: CX - cw / 2 + (i === 0 ? 0.6 : 0), y, w: i === 0 ? cw - 1.2 : cw, h, fill: { color: l[1] }, line: { color: l[2], width: 2 }, flipV: i === 3, objectName: AU() });
  if (i < 4) s.addShape(pres.shapes.DOWN_ARROW, { x: CX - 0.15, y: y + h + 0.02, w: 0.3, h: 0.3, fill: { color: SEA }, line: { color: SEA } });
  const right = true, lx = CX + cw / 2 + 0.15;
  s.addShape(pres.shapes.LINE, { x: Math.min(lx, right ? lx + 0.35 : lx - 0.35), y: y + h / 2, w: 0.35, h: 0, line: { color: '555555', width: 1.25, dashType: 'dash' } });
  numDot(s, i + 1, right ? lx + 0.38 : lx - 0.8, y + h / 2 - 0.21, SEA);
  T(s, [R(l[0], { bold: true, color: SEA2, breakLine: true }), R(l[3], { fontSize: 11, color: INKC })], { x: lx + 0.85, y: y - 0.1, w: 2.95, h: 0.74, fontSize: 13, align: right ? 'right' : 'right', valign: 'middle' });
});
const steps = [['١ أعمل نموذجًا', 'أضع أصيصين صغيرين لنباتات منزلية في وعاءين شفافين؛ كل نبتة وأصيص يمثّلان أرضًا رطبة.'], ['٢ ألاحظ', 'أصبّ ماءً نظيفًا على أحد الأصيصين ببطء، وألاحظ السائل الذي يخرج من قاعه.'], ['٣ أجرّب', 'أضيف ملوّن الطعام إلى كأس ماء، ثم أصبّه في الأصيص الثاني ببطء، وألاحظ لون الماء المترشّح.']];
steps.forEach((st, i) => T(s, [R(st[0] + ': ', { color: ROSE }), R(st[1])], { x: 0.55, y: 1.42 + i * 0.95, w: 2.95, h: 0.9, fontSize: 11, bold: true, valign: 'top' }));
T(s, [R('٤ أستخلص النتائج: ', { color: ROSE }), R('ماذا أستنتج حول دور الأراضي الرطبة؟')], { x: 0.55, y: 4.3, w: 2.95, h: 0.7, fontSize: 11, bold: true, valign: 'top' });
reveal(s, 'أستنتج: يخرج الماء من الأصيص أصفى من الماء الملوّن؛ فالأراضي الرطبة تعمل مصفاة للمياه، وتساعد على إزالة الملوّثات الناتجة عن العمليات الطبيعية أو الصناعة أو الزراعة.', { x: 0.55, y: 5.85, w: 12.25, h: 0.82, fontSize: 14 });
s.addNotes('أستكشف (٧ دقائق) بأسلوب المنظر التفكيكي: يُظهر الرسم أجزاء النموذج منفصلة من الأعلى إلى الأسفل، وتظهر الطبقات تلقائيًا بالترتيب. نفّذي النشاط كما في الكتاب ص ١٥٥ بأصيصين، ثم انقري لإظهار الاستنتاج (من نص الكتاب ص ١٥٥ عن الأراضي الرطبة). عبر Teams: نفّذي التجربة أمام الكاميرا.');

/* ---------- 12: explanation — timeline of fresh water to the sea ---------- */
pres.addSection({ title: 'الشرح' });
s = slideOf('BOARD', 'الأنظمة البيئية ذات المياه العذبة', ST('خط زمني', 'الشرح والتفسير · ص ١٥٤–١٥٥'), 'الشرح');
T(s, 'رحلة الماء: من البركة إلى المحيط (المسي كل محطة)', { x: 0.6, y: 1.32, w: 12.2, h: 0.42, fontSize: 18, bold: true, color: SEA2, align: 'center' });
s.addShape(pres.shapes.RIGHT_ARROW, { x: 0.6, y: 2.25, w: 12.2, h: 0.36, fill: { color: SEA }, line: { color: SEA }, flipH: true });
const fw = [['البرك والبحيرات', '🐸', 'الماء ساكن؛ وقد يغطي سطحه الطحالب الخضراء. تنمو البوص وزنبق الماء، وتعيش السلاحف المائية والضفادع وجراد البحر.'],
  ['الأنهار والجداول', '🐟', 'الماء جارٍ؛ للقصب جذور عميقة تثبّته في القاع، وللسلمون المنقّط جسم انسيابي، ولبعض الحيوانات خطاطيف أو مخالب.'],
  ['الأراضي الرطبة', '🌾', 'مستوى الماء قريب من سطح التربة؛ غنية بالحياة النباتية، وموطن للطيور، وتعمل مصفاة للمياه.'],
  ['مصبّات الأنهار', '🦩', 'تصب مياه الأنهار في البحار والمحيطات؛ مياهها أقل ملوحة من المحيط وأكثر ملوحة من النهر.']];
fw.forEach((f, i) => {
  const x = 12.8 - (i + 1) * 3.05 + 0.1, q = newQ();
  s.addText(AR(i + 1), { shape: pres.shapes.OVAL, x: x + 1.0, y: 1.92, w: 1.0, h: 1.0, fill: { color: WHITE }, line: { color: SEA, width: 4 }, fontSize: 30, bold: true, color: SEA2, align: 'center', valign: 'middle', isTextBox: true });
  textBox(s, f[0], { x: x + 0.1, y: 3.0, w: 2.8, h: 0.45, fill: { color: SEAL }, line: { color: SEA, width: 2 }, align: 'center', fontSize: 16, bold: true, color: SEA2, rectRadius: 0.2 });
  hotspot(s, q, x + 0.1, 1.86, 2.8, 1.62);
  target(s, q, f[2], { x: x + 0.1, y: 3.52, w: 2.8, h: 1.45, fontSize: 12, fill: { color: WHITE }, line: { color: SEA, width: 1.5 }, color: INKC });
  star(s, q, x + 2.05, 1.8, 0.4);
});
T(s, 'العوالق: مخلوقات مجهرية تعيش تحت سطح الماء، تتغذى عليها الحشرات والأسماك الصغيرة، وبعضها يصنع غذاءه بالبناء الضوئي.', { x: 0.6, y: 5.05, w: 12.2, h: 0.42, fontSize: 13, bold: true, color: LEAFG, fill: { color: 'EEF6E8' } });
T(s, [R('أختبر نفسي ص ١٥٥ · أقارن: ', { color: ROSE }), R('فيمَ تتشابه مصبّات الأنهار مع الأراضي الرطبة، وفيمَ تختلفان؟')], { x: 0.6, y: 5.52, w: 12.2, h: 0.4, fontSize: 14, bold: true });
reveal(s, 'تتشابهان: كلتاهما غنية بالحياة، ويتكاثر فيهما كثير من الطيور. تختلفان: مياه المصبّات أكثر ملوحة لاختلاط ماء النهر بماء البحر، أما الأراضي الرطبة فماؤها قريب من سطح التربة وتعمل مصفاة للمياه.', { x: 0.6, y: 5.95, w: 12.2, h: 0.75, fontSize: 13 });
s.addNotes('الأنظمة البيئية ذات المياه العذبة (٥ دقائق) بأسلوب الخط الزمني: نتتبع رحلة الماء من البركة إلى المصبّ. تلمس الطالبة دائرة كل محطة لتظهر خصائصها كما في الكتاب ص ١٥٤–١٥٥. التفكير الناقد (ص ١٥٥): ما الدور الذي تلعبه العوالق؟ الإجابة: غذاء للحشرات والأسماك الصغيرة، وبعضها يصنع غذاءه بالبناء الضوئي.' + TEAMS);

/* ---------- 13: explanation — vertical timeline: diving into the ocean ---------- */
s = slideOf('BOARD', 'ما الذي يعيش في المحيط؟', ST('خط زمني', 'الشرح والتفسير · ص ١٥٦'), 'الشرح');
s.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.4, w: 0.5, h: 5.25, fill: { color: SEA2 }, line: { color: SEA2 } });
s.addShape(pres.shapes.RECTANGLE, { x: 5.0, y: 1.4, w: 0.5, h: 1.6, fill: { color: '7FC4EF' }, line: { color: '7FC4EF' } });
const depth = [['السطح', 'أشعة الشمس تدفئ الماء، والمخلوقات تستخدم البناء الضوئي. تبدأ السلاسل الغذائية بالعوالق.'], ['نحو ٢٠٠ م', 'تقلّ أشعة الشمس تدريجيًا حتى تختفي تقريبًا.'], ['الأعماق', 'تزداد ظلمة الماء وبرودته، ويتوقف البناء الضوئي؛ فتتغذى المخلوقات على بعضها أو على مواد تصل من السطح.'], ['القاع', 'بعض البدائيات تحصل على غذائها من مواد كيميائية حارّة تتدفق من الفوهات الحرمائية والشقوق.']];
depth.forEach((d, i) => {
  const y = 1.45 + i * 1.3, q = newQ();
  s.addShape(pres.shapes.OVAL, { x: 4.98, y: y + 0.08, w: 0.54, h: 0.54, fill: { color: i ? 'FFC83D' : 'FFE082' }, line: { color: WHITE, width: 3 } });
  textBox(s, d[0], { x: 3.15, y: y + 0.1, w: 1.7, h: 0.5, align: 'center', fontSize: 15, bold: true, fill: { color: SEAL }, line: { color: SEA, width: 1.5 }, color: SEA2, rectRadius: 0.2 });
  hotspot(s, q, 3.1, y, 2.5, 0.72);
  target(s, q, d[1], { x: 5.75, y: y - 0.02, w: 4.1, h: 1.15, fontSize: 13, fill: { color: WHITE }, line: { color: SEA, width: 1.5 }, color: INKC });
  star(s, q, 5.55, y - 0.15, 0.34);
});
T(s, 'المسي النقطة أو اسم العمق', { x: 2.9, y: 6.35, w: 2.4, h: 0.3, fontSize: 11, bold: true, color: LEAFG, align: 'center' });
bookPic(s, 'w_ocean', 0.6, 1.42, 2.3, 2.7, null);
T(s, 'تغطي المحيطات أكثر من ٧٠٪ من سطح الأرض، وتؤدي دورًا مهمًا في دورة الماء.', { x: 0.55, y: 4.2, w: 2.4, h: 1.2, fontSize: 12, bold: true, color: SEA2, valign: 'top' });
T(s, 'العوامل المؤثرة: المدّ والجزر، الحرارة، الملوحة، ضغط الماء، أشعة الشمس.', { x: 0.55, y: 5.4, w: 2.4, h: 0.9, fontSize: 11, bold: true, color: LEAFG, valign: 'top' });
box(s, { x: 10.05, y: 1.4, w: 2.75, h: 5.25, line: { color: ROSEL, width: 2, dashType: 'dash' } });
T(s, 'أختبر نفسي ص ١٥٦', { x: 10.15, y: 1.45, w: 2.55, h: 0.35, fontSize: 13, bold: true, color: ROSE, align: 'center' });
T(s, 'التفكير الناقد: كيف يؤثر العمق في درجة حرارة المحيط؟', { x: 10.15, y: 1.85, w: 2.55, h: 0.95, fontSize: 13, bold: true, valign: 'top' });
mcq(s, { opts: ['تزداد', 'تقلّ'], ans: 1, a: 'كلما زاد العمق قلّت درجة الحرارة؛ لأن أشعة الشمس لا تصل إلى الأعماق.' }, 10.05, 2.85, 2.75, 14);
T(s, 'أقارن: أوجه التشابه والاختلاف بين المحيطات والمناطق الحيوية على اليابسة.', { x: 10.15, y: 4.4, w: 2.55, h: 1.0, fontSize: 12, bold: true, valign: 'top' });
reveal(s, 'تشابه: لكل منها عوامل تحدد المخلوقات فيها. اختلاف: في المحيط يحدّدها العمق والملوحة والضغط وضوء الشمس، وعلى اليابسة الحرارة والأمطار.', { x: 10.12, y: 5.25, w: 2.6, h: 1.35, fontSize: 10 });
s.addNotes('ما الذي يعيش في المحيط؟ (٥ دقائق) بأسلوب الخط الزمني العمودي: نغوص من السطح إلى القاع. تلمس الطالبة كل عمق لتظهر الخصائص كما في الكتاب ص ١٥٦. ثم أختبر نفسي ص ١٥٦.' + TEAMS);

/* ---------- 14: ocean zones (read the figure) ---------- */
s = slideOf('BOARD', 'مناطق الحياة في المحيط', ST('خط زمني', 'أقرأ الشكل · ص ١٥٦'), 'الشرح');
bookPic(s, 'w_zones', 0.6, 1.42, 7.4, 4.32, 'مناطق الحياة في المحيط · ص ١٥٦');
const life = [['العوالق', 'ومنها الدياتومات؛ تعيش قريبًا من سطح المحيط، وتشكّل مصدرًا رئيسًا لغذاء المخلوقات البحرية.'], ['السوابح', 'ومنها الجراد والأسماك والدلافين؛ مستهلكات تسبح في الماء.'], ['القاعيات', 'ومنها سرطان البحر والإسفنج والمرجان؛ حيوانات تعيش في قاع المحيط.']];
life.forEach((l, i) => {
  const y = 1.42 + i * 1.35, q = newQ();
  textBox(s, l[0], { x: 8.3, y, w: 4.5, h: 0.45, fontSize: 16, bold: true, color: SEA2, fill: { color: SEAL }, line: { color: SEA, width: 1.5 }, align: 'center', rectRadius: 0.2, objectName: 'tg_' + q });
  target(s, q, l[1], { x: 8.3, y: y + 0.5, w: 4.5, h: 0.75, fontSize: 12, fill: { color: WHITE }, line: { color: SEA, width: 1.5 }, color: INKC });
  star(s, q, 8.15, y - 0.12, 0.34);
});
box(s, { x: 8.3, y: 5.5, w: 4.5, h: 1.2, line: { color: ROSEL, width: 2, dashType: 'dash' } });
T(s, 'أقرأ الشكل: أيّ مناطق المحيط لا تنمو فيها الطحالب على القاع؟', { x: 8.4, y: 5.52, w: 4.3, h: 0.55, fontSize: 12, bold: true });
mcq(s, { opts: ['منطقة المدّ', 'منطقة الشاطئ', 'منطقة المحيط'], ans: 2, a: 'لأن ضوء الشمس لا يصل إلى قاعها.' }, 0.6, 6.08, 12.2, 13);
s.addNotes('مناطق الحياة في المحيط (٣ دقائق): المناطق الثلاث من الشاطئ إلى البحر المفتوح: منطقة المدّ، ثم منطقة الشاطئ، ثم منطقة المحيط. إرشاد الكتاب: إلامَ تحتاج الطحالب لصنع غذائها؟ (ضوء الشمس).' + TEAMS);

/* ---------- 15: mind map ---------- */
pres.addSection({ title: 'التنظيم' });
s = slideOf('BOARD', 'خريطتي الذهنية', ST('خريطة ذهنية', 'تنظيم المفاهيم'), 'التنظيم');
const C0 = [6.67, 3.95];
const mm = [
  ['المياه العذبة', '9CCB7A', 3.6, 2.15, ['البرك والبحيرات', 'الأنهار والجداول', 'الأراضي الرطبة']],
  ['مصبّات الأنهار', 'F4D77F', 3.6, 5.75, ['أقل ملوحة من المحيط', 'تتكاثر فيها الطيور']],
  ['المحيطات', '7FC4EF', 9.75, 2.15, ['منطقة المدّ', 'منطقة الشاطئ', 'منطقة المحيط']],
  ['مخلوقات المحيط', 'CDBDF0', 9.75, 5.75, ['العوالق', 'السوابح', 'القاعيات']]];
mm.forEach(b => { const x1 = Math.min(C0[0], b[2]), x2 = Math.max(C0[0], b[2]), y1 = Math.min(C0[1], b[3]), y2 = Math.max(C0[1], b[3]);
  s.addShape(pres.shapes.LINE, { x: x1, y: y1, w: x2 - x1, h: y2 - y1, line: { color: '8AA6B8', width: 5 }, flipV: (b[2] > C0[0]) !== (b[3] > C0[1]) }); });
s.addText('الأنظمة البيئية المائية', { shape: pres.shapes.OVAL, x: C0[0] - 1.45, y: C0[1] - 0.75, w: 2.9, h: 1.5, fill: { color: SEA }, line: { color: WHITE, width: 4 }, fontSize: 20, bold: true, color: WHITE, align: 'center', valign: 'middle', rtlMode: true, isTextBox: true });
mm.forEach((b, i) => {
  const q = newQ(), bx = b[2] - 1.15, by = b[3] - 0.38;
  s.addText(b[0], { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.3, x: bx, y: by, w: 2.3, h: 0.76, fill: { color: b[1] }, line: { color: WHITE, width: 3 }, fontSize: 17, bold: true, color: INKC, align: 'center', valign: 'middle', rtlMode: true, isTextBox: true, objectName: 'tg_' + q });
  const right = b[2] > C0[0], leaf = b[4];
  leaf.forEach((t, k) => {
    const lx = right ? bx + 2.4 : bx - 1.95, ly = by - 0.5 + k * 0.62 + (leaf.length === 2 ? 0.3 : 0);
    target(s, q, t, { x: right ? Math.min(lx, 12.8 - 1.8) : Math.max(lx, 0.55), y: ly, w: 1.8, h: 0.5, fontSize: 12, align: 'center', fill: { color: WHITE }, line: { color: b[1], width: 2.5 }, color: INKC, rectRadius: 0.25 });
  });
  star(s, q, bx + 1.95, by - 0.22, 0.36);
});
T(s, 'تذكر الطالبة فروع كل مجموعة، ثم تلمس المجموعة لتظهر فروعها.', { x: 3.6, y: 6.35, w: 6.1, h: 0.32, fontSize: 12, bold: true, color: LEAFG, align: 'center' });
s.addNotes('الخريطة الذهنية (٣ دقائق): المركز «الأنظمة البيئية المائية»، والفروع الأربعة: المياه العذبة، مصبّات الأنهار، المحيطات ومناطقها، مخلوقات المحيط. تلمس الطالبة الفرع ليظهر ما يتفرع منه مع نجمة.' + TEAMS);

/* ---------- 16: final assessment — visual cheat sheet ---------- */
pres.addSection({ title: 'التقويم' });
s = slideOf('BOARD', 'ملخصي البصري', ST('ملخص بصري', 'التقويم الختامي'), 'التقويم');
const cols = [['البرك والبحيرات', '🐸', 'عذب ساكن', 'البوص وزنبق الماء'], ['الأنهار والجداول', '🐟', 'عذب جارٍ', 'القصب والسلمون'], ['الأراضي الرطبة', '🌾', 'قريب من سطح التربة', 'مصفاة للمياه'], ['مصبّات الأنهار', '🦩', 'أقل ملوحة من المحيط', 'تكاثر الطيور'], ['المحيطات', '🐋', 'مالح', 'العوالق والسوابح والقاعيات']];
const rows = ['الماء', 'أتذكّر'];
const CWd = 2.3;
T(s, 'المسي علامة الاستفهام بعد أن تجيب الطالبة', { x: 0.6, y: 1.32, w: 12.2, h: 0.32, fontSize: 12, bold: true, color: LEAFG, align: 'center' });
rows.forEach((r, k) => textBox(s, r, { x: 0.55, y: 2.85 + k * 0.85, w: 0.95, h: 0.72, fontSize: 13, bold: true, align: 'center', fill: { color: SAND }, line: { color: WOOD } }));
cols.forEach((c, i) => {
  const x = 12.8 - (i + 1) * CWd - i * 0.12;
  s.addText([R(c[0], { fontSize: 16 })], { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.15, x, y: 1.72, w: CWd, h: 1.0, fill: { color: SEA }, line: { color: WHITE, width: 2 }, bold: true, color: WHITE, align: 'center', valign: 'middle', rtlMode: true, isTextBox: true });
  [c[2], c[3]].forEach((t, k) => {
    const q = newQ(), y = 2.85 + k * 0.85;
    s.addText('؟', { shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: 0.12, x, y, w: CWd, h: 0.72, fill: { color: WHITE }, line: { color: SEA, width: 2, dashType: 'dash' }, fontSize: 24, bold: true, color: SEA, align: 'center', valign: 'middle', isTextBox: true, objectName: 'tg_' + q });
    target(s, q, t, { x, y, w: CWd, h: 0.72, fontSize: 13, align: 'center', margin: 2 });
    star(s, q, x + CWd - 0.3, y - 0.12, 0.3);
  });
});
box(s, { x: 0.55, y: 4.65, w: 12.25, h: 2.05, line: { color: ROSEL, width: 2, dashType: 'dash' } });
T(s, '١ تحدٍّ: المخلوقات التي تعيش في قاع المحيط، مثل سرطان البحر والإسفنج والمرجان، تسمّى:', { x: 0.7, y: 4.7, w: 11.95, h: 0.4, fontSize: 15, bold: true });
mcq(s, { opts: ['العوالق', 'السوابح', 'القاعيات'], ans: 2, a: 'القاعيات' }, 0.55, 5.12, 12.25, 14);
T(s, '٢ تحدٍّ: تعمل الأراضي الرطبة على:', { x: 0.7, y: 5.65, w: 11.95, h: 0.4, fontSize: 15, bold: true });
mcq(s, { opts: ['تلويث المياه', 'تنقية المياه', 'زيادة ملوحة المياه'], ans: 1, a: 'تنقية المياه وإزالة الملوّثات' }, 0.55, 6.1, 12.25, 14);
s.addNotes('التقويم الختامي (٥ دقائق) بأسلوب الملخص البصري: بطاقة واحدة تلخّص الأنظمة البيئية المائية الخمسة. تكمل الطالبات الخانات شفهيًا، ثم تلمسين علامة الاستفهام للتحقق. سؤالا التحدي: المسي الإجابة الصحيحة (نجمة) أو الخاطئة (تهتز).' + TEAMS);

/* ---------- 17: lesson review p157 ---------- */
s = slideOf('BOARD', 'مراجعة الدرس', ST(null, 'التقويم · مراجعة الدرس ص ١٥٧'), 'التقويم');
bookPic(s, 'bk-reviewq', 0.6, 1.42, 2.7, 5.1, 'أفكّر وأتحدّث وأكتب · ص ١٥٧', true);
const RV = [
  ['٢ أقارن: فيمَ تتشابه الأنظمة البيئية في المياه العذبة والأنظمة البيئية في المحيط، وفيمَ تختلف؟', 'تتشابه: كلتاهما أنظمة بيئية مائية فيها عوالق ومخلوقات متكيّفة مع الماء. تختلف: المياه العذبة قليلة الملوحة، والمحيط مالح وعميق يتأثر بالمدّ والجزر والضغط وضوء الشمس.'],
  ['٣ التفكير الناقد: أفسّر لماذا يمكن تصنيف مناطق معيّنة من القارة المتجمدة الجنوبية على أنها صحارى؟', 'لأن الأمطار التي تسقط عليها قليلة جدًا، والصحراء منطقة قليلة الأمطار حتى لو كانت باردة.'],
  ['٦ السؤال الأساسي: ما خصائص الأنظمة البيئية المختلفة على اليابسة وفي الماء؟', 'لكل منطقة حيوية على اليابسة مناخ معين ومخلوقات معينة، وتحدد الحرارة والأمطار مناخها. وفي الماء تختلف الأنظمة البيئية في ملوحة الماء وحركته وعمقه، وتغطي الأنظمة البيئية المائية معظم سطح الأرض.']];
RV.forEach((r, i) => {
  const y = 1.42 + i * 1.62;
  box(s, { x: 3.55, y, w: 9.25, h: 1.5, line: { color: SEA, width: 1.5 } });
  T(s, r[0], { x: 3.65, y: y + 0.03, w: 9.05, h: 0.55, fontSize: 13, bold: true, color: SEA2 });
  reveal(s, r[1], { x: 3.65, y: y + 0.6, w: 9.05, h: 0.83, fontSize: 12 });
});
T(s, 'إثراء: «العلوم والكتابة: الدليل السياحي» و«العلوم والمجتمع: أقارن بين العادات» (ص ١٥٧) مناسبان واجبًا منزليًا.', { x: 3.55, y: 6.32, w: 9.25, h: 0.36, fontSize: 12, bold: true, color: LEAFG });
s.addNotes('مراجعة الدرس ص ١٥٧: تجيب الطالبات، ثم انقري لإظهار الإجابات بالترتيب. أسئلة المراجعة ١ و٤ و٥ استُخدمت في مراجعة الأسبوع الماضي في بداية الحصة. المطويات: أنظم أفكاري في مطوية ثلاثية: المناطق الحيوية لها… / تشمل المناطق الحيوية على اليابسة… / تغطي الأنظمة البيئية المائية…' + TEAMS);

full('s7_end', 'الختام: في نهاية رحلتنا سأكون مستكشفة للأنظمة البيئية! عودي إلى «نواتج التعلم» وتحققي من الأهداف مع الطالبات.', 'التقويم');

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
