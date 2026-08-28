import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { FAQS } from '../../site.config'

/* `items` defaults to the homepage set so existing callers keep working; each
   route passes its own keyword-targeted questions from content/faqs.js. The
   `id` is overridable because two FAQ sections could otherwise collide on one
   page, though no route currently does that. */
export default function FAQ({ headingAs = 'h2', items = FAQS, id = 'faq', title, lead }) {
  const scope = useReveal()
  const [open, setOpen] = useState(0)
  return (
    <section id={id} className="section faq" ref={scope} aria-labelledby={`${id}-title`}>
      <div className="container faq__grid">
        <div className="faq__aside">
          <SectionHeading eyebrow="Questions" id={`${id}-title`} as={headingAs}>
            {title ? title[0] : 'Frequently asked '}
            <span className="soft">{title ? title[1] : 'questions.'}</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            {lead ||
              "Still unsure about something? Message us on WhatsApp and we'll answer in plain Malayalam or English."}
          </p>
        </div>

        <ul className="faq__list reveal" data-delay="0.1">
          {items.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <li key={q} className={`faq__item ${isOpen ? 'on' : ''}`}>
                <h3 className="faq__q-h">
                  <button
                    className="faq__q"
                    id={`${id}-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a-${i}`}
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span>{q}</span>
                    <span className="faq__plus" aria-hidden="true" />
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq__a-wrap"
                      id={`${id}-a-${i}`}
                      role="region"
                      aria-labelledby={`${id}-q-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="faq__a">{a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
