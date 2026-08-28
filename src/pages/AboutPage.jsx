import React from 'react'
import Prose from '../components/Prose'
import Stats from '../components/Stats'
import Milestones from '../components/Milestones'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import { ABOUT } from '../../content/about'
import { ABOUT_FAQS } from '../../content/faqs'

/* Every specific on this page is placeholder — see the header of
   content/about.js. It renders so the layout can be reviewed; `seo:check`
   fails while ABOUT.isPlaceholder is true, and none of it reaches the
   schema.org graph. */
export default function AboutPage() {
  return (
    <>
      <Prose
        id="about"
        eyebrow="About Delta"
        headingAs="h1"
        title={['Rooftop solar, ', 'and the paperwork with it.']}
        intro={ABOUT.intro}
        blocks={ABOUT.story}
      />
      <Milestones />
      <Stats />
      <FAQ items={ABOUT_FAQS} title={['About ', 'working with us.']} />
      <Contact />
    </>
  )
}
