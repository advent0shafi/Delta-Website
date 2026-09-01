import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading, Button } from './common'
import { useReveal } from '../lib/useReveal'
import { costFor, inr, subsidyFor as subsidySchedule } from '../../site.config'

// Kerala on-grid assumptions
const UNITS_PER_KW_YEAR = 1460 // ~4 kWh/day
const UNITS_PER_KW_MONTH = UNITS_PER_KW_YEAR / 12
const SQFT_PER_KW = 100

/* The schedule itself lives in site.config.js, beside the price list that
   also quotes an after-subsidy figure — it was written out twice here and
   there, and a scheme that changes has to change in one place. Eligibility
   stays here, because only this component knows the connection category. */
function subsidyFor(kw, category) {
  return category === 'Residential' ? subsidySchedule(kw) : 0
}

function compute({ mode, bill, units, roof, category, rate }) {
  let monthlyUnits = 0
  if (mode === 'bill') monthlyUnits = bill / rate
  else if (mode === 'units') monthlyUnits = units
  else monthlyUnits = (roof / SQFT_PER_KW) * UNITS_PER_KW_MONTH

  let kw = monthlyUnits / UNITS_PER_KW_MONTH
  kw = Math.max(1, Math.round(kw * 2) / 2) // nearest 0.5, min 1
  kw = Math.min(kw, category === 'Residential' ? 10 : 50)

  const annualGen = kw * UNITS_PER_KW_YEAR
  const cappedUnits = Math.min(annualGen, monthlyUnits * 12 || annualGen)
  const annualSavings = cappedUnits * rate
  const systemCost = costFor(kw)
  const subsidy = subsidyFor(kw, category)
  const netCost = systemCost - subsidy
  const payback = annualSavings > 0 ? netCost / annualSavings : 0
  return { kw, annualGen, annualSavings, systemCost, subsidy, netCost, payback }
}

const MODES = [
  { id: 'bill', label: 'Monthly bill', hint: '₹ per month', sym: '₹' },
  { id: 'units', label: 'Monthly units', hint: 'kWh per month', sym: '⚡' },
  { id: 'roof', label: 'Roof area', hint: 'square feet', sym: '▦' },
]

export default function Calculator({ headingAs = 'h2' }) {
  const scope = useReveal()
  const [mode, setMode] = useState('bill')
  const [bill, setBill] = useState(3000)
  const [units, setUnits] = useState(450)
  const [roof, setRoof] = useState(300)
  const [category, setCategory] = useState('Residential')
  const [rate, setRate] = useState(5.5)
  const [show, setShow] = useState(false)

  const value = mode === 'bill' ? bill : mode === 'units' ? units : roof
  const setValue = mode === 'bill' ? setBill : mode === 'units' ? setUnits : setRoof

  const result = useMemo(
    () => compute({ mode, bill, units, roof, category, rate }),
    [mode, bill, units, roof, category, rate]
  )

  const rows = [
    ['Recommended system', `${result.kw} kW`],
    ['Annual generation', `${Math.round(result.annualGen).toLocaleString('en-IN')} kWh`],
    ['Annual savings', inr(result.annualSavings)],
    ['System cost', inr(result.systemCost)],
    ['Subsidy (PM Surya Ghar)', result.subsidy ? `– ${inr(result.subsidy)}` : '—'],
    ['Net cost after subsidy', inr(result.netCost), true],
    ['Payback period', `${Math.max(2, Math.floor(result.payback))}–${Math.ceil(result.payback)} years`],
  ]

  return (
    <section
      id="calculator"
      className="section section--paper-2 calc"
      ref={scope}
      aria-labelledby="calculator-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="Savings calculator" id="calculator-title" as={headingAs}>
            Go solar, <span className="soft">save big.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            Estimate your savings in three steps. KSEB Kerala tariffs are pre-filled.
          </p>
        </div>

        <div className="calc__panel reveal" data-delay="0.1">
          <div className="calc__form">
            <div className="calc__step">
              <span className="calc__step-n">01</span>
              <span className="calc__step-q">What would you like to use?</span>
            </div>
            <div className="calc__modes" role="group" aria-label="What would you like to use?">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`calc__mode ${mode === m.id ? 'on' : ''}`}
                  aria-pressed={mode === m.id}
                  onClick={() => setMode(m.id)}
                >
                  <span className="calc__mode-sym" aria-hidden="true">{m.sym}</span>
                  {m.label}
                </button>
              ))}
            </div>

            <div className="calc__field">
              <label htmlFor="calc-value">
                {MODES.find((m) => m.id === mode).label}
                <span> · {MODES.find((m) => m.id === mode).hint}</span>
              </label>
              <input
                id="calc-value"
                name="calc-value"
                type="number"
                min="0"
                inputMode="numeric"
                value={value}
                onChange={(e) => setValue(Math.max(0, +e.target.value || 0))}
              />
            </div>

            <div className="calc__step">
              <span className="calc__step-n">02</span>
              <span className="calc__step-q">Location &amp; customer type</span>
            </div>
            <div className="calc__row2">
              <div className="calc__field">
                <label htmlFor="calc-state">State / UT</label>
                {/* defaultValue, not value: a disabled controlled select with no
                    onChange is a React warning, and this one never changes. */}
                <select id="calc-state" name="calc-state" disabled defaultValue="Kerala">
                  <option>Kerala</option>
                </select>
              </div>
              <div className="calc__field">
                <label htmlFor="calc-category">Category</label>
                <select
                  id="calc-category"
                  name="calc-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
              </div>
            </div>

            <div className="calc__step">
              <span className="calc__step-n">03</span>
              <span className="calc__step-q">Electricity unit cost</span>
            </div>
            <div className="calc__field">
              <label className="sr-only" htmlFor="calc-rate">
                Electricity unit cost in rupees per kWh
              </label>
              <div className="calc__rate">
                <span aria-hidden="true">₹1</span>
                <input
                  id="calc-rate"
                  name="calc-rate"
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={rate}
                  aria-valuetext={`₹${rate.toFixed(2)} per kWh`}
                  onChange={(e) => setRate(+e.target.value)}
                />
                <span aria-hidden="true">₹15</span>
              </div>
              <div className="calc__rate-val">
                <b>₹{rate.toFixed(2)}</b> / kWh
                <em>KSEB Kerala average pre-filled</em>
              </div>
            </div>

            <Button as="button" type="button" variant="green" arrow onClick={() => setShow(true)}>
              Calculate my solar savings
            </Button>
          </div>

          <div className="calc__result" aria-live="polite">
            <AnimatePresence mode="wait">
              {show ? (
                <motion.div
                  key="res"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="calc__result-top">
                    <span>Your estimate</span>
                    <strong>{result.kw} kW system</strong>
                  </div>
                  <ul className="calc__rows">
                    {rows.map(([k, v, hot], i) => (
                      <motion.li
                        key={k}
                        className={hot ? 'hot' : ''}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 * i, duration: 0.4 }}
                      >
                        <span>{k}</span>
                        <b>{v}</b>
                      </motion.li>
                    ))}
                  </ul>
                  <Button href="#contact" variant="green" arrow>
                    Get a free quote for this system
                  </Button>
                  <p className="calc__disc">Indicative estimate. Final figures confirmed after a site survey.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  className="calc__empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <svg viewBox="0 0 64 64" width="56" height="56" fill="none">
                    <circle cx="32" cy="32" r="11" stroke="var(--green)" strokeWidth="2.5" />
                    <g stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M32 8v6M32 50v6M8 32h6M50 32h6M15 15l4 4M45 45l4 4M49 15l-4 4M19 45l-4 4" />
                    </g>
                  </svg>
                  <p>Fill in a detail and hit calculate — your system size, savings and payback appear here.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
