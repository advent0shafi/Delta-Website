# Lead capture API — parked, 2026-09-13

Status: **not being built yet.** Recorded here so the requirement and the
reasoning survive until it is picked up.

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
