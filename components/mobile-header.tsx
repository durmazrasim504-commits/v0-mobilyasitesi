"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingCart, User } from "lucide-react"
import MobileMenu from "./mobile-menu"
import { useCart } from "@/contexts/cart-context"
import SearchBar from "./search-bar"
import Logo from "./logo"
import { useAuth } from "@/contexts/auth-context"

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { cartItems } = useCart()
  const { user } = useAuth()

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Menu"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>

          <Link href="/" className="flex-shrink-0">
            <Logo size="small" />
          </Link>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href={user ? "/hesabim" : "/giris-yap"}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <User className="h-5 w-5" />
            </Link>

            <Link href="/sepet" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {isSearchOpen && (
          <div className="px-4 pb-4 animate-slideDown">
            <SearchBar variant="mobile" placeholder="Hangi ürünü arıyorsunuz?" />
          </div>
        )}
      </header>
    </>
  )
}

export default MobileHeader
