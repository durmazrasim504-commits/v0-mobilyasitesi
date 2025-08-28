import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import fs from "fs"
import path from "path"
import { supabase } from "@/lib/supabase-client"

// Dekont klasörü
const RECEIPTS_DIR = path.join(process.cwd(), "public", "receipts")

// Klasörün varlığını kontrol et ve oluştur
async function ensureReceiptsDir() {
  if (!fs.existsSync(RECEIPTS_DIR)) {
    await mkdir(RECEIPTS_DIR, { recursive: true })
    console.log(`Klasör oluşturuldu: ${RECEIPTS_DIR}`)
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const orderId = formData.get("orderId") as string
    const trackingNumber = formData.get("trackingNumber") as string
    
    if (!file || !orderId || !trackingNumber) {
      return NextResponse.json(
        { error: "Dosya, sipariş ID'si ve takip numarası gereklidir" },
        { status: 400 }
      )
    }

    console.log("Dekont yükleme isteği alındı:", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      orderId,
      trackingNumber
    })
    
    // PDF dosyası olduğundan emin ol
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Sadece PDF dosyaları kabul edilmektedir" },
        { status: 400 }
      )
    }

    // Klasörün var olduğundan emin ol
    await ensureReceiptsDir()

    // Dosya yolu oluştur
    const fileName = `${trackingNumber}.pdf`
    const filePath = path.join(RECEIPTS_DIR, fileName)
    const relativePath = `/receipts/${fileName}`

    console.log(`Dekont dosyası kaydediliyor: ${filePath}`)

    try {
      // ArrayBuffer al
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Dosyayı yazdır
      await writeFile(filePath, buffer)
      console.log("Dosya başarıyla kaydedildi")
      
      // Önce varolan kaydı kontrol et
      const { data: existingReceipt } = await supabase
        .from("order_receipts")
        .select("*")
        .eq("order_id", orderId)
        .single()
      
      if (existingReceipt) {
        // Varolan kaydı güncelle
        console.log("Var olan dekont kaydı güncelleniyor")
        const { data: updatedReceipt, error: updateError } = await supabase
          .from("order_receipts")
          .update({
            file_path: relativePath,
            file_name: fileName,
            original_name: file.name,
            content_type: file.type,
            uploaded_at: new Date().toISOString()
          })
          .eq("order_id", orderId)
          .select()
          .single()
        
        if (updateError) {
          console.error("Dekont kaydı güncellenirken hata:", updateError)
          throw new Error("Dekont kaydı güncellenirken hata oluştu")
        }
        
        return NextResponse.json({
          success: true,
          message: "Dekont başarıyla güncellendi",
          receipt: updatedReceipt
        })
      } else {
        // Yeni kayıt oluştur
        console.log("Yeni dekont kaydı oluşturuluyor")
        const { data: newReceipt, error: insertError } = await supabase
          .from("order_receipts")
          .insert({
            order_id: parseInt(orderId),
            tracking_number: trackingNumber,
            file_path: relativePath,
            file_name: fileName,
            original_name: file.name,
            content_type: file.type,
            uploaded_at: new Date().toISOString()
          })
          .select()
          .single()
        
        if (insertError) {
          console.error("Dekont kaydı oluşturulurken hata:", insertError)
          throw new Error("Dekont kaydı oluşturulurken hata oluştu")
        }
        
        return NextResponse.json({
          success: true,
          message: "Dekont başarıyla yüklendi",
          receipt: newReceipt
        })
      }
    } catch (error) {
      console.error("Dekont yükleme hatası:", error)
      // Dosya oluşturulduysa temizle
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
      throw error
    }
  } catch (error) {
    console.error("Dekont yüklenirken hata:", error)
    return NextResponse.json(
      { 
        error: "Dekont yüklenirken bir hata oluştu", 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const orderId = url.searchParams.get("orderId")
    
    if (!orderId) {
      return NextResponse.json({ error: "Sipariş ID'si gerekli" }, { status: 400 })
    }
    
    const { data: receipt, error } = await supabase
      .from("order_receipts")
      .select("*")
      .eq("order_id", orderId)
      .single()
    
    if (error && error.code !== "PGRST116") { // PGRST116 = Not found
      console.error("Dekont bilgisi alınırken hata:", error)
      return NextResponse.json({ error: "Dekont bilgisi alınırken bir hata oluştu" }, { status: 500 })
    }
    
    if (!receipt) {
      return NextResponse.json({ error: "Dekont bulunamadı" }, { status: 404 })
    }
    
    return NextResponse.json({ success: true, receipt })
  } catch (error) {
    console.error("Dekont alınırken hata:", error)
    return NextResponse.json(
      { error: "Dekont alınırken bir hata oluştu" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const orderId = url.searchParams.get("orderId")
    
    if (!orderId) {
      return NextResponse.json({ error: "Sipariş ID'si gerekli" }, { status: 400 })
    }
    
    // Önce makbuzu getir
    const { data: receipt, error: getError } = await supabase
      .from("order_receipts")
      .select("*")
      .eq("order_id", orderId)
      .single()
    
    if (getError && getError.code !== "PGRST116") {
      console.error("Dekont bilgisi alınırken hata:", getError)
      return NextResponse.json({ error: "Dekont bilgisi alınırken bir hata oluştu" }, { status: 500 })
    }
    
    if (!receipt) {
      return NextResponse.json({ error: "Dekont bulunamadı" }, { status: 404 })
    }
    
    // Fiziksel dosyayı sil
    try {
      const filePath = path.join(process.cwd(), "public", receipt.file_path)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (fileError) {
      console.error("Dosya silinirken hata:", fileError)
      // Devam et, veritabanı kaydını silmeyi deneyelim
    }
    
    // Veritabanı kaydını sil
    const { error: deleteError } = await supabase
      .from("order_receipts")
      .delete()
      .eq("order_id", orderId)
    
    if (deleteError) {
      console.error("Dekont kaydı silinirken hata:", deleteError)
      return NextResponse.json({ error: "Dekont kaydı silinirken bir hata oluştu" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true, message: "Dekont başarıyla silindi" })
  } catch (error) {
    console.error("Dekont silinirken hata:", error)
    return NextResponse.json(
      { error: "Dekont silinirken bir hata oluştu" },
      { status: 500 }
    )
  }
}
