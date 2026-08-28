# 04 — Which pages can Delta build?

The question the study was for. Every row is judged against content that
**actually exists in this repo today** — `site.config.js`, the components, and
`docs/calculator-logic.md`. Nothing is assumed.

## Blocker before any of this ships

`CONTACT.isPlaceholder === true`. Phone, WhatsApp, email and address are all
fake (`+91 XXXXX XXXXX`, `+910000000000`), and `npm run seo:check` is designed
to fail while they are. **One 5-minute input from the client unblocks every
page below**, and until it lands no page can carry a call-to-action that works.

Second blocker, narrower: `Contact.jsx:15-18` calls `setSent(true)` and makes
no network request. The form shows "sent" and drops the lead. Any new page with
an enquiry band inherits this bug.

---

## Tier 1 — buildable now, content is already in the repo

| Page | Source content | Notes |
| --- | --- | --- |
| **`/` Home** | built | Already live — the 8 sections in `App.jsx` |
| **`/subsidy`** | `SUBSIDY_TIERS`, `STEPS`, `FAQS[0,2,4]`, `Subsidy.jsx` | Strongest Tier-1 page. Delta's tiers match Illumine's exactly (₹30k/₹60k/₹78k), and Delta targets PM Surya Ghar by name while Illumine still says "MNRE / 40%". |
| **`/savings-calculator`** | `Calculator.jsx` + `docs/calculator-logic.md` | **Illumine has no calculator.** A working, KSEB-tariff-aware calculator on its own indexable URL is a genuine differentiator, not a copy. |
| **`/services`** | `SERVICES` ×5 (title, body, img, alt, icon) | Index page only — one card per service. Enough copy for the grid, not for five detail pages. |
| **`/projects`** | `PROJECTS` ×4 (tag, name, town, img) | Gallery only. Images are Unsplash stock and the entries carry no kW output, date or client — fine for a grid, not for case studies. |
| **`/contact`** | `Contact.jsx`, `AREA`, `CONTACT` | Component is done; **gated on the placeholder blocker above.** |

That's **6 pages** shippable in one pass once the phone number lands.

---

## Tier 2 — needs one short round of client input (hours, not weeks)

Each row names exactly what to ask for.

| Page | Ask the client for | Why it's cheap |
| --- | --- | --- |
| **`/about`** | Founding story, why 2018, team names + roles + photos, certifications, KSEB/MNRE empanelment number | Illumine's About is their 2nd-strongest page: story + 3 exec bios + awards. Delta has only `foundingYear: 2018`. |
| **`/services/residential`** <br>**`/services/commercial`** <br>**`/services/hybrid`** <br>**`/services/ev-charging`** <br>**`/services/inverters-ups`** | ~600–800 words each: what's included, typical kW range, price band, what the customer must provide, timeline | Delta has 5 one-line descriptions. Illumine's equivalent pages are 1,500–2,500 words and that is why they rank. **Delta's EV-charging and UPS pages have no Illumine counterpart** — uncontested keywords. |
| **`/projects/<slug>`** case studies | For 4–6 real installs: photos, kW, town, month, monthly units generated, bill before/after, one customer sentence | Illumine's `/projects.html` has *no case studies at all* despite the name. This is the easiest place to beat them outright. |
| **Town pages** — `/rooftop-solar-malappuram`, `-manjeri`, `-kottakkal`, `-tirur`, `-perinthalmanna` | 250–400 words per town + 1 local install each | `AREA.towns` already lists all five. Illumine runs the same play on Kochi/Ernakulam and it works. |
| **Real stats** for the `Stats` strip | Projects completed, total kW installed, units generated, CO₂ avoided | Delta's current four stats are generic industry facts (₹78k, 90%, 25 yr, 3–5 yr). Illumine's are company-specific (`5000+`, `10 MW+`, `58,40,000+ kWh`, `760 t CO₂`) and far more persuasive. |
| **Testimonials** | 3–5 customers: name, town, system size, one quote, consent to publish | Delta has zero. Every Illumine money page ends with three. |
| **Legal ×4** — privacy, terms, refund, shipping | Business address, GST, refund window, delivery terms | Required anyway for Google Ads and any payment flow. Templated content, just needs the real details. |

---

## Tier 3 — sustained content production

| Work | Scale | Comment |
| --- | --- | --- |
| **Blog** | 70 articles is Illumine's actual moat | Their articles are undated, unattributed, unschema'd and internally unlinked. 15–20 genuinely good Kerala-specific posts (monsoon performance, KSEB net-metering walkthrough, PM Surya Ghar application, 3 kW price breakdown) would outperform. Start with the clusters listed in `01-site-map.md`. |
| **Careers** | 0 content | Skip until Delta is actually hiring. An empty careers page is worse than none. |

---

## Not worth building

| Illumine page | Why skip |
| --- | --- |
| `/off-grid` | Delta's `SERVICES` sells hybrid, not off-grid. Don't add a service line to chase a keyword. |
| `/micro-inverters` | Not a Delta offering; Illumine's is an Enphase-dealer page. |
| `/bipv` (solar roof tiles, bifacial, glass) | Specialist product line Delta doesn't carry. |
| `/jyothirgamaya` CSR | Requires an actual CSR programme. |
| Thin keyword landing pages | Delta's town pages cover the same intent with more substance. Don't ship 600-word doorways. |

---

## Recommended order

1. **Unblock** — real phone/email/address into `site.config.js`; wire
   `Contact.jsx` to a real endpoint. *(Everything depends on this.)*
2. **Tier 1, 6 pages** — routing + prerender for multiple routes
   (see `05-build-plan.md`), then Home / Subsidy / Calculator / Services /
   Projects / Contact.
3. **Collect the Tier-2 brief** in one sitting with the client — the table
   above is the questionnaire.
4. **Service detail pages + case studies + town pages.**
5. **Analytics** — GA4 and call tracking. Illumine measures which pages
   generate calls; Delta currently measures nothing.
6. **Blog**, once there's a reason to keep it fed.
