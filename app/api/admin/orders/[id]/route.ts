import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase-client"
import fs from "fs"
import path from "path"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json({ error: "Sipariş ID'si gerekli" }, { status: 400 })
    }

    console.log(`Sipariş siliniyor, ID: ${orderId}`)

    // Önce sipariş makbuzunu kontrol et ve sil
    const { data: receipt, error: receiptError } = await supabase
      .from("order_receipts")
      .select("*")
      .eq("order_id", orderId)
      .single()

    if (receipt) {
      // Fiziksel dosyayı sil
      const filePath = path.join(process.cwd(), "public", receipt.file_path)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
        console.log(`Dekont dosyası silindi: ${filePath}`)
      }

      // Veritabanından makbuz kaydını sil
      const { error: deleteReceiptError } = await supabase
        .from("order_receipts")
        .delete()
        .eq("order_id", orderId)

      if (deleteReceiptError) {
        console.error("Dekont silinirken hata:", deleteReceiptError)
      }
    }

    // Sipariş kalemlerini sil (CASCADE ile otomatik silinecektir, ancak açık olması için ekledim)
    const { error: deleteItemsError } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId)

    if (deleteItemsError) {
      console.error("Sipariş kalemleri silinirken hata:", deleteItemsError)
      // Hata olsa bile siparişi silmeye devam et
    }

    // Siparişi sil
    const { error: deleteOrderError } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId)

    if (deleteOrderError) {
      console.error("Sipariş silinirken hata:", deleteOrderError)
      return NextResponse.json({ error: "Sipariş silinirken bir hata oluştu" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Sipariş başarıyla silindi" })
  } catch (error) {
    console.error("Sipariş silme hatası:", error)
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 })
  }
}
