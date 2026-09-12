import React from 'react'
import Hero from '../components/Hero'
import Stats from '../components/Stats'
import Services from '../components/Services'
import Brands from '../components/Brands'
import Projects from '../components/Projects'
import Purpose from '../components/Purpose'
import Subsidy from '../components/Subsidy'
import Calculator from '../components/Calculator'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'

/* The full tour. The <h1> lives in the hero, so every section here keeps its
   default <h2>.

   <Purpose /> sits between the project rail and the subsidy block on purpose:
   it is the one section making a claim about intent rather than about money,
   so it goes after the proof and before the offer. */
export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <Brands />
      <Projects />
      <Purpose />
      <Subsidy />
      <Calculator />
      <FAQ />
      <Contact />
    </>
  )
}
