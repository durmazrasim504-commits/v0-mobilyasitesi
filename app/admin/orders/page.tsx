"use client"

import React from "react"

import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Search, Eye, Loader2, FileText, Truck, CheckCircle, AlertCircle, Clock, Download, Package } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getOrders } from "@/lib/order-service"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const { toast } = useToast()
  const itemsPerPage = 10

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter])

  // Arama yapıldığında çalışacak fonksiyon
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Arama yapıldığında ilk sayfaya dön
    fetchOrders() // Aramayı gerçekleştir
  }

  // fetchOrders fonksiyonunu güncelleyelim
  async function fetchOrders() {
    setLoading(true)
    try {
      console.log("Siparişler alınıyor...", { currentPage, itemsPerPage, statusFilter, searchTerm })

      // Merkezi sipariş servisini kullanarak siparişleri al
      const result = await getOrders(
        currentPage,
        itemsPerPage,
        statusFilter !== "all" ? statusFilter : undefined,
        searchTerm || undefined,
      )

      console.log("getOrders'dan dönen sonuç:", result)

      // Sayfalama için toplam sayfa sayısını hesapla
      setTotalPages(Math.ceil(result.totalCount / itemsPerPage))
      setOrders(result.orders)
    } catch (error) {
      console.error("Siparişler alınırken hata:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Siparişler alınırken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-4 w-4 mr-1" />
            Beklemede
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            <FileText className="h-4 w-4 mr-1" />
            İşleniyor
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            <Truck className="h-4 w-4 mr-1" />
            Kargoya Verildi
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-4 w-4 mr-1" />
            Teslim Edildi
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            <AlertCircle className="h-4 w-4 mr-1" />
            İptal Edildi
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            <CheckCircle className="h-4 w-4 mr-1" />
            Ödendi
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            <Clock className="h-4 w-4 mr-1" />
            Beklemede
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatPaymentMethod = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "Havale/EFT"
      case "credit_card":
        return "Kredi Kartı"
      case "cash_on_delivery":
        return "Kapıda Ödeme"
      default:
        return method
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Siparişler</h1>
        <p className="text-muted-foreground">Tüm siparişlerinizi buradan yönetebilirsiniz.</p>
      </div>

      {/* Sipariş İstatistikleri */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">
              Toplam {orders.length} sipariş görüntüleniyor
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bekleyen Siparişler</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">
              İşleme alınması gereken siparişler
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kargoya Verilenler</CardTitle>
            <Truck className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === "shipped").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Yolda olan siparişler
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlanan Siparişler</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(order => order.status === "delivered").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Teslim edilmiş siparişler
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Sipariş ID, Takip No veya adres ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>

        <div className="w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Durum Filtresi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="pending">Beklemede</SelectItem>
              <SelectItem value="processing">İşleniyor</SelectItem>
              <SelectItem value="shipped">Kargoya Verildi</SelectItem>
              <SelectItem value="delivered">Teslim Edildi</SelectItem>
              <SelectItem value="cancelled">İptal Edildi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sipariş ID</TableHead>
              <TableHead>Takip No</TableHead>
              <TableHead>Müşteri</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Ödeme Durumu</TableHead>
              <TableHead>Ödeme Yöntemi</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead className="text-right">Toplam</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  {searchTerm || statusFilter !== "all" ? "Arama sonucu bulunamadı." : "Henüz sipariş bulunmuyor."}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell className="font-medium text-xs text-muted-foreground">
                    {order.tracking_number || "-"}
                  </TableCell>
                  <TableCell>
                    {order.guest_email ? (
                      <div>
                        <div className="font-medium">Misafir</div>
                        <div className="text-xs text-muted-foreground">{order.guest_email}</div>
                      </div>
                    ) : (
                      order.user_id || "Misafir Kullanıcı"
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                  <TableCell>{formatPaymentMethod(order.payment_method)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("tr-TR")}
                    <div className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString("tr-TR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{order.total_amount.toFixed(2)} ₺</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menüyü aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/admin/orders/${order.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Detayları Görüntüle</span>
                          </DropdownMenuItem>
                        </Link>
                        {order.receipt && order.receipt.file_path && (
                          <DropdownMenuItem onClick={() => window.open(order.receipt.file_path, "_blank")}>
                            <Download className="mr-2 h-4 w-4" />
                            <span>Dekontu İndir</span>
                          </DropdownMenuItem>
                        )}
                        <Link href={`/siparis-takibi?tracking=${order.tracking_number}`} target="_blank">
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            <span>Takip Sayfası</span>
                          </DropdownMenuItem>
                        </Link>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                // İlk sayfa, son sayfa ve mevcut sayfanın etrafındaki 1 sayfa göster
                return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
              })
              .map((page, index, array) => {
                // Eğer ardışık sayılar arasında boşluk varsa ellipsis ekle
                const showEllipsis = index > 0 && array[index - 1] !== page - 1

                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  </React.Fragment>
                )
              })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
