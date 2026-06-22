import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from './common'

const LINKS = [
  ['Services', '#services'],
  ['Projects', '#projects'],
  ['Subsidy', '#subsidy'],
  ['Calculator', '#calculator'],
  ['FAQ', '#faq'],
]

export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
  }, [open])

  return (
    <header className={`nav ${solid ? 'nav--solid' : ''}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__logo" aria-label="Delta Energy Solutions home">
          <img src="/brand/delta-white.png" alt="Delta Energy Solutions" className="nav__logo-w" />
          <img src="/brand/delta-color.png" alt="" aria-hidden="true" className="nav__logo-c" />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href} className="nav__link">
              {label}
            </a>
          ))}
        </nav>

        <div className="nav__cta">
          <Button href="#contact" variant={solid ? 'green' : 'light'} arrow>
            Get Free Quote
          </Button>
        </div>

        <button
          className="nav__burger"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? 'x' : ''} />
          <span className={open ? 'x' : ''} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="nav__sheet"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <Button href="#contact" variant="green" arrow onClick={() => setOpen(false)}>
              Get Free Quote
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
