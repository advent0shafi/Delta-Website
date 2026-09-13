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

The reply, when it arrives, belongs in this file.

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
