"""Creates placeholder stills + short loop videos in assets/media/<page>/. Replace any file with your own (same name) - run once only if files are missing."""
import json, os, colorsys, subprocess
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
C = json.load(open(os.path.join(D, 'content.json'), encoding='utf-8'))
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
pages = [('home', C['home'])] + [(p['slug'], p) for p in C['pages']]
def col(h, s, l):
    r, g, b = colorsys.hls_to_rgb((h % 360) / 360, l, s); return np.array([r, g, b]) * 255
def canvas(h, seed, w=480, hh=270, t=0.0):
    rng = np.random.RandomState(seed); yy, xx = np.mgrid[0:hh, 0:w].astype(np.float32); xx /= w; yy /= hh
    img = np.zeros((hh, w, 3), np.float32) + col(h, .7, .9)
    for i in range(4):
        cx = rng.rand() + .12 * np.sin(t * 6.283 + i * 1.7); cy = rng.rand() + .12 * np.cos(t * 6.283 + i * 2.1); r = .18 + rng.rand() * .22
        a = np.exp(-(((xx - cx) ** 2) * 1.8 + (yy - cy) ** 2) / (r * r))[..., None]
        img = img * (1 - a * .8) + col(h + (i - 1.5) * 28, .8, .55 - i * .05) * a * .8
    img -= (yy[..., None] ** 2) * 40
    return np.clip(img, 0, 255).astype(np.uint8)
def label(im, lines, size):
    d = ImageDraw.Draw(im); f = ImageFont.truetype(FONT, size); y = im.height - size * (len(lines) * 1.5 + 1.2)
    for k, ln in enumerate(lines): d.text((size * 1.2, y + k * size * 1.45), ln, font=f, fill=(255, 255, 255)); 
    return im
for slug, d in pages:
    folder = os.path.join(D, 'assets/media', slug); os.makedirs(folder, exist_ok=True); h = d['hue']
    names = [('reel-poster.jpg', 0), ('still-1.jpg', 1), ('still-2.jpg', 2), ('still-3.jpg', 3)]
    for (fn, k) in names:
        out = os.path.join(folder, fn)
        if os.path.exists(out): continue
        im = Image.fromarray(canvas(h, hash(slug) % 997 + k * 13)).resize((1920, 1080), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))
        label(im, [d['mt'][k].upper(), 'PLACEHOLDER - replace with 3840x2160', 'assets/media/%s/%s' % (slug, fn)], 40); im.save(out, quality=82)
    vp = os.path.join(folder, 'reel.mp4')
    if not os.path.exists(vp):
        W, H, N = 1280, 720, 96
        pr = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '%dx%d' % (W, H), '-r', '24', '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '30', '-preset', 'veryfast', '-movflags', '+faststart', '-an', vp], stdin=subprocess.PIPE)
        seed = hash(slug) % 997
        for n in range(N):
            fr = cv2.resize(canvas(h, seed, t=n / N), (W, H), interpolation=cv2.INTER_CUBIC)
            cv2.putText(fr, d['mt'][0].upper() + ' - PLACEHOLDER VIDEO', (50, H - 80), cv2.FONT_HERSHEY_DUPLEX, 1.1, (255, 255, 255), 2, cv2.LINE_AA)
            cv2.putText(fr, 'replace assets/media/%s/reel.mp4' % slug, (50, H - 40), cv2.FONT_HERSHEY_SIMPLEX, .8, (255, 255, 255), 1, cv2.LINE_AA)
            pr.stdin.write(fr.tobytes())
        pr.stdin.close(); pr.wait()
    print(slug, 'ok')
