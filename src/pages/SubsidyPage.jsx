import React from 'react'
import Subsidy from '../components/Subsidy'
import Process from '../components/Process'
import { Reviewed } from '../components/Prose'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import { PROCESS_REVIEWED } from '../../content/process'
import { SUBSIDY_FAQS } from '../../content/faqs'

export default function SubsidyPage() {
  return (
    <>
      <Subsidy headingAs="h1" />
      <Process />
      <FAQ
        items={SUBSIDY_FAQS}
        title={['PM Surya Ghar ', 'questions.']}
        lead="What people ask once they realise the subsidy is not a flat percentage."
      />
      <Contact />
      <div className="container">
        <Reviewed
          date={PROCESS_REVIEWED}
          note="Subsidy amounts are the current PM Surya Ghar central rates. We confirm what applies to your connection before anything is ordered."
        />
      </div>
    </>
  )
}
