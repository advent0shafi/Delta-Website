/* ============================================================
   EQUIPMENT — how to read a solar quote
   ============================================================

   `BRANDS` in site.config.js is eight names and eight logos — the
   manufacturers, not the argument. This is the guidance a buyer
   comparing two quotes actually needs, and it is written to be useful
   even to someone who ends up buying elsewhere.

   SOURCING. Everything here is stable, non-proprietary technology
   and market fact: PERC and half-cut cell construction, the typical
   split between product and performance warranties, the temperature
   behaviour of silicon, the difference a service network makes. No
   figure is attributed to a specific manufacturer, no brand is
   ranked, and no claim is made about Delta's pricing or margins.

   Deliberately not copied from the reference site: their equivalent
   section names a dozen manufacturers and asserts cell efficiencies
   to the decimal. Efficiency figures date quickly and are the kind of
   claim that quietly becomes wrong.
   ============================================================ */

export const EQUIPMENT_REVIEWED = '2026-08-28'

export const EQUIPMENT_INTRO =
  'Two quotes for the same system size can differ by a third, and the difference is almost never the panels alone. This is what the line items mean, and which of them actually decide how the system performs in ten years.'

export const EQUIPMENT_SECTIONS = [
  {
    id: 'panels',
    eyebrow: 'Panels',
    title: ['What the ', 'specification sheet means.'],
    body: [
      'Almost all rooftop panels sold in India today are monocrystalline silicon. Within that, two construction details do most of the work. PERC — passivated emitter and rear cell — adds a reflective layer behind the cell so light that would have passed straight through gets a second chance to be absorbed. Half-cut cells split each cell in two, halving the current through each and with it the resistive losses, which also makes the panel more tolerant of partial shading.',
      'Wattage per panel has been climbing steadily, which matters mostly because it changes how many panels fit your roof rather than how much energy you get per square foot. Two arrays of the same total kilowatt rating generate broadly the same annual energy regardless of whether they are made of many small panels or fewer large ones.',
      'The number worth asking about is the temperature coefficient. Silicon loses output as it heats, and a Kerala rooftop in April is hot. A panel with a shallower temperature coefficient gives up less on exactly the days when the sun is strongest.',
    ],
  },
  {
    id: 'warranties',
    eyebrow: 'Warranties',
    title: ['Two warranties, ', 'and they are not the same.'],
    body: [
      'Panels carry two. The product warranty covers manufacturing defects and typically runs 10–12 years. The performance warranty is a separate promise that the panel will still produce some stated percentage of its rated output after 25 years or more. A quote advertising "25 year warranty" is usually quoting the second and saying nothing about the first.',
      'Inverter warranties vary far more than panel warranties — from around five years to over a decade, often with the option to extend at purchase. Since the inverter is the component most likely to need attention during the system\'s life, this is the warranty worth reading closely.',
      'Whatever the terms, they are only as good as the company honouring them. A 25-year promise from a manufacturer without an Indian service presence is a document, not a guarantee.',
    ],
  },
  {
    id: 'inverters',
    eyebrow: 'Inverters',
    title: ['The component ', 'that decides your decade.'],
    body: [
      'The inverter converts DC from the panels into the AC your house and the grid use, and it is where most system faults eventually appear. Conversion efficiencies across reputable brands sit close enough together that they rarely decide anything; what decides the outcome is whether someone can attend a fault in your district and whether replacement parts exist locally.',
      'String inverters, where a whole array feeds one unit, are the standard and the most economical choice for an unshaded roof. Where a roof is broken up by shading, orientation changes or obstructions, module-level electronics — optimisers or microinverters — let each panel work independently instead of dragging the string down to the weakest member. They cost more, and on a clear simple roof they buy very little.',
      'Delta fits Tier-1 equipment and names the exact make and model in the quote before you commit, so you can check the warranty and the service network yourself rather than taking our word for it.',
    ],
  },
  {
    id: 'mounting',
    eyebrow: 'Structure and installation',
    title: ['The part nobody ', 'compares on price.'],
    body: [
      'Mounting structure, cabling, earthing and surge protection are where quotes quietly diverge, because they are the parts a customer cannot easily evaluate. They are also the parts that determine whether an array survives a Kerala monsoon and whether your roof stays watertight around the fixings.',
      'Corrosion is the long game here. Coastal and high-humidity installations punish under-specified structures, and a structure chosen to win a price comparison will show it well before the panels it carries reach end of life.',
      'Ask any installer, including us, what the mounting structure is made of, how roof penetrations are sealed, and what surge and earthing protection is included. A quote that will not answer those questions in writing is not a cheaper quote — it is a less complete one.',
    ],
  },
]

/* Kept separate from the prose: these are the planning assumptions the
   savings calculator already uses, documented in docs/calculator-logic.md
   and published in llms.txt. Restating them here keeps one source. */
export const PLANNING_FIGURES = [
  ['About ₹60,000 per kW', 'installed cost before subsidy'],
  ['About 1,460 kWh per kW per year', 'typical on-grid generation in Kerala'],
  ['About 100 sq ft per kW', 'usable, unshaded roof area'],
]

export const PLANNING_CAVEAT =
  'These are planning averages, not a quotation. Orientation, shading, roof condition and the tariff you actually pay all move the result — which is what the site survey is for.'
