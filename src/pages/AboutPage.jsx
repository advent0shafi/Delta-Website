import React from 'react'
import Prose from '../components/Prose'
import Stats from '../components/Stats'
import Purpose from '../components/Purpose'
import Milestones from '../components/Milestones'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import { ABOUT } from '../../content/about'
import { ABOUT_FAQS } from '../../content/faqs'

/* Two kinds of content share this page. The intro and the <Purpose />
   section are the client's own words and are real. The timeline, team and
   credentials under <Milestones /> are still placeholder — see the header of
   content/about.js. `seo:check` fails while ABOUT.isPlaceholder is true, and
   none of the placeholder material reaches the schema.org graph. */
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
      <Purpose />
      <Milestones />
      <Stats />
      <FAQ items={ABOUT_FAQS} title={['About ', 'working with us.']} />
      <Contact />
    </>
  )
}
