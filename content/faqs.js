/* ============================================================
   FAQ SETS — keyed by route
   ============================================================

   One set per page, each targeting the questions someone actually
   arrives on THAT page asking. A single shared list, which is what
   this replaced, means five pages competing for one set of queries.

   Every answer here is either a verifiable fact or a description of
   how Delta works. Nothing states a figure Delta has not published
   elsewhere: system cost, generation and roof area all come from the
   assumptions documented in docs/calculator-logic.md, and are worded
   as indicative because that is what they are.

   Regulatory caution: Kerala's net-metering limits are in flux — the
   KSERC (Renewable Energy and Related Matters) Regulations, 2025 were
   notified in November 2025 and stayed by the High Court days later.
   Answers therefore avoid quoting capacity caps and settlement rates
   that may not be in force, and send the reader to the KSEB portal
   for the position on the day they apply.

   Consumed by src/components/FAQ.jsx and, per route, by the FAQPage
   JSON-LD that scripts/gen-seo.mjs emits.
   ============================================================ */

/* ---------- homepage — broad, high-intent ---------- */

export const HOME_FAQS = [
  [
    'How much does a home system cost after subsidy?',
    'A 3 kW system typically costs around ₹1,80,000 before subsidy. After the PM Surya Ghar subsidy of up to ₹78,000, your net cost is roughly ₹1,02,000. You get a full written quote before any commitment.',
  ],
  [
    'How much can I save on my KSEB bill?',
    'Most homes see a 70–90% cut in their monthly bill. A 3 kW system saves roughly ₹1,800–₹2,500 per month depending on usage.',
  ],
  [
    'Who is eligible for the ₹78,000 subsidy?',
    'Any residential consumer with a valid KSEB connection. The subsidy is up to ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW and above. We handle the entire application.',
  ],
  [
    'How long does installation and approval take?',
    'From consultation to net-meter activation, the process typically takes 4–8 weeks, including KSEB inspection and approval.',
  ],
  [
    'Do you handle all the KSEB paperwork?',
    'Yes — every document. The grid-connectivity application, technical undertaking, PM Surya Ghar registration, and the test-cum-completion certificate.',
  ],
]

/* ---------- PM Surya Ghar ---------- */

export const SUBSIDY_FAQS = [
  [
    'How is the ₹78,000 subsidy actually calculated?',
    'It is not a flat percentage. PM Surya Ghar pays ₹30,000 for each of the first two kilowatts and ₹18,000 for the third — so 1 kW draws ₹30,000, 2 kW draws ₹60,000, and 3 kW draws ₹78,000. Capacity beyond 3 kW earns no additional central subsidy, which is why 3 kW is the size most Kerala homes settle on.',
  ],
  [
    'Is the subsidy paid to me or to the installer?',
    'To you. The central financial assistance is credited directly to the bank account registered in your PM Surya Ghar application, after your system is commissioned and the net meter is in place. Delta never receives it on your behalf, so the quote you sign is the amount you pay us.',
  ],
  [
    'Can a shop, office or factory claim the subsidy?',
    'No. PM Surya Ghar is a residential scheme, so commercial, industrial and institutional connections are outside it. Those installations still make financial sense — they simply earn through bill reduction and accelerated depreciation rather than a capital subsidy. Our calculator returns zero subsidy when you pick a commercial connection, for exactly this reason.',
  ],
  [
    'Does the subsidy still apply if I install more than 3 kW?',
    'Yes, but it is capped. A 5 kW residential system is eligible for the same ₹78,000 as a 3 kW one. Going larger is worth it when your consumption justifies it — the extra capacity pays for itself through generation, not through subsidy.',
  ],
  [
    'What can disqualify an application?',
    'The common ones are a mismatch between the applicant and the KSEB consumer name, a connection that is not residential, panels that do not meet the scheme\'s domestic-content requirement, or commissioning the system before approval comes through. We check all four before anything is ordered.',
  ],
  [
    'Do I have to apply myself?',
    'You need to be present for the parts only you can do — registering on the national portal against your own consumer number and bank account. Everything after that, including the KSEB side, we prepare and file.',
  ],
]

/* ---------- KSEB net metering ---------- */

export const NET_METERING_FAQS = [
  [
    'What is the difference between net metering and gross metering?',
    'Net metering meters the difference. Your solar feeds your own loads first, only the surplus is exported, and you are billed on the net of import and export. Gross metering meters everything your system generates and sells it to the utility at a set rate, while you keep buying your consumption at the retail tariff. For a Kerala rooftop, net metering is the arrangement that matters.',
  ],
  [
    'What actually changes on my electricity meter?',
    'Your existing meter is replaced with a bidirectional net meter, and a separate renewable energy meter records what the system generates. KSEB installs and seals both. All meters must comply with the CEA (Installation and Operation of Meters) Regulations, 2006.',
  ],
  [
    'What happens to the units I export but do not use?',
    'They are banked against your later consumption rather than paid out immediately, and settled periodically under the KSERC regulations in force. The exact settlement terms are being revised — check the current position on the KSEB solar portal when you apply, or ask us and we will confirm it for your connection.',
  ],
  [
    'How big a system am I allowed to install?',
    'KSEB permits domestic consumers with a connected load up to 20 kW to install a renewable energy system of up to 20 kW, irrespective of their connected load, with a maximum of 1 MWp at a single location. Kerala\'s capacity rules are under revision, so we confirm the limit that applies to your connection before designing anything.',
  ],
  [
    'Will solar keep my lights on during a KSEB outage?',
    'Not on its own. A grid-tied system disconnects the moment the grid drops — that is a safety requirement, so it cannot backfeed a line someone may be working on. If you want power through an outage you need a hybrid system with battery storage, or a separate backup inverter.',
  ],
  [
    'Where do applications get submitted?',
    'Everything goes through the Solar Rooftop Portal – Kerala. All grid-interactive rooftop applications are processed there; there is no offline route. We prepare and file the application for you.',
  ],
]

/* ---------- calculator ---------- */

export const CALCULATOR_FAQS = [
  [
    'How accurate is the estimate?',
    'It is a planning figure, not a quotation. It assumes about 1,460 kWh generated per kW per year, roughly ₹60,000 per kW installed and about 100 sq ft of usable roof per kW — reasonable averages for on-grid rooftops in Kerala. Your roof\'s orientation, shading and the tariff you actually pay will move the result, which is what a site survey settles.',
  ],
  [
    'Why does the calculator cap my savings at what I consume?',
    'Because exported units are not worth the same as units you avoid buying. Consuming your own generation offsets the full retail tariff; exporting surplus is settled at a lower banked rate. The calculator credits generation only up to your own consumption, so the savings figure does not flatter itself.',
  ],
  [
    'What tariff should I enter?',
    'The rate on your latest KSEB bill, in rupees per unit. The slider starts at ₹5.50, which is a mid-range residential slab. If your bill is high you are probably paying more than that, and solar will pay back faster than the default suggests.',
  ],
  [
    'Why does a commercial connection show no subsidy?',
    'PM Surya Ghar is residential-only. The calculator reflects that rather than quietly inflating a commercial estimate with a subsidy that will never arrive.',
  ],
  [
    'What does the payback period include?',
    'It is the net cost after subsidy divided by the first year\'s savings. It does not model tariff inflation, which shortens payback in practice, nor panel degradation, which lengthens it slightly. The two partly cancel; treat the figure as a range, not a date.',
  ],
]

/* ---------- services ---------- */

export const SERVICES_FAQS = [
  [
    'Which system type is right for me?',
    'If you want the lowest bill and already cope with outages, on-grid is the cheapest route to that. If outages are the problem you actually want solved, hybrid adds battery backup at a higher cost per kW. Shops, offices and factories almost always start on-grid, because the load runs in daylight, when the panels do.',
  ],
  [
    'Do you install on every roof type?',
    'Concrete, tiled and sheet roofs are all standard work, each with a different mounting structure. What matters more than the material is usable unshaded area — roughly 100 sq ft per kW — and the condition of the roof itself. We would rather tell you a roof needs attention first than mount an array on it.',
  ],
  [
    'What warranty comes with the equipment?',
    'Panels normally carry a product warranty of 10–12 years and a performance warranty of 25 years or more. Inverters vary far more, from about 5 years to over a decade, and can often be extended. We put the exact terms for the products in your quote in writing.',
  ],
  [
    'Do you service systems you did not install?',
    'Yes, for maintenance and fault-finding. Where a system was badly installed we will say so plainly and quote for putting it right rather than patching around it.',
  ],
  [
    'How much maintenance does a rooftop system need?',
    'Very little, mechanically — there are no moving parts. What it does need is clean panels and someone watching the generation figures. In Kerala the monsoon does much of the washing, but dust and leaf litter in the dry months measurably cut output.',
  ],
]

/* ---------- per service ---------- */

export const SERVICE_FAQS = {
  residential: [
    [
      'What size system does an average Kerala home need?',
      'Most homes land between 2 kW and 5 kW. The honest way to size it is from your bill: divide your monthly units by about 122 to get the kW you would need to cover them. A home using 400 units a month is looking at roughly 3.3 kW — which is also where the subsidy peaks.',
    ],
    [
      'How much roof do I need?',
      'About 100 sq ft of unshaded roof per kW, so a 3 kW system needs roughly 300 sq ft. Shade matters more than area: a roof that is large but overshadowed by a coconut palm for three hours a day will underperform a smaller clear one.',
    ],
    [
      'Will it work through the monsoon?',
      'It works, at reduced output. Panels generate from daylight rather than direct sun, so an overcast Kerala June still produces — just well below a clear February. Annual sizing already accounts for this, which is why systems are specified against yearly generation rather than a good day.',
    ],
    [
      'Can I add more panels later?',
      'Usually yes, but it is much cheaper to plan for it now. The constraint is the inverter\'s capacity and your sanctioned load, not the roof. Tell us if you expect to add an EV or air conditioning and we will size the inverter with headroom.',
    ],
    [
      'Does a rooftop system affect the roof itself?',
      'Properly mounted, no — and it shades the surface underneath, which measurably reduces heat gain into the rooms below. Poorly mounted, it can create leak paths through the waterproofing. This is entirely a question of how the penetrations are made and sealed.',
    ],
  ],

  commercial: [
    [
      'Why does commercial solar pay back faster than residential?',
      'Because the load profile fits. A shop, office or factory consumes most of its power in daylight, exactly when the array is producing, so nearly every unit generated displaces a unit bought at the commercial tariff — which is higher than the domestic one. Little is exported at the lower banked rate.',
    ],
    [
      'There is no subsidy for commercial. Is it still worth it?',
      'The subsidy is not what makes commercial solar work; the tariff is. Commercial and industrial consumers pay more per unit than households, and businesses can claim accelerated depreciation on the asset. The case rests on displaced tariff and tax treatment rather than a capital grant.',
    ],
    [
      'Will it run our machinery during a power cut?',
      'A grid-tied commercial system will not — it disconnects when the grid does. If continuity of production is the requirement, that is a hybrid or a generator conversation, and the sizing question changes from "how do we cut the bill" to "what must stay running".',
    ],
    [
      'How disruptive is the installation?',
      'Rooftop work is largely independent of what happens below it. The interruption is the changeover and the KSEB inspection, which are short and can be scheduled around your operating hours.',
    ],
    [
      'What size can a commercial rooftop go to?',
      'Kerala permits rooftop systems well beyond typical commercial demand, up to a maximum of 1 MWp at a single location, with the practical limit usually being roof area and sanctioned load rather than regulation. The capacity rules are being revised, so we confirm what applies to your connection before design.',
    ],
  ],

  hybrid: [
    [
      'What does hybrid actually add over on-grid?',
      'Storage, and the ability to keep running when the grid stops. An on-grid system is a bill-reduction machine that shuts down in an outage. A hybrid system charges a battery from the panels and holds selected circuits up when KSEB goes down — you pay for that capability in battery cost.',
    ],
    [
      'How long will the battery run my house?',
      'That depends on what you ask it to hold up, not on the battery alone. Lights, fans, a fridge and networking will run for hours on a modest bank. Air conditioning and water heating drain it in minutes. The right design starts by deciding which circuits matter during an outage.',
    ],
    [
      'Lithium or lead-acid?',
      'Lithium costs more upfront and generally lasts substantially longer, tolerates deeper discharge and needs no topping up. Lead-acid is cheaper to buy and is still reasonable where outages are rare and the bank is small. Over a full lifetime the cost gap narrows considerably.',
    ],
    [
      'Is hybrid worth it in Kerala specifically?',
      'It depends on your monsoon. If storm-season outages are a genuine disruption where you live, the backup is the point and the economics are secondary. If your supply is stable, an on-grid system plus a conventional backup inverter is usually the cheaper way to the same place.',
    ],
    [
      'Do I still get net metering with a hybrid system?',
      'Yes — a hybrid system can export surplus like any grid-interactive installation, subject to the same KSEB approval. It simply has somewhere to put the energy before exporting it.',
    ],
  ],

  'ev-charging': [
    [
      'Can I really run my car off the roof?',
      'For most driving, yes. A typical Indian EV uses roughly 15 kWh per 100 km, and a 3 kW array generates about 12 kWh on a good Kerala day. Daytime charging draws straight from generation; charging overnight pulls from the grid unless you have storage.',
    ],
    [
      'Do I need a bigger solar system for an EV?',
      'Usually. An EV can add more consumption than the rest of the house combined. It is worth sizing for it at the outset — retrofitting capacity costs more than specifying it once, and your sanctioned load may need revisiting too.',
    ],
    [
      'What kind of charge point do I need at home?',
      'Most homes are well served by an AC wall box, which is what the vehicle\'s onboard charger expects. Fast DC charging is a commercial proposition — the equipment and the supply upgrade both cost far more than home charging justifies.',
    ],
    [
      'Can I install charging for a workplace or a shop?',
      'Yes, and it pairs unusually well with commercial solar: vehicles sit parked through the working day, which is exactly when the array is producing. That turns a fleet or a customer car park into daytime load for generation that would otherwise be exported cheaply.',
    ],
    [
      'Will charging the car and running the house together trip anything?',
      'Not if the installation is designed for it. This is a question of load management and the capacity of your connection, which is part of what we assess before quoting.',
    ],
  ],

  'inverters-ups': [
    [
      'What is the difference between a solar inverter and a backup inverter?',
      'A solar inverter converts DC from the panels into AC you can use or export. A backup inverter or UPS charges a battery and switches over when the mains fail. They solve different problems, which is why an on-grid solar system does not give you backup unless a second device provides it.',
    ],
    [
      'Can I add solar to the inverter I already own?',
      'Sometimes, with a solar charge controller, and it is worth asking before replacing anything. But an ordinary backup inverter is not a grid-tied solar inverter and cannot export to KSEB, so this route reduces what you draw rather than earning you net-metering credit.',
    ],
    [
      'How do I size a backup system?',
      'Add up what must stay running and for how long. Sizing by house area or by habit is how people end up with a bank that is too small in an outage and too expensive the rest of the time.',
    ],
    [
      'How long do batteries last?',
      'It depends far more on how deeply and how often they are discharged than on age alone. Lithium chemistries generally tolerate many more cycles than lead-acid at the same depth of discharge. Heat shortens the life of both, which matters in a Kerala installation.',
    ],
    [
      'What should I look for in an inverter brand?',
      'Service network before specification sheet. Efficiency figures across reputable brands are close enough that they rarely decide the outcome; what decides it is whether someone can attend a fault and whether replacement parts exist locally.',
    ],
  ],
}

/* ---------- getting started ---------- */

export const CONTACT_FAQS = [
  [
    'What should I have ready before contacting you?',
    'A recent KSEB bill is enough to start — it carries your consumer number, connection type and consumption, which is most of what sizing needs. A photo of the roof helps, but is not required.',
  ],
  [
    'Is the site visit free?',
    'Yes, and so is the written quote that follows it. There is no charge and no obligation up to the point you decide to proceed.',
  ],
  [
    'Which areas do you cover?',
    'Malappuram district and the towns around it, including Manjeri, Kottakkal, Tirur and Perinthalmanna. If you are just outside that, ask — it is often still workable.',
  ],
  [
    'How soon can you visit?',
    'Usually within a few days of getting in touch. Message us on WhatsApp with your bill and we can often size the system approximately before anyone travels.',
  ],
  [
    'Can we talk in Malayalam?',
    'Yes. Malayalam or English, whichever you prefer.',
  ],
]

/* ---------- projects ---------- */

export const PROJECTS_FAQS = [
  [
    'Can I see a system near me before deciding?',
    'Usually. We work across Malappuram district, so there is often an installation close enough to look at. Ask and we will arrange what the owner is happy for us to show.',
  ],
  [
    'How long does an installation take on site?',
    'The rooftop work itself is typically a few days for a domestic system. The overall timeline is dominated by approvals and the KSEB inspection rather than by construction.',
  ],
  [
    'What happens after commissioning?',
    'You should see generation on the meter from day one, and the subsidy follows once the paperwork clears. After that the system needs cleaning and occasional monitoring — we will tell you what to watch for.',
  ],
]

/* The homepage set is what `FAQS` in site.config.js has always meant; it is
   re-exported there so existing imports keep working. */
export default HOME_FAQS

/* ---------- about ----------
   Answers describe how Delta works rather than asserting company history,
   so these stay true even while content/about.js is placeholder. */

export const ABOUT_FAQS = [
  [
    'What areas does Delta cover?',
    'Malappuram district and the towns around it — Malappuram, Manjeri, Kottakkal, Tirur and Perinthalmanna. Staying inside one district is deliberate: it means someone can reach a fault the same week, which matters more over twenty-five years than anything on a specification sheet.',
  ],
  [
    'Do you handle the KSEB and subsidy paperwork?',
    'Yes, apart from the parts tied to your own identity. We prepare and file the KSEB connectivity application, the technical documentation and the completion certificate. Registering on the national subsidy portal has to be done against your own consumer number and bank account, and we sit with you through it.',
  ],
  [
    'What happens at the first visit?',
    'We look at the roof and your recent KSEB bill. Between them they determine usable unshaded area, shading through the day, roof condition, and what size system your consumption actually justifies. The site visit and the written quote that follows are both free.',
  ],
  [
    'What equipment do you fit?',
    'Tier-1 panels and inverters, named by make and model in the quote before anything is ordered, so you can check the warranty terms and the service network yourself rather than taking our word for it.',
  ],
  [
    'Do you service systems you did not install?',
    'Yes, for maintenance and fault-finding. Where a system was badly installed we will say so plainly and quote for putting it right rather than patching around it.',
  ],
]

/* ---------- route → FAQ set ----------

   Consumed by scripts/prerender.mjs so each built document carries a
   FAQPage node describing ITS questions, not the homepage's. Only the
   open accordion item is in the prerendered HTML, so for every other
   answer this node is the only way a crawler sees it at all.

   Keyed by the same paths as site.routes.js. A route absent here
   simply gets no FAQPage, which is correct for a page with no FAQ. */
export const FAQS_BY_ROUTE = {
  '/': HOME_FAQS,
  '/about/': ABOUT_FAQS,
  '/services/': SERVICES_FAQS,
  '/services/residential/': SERVICE_FAQS.residential,
  '/services/commercial/': SERVICE_FAQS.commercial,
  '/services/hybrid/': SERVICE_FAQS.hybrid,
  '/services/ev-charging/': SERVICE_FAQS['ev-charging'],
  '/services/inverters-ups/': SERVICE_FAQS['inverters-ups'],
  '/subsidy/': SUBSIDY_FAQS,
  '/kseb-net-metering/': NET_METERING_FAQS,
  '/savings-calculator/': CALCULATOR_FAQS,
  '/projects/': PROJECTS_FAQS,
  '/contact/': CONTACT_FAQS,
}
