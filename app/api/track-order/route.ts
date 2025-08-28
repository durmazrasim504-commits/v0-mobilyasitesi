import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const trackingNumber = searchParams.get("tracking")

  if (!trackingNumber) {
    return NextResponse.json({ error: "Takip numarası gerekli" }, { status: 400 })
  }

  try {
    console.log(`API: Takip numarası ile arama: "${trackingNumber}"`)

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("tracking_number", trackingNumber.trim())
      .single()

    if (error) {
      console.error("API: Sorgu hatası:", error)
      if (error.code === "PGRST116") {
        // No rows found
        console.log("API: Sipariş bulunamadı")
        return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Sipariş bulunamadıysa
    if (!data) {
      console.log("API: Sipariş bulunamadı")
      return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 404 })
    }

    const order = data
    console.log(`API: Sipariş bulundu: ID=${order.id}, Takip No=${order.tracking_number}`)

    // Sipariş ürünlerini al
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(name, slug)")
      .eq("order_id", order.id)

    if (itemsError) {
      console.error("API: Sipariş ürünleri alınırken hata:", itemsError)
    }

    return NextResponse.json({
      order: {
        ...order,
        items: items || [],
      },
    })
  } catch (err) {
    console.error("API: Beklenmeyen hata:", err)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}
