/* ============================================================
   HOW THE SAVINGS CALCULATOR WORKS
   ============================================================

   The method behind src/components/Calculator.jsx, written for the
   person using it. The authoritative specification is
   docs/calculator-logic.md; this is the same arithmetic in prose, and
   the two must stay in step — if the constants there change, the
   figures quoted here change with them.

   Publishing the method is a deliberate choice. A savings number you
   cannot interrogate is worth very little, and every competitor
   estimate we looked at presents one with no working shown.
   ============================================================ */

export const CALCULATOR_REVIEWED = '2026-08-28'

export const CALCULATOR_INTRO =
  'A savings estimate is only as good as the assumptions under it, so here are ours in full. Three constants do most of the work, and the calculator applies them the same way every time — no adjustment to make a number look better.'

export const CALCULATOR_SECTIONS = [
  {
    id: 'sizing',
    eyebrow: 'Step one',
    title: ['From your bill ', 'to a system size.'],
    body: [
      'Whatever you enter — a monthly bill in rupees, units consumed, or available roof area — is converted to one number: how many units you get through in a month. A bill is divided by the tariff you set on the slider; roof area is converted at roughly 100 sq ft per kW.',
      'That monthly consumption is then divided by about 122 kWh, which is what one kilowatt of rooftop generates in an average Kerala month on a 1,460 kWh per kW annual assumption. The result is rounded to the nearest half kilowatt, because systems are specified in real panel counts rather than to two decimal places.',
    ],
  },
  {
    id: 'cap',
    eyebrow: 'Step two',
    title: ['Why savings are capped ', 'at what you use.'],
    body: [
      'Generation and savings are not the same thing. A unit you generate and consume yourself avoids buying a unit at the full retail tariff. A unit you export is banked and settled at a lower rate. Treating both as equally valuable is the most common way a solar estimate flatters itself.',
      'So the calculator credits generation only up to your own annual consumption. If a system would generate more than you use, the surplus is simply not counted as savings. The figure you see is deliberately the conservative one.',
    ],
  },
  {
    id: 'subsidy',
    eyebrow: 'Step three',
    title: ['Applying the ', 'subsidy correctly.'],
    body: [
      'PM Surya Ghar pays ₹30,000 for each of the first two kilowatts and ₹18,000 for the third, capping at ₹78,000 — so the calculator applies ₹30,000 at 1 kW, ₹60,000 at 2 kW and ₹78,000 at 3 kW and above, and nothing further for larger systems.',
      'Choose a commercial connection and the subsidy drops to zero, because PM Surya Ghar is a residential scheme. That is not a limitation of the tool; it is the actual rule, and an estimate that ignored it would overstate a commercial payback by a large margin.',
    ],
  },
  {
    id: 'payback',
    eyebrow: 'Step four',
    title: ['What payback ', 'does and does not include.'],
    body: [
      'Payback is the net cost after subsidy divided by the first year of savings, shown as a range rather than a date. Installed cost comes from Delta\'s own price list — ₹2,15,000 for 3 kW, ₹3,20,000 for 5 kW and ₹5,28,000 for 10 kW before subsidy — interpolated for the sizes in between, which is why the rate per kilowatt falls as the system grows.',
      'Two things it does not model. Electricity tariffs rise over time, which shortens real payback. Panels degrade slowly, which lengthens it. They pull in opposite directions and broadly offset over the period that matters, but it is worth knowing that neither is in the arithmetic.',
      'Nothing here is a quotation. Orientation, shading, roof condition and the tariff you actually pay all move the result, which is exactly what a site survey is for.',
    ],
  },
]
