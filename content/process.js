/* ============================================================
   THE JOURNEY — KSEB approval and PM Surya Ghar, step by step
   ============================================================

   `STEPS` in site.config.js is the three-step summary the homepage
   shows. This is the same journey at the detail someone on /subsidy/
   is actually looking for.

   SOURCING. The sequence and the division of labour are stable and
   verifiable: applications go through the Solar Rooftop Portal –
   Kerala, the central subsidy is claimed on the national PM Surya
   Ghar portal against the consumer's own connection and bank account,
   KSEB installs the bidirectional meter, and the subsidy follows
   commissioning.

   NO TIMELINES PER STEP. Competitors publish "feasibility in 15 days,
   approvals in 135 days, meter in 10 days". Those figures appear on
   no official KSEB page — the portal's own FAQ is silent on
   timelines — so they are not repeated here. The one duration stated
   is the end-to-end 4–8 weeks that site.config.js already publishes
   in the homepage FAQ, and it is worded as typical rather than
   promised.
   ============================================================ */

export const PROCESS_REVIEWED = '2026-08-28'

export const PROCESS_INTRO =
  'Going solar in Kerala means satisfying two separate authorities: KSEB, who must approve the connection and fit the meter, and the central PM Surya Ghar scheme, which pays the subsidy. They run on different portals and different paperwork. This is the whole sequence, and who does what at each stage.'

export const PROCESS_STEPS = [
  {
    title: 'Your bill, and a look at the roof',
    who: 'Delta',
    body: 'It starts with a recent KSEB bill. It carries your consumer number, your connection type and your consumption history, which between them determine what size system makes sense and whether you are eligible for the residential subsidy at all. A site visit then settles what the bill cannot: usable area, shading through the day, roof condition and where the inverter and cabling will run.',
  },
  {
    title: 'A written quote, before anything is ordered',
    who: 'Delta',
    body: 'You get the system size, the specific panels and inverter, the expected annual generation, the price, the subsidy you should receive and the warranty terms — in writing. Nothing is ordered and nothing is charged until you have that and have agreed to it.',
  },
  {
    title: 'Registration on the national portal',
    who: 'You, with us',
    body: 'The PM Surya Ghar application is made against your consumer number and your bank account, so this is the step that has to be yours. We sit with you through it. The bank account you register is where the subsidy will land, so it needs to be right and it needs to match the connection holder.',
  },
  {
    title: 'The KSEB application',
    who: 'Delta',
    body: 'All grid-interactive rooftop applications go through the Solar Rooftop Portal – Kerala. We prepare and file the connectivity application and the technical documentation for the proposed system, and handle the correspondence from there.',
  },
  {
    title: 'Approval, then installation',
    who: 'Delta',
    body: 'Installation follows approval, not the other way round — a system commissioned early is a problem to unwind rather than a head start. The rooftop work itself is typically a few days for a domestic system: mounting structure, panels, inverter, earthing and protection, then the connection into your board.',
  },
  {
    title: 'Inspection and the net meter',
    who: 'KSEB',
    body: 'KSEB inspects the installation against the safety and technical requirements, and on clearing it replaces your meter with a bidirectional net meter and fits the renewable energy meter. Both are installed and sealed by KSEB. From the moment they are live, your generation starts counting against your bill.',
  },
  {
    title: 'The subsidy reaches your account',
    who: 'Central government',
    body: 'With commissioning confirmed, the central financial assistance is credited directly to the bank account on your PM Surya Ghar application — to you, not to us. Delta never receives it on your behalf, which is why the quote you signed is the amount you pay.',
  },
]

export const PROCESS_DURATION =
  'End to end, consultation to a live net meter typically runs 4–8 weeks. Most of that is not construction — the rooftop work is a matter of days — but approval and inspection, which run to the utility\'s schedule rather than ours.'

/* What the customer is responsible for, stated plainly. The reference site
   claims to handle "everything", which cannot be true of a subsidy claimed
   against someone else's bank account. */
export const PROCESS_SPLIT = {
  delta: [
    'Sizing the system from your consumption and your roof',
    'The written quote, with named equipment and warranty terms',
    'The KSEB connectivity application and technical documentation',
    'Sitting with you through the PM Surya Ghar registration',
    'Installation, earthing and protection',
    'The test-cum-completion certificate and inspection correspondence',
  ],
  you: [
    'A recent KSEB bill to start from',
    'Registering on the national portal against your own consumer number',
    'A bank account in the connection holder\'s name for the subsidy',
    'Roof access on the installation days',
    'Being available when KSEB comes to inspect',
  ],
}
