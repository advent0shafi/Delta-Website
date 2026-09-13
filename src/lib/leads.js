import { CONTACT, LEADS } from '../../site.config'

/* Sending the contact form to Delta's ERP, and what to do when that fails.

   The endpoint is documented in docs/lead-capture-api.md. The short
   version: POST JSON, 201 means the lead is filed, and every other
   outcome has to be treated as "not filed" — including the ones the
   browser cannot see. An unlisted origin (403) and an unknown or
   disabled key (404) both come back without CORS headers, so `fetch`
   reports them as a network error indistinguishable from the server
   being down. That is why there is no error handling per status code
   here: there is exactly one fallback, and it covers all of them. */

/* Ten digits, because that is what the server wants and what a person
   types. The trap: a real Kerala mobile can itself begin 91, so
   9198765432 is a complete number and stripping "91" from it would
   corrupt a valid lead. Only strip a prefix when the length says it is
   one; anything else goes as typed and the server validates it. */
export function normaliseMobile(raw) {
  const d = String(raw || '').replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) return d.slice(2) // +91 9xxxxxxxxx
  if (d.length === 13 && d.startsWith('091')) return d.slice(3)
  if (d.length === 11 && d.startsWith('0')) return d.slice(1) // 09xxxxxxxxx
  return d
}

/* Which page the enquiry came from, so the ERP can tell a calculator
   lead from a contact-page one. Derived from the path rather than passed
   down as a prop: <Contact /> sits on nine routes and none of them
   should have to remember to label itself. */
export function sourceFromPath(pathname) {
  const seg = String(pathname || '/').replace(/^\/+|\/+$/g, '').split('/')[0]
  if (!seg) return 'home'
  if (seg === 'savings-calculator') return 'calculator'
  return seg.slice(0, 60)
}

export function toPayload(form, loc = window.location) {
  return {
    name: form.name.trim(),
    mobile: normaliseMobile(form.phone),
    town: form.town.trim(),
    bill_range: LEADS.bills[form.bill] || '',
    message: form.message.trim(),
    source: sourceFromPath(loc.pathname),
    page_url: loc.href,
    /* Honeypot. Sent as the server expects; a filled one still answers
       201, so a bot cannot learn that it was caught. */
    leave_blank: form.leave_blank || '',
  }
}

/* Resolves true only on 201. Never throws: a rejected promise here would
   just become the same fallback one frame later. */
export async function submitLead(form) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), LEADS.timeoutMs)
  try {
    const res = await fetch(LEADS.intakeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toPayload(form)),
      signal: ctrl.signal,
    })
    return res.status === 201
  } catch {
    return false
  } finally {
    clearTimeout(timer)
  }
}

/* The fallback. Not a consolation prize: WhatsApp is how this business
   already talks to customers, and a prefilled message is a better lead
   than a form submission nobody reads.

   Returned as a URL for the viewer to tap rather than opened with
   window.open, because by the time the request has failed the click is
   no longer a user gesture and the popup blocker eats it. */
export function whatsappUrl(form) {
  const lines = [
    'Solar enquiry from the Delta website',
    '',
    `Name: ${form.name.trim()}`,
    `Phone: ${form.phone.trim()}`,
  ]
  if (form.town.trim()) lines.push(`Town: ${form.town.trim()}`)
  if (form.bill) lines.push(`Monthly KSEB bill: ${form.bill}`)
  if (form.message.trim()) lines.push('', form.message.trim())
  return `${CONTACT.whatsappHref}?text=${encodeURIComponent(lines.join('\n'))}`
}
