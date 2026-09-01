import React from 'react'
import Services from '../components/Services'
import Brands from '../components/Brands'
import Stats from '../components/Stats'
import Prose, { Figures, Reviewed } from '../components/Prose'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import {
  EQUIPMENT_SECTIONS,
  EQUIPMENT_INTRO,
  EQUIPMENT_REVIEWED,
  PLANNING_FIGURES,
  PLANNING_CAVEAT,
} from '../../content/equipment'
import { SERVICES_FAQS } from '../../content/faqs'

export default function ServicesPage() {
  return (
    <>
      <Services headingAs="h1" />
      <Brands />
      <Prose
        id="equipment"
        eyebrow="Equipment"
        title={['How to read ', 'a solar quote.']}
        intro={EQUIPMENT_INTRO}
        blocks={EQUIPMENT_SECTIONS}
      >
        <Figures items={PLANNING_FIGURES} caveat={PLANNING_CAVEAT} />
        <Reviewed date={EQUIPMENT_REVIEWED} />
      </Prose>
      <Stats />
      <FAQ items={SERVICES_FAQS} title={['Questions about ', 'what we install.']} />
      <Contact />
    </>
  )
}
