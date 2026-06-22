import React from 'react'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'

const PROJECTS = [
  {
    tag: 'Residential',
    name: '3 kW rooftop home',
    meta: 'Manjeri · Malappuram',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=70',
  },
  {
    tag: 'Commercial',
    name: '20 kW office rooftop',
    meta: 'Kottakkal · Malappuram',
    img: 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=900&q=70',
  },
  {
    tag: 'Residential',
    name: '5 kW villa system',
    meta: 'Tirur · Malappuram',
    img: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=900&q=70',
  },
  {
    tag: 'Industrial',
    name: '50 kW factory array',
    meta: 'Perinthalmanna · Malappuram',
    img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=900&q=70',
  },
]

export default function Projects() {
  const scope = useReveal()
  return (
    <section id="projects" className="section projects" ref={scope}>
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="Our work">
            Installed across <span className="soft">Kerala.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            A few of the homes and businesses now running on their own roof.
          </p>
        </div>

        <div className="projects__rail reveal" data-delay="0.1">
          {PROJECTS.map((p) => (
            <article className="proj" key={p.name}>
              <img src={p.img} alt={`${p.tag} solar install — ${p.name}, ${p.meta}`} loading="lazy" />
              <div className="proj__scrim" />
              <div className="proj__body">
                <span className="proj__tag">{p.tag}</span>
                <h3 className="proj__name">{p.name}</h3>
                <p className="proj__meta">{p.meta}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
