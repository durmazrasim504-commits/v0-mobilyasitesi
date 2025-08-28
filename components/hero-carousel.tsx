"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CarouselItem {
  id: number
  imageUrl: string
  title: string
  subtitle: string
  description: string
  buttonText?: string
  buttonLink?: string
}

// Carousel içeriği
const carouselItems: CarouselItem[] = [
  {
    id: 1,
    imageUrl: "/hero-1-new.png",
    title: "YAZ FIRSATLARI",
    subtitle: "Bahçe Mobilyalarında",
    description: "%30 İNDİRİM",
    buttonText: "Fırsatları Keşfet",
    buttonLink: "/kampanyali-urunler",
  },
  {
    id: 2,
    imageUrl: "/hero-2-new.png",
    title: "BAHÇE TAKIMI ALANA",
    subtitle: "Şezlong",
    description: "HEDİYE",
    buttonText: "Detayları Gör",
    buttonLink: "/bahce-oturma-grubu",
  },
  {
    id: 3,
    imageUrl: "/hero-3-new.png",
    title: "YENİ SEZON",
    subtitle: "Rattan Bahçe Mobilyaları",
    description: "STOKLARDA",
    buttonText: "Hemen İncele",
    buttonLink: "/yeni-urunler",
  },
]

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === carouselItems.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full h-[250px] md:h-[350px] lg:h-[450px] overflow-hidden">
      {/* Carousel Items */}
      {carouselItems.map((item, index) => (
        <div
          key={item.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-700 ${
            index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center items-start text-white max-w-6xl">
              <span className="inline-block bg-primary/90 px-3 py-1 text-xs md:text-sm rounded-sm mb-2 md:mb-3">
                {item.subtitle}
              </span>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">{item.title}</h2>
              <p className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">{item.description}</p>
              {item.buttonText && (
                <Link href={item.buttonLink || "#"}>
                  <button className="bg-primary hover:bg-primary-600 text-white text-sm md:text-base px-4 py-2 rounded-sm transition-colors">
                    {item.buttonText}
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Kare, düz ve hover'da yeşil olan butonlar */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary hover:text-white text-gray-800 p-2 rounded-none transition-colors"
        aria-label="Önceki slayt"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary hover:text-white text-gray-800 p-2 rounded-none transition-colors"
        aria-label="Sonraki slayt"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots - Daha zarif */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-none transition-all duration-300 ${
              index === currentSlide ? "w-6 bg-primary" : "w-1.5 bg-white/70"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
