import React from 'react'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'

const TIERS = [
  { kw: '1 kW', amount: '₹30,000', label: 'For 1 kW systems' },
  { kw: '2 kW', amount: '₹60,000', label: 'For 2 kW systems' },
  { kw: '3 kW+', amount: '₹78,000', label: 'Maximum subsidy — most popular', hot: true },
]

const STEPS = [
  ['Free consultation', 'Share your KSEB bill. We assess your roof and usage, then file your PM Surya Ghar application.'],
  ['We install', 'A clean, certified install by our team. KSEB inspects and fits your net meter.'],
  ['You get paid', 'Savings start from day one and the subsidy reaches your bank within 30–60 days.'],
]

export default function Subsidy() {
  const scope = useReveal()
  return (
    <section id="subsidy" className="section subsidy2" ref={scope}>
      {/* Two-column: copy left, tier pills right */}
      <div className="container">
        <div className="subsidy2__grid">
          {/* Left */}
          <div className="subsidy2__copy reveal" data-delay="0">
            <SectionHeading eyebrow="Government subsidy">
              The govt pays you <span className="soft">to go solar.</span>
            </SectionHeading>
            <p className="lead">
              Under PM Surya Ghar, the centre sends up to ₹78,000 to your bank once your net
              meter is live — and net metering can pull the bill close to zero.
            </p>
            <a href="#contact" className="btn btn--outline">
              We handle the paperwork →
            </a>
          </div>

          {/* Right: stacked tier pills */}
          <div className="subsidy2__tiers reveal" data-delay="0.1">
            {TIERS.map((t) => (
              <div
                className={`subsidy2__tier${t.hot ? ' hot' : ''}`}
                key={t.kw}
              >
                <div>
                  <div className="subsidy2__tier-kw">{t.kw}</div>
                  <div className="subsidy2__tier-label">{t.label}</div>
                </div>
                <div className="subsidy2__tier-amt">{t.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps — cream bg band */}
      <div className="subsidy2__steps-wrap">
        <div className="container">
          <div className="subsidy2__steps">
            {STEPS.map(([t, b], i) => (
              <div className="subsidy2__step reveal" data-delay={0.06 + i * 0.08} key={i}>
                <span className="subsidy2__step-n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{t}</h4>
                  <p>{b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
