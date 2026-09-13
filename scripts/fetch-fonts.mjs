/* ============================================================
   FETCH-FONTS — self-host Switzer instead of blocking on Fontshare
   ============================================================

   Why this exists
   ---------------
   `index.html` used to load a synchronous stylesheet from
   `api.fontshare.com`, which itself fetches the actual `.woff2` files from a
   SECOND host, `cdn.fontshare.com`. Nothing above the fold could paint until
   both round trips resolved — two extra origins in the critical path, on
   top of DNS + TLS for each. That is most of the 2,126ms of render-blocking
   cost Lighthouse charges `/` for.

   This script downloads the four Switzer weights the site actually uses
   (400/500/600/700 — NOT the `Sentient` italic face Fontshare's response
   also contains, which nothing here references) into `public/fonts/`, so
   `src/index.css` can declare local `@font-face` rules and the browser only
   ever talks to Delta's own origin for type.

   Licence constraint — READ BEFORE TOUCHING THE OUTPUT FILES
   ------------------------------------------------------------
   Switzer ships under the ITF Free Font Licence v2.0. Section 02 permits
   self-hosting (serving the files from your own server) but explicitly
   forbids modifying, subsetting, or converting the font files to another
   format. So this script downloads each `.woff2` byte-for-byte and writes
   it straight to disk — no processing, no re-encoding, no subsetting.
   Do not add any of that here without re-reading the licence.

   Run with `npm run fonts`, or automatically as the first step of
   `npm run build`. Idempotent: an existing non-empty file is left alone,
   so a warm build does not re-fetch four files it already has.
   ============================================================ */

import { writeFile, mkdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FONTS_DIR = resolve(root, 'public/fonts')

const CSS_URL = 'https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&display=swap'
const FAMILY = 'Switzer'
const WEIGHTS = [400, 500, 600, 700]

const log = (msg) => console.log(`[fetch-fonts] ${msg}`)
const die = (msg) => {
  console.error(`[fetch-fonts] FAILED: ${msg}`)
  process.exit(1)
}

async function existsNonEmpty(path) {
  try {
    const s = await stat(path)
    return s.isFile() && s.size > 0
  } catch {
    return false
  }
}

/* Fontshare's CSS is a flat list of `@font-face { ... }` blocks for every
   family requested in the query string — here that's Switzer AND Sentient
   (Sentient rides along because Fontshare bundles related families in one
   response; the site has no `Sentient` reference anywhere, so it is
   skipped). Split on the blocks themselves rather than trying to parse CSS
   properly — this is a fixed, known-shape response, not arbitrary input. */
function parseFontFaces(css) {
  const blocks = css.match(/@font-face\s*{[^}]*}/g) || []
  const faces = []
  for (const block of blocks) {
    const familyMatch = block.match(/font-family:\s*['"]([^'"]+)['"]/)
    const weightMatch = block.match(/font-weight:\s*(\d+)/)
    // First url(...) in the `src` list is the woff2 — Fontshare orders
    // src as woff2, woff, truetype, and each url is protocol-relative.
    const urlMatch = block.match(/url\((['"]?)(\/\/[^'")]+\.woff2)\1\)/)
    if (!familyMatch || !weightMatch || !urlMatch) continue
    faces.push({
      family: familyMatch[1],
      weight: Number(weightMatch[1]),
      url: `https:${urlMatch[2]}`,
    })
  }
  return faces
}

async function downloadFont(weight, url) {
  const dest = resolve(FONTS_DIR, `switzer-${weight}.woff2`)
  if (await existsNonEmpty(dest)) {
    log(`switzer-${weight}.woff2 already present, skipping`)
    return
  }

  log(`downloading ${FAMILY} ${weight} from ${url}`)
  let res
  try {
    res = await fetch(url)
  } catch (err) {
    die(`could not reach ${url} — ${err.message}`)
  }
  if (!res.ok) {
    die(`${url} responded ${res.status} ${res.statusText}`)
  }

  // Written unmodified: ITF FFL v2.0 Section 02 forbids modifying,
  // subsetting or format-converting the font files, so the bytes Fontshare
  // serves are the exact bytes that land in public/fonts/.
  const bytes = Buffer.from(await res.arrayBuffer())
  if (bytes.length === 0) {
    die(`${url} returned an empty body`)
  }

  await writeFile(dest, bytes)
  log(`wrote ${dest} (${bytes.length.toLocaleString()} bytes)`)
}

async function main() {
  await mkdir(FONTS_DIR, { recursive: true })

  log(`fetching font-face declarations from ${CSS_URL}`)
  let css
  try {
    const res = await fetch(CSS_URL)
    if (!res.ok) die(`${CSS_URL} responded ${res.status} ${res.statusText}`)
    css = await res.text()
  } catch (err) {
    die(`could not reach Fontshare — ${err.message}`)
    return
  }

  const faces = parseFontFaces(css).filter((f) => f.family === FAMILY)

  for (const weight of WEIGHTS) {
    const face = faces.find((f) => f.weight === weight)
    if (!face) {
      die(`no ${FAMILY} ${weight} @font-face block found in Fontshare's response — layout changed, script needs a look`)
      return
    }
    await downloadFont(weight, face.url)
  }

  log(`done — ${WEIGHTS.length} ${FAMILY} weights in public/fonts/`)
}

main().catch((err) => die(err.stack || err.message))
