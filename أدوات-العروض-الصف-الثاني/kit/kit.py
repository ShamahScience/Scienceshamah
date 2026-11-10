"""Small helpers over python-pptx: RTL Arabic text, styled shapes, and click/trigger animations."""
from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from lxml import etree
import copy

FONT = 'Arial'
SCALE = 1.0  # Sakkal Majalla runs small: decks using it set SCALE = 1.2
NS_P = 'http://schemas.openxmlformats.org/presentationml/2006/main'


def rgb(h):
    return RGBColor.from_string(h.lstrip('#'))


class Deck:
    def __init__(self):
        self.prs = Presentation()
        self.prs.slide_width, self.prs.slide_height = Inches(13.333), Inches(7.5)
        self.blank = self.prs.slide_layouts[6]
        self.slides = []

    def slide(self, bg=None, transition='fade'):
        s = self.prs.slides.add_slide(self.blank)
        s._anim = {'groups': [], 'triggers': []}
        s._transition = transition
        if bg:
            pic(s, bg, 0, 0, 13.333, 7.5)
        self.slides.append(s)
        return s

    def save(self, path):
        for s in self.slides:
            finish(s)
        self.prs.save(path)


# ---------------------------------------------------------------- shapes
def _alpha(fill_elm, alpha):
    if alpha is None:
        return
    clr = fill_elm.find('.//' + qn('a:srgbClr'))
    a = etree.SubElement(clr, qn('a:alpha'))
    a.set('val', str(int(alpha * 1000)))


def box(s, x, y, w, h, fill=None, line=None, lw=2.5, shape='round', alpha=None, dash=False, radius=None):
    kind = {'round': MSO_SHAPE.ROUNDED_RECTANGLE, 'rect': MSO_SHAPE.RECTANGLE, 'oval': MSO_SHAPE.OVAL,
            'bubble': MSO_SHAPE.ROUNDED_RECTANGULAR_CALLOUT, 'arrow': MSO_SHAPE.LEFT_ARROW, 'heart': MSO_SHAPE.HEART,
            'star': MSO_SHAPE.STAR_5_POINT}[shape]
    sp = s.shapes.add_shape(kind, Inches(x), Inches(y), Inches(w), Inches(h))
    sp.shadow.inherit = False
    if fill:
        sp.fill.solid(); sp.fill.fore_color.rgb = rgb(fill)
        _alpha(sp.fill._xPr.find(qn('a:solidFill')), alpha)
    else:
        sp.fill.background()
    if line:
        sp.line.color.rgb = rgb(line); sp.line.width = Pt(lw)
        if dash:
            ln = sp.line._get_or_add_ln(); d = etree.SubElement(ln, qn('a:prstDash')); d.set('val', 'dash')
    else:
        sp.line.fill.background()
    if shape == 'round':
        sp.adjustments[0] = radius if radius is not None else min(0.5, 0.18 * 1 / max(h, .3))
    return sp


def text(sp, paras, size=24, color='#1E2A3A', bold=True, align='r', anchor='m', margin=.12, spacing=None):
    """paras: str | list of (str | list of (text, color?, size?)) — one item per paragraph."""
    tf = sp.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.margin_left = tf.margin_right = Inches(margin)
    tf.margin_top = tf.margin_bottom = Inches(margin * .6)
    tf.vertical_anchor = {'m': MSO_ANCHOR.MIDDLE, 't': MSO_ANCHOR.TOP, 'b': MSO_ANCHOR.BOTTOM}[anchor]
    if isinstance(paras, str):
        paras = [paras]
    for i, para in enumerate(paras):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = {'r': PP_ALIGN.RIGHT, 'c': PP_ALIGN.CENTER, 'l': PP_ALIGN.LEFT}[align]
        p._p.get_or_add_pPr().set('rtl', '1')
        if spacing:
            p.line_spacing = spacing
        runs = [(para,)] if isinstance(para, str) else [r if isinstance(r, tuple) else (r,) for r in para]
        for r in runs:
            run = p.add_run(); run.text = r[0]
            f = run.font; f.name = FONT; f.bold = bold
            f.size = Pt(round((r[2] if len(r) > 2 and r[2] else size) * SCALE))
            f.color.rgb = rgb(r[1] if len(r) > 1 and r[1] else color)
            rPr = run._r.get_or_add_rPr(); rPr.set('lang', 'ar-SA')
            cs = etree.SubElement(rPr, qn('a:cs')); cs.set('typeface', FONT)
    return sp


def tbox(s, x, y, w, h, paras, size=24, color='#1E2A3A', fill=None, line=None, align='r', anchor='m',
         bold=True, shape='round', alpha=None, lw=2.5, dash=False, radius=None, margin=.12, spacing=None):
    sp = box(s, x, y, w, h, fill, line, lw, shape, alpha, dash, radius)
    return text(sp, paras, size, color, bold, align, anchor, margin, spacing)


def pic(s, path, x, y, w=None, h=None, border=None):
    kw = {}
    if w: kw['width'] = Inches(w)
    if h: kw['height'] = Inches(h)
    p = s.shapes.add_picture(path, Inches(x), Inches(y), **kw)
    if border:
        p.line.color.rgb = rgb(border); p.line.width = Pt(4)
    return p


def notes(s, txt):
    s.notes_slide.notes_text_frame.text = txt


def link(sp, target):
    sp.click_action.target_slide = target


# ---------------------------------------------------------------- animation
def click(s, *steps):
    """A click that plays `steps` one after another; each step is a shape or a tuple of shapes (together)."""
    s._anim['groups'].append(('click', steps))


def auto(s, *steps):
    s._anim['groups'].append(('auto', steps))


def trigger(s, trig, *targets):
    s._anim['triggers'].append((trig, (tuple(targets),)))


def trigger_steps(s, trig, *steps):
    """Clicking `trig` plays `steps` one after another (each a shape, [shape, kind] or tuple of those)."""
    s._anim['triggers'].append((trig, steps))


DUR = {'fade': 500, 'zoom': 500, 'rise': 500, 'out': 400, 'move': 900, 'pulse': 500, 'spin': 800}


def _eff(cid, spid, kind, node, dur=None):
    """Entrance (fade/zoom/rise), exit ('out') or motion (('move', dx, dy) as slide fractions)."""
    ids = iter(range(cid, cid + 12))
    tgt = f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
    name = kind[0] if isinstance(kind, tuple) else kind
    dur = dur or DUR[name]
    if name == 'move':
        _, dx, dy = kind
        head = (f'<p:cTn id="{next(ids)}" presetID="0" presetClass="path" presetSubtype="0" accel="50000" decel="50000" fill="hold" nodeType="{node}">'
                '<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>')
        body = (f'<p:animMotion origin="layout" path="M 0 0 L {dx:.4f} {dy:.4f} E" pathEditMode="relative" rAng="0" ptsTypes="AA">'
                f'<p:cBhvr><p:cTn id="{next(ids)}" dur="{dur}" fill="hold"/>{tgt}'
                '<p:attrNameLst><p:attrName>ppt_x</p:attrName><p:attrName>ppt_y</p:attrName></p:attrNameLst></p:cBhvr>'
                f'<p:rCtr x="{dx*50000:.0f}" y="{dy*50000:.0f}"/></p:animMotion>')
        return head + body + '</p:childTnLst></p:cTn>', next(ids), dur
    if name == 'pulse':
        head = (f'<p:cTn id="{next(ids)}" presetID="6" presetClass="emph" presetSubtype="0" repeatCount="2000" autoRev="1" fill="hold" nodeType="{node}">'
                '<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>')
        body = (f'<p:animScale><p:cBhvr><p:cTn id="{next(ids)}" dur="125" fill="hold"/>{tgt}</p:cBhvr><p:by x="115000" y="115000"/></p:animScale>')
        return head + body + '</p:childTnLst></p:cTn>', next(ids), dur
    if name == 'spin':
        deg = kind[1] if isinstance(kind, tuple) else 360
        head = (f'<p:cTn id="{next(ids)}" presetID="8" presetClass="emph" presetSubtype="0" fill="hold" nodeType="{node}">'
                '<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>')
        body = (f'<p:animRot by="{int(deg * 60000)}"><p:cBhvr><p:cTn id="{next(ids)}" dur="{dur}" fill="hold"/>{tgt}'
                '<p:attrNameLst><p:attrName>r</p:attrName></p:attrNameLst></p:cBhvr></p:animRot>')
        return head + body + '</p:childTnLst></p:cTn>', next(ids), dur
    if name == 'out':
        head = (f'<p:cTn id="{next(ids)}" presetID="10" presetClass="exit" presetSubtype="0" fill="hold" grpId="1" nodeType="{node}">'
                '<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>')
        body = (f'<p:animEffect transition="out" filter="fade"><p:cBhvr><p:cTn id="{next(ids)}" dur="{dur}"/>{tgt}</p:cBhvr></p:animEffect>'
                f'<p:set><p:cBhvr><p:cTn id="{next(ids)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="{dur-1}"/></p:stCondLst></p:cTn>{tgt}'
                '<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="hidden"/></p:to></p:set>')
        return head + body + '</p:childTnLst></p:cTn>', next(ids), dur
    head = (f'<p:cTn id="{next(ids)}" presetID="{ {"fade": 10, "zoom": 53, "rise": 42}[name]}" presetClass="entr" '
            f'presetSubtype="{16 if name == "zoom" else 0}" fill="hold" grpId="0" nodeType="{node}">'
            '<p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>')
    body = (f'<p:set><p:cBhvr><p:cTn id="{next(ids)}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
            f'{tgt}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>')
    def anim(attr, a, b):
        return (f'<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="{next(ids)}" dur="{dur}" fill="hold"/>{tgt}'
                f'<p:attrNameLst><p:attrName>{attr}</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst>'
                f'<p:tav tm="0"><p:val><p:strVal val="{a}"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="{b}"/></p:val></p:tav></p:tavLst></p:anim>')
    if name == 'zoom':
        body += anim('ppt_w', '0', '#ppt_w') + anim('ppt_h', '0', '#ppt_h')
    if name == 'rise':
        body += anim('ppt_y', '#ppt_y+0.06', '#ppt_y')
    body += f'<p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{next(ids)}" dur="{dur}"/>{tgt}</p:cBhvr></p:animEffect>'
    return head + body + '</p:childTnLst></p:cTn>', next(ids), dur


def _seq(steps, cid, first_node):
    xml = ''; delay = 0
    for i, step in enumerate(steps):
        effs = [(e[0], e[1], e[2] if len(e) > 2 else None) if isinstance(e, list) else (e, 'fade', None) for e in (step if isinstance(step, tuple) else (step,))]
        outer = cid; cid += 1; inner = ''; longest = 0
        for j, (shape, kind, snd) in enumerate(effs):
            node = (first_node if i == 0 else 'afterEffect') if j == 0 else 'withEffect'
            head_id = cid
            e, cid, d = _eff(cid, shape.shape_id, kind, node)
            if snd:
                rid, nm = snd.split('|')
                e = e[:-len('</p:cTn>')] + (f'<p:subTnLst><p:audio><p:cMediaNode vol="80000" showWhenStopped="0"><p:cTn id="{cid}" display="0" masterRel="sameClick">'
                     f'<p:stCondLst><p:cond evt="onBegin" delay="0"><p:tn val="{head_id}"/></p:cond></p:stCondLst></p:cTn>'
                     f'<p:tgtEl><p:sndTgt r:embed="{rid}" name="{nm}"/></p:tgtEl></p:cMediaNode></p:audio></p:subTnLst></p:cTn>')
                cid += 1
            inner += f'<p:par>{e}</p:par>'; longest = max(longest, d)
        xml += f'<p:par><p:cTn id="{outer}" fill="hold"><p:stCondLst><p:cond delay="{delay}"/></p:stCondLst><p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>'
        delay += longest
    return xml, cid


def finish(s):
    sld = s._element
    tr = {'fade': '<p:fade/>', 'push': '<p:push dir="l"/>', 'zoom': '<p:zoom/>', 'wipe': '<p:wipe dir="l"/>', 'cover': '<p:cover dir="l"/>'}[s._transition]
    adv = f' advTm="{s._adv}"' if getattr(s, '_adv', None) else ''
    sld.append(etree.fromstring(f'<p:transition xmlns:p="{NS_P}" spd="med"{adv}>{tr}</p:transition>'))
    if getattr(s, '_extra_timing', None) is not None:
        sld.append(s._extra_timing)
        return
    A = s._anim
    if not A['groups'] and not A['triggers']:
        return
    cid = 3; main = ''; shapes = set()
    for kind, steps in A['groups']:
        for st in steps:
            for e in (st if isinstance(st, tuple) else (st,)):
                shapes.add((e[0] if isinstance(e, list) else e).shape_id)
        outer = cid; cid += 1
        inner, cid = _seq(steps, cid, 'clickEffect' if kind == 'click' else 'afterEffect')
        cond = ('<p:cond delay="indefinite"/>' if kind == 'click'
                else '<p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond>')
        main += f'<p:par><p:cTn id="{outer}" fill="hold"><p:stCondLst>{cond}</p:stCondLst><p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>'
    seqs = ''
    if main:
        seqs += (f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>{main}</p:childTnLst></p:cTn>'
                 '<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
                 '<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>')
    for trig, steps in A['triggers']:
        for st in steps:
            for t in (st if isinstance(st, tuple) else (st,)):
                sh, kind = (t[0], t[1]) if isinstance(t, list) else (t, 'fade')
                if not (isinstance(kind, tuple) or kind in ('out', 'pulse', 'spin')):
                    shapes.add(sh.shape_id)
        sid = cid; cid += 1; outer = cid; cid += 1
        inner, cid = _seq(steps, cid, 'clickEffect')
        seqs += (f'<p:seq concurrent="1" nextAc="seek"><p:cTn id="{sid}" restart="whenNotActive" fill="hold" evtFilter="cancelBubble" nodeType="interactiveSeq">'
                 f'<p:stCondLst><p:cond evt="onClick" delay="0"><p:tgtEl><p:spTgt spid="{trig.shape_id}"/></p:tgtEl></p:cond></p:stCondLst>'
                 '<p:endSync evt="end" delay="0"><p:rtn val="all"/></p:endSync><p:childTnLst>'
                 f'<p:par><p:cTn id="{outer}" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>{inner}</p:childTnLst></p:cTn></p:par>'
                 '</p:childTnLst></p:cTn><p:nextCondLst><p:cond evt="onClick" delay="0"><p:tgtEl>'
                 f'<p:spTgt spid="{trig.shape_id}"/></p:tgtEl></p:cond></p:nextCondLst></p:seq>')
    sps = {sp.shape_id: sp for sp in s.shapes}
    bld = ''.join(f'<p:bldP spid="{i}" grpId="{g}" animBg="1"/>' for i in sorted(shapes) if getattr(sps[i], 'has_text_frame', False) for g in [0])
    xml = (f'<p:timing xmlns:p="{NS_P}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>'
           f'{seqs}</p:childTnLst></p:cTn></p:par></p:tnLst>' + (f'<p:bldLst>{bld}</p:bldLst>' if bld else '') + '</p:timing>')
    sld.append(etree.fromstring(xml))


def arrow(s, x1, y1, x2, y2, color, width=3):
    """Straight line in inches from (x1, y1) to an arrowhead at (x2, y2)."""
    from pptx.enum.shapes import MSO_CONNECTOR
    c = s.shapes.add_connector(MSO_CONNECTOR.STRAIGHT, Inches(x1), Inches(y1), Inches(x2), Inches(y2))
    c.line.color.rgb = rgb(color); c.line.width = Pt(width)
    ln = c.line._get_or_add_ln(); t = etree.SubElement(ln, qn('a:tailEnd')); t.set('type', 'triangle'); t.set('w', 'med'); t.set('len', 'med')
    return c


_SND = {}


def snd(s, path):
    """Embed a .wav once in the deck and relate it to slide `s`; returns the token that a step's third item takes."""
    from pptx.opc.package import Part
    from pptx.opc.packuri import PackURI
    from pptx.opc.constants import RELATIONSHIP_TYPE as RT
    import os
    if path not in _SND:
        _SND[path] = Part(PackURI(f'/ppt/media/sound{len(_SND) + 1}.wav'), 'audio/wav', s.part.package, open(path, 'rb').read())
    rid = s.part.relate_to(_SND[path], RT.AUDIO)
    return f'{rid}|{os.path.basename(path)}'
