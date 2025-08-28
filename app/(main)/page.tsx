"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import HeroCarouselDynamic from "@/components/hero-carousel-dynamic"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts, getSaleProducts, getCategories } from "@/lib/product-service"
import type { Product, Category } from "@/lib/supabase"
import { Loader2, ArrowRight } from "lucide-react"

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

// Fallback categories in case Supabase is not available
const fallbackCategories = [
  {
    id: 1,
    name: "Bahçe Oturma Grupları",
    slug: "bahce-oturma-gruplari",
    image_url: "/categories/bahce-oturma-gruplari.jpg",
  },
  {
    id: 2,
    name: "Bahçe Köşe Takımları",
    slug: "bahce-kose-takimlari",
    image_url: "/categories/bahce-kose-takimlari.jpg",
  },
  {
    id: 3,
    name: "Masa Takımları",
    slug: "masa-takimlari",
    image_url: "/categories/masa-takimlari.jpg",
  },
  {
    id: 4,
    name: "Şezlonglar",
    slug: "sezlonglar",
    image_url: "/categories/sezlonglar.jpg",
  },
  {
    id: 5,
    name: "Sandalyeler",
    slug: "sandalyeler",
    image_url: "/categories/sandalyeler.png",
  },
]

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch categories
        let categoriesData = []
        try {
          categoriesData = await getCategories()
        } catch (error) {
          console.error("Error fetching categories:", error)
          categoriesData = fallbackCategories // Use fallback categories if fetch fails
        }

        // Add image URLs to categories if they don't have one
        const categoriesWithImages = categoriesData.map((category) => {
          if (!category?.image_url) {
            return {
              ...category,
              image_url:
                categoryImages[category?.slug] ||
                `/placeholder.svg?height=300&width=300&query=${encodeURIComponent((category?.name || "furniture") + " furniture")}`,
            }
          }
          return category
        })

        setCategories(categoriesWithImages)

        // Fetch featured products (newest products)
        try {
          const featured = await getFeaturedProducts(4)
          setFeaturedProducts(featured)
        } catch (error) {
          console.error("Error fetching featured products:", error)
          // Use empty array if fetch fails
          setFeaturedProducts([])
        }

        // Fetch sale products
        try {
          const sale = await getSaleProducts(4)
          setSaleProducts(sale)
        } catch (error) {
          console.error("Error fetching sale products:", error)
          // Use empty array if fetch fails
          setSaleProducts([])
        }
      } catch (error) {
        console.error("Error in fetchData:", error)
        setError("Veri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
      </div>
    )
  }

  return (
    <div>
      <HeroCarouselDynamic />

      {/* Kategoriler - Smaller and at the top */}
      <section className="py-10 bg-gradient-to-b from-white to-primary-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Kategoriler</h2>
            <Link href="/kategoriler" className="text-primary hover:underline flex items-center">
              Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((category) => (
              <Link
                key={category.slug}
                href={`/kategori/${category.slug}`}
                className="group relative overflow-hidden rounded-lg h-28 flex items-center justify-center"
              >
                <Image
                  src={
                    category.image_url ||
                    `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(category.name + " furniture") || "/placeholder.svg"}`
                  }
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 group-hover:from-black/70 transition-all duration-300"></div>
                <h3 className="relative z-10 text-white text-center font-medium px-2 transform group-hover:scale-105 transition-transform duration-300">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Kampanyalı Ürünler */}
      <section className="py-12 bg-primary-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Kampanyalı Ürünler</h2>
            <Link href="/kampanyali-urunler" className="text-primary hover:underline flex items-center">
              Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {saleProducts.length > 0 ? (
              saleProducts.map((product) => <ProductCard key={product.id} product={product} showQuickActions={true} />)
            ) : (
              <p className="col-span-full text-center py-8">Kampanyalı ürün bulunamadı.</p>
            )}
          </div>
        </div>
      </section>

      {/* Öne Çıkan Ürünler */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Öne Çıkan Ürünler</h2>
            <Link href="/urunler" className="text-primary hover:underline flex items-center">
              Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showQuickActions={true} />
              ))
            ) : (
              <p className="col-span-full text-center py-8">Öne çıkan ürün bulunamadı.</p>
            )}
          </div>
        </div>
      </section>

      {/* Bilgi Bölümü */}
      <section className="py-12 bg-gradient-to-b from-white to-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="bg-primary-50 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Kaliteli Ürünler</h3>
              <p className="text-gray-600">En kaliteli malzemelerden üretilen dayanıklı bahçe mobilyaları</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="bg-primary-50 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Ücretsiz Kargo</h3>
              <p className="text-gray-600">5000 TL ve üzeri siparişlerde Türkiye'nin her yerine ücretsiz kargo</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 text-center">
              <div className="bg-primary-50 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-3">Güvenli Ödeme</h3>
              <p className="text-gray-600">Banka havalesi/EFT ile güvenli ödeme imkanı</p>
            </div>
          </div>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8 text-center">Müşterilerimiz Ne Diyor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg relative">
              <div className="text-primary text-4xl absolute -top-4 left-4">"</div>
              <p className="text-gray-700 mb-4 mt-2">
                Bahçe mobilyalarının kalitesi gerçekten çok iyi. Geçen yaz aldığım oturma grubu hala ilk günkü gibi
                duruyor.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  AY
                </div>
                <div className="ml-3">
                  <p className="font-medium">Ayşe Yılmaz</p>
                  <p className="text-sm text-gray-500">İstanbul</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg relative">
              <div className="text-primary text-4xl absolute -top-4 left-4">"</div>
              <p className="text-gray-700 mb-4 mt-2">
                Siparişim çok hızlı geldi ve kurulum ekibi çok profesyoneldi. Kesinlikle tekrar alışveriş yapacağım.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  MK
                </div>
                <div className="ml-3">
                  <p className="font-medium">Mehmet Kaya</p>
                  <p className="text-sm text-gray-500">Ankara</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-50 p-6 rounded-lg relative">
              <div className="text-primary text-4xl absolute -top-4 left-4">"</div>
              <p className="text-gray-700 mb-4 mt-2">
                Ürünlerin tasarımı ve kalitesi beklentilerimin üzerinde çıktı. Bahçem artık çok daha şık görünüyor.
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  EÇ
                </div>
                <div className="ml-3">
                  <p className="font-medium">Elif Çelik</p>
                  <p className="text-sm text-gray-500">İzmir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
