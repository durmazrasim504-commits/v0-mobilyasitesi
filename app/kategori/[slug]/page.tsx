"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getProducts, getCategoryBySlug } from "@/lib/product-service"
import type { Product, Category } from "@/lib/supabase"

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    sortBy: "newest" as "price_asc" | "price_desc" | "newest" | "popular",
  })

  const productsPerPage = 12

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // First fetch category by slug
        const categoryData = await getCategoryBySlug(params.slug)
        setCategory(categoryData)

        if (categoryData && categoryData.id) {
          // Now use the category ID (which is a number) to fetch products
          const { products: productsData, total } = await getProducts(
            categoryData.id, // Pass the category ID as a number, not the slug
            filters,
            currentPage,
            productsPerPage,
          )
          setProducts(productsData)
          setTotalProducts(total)
        } else {
          // Handle case where category doesn't exist
          setProducts([])
          setTotalProducts(0)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setProducts([])
        setTotalProducts(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.slug, currentPage, filters])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!category) {
    return (
      <div className="container-custom py-10">
        <h1 className="text-2xl font-bold mb-4">Kategori bulunamadı</h1>
        <p className="mb-4">Aradığınız kategori bulunamadı veya kaldırılmış olabilir.</p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="container-custom">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{category.name}</span>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{category.name}</h1>
          <p className="text-gray-600">{category.description}</p>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Button variant="outline" className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filtrele</span>
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 shrink-0">
            <div className="bg-white p-4 rounded-lg shadow-card">
              <h2 className="font-bold text-lg mb-4">Filtreler</h2>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Fiyat Aralığı</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={filters.minPrice === 0 && filters.maxPrice === 5000}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange({ minPrice: 0, maxPrice: 5000 })
                        } else if (filters.minPrice === 0 && filters.maxPrice === 5000) {
                          handleFilterChange({ minPrice: undefined, maxPrice: undefined })
                        }
                      }}
                    />
                    <span>0 - 5.000 ₺</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={filters.minPrice === 5000 && filters.maxPrice === 10000}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange({ minPrice: 5000, maxPrice: 10000 })
                        } else if (filters.minPrice === 5000 && filters.maxPrice === 10000) {
                          handleFilterChange({ minPrice: undefined, maxPrice: undefined })
                        }
                      }}
                    />
                    <span>5.000 - 10.000 ₺</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={filters.minPrice === 10000 && filters.maxPrice === 20000}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange({ minPrice: 10000, maxPrice: 20000 })
                        } else if (filters.minPrice === 10000 && filters.maxPrice === 20000) {
                          handleFilterChange({ minPrice: undefined, maxPrice: undefined })
                        }
                      }}
                    />
                    <span>10.000 - 20.000 ₺</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary mr-2"
                      checked={filters.minPrice === 20000 && filters.maxPrice === undefined}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleFilterChange({ minPrice: 20000, maxPrice: undefined })
                        } else if (filters.minPrice === 20000 && filters.maxPrice === undefined) {
                          handleFilterChange({ minPrice: undefined, maxPrice: undefined })
                        }
                      }}
                    />
                    <span>20.000 ₺ ve üzeri</span>
                  </label>
                </div>
              </div>

              {/* Apply Filters Button */}
              <Button className="w-full" onClick={() => setCurrentPage(1)}>
                Filtrele
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500">{totalProducts} ürün bulundu</p>
              <select
                className="border rounded p-2 text-sm"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              >
                <option value="newest">Önerilen Sıralama</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                <option value="popular">En Çok Satanlar</option>
              </select>
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-bold mb-2">Ürün bulunamadı</h2>
                <p className="text-gray-600 mb-6">Seçtiğiniz filtrelere uygun ürün bulunamadı.</p>
                <Button
                  onClick={() =>
                    handleFilterChange({
                      minPrice: undefined,
                      maxPrice: undefined,
                      sortBy: "newest",
                    })
                  }
                >
                  Filtreleri Temizle
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    <ChevronDown className="h-4 w-4 rotate-90" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}

                  <Button
                    variant="outline"
                    size="icon"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    <ChevronDown className="h-4 w-4 -rotate-90" />
                  </Button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
