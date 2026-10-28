// هوية الطالبة في ألعاب الصف السادس: تختار فصلها واسمها مرة واحدة، فتُسجَّل زيارتها، وتصل نتيجة كل لعبة إلى المعلمة.
// ملف مستقل (لا يحتاج common.js) حتى لا يتعارض مع متغيرات الألعاب.
(function () {
  // يجب أن يطابق CONFIG_API في assets/common.js
  const CONFIG_API = '';
  const PLATFORM = { classes: [{ id: '6a', name: 'سادس أول' }, { id: '6b', name: 'سادس ثاني' }] };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('platform:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('platform:' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function getApi() {
    const s = new URLSearchParams(location.search).get('s');
    if (s) { try { const u = decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))); if (/^https:\/\/script\.google(usercontent)?\.com\//.test(u)) { store.set('api', u); return u; } } catch (e) {} }
    return CONFIG_API || store.get('api', '');
  }
  async function api(payload) {
    const r = await fetch(getApi(), { method: 'POST', body: JSON.stringify(payload) });
    const j = await r.json(); if (!j.ok) throw new Error(j.error || 'خطأ'); return j;
  }
  const GAME = document.documentElement.dataset.game || '';
  const TITLE = document.documentElement.dataset.title || document.title;

  const ar = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
  function me() { const m = store.get('me', null); return m && m.cls && m.name ? m : null; }
  function connected() { return !!getApi(); }

  function toast(text) {
    const t = document.createElement('div');
    t.textContent = text;
    t.style.cssText = 'position:fixed;inset-inline:16px;bottom:18px;z-index:99999;margin:auto;max-width:420px;background:#1E5E3A;color:#fff;' +
      'padding:12px 16px;border-radius:14px;font:700 16px Tahoma,system-ui,sans-serif;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.25)';
    document.body.appendChild(t); setTimeout(() => t.remove(), 3500);
  }

  // نافذة اختيار الفصل والاسم
  function ask(onDone) {
    const wrap = document.createElement('div');
    wrap.style.cssText = 'position:fixed;inset:0;z-index:99998;background:rgba(20,40,30,.55);display:flex;align-items:center;justify-content:center;padding:16px';
    const box = document.createElement('div');
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.style.cssText = 'background:#fff;color:#2B3A55;border-radius:20px;padding:20px;width:100%;max-width:460px;max-height:90vh;overflow:auto;' +
      'font-family:Tahoma,system-ui,sans-serif;direction:rtl;text-align:right;box-shadow:0 10px 30px rgba(0,0,0,.3)';
    wrap.appendChild(box); document.body.appendChild(wrap);
    let roster = {}, cls = '', name = '';
    const btnCss = 'border:2px solid #D7E6DB;background:#fff;border-radius:12px;padding:10px;font:700 16px Tahoma,sans-serif;cursor:pointer;color:#2B3A55';
    const on = 'border-color:#2E8B57;background:#E7F6EC';
    function render(msg) {
      box.innerHTML = '';
      const h = document.createElement('h2'); h.textContent = 'مرحبًا يا عالمتي الصغيرة 👋'; h.style.margin = '0 0 6px'; box.appendChild(h);
      const p = document.createElement('p'); p.textContent = 'اختاري فصلك واسمك لتصل نتيجتك إلى المعلمة.'; p.style.cssText = 'margin:0 0 12px;color:#6B7A8F'; box.appendChild(p);
      const seg = document.createElement('div'); seg.style.cssText = 'display:flex;gap:8px;margin-bottom:12px';
      PLATFORM.classes.forEach(c => {
        const b = document.createElement('button'); b.textContent = c.name; b.style.cssText = btnCss + ';flex:1;' + (cls === c.id ? on : '');
        b.onclick = () => { cls = c.id; name = ''; render(); }; seg.appendChild(b);
      });
      box.appendChild(seg);
      if (cls) {
        const list = (roster[cls] || []).slice().sort((a, b) => a.localeCompare(b, 'ar'));
        if (list.length) {
          const g = document.createElement('div'); g.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;margin-bottom:12px';
          list.forEach(n => { const b = document.createElement('button'); b.textContent = n; b.style.cssText = btnCss + ';' + (name === n ? on : ''); b.onclick = () => { name = n; render(); }; g.appendChild(b); });
          box.appendChild(g);
        } else {
          const inp = document.createElement('input'); inp.placeholder = 'اكتبي اسمك'; inp.value = name;
          inp.style.cssText = 'width:100%;box-sizing:border-box;padding:12px;border:2px solid #D7E6DB;border-radius:12px;font:16px Tahoma,sans-serif;margin-bottom:12px';
          inp.oninput = () => { name = inp.value.trim(); go.disabled = !name; }; box.appendChild(inp);
        }
      }
      const go = document.createElement('button'); go.textContent = name ? 'ابدئي يا ' + name.split(' ')[0] + ' 🚀' : 'ابدئي';
      go.disabled = !(cls && name);
      go.style.cssText = 'width:100%;border:none;border-radius:999px;padding:14px;font:700 18px Tahoma,sans-serif;color:#fff;background:#2E8B57;cursor:pointer;opacity:' + (go.disabled ? '.5' : '1');
      go.onclick = () => { if (!(cls && name)) return; store.set('me', { cls, name }); wrap.remove(); onDone(); };
      box.appendChild(go);
      if (msg) { const m = document.createElement('p'); m.textContent = msg; m.style.cssText = 'color:#6B7A8F;font-size:13px;margin:10px 0 0'; box.appendChild(m); }
    }
    render();
    if (connected()) api({ action: 'roster' }).then(r => { roster = r.students || {}; render(); }).catch(() => render('تعذّر جلب الأسماء، اكتبي اسمك.'));
  }

  function visit(page) {
    const m = me();
    if (!m || !connected()) return Promise.resolve();
    return api({ action: 'visit', page, cls: m.cls, name: m.name }).catch(() => {});
  }

  // تُستدعى من اللعبة عند انتهائها
  window.reportGame = function (score, total) {
    const m = me();
    if (!m || !connected()) return;
    api({ action: 'gameResult', game: GAME, title: TITLE, cls: m.cls, name: m.name, score, total })
      .then(() => toast('✔ وصلت نتيجتك إلى المعلمة: ' + ar(score) + ' من ' + ar(total)))
      .catch(() => toast('تعذّر إرسال النتيجة. تأكدي من الإنترنت.'));
  };
  window.studentVisit = visit;
  window.currentStudent = me;

  function begin() { if (GAME) visit(GAME); }
  function init() { if (me()) begin(); else ask(begin); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
