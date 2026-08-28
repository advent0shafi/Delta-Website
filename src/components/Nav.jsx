import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from './common'
import { SITE } from '../../site.config'

/* The FAQ has no page of its own yet, so it stays an anchor into the
   homepage. ScrollManager handles the cross-route jump. */
const LINKS = [
  ['Services', '/services/'],
  ['Projects', '/projects/'],
  ['Subsidy', '/subsidy/'],
  ['Calculator', '/savings-calculator/'],
  ['FAQ', '/#faq'],
]

export default function Nav({ isHome = true }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  /* Transparent is only legible over the homepage's dark hero. Everywhere
     else the bar sits on warm paper from the first pixel, where the white
     logo and light button would be invisible. */
  const solid = scrolled || !isHome

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <Link to="/" className="nav__logo" aria-label={`${SITE.name} — home`}>
          {/* Two stacked marks, swapped by CSS as the bar goes solid. The link
              carries the accessible name, so both images stay decorative. */}
          <img
            src="/brand/delta-white.png"
            alt=""
            className="nav__logo-w"
            width="3354"
            height="866"
            fetchpriority="high"
          />
          <img
            src="/brand/delta-color.png"
            alt=""
            aria-hidden="true"
            className="nav__logo-c"
            width="3354"
            height="866"
          />
        </Link>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <Link key={href} to={href} className="nav__link">
              {label}
            </Link>
          ))}
        </nav>

        <div className="nav__cta">
          <Button as={Link} to="/contact/" variant={solid ? 'green' : 'light'} arrow>
            Get Free Quote
          </Button>
        </div>

        <button
          className="nav__burger"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="nav-sheet"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? 'x' : ''} aria-hidden="true" />
          <span className={open ? 'x' : ''} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav__sheet"
            id="nav-sheet"
            aria-label="Primary"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINKS.map(([label, href]) => (
              <Link key={href} to={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Button
              as={Link}
              to="/contact/"
              variant="green"
              arrow
              onClick={() => setOpen(false)}
            >
              Get Free Quote
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
