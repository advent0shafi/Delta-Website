import React from 'react'
import { childHeading, SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { PURPOSE } from '../../content/about'

/* Vision and mission — the client's own two statements.

   The only section on the site that runs on the navy band. That is
   deliberate and it is why there is exactly one of them: a statement of
   intent is the one block on the page making no argument from numbers, so
   it gets colour instead of evidence. Used twice (homepage and /about/),
   both times against a cream section, so the break lands either way.

   No icon. A sun beside "Vision" restates the word, which is the reason
   the stat cards dropped theirs. */
export default function Purpose({ headingAs = 'h2' }) {
  const scope = useReveal()
  const CardTitle = childHeading(headingAs)

  return (
    <section
      id="purpose"
      className="section section--forest purpose"
      ref={scope}
      aria-labelledby="purpose-title"
    >
      <div className="container">
        <div className="purpose__grid">
          <div className="purpose__head">
            <SectionHeading eyebrow="Vision & mission" id="purpose-title" as={headingAs}>
              What the company <span className="soft">is for.</span>
            </SectionHeading>
            <p className="lead reveal" data-delay="0.1">
              {PURPOSE.lead}
            </p>
          </div>

          <div className="purpose__cards">
            {PURPOSE.pillars.map((p, i) => (
              <article className="purpose__card reveal" data-delay={0.14 + i * 0.08} key={p.id}>
                <CardTitle className="purpose__label" id={`purpose-${p.id}`}>
                  {p.label}
                </CardTitle>
                {/* The statement is the content, so it is set at display size
                    and the label above it is the small type — the reverse of
                    the usual card, and the point of the section. */}
                <p className="purpose__stmt">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
