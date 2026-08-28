import React from 'react'
import { childHeading, SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'

/* Long-form content section — the only new visual primitive the content
   build needed. Every explainer block on every page is this component with
   different data from content/*.js, so the reading experience is identical
   whether you land on the subsidy page or a service detail page.

   `blocks` is an array of { id, eyebrow, title: [lead, tail], body: [...],
   source?: { label, href } }. `title` is split in two for the same two-tone
   treatment SectionHeading gives every other heading on the site. */
export default function Prose({
  id,
  eyebrow,
  headingAs = 'h2',
  title,
  intro,
  blocks = [],
  className = '',
  children,
}) {
  const scope = useReveal()
  const BlockTitle = childHeading(headingAs)
  const titleId = id ? `${id}-title` : undefined

  return (
    <section
      id={id}
      className={`section prose ${className}`}
      ref={scope}
      aria-labelledby={titleId}
    >
      <div className="container">
        {title && (
          <div className="sec-head prose__head">
            <SectionHeading eyebrow={eyebrow} id={titleId} as={headingAs}>
              {title[0]}
              <span className="soft">{title[1]}</span>
            </SectionHeading>
            {intro && (
              <p className="lead reveal" data-delay="0.1">
                {intro}
              </p>
            )}
          </div>
        )}

        <div className="prose__blocks">
          {blocks.map((b, i) => (
            <article className="prose__block reveal" data-delay={0.05 + i * 0.04} key={b.id}>
              {b.eyebrow && <span className="prose__eyebrow">{b.eyebrow}</span>}
              <BlockTitle className="prose__title" id={`${b.id}-h`}>
                {b.title[0]}
                <span className="soft">{b.title[1]}</span>
              </BlockTitle>
              {b.body.map((p) => (
                <p className="prose__p" key={p.slice(0, 40)}>
                  {p}
                </p>
              ))}
              {b.source && (
                /* Where a claim rests on a published source, the source is on
                   the page. The reference site states regulatory figures with
                   no attribution, several of which are years out of date. */
                <p className="prose__source">
                  Source:{' '}
                  <a href={b.source.href} target="_blank" rel="noopener noreferrer">
                    {b.source.label}
                  </a>
                </p>
              )}
            </article>
          ))}
        </div>

        {children}
      </div>
    </section>
  )
}

/* A short "this was checked on" line. Solar regulation in Kerala moves, and a
   page that does not say when it was last looked at is asking to be trusted
   indefinitely. */
export function Reviewed({ date, note }) {
  return (
    <p className="prose__reviewed reveal">
      <span>Last reviewed {date}</span>
      {note && <span className="prose__reviewed-note">{note}</span>}
    </p>
  )
}

/* Bulleted "this suits you if" list used by the service detail pages. */
export function Suits({ title, items, headingAs = 'h2' }) {
  const scope = useReveal()
  const Title = childHeading(headingAs)
  return (
    <div className="suits reveal" ref={scope}>
      <Title className="suits__title">{title}</Title>
      <ul className="suits__list">
        {items.map((it) => (
          <li key={it}>{it}</li>
        ))}
      </ul>
    </div>
  )
}

/* The planning assumptions the savings calculator runs on, shown as figures
   rather than buried in a paragraph. Values come from content/equipment.js,
   which takes them from docs/calculator-logic.md — one source, three places. */
export function Figures({ items, caveat }) {
  const scope = useReveal()
  return (
    <div className="figures reveal" ref={scope}>
      <dl className="figures__grid">
        {items.map(([value, label]) => (
          <div className="figures__item" key={value}>
            <dt className="figures__value">{value}</dt>
            <dd className="figures__label">{label}</dd>
          </div>
        ))}
      </dl>
      {caveat && <p className="figures__caveat">{caveat}</p>}
    </div>
  )
}
