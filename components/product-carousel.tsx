"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductCarouselProps {
  images: string[]
  productName: string
}

const ProductCarousel = ({ images, productName }: ProductCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative w-full h-80">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={image || "/placeholder.svg"}
            alt={`${productName} - Görsel ${index + 1}`}
            fill
            className="object-contain"
          />
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md z-10"
        aria-label="Önceki görsel"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow-md z-10"
        aria-label="Sonraki görsel"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default ProductCarousel
