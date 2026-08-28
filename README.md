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
| `/services/` | Services · Stats · Contact |
| `/projects/` | Projects · Stats · Contact |
| `/subsidy/` | Subsidy · FAQ · Contact |
| `/savings-calculator/` | Calculator · Subsidy · Contact |
| `/contact/` | Contact · FAQ |

The first section on each route supplies the page's `<h1>` (via `headingAs`),
and its nested headings shift down with it — `npm run seo:check` rejects a
skipped heading level.

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

- **Phone / WhatsApp / email** — `site.config.js` -> `CONTACT`. Currently
  `+91 XXXXX XXXXX` / `hello@deltaenergy.in`. Set the real values, flip
  `isPlaceholder: false`, then run `npm run seo:gen`. Until that happens the
  JSON-LD deliberately omits `telephone` and `email` rather than publishing a
  fake number as fact.
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
- **Street address** — `CONTACT.streetAddress` / `postalCode` feed the
  `PostalAddress` in the structured data.
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
- Share images and favicons in `public/` are generated by `npm run og` — edit
  the template in `scripts/og-images.mjs`, not the image files.
- Heading levels are load-bearing: `npm run seo:check` fails if any level is
  skipped. Add headings at the level the document outline expects and style
  them by class, rather than picking a tag for its default size.
