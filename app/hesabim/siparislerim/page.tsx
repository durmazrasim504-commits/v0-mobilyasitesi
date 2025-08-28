"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { FileText, Loader2, Package, Clock, Truck, CheckCircle, AlertCircle, Download, Eye } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase-client"
import { AccountSidebar } from "@/components/sidebar"
import { MobileAccountSidebar } from "@/components/mobile-account-sidebar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function OrdersPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        router.push("/giris-yap?redirect=/hesabim/siparislerim")
        return
      }

      setIsLoading(true)
      try {
        // Siparişleri doğrudan Supabase ile çek
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(`
            *,
            receipt:order_receipts(id, file_path, uploaded_at)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (ordersError) {
          throw ordersError
        }

        // Tüm siparişler için ürün detaylarını al
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order) => {
            // Her sipariş için ürünleri çek
            const { data: items, error: itemsError } = await supabase
              .from("order_items")
              .select(`
                *,
                product:products(*)
              `)
              .eq("order_id", order.id)

            if (itemsError) {
              console.error(`Sipariş kalemleri alınırken hata (Sipariş ID: ${order.id}):`, itemsError)
              return {
                ...order,
                items: [],
              }
            }

            return {
              ...order,
              items: items || [],
            }
          })
        )

        setOrders(ordersWithItems)
      } catch (error) {
        console.error("Siparişler yüklenirken hata:", error)
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Siparişleriniz yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchOrders()
    }
  }, [user, router, toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Beklemede
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            İşleniyor
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 flex items-center gap-1">
            <Truck className="h-3 w-3" />
            Kargoya Verildi
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Teslim Edildi
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            İptal Edildi
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Beklemede"
      case "processing":
        return "İşleniyor"
      case "shipped":
        return "Kargoya Verildi"
      case "delivered":
        return "Teslim Edildi"
      case "cancelled":
        return "İptal Edildi"
      default:
        return "Bilinmiyor"
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Account Sidebar */}
        <MobileAccountSidebar />

        {/* Desktop Sidebar - Account Navigation */}
        <div className="w-full md:w-64 shrink-0 hidden md:block">
          <AccountSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card>
            <CardHeader>
              <CardTitle>Siparişlerim</CardTitle>
              <CardDescription>Sipariş geçmişinizi ve durumunu buradan takip edebilirsiniz.</CardDescription>
            </CardHeader>

            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    {orders.map((order) => (
                      <AccordionItem key={order.id} value={`order-${order.id}`}>
                        <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-lg">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2 text-left">
                            <div className="flex flex-col">
                              <span className="font-medium">Sipariş #{order.id}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString("tr-TR")}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {getStatusBadge(order.status)}
                              <span className="font-medium">{order.total_amount.toLocaleString("tr-TR")} ₺</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 px-4">
                          <div className="grid gap-4 pt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Teslimat Adresi</h4>
                                <p className="text-sm">{order.shipping_address}</p>
                                <p className="text-sm">{order.shipping_city}, {order.shipping_postal_code}</p>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Sipariş Bilgileri</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex justify-between">
                                    <span>Takip No:</span>
                                    <span>{order.tracking_number || "-"}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Durum:</span>
                                    <span>{getStatusText(order.status)}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Ödeme:</span>
                                    <span>
                                      {order.payment_method === "bank_transfer" 
                                        ? "Havale/EFT" 
                                        : order.payment_method === "credit_card" 
                                          ? "Kredi Kartı" 
                                          : order.payment_method}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Ürünler</h4>
                              <div className="space-y-3">
                                {order.items && order.items.map((item: any) => (
                                  <div key={item.id} className="flex items-center gap-3">
                                    <div className="relative h-12 w-12 rounded overflow-hidden">
                                      {item.product && item.product.image_urls && item.product.image_urls.length > 0 ? (
                                        <Image
                                          src={item.product.image_urls[0]}
                                          alt={item.product?.name || "Ürün"}
                                          fill
                                          className="object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                          <Package className="h-4 w-4 text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <span className="font-medium">
                                          {item.product?.name || `Ürün #${item.product_id}`}
                                        </span>
                                        <span className="font-medium">
                                          {(item.price * item.quantity).toLocaleString("tr-TR")} ₺
                                        </span>
                                      </div>
                                      <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>{item.quantity} adet x {item.price.toLocaleString("tr-TR")} ₺</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex justify-between items-center">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <span>Toplam:</span>
                                  <span className="font-bold text-foreground">
                                    {order.total_amount.toLocaleString("tr-TR")} ₺
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                {order.receipt && order.receipt.file_path && (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => window.open(order.receipt.file_path, "_blank")}
                                  >
                                    <Download className="h-4 w-4 mr-1" />
                                    Dekont
                                  </Button>
                                )}
                                <Link href={`/hesabim/siparislerim/${order.id}`}>
                                  <Button variant="default" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Detaylar
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 rounded-full p-6 mb-4">
                    <FileText className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Sipariş bulunamadı</h3>
                  <p className="text-gray-500 mb-6">Henüz bir sipariş vermemiş görünüyorsunuz.</p>
                  <Link href="/">
                    <Button>Alışverişe Başla</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
