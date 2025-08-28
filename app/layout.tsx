import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { SiteSettingsProvider } from "@/contexts/site-settings-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Divona Garden - Bahçe Mobilyaları",
  description: "Bahçe mobilyaları ve dış mekan dekorasyonu için Divona Garden",
  icons: [
    {
      rel: "icon",
      url: "/divona-garden-logo-new.png",
    },
    {
      rel: "apple-touch-icon",
      url: "/divona-garden-logo-new.png",
    },
  ],
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/divona-garden-logo-new.png" />
        <link rel="apple-touch-icon" href="/divona-garden-logo-new.png" />
      </head>
      <body className={inter.className}>
        <SiteSettingsProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              {children}
            </CartProvider>
          </AuthProvider>
        </SiteSettingsProvider>
      </body>
    </html>
  )
}
