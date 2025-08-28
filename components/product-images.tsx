import Image from "next/image"
import { ImageIcon } from "lucide-react"
import { useState } from "react"

interface ProductImagesProps {
  images: string[]
  productName?: string
  className?: string
  aspectRatio?: "square" | "portrait" | "auto"
  priority?: boolean
  sizes?: string
}

export function ProductImages({
  images,
  productName = "Product",
  className = "",
  aspectRatio = "square",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 300px"
}: ProductImagesProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isError, setIsError] = useState(false)

  // No images provided
  if (!images || images.length === 0) {
    return (
      <div className={`relative ${getAspectRatioClass(aspectRatio)} ${className} bg-muted flex items-center justify-center`}>
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
      </div>
    )
  }

  // Handle image load error
  const handleImageError = () => {
    setIsError(true)
  }

  return (
    <div className={`relative ${className}`}>
      <div className={`relative overflow-hidden rounded-lg ${getAspectRatioClass(aspectRatio)}`}>
        {isError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          </div>
        ) : (
          <Image
            src={images[currentImage]}
            alt={`${productName} image ${currentImage + 1}`}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover transition-opacity"
            onError={handleImageError}
          />
        )}
      </div>

      {/* Thumbnail navigator for multiple images */}
      {images.length > 1 && (
        <div className="flex mt-2 space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              className={`relative h-12 w-12 rounded-md overflow-hidden border ${
                index === currentImage ? "border-primary" : "border-muted"
              }`}
              onClick={() => {
                setCurrentImage(index)
                setIsError(false)
              }}
            >
              <Image
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper function to get the appropriate aspect ratio class
function getAspectRatioClass(aspectRatio: string) {
  switch (aspectRatio) {
    case "square":
      return "aspect-square"
    case "portrait":
      return "aspect-[3/4]"
    case "auto":
      return ""
    default:
      return "aspect-square"
  }
}
