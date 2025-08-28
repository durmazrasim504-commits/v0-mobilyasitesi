import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  imageUrl: string
  price: number
  discountedPrice?: number
  isNew?: boolean
  isOnSale?: boolean
  category: string
  slug: string
}

interface ProductGridProps {
  title?: string
  products: Product[]
  viewAllLink?: string
}

const ProductGrid = ({ title, products = [], viewAllLink }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          {title && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{title}</h2>
              {viewAllLink && (
                <Link href={viewAllLink} className="text-primary hover:underline">
                  Tümünü Gör
                </Link>
              )}
            </div>
          )}
          <div className="text-center py-12">
            <p className="text-gray-500">Henüz ürün bulunmamaktadır.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {title && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{title}</h2>
            {viewAllLink && (
              <Link href={viewAllLink} className="text-primary hover:underline">
                Tümünü Gör
              </Link>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                {/* Product Image */}
                <Link href={`/urun/${product.slug}`}>
                  <div className="relative h-48 md:h-64 w-full">
                    <Image
                      src={product.imageUrl || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && <span className="bg-primary text-white text-xs px-2 py-1 rounded">Yeni</span>}
                  {product.isOnSale && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">İndirim</span>}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-2 right-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="bg-white rounded-full h-8 w-8 shadow-sm hover:text-primary"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add to Cart */}
                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 py-2 px-3 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Sepete Ekle</span>
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-3">
                <Link href={`/urun/${product.slug}`} className="block">
                  <h3 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-1 flex items-center">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                        {product.discountedPrice.toLocaleString("tr-TR")} ₺
                      </span>
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {product.price.toLocaleString("tr-TR")} ₺
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold">{product.price.toLocaleString("tr-TR")} ₺</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductGrid
