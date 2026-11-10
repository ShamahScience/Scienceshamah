"""Grade 2 science: «الماء على الأرض» — the teacher's own slide pictures with interactive layers on top."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "kit"))
from kit import *
import kit
kit.FONT = 'Sakkal Majalla'
kit.SCALE = 1.2

ROOT = sys.argv[1]; OUT = sys.argv[2]
IMG = lambda n: f'{ROOT}/img/s{n}.png'
S = lambda s, n: snd(s, f'{ROOT}/snd/{n}.wav')
K = 13.333 / 1672          # picture px -> slide inches
INK, PINK, BLUE, GREEN, GOLD = '#1E2A3A', '#E2558C', '#1E88E5', '#2E9E5B', '#F5A623'
D = Deck()


def px(x, y, w, h, s, paras, size, color=INK, fill=None, line=None, **kw):
    """A text box placed in picture pixels."""
    return tbox(s, x * K, y * K, w * K, h * K, paras, size, color, fill, line, **kw)


def daydate(s, day, date):
    """Editable boxes over the picture's «اليوم» and «التاريخ» fields: (x, y, w, h) in pixels."""
    px(*day, s, '……', 16, align='c', shape='rect', margin=.02)
    px(*date, s, '…/…/١٤٤٨هـ', 14, align='c', shape='rect', margin=.02)


def badge(s, cx, cy, mark='✔', fill=GREEN, r=34, size=20):
    return px(cx - r, cy - r, 2 * r, 2 * r, s, mark, size, '#FFFFFF', fill, '#FFFFFF', shape='oval', align='c', margin=0, lw=3)


def starp(s, cx, cy, r=34):
    return px(cx - r, cy - r, 2 * r, 2 * r, s, '', 10, fill='#FFD54F', line=GOLD, shape='star')


# ------------------------------------------------------------- 1. board + rules
s = D.slide(IMG(1))
daydate(s, (965, 62, 190, 58), (312, 62, 215, 58))
stars = [starp(s, x, 700, 30) for x in (1180, 970, 760, 548, 338)]   # above each rule drop, right to left
click(s, *[[st, 'zoom', S(s, 'pop')] for st in stars])
notes(s, 'السبورة: العنوان «الماء على الأرض» وقوانين درسنا. اكتبي اليوم والتاريخ في المربعين.\n'
         'كل نقرة تُظهر نجمة فوق قانون: أستمع بانتباه، أرفع يدي للمشاركة، أحترم زميلاتي، أفكر قبل الإجابة، أشارك بحماس.')

# ------------------------------------------------------------- 2. objectives
s = D.slide(IMG(2))
daydate(s, (1150, 50, 200, 52), (218, 50, 210, 52))
ok = [badge(s, x, 720) for x in (1385, 1095, 800, 515)]
click(s, *[[b, 'zoom', S(s, 'chime')] for b in ok])
notes(s, 'أهداف الدرس الأربعة. كل نقرة تضع علامة ✔ تحت هدف (من اليمين): أتعرف أماكن وجود الماء على الأرض، '
         'أميز بين الماء العذب والماء المالح، أكتشف أهمية الماء للمخلوقات الحية، أتعلم كيف أحافظ على نعمة الماء.\n'
         'يمكن العودة لهذه الشريحة في نهاية الدرس لتتأكد الطالبات أنهن حققن الأهداف.')

# ------------------------------------------------------------- 3. review windows
s = D.slide(IMG(4))
daydate(s, (1160, 45, 200, 58), (215, 45, 210, 58))
for x0, x1 in ((1285, 1440), (880, 1040), (493, 655)):
    cov = px(x0 - 6, 494, x1 - x0 + 12, 58, s, '؟', 24, '#FFFFFF', '#7E57C2', '#FFFFFF', align='c', radius=.5, lw=3)
    st = starp(s, x1 + 20, 470, 28)
    trigger_steps(s, cov, ([cov, 'out', S(s, 'chime')], [st, 'zoom', S(s, 'sparkle')]))
notes(s, 'مراجعة: ما اسم هذا الشكل من اليابسة؟ اسم كل نافذة مغطى. اضغطي على «؟ اضغطي» ليظهر الاسم ونجمة: الجبال، السهول، الصحراء.')

# ------------------------------------------------------------- 4. hook: a letter from a water drop
s = D.slide(IMG(5))
daydate(s, (1160, 45, 200, 58), (212, 45, 215, 58))
btn = px(560, 700, 470, 125, s, '', 10, fill='#FFFFFF', alpha=1)          # invisible hit area over «افتحي الرسالة»
letter = px(555, 330, 560, 330, s, [[('💧 رسالة من قطرة ماء', '#1565C0', 18)],
                                  [('مرحبًا يا صديقاتي! أنا قطرة ماء.', INK, 15)],
                                  [('أعيش في أماكن كثيرة على الأرض…', INK, 15)],
                                  [('هل تعرفن أين أعيش؟ هيا نكتشف معًا!', '#C2185B', 15)]], 15,
            fill='#FFFFFF', line='#64B5F6', align='c', lw=4, radius=.25)
trigger_steps(s, btn, ([letter, 'zoom', S(s, 'whoosh')],))
notes(s, 'التمهيد: اضغطي على زر «افتحي الرسالة» فتظهر رسالة قطرة الماء.\n'
         'ثم اسألي: برأيكن… أين نجد الماء على الأرض؟ واستمعي لتوقعات الطالبات قبل الشرح.')


# ------------------------------------------------------------- 5. look and wonder
s = D.slide(IMG(6))
daydate(s, (1150, 45, 200, 58), (215, 45, 210, 58))
LAB = [(1100, 'تغسل يديها 🧼'), (850, 'تشرب الماء 🥤'), (590, 'تسقي الأزهار 🌷')]
labs = [px(x - 122, 546, 244, 58, s, t, 14, '#FFFFFF', '#1E88E5', '#FFFFFF', align='c', radius=.5, lw=3) for x, t in LAB]
click(s, *[[l, 'zoom', S(s, 'pop')] for l in labs])
notes(s, 'أنظر وأتساءل: فيمَ يستعمل هؤلاء الأولاد الماء؟ اتركي الطالبات يلاحظن الصور ويجبن أولًا.\n'
         'ثم كل نقرة تُظهر إجابة على صورة (من اليمين): تغسل يديها، تشرب الماء، تسقي الأزهار.')

# ------------------------------------------------------------- 6. explore: is there water in soil?
s = D.slide(IMG(7))
rings = [px(x - 128, 362, 256, 240, s, '', 10, line=PINK, lw=6, radius=.15) for x in (1270, 945, 622)]
obs = px(520, 708, 720, 165, s, [[('اكتبي ملاحظة الطالبات هنا…', '#90A4AE', 18)]], 18, align='c', shape='rect')
click(s, *[[r, 'zoom', S(s, 'pop')] for r in rings])
notes(s, 'أستكشف: هل يوجد ماء في التربة؟ نفّذي الخطوات مع الطالبات، وكل نقرة تحدّد خطوة: '
         '١ أضع التربة في كأس شفاف، ٢ أضيف الماء إلى التربة، ٣ أخلط جيدًا وألاحظ.\n'
         'اكتبي ملاحظات الطالبات داخل مربع «أسجّل ملاحظاتي» أثناء العرض (امسحي العبارة الرمادية واكتبي).')

# ------------------------------------------------------------- 7. why water matters
s = D.slide(IMG(8))
st = [starp(s, x, y, 30) for x, y in ((1460, 210), (735, 210), (735, 430), (1460, 430))]
ans = px(430, 768, 780, 80, s, [[('لأنّ ', INK, 16), ('المخلوقات الحية جميعها', '#1565C0', 16), (' تحتاج إلى الماء لتعيش 💧', INK, 16)]], 16,
         fill='#FFFFFF', line='#64B5F6', align='c', lw=3, radius=.5)
click(s, *[[x, 'zoom', S(s, 'pop')] for x in st])
click(s, [ans, 'rise', S(s, 'fanfare')])
notes(s, 'ما أهمية الماء؟ الماء ضروري للحياة. كل نقرة تضع نجمة على بطاقة: للنباتات، للحيوانات، للإنسان، للمخلوقات الحية جميعها.\n'
         'ثم اسألي «أستنتج: لماذا يُعدّ الماء مهمًّا لكل المخلوقات الحية؟» والنقرة الأخيرة تُظهر الإجابة.')

# ------------------------------------------------------------- 8. fresh water and its sources
s = D.slide(IMG(9))
for x0, x1 in ((1192, 1448), (826, 1088), (472, 714)):
    cov = px(x0, 622, x1 - x0, 66, s, '؟', 26, '#FFFFFF', '#7E57C2', '#FFFFFF', align='c', radius=.5, lw=3)
    st = starp(s, x1 - 10, 600, 28)
    trigger_steps(s, cov, ([cov, 'out', S(s, 'chime')], [st, 'zoom', S(s, 'sparkle')]))
notes(s, 'الماء العذب: هو الماء القليل الأملاح، الصالح لاستخدامات المخلوقات الحية.\n'
         'ما مصادر الماء العذب؟ اسألي الطالبات عن كل صورة، ثم اضغطي على «؟» ليظهر الاسم ونجمة: البحيرات، الأنهار، الينابيع.\n'
         'أفكر وأشارك: أيّ مصدر من مصادر الماء العذب يوجد في منطقتك؟ – استمعي لإجابات الطالبات.')

# ------------------------------------------------------------- 9. where is most of Earth's water?
s = D.slide(IMG(10))
covs = []
for y0 in (240, 432):
    cov = px(1380, y0, 158, 98, s, '؟', 28, '#FFFFFF', '#1E88E5', '#FFFFFF', shape='oval', align='c', lw=3)
    trigger_steps(s, cov, ([cov, 'out', S(s, 'pop')],))
ans = px(830, 778, 420, 64, s, [[('المياه المالحة أكثر 🌊', '#1565C0', 15)]], 15, fill='#FFFFFF', line='#64B5F6', align='c', lw=3, radius=.5)
click(s, [ans, 'zoom', S(s, 'fanfare')])
notes(s, 'أين توجد معظم مياه الأرض؟ اضغطي على «؟» لتظهر النسبة: مياه عذبة ٣٪، مياه مالحة ٩٧٪.\n'
         'معظم مياه الأرض مياه مالحة في البحار والمحيطات.\n'
         'أستنتج: أيهما أكثر على الأرض؟ المياه المالحة أم العذبة؟ – النقرة تُظهر الإجابة: المياه المالحة أكثر.')

D.save(OUT)
print('slides', len(D.slides))
