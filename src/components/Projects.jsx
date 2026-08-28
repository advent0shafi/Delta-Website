import React from 'react'
import { childHeading, SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { PROJECTS } from '../../site.config'

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Projects({ headingAs = 'h2' }) {
  const scope = useReveal()
  const Name = childHeading(headingAs)
  return (
    <section
      id="projects"
      className="section projects"
      ref={scope}
      aria-labelledby="projects-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="Our work" id="projects-title" as={headingAs}>
            Installed across <span className="soft">Kerala.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            A few of the homes and businesses now running on their own roof.
          </p>
        </div>

        <div className="projects__rail reveal" data-delay="0.1">
          {PROJECTS.map((p) => (
            <article className="proj" key={p.name} aria-labelledby={`proj-${slug(p.name)}`}>
              <img
                src={p.img}
                alt={`${p.capacity} ${p.type.toLowerCase()} solar install in ${p.town}, ${p.district}`}
                loading="lazy"
                decoding="async"
                width="900"
                height="600"
              />
              <div className="proj__scrim" />
              <div className="proj__body">
                <span className="proj__tag">{p.type}</span>
                <Name className="proj__name" id={`proj-${slug(p.name)}`}>{p.name}</Name>
                {/* A spec, set as one. <dl> is the right element for
                    label/value pairs and it reads correctly to a screen
                    reader, which a run-on "3 kW rooftop home, Manjeri ·
                    Malappuram" never did. */}
                <dl className="proj__spec">
                  <div>
                    <dt>Capacity</dt>
                    <dd>{p.capacity}</dd>
                  </div>
                  <div>
                    <dt>Town</dt>
                    <dd>{p.town}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
