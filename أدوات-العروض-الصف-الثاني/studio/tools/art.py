"""Studio art: a TV-studio background, the little hijabi presenter (four poses, holding a microphone),
and four pseudo-3D landform models (mountain, hill, plain, valley) standing on a turntable."""
import sys, os, random, math
OUT = sys.argv[1]
R = random.Random(21)
os.makedirs(OUT, exist_ok=True)


def svg(body, w, h, defs=''):
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}"><defs>{defs}</defs>{body}</svg>'


# ---------------------------------------------------------------- studio background
def studio():
    d = ('<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B3FA8"/><stop offset="1" stop-color="#8E6BD8"/></linearGradient>'
         '<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B2A6B"/><stop offset="1" stop-color="#22174A"/></linearGradient>'
         '<radialGradient id="spot" cx=".5" cy="0" r="1"><stop offset="0" stop-color="#FFF7C2" stop-opacity=".55"/><stop offset="1" stop-color="#FFF7C2" stop-opacity="0"/></radialGradient>')
    b = '<rect width="1920" height="1080" fill="url(#wall)"/>'
    # wall panels with soft glow lines
    for x in range(0, 1920, 160):
        b += f'<rect x="{x+8}" y="40" width="144" height="760" rx="18" fill="#fff" opacity=".05"/>'
    # back screen showing a landscape silhouette
    b += '<rect x="560" y="70" width="800" height="430" rx="26" fill="#1B1340" stroke="#C9B6FF" stroke-width="10"/>'
    b += '<rect x="580" y="90" width="760" height="390" rx="16" fill="#8ED1FF"/>'
    b += '<path d="M580 400 L700 250 L800 330 L900 190 L1020 340 L1120 290 L1220 360 L1340 300 V480 H580Z" fill="#7CB342"/>'
    b += '<path d="M900 190 L860 245 L940 245Z" fill="#fff"/><path d="M580 440 Q960 400 1340 440 V480 H580Z" fill="#9CCC65"/>'
    b += '<text x="960" y="150" text-anchor="middle" font-family="Tahoma" font-size="40" font-weight="700" fill="#fff" opacity=".9">● LIVE</text>'
    # lights on rig
    b += '<rect x="0" y="0" width="1920" height="26" fill="#2A1D57"/>'
    for x in (180, 480, 1440, 1740):
        b += f'<rect x="{x-30}" y="20" width="60" height="50" rx="10" fill="#33275F"/><circle cx="{x}" cy="78" r="22" fill="#FFF59D"/>'
        b += f'<polygon points="{x-20},90 {x+20},90 {x+220},1000 {x-220},1000" fill="url(#spot)"/>'
    # floor + glossy reflection
    b += '<rect y="800" width="1920" height="280" fill="url(#floor)"/>'
    b += '<rect y="800" width="1920" height="8" fill="#C9B6FF" opacity=".6"/>'
    for i in range(14):
        b += f'<line x1="{i*150}" y1="808" x2="{i*150-300}" y2="1080" stroke="#fff" stroke-width="2" opacity=".07"/>'
    # stars confetti
    for _ in range(40):
        x, y = R.randint(0, 1920), R.randint(40, 780)
        b += f'<circle cx="{x}" cy="{y}" r="{R.uniform(2,5):.1f}" fill="#FFE57F" opacity="{R.uniform(.3,.8):.2f}"/>'
    return svg(b, 1920, 1080, d)


# ---------------------------------------------------------------- presenter
def presenter(pose):
    skin, hij, hij2, jacket, shirt = '#FFE3D3', '#F48FB1', '#EC6F9C', '#7E57C2', '#FFFFFF'
    mic = ('<g transform="translate({x} {y}) rotate({r})"><rect x="-7" y="0" width="14" height="70" rx="6" fill="#37474F"/>'
           '<circle cx="0" cy="-8" r="22" fill="#455A64"/><circle cx="0" cy="-8" r="16" fill="#90A4AE"/>'
           '<rect x="-13" y="18" width="26" height="22" rx="4" fill="#E91E63"/><text x="0" y="35" font-size="14" text-anchor="middle" fill="#fff" font-family="Tahoma" font-weight="700">TV</text></g>')
    hand = lambda x, y: f'<circle cx="{x}" cy="{y}" r="20" fill="{skin}"/>'
    if pose == 'mic':      # holds the microphone near the mouth, other hand waves
        arms = (f'<path d="M150 330 Q115 300 150 255" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(155,250)}'
                + mic.format(x=168, y=262, r=-20) +
                f'<path d="M250 330 Q300 300 312 230" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(314,222)}')
    elif pose == 'point':  # points to the side (toward the screen), mic in the other hand
        arms = (f'<path d="M150 330 Q110 360 120 410" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(121,415)}'
                + mic.format(x=118, y=400, r=-10) +
                f'<path d="M250 330 Q300 330 345 300" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(350,296)}'
                f'<path d="M362 290 l26 -14" stroke="{skin}" stroke-width="11" stroke-linecap="round"/>')
    elif pose == 'think':
        arms = (f'<path d="M150 330 Q110 360 120 410" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(121,415)}'
                + mic.format(x=118, y=400, r=-10) +
                f'<path d="M250 330 Q290 330 262 278" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(252,262)}')
    else:                  # cheer: both arms up, mic raised
        arms = (f'<path d="M150 330 Q100 290 92 220" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(90,212)}'
                + mic.format(x=92, y=200, r=-25) +
                f'<path d="M250 330 Q300 290 310 220" stroke="{jacket}" stroke-width="34" fill="none" stroke-linecap="round"/>{hand(312,212)}')
    open_mouth = pose in ('mic', 'cheer', 'point')
    mouth = ('<path d="M182 236 Q200 256 218 236 Q200 246 182 236Z" fill="#C2185B"/>' if open_mouth
             else '<path d="M190 242 Q200 238 210 242" stroke="#B5485F" stroke-width="5" fill="none" stroke-linecap="round"/>')
    eye = lambda x: (f'<ellipse cx="{x}" cy="200" rx="21" ry="27" fill="#5D3A1A"/><ellipse cx="{x}" cy="206" rx="11" ry="15" fill="#2B1B12"/>'
                     f'<circle cx="{x-7}" cy="190" r="8" fill="#fff"/><circle cx="{x+8}" cy="212" r="4" fill="#fff"/>'
                     f'<path d="M{x-22} 186 Q{x} 168 {x+22} 184 l7 -6" stroke="#2B1B12" stroke-width="5" fill="none" stroke-linecap="round"/>')
    return svg(f'''<defs><linearGradient id="hj" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{hij}"/><stop offset="1" stop-color="{hij2}"/></linearGradient></defs>
<ellipse cx="200" cy="625" rx="120" ry="14" fill="#000" opacity=".2"/>
<rect x="160" y="540" width="32" height="70" rx="14" fill="#2E3B55"/><rect x="208" y="540" width="32" height="70" rx="14" fill="#2E3B55"/>
<ellipse cx="172" cy="612" rx="30" ry="15" fill="#E91E63"/><ellipse cx="228" cy="612" rx="30" ry="15" fill="#E91E63"/>
<path d="M140 400 L118 570 Q200 590 282 570 L260 400Z" fill="#311B92"/>
<path d="M150 300 Q200 285 250 300 L262 420 Q200 435 138 420Z" fill="{jacket}"/>
<path d="M178 300 L200 360 L222 300Z" fill="{shirt}"/>
<rect x="150" y="345" width="40" height="22" rx="5" fill="#FFD54F"/><text x="170" y="361" font-size="13" text-anchor="middle" font-family="Tahoma" font-weight="700" fill="#4A148C">ON AIR</text>
{arms}
<path d="M200 70 C110 70 92 160 98 230 C102 290 140 318 200 320 C260 318 298 290 302 230 C308 160 290 70 200 70Z" fill="url(#hj)"/>
<path d="M120 270 Q200 340 280 270 L290 315 Q200 360 110 315Z" fill="{hij2}"/>
<ellipse cx="200" cy="205" rx="74" ry="80" fill="{skin}"/>
<path d="M126 170 Q200 100 274 170 Q262 128 200 118 Q138 128 126 170Z" fill="url(#hj)"/>
<path d="M110 200 Q100 120 200 96 Q300 120 290 200" stroke="#37474F" stroke-width="9" fill="none"/>
<rect x="88" y="190" width="28" height="44" rx="12" fill="#37474F"/><path d="M104 232 Q120 262 160 250" stroke="#37474F" stroke-width="5" fill="none"/><circle cx="162" cy="250" r="7" fill="#37474F"/>
{eye(168)}{eye(232)}
<ellipse cx="146" cy="236" rx="15" ry="9" fill="#FF8A9A" opacity=".55"/><ellipse cx="254" cy="236" rx="15" ry="9" fill="#FF8A9A" opacity=".55"/>
{mouth}
<path d="M262 110 l6 -14 l6 14 l14 6 l-14 6 l-6 14 l-6 -14 l-14 -6Z" fill="#FFF59D"/>''', 400, 640)


# ---------------------------------------------------------------- 3D landform models on a turntable
BASE = ('<ellipse cx="300" cy="360" rx="280" ry="58" fill="#000" opacity=".25"/>'
        '<ellipse cx="300" cy="340" rx="270" ry="60" fill="#8D6E63"/><rect x="30" y="300" width="540" height="40" fill="#8D6E63"/>'
        '<ellipse cx="300" cy="300" rx="270" ry="60" fill="#A1887F"/>')
G = ('<linearGradient id="gl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9CCC65"/><stop offset="1" stop-color="#558B2F"/></linearGradient>'
     '<linearGradient id="rk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A1887F"/><stop offset=".55" stop-color="#8D6E63"/><stop offset="1" stop-color="#5D4037"/></linearGradient>'
     '<linearGradient id="wt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#81D4FA"/><stop offset="1" stop-color="#0288D1"/></linearGradient>')
TOP = '<ellipse cx="300" cy="300" rx="262" ry="54" fill="#8BC34A"/>'


def trees(pts, s=1):
    return ''.join(f'<g transform="translate({x} {y}) scale({s})"><rect x="-3" y="-4" width="6" height="14" fill="#5D4037"/><circle cx="0" cy="-12" r="12" fill="#2E7D32"/><circle cx="-4" cy="-15" r="5" fill="#66BB6A"/></g>' for x, y in pts)


def m_mountain():
    b = BASE + TOP
    b += '<path d="M100 305 L300 40 L500 305Z" fill="url(#rk)"/>'
    b += '<path d="M300 40 L500 305 L380 305Z" fill="#000" opacity=".18"/>'
    b += '<path d="M248 110 L300 40 L352 110 L330 98 L310 120 L290 96 L270 116Z" fill="#fff"/>'
    b += '<path d="M150 260 q30 -20 60 0 M380 230 q20 -14 40 0" stroke="#6D4C41" stroke-width="5" fill="none"/>'
    b += trees([(130, 300), (470, 300), (160, 285), (440, 288)], 1)
    return svg(b, 600, 400, G)


def m_hill():
    b = BASE + TOP
    b += '<path d="M90 305 Q300 120 510 305Z" fill="url(#gl)"/>'
    b += '<path d="M300 158 Q420 200 510 305 L380 305Z" fill="#000" opacity=".12"/>'
    b += trees([(220, 230), (270, 205), (330, 210), (380, 240), (180, 270), (430, 275)], 1.1)
    return svg(b, 600, 400, G)


def m_plain():
    b = BASE + '<ellipse cx="300" cy="300" rx="262" ry="54" fill="#AED581"/>'
    b += '<ellipse cx="300" cy="296" rx="220" ry="40" fill="#C5E1A5"/>'
    for _ in range(40):
        x = R.randint(80, 520); y = R.randint(260, 335)
        if ((x - 300) / 262) ** 2 + ((y - 300) / 54) ** 2 < .85:
            b += f'<path d="M{x} {y} l3 -9 l3 9" stroke="#689F38" stroke-width="2.5" fill="none"/>'
    b += trees([(150, 300), (450, 296), (380, 318)], .9)
    b += '<path d="M240 300 l10 -16 l6 10 l12 -4 l-4 12 l8 2 l-30 0Z" fill="#8D6E63"/><circle cx="252" cy="288" r="4" fill="#5D4037"/>'
    return svg(b, 600, 400, G)


def m_valley():
    b = BASE + TOP
    b += '<path d="M40 300 L170 90 L285 300Z" fill="url(#rk)"/><path d="M315 300 L430 90 L560 300Z" fill="url(#rk)"/>'
    b += '<path d="M170 90 L285 300 L230 300Z" fill="#000" opacity=".18"/><path d="M430 90 L560 300 L500 300Z" fill="#000" opacity=".18"/>'
    b += '<path d="M140 140 L170 90 L200 140Z M400 140 L430 90 L460 140Z" fill="#fff"/>'
    b += '<path d="M258 300 Q300 285 342 300 L360 352 Q300 362 240 352Z" fill="url(#wt)"/>'
    b += '<path d="M275 312 q25 -6 50 0 M265 332 q35 -6 70 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>'
    b += trees([(250, 292), (350, 292), (225, 310), (375, 310)], .9)
    return svg(b, 600, 400, G)


items = {'bg_studio': studio(), 'm_mountain': m_mountain(), 'm_hill': m_hill(), 'm_plain': m_plain(), 'm_valley': m_valley()}
for p in ('mic', 'point', 'think', 'cheer'):
    items[f'host_{p}'] = presenter(p)
for n, s in items.items():
    open(f'{OUT}/{n}.svg', 'w').write(s)
print(len(items))
