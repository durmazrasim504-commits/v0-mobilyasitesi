"use client"

import Link from "next/link"
import { Home, Search, ShoppingBag, User, LogIn } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export default function MobileBottomNav() {
  const { user } = useAuth()
  const { cartItems } = useCart()
  const pathname = usePathname()

  // Calculate total items in cart
  const cartItemCount =
    cartItems && cartItems.length > 0 ? cartItems.reduce((total, item) => total + (item.quantity || 0), 0) : 0

  const navItems = [
    {
      href: "/",
      label: "Ana Sayfa",
      icon: Home,
    },
    {
      href: "/arama",
      label: "Ara",
      icon: Search,
    },
    {
      href: "/sepet",
      label: "Sepet",
      icon: ShoppingBag,
      badge: cartItemCount > 0 ? cartItemCount : null,
    },
    {
      href: user ? "/hesabim" : "/giris-yap",
      label: user ? "Hesabım" : "Giriş",
      icon: user ? User : LogIn,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-40 md:hidden">
      <div className="grid grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-2 hover:text-primary transition-colors",
              pathname === item.href ? "text-primary" : "text-gray-600",
            )}
          >
            <div className="relative">
              <item.icon className="h-6 w-6 mb-1" />
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
