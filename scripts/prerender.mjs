/* ============================================================
   PRERENDER — turn the built SPA shell into a real HTML document
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

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HTML = resolve(root, 'dist/index.html')
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
       one copy — two Reacts in one process breaks hooks. */
    external: ['react', 'react-dom', 'react-dom/server'],
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

async function main() {
  let html
  try {
    html = await readFile(HTML, 'utf8')
  } catch {
    console.error('✗ prerender: dist/index.html not found — run `vite build` first.')
    process.exit(1)
  }

  if (!ROOT_RE.test(html)) {
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

  let markup
  try {
    markup = renderToString(React.createElement(App))
  } finally {
    console.error = realError
  }

  await writeFile(HTML, html.replace(ROOT_RE, `<div id="root">${markup}</div>`), 'utf8')
  await rm(TMP, { recursive: true, force: true })

  const headings = (markup.match(/<h[1-6][\s>]/g) || []).length
  console.log(`✓ prerender: ${markup.length.toLocaleString('en-IN')} chars, ${headings} headings → dist/index.html`)

  if (warnings.length) {
    console.error(`✗ prerender: React reported ${warnings.length} warning(s) during render.`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('✗ prerender failed:', err)
  process.exit(1)
})
