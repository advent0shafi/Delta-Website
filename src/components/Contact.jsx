import React, { useState } from 'react'
import { Button, Icons } from './common'
import { useReveal } from '../lib/useReveal'
import { CONTACT, AREA } from '../../site.config'

const BILLS = ['Under ₹500', '₹500–₹1,000', '₹1,000–₹2,000', '₹2,000–₹5,000', 'Above ₹5,000']

export default function Contact({ headingAs: Heading = 'h2' }) {
  const scope = useReveal()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', town: '', bill: '', message: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    if (!form.name || !form.phone) return
    setSent(true)
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
                {AREA.city}, {AREA.region}
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
          {sent ? (
            <div className="contact__done" role="status">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <circle cx="24" cy="24" r="22" stroke="var(--green)" strokeWidth="2.5" />
                <path d="M15 24.5l6 6 12-13" stroke="var(--green)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3>Thanks, {form.name.split(' ')[0] || 'there'}!</h3>
              <p>We've got your details and will call you back within 24 hours.</p>
              <Button as="button" variant="outline" onClick={() => { setSent(false); setForm({ name: '', phone: '', town: '', bill: '', message: '' }) }}>
                Send another
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
                <input id="c-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder={CONTACT.phoneDisplay} required />
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
              <Button as="button" variant="green" arrow type="submit">
                Request callback
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
