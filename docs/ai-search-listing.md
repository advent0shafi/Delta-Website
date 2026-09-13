# Getting listed and cited by AI search — playbook

How answer engines find, trust and cite a local business in 2026, and what
that means for deltaenergysolution.com. Written 13 September 2026; the
engines change quickly, so check anything marked *as of* before relying on
it.

Audit this pairs with: `docs/seo-audit-2026-09-13.md`.

---

## 1. Which engine reads what

Every AI answer is grounded in some search index plus some crawler of its
own. Being in the right index matters more than any "AI SEO" trick.

| Engine | Grounded in | Its own crawler | What Delta must do |
| --- | --- | --- | --- |
| Google AI Overviews / AI Mode / Gemini | Google's index, Google Business Profile, Knowledge Graph | Googlebot. `Google-Extended` only controls *training* use; blocking it does **not** remove you from AI Overviews | Search Console, GBP, structured data, reviews |
| ChatGPT search | Bing's index (OpenAI's search partnership), plus its own fetches | `OAI-SearchBot` (search), `ChatGPT-User` (user-triggered fetch), `GPTBot` (training) | Bing Webmaster Tools, IndexNow, allow all three (already allowed) |
| Microsoft Copilot | Bing's index, Bing Places | Bingbot | Bing Webmaster, Bing Places for Business |
| Perplexity | Own index plus partner indexes; heavily Bing-derived | `PerplexityBot` (index), `Perplexity-User` (fetch) | Same as Bing; keep pages crawlable and fast |
| Claude (Anthropic) | Web search via its own fetching | `Claude-SearchBot`, `Claude-User` (newer names, *as of 2025*), `ClaudeBot` (training) | Allowed by the `*` rule already |
| Meta AI | Bing plus own crawlers | `Meta-ExternalAgent`, `Meta-ExternalFetcher` | Allowed by the `*` rule |
| DuckDuckGo AI | Bing | `DuckAssistBot` | Allowed by the `*` rule |
| Apple Intelligence / Siri | Apple's index, Apple Maps | `Applebot`; `Applebot-Extended` controls training | Apple Business Connect listing |

Two consequences:

1. **Bing is half of the AI ecosystem.** ChatGPT, Copilot, Perplexity,
   DuckDuckGo and Meta all lean on Bing's index. Delta is not in Bing
   Webmaster Tools yet. That is the single cheapest gain available.
2. **`robots.txt` is already fine.** The `User-agent: *` rule allows
   everything, so the crawlers not named explicitly (Claude-SearchBot,
   Perplexity-User, Meta-ExternalAgent, DuckAssistBot) are already
   permitted. Naming them is optional documentation. Do not block any of
   them; a local service business gains nothing by opting out.

None of these crawlers execute JavaScript. The build prerenders every
route, which is why they see the full text. Keep it that way: any new
route must be added to `site.routes.js` so the prerender covers it.

---

## 2. The entity kit: make Delta unambiguous

Answer engines decide whether to cite a source partly by whether the
business resolves to one consistent entity across the web. Today it does
not: `sameAs` is empty, the postcode disagrees with Google, no social
profile exists, and the domain also hosts docsun.

### 2.1 Listings to create or claim

All with the **identical** name "Delta Energy Solutions", the same phone
`+91 75105 00080`, the same address and one agreed postcode, the same
hours, and `https://deltaenergysolution.com` as the website.

| Listing | Feeds | Notes |
| --- | --- | --- |
| Google Business Profile | Google Maps, AI Overviews, Gemini | Exists. Reconcile postcode 676519 vs 676505. Categories: "Solar energy company", "Solar energy equipment supplier", "Electrical installation service". Add services with prices, photos of real installs, weekly posts, Q&A. |
| Bing Places for Business | Copilot, ChatGPT, DuckDuckGo | Import from GBP. |
| Apple Business Connect | Apple Maps, Siri | Free. |
| PM Surya Ghar national portal vendor list | The scheme's own vendor search, cited by AI for "registered vendor" queries | Delta is MNRE-registered; make sure the public listing under KSEB/Malappuram shows the same name and phone. |
| ANERT / KSEB empanelment pages | Government pages AI engines treat as authoritative | Check whether Delta appears; get listed if a process exists. |
| Justdial, Sulekha, IndiaMART | Widely crawled Indian directories; frequently cited by AI for "near me" queries | Free listings. Keep NAP identical. |
| Instagram, Facebook, YouTube, LinkedIn | Entity confirmation; YouTube videos are cited by Google AI | One post per install with the town named. |
| Manufacturer dealer locators | Backlinks from Waaree, Adani, Microtek, UTL, Solaire, Eastman, Deye, TSUN | Ask each brand's distributor to list Delta as an authorised installer. |

### 2.2 `sameAs`

Every URL above goes into `CONTACT.sameAs` in `site.config.js`.
`gen-seo.mjs` already emits it into the Organization node when non-empty.
Make the empty case a launch failure in `seo-check.mjs`.

### 2.3 People

Add both founders as `Person` nodes referenced from Organization
`founder`: name, `jobTitle` "Co-founder & Managing Partner",
`hasCredential` (B-Class Electrical Contractor licence for Shuhaib M),
`knowsAbout` (rooftop solar, KSEB net metering, PM Surya Ghar). Give each
a bio on the About page and a LinkedIn profile in the Person's `sameAs`.
Named, credentialed people are the strongest experience signal a small
firm can publish.

### 2.4 One business per domain

docsun at `app.deltaenergysolution.com` must stop looking like Delta's
product to crawlers: `noindex` its marketing pages and redirect its
calculator to the apex, or move it to its own domain. Until then, every
engine sees a domain that is both an installer and a SaaS vendor.

---

## 3. Getting indexed fast, and staying fresh

### 3.1 Google Search Console

Verify the **domain** property (DNS TXT at Hostinger) so apex, www and
subdomains are covered. Submit `sitemap.xml`. Use URL Inspection to request
indexing of the 13 pages once. Watch Coverage for soft 404s (see audit 4.1)
and the "Discovered, not indexed" bucket.

### 3.2 Bing Webmaster Tools

Import the site from Search Console. Submit the sitemap. This is the entry
point to ChatGPT, Copilot, Perplexity and DuckDuckGo.

### 3.3 IndexNow

A push protocol Bing, Yandex, Seznam, Naver and Yep honour; Google does
not. Generate a key, publish it at `https://deltaenergysolution.com/<key>.txt`
(put it in `public/`), and after every deploy POST the changed URLs:

```
POST https://api.indexnow.org/indexnow
Content-Type: application/json
{ "host": "deltaenergysolution.com", "key": "<key>",
  "keyLocation": "https://deltaenergysolution.com/<key>.txt",
  "urlList": [ "https://deltaenergysolution.com/", ... ] }
```

Add this as a final step in `.github/workflows/deploy.yml`, reading the
URL list from `dist/sitemap.xml`. Changed pages reach Bing-based engines in
minutes.

### 3.4 Honest dates

Answer engines prefer fresh, dated sources for regulated topics, and
Kerala's solar rules changed in late 2025. Today every sitemap entry
carries the build date and no page has `dateModified`. Add an `updated`
field per route in `site.routes.js`, emit it as WebPage `dateModified` and
as sitemap `lastmod`, and show "Last reviewed <date>" on the regulatory
pages (the `Reviewed` component in `Prose.jsx` already exists for this).

---

## 4. Machine-readable layer

### 4.1 `llms.txt`

Delta already publishes a good one: description, pages, services, prices
before and after subsidy, planning assumptions, the full FAQ, contact.
Honest note: `llms.txt` is a proposed convention (Answer.AI, 2024). *As of
2026* no major AI vendor has publicly confirmed using it for ranking or
grounding. It costs nothing, some tools read it, and it is a clean summary
for any agent that fetches it. Keep it generated, keep it truthful, and
add an `llms-full.txt` that concatenates the prerendered page text if a
guide section is added later. Do not stuff it with keywords.

### 4.2 Structured data priorities for AI readers

In order of value for an answer engine deciding whether to cite Delta:

1. **Organization with `sameAs`, `founder`, `logo`, `foundingDate`** — the
   entity anchor.
2. **LocalBusiness with `geo`, `address`, `telephone`, `openingHours`,
   `areaServed` (all towns and both districts)** — the "where".
3. **Service with `offers` (price, priceCurrency INR, `eligibleRegion`)** —
   the "what and how much"; prices are already public.
4. **FAQPage** — already strong; keep answers direct and numeric.
5. **BreadcrumbList** — cheap, clarifies site structure.
6. **WebPage `dateModified`** — freshness.
7. **Person** for founders — expertise.
8. **Review / AggregateRating** only with real, attributable reviews.
   Google will not show stars for self-serving reviews on a LocalBusiness
   site; AI readers still weigh them.

Validate with Google's Rich Results Test and the Schema Markup Validator
after each change; add assertions to `seo-check.mjs`.

---

## 5. Content that gets cited

Answer engines quote passages, not pages. The passage that gets quoted is
the one that answers the question directly, with numbers and units, near a
heading that matches the question.

- **Question headings.** H2s phrased as the question people ask: "How much
  does a 3 kW system cost in Kerala after subsidy?" The FAQ sets already
  do this; the body sections should too.
- **Answer first.** The first sentence under the heading is the answer, in
  40–60 words, with the figure. Explanation follows.
- **Tables for anything with more than two numbers.** Price by kW, subsidy
  tiers, payback by tariff. Tables survive extraction; prose does not.
- **Units, currency, dates.** "₹78,000", "3 kW", "as of September 2026".
  Ambiguity is the reason a passage is skipped.
- **Sources.** Link the KSEB portal, the PM Surya Ghar portal, KSERC
  orders. The net-metering page already does this; make it the norm.
- **Author and date on guides.** A founder's byline with credential, and a
  visible last-reviewed date.
- **Local specifics.** Town names, KSEB section offices, real roof types,
  monsoon considerations, what a Malappuram or Kozhikode bill looks like.
  Generic solar content exists in millions of copies; local detail does
  not.
- **Malayalam.** Gemini, ChatGPT and Perplexity answer Malayalam queries.
  A Malayalam version of the subsidy and residential pages, with
  `hreflang`, is the only Malayalam-language source of its kind most of
  these engines will find.
- **Real photographs, captioned.** "6 kW on a tiled roof, Kottakkal,
  commissioned March 2026." Alt text that says the same. AI image
  understanding is now part of how pages are judged.

### 5.1 Pages to add, in order

1. `/solar-panel-price-kerala/` — the highest-volume commercial query in
   this market. Built from `SYSTEM_PRICES`.
2. `/solar-malappuram/` and `/solar-kozhikode/` — the two markets Delta
   names as primary.
3. A guide a month: "KSEB net metering rules, updated <month>", "PM Surya
   Ghar in Kerala: what changed", "How to read your KSEB bill", "Which
   panel brand for a Kerala roof".
4. Malayalam: `/ml/`, `/ml/subsidy/`, `/ml/services/residential/`.

---

## 6. Trust evidence Delta can publish today

These exist and are not on the site or in the data:

- Two named founders, both electrical engineers; one B-Class electrical
  contractor licence (publish the number).
- MNRE registration (publish the number).
- Founded 2017.
- Real counts: installations completed, total kW, districts served.
- Google reviews (collect them; show three with consent).
- Brand authorisations (dealer letters or locator listings).

And these must go: the invented milestone timeline, the placeholder
credentials list, stock photos captioned as Delta installs, the
wind-turbine hero.

---

## 7. Measuring AI visibility

There is no AI-referral report in Search Console. Do this instead:

1. **Referrers in analytics.** Track `chatgpt.com`, `perplexity.ai`,
   `copilot.microsoft.com`, `gemini.google.com`, `bing.com`, `duckduckgo.com`
   as a segment.
2. **A monthly query set, run by hand** in Google (note whether an AI
   Overview appears and whether Delta is cited), ChatGPT search,
   Perplexity, Gemini and Copilot:
   - solar installer in Malappuram
   - best rooftop solar company Malappuram
   - solar panel price in Kerala with subsidy 3 kW
   - PM Surya Ghar subsidy Kerala how much
   - KSEB net metering how it works
   - solar installer Kozhikode
   - hybrid solar with battery Kerala price
   - solar EV charging home Kerala
   - Delta Energy Solutions Malappuram
   - മലപ്പുറം സോളാർ (Malappuram solar, Malayalam)
   Record: cited or not, which page, which competitor was cited instead.
3. **Bing Webmaster** search performance, which reflects the Bing-backed
   engines together.
4. **GBP insights**: calls, direction requests, website taps.

---

## 8. What not to do

- Do not add `AggregateRating` without real reviews; it is a policy
  violation and AI engines increasingly detect it.
- Do not create doorway city pages with swapped town names.
- Do not block any AI crawler; for a local service business the trade is
  all downside.
- Do not stuff `llms.txt` or FAQ answers with keywords; they are read for
  meaning.
- Do not let the sitemap `lastmod` lie; a date that changes on every build
  is ignored.
- Do not keep two businesses on one domain.
