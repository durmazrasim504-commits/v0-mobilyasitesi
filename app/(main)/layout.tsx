import type React from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsappButton from "@/components/whatsapp-button"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsappButton />
    </>
  )
}
