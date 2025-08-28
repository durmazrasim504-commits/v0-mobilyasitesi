"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Search, Package, X, Info, Phone, FileText, Shield, HelpCircle, MapPin } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"

export default function MobileNav() {
  const pathname = usePathname()
  const { cartItems } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const closeMenu = () => setIsOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menü</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <SheetHeader className="border-b p-4">
          <SheetTitle className="flex justify-between items-center">
            <span>Menü</span>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 px-4">
          <div className="mb-6">
            <form className="relative w-full ">
              <Input placeholder="Ürün ara..." />
              <Button type="submit" size="icon" className="w-10 absolute right-0 top-0 h-full rounded-full">
                <Search className="h-4 w-4" />
                <span className="sr-only">Ara</span>
              </Button>
            </form>
          </div>
          <nav className="space-y-1">
            <Link href="/urunler" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={closeMenu}>
              Tüm Ürünler
            </Link>
      
            <Link
              href="/kampanyali-urunler"
              className="block py-2 px-3 rounded-md hover:bg-gray-100"
              onClick={closeMenu}
            >
              Kampanyalı Ürünler
            </Link>
            <Link href="/siparis-takibi" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={closeMenu}>
              <span className="flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Sipariş Takibi
              </span>
            </Link>

            {/* Login/Account based on auth status */}
            {isAuthenticated ? (
              <Link href="/hesabim" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={closeMenu}>
                Hesabım
              </Link>
            ) : (
              <Link href="/giris-yap" className="block py-2 px-3 rounded-md hover:bg-gray-100" onClick={closeMenu}>
                Giriş Yap
              </Link>
            )}

            {/* Kurumsal Section */}
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 px-3">Kurumsal</h3>
              <Link
                href="/hakkimizda"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <Info className="h-4 w-4 mr-2" />
                Hakkımızda
              </Link>
              <Link
                href="/iletisim"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <Phone className="h-4 w-4 mr-2" />
                İletişim
              </Link>
              <Link
                href="/sikca-sorulan-sorular"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Sıkça Sorulan Sorular
              </Link>
              <Link
                href="/magaza-konumlari"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Mağaza Konumları
              </Link>
            </div>

            {/* Yasal Section */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2 px-3">Yasal</h3>
              <Link
                href="/kvkk"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <Shield className="h-4 w-4 mr-2" />
                KVKK
              </Link>
              <Link
                href="/gizlilik-politikasi"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <FileText className="h-4 w-4 mr-2" />
                Gizlilik Politikası
              </Link>
              <Link
                href="/kullanim-kosullari"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <FileText className="h-4 w-4 mr-2" />
                Kullanım Koşulları
              </Link>
              <Link
                href="/iade-kosullari"
                className="block py-2 px-3 rounded-md hover:bg-gray-100 flex items-center"
                onClick={closeMenu}
              >
                <FileText className="h-4 w-4 mr-2" />
                İade Koşulları
              </Link>
            </div>

            {/* Remove the Login/Register at the bottom since we now have it in the main nav */}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
