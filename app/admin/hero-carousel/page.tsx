"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Plus, Pencil, Trash2, MoveUp, MoveDown, ImageIcon, AlertCircle, Upload } from "lucide-react"
import {
  getHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  updateHeroSlideOrder,
  type HeroSlide,
} from "@/lib/admin-service"

export default function HeroCarouselPage() {
  const router = useRouter()
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState<HeroSlide | null>(null)
  const [formData, setFormData] = useState({
    image_url: "",
    title: "",
    subtitle: "",
    description: "",
    is_active: true,
  })
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSlides()
  }, [])

  async function fetchSlides() {
    try {
      setLoading(true)
      const data = await getHeroSlides()
      setSlides(data)
    } catch (error) {
      console.error("Hero slaytları alınırken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slaytları alınırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleAddDialogOpen() {
    setFormData({
      image_url: "",
      title: "",
      subtitle: "",
      description: "",
      is_active: true,
    })
    setIsAddDialogOpen(true)
  }

  function handleEditDialogOpen(slide: HeroSlide) {
    setCurrentSlide(slide)
    setFormData({
      image_url: slide.image_url,
      title: slide.title,
      subtitle: slide.subtitle || "",
      description: slide.description || "",
      is_active: slide.is_active,
    })
    setIsEditDialogOpen(true)
  }

  function handleDeleteDialogOpen(slide: HeroSlide) {
    setCurrentSlide(slide)
    setIsDeleteDialogOpen(true)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function handleSwitchChange(checked: boolean) {
    setFormData((prev) => ({ ...prev, is_active: checked }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)

      // Create form data for upload
      const formData = new FormData()
      formData.append("image", file)

      // Send to our API endpoint
      const response = await fetch("/api/admin/upload-hero-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Görsel yükleme başarısız")
      }

      if (!data.success || !data.imageUrl) {
        throw new Error("Görsel yükleme başarısız")
      }

      setFormData((prev) => ({
        ...prev,
        image_url: data.imageUrl,
      }))

      toast({
        title: "Başarılı",
        description: "Görsel başarıyla yüklendi.",
      })
    } catch (error) {
      console.error("Görsel yüklenirken hata:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Görsel yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Görsel silme fonksiyonu
  async function handleDeleteImage() {
    if (!currentSlide) return

    try {
      // Eğer resim URL'si yoksa işlem yapma
      if (!formData.image_url) {
        return
      }

      // API'ye silme isteği gönder
      const response = await fetch("/api/admin/delete-hero-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slideId: currentSlide.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Görsel silme işlemi başarısız")
      }

      // Formdaki image_url'i temizle
      setFormData((prev) => ({
        ...prev,
        image_url: "",
      }))

      toast({
        title: "Başarılı",
        description: "Görsel başarıyla silindi.",
      })
    } catch (error) {
      console.error("Görsel silinirken hata:", error)
      toast({
        title: "Hata",
        description: error instanceof Error ? error.message : "Görsel silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  async function handleAddSlide() {
    try {
      if (!formData.image_url) {
        toast({
          title: "Hata",
          description: "Lütfen bir görsel yükleyin veya URL girin.",
          variant: "destructive",
        })
        return
      }

      if (!formData.title) {
        toast({
          title: "Hata",
          description: "Lütfen bir başlık girin.",
          variant: "destructive",
        })
        return
      }

      const newSlide = await createHeroSlide({
        image_url: formData.image_url,
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        is_active: formData.is_active,
        order_index: slides.length, // Yeni slayt en sona eklenir
      })

      if (newSlide) {
        toast({
          title: "Başarılı",
          description: "Hero slayt başarıyla eklendi.",
        })
        setIsAddDialogOpen(false)
        fetchSlides()
      }
    } catch (error) {
      console.error("Hero slayt eklenirken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slayt eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  async function handleUpdateSlide() {
    if (!currentSlide) return

    try {
      if (!formData.image_url) {
        toast({
          title: "Hata",
          description: "Lütfen bir görsel yükleyin veya URL girin.",
          variant: "destructive",
        })
        return
      }

      if (!formData.title) {
        toast({
          title: "Hata",
          description: "Lütfen bir başlık girin.",
          variant: "destructive",
        })
        return
      }

      const updatedSlide = await updateHeroSlide(currentSlide.id, {
        image_url: formData.image_url,
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        is_active: formData.is_active,
      })

      if (updatedSlide) {
        toast({
          title: "Başarılı",
          description: "Hero slayt başarıyla güncellendi.",
        })
        setIsEditDialogOpen(false)
        fetchSlides()
      }
    } catch (error) {
      console.error("Hero slayt güncellenirken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slayt güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  async function handleDeleteSlide() {
    if (!currentSlide) return

    try {
      await deleteHeroSlide(currentSlide.id)
      toast({
        title: "Başarılı",
        description: "Hero slayt başarıyla silindi.",
      })
      setIsDeleteDialogOpen(false)
      fetchSlides()
    } catch (error) {
      console.error("Hero slayt silinirken hata:", error)
      toast({
        title: "Hata",
        description: "Hero slayt silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  async function handleMoveSlide(slideId: number, direction: "up" | "down") {
    const slideIndex = slides.findIndex((slide) => slide.id === slideId)
    if (slideIndex === -1) return

    const newSlides = [...slides]

    if (direction === "up" && slideIndex > 0) {
      // Swap with the previous slide
      ;[newSlides[slideIndex], newSlides[slideIndex - 1]] = [newSlides[slideIndex - 1], newSlides[slideIndex]]
    } else if (direction === "down" && slideIndex < newSlides.length - 1) {
      // Swap with the next slide
      ;[newSlides[slideIndex], newSlides[slideIndex + 1]] = [newSlides[slideIndex + 1], newSlides[slideIndex]]
    } else {
      return // No change needed
    }

    // Update order_index for all slides
    const updatedSlides = newSlides.map((slide, index) => ({
      id: slide.id,
      order_index: index,
    }))

    try {
      await updateHeroSlideOrder(updatedSlides)
      fetchSlides()
    } catch (error) {
      console.error("Slayt sırası güncellenirken hata:", error)
      toast({
        title: "Hata",
        description: "Slayt sırası güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Hero Carousel Yönetimi</h1>
          <p className="text-muted-foreground">Ana sayfa hero carousel slaytlarını buradan yönetebilirsiniz.</p>
        </div>
        <Button onClick={handleAddDialogOpen}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Slayt Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Slaytları</CardTitle>
          <CardDescription>Mevcut hero slaytlarını görüntüleyin ve düzenleyin.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Yükleniyor...</div>
          ) : slides.length === 0 ? (
            <div className="text-center py-4 flex flex-col items-center">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Henüz hero slayt bulunmuyor.</p>
              <Button variant="outline" className="mt-4" onClick={handleAddDialogOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Slayt Ekle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slides.map((slide) => (
                <Card key={slide.id} className="overflow-hidden border">
                  <div className="relative aspect-[16/9] bg-gray-100">
                    {slide.image_url ? (
                      <Image
                        src={slide.image_url || "/placeholder.svg"}
                        alt={slide.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    {!slide.is_active && (
                      <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-900/70 text-white rounded">
                        Pasif
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1">{slide.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{slide.subtitle}</p>
                    <p className="text-sm mb-4">{slide.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleMoveSlide(slide.id, "up")}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleMoveSlide(slide.id, "down")}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button variant="outline" size="sm" onClick={() => handleEditDialogOpen(slide)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteDialogOpen(slide)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Slide Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Yeni Hero Slayt Ekle</DialogTitle>
            <DialogDescription>Ana sayfada gösterilecek yeni bir hero slayt ekleyin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="image">Görsel</Label>
              <div className="flex flex-col gap-2">
                <div className="relative aspect-[16/9] bg-gray-100 border rounded-md overflow-hidden">
                  {formData.image_url ? (
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Önizleme"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full"
                  >
                    {uploadingImage ? (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Görsel Yükle
                      </>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="veya görsel URL'si girin"
                    className="flex-1"
                  />
                  {formData.image_url && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Önerilen boyut: 1920x600 piksel</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="YAZ FIRSATLARI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subtitle">Alt Başlık</Label>
              <Input
                id="subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Bahçe Mobilyalarında"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="%30 İNDİRİM"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="is_active">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddSlide}>Ekle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Slide Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Hero Slayt Düzenle</DialogTitle>
            <DialogDescription>Seçili hero slaytı düzenleyin.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_image">Görsel</Label>
              <div className="flex flex-col gap-2">
                <div className="relative aspect-[16/9] bg-gray-100 border rounded-md overflow-hidden">
                  {formData.image_url ? (
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Önizleme"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full"
                  >
                    {uploadingImage ? (
                      <>
                        <AlertCircle className="mr-2 h-4 w-4 animate-spin" />
                        Yükleniyor...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Görsel Yükle
                      </>
                    )}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Input
                    id="edit_image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="veya görsel URL'si girin"
                    className="flex-1"
                  />
                  {formData.image_url && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={handleDeleteImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Önerilen boyut: 1920x600 piksel</p>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_title">Başlık</Label>
              <Input
                id="edit_title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="YAZ FIRSATLARI"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_subtitle">Alt Başlık</Label>
              <Input
                id="edit_subtitle"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder="Bahçe Mobilyalarında"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_description">Açıklama</Label>
              <Input
                id="edit_description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="%30 İNDİRİM"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="edit_is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="edit_is_active">Aktif</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleUpdateSlide}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Slide Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hero Slayt Sil</DialogTitle>
            <DialogDescription>Bu slaytı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              <strong>{currentSlide?.title}</strong> başlıklı slayt silinecek.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteSlide}>
              Sil
            </Button>
          </DialogFooter>
       </DialogContent>
     </Dialog>
   </div>
 )
}
