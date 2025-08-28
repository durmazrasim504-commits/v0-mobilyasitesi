"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getCategories } from "@/lib/product-service"
import type { Category } from "@/lib/supabase"

export default function CategoriesMenu({ mobileView = false }: { mobileView?: boolean }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to load categories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <div className="animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded mb-2"></div>
        ))}
      </div>
    )
  }

  return (
    <div className={mobileView ? "space-y-2" : "space-y-1"}>
      <h3 className={mobileView ? "font-semibold text-lg mb-2" : "font-semibold"}>Kategoriler</h3>
      <ul className="space-y-1">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/kategori/${category.slug}`}
              className={`hover:text-primary transition-colors ${
                mobileView ? "block py-2 border-b border-gray-100" : ""
              }`}
            >
              {category.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
