import React, { useEffect, useRef } from 'react'
import { countUp, useReveal } from '../lib/useReveal'

const STATS = [
  { ico: 'rupee', to: 78000, prefix: '₹', label: 'Govt subsidy, direct to your bank' },
  { ico: 'bolt', to: 90, suffix: '%', pre: 'up to ', label: 'Reduction in KSEB bill' },
  { ico: 'shield', to: 25, suffix: '+', label: 'Panel performance warranty' },
  { ico: 'clock', to: 5, pre: '3–', suffix: ' yrs', label: 'Typical payback period' },
]

function IcoRupee() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12M6 8h12M6 21l7-13M16 21H6" />
      <path d="M9 8c0 2.761 2.239 5 5 5s5-2.239 5-5" />
    </svg>
  )
}

function IcoBolt() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  )
}

function IcoShield() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IcoClock() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

const ICONS = { rupee: IcoRupee, bolt: IcoBolt, shield: IcoShield, clock: IcoClock }

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

export default function Stats() {
  const scope = useReveal()
  const numRefs = useRef([])

  useEffect(() => {
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
    <section id="stats" className="stats2" ref={scope}>
      <div className="container">
        <div className="stats2__layout">
          {/* Left: feature card */}
          <div className="stats2__feature reveal" data-delay="0">
            <div className="stats2__art" aria-hidden="true">
              <FeatureArt />
            </div>
            <p className="stats2__brand">Delta</p>
            <h2 className="stats2__ftitle">
              Energy in a few<br />numbers.
            </h2>
            <a href="#contact" className="stats2__learn">
              Learn more →
            </a>
          </div>

          {/* Right: 2×2 stat cards */}
          <div className="stats2__cards">
            {STATS.map((s, i) => {
              const Ico = ICONS[s.ico]
              return (
                <div className="stats2__card reveal" data-delay={0.06 + i * 0.06} key={i}>
                  <span className="stats2__ico">
                    <Ico />
                  </span>
                  <div className="stats2__num">
                    {s.pre && <span className="stats2__pre">{s.pre}</span>}
                    <span ref={(el) => (numRefs.current[i] = el)}>
                      {s.prefix || ''}0{s.suffix || ''}
                    </span>
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
