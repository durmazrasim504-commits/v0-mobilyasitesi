"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getSaleProducts } from "@/lib/product-service"
import type { Product } from "@/lib/supabase"

export default function SaleProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getSaleProducts(12)
        setProducts(productsData)
      } catch (error) {
        // console.error("Error fetching products:", error) - Bu satırı kaldır
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
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
          <span className="text-gray-900 font-medium">Kampanyalı Ürünler</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Kampanyalı Ürünler</h1>
          <p className="text-gray-600">Sınırlı süre için geçerli indirimli ürünlerimizi keşfedin.</p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-bold mb-2">Şu anda kampanyalı ürün bulunmamaktadır</h2>
            <p className="text-gray-600 mb-6">Daha sonra tekrar kontrol etmenizi öneririz.</p>
            <Link href="/">
              <Button>Ana Sayfaya Dön</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
