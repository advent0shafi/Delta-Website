import React from 'react'
import Calculator from '../components/Calculator'
import Subsidy from '../components/Subsidy'
import Contact from '../components/Contact'

/* Subsidy follows the calculator because the figure the calculator subtracts
   is the one the subsidy section explains. It is not repeated on this page's
   FAQ — that lives on /subsidy/, so the two pages are not near-duplicates. */
export default function CalculatorPage() {
  return (
    <>
      <Calculator headingAs="h1" />
      <Subsidy />
      <Contact />
    </>
  )
}
