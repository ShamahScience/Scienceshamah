"""Grade 2 science: Landforms (pp. 118-121) as a TV studio led by a little hijabi presenter."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "kit"))
from kit import *
import kit
kit.FONT = 'Sakkal Majalla'  # the teacher's font rule: bold Naskh in every deck
kit.SCALE = 1.2

ROOT = sys.argv[1]; OUT = sys.argv[2]
A = lambda n: f'{ROOT}/art/{n}.' + ('jpg' if n.startswith('bg_') else 'png')
B = lambda n: f'{ROOT}/book/{n}.jpg' if os.path.exists(f'{ROOT}/book/{n}.jpg') else f'{ROOT}/book/{n}.png'

INK, RED, BLUE, GREEN, DGREEN, PURPLE, PINK, GOLD = '#1E2A3A', '#E8505B', '#2E86DE', '#27AE60', '#1E8449', '#8E44AD', '#C2366F', '#F5A623'
TEACHER = 'أ/ شامه البقمي'

D = Deck()


def chrome(s, title, station=None, strategy=None, page=None, title_fill='#2E7D32'):
    tbox(s, 3.4, .18, 6.5, .82, title, 32 if len(title) <= 20 else 25, '#FFFFFF', title_fill, '#FFFFFF', align='c', lw=3)
    if station:
        tbox(s, 11.25, .28, 1.85, .55, station, 18, '#FFFFFF', RED, align='c', radius=.5)
    if strategy:
        tbox(s, .15, .22, 3.2, .74, [[('الاستراتيجية: ', PINK, 13), (strategy, '#34405E', 13)]], 13, fill='#FFF6D6', line=GOLD,
             align='c', dash=True, lw=2, margin=.06)
    tbox(s, .18, 7.0, 2.0, .38, TEACHER, 13, '#6B4FC0', '#FFFFFF', alpha=88, align='c', radius=.5, margin=.04)
    if page:
        pw = 2.0 if len(page) <= 12 else 3.4
        tbox(s, 6.67 - pw / 2, 7.0, pw, .38, page, 14, '#FFFFFF', BLUE, align='c', radius=.5, margin=.04)


def noura(s, pose, x, y, h=2.6):
    return pic(s, A(f'noura_{pose}'), x, y, h=h)


def bubble(s, x, y, w, h, msg, size=20, tail=(-.05, .9)):
    sp = tbox(s, x, y, w, h, [[('نورة: ', RED), (msg, INK)]], size, fill='#FFFFFF', line=RED, shape='bubble', lw=2.5)
    sp.adjustments[0], sp.adjustments[1] = tail
    return sp


def card(s, x, y, w, h, paras, size=22, fill='#FFFFFF', line=BLUE, color=INK, alpha=94, align='r', **kw):
    return tbox(s, x, y, w, h, paras, size, color, fill, line, align=align, alpha=alpha, **kw)


def answer(s, x, y, w, h, paras, size=22):
    return tbox(s, x, y, w, h, paras, size, '#FFFFFF', GREEN, '#FFFFFF', lw=2.5)


def bookpic(s, name, x, y, w=None, h=None, cap=None, capsize=12):
    p = pic(s, B(name), x, y, w, h, border='#FFFFFF')
    if cap:
        tbox(s, x, y - .34, p.width / 914400, .32, cap, capsize, '#FFFFFF', '#F39C12', align='c', radius=.5, margin=.03)
    return p




def explain(s, img, x, y, w, h, notes, cap=None):
    """A book picture with callouts; each click shows one callout: a label, an arrow and a dot on the picture."""
    bookpic(s, img, x, y, w, h, cap=cap)
    for fx, fy, t, lx, ly, lw, c in notes:
        tx, ty = x + fx * w, y + fy * h
        lab = tbox(s, lx, ly, lw, .66, t, 15, '#FFFFFF', c, '#FFFFFF', align='c', lw=2, margin=.04)
        ax = lx + lw if lx + lw < tx else lx
        ar = arrow(s, ax, ly + .31, tx, ty, c)
        dot = tbox(s, tx - .12, ty - .12, .24, .24, '', 8, fill='#FFFFFF', line=c, shape='oval', lw=3)
        click(s, (lab, ar, [dot, 'zoom']))


S = lambda s, n: snd(s, f'{ROOT}/snd/{n}.wav')
TEAL, ORANGE, POLAR = '#16A085', '#E67E22', '#5DADE2'


def star(s, x, y, size=.6):
    return tbox(s, x, y, size, size * .92, '', 10, fill='#FFD54F', line='#F5A623', shape='star')


def option(s, x, y, w, h, text, ok, size=20, color=INK, line=GOLD, fill='#FFFFFF', alpha=96):
    """A clickable answer: right → green tick, star, chime; wrong → red cross and buzz (try again)."""
    b = tbox(s, x, y, w, h, text, size, color, fill, line, align='c', lw=3, alpha=alpha, margin=.04)
    if ok:
        m = tbox(s, x + w - .32, y - .22, .55, .55, '✔', 18, '#FFFFFF', GREEN, '#FFFFFF', shape='oval', align='c', margin=0)
        st = star(s, x - .25, y - .25, .55)
        trigger_steps(s, b, ([m, 'zoom', S(s, 'chime')], [st, 'zoom', S(s, 'sparkle')]))
    else:
        m = tbox(s, x + w - .32, y - .22, .55, .55, '✘', 18, '#FFFFFF', '#D23B3B', '#FFFFFF', shape='oval', align='c', margin=0)
        trigger_steps(s, b, ([m, 'zoom', S(s, 'wrong')],))
    return b


def reveal(s, q, *targets, sound='chime'):
    """Click `q` to show targets; the first one plays a sound and the last gets a sparkle."""
    t = list(targets)
    steps = [[t[0], 'zoom', S(s, sound)]] + [[x, 'zoom'] for x in t[1:]]
    trigger_steps(s, q, tuple(steps))


VIO, DVIO, BROWN, TEAL = '#7E57C2', '#4527A0', '#8D5A3B', '#16A085'
CX = 2.75  # content starts right of the presenter column


HOST_AR = 568 / 644


def host(s, pose, say=None, h=3.1, size=15, bh=1.5, by=None):
    """The little presenter stands at the left edge; her line sits in a bubble above her."""
    h = min(h, 2.6 / HOST_AR)  # the presenter from the teacher's studio picture
    p = pic(s, A('host_real'), .1, 6.95 - h, h=h)
    if say:
        y = by if by is not None else 6.95 - h - bh - .1
        sp = tbox(s, .12, y, 2.5, bh, [[('المذيعة: ', PINK, size)], [(say, INK, size)]], size, fill='#FFFFFF', line=PINK,
                  shape='bubble', lw=2.5, margin=.06)
        sp.adjustments[0], sp.adjustments[1] = -.15, .75
        return p, sp
    return p, None


def frame(s, title, seg, strategy, page, fill=DVIO):
    chrome(s, title, seg, strategy, page, title_fill=fill)


def hl(text, words, base=INK, mark='#C2185B'):
    """Book sentence with key words highlighted: returns runs for tbox."""
    runs, rest = [], text
    while rest:
        hits = [(rest.find(w), w) for w in words if rest.find(w) >= 0]
        if not hits:
            runs.append((rest, base)); break
        i, w = min(hits)
        if i: runs.append((rest[:i], base))
        runs.append((w, mark)); rest = rest[i + len(w):]
    return [runs]


D_slide = lambda: D.slide(A('bg_studio'))

# =========================================================== 0. intro: on air, leads to the lesson title
s = D_slide()
scr = box(s, CX + .3, .35, 10.0, 4.3, '#1A1037', '#FFFFFF', 6, radius=.3)
onair = tbox(s, CX + 7.6, .55, 2.5, .55, '🔴 على الهواء', 16, '#FFFFFF', RED, '#FFFFFF', align='c', radius=.5, lw=2)
cd = [tbox(s, CX + 3.8, 1.0, 3.0, 3.0, n, 110, '#FFD54F', None, None, align='c') for n in ('٣', '٢', '١')]
rid = tbox(s, CX + .7, .9, 9.2, 1.5, [[('لغز الحلقة 🎬', '#FFD54F', 22)],
      [('مرّةً أكونُ ', '#FFFFFF'), ('مُرْتَفِعًا', '#FF8A80'), (' عاليًا، ومرّةً ', '#FFFFFF'), ('مُنْبَسِطًا', '#B9F6CA'),
       (' مستويًا، ومرّةً ', '#FFFFFF'), ('مُنْخَفِضًا', '#80D8FF'), ('… فمن أكون؟', '#FFFFFF')]], 24, align='c')
ph = []
for i, (n, _) in enumerate([('e_snow', 0), ('hills', 0), ('plain', 0), ('e_canyon', 0)]):
    ph.append(pic(s, B(n), CX + 7.55 - i * 2.35, 2.55, w=2.2, h=1.85, border='#FFFFFF'))
ans = tbox(s, CX + 2.4, 4.85, 5.8, 1.15, [[('إنّها ', '#FFFFFF', 26), ('التَّضَارِيسُ', '#FFF59D', 40), (' ✨', '#FFFFFF', 26)]], 30,
           fill='#EC407A', line='#FFFFFF', align='c', lw=4, radius=.5)
q = tbox(s, CX + 1.2, 6.15, 8.2, .6, 'هيا نكتشف في حلقة اليوم! 🌍', 20, DVIO, '#FFFFFF', VIO, align='c', radius=.5, lw=2)
host(s, 'mic', 'استعدي يا نجمة… الحلقة تبدأ بعد العدّ! 🎤')
auto(s, [onair, 'zoom', S(s, 'pop')], [cd[0], 'zoom', S(s, 'pop')], [cd[0], 'out'], [cd[1], 'zoom', S(s, 'pop')], [cd[1], 'out'],
     [cd[2], 'zoom', S(s, 'pop')], [cd[2], 'out'], [rid, 'fade', S(s, 'whoosh')])
click(s, tuple([x, 'zoom'] for x in ph[:2]), tuple([x, 'zoom'] for x in ph[2:]))
click(s, [ans, 'zoom', S(s, 'fanfare')], [q, 'rise'])
notes(s, 'تمهيد قبل الدرس: عدّ تنازلي «على الهواء» ثم لغز الحلقة يظهر تلقائيًا.\n'
         'النقرة ١ و٢: تظهر صور من الكتاب (جبل، تلال، سهل، وادٍ) – اسألي: هل هذه الأماكن متشابهة؟\n'
         'النقرة ٣: تظهر الإجابة «التضاريس» ثم سؤال الحلقة، وبعدها ننتقل إلى شريحة عنوان الدرس.')

# =========================================================== 1. organized board (teacher's studio picture)
s = D.slide(A('cover'))
K = 13.333 / 1672  # picture px -> inches
day = tbox(s, 745 * K, 160 * K, 105 * K, 48 * K, '……', 16, INK, align='c', shape='rect', margin=.02)
date = tbox(s, 1015 * K, 160 * K, 150 * K, 48 * K, '…/…/١٤٤٨', 12, INK, align='c', shape='rect', margin=.02)
wel = tbox(s, 600 * K, 760 * K, 540 * K, 95 * K, 'أهلًا يا نجمات الاستوديو! 🌍', 20, '#FFFFFF', '#EC407A', '#FFFFFF', align='c', lw=2.5, radius=.5)
auto(s, [wel, 'zoom', S(s, 'sparkle')])
notes(s, 'السبورة المنظمة: العنوان والتاريخ والترحيب وقوانين الصف. الاستراتيجية: التهيئة – إدارة الصف.\n'
         'الترحيب يظهر تلقائيًا. اكتبي اليوم والتاريخ في المربعين أعلى الشاشة قبل الحصة، واقرئي القوانين مع الطالبات.')

# =========================================================== 1-b. what are landforms? (picture + explanation)
s = D_slide()
frame(s, 'ما التَّضَارِيسُ؟', 'الدرس', 'التعلم البصري', 'صفحة ١١٩')
dfn = card(s, CX + .3, 1.12, 10.0, 1.05, hl('التَّضَارِيسُ هِيَ أَشْكَالُ الْيَابِسَةِ الَّتِي نَعِيشُ عَلَيْهَا، وَهِيَ أَشْكَالٌ مُخْتَلِفَةٌ: مُرْتَفِعَةٌ، وَمُنْبَسِطَةٌ، وَمُنْخَفِضَةٌ.',
           ['أَشْكَالُ الْيَابِسَةِ', 'مُرْتَفِعَةٌ', 'مُنْبَسِطَةٌ', 'مُنْخَفِضَةٌ']), 22, fill='#FFFDF0', line=VIO, lw=3, alpha=100, align='c')
SW = 7.3; SK = SW / 722; SX, SY = CX + 3.0, 2.35
scene = pic(s, A('scene'), SX, SY, w=SW, border='#FFFFFF')
bk = pic(s, B('p119t'), CX + .3, SY, w=2.55, border='#F5A623')
tbox(s, CX + .3, SY + 1.02, 2.55, .36, 'من كتابي – ص١١٩', 12, '#FFFFFF', '#F5A623', align='c', radius=.5)
TAGS = [('جبل', 560, 30, BROWN), ('تل', 110, 55, '#7CB342'), ('وادٍ', 330, 100, TEAL), ('سهل', 190, 150, '#558B2F')]
MODS = [('m_mountain', 'الجبل', 'مرتفع جدًّا', BROWN), ('m_hill', 'التل', 'مرتفع قليلًا', '#7CB342'),
        ('m_valley', 'الوادي', 'منخفض', TEAL), ('m_plain', 'السهل', 'منبسط', '#558B2F')]
steps = []
for i, ((w, px, py, col), (m, nm, d, _)) in enumerate(zip(TAGS, MODS)):
    tg = tbox(s, SX + px * SK - .55, SY + py * SK - .2, 1.1, .45, w, 15, '#FFFFFF', col, '#FFFFFF', align='c', radius=.5, lw=2)
    x = CX + 7.85 - i * 2.5
    tl = box(s, x, 4.35, 2.35, 2.05, '#FFFFFF', col, 3, alpha=96)
    mp = pic(s, A(m), x + .3, 4.4, w=1.75)
    nt = tbox(s, x + .1, 5.6, 2.15, .7, [[(nm + ': ', col, 18), (d, INK, 16)]], 16, align='c', shape='rect')
    steps.append(([tg, 'zoom', S(s, 'pop')], [tl, 'rise'], [mp, 'rise'], [nt, 'rise']))
host(s, 'mic', 'التضاريس أشكال اليابسة… ابحثي عنها في الصورة! 🏔️')
auto(s, [dfn, 'fade'], [scene, 'zoom', S(s, 'whoosh')], [bk, 'fade'])
for st in steps:
    click(s, st)
notes(s, 'شرح معنى التضاريس: أشكال اليابسة التي نعيش عليها مختلفة (ص١١٩: سهول منبسطة، وديان منخفضة، جبال وتلال مرتفعة).\n'
         'كل نقرة تُظهر اسم شكل على صورة الاستوديو ومجسّمه ووصفه: جبل، تل، وادٍ، سهل. اسألي: أين المرتفع؟ أين المنبسط؟ أين المنخفض؟')

# =========================================================== 2. review game: land and water
s = D_slide()
frame(s, 'لعبة: أشكال اليابسة والماء', 'مراجعة', 'التعلم باللعب – المراجعة', 'صفحتا ١١٥ و١٢٠')
RV = [('v_ocean', 'تَجَمُّعٌ كَبِيرٌ وَعَمِيقٌ مِنَ الْمَاءِ الْمَالِحِ، مَا اسْمُهُ؟', [('محيط', True), ('سهل', False), ('ماء عذب', False)]),
      ('v_fresh', 'مَاءٌ غَيْرُ مَالِحٍ نَشْرَبُهُ، يُوجَدُ فِي الْأَنْهَارِ:', [('ماء مالح', False), ('ماء عذب', True), ('محيط', False)]),
      ('globe', 'الْأَجْزَاءُ الْكَبِيرَةُ مِنَ الْيَابِسَةِ تُسَمَّى:', [('جزرًا', False), ('محيطات', False), ('قارات', True)])]
for i, (img, q, opts) in enumerate(RV):
    x = 10.05 - i * 3.45
    pic(s, B(img), x, 1.2, w=3.2, h=2.0, border='#FFFFFF')
    card(s, x, 3.3, 3.2, 1.05, q, 15, fill='#FFFDF0', line=GOLD, lw=2, align='c', alpha=100, margin=.05)
    for j, (t, ok) in enumerate(opts):
        option(s, x + .2, 4.5 + j * .78, 2.8, .64, t, ok, 17, line=VIO)
host(s, 'point', 'اختاري الإجابة… الصحيحة تعطيكِ نجمة ⭐')
notes(s, 'مراجعة «أشكال اليابسة والماء» (مفردات ص١١٥ والكرة الجغرافية ص١٢٠). الاستراتيجية: التعلم باللعب.\n'
         'تضغط الطالبة على اختيار: الصحيح ✔ ونجمة ورنين، والخطأ ✘ وصوت «حاولي مرة أخرى».')

# =========================================================== 3. visual hook: studio screen
s = D_slide()
frame(s, 'هل الأرض كلها متشابهة؟', 'تمهيد', 'التنبؤ – التعلم البصري', 'صفحة ١١٦')
scr = box(s, CX + .3, 1.15, 9.8, 4.45, '#1B1340', '#C9B6FF', 6)
HK = [('e_snow', 'مرتفع جدًّا'), ('hills', 'مرتفع قليلًا'), ('plain', 'منبسط'), ('e_canyon', 'منخفض')]
cells = []
for i, (img, lab) in enumerate(HK):
    x, y = CX + 5.3 - (i % 2) * 4.75 + .1, 1.35 + (i // 2) * 2.1
    p = pic(s, B(img), x, y, w=4.55, h=1.95)
    cover = tbox(s, x, y, 4.55, 1.95, f'🎬 {"١٢٣٤"[i]}', 40, '#FFFFFF', '#5E35B1', '#B39DDB', lw=2, align='c', radius=.05)
    tg = tbox(s, x + 1.3, y + 1.45, 1.95, .45, lab, 16, '#FFFFFF', [BROWN, '#5DAA55', '#7CB342', TEAL][i], align='c', radius=.5, margin=.02)
    trigger_steps(s, cover, ([cover, 'out', S(s, 'whoosh')],), ([tg, 'zoom'],))
q = tbox(s, CX + .3, 5.75, 6.4, .75, '🤔 هل سطح الأرض كله متشابه؟', 22, '#FFFFFF', '#EC407A', '#FFFFFF', align='c', radius=.5)
a = tbox(s, CX + 6.85, 5.75, 3.25, .75, 'لا! له أشكال مختلفة ✨', 18, '#FFFFFF', GREEN, '#FFFFFF', align='c', radius=.5)
reveal(s, q, a)
host(s, 'point', 'اضغطي على كل شاشة لتكشفي ما خلفها!')
notes(s, 'تمهيد بصري: أربع شاشات مغطاة؛ تضغط الطالبة على الشاشة فتنكشف صورة (جبل، تلال، سهل، وادٍ) وتظهر كلمة تصفها.\n'
         'اسألي بعد الكشف: هل سطح الأرض كله متشابه؟ ثم اضغطي على السؤال لتظهر الإجابة. الصور من الكتاب ص١١٧–١١٩.')

# =========================================================== 4. learning outcomes
s = D_slide()
frame(s, 'ماذا سأتعلّم في حلقة اليوم؟', 'أهدافي', 'أهدافي اليوم', 'صفحات ١١٨ – ١٢١')
LO = [('m_mountain', 'أُسمّي أشكال اليابسة: الجبل، والتل، والسهل، والوادي.'),
      ('m_hill', 'أصف كل شكل منها: مرتفع، أو منبسط، أو منخفض.'),
      ('m_valley', 'أقارن بين الجبل والتل، وبين السهل والوادي.'),
      ('m_plain', 'أفرّق بين القارة والجزيرة، وبين اليابسة والماء.')]
ll = []
for i, (img, t) in enumerate(LO):
    y = 1.2 + i * 1.35
    c = card(s, CX + .3, y, 8.0, 1.15, [[(f'{"١٢٣٤"[i]}.  ', VIO, 24), (t, INK, 21)]], 21, line='#B39DDB', lw=3, alpha=100)
    m = pic(s, A(img), CX + 8.45, y - .05, w=1.75, h=1.17)
    ll.append((c, [m, 'zoom']))
for p in ll: click(s, p)
host(s, 'mic', 'هذه أهداف حلقتنا… هيا نحققها معًا! 🎯')
notes(s, 'نواتج التعلم (مبسطة للصف الثاني). كل نقرة تُظهر هدفًا مع مجسمه. اقرئيها مع الطالبات.')

# =========================================================== 5-8. the four landforms
FORMS = [
    ('الجبل ⛰️', 'm_mountain', 'mount_valley', 'الْجَبَلُ مَنْطِقَةٌ مُرْتَفِعَةٌ مِنَ الْيَابِسَةِ. قَدْ يَكُونُ لِلْجِبَالِ قِمَمٌ حَادَّةٌ، وَجَوَانِبُ شَدِيدَةُ الِانْحِدَارِ.',
     ['مُرْتَفِعَةٌ', 'قِمَمٌ حَادَّةٌ', 'شَدِيدَةُ الِانْحِدَارِ'], 'صفحة ١١٨', BROWN,
     ('who', 'أنا منطقة مرتفعة من اليابسة، ولي قمة حادة. من أنا؟', [('الجبل', True), ('السهل', False), ('الوادي', False)]),
     'انظرن إلى القمة الحادة في المجسم! 🏔️'),
    ('التل', 'm_hill', 'hills', 'التِّلَالُ مَنَاطِقُ مُرْتَفِعَةٌ، وَلَكِنَّهَا أَقَلُّ ارْتِفَاعًا مِنَ الْجِبَالِ.',
     ['مُرْتَفِعَةٌ', 'أَقَلُّ ارْتِفَاعًا'], 'صفحة ١١٩', '#5DAA55',
     ('err', 'التلال أعلى من الجبال.', 'التلال مرتفعة، لكنها أقل ارتفاعًا من الجبال.'),
     'التل مرتفع… لكنه أقصر من الجبل 🙂'),
    ('السهل', 'm_plain', 'plain', 'السَّهْلُ مَنْطِقَةٌ مُنْبَسِطَةٌ وَوَاسِعَةٌ. تَمْتَدُّ بَعْضُ السُّهُولِ عِدَّةَ كِيلُومِتْرَاتٍ.',
     ['مُنْبَسِطَةٌ', 'وَاسِعَةٌ', 'عِدَّةَ كِيلُومِتْرَاتٍ'], 'صفحة ١١٩', '#7CB342',
     ('who', 'أنا منطقة منبسطة وواسعة، ترعى فيّ الغزلان. من أنا؟', [('التل', False), ('السهل', True), ('الجبل', False)]),
     'السهل مستوٍ مثل الطاولة… وواسع جدًّا!'),
    ('الوادي', 'm_valley', 'mount_valley', 'الْوَادِي أَرْضٌ مُنْخَفِضَةٌ بَيْنَ الْجِبَالِ وَالتِّلَالِ.',
     ['أَرْضٌ مُنْخَفِضَةٌ', 'بَيْنَ الْجِبَالِ وَالتِّلَالِ'], 'صفحة ١١٨', TEAL,
     ('err', 'الوادي منطقة مرتفعة فوق الجبال.', 'الوادي أرض منخفضة بين الجبال والتلال.'),
     'الوادي في الأسفل… بين الجبلين 👇'),
]
for k, (name, model, photo, text, words, page, col, check, line) in enumerate(FORMS):
    s = D_slide()
    frame(s, name, 'الفقرة ' + '١٢٣٤'[k], 'المجسمات – التعلم البصري', page, fill=col)
    mdl = pic(s, A(model), CX + 5.35, 1.1, w=4.95, h=3.3)
    tbox(s, CX + 6.55, 1.05, 2.6, .45, '🧊 مجسم الاستوديو', 14, '#FFFFFF', VIO, align='c', radius=.5, margin=.02)
    ph = bookpic(s, photo, CX + .3, 1.45, w=4.85, h=2.95, cap='صورة من كتابي – ' + page)
    tx = card(s, CX + .3, 4.55, 10.0, 1.0, hl(text, words, mark=col if col != '#7CB342' else '#558B2F'), 20, fill='#FFFDF0', line=col, lw=3, alpha=100)
    click(s, ([mdl, 'zoom', S(s, 'pop')],), tx)
    if check[0] == 'who':
        tbox(s, CX + 6.2, 5.7, 4.1, 1.1, [[('من أنا؟ 🎭 ', PINK, 16)], [(check[1], INK, 15)]], 15, fill='#FFFFFF', line=PINK, lw=2, margin=.05)
        for j, (t, ok) in enumerate(check[2]):
            option(s, CX + 4.1 - j * 1.95, 5.95, 1.8, .7, t, ok, 18, line=PINK)
    else:
        w = card(s, CX + 5.0, 5.75, 5.3, .95, [[('✘ اكتشفي الخطأ: ', '#D23B3B', 16)], [(check[1], INK, 17)]], 16, line='#D23B3B', lw=3, alpha=100, margin=.05)
        cc = tbox(s, CX + .3, 5.75, 4.55, .95, [[('التصحيح: ', '#FFF59D', 13), (check[2], '#FFFFFF', 13)]], 15, fill=GREEN, line='#FFFFFF', margin=.05)
        st = star(s, CX + 4.45, 5.55, .5)
        trigger_steps(s, w, ([cc, 'zoom', S(s, 'chime')], [st, 'zoom', S(s, 'sparkle')]))
    host(s, 'point' if k % 2 == 0 else 'mic', line)
    notes(s, f'{name} ({page}) – نص الكتاب مع تظليل الكلمات المهمة. الاستراتيجية: المجسمات والتعلم البصري.\n'
             'النقرة الأولى تُظهر المجسم (صوت)، والثانية نص الكتاب. قارني بين المجسم وصورة الكتاب.\n'
             + ('تقويم تكويني «من أنا؟»: تقرأ الطالبة اللغز وتضغط الإجابة (صحيح ✔ ونجمة، خطأ ✘).' if check[0] == 'who'
                else 'تقويم تكويني «اكتشفي الخطأ»: اسألي صح أم خطأ؟ ثم اضغطي على العبارة ليظهر التصحيح ونجمة.')
             + ('\nسؤال الكتاب ✔ (ص١١٩): فيم يختلف الجبل عن الوادي؟ الجبل منطقة مرتفعة، والوادي أرض منخفضة بين الجبال والتلال.' if k == 3 else ''))

# =========================================================== 9. visual comparison
s = D_slide()
frame(s, 'تحدي المقارنة', 'مقارنة', 'المقارنة البصرية', 'صفحتا ١١٨ – ١١٩')
for side, (a, b, qa, ans_a, ans_b, col) in enumerate([
        ('m_mountain', 'm_hill', 'الجبل والتل: أيهما أعلى؟', 'الجبل أعلى ⬆️', 'التل أقل ارتفاعًا', BROWN),
        ('m_plain', 'm_valley', 'السهل والوادي: ما الفرق؟', 'السهل منبسط وواسع', 'الوادي منخفض بين الجبال', TEAL)]):
    x0 = CX + 5.25 - side * 5.15
    box(s, x0, 1.15, 4.95, 5.6, '#FFFFFF', col, 4, alpha=95)
    tbox(s, x0 + .2, 1.3, 4.55, .65, qa, 18, '#FFFFFF', col, align='c', radius=.5)
    ma = pic(s, A(a), x0 + 2.55, 2.1, w=2.3, h=1.53)
    mb = pic(s, A(b), x0 + .1, 2.1, w=2.3, h=1.53)
    la = tbox(s, x0 + 2.65, 3.75, 2.1, .6, ['الجبل', 'السهل'][side], 17, col, '#FFFFFF', col, align='c', radius=.5, lw=2)
    lb = tbox(s, x0 + .2, 3.75, 2.1, .6, ['التل', 'الوادي'][side], 17, col, '#FFFFFF', col, align='c', radius=.5, lw=2)
    if side == 0:
        hb_ = box(s, x0 + 3.4, 4.5, .6, 1.6, BROWN, None); tbox(s, x0 + 2.65, 6.15, 2.1, .4, 'ارتفاع كبير', 13, BROWN, align='c', margin=0)
        hs_ = box(s, x0 + .95, 5.3, .6, .8, '#5DAA55', None); tbox(s, x0 + .2, 6.15, 2.1, .4, 'ارتفاع أقل', 13, '#5DAA55', align='c', margin=0)
        bars = ([hb_, 'rise'], [hs_, 'rise'])
    else:
        hb_ = tbox(s, x0 + 2.65, 4.55, 2.1, 1.5, '➖\nمستوٍ', 20, '#558B2F', '#F1F8E9', '#7CB342', align='c', lw=2)
        hs_ = tbox(s, x0 + .2, 4.55, 2.1, 1.5, '⬇️\nمنخفض', 20, TEAL, '#E0F2F1', TEAL, align='c', lw=2)
        bars = ([hb_, 'zoom'], [hs_, 'zoom'])
    ans = tbox(s, x0 + .2, 6.2 if side else 6.6, 4.55, .5, f'{ans_a} · {ans_b}', 14, '#FFFFFF', GREEN, align='c', radius=.5, margin=.02)
    q = s.shapes[-1]
    trigger_steps(s, la if side == 0 else la, (bars[0], bars[1], [ans, 'zoom', S(s, 'chime')]))
host(s, 'think', 'اضغطي على اسم الشكل لنقارن! 📏')
notes(s, 'نشاط مقارنة بصري: الجبل والتل (أعمدة الارتفاع)، والسهل والوادي (مستوٍ / منخفض).\nاضغطي على كلمة «الجبل» أو «السهل» لتظهر المقارنة والخلاصة مع صوت.')

# =========================================================== 10. reading comprehension (p119)
s = D_slide()
frame(s, 'أقرأ وأفهم', 'قراءة', 'الفهم القرائي', 'صفحة ١١٩')
bookpic(s, 'p119t', CX + 6.3, 1.45, w=4.0, cap='من كتابي – ص١١٩')
txt = ('لِلْيَابِسَةِ الَّتِي نَعِيشُ عَلَيْهَا أَشْكَالٌ مُخْتَلِفَةٌ؛ فَقَدْ تَكُونُ سُهُولًا مُنْبَسِطَةً، أَوْ وِدْيَانًا مُنْخَفِضَةً، أَوْ جِبَالًا وَتِلَالًا مُرْتَفِعَةً.')
card(s, CX + .3, 1.2, 5.85, 2.05, hl(txt, ['سُهُولًا مُنْبَسِطَةً', 'وِدْيَانًا مُنْخَفِضَةً', 'جِبَالًا وَتِلَالًا مُرْتَفِعَةً'], mark='#6A1B9A'), 20, fill='#FFFDF0', line=VIO, lw=3, alpha=100)
RQ = [('السهول …', [('منبسطة', True), ('منخفضة', False)]), ('الوديان …', [('مرتفعة', False), ('منخفضة', True)]), ('الجبال والتلال …', [('مرتفعة', True), ('منبسطة', False)])]
for i, (q, opts) in enumerate(RQ):
    y = 3.55 + i * 1.05
    tbox(s, CX + 6.3, y, 4.0, .85, f'{"١٢٣"[i]}. {q}', 20, INK, '#EDE7F6', VIO, align='c', lw=2)
    for j, (t, ok) in enumerate(opts):
        option(s, CX + 3.3 - j * 3.0, y + .05, 2.8, .75, t, ok, 19, line=VIO)
host(s, 'mic', 'اقرئي الجملة… والكلمات الملونة هي المفتاح! 🔑')
notes(s, 'فهم قرائي قصير من نص الكتاب ص١١٩ مع تظليل الكلمات المهمة. تقرأ الطالبة النص ثم تكمل الجمل بالضغط على الكلمة الصحيحة.')

# =========================================================== 10-b. what maps tell us (p120)
s = D_slide()
frame(s, 'ماذا تخبرنا الخرائط؟', 'الفقرة ٥', 'التعلم البصري – الخرائط', 'صفحة ١٢٠')
gl = bookpic(s, 'globe', CX + .3, 1.5, w=3.6, cap='صورة من كتابي – صفحة ١٢٠')
m1 = card(s, CX + 4.15, 1.12, 6.15, 1.0, hl('مُجَسَّمُ الْكُرَةِ الْجُغْرَافِيَّةِ نَمُوذَجٌ لِلْأَرْضِ، يُبَيِّنُ أَمَاكِنَ الْيَابِسَةِ وَالْمَاءِ.',
          ['نَمُوذَجٌ لِلْأَرْضِ', 'الْيَابِسَةِ', 'الْمَاءِ'], mark='#1565C0'), 19, fill='#FFFDF0', line=BLUE, lw=3, alpha=100)
c1 = card(s, CX + 4.15, 2.22, 6.15, .85, hl('الْقَارَّةُ: جُزْءٌ كَبِيرٌ مِنَ الْيَابِسَةِ، مُحَاطٌ بِالْمُحِيطَاتِ.', ['الْقَارَّةُ', 'كَبِيرٌ'], mark=BROWN), 18,
          fill='#FFF8E1', line=BROWN, lw=2.5, alpha=100)
c2 = card(s, CX + 4.15, 3.17, 6.15, .85, hl('الْجَزِيرَةُ: جُزْءٌ صَغِيرٌ مِنَ الْيَابِسَةِ، مُحَاطٌ بِالْمَاءِ مِنْ جَمِيعِ الْجِهَاتِ.', ['الْجَزِيرَةُ', 'صَغِيرٌ', 'جَمِيعِ الْجِهَاتِ'], mark=TEAL), 18,
          fill='#E0F7FA', line=TEAL, lw=2.5, alpha=100)
tbox(s, CX + 4.15, 4.15, 6.15, .45, '🗺️ ألوان الخريطة: اضغطي على اللون', 16, '#FFFFFF', DVIO, align='c', radius=.5)
COLS = [('البني', '#8D5A3B', 'الجبال'), ('الأخضر', '#43A047', 'السهول المنبسطة'), ('الأصفر', '#F9A825', 'الصحارى'), ('الأزرق', '#1E88E5', 'الماء')]
for i, (cn, cc, mean) in enumerate(COLS):
    x = CX + 8.75 - i * 1.53
    bt = tbox(s, x, 4.7, 1.45, .55, cn, 17, '#FFFFFF', cc, '#FFFFFF', align='c', radius=.5, lw=2.5)
    mn = tbox(s, x, 5.32, 1.45, .62, mean, 15, cc, '#FFFFFF', cc, align='c', lw=2, margin=.03)
    reveal(s, bt, mn, sound='pop')
q = card(s, CX + .3, 4.5, 3.6, 1.0, [[('🎭 من أنا؟ ', PINK, 14), ('جزء صغير من اليابسة، والماء حولي من كل الجهات.', INK, 14)]], 14, line=PINK, lw=2.5, alpha=100)
for i, (o, ok) in enumerate([('جزيرة', True), ('قارة', False), ('محيط', False)]):
    option(s, CX + 2.85 - i * 1.28, 5.8, 1.0, .5, o, ok, 16)
host(s, 'point', 'الخريطة تخبرنا: أين اليابسة؟ وأين الماء؟ 🗺️')
auto(s, [gl, 'zoom', S(s, 'whoosh')], [m1, 'fade'])
click(s, [c1, 'rise', S(s, 'pop')])
click(s, [c2, 'rise', S(s, 'pop')])
notes(s, 'صفحة ١٢٠: الكرة الجغرافية نموذج للأرض تبيّن أماكن اليابسة والماء.\n'
         'النقرة ١: القارة (جزء كبير من اليابسة محاط بالمحيطات). النقرة ٢: الجزيرة (جزء صغير محاط بالماء من جميع الجهات) – أشيري إليهما على صورة الكرة.\n'
         'اضغطي على أزرار الألوان: البني الجبال، الأخضر السهول المنبسطة، الأصفر الصحارى، الأزرق الماء. ثم سؤال «من أنا؟» للتقويم.')

# =========================================================== 11-12. think, talk, write (p121)
s = D_slide()
frame(s, 'أفكر وأتحدث وأكتب (١)', 'أفكر', 'فكّري – تحدثي – اكتبي', 'صفحة ١٢١', fill='#C62828')
bookpic(s, 'globe', CX + 6.6, 1.45, w=3.7, cap='من كتابي – ص١٢٠')
Q = [('١- أُقَارِنُ. فِيمَ تَخْتَلِفُ الْقَارَّاتُ عَنِ الْجُزُرِ؟', 'القارات أجزاء كبيرة من اليابسة محاطة بالمحيطات، والجزر أجزاء صغيرة من اليابسة محاطة بالماء من جميع الجهات.'),
     ('٢- فِيمَ تَخْتَلِفُ التِّلَالُ عَنِ الْجِبَالِ؟', 'التلال مناطق مرتفعة، ولكنها أقل ارتفاعًا من الجبال.')]
for i, (q, a) in enumerate(Q):
    y = 1.25 + i * 2.75
    qq = card(s, CX + .3, y, 6.1, .95, q, 19, fill='#FFFDF0', line='#C62828', lw=3, alpha=100)
    aa = answer(s, CX + .3, y + 1.05, 6.1, 1.35, a, 16)
    st = star(s, CX + 5.85, y + 1.0, .5)
    reveal(s, qq, aa, st)
pic(s, A('m_hill'), CX + 6.9, 4.6, w=1.6, h=1.07); pic(s, A('m_mountain'), CX + 8.55, 4.4, w=1.75, h=1.17)
host(s, 'think', 'فكّري… ثم تحدّثي مع زميلتك… ثم اكتبي ✍️')
notes(s, 'أفكر وأتحدث وأكتب (ص١٢١) بنص الكتاب: السؤالان ١ و٢. الإجابات من نص الكتاب ص١١٩–١٢٠. اضغطي على السؤال لتظهر الإجابة ونجمة.')

s = D_slide()
frame(s, 'أفكر وأتحدث وأكتب (٢)', 'أفكر', 'قراءة الرسوم – التفكير', 'صفحة ١٢١', fill='#C62828')
card(s, CX + 4.0, 1.2, 6.3, 1.15, '٣- حَدِّدْ عَلَى الرَّسْمِ أَيُّ الْأَجْزَاءِ يُمَثِّلُ الْيَابِسَةَ؟ وَأَيُّ الْأَجْزَاءِ يُمَثِّلُ الْمَاءَ فِي كَوْكَبِ الْأَرْضِ؟', 17, fill='#FFFDF0', line='#C62828', lw=3, alpha=100)
pie = pic(s, B('pie2'), CX + .4, 1.3, w=3.4, h=2.05)
y_hot = tbox(s, CX + .55, 1.35, 1.25, 1.1, '؟', 30, '#5D4037', '#FFF176', '#FFFFFF', shape='oval', align='c', alpha=60, margin=0)
b_hot = tbox(s, CX + 1.75, 2.1, 1.3, 1.1, '؟', 30, '#FFFFFF', '#26A69A', '#FFFFFF', shape='oval', align='c', alpha=60, margin=0)
ly = tbox(s, CX + .3, 3.45, 1.7, .55, 'الأصفر: اليابسة', 14, '#FFFFFF', BROWN, align='c', radius=.5, margin=.02)
lb = tbox(s, CX + 2.1, 3.45, 1.75, .55, 'الأزرق: الماء', 14, '#FFFFFF', '#00838F', align='c', radius=.5, margin=.02)
trigger_steps(s, y_hot, ([y_hot, 'out'], [ly, 'zoom', S(s, 'chime')]))
trigger_steps(s, b_hot, ([b_hot, 'out'], [lb, 'zoom', S(s, 'chime')]))
pm = tbox(s, CX + 4.0, 2.5, 6.3, .7, 'الماء يشكّل الجزء الأكبر من مساحة الأرض، واليابسة جزءًا صغيرًا. (ص١١٨)', 15, '#FFFFFF', '#00838F', margin=.04)
click(s, pm)
q4 = card(s, CX + 4.0, 3.45, 6.3, .8, [[('٤- ✏️ السُّؤَالُ الْأَسَاسِيُّ. ', RED), ('مَا أَشْكَالُ الْيَابِسَةِ؟', INK)]], 19, fill='#FFFDF0', line='#C62828', lw=3, alpha=100)
F4 = [('m_plain', 'سهول منبسطة'), ('m_valley', 'وديان منخفضة'), ('m_mountain', 'جبال مرتفعة'), ('m_hill', 'تلال مرتفعة')]
steps = []
for i, (m, t) in enumerate(F4):
    x = CX + 7.85 - i * 2.5
    mm = pic(s, A(m), x, 4.35, w=2.4, h=1.6)
    tt = tbox(s, x + .1, 5.95, 2.2, .5, t, 15, '#FFFFFF', VIO, align='c', radius=.5, margin=.02)
    steps.append(([mm, 'zoom', S(s, 'pop')], [tt, 'zoom']))
trigger_steps(s, q4, *steps)
tbox(s, CX + .3, 6.5, 10.0, .45, '🏫 العلوم والمجتمع: أرسم خريطة لغرفة صفي، وأبيّن الأشياء المختلفة فيها مستخدمًا الرموز. (نشاط في الكتاب ص١٢١)', 13, DVIO, '#EDE7F6', VIO, align='c', radius=.5, margin=.02)
host(s, 'point', 'اضغطي على ألوان الرسم لتعرفي معناها!', h=2.6)
notes(s, 'أفكر وأتحدث وأكتب (ص١٢١): السؤال ٣ – تضغط الطالبة على الجزء الأصفر ثم الأزرق في الرسم (من الكتاب) فيظهر اسمه؛ ثم نقرة تُظهر معلومة ص١١٨.\n'
         'السؤال ٤ (السؤال الأساسي): اضغطي على السؤال فتظهر أشكال اليابسة الأربعة واحدًا بعد الآخر.\n'
         'العلوم والمجتمع: رسم خريطة لغرفة الصف بالرموز – داخل الحصة أو واجبًا منزليًا.')

# =========================================================== 13. final game: landform expert
s = D_slide()
frame(s, 'لعبة: خبيرة أشكال الأرض 🏅', 'التحدي', 'التقويم الختامي – التعلم باللعب', 'صفحات ١١٨ – ١٢٠', fill='#E65100')
FG = [('e_snow', [('جبل', True), ('سهل', False), ('وادٍ', False)]), ('hills', [('جبل', False), ('تلال', True), ('سهل', False)]),
      ('plain', [('وادٍ', False), ('تل', False), ('سهل', True)]), ('e_canyon', [('وادٍ', True), ('جبل', False), ('سهل', False)])]
for i, (img, opts) in enumerate(FG):
    x = CX + 7.8 - i * 2.55
    pic(s, B(img), x, 1.2, w=2.4, h=1.75, border='#FFFFFF')
    tbox(s, x + .7, 2.65, 1.0, .45, f'{"١٢٣٤"[i]}', 16, '#FFFFFF', '#E65100', shape='oval', align='c', margin=0)
    for j, (t, ok) in enumerate(opts):
        option(s, x + .15, 3.3 + j * .82, 2.1, .66, t, ok, 18, line='#FB8C00')
badge = tbox(s, CX + 2.3, 5.95, 5.8, .85, '🏅 أنتِ خبيرة أشكال الأرض! ⭐⭐⭐', 22, '#FFFFFF', '#E65100', '#FFE082', align='c', lw=4, radius=.5)
bb = tbox(s, CX + 8.2, 5.95, 2.1, .85, 'النتيجة 🏆', 20, '#FFFFFF', VIO, '#FFFFFF', align='c', lw=3, radius=.5)
trigger_steps(s, bb, ([badge, 'zoom', S(s, 'fanfare')],))
host(s, 'cheer', 'أي شكل في الصورة؟ أسرعي! ⏱️')
notes(s, 'التقويم الختامي «خبيرة أشكال الأرض»: لكل صورة من الكتاب ثلاثة اختيارات؛ الصحيح ✔ ونجمة ورنين، والخطأ ✘ وصوت.\n'
         'بعد الأسئلة الأربعة اضغطي «النتيجة» لتظهر شارة الخبيرة مع صوت احتفالي.')

# =========================================================== 14. closing
s = D_slide()
t = tbox(s, CX + 1.0, .5, 8.3, 1.05, 'شكرًا يا نجمات الاستوديو! 🎬', 30, '#FFFFFF', DVIO, '#FFFFFF', align='c', lw=4, radius=.5)
SUM = [('m_mountain', 'الجبل مرتفع'), ('m_hill', 'التل أقل ارتفاعًا'), ('m_plain', 'السهل منبسط'), ('m_valley', 'الوادي منخفض')]
cs = []
for i, (m, tx) in enumerate(SUM):
    x = CX + 7.75 - i * 2.5
    cs.append(([pic(s, A(m), x, 2.0, w=2.4, h=1.6), 'zoom'], [tbox(s, x + .1, 3.65, 2.2, .55, tx, 16, '#FFFFFF', VIO, align='c', radius=.5, margin=.02), 'zoom']))
sts = [star(s, CX + 1.6 + i * 1.5, 4.6, .9) for i in range(5)]
mot = tbox(s, CX + .8, 5.8, 8.7, .8, 'أرضنا جميلة بجبالها وسهولها ووديانها 🌍💜', 20, DVIO, '#FFFFFF', '#B39DDB', align='c', lw=3, radius=.5)
hp, hb = host(s, 'cheer', 'إلى اللقاء في الحلقة القادمة! 👋')
tbox(s, 9.6, 7.0, 3.5, .38, 'إعداد وتنفيذ: ' + TEACHER, 13, '#6B4FC0', '#FFFFFF', alpha=88, align='c', radius=.5, margin=.04)
auto(s, [t, 'zoom', S(s, 'sparkle')], *[tuple(c) for c in cs], tuple([x, 'zoom'] for x in sts), [mot, 'zoom', S(s, 'fanfare')], ([hp, 'rise'], hb))
notes(s, 'الختام: ملخص أشكال اليابسة الأربعة بالمجسمات، وتوديع المذيعة مع صوت احتفالي.')

D.save(OUT)
print('slides', len(D.slides))
