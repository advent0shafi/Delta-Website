/* ============================================================
   DELTA ENERGY SOLUTIONS — single source of truth
   ============================================================

   Every piece of business content that has to appear in BOTH the
   rendered page and a machine-readable file lives here exactly once.

   Consumers:
     src/components/*.jsx    — renders it for humans
     scripts/gen-seo.mjs     — writes robots.txt / sitemap.xml /
                               llms.txt / site.webmanifest, and the
                               JSON-LD @graph inside index.html
     scripts/og-images.mjs   — share-image copy
     scripts/seo-check.mjs   — asserts index.html has not drifted

   This file is imported by the browser bundle, so it must stay pure
   data — no Node APIs, no side effects.
   ============================================================ */

/* ---------- identity ---------- */

export const SITE = {
  origin: 'https://www.deltaenergy.in',
  name: 'Delta Energy Solutions',
  legalName: 'Delta Energy Solutions',
  /* <title> and og:title */
  title: 'Rooftop Solar in Malappuram, Kerala | Delta Energy Solutions',
  /* <meta name="description"> — keep at 150-160 chars */
  description:
    'On-grid rooftop solar for homes and businesses in Malappuram, Kerala. KSEB net metering and the ₹78,000 PM Surya Ghar subsidy handled end to end. Get a free quote.',
  /* shorter variant for social cards, where long text is truncated */
  shortDescription:
    'On-grid rooftop solar with KSEB net metering and the ₹78,000 PM Surya Ghar subsidy handled for you.',
  lang: 'en-IN',
  locale: 'en_IN',
  foundingYear: 2018,
  themeColor: '#0E3A4A',
  backgroundColor: '#F4F1EA',
}

/* ---------- where we work ---------- */

export const AREA = {
  city: 'Malappuram',
  region: 'Kerala',
  regionCode: 'IN-KL',
  country: 'IN',
  countryName: 'India',
  /* towns named on the page; also the local-SEO surface */
  towns: ['Malappuram', 'Manjeri', 'Kottakkal', 'Tirur', 'Perinthalmanna'],
}

/* ---------- contact ----------

   Real, supplied by the client. `isPlaceholder: false` releases the
   launch gate in `npm run seo:check` and lets the telephone and email
   into the JSON-LD, where a fake one would have been worse than none.

   NOTE — postcode discrepancy. The client's billing address gives
   676519. Their own Google Business listing resolves to
   "Valiya Varambu Rd, Down Hill, Malappuram, Kerala 676505". The
   client's stated value is used here because it is their billing
   address, but the two should be reconciled: a website and a Google
   Business Profile disagreeing on the postcode weakens the NAP
   consistency local search leans on.
   ------------------------------------------------------------- */

export const CONTACT = {
  isPlaceholder: false,
  phoneDisplay: '+91 75105 00080',
  phoneHref: 'tel:+917510500080',
  /* E.164, what schema.org and WhatsApp both want */
  phoneE164: '+917510500080',
  whatsappHref: 'https://wa.me/917510500080',
  email: 'deltampm@gmail.com',
  streetAddress: 'Valiyavaramb Bypass, Down Hill',
  postalCode: '676519',
  /* GST identification number — 15 characters, and the leading 32 is
     Kerala's state code. Emitted as schema.org `taxID` and shown in the
     footer, which is normal practice for an Indian business and a real
     trust signal. */
  gstin: '32AAPFD3008C1Z1',
  /* Google Business listing. Emitted as schema.org `hasMap`, not
     `sameAs` — sameAs is for identity profiles, this is a map. */
  mapUrl: 'https://maps.app.goo.gl/UGhCmN2aXj1L23Jn9',
  hoursDisplay: 'Mon–Sat · 9 am – 6 pm',
  opens: '09:00',
  closes: '18:00',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  /* public profiles — feed schema.org `sameAs`. Still empty: the map link
     above is not a social profile, and padding this with it would silence
     a warning that is telling the truth. */
  sameAs: [],
}

/* ---------- what we sell ----------
   Rendered by Services.jsx, emitted as schema.org Service nodes.
   `title` is split in two for the two-tone heading treatment;
   `alt` describes the photo, which is a different job from the heading. */

export const SERVICES = [
  {
    id: 'residential',
    icon: 'home',
    title: ['Residential ', 'solar rooftop.'],
    body: 'Right-sized on-grid systems for homes, with KSEB registration and subsidy filed for you.',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=70',
    alt: 'Solar panels installed across a sloped residential rooftop',
  },
  {
    id: 'commercial',
    icon: 'factory',
    title: ['Commercial and industrial ', 'rooftop solar solution.'],
    body: 'Larger rooftop systems for shops, offices and factories — a real cut to running costs.',
    img: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&w=1000&q=70',
    alt: 'Large commercial rooftop covered in photovoltaic panels',
  },
  {
    id: 'hybrid',
    icon: 'hybrid',
    title: ['Hybrid ', 'solar solution.'],
    body: 'Solar, grid and battery storage together — savings by day, backup the moment the grid drops.',
    img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=70',
    alt: 'Rows of solar panels feeding a hybrid battery storage system',
  },
  {
    id: 'ev-charging',
    icon: 'ev',
    title: ['Solar ', 'EV charging.'],
    body: 'Home and commercial EV charging points, run off your own roof instead of the meter.',
    img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=70',
    alt: 'Electric vehicle plugged into a charging point',
  },
  {
    id: 'inverters-ups',
    icon: 'battery',
    title: ['Inverters and ', 'backup UPS.'],
    body: 'Tier-1 inverters and domestic or industrial UPS for dependable power through every outage.',
    img: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1000&q=70',
    alt: 'Wall-mounted solar inverter and backup battery unit',
  },
]

/* ---------- installed work ----------

   Split into discrete fields rather than prose. "3 kW rooftop home,
   Manjeri · Malappuram" carried capacity, type, town and district inside two
   strings, which meant the card could only ever print them as a sentence.
   As data they can be set as label/value pairs — the way a spec is read —
   and the same fields feed the image alt text.

   Nothing here is new information: every value below was already present in
   the old `name` and `meta` strings. Photographs are still Unsplash stock and
   still need replacing with real installs, which is listed in the README. */

export const PROJECTS = [
  {
    type: 'Residential',
    name: 'Rooftop home',
    capacity: '3 kW',
    town: 'Manjeri',
    district: 'Malappuram',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=70',
  },
  {
    type: 'Commercial',
    name: 'Office rooftop',
    capacity: '20 kW',
    town: 'Kottakkal',
    district: 'Malappuram',
    img: 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=900&q=70',
  },
  {
    type: 'Residential',
    name: 'Villa system',
    capacity: '5 kW',
    town: 'Tirur',
    district: 'Malappuram',
    img: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=70',
  },
  {
    type: 'Industrial',
    name: 'Factory array',
    capacity: '50 kW',
    town: 'Perinthalmanna',
    district: 'Malappuram',
    img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=70',
  },
]

/* ---------- PM Surya Ghar ----------
   Mirrors the tiers the calculator applies in Calculator.jsx. */

/* The statutory PM Surya Ghar schedule: ₹30,000 for each of the first two
   kilowatts and ₹18,000 for the third, capping at ₹78,000. Residential
   connections only. Not Delta's numbers to set, and not rendered as a card
   any more — the price list below derives its "after subsidy" line from this,
   so the two can never disagree on the same page. Also read by the share
   image and by llms.txt. */

export const SUBSIDY_TIERS = [
  { kw: '1 kW', minKw: 1, amount: '₹30,000', value: 30000 },
  { kw: '2 kW', minKw: 2, amount: '₹60,000', value: 60000 },
  { kw: '3 kW+', minKw: 3, amount: '₹78,000', value: 78000 },
]

/* The schedule as a function. The caller owns the eligibility question —
   commercial and industrial connections get nothing, and that is the
   calculator's category switch to answer, not this table's. */
export const subsidyFor = (kw) =>
  [...SUBSIDY_TIERS].reverse().find((t) => kw >= t.minKw)?.value ??
  Math.round(kw * 30000)

/* ---------- what a system costs ---------- */

/* Client's prices, given 2026-09-01. Two of the three were quoted before
   subsidy and the third after it — 10 kW was given as ₹4,50,000 net of the
   ₹78,000 cap — so that one is carried here as ₹5,28,000 and comes back out
   at exactly ₹4,50,000 in the card's "after subsidy" line. Every figure on
   the card is on one basis, which is the only way a buyer can compare rows.

   `price` is before subsidy, installed. The after-subsidy figure is never
   stored: it is `price - subsidyFor(kwValue)`, computed at render. */

export const SYSTEM_PRICES = [
  { kw: '3 kW', kwValue: 3, price: 215000, note: 'Most popular', hot: true },
  { kw: '5 kW', kwValue: 5, price: 320000 },
  { kw: '10 kW', kwValue: 10, price: 528000 },
]

/* What a system of any size costs, read off the price list above — the
   calculator's cost model, so the calculator and the card cannot quote a
   3 kW roof differently.

   Between two quoted sizes it interpolates. Below the smallest it holds that
   size's per-kW rate rather than extrapolating the 3→5 line backwards, which
   would price a 1 kW system above a 2 kW one. Above the largest it continues
   the last segment, which is what keeps a 25 kW commercial estimate sane at
   about ₹46,000 per kW rather than freezing it at the 10 kW rate. */
export const costFor = (kw) => {
  const pts = [...SYSTEM_PRICES].sort((a, b) => a.kwValue - b.kwValue)
  const first = pts[0]
  if (kw <= first.kwValue) return (first.price / first.kwValue) * kw
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    if (kw <= b.kwValue || i === pts.length - 1) {
      return a.price + ((kw - a.kwValue) * (b.price - a.price)) / (b.kwValue - a.kwValue)
    }
  }
}

export const PRICE_CAVEAT =
  'Installed price for a standard on-grid system, before subsidy. Final price follows a site survey.'

export const STEPS = [
  [
    'Free consultation',
    'Share your KSEB bill. We assess your roof and usage, then file your PM Surya Ghar application.',
  ],
  [
    'We install',
    'A clean, certified install by our team. KSEB inspects and fits your net meter.',
  ],
  [
    'You get paid',
    'Savings start from day one and the subsidy reaches your bank within 30–60 days.',
  ],
]

/* ---------- FAQ ----------
   The homepage set. Every page now carries its own keyword-targeted
   questions — a single shared list meant several pages competing for
   one set of queries — so the sets live in content/faqs.js and this
   re-export keeps the name meaning what it always meant here.

   Only the open item is in the prerendered HTML, so the schema.org
   FAQPage node scripts/gen-seo.mjs emits per route is how the rest
   reach a crawler. */

export { HOME_FAQS as FAQS } from './content/faqs.js'

/* ---------- brands we fit ---------- */

/* The eight manufacturers Delta actually deals in. Read by the brands strip
   on `/` and `/services/`, and by the footer, which shows the names alone.

   Each logo is the manufacturer's own current mark, taken from that
   manufacturer's own site and used to identify the equipment we fit —
   nominative use, no endorsement implied or claimed. `w`/`h` are the file's
   intrinsic pixels so the row reserves its space before the images land;
   `scale` is an optical nudge for a mark whose artwork carries more empty
   space than the rest, and is left off where none is needed.

   `supplies` is the line that brand is on this list FOR, not the whole of
   what it manufactures — several of them make more than one category. */

export const BRANDS = [
  { name: 'Waaree',     supplies: 'Solar panels',          logo: '/partners/waaree.png',   w: 254, h: 71 },
  { name: 'Adani Solar', supplies: 'Solar panels',         logo: '/partners/adani.png',    w: 227, h: 42 },
  { name: 'Microtek',   supplies: 'Inverters',             logo: '/partners/microtek.svg', w: 144, h: 50 },
  { name: 'Solaire',    supplies: 'Inverters',             logo: '/partners/solaire.png',  w: 344, h: 120 },
  { name: 'UTL Solar',  supplies: 'Inverters, batteries',  logo: '/partners/utl.png',      w: 560, h: 82 },
  { name: 'Eastman',    supplies: 'Batteries',             logo: '/partners/eastman.png',  w: 182, h: 96, scale: 1.28 },
  { name: 'TSUN',       supplies: 'Microinverters',        logo: '/partners/tsun.png',     w: 143, h: 50 },
  { name: 'Deye',       supplies: 'Hybrid inverters',      logo: '/partners/deye.png',     w: 301, h: 120 },
]

/* ---------- share images ---------- */

export const IMAGES = {
  og: '/og.jpg',
  ogWidth: 1200,
  ogHeight: 630,
  ogAlt:
    'Delta Energy Solutions — rooftop solar in Malappuram, Kerala, with the ₹78,000 PM Surya Ghar subsidy handled.',
  ogSquare: '/og-square.jpg',
  heroPoster: '/hero-poster.jpg',
}

/* Indian digit grouping — ₹2,15,000, not ₹215,000. Shared so the price card
   and the calculator cannot format the same rupee two different ways. */
export const inr = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

/* Absolute URL helper — every emitted file needs the same origin. */
export const abs = (path) => `${SITE.origin}${path.startsWith('/') ? path : `/${path}`}`
