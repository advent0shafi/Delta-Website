import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { childHeading, SectionHeading, Icons } from './common'
import { useReveal } from '../lib/useReveal'
import { SERVICES } from '../../site.config'

function Card({ s, i, titleAs: Title = 'h3' }) {
  const [hover, setHover] = useState(false)
  const Ico = Icons[s.icon]
  const titleId = `svc-${s.id}`
  /* onFocus/onBlur still drive the reveal — React's focus events bubble, so
     focusing the title link inside is enough. The article used to carry
     tabIndex={0} to be reachable at all; now that it contains a real link,
     keeping it would put two tab stops on every card. */
  return (
    <motion.article
      className={`svc reveal ${hover ? 'is-hover' : ''}`}
      data-delay={(i % 2) * 0.06}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-labelledby={titleId}
    >
      {/* The wrapper used to flip aria-hidden on hover, which pulled the image
          in and out of the accessibility tree as the pointer moved. The photo
          simply carries its own alt text instead. */}
      <div className="svc__media">
        <motion.img
          src={s.img}
          alt={s.alt}
          loading="lazy"
          decoding="async"
          width="1000"
          height="667"
          initial={false}
          animate={{ scale: hover ? 1 : 1.12, opacity: hover ? 1 : 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="svc__scrim" />
      </div>

      <div className="svc__top">
        <span className="svc__icon" aria-hidden="true">
          <Ico width="28" height="28" />
        </span>
      </div>

      <div className="svc__foot">
        <Title className="svc__title" id={titleId}>
          {/* The whole card is the hit area — ::after below stretches this
              link over it — so the accessible name stays the service title
              rather than a bare "read more". */}
          <Link className="svc__link" to={`/services/${s.id}/`}>
            {s.title[0]}
            <span className="svc__title-2">{s.title[1]}</span>
          </Link>
        </Title>
        {/* Plain <p>, revealed by CSS rather than by a hover-driven opacity
            animation. The animated version was `opacity: hover ? 1 : 0`, and
            a touch device never fires hover — so on a phone the description
            was invisible and the card was an icon, a title and 200px of
            nothing. CSS can ask `(hover: hover)`; a render cannot, without
            branching on window and breaking hydration. */}
        <p className="svc__body">{s.body}</p>
      </div>
    </motion.article>
  )
}

export default function Services({ headingAs = 'h2' }) {
  const scope = useReveal()
  return (
    <section
      id="services"
      className="section section--paper services"
      ref={scope}
      aria-labelledby="services-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="What we do" id="services-title" as={headingAs}>
            Everything you need to <span className="soft">go solar.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            One accountable team — from the first KSEB form to the day your meter
            spins backwards.
          </p>
        </div>

        <div className="services__grid">
          {SERVICES.map((s, i) => (
            <Card s={s} i={i} key={s.id} titleAs={childHeading(headingAs)} />
          ))}
        </div>
      </div>
    </section>
  )
}
