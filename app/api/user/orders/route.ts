import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase-client"

export async function GET(request: Request) {
  try {
    // Oturum token bilgilerini cookie'den al
    const cookieStore = cookies()
    const supabaseToken = cookieStore.get("supabase-auth-token")?.value
    
    if (!supabaseToken) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmalısınız" },
        { status: 401 }
      )
    }
    
    // Kullanıcı bilgilerini token'dan al
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Oturum bilgileriniz geçersiz. Lütfen tekrar giriş yapın." },
        { status: 401 }
      )
    }

    const userId = user.id

    // Kullanıcının siparişlerini veritabanından sorgula
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        receipt:order_receipts(id, file_path, uploaded_at)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Siparişler alınırken hata:", error)
      return NextResponse.json(
        { error: "Siparişler alınırken bir hata oluştu" },
        { status: 500 }
      )
    }

    // Sipariş kalemlerini al
    const enrichedOrders = await Promise.all(
      data.map(async (order) => {
        const { data: items, error: itemsError } = await supabase
          .from("order_items")
          .select(`
            *,
            product:products(id, name, slug, price, image_urls)
          `)
          .eq("order_id", order.id)

        if (itemsError) {
          console.error(`Sipariş kalemleri alınırken hata (Sipariş ID: ${order.id}):`, itemsError)
          return {
            ...order,
            items: [],
          }
        }

        return {
          ...order,
          items: items || [],
        }
      })
    )

    return NextResponse.json({ orders: enrichedOrders })
  } catch (error) {
    console.error("Siparişler alınırken hata:", error)
    return NextResponse.json(
      { error: "Siparişler alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}
