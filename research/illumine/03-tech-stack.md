# 03 — How it's built

## Their stack

| Layer | Illumine | Delta today |
| --- | --- | --- |
| Build | **Mobirise Website Builder v4.8.10** (2018 desktop app) — static HTML committed as-is | React 18 + Vite 5, prerendered to static HTML |
| CSS | Bootstrap 4 alpha + Mobirise theme CSS, per-block `cid-*` classes | Hand-written CSS with a token layer in `index.css` |
| JS | jQuery, Tether, Popper, `jarallax`, `viewportchecker`, `touchswipe`, `ytplayer`, `vimeo_player`, `smooth-scroll` | GSAP + Framer Motion + Lenis |
| Forms | `form-submit.php` (PHP POST + a text captcha) | `Contact.jsx` — shows success, **sends nowhere** |
| Second template | `/landing_page_assets/` — a bought Bootstrap landing theme | n/a |
| Analytics | GA4 `G-0RQ8TD96XG`, Google Ads `AW-609053364` w/ phone-call conversion, Meta pixel, MS Clarity | none |
| Hosting | plain static + PHP | static |

## What they do that Delta doesn't — and should

1. **Conversion tracking.** Google Ads is wired to a *phone-call* conversion
   (`phone_conversion_number: '0484 255 7377'`). They are running paid search
   and can see which pages produce calls. Delta has no analytics at all.
2. **A working form.** `Contact.jsx` renders a success state without
   transmitting anything — a lead-losing bug the moment the site goes live.
   This is the single highest-priority fix in the repo, independent of any
   new pages.
3. **WhatsApp on every money page.** Delta has floating WhatsApp/Call buttons
   in `Footer.jsx` already ✓ — but pointed at `+910000000000`.
4. **Phone number above the hero.** Top bar, every landing page, tappable.
5. **A real sitemap with 95 URLs.** Delta's `gen-seo.mjs` emits exactly one
   `<loc>` (`/`). Multi-page means this generator must loop.

## What they do that Delta should not copy

- **jQuery-era everything.** ~14 JS files on the homepage before any content.
- **`document.write(new Date().getFullYear())` in the footer** — and it's
  HTML-escaped on most pages, so several pages literally render the string
  `document.write(new Date().getFullYear());` next to the copyright.
- **No image pipeline.** Raw JPEGs, no `srcset`, no lazy-loading, no WebP.
- **`alt` text stuffed with keywords** — `alt="Mobirise"` on one image,
  `alt="solar panel cost in kerala"` on a decorative thumbnail. Delta's
  `site.config.js` already writes descriptive alts; keep that discipline.
- **Duplicated body copy across ranking pages** (see `01-site-map.md`).
- **`<a href="" id="submit-form">` as a form submit** — breaks without JS.
- **No structured data anywhere.** Delta already emits a JSON-LD `@graph`
  from `gen-seo.mjs`; that's a real advantage to extend, not abandon.

## Delta's structural advantage

`site.config.js` is a single source of truth consumed by both the React render
and `gen-seo.mjs`. Illumine has the same content pasted into 95 hand-edited
HTML files — which is exactly why their subsidy figure, customer counter and
FAQ answers disagree between pages.

Any multi-page expansion should preserve that property: **new pages mean new
data in `site.config.js` (or a sibling content module), not new hard-coded
JSX.** See `05-build-plan.md`.
