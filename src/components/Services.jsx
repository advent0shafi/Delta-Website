import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SectionHeading, Icons } from './common'
import { useReveal } from '../lib/useReveal'

const SERVICES = [
  {
    icon: 'home',
    title: ['Residential ', 'solar rooftop.'],
    body: 'Right-sized on-grid systems for homes, with KSEB registration and subsidy filed for you.',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=70',
  },
  {
    icon: 'factory',
    title: ['Commercial and industrial ', 'rooftop solar solution.'],
    body: 'Larger rooftop systems for shops, offices and factories — a real cut to running costs.',
    img: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?auto=format&fit=crop&w=1000&q=70',
  },
  {
    icon: 'hybrid',
    title: ['Hybrid ', 'solar solution.'],
    body: 'Solar, grid and battery storage together — savings by day, backup the moment the grid drops.',
    img: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=70',
  },
  {
    icon: 'ev',
    title: ['Solar ', 'EV charging.'],
    body: 'Home and commercial EV charging points, run off your own roof instead of the meter.',
    img: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=70',
  },
  {
    icon: 'battery',
    title: ['Inverters and ', 'backup UPS.'],
    body: 'Tier-1 inverters and domestic or industrial UPS for dependable power through every outage.',
    img: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1000&q=70',
  },
]

function Card({ s, i }) {
  const [hover, setHover] = useState(false)
  const Ico = Icons[s.icon]
  return (
    <motion.article
      className={`svc reveal ${hover ? 'is-hover' : ''}`}
      data-delay={(i % 2) * 0.06}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      tabIndex={0}
    >
      <div className="svc__media" aria-hidden={!hover}>
        <motion.img
          src={s.img}
          alt={s.title.join('')}
          loading="lazy"
          initial={false}
          animate={{ scale: hover ? 1 : 1.12, opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="svc__scrim" />
      </div>

      <div className="svc__top">
        <span className="svc__icon">
          <Ico width="28" height="28" />
        </span>
      </div>

      <div className="svc__foot">
        <h3 className="svc__title">
          {s.title[0]}
          <span className="svc__title-2">{s.title[1]}</span>
        </h3>
        <motion.p
          className="svc__body"
          initial={false}
          animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {s.body}
        </motion.p>
      </div>
    </motion.article>
  )
}

export default function Services() {
  const scope = useReveal()
  return (
    <section id="services" className="section section--paper services" ref={scope}>
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="What we do">
            Everything you need to <span className="soft">go solar.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            One accountable team — from the first KSEB form to the day your meter
            spins backwards.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s, i) => (
            <Card s={s} i={i} key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
