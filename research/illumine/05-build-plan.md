# 05 — Turning the SPA into a multi-page site

Research notes, not an approved plan. Nothing here has been implemented.

## The three things that must change

Delta is a single-route app. Three files assume that, and all three need to
learn about a route list.

### 1. Routing — there is none

`package.json` has no router. `App.jsx` renders eight sections in a fixed
order. Adding pages means either `react-router-dom` or a small hand-rolled
route table.

Given the site is prerendered to static HTML and every route is known at build
time, a **route manifest** is enough and avoids a dependency:

```js
// src/routes.jsx
export const ROUTES = [
  { path: '/',                   Page: Home,       title: …, description: … },
  { path: '/subsidy/',           Page: Subsidy,    … },
  { path: '/savings-calculator/', Page: Calculator, … },
  …
]
```

`react-router-dom` is still the safer call if any page ever needs client-side
navigation or a dynamic segment (`/projects/:slug`). Decide before writing the
first page, not after.

### 2. `scripts/prerender.mjs` renders exactly one page

It reads `dist/index.html`, finds `<div id="root"></div>`, and writes one
`renderToString(<App />)` into it. For N routes it must loop: render each
route, write `dist/<path>/index.html`, and inject that route's own `<title>`,
`<meta description>` and `<link rel=canonical>` — not the homepage's.

The existing guard rails are worth keeping: it fails the build on a missing
root div, and it fails on any React warning during render. Extend, don't
replace.

### 3. `scripts/gen-seo.mjs` emits a one-URL sitemap

Verified: exactly one `<loc>` in the file, hard-coded to `abs('/')`. It must
loop the same route manifest. `llms.txt` and the JSON-LD `@graph` should widen
too — one `WebPage` node per route, `Service` nodes pointing at their own
detail URLs instead of `#anchors`.

## What the section components give you for free

`src/styles/sections.css` already carries the vocabulary a money page needs.
From the class inventory:

| Illumine section | Delta equivalent that already exists |
| --- | --- |
| Hero + counter | `.hero`, `.stat__num` (count-up in `Stats.jsx`) |
| Client logo wall | `.footer__brands` — needs promoting to a section |
| Service cards | `.svc*` (hover-reveal, 5 cards) |
| Subsidy tiers + steps | `.subsidy2__tier*`, `.subsidy2__step*` |
| Testimonials | **missing** — no class, no component |
| Per-page FAQ | `.faq*` — exists, but `FAQS` is one global array |
| CTA band | `.cta__card`, `.cta-wrap` |
| Enquiry band | `.contact__form` — exists, but only as a full section |
| Floating WhatsApp | `.floaters`, `.floater--wa` ✓ |

**Two new components needed:** `Testimonials` and a compact `EnquiryBand`
(the Type-A section 3 — a form that sits high on a page, not the full contact
section). Everything else is a re-composition of what's built.

## Content model

Keep the `site.config.js` discipline — it is the reason Delta's subsidy figure
can't disagree with itself the way Illumine's does. But a single flat file will
not hold 6+ pages of long-form copy comfortably.

Suggested split, same idea one level deeper:

```
site.config.js          identity, contact, area, brands, images   (unchanged)
content/services.js     the 5 services + their long-form detail
content/projects.js     case studies
content/faqs.js         keyed by page: { home: [...], subsidy: [...] }
content/testimonials.js
content/towns.js        the 5 Malappuram-district town pages
```

`gen-seo.mjs` and `prerender.mjs` import the same modules the components do —
so a fact still lives in exactly one place.

## Sequencing

1. Route manifest + multi-route prerender + multi-URL sitemap. **Ship this with
   only the existing homepage split across `/`.** Prove the pipeline before
   adding content.
2. `Testimonials` + `EnquiryBand` components.
3. Tier-1 pages (`04-delta-gap-analysis.md`).
4. Per-page FAQ keying.
5. Tier-2 pages as content arrives.

## Open questions for the client

- Does Delta want a blog? It's the bulk of Illumine's footprint and the only
  part that needs ongoing effort. A site without one still competes on the
  commercial keywords.
- Off-grid: sell it or not? It's a service-line decision, not a web decision.
- Where should form submissions go — email, WhatsApp Business, or a CRM?
