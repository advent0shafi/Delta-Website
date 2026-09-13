import React, { useState } from 'react'
import { Button, Icons } from './common'
import { useReveal } from '../lib/useReveal'
import { submitLead, whatsappUrl } from '../lib/leads'
import { CONTACT, AREA, LEADS } from '../../site.config'

/* The labels are the keys of LEADS.bills, so the list shown and the list
   the API accepts are the same list. Adding a band in site.config.js adds
   it here; there is no second place to forget. */
const BILLS = Object.keys(LEADS.bills)

const EMPTY = { name: '', phone: '', town: '', bill: '', message: '', leave_blank: '' }

export default function Contact({ headingAs: Heading = 'h2' }) {
  const scope = useReveal()
  /* idle -> sending -> sent, or -> handoff when the API did not take it. */
  const [status, setStatus] = useState('idle')
  const [form, setForm] = useState(EMPTY)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const reset = () => { setStatus('idle'); setForm(EMPTY) }

  const submit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (!form.name.trim() || !form.phone.trim()) return
    setStatus('sending')
    /* One branch, deliberately. A rejected origin, an unknown key and a
       dead server all reach the browser as the same opaque failure, so
       there is nothing to tell apart — either the lead is filed or it
       goes to WhatsApp. */
    setStatus((await submitLead(form)) ? 'sent' : 'handoff')
  }

  return (
    <section id="contact" className="section contact" ref={scope} aria-labelledby="contact-title">
      <div className="container contact__grid">
        <div className="contact__copy reveal">
          <span className="eyebrow">Get a free quote</span>
          <Heading className="headline" id="contact-title">
            Ready to cut your <span className="soft">KSEB bill?</span>
          </Heading>
          <p className="lead">
            Tell us a little about your home or business and we'll get back to you within 24 hours.
          </p>

          <address className="contact__address">
            <ul className="contact__details">
              <li>
                <span aria-hidden="true"><Icons.pin width="18" height="18" /></span>
                {CONTACT.mapUrl ? (
                  <a href={CONTACT.mapUrl} target="_blank" rel="noopener noreferrer">
                    {CONTACT.streetAddress}, {AREA.city}, {AREA.region} {CONTACT.postalCode}
                    <span className="ext" aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <>
                    {CONTACT.streetAddress}, {AREA.city}, {AREA.region} {CONTACT.postalCode}
                  </>
                )}
              </li>
              <li>
                <a href={CONTACT.phoneHref}>
                  <span aria-hidden="true"><Icons.phone width="18" height="18" /></span>
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={CONTACT.whatsappHref} rel="noopener">
                  <span aria-hidden="true"><Icons.whatsapp width="18" height="18" /></span>
                  WhatsApp: {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT.email}`}>
                  <span aria-hidden="true"><Icons.mail width="18" height="18" /></span>
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </address>
          <p className="contact__hours">{CONTACT.hoursDisplay}</p>
        </div>

        <div className="contact__form-wrap reveal" data-delay="0.1">
          {status === 'sent' ? (
            <div className="contact__done" role="status">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <circle cx="24" cy="24" r="22" stroke="var(--green)" strokeWidth="2.5" />
                <path d="M15 24.5l6 6 12-13" stroke="var(--green)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>Thanks, {form.name.split(' ')[0] || 'there'}!</h3>
              <p>We've got your details and will call you back within 24 hours.</p>
              <Button as="button" variant="outline" onClick={reset}>
                Send another
              </Button>
            </div>
          ) : status === 'handoff' ? (
            /* Honest about what happened, and one tap from not losing the
               enquiry. The link is tapped rather than opened for them: by
               now the original click is spent and a popup blocker would
               swallow window.open. */
            <div className="contact__done" role="status">
              <span className="contact__done-icon" aria-hidden="true">
                <Icons.whatsapp width="48" height="48" />
              </span>
              <h3>Nearly there</h3>
              <p>
                That didn't go through just now. Send the same details on WhatsApp instead — they're
                already filled in, you only need to press send.
              </p>
              <Button as="a" variant="green" arrow href={whatsappUrl(form)} target="_blank" rel="noopener">
                Send on WhatsApp
              </Button>
              <Button as="button" variant="outline" onClick={reset}>
                Start over
              </Button>
            </div>
          ) : (
            <form className="contact__form" onSubmit={submit} aria-labelledby="contact-title">
              <div className="contact__field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" name="name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Your full name" required />
              </div>
              <div className="contact__field">
                <label htmlFor="c-phone">Phone number</label>
                <input id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile number" required />
              </div>
              <div className="contact__field">
                <label htmlFor="c-town">Town / Location</label>
                <input id="c-town" name="town" autoComplete="address-level2" value={form.town} onChange={set('town')} placeholder="e.g. Manjeri" />
              </div>
              <div className="contact__field">
                <label htmlFor="c-bill">Average monthly KSEB bill</label>
                <select id="c-bill" name="bill" value={form.bill} onChange={set('bill')}>
                  <option value="">Select a range</option>
                  {BILLS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="contact__field contact__field--full">
                <label htmlFor="c-msg">Message <em>(optional)</em></label>
                <textarea id="c-msg" name="message" rows="3" value={form.message} onChange={set('message')} placeholder="Anything we should know about your roof or usage?" />
              </div>

              {/* Honeypot. Off-screen rather than display:none, which bots
                  check for, and named leave_blank rather than something
                  like "company" that a browser would helpfully autofill —
                  which would flag real people as bots. */}
              <div className="contact__trap" aria-hidden="true">
                <label htmlFor="c-lb">Leave this field empty</label>
                <input id="c-lb" name="leave_blank" type="text" tabIndex={-1} autoComplete="off" value={form.leave_blank} onChange={set('leave_blank')} />
              </div>

              <Button as="button" variant="green" arrow type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Request callback'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
