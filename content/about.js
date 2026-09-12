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

/* ============================================================
   PURPOSE — CLIENT-SUPPLIED, REAL
   ============================================================

   Unlike everything below it, this is not placeholder. The two
   statements are the client's own words, supplied verbatim, and
   the lead is the closing sentence of the company description
   they sent with them.

   It is a separate export precisely so ABOUT.isPlaceholder
   cannot be read as covering it. This content is confirmed and
   publishable as it stands; the story, milestones, team and
   credentials below still are not.

   The same message established the founding year as 2017, which
   is why nothing in this file says 2018 any more.
   ============================================================ */

export const PURPOSE = {
  lead:
    'Delta is committed to promoting green energy solutions that drive sustainable development and deliver long-term value to our clients.',

  /* Rendered as two cards. `label` is the heading a screen reader
     announces, so it stays the plain word rather than a slogan. */
  pillars: [
    {
      id: 'vision',
      label: 'Vision',
      body: 'To lead the transition toward a sustainable future by promoting green energy, reducing carbon emissions, and driving innovative development within the renewable energy sector.',
    },
    {
      id: 'mission',
      label: 'Mission',
      body: 'To deliver reliable, high-quality solar solutions that empower communities and businesses across Kerala while actively minimising environmental impact.',
    },
  ],
}

export const ABOUT = {
  isPlaceholder: true,

  /* ---------- the story ---------- */

  /* REAL — the client's own company description, minus the word
     "premier" (an unsourced superlative the rest of the site does not
     use about itself) and minus its closing sentence, which is now
     PURPOSE.lead above. Every claim they made is still here. */
  intro:
    'Established in 2017, Delta Energy Solutions is an MNRE-registered vendor dedicated to advancing solar and renewable energy infrastructure across Kerala. Recognised among the top 10 solar providers in Malappuram, we have rapidly expanded to execute high-quality, large-scale projects throughout the state, including major operations in Malappuram and Kozhikode.',

  story: [
    {
      id: 'why',
      eyebrow: 'Why we started',
      title: ['A bill problem, ', 'not a technology problem.'],
      body: [
        'Delta began in 2017 with a simple observation: rooftop solar had become genuinely affordable in Kerala, and almost nobody was installing it. The technology was not the obstacle. The obstacle was that going solar meant navigating KSEB feasibility, a national subsidy portal, a net-metering application and an inspection — and most households gave up somewhere in the middle.',
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
      title: ['Malappuram and Kozhikode, ', 'and across Kerala.'],
      body: [
        'The base is Malappuram district — Manjeri, Kottakkal, Tirur and Perinthalmanna — and the largest projects now run out of Malappuram and Kozhikode, with work across the rest of the state.',
        'Proximity still decides what ownership feels like. A technician who can reach a fault the same week matters far more over a system\'s twenty-five year life than anything on a specification sheet, so the map grows where that promise can be kept.',
      ],
    },
  ],

  /* ---------- MOCK: invented milestones ---------- */

  milestones: [
    ['2017', 'Delta Energy Solutions founded in Malappuram, starting with residential rooftop installations.'],
    ['2020', 'First commercial installations — shops and small offices across Manjeri and Kottakkal.'],
    ['2022', 'Registered as a vendor under the national rooftop solar programme, filing subsidy applications in-house.'],
    ['2024', 'PM Surya Ghar launches; Delta begins handling the new subsidy route end to end for residential customers.'],
    ['2026', 'Hybrid storage and solar EV charging added as standard offerings alongside on-grid work.'],
  ],

  /* ---------- MOCK: invented figures ----------
     Deliberately modest and internally consistent. Replace with real
     numbers from the client before this page goes live. */

  numbers: [
    ['Since 2017', 'Installing across Kerala'],
    ['On-grid, hybrid & EV', 'Residential, commercial and industrial'],
    ['KSEB paperwork', 'Filed end to end, in-house'],
    ['Tier-1 equipment', 'Named in the quote before you commit'],
  ],

  /* ---------- the two owners ----------

     Delta is a partnership firm, not a company — the fourth character of
     the PAN inside CONTACT.gstin is "F". So the designation is Partner,
     never Director: "Managing Director" is an office under the Companies
     Act that a partnership firm cannot hold. Both men own and run the
     firm equally, which is why both read "Co-founder & Managing Partner"
     rather than one of them being singled out as managing.

     Names, portraits and qualifications are all client-supplied and real.
     Order follows the order the client introduced them in; it carries no
     seniority and either entry can move.

     `photo`, `quals` and `bio` are optional. A member without a photo
     falls back to a monogram. `bio` is empty for both on purpose: the
     client has not described how the two divide the work, and inventing a
     split would attach a fabricated claim to a real, recognisable face.
     `quals` carries only what was actually supplied — stated professions
     and licences, not a degree nobody named. */

  team: [
    {
      id: 'shuhaib',
      name: 'Shuhaib M',
      role: 'Co-founder & Managing Partner',
      /* B-class is a Kerala Electrical Inspectorate contractor licence, and
         the most load-bearing credential on this page: it is what lets the
         firm carry out the wiring work its own installations depend on. */
      quals: ['Electrical Engineer', 'B-Class Electrical Contractor'],
      photo: '/team/shuhaib-m.jpg',
    },
    {
      id: 'nawaf',
      name: 'Muhammed Nawaf K',
      role: 'Co-founder & Managing Partner',
      quals: ['Electrical Engineer'],
      photo: '/team/muhammed-nawaf-k.jpg',
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
    'The actual founding story — the founding year, 2017, is confirmed',
    'Milestone dates that happened',
    'Project counts, total kW installed, units generated',
    'A one-line bio for each partner, if they want one — names, portraits and qualifications are all confirmed',
    'The MNRE registration number, and a citable source for the top-10 ranking',
    'Registration and empanelment numbers that can be verified',
    'Whether the five-year workmanship warranty is accurate',
  ],
}
