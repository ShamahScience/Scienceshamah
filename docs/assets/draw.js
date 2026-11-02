// القرعة: أسماء سادس أول وسادس ثاني تدور على الشاشة وتقف عند الاسم المختار.
// الأسماء لا تُكتب في الموقع العام: تُجلب من جدول المنصة بعد دخول المعلمة في لوحة المعلمة على هذا الجهاز،
// أو تلصقها المعلمة مرة واحدة فتُحفظ في هذا المتصفح فقط.
(function () {
  const CLS = [{ id: '6a', n: 'سادس أول', s: '١/٦' }, { id: '6b', n: 'سادس ثاني', s: '٢/٦' }];
  const K = 'draw:';
  const get = (k, d) => { try { const v = localStorage.getItem(K + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
  const set = (k, v) => { try { localStorage.setItem(K + k, JSON.stringify(v)); } catch (e) {} };
  let names = get('names', { '6a': [], '6b': [] }), out = get('out', { '6a': [], '6b': [] }), noRepeat = get('norep', true);
  const box = document.getElementById('drawBox'); if (!box) return;
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function render(msg) {
    box.innerHTML = `<div class="dr-top"><span class="strat"><b>الاستراتيجية:</b> القرعة العادلة – المشاركة للجميع</span>
      <label class="dr-nr"><input type="checkbox" id="drNr" ${noRepeat ? 'checked' : ''}> لا تتكرّر من خرج اسمها</label>
      <button class="btn" id="drSet">⚙️ الأسماء</button></div>
      ${msg ? `<p class="dr-msg">${msg}</p>` : ''}
      <div class="dr-cols">${CLS.map((c) => `<div class="dr-col" data-c="${c.id}">
        <div class="dr-h">🎓 ${c.n} <span>${c.s}</span></div>
        <div class="dr-big" id="big_${c.id}">${(names[c.id] || []).length ? '❓' : 'لا توجد أسماء بعد'}</div>
        <button class="btn main dr-go" data-c="${c.id}">🎲 اسحبي اسمًا</button>
        <div class="dr-chips" id="chips_${c.id}">${(names[c.id] || []).map((n) => `<span class="dr-chip ${out[c.id].includes(n) ? 'out' : ''}">${esc(n)}</span>`).join('')}</div>
        <button class="btn dr-reset" data-c="${c.id}">🔄 إعادة الجميع</button></div>`).join('')}</div>
      <div class="dr-edit" id="drEdit" hidden>${CLS.map((c) => `<label>${c.n} (${c.s}) – اسم في كل سطر:<textarea id="ta_${c.id}">${esc((names[c.id] || []).join('\n'))}</textarea></label>`).join('')}
        <p class="note">🔒 تُحفظ الأسماء في هذا المتصفح فقط، ولا تُرفع إلى الموقع.</p><button class="btn main" id="drSave">💾 حفظ الأسماء</button></div>`;
    box.querySelector('#drNr').onchange = (e) => { noRepeat = e.target.checked; set('norep', noRepeat); };
    box.querySelector('#drSet').onclick = () => { const e = box.querySelector('#drEdit'); e.hidden = !e.hidden; };
    box.querySelector('#drSave').onclick = () => {
      CLS.forEach((c) => { names[c.id] = box.querySelector('#ta_' + c.id).value.split('\n').map((x) => x.trim()).filter(Boolean); out[c.id] = out[c.id].filter((n) => names[c.id].includes(n)); });
      set('names', names); set('out', out); render('✔ حُفظت الأسماء.');
    };
    box.querySelectorAll('.dr-go').forEach((b) => b.onclick = () => spin(b.dataset.c, b));
    box.querySelectorAll('.dr-reset').forEach((b) => b.onclick = () => { out[b.dataset.c] = []; set('out', out); render(); });
  }

  function spin(c, btn) {
    const all = names[c] || [], pool = noRepeat ? all.filter((n) => !out[c].includes(n)) : all.slice();
    const big = document.getElementById('big_' + c);
    if (!all.length) { big.textContent = 'أضيفي الأسماء من ⚙️ الأسماء'; return; }
    if (!pool.length) { big.textContent = 'شاركت الجميع! 👏 اضغطي «إعادة الجميع»'; return; }
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const chips = [...document.getElementById('chips_' + c).children];
    const order = chips.filter((x) => !x.classList.contains('out'));
    let i = Math.floor(Math.random() * order.length), delay = 45, steps = 0;
    const target = 28 + Math.floor(Math.random() * 10);
    btn.disabled = true; big.classList.remove('win');
    const tick = () => {
      order.forEach((x) => x.classList.remove('hot'));
      const ch = order[i % order.length]; i++; steps++;
      const done = steps >= target && ch.textContent === pick;
      ch.classList.add('hot'); big.textContent = ch.textContent;
      try { if (typeof tone === 'function' && typeof ctx === 'function' && ctx()) tone(500 + (steps % 2) * 120, actx.currentTime, .05, .04, 'square'); } catch (e) {}
      if (done) {
        big.classList.add('win'); ch.classList.add('win');
        try { fanfare(); confetti(); } catch (e) {}
        if (noRepeat) { out[c].push(pick); set('out', out); setTimeout(() => { ch.classList.remove('hot', 'win'); ch.classList.add('out'); }, 2500); }
        btn.disabled = false; return;
      }
      if (steps >= target - 12) delay *= 1.13;
      setTimeout(tick, delay);
    };
    tick();
  }

  // names from the platform sheet when the teacher is signed in on this device
  (async () => {
    let url = '', pin = '';
    try { url = JSON.parse(localStorage.getItem('platform:api') || '""'); pin = JSON.parse(localStorage.getItem('platform:pin') || '""'); } catch (e) {}
    const empty = !names['6a'].length && !names['6b'].length;
    if (!url || !pin) { render(empty ? '👋 لتظهر الأسماء: سجّلي الدخول في لوحة المعلمة على هذا الجهاز، أو اضغطي «⚙️ الأسماء» والصقيها.' : ''); return; }
    render('⏳ جارٍ تحميل الأسماء من جدول المنصة…');
    try {
      const r = await fetch(url, { method: 'POST', body: JSON.stringify({ action: 'students', pin }) }); const j = await r.json();
      if (!j.ok) throw new Error(j.error);
      CLS.forEach((c) => { names[c.id] = j.students[c.id] || []; out[c.id] = out[c.id].filter((n) => names[c.id].includes(n)); });
      set('names', names); render();
    } catch (e) { render('تعذّر تحميل الأسماء من الجدول، فاستخدمت الأسماء المحفوظة.'); }
  })();
})();
