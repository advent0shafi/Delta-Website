# Lessons

Patterns worth not relearning. Newest first.

---

## Check what the *build output* contains, not the source

The site had careful `<meta>` tags, a canonical URL, Open Graph, Twitter cards
and a JSON-LD block — all attached to a document whose entire body was
`<div id="root"></div>`. Everything looked right in `index.html` and in the
browser. Nothing was right in what a crawler received.

**Rule:** for any SEO, crawling or share-preview question, the first command is
against `dist/`, not `src/`:

```bash
npm run build && sed -n '/<body>/,/<\/html>/p' dist/index.html
curl -s -A "GPTBot/1.1" <url> | wc -c
```

If the answer is "an empty div", stop and fix that first — every other SEO
change is decoration until it is.

---

## "Renders in the browser" is not "is on the page"

Googlebot renders JavaScript, so a CSR SPA can look fine in Search Console and
still be invisible to everything else. GPTBot, OAI-SearchBot, ClaudeBot,
PerplexityBot, Google-Extended, CCBot and every social scraper
(facebookexternalhit, WhatsApp, Twitterbot, LinkedInBot, Slackbot) do not run
JavaScript at all.

**Rule:** name the specific client before claiming a page is crawlable.
"Google can see it" and "crawlers can see it" are different statements.

---

## Verify schema.org types against schema.org

`"@type": "SolarPanelInstaller"` reads perfectly and is not a real type. An
unrecognised `@type` makes the whole node worthless, and it fails **silently** —
no warning, no error, the rich result just never appears. This one had been
sitting in `index.html` since the initial commit.

**Rule:** every `@type` gets checked against the actual vocabulary before it
ships. `scripts/seo-check.mjs` now keeps a list of the plausible-sounding fakes
so this specific one cannot come back.

---

## Absent data beats invented data

The JSON-LD published `"telephone": "+91-00000-00000"` — a fabricated phone
number, asserted as fact about a real business, to a machine-readable index.

**Rule:** when a field is not known yet, omit it. A missing `telephone` is
missing data; a fake one is a wrong fact. Gate it explicitly
(`CONTACT.isPlaceholder`) rather than hoping someone remembers.

---

## Animation start-states leak into the DOM

`Stats.jsx` rendered `₹0`, `0%`, `0+` because those were the count-up's
*starting* values. Anything reading the DOM before a scroll — a prerender, a
rendering crawler that does not scroll — read zeros as the content.

**Rule:** render the true final value in markup and let the animation reset it
at `onStart`, i.e. the moment it actually begins. Never let an animation's
initial frame be the only thing in the source.

The same idea applies to `.reveal { opacity: 0 }`: content that only becomes
visible on scroll is content a non-scrolling renderer may never see.

---

## Pair the right SSR call with the right client call

`renderToStaticMarkup` + `hydrateRoot` produces mismatch warnings, because the
static variant strips the `<!-- -->` separators React puts between adjacent
text nodes — so `{year} {name}, {city}` merges into one text node and
hydration disagrees. `renderToString` keeps them.

**Rule:** `renderToString` ↔ `hydrateRoot`; `renderToStaticMarkup` ↔ no
hydration at all.

---

## Make the build fail on warnings you would otherwise scroll past

`scripts/prerender.mjs` captures `console.error` during render and exits
non-zero. It caught a real bug on its first run: `fetchPriority` is the React
19 spelling and React 18 silently drops it.

**Rule:** a warning during server render usually means a client bug is coming.
Gate it rather than printing it.

---

## Style headings by class, never by tag

`.subsidy2__step h4` and `.footer__col h4` meant the heading *level* — a
document-structure decision — was pinned by a *visual* rule. Fixing the outline
required touching CSS.

**Rule:** pick the heading level the outline needs, then style it with a class.
Never pick a tag for its default size.

---

## Two consumers of the same fact will drift

The FAQ answers existed in `FAQ.jsx`; the phone number existed in
`Contact.jsx`, `Footer.jsx` and the JSON-LD. That is how the markup ended up
advertising a phone number nobody had noticed was fake.

**Rule:** when a fact has to appear in both the page and a machine-readable
file, it gets one home (`site.config.js`) that both import. Then add a check
that asserts they still agree.

---

## Look at generated images before shipping them

Two defects that only showed up on inspection:

- The OG card's logo rendered stretched ~4×. `.inner` is a column flexbox, so
  `align-items: stretch` overrode `width: auto` on the `<img>`. Fixed with
  `align-self: flex-start`.
- The first favicon leaked the "E" of the wordmark. Offsetting a background
  image does not crop it — everything outside the intended box keeps painting.
  It needs a clipping element sized to the crop.

**Rule:** render it, open it, look at it. Dimensions being correct says nothing
about the image being right.

---

## Read the placeholder assets, do not assume they are neutral

`public/og.jpg` was a stock photo of **wind turbines** — for a solar company,
on every WhatsApp share. `public/hero.mp4` is wind turbines too. Both had been
there since the initial commit and neither was mentioned as a problem.

**Rule:** open the images. A placeholder that is merely generic is fine; one
that shows the wrong industry is a content bug.

---

## Check README claims against the code while you are in there

The README described the fonts as Bricolage Grotesque + Inter; the site uses
Switzer. It still said "4 services" after commit `1dd0b74` changed it to 5.

**Rule:** docs drift silently. When touching a file the README describes,
re-read what it claims.
