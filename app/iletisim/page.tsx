// app/iletisim/page.tsx dosyasında değişiklik yapalım

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useSiteSettings } from "@/contexts/site-settings-context"
import { Send, Phone, Mail, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { getSetting } = useSiteSettings()
  const { toast } = useToast()

  // İletişim bilgileri - Burada footer ile aynı şekilde alıyoruz
  const phone = getSetting("phone") || "0 850 305 86 07"
  const email = getSetting("email") || "info@divonagarden.com"
  const address = getSetting("address") || "İmişehir OSB 2001 Cadde No:16 Odunpazarı / ESKİŞEHİR"

  // Çalışma saatlerini de dinamik olarak alabiliriz
  const workHours = {
    weekdays: getSetting("work_hours_weekdays") || "09:00 - 18:00",
    saturday: getSetting("work_hours_saturday") || "10:00 - 16:00",
    sunday: getSetting("work_hours_sunday") || "Kapalı",
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Form doğrulama
    if (!formState.name || !formState.email || !formState.message) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen gerekli alanları doldurun.",
      })
      setIsSubmitting(false)
      return
    }

    // Bu kısımda gerçek bir API çağrısı yapılabilir
    // Şimdilik başarılı bir gönderim simüle ediyoruz
    setTimeout(() => {
      toast({
        title: "Başarılı",
        description: "Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.",
      })
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)
    }, 1500)
  }

  return (
    <div className="container-custom py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <h1 className="text-3xl font-bold mb-6">İletişim</h1>
          <p className="text-gray-600 mb-8">
            Sorularınız, önerileriniz veya herhangi bir konu hakkında bizimle iletişime geçebilirsiniz. Size en kısa
            sürede dönüş yapacağız.
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-start">
              <div className="bg-primary-50 rounded-full p-3 mr-4">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Telefon</h3>
                <p className="text-gray-600">{phone}</p>
                <p className="text-sm text-gray-500">Pazartesi - Cumartesi: {workHours.weekdays}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary-50 rounded-full p-3 mr-4">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">E-posta</h3>
                <p className="text-gray-600">{email}</p>
                <p className="text-sm text-gray-500">7/24 hizmetinizdeyiz</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-primary-50 rounded-full p-3 mr-4">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg">Adres</h3>
                <p className="text-gray-600">{address}</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 p-6 rounded-lg">
            <h3 className="font-bold mb-3">Çalışma Saatlerimiz</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Pazartesi - Cuma:</span>
                <span>{workHours.weekdays}</span>
              </li>
              <li className="flex justify-between">
                <span>Cumartesi:</span>
                <span>{workHours.saturday}</span>
              </li>
              <li className="flex justify-between">
                <span>Pazar:</span>
                <span>{workHours.sunday}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Form ve harita bölümü değişmedi */}
        <div>
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">Bize Mesaj Gönderin</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Adınız Soyadınız *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Adınız Soyadınız"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresiniz *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="Mesajınızın konusu"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Mesajınız *</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Mesajınızı buraya yazın..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Gönder
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-6">
            <div className="bg-gray-200 rounded-lg overflow-hidden h-80">
              {/* Harita konumunu da dinamik olarak alabilirdik - getSetting("map_embed_url") gibi */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d388023.91046272454!2d29.863454829166795!3d39.77529262429333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cc17cc61caa80b%3A0xb1d6933ce39f59de!2sEski%C5%9Fehir%2C%20T%C3%BCrkiye!5e0!3m2!1str!2str!4v1683888475221!5m2!1str!2str"
                width="100%"
                height="100%"
                loading="lazy"
                title="Divona Garden Harita"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
