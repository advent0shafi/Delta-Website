import React from 'react'
import { childHeading, SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { ABOUT } from '../../content/about'

/* Timeline, team and credentials. The two partner portraits are real; the
   milestone dates and credentials around them are still placeholder. The
   switch is ABOUT.isPlaceholder in content/about.js, which also holds the
   checklist of what the client has to supply before any of it is fact. */
/* First letter of each of the first two words — "Anita Menon" -> AM. */
const initials = (name) =>
  name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

export default function Milestones({ headingAs = 'h2' }) {
  const scope = useReveal()
  const ItemTitle = childHeading(headingAs)

  return (
    <section
      id="milestones"
      className="section section--paper-2 about"
      ref={scope}
      aria-labelledby="milestones-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="Our track record" id="milestones-title" as={headingAs}>
            How Delta <span className="soft">got here.</span>
          </SectionHeading>
        </div>

        <ol className="about__timeline">
          {ABOUT.milestones.map(([year, text]) => (
            <li className="about__milestone reveal" key={year}>
              <span className="about__year">{year}</span>
              <p className="about__event">{text}</p>
            </li>
          ))}
        </ol>

        <div className="about__team">
          <ItemTitle className="about__sub" id="about-team">Who runs Delta</ItemTitle>
          <div className="about__cards" aria-labelledby="about-team">
            {ABOUT.team.map((m) => (
              /* Keyed on `id`, not `name`: both partners hold the same
                 designation, and while that designation is standing in for
                 their names the two keys would otherwise collide. */
              <article className="about__card reveal" key={m.id}>
                {m.photo ? (
                  /* Empty alt. The name is in the heading immediately below,
                     so repeating it here only reads it out twice. */
                  <img
                    className="about__photo"
                    src={m.photo}
                    alt=""
                    width="720"
                    height="900"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  /* A monogram is a designed absence rather than a broken
                     image — the fallback for anyone added later without a
                     photograph. */
                  <span className="about__photo about__photo--mono" aria-hidden="true">
                    {initials(m.name)}
                  </span>
                )}
                <h4 className="about__name">{m.name}</h4>
                <span className="about__role">{m.role}</span>
                {/* Spans rather than a joined string, because the separator
                    changes with the viewport: a middot on a wide card, a line
                    break on a phone. CSS decides which; the data stays a
                    list either way. */}
                {m.quals?.length > 0 && (
                  <p className="about__quals">
                    {m.quals.map((q) => (
                      <span key={q}>{q}</span>
                    ))}
                  </p>
                )}
                {/* Optional. Two identifiable people get no invented bio. */}
                {m.bio && <p className="about__bio">{m.bio}</p>}
              </article>
            ))}
          </div>
        </div>

        <div className="about__creds">
          <ItemTitle className="about__sub" id="about-creds">Credentials</ItemTitle>
          <ul className="about__cred-list" aria-labelledby="about-creds">
            {ABOUT.credentials.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}
