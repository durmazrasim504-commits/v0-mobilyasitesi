"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle, Package, FileText, Clock, Truck, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<any | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // URL'den takip numarasını al ve otomatik arama yap
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const trackingParam = urlParams.get("tracking")

    if (trackingParam) {
      setTrackingNumber(trackingParam)
      // Sayfa yüklendiğinde otomatik arama yap
      searchOrder(trackingParam)
    } else {
      setInitialLoading(false)
    }
  }, [])

  const handleSearchByTracking = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!trackingNumber.trim()) {
      setError("Lütfen bir takip numarası girin.")
      return
    }

    searchOrder(trackingNumber.trim())
  }

  const searchOrder = async (tracking: string) => {
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("tracking_number", tracking)
        .single()

      if (orderError) {
        console.error("Sipariş aranırken hata:", orderError)
        if (orderError.code === "PGRST116") {
          // No rows found
          setError("Girdiğiniz takip numarasına ait sipariş bulunamadı.")
        } else {
          setError("Sipariş aranırken bir hata oluştu. Lütfen tekrar deneyin.")
        }
        setLoading(false)
        return
      }

      if (!orderData) {
        setError("Girdiğiniz takip numarasına ait sipariş bulunamadı.")
        setLoading(false)
        return
      }

      const foundOrder = orderData

      // Sipariş kalemlerini al
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          *,
          product:products(*)
        `)
        .eq("order_id", foundOrder.id)

      if (itemsError) {
        console.error("Sipariş kalemleri alınırken hata:", itemsError)
      }

      // Dekont bilgilerini al
      const { data: receipt, error: receiptError } = await supabase
        .from("order_receipts")
        .select("*")
        .eq("order_id", foundOrder.id)
        .single()

      if (receiptError && receiptError.code !== "PGRST116") {
        // PGRST116: Sonuç bulunamadı hatası
        console.error("Dekont bilgileri alınırken hata:", receiptError)
      }

      // Tüm verileri birleştir
      const completeOrder = {
        ...foundOrder,
        items: items || [],
        receipt: receipt || null,
      }

      console.log("Sipariş detayları:", completeOrder)
      setOrder(completeOrder)
    } catch (err) {
      console.error("Sipariş aranırken hata:", err)
      setError("Sipariş aranırken bir hata oluştu. Lütfen tekrar deneyin.")
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sipariş aranırken bir hata oluştu. Lütfen tekrar deneyin.",
      })
    } finally {
      setLoading(false)
      setInitialLoading(false)
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Beklemede",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          description: "Siparişiniz alındı ve ödeme onayı bekleniyor.",
        }
      case "processing":
        return {
          label: "İşleniyor",
          color: "bg-blue-100 text-blue-800",
          icon: <FileText className="h-5 w-5 text-blue-600" />,
          description: "Siparişiniz hazırlanıyor ve yakında kargoya verilecek.",
        }
      case "shipped":
        return {
          label: "Kargoya Verildi",
          color: "bg-purple-100 text-purple-800",
          icon: <Truck className="h-5 w-5 text-purple-600" />,
          description: "Siparişiniz kargoya verildi ve yola çıktı.",
        }
      case "delivered":
        return {
          label: "Teslim Edildi",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          description: "Siparişiniz başarıyla teslim edildi.",
        }
      case "cancelled":
        return {
          label: "İptal Edildi",
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          description: "Siparişiniz iptal edildi.",
        }
      default:
        return {
          label: "Bilinmiyor",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
          description: "Sipariş durumu bilinmiyor.",
        }
    }
  }

  const handleViewDetails = () => {
    if (order) {
      router.push(`/hesabim/siparislerim/${order.id}`)
    }
  }

  const handleViewReceipt = () => {
    if (order?.receipt?.file_path) {
      window.open(order.receipt.file_path, "_blank")
    }
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Sipariş Takibi</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Siparişinizi Takip Edin</CardTitle>
          <CardDescription>Takip numarası ile siparişinizin durumunu kontrol edebilirsiniz.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="tracking-form" onSubmit={handleSearchByTracking} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="trackingNumber" className="sr-only">
                Takip Numarası
              </Label>
              <Input
                id="trackingNumber"
                placeholder="Takip numaranızı girin (örn: TR123456)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading} className="bg-green-500 hover:bg-green-600">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Aranıyor
                </>
              ) : (
                <>
                  <Package className="mr-2 h-4 w-4" />
                  Takip Et
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Hata</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {order && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş #{order.id}</CardTitle>
              <CardDescription>
                <span className="flex flex-col gap-1">
                  <span>Sipariş Tarihi: {new Date(order.created_at).toLocaleDateString("tr-TR")}</span>
                  <span className="font-medium">Takip Numarası: {order.tracking_number}</span>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-2">Sipariş Durumu</h3>
                <div className={`p-4 rounded-lg ${getStatusInfo(order.status).color}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusInfo(order.status).icon}
                    <span className="text-lg font-bold">{getStatusInfo(order.status).label}</span>
                  </div>
                  <p>{getStatusInfo(order.status).description}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-sm text-gray-500 mb-2">Teslimat Bilgileri</h3>
                <div className="p-4 rounded-lg border">
                  <p className="font-medium">{order.shipping_address}</p>
                  <div className="text-sm text-gray-600 mt-2">
                    <p>
                      {order.shipping_city}, {order.shipping_postal_code}
                    </p>
                    <p>{order.shipping_country}</p>
                    <p className="mt-1">Telefon: {order.contact_phone}</p>
                  </div>
                </div>
              </div>

              {order.receipt && order.receipt.file_path && (
                <div>
                  <h3 className="font-medium text-sm text-gray-500 mb-2">Dekont</h3>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleViewReceipt}>
                    <FileText className="mr-2 h-4 w-4" />
                    Ödeme Dekontunu Görüntüle
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {order.user_id && (
                <Button onClick={handleViewDetails} variant="outline" className="w-full bg-transparent">
                  Hesabımda Detayları Görüntüle
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sipariş Detayları</CardTitle>
              <CardDescription>Sipariş edilen ürünler ve özet bilgiler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items && order.items.length > 0 && (
                <div className="space-y-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4 last:border-0">
                      <div className="w-16 h-16 flex-shrink-0 relative rounded overflow-hidden">
                        {item.product && item.product.image_urls && item.product.image_urls.length > 0 ? (
                          <Image
                            src={item.product.image_urls[0] || "/placeholder.svg"}
                            alt={item.product?.name || "Ürün"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Package className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{item.product?.name || `Ürün #${item.product_id}`}</h4>
                            <p className="text-sm text-gray-600">
                              {item.quantity} adet x {item.price.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>
                          <span className="font-bold">{(item.price * item.quantity).toLocaleString("tr-TR")} ₺</span>
                        </div>
                        {item.product && item.product.slug && (
                          <div className="mt-2">
                            <Link href={`/urun/${item.product.slug}`} className="text-sm text-primary hover:underline">
                              Ürünü Görüntüle
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ara Toplam:</span>
                  <span>{(order.total_amount - 150).toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Kargo:</span>
                  <span>150,00 ₺</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Toplam:</span>
                  <span>{order.total_amount.toFixed(2)} ₺</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Ödeme Bilgileri</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme Yöntemi:</span>
                    <span>
                      {order.payment_method === "bank_transfer"
                        ? "Havale/EFT"
                        : order.payment_method === "credit_card"
                          ? "Kredi Kartı"
                          : order.payment_method === "cash_on_delivery"
                            ? "Kapıda Ödeme"
                            : order.payment_method}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ödeme Durumu:</span>
                    <Badge
                      variant="outline"
                      className={
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.payment_status === "paid" ? "Ödendi" : "Beklemede"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
