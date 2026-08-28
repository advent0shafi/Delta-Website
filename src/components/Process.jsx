import React from 'react'
import { childHeading, SectionHeading } from './common'
import { useReveal } from '../lib/useReveal'
import { PROCESS_STEPS, PROCESS_INTRO, PROCESS_DURATION, PROCESS_SPLIT } from '../../content/process'

/* The KSEB + PM Surya Ghar journey in full. `STEPS` in site.config.js is the
   three-step summary the homepage shows; this is the same journey at the
   detail someone on /subsidy/ came looking for.

   Each step names who is responsible. That matters: the reference site claims
   to handle "everything", which cannot be true of a subsidy claimed against
   the customer's own consumer number and bank account. */
export default function Process({ headingAs = 'h2' }) {
  const scope = useReveal()
  const StepTitle = childHeading(headingAs)
  const ColTitle = childHeading(headingAs)

  return (
    <section
      id="process"
      className="section section--paper-2 process"
      ref={scope}
      aria-labelledby="process-title"
    >
      <div className="container">
        <div className="sec-head">
          <SectionHeading eyebrow="The process" id="process-title" as={headingAs}>
            From your bill <span className="soft">to a live meter.</span>
          </SectionHeading>
          <p className="lead reveal" data-delay="0.1">
            {PROCESS_INTRO}
          </p>
        </div>

        <ol className="process__list">
          {PROCESS_STEPS.map((s, i) => (
            <li className="process__step reveal" data-delay={0.04 + i * 0.05} key={s.title}>
              <span className="process__n" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="process__body">
                <StepTitle className="process__title">{s.title}</StepTitle>
                <span className="process__who">{s.who}</span>
                <p className="process__p">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="process__duration reveal">{PROCESS_DURATION}</p>

        <div className="process__split">
          <div className="process__col reveal" data-delay="0.05">
            <ColTitle className="process__col-title">What Delta does</ColTitle>
            <ul>{PROCESS_SPLIT.delta.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="process__col reveal" data-delay="0.1">
            <ColTitle className="process__col-title">What we need from you</ColTitle>
            <ul>{PROCESS_SPLIT.you.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}
