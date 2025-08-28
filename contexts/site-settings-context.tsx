"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { getSiteSettings } from "@/lib/admin-service"

type SiteSettingsContextType = {
  settings: Record<string, string>
  getSetting: (key: string) => string
  isLoading: boolean
  error: string | null
}

// Varsayılan ayarlar
const defaultSettings: Record<string, string> = {
  site_name: "Divona Garden",
  site_description: "Bahçe mobilyaları ve dış mekan dekorasyonu",
  contact_email: "info@divonagarden.com",
  contact_phone: "+90 555 123 4567",
  address: "İstanbul, Türkiye",
  shipping_fee: "50",
  free_shipping_threshold: "5000",
  whatsapp_number: "+90 555 123 4567",
  whatsapp_message: "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.",
  kargo_ucreti: "50",
  ucretsiz_kargo_esigi: "5000",
  kisa_bilgi: "Divona Garden, bahçe mobilyaları ve dış mekan dekorasyonu konusunda Türkiye'nin önde gelen markasıdır.",
  telefon_numarasi: "+90 555 123 4567",
  adres: "İstanbul, Türkiye",
  banka_adi: "Ziraat Bankası",
  hesap_sahibi: "Divona Garden Ltd. Şti.",
  whatsapp_numarasi: "+90 555 123 4567",
  varsayilan_mesaj: "Merhaba, ürünleriniz hakkında bilgi almak istiyorum.",
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: defaultSettings,
  getSetting: () => "",
  isLoading: true,
  error: null,
})

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, string>>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        // Fetch işlemini try-catch bloğu içinde yap
        let data
        try {
          data = await getSiteSettings()
        } catch (fetchError) {
          console.error("Fetch işlemi başarısız:", fetchError)
          // Fetch hatası durumunda varsayılan ayarları kullan
          setError("Site ayarları yüklenirken bir hata oluştu. Varsayılan ayarlar kullanılıyor.")
          setSettings(defaultSettings)
          setIsLoading(false)
          return
        }

        const settingsObj: Record<string, string> = { ...defaultSettings }

        if (data && Array.isArray(data)) {
          data.forEach((setting) => {
            if (setting && setting.key && setting.value) {
              settingsObj[setting.key] = setting.value
            }
          })
        } else {
          // Varsayılan ayarları kullan
          console.warn("Site ayarları alınamadı veya boş, varsayılan ayarlar kullanılıyor")
        }

        setSettings(settingsObj)
        setError(null)
      } catch (error) {
        console.error("Site ayarları işlenirken hata:", error)
        setError("Site ayarları yüklenirken bir hata oluştu. Varsayılan ayarlar kullanılıyor.")
        // Varsayılan ayarları kullanmaya devam et
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const getSetting = (key: string): string => {
    // Eğer doğrudan key ile bulunamazsa, alternatif keyleri kontrol et
    if (settings[key]) return settings[key]

    // Türkçe-İngilizce anahtar eşleştirmeleri
    const keyMappings: Record<string, string[]> = {
      shipping_fee: ["kargo_ucreti"],
      free_shipping_threshold: ["ucretsiz_kargo_esigi"],
      about_short: ["kisa_bilgi"],
      phone: ["telefon_numarasi"],
      address: ["adres"],
      bank_name: ["banka_adi"],
      account_holder: ["hesap_sahibi"],
      whatsapp_number: ["whatsapp_numarasi"],
      whatsapp_message: ["varsayilan_mesaj"],
    }

    // Eşleşen alternatif anahtarları kontrol et
    if (keyMappings[key]) {
      for (const altKey of keyMappings[key]) {
        if (settings[altKey]) return settings[altKey]
      }
    }

    // Tersine eşleştirme
    for (const [mainKey, altKeys] of Object.entries(keyMappings)) {
      if (altKeys.includes(key) && settings[mainKey]) {
        return settings[mainKey]
      }
    }

    // Varsayılan değerleri kontrol et
    if (defaultSettings[key]) return defaultSettings[key]

    return ""
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, getSetting, isLoading, error }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
