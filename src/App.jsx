import React from 'react'
import { useLocation } from 'react-router-dom'
import { useSmoothScroll } from './lib/useSmoothScroll'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import AppRoutes from './routes'
import './styles/sections.css'

export default function App() {
  useSmoothScroll()

  /* Only the homepage opens on the full-bleed dark hero. Every other route
     starts on warm paper directly under the fixed bar, so it needs the
     nav's solid treatment and clearance above its first section. */
  const isHome = useLocation().pathname === '/'

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <ScrollManager />
      <Nav isHome={isHome} />
      <main id="main" className={isHome ? undefined : 'page--sub'}>
        <AppRoutes />
      </main>
      <Footer />
    </>
  )
}
