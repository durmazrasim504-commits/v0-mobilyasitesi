"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, LogOut, Heart, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { useSiteSettings } from "@/contexts/site-settings-context"
import SearchBar from "./search-bar"
import Logo from "./logo"
import MobileMenu from "./mobile-menu"

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, signOut } = useAuth()
  const { cartItems } = useCart()
  const { getSetting } = useSiteSettings()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const freeShippingThreshold = Number.parseFloat(
    getSetting("free_shipping_threshold") || getSetting("ucretsiz_kargo_esigi") || "5000",
  )

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-sm" : ""}`}>
      {/* Top Bar - Only on Desktop */}
      <div className="hidden md:block bg-primary-50 border-b border-primary-100/50">
        <div className="container mx-auto px-4 flex justify-between items-center py-1.5">
          <div className="text-xs flex items-center">
            <Bell className="h-3 w-3 mr-1.5 text-primary" />
            <span className="font-medium text-primary">Ücretsiz Kargo</span> -{" "}
            <span className="text-gray-600">
              {freeShippingThreshold.toLocaleString("tr-TR")} TL ve üzeri siparişlerde
            </span>
          </div>
          <div className="flex space-x-4 text-xs">
            <Link href="/hakkimizda" className="text-gray-600 hover:text-primary transition-colors">
              Hakkımızda
            </Link>
            <Link href="/iletisim" className="text-gray-600 hover:text-primary transition-colors">
              İletişim
            </Link>
            <Link href="/siparis-takibi" className="text-gray-600 hover:text-primary transition-colors">
              Sipariş Takibi
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? "py-2" : "py-2.5 md:py-3"}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2 hover:bg-primary-50 hover:text-primary"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menü</span>
            </Button>
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Logo size="small" />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <SearchBar />
            </div>

            {/* Mobile Search Toggle */}
            <div className="flex items-center space-x-2 md:space-x-5">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:bg-primary-50 hover:text-primary"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <Search className="h-4.5 w-4.5" />
                <span className="sr-only">Ara</span>
              </Button>

              {/* User Actions */}
              {user ? (
                <div className="hidden md:flex items-center space-x-5">
                  <div className="group relative">
                    <Link href="/hesabim" className="flex items-center text-sm hover:text-primary transition-colors">
                      <User className="h-4.5 w-4.5 mr-1.5" />
                      <span>Hesabım</span>
                    </Link>
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white shadow-md rounded-sm overflow-hidden z-50 hidden group-hover:block border border-gray-100">
                      <Link
                        href="/hesabim"
                        className="block px-3 py-1.5 text-sm hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        Hesap Bilgilerim
                      </Link>
                      <Link
                        href="/hesabim/siparislerim"
                        className="block px-3 py-1.5 text-sm hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        Siparişlerim
                      </Link>
                      <Link
                        href="/hesabim/favorilerim"
                        className="block px-3 py-1.5 text-sm hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        <div className="flex items-center">
                          <Heart className="h-3.5 w-3.5 mr-1.5" />
                          <span>Favorilerim</span>
                        </div>
                      </Link>
                      <Link
                        href="/hesabim/adreslerim"
                        className="block px-3 py-1.5 text-sm hover:bg-primary-50 hover:text-primary transition-colors"
                      >
                        Adreslerim
                      </Link>
                      <button
                        onClick={() => signOut()}
                        className="w-full text-left px-3 py-1.5 text-sm hover:bg-primary-50 hover:text-primary transition-colors flex items-center"
                      >
                        <LogOut className="h-3.5 w-3.5 mr-1.5" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/giris-yap"
                  className="hidden md:flex items-center text-sm hover:text-primary transition-colors"
                >
                  <User className="h-4.5 w-4.5 mr-1.5" />
                  <span>Giriş Yap</span>
                </Link>
              )}
              <Link href="/sepet" className="flex items-center hover:text-primary transition-colors">
                <div className="relative">
                  <ShoppingBag className="h-4.5 w-4.5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline text-sm ml-1.5">Sepetim</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search - Conditional */}
          {isSearchOpen && (
            <div className="mt-2 md:hidden">
              <SearchBar variant="mobile" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation - Desktop Only */}
      <nav className="hidden md:block border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6">
            <li>
              <Link href="/urunler" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Tüm Ürünler
              </Link>
            </li>
            <li>
              <Link href="/kategoriler" className="block py-2 text-sm font-medium hover:text-primary transition-colors">
                Kategoriler
              </Link>
            </li>
            <li>
              <Link
                href="/kampanyali-urunler"
                className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Kampanyalı Ürünler
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
