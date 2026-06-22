import React from 'react'
import { Button, Icons } from './common'

const QUICK = [
  ['Services', '#services'], ['Projects', '#projects'], ['Subsidy', '#subsidy'],
  ['Calculator', '#calculator'], ['FAQ', '#faq'], ['Contact', '#contact'],
]
const BRANDS = ['Tata Power Solar', 'Waaree', 'Microtek', 'V-Guard', 'Vikram']

export default function Footer() {
  return (
    <>
      {/* CTA as a contained rounded card */}
      <section className="cta-wrap">
        <div className="container">
          <div className="cta__card">
            <div className="cta__art" aria-hidden="true">
              <svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">
                <g stroke="rgba(255,255,255,0.06)" strokeWidth="2">
                  <path d="M-50 320 L420 -20" />
                  <path d="M180 360 L700 -40" />
                  <path d="M460 380 L980 -20" />
                </g>
                <line x1="300" y1="360" x2="780" y2="-20" stroke="rgba(91,183,21,0.28)" strokeWidth="2" />
              </svg>
            </div>
            <div className="cta__inner">
              <h2 className="headline">
                Start your <span className="cta__accent">solar journey</span> today.
              </h2>
              <Button href="#contact" variant="green" arrow>
                Get a free quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <img src="/brand/delta-white.png" alt="Delta Energy Solutions" className="footer__logo" />
            <p>Clean energy for Kerala, since 2018. Authorized solar dealer · KSEB net metering.</p>
            <div className="footer__brands">
              {BRANDS.map((b) => <span key={b}>{b}</span>)}
            </div>
          </div>

          <div className="footer__col">
            <h4>Explore</h4>
            <ul>{QUICK.map(([l, h]) => <li key={h}><a href={h}>{l}</a></li>)}</ul>
          </div>

          <div className="footer__col">
            <h4>Contact</h4>
            <ul className="footer__contact">
              <li><a href="tel:+910000000000"><Icons.phone width="16" height="16" />+91 XXXXX XXXXX</a></li>
              <li><a href="mailto:hello@deltaenergy.in"><Icons.mail width="16" height="16" />hello@deltaenergy.in</a></li>
              <li><Icons.pin width="16" height="16" />Malappuram, Kerala</li>
            </ul>
            <div className="footer__social">
              <a href="https://wa.me/910000000000" aria-label="WhatsApp"><Icons.whatsapp width="18" height="18" /></a>
              <a href="tel:+910000000000" aria-label="Call"><Icons.phone width="18" height="18" /></a>
              <a href="mailto:hello@deltaenergy.in" aria-label="Email"><Icons.mail width="18" height="18" /></a>
            </div>
          </div>
        </div>

        <div className="container footer__bottom">
          <span>© {new Date().getFullYear()} Delta Energy Solutions, Malappuram. All rights reserved.</span>
          <span>Authorized Solar Dealer · KSEB Net Metering</span>
        </div>
      </footer>

      <div className="floaters" aria-hidden="false">
        <a className="floater floater--wa" href="https://wa.me/910000000000" aria-label="Chat on WhatsApp">
          <Icons.whatsapp width="24" height="24" />
        </a>
        <a className="floater floater--call" href="tel:+910000000000" aria-label="Call us">
          <Icons.phone width="22" height="22" />
        </a>
      </div>
    </>
  )
}
