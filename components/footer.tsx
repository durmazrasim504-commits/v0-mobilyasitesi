"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import {
  Shield,
  CreditCard,
  Truck,
  Award,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react"
import Logo from "./logo"
import { useSiteSettings } from "@/contexts/site-settings-context"
import MobileBottomNav from "./mobile-bottom-nav"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export default function Footer() {
  const { user } = useAuth()

  // İletişim bilgileri kısmını güncelleyelim
  const { getSetting } = useSiteSettings()

  // İletişim bilgileri
  const phone = getSetting("phone") || getSetting("telefon_numarasi") || "0 850 305 86 07"
  const email = getSetting("email") || "info@divonagarden.com"
  const address = getSetting("address") || getSetting("adres") || "İmişehir OSB 2001 Cadde No:16 Odunpazarı / ESKİŞEHİR"

  // Sosyal medya bağlantıları
  const facebookUrl = getSetting("facebook_url") || "https://facebook.com"
  const instagramUrl = getSetting("instagram_url") || "https://instagram.com"
  const twitterUrl = getSetting("twitter_url") || "https://twitter.com"
  const youtubeUrl = getSetting("youtube_url") || "https://youtube.com"

  // Kısa bilgi
  const aboutShort =
    getSetting("about_short") ||
    getSetting("kisa_bilgi") ||
    "Divona Garden, bahçe mobilyaları ve dış mekan dekorasyonu konusunda Türkiye'nin önde gelen markasıdır. Kaliteli ve şık ürünlerimizle bahçenizi güzelleştiriyoruz."

  return (
    <footer className="bg-white">
      {/* Newsletter Section */}
      <div className="bg-primary-50 py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Bültenimize Abone Olun</h3>
              <p className="text-gray-600">En yeni ürünler ve kampanyalardan haberdar olun</p>
            </div>
            <div className="w-full md:w-auto flex-1 max-w-md">
              <form className="flex gap-2">
                <Input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 bg-white border-primary-200 focus:border-primary focus:ring-primary"
                />
                <Button type="submit">Abone Ol</Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-b py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-50 rounded-full p-4 mb-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Güvenli Alışveriş</h4>
              <p className="text-xs text-gray-500 mt-1">256-bit SSL Güvenliği</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-50 rounded-full p-4 mb-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Güvenli Ödeme</h4>
              <p className="text-xs text-gray-500 mt-1">Tüm Kredi Kartları</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-50 rounded-full p-4 mb-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Hızlı Teslimat</h4>
              <p className="text-xs text-gray-500 mt-1">Tüm Türkiye'ye</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-50 rounded-full p-4 mb-3">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-sm">Kalite Garantisi</h4>
              <p className="text-xs text-gray-500 mt-1">2 Yıl Garanti</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo ve İletişim */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-6">
              {/* Footer için özel olarak large boyutunda logo kullanıyoruz */}
              <Logo size="large" className="transform scale-110" />
            </Link>
            {/* Kısa bilgi kısmını güncelleyelim */}
            <p className="text-gray-600 text-sm mb-6">{aboutShort}</p>

            {/* İletişim Bilgileri - Mobil ve Desktop */}
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full p-2 mr-3">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{phone}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-primary-50 rounded-full p-2 mr-3">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{email}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary-50 rounded-full p-2 mr-3 mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{address}</p>
                </div>
              </div>
            </div>

            {/* Sosyal Medya - Mobil ve Desktop */}
            <div className="flex space-x-3 mt-6">
              <Link
                href={facebookUrl}
                className="bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors rounded-full p-2"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href={instagramUrl}
                className="bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors rounded-full p-2"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={twitterUrl}
                className="bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors rounded-full p-2"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href={youtubeUrl}
                className="bg-primary-50 text-primary hover:bg-primary hover:text-white transition-colors rounded-full p-2"
                aria-label="Youtube"
              >
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Kategoriler */}
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b">Kategoriler</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/bahce-oturma-grubu"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Bahçe Oturma Grubu
                </Link>
              </li>
              <li>
                <Link
                  href="/kategori/bahce-kose-takimi"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Bahçe Köşe Takımı
                </Link>
              </li>
              <li>
                <Link
                  href="/kategori/masa-takimi"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Masa Takımı
                </Link>
              </li>
              <li>
                <Link
                  href="/kategori/sezlong"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Şezlong
                </Link>
              </li>
              <li>
                <Link
                  href="/kategori/sandalye"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Sandalye
                </Link>
              </li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b">Kurumsal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/hakkimizda"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-600 hover:text-primary transition-colors flex items-center">
                  <span className="mr-2">•</span>
                  İletişim
                </Link>
              </li>
              <li>
                <Link
                  href="/kullanim-kosullari"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Kullanım Koşulları
                </Link>
              </li>
              <li>
                <Link
                  href="/gizlilik-politikasi"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link
                  href="/iade-kosullari"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  İade Koşulları
                </Link>
              </li>
              <li>
                <Link
                  href="/sikca-sorulan-sorular"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Sıkça Sorulan Sorular
                </Link>
              </li>
              <li>
                <Link
                  href="/magaza-konumlari"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Mağaza Konumları
                </Link>
              </li>
            </ul>
          </div>

          {/* Hesabım */}
          <div>
            <h3 className="font-bold text-lg mb-4 pb-2 border-b">Hesabım</h3>
            <ul className="space-y-2">
              {user ? (
                <>
                  <li>
                    <Link
                      href="/hesabim"
                      className="text-gray-600 hover:text-primary transition-colors flex items-center"
                    >
                      <span className="mr-2">•</span>
                      Hesabım
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hesabim/siparislerim"
                      className="text-gray-600 hover:text-primary transition-colors flex items-center"
                    >
                      <span className="mr-2">•</span>
                      Siparişlerim
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hesabim/favorilerim"
                      className="text-gray-600 hover:text-primary transition-colors flex items-center"
                    >
                      <span className="mr-2">•</span>
                      Favorilerim
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/hesabim/adreslerim"
                      className="text-gray-600 hover:text-primary transition-colors flex items-center"
                    >
                      <span className="mr-2">•</span>
                      Adreslerim
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/giris-yap"
                      className="text-gray-600 hover:text-primary transition-colors flex items-center"
                    >
                      <span className="mr-2">•</span>
                      Giriş Yap
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/uye-ol"
                      className="text-gray-600 hover:text-primary transition-colors flex items-center"
                    >
                      <span className="mr-2">•</span>
                      Üye Ol
                    </Link>
                  </li>
                </>
              )}
              <li>
                <Link
                  href="/siparis-takibi"
                  className="text-gray-600 hover:text-primary transition-colors flex items-center"
                >
                  <span className="mr-2">•</span>
                  Sipariş Takibi
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* International Shipping Flags */}

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-wrap justify-center gap-6 items-center mb-8">
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/turkey-flag.png"
                alt="Türkiye"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/germany-flag.png"
                alt="Almanya"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/france-flag.png"
                alt="Fransa"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/ukraine-flag.png"
                alt="Ukrayna"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/belgium-flag.png"
                alt="Belçika"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="w-12 h-12 overflow-hidden rounded-full border-2 border-gray-200 hover:border-primary transition-all">
              <Image
                src="/flags/usa-flag.png"
                alt="ABD"
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Divona Garden. Tüm hakları saklıdır.
            </p>

            <div className="flex gap-4">
              <Link href="/ssl-sertifikasi" className="text-xs text-gray-500 hover:text-primary transition-colors">
                SSL Sertifikası
              </Link>
              <Link href="/guvenli-alisveris" className="text-xs text-gray-500 hover:text-primary transition-colors">
                Güvenli Alışveriş
              </Link>
              <Link href="/kvkk" className="text-xs text-gray-500 hover:text-primary transition-colors">
                KVKK
              </Link>
            </div>
          </div>

          <div className="mt-6 flex justify-center items-center pb-8">
            <div className="flex items-center">
              <Link href="https://etbis.gov.tr" target="_blank" rel="noopener noreferrer" className="mr-4">
                <Image src="/etbis-qr.png" alt="ETBIS" width={100} height={100} className="object-contain" />
              </Link>
              <div>
                <p className="text-xs text-gray-500">ETBIS - E-Ticaret Bilgi Sistemi</p>
                <p className="text-xs text-gray-500 font-bold">ETBİS'e Kayıtlıdır</p>
                <p className="text-xs text-gray-500">Güvenli E-Ticaret</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </footer>
  )
}
