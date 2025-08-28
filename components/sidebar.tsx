"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Heart, MapPin, Settings, Package, Star, Info, Phone, HelpCircle, Shield, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function AccountSidebar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="hidden md:block w-64 bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Hesabım</h2>
      </div>

      <div className="p-2">
        <div className="py-2">
          <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Hesap İşlemleri</h3>
          <nav className="space-y-1">
            <Link
              href="/hesabim/siparislerim"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/hesabim/siparislerim") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Package className="h-5 w-5 mr-2" />
              <span>Siparişlerim</span>
            </Link>
            <Link
              href="/hesabim/adreslerim"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/hesabim/adreslerim") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MapPin className="h-5 w-5 mr-2" />
              <span>Adreslerim</span>
            </Link>
            <Link
              href="/hesabim/favorilerim"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/hesabim/favorilerim") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Heart className="h-5 w-5 mr-2" />
              <span>Favorilerim</span>
            </Link>
            <Link
              href="/siparis-takibi"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/siparis-takibi") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Package className="h-5 w-5 mr-2" />
              <span>Sipariş Takibi</span>
            </Link>
S
            <Link
              href="/hesabim/hesap-ayarlari"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/hesabim/hesap-ayarlari") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Settings className="h-5 w-5 mr-2" />
              <span>Hesap Ayarları</span>
            </Link>
          </nav>
        </div>

        <div className="py-2 border-t mt-2">
          <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Kurumsal</h3>
          <nav className="space-y-1">
            <Link
              href="/hakkimizda"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/hakkimizda") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Info className="h-5 w-5 mr-2" />
              <span>Hakkımızda</span>
            </Link>
            <Link
              href="/iletisim"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/iletisim") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Phone className="h-5 w-5 mr-2" />
              <span>İletişim</span>
            </Link>
            <Link
              href="/sikca-sorulan-sorular"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/sikca-sorulan-sorular") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              <span>Sıkça Sorulan Sorular</span>
            </Link>
            <Link
              href="/magaza-konumlari"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/magaza-konumlari") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MapPin className="h-5 w-5 mr-2" />
              <span>Mağaza Konumları</span>
            </Link>
          </nav>
        </div>

        <div className="py-2 border-t mt-2">
          <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Yasal</h3>
          <nav className="space-y-1">
            <Link
              href="/kvkk"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/kvkk") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Shield className="h-5 w-5 mr-2" />
              <span>KVKK</span>
            </Link>
            <Link
              href="/gizlilik-politikasi"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/gizlilik-politikasi") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>Gizlilik Politikası</span>
            </Link>
            <Link
              href="/kullanim-kosullari"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/kullanim-kosullari") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>Kullanım Koşulları</span>
            </Link>
            <Link
              href="/iade-kosullari"
              className={`flex items-center px-3 py-2 rounded-md ${
                isActive("/iade-kosullari") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FileText className="h-5 w-5 mr-2" />
              <span>İade Koşulları</span>
            </Link>
          </nav>
        </div>

        {user && (
          <div className="py-2 border-t mt-2">
            <button
              onClick={() => signOut()}
              className="flex items-center px-3 py-2 w-full text-left text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
