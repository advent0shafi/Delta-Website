import React from 'react'

/* Two-tone section heading echoing the reference: lead word(s) in ink,
   trailing phrase in muted grey (or green when accent).

   `id` is given to the <h2> so the owning <section> can point at it with
   aria-labelledby — that is what turns an anonymous region into a named
   landmark for screen readers and for the document outline a crawler builds. */
export function SectionHeading({ eyebrow, children, className = '', id }) {
  return (
    <div className={`sh ${className}`}>
      {eyebrow && (
        <span className="eyebrow reveal" data-delay="0">
          {eyebrow}
        </span>
      )}
      <h2 className="headline reveal" data-delay="0.05" id={id}>
        {children}
      </h2>
    </div>
  )
}

export function Button({ as = 'a', variant = 'green', children, arrow, ...rest }) {
  const Tag = as
  return (
    <Tag className={`btn btn--${variant}`} {...rest}>
      {children}
      {arrow && (
        <svg className="arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M3 8h9M8.5 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Tag>
  )
}

/* Minimal stroked icon set — drawn in the Delta geometric style */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const Icons = {
  grid: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" {...S} />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" {...S} />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" {...S} />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" {...S} />
    </svg>
  ),
  home: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" {...S} />
    </svg>
  ),
  factory: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3 21V9l6 4V9l6 4V5h6v16z" {...S} />
      <path d="M7 21v-3M12 21v-3M17 21v-3" {...S} />
    </svg>
  ),
  /* Hybrid = generation (sun) stacked over storage (battery). */
  hybrid: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="6.8" r="3" {...S} />
      <path
        d="M12 1.4v1.4M12 10.8v1.4M6.6 6.8h1.4M16 6.8h1.4M8.2 3l1 1M14.8 9.6l1 1M15.8 3l-1 1M9.2 9.6l-1 1"
        {...S}
      />
      <rect x="3.2" y="15.4" width="15" height="6" rx="1.9" {...S} />
      <path d="M20.6 17.4v2" {...S} />
    </svg>
  ),
  ev: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M3 17V9.5L4.8 5h8.4L15 9.5V17a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-6v1a1 1 0 0 1-1 1H3.5a1 1 0 0 1-.5-1z" {...S} />
      <path d="M3.4 9.5h11.2M6 13h.01M12 13h.01" {...S} />
      <path d="M18 20v-6.6a2 2 0 0 1 2-2 1.6 1.6 0 0 0 1.6-1.6V9.4" {...S} />
      <path d="M20.8 2.8l-1.6 2.5h2.2l-1.6 2.5" {...S} />
    </svg>
  ),
  battery: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="7" width="15" height="10" rx="2" {...S} />
      <path d="M21 10v4M10 9l-2 4h3l-2 4" {...S} />
    </svg>
  ),
  drop: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3z" {...S} />
    </svg>
  ),
  shield: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" {...S} />
      <path d="M9 12l2 2 4-4" {...S} />
    </svg>
  ),
  doc: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M6 3h8l4 4v14H6z" {...S} />
      <path d="M14 3v4h4M9 12h6M9 16h6" {...S} />
    </svg>
  ),
  pin: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z" {...S} />
      <circle cx="12" cy="10" r="2.5" {...S} />
    </svg>
  ),
  star: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M12 3l2.6 5.6 6 .7-4.4 4.1 1.2 6L12 16.8 6.6 19.4l1.2-6L3.4 9.3l6-.7z" {...S} />
    </svg>
  ),
  ruler: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="8" width="18" height="8" rx="1.5" transform="rotate(-2 12 12)" {...S} />
      <path d="M8 8v3M12 8v4M16 8v3" {...S} />
    </svg>
  ),
  rupee: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M7 5h10M7 9h10M7 5c6 0 6 8 0 8h2l6 6" {...S} />
    </svg>
  ),
  wrench: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M15 4a4 4 0 0 0-1 5l-7 7 3 3 7-7a4 4 0 0 0 5-1l-3 1-2-2 1-3z" {...S} />
    </svg>
  ),
  bolt: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M13 3L5 13h6l-1 8 8-10h-6z" {...S} />
    </svg>
  ),
  sun: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <circle cx="12" cy="12" r="4" {...S} />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" {...S} />
    </svg>
  ),
  whatsapp: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path
        d="M12 3a9 9 0 0 0-7.7 13.6L3 21l4.5-1.2A9 9 0 1 0 12 3z"
        {...S}
      />
      <path
        d="M8.5 8.5c-.3 1 .2 2.4 1.4 3.6s2.6 1.7 3.6 1.4c.5-.2.9-.9.9-1.4l-1.6-.8-.9.9c-.6-.3-1.1-.7-1.5-1.1s-.8-.9-1.1-1.5l.9-.9-.8-1.6c-.5 0-1.2.4-1.4.9z"
        {...S}
      />
    </svg>
  ),
  phone: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <path d="M5 4h3l1.5 5-2 1.5a11 11 0 0 0 5 5l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" {...S} />
    </svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" {...S} />
      <path d="M4 7l8 6 8-6" {...S} />
    </svg>
  ),
}
