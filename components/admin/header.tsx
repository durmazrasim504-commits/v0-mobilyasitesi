"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAdmin } from "@/contexts/admin-context"
import { Menu, X, Bell, User, Sun, Moon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

export function AdminHeader() {
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAdmin()
  const { theme, setTheme } = useTheme()

  // Tema değişikliğinin hydration sorunlarını önlemek için
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="bg-background border-b sticky top-0 z-40">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Menüyü aç</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo - Mobile */}
        <div className="md:hidden">
          <Link href="/admin/dashboard" className="text-lg font-bold">
            Divona Admin
          </Link>
        </div>

        {/* Right side navigation */}
        <div className="flex items-center ml-auto gap-2">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Tema değiştir</span>
            </Button>
          )}

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Bildirimler</span>
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-primary/10">
                <User className="h-4 w-4" />
                <span className="sr-only">Kullanıcı menüsü</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.full_name || user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin/settings">Ayarlar</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/admin/dashboard"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ürünler
            </Link>
            <Link
              href="/admin/categories"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kategoriler
            </Link>
            <Link
              href="/admin/orders"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Siparişler
            </Link>
            <Link
              href="/admin/users"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kullanıcılar
            </Link>
            <Link
              href="/admin/settings"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Site Ayarları
            </Link>
            <Link
              href="/admin/hero-carousel"
              className="block pl-3 pr-4 py-2 text-base font-medium text-foreground hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Hero Carousel
            </Link>
            <button
              onClick={() => {
                logout()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-destructive hover:bg-destructive/10"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
