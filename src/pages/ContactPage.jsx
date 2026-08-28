import React from 'react'
import Contact from '../components/Contact'
import FAQ from '../components/FAQ'
import { CONTACT_FAQS } from '../../content/faqs'

export default function ContactPage() {
  return (
    <>
      <Contact headingAs="h1" />
      <FAQ
        items={CONTACT_FAQS}
        title={['Before you ', 'get in touch.']}
        lead="Everything up to the written quote is free, and none of it commits you to anything."
      />
    </>
  )
}
