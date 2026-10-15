"""Generate the ducted-thruster drawing shown in the top-right corner of the hero (large screens only).

Run from the repository root (needs numpy for the flow solution):

    python3 tools/hero-art.py            # rewrite the <svg class="hero-art"> in index.html
    python3 tools/hero-art.py --stdout   # print it instead

Colors come from CSS classes in styles.css (.hero-art ...), so the drawing follows the light/dark theme.
Motion is SMIL (no JavaScript needed); site.js pauses it for visitors who prefer reduced motion.
"""
import math
import re
import sys


def f(v):
    return ('%.1f' % v).rstrip('0').rstrip('.')


class Svg:
    def __init__(self):
        self.out = []

    def add(self, s):
        self.out.append(s)

    def circle(self, c, r, cls):
        self.add('<circle class="%s" cx="%s" cy="%s" r="%s"/>' % (cls, f(c[0]), f(c[1]), f(r)))

    def line(self, x1, y1, x2, y2, cls):
        self.add('<line class="%s" x1="%s" y1="%s" x2="%s" y2="%s"/>' % (cls, f(x1), f(y1), f(x2), f(y2)))

    def rect(self, x, y, w, h, cls, rx=0):
        self.add('<rect class="%s" x="%s" y="%s" width="%s" height="%s"%s/>' % (
            cls, f(x), f(y), f(w), f(h), (' rx="%s"' % f(rx)) if rx else ''))

    def path(self, d, cls, extra=''):
        self.add('<path class="%s" d="%s"%s/>' % (cls, d, extra))

    def text(self, x, y, s, cls='lbl', anchor='middle'):
        self.add('<text class="%s" x="%s" y="%s" text-anchor="%s">%s</text>' % (cls, f(x), f(y), anchor, s))

    def centerlines(self, c, r):
        self.line(c[0] - r, c[1], c[0] + r, c[1], 'cl')
        self.line(c[0], c[1] - r, c[0], c[1] + r, 'cl')

    def spin(self, c, period, reverse=False, begin=0):
        """Continuous rotation around c (positive = clockwise on screen)."""
        end = -360 if reverse else 360
        self.add('<animateTransform attributeName="transform" type="rotate" from="0 %s %s" to="%d %s %s" '
                 'dur="%ss" begin="%ss" repeatCount="indefinite"/>' % (
                     f(c[0]), f(c[1]), end, f(c[0]), f(c[1]), f(period), f(begin)))




def simplify(pts, tol=0.25):
    """Ramer-Douglas-Peucker on an open polyline."""
    if len(pts) < 3:
        return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    L = math.hypot(x2 - x1, y2 - y1) or 1e-9
    best, idx = -1.0, 0
    for i in range(1, len(pts) - 1):
        x0, y0 = pts[i]
        d = abs((x2 - x1) * (y1 - y0) - (x1 - x0) * (y2 - y1)) / L
        if d > best:
            best, idx = d, i
    if best <= tol:
        return [pts[0], pts[-1]]
    return simplify(pts[:idx + 1], tol)[:-1] + simplify(pts[idx:], tol)


# ------------------------------------------------------------------ ROV thruster section (fluid + mech + elec)
#
# Side section of a ducted thruster, flow from left to right.
#  - Duct: accelerating (Kort, 19A-like) nozzle: blunt rounded inlet, inner surface converging into a
#    cylindrical throat around the propeller then flaring slightly, straight outer surface, sharp trailing edge.
#  - Flow: axisymmetric potential flow solved on a grid (see flow_field); the drawn lines are contours of the
#    stream function, labelled by their upstream radius. The duct carries the flow of a capture tube wider than
#    its throat (mass conservation with the speed-up in the duct), which makes it an accelerating duct.
#  - Propeller: 4 blades, chord c(r) and pitch angle beta(r) = atan(P / (2 pi r)), projected in side view
#    while rotating; blades behind the shaft (z > 0) are drawn behind the hub.

TH_AX = 180.0                     # axis height
TH_X0, TH_L = 250.0, 200.0        # duct leading edge and length
TH_THROAT = 76.0                  # duct inner radius at the propeller
TH_XP = TH_X0 + 0.40 * TH_L       # propeller plane
TH_HUB = 34.0
TH_TIP = 72.0
TH_PITCH = 150.0
TH_V_DUCT = 1.4                   # axial speed in the duct / free stream


def smoothstep(x, a, b):
    t = min(1.0, max(0.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)


def duct_inner(x):
    u = (x - TH_X0) / TH_L
    if u < 0.4:
        return TH_THROAT + 20 * ((0.4 - u) / 0.4) ** 2
    if u < 0.85:
        return TH_THROAT
    return TH_THROAT + 5 * ((u - 0.85) / 0.15) ** 2


TH_OUT_X1 = TH_X0 + 0.18 * TH_L   # where the straight outer surface starts (top of the nose)
TH_OUT_R1 = 122.0
TH_OUT_R2 = duct_inner(TH_X0 + TH_L) + 1.5


def duct_outer_line(x):
    return TH_OUT_R1 + (TH_OUT_R2 - TH_OUT_R1) * (x - TH_OUT_X1) / (TH_X0 + TH_L - TH_OUT_X1)


def duct_profile():
    """Closed outline (x, r) of the duct section: inner surface LE -> TE, outer line back, nose curve."""
    pts = [(TH_X0 + TH_L * i / 60, duct_inner(TH_X0 + TH_L * i / 60)) for i in range(61)]
    pts += [(x, duct_outer_line(x)) for x in [TH_X0 + TH_L - (TH_X0 + TH_L - TH_OUT_X1) * i / 20 for i in range(21)]]
    # nose: cubic Bezier from the outer line start back to the inner leading edge, tangent-continuous
    P3 = (TH_X0, duct_inner(TH_X0))
    slope_in = -2 * 20 / (0.4 * TH_L)                            # d(inner)/dx at the leading edge
    t_in = (-1.0, -slope_in)                                     # leaving the inner surface going forward/out
    n_in = math.hypot(*t_in)
    P0 = (TH_OUT_X1, TH_OUT_R1)
    t_out = (TH_X0 + TH_L - TH_OUT_X1, TH_OUT_R2 - TH_OUT_R1)  # outer line direction (towards TE)
    n_out = math.hypot(*t_out)
    h1, h2 = 0.13 * TH_L, 16.0
    P1 = (P0[0] - t_out[0] / n_out * h1, P0[1] - t_out[1] / n_out * h1)
    P2 = (P3[0] + t_in[0] / n_in * h2, P3[1] + t_in[1] / n_in * h2)
    for i in range(1, 25):
        t = i / 24
        x = (1 - t) ** 3 * P0[0] + 3 * (1 - t) ** 2 * t * P1[0] + 3 * (1 - t) * t ** 2 * P2[0] + t ** 3 * P3[0]
        y = (1 - t) ** 3 * P0[1] + 3 * (1 - t) ** 2 * t * P1[1] + 3 * (1 - t) * t ** 2 * P2[1] + t ** 3 * P3[1]
        pts.append((x, y))
    return pts


def hub_radius(x):
    nose0, nose1 = TH_XP - 40, TH_XP - 6
    if x < nose0:
        return 0.0
    if x < nose1:
        return TH_HUB * math.sqrt(max(0.0, 1 - ((nose1 - x) / (nose1 - nose0)) ** 2))
    tail0, tail1 = 470.0, 528.0
    if x < tail0:
        return TH_HUB
    if x < tail1:
        return TH_HUB * (1 - (x - tail0) / (tail1 - tail0)) ** 1.3
    return 0.0




TH_CAPTURE = math.sqrt(TH_V_DUCT * (TH_THROAT ** 2 - TH_HUB ** 2))   # upstream radius of the captured tube








TH_JET_SPEED = 1.3                # slipstream speed far downstream (momentum added by the propeller)
_FLOW = {}


def flow_field():
    """Axisymmetric potential flow (Stokes stream function psi) around hub and duct, solved on a grid.

    psi_xx + psi_rr - psi_r / r = 0, with psi = 0 on the axis and hub, psi = psi_duct on the duct
    (the flow captured through the duct: the capture tube of radius TH_CAPTURE upstream), uniform flow
    upstream and above, and a faster jet core at the outlet. Returns (x0, r0, h, psi grid)."""
    if _FLOW:
        return _FLOW['field']
    import numpy as np
    h = 2.0
    x0, x1, r1 = -240.0, 820.0, 380.0
    nx, nr = int((x1 - x0) / h) + 1, int(r1 / h) + 1
    X = x0 + h * np.arange(nx)[None, :] * np.ones((nr, 1))
    R = h * np.arange(nr)[:, None] * np.ones((1, nx))
    psi_duct = 0.5 * TH_CAPTURE ** 2
    r_jet = math.sqrt(2 * psi_duct / TH_JET_SPEED)

    # solid masks
    prof = duct_profile()
    duct = np.zeros((nr, nx), dtype=bool)
    n = len(prof)
    for i in range(n):
        (xa, ra), (xb, rb) = prof[i], prof[(i + 1) % n]
        if ra == rb:
            continue
        cond = ((ra > R) != (rb > R)) & (X < (xb - xa) * (R - ra) / (rb - ra) + xa)
        duct ^= cond
    hub = R <= np.vectorize(hub_radius)(X)

    # boundary values and initial guess
    free = 0.5 * R ** 2
    psi = free.copy()
    out_col = np.where(R[:, -1] < r_jet, 0.5 * TH_JET_SPEED * R[:, -1] ** 2,
                       psi_duct + 0.5 * (R[:, -1] ** 2 - r_jet ** 2))
    fixed = duct | hub
    fixed[0, :] = True
    fixed[-1, :] = True
    fixed[:, 0] = True
    fixed[:, -1] = True
    psi[duct] = psi_duct
    psi[hub] = 0.0
    psi[0, :] = 0.0
    psi[:, -1] = out_col

    rr = R[1:-1, 1:-1]
    a_n = 1 / h ** 2 - 1 / (2 * rr * h)
    a_s = 1 / h ** 2 + 1 / (2 * rr * h)
    a_p = 4 / h ** 2
    free_cells = ~fixed[1:-1, 1:-1]
    ii, jj = np.indices(rr.shape)
    colors = [free_cells & ((ii + jj) % 2 == c) for c in (0, 1)]
    omega = 1.9
    for it in range(20000):
        delta = 0.0
        for mask in colors:
            c = psi[1:-1, 1:-1]
            new = (a_n * psi[2:, 1:-1] + a_s * psi[:-2, 1:-1] + (psi[1:-1, 2:] + psi[1:-1, :-2]) / h ** 2) / a_p
            upd = c + omega * (new - c)
            d = np.abs(upd - c)[mask]
            delta = max(delta, float(d.max()) if d.size else 0.0)
            c[mask] = upd[mask]
        if delta < 1e-4:
            break
    _FLOW['field'] = (x0, 0.0, h, psi)
    return _FLOW['field']


def stream_radius(level, x):
    """Radius where psi = level in the column at x: the first crossing going up from the axis."""
    x0, _, h, psi = flow_field()
    j = (x - x0) / h
    j0 = int(math.floor(j))
    t = j - j0
    col = psi[:, j0] * (1 - t) + psi[:, j0 + 1] * t
    for i in range(1, len(col)):
        if col[i] >= level:
            a, b = col[i - 1], col[i]
            return h * (i - 1 + (level - a) / (b - a if b != a else 1))
    return h * (len(col) - 1)


def blade_outline(phi_deg, n=9):
    """Side-view outline (x, y_up) of one blade at rotation angle phi, and its mean depth z."""
    phi = math.radians(phi_deg)
    le, te, zs = [], [], []
    for i in range(n + 1):
        u = i / n
        r = TH_HUB + 1 + (TH_TIP - TH_HUB - 1) * u
        c = 50 * math.sin(math.pi * (0.16 + 0.84 * u)) + 2
        beta = math.atan(TH_PITCH / (2 * math.pi * r))
        for s, out in ((-c / 2, le), (c / 2, te)):
            # chord direction: aft (+x) and against the rotation, so the leading edge (s < 0) is forward and
            # ahead in the direction of rotation (phi increasing): the blades push water aft
            x = TH_XP + s * math.sin(beta)
            y = r * math.cos(phi) + s * math.cos(beta) * math.sin(phi)
            out.append((x, y))
        zs.append(r * math.sin(phi))
    return le + te[::-1], sum(zs) / len(zs)


def thruster_drawing(g, hatch_id):
    AX = TH_AX
    g.add('<defs><pattern id="%s" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">'
          '<line x1="0" y1="0" x2="0" y2="7" class="hatch"/></pattern></defs>' % hatch_id)
    xs = [x for x in range(-20, 781, 4)]

    # stream lines (behind everything); dot speed follows the line's mean axial speed
    # stream lines are contours of the solved stream function, labelled by their upstream radius
    lines = [(rho, 'in') for rho in (24, 50, 72)] + [(rho, 'out') for rho in (100, 140)]
    for idx, (rho, kind) in enumerate(lines):
        radius = lambda rho, x: stream_radius(0.5 * rho * rho, x)
        mean_v = 1.3 if kind == 'in' else 1.0
        for sign in (-1, 1):
            pts = simplify([(x, AX - sign * radius(rho, x)) for x in xs], 0.3)
            d = 'M' + ' L'.join('%s %s' % (f(x), f(y)) for x, y in pts)
            g.path(d, 'stream')
            cls = 'particle-accent' if (kind == 'in' and idx == 1 and sign == 1) else 'particle'
            phase = (idx * 3.7 + (sign + 1) * 2.9) % 10        # stagger the dots between lines
            g.add('<path class="%s" d="%s" pathLength="100" stroke-dasharray="1 9" stroke-dashoffset="%s">'
                  '<animate attributeName="stroke-dashoffset" from="%s" to="%s" dur="%ss" '
                  'repeatCount="indefinite"/></path>' % (cls, d, f(-phase), f(-phase), f(-phase - 10),
                                                         f(2.6 / mean_v)))

    # duct sections (cut, hatched)
    prof = duct_profile()
    for sign in (-1, 1):
        d = 'M' + ' L'.join('%s %s' % (f(x), f(AX - sign * r)) for x, r in prof) + ' Z'
        g.path(d, 'section', ' style="fill:url(#%s)"' % hatch_id)

    # propeller: blades behind the shaft first, hub, then blades in front
    frames, quarter_period = 12, 1.4
    blade_frames = []
    for b in range(4):
        shapes = [blade_outline(b * 90 + 90 * j / frames) for j in range(frames + 1)]
        blade_frames.append(shapes)

    def blade_layer(front):
        for shapes in blade_frames:
            ds = ['M' + ' L'.join('%s %s' % (f(x), f(AX - y)) for x, y in pts) + ' Z' for pts, _ in shapes]
            ops = [('1' if (z <= 0) == front else '0') for _, z in shapes]
            g.add('<path class="blade-shape" d="%s" opacity="%s">'
                  '<animate attributeName="d" values="%s" dur="%ss" repeatCount="indefinite"/>'
                  '<animate attributeName="opacity" values="%s" dur="%ss" calcMode="discrete" '
                  'repeatCount="indefinite"/></path>' % (
                      ds[0], ops[0], ';'.join(ds), f(quarter_period), ';'.join(ops), f(quarter_period)))

    blade_layer(front=False)

    # hub: nose, housing (cut), motor inside, tail cone
    # nose: a true half-ellipse (the same shape hub_radius gives the flow solver)
    nose_x1, nose_len = TH_XP - 6, 34
    g.path('M%s %s A%s %s 0 0 0 %s %s Z' % (f(nose_x1), f(AX - TH_HUB), f(nose_len), f(TH_HUB),
                                            f(nose_x1), f(AX + TH_HUB)), 'part')
    hx0, hx1 = TH_XP - 6, 470
    g.rect(hx0, AX - TH_HUB, hx1 - hx0, 2 * TH_HUB, 'part')
    for wy in (AX - TH_HUB, AX + TH_HUB - 6):
        g.add('<rect class="section" x="%s" y="%s" width="%s" height="6" style="fill:url(#%s)"/>' % (
            f(hx0), f(wy), f(hx1 - hx0), hatch_id))
    rev_period = 4 * quarter_period                     # one shaft revolution (the motor drives the propeller)
    for sy in (AX - 27, AX + 13):                       # stator (cut): laminations and winding end turns
        g.rect(368, sy, 72, 14, 'part thin-stroke')
        for x in range(372, 440, 6):
            g.line(x, sy, x, sy + 14, 'lam')
        for ex in (361, 447):
            g.circle((ex, sy + 7), 6, 'winding')
    # rotor seen whole (not cut): 6 magnets, N/S bands sweeping over the visible half as it turns
    rx0, rx1, rr = 370, 438, 12
    g.line(TH_XP - 2, AX, rx0, AX, 'shaft')
    g.line(rx1, AX, hx1 - 8, AX, 'shaft')
    g.rect(rx0, AX - rr, rx1 - rx0, 2 * rr, 'part thin-stroke')
    n_frames, pole_period = 24, rev_period / 3          # the pattern repeats every pole pair (120 degrees)
    for k in range(6):
        ys, hs = [], []
        for j in range(n_frames + 1):
            a = (k * 60 + 120 * j / n_frames) % 360
            b = a + 60
            lo_y, hi_y = None, None
            for w0, w1 in ((180, 360), (540, 720)):      # visible half: sin(phi) < 0
                p0, p1 = max(a, w0), min(b, w1)
                if p1 > p0:
                    y0 = AX - rr * math.cos(math.radians(p0))
                    y1 = AX - rr * math.cos(math.radians(p1))
                    lo, hi = min(y0, y1), max(y0, y1)
                    lo_y = lo if lo_y is None else min(lo_y, lo)
                    hi_y = hi if hi_y is None else max(hi_y, hi)
            ys.append(AX if lo_y is None else lo_y)
            hs.append(0 if lo_y is None else hi_y - lo_y)
        g.add('<rect class="%s" x="%s" y="%s" width="%s" height="%s">'
              '<animate attributeName="y" values="%s" dur="%ss" repeatCount="indefinite"/>'
              '<animate attributeName="height" values="%s" dur="%ss" repeatCount="indefinite"/></rect>' % (
                  'band-n' if k % 2 == 0 else 'band-s', f(rx0 + 2), f(ys[0]), f(rx1 - rx0 - 4), f(hs[0]),
                  ';'.join(f(v) for v in ys), f(pole_period), ';'.join(f(v) for v in hs), f(pole_period)))
    g.rect(rx0, AX - rr, rx1 - rx0, 2 * rr, 'outline')
    g.rect(452, AX - 22, 5, 44, 'board-ring')           # driver board in the tail
    for y in (AX - 16, AX - 2, AX + 10):
        g.rect(457, y, 7, 7, 'chip-body')
    tail = [(x, hub_radius(x)) for x in [470 + 58 * i / 48 for i in range(49)]]
    d = 'M' + ' L'.join('%s %s' % (f(x), f(AX - r)) for x, r in tail)
    d += ' L' + ' L'.join('%s %s' % (f(x), f(AX + r)) for x, r in reversed(tail)) + ' Z'
    g.path(d, 'part')

    blade_layer(front=True)

    # cable out of the tail, with an occasional pulse
    cable = 'M528 %s C590 %s 610 %s 720 %s' % (f(AX), f(AX), f(AX - 70), f(AX - 80))
    g.path(cable, 'cable-line')
    g.add('<path class="pulse-line" d="%s" pathLength="100" stroke-dasharray="5 300" stroke-dashoffset="-100">'
          '<animate attributeName="stroke-dashoffset" values="-100;5;5" keyTimes="0;0.35;1" dur="5s" begin="2s" '
          'repeatCount="indefinite"/></path>' % cable)


def corner_mask(mask_id, vb):
    """Radial fade: full strength at the top right, fading out towards the title (bottom left)."""
    x, y, w, h = (float(v) for v in vb.split())
    # eased fall-off (smoothstep-like), starting close to the top-right so the fade is long and continuous
    stops = ((0.08, 255), (0.25, 232), (0.42, 178), (0.58, 112), (0.74, 52), (0.88, 14), (1.0, 0))
    grad = ''.join('<stop offset="%s" stop-color="#%02x%02x%02x"/>' % (f(o), v, v, v) for o, v in stops)
    template = ('<defs><radialGradient id="%s-g" cx="0.88" cy="0.12" r="1.05">' + grad + '</radialGradient>'
                '<mask id="%s" maskUnits="userSpaceOnUse" x="%s" y="%s" width="%s" height="%s">'
                '<rect x="%s" y="%s" width="%s" height="%s" fill="url(#%s-g)"/></mask></defs>')
    return template % (mask_id, mask_id, f(x), f(y), f(w), f(h), f(x), f(y), f(w), f(h), mask_id)


def render():
    g = Svg()
    thruster_drawing(g, 'hero-art-hatch')
    vb = '196 24 470 300'
    body = corner_mask('hero-art-mask', vb) + '<g mask="url(#hero-art-mask)">%s</g>' % ''.join(g.out)
    return ('<svg class="hero-art" viewBox="%s" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" '
            'focusable="false">' % vb) + body + '</svg>'


if __name__ == '__main__':
    svg = render()
    if '--stdout' in sys.argv:
        print(svg)
    else:
        html = open('index.html', encoding='utf-8', newline='').read()
        html = re.sub(r'[ \t]*<svg class="hero-art[ "].*?</svg>\r?\n', '', html, flags=re.S)
        anchor = '<div class="container">\r\n'
        i = html.index('<section class="hero"')
        j = html.index(anchor, i) + len(anchor)
        html = html[:j] + '        %s\r\n' % svg + html[j:]
        open('index.html', 'w', encoding='utf-8', newline='').write(html)
        print('index.html updated (%d bytes)' % len(svg))
