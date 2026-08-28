/* ============================================================
   KSEB NET METERING — long-form content
   ============================================================

   Powers /kseb-net-metering/. The reference site (Illumine) covers
   this only as a section repeated verbatim across three product
   pages; a page of its own answers the query directly.

   SOURCING. Everything asserted here is either a stable mechanism
   (how net metering works, why grid-tied systems shut down in an
   outage) or a fact published by KSEB on the Solar Rooftop Portal:

     - all grid-interactive rooftop applications go through the portal
     - a net meter AND a renewable energy meter are required
     - meters comply with the CEA (Installation and Operation of
       Meters) Regulations, 2006
     - domestic consumers with connected load up to 20 kW may install
       up to 20 kW irrespective of connected load
     - maximum 1 MWp at a single location

   DELIBERATELY ABSENT. Kerala's framework is mid-revision: the KSERC
   (Renewable Energy and Related Matters) Regulations, 2025 were
   notified on 6 November 2025 and stayed by the Kerala High Court on
   10 November 2025, and sources disagree on the resulting capacity
   caps. Approval timelines widely quoted by competitors (15 / 135 /
   10 days) appear on no official KSEB page. Banked-energy settlement
   rates are tied to the contested regulation. None of that is stated
   as fact here — the page tells the reader the position is moving and
   sends them to the portal, which is both honest and the thing the
   reference site gets wrong.

   Review this file when the regulation's status resolves.
   ============================================================ */

export const NET_METERING_REVIEWED = '2026-08-28'

export const KSEB_PORTAL = {
  label: 'Solar Rooftop Portal – Kerala',
  href: 'https://ekiran.kseb.in/',
}

export const NET_METERING_INTRO =
  'Net metering is the arrangement that turns a rooftop array into a lower KSEB bill. Your panels supply your own loads first, whatever you do not use flows out to the grid, and you are billed on the difference. Everything below is how that works in Kerala, what KSEB requires, and where the rules are currently moving.'

export const NET_METERING_SECTIONS = [
  {
    id: 'net-vs-gross',
    eyebrow: 'The basic distinction',
    title: ['Net metering, ', 'and how it differs from gross.'],
    body: [
      'Under net metering, your solar generation is consumed on site before anything else happens. The washing machine, the fridge and the fans draw from the roof rather than from the grid, and only the surplus is exported. At the end of the billing period KSEB reads both directions and charges you on the net. Every unit you generate and use immediately is a unit you never buy, which is why it offsets the full retail tariff.',
      'Gross metering works the other way round. The entire output of the system is metered and sold to the utility at a set rate, while you carry on buying everything you consume at the normal tariff. It suits a generator built to sell power. It does not suit a household trying to cut a bill, because the rate paid for generation is lower than the rate charged for consumption.',
      'For a rooftop in Kerala, net metering is almost always the arrangement you want, and it is what Delta designs for by default.',
    ],
  },
  {
    id: 'meters',
    eyebrow: 'What changes at your board',
    title: ['Two meters, ', 'not one.'],
    body: [
      'Your existing meter counts in one direction, so it cannot describe a connection that both draws and supplies. KSEB replaces it with a bidirectional net meter that records import and export separately. A second meter, the renewable energy meter, records what the system itself generates — which is what makes it possible to tell a shortfall in generation apart from a rise in consumption.',
      'Both are installed and sealed by KSEB, not by your installer, and both must comply with the CEA (Installation and Operation of Meters) Regulations, 2006. You do not buy them from us.',
    ],
  },
  {
    id: 'billing',
    eyebrow: 'What the bill looks like',
    title: ['Reading a bill ', 'after solar.'],
    body: [
      'Once the net meter is live your bill stops being a single consumption figure. It shows units imported from the grid, units exported to it, and the net position that you are actually charged on. In a good month a well-sized residential system can push that net figure close to zero.',
      'Surplus you export beyond what you consume is not simply paid out in cash. It is banked against later consumption and settled periodically under the KSERC regulations in force at the time. This is the single most important thing to understand about the economics: a unit you consume yourself is worth the full retail tariff, while a unit you export is worth the banked rate, which is lower.',
      'That asymmetry is why sizing matters more than maximising. A system built to cover your consumption pays back faster than an oversized one built to export, and it is why Delta\'s savings calculator credits generation only up to what you actually use.',
    ],
  },
  {
    id: 'capacity',
    eyebrow: 'How large you may go',
    title: ['Capacity limits, ', 'and why we check yours.'],
    body: [
      'KSEB permits domestic consumers with a connected load up to 20 kW to install a renewable energy system of up to 20 kW, irrespective of their connected load, subject to a maximum of 1 MWp at a single location. In practice a domestic roof is limited by usable area long before it is limited by regulation.',
      'The wider capacity framework is being revised. The KSERC (Renewable Energy and Related Matters) Regulations, 2025 were notified in November 2025 and their operation was stayed by the Kerala High Court shortly afterwards, and published summaries of the resulting limits do not agree with one another. We do not repeat figures we cannot stand behind.',
      'What we do instead is confirm the limit that applies to your specific connection before any system is designed or any equipment is ordered. If you want to check independently, the current position is published on the KSEB solar portal.',
    ],
    source: KSEB_PORTAL,
  },
  {
    id: 'outage',
    eyebrow: 'A common surprise',
    title: ['Solar does not ', 'survive a power cut.'],
    body: [
      'A grid-tied system disconnects the instant the grid goes down, even at midday with the panels in full sun. This is deliberate and non-negotiable: an inverter that kept feeding a dead line would put anyone working on that line in danger. Every compliant grid-tied inverter behaves this way.',
      'If riding through outages is what you actually want, the answer is storage — a hybrid system that charges a battery and holds selected circuits up, or a conventional backup inverter alongside an on-grid array. Both cost more per kilowatt than plain on-grid solar, and it is worth being clear with yourself about which problem you are solving before you pay for the more expensive one.',
    ],
  },
  {
    id: 'applying',
    eyebrow: 'Getting connected',
    title: ['Everything goes ', 'through one portal.'],
    body: [
      'All grid-interactive rooftop applications in Kerala are processed through the Solar Rooftop Portal – Kerala. There is no offline route, and an installation commissioned before approval is a problem to unwind rather than a shortcut.',
      'Delta prepares and files the application, the technical documentation and the completion certificate, and handles the correspondence through inspection. What we cannot do for you is the part tied to your own identity — registering against your consumer number and bank account for the central subsidy. We will tell you exactly when that is needed.',
    ],
    source: KSEB_PORTAL,
  },
]
