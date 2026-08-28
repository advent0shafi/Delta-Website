import React from 'react'
import { childHeading, SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { ABOUT } from '../../content/about'

/* Timeline, team and credentials. All placeholder content — the switch is
   ABOUT.isPlaceholder in content/about.js, which also holds the checklist of
   what the client has to supply before any of it can be published as fact. */
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
          <ItemTitle className="about__sub" id="about-team">The team</ItemTitle>
          <div className="about__cards" aria-labelledby="about-team">
            {ABOUT.team.map((m) => (
              <article className="about__card reveal" key={m.name}>
                <h4 className="about__name">{m.name}</h4>
                <span className="about__role">{m.role}</span>
                <p className="about__bio">{m.bio}</p>
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
