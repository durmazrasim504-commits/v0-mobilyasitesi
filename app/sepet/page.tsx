"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/contexts/cart-context"
import { useSiteSettings } from "@/contexts/site-settings-context"
import { ShoppingBag, Trash2, CreditCard, Truck, AlertTriangle, ArrowLeft } from "lucide-react"
import CartItem from "@/components/cart/cart-item"

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
  const { getSetting } = useSiteSettings()

  const [subtotal, setSubtotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [shippingFee, setShippingFee] = useState(0)

  const shippingFeeValue = Number(getSetting("shipping_fee") || getSetting("kargo_ucreti") || "50")
  const freeShippingThreshold = Number(
    getSetting("free_shipping_threshold") || getSetting("ucretsiz_kargo_esigi") || "5000",
  )

  // WhatsApp numarası ve mesaj oluşturma
  const whatsappNumber = getSetting("whatsapp_number") || getSetting("whatsapp_numarasi") || "+905551234567"

  // Sepetteki ürünleri ve toplam tutarı içeren mesaj oluştur
  const createWhatsAppMessage = () => {
    let message = "Merhaba, aşağıdaki ürünler için PTT ile ödeme yapmak istiyorum:\n\n"

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.product?.name || "Ürün"} - ${item.quantity} adet - ${(item.price || 0).toLocaleString("tr-TR")} ₺\n`
    })

    message += `\nToplam Tutar: ${total.toLocaleString("tr-TR")} ₺`
    return message
  }

  // WhatsApp URL'i oluştur
  const getWhatsAppUrl = () => {
    const cleanNumber = whatsappNumber.replace(/\s+/g, "").replace(/\+/g, "")
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(createWhatsAppMessage())}`
  }

  useEffect(() => {
    const calculatedSubtotal = cartItems.reduce((acc, item) => {
      const itemPrice = item.price * item.quantity
      return acc + itemPrice
    }, 0)

    setSubtotal(calculatedSubtotal)

    // Ücretsiz kargo eşiğini aşarsa kargo ücreti 0, aksi takdirde sabit kargo ücreti
    const calculatedShippingFee = calculatedSubtotal >= freeShippingThreshold ? 0 : shippingFeeValue
    setShippingFee(calculatedShippingFee)

    setTotal(calculatedSubtotal + calculatedShippingFee)
  }, [cartItems, freeShippingThreshold, shippingFeeValue])

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return

    setIsApplyingCoupon(true)

    // Kupon kodu uygulaması simülasyonu
    setTimeout(() => {
      setIsApplyingCoupon(false)
      setCouponCode("")
      alert("Bu kupon kodu geçerli değil.")
    }, 1000)
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-primary-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">
            Sepetinizde ürün bulunmamaktadır. Sepetinize ürün eklemek için alışverişe devam edin.
          </p>
          <Link href="/urunler">
            <Button>Alışverişe Devam Et</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Alışveriş Sepeti</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6">
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={`${item.id}-${item.options?.join("-")}`}
                    item={item}
                    updateQuantity={updateQuantity}
                    removeFromCart={removeFromCart}
                  />
                ))}
              </div>
            </div>

            <div className="bg-gray-50 p-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between">
                <div className="flex items-center mb-4 sm:mb-0">
                  <Button variant="outline" className="mr-2 bg-transparent" onClick={() => clearCart()}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Sepeti Temizle
                  </Button>
                  <Link href="/urunler">
                    <Button variant="ghost">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Alışverişe Devam Et
                    </Button>
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <div className="flex w-full sm:w-auto">
                    <Input
                      type="text"
                      placeholder="İndirim Kodu"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="rounded-r-none"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="rounded-l-none"
                    >
                      {isApplyingCoupon ? "Uygulanıyor..." : "Uygula"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ara Toplam</span>
                  <span>{subtotal.toLocaleString("tr-TR")} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Kargo</span>
                  <span>{shippingFee === 0 ? "Ücretsiz" : `${shippingFee.toLocaleString("tr-TR")} ₺`}</span>
                </div>
                {shippingFee > 0 && (
                  <div className="text-xs text-gray-500 italic">
                    {freeShippingThreshold.toLocaleString("tr-TR")} ₺ ve üzeri siparişlerde kargo ücretsizdir.
                  </div>
                )}
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-bold">
                    <span>Toplam</span>
                    <span className="text-lg">{total.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex items-center text-sm text-gray-600">
                  <CreditCard className="h-4 w-4 mr-2 text-primary" />
                  <span>Güvenli ödeme seçenekleri</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-primary" />
                  <span>Hızlı teslimat</span>
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500 flex-shrink-0 mt-1" />
                  <span>
                    Stokta bulunan ürünler 1-3 iş günü içerisinde kargoya verilir. Detaylı bilgi için{" "}
                    <Link href="/kargo-bilgileri" className="text-primary hover:underline">
                      kargo bilgileri
                    </Link>
                    sayfasını ziyaret edebilirsiniz.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
