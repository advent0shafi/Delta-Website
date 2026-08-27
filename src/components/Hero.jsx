import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from './common'

const TRUST = ['Authorized dealer', 'KSEB net-metering experts', '₹78,000 subsidy handled']

export default function Hero() {
  const root = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce && videoRef.current) videoRef.current.pause()

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.hero__rise', { opacity: 1, y: 0 })
        gsap.set('.hero__line span', { yPercent: 0 })
        return
      }
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero__line span', { yPercent: 115, duration: 1, stagger: 0.1 }, 0.1)
        .from('.hero__rise', { opacity: 0, y: 22, duration: 0.8, stagger: 0.1 }, '-=0.5')
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="top" className="hero" ref={root} aria-labelledby="hero-title">
      {/* poster + preload="metadata" so the 3.3 MB video no longer blocks LCP:
          the browser paints the poster frame immediately and streams the rest. */}
      <video
        ref={videoRef}
        className="hero__video"
        src="/hero.mp4"
        poster="/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <span className="eyebrow hero__eyebrow hero__rise">
          On-grid solar · Since 2018
        </span>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__line"><span>Rooftop solar</span></span>
          <span className="hero__line"><span className="hero__soft">in Malappuram.</span></span>
        </h1>

        <p className="hero__sub hero__rise">
          On-grid rooftop solar for Kerala homes and businesses — done right,
          with every KSEB form and the ₹78,000 subsidy handled for you.
        </p>

        <div className="hero__actions hero__rise">
          <Button href="#contact" variant="green" arrow>
            Get a free quote
          </Button>
          <Button href="#calculator" variant="light">
            Calculate savings
          </Button>
        </div>

        <div className="hero__trust hero__rise">
          {TRUST.map((t) => (
            <span key={t} className="hero__chip">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <path d="M3 8.5l3 3 7-7" stroke="var(--green-300)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t}
            </span>
          ))}
        </div>
      </div>

      <a href="#stats" className="hero__scroll" aria-label="Scroll down">
        Scroll <i />
      </a>
    </section>
  )
}
