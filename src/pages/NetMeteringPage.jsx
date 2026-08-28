import React from 'react'
import Prose, { Reviewed } from '../components/Prose'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import {
  NET_METERING_SECTIONS,
  NET_METERING_INTRO,
  NET_METERING_REVIEWED,
} from '../../content/netmetering'
import { NET_METERING_FAQS } from '../../content/faqs'

export default function NetMeteringPage() {
  return (
    <>
      <Prose
        id="net-metering"
        eyebrow="KSEB net metering"
        headingAs="h1"
        title={['How net metering ', 'works in Kerala.']}
        intro={NET_METERING_INTRO}
        blocks={NET_METERING_SECTIONS}
      >
        <Reviewed
          date={NET_METERING_REVIEWED}
          note="Kerala's net-metering framework is being revised, so capacity limits and settlement rates are deliberately not quoted here. Check the KSEB portal, or ask us, for the position on the day you apply."
        />
      </Prose>
      <FAQ
        items={NET_METERING_FAQS}
        title={['Net metering ', 'questions.']}
        lead="The things people ask once they understand the bill will not simply go to zero."
      />
      <Contact />
    </>
  )
}
