# Frame Atlas
A multi-page cinema knowledge site (bright white glass theme, Three.js + GSAP + Lenis).

## Structure
- index.html, direction.html, stunts.html, behind-the-scenes.html, methods.html, cinema-facts.html (generated)
- assets/css/style.css  - all styling, shared by every page
- assets/js/core.js     - smooth scroll, cursor, menu, per-page reveals and page transitions
- assets/js/scenes.js   - a different WebGL scene on every page (objects dodge the text)
- assets/js/media.js    - a different video/image presentation on every page
- assets/js/effects.js  - viewfinder HUD, interactive demos, scroll effects
- assets/media/<page>/  - your videos and images (see assets/media/README.md)
- content.json          - ALL text, facts, stats and page titles
- build.py              - regenerates every page from content.json

## Update workflow
1. Edit content.json (text) or assets/css|js (look and motion).
2. Run `python3 build.py` to rebuild the pages.
3. Preview with a local server: `python3 -m http.server 8000` then open http://localhost:8000
   (open it via a server, not by double-clicking, so page transitions work).

## Add a page
Add an object to "pages" in content.json (copy an existing one, change slug/name/text), run build.py. Menu, footer and "next chapter" links update automatically.

Libraries load from CDNs (needs internet): three r128, GSAP 3.12.5, Lenis 1.1.13, Google Fonts.

## If a page ever looks stuck or empty
boot.js loads each library from a CDN with a backup CDN, and if anything fails (offline, blocked CDN, no WebGL) it switches to a plain, fully readable version of the page. Open the browser console (F12) to see which file failed.

## Per-page settings (content.json)
hue (theme colour), r (corner radius), sep (marquee symbol), tx (page transition), rv (headline reveal), pv (panel reveal), fx (media layout), scene (3D concept), pm (particles), hud (viewfinder label), mt (media titles).

## Real photos and videos (free, no attribution needed)
The zip ships generated placeholders. For real footage run once (free Pexels key from https://www.pexels.com/api/):
    python3 fetch_media.py YOUR_KEY            # 1080p videos + 4K-wide photos (smoothest)
    python3 fetch_media.py YOUR_KEY --4k       # 4K videos where available
Search words per page are in content.json -> "q". Credits are written to assets/media/CREDITS.md.
