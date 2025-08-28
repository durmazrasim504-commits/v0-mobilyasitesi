"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getWishlistItems, removeFromWishlist } from "@/lib/wishlist-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/supabase"
import { AccountSidebar } from "@/components/sidebar"
import { MobileAccountSidebar } from "@/components/mobile-account-sidebar"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) {
        setWishlistItems([])
        setIsLoading(false)
        return
      }

      try {
        const items = await getWishlistItems(user.id)
        setWishlistItems(items)
      } catch (error) {
        console.error("Error fetching wishlist:", error)
        toast({
          title: "Hata",
          description: "Favoriler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlist()
  }, [user])

  const handleRemoveFromWishlist = async (productId: number) => {
    if (!user) return

    try {
      await removeFromWishlist(user.id, productId)
      setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
      toast({
        title: "Başarılı",
        description: "Ürün favorilerden kaldırıldı.",
      })
    } catch (error) {
      console.error("Error removing from wishlist:", error)
      toast({
        title: "Hata",
        description: "Ürün favorilerden kaldırılırken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Giriş Yapın</h2>
        <p className="text-gray-600 mb-6">Favorilerinizi görmek için giriş yapmalısınız.</p>
        <Link href="/giris-yap">
          <Button>Giriş Yap</Button>
        </Link>
      </div>
    )
  }

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
          <Link href="/hesabim" className="hover:text-primary">
            Hesabım
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Favorilerim</span>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile Account Sidebar */}
          <MobileAccountSidebar />

          {/* Desktop Sidebar */}
          <div className="w-full md:w-64 shrink-0 hidden md:block">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Favorilerim</h1>
              <p className="text-gray-600">Beğendiğiniz ve daha sonra incelemek istediğiniz ürünler</p>
            </div>

            {/* Wishlist Items */}
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {wishlistItems.map((product) => (
                  <div key={product.id} className="relative group">
                    <ProductCard product={product} />
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Favorilerden kaldır"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-bold mb-2">Favorilerinizde ürün bulunmamaktadır</h2>
                <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilerinize ekleyebilirsiniz.</p>
                <Link href="/urunler">
                  <Button>Alışverişe Başla</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
