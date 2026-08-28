# Image generation prompts

One prompt per slot, with the exact size each renders at. Written for a
photorealistic generator (Midjourney, Flux, Imagen, DALL·E, Seedream).

## Rules that apply to every image

**Generate larger than you need, then downscale.** Downscaling adds apparent
sharpness; upscaling never does. Generate at the "generate at" size below, then
run the resize command at the bottom.

**The composition constraint that matters most.** Service and project images sit
behind a dark gradient with white text over the lower half. So:

- Keep the **lower third simple** — roof surface, ground, shadow. No faces, no
  text, no busy detail down there; it will be covered.
- **No blown-out sky.** Sky in the top quarter at most, and never pure white.
  The current stock crops fail exactly here — they read as a grey wash because
  the frame is mostly overexposed sky.
- Shoot **slightly raised, looking down** at the array rather than up at it.

**Say Kerala, not "India".** Generators default to North Indian or generic
tropical. The cues that produce the right place: Mangalore clay tiles, flat
concrete terrace roofs with parapet walls, coconut palms, laterite, banana
plants, humid haze, monsoon cloud.

**Add these negatives to every prompt:**

```
blown out sky, overexposed highlights, watermark, text, logo, signage,
lens flare, fisheye, tilted horizon, plastic CGI look, oversaturated,
HDR halo, wind turbine, snow, desert
```

`wind turbine` is in there deliberately — solar prompts drift to wind farms,
which is how the current hero video happened.

---

## 1. Hero video

**Generate at** 1920×1080 (16:9) · 8–15 s · silent · must loop · **under 2 MB**

> Slow aerial drone shot descending over a rooftop solar array on a South
> Indian home, Kerala. Flat concrete terrace roof with a low parapet, dark blue
> photovoltaic panels in neat rows on low aluminium mounting frames. Coconut
> palms and dense green vegetation surrounding the house. Warm late-afternoon
> tropical light, soft humid haze, gentle contrast. Camera drifts slowly
> forward and down, no fast movement. Documentary realism, natural colour,
> shallow grade. Sky occupies only the upper quarter of frame and is soft
> overcast rather than blown white.

If your tool does image-to-video, generate a still with the service prompt
below first and animate that — it gives you far more control over the frame.

**Poster frame:** after the video is in `public/hero.mp4`, run `npm run og` to
regenerate `hero-poster.jpg`.

---

## 2. Service images — 4:5 portrait

**Generate at** 1024×1280 · **ship at** 1000×1250

### `residential` — Residential solar rooftop

> Photorealistic photograph of solar panels installed across a sloped
> Mangalore-tile roof on a Kerala home. Eight dark blue monocrystalline panels
> in two neat rows on slim aluminium rails, terracotta tiles visible around
> them. Coconut palm fronds at the frame edge. Bright but slightly overcast
> tropical daylight, soft shadows, humid air. Shot from a raised angle looking
> down along the roof slope. Lower third of the frame is plain roof tile with
> no detail. Editorial architectural photography, 35 mm, natural colour.

### `commercial` — Commercial and industrial rooftop

> Photorealistic photograph of a large flat commercial rooftop covered in rows
> of photovoltaic panels, South India. Wide concrete roof with a low parapet,
> dozens of dark panels on ballasted metal frames receding toward the back of
> frame. A low-rise town and green palms far in the background. Clear morning
> light, long soft shadows across the roof deck. Raised three-quarter angle.
> Lower third is empty roof surface. Documentary architectural photography.

### `hybrid` — Hybrid solar and storage

> Photorealistic photograph of a wall-mounted lithium battery storage unit and
> hybrid solar inverter on a clean plastered utility wall, with a rooftop solar
> array visible through an open doorway behind. Neat conduit runs, tidy
> cabling, small status LEDs. Indian domestic installation. Soft diffused
> daylight from the side. Muted colour, shallow depth of field on the battery
> unit. Lower third is plain wall. Product-documentary photography, 50 mm.

### `ev-charging` — Solar EV charging

> Photorealistic photograph of a white electric car parked in a home carport,
> plugged into a compact wall-mounted AC charging box, charge cable curving to
> the port. Solar panels visible on the flat roof above the carport. Kerala
> house, green tropical planting, warm late-afternoon light. Three-quarter rear
> view of the car, charger clearly in frame. Lower third is plain paved
> driveway. Natural colour, editorial automotive photography.

### `inverters-ups` — Inverters and backup UPS

> Photorealistic close-up photograph of a wall-mounted solar inverter on a
> plain painted wall, with a backup battery unit below it. Clean conduit,
> labelled isolator switches, neat professional wiring. Slight angle, not
> straight-on. Soft even indoor daylight, no harsh reflection on the display.
> Muted industrial colour palette. Lower third is plain wall and cable run.
> Technical documentary photography, 50 mm, shallow depth of field.

---

## 3. Project images — 3:4 portrait

**Generate at** 1024×1365 · **ship at** 900×1200

⚠ These four carry a capacity, a type and a Kerala town on the page. Generated
images published as Delta's completed installs are a claim about work that was
done. If you use these, treat them as temporary and replace them with
photographs of the real installs.

### Card 1 — 3 kW · Residential · Manjeri

> Photorealistic photograph of a small rooftop solar array on a modest
> single-storey Kerala home. Six to eight dark blue panels in one row on a flat
> concrete terrace roof with a painted parapet wall. Coconut palms and green
> foliage behind, other tiled roofs beyond. Bright hazy midday light. Raised
> angle looking across the roof. Lower third is plain concrete terrace.
> Documentary photography, natural colour, 35 mm.

### Card 2 — 20 kW · Commercial · Kottakkal

> Photorealistic photograph of a mid-size solar array on the flat roof of a
> two-storey commercial building in a South Indian town. Roughly forty dark
> panels in tidy rows on low galvanised frames, roof access hatch and a small
> cable tray visible. Town rooftops and palms in the background. Clear morning
> light, crisp shadows. Elevated three-quarter view. Lower third is empty roof
> deck. Architectural documentary photography.

### Card 3 — 5 kW · Residential · Tirur

> Photorealistic photograph of a rooftop solar array on a two-storey Kerala
> villa with a sloped Mangalore-tile roof. Twelve dark blue panels on slim
> rails following the roof pitch, terracotta ridge line, white parapet detail.
> Lush tropical garden and coconut palms surrounding the house. Warm
> late-afternoon light, soft long shadows. Raised angle from across the garden.
> Lower third is roof tile and shadow. Editorial architectural photography.

### Card 4 — 50 kW · Industrial · Perinthalmanna

> Photorealistic photograph of a large solar array across the corrugated metal
> roof of an industrial shed in Kerala. Long rows of dark panels running toward
> the horizon on a trapezoidal sheet roof, mounting rails clamped to the
> profile. Green hills and palms in the distance. Bright overcast tropical
> light, even soft shadows. High elevated angle looking down the length of the
> roof. Lower third is plain metal roof sheeting. Industrial documentary
> photography, wide angle.

---

## 4. Not needed

- **Team portraits** — you supplied these; a third would replace the monogram.
- **`og.jpg`, `og-square.jpg`, favicons** — generated from the brand mark by
  `npm run og`. Do not replace by hand.

---

## Ship them

```bash
# service images — 4:5
convert generated.png -resize 1000x1250^ -gravity center -extent 1000x1250 \
        -strip -quality 82 -interlace Plane public/services/residential.jpg

# project images — 3:4
convert generated.png -resize 900x1200^ -gravity center -extent 900x1200 \
        -strip -quality 82 -interlace Plane public/projects/manjeri-3kw.jpg
```

Then point `SERVICES[].img` / `PROJECTS[].img` in `site.config.js` at the new
paths, rewrite each `alt` to describe the actual image, and run
`npm run build && npm run seo:check`.

Target under 120 kB per image. The team portraits went 1.9 MB → 23 kB through
the same command with no visible loss.
