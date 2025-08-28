import React from "react"
import Image from "next/image"
import { ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryImageProps {
  imageUrl: string | null
  onRemove?: () => void
  className?: string
}

export function CategoryImage({ imageUrl, onRemove, className = "" }: CategoryImageProps) {
  // Resim yoksa, yer tutucu göster
  if (!imageUrl) {
    return (
      <div className={`relative flex items-center justify-center w-full h-40 bg-muted rounded-md ${className}`}>
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-40 rounded-md overflow-hidden border">
        <Image
          src={imageUrl}
          alt="Kategori resmi"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      
      {/* Eğer silme işlevi sağlanmışsa, silme butonu göster */}
      {onRemove && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

// Önizleme için
interface CategoryImagePreviewProps {
  file: File
  onRemove?: () => void
  className?: string
}

export function CategoryImagePreview({ file, onRemove, className = "" }: CategoryImagePreviewProps) {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Önizleme URL'si oluştur
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Temizlik işlevi
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  if (!previewUrl) {
    return (
      <div className={`relative flex items-center justify-center w-full h-40 bg-muted rounded-md ${className}`}>
        <ImageIcon className="h-12 w-12 text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative w-full h-40 rounded-md overflow-hidden border">
        <Image
          src={previewUrl}
          alt="Kategori resmi önizleme"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>
      
      {/* Eğer silme işlevi sağlanmışsa, silme butonu göster */}
      {onRemove && (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
