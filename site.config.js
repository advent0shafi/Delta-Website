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

   PLACEHOLDERS. `npm run seo:check` fails while any of these are
   still here, so the site cannot go live carrying fake details.

   `isPlaceholder` gates the values out of the JSON-LD: an absent
   `telephone` is correct data, a fake one is a wrong fact published
   under Delta's name. Set it to false once the real numbers land.
   ------------------------------------------------------------- */

export const CONTACT = {
  isPlaceholder: true,
  phoneDisplay: '+91 XXXXX XXXXX',
  phoneHref: 'tel:+910000000000',
  /* E.164, what schema.org and WhatsApp both want */
  phoneE164: '+910000000000',
  whatsappHref: 'https://wa.me/910000000000',
  email: 'hello@deltaenergy.in',
  streetAddress: '',
  postalCode: '',
  hoursDisplay: 'Mon–Sat · 9 am – 6 pm',
  opens: '09:00',
  closes: '18:00',
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  /* public profiles — feed schema.org `sameAs`. Empty until real. */
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

/* ---------- installed work ---------- */

export const PROJECTS = [
  {
    tag: 'Residential',
    name: '3 kW rooftop home',
    meta: 'Manjeri · Malappuram',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=70',
  },
  {
    tag: 'Commercial',
    name: '20 kW office rooftop',
    meta: 'Kottakkal · Malappuram',
    img: 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=900&q=70',
  },
  {
    tag: 'Residential',
    name: '5 kW villa system',
    meta: 'Tirur · Malappuram',
    img: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=70',
  },
  {
    tag: 'Industrial',
    name: '50 kW factory array',
    meta: 'Perinthalmanna · Malappuram',
    img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=70',
  },
]

/* ---------- PM Surya Ghar ----------
   Mirrors the tiers the calculator applies in Calculator.jsx. */

export const SUBSIDY_TIERS = [
  { kw: '1 kW', amount: '₹30,000', value: 30000, label: 'For 1 kW systems' },
  { kw: '2 kW', amount: '₹60,000', value: 60000, label: 'For 2 kW systems' },
  {
    kw: '3 kW+',
    amount: '₹78,000',
    value: 78000,
    label: 'Maximum subsidy — most popular',
    hot: true,
  },
]

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

export const BRANDS = ['Tata Power Solar', 'Waaree', 'Microtek', 'V-Guard', 'Vikram']

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

/* Absolute URL helper — every emitted file needs the same origin. */
export const abs = (path) => `${SITE.origin}${path.startsWith('/') ? path : `/${path}`}`
