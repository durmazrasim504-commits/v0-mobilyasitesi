"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { getCategories } from "@/lib/product-service"
import type { Category } from "@/lib/supabase"

// Category image mapping
const categoryImages: Record<string, string> = {
  "bahce-oturma-gruplari": "/categories/bahce-oturma-gruplari.jpg",
  "bahce-kose-takimlari": "/categories/bahce-kose-takimlari.jpg",
  "masa-takimlari": "/categories/masa-takimlari.jpg",
  sezlonglar: "/categories/sezlonglar.jpg",
  "luks-oturma-odasi": "/luxury-living-room.png",
  "luks-yemek-odasi": "/luxury-dining-room.png",
  "executive-ofis": "/executive-office-furniture.png",
  "premium-yatak-odasi": "/premium-bedroom-furniture.png",
  "ozel-tasarim": "/custom-furniture-design.png",
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Kategoriler</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Tüm Kategoriler</h1>
          <p className="text-gray-600">Mobilya kategorilerimizi keşfedin ve ihtiyacınıza uygun ürünleri bulun.</p>
        </div>

        {/* Categories Grid - 2x2 on mobile, more on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-40 w-full bg-gray-100">
                <Image
                  src={
                    category.image_url ||
                    categoryImages[category.slug] ||
                    `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(category.name + " furniture")}`
                  }
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <h2 className="font-bold text-center">{category.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
