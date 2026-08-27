import React from 'react'
import { useSmoothScroll } from './lib/useSmoothScroll'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import Projects from './components/Projects'
import Subsidy from './components/Subsidy'
import Calculator from './components/Calculator'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './styles/sections.css'

export default function App() {
  useSmoothScroll()
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Stats />
        <Services />
        <Projects />
        <Subsidy />
        <Calculator />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
