# Image brief — what to shoot or source, slot by slot

Every image on the site is currently placeholder. This is the shopping list:
one row per slot, with a search query, the shape it has to be, and where the
value goes in the code.

**Read this first.** The four project images are captioned as *real Delta
installs in named Kerala towns*. Stock photography there is an accuracy
problem, not an aesthetic one — a page that says "3 kW · Manjeri" over a
photograph of somebody else's roof in California is a false claim about work
Delta did. Those four should be Delta's own photographs, and the stock queries
below are strictly an interim measure.

The five service images and the hero can legitimately be stock.

---

## 1. Hero video — the highest-priority item

`public/hero.mp4` is **3.3 MB of wind-turbine footage on a solar company's
homepage**. It is the first thing every visitor sees and it shows the wrong
technology.

| | |
| --- | --- |
| File | `public/hero.mp4` (+ `public/hero-poster.jpg`, regenerate with `npm run og`) |
| Shape | 16:9 landscape, 1920×1080 is plenty |
| Length | 8–15 s, silent, loops cleanly |
| Weight | Target under 2 MB — it currently blocks the first paint at 3.3 MB |

**Search queries** (Pexels and Coverr are free and allow commercial use):

```
rooftop solar panel installation drone
solar panel installation workers roof
solar panels rooftop aerial slow
technician installing solar panel roof
solar panel array sunrise timelapse
```

Best of all: 15 seconds of phone video of a real Delta crew on a real roof.
Shaky handheld footage of your own work beats immaculate stock of someone
else's, and it is the one thing a competitor cannot copy.

---

## 2. Service images — `site.config.js` → `SERVICES[].img`

Shape: **4:5 portrait**, about 1000×1250. They sit behind a dark scrim with
white text over the lower half, so choose frames with **an uncluttered lower
third** and avoid anything with burnt-out sky at the top — that is exactly why
the current set reads as a grey wash.

| Slot | Must show | Search query |
| --- | --- | --- |
| `residential` | Panels on a sloped house roof | `solar panels sloped house roof residential` |
| `commercial` | A large flat commercial roof array | `commercial rooftop solar array flat roof` |
| `hybrid` | Panels *plus* a battery / storage unit | `solar battery storage system home inverter` |
| `ev-charging` | A car on charge, ideally near panels | `electric car charging home wallbox solar` |
| `inverters-ups` | A wall-mounted inverter, close up | `solar inverter wall mounted installation closeup` |

Kerala-specific variants, if you want the site to look like it is set where it
is — worth the extra searching:

```
solar panels kerala home rooftop
solar panels india residential rooftop tiled
rooftop solar india installation monsoon sky
```

---

## 3. Project images — `site.config.js` → `PROJECTS[].img`

Shape: **3:4 portrait** (`aspect-ratio: 3 / 4` in the CSS), about 900×1200.

These four are labelled with a capacity, a type and a town. **Photograph the
actual installs.** For each one you want a straight-on or slightly raised shot
of the array, in daylight, with the roof visible.

| Card | Claim on the page | Interim stock query |
| --- | --- | --- |
| 1 | 3 kW · Residential · Manjeri | `small solar array house roof india` |
| 2 | 20 kW · Commercial · Kottakkal | `solar panels office building roof india` |
| 3 | 5 kW · Residential · Tirur | `villa rooftop solar panels tropical` |
| 4 | 50 kW · Industrial · Perinthalmanna | `industrial factory roof solar panels large` |

If you cannot photograph all four yet, the honest fix is to publish fewer
cards rather than to fill the gaps with stock — three real installs beat four
where one is invented.

---

## 4. Team portraits — already supplied

`public/team/placeholder-1.jpg` and `-2.jpg` are the two portraits you sent.
Still needed: a third for the Installations Manager (currently a monogram), and
confirmation that these are Delta staff who have consented to appear. See
`content/about.js`.

---

## Where to look

| Source | Licence | Notes |
| --- | --- | --- |
| [Pexels](https://www.pexels.com) | Free, commercial use, no attribution | Best free video library |
| [Unsplash](https://unsplash.com) | Free, commercial use | What the site uses now |
| [Coverr](https://coverr.co) | Free | Video only |
| [Pixabay](https://pixabay.com) | Free | Weaker solar selection |

Check the licence covers commercial use before publishing — this is a real
business's site, not a mockup.

## How to swap them in

1. Drop files in `public/` (e.g. `public/services/residential.jpg`).
2. Point `SERVICES[].img` / `PROJECTS[].img` at `/services/residential.jpg`.
3. Update the matching `alt` text to describe the new photograph — the alt is
   a description of the image, not a keyword slot.
4. Resize before committing. The team portraits arrived at 1.9 MB each and went
   to 23 kB with no visible loss:
   ```
   convert in.jpg -resize 1000x1250^ -gravity center -extent 1000x1250 \
           -strip -quality 82 -interlace Plane public/services/residential.jpg
   ```
5. `npm run build && npm run seo:check`.
