"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  ArrowLeft, 
  Clock, 
  FileText, 
  Truck, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Upload, 
  Loader2,
  Eye,
  Link as LinkIcon,
  Trash2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getOrderDetailsById, updateOrderStatus, type DetailedOrder } from "@/lib/order-service"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<DetailedOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploadingReceipt, setUploadingReceipt] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (params.id) {
      fetchOrderDetails(Number(params.id))
    }
  }, [params.id])

  async function fetchOrderDetails(orderId: number) {
    setLoading(true)
    try {
      const orderData = await getOrderDetailsById(orderId)
      
      if (!orderData) {
        throw new Error("Sipariş bulunamadı")
      }
      
      console.log("Sipariş detayları yüklendi:", orderData)
      setOrder(orderData)
    } catch (error) {
      console.error("Sipariş detayları alınırken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sipariş detayları alınırken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleStatusChange(status: string) {
    if (!order) return

    setUpdating(true)
    try {
      const success = await updateOrderStatus(Number(order.id), status)
      
      if (success) {
        toast({
          title: "Başarılı",
          description: "Sipariş durumu güncellendi.",
        })
        // Sipariş detaylarını yenile
        fetchOrderDetails(Number(order.id))
      } else {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Sipariş durumu güncellenirken bir hata oluştu.",
        })
      }
    } catch (error) {
      console.error("Sipariş durumu güncellenirken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sipariş durumu güncellenirken bir hata oluştu.",
      })
    } finally {
      setUpdating(false)
    }
  }

  async function handleReceiptUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0 || !order) return
    
    const file = files[0]
    if (file.type !== "application/pdf") {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Sadece PDF dosyaları kabul edilmektedir.",
      })
      return
    }

    setUploadingReceipt(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("orderId", order.id.toString())
    formData.append("trackingNumber", order.tracking_number || "")

    try {
      console.log("Dekont yükleniyor:", {
        orderId: order.id,
        trackingNumber: order.tracking_number,
        fileName: file.name
      })
      
      const response = await fetch("/api/admin/order-receipts", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Dekont yüklenirken bir hata oluştu")
      }

      const data = await response.json()
      
      if (data.success) {
        console.log("Dekont başarıyla yüklendi:", data)
        toast({
          title: "Başarılı",
          description: "Dekont başarıyla yüklendi.",
        })
        
        // Sipariş detaylarını yenile
        fetchOrderDetails(Number(order.id))
        setShowUploadDialog(false)
      } else {
        throw new Error(data.error || "Dekont yüklenirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Dekont yükleme hatası:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: error instanceof Error ? error.message : "Dekont yüklenirken bir hata oluştu",
      })
    } finally {
      setUploadingReceipt(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  function viewReceipt() {
  if (order?.receipt?.file_path) {
    // Doğrudan görüntüleme (URL ile)
    window.open(order.receipt.file_path, "_blank")
  }
}

  function downloadReceipt() {
  if (order?.receipt?.file_path) {
    // İndirme işlemi
    fetch(order.receipt.file_path)
      .then(response => response.blob())
      .then(blob => {
        // İndirme için uygun bir dosya adı oluştur
        const downloadFileName = `Siparis_${order.id}_Dekont.pdf`
        
        // İndirme işlemini başlat
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = downloadFileName
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      })
      .catch(error => {
        console.error("Dosya indirme hatası:", error)
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Dekont indirilemedi. Lütfen daha sonra tekrar deneyin.",
        })
      })
  }
}
  // Sipariş silme fonksiyonu
  async function handleDeleteOrder() {
    if (!order) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Sipariş silinirken bir hata oluştu")
      }
      
      toast({
        title: "Başarılı",
        description: "Sipariş başarıyla silindi.",
      })
      
      // Ana sipariş sayfasına yönlendir
      router.push("/admin/orders")
    } catch (error) {
      console.error("Sipariş silme hatası:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: error instanceof Error ? error.message : "Sipariş silinirken bir hata oluştu",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Beklemede
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <FileText className="mr-1 h-3 w-3" />
            İşleniyor
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            <Truck className="mr-1 h-3 w-3" />
            Kargoya Verildi
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="mr-1 h-3 w-3" />
            Teslim Edildi
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="mr-1 h-3 w-3" />
            İptal Edildi
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center h-[400px]">
          <h2 className="text-2xl font-bold">Sipariş Bulunamadı</h2>
          <p className="text-muted-foreground">İstediğiniz sipariş bulunamadı veya erişim izniniz yok.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Siparişlere Dön
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sipariş Durumu:</span>
          <Select value={order.status} onValueChange={handleStatusChange} disabled={updating}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Durum Seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="processing">İşleniyor</SelectItem>
              <SelectItem value="shipped">Kargoya Verildi</SelectItem>
              <SelectItem value="delivered">Teslim Edildi</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sipariş Bilgileri</CardTitle>
            <CardDescription>Sipariş detayları ve durumu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sipariş No</p>
                <p className="font-medium">#{order.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Durum</p>
                <div>{getStatusBadge(order.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tarih</p>
                <p>{new Date(order.created_at).toLocaleDateString("tr-TR")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ödeme Yöntemi</p>
                <p>
                  {order.payment_method === "bank_transfer"
                    ? "Havale/EFT"
                    : order.payment_method === "credit_card"
                      ? "Kredi Kartı"
                      : order.payment_method === "cash_on_delivery"
                        ? "Kapıda Ödeme"
                        : order.payment_method}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Takip Numarası</p>
                <p className="font-medium">{order.tracking_number || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ödeme Durumu</p>
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

            {/* Dekont Bölümü */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Sipariş Dekontu</p>
                <div className="flex space-x-2">
                  {order.receipt ? (
                    <>
                      <Button variant="outline" size="sm" onClick={viewReceipt} className="h-8 gap-1">
                        <Eye className="h-3 w-3" />
                        Görüntüle
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadReceipt} className="h-8 gap-1">
                        <Download className="h-3 w-3" />
                        İndir
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUploadDialog(true)}
                      className="h-8 gap-1"
                    >
                      <Upload className="h-3 w-3" />
                      Dekont Yükle
                    </Button>
                  )}
                </div>
              </div>
              
              {order.receipt ? (
                <div className="mt-2 text-sm">
                  <p className="text-gray-600">
                    Yüklenme Tarihi: {new Date(order.receipt.uploaded_at).toLocaleString("tr-TR")}
                  </p>
                  <p className="text-gray-600 flex items-center mt-1">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    <span className="truncate">{order.receipt.file_path}</span>
                  </p>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-600">
                  Bu sipariş için henüz dekont yüklenmemiş.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Müşteri Bilgileri</CardTitle>
            <CardDescription>Müşteri ve teslimat bilgileri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Müşteri</p>
              <p className="font-medium">
                {order.user_name ? order.user_name : "Misafir Kullanıcı"}
                {order.user_email && (
                  <span className="block text-sm text-muted-foreground">{order.user_email}</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">İletişim Telefonu</p>
              <p>{order.contact_phone || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Teslimat Adresi</p>
              <div className="border rounded-md p-3 mt-1 bg-gray-50">
                <p className="whitespace-pre-wrap">{order.shipping_address}</p>
                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Şehir:</span> {order.shipping_city}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Posta Kodu:</span> {order.shipping_postal_code}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ülke:</span> {order.shipping_country}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sipariş Ürünleri</CardTitle>
          <CardDescription>Sipariş edilen ürünler ve detayları</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Görsel</TableHead>
                <TableHead>Ürün</TableHead>
                <TableHead className="text-right">Adet</TableHead>
                <TableHead className="text-right">Birim Fiyat</TableHead>
                <TableHead className="text-right">Toplam</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.product && item.product.image_urls && item.product.image_urls.length > 0 ? (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden">
                          <Image
                            src={item.product.image_urls[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.product ? (
                        <>
                          <div className="font-medium">{item.product.name}</div>
                          <div className="text-sm text-muted-foreground">Ürün ID: {item.product_id}</div>
                        </>
                      ) : (
                        <div className="font-medium">Ürün #{item.product_id}</div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.price.toFixed(2)} ₺</TableCell>
                    <TableCell className="text-right">{(item.price * item.quantity).toFixed(2)} ₺</TableCell>
                    <TableCell className="text-right">
                      {item.product && item.product.slug && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/urun/${item.product.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-1" />
                            Görüntüle
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Ürün bilgisi bulunamadı.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Separator className="my-4" />

          <div className="flex justify-end">
            <div className="space-y-1 text-right">
              <div className="flex justify-between gap-8">
                <span className="text-sm font-medium text-muted-foreground">Ara Toplam:</span>
                <span>{(order.total_amount - 150).toFixed(2)} ₺</span>
              </div>
              <div className="flex justify-between gap-8">
                <span className="text-sm font-medium text-muted-foreground">Kargo:</span>
                <span>150.00 ₺</span>
              </div>
              <div className="flex justify-between gap-8 text-lg font-bold border-t pt-2">
                <span>Toplam Tutar:</span>
                <span className="text-primary">{order.total_amount.toFixed(2)} ₺</span>
              </div>
            </div>
          </div>
          
          {/* Sipariş silme butonu */}
          <div className="mt-8 flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Siparişi Sil
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Siparişi Silmek İstediğinize Emin Misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem geri alınamaz. Bu sipariş ve tüm ilişkili veriler (sipariş kalemleri, dekont, vb.) kalıcı olarak silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteOrder} className="bg-red-600 hover:bg-red-700">
                    Siparişi Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Dekont Yükleme Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dekont Yükle</DialogTitle>
            <DialogDescription>
              Sipariş için dekont yükleyin. Sadece PDF formatında dosyalar kabul edilmektedir.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleReceiptUpload}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <div className="text-lg font-medium">Dosya Seçin</div>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF dosyası yüklemek için tıklayın veya sürükleyin
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4"
                  disabled={uploadingReceipt}
                >
                  {uploadingReceipt ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Dosya Seç
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={uploadingReceipt}>
              İptal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
