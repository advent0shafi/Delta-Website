# Delta Energy Solutions — Single-Page Website

A minimal, award-style single-page site for Delta Energy Solutions
(on-grid rooftop solar, Malappuram / Kerala). Built **mobile-first** with
**React + Vite**, animated with **GSAP**, **Framer Motion**, and **Lenis**
smooth scroll.

The visual language is a brand-true take on the Virya Energy reference:
warm paper sections, deep petrol-forest dark sections, two-tone headings,
fully-rounded pill buttons, large rounded cards, the signature hover-reveal
service cards, and a full-bleed **video hero**. Re-skinned into the Delta
brand — petrol-forest `#0E3A36` + green `#5BB715` on warm paper `#F4F1EA`.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build for production:

```bash
npm run build    # outputs to dist/
npm run preview  # serve the built site locally
```

Requires Node 18+.

## What's on the page

Seven sections, trimmed for focus:

Nav (transparent over hero → solid paper on scroll, logo swaps white→colour) ·
**Hero** (full-bleed background video, `public/hero.mp4`) · Stats strip
(count-up, forest) · Services (4 hover-reveal cards) · Subsidy + how-it-works
(PM Surya Ghar, 3 steps) · Savings Calculator (interactive, KSEB tariffs
pre-filled) · FAQ (accordion) · Contact form · CTA band + Footer + mobile
floating WhatsApp/Call buttons.

The calculator sizes a system from monthly bill / units / roof area, applies
the residential subsidy tiers (1 kW ₹30k, 2 kW ₹60k, ≥3 kW ₹78k; commercial =
nil) and shows generation, annual savings, net cost and payback.

## Before you go live — replace these placeholders

- **Phone / WhatsApp numbers** — currently `+91 XXXXX XXXXX` in
  `src/components/Contact.jsx` and `src/components/Footer.jsx`.
- **Email** — `hello@deltaenergy.in` (same files) — set to your real address.
- **Service photos** — `src/components/Services.jsx` uses Unsplash stock
  images that only show on card hover. Replace with your own installation
  photos (drop files in `public/` and point the `img` paths at them).
- **Hero video** — `public/hero.mp4`. Swap for your own footage when ready
  (keep it short, muted-loopable, and compressed for fast load).
- **Contact form** — `Contact.jsx` shows a success state on submit but does
  not send anywhere. Wire it to your email service / WhatsApp / CRM.
- **Address** — exact street address in Contact/Footer if you want it shown.

## Design tokens

Brand colours, radii and fonts live in `src/index.css` (`:root`). Fonts are
**Bricolage Grotesque** (display) + **Inter** (body), loaded in `index.html`.
Section styles are in `src/styles/sections.css` and are written mobile-first
(base = phone; `@media (min-width: 720px)` and `1000px` scale up).

## Notes

- Respects `prefers-reduced-motion` (animations are guarded in CSS and JS).
- Logos are in `public/brand/` (white for dark backgrounds, colour for light).
