"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import SearchBar from "@/components/search-bar"
import { searchProducts } from "@/lib/product-service"
import type { Product } from "@/lib/supabase"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    sortBy: "newest" as "price_asc" | "price_desc" | "newest" | "popular",
  })
  const [showFilters, setShowFilters] = useState(false)

  const productsPerPage = 12

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([])
        setTotalProducts(0)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const { products: searchResults, total } = await searchProducts(query, filters, currentPage, productsPerPage)
        setProducts(searchResults)
        setTotalProducts(total)
      } catch (error) {
        // console.error("Error searching products:", error) - Bu satırı kaldır
      } finally {
        setIsLoading(false)
      }
    }

    fetchSearchResults()
  }, [query, currentPage, filters])

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

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Arama Sonuçları</span>
        </div>

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Arama Sonuçları</h1>
          <p className="text-gray-600">
            {query ? (
              <>
                <span className="font-medium">"{query}"</span> için {totalProducts} sonuç bulundu
              </>
            ) : (
              "Lütfen bir arama sorgusu girin"
            )}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar initialQuery={query} />
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between"
            onClick={() => setShowFilters(!showFilters)}
          >
            <div className="flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filtrele</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters - Desktop and Mobile */}
          <div className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-64 shrink-0`}>
            <div className="bg-white p-4 rounded-lg shadow-card mb-4 md:mb-0">
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
                <p className="text-gray-600 mb-6">
                  {query
                    ? `"${query}" için sonuç bulunamadı. Lütfen farklı anahtar kelimelerle tekrar deneyin.`
                    : "Lütfen bir arama sorgusu girin."}
                </p>
                <Link href="/urunler">
                  <Button>Tüm Ürünleri Gör</Button>
                </Link>
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
