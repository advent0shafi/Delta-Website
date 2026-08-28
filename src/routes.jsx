import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ROUTES } from '../site.routes'
import { SERVICES } from '../site.config'

import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import SubsidyPage from './pages/SubsidyPage'
import CalculatorPage from './pages/CalculatorPage'
import NetMeteringPage from './pages/NetMeteringPage'
import ProjectsPage from './pages/ProjectsPage'
import ContactPage from './pages/ContactPage'

/* `site.routes.js` holds the metadata the Node build scripts need — they
   cannot import JSX. This file is the browser half: it attaches a component
   to each path, keyed by the same string, so a route can never exist in the
   sitemap without a page behind it (or the reverse). */
const PAGES = {
  '/': Home,
  '/services/': ServicesPage,
  '/subsidy/': SubsidyPage,
  '/savings-calculator/': CalculatorPage,
  '/kseb-net-metering/': NetMeteringPage,
  '/projects/': ProjectsPage,
  '/contact/': ContactPage,
}

/* The five service detail pages are one component parameterised by slug,
   generated from the same SERVICES list the cards and the schema.org Service
   nodes come from. Adding a service to site.config.js gives it a page. */
for (const s of SERVICES) {
  PAGES[`/services/${s.id}/`] = () => <ServiceDetailPage slug={s.id} />
}

/* Fail loudly at module load rather than rendering a blank page in
   production: a typo in either file is a build-time problem, not a
   run-time one. */
const missing = ROUTES.filter((r) => !PAGES[r.path]).map((r) => r.path)
if (missing.length) {
  throw new Error(
    `site.routes.js lists ${missing.join(', ')} with no page in src/routes.jsx`
  )
}

/* And the reverse — a page nothing links to is a page nothing indexes. */
const unlisted = Object.keys(PAGES).filter((p) => !ROUTES.some((r) => r.path === p))
if (unlisted.length) {
  throw new Error(
    `src/routes.jsx defines ${unlisted.join(', ')} with no entry in site.routes.js`
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      {ROUTES.map(({ path }) => {
        const Page = PAGES[path]
        return (
          <React.Fragment key={path}>
            <Route path={path} element={<Page />} />
            {/* Also answer the slash-less form so /subsidy and /subsidy/
                render the same page instead of one of them 404-ing. */}
            {path !== '/' && (
              <Route path={path.replace(/\/$/, '')} element={<Page />} />
            )}
          </React.Fragment>
        )
      })}
      {/* Anything else falls back to the homepage rather than a blank screen. */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
