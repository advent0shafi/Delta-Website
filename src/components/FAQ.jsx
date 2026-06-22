import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'

const FAQS = [
  ['How much does a home system cost after subsidy?', 'A 3 kW system typically costs around ₹1,80,000 before subsidy. After the PM Surya Ghar subsidy of up to ₹78,000, your net cost is roughly ₹1,02,000. You get a full written quote before any commitment.'],
  ['How much can I save on my KSEB bill?', 'Most homes see a 70–90% cut in their monthly bill. A 3 kW system saves roughly ₹1,800–₹2,500 per month depending on usage.'],
  ['Who is eligible for the ₹78,000 subsidy?', 'Any residential consumer with a valid KSEB connection. The subsidy is up to ₹30,000 for 1 kW, ₹60,000 for 2 kW, and ₹78,000 for 3 kW and above. We handle the entire application.'],
  ['How long does installation and approval take?', 'From consultation to net-meter activation, the process typically takes 4–8 weeks, including KSEB inspection and approval.'],
  ['Do you handle all the KSEB paperwork?', 'Yes — every document. The grid-connectivity application, technical undertaking, PM Surya Ghar registration, and the test-cum-completion certificate.'],
]

export default function FAQ() {
  const scope = useReveal()
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="section faq" ref={scope}>
      <div className="container faq__grid">
        <div className="faq__aside">
          <SectionHeading eyebrow="Questions">
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
              <li key={i} className={`faq__item ${isOpen ? 'on' : ''}`}>
                <button className="faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{q}</span>
                  <span className="faq__plus" aria-hidden="true" />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq__a-wrap"
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
