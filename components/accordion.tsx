"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const Accordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b">
      <button
        className="flex justify-between items-center w-full py-3 text-left font-medium"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">{title}</div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <div className={`accordion-content ${isOpen ? "open" : ""}`}>
        <div className="pb-4">{children}</div>
      </div>
    </div>
  )
}

export default Accordion
