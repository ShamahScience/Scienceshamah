# Builds template.html from the old template (head + home) and tasks.html, with script-free interactivity
import re
D = '/home/user/Scienceshamah/integrated-lessons/health-care/worksheet-src/'
t = open(D + 'template.html').read()
tasks = open(D + 'tasks.html').read()

TIMES = ['الصباح الباكر', 'في المدرسة', 'وقت الغداء', 'العصر', 'الليل']
CARDS = {'d1': ('i-juice.jpg', 'أتناول غذاءً صحيًا متوازنًا وأشرب الماء', 3), 'd2': ('i-sleep.jpg', 'أنام مبكرًا نحو ٨ ساعات', 5),
         'd3': ('i-teeth.jpg', 'أنظّف أسناني بالفرشاة والمعجون', 1), 'd4': ('v-sport.jpg', 'أمارس الرياضة', 4), 'd5': ('i-hands.jpg', 'أغسل يديّ قبل تناول الطعام', 2)}

def times(m):
    name, ok = m.group(1), int(m.group(2))
    return ''.join(f'<label><input type="radio" name="{name}" value="{k}"{" data-ok" if k == ok else ""}><span>{TIMES[k-1]}</span></label>' for k in range(1, 6))
tasks = re.sub(r'\{\{times:(d\d):(\d)\}\}', times, tasks)
day = ''
for k in range(1, 6):
    cells = ''.join(f'<div class="dm" data-c="{c}" data-t="{k}">{v[1]}</div>' for c, v in CARDS.items())
    day += f'<div class="slot"><h3>{TIMES[k-1]}</h3><div class="in">{cells}</div></div>'
tasks = tasks.replace('{{daymodel}}', day)
STAR = '<svg viewBox="0 0 24 24"><path fill="#ffc83d" stroke="#d99a00" stroke-width="1.2" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>'
tasks = tasks.replace('{{stars}}', STAR * 3)

dm_rules = '\n'.join(f'.panel:has(input[name="{c}"][value="{k}"]:checked) .dm[data-c="{c}"][data-t="{k}"]{{display:flex}}' for c in CARDS for k in range(1, 6))
css = """
/* script-free interactivity: choices, checking and feedback work even where scripts are blocked */
.chk{position:absolute;opacity:0;pointer-events:none;width:1px;height:1px}
.items.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
.items .item{width:auto;user-select:auto;-webkit-user-select:auto}
.items .item b{font-size:14px;line-height:1.4}
.items .item.wide{border:0;background:none;align-items:flex-start}
.pick{display:flex;gap:6px;flex-wrap:wrap;justify-content:center}
.pick label{cursor:pointer}
.pick input{position:absolute;opacity:0;width:1px;height:1px}
.pick span{display:inline-block;border:2px solid #e7cfa8;border-radius:999px;padding:3px 12px;font-weight:700;font-size:14px;background:#fff;line-height:1.6}
.pick.big span{font-size:20px;padding:6px 26px}
.pick.times span{font-size:12px;padding:2px 9px}
.pick input:checked + span{border-color:var(--blue);background:#e8f4fb;color:#155a85}
.pick input:focus-visible + span{outline:3px solid var(--blue);outline-offset:2px}
.chk:checked ~ .items input[data-ok]:checked + span{border-color:var(--ok);background:var(--ok-l);color:var(--ok)}
.chk:checked ~ .items input[data-ok]:checked + span::after{content:" ✓"}
.chk:checked ~ .items input:not([data-ok]):checked + span{border-color:var(--bad);background:var(--bad-l);color:var(--bad);animation:shake .35s}
.chk:checked ~ .items input:not([data-ok]):checked + span::after{content:" ✗"}
.model{display:none}
.chk:checked ~ .model{display:block}
.fb p{display:none;margin:0}
.panel:has(.chk:checked) .m-try{display:block;color:var(--bad)}
.panel:not(#f4):has(.chk:checked):not(:has(.items input[data-ok]:not(:checked))) .m-ok{display:block;color:var(--ok)}
.panel:not(#f4):has(.chk:checked):not(:has(.items input[data-ok]:not(:checked))) .m-try{display:none}
#f4:has(.chk:checked):not(:has(.need:placeholder-shown)) .m-ok{display:block;color:var(--ok)}
#f4:has(.chk:checked):not(:has(.need:placeholder-shown)) .m-try{display:none}
.slot{min-height:110px}
.slot .in{flex-direction:column;gap:6px}
.dm{display:none;flex-direction:column;align-items:center;gap:4px;font-weight:700;font-size:13px;text-align:center;line-height:1.4;border:2px solid var(--yellow);border-radius:12px;padding:4px;background:#fffaeb;width:100%}
.dm img{width:100%;height:64px;object-fit:cover;border-radius:8px}
""" + dm_rules + """
.js-only{display:none!important}
html.js .js-only{display:inline-block!important}
html.js span.js-only{display:inline!important}
"""
t = t.replace('#print{display:none}', css + '\n#print{display:none}', 1)

i, j = t.index('<!-- ================= TASK 1'), t.index('<footer')
t = t[:i] + tasks + t[j:]

t = re.sub(r'<div id="nojs">.*?</div>', '<div id="nojs">الأنشطة تعمل هنا مباشرة. ولطباعة الإجابات أو حفظها PDF افتحي الملف في Safari أو Chrome.</div>', t, count=1, flags=re.S)

s0, s1 = t.index('<script>'), t.index('</script>') + len('</script>')
t = t[:s0] + open(D + 'app.js').read() + t[s1:]
open(D + 'template.html', 'w').write(t)
print('composed', len(t))
