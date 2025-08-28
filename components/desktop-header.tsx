import Link from "next/link"
import { Search, User, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import Logo from "./logo"

const DesktopHeader = () => {
  const categories = [
    { name: "Bahçe Mobilyası", href: "/bahce-mobilyasi" },
    { name: "Bahçe Oturma Grubu", href: "/bahce-oturma-grubu" },
    { name: "Bahçe Köşe Takımı", href: "/bahce-kose-takimi" },
    { name: "Masa Takımı", href: "/masa-takimi" },
    { name: "Masa", href: "/masa" },
    { name: "Sandalye", href: "/sandalye" },
    { name: "Saksı & Çiçek", href: "/saksi-cicek" },
    { name: "Şemsiye", href: "/semsiye" },
    { name: "Şezlong", href: "/sezlong" },
    { name: "Aksesuar", href: "/aksesuar" },
    { name: "Aydınlatma", href: "/aydinlatma" },
   /* { name: "Yeni Ürünler", href: "/yeni-urunler", className: "text-red-500 font-medium" },*/
    { name: "Proje Ürünler", href: "/proje-urunler", className: "bg-yellow-400 px-4 py-2 font-medium" },
    { name: "Garage Sale", href: "/garage-sale", className: "bg-green-500 text-white px-4 py-2 font-medium" },
  ]

  return (
    <header className="hidden md:block sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex space-x-4">
            <Link href="/mimarlik-hizmeti" className="text-sm hover:text-green-500">
              Mimarlık Hizmeti
            </Link>
            <Link href="/showroomlar" className="text-sm hover:text-green-500">
              Showroomlar
            </Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/siparis-takibi" className="text-sm hover:text-green-500">
              Sipariş Takibi
            </Link>
            <Link href="/iletisim" className="text-sm hover:text-green-500">
              İletişim
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Logo size="medium" />
        </Link>

        {/* Search Bar */}
        <div className="flex flex-1 mx-4 max-w-md relative">
          <Input type="text" placeholder="Hangi ürünü arıyorsunuz?" className="w-full pr-10 rounded-full" />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-6">
          <Link href="/hesabim" className="flex items-center space-x-2 group">
            <User className="h-5 w-5 group-hover:text-green-500" />
            <span className="group-hover:text-green-500">Hesabım</span>
          </Link>
          <Link href="/sepet" className="flex items-center space-x-2 group">
            <div className="relative">
              <ShoppingCart className="h-5 w-5 group-hover:text-green-500" />
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                0
              </span>
            </div>
            <span className="group-hover:text-green-500">Sepet</span>
          </Link>
        </div>
      </div>

      {/* Categories Navigation */}
      <nav className="border-t border-gray-200 overflow-x-auto">
        <div className="container mx-auto">
          <ul className="flex space-x-1 whitespace-nowrap">
            {categories.map((category, index) => (
              <li key={index}>
                <Link
                  href={category.href}
                  className={category.className || "px-3 py-2 inline-block hover:text-green-500"}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default DesktopHeader
