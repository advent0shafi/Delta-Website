# Task: SEO, crawlability & semantic hierarchy

Client ask: research how SEO and crawling work on this site today, produce an
insight map, generate proper OG images and the files AI crawlers need, and get
every element into a correct hierarchy for crawling.

## 1. Research
- [x] Audit what the built site actually sends to a crawler.
      **Finding: `dist/index.html` body was `<div id="root"></div>` — 0 chars
      of content.** All copy lived inside a 430 kB JS bundle.
- [x] Establish which crawlers execute JavaScript. Googlebot does (deferred,
      wave 2). GPTBot / OAI-SearchBot / ClaudeBot / PerplexityBot / CCBot /
      Google-Extended and every social scraper do not.
- [x] Verify the structured data against schema.org.
      **Finding: `"@type": "SolarPanelInstaller"` is not a real type** —
      confirmed the eight real `HomeAndConstructionBusiness` subtypes. The
      whole LocalBusiness node was being discarded, silently. It also
      published a fabricated `"telephone": "+91-00000-00000"`.
- [x] Map the heading tree. **Finding: h2 → h4 skips in `Subsidy.jsx:64` and
      `Footer.jsx:50,55`; five FAQ questions were `<button><span>`, not
      headings; the `<h1>` named neither the service nor the town.**
- [x] Inspect `public/og.jpg`. **Finding: stock photo of WIND TURBINES** — the
      image on every WhatsApp share for a solar company.
- [x] Write it up → `docs/seo-crawl-study.md`.

## 2. Insight map
- [x] Published as an Artifact: crawl paths before/after, heading tree,
      defect matrix, file map.

## 3. Make the page crawlable
- [x] `scripts/prerender.mjs` — esbuild + `react-dom/server` inject rendered
      HTML into `#root` at build time. **Zero new dependencies**, no headless
      browser in the build.
- [x] `renderToString` not `renderToStaticMarkup` — the static variant drops
      the `<!-- -->` text-node separators that hydration needs.
- [x] `src/main.jsx` hydrates when `#root` has children, falls back to
      `createRoot` for `npm run dev`.
- [x] Prerender fails the build on any React warning. Caught a real bug
      immediately: `fetchPriority` is React 19 spelling, React 18 needs
      lowercase.

## 4. One source of truth
- [x] `site.config.js` — services, projects, FAQs, subsidy tiers, contact,
      brand. Imported by both the components and the generators, so the page
      and its structured data cannot drift.

## 5. Hierarchy & semantics
- [x] `<h1>` → "Rooftop solar in Malappuram." (client chose the visible rewrite)
- [x] Subsidy steps: h4 under an `sr-only` h3; steps are now an `<ol>`
- [x] Footer column titles: h4 → h2 (footer is its own landmark)
- [x] FAQ questions wrapped in `<h3>`, with `aria-controls` + panel `role`
- [x] `aria-labelledby` on every `<section>`; skip link; `.sr-only` utility
- [x] Calculator: `htmlFor` on every label (none were associated before),
      `aria-pressed` mode toggles, `aria-live` results, `type="button"`
- [x] Contact: `name` + `autocomplete`, `<address>`, `role="status"`
- [x] Stats render real figures; count-up zeroes in `onStart`, not at setup,
      so a non-scrolling renderer reads ₹78,000 and not ₹0
- [x] `lang="en"` → `lang="en-IN"`
- [x] CSS moved off tag selectors (`.subsidy2__step h4`, `.footer__col h4`)
      onto classes so heading levels stay free to change

## 6. Structured data
- [x] Valid 10-node `@graph`: Organization · WebSite · WebPage ·
      LocalBusiness+HomeAndConstructionBusiness · Service ×5 · FAQPage
- [x] Placeholder telephone/email **omitted** rather than published

## 7. Images
- [x] `scripts/og-images.mjs` — og.jpg 1200×630, og-square.jpg 1200×1200,
      apple-touch-icon 180, favicon 32/16/.ico, hero-poster.jpg
- [x] Hero video `preload="auto"` → `preload="metadata"` + poster (LCP)

## 8. AI & crawl files
- [x] `llms.txt`, rewritten `robots.txt` with per-crawler policy,
      `sitemap.xml` with lastmod + image, `site.webmanifest`, `humans.txt`

## 9. Verification
- [x] `scripts/seo-check.mjs` + `npm run seo:check`

---

## Review

### Measured result

| | Before | After |
|---|---:|---:|
| Markup in `#root` | 0 chars | 33,633 |
| Readable text a non-JS crawler gets | 0 chars | 4,192 |
| Headings in source | 0 | 29 |
| Skipped heading levels | 3 | 0 |
| Valid structured-data nodes | 0 | 10 |
| FAQ answers reachable without JS | 0 / 5 | 5 / 5 |

Fetched with a GPTBot user-agent, the page now returns 4,192 characters
mentioning Malappuram 8×, KSEB 15× and subsidy 13×. It previously returned
nothing.

### Verified in a real browser (Playwright + Chromium)

| Check | Result |
|---|---|
| Console errors / hydration warnings | **0** |
| `.reveal` elements reaching opacity 1 | 34 / 34 |
| Services hover, 2 passes over 5 cards | min opacity **1** — no regression of 1dd0b74 |
| FAQ accordion after the `<h3>` wrapper | opens, `aria-expanded=true`, panel present |
| Calculator | 7 result rows |
| Mobile 390×844 | h1 holds 2 lines, 0 px horizontal overflow |
| `prefers-reduced-motion` | 0 hidden reveals, stat reads ₹78,000 |
| Assets over HTTP | llms/robots/sitemap/manifest/og all 200 |

`npm run seo:check`: **28 passed, 1 warning, 1 failure** — the failure is the
deliberate pre-launch gate on placeholder contact details.

### Caught during the work
- `fetchPriority` (React 19 spelling) silently dropped by React 18 — found by
  the prerender's warning gate, fixed to lowercase.
- The OG logo rendered stretched ~4× because `.inner` is a column flexbox and
  `align-items: stretch` overrode `width: auto`. Fixed with `align-self`.
- The first favicon attempt leaked the "E" of the wordmark: offsetting the
  background is not enough, the crop needs a clipping element.
- The eyebrow copy I first wrote wrapped to two lines at 390px. Shortened.
- README claimed the fonts were Bricolage Grotesque + Inter; the site actually
  uses Switzer. Also still said "4 services" after 1dd0b74 made it 5. Both fixed.

### Not done — decisions for the client, listed in the study §7
- Real phone / WhatsApp / email / street address (gated by `seo:check`)
- **`public/hero.mp4` is also wind-turbine footage** — 3.3 MB, wrong
  technology, first thing a visitor sees
- Service and project photos are Unsplash stock, but the four projects are
  captioned as real Delta installs in named towns
- No Google Business Profile URL in `CONTACT.sameAs`
- Contact form still does not send anywhere

---

# Archived — Task: Services grid — hover bug + content update (commit 1dd0b74)

## 1. Hover bug (content vanishes on mouse-over)
**Root cause (confirmed):** `useReveal` adds the `is-in` class imperatively via
`el.classList.add('is-in')`, but `Services.jsx` renders the same element with a
React-controlled template-literal className that changes on hover
(`svc reveal ${hover ? 'is-hover' : ''}`). When hover state flips, React
re-assigns `node.className`, wiping the externally-added `is-in`. The card falls
back to `.reveal { opacity: 0 }` and disappears. It only reappears after
scrolling out and back in, because that re-fires ScrollTrigger's `onEnter`.
This exactly matches the client's repro steps.

- [x] Mark reveal state with a `data-in` attribute instead of a class, so React
      re-renders can never clobber it (fixes the whole reveal system, not just
      this one card).
- [x] Update `.reveal.is-in` -> `.reveal[data-in]` in `index.css`.
- [x] Hover lift used `transform`, which fights `.reveal`'s `transform`. Move it
      to the independent `translate` property so the two compose.

## 2. Services grid content — 4 items -> 5 items
- [x] Item 1: Residential solar rooftop
- [x] Item 2: Commercial and industrial rooftop solar solution
- [x] Item 3: Hybrid solar solution (new)
- [x] Item 4: Solar EV charging (new)
- [x] Item 5: Inverters and backup UPS
- [x] Removed "Net metering & KSEB approvals" card per client list
      (topic still covered by the Subsidy / KSEB process section).
- [x] Add `hybrid` + `ev` icons to the shared icon set.
- [x] Desktop grid: 4-col -> 6-col with spans = 3 cards on row 1, 2 wide cards
      on row 2 (no dangling empty cell).
- [x] Verify every card image URL returns 200 and is topically correct.

## Review

### Verified in a real browser (Playwright + Chromium)
Reproduced the bug on the original code, then confirmed the fix on the new code.

**Original code — bug reproduced:**
| moment | className | opacity |
| --- | --- | --- |
| after scroll-in | `svc reveal is-in` | 1 |
| on hover | `svc reveal is-hover` | **0** (card gone) |
| after mouse leaves | `svc reveal ` | **0** (stays gone) |

React re-assigned `node.className` on the hover re-render, dropping `is-in`.

**Fixed code:** opacity stays `1` through a two-pass hover of all five cards,
`data-in` survives every re-render, and the hover lift now actually applies
(`translate: 0px -4px`).

### Extra finding: the hover lift never worked
`.svc.is-hover { transform: translateY(-4px) }` (sections.css) and
`.reveal.is-in { transform: none }` (index.css) had equal specificity, and
index.css is bundled *after* sections.css (verified by byte offset in the built
CSS: 25190 vs 7650), so `transform: none` silently won and the card never lifted.
Moving the lift to the independent `translate` property fixes it — the two
properties compose instead of competing.

### Regression checks
- All 34 `.reveal` elements page-wide reach opacity 1 — the `data-in` switch
  broke no other section.
- Mobile (390x844): 5 cards, rail still scroll-snaps, no horizontal page overflow.
- `prefers-reduced-motion`: all 5 cards visible.
- Keyboard focus path (`onFocus`) behaves like hover.
- Production build passes; no `is-in` string remains in the JS or CSS bundle.
- All 5 card image URLs return HTTP 200 and were opened and visually checked
  (one candidate turned out to be an unrelated stock photo and was rejected).

### Files changed
- `src/lib/useReveal.js` — reveal state as `data-in` attribute, not a class.
- `src/index.css` — `.reveal.is-in` -> `.reveal[data-in]`.
- `src/styles/sections.css` — hover lift via `translate`; 6-col desktop grid (3+2).
- `src/components/Services.jsx` — five services, client's exact wording.
- `src/components/common.jsx` — new `hybrid` and `ev` icons.

### Not done (out of the two requested items) — flagged for the client
- `src/components/Contact.jsx` and `src/components/Footer.jsx` still carry
  placeholder contact data (`+91 XXXXX XXXXX`, `tel:+910000000000`,
  `hello@deltaenergy.in`). No GSTIN, no Google Maps embed.
- `src/components/Subsidy.jsx:34` still reads "We handle the paperwork ->",
  which Audio 6 asked to remove.
