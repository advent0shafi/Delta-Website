import React from 'react'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { SUBSIDY_TIERS as TIERS, STEPS } from '../../site.config'

export default function Subsidy() {
  const scope = useReveal()
  return (
    <section
      id="subsidy"
      className="section subsidy2"
      ref={scope}
      aria-labelledby="subsidy-title"
    >
      {/* Two-column: copy left, tier pills right */}
      <div className="container">
        <div className="subsidy2__grid">
          {/* Left */}
          <div className="subsidy2__copy reveal" data-delay="0">
            <SectionHeading eyebrow="Government subsidy" id="subsidy-title">
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
          <h3 className="sr-only" id="subsidy-steps-title">
            How going solar with Delta works, in three steps
          </h3>
          <ol className="subsidy2__steps" aria-labelledby="subsidy-steps-title">
            {STEPS.map(([t, b], i) => (
              <li className="subsidy2__step reveal" data-delay={0.06 + i * 0.08} key={t}>
                <span className="subsidy2__step-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="subsidy2__step-title">{t}</h4>
                  <p>{b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
