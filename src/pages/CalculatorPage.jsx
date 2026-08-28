import React from 'react'
import Calculator from '../components/Calculator'
import Subsidy from '../components/Subsidy'
import Prose, { Figures, Reviewed } from '../components/Prose'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import { PLANNING_FIGURES, PLANNING_CAVEAT } from '../../content/equipment'
import {
  CALCULATOR_SECTIONS,
  CALCULATOR_INTRO,
  CALCULATOR_REVIEWED,
} from '../../content/calculator'
import { CALCULATOR_FAQS } from '../../content/faqs'

/* Subsidy follows the calculator because the figure the calculator subtracts
   is the one the subsidy section explains. The FAQ here is about the estimate
   itself; the subsidy questions live on /subsidy/, so the two pages are not
   near-duplicates of each other. */
export default function CalculatorPage() {
  return (
    <>
      <Calculator headingAs="h1" />
      <Prose
        id="assumptions"
        eyebrow="Behind the numbers"
        title={['What the estimate ', 'assumes.']}
        intro={CALCULATOR_INTRO}
        blocks={CALCULATOR_SECTIONS}
      >
        <Figures items={PLANNING_FIGURES} caveat={PLANNING_CAVEAT} />
        <Reviewed
          date={CALCULATOR_REVIEWED}
          note="The full specification, including worked examples, is kept in docs/calculator-logic.md alongside the code."
        />
      </Prose>
      <Subsidy />
      <FAQ items={CALCULATOR_FAQS} title={['About the ', 'estimate.']} />
      <Contact />
    </>
  )
}
