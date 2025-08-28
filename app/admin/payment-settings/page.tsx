"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSiteSettings, updateMultipleSettings } from "@/lib/admin-service"
import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPaymentSettingsPage() {
  const [settings, setSettings] = useState({
    bank_name: "",
    account_holder: "",
    iban: "",
    shipping_fee: "",
    free_shipping_threshold: "",
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
          description: "Ödeme ayarları alınırken bir hata oluştu.",
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
        description: "Ödeme ayarları başarıyla güncellendi.",
      })

      // Sayfayı yenile
      router.refresh()
    } catch (error) {
      console.error("Ayarlar güncellenirken hata oluştu:", error)
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ödeme ayarları güncellenirken bir hata oluştu.",
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
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ödeme Ayarları</h1>
        <p className="text-muted-foreground">
          Banka hesap bilgilerinizi ve kargo ayarlarınızı buradan yönetebilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-md transition-all hover:shadow-lg">
          <CardHeader className="bg-muted/50 rounded-t-lg">
            <CardTitle>Banka Hesap Bilgileri</CardTitle>
            <CardDescription>Havale/EFT ödemeleri için banka hesap bilgilerinizi düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Banka Adı</Label>
              <Input
                id="bank_name"
                value={settings.bank_name}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                placeholder="Örnek Bank"
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account_holder">Hesap Sahibi</Label>
              <Input
                id="account_holder"
                value={settings.account_holder}
                onChange={(e) => handleChange("account_holder", e.target.value)}
                placeholder="Divona Garden Ltd. Şti."
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iban">IBAN Numarası</Label>
              <Input
                id="iban"
                value={settings.iban}
                onChange={(e) => handleChange("iban", e.target.value)}
                placeholder="TR12 3456 7890 1234 5678 9012 34"
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
            <CardTitle>Kargo Ayarları</CardTitle>
            <CardDescription>Kargo ücretlendirme ayarlarınızı düzenleyin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="shipping_fee">Kargo Ücreti (₺)</Label>
              <Input
                id="shipping_fee"
                value={settings.shipping_fee}
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
                value={settings.free_shipping_threshold}
                onChange={(e) => handleChange("free_shipping_threshold", e.target.value)}
                placeholder="1000"
                className="focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground">
                Bu tutarın üzerindeki siparişlerde kargo ücretsiz olacaktır.
              </p>
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
