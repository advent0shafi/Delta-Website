/* ============================================================
   ABOUT — MOCK CONTENT, NOT FACT
   ============================================================

   ⚠  EVERYTHING BELOW IS PLACEHOLDER. It was written to show the
      client what a finished About page looks like, modelled on
      Delta, and every specific in it is invented: the founding
      story, the milestone dates, the project counts, the team
      names and credentials, the certifications.

   It follows the same discipline as CONTACT in site.config.js.
   `isPlaceholder` is the switch:

     - true  → the page renders (so it can be reviewed and shown),
               but nothing here reaches the schema.org graph, and
               `npm run seo:check` FAILS. The site cannot go live
               publishing invented facts about a real business.
     - false → the values are treated as real and published.

   Do not set it to false until every field has been replaced with
   something the client has confirmed. An absent fact is missing
   data; a fabricated one is a wrong fact under Delta's name — the
   same reasoning that keeps the fake phone number out of the
   JSON-LD today.

   The rest of content/ is verifiable and sourced. This file is the
   exception, and is deliberately the only one.

   To replace: work through research/illumine/04-delta-gap-analysis.md,
   which lists exactly what to ask the client for.
   ============================================================ */

export const ABOUT = {
  isPlaceholder: true,

  /* ---------- the story ---------- */

  intro:
    'Delta Energy Solutions has been fitting rooftop solar across Malappuram district since 2018 — homes, shops and factories, on-grid and hybrid, with the KSEB paperwork handled end to end.',

  story: [
    {
      id: 'why',
      eyebrow: 'Why we started',
      title: ['A bill problem, ', 'not a technology problem.'],
      body: [
        'Delta began in 2018 with a simple observation: rooftop solar had become genuinely affordable in Kerala, and almost nobody was installing it. The technology was not the obstacle. The obstacle was that going solar meant navigating KSEB feasibility, a national subsidy portal, a net-metering application and an inspection — and most households gave up somewhere in the middle.',
        'So the company was built around the paperwork as much as the panels. That is still the part customers tell us made the difference.',
      ],
    },
    {
      id: 'how',
      eyebrow: 'How we work',
      title: ['Sized from your bill, ', 'not from a price list.'],
      body: [
        'Every quote starts with a KSEB bill and a look at the roof, because a system sized from anything else is a guess. We would rather tell someone their roof needs attention first, or that a smaller system pays back faster, than sell the larger one.',
        'We name the exact panels and inverter in the quote before anything is ordered, so the warranty terms and the service network can be checked independently. Nothing is charged until that quote is agreed.',
      ],
    },
    {
      id: 'where',
      eyebrow: 'Where we work',
      title: ['Malappuram district, ', 'and the towns around it.'],
      body: [
        'Delta works across Malappuram, Manjeri, Kottakkal, Tirur and Perinthalmanna. Staying within one district is a deliberate choice: it means a technician can reach a fault the same week, which matters far more over a system\'s twenty-five year life than anything on a specification sheet.',
      ],
    },
  ],

  /* ---------- MOCK: invented milestones ---------- */

  milestones: [
    ['2018', 'Delta Energy Solutions founded in Malappuram, starting with residential rooftop installations.'],
    ['2020', 'First commercial installations — shops and small offices across Manjeri and Kottakkal.'],
    ['2022', 'Registered as a vendor under the national rooftop solar programme, filing subsidy applications in-house.'],
    ['2024', 'PM Surya Ghar launches; Delta begins handling the new subsidy route end to end for residential customers.'],
    ['2026', 'Hybrid storage and solar EV charging added as standard offerings alongside on-grid work.'],
  ],

  /* ---------- MOCK: invented figures ----------
     Deliberately modest and internally consistent. Replace with real
     numbers from the client before this page goes live. */

  numbers: [
    ['Since 2018', 'Installing across Malappuram district'],
    ['On-grid, hybrid & EV', 'Residential, commercial and industrial'],
    ['KSEB paperwork', 'Filed end to end, in-house'],
    ['Tier-1 equipment', 'Named in the quote before you commit'],
  ],

  /* ---------- MOCK: invented people ----------
     These are not real individuals, and the portraits are STAND-INS supplied
     for the mockup — they are not photographs of Delta staff.

     That distinction matters more than the invented dates elsewhere in this
     file. Publishing a real person's face beside "Founder & Managing Director"
     of a real company misrepresents that person, not just the company, so
     these two images must be replaced with actual staff photographs (with
     their consent) before ABOUT.isPlaceholder can become false.

     `photo` is optional: a member without one falls back to a monogram, which
     is what the third slot uses since only two portraits were supplied.

     `role` reads "Name to follow" rather than a shouted PLACEHOLDER banner.
     The card has to be presentable — it exists to be shown to the client —
     and the loud version wrapped onto two lines on every card while being
     inaccurate for the two that now have a picture. The real guard against
     this shipping is `isPlaceholder` and the seo:check failure it drives,
     not a caption. */

  team: [
    {
      name: 'Founder & Managing Director',
      role: 'Name to follow',
      photo: '/team/placeholder-1.jpg',
      bio: 'Leads system design and customer consultation. Background in electrical engineering, with rooftop solar work across Malappuram district since 2018.',
    },
    {
      name: 'Technical Lead',
      role: 'Name to follow',
      photo: '/team/placeholder-2.jpg',
      bio: 'Responsible for site assessment, system sizing and the KSEB technical documentation, from feasibility through to the inspection.',
    },
    {
      name: 'Installations Manager',
      role: 'Name to follow',
      bio: 'Runs the installation crews, mounting structure specification and post-commissioning service visits.',
    },
  ],

  /* ---------- MOCK: unverified accreditations ---------- */

  credentials: [
    'Registered vendor under the national rooftop solar programme',
    'KSEB-approved for grid-interactive rooftop installations',
    'Tier-1 panel and inverter supply agreements',
    'Five-year workmanship warranty on every installation',
  ],

  /* What the client has to confirm or replace before isPlaceholder can
     become false. Rendered nowhere; this is a checklist for whoever
     picks the page up. */
  needsFromClient: [
    'Real founding year and the actual founding story',
    'Milestone dates that happened',
    'Project counts, total kW installed, units generated',
    'Team names, roles, and REAL staff photographs with consent to publish — the two portraits currently shown are stand-ins, not Delta staff',
    'Registration and empanelment numbers that can be verified',
    'Whether the five-year workmanship warranty is accurate',
  ],
}
