import React from 'react'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { BRANDS } from '../../site.config'

/* The manufacturers Delta fits, shown as their own marks.

   A logo is a wordmark — the brand name IS the image — so the alt text
   carries the name and nothing else. The line under each logo says which
   part of a system that brand is here for, which is the only thing a wall
   of logos can add over a list of names.

   `headingAs` for the same reason Services has it: this section is an <h2>
   under the hero on `/` and under the services grid on `/services/`, and it
   is never the page's <h1>. */
export default function Brands({ headingAs = 'h2' }) {
  const scope = useReveal()

  return (
    <section
      id="brands"
      className="section section--paper brands"
      ref={scope}
      aria-labelledby="brands-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="Brands" id="brands-title" as={headingAs}>
            Equipment we fit and service.
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            Which name goes on your roof matters less than whether someone can
            attend a fault in your district. These are the manufacturers we
            install, and whose service networks reach Malappuram.
          </p>
        </div>

        <ul className="brands__grid">
          {BRANDS.map((b, i) => (
            <li className="brands__cell reveal" data-delay={(i % 4) * 0.05} key={b.name}>
              <span className="brands__mark">
                <img
                  className="brands__logo"
                  src={b.logo}
                  alt={b.name}
                  width={b.w}
                  height={b.h}
                  loading="lazy"
                  decoding="async"
                  style={b.scale ? { '--scale': b.scale } : undefined}
                />
              </span>
              <span className="brands__what">{b.supplies}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
