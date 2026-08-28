/* ============================================================
   DELTA ENERGY SOLUTIONS — the route table
   ============================================================

   One entry per indexable page. Like `site.config.js` this file is
   imported by BOTH the browser bundle and the Node build scripts, so
   it must stay pure data — no JSX, no Node APIs, no side effects.

   Consumers:
     src/routes.jsx          — attaches a page component to each path
     scripts/prerender.mjs   — renders one HTML document per entry and
                               rewrites that document's <head>
     scripts/gen-seo.mjs     — sitemap.xml and llms.txt entries
     scripts/seo-check.mjs   — asserts each built page carries its own
                               title/description/canonical

   `title` and `description` are per-page on purpose: six pages that
   all claim the homepage's <title> compete with each other in search
   instead of covering six different queries.

   The home entry reuses SITE.title / SITE.description rather than
   restating them, so the homepage still has exactly one source.
   ============================================================ */

import { SITE } from './site.config.js'

export const ROUTES = [
  {
    path: '/',
    title: SITE.title,
    description: SITE.description,
    /* Drives <priority> in sitemap.xml. */
    priority: '1.0',
  },
  {
    path: '/about/',
    title: 'About Delta Energy Solutions, Malappuram | Rooftop Solar',
    description:
      'Rooftop solar across Malappuram district since 2018 — how Delta sizes a system, which equipment it fits, and how the KSEB paperwork is handled.',
    priority: '0.7',
  },
  {
    path: '/services/',
    title: 'Solar Services in Malappuram, Kerala | Delta Energy Solutions',
    description:
      'Residential and commercial rooftop solar, hybrid battery systems, solar EV charging and backup UPS across Malappuram district. KSEB approvals handled for you.',
    priority: '0.9',
  },
  {
    path: '/subsidy/',
    title: 'PM Surya Ghar Subsidy in Kerala — up to ₹78,000 | Delta Energy',
    description:
      'Claim up to ₹78,000 under PM Surya Ghar. Delta files your KSEB application and subsidy paperwork end to end, from first consultation to net meter.',
    priority: '0.9',
  },
  {
    path: '/savings-calculator/',
    title: 'Solar Savings Calculator, KSEB Tariffs | Delta Energy',
    description:
      'Estimate your rooftop solar system size, cost after subsidy, monthly savings and payback period. Kerala KSEB tariffs are pre-filled.',
    priority: '0.8',
  },
  {
    path: '/services/residential/',
    title: 'Residential Rooftop Solar in Malappuram | Delta Energy',
    description:
      'On-grid solar for Kerala homes: how a system is sized from your KSEB bill, what roof it needs, and how the PM Surya Ghar subsidy applies.',
    priority: '0.8',
  },
  {
    path: '/services/commercial/',
    title: 'Commercial & Industrial Solar in Kerala | Delta Energy',
    description:
      'Rooftop solar for shops, offices and factories in Malappuram. Why a daytime load profile pays back faster, and what applies without a subsidy.',
    priority: '0.8',
  },
  {
    path: '/services/hybrid/',
    title: 'Hybrid Solar with Battery Backup, Kerala | Delta Energy',
    description:
      'Solar that keeps running through a KSEB outage. What hybrid adds over on-grid, how backup is sized, and lithium against lead-acid.',
    priority: '0.8',
  },
  {
    path: '/services/ev-charging/',
    title: 'Solar EV Charging from Your Own Roof, Kerala | Delta Energy',
    description:
      'Charge an electric vehicle from your own roof. Sizing for an EV, home wall boxes against DC fast charging, and workplace charging.',
    priority: '0.7',
  },
  {
    path: '/services/inverters-ups/',
    title: 'Solar Inverters & Backup UPS, Kerala | Delta Energy',
    description:
      'Backup power sized from an actual load list. How a solar inverter differs from a UPS, adding solar to an inverter you own, and battery life.',
    priority: '0.7',
  },
  {
    path: '/kseb-net-metering/',
    title: 'KSEB Net Metering in Kerala — How It Works | Delta Energy',
    description:
      'Net metering against gross metering, the two meters KSEB fits, how banked units are settled, and why solar shuts down in a power cut.',
    priority: '0.9',
  },
  {
    path: '/projects/',
    title: 'Solar Installations across Malappuram | Delta Energy Solutions',
    description:
      'Rooftop solar we have installed across Manjeri, Kottakkal, Tirur and Perinthalmanna — from 3 kW homes to a 50 kW factory array.',
    priority: '0.8',
  },
  {
    path: '/contact/',
    title: 'Contact Delta Energy Solutions, Malappuram | Free Solar Quote',
    description:
      'Talk to Delta Energy Solutions about rooftop solar in Malappuram. Free site assessment and a written quote, with all KSEB paperwork handled.',
    priority: '0.7',
  },
]

/* Where a built page is written, and what a static host serves for the
   path. `/` is the shell Vite emits; everything else becomes a
   directory with its own index.html so `/subsidy/` resolves without
   server rewrite rules. */
export const routeToFile = (path) =>
  path === '/' ? 'index.html' : `${path.replace(/^\/|\/$/g, '')}/index.html`

export const findRoute = (path) => {
  /* Tolerate a missing trailing slash so /subsidy and /subsidy/ agree. */
  const want = path.endsWith('/') ? path : `${path}/`
  return ROUTES.find((r) => r.path === want)
}
