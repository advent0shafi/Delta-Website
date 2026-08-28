import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Batched scroll reveal: any descendant with class .reveal animates in.
   Honors a per-element style="--d: 0.1s" delay via data-delay.

   The revealed state is stored as a `data-in` ATTRIBUTE, not a class. Some
   revealed elements (e.g. the services cards) also carry a React-controlled
   className that changes on hover; when React re-renders it re-assigns
   node.className wholesale, which would silently strip an externally-added
   class and make the element fade back to opacity: 0. React never writes
   `data-in`, so the reveal survives any re-render. */
export function useReveal(deps = []) {
  const scope = useRef(null)
  useEffect(() => {
    const root = scope.current
    if (!root) return
    const items = root.querySelectorAll('.reveal')
    if (!items.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      items.forEach((el) => el.setAttribute('data-in', ''))
      return
    }

    /* ScrollTrigger.batch() RETURNS the triggers it creates; they have to be
       captured to be killable. This used to be an empty array that cleanup
       looped over, which killed nothing — invisible on a one-page site that
       never unmounted, but every client-side route change now leaves a set of
       triggers pointing at DOM React has already removed. */
    const triggers = ScrollTrigger.batch(items, {
      start: 'top 86%',
      onEnter: (batch) =>
        batch.forEach((el, i) => {
          const delay = parseFloat(el.dataset.delay || 0) + i * 0.07
          gsap.delayedCall(delay, () => el.setAttribute('data-in', ''))
        }),
    })

    ScrollTrigger.refresh()
    return () => triggers.forEach((t) => t.kill())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return scope
}

/* Count-up numbers when they scroll into view.

   The element is rendered with its TRUE final value in the markup, so the
   prerendered HTML says "₹78,000" rather than "₹0".

   The reset to zero happens in onStart, not at setup: that way the real
   figure stays on screen until the moment the animation actually begins.
   A crawler that renders JavaScript but never scrolls this into view — which
   is how Googlebot usually behaves — reads the true number instead of a
   zero left behind by an animation that was waiting for a scroll. */
export function countUp(el, to, { prefix = '', suffix = '', decimals = 0 } = {}) {
  const obj = { v: 0 }
  const fmt = (v) =>
    prefix +
    v.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }) +
    suffix
  return gsap.to(obj, {
    v: to,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    onStart: () => {
      el.textContent = fmt(0)
    },
    onUpdate: () => {
      el.textContent = fmt(obj.v)
    },
  })
}
