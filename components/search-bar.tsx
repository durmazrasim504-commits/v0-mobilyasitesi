"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  className?: string
  placeholder?: string
  onSearch?: (query: string) => void
  variant?: "default" | "mobile" | "header"
  initialQuery?: string
}

export default function SearchBar({
  className = "",
  placeholder = "Ürün ara...",
  onSearch,
  variant = "default",
  initialQuery = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query)
      } else {
        router.push(`/arama?q=${encodeURIComponent(query)}`)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={`pr-10 border-gray-200 focus:border-primary focus:ring-primary ${
          variant === "default" ? "rounded-full" : ""
        } ${variant === "header" ? "bg-gray-50 hover:bg-gray-100 focus:bg-white" : ""}`}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-full rounded-full hover:bg-primary hover:text-white"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Ara</span>
      </Button>
    </form>
  )
}
