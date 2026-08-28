import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const container = document.getElementById('root')
const tree = (
  <React.StrictMode>
    {/* The server half of this pair is StaticRouter in scripts/prerender.mjs,
        which pins the location to the route being written. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
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
