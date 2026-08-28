# 01 — Site map

`sitemap.xml` declares **98 `<loc>` entries**, of which **95 are unique**.

Three slugs appear twice (`how-much-roof-space-is-required-for-solar-panels`,
`solar-system-components-and-their-expected-lifespan`,
`the-role-of-batteries-in-hybrid-solar-systems`) — and one of those duplicates
is listed as `http://illumineenergy.com/…`, i.e. wrong scheme *and* wrong host
versus the site's own canonical `https://www.`. A self-inflicted duplicate-URL
signal. Delta's `gen-seo.mjs` generates the sitemap from `site.config.js`, so
this class of bug can't happen here — worth keeping it that way.

## Buckets

| Bucket | Count | Template | Purpose |
| --- | ---: | --- | --- |
| Core | 10 | Mobirise | Home, About, Services, Projects, Blog index, Careers, Contact, Enquiry, BIPV, CSR |
| Product / money | 5 | **Landing** | On-grid, Off-grid, Hybrid, Subsidy, Micro-inverters |
| SEO landing | 6 | Mobirise | Keyword-exact pages (`solar-panel-price-in-kochi`, …) |
| Legal | 4 | Mobirise | Privacy, T&C, Refund, Shipping |
| Articles | 70 | Mobirise | Blog long tail |
| **Total** | **95** | | |

## Core pages

| URL | `<title>` | Notes |
| --- | --- | --- |
| `/` | Solar Energy Company Kerala \| Solar Installation Kochi | Carousel hero, counters, CSR, YouTube, FAQ |
| `/about.html` | Leading Solar Energy Company Kerala | Company story, EPC scope, **3 exec bios**, awards |
| `/services.html` | On Grid Solar System Cochin \| Off Grid \| Hybrid | The 3 system types side by side + 21 product logos |
| `/projects.html` | Solar Panel Distributor in Kerala | Client logos + testimonial cards. Thin. |
| `/blog.html` | Solar Energy in Kerala \| Solar Panels in Kochi | Flat list of ~93 links, no pagination, no categories |
| `/career.html` | Rooftop Solar Power Systems Cochin | 2 open roles + apply form |
| `/contact-us.html` | Solar Panel Installation Services in Ernakulam | Address, map, two forms |
| `/enquiry.html` | Solar Panel Installation Company Kerala | Landing-template lead capture |
| `/bipv.html` | Solar Panel Cost In Kerala | Solar roof tiles / bifacial / glass panels |
| `/jyothirgamaya-csr-programme.html` | — | CSR programme |

## Product pages — the ones that convert

These five carry the commercial keywords and each is a *self-contained sales
page*: hero counter → enquiry form → client logos → long technical body →
CTA band → net-metering explainer → approvals explainer → product-selection
guide → testimonials → **page-specific FAQ** → footer.

| URL | H1 | Word count is real — 1,500-2,500 words each |
| --- | --- | --- |
| `/ongrid-solar-system-in-kerala.html` | ON GRID SOLAR PROJECT | Net vs gross metering, KSEB approval steps, panel/inverter selection |
| `/offgrid-solar-system-in-kerala.html` | OFF GRID SOLAR SYSTEM | Battery types for backup |
| `/hybrid-solar-project.html` | HYBRID SOLAR SYSTEM PROJECT | Hybrid working |
| `/subsidy.html` | SOLAR SUBSIDY | MNRE scheme, DCR panel rule, **subsidy table**, application steps |
| `/micro-inverters.html` | MICRO INVERTERS | Enphase-specific |

**Content-reuse warning:** on-grid, off-grid and hybrid pages share three
identical long sections verbatim ("How is solar billing done", "Permission and
procedures", "Best On Grid Solar Panels"). The hybrid page even keeps an
`<H2>Detailed working of **On grid** power plant</H2>`. That's near-duplicate
content across three ranking pages — a mistake to learn from, not copy.

## SEO landing pages

`best-solar-company-in-kerala` · `solar-panel-price-in-kerala` ·
`solar-panel-price-in-kochi` · `solar-panel-dealer-in-ernakulam` ·
`hybrid-solar-panel-system-kerala` · `micro-inverter-installation`

Thin (12–16 KB of HTML including the shared chrome), exact-match slugs, one
per commercial keyword + geography. Delta's equivalent axis is
Malappuram / Manjeri / Kottakkal / Tirur / Perinthalmanna — already enumerated
in `AREA.towns` in `site.config.js`.

## Article long tail (70 pages)

Clusters, by slug:

- **Monsoon / Kerala climate** (~10) — rain damage, monsoon performance,
  electrical safety in monsoon, backup during monsoons, high-temperature output
- **Micro-inverters** (~9) — shaded roofs, high heat, safety, high-voltage risk
- **Batteries & backup** (~8) — lithium inverters, which battery, lifespan
- **Buying / pricing** (~8) — 3 kW price with subsidy, on-grid plant cost 2025,
  roof tile price, loans, "solar providers near me"
- **Sizing & siting** (~8) — roof space, roof load capacity, panels to run an AC
- **Maintenance & lifespan** (~7)
- **General education** (~20) — how panels work, cloudy days, on-grid vs off-grid

Every article is the same skeleton: H1 → 2 intro paragraphs → 3–5 `<H4>`
sub-sections with bullet lists → closing paragraph → shared footer. No author,
no date, no schema, no internal links beyond the nav. **Delta can beat this on
quality trivially** — the bar is low, the volume is the moat.
