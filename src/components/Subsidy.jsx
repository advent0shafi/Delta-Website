import React from 'react'
import { childHeading, SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { SYSTEM_PRICES as PRICES, PRICE_CAVEAT, STEPS, subsidyFor, inr } from '../../site.config'

export default function Subsidy({ headingAs = 'h2' }) {
  const scope = useReveal()
  const StepsTitle = childHeading(headingAs)
  const StepTitle = childHeading(StepsTitle)
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
            <SectionHeading eyebrow="Government subsidy" id="subsidy-title" as={headingAs}>
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

          {/* Right: what a system costs, and what is left after the subsidy.
              The second figure is derived rather than typed, so the price
              list and the subsidy schedule cannot drift apart. */}
          <div className="subsidy2__tiers reveal" data-delay="0.1">
            <p className="subsidy2__tiers-cap">What a system costs</p>
            {PRICES.map((p) => {
              const subsidy = subsidyFor(p.kwValue)
              return (
                <div className={`subsidy2__tier${p.hot ? ' hot' : ''}`} key={p.kw}>
                  <div>
                    <div className="subsidy2__tier-kw">{p.kw}</div>
                    <div className="subsidy2__tier-label">
                      {p.note && <>{p.note} · </>}
                      {inr(p.price - subsidy)} after subsidy
                    </div>
                  </div>
                  <div className="subsidy2__tier-amt">{inr(p.price)}</div>
                </div>
              )
            })}
            <p className="subsidy2__tiers-note">{PRICE_CAVEAT}</p>
          </div>
        </div>
      </div>

      {/* Steps — cream bg band */}
      <div className="subsidy2__steps-wrap">
        <div className="container">
          <StepsTitle className="sr-only" id="subsidy-steps-title">
            How going solar with Delta works, in three steps
          </StepsTitle>
          <ol className="subsidy2__steps" aria-labelledby="subsidy-steps-title">
            {STEPS.map(([t, b], i) => (
              <li className="subsidy2__step reveal" data-delay={0.06 + i * 0.08} key={t}>
                <span className="subsidy2__step-n" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <StepTitle className="subsidy2__step-title">{t}</StepTitle>
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
