"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getSiteSettings, updateMultipleSettings } from "@/lib/admin-service"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface SettingsState {
  [key: string]: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await getSiteSettings()
        const settingsObj: SettingsState = {}

        data.forEach((setting) => {
          settingsObj[setting.key] = setting.value
        })

        setSettings(settingsObj)
      } catch (error) {
        console.error("Ayarlar alınırken hata oluştu:", error)
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Ayarlar alınırken bir hata oluştu.",
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

  const saveSettings = async (section: string) => {
    setSaving(true)

    try {
      // Hangi ayarların güncelleneceğini belirle
      const keysToUpdate: string[] = []

      if (section === "general") {
        keysToUpdate.push("shipping_fee", "free_shipping_threshold", "about_short")
      } else if (section === "contact") {
        keysToUpdate.push("phone", "email", "address")
      } else if (section === "social") {
        keysToUpdate.push("facebook_url", "instagram_url", "twitter_url", "youtube_url")
      } else if (section === "payment") {
        keysToUpdate.push("bank_name", "account_holder", "iban")
      } else if (section === "whatsapp") {
        keysToUpdate.push("whatsapp_number", "whatsapp_message")
      }

      // Güncellenecek ayarları hazırla
      const settingsToUpdate = keysToUpdate.map((key) => ({
        key,
        value: settings[key] || "",
      }))

      await updateMultipleSettings(settingsToUpdate)

      toast({
        title: "Başarılı",
        description: "Ayarlar başarıyla güncellendi.",
      })

      // Sayfayı yenile
      router.refresh()
    } catch (error) {
      console.error("Ayarlar güncellenirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ayarlar güncellenirken bir hata oluştu.",
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
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Ayarları</h1>
        <p className="text-muted-foreground">Sitenin genel ayarlarını buradan yönetebilirsiniz.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-5 md:w-auto w-full">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="payment">Ödeme</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/50 rounded-t-lg">
              <CardTitle>Genel Ayarlar</CardTitle>
              <CardDescription>Sitenin genel ayarlarını buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping_fee">Kargo Ücreti (₺)</Label>
                  <Input
                    id="shipping_fee"
                    value={settings.shipping_fee || ""}
                    onChange={(e) => handleChange("shipping_fee", e.target.value)}
                    placeholder="0"
                    className="focus-visible:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">0 = Ücretsiz kargo</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="free_shipping_threshold">Ücretsiz Kargo Eşiği (₺)</Label>
                  <Input
                    id="free_shipping_threshold"
                    value={settings.free_shipping_threshold || ""}
                    onChange={(e) => handleChange("free_shipping_threshold", e.target.value)}
                    placeholder="1000"
                    className="focus-visible:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="about_short">Kısa Hakkımızda Metni</Label>
                <Textarea
                  id="about_short"
                  value={settings.about_short || ""}
                  onChange={(e) => handleChange("about_short", e.target.value)}
                  placeholder="Divona Garden, bahçe mobilyaları ve dış mekan dekorasyonu konusunda Türkiye'nin önde gelen markasıdır."
                  rows={3}
                  className="focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 rounded-b-lg">
              <Button
                onClick={() => saveSettings("general")}
                disabled={saving}
                className="transition-all hover:shadow-md"
              >
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
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/50 rounded-t-lg">
              <CardTitle>İletişim Bilgileri</CardTitle>
              <CardDescription>Sitenin iletişim bilgilerini buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon Numarası</Label>
                <Input
                  id="phone"
                  value={settings.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+90 212 123 45 67"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  value={settings.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="info@divonagarden.com"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Textarea
                  id="address"
                  value={settings.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Örnek Mahallesi, Örnek Caddesi No:123, İstanbul"
                  rows={3}
                  className="focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 rounded-b-lg">
              <Button
                onClick={() => saveSettings("contact")}
                disabled={saving}
                className="transition-all hover:shadow-md"
              >
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
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/50 rounded-t-lg">
              <CardTitle>Sosyal Medya</CardTitle>
              <CardDescription>Sosyal medya hesaplarınızın bağlantılarını buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="facebook_url">Facebook URL</Label>
                <Input
                  id="facebook_url"
                  value={settings.facebook_url || ""}
                  onChange={(e) => handleChange("facebook_url", e.target.value)}
                  placeholder="https://facebook.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram_url">Instagram URL</Label>
                <Input
                  id="instagram_url"
                  value={settings.instagram_url || ""}
                  onChange={(e) => handleChange("instagram_url", e.target.value)}
                  placeholder="https://instagram.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter_url">Twitter URL</Label>
                <Input
                  id="twitter_url"
                  value={settings.twitter_url || ""}
                  onChange={(e) => handleChange("twitter_url", e.target.value)}
                  placeholder="https://twitter.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <Input
                  id="youtube_url"
                  value={settings.youtube_url || ""}
                  onChange={(e) => handleChange("youtube_url", e.target.value)}
                  placeholder="https://youtube.com/divonagarden"
                  className="focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 rounded-b-lg">
              <Button
                onClick={() => saveSettings("social")}
                disabled={saving}
                className="transition-all hover:shadow-md"
              >
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
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/50 rounded-t-lg">
              <CardTitle>Ödeme Bilgileri</CardTitle>
              <CardDescription>Banka hesap bilgilerinizi buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="bank_name">Banka Adı</Label>
                <Input
                  id="bank_name"
                  value={settings.bank_name || ""}
                  onChange={(e) => handleChange("bank_name", e.target.value)}
                  placeholder="Örnek Bank"
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account_holder">Hesap Sahibi</Label>
                <Input
                  id="account_holder"
                  value={settings.account_holder || ""}
                  onChange={(e) => handleChange("account_holder", e.target.value)}
                  placeholder="Divona Garden Ltd. Şti."
                  className="focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="iban">IBAN Numarası</Label>
                <Input
                  id="iban"
                  value={settings.iban || ""}
                  onChange={(e) => handleChange("iban", e.target.value)}
                  placeholder="TR12 3456 7890 1234 5678 9012 34"
                  className="focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 rounded-b-lg">
              <Button
                onClick={() => saveSettings("payment")}
                disabled={saving}
                className="transition-all hover:shadow-md"
              >
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
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          <Card className="border-none shadow-md">
            <CardHeader className="bg-muted/50 rounded-t-lg">
              <CardTitle>WhatsApp Ayarları</CardTitle>
              <CardDescription>WhatsApp iletişim bilgilerinizi buradan düzenleyebilirsiniz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp Numarası</Label>
                <Input
                  id="whatsapp_number"
                  value={settings.whatsapp_number || ""}
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
                  value={settings.whatsapp_message || ""}
                  onChange={(e) => handleChange("whatsapp_message", e.target.value)}
                  placeholder="Merhaba, Divona Garden hakkında bilgi almak istiyorum."
                  rows={3}
                  className="focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 rounded-b-lg">
              <Button
                onClick={() => saveSettings("whatsapp")}
                disabled={saving}
                className="transition-all hover:shadow-md"
              >
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
