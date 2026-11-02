#!/usr/bin/env python3
"""Download real, free-to-use videos and photos for every page (Pexels - free for commercial use, no attribution required).

1. Get a free API key (1 minute):  https://www.pexels.com/api/
2. Run:   python3 fetch_media.py YOUR_KEY            (1080p videos - fast and smooth, recommended)
          python3 fetch_media.py YOUR_KEY --4k       (4K videos where available - large files)
          python3 fetch_media.py YOUR_KEY --only stunts   (one page only)
Files are saved over the placeholders in assets/media/<page>/ using the same names, and credits go to assets/media/CREDITS.md.
Search words for each page live in content.json -> "q" (video + 3 photos). Edit them and run again to get different footage.
Needs only Python 3 (no installs). ffmpeg is NOT required."""
import json, os, sys, urllib.request, urllib.parse
D = os.path.dirname(os.path.abspath(__file__))
args = [a for a in sys.argv[1:] if not a.startswith('--')]
KEY = args[0] if args else os.environ.get('PEXELS_KEY')
FOUR_K = '--4k' in sys.argv
ONLY = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
if not KEY: sys.exit(__doc__)
UA = {'User-Agent': 'Mozilla/5.0 (frame-atlas media fetch)'}
def api(url):
    req = urllib.request.Request(url, headers=dict(UA, Authorization=KEY))
    return json.load(urllib.request.urlopen(req, timeout=30))
def save(url, path):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=120) as r, open(path + '.part', 'wb') as f:
        while True:
            b = r.read(1 << 20)
            if not b: break
            f.write(b)
    os.replace(path + '.part', path)
def pick_video(vs):
    best = None
    for v in vs:
        if v.get('width', 0) < v.get('height', 1): continue            # landscape only
        files = [f for f in v['video_files'] if f.get('file_type') == 'video/mp4' and f.get('width')]
        want = 3840 if FOUR_K else 1920
        files = [f for f in files if f['width'] <= want] or files
        if not files: continue
        f = max(files, key=lambda x: x['width'])
        if v.get('duration', 0) < 5: continue
        if not best or f['width'] > best[1]['width']: best = (v, f)
        if f['width'] >= want: break
    return best
C = json.load(open(os.path.join(D, 'content.json'), encoding='utf-8'))
pages = [('home', C['home'])] + [(p['slug'], p) for p in C['pages']]
credits = ['# Media credits (Pexels - https://www.pexels.com/license/)\n']
for slug, d in pages:
    if ONLY and slug != ONLY: continue
    folder = os.path.join(D, 'assets/media', slug); os.makedirs(folder, exist_ok=True)
    try:
        r = api('https://api.pexels.com/videos/search?' + urllib.parse.urlencode({'query': d['q']['video'], 'per_page': 15, 'orientation': 'landscape'}))
        pv = pick_video(r.get('videos', []))
        if pv:
            v, f = pv; print(slug, 'video', f['width'], 'px  ', v['url']); save(f['link'], os.path.join(folder, 'reel.mp4'))
            save(v['image'], os.path.join(folder, 'reel-poster.jpg'))
            credits.append('- %s / reel.mp4: "%s" video by %s - %s' % (slug, d['q']['video'], v['user']['name'], v['url']))
        for i, q in enumerate(d['q']['photos'], 1):
            r = api('https://api.pexels.com/v1/search?' + urllib.parse.urlencode({'query': q, 'per_page': 6, 'orientation': 'landscape', 'size': 'large'}))
            ph = [p for p in r.get('photos', []) if p['width'] >= 3000] or r.get('photos', [])
            if not ph: print(slug, 'no photo for', q); continue
            p = ph[0]; print(slug, 'still-%d' % i, p['photographer'])
            save(p['src']['original'] + '?auto=compress&cs=tinysrgb&fit=crop&w=3840&h=2160', os.path.join(folder, 'still-%d.jpg' % i))
            credits.append('- %s / still-%d.jpg: "%s" photo by %s - %s' % (slug, i, q, p['photographer'], p['url']))
    except Exception as e:
        print('!!', slug, e)
if not ONLY: open(os.path.join(D, 'assets/media/CREDITS.md'), 'w', encoding='utf-8').write('\n'.join(credits) + '\n')
print('Done. Refresh the site (hard refresh: Ctrl+Shift+R) to see the new media.')
