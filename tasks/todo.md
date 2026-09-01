# Task: Real prices on the page, and a calculator that agrees with them

Client gave their own prices: 3 kW ₹2,15,000, 5 kW ₹3,20,000, 10 kW ₹4,50,000,
3 kW the most popular. Asked to put them where the PM Surya Ghar subsidy tier
card was.

The three figures were not on one basis — the client confirmed 3 kW and 5 kW
are before subsidy and 10 kW is after it. Carried as ₹5,28,000 before subsidy,
which comes back out at exactly ₹4,50,000 in the card's derived line.

## The card

- [x] `SYSTEM_PRICES` in site.config.js — size, price before subsidy, `hot`
- [x] `SUBSIDY_TIERS` stays: it is the statutory schedule, it feeds the share
      image and llms.txt, and the card's "after subsidy" line is derived from
      it rather than typed, so the two cannot drift
- [x] `subsidyFor()` and `inr()` moved to the config — the schedule was written
      out twice and the rupee formatted two places
- [x] Caption and caveat: a published price with no stated basis is a price
      somebody argues about later

## The calculator, which disagreed by ₹35,000

It costed every system at a flat ₹60,000/kW, so on the same page it said a
3 kW roof costs ₹1,80,000 under a card saying ₹2,15,000. Client chose to align
it and to soften the payback claim with it.

- [x] `costFor(kw)` — interpolates the three quoted sizes, holds the 3 kW rate
      below 3 kW, continues the last segment above 10 kW (₹44,000/kW at 50 kW,
      rather than freezing at the 10 kW rate)
- [x] Stats band 3–5 → 4–7 yrs; planning figures ₹60,000/kW → ₹53,000–₹72,000
- [x] Homepage FAQ, services subsidy copy, calculator methodology, llms.txt,
      the share image, and docs/calculator-logic.md all moved with it

## Verify

- [x] `costFor` hits all three quoted prices exactly; 10 kW after subsidy is
      the client's ₹4,50,000 to the rupee
- [x] Build clean, `seo:check` unchanged at 30 passed / 1 warning / 1 failure
      (the pre-existing About placeholder)
- [x] Card and calculator screenshotted at 1280 and 390 px

## Review

Two judgement calls the client should know about:

- **₹5,28,000 for 10 kW is arithmetic, not a quote.** It is their ₹4,50,000
  plus the ₹78,000 cap. If a 10 kW customer of theirs is not residential, the
  subsidy is zero and that row is wrong — commercial connections get nothing
  from PM Surya Ghar.
- **Payback moved because the real prices are higher than the old assumption
  at domestic sizes.** 3 kW pays back in 5.7 years at ₹5.50 a unit, 4.5 at ₹7.
  The published range is 4–7, which spans the tariffs KSEB customers actually
  pay. The old 3–5 was only reachable at the flat ₹60,000/kW that no longer
  matches their price list.

# Archived — Task: Brand logos, the eight manufacturers we fit (commit 52360a5)

Client named the brands they deal in: WAAREE, ADANI, MICROTEK, SOLAIRE, UTL,
EASTMAN, TSUN, DEYE. The site was still carrying the five placeholder names
(`Tata Power Solar, Waaree, Microtek, V-Guard, Vikram`) as text pills in the
footer, and no logos anywhere.

## Sourcing — every logo from the brand's own site

- [x] WAAREE — shop.waaree.com (BigCommerce store logo, 254×71)
- [x] ADANI SOLAR — adanisolar.com Sitecore media library (227×42)
- [x] MICROTEK — microtek.in `/img/logo.svg` — true vector, kept as SVG
- [x] SOLAIRE — solairefuture.com (600×200; white box behind it keyed out)
- [x] UTL SOLAR — utlsolar.com CDN (1019×150)
- [x] EASTMAN — eastmansolar.in theme assets (182×96)
- [x] TSUN (TSUNESS) — tsun-ess.com header mark (143×50)
- [x] DEYE — deyeinverter.com `logo.svg`, which is a 1705×680 PNG in an SVG
      wrapper; the base64 payload was extracted rather than shipping the wrapper

Two traps found and avoided: the file named `logo` on tsun-ess.com is a *Solar
Storage Magazine* press badge, not TSUN's mark; and Solaire's header PNG is the
white knockout version, invisible on paper — the dark-ink one is a different file.

## Build

- [x] Assets trimmed to their own ink, capped (never upscaled), written to
      `public/brands/`
- [x] `BRANDS` in site.config.js becomes objects — name, what the brand supplies,
      logo path, intrinsic w/h — so the strip and the footer read one source
- [x] New `Brands` section: hairline grid, full colour on paper
- [x] Home (after Services) and /services/ (before the equipment prose)
- [x] Footer pills keep the same eight names, now from the new shape

## Verify

- [x] `npm run build` — prerender + `seo:check` clean
- [x] Heading order holds on both routes (h1 → h2, no jump)
- [x] Every logo legible on paper at the rendered size; nothing pixelated

## Review

Done. Eight logos live in `public/partners/` (44 KB for all eight), a new
`Brands` section renders them on `/` between the services grid and projects,
and on `/services/` between the grid and the "how to read a quote" prose.

Judgement calls worth recording:

- **The logos are full colour on paper, not a monochrome wall.** A dealer's
  brand list is a credential; greyed-out marks read as decoration. The cost is
  eight different colour temperatures in one band, which the hairline grid and
  a fixed optical band for every mark absorb.
- **Every logo came from the manufacturer's own site.** Two near-misses are
  worth knowing about if these are ever refreshed: the file called `logo` on
  tsun-ess.com is a *Solar Storage Magazine* press badge, and Solaire's header
  PNG is the white knockout, which is invisible on paper — the dark-ink version
  is a different file, behind a white box that had to be keyed out.
- **`supplies` is a claim about the brand's line, not Delta's stock.** Several
  of these makers cover more than one category; the label says which one the
  brand is on the list for. One line each in `site.config.js` to change.
- **`seo:gen` had to be rerun by hand.** The JSON-LD `brand` node and
  `llms.txt` both carried the five placeholder names; they now carry the eight
  real ones. `seo:check` is unchanged at 30 passed / 1 warning / 1 failure —
  the failure is the pre-existing About placeholder, verified against a clean
  tree.
- **Two low-resolution sources accepted.** Adani publish their mark at 227×42
  and TSUN theirs at 143×50, and neither has anything larger on their own
  site (TSUN's catalogue PDF was checked too). At the 26–34 px the strip
  renders them, both are at or near 2×. Microtek ships true vector, so that
  one is an SVG.

# Archived — Task: Real contact details, replacing the placeholders (commit ab276c2)

Client supplied the live business details. This retires the launch gate that
has been failing since the site was built.

## What went in

- [x] Phone `+91 75105 00080` → `tel:+917510500080`, `wa.me/917510500080`
- [x] Email `deltampm@gmail.com`
- [x] Address `Valiyavaramb Bypass, Down Hill, Malappuram 676519`
- [x] GSTIN `32AAPFD3008C1Z1` — 15 chars, state code 32 (Kerala), format checked
- [x] Google Business listing → schema.org `hasMap`
- [x] `CONTACT.isPlaceholder: false`

## Where it surfaces

- [x] JSON-LD `LocalBusiness` now publishes `telephone`, `email`, `taxID`,
      `hasMap` and a complete `PostalAddress`.
- [x] Contact section shows the full street address, linked to the map.
- [x] Footer shows the address over two lines and the GSTIN in the legal strip.
- [x] `llms.txt` picks up the phone and email automatically.

## Two judgement calls worth recording

- [x] **The map URL went to `hasMap`, not `sameAs`.** `sameAs` is for identity
      profiles; a map link is not one. Padding `sameAs` with it would have
      silenced a warning that is telling the truth — Delta still has no social
      profiles listed, and that is a real remaining SEO gap.
- [x] **Postcode discrepancy left as the client stated it.** They gave 676519;
      their own Google listing resolves to 676505. Used their value because it
      is their billing address, and flagged it rather than quietly picking one.

## Bug found while doing it

- [x] `checkSameAs` had become unreachable. The `sameAs` warning sat after the
      placeholder `fail()` inside `checkLaunch`, so the moment contact details
      went live the early `return` skipped it — the check switched itself off
      at exactly the point it started mattering. Extracted into its own
      function, called from both branches.

## New guards

- [x] GSTIN format is validated (`fail` on malformed).
- [x] `phoneE164` is validated as an Indian mobile in E.164 — a number with a
      space or a missing country code breaks both WhatsApp and schema.org, and
      is invisible by eye.
- [x] Street address and postcode presence warned on.

## Review

```
LAUNCH
  ✗ the About page is still mock content
  ✓ contact details are marked real in site.config.js
  ✓ GSTIN 32AAPFD3008C1Z1 is well-formed (state code 32)
  ✓ telephone +917510500080 is valid E.164
  ✓ address published: Valiyavaramb Bypass, Down Hill, 676519
  ! no social profiles in CONTACT.sameAs
```

The single remaining failure is the About mock content. Contact is clear.

Verified: no placeholder string (`XXXXX`, `910000000000`, `hello@deltaenergy.in`)
survives anywhere in `dist/` or `public/`; the real phone, email, WhatsApp,
address, GSTIN and map link appear on all 13 pages; Playwright confirms the
`tel:`, `mailto:`, `wa.me` and map hrefs are exact and that the floating call
and WhatsApp buttons dial the real number.

## Still outstanding

- `content/about.js` mock content.
- `Contact.jsx` still shows a success state without sending — now that the
  phone number is real, WhatsApp is a working fallback, but the form itself
  still drops the enquiry.
- No Google Business Profile URL in `CONTACT.sameAs`.

# Archived — Task: About page on mock content (commit f03cd07)

Client ask: "now the about page uses mock ups that resembles of delta as
content" — i.e. build `/about/` now, with realistic stand-in copy modelled on
Delta, rather than waiting for the client's real facts.

This reverses the "verifiable facts only" rule agreed for the previous task,
for this one page. That is the client's call to make. What it does not do is
let invented facts reach production silently.

## 1. The page

- [x] `/about/` — story, timeline, team, credentials, stats, FAQ, contact.
- [x] `content/about.js` — the mock content, in one module, clearly marked.
- [x] `src/components/Milestones.jsx` — timeline, team cards, credentials.
- [x] `ABOUT_FAQS` — written to describe how Delta *works* rather than to
      assert company history, so those five answers stay true even while the
      rest of the page is placeholder.

## 2. The safeguard

Mock content that looks finished is exactly the kind that ships by accident, so
it reuses the pattern already in the repo for the fake phone number:

- [x] `ABOUT.isPlaceholder: true` — the page renders, so it can be reviewed and
      shown to the client.
- [x] Nothing from `content/about.js` reaches the schema.org graph. Verified:
      `gen-seo.mjs` does not import it.
- [x] `npm run seo:check` **fails** while the flag is true, and prints the
      checklist of what the client still has to supply.
- [x] `ABOUT.needsFromClient` holds that checklist next to the data.

## 3. Navigation

- [x] About added to the nav and the footer.
- [x] FAQ dropped from the nav. Every page now carries its own question set, so
      a link to the homepage accordion stopped meaning anything — and it kept
      the bar at five links rather than six.

## Review

13 routes. `/about/` renders 659 visible words, one `<h1>`, no console errors.

```
LAUNCH
  ✗ the About page is still mock content
       Still needed from the client:
         · Real founding year and the actual founding story
         · Milestone dates that happened
         · Project counts, total kW installed, units generated
         · Team names, roles, photos and consent to publish
         · Registration and empanelment numbers that can be verified
         · Whether the five-year workmanship warranty is accurate
  ✗ contact details are still placeholders
```

Both failures are deliberate and both are the gate doing its job.

Verified: `npm run build` emits 13 documents, one `<h1>` each, no React
warnings; `seo:check` passes all 13 routes on structure; Playwright confirms
every route loads with its own metadata, each page renders its own FAQ set, all
five service cards reach their detail pages, and every internal link resolves.

## Note for whoever picks this up

The team cards carry role titles, not invented personal names — inventing named
individuals for a real company is a different order of risk from inventing a
milestone date. The bios are still placeholder and still need replacing.

# Archived — Task: Content build, twelve pages (commit bddea15)

Client ask: "add more content, check the reference website"
(https://www.illumineenergy.com/).

Measured before starting, on the built pages:

| | Delta | Illumine |
| --- | ---: | ---: |
| Home | 710 w | 615 w |
| Money pages | **231–373 w** | **1,058–1,994 w** |

Delta's homepage already beat theirs. The whole gap was in the money pages.

## Scope, as agreed

- [x] 12 routes: the existing 6, plus `/kseb-net-metering/` and five service
      detail pages.
- [x] Verifiable facts only — no invented testimonials, customer counts,
      awards or firm prices.

## 1. Accuracy — the constraint that shaped everything

Research turned up three traps, and avoiding them is most of the value here:

- [x] **KSERC (Renewable Energy and Related Matters) Regulations, 2025** were
      notified 06 Nov 2025 and **stayed by the Kerala High Court on 10 Nov
      2025**. Current status could not be established, so none of its
      specifics are published.
- [x] **Sources contradict each other** on the new net-metering caps —
      domestic 20 kW / industrial 500 kW / agricultural 3,000 kW in one place,
      "residential and commercial up to 1000 kW" in another. Neither is stated.
- [x] **The 15 / 135 / 10-day approval timelines** competitors publish appear
      on no official KSEB page; the portal's own FAQ is silent on timelines.
      Not repeated.
- [x] Banked-energy settlement rates (₹3.08 / ₹2.79) omitted — tied to the
      stayed regulation.

Instead the pages say the position is moving and link the KSEB portal. That is
exactly where the reference site fails: their subsidy page still advertises
"40% MNRE subsidy / 30% CFA", superseded by PM Surya Ghar in February 2024.

Everything published traces to a primary source: the Solar Rooftop Portal for
the KSEB facts, PM Surya Ghar for the subsidy structure (₹30k per kW for the
first 2 kW, ₹18k for the third, capped at ₹78k), and
`docs/calculator-logic.md` for the ~₹60,000/kW, ~1,460 kWh/kW/yr and
~100 sq ft/kW planning figures that were already published in `llms.txt`.

## 2. Content modules — `content/`, pure data like `site.config.js`

- [x] `faqs.js` — 60 questions across 12 route-keyed sets, from one shared 5.
- [x] `netmetering.js` — net vs gross, the two meters, banking, outages.
- [x] `process.js` — the KSEB + PM Surya Ghar journey, each step naming who is
      responsible. The reference claims to handle "everything", which cannot be
      true of a subsidy claimed against the customer's own bank account.
- [x] `equipment.js` — how to read a solar quote.
- [x] `calculator.js` — the method behind the estimate, in prose.
- [x] `services.js` — long-form body for all five services.

## 3. Components and routing

- [x] `Prose.jsx` — the one new visual primitive, plus `Reviewed`, `Suits`,
      `Figures`. Every explainer on every page is this component.
- [x] `Process.jsx` — the journey, with a per-step responsibility tag.
- [x] `FAQ.jsx` takes `items`, so each route shows its own questions.
- [x] Service cards link to their detail pages; card `tabIndex={0}` removed so
      the stretched title link is the single tab stop.
- [x] `routes.jsx` generates the five service pages from `SERVICES`, and now
      throws in **both** directions — a route with no page, or a page with no
      route entry.

## 4. Build pipeline

- [x] `gen-seo.mjs` — `Service` nodes carry a real `url` to their detail page
      instead of a `#service-x` homepage fragment.
- [x] `prerender.mjs` — per-route `FAQPage`; a page with no FAQ has the node
      removed rather than inheriting the homepage's.
- [x] `seo-check.mjs` — validates each route's `FAQPage` against that route's
      set, and warns on titles over 62 chars.

## Review

### Content volume

| Route | words | before |
| --- | ---: | ---: |
| `/` | 734 | 710 |
| `/services/` | 1,161 | 297 |
| `/services/residential/` | 941 | — |
| `/services/commercial/` | 829 | — |
| `/services/hybrid/` | 740 | — |
| `/services/ev-charging/` | 740 | — |
| `/services/inverters-ups/` | 815 | — |
| `/subsidy/` | 1,006 | 373 |
| `/kseb-net-metering/` | 1,219 | — |
| `/savings-calculator/` | 940 | 370 |
| `/projects/` | 938 | 231 |
| `/contact/` | 268 | 243 |

Roughly 10,000 words total. `/contact/` stays short by design — it is a
utility page, and only the open accordion item is in prerendered HTML.

### Two bugs the verification caught

- **`FAQ.jsx` rendered the homepage questions on every page.** The `items`
  prop was added to the signature but the map still read `FAQS`. `seo:check`
  passed throughout, because the JSON-LD is generated by the prerenderer from
  `FAQS_BY_ROUTE` and never touches the component — the structured data was
  right while the visible page was wrong. Caught only when the browser check
  was strengthened to assert the actual question text per route.
- **`seo:check` reported false drift on every title containing `&`.** The page
  correctly stores `&amp;`; the checker compared raw bytes. It now decodes
  entities before comparing.

### Verified

- `npm run build` — 12 documents, one `<h1>` each, no React warnings.
- `npm run seo:check` — all 12 routes green (16 checks each). The single
  remaining failure is the pre-existing placeholder-contact launch gate.
- Playwright: all 12 routes load with their own title and no console errors;
  every service card reaches its detail page; each page renders its own FAQ
  set; the accordion opens; cards have one tab stop; 13 distinct internal
  links all return 200.
- Audited the built HTML directly: none of the contested figures appear on any
  of the 12 pages, and the sourced claims do.

## Flagged, not changed

`src/components/Subsidy.jsx` still renders "We handle the paperwork →", which
the archived SEO task log records the client asking to remove. Outside this
task — raising it rather than silently deleting it.

Still blocking launch, unchanged: `CONTACT.isPlaceholder` is `true`, and
`Contact.jsx` shows a success state without sending. Both now appear on twelve
pages instead of six.

# Archived — Task: Tier-1 pages, single route → six pages (commit 450c250)

Source of the scope: `research/illumine/04-delta-gap-analysis.md`, which listed
six pages buildable today from content already in `site.config.js`.

**No new copy was written** beyond six `<title>` / `<meta description>` pairs.
Every page is a composition of section components that already existed.

## Routes

| Path | Sections (first one supplies the `<h1>`) |
| --- | --- |
| `/` | Hero, Stats, Services, Projects, Subsidy, Calculator, FAQ, Contact — unchanged |
| `/services/` | **Services**, Stats, Contact |
| `/projects/` | **Projects**, Stats, Contact |
| `/subsidy/` | **Subsidy**, FAQ, Contact |
| `/savings-calculator/` | **Calculator**, Subsidy, Contact |
| `/contact/` | **Contact**, FAQ |

Section reuse is kept shallow on purpose so no two pages are near-duplicates —
the mistake Illumine makes across their on-grid/off-grid/hybrid pages.

## 1. Routing

- [x] `react-router-dom` v7 (user's choice over a hand-rolled manifest).
- [x] `site.routes.js` — pure data (path/title/description/priority), imported by
      both the browser bundle and the Node scripts, same pattern as
      `site.config.js`.
- [x] `src/routes.jsx` — joins that data to page components; throws at module
      load if a route has no page, so a mismatch is a build failure not a blank
      page.
- [x] `src/pages/*.jsx` — six thin compositions, no markup of their own.
- [x] `App.jsx` takes the route; `main.jsx` wraps in `BrowserRouter`,
      `prerender.mjs` in `StaticRouter`.
- [x] Nav and Footer links point at routes. Nav is force-solid off the homepage
      (only `/` has the dark hero behind the bar).

## 2. Heading levels

- [x] `SectionHeading` gained `as`; five sections gained `headingAs`.
- [x] `childHeading()` helper — promoting a section to `<h1>` has to move its
      nested headings too, or the outline jumps h1 → h3. Caught by `seo:check`
      on three pages, not by eye.

## 3. Build pipeline

- [x] `prerender.mjs` writes one document per route, each with its own title,
      description, canonical, og/twitter tags and JSON-LD `WebPage` node.
      Also fails the build if any route renders ≠ 1 `<h1>`.
- [x] `gen-seo.mjs` — sitemap and `llms.txt` loop the route table.
- [x] `seo-check.mjs` — audits every built route against its own route entry;
      clean pages roll up to one line so failures stay visible.

## 4. Bugs found and fixed along the way

- [x] **`useReveal` leaked every ScrollTrigger it made.** `const triggers = []`
      was never populated — `ScrollTrigger.batch()`'s return value was
      discarded, so the cleanup killed nothing. Invisible on a one-page site;
      with client-side routing it leaked a trigger set per navigation, each
      pointing at unmounted DOM.
- [x] **`ScrollTrigger.refresh()` was undoing the scroll reset.** It records the
      current offset and restores it when it finishes, so calling it *after*
      `scrollTo` silently reverted the scroll one frame later. Refresh first.
- [x] **Lenis clamped deep anchors to the previous page's height.** Its resize
      observer had not fired yet, so `/contact/` → `/#faq` was clamped to the
      short page's limit and went nowhere. `lenis.resize()` before scrolling.
- [x] **`history.scrollRestoration` cannot be used here.** It belongs to the
      current history *entry*, so every pushState lands on a fresh entry reset
      to `auto`, and Chromium re-applies that asynchronously even when it is
      reassigned in the effect.
- [x] **Manual POP restoration was wrong and was removed.** Tracking offsets per
      `location.key` recorded the wrong value, because the browser restores the
      incoming page's offset before the effect reads `window.scrollY`. The
      browser already restores back/forward correctly — `ScrollManager` now
      only forces scroll on PUSH/REPLACE and leaves POP alone.

## Review

### Build
Six documents, one `<h1>` each, no React warnings (the build fails on either):

```
✓ prerender:   33996 chars, 29 headings, 1 h1 → dist/index.html
✓ prerender:   21457 chars, 11 headings, 1 h1 → dist/services/index.html
✓ prerender:   15947 chars, 15 headings, 1 h1 → dist/subsidy/index.html
✓ prerender:   17065 chars, 10 headings, 1 h1 → dist/savings-calculator/index.html
✓ prerender:   17207 chars, 10 headings, 1 h1 → dist/projects/index.html
✓ prerender:   13601 chars, 10 headings, 1 h1 → dist/contact/index.html
```

`npm run seo:check` — all six routes pass 16 checks each. The one remaining
failure is the pre-existing placeholder-contact gate, which is the point of it.

### Verified in a real browser (Playwright + Chromium)

| Check | Result |
| --- | --- |
| Direct load of all 6 routes | own title, 1 h1, 0 console errors |
| Nav solid + colour logo off the homepage | correct on all 5 sub-pages |
| First section clears the fixed bar | 172–174 px gap |
| Client-side nav | lands at top, reveals fire (`opacity: 1`) |
| `/#faq` from `/contact/` | lands on `/`, FAQ 76 px from top |
| Back / forward | back restores 1800, forward restores 0 |
| Mobile sheet | navigates, closes, unlocks body scroll |
| Calculator on its own route | bill ₹4,000 → 6 kW, 8,760 kWh, ₹48,000/yr |
| Dev server (`vite`, SPA fallback) | all 6 routes render, 0 errors |

### Still blocking go-live — unchanged by this work

- `CONTACT.isPlaceholder` is `true`; phone, WhatsApp, email and address are fake.
- `Contact.jsx` shows a success state and sends nothing. That form now appears
  on six pages instead of one, so the cost of the bug went up even though the
  bug did not change.

# Archived — Task: SEO, crawlability & semantic hierarchy (commit 8648dc5)

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
