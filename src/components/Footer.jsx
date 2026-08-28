import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icons } from './common'
import { SITE, AREA, CONTACT, BRANDS, SERVICES } from '../../site.config'

const QUICK = [
  ['Home', '/'], ['About', '/about/'], ['Services', '/services/'], ['Projects', '/projects/'],
  ['Subsidy', '/subsidy/'], ['KSEB net metering', '/kseb-net-metering/'],
  ['Calculator', '/savings-calculator/'], ['Contact', '/contact/'],
]

/* The five service detail pages are only reachable from the services grid
   otherwise, which leaves them one click deeper than they should be. */
const WHAT_WE_DO = SERVICES.map((s) => [s.title.join('').replace(/\.$/, ''), `/services/${s.id}/`])

export default function Footer() {
  return (
    <>
      {/* CTA as a contained rounded card */}
      <section className="cta-wrap" aria-labelledby="cta-title">
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
              <h2 className="headline" id="cta-title">
                Start your <span className="cta__accent">solar journey</span> today.
              </h2>
              <Button as={Link} to="/contact/" variant="green" arrow>
                Get a free quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__grid">
          <div className="footer__brand">
            <img
              src="/brand/delta-white.png"
              alt={SITE.name}
              className="footer__logo"
              width="3354"
              height="866"
            />
            <p>
              Clean energy for {AREA.region}, since {SITE.foundingYear}. Authorized
              solar dealer · KSEB net metering.
            </p>
            <div className="footer__brands">
              {BRANDS.map((b) => <span key={b}>{b}</span>)}
            </div>
          </div>

          <nav className="footer__col" aria-labelledby="footer-explore">
            <h2 className="footer__col-title" id="footer-explore">Explore</h2>
            <ul>{QUICK.map(([l, h]) => <li key={h}><Link to={h}>{l}</Link></li>)}</ul>
          </nav>

          <nav className="footer__col" aria-labelledby="footer-services">
            <h2 className="footer__col-title" id="footer-services">What we do</h2>
            <ul>{WHAT_WE_DO.map(([l, h]) => <li key={h}><Link to={h}>{l}</Link></li>)}</ul>
          </nav>

          <div className="footer__col">
            <h2 className="footer__col-title" id="footer-contact">Contact</h2>
            <address className="footer__address">
              <ul className="footer__contact">
                <li>
                  <a href={CONTACT.phoneHref}>
                    <Icons.phone width="16" height="16" aria-hidden="true" />
                    {CONTACT.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`}>
                    <Icons.mail width="16" height="16" aria-hidden="true" />
                    {CONTACT.email}
                  </a>
                </li>
                <li>
                  <Icons.pin width="16" height="16" aria-hidden="true" />
                  {AREA.city}, {AREA.region}
                </li>
              </ul>
            </address>
            <div className="footer__social">
              <a href={CONTACT.whatsappHref} rel="noopener" aria-label="Chat with Delta Energy Solutions on WhatsApp">
                <Icons.whatsapp width="18" height="18" aria-hidden="true" />
              </a>
              <a href={CONTACT.phoneHref} aria-label="Call Delta Energy Solutions">
                <Icons.phone width="18" height="18" aria-hidden="true" />
              </a>
              <a href={`mailto:${CONTACT.email}`} aria-label="Email Delta Energy Solutions">
                <Icons.mail width="18" height="18" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="container footer__bottom">
          <span>© {new Date().getFullYear()} {SITE.name}, {AREA.city}. All rights reserved.</span>
          <span>Authorized Solar Dealer · KSEB Net Metering</span>
        </div>
      </footer>

      <div className="floaters" role="group" aria-label="Contact Delta Energy Solutions">
        <a
          className="floater floater--wa"
          href={CONTACT.whatsappHref}
          rel="noopener"
          aria-label="Chat on WhatsApp"
        >
          <Icons.whatsapp width="24" height="24" aria-hidden="true" />
        </a>
        <a className="floater floater--call" href={CONTACT.phoneHref} aria-label="Call us">
          <Icons.phone width="22" height="22" aria-hidden="true" />
        </a>
      </div>
    </>
  )
}
