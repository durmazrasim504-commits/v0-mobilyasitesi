"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Truck,
  ShieldCheck,
  Heart,
  ShoppingBag,
  Loader2,
  Check,
  Star,
  StarHalf,
  Info,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ProductCard from "@/components/product-card"
import { getProductBySlug, getProducts } from "@/lib/product-service"
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/wishlist-service"
import type { Product } from "@/lib/supabase"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductBySlug(params.slug)
        setProduct(productData)

        // Get related products
        if (productData) {
          const { products } = await getProducts(undefined, undefined, 1, 4)
          setRelatedProducts(products.filter((p) => p.id !== productData.id).slice(0, 4))
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Hata",
          description: "Ürün bilgileri yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  // Check if product is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !product) return

      setIsCheckingFavorite(true)
      try {
        const result = await isInWishlist(user.id, product.id)
        setIsFavorite(result)
      } catch (error) {
        console.error("Error checking wishlist:", error)
      } finally {
        setIsCheckingFavorite(false)
      }
    }

    checkWishlist()
  }, [user, product])

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && (!product || value <= product.stock)) {
      setQuantity(value)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return

    setIsAddingToCart(true)
    try {
      await addToCart(product.id, quantity)
      toast({
        title: "Başarılı",
        description: `${product.name} sepete eklendi.`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Hata",
        description: "Ürün sepete eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      toast({
        title: "Giriş Yapın",
        description: "Favorilere eklemek için giriş yapmalısınız.",
      })
      return
    }

    if (!product) return

    try {
      if (isFavorite) {
        await removeFromWishlist(user.id, product.id)
        setIsFavorite(false)
        toast({
          title: "Başarılı",
          description: "Ürün favorilerden kaldırıldı.",
        })
      } else {
        await addToWishlist(user.id, product.id)
        setIsFavorite(true)
        toast({
          title: "Başarılı",
          description: "Ürün favorilere eklendi.",
        })
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const nextImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (product?.images && product.images.length > 0) {
      setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
    }
  }

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Ürün bulunamadı</h2>
        <p className="text-gray-600 mb-6">Aradığınız ürün bulunamadı veya kaldırılmış olabilir.</p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    )
  }

  // Ensure we have a valid image URL
  const imageUrl = product.images && product.images.length > 0 ? product.images[currentImage] : "/placeholder.svg"

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-primary">
            Ana Sayfa
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/kategori/${product.category_id}`} className="hover:text-primary">
            Kategori
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="relative h-[300px] md:h-[450px] bg-gray-50 border overflow-hidden mb-4">
              <Image src={imageUrl || "/placeholder.svg"} alt={product.name} fill className="object-contain" />

              {/* Image navigation buttons */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-primary hover:text-white text-gray-800 p-1.5 rounded-sm transition-colors"
                    aria-label="Önceki görsel"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-primary hover:text-white text-gray-800 p-1.5 rounded-sm transition-colors"
                    aria-label="Sonraki görsel"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.is_new && <Badge className="bg-blue-500 hover:bg-blue-600">Yeni</Badge>}
                {product.discount_percentage && (
                  <Badge className="bg-red-500 hover:bg-red-600">%{product.discount_percentage} İndirim</Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-16 w-16 border-2 ${
                      currentImage === index ? "border-primary" : "border-gray-200"
                    }`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex text-yellow-400">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <StarHalf className="h-4 w-4 fill-current" />
              </div>
              <span className="text-sm text-gray-500 ml-2">(12 Değerlendirme)</span>
            </div>

            {/* Price */}
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-primary mr-3">{product.price.toLocaleString("tr-TR")} ₺</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-gray-500 line-through mr-2">
                    {product.original_price.toLocaleString("tr-TR")} ₺
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-sm">
                    %{product.discount_percentage} indirim
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Ürün Açıklaması</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* Stock */}
            <div className="mb-6 flex items-center">
              {product.stock > 0 ? (
                <>
                  <Check className="h-5 w-5 text-green-500 mr-1.5" />
                  <span className="text-green-700 font-medium">Stokta ({product.stock} adet)</span>
                </>
              ) : (
                <>
                  <Info className="h-5 w-5 text-red-500 mr-1.5" />
                  <span className="text-red-700 font-medium">Stokta Yok</span>
                </>
              )}
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium">Adet</label>
              <div className="flex border rounded-sm max-w-[140px]">
                <button
                  className="px-3 py-2 border-r text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                  className="w-full text-center py-2 text-sm"
                />
                <button
                  className="px-3 py-2 border-l text-gray-600 hover:bg-gray-100 transition-colors"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                className="flex-1 flex items-center justify-center gap-2 py-2.5"
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
              >
                {isAddingToCart ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingBag className="h-5 w-5" />}
                <span>{product.stock === 0 ? "Stokta Yok" : "Sepete Ekle"}</span>
              </Button>
              <Button
                variant="outline"
                className={`flex items-center justify-center gap-2 py-2.5 ${
                  isFavorite ? "border-red-500 text-red-500 hover:bg-red-50" : ""
                }`}
                onClick={handleToggleWishlist}
                disabled={isCheckingFavorite}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isFavorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}</span>
              </Button>
            </div>

            {/* Shipping & Payment */}
            <div className="space-y-3 mb-6 bg-gray-50 p-4 rounded-sm">
              <div className="flex items-start">
                <Truck className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Kargo Bilgisi</h3>
                  <p className="text-sm text-gray-600">2500 TL ve üzeri siparişlerde ücretsiz kargo</p>
                </div>
              </div>
              <div className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm">Güvenli Ödeme</h3>
                  <p className="text-sm text-gray-600">Kredi kartı, havale/EFT veya kapıda ödeme seçenekleri</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Return Info */}
        <div className="mb-12 border-t pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2 text-lg">Kargo Bilgileri</h3>
              <p className="text-gray-700">
                Siparişiniz, ödemenizin onaylanmasından sonra 1-3 iş günü içerisinde kargoya verilir.
              </p>
              <p className="text-gray-700 mt-2">
                2500 TL ve üzeri siparişlerde kargo ücretsizdir. 2500 TL altındaki siparişlerde 150 TL kargo ücreti
                alınır.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-lg">İade Koşulları</h3>
              <p className="text-gray-700">
                Ürünlerimiz, teslim tarihinden itibaren 14 gün içerisinde iade edilebilir. İade edilecek ürünlerin
                orijinal ambalajında ve kullanılmamış olması gerekmektedir.
              </p>
              <p className="text-gray-700 mt-2">
                Detaylı bilgi için{" "}
                <Link href="/iade-kosullari" className="text-primary hover:underline">
                  İade Koşulları
                </Link>{" "}
                sayfamızı ziyaret edebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-xl font-bold mb-6 pb-2 border-b">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
