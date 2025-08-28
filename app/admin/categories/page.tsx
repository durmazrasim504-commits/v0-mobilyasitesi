"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, MoreHorizontal, Plus, Search, Trash2, Eye, Loader2, Upload, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { type Category, getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/admin-service"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Yeni kategori ekleme/düzenleme state'leri
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image_url: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [searchTerm])

  async function fetchCategories() {
    setLoading(true)
    try {
      const categoriesData = await getCategories(searchTerm)
      setCategories(categoriesData)
    } catch (error) {
      console.error("Kategoriler alınırken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kategoriler alınırken bir hata oluştu.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleDeleteClick = (categoryId: number) => {
    setDeleteCategoryId(categoryId)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteCategoryId) return

    setIsDeleting(true)
    try {
      await deleteCategory(deleteCategoryId)

      // Kategori listesini güncelle
      setCategories(categories.filter((category) => category.id !== deleteCategoryId))

      toast({
        title: "Başarılı",
        description: "Kategori başarıyla silindi.",
      })
    } catch (error) {
      console.error("Kategori silinirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kategori silinirken bir hata oluştu. Bu kategoriye ait ürünler olabilir.",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setDeleteCategoryId(null)
    }
  }

  const handleEditClick = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      image_url: category.image_url || "",
    })
    setPreviewImage(category.image_url || null)
    setIsEditing(true)
    setIsAddDialogOpen(true)
  }

  const handleAddNewClick = () => {
    setEditingCategory(null)
    setCategoryForm({
      name: "",
      description: "",
      image_url: "",
    })
    setPreviewImage(null)
    setIsEditing(false)
    setIsAddDialogOpen(true)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    setIsUploading(true)
    setUploadError(null)

    try {
      // Önizleme için URL oluştur
      const previewUrl = URL.createObjectURL(file)
      setPreviewImage(previewUrl)

      // Resmi sunucuya yükle
      const formData = new FormData()
      formData.append("image", file)
      
      // Eğer düzenleme modundaysak, kategori ID'si ekle
      if (editingCategory) {
        formData.append("categoryId", editingCategory.id.toString())
      }

      // Resmi yükle
      const response = await fetch("/api/admin/category-images", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Resim yüklenirken bir hata oluştu")
      }

      const data = await response.json()

      if (data.success) {
        // Resim URL'sini form state'ine ekle
        setCategoryForm((prev) => ({
          ...prev,
          image_url: data.imageUrl,
        }))

        toast({
          title: "Başarılı",
          description: "Resim başarıyla yüklendi.",
        })
      } else {
        throw new Error(data.error || "Resim yüklenirken bir hata oluştu")
      }
    } catch (error) {
      console.error("Resim yükleme hatası:", error)
      setUploadError(error instanceof Error ? error.message : "Resim yüklenirken bir hata oluştu")
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Resim yüklenirken bir hata oluştu.",
      })
    } finally {
      setIsUploading(false)
      // Dosya seçiciyi sıfırla
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemoveImage = async () => {
    // Eğer düzenleme modundaysak ve kategori ID'si varsa, API ile resmi sil
    if (isEditing && editingCategory && categoryForm.image_url) {
      try {
        const response = await fetch(`/api/admin/category-images?categoryId=${editingCategory.id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Resim silinirken bir hata oluştu")
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error(data.error || "Resim silinirken bir hata oluştu")
        }
      } catch (error) {
        console.error("Resim silme hatası:", error)
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Resim silinirken bir hata oluştu.",
        })
        return // Hata durumunda işlemi iptal et
      }
    }

    // Form state'ini güncelle
    setCategoryForm((prev) => ({
      ...prev,
      image_url: "",
    }))
    
    // Önizlemeyi temizle
    if (previewImage) {
      URL.revokeObjectURL(previewImage)
      setPreviewImage(null)
    }
    
    // Dosya seçiciyi sıfırla
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    
    toast({
      title: "Başarılı",
      description: "Resim başarıyla kaldırıldı.",
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (isEditing && editingCategory) {
        // Kategoriyi güncelle
        const updatedCategory = await updateCategory(editingCategory.id, {
          name: categoryForm.name,
          description: categoryForm.description || null,
          image_url: categoryForm.image_url || null,
        })

        if (updatedCategory) {
          // Kategori listesini güncelle
          setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...updatedCategory } : cat)))
        }

        toast({
          title: "Başarılı",
          description: "Kategori başarıyla güncellendi.",
        })
      } else {
        // Slug oluştur
        const slug = categoryForm.name
          .toLowerCase()
          .replace(/[^a-z0-9ğüşıöç]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")

        // Yeni kategori ekle
        const newCategory = await createCategory({
          name: categoryForm.name,
          slug,
          description: categoryForm.description || null,
          image_url: categoryForm.image_url || null,
        })

        if (newCategory) {
          // Kategori listesini güncelle
          setCategories([...categories, newCategory])
        }

        toast({
          title: "Başarılı",
          description: "Kategori başarıyla eklendi.",
        })
      }

      // Formu kapat ve sayfayı yenile
      setIsAddDialogOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Kategori kaydedilirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Kategori kaydedilirken bir hata oluştu.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kategoriler</h1>
          <p className="text-muted-foreground">Tüm kategorilerinizi buradan yönetebilirsiniz.</p>
        </div>
        <Button onClick={handleAddNewClick} className="gap-1">
          <Plus className="h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Kategori ara..."
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
              <TableHead>Kategori Adı</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Ürün Sayısı</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm ? "Arama sonucu bulunamadı." : "Henüz kategori bulunmuyor."}
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{category.id}</TableCell>
                  <TableCell>
                    {category.image_url ? (
                      <div className="relative h-10 w-10 rounded-md overflow-hidden">
                        <Image
                          src={category.image_url || "/placeholder.svg"}
                          alt={category.name}
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
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-right">{category.product_count || 0}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEditClick(category)}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Düzenle</span>
                        </DropdownMenuItem>
                        <Link href={`/kategori/${category.slug}`} target="_blank">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Görüntüle</span>
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(category.id)}
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

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyi Sil</DialogTitle>
            <DialogDescription>
              Bu kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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

      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            // Dialog kapandığında state'leri temizle
            setEditingCategory(null)
            setCategoryForm({
              name: "",
              description: "",
              image_url: "",
            })
            setPreviewImage(null)
            setIsEditing(false)
            setUploadError(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Kategori Düzenle" : "Yeni Kategori Ekle"}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Kategori bilgilerini düzenleyin."
                : "Yeni bir kategori eklemek için aşağıdaki formu doldurun."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kategori Adı</Label>
                <Input
                  id="name"
                  name="name"
                  value={categoryForm.name}
                  onChange={handleFormChange}
                  placeholder="Örn: Bahçe Mobilyaları"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={categoryForm.description}
                  onChange={handleFormChange}
                  placeholder="Kategori açıklaması (isteğe bağlı)"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Kategori Resmi</Label>
                
                {uploadError && (
                  <Alert variant="destructive" className="mb-4">
                    <div className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      <AlertTitle>Hata</AlertTitle>
                    </div>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex flex-col gap-4">
                  {previewImage ? (
                    <div className="relative w-full h-40 rounded-md overflow-hidden border">
                      <Image
                        src={previewImage || "/placeholder.svg"}
                        alt="Kategori resmi önizleme"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border rounded-md p-4 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Henüz resim yüklenmedi</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Resim Yükle
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving || isUploading}>
                İptal
              </Button>
              <Button type="submit" disabled={isSaving || isUploading || !categoryForm.name.trim()}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor
                  </>
                ) : isEditing ? (
                  "Güncelle"
                ) : (
                  "Ekle"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
