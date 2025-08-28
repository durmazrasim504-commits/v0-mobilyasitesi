"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Loader2, Copy, Package, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { useSiteSettings } from "@/contexts/site-settings-context"

export default function OrderConfirmation() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()
  const { getSetting } = useSiteSettings()
  const orderId = searchParams.get("order_id")

  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadingStage, setLoadingStage] = useState("Sipariş bilgileri alınıyor...")
  const [copied, setCopied] = useState(false)

  // Get WhatsApp information from site settings
  const whatsappNumber = getSetting("whatsapp_number")
  const defaultMessage = getSetting("whatsapp_message") || "Merhaba, sipariş numaramla ilgili bilgi almak istiyorum:"

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        console.error("Sipariş ID'si bulunamadı")
        router.push("/")
        return
      }

      try {
        setLoadingStage("Sipariş detayları alınıyor...")
        console.log("Sipariş detayları alınıyor:", orderId)
        // Fetch order details from API
        const response = await fetch(`/api/orders/${orderId}`)

        setLoadingStage("Sipariş bilgileri işleniyor...")
        console.log("API yanıtı:", response.status, response.statusText)

        if (!response.ok) {
          console.error("Sipariş detayları alınamadı:", response.status, response.statusText)
          throw new Error(`Sipariş detayları alınamadı: ${response.status}`)
        }

        const data = await response.json()
        console.log("Sipariş detayları:", data)

        if (!data.order) {
          console.error("Sipariş bulunamadı:", data.error || "Unknown error")
          throw new Error("Sipariş bulunamadı")
        }

        setLoadingStage("Sayfa hazırlanıyor...")
        // Add a small delay to show the final loading message
        setTimeout(() => {
          setOrder(data.order)
          setIsLoading(false)
        }, 500)
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Hata",
          description: "Sipariş detayları alınamadı. Lütfen daha sonra tekrar deneyin.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  const copyOrderNumber = () => {
    if (order?.tracking_number) {
      navigator.clipboard.writeText(order.tracking_number)
      setCopied(true)
      toast({
        title: "Kopyalandı",
        description: "Sipariş takip numarası panoya kopyalandı.",
      })

      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getWhatsAppLink = () => {
    if (!whatsappNumber) return "#"

    // Format the WhatsApp number (remove spaces, dashes, etc.)
    const formattedNumber = whatsappNumber.replace(/\D/g, "")

    // Create the message with the order tracking number
    const message = `${defaultMessage} ${order?.tracking_number || order?.id || ""}`

    // Create the WhatsApp link
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Siparişiniz Hazırlanıyor</h2>
          <p className="text-gray-600 mb-6">{loadingStage}</p>
          <div className="max-w-md mx-auto bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm">
            Lütfen sayfayı kapatmayın veya yenilemeyin. Siparişiniz işleniyor...
          </div>

          <div className="mt-8 flex justify-center">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                <span className="text-green-600 font-medium">Sipariş alındı</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                <span className="text-green-600 font-medium">Ödeme onaylandı</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse mr-3"></div>
                <span className="font-medium">Sipariş detayları hazırlanıyor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Sipariş bulunamadı</h1>
        <p className="mb-6">İstediğiniz sipariş bulunamadı veya bu siparişi görüntüleme yetkiniz yok.</p>
        <Link href="/">
          <Button>Ana Sayfaya Dön</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Message Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Siparişiniz Alındı!</h1>
              <p className="text-gray-600 mb-6">Siparişiniz başarıyla oluşturuldu ve sistemimize kaydedildi.</p>

              <div className="bg-gray-50 w-full max-w-md p-6 rounded-lg mb-6">
                <p className="text-gray-500 text-sm mb-1">Sipariş Takip Numaranız:</p>
                <div className="flex items-center justify-center gap-3">
                  <p className="text-3xl font-bold text-gray-800">{order.tracking_number || order.id}</p>
                  <Button variant="outline" size="sm" onClick={copyOrderNumber} className="flex items-center">
                    <Copy className="h-4 w-4 mr-1" /> {copied ? "Kopyalandı" : "Kopyala"}
                  </Button>
                </div>
              </div>

              <div className="w-full max-w-md space-y-3">
                <Link href={`/siparis-takibi?order_id=${order.id}`} className="w-full">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <Package className="h-5 w-5" /> Siparişimi Takip Et
                  </Button>
                </Link>

                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button
                    variant="secondary"
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <MessageCircle className="h-5 w-5" /> Müşteri Temsilcisi ile İletişime Geç
                  </Button>
                </a>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 max-w-md text-left mt-4">
                <h5 className="text-blue-800 font-medium mb-1">Siparişinizi takip edebilirsiniz</h5>
                <p className="text-blue-700 text-sm">
                  Yukarıdaki sipariş takip numaranız ile istediğiniz zaman siparişinizin durumunu kontrol edebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-6">
              <h2 className="font-bold mb-3">Sipariş Özeti</h2>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Ürün</th>
                      <th className="px-4 py-2 text-center text-sm font-medium">Adet</th>
                      <th className="px-4 py-2 text-right text-sm font-medium">Fiyat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {order.order_items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium">{item.product?.name || "Ürün"}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">{item.quantity}</td>
                        <td className="px-4 py-3 text-right">{(item.price || 0).toLocaleString("tr-TR")} ₺</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right font-medium">
                        Ara Toplam:
                      </td>
                      <td className="px-4 py-2 text-right">{(order.total_amount || 0).toLocaleString("tr-TR")} ₺</td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right font-medium">
                        Kargo:
                      </td>
                      <td className="px-4 py-2 text-right">
                        {order.shipping_cost ? `${order.shipping_cost.toLocaleString("tr-TR")} ₺` : "Ücretsiz"}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-right font-bold">
                        Toplam:
                      </td>
                      <td className="px-4 py-2 text-right font-bold">
                        {(order.total_amount || 0).toLocaleString("tr-TR")} ₺
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="font-bold mb-3">Teslimat Bilgileri</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm mb-1">
                  <strong>Adres:</strong> {order.shipping_address || ""}
                </p>
                <p className="text-sm mb-1">
                  <strong>Şehir:</strong> {order.shipping_city || ""}
                </p>
                <p className="text-sm mb-1">
                  <strong>Posta Kodu:</strong> {order.shipping_postal_code || ""}
                </p>
                <p className="text-sm">
                  <strong>Telefon:</strong> {order.contact_phone || ""}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button variant="outline">Ana Sayfaya Dön</Button>
              </Link>
              {user && (
                <Link href="/hesabim/siparislerim">
                  <Button>Siparişlerim</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
