"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Loader2, Package, FileText, Download, Eye, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        router.push("/giris-yap?redirect=/hesabim/siparislerim")
        return
      }

      try {
        // Siparişi doğrudan Supabase ile çek
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select(`
            *,
            receipt:order_receipts(id, file_path, uploaded_at)
          `)
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (orderError) {
          throw orderError
        }

        // Sipariş kalemlerini al
        const { data: orderItems, error: itemsError } = await supabase
          .from("order_items")
          .select(`
            *,
            product:products(*)
          `)
          .eq("order_id", params.id)

        if (itemsError) {
          console.error("Sipariş kalemleri alınırken hata:", itemsError)
        }

        // Sipariş ve kalemleri birleştir
        const completeOrder = {
          ...orderData,
          items: orderItems || []
        }
        
        setOrder(completeOrder)
      } catch (error) {
        console.error("Sipariş yüklenirken hata:", error)
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Sipariş detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        })
        router.push("/hesabim/siparislerim")
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchOrder()
    }
  }, [params.id, user, router, toast])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Beklemede",
          color: "bg-yellow-100 text-yellow-800",
          icon: <Clock className="h-5 w-5 text-yellow-600" />,
          description: "Siparişiniz alındı ve ödeme onayı bekleniyor."
        }
      case "processing":
        return {
          label: "İşleniyor",
          color: "bg-blue-100 text-blue-800",
          icon: <FileText className="h-5 w-5 text-blue-600" />,
          description: "Siparişiniz hazırlanıyor ve yakında kargoya verilecek."
        }
      case "shipped":
        return {
          label: "Kargoya Verildi",
          color: "bg-purple-100 text-purple-800",
          icon: <Truck className="h-5 w-5 text-purple-600" />,
          description: "Siparişiniz kargoya verildi ve yola çıktı."
        }
      case "delivered":
        return {
          label: "Teslim Edildi",
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          description: "Siparişiniz başarıyla teslim edildi."
        }
      case "cancelled":
        return {
          label: "İptal Edildi",
          color: "bg-red-100 text-red-800",
          icon: <AlertCircle className="h-5 w-5 text-red-600" />,
          description: "Siparişiniz iptal edildi."
        }
      default:
        return {
          label: "Bilinmiyor",
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="h-5 w-5 text-gray-600" />,
          description: "Sipariş durumu bilinmiyor."
        }
    }
  }

  

  if (isLoading || authLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Sipariş bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız sipariş bulunamadı veya erişim izniniz yok.</p>
          <Link href="/hesabim/siparislerim">
            <Button>Siparişlerime Dön</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Link href="/hesabim/siparislerim" className="flex items-center text-primary hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Siparişlerime Dön</span>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Sol taraf: Sipariş özeti ve durum */}
        <div className="md:col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş #{order.id}</CardTitle>
              <CardDescription>
                <div className="flex flex-col gap-1">
                  <span>Tarih: {new Date(order.created_at).toLocaleDateString("tr-TR")}</span>
                  <span>Takip No: {order.tracking_number || "-"}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sipariş Durumu */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Sipariş Durumu</h3>
                <div className={`p-4 rounded-lg ${getStatusInfo(order.status).color}`}>
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusInfo(order.status).icon}
                    <span className="text-lg font-bold">{getStatusInfo(order.status).label}</span>
                  </div>
                  <p className="text-sm">{getStatusInfo(order.status).description}</p>
                </div>
              </div>

              {/* Teslimat Bilgileri */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Teslimat Adresi</h3>
                <div className="p-4 border rounded-lg">
                  <p>{order.shipping_address}</p>
                  <p className="text-sm mt-1">
                    {order.shipping_city}, {order.shipping_postal_code}
                  </p>
                  <p className="text-sm">{order.shipping_country}</p>
                </div>
              </div>

              {/* Ödeme Bilgileri */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Ödeme Bilgileri</h3>
                <div className="p-4 border rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Ödeme Yöntemi:</span>
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
                    <span className="text-sm text-muted-foreground">Ödeme Durumu:</span>
                    <Badge 
                      variant="outline" 
                      className={
                        order.payment_status === "paid" 
                          ? "bg-green-100 text-green-800 border-green-300" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-300"
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

        {/* Sağ taraf: Sipariş ürünleri ve özet */}
        <div className="md:col-span-8">
          <Card>
            <CardHeader>
              <CardTitle>Sipariş Detayları</CardTitle>
              <CardDescription>Sipariş edilen ürünler ve ödemeler</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Ürün Listesi */}
              <div className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item: any) => (
                    <div key={item.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                      <div className="w-20 h-20 flex-shrink-0 relative rounded overflow-hidden">
                        {item.product && item.product.image_urls && item.product.image_urls.length > 0 ? (
                          <Image
                            src={item.product.image_urls[0]}
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
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {item.product?.name || `Ürün #${item.product_id}`}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} adet x {item.price.toLocaleString("tr-TR")} ₺
                            </p>
                          </div>
                          <span className="font-bold">
                            {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                          </span>
                        </div>
                        
                        {item.product && item.product.slug && (
                          <div className="mt-2">
                            <Button variant="link" size="sm" asChild className="h-auto p-0">
                              <Link href={`/urun/${item.product.slug}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Ürünü Görüntüle
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Bu siparişte ürün bulunmuyor.</p>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Fiyat Özeti */}
              <div className="flex justify-end">
                <div className="w-full sm:w-80 space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam:</span>
                    <span>{(order.total_amount - 150).toLocaleString("tr-TR")} ₺</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo:</span>
                    <span>150,00 ₺</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Toplam:</span>
                    <span className="text-xl">{order.total_amount.toLocaleString("tr-TR")} ₺</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sipariş Adımları */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sipariş Takibi</CardTitle>
              <CardDescription>Siparişinizin güncel durumunu takip edin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <OrderTimelineStep 
                  status="completed" 
                  title="Sipariş Alındı" 
                  date={new Date(order.created_at).toLocaleDateString("tr-TR")} 
                  description="Siparişiniz başarıyla oluşturuldu." 
                />
                
                <OrderTimelineStep 
                  status={order.payment_status === "paid" ? "completed" : "pending"} 
                  title="Ödeme Onaylandı" 
                  date={order.payment_status === "paid" ? new Date(order.updated_at).toLocaleDateString("tr-TR") : "-"} 
                  description="Ödeme işleminiz onaylandı." 
                />
                
                <OrderTimelineStep 
                  status={["processing", "shipped", "delivered"].includes(order.status) ? "completed" : "pending"} 
                  title="Sipariş Hazırlanıyor" 
                  date={order.status === "processing" ? new Date(order.updated_at).toLocaleDateString("tr-TR") : "-"} 
                  description="Siparişiniz hazırlanıyor." 
                />
                
                <OrderTimelineStep 
                  status={["shipped", "delivered"].includes(order.status) ? "completed" : "pending"} 
                  title="Kargoya Verildi" 
                  date={order.status === "shipped" ? new Date(order.updated_at).toLocaleDateString("tr-TR") : "-"} 
                  description="Siparişiniz kargoya verildi." 
                />
                
                <OrderTimelineStep 
                  status={order.status === "delivered" ? "completed" : "pending"} 
                  title="Teslim Edildi" 
                  date={order.status === "delivered" ? new Date(order.updated_at).toLocaleDateString("tr-TR") : "-"} 
                  description="Siparişiniz teslim edildi." 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Sipariş Takip Adımı Bileşeni
interface OrderTimelineStepProps {
  status: "pending" | "completed" | "cancelled"
  title: string
  date: string
  description: string
}

function OrderTimelineStep({ status, title, date, description }: OrderTimelineStepProps) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className={`rounded-full w-8 h-8 flex items-center justify-center ${
          status === "completed" 
            ? "bg-green-100 text-green-600" 
            : status === "cancelled" 
              ? "bg-red-100 text-red-600" 
              : "bg-gray-100 text-gray-400"
        }`}>
          {status === "completed" ? (
            <CheckCircle className="h-5 w-5" />
          ) : status === "cancelled" ? (
            <AlertCircle className="h-5 w-5" />
          ) : (
            <Clock className="h-5 w-5" />
          )}
        </div>
        {status !== "cancelled" && <div className="h-full w-0.5 bg-gray-200"></div>}
      </div>
      <div className="pb-8">
        <div className="flex justify-between items-center">
          <p className="font-medium">{title}</p>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>
    </div>
  )
}
