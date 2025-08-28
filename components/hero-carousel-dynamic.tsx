"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

interface HeroSlide {
  id: number
  image_url: string
  title: string
  subtitle: string | null
  description: string | null
  order_index: number
  is_active: boolean
}

export default function HeroCarouselDynamic() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSlides() {
      try {
        setLoading(true)
        const supabase = getSupabaseClient()
        const { data, error } = await supabase
          .from("hero_slides")
          .select("*")
          .eq("is_active", true)
          .order("order_index", { ascending: true })

        if (error) {
          throw new Error(error.message)
        }

        setSlides(data || [])
      } catch (err) {
        console.error("Hero slaytları yüklenirken hata oluştu:", err)
        setError("Hero slaytları yüklenirken bir hata oluştu.")
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
  }

  if (loading) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || slides.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">{error || "Hero slaytları bulunamadı."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <div className="relative w-full h-full">
            <Image
              src={slide.image_url || "/placeholder.svg"}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-start justify-center text-left p-8 md:p-12 lg:p-16 max-w-3xl">
              {slide.subtitle && (
                <p className="text-sm md:text-base lg:text-lg font-medium mb-2 text-white/90 bg-primary/80 px-3 py-1 rounded-full inline-block">
                  {slide.subtitle}
                </p>
              )}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 text-white drop-shadow-md">
                {slide.title}
              </h2>
              {slide.description && (
                <p className="text-lg md:text-xl lg:text-2xl font-medium mt-2 text-white/90 drop-shadow-md max-w-xl">
                  {slide.description}
                </p>
              )}
              <Link
                href="/urunler"
                className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Ürünleri Keşfet
              </Link>
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Önceki</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-sm"
            onClick={goToNext}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Sonraki</span>
          </Button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-all backdrop-blur-sm",
                  index === currentIndex ? "bg-white w-6" : "bg-white/50",
                )}
                onClick={() => setCurrentIndex(index)}
              >
                <span className="sr-only">{`Slayt ${index + 1}`}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
