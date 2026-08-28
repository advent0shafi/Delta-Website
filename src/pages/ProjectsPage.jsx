import React from 'react'
import Projects from '../components/Projects'
import Stats from '../components/Stats'
import Contact from '../components/Contact'

export default function ProjectsPage() {
  return (
    <>
      <Projects headingAs="h1" />
      <Stats />
      <Contact />
    </>
  )
}
