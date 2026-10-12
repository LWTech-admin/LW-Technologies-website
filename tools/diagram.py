"""Generate the services diagram (inline SVG) for index.html.

Two layouts of the same drawing are produced: a wide one (desktop) and a tall one (phones).
Run from the repository root:

    python3 tools/diagram.py            # rewrite both <svg class="diagram-svg ..."> in index.html
    python3 tools/diagram.py --stdout   # print them instead

Colors come from CSS classes in styles.css (.diagram-svg ...), so the drawing follows the light/dark theme.
The motion (SMIL) is started once by site.js when the diagram scrolls into view.
"""
import math
import re
import sys


def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


def pt(c, r, a):
    """Point at radius r and angle a (degrees, counter-clockwise, y up) around c."""
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
    """Outline of a tapered link between two circles (external tangents)."""
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


class Svg:
    def __init__(self, prefix):
        self.out = []
        self.p = prefix

    def add(self, s):
        self.out.append(s)

    def circle(self, c, r, cls):
        self.add('<circle class="%s" cx="%s" cy="%s" r="%s"/>' % (cls, f(c[0]), f(c[1]), f(r)))

    def line(self, x1, y1, x2, y2, cls):
        self.add('<line class="%s" x1="%s" y1="%s" x2="%s" y2="%s"/>' % (cls, f(x1), f(y1), f(x2), f(y2)))

    def rect(self, x, y, w, h, cls, rx=0):
        self.add('<rect class="%s" x="%s" y="%s" width="%s" height="%s"%s/>' % (
            cls, f(x), f(y), f(w), f(h), (' rx="%s"' % f(rx)) if rx else ''))

    def text(self, x, y, s, cls, anchor='start'):
        self.add('<text class="%s" x="%s" y="%s" text-anchor="%s">%s</text>' % (cls, f(x), f(y), anchor, s))

    def path(self, d, cls, extra=''):
        self.add('<path class="%s" d="%s"%s/>' % (cls, d, extra))

    def centerlines(self, c, r):
        self.line(c[0] - r, c[1], c[0] + r, c[1], 'cl')
        self.line(c[0], c[1] - r, c[0], c[1] + r, 'cl')

    def bolt_circle(self, c, r, n, hole, start=90):
        for k in range(n):
            self.circle(pt(c, r, start + k * 360 / n), hole, 'hole')

    def pulse(self, d, idx, power=False):
        """A signal dash that travels the path once (hidden at rest)."""
        delay = idx * 0.08
        begin = '%s-start.begin+%ss' % (self.p, f(delay)) if idx else 'indefinite'
        aid = ' id="%s-start"' % self.p if idx == 0 else ''
        self.add('<path class="pulse%s" d="%s" pathLength="100" stroke-dasharray="4 200" stroke-dashoffset="4">'
                 '<animate%s attributeName="stroke-dashoffset" from="4" to="-100" dur="1.1s" begin="%s" fill="freeze"/>'
                 '</path>' % (' pulse-power' if power else '', d, aid, begin))

    def rotate(self, c, peak, start):
        """One smooth out-and-back rotation around c, starting `start` seconds after the trigger."""
        self.add('<animateTransform attributeName="transform" type="rotate" '
                 'values="0 {x} {y};{a} {x} {y};0 {x} {y}" keyTimes="0;0.5;1" calcMode="spline" '
                 'keySplines="0.45 0 0.55 1;0.45 0 0.55 1" dur="3.6s" begin="{p}-start.begin+{s}s" fill="freeze"/>'
                 .format(x=f(c[0]), y=f(c[1]), a=f(peak), p=self.p, s=f(start)))

    def legend(self, x1, x2, y, num, key, label, anchor_up=False):
        """Bracket with a service number and name, e.g. '2.2  Electronics'."""
        t = -8 if anchor_up else 8
        self.line(x1, y, x2, y, 'legend-rule')
        self.line(x1, y, x1, y - t, 'legend-rule')
        self.line(x2, y, x2, y - t, 'legend-rule')
        ty = y - 14 if anchor_up else y + 26
        self.add('<text class="legend" x="%s" y="%s"><tspan class="legend-num">%s</tspan>'
                 '<tspan dx="12" data-i18n="%s">%s</tspan></text>' % (f(x1), f(ty), num, key, label))


# Fixed geometry, in the drawing's own coordinates (the wide layout uses them unshifted).
S = (1000, 540)            # shoulder, 24-tooth gear
GEAR_R, GEAR_Z = 64, 24
PIN_R, PIN_Z = 32, 12      # motor pinion: turns twice as far, opposite direction
PHI = 165                  # direction from shoulder to pinion
P = pt(S, GEAR_R + PIN_R, PHI)
E = (1180, 330)            # elbow
WR = (1340, 390)           # wrist
J1_PINS = (368, 396, 424)  # connector pins (y), x = 565


def draw_pcb(g):
    g.rect(110, 150, 470, 500, 'board', 14)
    for c in ((140, 180), (550, 180), (140, 620), (550, 620)):
        g.circle(c, 15, 'pad-ring')
        g.circle(c, 8, 'hole')

    signals = [
        'M352 348 H370 V290 L382 278 H421',
        'M352 356 H378 V298 L390 286 H421',
        'M352 388 H421',
        'M352 396 H421',
        'M352 444 H378 V486 L390 498 H421',
        'M352 452 H370 V494 L382 506 H421',
    ]
    power = [
        'M489 294 H505 V356 L517 368 H565',
        'M489 396 H565',
        'M489 506 H505 V436 L517 424 H565',
    ]
    for d in signals:
        g.path(d, 'trace')
    for d in power:
        g.path(d, 'trace power')
    for d in ('M198 372 H170 V330 L156 316 V250', 'M198 380 H162 V338 L140 316 V250',
              'M198 420 H170 V470 L184 484 H210', 'M259 477 V500', 'M291 477 V500'):
        g.path(d, 'trace')
    g.path('M180 578 H128', 'trace power')
    g.path('M300 578 H360 V540 L380 520 H421', 'trace power')
    for c in ((156, 250), (140, 250), (210, 484), (128, 578), (421, 520), (440, 600), (470, 600), (500, 600)):
        g.circle(c, 4.5, 'via')

    # microcontroller (QFP)
    g.rect(210, 335, 130, 130, 'chip', 3)
    for k in range(14):
        o = 348 + k * 8
        g.rect(340, o - 1.5, 12, 3, 'pin')
        g.rect(198, o - 1.5, 12, 3, 'pin')
        g.rect(223 + k * 8 - 1.5, 323, 3, 12, 'pin')
        g.rect(223 + k * 8 - 1.5, 465, 3, 12, 'pin')
    g.circle((226, 351), 4, 'mark')
    g.text(275, 405, 'U1', 't-silk', 'middle')
    for k in range(4):
        x = 236 + k * 26
        g.rect(x - 7, 290, 6, 10, 'smd-pad')
        g.rect(x + 1, 290, 6, 10, 'smd-pad')
    g.rect(255, 500, 40, 18, 'part', 4)

    # gate drivers
    for i, yc in enumerate((290, 400, 510)):
        g.rect(427, yc - 20, 56, 40, 'chip', 2)
        for j in range(4):
            y = yc - 12 + j * 8
            g.rect(421, y - 1.5, 6, 3, 'pin')
            g.rect(483, y - 1.5, 6, 3, 'pin')
        g.circle((434, yc - 13), 2.5, 'mark')
        g.text(455, yc + 4.5, 'U%d' % (i + 2), 't-silk-sm', 'middle')

    # connector
    g.rect(545, 344, 40, 104, 'part', 3)
    for y, phase in zip(J1_PINS, 'UVW'):
        g.circle((565, y), 8, 'pad-ring')
        g.circle((565, y), 3.5, 'hole')
        g.text(531, y + 4.5, phase, 'tz', 'middle')

    # power stage
    g.rect(150, 552, 52, 52, 'part', 6)
    g.circle((176, 578), 16, 'thin-fill')
    g.circle((262, 578), 24, 'part')
    g.path('M246 562 A24 24 0 0 1 278 562', 'thin')
    g.rect(322, 556, 40, 30, 'chip', 2)
    g.rect(328, 586, 6, 10, 'pin')
    g.rect(350, 586, 6, 10, 'pin')
    for k in range(3):
        g.rect(430 + k * 30, 586, 12, 28, 'smd-pad')

    for i, d in enumerate(signals):
        g.pulse(d, i)
    for i, d in enumerate(power):
        g.pulse(d, 6 + i, power=True)


def draw_mech(g, surface=(860, 1420)):
    g.line(surface[0], 660, surface[1], 660, 'ink')
    g.add('<rect x="%s" y="660" width="%s" height="22" fill="url(#%s-hatch)"/>' % (
        f(surface[0]), f(surface[1] - surface[0]), g.p))

    # base
    g.path('M945 560 H1055 L1075 640 H925 Z', 'part')
    g.rect(900, 640, 200, 20, 'part')
    # workpiece and target
    g.rect(1318, 620, 44, 40, 'part')
    g.line(1318, 620, 1362, 660, 'thin')
    g.line(1340, 486, 1340, 606, 'accent-dash')
    g.circle((1340, 606), 9, 'accent')
    g.line(1326, 606, 1354, 606, 'accent')

    # motor and pinion
    g.rect(P[0] - 42, P[1] - 42, 84, 84, 'part', 6)
    g.bolt_circle(P, 46, 4, 4, 45)
    g.add('<g>')
    g.rotate(P, 14, 0.9)
    g.path(gear_path(P, PIN_Z, PIN_R, PHI + 180), 'gear')
    g.circle(P, 10, 'part')
    g.circle(P, 3, 'ink-fill')
    g.add('</g>')
    g.centerlines(P, 54)

    # arm: upper link carries the 24-tooth gear, forearm is nested inside it
    g.add('<g>')
    g.rotate(S, -7, 0.9)
    g.path(gear_path(S, GEAR_Z, GEAR_R, PHI + 180 / GEAR_Z), 'gear')
    g.path(link_path(S, 40, E, 30), 'link')
    ux, uy = E[0] - S[0], E[1] - S[1]
    L = math.hypot(ux, uy)
    ux, uy = ux / L, uy / L
    g.path(link_path((S[0] + ux * 92, S[1] + uy * 92), 12, (S[0] + ux * 196, S[1] + uy * 196), 9), 'thin')
    g.circle(S, 30, 'part')
    g.bolt_circle(S, 21, 6, 3)
    g.circle(S, 9, 'part')
    g.add('<g>')
    g.rotate(E, 16, 0.9)
    g.path(link_path(E, 26, WR, 18), 'link')
    g.circle(E, 22, 'part')
    g.bolt_circle(E, 15, 4, 2.5, 45)
    g.circle(E, 6, 'part')
    g.centerlines(E, 40)
    g.circle(WR, 16, 'part')
    g.circle(WR, 5, 'ink-fill')
    g.rect(WR[0] - 26, WR[1] + 18, 52, 14, 'part', 2)
    g.path('M%s %s v40 h8 v-10 h-2 v-30 Z' % (f(WR[0] - 22), f(WR[1] + 32)), 'part')
    g.path('M%s %s v40 h-8 v-10 h2 v-30 Z' % (f(WR[0] + 22), f(WR[1] + 32)), 'part')
    g.add('</g>')
    g.add('</g>')
    g.centerlines(S, 84)


def defs(g):
    g.add('<defs><pattern id="%s-hatch" width="10" height="10" patternUnits="userSpaceOnUse" '
          'patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="10" class="hatch"/></pattern></defs>' % g.p)


LABELS = {
    'robotics': ('2.1', 'stat1Title', 'Robotics'),
    'electronics': ('2.2', 'stat2Title', 'Electronics'),
    'mechanical': ('2.3', 'stat3Title', 'Mechanical'),
}


def wide():
    g = Svg('dgw')
    defs(g)
    g.add('<g>')
    draw_pcb(g)
    g.add('</g>')
    for i, (y0, y1) in enumerate(zip(J1_PINS, (497, 515, 533))):
        d = 'M585 %s C720 %s 745 %s 863 %s' % (y0, y0, y1, y1)
        g.path(d, 'cable')
        g.pulse(d, 9 + i, power=True)
    draw_mech(g)
    g.legend(110, 580, 712, *LABELS['electronics'])
    g.legend(866, 1100, 712, *LABELS['mechanical'])
    g.legend(1150, 1420, 712, *LABELS['robotics'])
    return g, '80 120 1380 640'


def tall():
    g = Svg('dgt')
    defs(g)
    pcb_dx, pcb_dy = -60, -40
    mech_dx, mech_dy = -780, 440
    g.add('<g transform="translate(%d %d)">' % (pcb_dx, pcb_dy))
    draw_pcb(g)
    g.add('</g>')
    # cable: from the connector, down the right side, then left and down into the top of the motor
    flange_top = P[1] + mech_dy - 42
    for i, y0 in enumerate(J1_PINS):
        y0 += pcb_dy
        xl = 640 - 14 * i
        yl = 650 + 14 * (2 - i)
        xt = P[0] + mech_dx + 14 - 14 * i
        r = 22
        d = ('M525 %s H%s Q%s %s %s %s V%s Q%s %s %s %s H%s Q%s %s %s %s V%s' % (
            f(y0), f(xl - r), f(xl), f(y0), f(xl), f(y0 + r), f(yl - r), f(xl), f(yl), f(xl - r), f(yl),
            f(xt + r), f(xt), f(yl), f(xt), f(yl + r), f(flange_top)))
        g.path(d, 'cable')
        g.pulse(d, 9 + i, power=True)
    g.add('<g transform="translate(%d %d)">' % (mech_dx, mech_dy))
    draw_mech(g, surface=(860, 1420))
    g.add('</g>')
    g.legend(50, 520, 82, *LABELS['electronics'], anchor_up=True)
    g.legend(86, 320, 1156, *LABELS['mechanical'])
    g.legend(380, 640, 1156, *LABELS['robotics'])
    return g, '20 30 690 1180'


def render(builder, cls):
    g, vb = builder()
    return ('<svg class="diagram-svg %s" viewBox="%s" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" '
            'focusable="false">' % (cls, vb)) + ''.join(g.out) + '</svg>'


svgs = {'diagram-wide': render(wide, 'diagram-wide'), 'diagram-tall': render(tall, 'diagram-tall')}

if __name__ == '__main__':
    if '--stdout' in sys.argv:
        for s in svgs.values():
            print(s)
    else:
        html = open('index.html', encoding='utf-8', newline='').read()
        for cls, s in svgs.items():
            html, n = re.subn(r'<svg class="diagram-svg %s".*?</svg>' % cls, lambda m: s, html, flags=re.S)
            assert n == 1, '%s <svg> not found in index.html' % cls
        open('index.html', 'w', encoding='utf-8', newline='').write(html)
        print('index.html updated (%s bytes)' % ', '.join(str(len(s)) for s in svgs.values()))
