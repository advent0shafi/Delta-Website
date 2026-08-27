import React from 'react'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { PROJECTS } from '../../site.config'

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function Projects() {
  const scope = useReveal()
  return (
    <section
      id="projects"
      className="section projects"
      ref={scope}
      aria-labelledby="projects-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="Our work" id="projects-title">
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
                alt={`${p.tag} solar install — ${p.name}, ${p.meta}`}
                loading="lazy"
                decoding="async"
                width="900"
                height="600"
              />
              <div className="proj__scrim" />
              <div className="proj__body">
                <span className="proj__tag">{p.tag}</span>
                <h3 className="proj__name" id={`proj-${slug(p.name)}`}>{p.name}</h3>
                <p className="proj__meta">{p.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
