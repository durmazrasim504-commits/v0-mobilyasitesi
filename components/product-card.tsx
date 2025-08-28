import Link from "next/link"
import Image from "next/image"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/supabase"

interface ProductCardProps {
  product: Product
  showQuickActions?: boolean
}

const ProductCard = ({ product, showQuickActions = false }: ProductCardProps) => {
  // Get the first image from the product's images array
  const productImage = product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"

  return (
    <div className="group">
      <Link href={`/urun/${product.slug}`} className="block">
        <div className="bg-white rounded-md border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-300 overflow-hidden">
          {/* Product Image - Daha kompakt boyut */}
          <div className="relative h-40 md:h-52 overflow-hidden">
            <Image
              src={productImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Badges - Daha zarif */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.is_new && (
                <span className="bg-primary/90 text-white text-xs px-2 py-0.5 rounded-sm font-medium">Yeni</span>
              )}
              {product.is_on_sale && product.discount_percentage && (
                <span className="bg-red-500/90 text-white text-xs px-2 py-0.5 rounded-sm font-medium">
                  %{product.discount_percentage}
                </span>
              )}
            </div>

            {/* Quick Actions - Daha zarif */}
            {showQuickActions && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white/90 text-gray-700 rounded-full h-7 w-7 flex items-center justify-center shadow-sm hover:text-primary">
                  <Heart className="h-3.5 w-3.5" />
                  <span className="sr-only">Favorilere Ekle</span>
                </button>
              </div>
            )}
          </div>

          {/* Product Info - Daha kompakt ve zarif */}
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>

            <div className="flex items-center mt-1">
              <span className="text-base font-semibold text-primary">{product.price.toLocaleString("tr-TR")} ₺</span>

              {product.original_price && (
                <span className="text-xs text-gray-500 line-through ml-2">
                  {product.original_price.toLocaleString("tr-TR")} ₺
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
