import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getLenis } from '../lib/useSmoothScroll'

/* Scroll behaviour across client-side navigation. Renders nothing.

   react-router's <ScrollRestoration> only works with a data router
   (createBrowserRouter); this app uses the declarative BrowserRouter, so the
   same job is done here.

   Deliberately narrow: it only forces scroll on a NEW entry (PUSH/REPLACE).
   Back and forward are left to the browser, which already restores those
   correctly and cannot be talked out of it — history.scrollRestoration is a
   property of the current history entry, so every pushState lands on a fresh
   entry reset to 'auto', and Chromium re-applies that asynchronously even
   when it is reassigned here. An earlier version tracked offsets per
   location.key to restore POP by hand and got them wrong: the browser
   restores the incoming page's offset before this effect runs, so reading
   window.scrollY here records the wrong value for the page being left. */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()
  const navType = useNavigationType()
  const first = useRef(true)

  useEffect(() => {
    /* The prerendered document is already in the right place on first paint,
       and a reload restoring its offset should be left alone. */
    if (first.current) {
      first.current = false
      if (!hash) return
    }

    /* Both caches describe a page that no longer exists. ScrollTrigger holds
       start/end offsets measured against it, and Lenis holds a scroll limit
       it clamps every target to — stale, that limit silently swallows a jump
       to a deep anchor when arriving from a shorter page.

       Refresh BEFORE moving, never after: ScrollTrigger.refresh() records the
       current offset and puts it back when it finishes, so calling it after
       the scroll undoes the scroll one frame later. */
    ScrollTrigger.refresh()

    const lenis = getLenis()
    lenis?.resize()

    const target = hash ? document.querySelector(hash) : null
    if (!target && navType === 'POP') return

    const apply = () => {
      if (target) {
        /* An anchor arriving from another route — the click handler in
           useSmoothScroll only sees links on the page it is already on. */
        if (lenis) lenis.scrollTo(target, { offset: -76, duration: 1.2 })
        else target.scrollIntoView({ block: 'start' })
      } else if (lenis) {
        lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }

    /* Applied now and again on the next frame, because the browser's own
       scroll handling for the new entry lands between the two. */
    apply()
    const raf = requestAnimationFrame(apply)
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash, navType])

  return null
}
