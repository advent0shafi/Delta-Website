import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Button } from './common'

const TRUST = ['Authorized dealer', 'KSEB net-metering experts', '₹78,000 subsidy handled']

export default function Hero() {
  const root = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* The video is 3.3 MB — about three quarters of the page's weight —
       and preload="none" on the element (below) keeps the browser from
       fetching a single byte of it up front. We load it in deliberately
       once the browser is idle after first paint, so it never competes
       with the fonts/CSS/JS that the above-the-fold content needs. Same
       reduced-motion behaviour as before: it loads, but stays paused. */
    const loadVideo = () => {
      const v = videoRef.current
      if (!v || v.src) return
      v.src = '/hero.mp4'
      v.load()
      if (reduce) v.pause()
    }
    let idleId
    let timeoutId
    if ('requestIdleCallback' in window) {
      idleId = window.requestIdleCallback(loadVideo, { timeout: 2000 })
    } else {
      timeoutId = window.setTimeout(loadVideo, 1000)
    }

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set('.hero__rise', { y: 0 })
        gsap.set('.hero__line span', { y: 0 })
        return
      }
      /* Transform only, never opacity: the LCP text must stay painted at
         rest the whole time. It used to `.from()` opacity:0 (on
         .hero__rise) and yPercent:115 — a full mask below the line box, so
         the headline had zero painted area — until the animation finished;
         together those made the hero's own text an invisible LCP candidate
         until JS had loaded, hydrated and animated it in. A small upward
         slide reads the same without ever hiding the content. */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero__line span', { y: 24, duration: 1, stagger: 0.1 }, 0.1)
        .from('.hero__rise', { y: 22, duration: 0.8, stagger: 0.1 }, '-=0.5')
    }, root)
    return () => {
      ctx.revert()
      if (idleId !== undefined && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId)
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
    }
  }, [])

  return (
    <section id="top" className="hero" ref={root} aria-labelledby="hero-title">
      {/* poster + preload="none" so the 3.3 MB video costs nothing up front:
          the browser paints the poster frame immediately, and the `src` is
          only assigned in the effect above, once the browser is idle after
          first paint — see loadVideo(). */}
      <video
        ref={videoRef}
        className="hero__video"
        poster="/hero-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        tabIndex={-1}
      />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="container hero__inner">
        <span className="eyebrow hero__eyebrow hero__rise">
          On-grid solar · Since 2017
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
