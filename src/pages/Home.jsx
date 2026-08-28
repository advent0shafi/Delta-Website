import React from 'react'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Services from '../components/Services'
import Projects from '../components/Projects'
import Subsidy from '../components/Subsidy'
import Calculator from '../components/Calculator'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

/* The full tour, unchanged from the single-page site. The <h1> lives in the
   hero, so every section here keeps its default <h2>. */
export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Projects />
      <Subsidy />
      <Calculator />
      <FAQ />
      <Contact />
    </>
  )
}
