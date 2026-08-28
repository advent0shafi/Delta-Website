# 02 — Page anatomy

Four page *types* generate all 95 URLs. Learn the four, and the site is
reproducible.

---

## Type A — Money page (the important one)

Used by: on-grid, off-grid, hybrid, subsidy, micro-inverters, enquiry.
Template assets live under `/landing_page_assets/`, entirely separate from the
Mobirise chrome.

```
1  Top bar          "Call Us: +91-484-255 7377"          ← phone, above everything
2  Hero             full-bleed photo + dark overlay
                    H5 kicker · animated counter (1000/2000) · "Satisfied Customers"
                    one line of proof · [About us] button
3  ENQUIRY BAND     full-bleed, immediately under the hero, BEFORE any content
                    "Get in Touch" · name · email · phone · message · captcha
4  Client logos     24-logo carousel + 4 offer bullets
                    ("GET UPTO 40% MNRE Subsidy", "5 years free maintenance",
                     "Tier 1 accessories", "No extra cost for structure")
5  H1 + definition  what the system IS, plainly
6  "How to choose"  which customer this suits
7  Deep-dive        1-3 long technical sections
8  CTA band         "YOUR ONE STOP FOR SOLAR POWER REQUIREMENTS" → [Enquire Now!] → #enquire
9  Metering         net-metering vs gross-metering, with worked ₹ example
10 Approvals        the 4 KSEB steps: feasibility → registration → inspection → net meter
11 Product guide    which panels / which inverters, named brands
12 Testimonials     3 named clients, org + role, project size, outcome
13 FAQ              5 Q&A, page-specific and keyword-targeted
14 Footer           contact block · top products · map · quick links
15 Floating         WhatsApp button
```

**The three moves worth stealing:**

1. **Form before content.** Section 3 is a lead form the visitor meets before
   reading a word of the body. Delta's `Contact` sits at the very bottom of a
   long scroll — every product page should carry its own enquiry band high up.
2. **Answer the process questions on the page.** Sections 9–11 are the ones a
   Kerala buyer actually searches: *how does the billing work, what approvals
   do I need, how long does KSEB take*. Delta has this knowledge in `STEPS` and
   the FAQ but only as one-liners.
3. **Per-page FAQ, not a shared one.** Each page's five questions target that
   page's keyword. Delta's `FAQS` is a single shared array — for multi-page it
   needs to become keyed by page.

**Don't copy:** the duplicated sections 9–11 across three pages (see
`01-site-map.md`), the "1000" vs "2000" customer counter that contradicts
itself page to page, or the `<a href="">` masquerading as a submit button.

---

## Type B — Corporate page (Mobirise)

Used by: home, about, services, projects, career, contact, BIPV, CSR, legal.

```
1  Sticky nav       logo + 10 links (About · Services ▾ · Projects · Blog · Careers · Contact)
2  Header banner    parallax photo, often with no text at all
3  Body             stacked Mobirise blocks — content4 / features4 / features11 /
                    testimonials2 / testimonials3 / counters1 / clients
4  Footer           same block on every page
```

Notable instances:

- **Home** — 3-slide carousel (BIPV / CSR / "Solar Power Projects for Residential,
  Commercial and Industrial"), parallax quote band, **counter strip**
  (`5000+ projects · 10 MW+ · 58,40,000+ kWh · 760 tonnes CO₂`), H1 band,
  CSR band, 3-card feature row with a YouTube embed and a named testimonial,
  Google Map, FAQ, footer.
- **About** — company story (est. 2012, India + UAE), 4-item EPC scope grid
  (*all four labelled "Power compensation"* — a copy-paste bug shipped to
  production), **3 exec bios with photo + credentials**, CSR band, 8 award
  images, map.
- **Services** — "Our Work Flow" heading, then on-grid / off-grid / hybrid as
  three image+text rows listing components (`*PV array *Inverter *Net Meters`)
  and numbered advantages, then a 21-logo product wall.
- **Projects** — client logos + testimonial cards. **No project case studies at
  all** despite the page name. Their weakest page and Delta's easiest win.

---

## Type C — SEO landing page

Type B chrome, one `content4` block, ~600 words, exact-match slug. That's it.

---

## Type D — Article

Type B chrome, one `content4` block:

```
H1 (keyword, often SHOUTED IN CAPS)
2 intro paragraphs, keyword repeated 3-4x
H4 sub-section  + bullet list      ×3-5
closing paragraph
[occasionally one comparison table]
```

No date, no author, no breadcrumb, no related-posts, no `Article` schema, no
internal links out. 70 of these carry the site's organic traffic.

---

## Content inventory worth harvesting

Facts and structures observed that Delta will need equivalents of:

| Illumine has | Delta has today |
| --- | --- |
| `5000+ projects · 10 MW+ · 58.4 lakh kWh · 760 t CO₂` | Generic stats (₹78k, 90%, 25 yr, 3–5 yr) — no company-specific numbers |
| 3 named testimonials w/ org, kW, outcome | none |
| 24 client logos, 21 product logos | 5 brand names as text |
| 3 exec bios w/ photos and credentials | none |
| 8 award images | none |
| Subsidy table 1 kW ₹30k / 2 kW ₹60k / 3 kW+ ₹78k | **same tiers, already in `SUBSIDY_TIERS`** ✓ |
| MNRE process: Sandesh app → feasibility → install → net meter → commissioning | 3-step `STEPS`, less specific |
| Named panels (Premier, Adani, Vikram, Axitec, Waaree) + inverters (Fronius, Growatt, Enphase, SMA, Sungrow) | `BRANDS` — 5 names, no detail |
| 70 articles | 0 |
