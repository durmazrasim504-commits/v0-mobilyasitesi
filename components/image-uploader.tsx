"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Upload, AlertCircle, ImageIcon, Trash2 } from "lucide-react"

interface ImageUploaderProps {
  currentImageUrl: string
  onImageUploaded: (url: string) => void
  onImageDeleted?: () => void
}

export default function ImageUploader({ currentImageUrl, onImageUploaded, onImageDeleted }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState(currentImageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // XHR kullanarak dosya yükleme
  function uploadFile(file: File) {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()
      
      // Dosyayı form data'ya ekle
      formData.append("image", file)
      
      // XHR'yi hazırla
      xhr.open("POST", "/api/admin/upload-hero-image", true)
      
      // Yanıt geldiğinde
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            if (response.success && response.imageUrl) {
              resolve(response.imageUrl)
            } else {
              reject(new Error(response.error || "Görsel yükleme başarısız"))
            }
          } catch (error) {
            reject(new Error("Sunucu yanıtı geçersiz"))
          }
        } else {
          let errorMessage = "Görsel yükleme başarısız"
          try {
            const response = JSON.parse(xhr.responseText)
            errorMessage = response.error || response.details || errorMessage
          } catch (e) {
            // JSON parse hatası
          }
          reject(new Error(errorMessage))
        }
      }
      
      // Yükleme hatası
      xhr.onerror = function() {
        reject(new Error("Ağ hatası, yükleme başarısız"))
      }
      
      // Formdata'yı gönder
      xhr.send(formData)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      console.log("Dosya yükleniyor:", file.name, file.type, file.size)
      
      // XHR ile yükleme
      const uploadedUrl = await uploadFile(file)
      
      console.log("Yükleme başarılı, URL:", uploadedUrl)
      setImageUrl(uploadedUrl)
      onImageUploaded(uploadedUrl)
      
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
      setUploading(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    onImageUploaded(url)
  }

  const handleDeleteImage = () => {
    setImageUrl("")
    if (onImageDeleted) {
      onImageDeleted()
    }
    toast({
      title: "Bilgi",
      description: "Görsel kaldırıldı.",
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-[16/9] bg-gray-100 border rounded-md overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
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
          disabled={uploading}
          className="w-full"
        >
          {uploading ? (
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
          onChange={handleFileSelect}
        />
        <Input
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="veya görsel URL'si girin"
          className="flex-1"
        />
        {imageUrl && (
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
  )
}
