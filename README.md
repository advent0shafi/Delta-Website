# Delta Energy Solutions — Website

A minimal, award-style site for Delta Energy Solutions
(on-grid rooftop solar, Malappuram / Kerala). Built **mobile-first** with
**React + Vite**, animated with **GSAP**, **Framer Motion**, and **Lenis**
smooth scroll.

The visual language is a brand-true take on the Virya Energy reference:
warm paper sections, deep petrol-forest dark sections, two-tone headings,
fully-rounded pill buttons, large rounded cards, the signature hover-reveal
service cards, and a full-bleed **video hero**. Re-skinned into the Delta
brand — petrol-forest `#0E3A36` + green `#5BB715` on warm paper `#F4F1EA`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build    # vite build + prerender -> dist/
npm run preview  # serve the built site locally
```

Requires Node 18+.

### The other scripts

```bash
npm run seo:gen    # regenerate robots.txt / sitemap.xml / llms.txt /
                   # site.webmanifest and the JSON-LD block in index.html
npm run og         # regenerate share images + favicons (needs Chrome + ImageMagick)
npm run seo:check  # assert the built page is crawlable and consistent
```

`seo:gen` and `og` are run by hand when content or brand changes; their
outputs are committed. Only `build` runs on deploy, and it needs nothing
beyond Node.

## Rendering — read this before changing the build

`npm run build` is `vite build && node scripts/prerender.mjs`. The prerender
step renders `<App />` to HTML and injects it into `#root`, because Vite alone
ships an empty `<div id="root"></div>` — and GPTBot, ClaudeBot, PerplexityBot,
Common Crawl and every social scraper execute no JavaScript, so that empty div
was all they ever saw.

It uses only esbuild (inside Vite) and `react-dom/server` (inside react-dom),
so there are no extra dependencies and no headless browser in the build.

`src/main.jsx` calls `hydrateRoot` when `#root` already has children and
`createRoot` when it does not, so `npm run dev` still works against the empty
shell.

The prerender **fails the build on any React warning**, which is intentional —
a warning during server render usually means a hydration mismatch is coming.

See `docs/seo-crawl-study.md` for the full picture.

## Content lives in one place

`site.config.js` holds the services, projects, FAQs, subsidy tiers, brands and
contact details. Both the React components and the file generators import from
it, so the page and its structured data cannot drift apart. **Edit content
there, not in the components.**

## Pages

Six routes, listed in `site.routes.js` — the single source for paths, titles
and descriptions, read by the components *and* by every build script. Adding a
page means adding an entry there and a component in `src/routes.jsx`; the
sitemap, `llms.txt` and the prerenderer pick it up automatically.

| Path | Sections |
| --- | --- |
| `/` | Hero · Stats · Services · Projects · Subsidy · Calculator · FAQ · Contact |
| `/about/` | Story · Timeline · Team · Credentials · Stats · FAQ · Contact |
| `/services/` | Services · Equipment guidance · Stats · FAQ · Contact |
| `/services/residential/` | Long-form detail · Suits-you-if · FAQ · Contact |
| `/services/commercial/` | ” |
| `/services/hybrid/` | ” |
| `/services/ev-charging/` | ” |
| `/services/inverters-ups/` | ” |
| `/subsidy/` | Subsidy · Full KSEB + PM Surya Ghar process · FAQ · Contact |
| `/kseb-net-metering/` | Net vs gross, meters, banking, outages · FAQ · Contact |
| `/savings-calculator/` | Calculator · What it assumes · Subsidy · FAQ · Contact |
| `/projects/` | Projects · Stats · Process · FAQ · Contact |
| `/contact/` | Contact · FAQ |

The five service detail pages are generated from `SERVICES[].id` in
`site.config.js`, so the slug, the card, the page and the schema.org `Service`
node cannot drift apart.

The first section on each route supplies the page's `<h1>` (via `headingAs`),
and its nested headings shift down with it — `npm run seo:check` rejects a
skipped heading level.

## Where the words live

Long-form copy is in `content/`, which follows the same contract as
`site.config.js`: pure data, no JSX, no Node APIs, so the browser bundle and
the build scripts read the same file.

| File | What it holds |
| --- | --- |
| `content/faqs.js` | 60 questions in 12 route-keyed sets, plus `FAQS_BY_ROUTE` |
| `content/netmetering.js` | KSEB net metering explainer |
| `content/process.js` | The KSEB + PM Surya Ghar journey, step by step |
| `content/equipment.js` | Panel, inverter, warranty and mounting guidance |
| `content/calculator.js` | The method behind the savings estimate |
| `content/services.js` | Long-form body for each of the five services |
| `content/about.js` | **Mock content** — see the warning below |

### Publishing rules these files follow

The site makes regulatory claims about somebody's real business, so:

- **Every figure traces to a primary source** — KSEB's Solar Rooftop Portal,
  the PM Surya Ghar subsidy structure, or the assumptions already documented in
  `docs/calculator-logic.md`.
- **Contested figures are omitted, not guessed.** Kerala's framework is
  mid-revision: the KSERC (Renewable Energy and Related Matters) Regulations,
  2025 were notified in November 2025 and stayed by the High Court days later,
  and published summaries of the new capacity caps disagree. Approval timelines
  competitors quote (15 / 135 / 10 days) appear on no official KSEB page. None
  of it is published here; the pages say the position is moving and link the
  portal instead.
- **No invented business facts** — no testimonials, customer counts, awards or
  firm prices. Those need the client, and are listed in
  `research/illumine/04-delta-gap-analysis.md`.
- **Each long-form section carries a "Last reviewed" date.** Revisit these
  files when the KSERC regulation's status resolves.

### `content/about.js` is the one exception

The About page ships **mock content** so the layout can be reviewed before the
client has supplied anything. The founding story, the milestone dates, the team
and the credentials are all invented.

It is gated the same way the placeholder phone number is:

- `ABOUT.isPlaceholder: true` — the page renders, but nothing in it reaches the
  schema.org graph, and `npm run seo:check` **fails**.
- `ABOUT.needsFromClient` lists exactly what has to be replaced.
- Set `isPlaceholder: false` only once every field is confirmed.

An absent fact is missing data. A fabricated one is a wrong fact published
under Delta's name, which is why it holds the launch gate shut.

## What's on the page

Nav (transparent over the homepage hero → solid paper on scroll and on every
other route, logo swaps white→colour) · **Hero** (full-bleed background video,
`public/hero.mp4`) · Stats strip (count-up, forest) · Services (5 hover-reveal
cards) · Projects rail · Subsidy + how-it-works (PM Surya Ghar, 3 steps) ·
Savings Calculator (interactive, KSEB tariffs pre-filled) · FAQ (accordion) ·
Contact form · CTA band + Footer + mobile floating WhatsApp/Call buttons.

The calculator sizes a system from monthly bill / units / roof area, applies
the residential subsidy tiers (1 kW ₹30k, 2 kW ₹60k, ≥3 kW ₹78k; commercial =
nil) and shows generation, annual savings, net cost and payback.

## Before you go live — replace these placeholders

`npm run seo:check` fails while any of these are outstanding. That is on
purpose: it is the pre-launch gate.

- ~~**Phone / WhatsApp / email**~~ — **done.** `CONTACT` now carries the real
  number, email, street address, postcode and GSTIN, and `isPlaceholder` is
  `false`, so `telephone`, `email`, `taxID` and `hasMap` are published in the
  structured data.
- **About page content** — `content/about.js` is mock. See the warning above;
  it holds the gate shut on its own.
- **Hero video** — `public/hero.mp4` is 3.3 MB of **wind turbine** stock
  footage, which is the wrong technology for a solar company and the first
  thing a visitor sees. Replace it, then `npm run og` to refresh the poster
  frame.
- **Service and project photos** — `site.config.js` -> `SERVICES` / `PROJECTS`
  point at Unsplash stock. The four projects are captioned as real Delta
  installs in named towns, so stock photos there are an accuracy problem, not
  just an aesthetic one.
- **Google Business Profile** — add the URL to `CONTACT.sameAs`. For a local
  business this is one of the highest-value remaining SEO signals.
- **Postcode discrepancy** — the client's billing address gives `676519`,
  which is what `CONTACT.postalCode` publishes. Their Google Business listing
  resolves to `Valiya Varambu Rd, Down Hill, Malappuram, Kerala 676505`. Local
  search leans on the website and the Business Profile agreeing, so the two
  should be reconciled — whichever is correct.
- **Contact form** — `Contact.jsx` shows a success state on submit but does
  not send anywhere. Wire it to your email service / WhatsApp / CRM.

## Design tokens

Brand colours, radii and fonts live in `src/index.css` (`:root`). The
typeface is **Switzer** for both display and body, loaded from Fontshare in
`index.html`. Section styles are in `src/styles/sections.css` and are written
mobile-first (base = phone; `@media (min-width: 720px)` and `1000px` scale up).

## Notes

- Respects `prefers-reduced-motion` (animations are guarded in CSS and JS).
- Logos are in `public/brand/` (white for dark backgrounds, colour for light).
- Manufacturer logos are in `public/partners/`, one file per entry in
  `BRANDS`. Each is that manufacturer's own current mark, taken from their
  own site, trimmed to its ink and never upscaled. Replacing a brand means
  editing `BRANDS` (name, what it supplies, path, intrinsic w/h) and
  rerunning `npm run seo:gen`, which carries the list into the JSON-LD
  `brand` node and `llms.txt`.
- Share images and favicons in `public/` are generated by `npm run og` — edit
  the template in `scripts/og-images.mjs`, not the image files.
- Heading levels are load-bearing: `npm run seo:check` fails if any level is
  skipped. Add headings at the level the document outline expects and style
  them by class, rather than picking a tag for its default size.
