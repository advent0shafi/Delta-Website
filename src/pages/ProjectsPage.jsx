import React from 'react'
import Projects from '../components/Projects'
import Stats from '../components/Stats'
import Process from '../components/Process'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import { PROJECTS_FAQS } from '../../content/faqs'

export default function ProjectsPage() {
  return (
    <>
      <Projects headingAs="h1" />
      <Stats />
      <Process />
      <FAQ items={PROJECTS_FAQS} title={['About our ', 'installations.']} />
      <Contact />
    </>
  )
}
