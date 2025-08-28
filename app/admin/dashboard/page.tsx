"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingBag,
  Tag,
  FileText,
  Users,
  Settings,
  CreditCard,
  Phone,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"

// Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    productCount: 0,
    categoryCount: 0,
    orderCount: 0,
    userCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchStats() {
      try {
        // Ürün sayısı
        const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true })

        // Kategori sayısı
        const { count: categoryCount } = await supabase.from("categories").select("*", { count: "exact", head: true })

        // Sipariş sayısı
        const { count: orderCount } = await supabase.from("orders").select("*", { count: "exact", head: true })

        // Kullanıcı sayısı
        const { count: userCount } = await supabase.from("users").select("*", { count: "exact", head: true })

        setStats({
          productCount: productCount || 0,
          categoryCount: categoryCount || 0,
          orderCount: orderCount || 0,
          userCount: userCount || 0,
        })
      } catch (error) {
        console.error("İstatistikler alınırken hata oluştu:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleCardClick = (path: string) => {
    router.push(path)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Sitenizin genel durumunu buradan takip edebilirsiniz.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick("/admin/products")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Ürün</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.productCount}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">+12%</span>
                  <span className="ml-1">son 30 günde</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick("/admin/categories")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kategori</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.categoryCount}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">+4%</span>
                  <span className="ml-1">son 30 günde</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick("/admin/orders")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sipariş</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.orderCount}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500 font-medium">-2%</span>
                  <span className="ml-1">son 30 günde</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleCardClick("/admin/users")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{stats.userCount}</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500 font-medium">+8%</span>
                  <span className="ml-1">son 30 günde</span>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="recent">Son Siparişler</TabsTrigger>
          <TabsTrigger value="settings">Hızlı Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Genel Bakış</CardTitle>
              <CardDescription>Sitenizin genel durumu ve önemli istatistikler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aylık Ziyaretçi</span>
                    <span className="text-sm font-bold">1,245</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Aylık Satış</span>
                    <span className="text-sm font-bold">32</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Ortalama Sepet Tutarı</span>
                    <span className="text-sm font-bold">₺2,450</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stokta Olmayan Ürünler</span>
                    <span className="text-sm font-bold text-red-500">3</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Bekleyen Siparişler</span>
                    <span className="text-sm font-bold text-amber-500">5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: "25%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Toplam Gelir (Bu Ay)</span>
                    <span className="text-sm font-bold text-green-500">₺78,400</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Son Siparişler</CardTitle>
              <CardDescription>Son 5 sipariş</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">#1234</p>
                      <p className="text-sm text-muted-foreground">Ahmet Yılmaz</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₺1,250</p>
                    <p className="text-sm text-muted-foreground">2 ürün</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">#1233</p>
                      <p className="text-sm text-muted-foreground">Ayşe Demir</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₺3,450</p>
                    <p className="text-sm text-muted-foreground">4 ürün</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">#1232</p>
                      <p className="text-sm text-muted-foreground">Mehmet Kaya</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₺2,100</p>
                    <p className="text-sm text-muted-foreground">3 ürün</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hızlı Ayarlar</CardTitle>
              <CardDescription>Sık kullanılan ayarlara hızlı erişim</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/admin/settings"
                  className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <span>Site Ayarları</span>
                </Link>

                <Link
                  href="/admin/payment-settings"
                  className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <span>Ödeme Ayarları</span>
                </Link>

                <Link
                  href="/admin/contact-settings"
                  className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <span>İletişim Ayarları</span>
                </Link>

                <Link
                  href="/admin/products"
                  className="flex items-center p-3 rounded-lg border hover:bg-muted transition-colors"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                  </div>
                  <span>Ürün Yönetimi</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
