/* ============================================================
   PRERENDER — turn the built SPA shell into real HTML documents
   ============================================================

   Why this exists
   ---------------
   Vite ships `<div id="root"></div>` and nothing else. Googlebot may come
   back later to render the JavaScript, but GPTBot, ClaudeBot, PerplexityBot,
   CCBot and every social-media scraper execute no JavaScript at all — to
   them the site was a blank page with a good <meta description>.

   This renders <App /> to HTML at build time and puts it inside #root, so
   the very first byte of the response contains the H1, every section, the
   services and the contact details.

   One document per route
   ----------------------
   `site.routes.js` is the list. Each entry is rendered inside a StaticRouter
   pinned to that path and written to its own file — `/subsidy/` becomes
   `dist/subsidy/index.html`, which a static host serves without any rewrite
   rule. Each document also gets its OWN <title>, description and canonical:
   six pages sharing the homepage's metadata would compete with each other in
   search instead of answering six different queries.

   How it stays cheap
   ------------------
   No new dependencies and no headless browser: esbuild already ships inside
   Vite and `react-dom/server` already ships inside react-dom. That matters
   because the build has to keep working on whatever CI or host runs it.

   renderToString, not renderToStaticMarkup
   ----------------------------------------
   renderToStaticMarkup produces cleaner HTML but strips the `<!-- -->`
   separators React puts between adjacent text nodes. `main.jsx` hydrates
   this markup, and without those separators every place we interpolate two
   values side by side (the footer copyright, "Malappuram, Kerala") merges
   into one text node and hydration reports a mismatch. renderToString keeps
   them; crawlers ignore comments.
   ============================================================ */

import { build } from 'esbuild'
import { readFile, writeFile, rm, mkdir } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { ROUTES, routeToFile } from '../site.routes.js'
import { abs } from '../site.config.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SHELL = resolve(root, 'dist/index.html')
const TMP = resolve(root, 'node_modules/.prerender')

/* The empty shell Vite emits. Matched loosely so whitespace can't break it. */
const ROOT_RE = /<div id="root">\s*<\/div>/

async function bundleApp() {
  await mkdir(TMP, { recursive: true })
  const entry = resolve(TMP, 'entry.jsx')
  const out = resolve(TMP, 'app.mjs')

  await writeFile(
    entry,
    `export { default as App } from ${JSON.stringify(resolve(root, 'src/App.jsx'))}\n`
  )

  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: out,
    /* React itself stays external so the server render and this process share
       one copy — two Reacts in one process breaks hooks.

       react-router has to be external for the same reason, and it is easy to
       miss: bundling it gives App its own copy whose React context is a
       different object from the one the StaticRouter above provides, and
       every useLocation() inside App throws "may be used only in the context
       of a <Router>" even though App is plainly inside one. */
    external: ['react', 'react-dom', 'react-dom/server', 'react-router', 'react-router-dom'],
    jsx: 'automatic',
    /* Styles are Vite's job; here they would just emit a stray sidecar file. */
    loader: { '.css': 'empty' },
    logLevel: 'error',
    write: true,
  })

  /* Cache-bust so repeat builds in one process don't reuse a stale module. */
  const { App } = await import(`${pathToFileURL(out).href}?t=${Date.now()}`)
  return App
}

/* ------------------------------------------------------------------
   Per-route <head>

   Everything here is generated from site.routes.js, so a page can never
   quietly inherit the homepage's metadata. Values are escaped because a
   description containing a quote would otherwise break out of the attribute.
   ------------------------------------------------------------------ */

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function applyHead(html, route) {
  const url = abs(route.path)
  const title = esc(route.title)
  const desc = esc(route.description)

  const swaps = [
    [/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`],
    [
      /(<meta\s+name="description"\s+content=")[\s\S]*?(")/,
      `$1${desc}$2`,
    ],
    [/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`],
    [/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`],
    [/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`],
    [
      /(<meta\s+property="og:description"\s+content=")[\s\S]*?(")/,
      `$1${desc}$2`,
    ],
    [/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`],
    [
      /(<meta\s+name="twitter:description"\s+content=")[\s\S]*?(")/,
      `$1${desc}$2`,
    ],
  ]

  for (const [re, to] of swaps) {
    /* An absent tag is not an error — index.html may not carry every twitter:*
       variant — but a tag that exists must end up carrying this route's value. */
    if (re.test(html)) html = html.replace(re, to)
  }
  return html
}

/* The @graph is site-wide (Organization, WebSite, LocalBusiness, Service ×5,
   FAQPage) and correctly identical on every page. Only the WebPage node
   describes THIS document, so only it is patched — by parsing the block
   rather than doing string surgery on JSON embedded in HTML. */
function applyJsonLd(html, route) {
  const RE = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/
  const m = html.match(RE)
  if (!m) return html

  let graph
  try {
    graph = JSON.parse(m[2])
  } catch {
    console.error('! prerender: JSON-LD block is not valid JSON — left untouched.')
    return html
  }

  const page = (graph['@graph'] || []).find((n) => n['@type'] === 'WebPage')
  if (!page) return html

  page.url = abs(route.path)
  page.name = route.title
  page.description = route.description

  const body = JSON.stringify(graph, null, 2)
    .split('\n')
    .map((l) => `      ${l}`)
    .join('\n')

  return html.replace(RE, `$1\n${body}\n    $3`)
}

async function main() {
  let shell
  try {
    shell = await readFile(SHELL, 'utf8')
  } catch {
    console.error('✗ prerender: dist/index.html not found — run `vite build` first.')
    process.exit(1)
  }

  if (!ROOT_RE.test(shell)) {
    /* Already prerendered, or the shell changed shape. Either way, refusing is
       safer than writing markup into an unknown position. */
    console.error('✗ prerender: no empty <div id="root"></div> in dist/index.html.')
    console.error('  Nothing was written. Re-run `vite build` and try again.')
    process.exit(1)
  }

  const App = await bundleApp()

  /* React logs hydration-relevant problems through console.error. Capture them
     so a warning fails the build instead of scrolling past unnoticed. */
  const warnings = []
  const realError = console.error
  console.error = (...args) => {
    warnings.push(args.join(' '))
    realError(...args)
  }

  const written = []
  try {
    for (const route of ROUTES) {
      const markup = renderToString(
        React.createElement(
          StaticRouter,
          { location: route.path },
          React.createElement(App)
        )
      )

      let html = shell.replace(ROOT_RE, `<div id="root">${markup}</div>`)
      html = applyHead(html, route)
      html = applyJsonLd(html, route)

      const file = resolve(root, 'dist', routeToFile(route.path))
      await mkdir(dirname(file), { recursive: true })
      await writeFile(file, html, 'utf8')

      const headings = (markup.match(/<h[1-6][\s>]/g) || []).length
      const h1s = (markup.match(/<h1[\s>]/g) || []).length
      written.push({ route, chars: markup.length, headings, h1s })
    }
  } finally {
    console.error = realError
  }

  await rm(TMP, { recursive: true, force: true })

  for (const { route, chars, headings, h1s } of written) {
    console.log(
      `✓ prerender: ${String(chars).padStart(7)} chars, ${String(headings).padStart(2)} headings` +
        `, ${h1s} h1 → dist/${routeToFile(route.path)}`
    )
  }

  /* Exactly one <h1> per document. Zero means the lead section forgot its
     headingAs="h1"; more than one means two sections both claimed it. Either
     way seo:check would fail later — catching it here names the route. */
  const badH1 = written.filter((w) => w.h1s !== 1)
  if (badH1.length) {
    for (const w of badH1) {
      console.error(`✗ prerender: ${w.route.path} rendered ${w.h1s} <h1> elements, expected 1.`)
    }
    process.exit(1)
  }

  if (warnings.length) {
    console.error(`✗ prerender: React reported ${warnings.length} warning(s) during render.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('✗ prerender failed:', err)
  process.exit(1)
})
