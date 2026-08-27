import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { FAQS } from '../../site.config'

export default function FAQ() {
  const scope = useReveal()
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="section faq" ref={scope} aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__aside">
          <SectionHeading eyebrow="Questions" id="faq-title">
            Frequently asked <span className="soft">questions.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            Still unsure about something? Message us on WhatsApp and we'll answer in plain Malayalam
            or English.
          </p>
        </div>

        <ul className="faq__list reveal" data-delay="0.1">
          {FAQS.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <li key={q} className={`faq__item ${isOpen ? 'on' : ''}`}>
                <h3 className="faq__q-h">
                  <button
                    className="faq__q"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
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
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
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
