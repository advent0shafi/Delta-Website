/* ============================================================
   SEO-CHECK — assert the things that silently rot
   ============================================================

   Run: npm run seo:check   (after `npm run build`)

   This is deliberately NOT wired into `npm run build`. It is a pre-launch
   gate and a regression net, and it is expected to fail today: the contact
   details on the site are still `+91 XXXXX XXXXX`.

   Three groups:
     STRUCTURE  the page a crawler receives is well-formed
     ASSETS     the files robots/OG/manifest point at actually exist
     LAUNCH     placeholder data that must not go live
   ============================================================ */

import { readFile, access, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { SITE, CONTACT, IMAGES, FAQS, SERVICES, abs } from '../site.config.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const exists = (p) => access(p).then(() => true, () => false)

const results = []
const ok = (group, msg) => results.push({ group, level: 'ok', msg })
const fail = (group, msg, hint) => results.push({ group, level: 'fail', msg, hint })
const warn = (group, msg, hint) => results.push({ group, level: 'warn', msg, hint })

/* ------------------------------------------------------------------
   Load the built page — that is what crawlers actually get.
   ------------------------------------------------------------------ */

const DIST = resolve(root, 'dist/index.html')

async function loadPage() {
  if (await exists(DIST)) return { html: await readFile(DIST, 'utf8'), built: true }
  return { html: await readFile(resolve(root, 'index.html'), 'utf8'), built: false }
}

/* ------------------------------------------------------------------
   STRUCTURE
   ------------------------------------------------------------------ */

function checkRendered(html, built) {
  if (!built) {
    warn(
      'STRUCTURE',
      'dist/index.html not found — checked the source shell instead',
      'Run `npm run build` first to check what a crawler really receives.'
    )
    return false
  }
  if (/<div id="root">\s*<\/div>/.test(html)) {
    fail(
      'STRUCTURE',
      'dist/index.html ships an EMPTY #root — no crawler sees any content',
      'scripts/prerender.mjs did not run or did not match. Re-run `npm run build`.'
    )
    return false
  }
  /* Measured by index rather than by regex: the closing </div> of #root is the
     last one in the document, and a greedy match has to stop somewhere the
     markup does not reliably provide. */
  const from = html.indexOf('<div id="root">') + '<div id="root">'.length
  const to = html.lastIndexOf('</div>')
  const chars = to > from ? to - from : 0
  const text = html
    .slice(from, to)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (chars < 1000) {
    fail('STRUCTURE', `#root holds only ${chars} chars — the prerender looks incomplete`)
    return false
  }
  ok(
    'STRUCTURE',
    `#root is prerendered (${chars.toLocaleString('en-IN')} chars of markup, ` +
      `${text.length.toLocaleString('en-IN')} chars of readable text)`
  )
  return true
}

function checkHeadings(html) {
  const body = html.slice(html.indexOf('<body'))
  const tags = [...body.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]))

  const h1s = tags.filter((n) => n === 1).length
  if (h1s === 1) ok('STRUCTURE', 'exactly one <h1>')
  else fail('STRUCTURE', `found ${h1s} <h1> elements, expected exactly 1`)

  if (tags.length && tags[0] !== 1) {
    fail('STRUCTURE', `first heading on the page is <h${tags[0]}>, should be <h1>`)
  }

  const skips = []
  for (let i = 1; i < tags.length; i++) {
    if (tags[i] > tags[i - 1] + 1) skips.push(`h${tags[i - 1]} → h${tags[i]}`)
  }
  if (skips.length) {
    fail(
      'STRUCTURE',
      `heading levels skip ${skips.length} time(s): ${[...new Set(skips)].join(', ')}`,
      'A crawler builds its outline from these; a skipped level breaks the tree.'
    )
  } else {
    ok('STRUCTURE', `heading tree has no skipped levels (${tags.length} headings)`)
  }
}

function checkHead(html) {
  const need = [
    [/<html[^>]+lang="([^"]+)"/, 'lang attribute', SITE.lang],
    [/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/, 'canonical', abs('/')],
    [/<meta[^>]+property="og:url"[^>]+content="([^"]+)"/, 'og:url', abs('/')],
    [/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/, 'og:image', abs(IMAGES.og)],
    [/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/, 'og:title', SITE.title],
    [/<meta[^>]+name="description"[^>]+content="([^"]+)"/, 'description', SITE.description],
    [/<title>([^<]+)<\/title>/, 'title', SITE.title],
  ]

  for (const [re, label, expected] of need) {
    const m = html.match(re)
    if (!m) {
      fail('STRUCTURE', `<head> is missing ${label}`)
    } else if (expected && m[1].trim() !== expected) {
      fail(
        'STRUCTURE',
        `${label} has drifted from site.config.js`,
        `page: ${m[1].trim()}\n       config: ${expected}`
      )
    } else {
      ok('STRUCTURE', `${label} matches site.config.js`)
    }
  }

  /* Anything Open Graph points at must be absolute, or scrapers drop it. */
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)="((?:og|twitter):image)"[^>]+content="([^"]+)"/g)) {
    if (!/^https?:\/\//.test(m[2])) {
      fail('STRUCTURE', `${m[1]} is not an absolute URL — scrapers will ignore it`)
    }
  }

  const desc = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/)
  if (desc && desc[1].length > 165) {
    warn('STRUCTURE', `meta description is ${desc[1].length} chars — Google truncates near 160`)
  }
}

function checkJsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  if (!blocks.length) return fail('STRUCTURE', 'no JSON-LD on the page')

  let graph
  try {
    graph = JSON.parse(blocks[0][1])
  } catch (e) {
    return fail('STRUCTURE', `JSON-LD does not parse: ${e.message}`)
  }

  const nodes = graph['@graph'] || [graph]
  ok('STRUCTURE', `JSON-LD parses (${nodes.length} nodes)`)

  /* schema.org types that have appeared here and do not exist. An
     unrecognised @type makes the whole node worthless, and it fails silently
     — nothing warns you, the rich result just never appears. */
  const NOT_REAL = ['SolarPanelInstaller', 'SolarInstaller', 'LocalService', 'SolarEnergyCompany']
  const types = nodes.flatMap((n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]))
  const bogus = types.filter((t) => NOT_REAL.includes(t))
  if (bogus.length) {
    fail('STRUCTURE', `JSON-LD uses non-existent schema.org type(s): ${bogus.join(', ')}`)
  } else {
    ok('STRUCTURE', 'JSON-LD @type values are real schema.org types')
  }

  const faq = nodes.find((n) => n['@type'] === 'FAQPage')
  if (!faq) {
    warn('STRUCTURE', 'no FAQPage node — the closed accordion answers reach no crawler')
  } else if (faq.mainEntity?.length !== FAQS.length) {
    fail(
      'STRUCTURE',
      `FAQPage has ${faq.mainEntity?.length ?? 0} questions, site.config.js has ${FAQS.length}`,
      'Re-run `npm run seo:gen`.'
    )
  } else {
    ok('STRUCTURE', `FAQPage carries all ${FAQS.length} questions`)
  }

  const services = nodes.filter((n) => n['@type'] === 'Service')
  if (services.length !== SERVICES.length) {
    fail(
      'STRUCTURE',
      `${services.length} Service nodes, site.config.js has ${SERVICES.length}`,
      'Re-run `npm run seo:gen`.'
    )
  } else {
    ok('STRUCTURE', `${services.length} Service nodes match site.config.js`)
  }

  /* A fake phone number in structured data is worse than none. */
  const biz = nodes.find((n) =>
    (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]).includes('LocalBusiness')
  )
  if (biz?.telephone && /0{5,}|X{3,}/i.test(biz.telephone)) {
    fail('LAUNCH', `JSON-LD publishes a placeholder telephone: ${biz.telephone}`)
  }
}

function checkImgAlt(html) {
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0])
  const missing = imgs.filter((t) => !/\balt=/.test(t))
  if (missing.length) {
    fail('STRUCTURE', `${missing.length} of ${imgs.length} <img> tags have no alt attribute`)
  } else if (imgs.length) {
    ok('STRUCTURE', `all ${imgs.length} <img> tags carry an alt attribute`)
  }
}

/* ------------------------------------------------------------------
   ASSETS
   ------------------------------------------------------------------ */

async function checkAssets() {
  const dir = (await exists(resolve(root, 'dist'))) ? 'dist' : 'public'
  const required = [
    'robots.txt',
    'sitemap.xml',
    'llms.txt',
    'site.webmanifest',
    'og.jpg',
    'og-square.jpg',
    'favicon.ico',
    'favicon-32.png',
    'favicon-16.png',
    'apple-touch-icon.png',
    'hero-poster.jpg',
  ]

  for (const f of required) {
    const p = resolve(root, dir, f)
    if (await exists(p)) {
      const { size } = await stat(p)
      if (size === 0) fail('ASSETS', `${dir}/${f} is empty`)
      else ok('ASSETS', `${dir}/${f} (${(size / 1024).toFixed(1)} kB)`)
    } else {
      fail('ASSETS', `${dir}/${f} is missing`, 'Run `npm run seo:gen` and `npm run og`.')
    }
  }

  /* The OG image must really be the size the meta tags claim. */
  const og = resolve(root, dir, 'og.jpg')
  if (await exists(og)) {
    const buf = await readFile(og)
    const dims = jpegSize(buf)
    if (!dims) {
      warn('ASSETS', 'could not read og.jpg dimensions')
    } else if (dims.w !== IMAGES.ogWidth || dims.h !== IMAGES.ogHeight) {
      fail(
        'ASSETS',
        `og.jpg is ${dims.w}x${dims.h}, but og:image:width/height claim ${IMAGES.ogWidth}x${IMAGES.ogHeight}`
      )
    } else {
      ok('ASSETS', `og.jpg is ${dims.w}x${dims.h}, matching the declared dimensions`)
    }
  }

  const robots = resolve(root, dir, 'robots.txt')
  if (await exists(robots)) {
    const txt = await readFile(robots, 'utf8')
    if (!txt.includes(abs('/sitemap.xml'))) {
      fail('ASSETS', 'robots.txt does not point at the sitemap')
    } else if (/^\s*Disallow:\s*\/\s*$/m.test(txt.split('User-agent: *')[1]?.split('User-agent:')[0] || '')) {
      fail('ASSETS', 'robots.txt blocks all crawlers from the whole site')
    } else {
      ok('ASSETS', 'robots.txt allows crawling and points at the sitemap')
    }
  }
}

/* Minimal JPEG SOF walker — enough to read width/height without a dependency. */
function jpegSize(buf) {
  let i = 2
  while (i < buf.length) {
    if (buf[i] !== 0xff) return null
    const marker = buf[i + 1]
    const len = buf.readUInt16BE(i + 2)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) }
    }
    i += 2 + len
  }
  return null
}

/* ------------------------------------------------------------------
   LAUNCH — data that must not go live
   ------------------------------------------------------------------ */

function checkLaunch() {
  if (!CONTACT.isPlaceholder) {
    ok('LAUNCH', 'contact details are marked real in site.config.js')
    return
  }
  fail(
    'LAUNCH',
    'contact details are still placeholders',
    [
      `phone   ${CONTACT.phoneDisplay}  (${CONTACT.phoneHref})`,
      `       email   ${CONTACT.email}`,
      `       address no street address set`,
      '',
      '       Fix in site.config.js → CONTACT, then set isPlaceholder: false',
      '       and re-run `npm run seo:gen`. Until then the JSON-LD correctly',
      '       omits telephone and email rather than publishing fake ones.',
    ].join('\n')
  )

  if (!CONTACT.sameAs.length) {
    warn(
      'LAUNCH',
      'no social profiles in CONTACT.sameAs',
      'Google uses sameAs to connect the site to a Business Profile.'
    )
  }
}

/* ------------------------------------------------------------------ */

async function main() {
  const { html, built } = await loadPage()

  const rendered = checkRendered(html, built)
  if (rendered) {
    checkHeadings(html)
    checkImgAlt(html)
  }
  checkHead(html)
  checkJsonLd(html)
  await checkAssets()
  checkLaunch()

  const icon = { ok: '✓', warn: '!', fail: '✗' }
  let lastGroup = null
  for (const r of results) {
    if (r.group !== lastGroup) {
      console.log(`\n${r.group}`)
      lastGroup = r.group
    }
    console.log(`  ${icon[r.level]} ${r.msg}`)
    if (r.hint) console.log(`       ${r.hint}`)
  }

  const fails = results.filter((r) => r.level === 'fail')
  const warns = results.filter((r) => r.level === 'warn')
  console.log(
    `\n${results.filter((r) => r.level === 'ok').length} passed · ` +
      `${warns.length} warning(s) · ${fails.length} failure(s)`
  )
  process.exit(fails.length ? 1 : 0)
}

main().catch((err) => {
  console.error('✗ seo:check crashed:', err)
  process.exit(2)
})
