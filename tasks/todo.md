# Task: Services grid — hover bug + content update

## 1. Hover bug (content vanishes on mouse-over)
**Root cause (confirmed):** `useReveal` adds the `is-in` class imperatively via
`el.classList.add('is-in')`, but `Services.jsx` renders the same element with a
React-controlled template-literal className that changes on hover
(`svc reveal ${hover ? 'is-hover' : ''}`). When hover state flips, React
re-assigns `node.className`, wiping the externally-added `is-in`. The card falls
back to `.reveal { opacity: 0 }` and disappears. It only reappears after
scrolling out and back in, because that re-fires ScrollTrigger's `onEnter`.
This exactly matches the client's repro steps.

- [x] Mark reveal state with a `data-in` attribute instead of a class, so React
      re-renders can never clobber it (fixes the whole reveal system, not just
      this one card).
- [x] Update `.reveal.is-in` -> `.reveal[data-in]` in `index.css`.
- [x] Hover lift used `transform`, which fights `.reveal`'s `transform`. Move it
      to the independent `translate` property so the two compose.

## 2. Services grid content — 4 items -> 5 items
- [x] Item 1: Residential solar rooftop
- [x] Item 2: Commercial and industrial rooftop solar solution
- [x] Item 3: Hybrid solar solution (new)
- [x] Item 4: Solar EV charging (new)
- [x] Item 5: Inverters and backup UPS
- [x] Removed "Net metering & KSEB approvals" card per client list
      (topic still covered by the Subsidy / KSEB process section).
- [x] Add `hybrid` + `ev` icons to the shared icon set.
- [x] Desktop grid: 4-col -> 6-col with spans = 3 cards on row 1, 2 wide cards
      on row 2 (no dangling empty cell).
- [x] Verify every card image URL returns 200 and is topically correct.

## Review

### Verified in a real browser (Playwright + Chromium)
Reproduced the bug on the original code, then confirmed the fix on the new code.

**Original code — bug reproduced:**
| moment | className | opacity |
| --- | --- | --- |
| after scroll-in | `svc reveal is-in` | 1 |
| on hover | `svc reveal is-hover` | **0** (card gone) |
| after mouse leaves | `svc reveal ` | **0** (stays gone) |

React re-assigned `node.className` on the hover re-render, dropping `is-in`.

**Fixed code:** opacity stays `1` through a two-pass hover of all five cards,
`data-in` survives every re-render, and the hover lift now actually applies
(`translate: 0px -4px`).

### Extra finding: the hover lift never worked
`.svc.is-hover { transform: translateY(-4px) }` (sections.css) and
`.reveal.is-in { transform: none }` (index.css) had equal specificity, and
index.css is bundled *after* sections.css (verified by byte offset in the built
CSS: 25190 vs 7650), so `transform: none` silently won and the card never lifted.
Moving the lift to the independent `translate` property fixes it — the two
properties compose instead of competing.

### Regression checks
- All 34 `.reveal` elements page-wide reach opacity 1 — the `data-in` switch
  broke no other section.
- Mobile (390x844): 5 cards, rail still scroll-snaps, no horizontal page overflow.
- `prefers-reduced-motion`: all 5 cards visible.
- Keyboard focus path (`onFocus`) behaves like hover.
- Production build passes; no `is-in` string remains in the JS or CSS bundle.
- All 5 card image URLs return HTTP 200 and were opened and visually checked
  (one candidate turned out to be an unrelated stock photo and was rejected).

### Files changed
- `src/lib/useReveal.js` — reveal state as `data-in` attribute, not a class.
- `src/index.css` — `.reveal.is-in` -> `.reveal[data-in]`.
- `src/styles/sections.css` — hover lift via `translate`; 6-col desktop grid (3+2).
- `src/components/Services.jsx` — five services, client's exact wording.
- `src/components/common.jsx` — new `hybrid` and `ev` icons.

### Not done (out of the two requested items) — flagged for the client
- `src/components/Contact.jsx` and `src/components/Footer.jsx` still carry
  placeholder contact data (`+91 XXXXX XXXXX`, `tel:+910000000000`,
  `hello@deltaenergy.in`). No GSTIN, no Google Maps embed.
- `src/components/Subsidy.jsx:34` still reads "We handle the paperwork ->",
  which Audio 6 asked to remove.
