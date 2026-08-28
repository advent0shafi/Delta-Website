# Lugano Living Lab — UI teardown

`https://www.luganolivinglab.ch/en` · studied 2026-08-28 · Webflow + Next.js

Measured, not eyeballed: figures below come from the site's own stylesheets
(`raw/shared.css`, `raw/opt.css`) and from computed styles in Chromium at 430px
and 1440px. Screenshots in this folder.

---

## 1. The type system

They ship a real token scale, `em`-based, redefined at three breakpoints.

| token | ≥992px | ≤991 | ≤767 | ≤479 |
| --- | ---: | ---: | ---: | ---: |
| `--font-size--h1` | **9.75em** | 7em | 5em | 3.75em |
| `--font-size--h2` | 8.25em | 5em | 3.5em | 3.5em |
| `--font-size--h3` | 5em | 4em | 2.5em | 2.25em |
| `--font-size--h4` | 3.25em | 3em | 1.5em | 1.5em |
| `--font-size--h5` | 2.25em | 2.25em | 2.25em | 1.25em |
| `--font-size--text-large` | 1.5em | 1.2rem | 1.15em | 1.125em |
| `--padding--section-base` | 8em | 6em | 5em | 4em |

Computed, as rendered:

| | mobile 430px | desktop 1440px |
| --- | --- | --- |
| body / base | **18.35px** | 16px |
| h1 | 68.8px · lh 1.1 · ls −0.02em | ~156px |
| h2 / h3 | 41.3px · **lh 1.0** · ls 0 | — |
| paragraph | 18.35px · **lh 1.2** | 16px · lh 1.2 |
| heading weight | **500** | 500 |
| nav height | 84px | 73px |
| section padding | 73px | 128px |

Three things there are genuinely unusual:

1. **Body text is bigger on mobile than on desktop** — 18.35px against 16px.
   Almost everyone does the reverse. It is a deliberate readability call for
   the device most people actually arrive on.
2. **Headings are weight 500, not bold.** At 69px and above, medium reads as
   confident; bold reads as shouting. Delta sets 600 everywhere.
3. **Line-height 1.0 on headings and 1.2 on body.** Very tight. It works
   because their paragraphs are short — see the warning in §5.

Typeface is **Neue Haas Grotesk Display** (Adobe Fonts). Their token file also
names *General Sans*, which is Fontshare — the same foundry as Delta's Switzer.

---

## 2. Everything is square

A radius audit across the whole rendered page returned **six elements**:
`20px ×3`, `10px ×2`, `7px ×1` — all of them the third-party cookie banner.

Every nav item, every button, every media block: `border-radius: 0px`.

The nav is a row of hard-edged, full-bleed rectangles butted against each other
and flush to the viewport edges — a purple logo square, a black wordmark block,
a grey `Contact ↗` block. No container inset, no gap, no rounding.

## 3. Recurring devices

- **Hairline rule as the structural unit.** A thin rule above a small label, or
  under a heading, spanning only part of the width. Used constantly, and it is
  what gives the page structure in place of boxes and cards.
- **Small coloured category label** — `Vision` in purple, ~1em, sentence case —
  sitting between the rule and a huge display number (`2030`).
- **Two-tier label / value pairs.** The nav does it (`Creating` above
  `Projects`, `Sharing` above `Events`), and so does content (`Date:` above
  `1-5.12.2025`). Context without a second click.
- **Zero uppercase.** Measured: **0 elements** with `text-transform: uppercase`
  on the entire page. Hierarchy comes from size, weight and colour instead.
- **Arrows carry meaning.** `↗` diagonal for "go to this", a very large `→` in
  its own black block for "next".
- **Full-bleed colour and image bands** with type overlaid flush left, no
  padded container.

## 4. Palette

Dark-first: `body { background: black; color: white }`.

`#63f` electric violet · `#e1ff00` acid yellow, plus tints. Neutrals are pure
black with alpha steps — `#0000008f`, `#00000047`, `#00000029` — rather than
separate grey values.

**Do not copy this.** Delta is warm paper, petrol navy and green, and it should
stay that way. What is worth copying is the *method*: two accents used sparingly
against an almost monochrome ground, with neutrals derived as alpha steps of one
colour instead of a parallel grey scale.

---

## 5. What Delta should take — and what it must not

### Take

| # | Change | Why it applies to Delta |
| --- | --- | --- |
| 1 | **Body 16px → 17–18px on mobile** | Delta's pages now run 700–1,200 words. This is the single highest-value change for readability, and Lugano proves the direction. |
| 2 | **Heading weight 600 → 500** | At Delta's hero size (up to 57.6px) 600 is heavy. 500 reads more assured and is a one-token change. |
| 3 | **Drop uppercase eyebrows** | Delta sets `text-transform: uppercase; letter-spacing: 0.16em` on every section eyebrow. Lugano uses zero uppercase and loses nothing. Sentence-case coloured labels would immediately look less templated. |
| 4 | **Hairline rules instead of card chrome** | Already started in the stats block. Extend it: the services grid and project rail are still boxes. |
| 5 | **Label / value pairs** | A natural fit Delta is not using: system size, town, generation, payback on project cards; `Date:` / `Capacity:` / `Town:`. |
| 6 | **`↗` for outbound, `→` for onward** | Delta uses one `→` everywhere. The KSEB portal and Google Maps links should be `↗`. |
| 7 | **Full-bleed bands on mobile** | Everything on Delta sits inside one padded container, which is part of why it reads as a template. |

### Do not take

- **The black ground and the purple/yellow.** Wrong brand entirely.
- **Paragraph line-height 1.2.** Lugano's paragraphs are two or three lines.
  Delta's `/kseb-net-metering/` page is 1,275 words; at 1.2 it would be a wall.
  Delta's 1.62–1.72 is correct for its content — this is the clearest case of a
  choice that is right there and wrong here.
- **`h1: 9.75em` (~156px).** Lugano is a showcase for an innovation lab. Delta
  is a lead-generation site for homeowners comparing quotes. Poster type would
  cost clarity where clarity converts.
- **Fully square everything.** Delta's pill button is established brand
  language, and the radius was just tightened to 20/14/10/7. Going fully square
  would be a rebrand, not a refinement.

### Ranked by value per unit of change

1. Body size up on mobile — one line, affects every page.
2. Heading weight to 500 — one token.
3. Eyebrows out of uppercase — one rule, removes a strong template signal.
4. Label/value pairs on project and service cards — small component work.
5. Rules replacing remaining card chrome — medium.
6. Full-bleed bands — largest, most invasive; do last if at all.

---

## 6. The honest caveat

Lugano is a *showcase* site: short copy, big pictures, an institution with
nothing to sell. Delta is a small business that needs a phone call. Nearly every
choice Lugano makes to look impressive — poster type, tight leading, dark ground,
sparse content — trades comprehension for impression.

Take the typographic craft. Leave the poster.

---

## Files

`raw/home.html`, `raw/shared.css`, `raw/opt.css` — as fetched.
`mobile-*.png`, `desktop-*.png`, `m1-4.png`, `d1-4.png` — rendered at 430px and 1440px.
