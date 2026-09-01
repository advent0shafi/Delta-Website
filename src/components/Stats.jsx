import React, { useEffect, useRef } from 'react'
import { countUp, useReveal } from '../lib/useReveal'

const STATS = [
  { to: 78000, prefix: '₹', label: 'Govt subsidy, direct to your bank' },
  { to: 90, suffix: '%', pre: 'up to ', label: 'Reduction in KSEB bill' },
  { to: 25, suffix: '+', label: 'Panel performance warranty' },
  /* `tight` because "4–" is half of the value, not a qualifier like "up to":
     it has to sit at full size hard against the number, or the stat reads as
     "4– 7 yrs". Only visible once the numbers got bigger.

     4–7, not the 3–5 this said while the site costed every system at a flat
     ₹60,000 per kW. On Delta's real prices a 3 kW roof pays back in 5.7 years
     at ₹5.50 a unit and 4.5 at ₹7 — the range now spans the tariffs KSEB
     customers actually pay rather than the best of them. */
  { to: 7, pre: '4–', tight: true, suffix: ' yrs', label: 'Typical payback period' },
]

function FeatureArt() {
  return (
    <svg
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Diagonal white-transparent lines */}
      <line x1="-20" y1="380" x2="260" y2="-40" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <line x1="60"  y1="380" x2="340" y2="-40" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
      <line x1="160" y1="380" x2="440" y2="-40" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
      <line x1="260" y1="380" x2="540" y2="-40" stroke="rgba(255,255,255,0.04)" strokeWidth="1.5" />
      {/* Brand-green accent diagonal */}
      <line x1="110" y1="380" x2="390" y2="-40" stroke="rgba(91,183,21,0.35)" strokeWidth="2" />
      {/* Subtle circle accents */}
      <circle cx="340" cy="60"  r="70" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      <circle cx="340" cy="60"  r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    </svg>
  )
}

/* The value as it should read when the count-up has finished — this is what
   goes into the markup, so a crawler (and anyone with JS off) sees the real
   figure instead of the "0" the animation used to start from. */
const finalText = (s) =>
  (s.prefix || '') + s.to.toLocaleString('en-IN') + (s.suffix || '')

export default function Stats() {
  const scope = useReveal()
  const numRefs = useRef([])

  useEffect(() => {
    /* Reduced motion: leave the true figures alone rather than animating them. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const tweens = numRefs.current.map((el, i) =>
      el
        ? countUp(el, STATS[i].to, {
            prefix: STATS[i].prefix || '',
            suffix: STATS[i].suffix || '',
          })
        : null
    )
    return () => tweens.forEach((t) => t && t.scrollTrigger && t.scrollTrigger.kill())
  }, [])

  return (
    <section id="stats" className="stats2" ref={scope} aria-labelledby="stats-title">
      <div className="container">
        <div className="stats2__layout">
          {/* Left: feature card */}
          <div className="stats2__feature reveal" data-delay="0">
            <div className="stats2__art" aria-hidden="true">
              <FeatureArt />
            </div>
            <p className="stats2__brand">Delta</p>
            <h2 className="stats2__ftitle" id="stats-title">
              Energy in a few<br />numbers.
            </h2>
            <a href="#contact" className="stats2__learn">
              Learn more →
            </a>
          </div>

          {/* Right: 2×2 stat cards */}
          <div className="stats2__cards">
            {/* The icons were dropped rather than restyled: a rupee glyph beside
                "₹78,000" and a clock beside "4–7 yrs" restate the number they
                sit on, and four identical green outline marks in four identical
                boxes was doing more to date the page than to explain it. */}
            {STATS.map((s, i) => {
              return (
                <div className="stats2__card reveal" data-delay={0.06 + i * 0.06} key={i}>
                  <div className="stats2__num">
                    {s.pre && (
                      <span className={`stats2__pre${s.tight ? ' stats2__pre--tight' : ''}`}>
                        {s.pre}
                      </span>
                    )}
                    <span ref={(el) => (numRefs.current[i] = el)}>{finalText(s)}</span>
                  </div>
                  <p className="stats2__label">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
