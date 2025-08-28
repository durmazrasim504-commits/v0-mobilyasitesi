"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart, type CartItem as CartItemType } from "@/contexts/cart-context"

interface CartItemProps {
  item: CartItemType
  showControls?: boolean
  showRemove?: boolean
}

export default function CartItem({ item, showControls = true, showRemove = true }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const [imageError, setImageError] = useState(false)

  // Ensure product is defined
  const product = item.product || {}

  // Get price safely
  const price = typeof product.price === "number" ? product.price : 0

  // Get product name and slug safely
  const productName = product.name || "Ürün"
  const productSlug = product.slug || ""

  // Get image URL safely
  let imageUrl = ""

  // Try to get image from different possible sources
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    imageUrl = product.images[0]
  } else if (product.image_urls && Array.isArray(product.image_urls) && product.image_urls.length > 0) {
    imageUrl = product.image_urls[0]
  } else if (product.image) {
    imageUrl = product.image
  } else if (product.thumbnail) {
    imageUrl = product.thumbnail
  }

  const handleIncrement = () => {
    const newQuantity = (item.quantity || 0) + 1
    const maxStock = product.stock || 0

    if (maxStock > 0 && newQuantity > maxStock) {
      return
    }

    updateQuantity(item.id, newQuantity)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.id)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b">
      {/* Product */}
      <div className="col-span-1 md:col-span-6">
        <div className="flex items-center">
          <div className="relative h-20 w-20 flex-shrink-0 bg-gray-100 rounded">
            {!imageError && imageUrl ? (
              <Image
                src={imageUrl || "/placeholder.svg"}
                alt={productName}
                fill
                className="object-cover rounded"
                priority={true}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-xs">
                Resim Yok
              </div>
            )}
          </div>
          <div className="ml-4">
            <Link href={`/urun/${productSlug}`} className="font-medium hover:text-primary">
              {productName}
            </Link>
            {product.variant_name && <p className="text-sm text-gray-500">{product.variant_name}</p>}
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="md:col-span-2 flex items-center md:justify-center">
        <div className="md:hidden font-medium mr-2">Fiyat:</div>
        <span className="font-medium">
          {price ? price.toLocaleString("tr-TR", { minimumFractionDigits: 2 }) : "0,00"} ₺
        </span>
      </div>

      {/* Quantity */}
      {showControls && (
        <div className="md:col-span-2 flex items-center md:justify-center">
          <div className="md:hidden font-medium mr-2">Adet:</div>
          <div className="flex border rounded">
            <button className="px-2 py-1 border-r" onClick={handleDecrement} disabled={item.quantity <= 1}>
              <Minus className="h-4 w-4" />
            </button>
            <input type="number" min="1" value={item.quantity} className="w-12 text-center py-1" readOnly />
            <button
              className="px-2 py-1 border-l"
              onClick={handleIncrement}
              disabled={(product.stock || 0) <= item.quantity}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="md:col-span-2 flex items-center justify-between md:justify-end">
        <div className="md:hidden font-medium mr-2">Toplam:</div>
        <div className="flex items-center">
          <span className="font-medium">
            {price && item.quantity
              ? (price * item.quantity).toLocaleString("tr-TR", { minimumFractionDigits: 2 })
              : "0,00"}{" "}
            ₺
          </span>
          {showRemove && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-4 text-gray-400 hover:text-red-500"
              onClick={handleRemove}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
