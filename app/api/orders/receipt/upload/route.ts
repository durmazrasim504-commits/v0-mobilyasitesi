// app/api/orders/receipt/upload/route.ts - Tam Düzeltilmiş Versiyon

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import fs from "fs"

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function POST(request: Request) {
  try {
    console.log("Dekont yükleme API'si çağrıldı")

    // Formdata'yı işle
    const formData = await request.formData()
    const file = formData.get("file") as File
    const orderId = formData.get("orderId") as string
    const trackingNumber = formData.get("trackingNumber") as string

    if (!file || !orderId) {
      return NextResponse.json({ error: "Dosya ve sipariş ID'si gereklidir" }, { status: 400 })
    }

    console.log("Dosya bilgileri:", {
      orderId,
      trackingNumber,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    })

    // PDF kontrolü
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Sadece PDF dosyaları kabul edilmektedir" }, { status: 400 })
    }

    // Uploads dizini var mı kontrol et, yoksa oluştur
    const uploadsDir = path.join(process.cwd(), "public", "receipts")
    if (!fs.existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Dosya adını oluştur
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf"
    const timestamp = new Date().getTime()
    const fileName = `receipt_${trackingNumber}_${timestamp}.${fileExt}`
    const filePath = path.join(uploadsDir, fileName)

    // Dosyayı kaydet
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, fileBuffer)

    console.log("Dosya kaydedildi:", filePath)

    // Önce mevcut bir dekont var mı kontrol et
    const { data: existingReceipt, error: checkError } = await supabaseAdmin
      .from("order_receipts")
      .select("id, file_path")
      .eq("order_id", parseInt(orderId))
      .single()

    if (existingReceipt) {
      // Mevcut dekont varsa, önce eski dosyayı sil
      console.log("Mevcut dekont bulundu, güncelleniyor:", existingReceipt.id)

      if (existingReceipt.file_path) {
        const oldFilePath = path.join(process.cwd(), "public", existingReceipt.file_path)
        if (fs.existsSync(oldFilePath)) {
          try {
            fs.unlinkSync(oldFilePath)
            console.log("Eski dekont dosyası silindi:", oldFilePath)
          } catch (fileError) {
            console.error("Eski dosya silinirken hata:", fileError)
          }
        }
      }

      // Veritabanı kaydını güncelle
      const updateData = {
        file_path: `/receipts/${fileName}`,
        file_name: fileName,
        original_name: file.name,
        content_type: file.type,
        uploaded_at: new Date().toISOString(),
      }

      const { data: updatedReceipt, error: updateError } = await supabaseAdmin
        .from("order_receipts")
        .update(updateData)
        .eq("id", existingReceipt.id)
        .select()
        .single()

      if (updateError) {
        console.error("Dekont güncellenirken hata:", updateError)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      console.log("Dekont başarıyla güncellendi:", updatedReceipt)
      return NextResponse.json({ success: true, receipt: updatedReceipt, updated: true })
    } else {
      // Yeni dekont oluştur
      console.log("Yeni dekont oluşturuluyor")
      
      const receiptData = {
        order_id: parseInt(orderId),
        tracking_number: trackingNumber,
        file_path: `/receipts/${fileName}`,
        file_name: fileName,
        original_name: file.name,
        content_type: file.type,
        uploaded_at: new Date().toISOString(),
      }

      const { data: receipt, error: dbError } = await supabaseAdmin
        .from("order_receipts")
        .insert(receiptData)
        .select()
        .single()

      if (dbError) {
        console.error("Dekont veritabanına kaydedilirken hata:", dbError)
        return NextResponse.json({ error: dbError.message }, { status: 500 })
      }

      console.log("Dekont başarıyla kaydedildi:", receipt)
      return NextResponse.json({ success: true, receipt, created: true })
    }
  } catch (error: any) {
    console.error("Dekont yükleme hatası:", error)
    return NextResponse.json({ error: error.message || "Bilinmeyen hata" }, { status: 500 })
  }
}
