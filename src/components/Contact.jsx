import React, { useState } from 'react'
import { Button, Icons } from './common'
import { useReveal } from '../lib/useReveal'

const BILLS = ['Under ₹500', '₹500–₹1,000', '₹1,000–₹2,000', '₹2,000–₹5,000', 'Above ₹5,000']

export default function Contact() {
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
    <section id="contact" className="section contact" ref={scope}>
      <div className="container contact__grid">
        <div className="contact__copy reveal">
          <span className="eyebrow">Get a free quote</span>
          <h2 className="headline">
            Ready to cut your <span className="soft">KSEB bill?</span>
          </h2>
          <p className="lead">
            Tell us a little about your home or business and we'll get back to you within 24 hours.
          </p>

          <ul className="contact__details">
            <li><span><Icons.pin width="18" height="18" /></span>Malappuram, Kerala</li>
            <li><a href="tel:+910000000000"><span><Icons.phone width="18" height="18" /></span>+91 XXXXX XXXXX</a></li>
            <li><a href="https://wa.me/910000000000"><span><Icons.whatsapp width="18" height="18" /></span>WhatsApp: +91 XXXXX XXXXX</a></li>
            <li><a href="mailto:hello@deltaenergy.in"><span><Icons.mail width="18" height="18" /></span>hello@deltaenergy.in</a></li>
          </ul>
          <p className="contact__hours">Mon–Sat · 9 am – 6 pm</p>
        </div>

        <div className="contact__form-wrap reveal" data-delay="0.1">
          {sent ? (
            <div className="contact__done">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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
            <form className="contact__form" onSubmit={submit}>
              <div className="contact__field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" value={form.name} onChange={set('name')} placeholder="Your full name" required />
              </div>
              <div className="contact__field">
                <label htmlFor="c-phone">Phone number</label>
                <input id="c-phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" required />
              </div>
              <div className="contact__field">
                <label htmlFor="c-town">Town / Location</label>
                <input id="c-town" value={form.town} onChange={set('town')} placeholder="e.g. Manjeri" />
              </div>
              <div className="contact__field">
                <label htmlFor="c-bill">Average monthly KSEB bill</label>
                <select id="c-bill" value={form.bill} onChange={set('bill')}>
                  <option value="">Select a range</option>
                  {BILLS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="contact__field contact__field--full">
                <label htmlFor="c-msg">Message <em>(optional)</em></label>
                <textarea id="c-msg" rows="3" value={form.message} onChange={set('message')} placeholder="Anything we should know about your roof or usage?" />
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
