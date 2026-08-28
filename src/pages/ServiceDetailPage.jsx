import React from 'react'
import { useParams } from 'react-router-dom'
import Prose, { Suits } from '../components/Prose'
import FAQ from '../components/FAQ'
import Contact from '../components/Contact'
import { SERVICE_DETAIL } from '../../content/services'
import { SERVICE_FAQS } from '../../content/faqs'
import { SERVICES } from '../../site.config'

/* One component for all five service pages. The slug is SERVICES[].id, so a
   service can never exist in the grid without a page behind it — or the
   reverse — and the schema.org Service node points at the same URL. */
export default function ServiceDetailPage({ slug }) {
  const params = useParams()
  const id = slug || params.slug
  const detail = SERVICE_DETAIL[id]
  const service = SERVICES.find((s) => s.id === id)

  /* Should be unreachable: routes are generated from this same list. */
  if (!detail || !service) return null

  return (
    <>
      <Prose
        id={`service-${id}`}
        eyebrow={detail.eyebrow}
        headingAs="h1"
        title={detail.h1}
        intro={detail.intro}
        blocks={detail.sections.map((s) => ({ ...s, id: `${id}-${s.id}` }))}
      >
        <Suits title={detail.suits.title} items={detail.suits.items} headingAs="h1" />
      </Prose>
      <FAQ
        items={SERVICE_FAQS[id]}
        title={[`${detail.eyebrow} `, 'questions.']}
      />
      <Contact />
    </>
  )
}
