"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteSettings, updateMultipleSettings } from "@/lib/admin-service"
import { Loader2, Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, MessageSquare } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminContactSettingsPage() {
  const [settings, setSettings] = useState({
    phone: "",
    email: "",
    address: "",
    whatsapp_number: "",
    whatsapp_message: "",
    facebook_url: "",
    instagram_url: "",
    twitter_url: "",
    youtube_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings()
        const settingsObj: any = {}

        data.forEach((setting) => {
          if (Object.keys(settings).includes(setting.key)) {
            settingsObj[setting.key] = setting.value
          }
        })

        setSettings((prev) => ({
          ...prev,
          ...settingsObj,
        }))
      } catch (error) {
        console.error("Ayarlar alınırken hata oluştu:", error)
        toast({
          variant: "destructive",
          title: "Hata",
          description: "İletişim ayarları alınırken bir hata oluştu.",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [toast])

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const saveSettings = async () => {
    setSaving(true)

    try {
      const settingsToUpdate = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value || "",
      }))

      await updateMultipleSettings(settingsToUpdate)

      toast({
        title: "Başarılı",
        description: "İletişim ayarları başarıyla güncellendi.",
      })

      // Sayfayı yenile
      router.refresh()
    } catch (error) {
      console.error("Ayarlar güncellenirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İletişim ayarları güncellenirken bir hata oluştu.",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">İletişim Ayarları</h1>
        <p className="text-muted-foreground">
          İletişim bilgilerinizi ve sosyal medya hesaplarınızı buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md transition-all hover:shadow-lg">
          <CardHeader className="bg-muted/50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              İletişim Bilgileri
            </CardTitle>
            <CardDescription>Müşterilerinizin size ulaşabileceği iletişim bilgilerini düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon Numarası
              </Label>
              <Input
                id="phone"
                value={settings.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+90 212 123 45 67"
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-posta Adresi
              </Label>
              <Input
                id="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="info@divonagarden.com"
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Adres
              </Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder="Örnek Mahallesi, Örnek Caddesi No:123, İstanbul"
                rows={3}
                className="focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 rounded-b-lg">
            <Button onClick={saveSettings} disabled={saving} className="transition-all hover:shadow-md">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-md transition-all hover:shadow-lg">
          <CardHeader className="bg-muted/50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              WhatsApp Ayarları
            </CardTitle>
            <CardDescription>WhatsApp iletişim bilgilerinizi düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Numarası</Label>
              <Input
                id="whatsapp_number"
                value={settings.whatsapp_number}
                onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                placeholder="+905551234567"
                className="focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground">Uluslararası formatta girin (örn: +905551234567)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_message">Varsayılan Mesaj</Label>
              <Textarea
                id="whatsapp_message"
                value={settings.whatsapp_message}
                onChange={(e) => handleChange("whatsapp_message", e.target.value)}
                placeholder="Merhaba, Divona Garden hakkında bilgi almak istiyorum."
                rows={3}
                className="focus-visible:ring-primary"
              />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 rounded-b-lg">
            <Button onClick={saveSettings} disabled={saving} className="transition-all hover:shadow-md">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="border-none shadow-md transition-all hover:shadow-lg md:col-span-2">
          <CardHeader className="bg-muted/50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Facebook className="h-5 w-5" />
              Sosyal Medya
            </CardTitle>
            <CardDescription>Sosyal medya hesaplarınızın bağlantılarını düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook_url" className="flex items-center gap-2">
                  <Facebook className="h-4 w-4" />
                  Facebook URL
                </Label>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url}
                  onChange={(e) => handleChange("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url" className="flex items-center gap-2">
                  <Instagram className="h-4 w-4" />
                  Instagram URL
                </Label>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url}
                  onChange={(e) => handleChange("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url" className="flex items-center gap-2">
                  <Twitter className="h-4 w-4" />
                  Twitter URL
                </Label>
                <Input
                  id="twitter_url"
                  value={settings.twitter_url}
                  onChange={(e) => handleChange("twitter_url", e.target.value)}
                  placeholder="https://twitter.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube URL
                </Label>
                <Input
                  id="youtube_url"
                  value={settings.youtube_url}
                  onChange={(e) => handleChange("youtube_url", e.target.value)}
                  placeholder="https://youtube.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/30 rounded-b-lg">
            <Button onClick={saveSettings} disabled={saving} className="transition-all hover:shadow-md">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kaydediliyor
                </>
              ) : (
                "Kaydet"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
