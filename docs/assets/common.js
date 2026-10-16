// منصة شامه للعلوم — الإعدادات والدوال المشتركة
const PLATFORM = {
  name: 'منصة شامه للعلوم',
  teacher: 'أ/ شامه البقمي',
  subject: 'العلوم',
  classes: [{ id: '6a', name: 'سادس أول' }, { id: '6b', name: 'سادس ثاني' }]
};

// بعد نشر Google Apps Script يمكن لصق رابطه هنا (اختياري) ليصبح رابط الطالبات أقصر.
const CONFIG_API = '';

const store = {
  get(k, d) { try { const v = localStorage.getItem('platform:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('platform:' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { try { localStorage.removeItem('platform:' + k); } catch (e) {} }
};

const b64u = {
  enc: s => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''),
  dec: s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/'))))
};

const params = new URLSearchParams(location.search);

function getApi() {
  const fromLink = params.get('s');
  if (fromLink) { try { const u = b64u.dec(fromLink); if (/^https:\/\/script\.google(usercontent)?\.com\//.test(u)) { store.set('api', u); return u; } } catch (e) {} }
  return CONFIG_API || store.get('api', '');
}

async function api(payload) {
  const url = getApi();
  if (!url) throw new Error('لم يتم ربط المنصة بـ Google Sheet بعد');
  let res;
  try { res = await fetch(url, { method: 'POST', body: JSON.stringify(payload) }); }
  catch (e) { throw new Error('تعذّر الاتصال. تأكدي من الإنترنت وحاولي مرة ثانية'); }
  let j;
  try { j = await res.json(); } catch (e) { throw new Error('رد غير متوقع من الخادم. تأكدي من نشر Apps Script للجميع (Anyone)'); }
  if (!j.ok) throw new Error(j.error || 'حدث خطأ');
  return j;
}

const className = id => (PLATFORM.classes.find(c => c.id === id) || { name: id }).name;
const norm = s => String(s || '').replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
const LETTERS = ['أ', 'ب', 'ج', 'د', 'هـ', 'و'];

function siteBase() { return location.href.split('#')[0].split('?')[0].replace(/[^/]*$/, ''); }
function studentLink(activityId) {
  const u = new URL(siteBase() + 'index.html');
  if (activityId) u.searchParams.set('a', activityId);
  if (!CONFIG_API && getApi()) u.searchParams.set('s', b64u.enc(getApi()));
  return u.toString();
}

// h('div', {class:'x', onclick: fn}, 'text', child, ...)
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === false || v === null || v === undefined) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v === true ? (k.startsWith('aria-') ? 'true' : '') : v);
  }
  kids.flat().forEach(c => { if (c === null || c === undefined || c === false) return; el.append(c.nodeType ? c : String(c)); });
  return el;
}

let toastTimer;
function toast(text) {
  let t = document.querySelector('.toast');
  if (!t) { t = h('div', { class: 'toast', role: 'status' }); document.body.append(t); }
  t.textContent = text; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => t.hidden = true, 2600);
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); toast('تم النسخ ✅'); }
  catch (e) {
    const ta = h('textarea', {}); ta.value = text; document.body.append(ta); ta.select();
    try { document.execCommand('copy'); toast('تم النسخ ✅'); } catch (e2) { toast('انسخي الرابط يدويًا'); }
    ta.remove();
  }
}

function modal(...content) {
  const ov = h('div', { class: 'overlay', onclick: e => { if (e.target === ov) ov.remove(); } }, h('div', { class: 'modal', role: 'dialog' }, ...content));
  document.body.append(ov);
  const onKey = e => { if (e.key === 'Escape') { ov.remove(); document.removeEventListener('keydown', onKey); } };
  document.addEventListener('keydown', onKey);
  return ov;
}

function qrBox(text, size = 220) {
  const box = h('div', { style: 'background:#fff;padding:12px;border-radius:12px;display:inline-block;line-height:0' });
  if (window.qrcode) {
    const qr = qrcode(0, 'M'); qr.addData(text); qr.make();
    box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    const svg = box.firstElementChild; svg.setAttribute('width', size); svg.setAttribute('height', size); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', 'باركود الرابط');
  } else box.append('الباركود غير متاح الآن');
  return box;
}
