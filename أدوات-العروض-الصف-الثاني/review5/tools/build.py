"""Grade 2 science — Chapter 5 review «اليابسة والماء» (book pp. 132–135): answers written on the book pages,
games with stars and sounds, the water-drop narrator and the girl from the teacher's pictures."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "kit"))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "forest", "tools"))
from kit import *
import kit
kit.FONT = 'Sakkal Majalla'
kit.SCALE = 1.2

ROOT = sys.argv[1]; OUT = sys.argv[2]
BK = lambda n: f'{ROOT}/book/{n}.jpg'
ART = lambda n: f'{ROOT}/art/{n}'
S = lambda s, n: snd(s, f'{ROOT}/snd/{n}.wav')
INK, RED, BLUE, GREEN, PURPLE, PINK, GOLD = '#1E2A3A', '#E8505B', '#2E86DE', '#27AE60', '#8E44AD', '#C2366F', '#F5A623'
WATER, DWATER, BROWN = '#1E88E5', '#0D47A1', '#8D5A3B'
TEACHER = 'أ/ شامه البقمي'
D = Deck()


def chrome(s, title, station=None, strategy=None, page=None):
    tbox(s, 3.4, .18, 6.5, .82, title, 30 if len(title) <= 22 else 24, '#FFFFFF', '#C0392B', '#FFFFFF', align='c', lw=3)
    if station:
        tbox(s, 11.05, .28, 2.1, .55, station, 17, '#FFFFFF', DWATER, align='c', radius=.5)
    if strategy:
        tbox(s, .15, .22, 3.2, .74, [[('الاستراتيجية: ', PINK, 13), (strategy, '#34405E', 13)]], 13, fill='#FFF6D6', line=GOLD,
             align='c', dash=True, lw=2, margin=.06)
    tbox(s, .18, 7.0, 2.0, .38, TEACHER, 13, '#6B4FC0', '#FFFFFF', alpha=88, align='c', radius=.5, margin=.04)
    if page:
        pw = 2.0 if len(page) <= 12 else 3.0
        tbox(s, 6.67 - pw / 2, 7.0, pw, .38, page, 14, '#FFFFFF', BLUE, align='c', radius=.5, margin=.04)


def slide(title, station, strategy, page):
    s = D.slide(ART('bg.jpg'))
    chrome(s, title, station, strategy, page)
    return s


def drop_says(s, x, y, w, h, msg, size=16, tail=(-.56, .2), pose=''):
    pic(s, ART(f'drop{pose}.png'), x - 1.6, y - .15, h=1.4)
    sp = tbox(s, x, y, w, h, [[('قطرة الماء: ', WATER), (msg, INK)]], size, fill='#FFFFFF', line=WATER, shape='bubble', lw=2.5, margin=.06)
    sp.adjustments[0], sp.adjustments[1] = tail
    return sp


def card(s, x, y, w, h, paras, size=20, fill='#FFFFFF', line=BLUE, color=INK, align='r', **kw):
    return tbox(s, x, y, w, h, paras, size, color, fill, line, align=align, lw=kw.pop('lw', 2.5), **kw)


def answer(s, x, y, w, h, a, size=17, label='الإجابة: '):
    return tbox(s, x, y, w, h, [[(label, '#FFF59D'), (a, '#FFFFFF')]], size, '#FFFFFF', GREEN, '#FFFFFF', lw=2.5)


def bookpic(s, name, x, y, w=None, h=None, cap=None):
    p = pic(s, BK(name), x, y, w, h, border='#FFFFFF')
    p.line.color.rgb = rgb('#C0392B'); p.line.width = Pt(3)
    if cap:
        tbox(s, x, y - .34, p.width / 914400, .32, cap, 12, '#FFFFFF', '#F39C12', align='c', radius=.5, margin=.03)
    return p


def star(s, x, y, size=.55):
    return tbox(s, x, y, size, size * .92, '', 10, fill='#FFD54F', line=GOLD, shape='star')


def reveal(s, q, *targets, sound='chime'):
    t = list(targets)
    trigger_steps(s, q, tuple([[t[0], 'zoom', S(s, sound)]] + [[x, 'zoom'] for x in t[1:]]))


def option(s, x, y, w, h, text, ok, size=18, line='#C0392B', fill='#FFFFFF'):
    b = tbox(s, x, y, w, h, text, size, INK, fill, line, align='c', lw=3, margin=.04)
    if ok:
        m = tbox(s, x + w - .32, y - .22, .55, .55, '✔', 18, '#FFFFFF', GREEN, '#FFFFFF', shape='oval', align='c', margin=0)
        st = star(s, x - .25, y - .25, .55)
        trigger_steps(s, b, ([m, 'zoom', S(s, 'chime')], [st, 'zoom', S(s, 'sparkle')]))
    else:
        m = tbox(s, x + w - .32, y - .22, .55, .55, '✘', 18, '#FFFFFF', '#D23B3B', '#FFFFFF', shape='oval', align='c', margin=0)
        trigger_steps(s, b, ([m, 'zoom', S(s, 'wrong')],))
    return b


# =========================================================== 1. cover
s = D.slide(ART('bg.jpg'))
title = tbox(s, 1.6, .3, 10.1, 1.05, 'مراجعة الفصل الخامس: اليابسة والماء 🏔️💧', 26, '#FFFFFF', '#C0392B', '#FFFFFF', align='c', lw=4, radius=.4)
info = card(s, 7.4, 1.65, 5.6, 2.15, [[('المادة: ', RED), ('العلوم', INK)], [('الصف: ', RED), ('الثاني الابتدائي', INK)],
                                    [('المراجعة: ', RED), ('صفحات ١٣٢–١٣٥', INK)], [('اليوم: ', RED), ('........   ', INK), ('التاريخ: ', RED), ('..../..../١٤٤٨هـ', INK)]], 20, line=GOLD, lw=3)
girl = pic(s, ART('girl.png'), .4, 1.6, h=5.2)
mods = [pic(s, ART(f'm_{m}.png'), 3.4 + i * 1.95, 4.35, w=1.85) for i, m in enumerate(['mountain', 'hill', 'plain', 'valley'])]
dr = pic(s, ART('drop.png'), 11.3, 4.4, h=1.6)
bub = tbox(s, 3.3, 1.65, 3.9, 1.9, [[('قطرة الماء: ', WATER), ('مرحبًا يا بطلات! نراجع اليوم أشكال اليابسة والماء… كل إجابة صحيحة نجمة ⭐', INK)]], 16,
           fill='#FFFFFF', line=WATER, shape='bubble', lw=2.5, margin=.06)
bub.adjustments[0], bub.adjustments[1] = -.62, .5
tbox(s, 9.6, 7.0, 3.5, .38, 'إعداد وتنفيذ: ' + TEACHER, 13, '#6B4FC0', '#FFFFFF', alpha=88, align='c', radius=.5, margin=.04)
auto(s, [title, 'zoom', S(s, 'sparkle')], [girl, 'rise'], bub, info, tuple([m, 'zoom'] for m in mods), [dr, 'zoom', S(s, 'pop')])
notes(s, 'غلاف المراجعة (دقيقة). اكتبي اليوم والتاريخ. قسّمي الطالبات مجموعات، وكل إجابة صحيحة نجمة للمجموعة.')

# =========================================================== 2. vocabulary — answers written on the book page (p132)
s = slide('المفردات: الحل على كتابي', 'السؤال ١–٣', 'الحل على صفحة الكتاب – صندوق الكلمات', 'صفحة ١٣٢')
PX, PY, PW = 4.55, 1.3, 8.55
PH = PW * 480 / 1250
box(s, PX - .08, PY - .08, PW + .16, PH + .16, '#FFFFFF', '#C0392B', 3)
pic(s, BK('vocab'), PX, PY, PW, PH)
fx = lambda x: PX + (x - 50) / 1250 * PW
fy = lambda y: PY + (y - 240) / 480 * PH
ANS = [(420, 580, 500, 'الْمُحِيطَ'), (425, 815, 585, 'الْمَاءِ الْعَذْبِ'), (640, 900, 670, 'أَشْكَالِ الْيَابِسَةِ')]
COL = [WATER, '#26A69A', BROWN]
for i, (x0, x1, y, a) in enumerate(ANS):
    w = fx(x1) - fx(x0)
    t = tbox(s, fx(x0), fy(y) - .3, w, .42, a, 15, '#C62828', '#FFFDE7', '#C62828', align='c', lw=1.5, margin=.01)
    b = tbox(s, .5 + (i % 3) * 0, 1.3 + i * .95, 3.6, .75, f'حل السؤال {"١٢٣"[i]} ✍️', 19, '#FFFFFF', COL[i], '#FFFFFF', align='c', lw=3, radius=.5)
    st = star(s, 3.75, 1.15 + i * .95, .45)
    reveal(s, b, t, st)
drop_says(s, 6.55, 5.35, 6.5, 1.2, 'اقرئي الجملة، واختاري العبارة من الصندوق، ثم اضغطي الزر لنكتبها في الكتاب!', 15)
notes(s, 'المفردات (ص١٣٢): أكمل كلًّا من الجمل باستخدام العبارة المناسبة من الصندوق (أشكال اليابسة، الماء العذب، المحيط).\n'
         'اضغطي «حل السؤال» فيُكتب الحل بالأحمر في الفراغ على صفحة الكتاب مع صوت ونجمة.\n'
         'الإجابات: ١ المحيط، ٢ الماء العذب (الثلوج شكل من أشكال الماء العذب)، ٣ أشكال اليابسة.')

# =========================================================== 3. Q4 make a model (p133)
s = slide('أَعْمَلُ نَمُوذَجًا', 'السؤال ٤', 'قراءة الصور – النماذج', 'صفحة ١٣٣')
bookpic(s, 'model', 5.6, 1.5, w=7.5, cap='من كتابي – ص١٣٣')
q = card(s, .45, 1.25, 4.9, 1.0, [[('٤- أَعْمَلُ نَمُوذَجًا. ', RED), ('مَاذَا يُبَيِّنُ هَذَا النَّمُوذَجُ؟', INK)]], 20, fill='#FFF6D6', line=GOLD)
a = answer(s, .45, 2.4, 4.9, 1.55, 'يبيّن أشكالًا من اليابسة: جبالًا مرتفعة، وأرضًا مستوية (سهلًا) حولها.', 17)
st = star(s, .3, 2.1, .5)
reveal(s, q, a, st)
LB = [(7.05, 1.95, 'جبل ⛰️', BROWN), (9.7, 1.6, 'جبل ⛰️', BROWN), (5.75, 4.2, 'أرض مستوية 🌿', '#43A047')]
labs = [tbox(s, x, y, 2.3 if 'أرض' in t else 1.9, .5, t, 16, '#FFFFFF', c, '#FFFFFF', align='c', radius=.5, lw=2) for x, y, t, c in LB]
click(s, *[[l, 'zoom', S(s, 'pop')] for l in labs])
drop_says(s, 2.1, 5.3, 4.2, 1.3, 'انظري إلى النموذج… أين المرتفع؟ وأين المستوي؟', 15)
notes(s, 'السؤال ٤ (ص١٣٣) – أعمل نموذجًا: اضغطي على السؤال لتظهر الإجابة، ثم كل نقرة تضع اسمًا على النموذج.\n'
         'الإجابة من إعداد العرض اعتمادًا على صورة الكتاب؛ عدّليها إن شئتِ (يمكن أن تقول الطالبات: جبل وتل).')

# =========================================================== 4. Q5 compare mountain and hill (p133)
s = slide('أُقَارِنُ: الْجَبَلُ وَالتَّلُّ', 'السؤال ٥', 'المقارنة – شكل ڤن', 'صفحة ١٣٣')
card(s, .45, 1.2, 12.65, .75, [[('٥- أُقَارِنُ. ', BLUE), ('فِيمَ يَتَشَابَهُ الْجَبَلُ وَالتَّلُّ، وَفِيمَ يَخْتَلِفَانِ؟', INK)]], 22, fill='#FFF6D6', line=GOLD, align='c')
pic(s, ART('m_mountain.png'), 9.4, 2.05, w=3.2)
pic(s, ART('m_hill.png'), .9, 2.05, w=3.2)
tbox(s, 9.6, 4.2, 2.8, .5, 'الْجَبَلُ', 22, '#FFFFFF', BROWN, align='c', radius=.5)
tbox(s, 1.1, 4.2, 2.8, .5, 'التَّلُّ', 22, '#FFFFFF', '#7CB342', align='c', radius=.5)
v1 = tbox(s, 8.6, 4.85, 4.4, 1.9, '', 10, fill='#EFEBE9', line=BROWN, shape='oval', lw=3)
v2 = tbox(s, .45, 4.85, 4.4, 1.9, '', 10, fill='#F1F8E9', line='#7CB342', shape='oval', lw=3)
dm = tbox(s, 9.4, 5.15, 3.0, 1.3, 'مرتفع جدًّا 🏔️', 18, BROWN, align='c', shape='rect')
dh = tbox(s, 1.0, 5.15, 3.0, 1.3, 'أقل ارتفاعًا من الجبل', 18, '#33691E', align='c', shape='rect')
same_b = tbox(s, 5.0, 2.3, 3.35, .65, 'فيمَ يتشابهان؟ 🤝', 18, '#FFFFFF', PURPLE, align='c', radius=.5)
same = tbox(s, 5.0, 3.05, 3.35, 1.3, 'كلاهما منطقة مرتفعة من اليابسة', 18, '#FFFFFF', GREEN, '#FFFFFF', align='c', lw=2)
diff_b = tbox(s, 5.0, 4.6, 3.35, .65, 'فيمَ يختلفان؟ ↕️', 18, '#FFFFFF', RED, align='c', radius=.5)
reveal(s, same_b, same, star(s, 7.9, 2.15, .45))
reveal(s, diff_b, dm, dh, star(s, 7.9, 4.45, .45))
bars = [tbox(s, 5.35, 6.55 - h, .9, h, '', 10, fill=c, shape='rect') for h, c in ((1.25, BROWN), (.65, '#7CB342'))]
bars[1].left = Inches(7.1)
notes(s, 'السؤال ٥ (ص١٣٣) – أقارن: اضغطي «فيمَ يتشابهان؟» ثم «فيمَ يختلفان؟».\n'
         'التشابه: كلاهما منطقة مرتفعة من اليابسة. الاختلاف: الجبل مرتفع جدًّا، والتل أقل ارتفاعًا منه (من الدرس الأول ص١١٨–١١٩).')

# =========================================================== 5. Q6 describe landforms (p133)
s = slide('أَصِفُ أَشْكَالَ الْيَابِسَةِ', 'السؤال ٦', 'بطاقات الوصف – من أنا؟', 'صفحة ١٣٣')
card(s, .45, 1.2, 12.65, .7, [[('٦- ', RED), ('أَصِفُ الْأَشْكَالَ الْمُخْتَلِفَةَ لِلْيَابِسَةِ.', INK)]], 22, fill='#FFF6D6', line=GOLD, align='c')
LF = [('mountain', 'الْجَبَلُ', 'منطقة مرتفعة جدًّا من اليابسة', BROWN), ('hill', 'التَّلُّ', 'منطقة مرتفعة، أقل ارتفاعًا من الجبل', '#7CB342'),
      ('plain', 'السَّهْلُ', 'أرض منبسطة واسعة', '#43A047'), ('valley', 'الْوَادِي', 'أرض منخفضة بين الجبال أو التلال', TEAL if False else '#16A085')]
for i, (m, n, d, c) in enumerate(LF):
    x = 9.95 - i * 3.15
    pic(s, ART(f'm_{m}.png'), x, 2.05, w=2.95)
    nb = tbox(s, x + .2, 4.1, 2.55, .65, n, 22, '#FFFFFF', c, '#FFFFFF', align='c', radius=.5, lw=2)
    db = tbox(s, x, 4.85, 2.95, 1.05, d, 17, INK, '#FFFFFF', c, align='c', lw=2.5)
    reveal(s, nb, db, star(s, x + 2.5, 3.95, .45))
drop_says(s, 3.0, 6.0, 8.0, .85, 'اضغطي اسم الشكل لتقرئي وصفه… ثم صفيه بكلماتك!', 15)
notes(s, 'السؤال ٦ (ص١٣٣): اطلبي من الطالبة وصف كل شكل أولًا، ثم اضغطي اسمه ليظهر الوصف (من الدرس الأول) ونجمة.')

# =========================================================== 6. Q7 the big idea (p133)
s = slide('الْفِكْرَةُ الْعَامَّةُ', 'السؤال ٧', 'السبورة المنظمة – التلخيص', 'صفحة ١٣٣')
card(s, .45, 1.2, 12.65, .75, [[('٧- ', RED), ('كَيْفَ أَصِفُ الْيَابِسَةَ وَالْمَاءَ عَلَى سَطْحِ الْأَرْضِ؟', INK)]], 22, fill='#FFF6D6', line=GOLD, align='c')
bookpic(s, 'land', 7.0, 2.4, w=6.1, cap='من كتابي – ص١٣٢')
lh = tbox(s, 3.85, 2.15, 2.9, .65, '🏔️ الْيَابِسَةُ', 21, '#FFFFFF', BROWN, '#FFFFFF', align='c', radius=.5)
wh = tbox(s, .45, 2.15, 3.25, .65, '💧 الْمَاءُ', 21, '#FFFFFF', WATER, '#FFFFFF', align='c', radius=.5)
L = ['جبال وتلال مرتفعة', 'سهول منبسطة', 'وديان منخفضة']
W = ['يغطي معظم سطح الأرض', 'عذب: أنهار وبحيرات وجداول', 'مالح: بحار ومحيطات']
items = []
for i in range(3):
    items.append(tbox(s, 3.85, 2.95 + i * .85, 2.9, .72, L[i], 17, INK, '#EFEBE9', BROWN, align='c', lw=2))
    items.append(tbox(s, .45, 2.95 + i * .85, 3.25, .72, W[i], 16, INK, '#E3F2FD', WATER, align='c', lw=2))
for i in range(3):
    click(s, ([items[2 * i], 'rise', S(s, 'pop')], [items[2 * i + 1], 'rise']))
fin = answer(s, .45, 5.6, 6.3, 1.2, 'لليابسة أشكال مختلفة: جبال وتلال وسهول ووديان، والماء يغطي معظم سطح الأرض، منه العذب ومنه المالح.', 15)
click(s, [fin, 'zoom', S(s, 'fanfare')])
notes(s, 'السؤال ٧ – الفكرة العامة (ص١٣٣): السبورة المنظمة؛ كل نقرة تكتب صفًّا (يابسة / ماء)، ثم الإجابة الكاملة. استخدمي صورة الكتاب للإشارة إلى الجبل والسهل والبحيرة.')

# =========================================================== 7. performance assessment: design a notebook (p134)
s = slide('تَقْوِيمُ الْأَدَاءِ: أُصَمِّمُ دَفْتَرًا', 'تقويم الأداء', 'التعلم بالمشروع – العلوم والفن', 'صفحة ١٣٤')
bookpic(s, 'notebook', 8.3, 1.5, w=4.8, cap='من كتابي – ص١٣٤')
card(s, .45, 1.2, 7.6, .85, [[('أُصَمِّمُ دَفْتَرًا ', PURPLE), ('يَتَضَمَّنُ صُوَرًا لِأَشْكَالِ الْيَابِسَةِ وَالْمَاءِ عَلَى سَطْحِ الْأَرْضِ.', INK)]], 18, fill='#F3E5F5', line='#CE93D8')
STEPS = ['أُفَكِّرُ فِي أَشْكَالِ الْيَابِسَةِ وَالْمَاءِ الَّتِي سَأَضَعُهَا فِي دَفْتَرِي.', 'أَكْتُبُ جُمْلَةً تُعَبِّرُ عَنِ الْيَابِسَةِ وَالْمَاءِ فِي كُلِّ وَرَقَةٍ.',
         'أَرْسُمُ صُوَرًا تُوَضِّحُ أَشْكَالَ الْيَابِسَةِ أَوِ الْمَاءِ الَّتِي اخْتَرْتُهَا.', 'أَجْمَعُ الْأَوْرَاقَ لِتَصْمِيمِ الدَّفْتَرِ.']
for i, t in enumerate(STEPS):
    n = tbox(s, 7.35, 2.25 + i * .9, .62, .62, '١٢٣٤'[i], 20, '#FFFFFF', ['#42A5F5', '#26A69A', '#FFA726', PURPLE][i], '#FFFFFF', shape='oval', align='c', margin=0)
    c = card(s, .45, 2.2 + i * .9, 6.8, .75, t, 17, line=['#42A5F5', '#26A69A', '#FFA726', PURPLE][i])
    click(s, ([n, 'zoom', S(s, 'pop')], [c, 'rise']))
WORDS = [('بَحْرٌ', WATER), ('نَهْرٌ', RED), ('صُخُورٌ', '#EF6C00'), ('أَرْضٌ مُسْتَوِيَةٌ', '#43A047'), ('جَبَلٌ', BROWN)]
pages = [tbox(s, .45 + i * 1.5, 5.95, 1.4, .85, w, 16, c, '#FFFFFF', c, align='c', lw=2.5) for i, (w, c) in enumerate(WORDS)]
click(s, tuple([p, 'zoom', S(s, 'sparkle')] if j == 0 else [p, 'zoom'] for j, p in enumerate(pages)))
notes(s, 'تقويم الأداء (ص١٣٤): خطوات الكتاب تظهر خطوة مع كل نقرة، ثم أوراق مقترحة لعناوين الدفتر (من صورة الكتاب + «جبل»).\n'
         'يُنفَّذ داخل الحصة بالمجموعات أو واجبًا منزليًّا.')

# =========================================================== 8–10. test model (p135)
T = [('diagram', '١- يُشِيرُ السَّهْمُ الَّذِي فِي الصُّورَةِ إِلَى:', [('أ. أَرْضٍ مُسْتَوِيَةٍ', False), ('ب. تَلٍّ', False), ('ج. وَادٍ', True), ('د. جَبَلٍ', False)],
      'الوادي أرض منخفضة بين الجبال.'),
     ('gazelle', '٢- الْغَزَالُ يَشْرَبُ مَاءَ النَّهْرِ. أَيُّ أَشْكَالِ الْمَاءِ لَا يَسْتَطِيعُ الْغَزَالُ أَنْ يَشْرَبَ مِنْهُ؟', [('أ. الْبُحَيْرَةُ', False), ('ب. الْمُحِيطُ', True), ('ج. الْجَدْوَلُ', False), ('د. الْعَيْنُ', False)],
      'لأنّ ماء المحيط مالح لا يصلح للشرب.'),
     ('m_mountain', '٣- يَأْتِي الْمَاءُ الْجَارِي فِي الْأَنْهَارِ وَالْجَدَاوِلِ مِنْ ذَوَبَانِ الثُّلُوجِ عَلَى:', [('أ. الْآبَارِ', False), ('ب. الْجِبَالِ', True), ('ج. الْبِحَارِ', False), ('د. الْأَشْجَارِ', False)],
      'تذوب الثلوج على قمم الجبال فتجري مياهها في الأنهار والجداول.')]
for k, (img, q, opts, why) in enumerate(T):
    s = slide('نَمُوذَجُ اخْتِبَارٍ', f'سؤال {"١٢٣"[k]} من ٣', 'اختيار من متعدد – التحقق الذاتي', 'صفحة ١٣٥')
    if img == 'm_mountain':
        pic(s, ART('m_mountain.png'), .5, 1.6, w=5.3)
    elif img == 'gazelle':
        bookpic(s, 'gazelle', .5, 1.6, w=5.3, cap='صورة توضيحية من كتابي – ص١٢٦')
    else:
        bookpic(s, img, .5, 1.6, w=5.3, cap='من كتابي – ص١٣٥')
    card(s, 6.1, 1.2, 7.0, 1.15, q, 19, fill='#FFFDF0', line='#C0392B', lw=3)
    for i, (t, ok) in enumerate(opts):
        option(s, 6.5 + (i // 2) * 0, 2.6 + i * .88, 6.2, .7, t, ok, 19)
    wb = tbox(s, 6.1, 6.25, 2.2, .6, 'لماذا؟ 💡', 18, '#FFFFFF', PURPLE, '#FFFFFF', align='c', radius=.5)
    wa = tbox(s, 8.45, 6.2, 4.65, .72, why, 15, '#FFFFFF', GREEN, '#FFFFFF', margin=.04)
    reveal(s, wb, wa, sound='pop')
    pic(s, ART('girl.png'), 2.3, 5.05, h=1.9)
    notes(s, f'نموذج اختبار (ص١٣٥) – السؤال {"١٢٣"[k]} بنص الكتاب. تضغط الطالبة على اختيار: الصحيح ✔ ونجمة ورنين، والخاطئ ✘ وصوت «حاولي مرة أخرى». ثم زر «لماذا؟».\n'
             f'الإجابة الصحيحة: {[o for o, ok in opts if ok][0]}.' + ('' if img == 'diagram' else ' (الصورة بجانب السؤال توضيحية؛ السؤال في الكتاب بلا صورة)'))

# =========================================================== 11. count the stars
s = D.slide(ART('bg.jpg'))
tbox(s, 1.6, .3, 10.1, 1.0, 'أحسنتنّ يا بطلات اليابسة والماء! ⭐', 28, '#FFFFFF', '#C0392B', '#FFFFFF', align='c', lw=4)
chest = tbox(s, 4.9, 1.7, 3.5, 2.6, '🎁', 100, fill='#FFF3E0', line=GOLD, align='c', lw=4)
stars = [star(s, 2.0 + i * 1.15, 4.65 + (i % 2) * .5, .9) for i in range(9)]
mot = tbox(s, .4, 1.6, 3.9, 1.2, 'عدّي نجوم مجموعتك… من الفائزة؟ 🏆', 20, '#1B5E20', '#FFFFFF', '#66BB6A', align='c', lw=3)
g = pic(s, ART('girl.png'), 10.3, 2.4, h=4.4)
d = pic(s, ART('drop.png'), 8.9, 1.6, h=1.5)
tbox(s, 9.6, 7.0, 3.5, .38, 'إعداد وتنفيذ: ' + TEACHER, 13, '#6B4FC0', '#FFFFFF', alpha=88, align='c', radius=.5, margin=.04)
auto(s, [chest, 'spin', S(s, 'fanfare')], tuple([x, 'zoom'] for x in stars), mot, ([g, 'rise'], [d, 'zoom']))
notes(s, 'الختام: الكنز يدور وتتطاير النجوم. عدّي نجوم كل مجموعة وكرّمي الفائزة.')

D.save(OUT)
print('slides', len(D.slides))
