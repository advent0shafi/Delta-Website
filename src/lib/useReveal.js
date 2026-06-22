import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Batched scroll reveal: any descendant with class .reveal animates in.
   Honors a per-element style="--d: 0.1s" delay via data-delay. */
export function useReveal(deps = []) {
  const scope = useRef(null)
  useEffect(() => {
    const root = scope.current
    if (!root) return
    const items = root.querySelectorAll('.reveal')
    if (!items.length) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      items.forEach((el) => el.classList.add('is-in'))
      return
    }

    const triggers = []
    ScrollTrigger.batch(items, {
      start: 'top 86%',
      onEnter: (batch) =>
        batch.forEach((el, i) => {
          const delay = parseFloat(el.dataset.delay || 0) + i * 0.07
          gsap.delayedCall(delay, () => el.classList.add('is-in'))
        }),
    })

    ScrollTrigger.refresh()
    return () => triggers.forEach((t) => t.kill())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return scope
}

/* Count-up numbers when they scroll into view. */
export function countUp(el, to, { prefix = '', suffix = '', decimals = 0 } = {}) {
  const obj = { v: 0 }
  return gsap.to(obj, {
    v: to,
    duration: 1.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    onUpdate: () => {
      el.textContent =
        prefix +
        obj.v.toLocaleString('en-IN', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }) +
        suffix
    },
  })
}
