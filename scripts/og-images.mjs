/* ============================================================
   OG-IMAGES — generate the share images and icon set
   ============================================================

   Why this exists
   ---------------
   `public/og.jpg` used to be a stock photograph of two workers walking past
   WIND TURBINES — the wrong technology for a solar company, with no branding
   and no text. That image was what appeared on every WhatsApp forward and
   Facebook share. And the favicon was the 3354x866 wordmark, which a browser
   squashes into a square.

   What it makes
   -------------
     public/og.jpg            1200x630   Open Graph / Twitter card
     public/og-square.jpg     1200x1200  WhatsApp and other messengers
     public/apple-touch-icon.png 180x180
     public/favicon-32.png    32x32
     public/favicon-16.png    16x16
     public/favicon.ico       16+32
     public/hero-poster.jpg   first frame of hero.mp4, for the video poster

   This is NOT part of `npm run build` — the outputs are committed. Run it by
   hand (`npm run og`) when the brand or the copy changes. That keeps the
   deploy build free of any dependency on Chrome or ImageMagick.

   Requires: Google Chrome (or Chromium) and ImageMagick `convert`.
   ============================================================ */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFile, writeFile, mkdir, rm, access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { SITE, AREA, SUBSIDY_TIERS } from '../site.config.js'

const run = promisify(execFile)
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pub = (f) => resolve(root, 'public', f)
const TMP = resolve(root, 'node_modules/.ogtmp')

const exists = (p) => access(p).then(() => true, () => false)

/* ------------------------------------------------------------------
   Tooling discovery
   ------------------------------------------------------------------ */

async function findChrome() {
  const candidates = [
    'google-chrome',
    'google-chrome-stable',
    'chromium',
    'chromium-browser',
  ]
  for (const c of candidates) {
    try {
      await run('which', [c])
      return c
    } catch {
      /* keep looking */
    }
  }
  throw new Error('No Chrome/Chromium on PATH — needed to render the share images.')
}

/* The poster frame is grabbed with Chrome rather than ffmpeg. The ffmpeg that
   ships inside the Playwright cache is built with --disable-everything and
   cannot demux MP4 at all, and a system ffmpeg is not a dependency worth
   adding when Chrome is already here and decodes the file happily. */
const posterHtml = (src, w, h) => `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  *{margin:0;padding:0}
  html,body{width:${w}px;height:${h}px;background:#0e3a4a;overflow:hidden}
  video{width:${w}px;height:${h}px;object-fit:cover;display:block}
</style></head><body>
  <video id="v" src="${src}" muted playsinline preload="auto"></video>
  <script>
    /* One second in, past any fade-from-black at the top of the clip. */
    const v = document.getElementById('v')
    v.addEventListener('loadeddata', () => { v.currentTime = 1.0 })
  <\/script>
</body></html>`

/* ------------------------------------------------------------------
   Brand tokens — copied from src/index.css :root so the cards and the
   site cannot disagree about what "Delta green" is.
   ------------------------------------------------------------------ */

const T = {
  forest: '#0e3a4a',
  forest900: '#082636',
  green: '#5bb715',
  green300: '#9ad95f',
  paper: '#f4f1ea',
  soft: 'rgba(255,255,255,0.52)',
  onDark: 'rgba(255,255,255,0.82)',
}

const CHIPS = [
  `${SUBSIDY_TIERS.at(-1).amount} subsidy handled`,
  'Up to 90% off your KSEB bill',
  '3–5 year payback',
]

/* The diagonal line motif used by the stats card and the CTA band. */
const lineArt = (w, h) => `
  <svg class="art" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <g stroke="rgba(255,255,255,0.06)" stroke-width="2">
      <path d="M${-0.1 * w} ${1.2 * h} L${0.42 * w} ${-0.1 * h}" />
      <path d="M${0.16 * w} ${1.25 * h} L${0.7 * w} ${-0.12 * h}" />
      <path d="M${0.46 * w} ${1.3 * h} L${0.98 * w} ${-0.1 * h}" />
      <path d="M${0.72 * w} ${1.3 * h} L${1.24 * w} ${-0.1 * h}" />
    </g>
    <line x1="${0.3 * w}" y1="${1.25 * h}" x2="${0.82 * w}" y2="${-0.1 * h}"
          stroke="rgba(91,183,21,0.30)" stroke-width="3" />
    <circle cx="${0.88 * w}" cy="${0.14 * h}" r="${0.22 * h}" fill="none"
            stroke="rgba(255,255,255,0.05)" stroke-width="1.5" />
    <circle cx="${0.88 * w}" cy="${0.14 * h}" r="${0.13 * h}" fill="none"
            stroke="rgba(255,255,255,0.06)" stroke-width="1.5" />
  </svg>`

const check = `
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8.5l3 3 7-7" stroke="${T.green300}" stroke-width="2.2"
          stroke-linecap="round" stroke-linejoin="round" />
  </svg>`

/* ------------------------------------------------------------------
   Card template
   ------------------------------------------------------------------ */

function card({ w, h, logo, square }) {
  const pad = square ? 96 : 72
  const titleSize = square ? 104 : 88
  const subSize = square ? 32 : 27
  const chipSize = square ? 25 : 21
  const logoH = square ? 76 : 60

  return `<!doctype html>
<html lang="${SITE.lang}">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://api.fontshare.com" />
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin />
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=block" rel="stylesheet" />
<style>
  *{ margin:0; padding:0; box-sizing:border-box; }
  html,body{ width:${w}px; height:${h}px; }
  body{
    background:${T.forest};
    color:#fff;
    font-family:'Switzer', system-ui, -apple-system, 'Segoe UI', sans-serif;
    -webkit-font-smoothing:antialiased;
    position:relative; overflow:hidden;
  }
  .art{ position:absolute; inset:0; width:100%; height:100%; }
  /* Deepen the lower-left so the headline always has contrast under it. */
  .scrim{
    position:absolute; inset:0;
    background:
      radial-gradient(120% 90% at 100% 0%, rgba(91,183,21,0.10), transparent 60%),
      linear-gradient(200deg, rgba(8,38,54,0.10) 0%, ${T.forest900} 100%);
    opacity:.9;
  }
  .inner{
    position:relative; height:100%; padding:${pad}px;
    display:flex; flex-direction:column; justify-content:space-between;
  }
  .logo{ height:${logoH}px; width:auto; align-self:flex-start; flex:none; }
  h1{
    font-size:${titleSize}px; font-weight:600; line-height:1.02;
    letter-spacing:-0.03em; margin-bottom:${square ? 30 : 22}px;
  }
  h1 .soft{ color:${T.soft}; display:block; }
  .sub{
    font-size:${subSize}px; line-height:1.45; color:${T.onDark};
    max-width:${square ? 22 : 26}ch; font-weight:400;
  }
  .chips{
    display:flex; flex-wrap:wrap; gap:${square ? 16 : 14}px ${square ? 30 : 26}px;
    padding-top:${square ? 34 : 26}px;
    border-top:1px solid rgba(255,255,255,0.14);
  }
  .chip{
    display:inline-flex; align-items:center; gap:10px;
    font-size:${chipSize}px; font-weight:500; color:rgba(255,255,255,0.9);
  }
  .chip svg{ width:${chipSize}px; height:${chipSize}px; flex:none; }
  .foot{ display:flex; align-items:flex-end; justify-content:space-between; gap:24px; }
  .where{
    font-size:${chipSize - 2}px; font-weight:600; letter-spacing:0.16em;
    text-transform:uppercase; color:${T.green300}; white-space:nowrap;
  }
</style>
</head>
<body>
  ${lineArt(w, h)}
  <div class="scrim"></div>
  <div class="inner">
    <img class="logo" src="${logo}" alt="" />
    <div>
      <h1>Rooftop solar<span class="soft">in ${AREA.city}.</span></h1>
      <p class="sub">On-grid solar for ${AREA.region} homes and businesses — done right.</p>
    </div>
    <div>
      <div class="chips">
        ${CHIPS.map((c) => `<span class="chip">${check}${c}</span>`).join('\n        ')}
      </div>
      <div class="foot" style="padding-top:${square ? 30 : 22}px">
        <span class="where">${AREA.city} · ${AREA.region} · KSEB net metering</span>
      </div>
    </div>
  </div>
</body>
</html>`
}

/* A square icon has to survive 16x16, so it carries the "D" alone. The crop
   box below was measured off delta-color.png: the wordmark is italic and the
   glyphs overlap horizontally, so there is no clean transparent gutter to
   detect — (0,0)-(800,650) was verified by eye to hold the whole D and no
   part of the E. */
const D_CROP = { x: 0, y: 0, w: 800, h: 650, srcW: 3354, srcH: 866 }

function iconHtml({ size, logo, bg, inset }) {
  /* Scale so the D box occupies `inset` of the square, then clip to exactly
     that box — offsetting alone is not enough, because the rest of the
     wordmark keeps painting to the right of it. */
  const scale = (size * inset) / D_CROP.w
  const clipW = D_CROP.w * scale
  const clipH = D_CROP.h * scale

  return `<!doctype html>
<html><head><meta charset="utf-8" /><style>
  *{margin:0;padding:0}
  html,body{width:${size}px;height:${size}px}
  body{background:${bg};display:flex;align-items:center;justify-content:center}
  .clip{ width:${clipW}px; height:${clipH}px; overflow:hidden; position:relative; }
  .clip img{
    position:absolute;
    left:${-D_CROP.x * scale}px;
    top:${-D_CROP.y * scale}px;
    width:${D_CROP.srcW * scale}px;
    height:${D_CROP.srcH * scale}px;
    max-width:none;
  }
</style></head><body>
  <div class="clip"><img src="${logo}" alt="" /></div>
</body></html>`
}

/* ------------------------------------------------------------------
   Render
   ------------------------------------------------------------------ */

async function shoot(chrome, html, out, w, h) {
  const page = resolve(TMP, `p-${Math.random().toString(36).slice(2)}.html`)
  await writeFile(page, html, 'utf8')
  await run(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    /* Let webfonts and layout settle before the frame is captured. */
    '--virtual-time-budget=10000',
    `--window-size=${w},${h}`,
    `--screenshot=${out}`,
    page,
  ])
  if (!(await exists(out))) throw new Error(`Chrome produced no screenshot for ${out}`)
}

async function shootMedia(chrome, html, out, w, h) {
  const page = resolve(TMP, `m-${Math.random().toString(36).slice(2)}.html`)
  await writeFile(page, html, 'utf8')
  await run(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    /* file:// video source, and no click to start it with */
    '--allow-file-access-from-files',
    '--autoplay-policy=no-user-gesture-required',
    '--force-device-scale-factor=1',
    '--virtual-time-budget=15000',
    `--window-size=${w},${h}`,
    `--screenshot=${out}`,
    page,
  ])
  if (!(await exists(out))) throw new Error(`Chrome produced no screenshot for ${out}`)
}

async function main() {
  const chrome = await findChrome()
  await mkdir(TMP, { recursive: true })

  const dataUri = async (f, mime = 'image/png') =>
    `data:${mime};base64,${(await readFile(pub(f))).toString('base64')}`

  const white = await dataUri('brand/delta-white.png')
  const colour = await dataUri('brand/delta-color.png')

  /* --- share cards --- */
  const oglPng = resolve(TMP, 'og.png')
  const ogsPng = resolve(TMP, 'og-square.png')

  await shoot(chrome, card({ w: 1200, h: 630, logo: white, square: false }), oglPng, 1200, 630)
  await shoot(chrome, card({ w: 1200, h: 1200, logo: white, square: true }), ogsPng, 1200, 1200)

  /* JPEG at 88: sharp text, and both files stay far under the 5 MB that
     Facebook and WhatsApp will actually fetch. */
  await run('convert', [oglPng, '-quality', '88', '-strip', '-interlace', 'Plane', pub('og.jpg')])
  await run('convert', [ogsPng, '-quality', '88', '-strip', '-interlace', 'Plane', pub('og-square.jpg')])

  /* --- icons ---
     Rendered large and downscaled, which antialiases far better than asking
     Chrome for a 16x16 viewport. */
  const iconPng = resolve(TMP, 'icon.png')
  await shoot(
    chrome,
    iconHtml({ size: 512, logo: white, bg: T.forest, inset: 0.62 }),
    iconPng,
    512,
    512
  )

  await run('convert', [iconPng, '-resize', '180x180', '-strip', pub('apple-touch-icon.png')])
  await run('convert', [iconPng, '-resize', '32x32', '-strip', pub('favicon-32.png')])
  await run('convert', [iconPng, '-resize', '16x16', '-strip', pub('favicon-16.png')])
  await run('convert', [
    iconPng,
    '-strip',
    '(', '-clone', '0', '-resize', '32x32', ')',
    '(', '-clone', '0', '-resize', '16x16', ')',
    '-delete', '0',
    pub('favicon.ico'),
  ])

  /* Keep a light-background variant on hand for docs and email signatures. */
  await shoot(
    chrome,
    iconHtml({ size: 512, logo: colour, bg: T.paper, inset: 0.62 }),
    resolve(TMP, 'icon-light.png'),
    512,
    512
  )

  /* --- hero poster ---
     Gives <video> something to paint immediately, so the 3.3 MB file stops
     being the largest contentful paint. Taken from the video itself, so it
     always matches whatever footage is in place. */
  const posterPng = resolve(TMP, 'poster.png')
  await shootMedia(
    chrome,
    posterHtml(`file://${pub('hero.mp4')}`, 1280, 720),
    posterPng,
    1280,
    720
  )
  await run('convert', [
    posterPng,
    '-quality', '70',
    '-strip',
    '-interlace', 'Plane',
    pub('hero-poster.jpg'),
  ])
  console.log('✓ og  hero-poster.jpg 1280x720 (frame @1s of hero.mp4)')

  await rm(TMP, { recursive: true, force: true })

  console.log('✓ og  og.jpg 1200x630, og-square.jpg 1200x1200')
  console.log('✓ og  apple-touch-icon 180, favicon 32/16, favicon.ico')
}

main().catch((err) => {
  console.error('✗ og-images failed:', err.message || err)
  process.exit(1)
})
