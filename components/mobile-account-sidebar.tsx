"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileText, Heart, MapPin, Settings } from "lucide-react"

export function MobileAccountSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6 md:hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">Hesabım</h2>
      </div>
      <div className="p-2">
        <nav className="flex flex-col">
          <Link
            href="/hesabim/siparislerim"
            className={`flex items-center px-3 py-3 rounded-md ${
              isActive("/hesabim/siparislerim") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <FileText className="h-5 w-5 mr-2" />
            <span>Siparişlerim</span>
          </Link>
          <Link
            href="/hesabim/adreslerim"
            className={`flex items-center px-3 py-3 rounded-md ${
              isActive("/hesabim/adreslerim") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <MapPin className="h-5 w-5 mr-2" />
            <span>Adreslerim</span>
          </Link>
          <Link
            href="/hesabim/favorilerim"
            className={`flex items-center px-3 py-3 rounded-md ${
              isActive("/hesabim/favorilerim") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Heart className="h-5 w-5 mr-2" />
            <span>Favorilerim</span>
          </Link>
          <Link
            href="/hesabim/hesap-ayarlari"
            className={`flex items-center px-3 py-3 rounded-md ${
              isActive("/hesabim/hesap-ayarlari") ? "bg-primary-50 text-primary" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="h-5 w-5 mr-2" />
            <span>Hesap Ayarları</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
