"use client"

import type React from "react"

import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { useAdmin } from "@/contexts/admin-context"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/toaster"

export default function AdminTemplate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAdmin()
  const pathname = usePathname()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  // Hydration için
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Login sayfasında sidebar ve header gösterme
  if (pathname === "/admin/login") {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="min-h-screen bg-background">{children}</div>
        <Toaster />
      </ThemeProvider>
    )
  }

  // Yükleme durumunda loading göster
  if (loading || !isClient) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light">
        <div className="flex items-center justify-center min-h-screen bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Toaster />
      </ThemeProvider>
    )
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!isAuthenticated) {
    router.push("/admin/login")
    return null
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
