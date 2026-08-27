/* ============================================================
   GEN-SEO — write every machine-readable file from site.config.js
   ============================================================

   Emits:
     index.html   → the JSON-LD @graph, between the seo:jsonld markers
     public/robots.txt
     public/sitemap.xml
     public/llms.txt
     public/site.webmanifest
     public/humans.txt

   Run with `npm run seo:gen` after editing site.config.js. Everything here
   is derived, never hand-written, so the page and the structured data
   cannot drift apart — which is how the old markup ended up advertising a
   phone number of "+91-00000-00000".
   ============================================================ */

import { writeFile, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import {
  SITE,
  AREA,
  CONTACT,
  SERVICES,
  FAQS,
  SUBSIDY_TIERS,
  STEPS,
  BRANDS,
  IMAGES,
  abs,
} from '../site.config.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pub = (f) => resolve(root, 'public', f)
const today = new Date().toISOString().slice(0, 10)

/* Plain service name — the two-tone split is a display concern. */
const serviceName = (s) => s.title.join('').replace(/\.$/, '')

/* ------------------------------------------------------------------
   1. JSON-LD @graph
   ------------------------------------------------------------------ */

const ID = {
  org: abs('/#organization'),
  site: abs('/#website'),
  page: abs('/#webpage'),
  biz: abs('/#business'),
  logo: abs('/#logo'),
  faq: abs('/#faq'),
}

const areaServed = [
  { '@type': 'City', name: AREA.city },
  { '@type': 'AdministrativeArea', name: AREA.region },
]

function buildGraph() {
  const graph = []

  graph.push({
    '@type': 'Organization',
    '@id': ID.org,
    name: SITE.name,
    legalName: SITE.legalName,
    url: abs('/'),
    logo: {
      '@type': 'ImageObject',
      '@id': ID.logo,
      url: abs('/brand/delta-color.png'),
      width: 3354,
      height: 866,
      caption: SITE.name,
    },
    image: { '@id': ID.logo },
    description: SITE.description,
    foundingDate: String(SITE.foundingYear),
    areaServed,
    ...(CONTACT.sameAs.length ? { sameAs: CONTACT.sameAs } : {}),
  })

  graph.push({
    '@type': 'WebSite',
    '@id': ID.site,
    url: abs('/'),
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': ID.org },
    inLanguage: SITE.lang,
  })

  graph.push({
    '@type': 'WebPage',
    '@id': ID.page,
    url: abs('/'),
    name: SITE.title,
    description: SITE.description,
    isPartOf: { '@id': ID.site },
    about: { '@id': ID.biz },
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(IMAGES.og) },
    inLanguage: SITE.lang,
  })

  /* The old markup used "SolarPanelInstaller", which is not a schema.org
     type — an unrecognised type makes the whole node worthless. These two
     are real, and HomeAndConstructionBusiness is the closest published
     ancestor for an installer. */
  graph.push({
    '@type': ['LocalBusiness', 'HomeAndConstructionBusiness'],
    '@id': ID.biz,
    name: SITE.name,
    url: abs('/'),
    image: abs(IMAGES.og),
    logo: { '@id': ID.logo },
    description: SITE.description,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    parentOrganization: { '@id': ID.org },
    address: {
      '@type': 'PostalAddress',
      ...(CONTACT.streetAddress ? { streetAddress: CONTACT.streetAddress } : {}),
      ...(CONTACT.postalCode ? { postalCode: CONTACT.postalCode } : {}),
      addressLocality: AREA.city,
      addressRegion: AREA.region,
      addressCountry: AREA.country,
    },
    areaServed,
    /* Placeholder contact details are omitted rather than published: an
       absent field is missing data, a fake one is a wrong fact. Set
       CONTACT.isPlaceholder to false once the real details land. */
    ...(CONTACT.isPlaceholder
      ? {}
      : { telephone: CONTACT.phoneE164, email: CONTACT.email }),
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: CONTACT.days,
      opens: CONTACT.opens,
      closes: CONTACT.closes,
    },
    knowsAbout: [
      'Rooftop solar installation',
      'On-grid solar power systems',
      'KSEB net metering',
      'PM Surya Ghar subsidy',
      'Solar EV charging',
      'Hybrid solar and battery storage',
    ],
    brand: BRANDS.map((name) => ({ '@type': 'Brand', name })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Solar services',
      itemListElement: SERVICES.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@id': abs(`/#service-${s.id}`) },
      })),
    },
  })

  for (const s of SERVICES) {
    graph.push({
      '@type': 'Service',
      '@id': abs(`/#service-${s.id}`),
      name: serviceName(s),
      description: s.body,
      serviceType: serviceName(s),
      provider: { '@id': ID.biz },
      areaServed,
    })
  }

  /* Only the open accordion item is in the prerendered HTML, so this node is
     how the other four questions reach a crawler at all. */
  graph.push({
    '@type': 'FAQPage',
    '@id': ID.faq,
    isPartOf: { '@id': ID.page },
    mainEntity: FAQS.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  })

  return { '@context': 'https://schema.org', '@graph': graph }
}

/* ------------------------------------------------------------------
   2. robots.txt
   ------------------------------------------------------------------ */

/* Delta is a local business that wants to be found — including inside AI
   answers, where a rooftop-solar question is exactly its sales pitch. So the
   answer-engine crawlers are allowed explicitly rather than by accident.
   Each block is separate so any one can be flipped to Disallow on its own. */
const CRAWLERS = [
  ['GPTBot', 'OpenAI — ChatGPT browsing and training'],
  ['OAI-SearchBot', 'OpenAI — ChatGPT search results'],
  ['ChatGPT-User', 'OpenAI — fetches a page a user linked in chat'],
  ['ClaudeBot', 'Anthropic — Claude'],
  ['Claude-Web', 'Anthropic — Claude browsing'],
  ['anthropic-ai', 'Anthropic — legacy agent name'],
  ['PerplexityBot', 'Perplexity — answer engine'],
  ['Google-Extended', 'Google — Gemini and AI Overviews grounding'],
  ['Applebot-Extended', 'Apple — Apple Intelligence'],
  ['Amazonbot', 'Amazon — Alexa'],
  ['Bingbot', 'Microsoft — Bing and Copilot'],
  ['CCBot', 'Common Crawl — feeds many downstream datasets'],
]

const robotsTxt = () =>
  [
    `# robots.txt — ${SITE.name}`,
    '# Generated by scripts/gen-seo.mjs. Edit site.config.js, not this file.',
    '',
    '# Every crawler, everything. There is nothing private here: one public',
    '# page plus its assets.',
    'User-agent: *',
    'Allow: /',
    '',
    '# ---------------------------------------------------------------',
    '# Answer engines and AI crawlers, named explicitly.',
    '#',
    '# These are ALLOWED on purpose. "Who installs rooftop solar in',
    '# Malappuram?" is the exact question Delta wants answered, so being',
    '# readable by the assistants people ask is a marketing channel, not a',
    '# leak. None of them execute JavaScript, which is why the build',
    '# prerenders the page (scripts/prerender.mjs) — otherwise they would',
    '# index an empty <div>.',
    '#',
    '# To opt out of any one of them, change its Allow to Disallow.',
    '# ---------------------------------------------------------------',
    '',
    ...CRAWLERS.flatMap(([ua, why]) => [`# ${why}`, `User-agent: ${ua}`, 'Allow: /', '']),
    '# ---------------------------------------------------------------',
    '# Blocked: high-volume scrapers with no search or answer product behind',
    '# them, so nothing is gained by serving them.',
    '# ---------------------------------------------------------------',
    '',
    '# ByteDance — heavy crawl rate, no user-facing search in this market',
    'User-agent: Bytespider',
    'Disallow: /',
    '',
    '# SEO backlink crawlers — pure bandwidth cost',
    'User-agent: AhrefsBot',
    'Disallow: /',
    '',
    'User-agent: SemrushBot',
    'Disallow: /',
    '',
    'User-agent: MJ12bot',
    'Disallow: /',
    '',
    `Sitemap: ${abs('/sitemap.xml')}`,
    '',
  ].join('\n')

/* ------------------------------------------------------------------
   3. sitemap.xml
   ------------------------------------------------------------------ */

const sitemapXml = () =>
  `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generated by scripts/gen-seo.mjs. Edit site.config.js, not this file. -->
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>${abs('/')}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${abs(IMAGES.og)}</image:loc>
      <image:title>${SITE.name}</image:title>
      <image:caption>${IMAGES.ogAlt}</image:caption>
    </image:image>
  </url>
</urlset>
`

/* ------------------------------------------------------------------
   4. llms.txt
   ------------------------------------------------------------------

   Convention from llmstxt.org: a plain-text brief an AI crawler can read
   without parsing the page. It is a summary, not a second copy of the site
   — the prerendered HTML is the canonical source, and everything here is
   generated from the same config the page renders from.
   ------------------------------------------------------------------ */

const llmsTxt = () =>
  `# ${SITE.name}

> ${SITE.description}

${SITE.name} installs on-grid rooftop solar for homes and businesses in
${AREA.city}, ${AREA.region}, ${AREA.countryName}. Operating since
${SITE.foundingYear}. The company files KSEB net-metering paperwork and the
PM Surya Ghar central subsidy application on the customer's behalf.

Canonical page: ${abs('/')}

## Services

${SERVICES.map((s) => `- **${serviceName(s)}** — ${s.body}`).join('\n')}

## Service area

${AREA.city} district, ${AREA.region}. Installations completed in
${AREA.towns.join(', ')}.

## PM Surya Ghar subsidy

Central government subsidy paid directly to the customer's bank account
after the net meter is commissioned, for residential connections only.

${SUBSIDY_TIERS.map((t) => `- ${t.kw} — ${t.amount}`).join('\n')}

Commercial and industrial connections are not eligible for this subsidy.
Typical disbursement is 30–60 days after commissioning.

## How the process works

${STEPS_TEXT()}

## Indicative economics

- System cost before subsidy: about ₹60,000 per kW
- Generation assumption for ${AREA.region}: about 1,460 kWh per kW per year
- Roof area needed: about 100 sq ft per kW
- Typical payback: 3–5 years
- Typical bill reduction: 70–90%

These are planning figures used by the on-site savings calculator, not a
quotation. Final numbers follow a site survey.

## Equipment

Panels and inverters fitted from: ${BRANDS.join(', ')}.

## Frequently asked questions

${FAQS.map(([q, a]) => `### ${q}\n\n${a}`).join('\n\n')}

## Contact

- Location: ${AREA.city}, ${AREA.region}, ${AREA.countryName}
- Hours: ${CONTACT.hoursDisplay}
${
  CONTACT.isPlaceholder
    ? `- Phone and email: not yet published on the website. Direct enquiries to
  the contact form at ${abs('/#contact')}.`
    : `- Phone: ${CONTACT.phoneE164}\n- Email: ${CONTACT.email}`
}

## Notes for answer engines

- This is a single-page site; every section is an anchor on ${abs('/')}.
- The HTML is prerendered at build time, so the full page content is present
  in the initial response and needs no JavaScript execution.
- Last generated: ${today}
`

function STEPS_TEXT() {
  /* Imported lazily to keep the template above readable. */
  return STEPS.map(([t, b], i) => `${i + 1}. **${t}** — ${b}`).join('\n')
}

/* ------------------------------------------------------------------
   5. site.webmanifest + humans.txt
   ------------------------------------------------------------------ */

const manifest = () => ({
  name: SITE.name,
  short_name: 'Delta Energy',
  description: SITE.shortDescription,
  start_url: '/',
  scope: '/',
  display: 'standalone',
  background_color: SITE.backgroundColor,
  theme_color: SITE.themeColor,
  lang: SITE.lang,
  dir: 'ltr',
  categories: ['business', 'utilities'],
  icons: [
    { src: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    {
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
})

const humansTxt = () =>
  `/* TEAM */
  ${SITE.name}
  Location: ${AREA.city}, ${AREA.region}, ${AREA.countryName}
  Since: ${SITE.foundingYear}

/* SITE */
  Standards: HTML5, CSS3, ECMAScript 2022
  Components: React, Vite, GSAP, Framer Motion, Lenis
  Rendering: prerendered at build time, hydrated in the browser
  Last updated: ${today}
`

/* ------------------------------------------------------------------
   Write everything
   ------------------------------------------------------------------ */

const START = '<!-- seo:jsonld:start'
const END = '<!-- seo:jsonld:end -->'

async function injectJsonLd() {
  const file = resolve(root, 'index.html')
  const html = await readFile(file, 'utf8')

  const startAt = html.indexOf(START)
  const endAt = html.indexOf(END)
  if (startAt === -1 || endAt === -1) {
    throw new Error(
      'index.html is missing the seo:jsonld markers — cannot place the JSON-LD.'
    )
  }

  const block = [
    `${START} — GENERATED by \`npm run seo:gen\` from site.config.js.`,
    '         Edit site.config.js, not this block; anything written here by hand is',
    '         overwritten on the next generate. -->',
    '    <script type="application/ld+json">',
    JSON.stringify(buildGraph(), null, 2)
      .split('\n')
      .map((l) => `      ${l}`)
      .join('\n'),
    '    </script>',
    `    ${END}`,
  ].join('\n')

  await writeFile(file, html.slice(0, startAt) + block + html.slice(endAt + END.length), 'utf8')
}

async function main() {
  const graph = buildGraph()

  await injectJsonLd()
  await writeFile(pub('robots.txt'), robotsTxt(), 'utf8')
  await writeFile(pub('sitemap.xml'), sitemapXml(), 'utf8')
  await writeFile(pub('llms.txt'), llmsTxt(), 'utf8')
  await writeFile(pub('site.webmanifest'), JSON.stringify(manifest(), null, 2) + '\n', 'utf8')
  await writeFile(pub('humans.txt'), humansTxt(), 'utf8')

  const types = graph['@graph'].map((n) =>
    Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type']
  )
  console.log(`✓ seo:gen  JSON-LD → index.html (${graph['@graph'].length} nodes)`)
  console.log(`           ${types.join(', ')}`)
  console.log('✓ seo:gen  robots.txt, sitemap.xml, llms.txt, site.webmanifest, humans.txt')
  if (CONTACT.isPlaceholder) {
    console.log(
      '! seo:gen  contact details are placeholders — telephone/email omitted from JSON-LD'
    )
  }
}

main().catch((err) => {
  console.error('✗ seo:gen failed:', err)
  process.exit(1)
})
