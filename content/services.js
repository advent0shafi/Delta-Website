/* ============================================================
   SERVICE DETAIL — long-form body per service
   ============================================================

   Keyed by SERVICES[].id in site.config.js, which is also the URL
   slug, so the card, the detail page and the schema.org Service node
   cannot drift apart. The short `body` in site.config.js stays the
   one-line summary the card shows; this is the page behind it.

   TWO OF THESE HAVE NO COMPETITOR EQUIVALENT. The reference site has
   no EV-charging page and no inverter/UPS page at all — see
   research/illumine/04-delta-gap-analysis.md. They are uncontested
   ground, which is why they are written to the same depth as the
   pages that do face competition.

   SOURCING RULES followed throughout:
     - No prices beyond the list the client published themselves —
       3 kW ₹2,15,000, 5 kW ₹3,20,000, 10 kW ₹5,28,000 before subsidy,
       in SYSTEM_PRICES — and the per-kW range derived from it.
     - No customer counts, testimonials, awards or project claims.
     - No Kerala capacity caps beyond what KSEB publishes, because
       the KSERC 2025 regulations are under a High Court stay.
     - Technology claims kept to stable, non-proprietary facts; no
       manufacturer is ranked and no efficiency figure is quoted.
   ============================================================ */

export const SERVICE_DETAIL = {
  /* ---------------------------------------------------------- */
  residential: {
    eyebrow: 'Residential',
    h1: ['Rooftop solar ', 'for your home.'],
    intro:
      'An on-grid system on a Kerala house does one thing extremely well: it cuts the KSEB bill, permanently, using a roof that is otherwise just collecting heat. Here is how it is sized, what it costs, and what it will and will not do for you.',
    sections: [
      {
        id: 'sizing',
        title: ['Sizing it ', 'from your bill.'],
        body: [
          'The honest way to size a home system is from consumption, not from roof area or from what the neighbour installed. Take the monthly units on your KSEB bill and divide by about 122 — that is roughly the kilowatt rating needed to cover them, using a Kerala generation assumption of about 1,460 kWh per kW per year. A house consuming 400 units a month lands near 3.3 kW.',
          'Most Kerala homes end up between 2 kW and 5 kW. Three kilowatts is the most common outcome, partly because it suits a typical household and partly because the central subsidy stops increasing above it.',
          'Roof area is the second constraint, at roughly 100 sq ft of usable unshaded space per kW. Usable is the operative word: a large roof interrupted by a water tank, a stair head and a coconut palm\'s afternoon shadow can offer less working area than a smaller clear one.',
        ],
      },
      {
        id: 'subsidy',
        title: ['The subsidy ', 'is genuinely large.'],
        body: [
          'PM Surya Ghar pays ₹30,000 for each of the first two kilowatts and ₹18,000 for the third, capping at ₹78,000. On our own price for a 3 kW system, ₹2,15,000 installed, that is a bit over a third of it back.',
          'It is residential-only and it is paid to you, into the bank account on your own application, after the system is commissioned and the net meter is live. Delta never receives it on your behalf. We prepare the KSEB side and sit with you through the national portal registration, which has to be done against your own consumer number.',
        ],
      },
      {
        id: 'monsoon',
        title: ['What it does ', 'through a Kerala year.'],
        body: [
          'Panels generate from daylight, not from direct sun, so an overcast monsoon day still produces — well below a clear February day, but not nothing. Systems are specified against annual generation precisely because Kerala\'s year is uneven, and the 1,460 kWh per kW figure already has the monsoon inside it.',
          'Heat is the less obvious factor. Silicon loses output as it warms, so the hottest afternoons are not the most productive ones. It is one reason a panel\'s temperature coefficient is worth asking about in a climate like this.',
          'One thing an on-grid system will not do is keep your lights on during a power cut. A grid-tied inverter disconnects the moment the grid drops, as a safety requirement. If outages are the problem you want solved, that is a hybrid system, not this one.',
        ],
      },
      {
        id: 'roof',
        title: ['Your roof, ', 'and what we check.'],
        body: [
          'Concrete, tiled and sheet roofs are all routine work with different mounting structures. What we are assessing on the site visit is usable unshaded area, the path of shadows through the day, the condition of the roof surface, and where the inverter and cable runs will sit.',
          'Properly mounted, an array shades the roof beneath it and measurably reduces heat gain into the rooms below. Poorly mounted, it creates leak paths through the waterproofing. The difference is entirely in how the penetrations are made and sealed, which is why we would rather tell you a roof needs attention first than build on it.',
        ],
      },
      {
        id: 'later',
        title: ['Planning for ', 'what comes later.'],
        body: [
          'If an electric vehicle or additional air conditioning is anywhere in your plans, say so before the system is designed. The constraint on expansion is usually the inverter\'s capacity and your sanctioned load rather than free roof space, and sizing the inverter with headroom now costs far less than replacing it later.',
        ],
      },
    ],
    suits: {
      title: 'Residential on-grid suits you if',
      items: [
        'Your monthly KSEB bill is the thing you want to reduce',
        'You have roughly 100 sq ft of unshaded roof per kW you need',
        'You have a residential connection, so the subsidy applies',
        'You can live with outages, or already have a backup inverter',
      ],
    },
  },

  /* ---------------------------------------------------------- */
  commercial: {
    eyebrow: 'Commercial and industrial',
    h1: ['Rooftop solar ', 'for business.'],
    intro:
      'Commercial rooftops are often the strongest case for solar in Kerala, and it has nothing to do with subsidy — there isn\'t one. It is that a business consumes power in daylight, at a higher tariff, on a roof that is usually large and unshaded.',
    sections: [
      {
        id: 'load-profile',
        title: ['Why the numbers ', 'work better here.'],
        body: [
          'A shop, an office or a factory draws most of its power between morning and evening, which is exactly when an array produces. That alignment is worth more than it sounds. Every unit generated and consumed on site displaces a unit bought at the commercial tariff, while units exported are settled at the lower banked rate. A load profile that matches generation keeps almost everything on the valuable side of that line.',
          'Residential systems rarely achieve this. A house is empty during the day and busy after dark, so a larger share of its generation is exported rather than self-consumed.',
        ],
      },
      {
        id: 'no-subsidy',
        title: ['No subsidy, ', 'and it still pays.'],
        body: [
          'PM Surya Ghar is a residential scheme. Commercial, industrial and institutional connections are outside it, and any quote suggesting otherwise is mistaken. Delta\'s savings calculator returns zero subsidy for a commercial connection rather than flattering the estimate.',
          'What replaces it is a higher displaced tariff and the ability to treat the installation as a depreciating business asset. Businesses in India can claim accelerated depreciation on solar plant, which changes the after-tax cost materially. Your accountant, not your solar installer, should tell you what that is worth in your case — but it belongs in the calculation.',
        ],
      },
      {
        id: 'metering',
        title: ['Net metering ', 'at commercial scale.'],
        body: [
          'The mechanism is the same as a home: a bidirectional net meter records import and export, a renewable energy meter records generation, and you are billed on the net. All grid-interactive applications go through the Solar Rooftop Portal – Kerala.',
          'Capacity is where commercial installations differ, and where Kerala\'s rules are currently moving. KSEB publishes a maximum of 1 MWp at a single location, but the wider framework is mid-revision — the KSERC regulations notified in November 2025 were stayed by the High Court shortly afterwards, and published summaries of the new limits contradict each other. We confirm what applies to your connection before designing, rather than quoting a number that may not be in force.',
        ],
      },
      {
        id: 'continuity',
        title: ['Bill reduction ', 'is not backup.'],
        body: [
          'A grid-tied commercial system shuts down when the grid does, like any other. If production continuity is the requirement, the brief changes: the question stops being "how do we cut the bill" and becomes "what must keep running, and for how long". That is a hybrid or generator conversation, and it is sized from critical load rather than from consumption.',
          'It is worth separating the two objectives before spending on either, because the cheapest answer to each is a different system.',
        ],
      },
      {
        id: 'disruption',
        title: ['Installing over ', 'a working business.'],
        body: [
          'Rooftop work is largely independent of what happens under the roof. The parts that touch your operation are the changeover and the KSEB inspection, both short, and both schedulable around your hours. Larger roofs take longer, but the interruption does not scale with the array.',
        ],
      },
    ],
    suits: {
      title: 'Commercial and industrial solar suits you if',
      items: [
        'Your operation runs largely in daylight hours',
        'You are billed at a commercial or industrial tariff',
        'You have substantial unshaded roof or shed area',
        'You can use accelerated depreciation on a capital asset',
      ],
    },
  },

  /* ---------------------------------------------------------- */
  hybrid: {
    eyebrow: 'Hybrid and storage',
    h1: ['Solar that ', 'stays on.'],
    intro:
      'A hybrid system is an on-grid system with somewhere to put the energy. It cuts your bill like any grid-tied array, and when KSEB goes down it keeps chosen circuits alive from a battery. You pay for that second capability, so it is worth being clear about whether you need it.',
    sections: [
      {
        id: 'what-it-adds',
        title: ['What hybrid ', 'actually adds.'],
        body: [
          'A plain on-grid system is a bill-reduction machine that disconnects during an outage — not a fault, a safety requirement, since an inverter feeding a dead line endangers anyone working on it. A hybrid inverter adds a battery and the ability to island: it isolates from the grid and continues supplying the circuits you have designated.',
          'You still get net metering. Surplus is exported and banked exactly as it would be from an on-grid array, subject to the same KSEB approval. The battery simply gives the energy somewhere to go before it is exported.',
        ],
      },
      {
        id: 'sizing-backup',
        title: ['Sizing backup ', 'by what must run.'],
        body: [
          'The most common mistake is asking how long a battery will run "the house". The honest design starts from a list of what genuinely has to stay on, because the answer varies enormously by load. Lights, fans, a refrigerator and networking will run for hours on a modest bank. Air conditioning and water heating will empty the same bank in minutes.',
          'Deciding which circuits matter is a conversation to have before choosing a battery size, not after. It is also the decision that most affects the cost of the system.',
        ],
      },
      {
        id: 'chemistry',
        title: ['Lithium ', 'or lead-acid.'],
        body: [
          'Lead-acid is cheaper to buy, needs more care, tolerates deep discharge poorly, and is still reasonable where outages are occasional and the bank is small. Lithium chemistries cost more upfront, tolerate far deeper and more frequent cycling, need no topping up, and generally last substantially longer. Over a full service life the gap in cost per usable cycle narrows a great deal.',
          'Both are shortened by heat, which is not a trivial consideration in Kerala. Where the battery lives matters as much as which one you buy.',
        ],
      },
      {
        id: 'worth-it',
        title: ['Whether it is ', 'worth it for you.'],
        body: [
          'This comes down to your supply, not to the technology. If monsoon outages are a real disruption where you live — a home office, medical equipment, a business that cannot stop — the backup is the point and the economics are secondary to it.',
          'If your supply is broadly stable, an on-grid system plus a conventional backup inverter usually reaches the same practical outcome for less money. We will say so if that is what your situation suggests.',
        ],
      },
    ],
    suits: {
      title: 'Hybrid suits you if',
      items: [
        'Outages are frequent or costly enough to be worth designing around',
        'You can name the circuits that must stay live',
        'You want bill reduction and backup from one system',
        'You accept a higher cost per kW than plain on-grid solar',
      ],
    },
  },

  /* ---------------------------------------------------------- */
  'ev-charging': {
    eyebrow: 'Solar EV charging',
    h1: ['Charge the car ', 'off your roof.'],
    intro:
      'An electric vehicle can add more consumption than everything else in the house put together. Charged from the grid, it moves your bill up a slab. Charged from your own generation in daylight, it is close to free running.',
    sections: [
      {
        id: 'the-arithmetic',
        title: ['The arithmetic ', 'of solar miles.'],
        body: [
          'A typical Indian EV uses in the region of 15 kWh per 100 km. A 3 kW array in Kerala generates on the order of 12 kWh on a good day, averaging out to about 1,460 kWh per kW across the year. For everyday commuting distances, a modest rooftop array covers a meaningful share of the driving.',
          'The catch is timing. Solar generates in daylight and most people charge overnight. Charging while the sun is up draws straight from the roof at the full value of self-consumption; charging after dark pulls from the grid unless you have storage to shift it.',
        ],
      },
      {
        id: 'sizing',
        title: ['Size for the car ', 'before you install.'],
        body: [
          'Adding an EV to an existing system is the expensive order of operations. The limit is usually the inverter\'s capacity and your sanctioned load rather than free roof area, and both are cheaper to specify once than to revisit.',
          'If a vehicle is anywhere in your plans — this year or in three — say so at the survey. We will size the inverter with headroom and tell you what it does to the quote, which is usually less than the cost of replacing it later.',
        ],
      },
      {
        id: 'equipment',
        title: ['What you actually ', 'need on the wall.'],
        body: [
          'For a home, an AC wall box is almost always the right answer. It works with the charger built into the vehicle, installs on a normal domestic supply, and costs a fraction of anything faster. DC fast charging is a commercial proposition: the equipment and the supply upgrade both cost far more than home charging can justify.',
          'The installation question that matters is load management — whether the house can charge a car and run everything else without tripping. That is part of what we assess before quoting, and it is a design question rather than a product one.',
        ],
      },
      {
        id: 'commercial',
        title: ['Workplace and ', 'commercial charging.'],
        body: [
          'Commercial solar and EV charging fit together unusually well. Vehicles sit parked through the working day, which is precisely when a commercial array is producing. That converts a car park into daytime load for generation that would otherwise be exported at the lower banked rate — improving the economics of both.',
          'For a business already considering rooftop solar, adding charge points is often a better use of surplus generation than exporting it.',
        ],
      },
    ],
    suits: {
      title: 'Solar EV charging suits you if',
      items: [
        'You own an electric vehicle, or expect to',
        'Some of your charging can happen in daylight',
        'You are installing or expanding rooftop solar anyway',
        'You have a workplace or premises where cars sit parked all day',
      ],
    },
  },

  /* ---------------------------------------------------------- */
  'inverters-ups': {
    eyebrow: 'Inverters and backup',
    h1: ['Backup power, ', 'sized properly.'],
    intro:
      'Not every power problem is a solar problem. If what you need is for things to stay on when the grid drops, an inverter and battery may be the whole answer — and it is worth understanding how that differs from a solar installation before buying either.',
    sections: [
      {
        id: 'two-devices',
        title: ['Two devices ', 'people conflate.'],
        body: [
          'A solar inverter converts DC from panels into AC you can use or export to the grid. A backup inverter or UPS charges a battery from the mains and switches over when the supply fails. They solve unrelated problems, and owning one does not give you the other.',
          'This is why an on-grid solar system does not keep your lights on during an outage. It is also why a backup inverter does not reduce your bill: it stores energy you already bought, at a small round-trip loss.',
          'A hybrid solar inverter is the device that does both, and it costs accordingly.',
        ],
      },
      {
        id: 'retrofit',
        title: ['Adding solar to ', 'an inverter you own.'],
        body: [
          'Often possible, using a solar charge controller, and worth asking about before replacing working equipment. It reduces what you draw from the grid by charging your existing battery from panels instead of the mains.',
          'What it does not do is make your installation grid-interactive. An ordinary backup inverter cannot export to KSEB, so this route earns no net-metering credit — it lowers consumption rather than turning your meter backwards. For some households that is exactly enough; for others it is a false economy against a proper grid-tied system.',
        ],
      },
      {
        id: 'sizing',
        title: ['Sizing from load, ', 'not from habit.'],
        body: [
          'Add up what must stay running and for how long. That is the whole method, and skipping it is how people end up with a bank that disappoints during a long outage and costs too much for the rest of the year.',
          'Two numbers come out of it: the power the inverter must deliver at once, which sets the inverter rating, and the energy you need over the outage, which sets the battery capacity. They are independent, and a system can be correctly sized on one and badly wrong on the other.',
        ],
      },
      {
        id: 'batteries',
        title: ['What determines ', 'battery life.'],
        body: [
          'Depth and frequency of discharge, far more than calendar age. A battery cycled shallowly and occasionally will outlast an identical one run flat every week. Lithium chemistries generally tolerate many more cycles at a given depth than lead-acid, which is much of what justifies their price.',
          'Heat shortens the life of every chemistry, so installation location is a real design decision in Kerala rather than an afterthought.',
        ],
      },
      {
        id: 'choosing',
        title: ['Choosing a brand ', 'on the right criterion.'],
        body: [
          'Service network before specification sheet. Efficiency and feature differences between reputable manufacturers are usually too small to decide anything; whether a technician can attend a fault in your district, and whether replacement parts exist locally, decides everything.',
          'Delta fits Tier-1 equipment and names the exact make and model in the quote, so you can check the warranty terms and the service presence yourself before committing.',
        ],
      },
    ],
    suits: {
      title: 'Inverters and backup UPS suit you if',
      items: [
        'Staying powered through outages matters more than cutting the bill',
        'You want backup without the cost of a full hybrid solar system',
        'You already own an inverter and want to know your options',
        'You need domestic or industrial backup sized from an actual load list',
      ],
    },
  },
}
