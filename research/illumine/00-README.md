# Illumine Energy — competitor teardown

Research folder. **Nothing here is wired into the Delta build** — no imports,
no scripts, no assets. It exists to answer one question:

> Illumine ranks for the Kerala rooftop-solar keywords Delta wants. What is
> their site actually made of, and which of those pages can Delta ship?

Scraped **2026-08-28** from `https://www.illumineenergy.com/`.

## What's in here

| Path | What it is |
| --- | --- |
| `01-site-map.md` | Full page inventory — 95 URLs, bucketed by purpose |
| `02-page-anatomy.md` | Section-by-section blueprint of each page *type* |
| `03-tech-stack.md` | How it's built, what's worth copying, what isn't |
| `04-delta-gap-analysis.md` | **The answer to "which pages can we build now"** |
| `05-build-plan.md` | Turning Delta's SPA into a multi-page site |
| `raw/*.html` | 22 pages, verbatim as served |
| `text/*.txt` | Same pages, reduced to headings / copy / media |
| `pages.json` | Machine-readable URL buckets |
| `sitemap.xml`, `sitemap-urls.txt` | Their sitemap as fetched |
| `extract.mjs` | HTML → readable-structure extractor |
| `classify.mjs` | Sitemap → buckets |

## Reproduce

```bash
cd research/illumine
curl -sSL https://www.illumineenergy.com/sitemap.xml -o sitemap.xml
node extract.mjs      # raw/*.html -> text/*.txt
node classify.mjs     # sitemap-urls.txt -> pages.json
```

## Headline findings

1. **Two templates, not one.** The corporate pages are Mobirise 4.8.10 output;
   the five money pages (on-grid, off-grid, hybrid, subsidy, micro-inverters)
   run a *completely separate* conversion template with a sticky enquiry form.
   The split is deliberate and it's the single most copyable idea on the site.
2. **The long tail is the strategy.** 70 of 95 URLs are blog articles, plus 6
   keyword landing pages. Only 19 are structural pages.
3. **Every money page ends the same way**: testimonials → FAQ → contact. The
   FAQ block is per-page and keyword-targeted, not a shared component.
4. **The build quality is poor** (jQuery, 2018-era Bootstrap, no image
   optimisation, duplicated body copy, `document.write` in the footer). Delta's
   existing stack already beats it. Copy the *information architecture*, not
   the implementation.
