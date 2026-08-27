# Solar Savings Calculator — Logic Specification

Extracted from `src/components/Calculator.jsx` (Delta Energy Solutions).
Framework-agnostic: the whole model is pure arithmetic on 5 inputs.

---

## 1. Constants

| Name | Value | Meaning |
| --- | --- | --- |
| `UNITS_PER_KW_YEAR` | `1460` | kWh generated per kW per year (≈ 4 kWh/day — Kerala on-grid assumption) |
| `UNITS_PER_KW_MONTH` | `1460 / 12` = `121.6667` | kWh per kW per month |
| `COST_PER_KW` | `60000` | ₹ system cost per kW, **before** subsidy |
| `SQFT_PER_KW` | `100` | Roof area (sq ft) required per kW |

---

## 2. Inputs

| Input | Type | Default | Notes |
| --- | --- | --- | --- |
| `mode` | `'bill' \| 'units' \| 'roof'` | `'bill'` | Which figure the user supplies |
| `bill` | number (₹ / month) | `3000` | Used when `mode === 'bill'` |
| `units` | number (kWh / month) | `450` | Used when `mode === 'units'` |
| `roof` | number (sq ft) | `300` | Used when `mode === 'roof'` |
| `category` | `'Residential' \| 'Commercial' \| 'Industrial'` | `'Residential'` | Drives subsidy + size cap |
| `rate` | number (₹ / kWh) | `5.5` | Slider: min `1`, max `15`, step `0.5` |

State is fixed to **Kerala** (locked select). Numeric inputs are clamped to `>= 0`
on entry: `Math.max(0, +value || 0)`.

Each mode keeps its **own** stored value, so switching modes does not convert
between them — it swaps to that mode's independently held number.

---

## 3. The Model

### Step 1 — Normalise the input to monthly consumption (kWh)

```
if mode == 'bill'   →  monthlyUnits = bill / rate
if mode == 'units'  →  monthlyUnits = units
if mode == 'roof'   →  monthlyUnits = (roof / SQFT_PER_KW) * UNITS_PER_KW_MONTH
```

### Step 2 — Derive the recommended system size (kW)

```
kw = monthlyUnits / UNITS_PER_KW_MONTH
kw = max(1, round(kw * 2) / 2)          // snap to nearest 0.5, floor at 1 kW
kw = min(kw, category == 'Residential' ? 10 : 50)   // cap
```

- Snap to nearest **0.5 kW** (`round(kw*2)/2`).
- Hard floor of **1 kW** — never recommends less.
- Hard cap: **10 kW** residential, **50 kW** commercial/industrial.

### Step 3 — Outputs

```
annualGen     = kw * UNITS_PER_KW_YEAR

cappedUnits   = min(annualGen, monthlyUnits * 12 || annualGen)
annualSavings = cappedUnits * rate

systemCost    = kw * COST_PER_KW
subsidy       = subsidyFor(kw, category)
netCost       = systemCost - subsidy

payback       = annualSavings > 0 ? netCost / annualSavings : 0
```

**`cappedUnits` is the key line.** Savings are capped at what the customer
actually consumes — you cannot save more than your bill. The `|| annualGen`
guard catches `monthlyUnits === 0` (falsy), falling back to full generation so
a zero/blank input still produces a finite payback instead of a divide-by-zero.

### Subsidy table (PM Surya Ghar) — residential only

```
subsidyFor(kw, category):
    if category != 'Residential'  →  0
    if kw >= 3                    →  78000
    if kw >= 2                    →  60000
    if kw >= 1                    →  30000
    else                          →  round(kw * 30000)
```

> The final `else` branch is **unreachable** in the current flow: Step 2 floors
> `kw` at 1. Keep it or drop it depending on whether your port keeps that floor.

---

## 4. Display Formatting

```
inr(n) = '₹' + round(n).toLocaleString('en-IN')     // e.g. ₹1,92,000
```

| Row label | Value expression |
| --- | --- |
| Recommended system | `` `${kw} kW` `` |
| Annual generation | `` `${round(annualGen).toLocaleString('en-IN')} kWh` `` |
| Annual savings | `inr(annualSavings)` |
| System cost | `inr(systemCost)` |
| Subsidy (PM Surya Ghar) | `subsidy ? '– ' + inr(subsidy) : '—'` |
| **Net cost after subsidy** | `inr(netCost)` *(highlighted row)* |
| Payback period | `` `${max(2, floor(payback))}–${ceil(payback)} years` `` |

All currency uses the **en-IN** locale (lakh/crore grouping: `1,92,000`).

Disclaimer shown under the result: *"Indicative estimate. Final figures
confirmed after a site survey."*

---

## 5. Worked Examples

All values below were executed against the real implementation, not estimated.

### A. Default — bill ₹3,000/mo, ₹5.50/kWh, Residential

| Step | Value |
| --- | --- |
| monthlyUnits | `3000 / 5.5` = **545.45 kWh** |
| kw (raw) | `545.45 / 121.667` = 4.483 → snap 0.5 → **4.5 kW** |
| annualGen | `4.5 × 1460` = **6,570 kWh** |
| cappedUnits | `min(6570, 6545.45)` = **6,545.45 kWh** (cap binds) |
| annualSavings | `6545.45 × 5.5` = **₹36,000** |
| systemCost | `4.5 × 60000` = **₹2,70,000** |
| subsidy | kw ≥ 3, residential → **₹78,000** |
| netCost | **₹1,92,000** |
| payback | `192000 / 36000` = 5.33 → **"5–6 years"** |

### B. Units mode — 450 kWh/mo, ₹5.50/kWh, Residential

| Step | Value |
| --- | --- |
| monthlyUnits | **450 kWh** |
| kw | `450 / 121.667` = 3.699 → **3.5 kW** |
| annualGen | **5,110 kWh** |
| cappedUnits | `min(5110, 5400)` = **5,110** (cap does *not* bind) |
| annualSavings | **₹28,105** |
| netCost | `210000 − 78000` = **₹1,32,000** |
| payback | 4.70 → **"4–5 years"** |

### C. Roof mode — 300 sq ft, ₹5.50/kWh, Residential

| Step | Value |
| --- | --- |
| monthlyUnits | `(300/100) × 121.667` = **365 kWh** |
| kw | **3 kW** (roof mode round-trips exactly: `roof / 100`) |
| annualGen | **4,380 kWh** |
| annualSavings | **₹24,090** |
| netCost | `180000 − 78000` = **₹1,02,000** |
| payback | 4.23 → **"4–5 years"** |

### D. Commercial — bill ₹40,000/mo, ₹7.00/kWh

| Step | Value |
| --- | --- |
| monthlyUnits | **5,714.29 kWh** |
| kw | 46.97 → **47 kW** (under the 50 kW non-residential cap) |
| annualSavings | **₹4,80,000** |
| subsidy | non-residential → **₹0** |
| netCost | **₹28,20,000** |
| payback | 5.88 → **"5–6 years"** |

---

## 6. Behavioural Notes & Caveats

Things worth knowing before you reuse this model:

1. **In bill mode, annual savings collapse to `bill × 12`.** Whenever the
   consumption cap binds, `(bill/rate) × 12 × rate = bill × 12` exactly — the
   `rate` cancels out. Both Example A (₹36,000 = 3,000×12) and Example D
   (₹4,80,000 = 40,000×12) show this. The model is effectively asserting *"your
   bill goes to zero."*

2. **`rate` plays two different roles depending on mode.** In `bill` mode it
   determines both system size and savings. In `units` and `roof` mode it only
   scales the rupee savings — system size is independent of it.

3. **The 1 kW floor means a ₹0 bill still returns a 1 kW system** with a
   ~3.7-year payback (Example: bill 0 → 1 kW, ₹8,030/yr savings). If that's not
   wanted, add an explicit "no input" state before computing.

4. **Payback lower bound is clamped to 2 years** via `max(2, floor(payback))`.
   Any genuine payback under 2 years will be misreported as starting at 2. If
   payback lands on a whole number (say 6.0) the range renders as "6–6 years".

5. **Generation is a flat 1,460 kWh/kW/yr** — no tilt, shading, azimuth, panel
   degradation, or seasonal variation. Fine as a lead-capture estimate; not an
   engineering figure.

6. **Costs are linear at ₹60,000/kW** with no economies of scale, so a 47 kW
   commercial system is priced at 47 × the 1 kW rate. Real large-system pricing
   per kW is materially lower — worth a tiered `COST_PER_KW` if you reuse this
   for commercial quoting.

7. **No O&M, inverter replacement, tariff escalation, or financing** is modelled.
   Payback is a simple undiscounted `netCost / annualSavings`.

8. **Subsidy thresholds are step functions on the rounded `kw`,** not on raw
   demand — a 2.9 kW raw need snaps to 3.0 kW and jumps from ₹60,000 to ₹78,000.

---

## 7. Portable Reference Implementation

Dependency-free; drop into any JS/TS project.

```js
const UNITS_PER_KW_YEAR = 1460
const UNITS_PER_KW_MONTH = UNITS_PER_KW_YEAR / 12
const COST_PER_KW = 60000
const SQFT_PER_KW = 100

function subsidyFor(kw, category) {
  if (category !== 'Residential') return 0
  if (kw >= 3) return 78000
  if (kw >= 2) return 60000
  if (kw >= 1) return 30000
  return Math.round(kw * 30000)
}

export function compute({ mode, bill, units, roof, category, rate }) {
  let monthlyUnits = 0
  if (mode === 'bill') monthlyUnits = bill / rate
  else if (mode === 'units') monthlyUnits = units
  else monthlyUnits = (roof / SQFT_PER_KW) * UNITS_PER_KW_MONTH

  let kw = monthlyUnits / UNITS_PER_KW_MONTH
  kw = Math.max(1, Math.round(kw * 2) / 2)
  kw = Math.min(kw, category === 'Residential' ? 10 : 50)

  const annualGen = kw * UNITS_PER_KW_YEAR
  const cappedUnits = Math.min(annualGen, monthlyUnits * 12 || annualGen)
  const annualSavings = cappedUnits * rate
  const systemCost = kw * COST_PER_KW
  const subsidy = subsidyFor(kw, category)
  const netCost = systemCost - subsidy
  const payback = annualSavings > 0 ? netCost / annualSavings : 0

  return { kw, annualGen, annualSavings, systemCost, subsidy, netCost, payback }
}

const inr = (n) =>
  '₹' + Math.round(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })

export function formatRows(r) {
  return [
    ['Recommended system', `${r.kw} kW`],
    ['Annual generation', `${Math.round(r.annualGen).toLocaleString('en-IN')} kWh`],
    ['Annual savings', inr(r.annualSavings)],
    ['System cost', inr(r.systemCost)],
    ['Subsidy (PM Surya Ghar)', r.subsidy ? `– ${inr(r.subsidy)}` : '—'],
    ['Net cost after subsidy', inr(r.netCost)],
    ['Payback period', `${Math.max(2, Math.floor(r.payback))}–${Math.ceil(r.payback)} years`],
  ]
}
```

---

## 8. Tuning Points

If you reuse this for a different market or price list, these are the only
numbers that need changing:

| Change this | To adjust |
| --- | --- |
| `UNITS_PER_KW_YEAR` | Solar yield for the region (1460 ≈ Kerala) |
| `COST_PER_KW` | Your price per kW before subsidy |
| `SQFT_PER_KW` | Panel density / roof-area assumption |
| `subsidyFor()` | Subsidy scheme and slabs |
| The `10` / `50` caps | Max system size offered per category |
| `rate` slider `min`/`max`/`step` | Local tariff range |
