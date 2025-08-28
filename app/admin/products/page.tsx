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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye, Loader2, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getProducts, deleteProduct, type Product } from "@/lib/admin-service"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const itemsPerPage = 10

  useEffect(() => {
    fetchProducts()
  }, [currentPage, searchTerm])

  async function fetchProducts() {
    setLoading(true)
    try {
      const { products, totalCount } = await getProducts(currentPage, itemsPerPage, searchTerm)
      setProducts(products)
      setTotalPages(Math.ceil(totalCount / itemsPerPage))
    } catch (error) {
      console.error("Ürünler alınırken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ürünler alınırken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Arama yapıldığında ilk sayfaya dön
  }

  const handleDeleteClick = (productId: number) => {
    setDeleteProductId(productId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteProductId) return

    setIsDeleting(true)
    try {
      await deleteProduct(deleteProductId)

      // Ürün listesini güncelle
      setProducts(products.filter((product) => product.id !== deleteProductId))

      toast({
        title: "Başarılı",
        description: "Ürün başarıyla silindi.",
      })

      // Sayfayı yenile
      router.refresh()
    } catch (error) {
      console.error("Ürün silinirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ürün silinirken bir hata oluştu.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeleteProductId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ürünler</h1>
          <p className="text-muted-foreground">Tüm ürünlerinizi buradan yönetebilirsiniz.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-1">
            <Plus className="h-4 w-4" />
            Yeni Ürün
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9"
          />
          <Button type="submit" size="sm" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>Resim</TableHead>
              <TableHead>Ürün Adı</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Fiyat</TableHead>
              <TableHead className="text-right">İndirimli Fiyat</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {searchTerm ? "Arama sonucu bulunamadı." : "Henüz ürün bulunmuyor."}
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>
                    {product.image_urls && product.image_urls.length > 0 ? (
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        <Image
                          src={product.image_urls[0] || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      {product.is_new && (
                        <Badge variant="outline" className="mt-1 w-fit bg-blue-50 text-blue-700 border-blue-200">
                          Yeni
                        </Badge>
                      )}
                      {product.is_on_sale && (
                        <Badge variant="outline" className="mt-1 w-fit bg-amber-50 text-amber-700 border-amber-200">
                          İndirimde
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell className="text-right">{product.price.toFixed(2)} ₺</TableCell>
                  <TableCell className="text-right">
                    {product.discount_price ? `${product.discount_price.toFixed(2)} ₺` : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={product.stock <= 5 ? "text-red-500 font-medium" : ""}>{product.stock}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Menüyü aç</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href={`/admin/products/${product.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Düzenle</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/urun/${product.slug}`} target="_blank">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Görüntüle</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Sil</span>
                        </DropdownMenuItem>
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünü Sil</DialogTitle>
            <DialogDescription>Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Siliniyor
                </>
              ) : (
                "Sil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
