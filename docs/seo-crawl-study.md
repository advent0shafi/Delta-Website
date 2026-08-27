# SEO & Crawlability Study — Delta Energy Solutions

**Scope:** how this site is indexed today, what each class of crawler actually
receives, and what was changed.
**Method:** every claim below was reproduced against the real build on this
machine. Commands are included so any of it can be re-run.
**Baseline commit:** `6db2c8c` (before this work).

---

## 0. The one-paragraph version

The site had *good metadata attached to a blank page.* It is a client-rendered
React SPA: the file the server sends contains `<div id="root"></div>` and
nothing else. Google can render JavaScript and eventually saw the content;
GPTBot, ClaudeBot, PerplexityBot, Common Crawl and every social-media scraper
cannot, and saw a blank page. On top of that the structured data declared a
schema.org type that **does not exist**, so the local-business block was
discarded outright; the heading tree skipped levels; the `<h1>` named neither
the service nor the town; and the image on every WhatsApp share was a stock
photo of *wind turbines.*

The page a crawler receives went from **0 to 4,208 characters** of readable
text and from 0 to 29 headings, with a valid 10-node structured-data graph.

---

## 1. How the site is built and served

```
src/*.jsx ──vite build──▶ dist/index.html   (shell: empty #root)
                          dist/assets/index-*.js   (430 kB, 144 kB gzipped)
                          dist/assets/index-*.css
```

`src/main.jsx` mounts React into `#root` in the browser. **Every word of copy
lives inside that JavaScript bundle** — the headline, the five services, the
FAQ answers, the phone number, all of it.

Baseline proof:

```console
$ sed -n '/<body>/,/<\/html>/p' dist/index.html
  <body>
    <div id="root"></div>
  </body>
</html>
```

That was the entire body of the document. 3,741 bytes of file, zero bytes of
content.

---

## 2. How crawling actually works

### 2.1 Google: two waves, and a queue in between

Googlebot does not process a page in one pass.

```
     ┌──────────────┐      ┌──────────────────┐      ┌───────────────┐
     │  1. CRAWL    │─────▶│  2. INDEX (HTML) │─────▶│  Index entry  │
     │  fetch HTML  │      │  parse, extract  │      │  created now  │
     └──────────────┘      └────────┬─────────┘      └───────────────┘
                                    │ page needs JS
                                    ▼
                          ┌──────────────────────┐
                          │  RENDER QUEUE        │  ← minutes to days
                          │  (budget-limited)    │
                          └──────────┬───────────┘
                                     ▼
                          ┌──────────────────────┐
                          │  3. RENDER + REINDEX │
                          └──────────────────────┘
```

Wave 1 sees only the raw HTML. For this site, wave 1 saw a `<title>`, a
`<meta description>` and an empty div — so the *first* thing Google learned
about Delta was that the page had no content. Wave 2 runs a headless Chromium
and does eventually see the real page, but it is queued and budget-limited,
and every re-crawl pays that cost again.

Rendering is not free and it is not guaranteed. A page that carries its
content in the first response skips this entire branch.

### 2.2 Everyone else: one wave, no JavaScript

This is the part that mattered most here.

| Client | Executes JS? | What it saw before | What it sees now |
|---|---|---|---|
| Googlebot | Yes, deferred (wave 2) | Empty → content, eventually | Content immediately |
| Bingbot / Copilot | Limited | Unreliable | Content immediately |
| **GPTBot** (ChatGPT) | **No** | Nothing | Full page |
| **OAI-SearchBot** | **No** | Nothing | Full page |
| **ClaudeBot** | **No** | Nothing | Full page |
| **PerplexityBot** | **No** | Nothing | Full page |
| **CCBot** (Common Crawl) | **No** | Nothing | Full page |
| **Google-Extended** (AI Overviews) | **No** | Nothing | Full page |
| facebookexternalhit / WhatsApp | **No** | OG tags only | OG tags only *(by design)* |
| Twitterbot / LinkedInBot / Slackbot | **No** | OG tags only | OG tags only *(by design)* |

Two different things are going on in that table, and it is worth keeping them
apart:

- **Social scrapers only ever wanted the `<meta>` tags.** They were working
  fine. Their problem was not crawling, it was that `og:image` pointed at the
  wrong picture (§4.4).
- **The AI crawlers wanted the page body,** and got an empty div. This is the
  category that was completely broken. Common Crawl is a plain HTTP fetch with
  no browser at all; GPTBot and ClaudeBot are not documented to render
  JavaScript and do not in practice.

The practical consequence: *"who installs rooftop solar in Malappuram?"* is
the exact question Delta wants an assistant to answer, and until now the only
thing any assistant could have learned from this site was its meta
description.

### 2.3 A subtlety: the reveal animation

`src/index.css` styles 34 elements as `.reveal { opacity: 0 }`, made visible by
a GSAP ScrollTrigger as the user scrolls. A rendering crawler loads the page
at a fixed viewport and does not necessarily scroll, so content below the fold
can stay at `opacity: 0` during render.

This is a smaller risk than it sounds — the elements are in the DOM, and
`opacity: 0` is not the same signal as `display: none` — but it is a second,
independent reason not to depend on rendering. With the page prerendered, the
text is in the source regardless of what any animation does.

The count-up statistics were a sharper version of the same problem, and a real
content bug: the markup literally said `₹0`, `0%`, `0+` because those were the
animation's *starting* values (`Stats.jsx`, old line 114). Anything reading the
DOM before a scroll read zeros. Fixed in §5.3.

---

## 3. What a crawler receives — measured

Reproduce with:

```bash
npm run build
python3 - <<'PY'
import re
h = open('dist/index.html', encoding='utf8').read()
b = h[h.index('<div id="root">'):]
b = re.sub(r'<script[\s\S]*?</script>', '', b)
t = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', b)).strip()
print(len(t), 'chars of readable text')
PY
```

| Measure | Before | After |
|---|---:|---:|
| Markup inside `#root` | 0 | 33,649 chars |
| Readable text | 0 | 4,208 chars |
| Headings in source | 0 | 29 |
| `<h1>` containing "rooftop solar" / "Malappuram" | no | yes |
| Structured-data nodes that validate | 0 | 10 |
| FAQ answers reachable without JS | 0 of 5 | 5 of 5 |

The same bytes are served to every user agent — there is no cloaking and no
per-bot branching. Confirm:

```bash
curl -s -A "GPTBot/1.0" http://localhost:4317/ | grep -c "Rooftop solar"
```

---

## 4. Defect register

Ranked by impact. Every line was verified in the baseline code.

### 4.1 — CRITICAL · No content for non-rendering crawlers

`dist/index.html` shipped an empty `#root`. Every AI crawler and social
scraper received a page with no body content.
**Fixed:** build-time prerender, §5.1.

### 4.2 — CRITICAL · Structured data used a type that does not exist

`index.html:53` declared:

```json
"@type": "SolarPanelInstaller"
```

There is no such schema.org type. `HomeAndConstructionBusiness` has exactly
eight subtypes — Electrician, GeneralContractor, HVACBusiness, HousePainter,
Locksmith, MovingCompany, Plumber, RoofingContractor — and `SolarPanelInstaller`
is not among them (checked against schema.org directly).

An unrecognised `@type` is discarded. The address, the opening hours, the
service area — all of it was ignored. And it fails *silently*: nothing warns
you, the rich result simply never appears.

The same block also published `"telephone": "+91-00000-00000"`, a fabricated
number, as fact about a real business.

**Fixed:** valid `["LocalBusiness", "HomeAndConstructionBusiness"]`, and the
placeholder phone is now **omitted** rather than published, §5.4.

### 4.3 — HIGH · The `<h1>` carried no service and no location

Was: *"Solar power, done right."* — the single strongest on-page signal, spent
on a phrase that names neither what the company does nor where it does it,
while the `<title>` said "Rooftop Solar in Malappuram, Kerala".

**Fixed:** *"Rooftop solar in Malappuram."*, §5.3.

### 4.4 — HIGH · The share image was the wrong technology

`public/og.jpg` was a stock photograph of two workers walking past **wind
turbines**. No branding, no text, and the wrong industry for a solar
installer. This was the image on every WhatsApp forward and Facebook share.

**Fixed:** branded card generated from the site's own design tokens, §5.5.

> **Still open — the hero video has the same problem.** `public/hero.mp4`
> (3.3 MB) is also wind-turbine footage. It is the first thing a visitor sees.
> Replacing it is a content decision, not a code change — see §7.

### 4.5 — MEDIUM · Broken heading hierarchy

| Location | Was | Problem |
|---|---|---|
| `Subsidy.jsx:64` | `<h4>` | jumped h2 → h4 |
| `Footer.jsx:50,55` | `<h4>` | no h2 or h3 above them at all |
| `FAQ.jsx:35` | `<button><span>` | five questions, not a heading between them |

Crawlers build a document outline from heading levels; a skipped level breaks
the tree. FAQ questions in particular are exactly the kind of content that
should be a heading.
**Fixed:** §5.3. Verified: 29 headings, zero skipped levels.

### 4.6 — MEDIUM · Missing machine-readable files

No `llms.txt`, no web manifest. `robots.txt` was three lines with no policy on
any AI crawler. `sitemap.xml` had no `<lastmod>`.
**Fixed:** §5.6.

### 4.7 — MEDIUM · LCP blocked by a 3.3 MB video

`Hero.jsx` had `preload="auto"` with no `poster`. The hero video is the
largest contentful paint on mobile, and Core Web Vitals is a ranking input.
**Fixed:** `poster` + `preload="metadata"`, §5.5.

### 4.8 — MEDIUM · Favicon was a squashed wordmark

`<link rel="icon" href="/brand/delta-color.png">` — a **3354×866** logo used as
a favicon and as the 180×180 apple-touch-icon. Browsers squash it to a square.
**Fixed:** proper square icon set, §5.5.

### 4.9 — LOW · Accessibility and form semantics

Verified in the baseline: calculator `<label>` elements had no `htmlFor` and
did not wrap their inputs, so none were associated with a control; contact
inputs had no `name` or `autocomplete`; `<section>` landmarks were unnamed;
the FAQ accordion had `aria-expanded` but no `aria-controls`; the services
card flipped `aria-hidden` on hover, pushing an image in and out of the
accessibility tree as the pointer moved; there was no skip link.

These overlap with SEO because the same structure feeds both.
**Fixed:** §5.3.

---

## 5. What changed

### 5.1 Build-time prerender — `scripts/prerender.mjs`

```
npm run build
  ├─ vite build              → dist/ (shell + bundles)
  └─ node scripts/prerender.mjs
        ├─ esbuild bundles src/App.jsx for Node
        ├─ react-dom/server renderToString(<App />)
        └─ inject markup into <div id="root">…</div>
```

**No new dependencies.** esbuild already ships inside Vite; `react-dom/server`
already ships inside `react-dom`. Nothing needs a headless browser, so the
build still runs on any CI or host that has Node.

Two details worth knowing:

- **`renderToString`, not `renderToStaticMarkup`.** The static variant emits
  cleaner HTML but strips the `<!-- -->` markers React puts between adjacent
  text nodes. `main.jsx` hydrates this markup, and without those markers every
  place two values are interpolated side by side — the footer copyright,
  "Malappuram, Kerala" — merges into one text node and hydration reports a
  mismatch.
- **The script fails the build on any React warning during render.** This
  earned its keep immediately: it caught a `fetchPriority` prop that React 18
  does not recognise (that spelling landed in React 19).

`src/main.jsx` hydrates when `#root` already has children and falls back to a
fresh render when it does not, so `npm run dev` still works against the empty
shell.

### 5.2 One source of truth — `site.config.js`

Services, FAQs, subsidy tiers, projects, contact details and brand identity
now live in one file, imported by both the React components and the
generators. The page and the structured data are built from the same array, so
they cannot drift — which is how the markup ended up advertising a phone
number of `+91-00000-00000` in the first place.

### 5.3 Hierarchy and semantics

Heading tree, verified in the built output:

```
h1  Rooftop solar in Malappuram.
├── h2  Energy in a few numbers.            (stats)
├── h2  Everything you need to go solar.    (services)
│   └── h3 ×5   one per service
├── h2  Installed across Kerala.            (projects)
│   └── h3 ×4   one per project
├── h2  The govt pays you to go solar.      (subsidy)
│   └── h3  How going solar works, in three steps   (sr-only)
│       └── h4 ×3   the steps
├── h2  Go solar, save big.                 (calculator)
├── h2  Frequently asked questions.
│   └── h3 ×5   the questions, now real headings
├── h2  Ready to cut your KSEB bill?        (contact)
├── h2  Start your solar journey today.     (CTA)
└── h2 ×2  Explore / Contact                (footer landmark)
```

Also: every `<section>` named via `aria-labelledby`; a skip link; `.sr-only`
utility; contact details in `<address>`; FAQ `aria-controls` + panel `role`;
calculator labels bound with `htmlFor`, mode buttons as `aria-pressed`
toggles, results `aria-live`; form fields given `name` and `autocomplete`;
`lang="en"` → `lang="en-IN"`; the subsidy steps are an `<ol>` because they are
an ordered process.

The stat figures now render their **real values** in the markup, and the
count-up resets to zero in `onStart` — the instant the animation actually
begins — rather than at setup. A crawler that renders JavaScript but never
scrolls reads `₹78,000`, not `₹0`.

### 5.4 Structured data — a valid `@graph`

Ten linked nodes, generated by `scripts/gen-seo.mjs`:

`Organization` · `WebSite` · `WebPage` ·
`LocalBusiness` + `HomeAndConstructionBusiness` ·
`Service` ×5 · `FAQPage` (all five Q&As)

The FAQPage node matters more than usual here: only the *open* accordion item
is in the DOM, so this is how the other four answers reach a crawler at all.

Placeholder contact data is omitted, not published. An absent `telephone` is
missing data; a fake one is a wrong fact about a real business.

### 5.5 Images — `scripts/og-images.mjs`

Generated with headless Chrome from the site's own tokens (`#0E3A4A`,
`#5BB715`, Switzer, the diagonal line motif used by the stats and CTA bands):

| File | Size | Purpose |
|---|---|---|
| `og.jpg` | 1200×630 | Open Graph / Twitter |
| `og-square.jpg` | 1200×1200 | WhatsApp and messengers |
| `apple-touch-icon.png` | 180×180 | iOS home screen |
| `favicon-32.png`, `favicon-16.png`, `favicon.ico` | — | browser tabs |
| `hero-poster.jpg` | 1280×720 | video poster, kills the 3.3 MB LCP |

The icons are the wordmark's distinctive slanted **D**, clipped to a measured
box and centred on brand petrol. The wordmark is italic and its glyphs overlap
horizontally, so there is no transparent gutter to detect automatically — the
crop box in the script was measured by eye and is documented there.

This script is **not** part of `npm run build`; outputs are committed and it is
run by hand (`npm run og`) when the brand or copy changes. That keeps Chrome
and ImageMagick out of the deploy path.

### 5.6 Machine-readable files

- **`llms.txt`** — plain-text brief for AI crawlers: services, service area,
  subsidy tiers, the process, indicative economics, the full FAQ, contact.
  Generated from the same config the page renders from.
- **`robots.txt`** — every AI crawler named explicitly with a one-line reason,
  each in its own block so any one can be flipped to `Disallow` on its own.
  Answer engines are **allowed on purpose**; high-volume scrapers with no
  user-facing product (Bytespider, AhrefsBot, SemrushBot, MJ12bot) are blocked.
- **`sitemap.xml`** — `<lastmod>` plus an image entry.
- **`site.webmanifest`**, **`humans.txt`**.

---

## 6. Keeping it fixed

```bash
npm run seo:gen     # regenerate robots/sitemap/llms/manifest + JSON-LD
npm run og          # regenerate share images and icons (needs Chrome + ImageMagick)
npm run build       # vite build + prerender
npm run seo:check   # assert the whole lot
```

`scripts/seo-check.mjs` fails on: an empty `#root`, more or fewer than one
`<h1>`, any skipped heading level, an `<img>` with no `alt`, head tags that
have drifted from `site.config.js`, a relative `og:image`, JSON-LD that does
not parse, any of the known-bogus schema types (including
`SolarPanelInstaller`, so §4.2 cannot come back), a FAQPage or Service count
that disagrees with the config, missing or empty assets, an `og.jpg` whose
real dimensions differ from the declared ones, and a `robots.txt` that blocks
everything or has lost its sitemap line.

Current state: **28 passed, 1 warning, 1 failure** — the failure is the
intentional pre-launch gate on placeholder contact details.

---

## 7. Open items — decisions for Delta, not code

1. **Real contact details.** `+91 XXXXX XXXXX`, `tel:+910000000000` and
   `hello@deltaenergy.in` are still placeholders. Set them in
   `site.config.js` → `CONTACT`, flip `isPlaceholder: false`, re-run
   `npm run seo:gen`. `seo:check` fails until this is done, by design.
2. **The hero video is wind turbines** (§4.4). Wrong technology, 3.3 MB, first
   thing a visitor sees. Replace `public/hero.mp4` with rooftop-solar footage
   and re-run `npm run og` to refresh the poster.
3. **Service and project photos are Unsplash stock.** The four projects are
   presented as Delta's own installs in Manjeri, Kottakkal, Tirur and
   Perinthalmanna. Using stock photography for named local jobs is a
   trust-and-accuracy problem before it is an SEO one.
4. **No Google Business Profile link.** `CONTACT.sameAs` is empty. For a local
   business this is one of the highest-value remaining signals — it connects
   the site to the map listing.
5. **Street address.** `PostalAddress` currently carries only locality and
   region. A full address strengthens local ranking considerably.
6. **The contact form does not send anywhere.** `Contact.jsx` shows a success
   state on submit and discards the data.
7. **`FAQPage` rich results** are restricted by Google to recognised
   authoritative sites, so expect no rich snippet from it. The markup is still
   worth having: answer engines and entity extraction both read it.
