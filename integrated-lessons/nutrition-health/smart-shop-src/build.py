# Builds nutrition_smart_shop.html: the same three stations and questions as the original worksheet,
# but every choice, check and feedback works without scripts (so it runs inside app previews such as Telegram).
import sys
SRC = sys.argv[1]   # folder holding avatar.txt and cover.txt (data URIs taken from the original file)
OUT = sys.argv[2]
AV = open(SRC + '/avatar.txt').read().strip(); COVER = open(SRC + '/cover.txt').read().strip()

G = [('carb', 'الكربوهيدرات'), ('prot', 'البروتينات'), ('fat', 'الدهون'), ('vit', 'الفيتامينات'), ('min', 'الأملاح المعدنية'), ('wat', 'الماء')]
GN = dict(G); KEY = {v: k for k, v in G}
BEN = {  # textbook pp. 175–177
 'الكربوهيدرات': 'المصدر الرئيس للطاقة في الجسم غالبًا.',
 'البروتينات': 'تساعد الجسم على النمو وتعويض الخلايا التالفة.',
 'الدهون': 'تزوّد الجسم بالطاقة، وتمنحه الدفء، وتساعده على تخزين الفيتامينات.',
 'الفيتامينات': 'تساعد على المحافظة على صحة الجسم والوقاية من الأمراض.',
 'الأملاح المعدنية': 'تساعد على تكوين العظام وخلايا الدم الجديدة، ومنها الكالسيوم والحديد.',
 'الماء': 'يساعد الجسم على الهضم، والتخلص من الفضلات، ويحافظ على درجة حرارته ثابتة.'}
SHOP = [('🍚', 'الأرز', 'الكربوهيدرات', 'الأرز من الحبوب، وهو من مصادر الكربوهيدرات.'),
 ('🥚', 'البيض', 'البروتينات', 'البيض من مصادر البروتينات.'),
 ('🫒', 'زيت الزيتون', 'الدهون', 'زيت الزيتون من الزيوت النباتية، وهي من مصادر الدهون.'),
 ('🍊', 'البرتقال', 'الفيتامينات', 'الفواكه من مصادر الفيتامينات، والبرتقال غني بفيتامين ج.'),
 ('🥛', 'الحليب', 'الأملاح المعدنية', 'منتجات الألبان من مصادر الأملاح المعدنية مثل الكالسيوم. (والحليب فيه بروتينات وفيتامينات أيضًا!)'),
 ('💧', 'الماء', 'الماء', 'نحصل على الماء بشرب الماء النقي والسوائل، وتناول الخضروات والفواكه.')]
CARDS = [('🥔', 'البطاطس', 'الكربوهيدرات', ['الماء', 'الكربوهيدرات', 'البروتينات'], ['الدهون', 'الأملاح المعدنية', 'الكربوهيدرات']),
 ('🐟', 'السمك', 'البروتينات', ['الفيتامينات', 'البروتينات', 'الكربوهيدرات'], ['الماء', 'البروتينات', 'الكربوهيدرات']),
 ('🥦', 'الخضروات', 'الفيتامينات', ['الدهون', 'الماء', 'الفيتامينات'], ['الدهون', 'الفيتامينات', 'البروتينات'])]
MKT = [('🍞', 'الخبز', ['الكربوهيدرات']), ('🌴', 'التمر', ['الكربوهيدرات']), ('🍗', 'الدجاج', ['البروتينات']), ('🫘', 'البقوليات', ['البروتينات']),
 ('🧀', 'الجبن', ['البروتينات', 'الأملاح المعدنية']), ('🥛', 'اللبن', ['الأملاح المعدنية', 'البروتينات']), ('🌻', 'زيت نباتي', ['الدهون']),
 ('🍎', 'التفاح', ['الفيتامينات']), ('🥕', 'الجزر', ['الفيتامينات']), ('🥬', 'الخس', ['الفيتامينات', 'الأملاح المعدنية']), ('💧', 'ماء', ['الماء']),
 ('🍰', 'كعكة', ['الكربوهيدرات', 'الدهون'], 1), ('🍬', 'حلوى', ['الكربوهيدرات'], 1)]

def bar(n):
    road = ''.join(f'<span class="{"on" if i == n else ("done" if i < n else "")}">{t}</span>' for i, t in enumerate(['🛒 أتسوّق', '🧩 أصنّف', '🏆 أكتشف نتيجتي'], 1))
    return f'<div class="bar"><div class="avatar" role="img" aria-label=""></div><div class="who"><b><span class="hello">أهلًا بكِ</span></b><small>العلوم – الصف الرابع الابتدائي – الغذاء والتغذية</small></div><div class="road">{road}</div></div>'

# station 1
s1 = ''
for i, (e, n, g, why) in enumerate(SHOP):
    opts = ''.join(f'<label><input type="radio" name="s1_{i}" value="{gn}"{" data-ok" if gn == g else ""}><span>{gn}</span></label>' for _, gn in G)
    s1 += (f'<div class="prod q1"><span class="em">{e}</span><b>{n}</b><small>ما المادة الغذائية التي نركّز عليها في هذا المنتج؟</small>'
           f'<div class="opts">{opts}</div><p class="why"><b>أحسنتِ! ⭐</b><br>{why}<br><b>فائدتها:</b> {BEN[g]}</p>'
           f'<p class="try">ليست هذه المادة التي نركّز عليها في {n}. فكّري مرة أخرى 🤔</p></div>')

# station 2a
cards = ''
for i, (e, n, g, gopt, bopt) in enumerate(CARDS):
    go = ''.join(f'<label><input type="radio" name="cg_{i}" value="{v}"{" data-ok" if v == g else ""}><span>{v}</span></label>' for v in gopt)
    bo = ''.join(f'<label><input type="radio" name="cb_{i}" value="{v}"{" data-ok" if v == g else ""}><span>{BEN[v]}</span></label>' for v in bopt)
    cards += (f'<div class="card"><input type="radio" class="chk" name="ck_{i}" id="ck_{i}" aria-label="تحقّقي">'
              f'<div class="hd"><span class="em">{e}</span><b>{n}</b></div><div class="bd">'
              f'<div class="lbl">المادة الغذائية: ……</div><div class="chips g">{go}</div>'
              f'<div class="lbl">فائدتها: ……</div><div class="chips b">{bo}</div>'
              f'<div class="act"><label class="btn lav sm" for="ck_{i}">تحقّقي ✔</label>'
              f'<span class="msg m-need">اختاري المادة الغذائية وفائدتها أولًا.</span><span class="msg m-ok">إجابة صحيحة 🎉 +٢ ⭐</span>'
              f'<span class="msg m-both">راجعي الاختيارين، وحاولي مرة أخرى.</span><span class="msg m-g">المادة الغذائية تحتاج إلى مراجعة.</span>'
              f'<span class="msg m-b">الفائدة تحتاج إلى مراجعة.</span></div></div></div>')

# station 2b
mkt = ''; inb = ''
for i, p in enumerate(MKT):
    e, n, gs = p[0], p[1], p[2]; treat = len(p) > 3
    mkt += f'<label class="prod mk"><input type="checkbox" id="m{i}" name="m{i}" value="{n}" data-g="{" ".join(KEY[x] for x in gs)}"{" class=\"treat\"" if treat else ""}><span class="em sm">{e}</span><b>{n}</b></label>'
    inb += f'<span class="bi" id="bi{i}" title="{n}">{e}</span>'
glist = ''.join(f'<div class="g" data-g="{k}"><i></i>{v}</div>' for k, v in G)
miss = '، '.join(f'<span class="miss" data-g="{k}">{v}</span>' for k, v in G)
all6 = ''.join(f':has(.mk input[data-g~="{k}"]:checked)' for k, _ in G)

css_dyn = []
for i in range(len(MKT)):
    css_dyn.append(f'#s2:has(#m{i}:checked) #bi{i}{{display:inline-block}}')
for k, _ in G:
    cov = f'#s2:has(#bchk:checked):has(.mk input[data-g~="{k}"]:checked)'
    css_dyn.append(f'{cov} .g[data-g="{k}"]{{background:var(--ok-l);color:#1d6b3d;counter-increment:pts}}')
    css_dyn.append(f'{cov} .g[data-g="{k}"] i{{background:var(--ok)}}')
    css_dyn.append(f'{cov} .g[data-g="{k}"] i::after{{content:"✓"}}')
    css_dyn.append(f'#s2:has(#bchk:checked):not(:has(.mk input[data-g~="{k}"]:checked)) .miss[data-g="{k}"]{{display:inline}}')
css_dyn.append(f'#s2:has(#bchk:checked){all6} .b-ok{{display:block}}')
css_dyn.append(f'#s2:has(#bchk:checked){all6} .b-miss{{display:none}}')
css_dyn.append(f'.wrap:has(#bchk:checked){all6}:not(:has(#cards input[data-ok]:not(:checked))) .to3{{opacity:1;pointer-events:auto}}')
css_dyn.append(f'.wrap:has(#bchk:checked){all6} .st3{{color:#f5b301}}')
css_dyn.append(f'.wrap:has(#bchk:checked){all6} .r3 .y{{display:inline}}')
css_dyn.append(f'.wrap:has(#bchk:checked){all6} .r3 .n{{display:none}}')
css_dyn.append(f'.wrap:has(#bchk:checked){all6}:not(:has(#s1 input[data-ok]:not(:checked))):not(:has(#cards input[data-ok]:not(:checked))) .c-3{{display:block}}')
css_dyn.append(f'.wrap:has(#bchk:checked){all6}:not(:has(#s1 input[data-ok]:not(:checked))):not(:has(#cards input[data-ok]:not(:checked))) .c-x{{display:none}}')

html = open(SRC + '/template.html').read()
html = (html.replace('{{AV}}', AV).replace('{{COVER}}', COVER).replace('{{S1}}', s1).replace('{{CARDS}}', cards)
        .replace('{{MKT}}', mkt).replace('{{INB}}', inb).replace('{{GL}}', glist).replace('{{MISS}}', miss)
        .replace('{{CSSDYN}}', '\n'.join(css_dyn)).replace('{{BAR1}}', bar(1)).replace('{{BAR2}}', bar(2)).replace('{{BAR3}}', bar(3)))
assert '{{' not in html
open(OUT, 'w').write(html)
print(len(html) // 1024, 'KB')
