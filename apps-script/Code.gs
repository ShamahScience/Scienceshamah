/**
 * منصة أ/ شامه البقمي — الخادم (Google Apps Script + Google Sheets)
 *
 * طريقة التركيب (مرة واحدة):
 * 1) افتحي Google Sheet جديد ← الإضافات (Extensions) ← Apps Script.
 *    (أو افتحي script.google.com/create مباشرة، وسيُنشأ ملف البيانات تلقائيًا في Drive)
 * 2) احذفي الموجود والصقي هذا الملف كاملًا ← حفظ.
 * 3) من القائمة العلوية اختاري الدالة setup ثم «تشغيل» (Run) ووافقي على الأذونات.
 * 4) نشر (Deploy) ← نشر جديد (New deployment) ← النوع: تطبيق ويب (Web app)
 *    التنفيذ باسم: أنا (Me) — من يمكنه الوصول: أي شخص (Anyone) ← نشر.
 * 5) انسخي رابط تطبيق الويب (ينتهي بـ /exec) والصقيه في صفحة المعلمة.
 *
 * الرمز السري الافتراضي للمعلمة: 1234 (غيّريه من «إعداداتي» في المنصة).
 */

const SHEETS = {
  students:   ['class', 'name'],
  activities: ['id', 'title', 'classes', 'questions', 'active', 'created', 'timer'],
  responses:  ['time', 'activity', 'class', 'name', 'answers', 'score', 'total']
};

// يعمل سواء فُتح الكود من داخل Google Sheet أو مباشرة من script.google.com
function getSS() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('SHEET_ID');
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create('منصة شامه للعلوم — البيانات');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function setup() {
  const ss = getSS();
  Object.keys(SHEETS).forEach(function (name) {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(SHEETS[name]);
    sh.setFrozenRows(1);
  });
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('PIN')) props.setProperty('PIN', '1234');
  const first = ss.getSheetByName('Sheet1') || ss.getSheetByName('ورقة1');
  if (first && ss.getSheets().length > 3) ss.deleteSheet(first);
}

function doGet(e) { return respond(e.parameter || {}); }
function doPost(e) {
  let p = {};
  try { p = JSON.parse(e.postData.contents); } catch (err) { p = e.parameter || {}; }
  return respond(p);
}

function respond(p) {
  let body;
  try { body = Object.assign({ ok: true }, route(p)); }
  catch (err) { body = { ok: false, error: String(err && err.message ? err.message : err) }; }
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- helpers ----------
function sheet(name) {
  let sh = getSS().getSheetByName(name);
  if (!sh) { setup(); sh = getSS().getSheetByName(name); }
  return sh;
}
function rows(name) {
  const sh = sheet(name), n = sh.getLastRow();
  if (n < 2) return [];
  const head = SHEETS[name];
  return sh.getRange(2, 1, n - 1, head.length).getValues().map(function (r, i) {
    const o = { _row: i + 2 };
    head.forEach(function (h, j) { o[h] = r[j]; });
    return o;
  });
}
function norm(s) {
  return String(s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
}
function requirePin(pin) {
  const real = PropertiesService.getScriptProperties().getProperty('PIN') || '1234';
  if (String(pin || '') !== real) throw new Error('الرمز السري غير صحيح');
}
function parseActivity(r) {
  let qs = [];
  try { qs = JSON.parse(r.questions || '[]'); } catch (e) { qs = []; }
  return {
    id: String(r.id), title: String(r.title), classes: String(r.classes || '').split(',').filter(String),
    questions: qs, active: r.active === true || r.active === 'TRUE', created: r.created, timer: Number(r.timer) || 0, _row: r._row
  };
}
function findActivity(id) {
  const r = rows('activities').filter(function (x) { return String(x.id) === String(id); })[0];
  return r ? parseActivity(r) : null;
}
function studentsBy() {
  const out = {};
  rows('students').forEach(function (r) { (out[r.class] = out[r.class] || []).push(String(r.name)); });
  return out;
}
function publicActivity(a) {
  return {
    id: a.id, title: a.title, classes: a.classes, timer: a.timer,
    questions: a.questions.map(function (q) { return { t: q.t, o: q.o }; })
  };
}

// ---------- routes ----------
function route(p) {
  const action = p.action;

  // ---- public (students) ----
  if (action === 'portal') {
    const acts = rows('activities').map(parseActivity).filter(function (a) { return a.active; });
    return { activities: acts.map(function (a) { return { id: a.id, title: a.title, classes: a.classes, count: a.questions.length }; }) };
  }
  if (action === 'activity') {
    const a = findActivity(p.id);
    if (!a || !a.active) throw new Error('هذا النشاط غير متاح الآن');
    const all = studentsBy(), students = {};
    a.classes.forEach(function (c) { students[c] = all[c] || []; });
    return { activity: publicActivity(a), students: students };
  }
  if (action === 'submit') {
    const lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      const a = findActivity(p.id);
      if (!a || !a.active) throw new Error('هذا النشاط مغلق الآن');
      if (a.classes.indexOf(p.cls) < 0) throw new Error('الفصل غير صحيح');
      const list = studentsBy()[p.cls] || [];
      const name = list.filter(function (n) { return norm(n) === norm(p.name); })[0];
      if (!name) throw new Error('الاسم غير موجود في قائمة الفصل');
      const key = a.questions.map(function (q) { return Number(q.a); });
      const prev = rows('responses').filter(function (r) { return String(r.activity) === a.id && r.class === p.cls && norm(r.name) === norm(name); })[0];
      if (prev) {
        let ans = []; try { ans = JSON.parse(prev.answers); } catch (e) {}
        return { already: true, score: Number(prev.score), total: Number(prev.total), answers: ans, key: key };
      }
      const answers = (p.answers || []).slice(0, key.length).map(function (x) { return x === null || x === undefined ? -1 : Number(x); });
      let score = 0;
      key.forEach(function (k, i) { if (answers[i] === k) score++; });
      sheet('responses').appendRow([new Date(), a.id, p.cls, name, JSON.stringify(answers), score, key.length]);
      return { score: score, total: key.length, answers: answers, key: key };
    } finally { lock.releaseLock(); }
  }

  // ---- teacher ----
  requirePin(p.pin);
  const props = PropertiesService.getScriptProperties();

  if (action === 'login') return { teacher: props.getProperty('TEACHER') || '' };

  if (action === 'setPin') {
    if (!p.newPin || String(p.newPin).length < 4) throw new Error('الرمز يجب أن يكون 4 أرقام أو أكثر');
    props.setProperty('PIN', String(p.newPin)); return {};
  }

  if (action === 'students') return { students: studentsBy() };

  if (action === 'saveStudents') {
    const sh = sheet('students'), keep = rows('students').filter(function (r) { return r.class !== p.cls; });
    const data = keep.map(function (r) { return [r.class, r.name]; })
      .concat((p.names || []).map(function (n) { return [p.cls, n]; }));
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 2).clearContent();
    if (data.length) sh.getRange(2, 1, data.length, 2).setValues(data);
    return { students: studentsBy() };
  }

  if (action === 'listActivities') {
    const counts = {};
    rows('responses').forEach(function (r) { counts[r.activity] = (counts[r.activity] || 0) + 1; });
    const acts = rows('activities').map(parseActivity).map(function (a) {
      delete a._row; a.responses = counts[a.id] || 0; return a;
    }).reverse();
    return { activities: acts };
  }

  if (action === 'saveActivity') {
    const a = p.activity || {};
    if (!a.title) throw new Error('اكتبي عنوان النشاط');
    if (!a.questions || !a.questions.length) throw new Error('أضيفي سؤالًا واحدًا على الأقل');
    const sh = sheet('activities');
    const existing = a.id ? findActivity(a.id) : null;
    const id = existing ? existing.id : Utilities.getUuid().slice(0, 8);
    const row = [id, a.title, (a.classes || []).join(','), JSON.stringify(a.questions),
      existing ? existing.active : true, existing ? existing.created : new Date(), Number(a.timer) || 0];
    if (existing) sh.getRange(existing._row, 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
    return { id: id };
  }

  if (action === 'setActive') {
    const a = findActivity(p.id); if (!a) throw new Error('النشاط غير موجود');
    sheet('activities').getRange(a._row, 5).setValue(!!p.active); return {};
  }

  if (action === 'deleteActivity') {
    const a = findActivity(p.id); if (!a) return {};
    sheet('activities').deleteRow(a._row);
    const sh = sheet('responses');
    rows('responses').filter(function (r) { return String(r.activity) === a.id; })
      .map(function (r) { return r._row; }).sort(function (x, y) { return y - x; })
      .forEach(function (rw) { sh.deleteRow(rw); });
    return {};
  }

  if (action === 'results') {
    const a = findActivity(p.id); if (!a) throw new Error('النشاط غير موجود');
    const all = studentsBy(), students = {};
    a.classes.forEach(function (c) { students[c] = all[c] || []; });
    const res = rows('responses').filter(function (r) { return String(r.activity) === a.id; }).map(function (r) {
      let ans = []; try { ans = JSON.parse(r.answers); } catch (e) {}
      return { time: r.time, cls: r.class, name: r.name, answers: ans, score: Number(r.score), total: Number(r.total) };
    });
    delete a._row;
    return { activity: a, students: students, responses: res };
  }

  if (action === 'resetResponses') {
    const sh = sheet('responses');
    rows('responses').filter(function (r) { return String(r.activity) === String(p.id); })
      .map(function (r) { return r._row; }).sort(function (x, y) { return y - x; })
      .forEach(function (rw) { sh.deleteRow(rw); });
    return {};
  }

  throw new Error('طلب غير معروف');
}
