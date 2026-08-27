import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')
const tree = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

/* Production builds run `scripts/prerender.mjs`, so #root already holds the
   full page and React only has to adopt it — no blank flash, no second paint.
   The dev server serves the empty shell, so fall back to a fresh render. */
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
