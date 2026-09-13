# Lead capture API — contract agreed, 2026-09-13

Status: **the endpoint is live on production** (deployed 13 September 2026
with the owner's approval in the Delta-MVP session; verified from outside:
unknown key → 404, text/plain → 415, oversized body → 413, GET → 405, no
CORS header for an unknown key; apex, app, api and office all still 200).
**Delta has no key yet and nothing is wired on this site.** Two things
remain, in order:

1. The owner signs in to Delta's organisation in the ERP → Settings →
   Website leads → Add website `https://deltaenergysolution.com`, adding
   `https://www.deltaenergysolution.com` as a second address. That produces
   the key and the exact intake URL.
2. With the owner's go here, wire the form as described below.

Limits per website: 10 submissions an hour, 30 overall per hour across
addresses, nginx 30/min with a burst of 20, a default daily cap of 200
(adjustable in Settings). Repeat submissions from the same mobile within
24 hours merge into one lead. Test with real ten-digit mobiles.

Correction from the ERP side: a 404 for an unknown or disabled key is also
opaque to `fetch` (no CORS header without a matching website). The
WhatsApp fallback covers it.

## The agreed contract

- `POST https://api.deltaenergysolution.com/api/v2/intake/<key>/` — exact
  path, trailing slash. `<key>` is a publishable per-website key
  (`lk_` + 32 chars) created in the ERP under Settings → Website leads. It
  is public by design; it will live in this site's bundle.
- Body: `application/json` (our case, via `fetch`) or
  `application/x-www-form-urlencoded` (plain forms). Multipart → 415. Max
  16 KB.
- Public fields, fixed: `name` (required, ≤120) · `mobile` (required;
  10-digit Indian mobile; `+91`/`91`/`0` prefixes and spaces accepted) ·
  `email` (optional) · `town` (optional, ≤120) · `bill_range` (optional,
  one of the keys below; empty or missing = not given; unknown → 422) ·
  `message` (optional, ≤2000) · `page_url` (optional) · `source`
  (optional, ≤60, free text: `contact`, `calculator`, `home`) ·
  `leave_blank` (honeypot; keep empty, hidden off-screen, `tabindex=-1`,
  `autocomplete=off`; never name a honeypot "website" or "company"). Unknown
  fields ignored.
- `bill_range` keys ↔ our labels: `under_500` "Under ₹500" · `500_1000`
  "₹500–₹1,000" · `1000_2000` "₹1,000–₹2,000" · `2000_5000`
  "₹2,000–₹5,000" · `over_5000` "Above ₹5,000".
- Responses: `201 {"ok": true}` (also for a honeypot hit, so bots learn
  nothing) · `422 {"detail","errors"}` · `403` origin not on the key's
  list · `429` throttled or daily cap, immediate, no tarpit · `404`
  unknown or disabled key. Plain-form posts get a 303 to a per-key
  thank-you URL.
- CORS: `Access-Control-Allow-Origin` for the origins listed on the key
  (apex and www both listed), on every Django response including errors.
  Two cases stay opaque to `fetch` by design: a 403 for an unlisted
  origin, and a 429 from nginx's `limit_req` burst guard, which answers
  before Django.

## What this site will do when wired

- Map our form fields: `name`→`name`, `phone`→`mobile` (stripped to ten
  digits), `town`→`town`, `bill` label→`bill_range` key,
  `message`→`message`; add `page_url` from `location.href`, `source` per
  CTA, `leave_blank` empty.
- On `201`: the existing success state. On anything else, including an
  opaque network error: open WhatsApp with the same fields prefilled, so
  a rate limit or an outage never loses the lead.
- Track `quote` (API success) and `whatsapp` (fallback or direct tap) as
  analytics events.

Prerequisite ERP security fixes (spoofable-IP throttle, shared sign-in
bucket, sliding window, a 91-prefix validation bug) were reported as
merging and deploying on 13 September 2026.

---

## The original requirement (kept for the record)

## The requirement, in the owner's words

> Lead capture from the website using REST API, for new client onboarding,
> not for admin, but for each ERP customer who can just add their website
> for leads.

## What that means

A multi-tenant public lead-intake API inside the ERP (Delta-MVP). Each ERP
customer — a tenant, not an administrator — gets a way to connect their own
website's contact form to their own ERP account. Enquiries submitted on that
website land as lead records in that tenant's workspace, with no admin
involvement at any step.

Delta's marketing site at `deltaenergysolution.com` would be the first
consumer. Its form collects: name, phone, town, monthly KSEB bill range,
optional message. Today it collects them and discards them.

## What was asked of the Delta-MVP session

A feasibility study from the ERP repository only, no implementation:

- whether the current data model has a tenant boundary this can attach to
- how a tenant authenticates a public form: per-tenant public key, origin
  allowlist, or a hosted form endpoint
- CORS for third-party origins such as the apex domain
- spam handling and rate limiting
- what a lead record looks like and where it surfaces in the ERP UI
- whether the existing Django backend at `api.deltaenergysolution.com` can
  host it
- a rough effort estimate, and any reason it should not be built

### The study (Delta-MVP session, 2026-09-13)

**Verdict: buildable, but nothing existing fits, and one real blocker must
be fixed first. Rough effort 11 to 14 days; a Delta-only version with one
configured org and no key-management UI is about half.**

Two security findings that stand on their own, unrelated to leads, and
which the ERP session confirmed by reading the code:

1. **The IP rate limit can be bypassed by anyone.** nginx appends to the
   client-supplied `X-Forwarded-For`; the throttle reads the *first* entry,
   which is whatever the client sent; the trustworthy `X-Real-IP` is never
   read. A different fake header per request defeats both the demo-form
   throttle and the sign-in throttle. Every new public write path widens
   this. Fix first.
2. **Anyone can lock every user out of browser sign-in.** The Next.js login
   handler calls the API without forwarding the client IP, so all browser
   sign-ins share one throttle bucket. Ten failures in fifteen minutes and
   correct passwords are refused too. Belongs in the same fix.

Other reasons to pause: Delta is not a tenant in the ERP (the owner is a
superuser with no organisation), so the first consumer needs one created;
a publishable key is public by nature and there is no captcha, so
throttling is the only defence against spam and strangers' phone numbers;
the ERP has no email, SMS, WhatsApp or webhook capability, so a lead sits
in a list until someone looks; the tenant becomes data controller for
enquiries collected on their own site, and the privacy page already
promises a deletion that no code performs; and demand is unproven.

What exists: `Organization` is the tenant boundary and a new org-scoped
`Lead` model fits it cleanly. The existing public demo-request path is
docsun's own sales funnel, not tenant-scoped, and should not be reused.
Per-user API tokens are stored in plaintext and count toward device limits,
so they cannot serve as website keys. CORS is env-configured and can be
extended per tenant, but only as defence in depth: it does not stop curl or
a plain form post.

Design sketch from the study: a `LeadSource` per tenant with a random
publishable key, allowed origins and rotation, managed in a Settings tab;
`POST /api/v2/leads/intake/<key>/` accepting JSON and plain form posts;
honeypot, org active-and-paid check, per-key and per-real-IP throttle,
daily cap; a Lead record with name, phone, town, bill range, message,
status, and conversion into onboarding without burning a customer code;
`limit_req` on the intake path in nginx.

## Interim state of the marketing site's form

`src/components/Contact.jsx` validates two fields, sets a flag, and shows
"We've got your details and will call you back within 24 hours." Nothing is
sent anywhere. Every quote request submitted on the live site is lost until
one of these happens:

- **WhatsApp handoff** (about an hour): on submit, open `wa.me` with the
  fields prefilled. No backend, no CORS, works on any host, lands in the
  channel Delta already answers on. Can coexist with the API later.
- **The API above** lands, and the form posts to it.
- **A third-party form service** (Formspree, Web3Forms) as a stopgap.

The owner chose to leave this as it stands for now.

## Related

- `docs/deploy.md` — how the site is hosted and why the ERP's nginx is the
  only thing it shares with the ERP.
- The ERP's own public landing page at `app.deltaenergysolution.com` has a
  solar savings calculator and is indexed; it will compete with the
  marketing site in search until one of them stops being indexed or
  redirects. Also unresolved.
