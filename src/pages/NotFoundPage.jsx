import React from 'react'
import { Link } from 'react-router-dom'
import { SectionHeading } from '../components/common'
import { useReveal } from '../lib/useReveal'
import { CONTACT } from '../../site.config'

/* The catch-all for any path that matches nothing in site.routes.js (see
   src/routes.jsx). Deliberately NOT a route of its own: this page has no
   URL to be indexed under, so it stays out of ROUTES, out of PAGES, out of
   sitemap.xml and out of llms.txt. scripts/prerender.mjs renders it once,
   separately from the ROUTES loop, straight to dist/404.html, and strips
   its canonical/og:url/JSON-LD afterwards — an error page has no business
   claiming to be a WebPage in the graph. */
export default function NotFoundPage() {
  const scope = useReveal()
  return (
    <section
      id="not-found"
      className="section section--paper notfound"
      ref={scope}
      aria-labelledby="not-found-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="404" id="not-found-title" as="h1">
            That page doesn't <span className="soft">exist.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            The link may be old, mistyped, or the page has moved. Here's where you
            were probably headed.
          </p>
        </div>

        <div className="suits reveal" data-delay="0.15">
          <ul className="suits__list">
            <li>
              <Link to="/">Back to the homepage</Link>
            </li>
            <li>
              <Link to="/services/">
                What we install — residential, commercial, hybrid, EV charging and
                backup UPS
              </Link>
            </li>
            <li>
              <Link to="/subsidy/">The PM Surya Ghar subsidy, and how we file it for you</Link>
            </li>
            <li>
              <Link to="/savings-calculator/">Estimate your system size and payback</Link>
            </li>
            <li>
              <Link to="/contact/">Get a free site assessment and a written quote</Link>
            </li>
            <li>
              <a href={CONTACT.phoneHref}>Call {CONTACT.phoneDisplay}</a>
            </li>
            <li>
              <a href={CONTACT.whatsappHref} rel="noopener">
                Message us on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
