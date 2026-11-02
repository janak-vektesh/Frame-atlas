"""Frame Atlas builder. Edit content.json (text, themes, media titles), then run:  python3 build.py
Regenerates index.html and all chapter pages with their own theme, scene, effects and media."""
import json, os, colorsys
D = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.path.join(D, 'content.json'), encoding='utf-8'))
P, SITE = C['pages'], C['site']
RGBF = '<svg width="0" height="0" style="position:absolute"><filter id="rgb"><feColorMatrix in="SourceGraphic" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/><feOffset in="r" dx="0" id="ro" result="ro"/><feColorMatrix in="SourceGraphic" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="g"/><feColorMatrix in="SourceGraphic" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="b"/><feOffset in="b" dx="0" id="bo" result="bo"/><feBlend in="ro" in2="g" mode="screen" result="rg"/><feBlend in="rg" in2="bo" mode="screen"/></filter></svg>'

def hsl(h, s, l):
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360, l, s)
    return '#%02x%02x%02x' % (round(r * 255), round(g * 255), round(b * 255))

def ls(a, plain=False):
    return ''.join('<span class="ln%s">%s</span>' % (' s' if (k == 1 and not plain) else '', x) for k, x in enumerate(a))

def badge(d):
    b = d['badge'] + ' '
    n = max(1, round(38 / len(b)))
    return '<a class="badge" href="#manifesto" data-h><svg viewBox="0 0 120 120"><defs><path id="c" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0"/></defs><text font-size="11" font-family="Inter" letter-spacing="3" fill="#12162b"><textPath href="#c">%s</textPath></text></svg><i>↓</i></a>' % (b * n)

def shell(d, slug, body):
    h = d['hue']
    acc, accd = hsl(h, .82, .52), hsl(h, .7, .36)
    on = '#12162b' if 28 <= h % 360 <= 100 else '#ffffff'
    nav = ''.join('<a class="d" href="%s.html" data-h data-img="assets/media/%s/still-1.jpg">%s</a>' % (p['slug'], p['slug'], p['name']) for p in P)
    foot = ''.join('<a href="%s.html" data-h>%s</a>' % (p['slug'], p['name']) for p in P)
    pg = dict(page=slug, tx=d['tx'], rv=d['rv'], pv=d['pv'], fx=d['fx'], scene=d['scene'], pm=d['pm'], hud=d['hud'], acc=acc,
              tmap=dict([(p['slug'], p['tx']) for p in P] + [('index', C['home']['tx'])]),
              pw=dict([(p['slug'], [p['short'], p['pre']]) for p in P] + [('index', ['Atlas', C['home']['pre']])]))
    return f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{d['title']}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500&display=swap">
<link rel="stylesheet" href="assets/css/style.css">
<noscript><style>#pre{{display:none}}.ch,.ln>span{{transform:none!important}}</style></noscript>
<script>window.PG={json.dumps(pg)}</script>
</head><body data-page="{slug}" data-hs="{d['hs']}" data-rv="{d['rv']}" style="--acc:{acc};--accd:{accd};--on:{on};--r:{d['r']}">
<svg width="0" height="0" style="position:absolute"><filter id="warp"><feTurbulence id="tb" type="fractalNoise" baseFrequency=".012 .02" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="70"/></filter></svg>{RGBF}
<i id="sp"></i><div id="mprev"><img alt=""></div>
<div id="pre"><div class="pf"><b class="d" id="cnt">0</b><i id="bar"></i></div><span class="s">{d['pre']}</span></div>
<div id="cur"></div>
<header><a href="index.html" class="logo d" data-h>{SITE}</a><button class="mag" id="mbtn" data-h>Menu</button></header>
<nav id="menu">{nav}</nav>
<main>{body}</main>
<footer>
<div><h4>Chapters</h4>{foot}</div>
<div><h4>Start</h4><a href="index.html" data-h>Home</a><a href="direction.html" data-h>Begin the tour</a></div>
<div><h4>About</h4><p style="font-size:20px">{SITE} is an independent guide to the craft of filmmaking.</p></div>
<div class="big d" aria-hidden="true">{d['short']}</div>
</footer>
<canvas id="gl"></canvas>
<script src="assets/js/boot.js"></script>
</body></html>''', [hsl(h + o, .9, .965) for o in (0, 12, -12, 24, -24, 6)]

def parts(d, slug, T):
    t = lambda k: T[k % 6]
    S = {}
    S['hero'] = '<section id="hero" data-bg="%s"><h1 class="d" id="h1">%s</h1><div class="sub"><p>%s</p>%s</div></section>' % (t(0), ls(d['lines']), d['intro'], badge(d))
    S['mq'] = '<div class="mq" data-bg="%s"><div class="d" id="mq">%s</div></div>' % (t(0), (d['mq'].replace('✦', d['sep']) + ' ') * 3)
    S['mf'] = '<section id="manifesto" data-bg="%s"><p class="d" id="mf">%s</p></section>' % (t(1), d['mf'])
    S['scope'] = '<section id="scope" data-bg="%s"><div class="scope"><div class="sc-art" style="background:%s"></div></div><div class="scope-cap"><span>%s</span><span>%s</span></div></section>' % (t(5), d['art'], d['scope'], d['name'])
    S['stats'] = '<section id="stats" data-bg="%s">%s</section>' % (t(3), ''.join('<div><b class="d" data-n="%d">0</b><span>%s</span></div>' % (n, l) for n, l in d['stats']))
    S['story'] = '<section id="story" data-bg="%s"><div class="st-h"><h2 class="d">%s <span class="s">%s</span></h2></div><div class="st-b">%s</div></section>' % (t(2), d['sh'][0], d['sh'][1], ''.join('<p>%s</p>' % x for x in d['story']))
    S['caps'] = '<section id="caps" data-bg="%s"><h2 class="d">%s <span class="s">%s</span></h2>%s</section>' % (t(4), d['gh'][0], d['gh'][1], ''.join('<div class="row" data-h><h3 class="d">%s</h3><p>%s</p></div>' % (a, b) for a, b in d['gloss']))
    S['quote'] = '<section id="quote" data-bg="%s"><q id="qt">%s</q><cite>%s</cite></section>' % (t(4), ls(d['quote'], True), d['cite'])
    S['demo'] = '<section id="demo" data-bg="%s"><h2 class="d">%s <span class="s">%s</span></h2><div id="dm" data-demo="%s"></div></section>' % (t(3), d['dh'][0], d['dh'][1], d.get('demo', ''))
    base = 'assets/media/%s/' % ('home' if slug == 'index' else slug)
    items = [(base + 'reel-poster.jpg', base + 'reel.mp4', 'Reel')] + [(base + 'still-%d.jpg' % k, None, 'Still 0%d' % k) for k in (1, 2, 3)]
    figs = ''.join('<figure data-i="%d"><div class="mw"><img class="m" src="%s" alt="%s" title="%s" loading="lazy" decoding="async">%s</div><figcaption><b>%s</b><span>%s</span></figcaption></figure>' % (
        i, im, d['mt'][i], im if not vd else vd, ('<video class="v" data-src="%s" muted loop playsinline preload="none"></video>' % vd) if vd else '', d['mt'][i], lab) for i, (im, vd, lab) in enumerate(items))
    S['media'] = '<section id="media" data-bg="%s" data-fx="%s"><h2 class="d">%s <span class="s">%s</span></h2><div class="mf">%s</div></section>' % (t(2), d['fx'], d['mh'][0], d['mh'][1], figs)
    S['t'] = t
    return S

def endsec(t, lines, href, cta):
    return '<section id="end" data-bg="%s"><h2 class="d">%s</h2><a class="mag" href="%s" data-h><span class="ro"><span data-t="%s">%s</span></span></a></section>' % (t(5), ls(lines), href, cta, cta)

def home():
    d = C['home']; _, T = shell(d, 'index', '')
    S = parts(d, 'index', T); t = S['t']
    cards = ''.join('<a class="card" href="%s.html" data-h data-t="Open"><div class="art" style="background:%s"></div><div class="cap"><h3 class="d">%s</h3><span>%s</span></div></a>' % (p['slug'], p['art'], p['name'], p['card']) for p in P)
    work = '<section id="work" data-bg="%s"><div id="track"><div class="intro"><h2 class="d">Ten<br><span class="s">chapters</span></h2><p style="margin-top:3vh;color:var(--mut)">Scroll sideways. Open any chapter.</p></div>%s<div class="intro" style="width:min(420px,72vw)"><p class="s" style="font-size:clamp(36px,4vw,56px);line-height:1.05">More chapters<br>are in the edit.</p></div></div></section>' % (t(2), cards)
    body = S['hero'] + S['mq'] + S['mf'] + work + S['media'] + S['scope'] + S['stats'] + S['story'] + S['caps'] + S['quote'] + endsec(t, d['end'], 'direction.html', d['cta'])
    open(os.path.join(D, 'index.html'), 'w', encoding='utf-8').write(shell(d, 'index', body)[0])

def chapter(i):
    p = P[i]; _, T = shell(p, p['slug'], '')
    S = parts(p, p['slug'], T); t = S['t']
    notes = '<section id="method" data-bg="%s"><div><h2 class="d">%s <span class="s">%s</span></h2></div><div class="stg">%s</div></section>' % (t(2), p['nh'][0], p['nh'][1], ''.join('<div class="stp"><h3 class="d">%s</h3><p>%s</p></div>' % (a, b) for a, b in p['notes']))
    nxt = P[i + 1] if i + 1 < len(P) else None
    n = nxt['short'] if nxt else 'the start'
    e = endsec(t, [x.replace('{n}', n) for x in p['end']], (nxt['slug'] + '.html') if nxt else 'index.html', p['cta'].replace('{n}', nxt['name']) if nxt else 'Back to the start')
    body = S['hero'] + S['mq'] + S['mf'] + S['scope'] + notes + S['media'] + (S['demo'] if p.get('demo') else '') + S['story'] + S['stats'] + S['caps'] + S['quote'] + e
    open(os.path.join(D, p['slug'] + '.html'), 'w', encoding='utf-8').write(shell(p, p['slug'], body)[0])

home()
for i in range(len(P)): chapter(i)
print('Built index.html +', len(P), 'chapter pages')
