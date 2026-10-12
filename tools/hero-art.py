"""Generate the hero technical illustration (inline SVG) for index.html.

Run from the repository root. Colors come from CSS classes in styles.css (.hero-art-svg ...),
so the drawing follows the light/dark theme.
"""
import math

W, H = 1600, 800
out = []


def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def add(s):
    out.append(s)


def pt(c, r, a):
    """Point at radius r, angle a (degrees, counter-clockwise, y up) around c."""
    return (c[0] + r * math.cos(math.radians(a)), c[1] - r * math.sin(math.radians(a)))


def gear_path(c, teeth, r, phase):
    m = 2 * r / teeth
    ra, rf = r + m, r - 1.25 * m
    p = 360 / teeth
    pts = []
    for k in range(teeth):
        a = phase + k * p
        for rr, da in ((rf, -0.30), (ra, -0.13), (ra, 0.13), (rf, 0.30)):
            pts.append(pt(c, rr, a + da * p))
    return 'M' + ' L'.join('%s %s' % (f(x), f(y)) for x, y in pts) + ' Z'


def link_path(c1, r1, c2, r2):
    dx, dy = c2[0] - c1[0], c2[1] - c1[1]
    d = math.hypot(dx, dy)
    ux, uy = dx / d, dy / d
    k = (r1 - r2) / d
    h = math.sqrt(1 - k * k)
    pts = []
    for s in (1, -1):
        nx = ux * k - s * uy * h
        ny = uy * k + s * ux * h
        pts.append(((c1[0] + r1 * nx, c1[1] + r1 * ny), (c2[0] + r2 * nx, c2[1] + r2 * ny)))
    (a1, a2), (b1, b2) = pts
    return ('M%s %s L%s %s A%s %s 0 0 0 %s %s L%s %s A%s %s 0 1 0 %s %s Z' % (
        f(a1[0]), f(a1[1]), f(a2[0]), f(a2[1]), f(r2), f(r2), f(b2[0]), f(b2[1]),
        f(b1[0]), f(b1[1]), f(r1), f(r1), f(a1[0]), f(a1[1])))


def circle(c, r, cls):
    add('<circle class="%s" cx="%s" cy="%s" r="%s"/>' % (cls, f(c[0]), f(c[1]), f(r)))


def line(x1, y1, x2, y2, cls):
    add('<line class="%s" x1="%s" y1="%s" x2="%s" y2="%s"/>' % (cls, f(x1), f(y1), f(x2), f(y2)))


def rect(x, y, w, h, cls, rx=0):
    add('<rect class="%s" x="%s" y="%s" width="%s" height="%s"%s/>' % (
        cls, f(x), f(y), f(w), f(h), (' rx="%s"' % f(rx)) if rx else ''))


def text(x, y, s, cls='t', anchor='start', extra=''):
    add('<text class="%s" x="%s" y="%s" text-anchor="%s"%s>%s</text>' % (cls, f(x), f(y), anchor, extra, s))


def path(d, cls, extra=''):
    add('<path class="%s" d="%s"%s/>' % (cls, d, extra))


def centerlines(c, r):
    line(c[0] - r, c[1], c[0] + r, c[1], 'cl')
    line(c[0], c[1] - r, c[0], c[1] + r, 'cl')


def bolt_circle(c, r, n, hole, start=90):
    for k in range(n):
        circle(pt(c, r, start + k * 360 / n), hole, 'hole')


# ---------------------------------------------------------------- sheet
add('<defs>')
add('<pattern id="ha-dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" class="dot"/></pattern>')
add('<pattern id="ha-hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" class="hatch"/></pattern>')
add('<marker id="ha-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 1.5 L10 5 L0 8.5 Z" class="arrowhead"/></marker>')
add('</defs>')

rect(0, 0, W, H, 'sheet')
rect(36, 36, W - 72, H - 72, 'grid')
rect(16, 16, W - 32, H - 32, 'frame-outer')
rect(36, 36, W - 72, H - 72, 'frame')
# zone markers
for i in range(8):
    x0 = 36 + i * (W - 72) / 8
    if i:
        line(x0, 16, x0, 36, 'thin')
        line(x0, H - 36, x0, H - 16, 'thin')
    xc = x0 + (W - 72) / 16
    text(xc, 30.5, str(i + 1), 'tz', 'middle')
    text(xc, H - 21.5, str(i + 1), 'tz', 'middle')
for i, ch in enumerate('ABCD'):
    y0 = 36 + i * (H - 72) / 4
    if i:
        line(16, y0, 36, y0, 'thin')
        line(W - 36, y0, W - 16, y0, 'thin')
    yc = y0 + (H - 72) / 8 + 4
    text(26, yc, ch, 'tz', 'middle')
    text(W - 26, yc, ch, 'tz', 'middle')

# title block (top right)
tx, ty, tw = 1184, 36, 380
rect(tx, ty, tw, 92, 'tb')
line(tx, ty + 52, tx + tw, ty + 52, 'thin')
line(tx + 127, ty + 52, tx + 127, ty + 92, 'thin')
line(tx + 253, ty + 52, tx + 253, ty + 92, 'thin')
rect(tx + 18, ty + 20, 12, 12, 'accent-fill')
text(tx + 42, ty + 32, 'LW TECHNOLOGIES', 't-strong')
for i, (k, v) in enumerate((('SHEET', '01 / 01'), ('SCALE', '1:5'), ('REV', 'A'))):
    text(tx + 14 + i * 126.5, ty + 67, k, 'tz')
    text(tx + 14 + i * 126.5, ty + 84, v, 't')

# ---------------------------------------------------------------- electronics (PCB)
add('<g class="pcb">')
rect(110, 150, 470, 500, 'board', 14)
for c in ((140, 180), (550, 180), (140, 620), (550, 620)):
    circle(c, 15, 'pad-ring')
    circle(c, 8, 'hole')

# traces (drawn before parts so parts sit on top)
traces = []


def trace(d, cls='trace'):
    path(d, cls)
    traces.append(d)


# MCU right pins -> drivers
trace('M352 348 H370 V290 L382 278 H421')
trace('M352 356 H378 V298 L390 286 H421')
trace('M352 388 H421')
trace('M352 396 H421')
trace('M352 444 H378 V486 L390 498 H421')
trace('M352 452 H370 V494 L382 506 H421')
# drivers -> connector
trace('M489 294 H505 V356 L517 368 H565', 'trace power')
trace('M489 396 H565', 'trace power')
trace('M489 506 H505 V436 L517 424 H565', 'trace power')
# MCU left / bottom fan-out
path('M198 372 H170 V330 L156 316 V250', 'trace')
path('M198 380 H162 V338 L140 316 V250', 'trace')
path('M198 420 H170 V470 L184 484 H210', 'trace')
path('M259 477 V500', 'trace')
path('M291 477 V500', 'trace')
path('M180 578 H128', 'trace power')
path('M300 578 H360 V540 L380 520 H421', 'trace power')
for c in ((156, 250), (140, 250), (210, 484), (128, 578), (421, 300), (421, 520), (440, 600), (470, 600), (500, 600)):
    circle(c, 4.5, 'via')

# MCU (QFP)
rect(210, 335, 130, 130, 'chip', 3)
for k in range(14):
    o = 348 + k * 8
    rect(340, o - 1.5, 12, 3, 'pin')
    rect(198, o - 1.5, 12, 3, 'pin')
    rect((223 + k * 8) - 1.5, 323, 3, 12, 'pin')
    rect((223 + k * 8) - 1.5, 465, 3, 12, 'pin')
circle((226, 351), 4, 'mark')
text(275, 405, 'U1', 't-silk', 'middle')
text(210, 314, 'MCU', 'tz')

# decoupling capacitors above MCU
for k in range(4):
    x = 236 + k * 26
    rect(x - 7, 290, 6, 10, 'smd-pad')
    rect(x + 1, 290, 6, 10, 'smd-pad')

# crystal
rect(255, 500, 40, 18, 'part', 4)
text(306, 513, 'Y1', 'tz')

# gate drivers
for i, yc in enumerate((290, 400, 510)):
    rect(427, yc - 20, 56, 40, 'chip', 2)
    for j in range(4):
        y = yc - 12 + j * 8
        rect(421, y - 1.5, 6, 3, 'pin')
        rect(483, y - 1.5, 6, 3, 'pin')
    circle((434, yc - 13), 2.5, 'mark')
    text(455, yc + 4.5, 'U%d' % (i + 2), 't-silk-sm', 'middle')

# connector J1
rect(545, 344, 40, 104, 'part', 3)
for y, ph in ((368, 'U'), (396, 'V'), (424, 'W')):
    circle((565, y), 8, 'pad-ring')
    circle((565, y), 3.5, 'hole')
    text(531, y + 4.5, ph, 'tz', 'middle')
text(565, 336, 'J1', 'tz', 'middle')

# power stage
rect(150, 552, 52, 52, 'part', 6)
circle((176, 578), 16, 'thin-fill')
text(176, 625, 'L1', 'tz', 'middle')
circle((262, 578), 24, 'part')
path('M246 562 A24 24 0 0 1 278 562', 'thin')
text(262, 625, 'C1', 'tz', 'middle')
rect(322, 556, 40, 30, 'chip', 2)
rect(328, 586, 6, 10, 'pin')
rect(350, 586, 6, 10, 'pin')
for k in range(3):
    rect(436 + k * 30 - 6, 586, 12, 28, 'smd-pad')
text(342, 625, 'U5', 'tz', 'middle')
add('</g>')

# cable J1 -> motor (three phases)
cables = []
for y0, y1 in ((368, 497), (396, 515), (424, 533)):
    d = 'M585 %s C720 %s 745 %s 863 %s' % (y0, y0, y1, y1)
    path(d, 'cable')
    cables.append(d)

# signal pulses
add('<g class="pulses">')
for i, d in enumerate(traces[:6]):
    path(d, 'pulse', ' pathLength="100" style="animation-delay:%ss"' % f(-i * 0.45))
for i, d in enumerate(traces[6:] + cables):
    path(d, 'pulse pulse-power', ' pathLength="100" style="animation-delay:%ss"' % f(-i * 0.6))
add('</g>')

# ---------------------------------------------------------------- mechanics & robot
S = (1000, 540)            # shoulder (big gear)
GEAR_R, GEAR_Z = 64, 24
PIN_R, PIN_Z = 32, 12
phi = 165                  # direction from shoulder to pinion
P = pt(S, GEAR_R + PIN_R, phi)
E = (1180, 330)            # elbow
Wr = (1340, 390)           # wrist

# work surface
line(860, 660, 1564, 660, 'ink')
add('<rect x="860" y="660" width="704" height="22" fill="url(#ha-hatch)"/>')

# base
path('M945 560 H1055 L1075 640 H925 Z', 'part')
rect(900, 640, 200, 20, 'part')
for x in (918, 1082):
    rect(x - 5, 644, 10, 12, 'thin')
# workpiece and target
rect(1318, 620, 44, 40, 'part')
line(1318, 620, 1362, 660, 'thin')
line(1340, 486, 1340, 606, 'accent-dash')
circle((1340, 606), 9, 'accent')
line(1326, 606, 1354, 606, 'accent')

# motor + pinion
rect(P[0] - 42, P[1] - 42, 84, 84, 'part', 6)
bolt_circle(P, 46, 4, 4, 45)
add('<g class="ha-pinion" style="transform-origin:%spx %spx">' % (f(P[0]), f(P[1])))
path(gear_path(P, PIN_Z, PIN_R, phi + 180), 'gear')
circle(P, 10, 'part')
circle(P, 3, 'ink-fill')
add('</g>')
centerlines(P, 54)

# arm
add('<g class="ha-upper" style="transform-origin:%spx %spx">' % (f(S[0]), f(S[1])))
path(gear_path(S, GEAR_Z, GEAR_R, phi + 180 / GEAR_Z), 'gear')
path(link_path(S, 40, E, 30), 'link')
# lightening slot
ux, uy = (E[0] - S[0]), (E[1] - S[1])
L = math.hypot(ux, uy)
ux, uy = ux / L, uy / L
a = (S[0] + ux * 92, S[1] + uy * 92)
b = (S[0] + ux * 196, S[1] + uy * 196)
path(link_path(a, 12, b, 9), 'thin')
circle(S, 30, 'part')
bolt_circle(S, 21, 6, 3)
circle(S, 9, 'part')
add('<g class="ha-fore" style="transform-origin:%spx %spx">' % (f(E[0]), f(E[1])))
path(link_path(E, 26, Wr, 18), 'link')
circle(E, 22, 'part')
bolt_circle(E, 15, 4, 2.5, 45)
circle(E, 6, 'part')
centerlines(E, 40)
# wrist + gripper
circle(Wr, 16, 'part')
circle(Wr, 5, 'ink-fill')
rect(Wr[0] - 26, Wr[1] + 18, 52, 14, 'part', 2)
path('M%s %s v40 h8 v-10 h-2 v-30 Z' % (f(Wr[0] - 22), f(Wr[1] + 32)), 'part')
path('M%s %s v40 h-8 v-10 h2 v-30 Z' % (f(Wr[0] + 22), f(Wr[1] + 32)), 'part')
text(Wr[0] + 26, Wr[1] - 22, 'J3', 'tz')
add('</g>')
text(E[0] - 24, E[1] - 44, 'J2', 'tz')
add('</g>')
centerlines(S, 84)
text(S[0] - 10, S[1] - 92, 'J1', 'tz', 'end')

# ---------------------------------------------------------------- annotations
# base width
line(900, 664, 900, 718, 'thin')
line(1100, 664, 1100, 718, 'thin')
add('<line class="dim" x1="904" y1="710" x2="1096" y2="710" marker-start="url(#ha-arrow)" marker-end="url(#ha-arrow)"/>')
text(1000, 702, '200', 't', 'middle')
# shoulder height
line(S[0] + 88, S[1], 1196, S[1], 'thin')
add('<line class="dim" x1="1188" y1="544" x2="1188" y2="656" marker-start="url(#ha-arrow)" marker-end="url(#ha-arrow)"/>')
text(1180, 604, '120', 't', 'middle', ' transform="rotate(-90 1180 604)"')
# gear callouts
g1 = pt(S, GEAR_R, -48)
path('M%s %s L1100 612 H1140' % (f(g1[0]), f(g1[1])), 'leader')
circle(g1, 2.5, 'ink-fill')
text(1100, 604, 'Z24', 't')
g2 = pt(P, PIN_R, 120)
path('M%s %s L862 430 H812' % (f(g2[0]), f(g2[1])), 'leader')
circle(g2, 2.5, 'ink-fill')
text(862, 422, 'Z12', 't', 'end')
# PCB callout
path('M580 200 L640 170 H720', 'leader')
circle((580, 200), 2.5, 'ink-fill')
text(646, 162, 'PCB', 't')

svg = ('<svg class="hero-art-svg" viewBox="0 0 %d %d" preserveAspectRatio="xMidYMid slice" '
       'xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="hero-art-title">'
       '<title id="hero-art-title" data-i18n="heroArtAlt">Technical drawing: a control board drives a motor and gear train that move a robotic arm</title>'
       % (W, H)) + ''.join(out) + '</svg>'

if __name__ == '__main__':
    import re
    import sys
    # Usage: python3 tools/hero-art.py            -> replace the hero <svg> in index.html
    #        python3 tools/hero-art.py --stdout   -> print the SVG
    if '--stdout' in sys.argv:
        print(svg)
    else:
        html = open('index.html', encoding='utf-8', newline='').read()
        html, n = re.subn(r'<svg class="hero-art-svg".*?</svg>', lambda m: svg, html, flags=re.S)
        assert n == 1, 'hero <svg> not found in index.html'
        open('index.html', 'w', encoding='utf-8', newline='').write(html)
        print('index.html updated (%d bytes of SVG)' % len(svg))
