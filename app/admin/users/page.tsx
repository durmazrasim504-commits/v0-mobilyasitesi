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
import { MoreHorizontal, Search, Trash2, Loader2, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { getUsers } from "@/lib/admin-service"
import { Badge } from "@/components/ui/badge"

interface UserData {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  order_count: number
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()
  const itemsPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm])

  async function fetchUsers() {
    setLoading(true)
    try {
      // Admin servisini kullanarak kullanıcıları al
      const { users, totalCount } = await getUsers(currentPage, itemsPerPage, searchTerm)

      // Kullanıcıları ve toplam sayfa sayısını ayarla
      setUsers(users)
      setTotalPages(Math.ceil(totalCount / itemsPerPage))
    } catch (error) {
      console.error("Kullanıcılar alınırken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kullanıcılar alınırken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Arama yapıldığında ilk sayfaya dön
  }

  const handleDeleteClick = (userId: string) => {
    setDeleteUserId(userId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return

    setIsDeleting(true)
    try {
      // Admin servisini kullanarak kullanıcıyı sil
      // Not: Bu fonksiyonu admin-service.ts'ye eklemeniz gerekebilir
      // await deleteUser(deleteUserId)

      // Kullanıcı listesini güncelle
      setUsers(users.filter((user) => user.id !== deleteUserId))

      toast({
        title: "Başarılı",
        description: "Kullanıcı başarıyla silindi.",
      })
    } catch (error) {
      console.error("Kullanıcı silinirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kullanıcı silinirken bir hata oluştu.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeleteUserId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kullanıcılar</h1>
        <p className="text-muted-foreground">Tüm kullanıcılarınızı buradan yönetebilirsiniz.</p>
      </div>

      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="E-posta ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type="submit">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>Son Giriş</TableHead>
              <TableHead className="text-right">Sipariş Sayısı</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm ? "Arama sonucu bulunamadı." : "Henüz kullanıcı bulunmuyor."}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString("tr-TR")}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleDateString("tr-TR")
                      : "Hiç giriş yapmadı"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="ml-auto">
                      {user.orders_count || 0}
                    </Badge>
                  </TableCell>
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
                        <Link href={`/admin/users/${user.id}`}>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Kullanıcı Detayları</span>
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/admin/users/${user.id}/orders`}>
                          <DropdownMenuItem>
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            <span>Siparişleri Görüntüle</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem onClick={() => handleDeleteClick(user.id)}>
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
            <DialogTitle>Kullanıcıyı Sil</DialogTitle>
            <DialogDescription>
              Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
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
