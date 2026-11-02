# Media guide - replace any file, keep the same name

Each page has its own folder: `assets/media/<page>/`

| File | What it is | Recommended |
|---|---|---|
| `reel.mp4` | Looping video (muted autoplay when in view) | 3840x2160 (4K) H.264, 8-15 s loop, under 20 MB. Add `reel.webm` only if you also edit build.py |
| `reel-poster.jpg` | First frame / fallback while the video loads | 3840x2160 JPG or same ratio, under 800 KB |
| `still-1.jpg` `still-2.jpg` `still-3.jpg` | Gallery images | 3840x2160 (16:9), under 800 KB each |

Page folders: home, direction, camera-movements, lenses-framing, lighting, editing-sound, stunts, behind-the-scenes, methods, vfx-virtual, cinema-facts.

Titles shown under each image/video are in `content.json` -> `"mt"` (4 titles per page: reel, still 1, still 2, still 3). Edit them, run `python3 build.py`, refresh.

Tips: keep 16:9. If your video is vertical or another ratio it is cropped to fill the frame (object-fit: cover).
Videos load only when you scroll near them and pause when off-screen, so 4K files do not slow the first load.
`make_placeholders.py` recreates the placeholder files (it never overwrites files that already exist).
