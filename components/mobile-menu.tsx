"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  X,
  ChevronRight,
  LogOut,
  Info,
  Phone,
  Search,
  ShoppingBag,
  FileText,
  Shield,
  HelpCircle,
  MapPin,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const { cartItems } = useCart()
  const [mounted, setMounted] = useState(false)

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Menü</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Ürün ara..."
              className="w-full p-2 pl-8 border border-gray-300 rounded-md"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Main Menu Content - with proper overflow scrolling */}
        <div className="flex-1 overflow-y-auto">
          {/* Primary Navigation Links */}
          <div>
            <Link
              href="/"
              className={`flex justify-between items-center p-4 border-b ${
                pathname === "/" ? "text-primary" : "text-gray-800"
              }`}
              onClick={onClose}
            >
              <span>Tüm Ürünler</span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href="/kampanyali-urunler"
              className={`flex justify-between items-center p-4 border-b ${
                pathname === "/kampanyali-urunler" ? "text-primary" : "text-gray-800"
              }`}
              onClick={onClose}
            >
              <span>Kampanyalı Ürünler</span>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href="/siparis-takibi"
              className={`flex justify-between items-center p-4 border-b ${
                pathname === "/siparis-takibi" ? "text-primary" : "text-gray-800"
              }`}
              onClick={onClose}
            >
              <div className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                <span>Sipariş Takibi</span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Link>

            <Link
              href="/sepet"
              className={`flex justify-between items-center p-4 border-b ${
                pathname === "/sepet" ? "text-primary" : "text-gray-800"
              }`}
              onClick={onClose}
            >
              <div className="flex items-center">
                <ShoppingBag className="h-5 w-5 mr-2" />
                <span>Sepetim</span>
                {cartItemCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-primary text-white rounded-full">{cartItemCount}</span>
                )}
              </div>
              <ChevronRight className="h-5 w-5" />
            </Link>

            {user && (
              <>
                <Link
                  href="/hesabim"
                  className={`flex justify-between items-center p-4 border-b ${
                    pathname === "/hesabim" ? "text-primary" : "text-gray-800"
                  }`}
                  onClick={onClose}
                >
                  <span>Hesabım</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/hesabim/siparislerim"
                  className={`flex justify-between items-center p-4 border-b ${
                    pathname === "/hesabim/siparislerim" ? "text-primary" : "text-gray-800"
                  }`}
                  onClick={onClose}
                >
                  <span>Siparişlerim</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/hesabim/favorilerim"
                  className={`flex justify-between items-center p-4 border-b ${
                    pathname === "/hesabim/favorilerim" ? "text-primary" : "text-gray-800"
                  }`}
                  onClick={onClose}
                >
                  <span>Favorilerim</span>
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </>
            )}
          </div>

          {/* Kurumsal Section */}
          <div className="py-2 border-t">
            <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Kurumsal</div>
            <Link
              href="/hakkimizda"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <Info className="w-5 h-5 mr-3" />
              Hakkımızda
            </Link>
            <Link
              href="/iletisim"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <Phone className="w-5 h-5 mr-3" />
              İletişim
            </Link>
            <Link
              href="/sikca-sorulan-sorular"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <HelpCircle className="w-5 h-5 mr-3" />
              Sıkça Sorulan Sorular
            </Link>
            <Link
              href="/magaza-konumlari"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <MapPin className="w-5 h-5 mr-3" />
              Mağaza Konumları
            </Link>
          </div>

          {/* Legal Section */}
          <div className="py-2 border-t">
            <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">Yasal</div>
            <Link
              href="/kvkk"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <Shield className="w-5 h-5 mr-3" />
              KVKK
            </Link>
            <Link
              href="/gizlilik-politikasi"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <FileText className="w-5 h-5 mr-3" />
              Gizlilik Politikası
            </Link>
            <Link
              href="/kullanim-kosullari"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <FileText className="w-5 h-5 mr-3" />
              Kullanım Koşulları
            </Link>
            <Link
              href="/iade-kosullari"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100"
              onClick={onClose}
            >
              <FileText className="w-5 h-5 mr-3" />
              İade Koşulları
            </Link>
          </div>
        </div>

        {/* Login/Logout Section - Fixed at bottom */}
        <div className="border-t">
          {user ? (
            <button
              onClick={() => {
                signOut()
                onClose()
              }}
              className="flex items-center w-full p-4 text-gray-800 hover:bg-gray-100"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span>Çıkış Yap</span>
            </button>
          ) : (
            <Link
              href="/giris-yap"
              className="flex items-center w-full p-4 text-gray-800 hover:bg-gray-100"
              onClick={onClose}
            >
              <span>Giriş Yap / Üye Ol</span>
              <ChevronRight className="h-5 w-5 ml-auto" />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
