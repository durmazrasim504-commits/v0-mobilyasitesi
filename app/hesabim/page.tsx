"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Package, MapPin, Heart, Settings } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AccountSidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"

export default function AccountDashboard() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/giris-yap?redirect=/hesabim")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Hesabım</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar for desktop */}
          <div className="hidden md:block">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Hoş Geldiniz, {user.first_name}!</h2>
              <p className="text-gray-600 mb-6">
                Hesap panelinizden siparişlerinizi takip edebilir, adreslerinizi yönetebilir ve hesap ayarlarınızı
                güncelleyebilirsiniz.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push("/hesabim/siparislerim")}
                >
                  <Package className="h-8 w-8" />
                  <span>Siparişlerim</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push("/hesabim/adreslerim")}
                >
                  <MapPin className="h-8 w-8" />
                  <span>Adreslerim</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push("/hesabim/favorilerim")}
                >
                  <Heart className="h-8 w-8" />
                  <span>Favorilerim</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                  onClick={() => router.push("/hesabim/hesap-ayarlari")}
                >
                  <Settings className="h-8 w-8" />
                  <span>Hesap Ayarları</span>
                </Button>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Son Siparişlerim</h2>
                <Button variant="link" onClick={() => router.push("/hesabim/siparislerim")}>
                  Tümünü Gör
                </Button>
              </div>

              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Sipariş No</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Tarih</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Durum</th>
                      <th className="px-4 py-2 text-right text-sm font-medium">Toplam</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {/* Placeholder for recent orders */}
                    <tr>
                      <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                        Henüz siparişiniz bulunmuyor.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
