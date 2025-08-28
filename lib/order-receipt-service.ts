// lib/order-receipt-service.ts (Düzeltilmiş ve Birleştirilmiş Versiyon)

import { supabase } from "./supabase-client"
import fs from "fs"
import path from "path"
import { writeFile, mkdir } from "fs/promises"

// Depolama için sabitler
const RECEIPTS_DIR = path.join(process.cwd(), "public", "receipts")

// Dekont yükleme ve yönetim tipleri
export type OrderReceipt = {
  id: string
  order_id: number
  tracking_number: string
  file_path: string
  file_name: string
  original_name: string
  content_type: string
  uploaded_at: string
}

/**
 * Dekont dizininin var olduğundan emin ol
 */
export async function ensureReceiptsDir() {
  if (!fs.existsSync(RECEIPTS_DIR)) {
    await mkdir(RECEIPTS_DIR, { recursive: true })
  }
}

/**
 * Sipariş dekontunu yükle ve ilgili bilgileri veritabanına kaydet
 */
export async function uploadOrderReceipt(
  orderId: number,
  trackingNumber: string,
  file: File
): Promise<OrderReceipt | null> {
  try {
    await ensureReceiptsDir()

    // Dosya adını oluştur (tracking_number + timestamp + orijinal dosya uzantısı)
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf"
    const timestamp = new Date().getTime()
    const fileName = `receipt_${trackingNumber}_${timestamp}.${fileExt}`
    const filePath = path.join(RECEIPTS_DIR, fileName)

    // Dosyayı diske kaydet
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Veritabanı için bilgileri hazırla
    const receiptData = {
      order_id: orderId,
      tracking_number: trackingNumber,
      file_path: `/receipts/${fileName}`,
      file_name: fileName,
      original_name: file.name,
      content_type: file.type,
      uploaded_at: new Date().toISOString(),
    }

    // Veritabanına kaydet
    const { data, error } = await supabase.from("order_receipts").insert(receiptData).select("*").single()

    if (error) {
      console.error("Dekont veritabanına kaydedilirken hata:", error)
      
      // Dosyayı sil (veritabanına kaydetme başarısız oldu)
      try {
        fs.unlinkSync(filePath)
      } catch (fileError) {
        console.error("Hatalı dosya silinirken hata:", fileError)
      }
      
      return null
    }

    return data as OrderReceipt
  } catch (error) {
    console.error("Dekont yüklenirken hata:", error)
    return null
  }
}

/**
 * Sipariş dekontunu sil (hem veritabanından hem de disk üzerinden)
 */
export async function deleteOrderReceipt(receiptId: string): Promise<boolean> {
  try {
    // Önce dekont bilgilerini al
    const { data, error } = await supabase.from("order_receipts").select("*").eq("id", receiptId).single()

    if (error || !data) {
      console.error("Dekont bilgileri alınırken hata:", error)
      return false
    }

    const receipt = data as OrderReceipt

    // Veritabanından sil
    const { error: deleteError } = await supabase.from("order_receipts").delete().eq("id", receiptId)

    if (deleteError) {
      console.error("Dekont veritabanından silinirken hata:", deleteError)
      return false
    }

    // Dosyayı diskten sil
    try {
      const filePath = path.join(process.cwd(), "public", receipt.file_path)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (fileError) {
      console.error("Dekont dosyası diskten silinirken hata:", fileError)
      // Veritabanı silme başarılı olduysa, dosya silinmese bile devam et
    }

    return true
  } catch (error) {
    console.error("Dekont silinirken hata:", error)
    return false
  }
}

/**
 * Sipariş ID'sine göre dekontu al
 */
export async function getOrderReceiptByOrderId(orderId: number): Promise<OrderReceipt | null> {
  try {
    const { data, error } = await supabase.from("order_receipts").select("*").eq("order_id", orderId).single()

    if (error) {
      console.error("Dekont alınırken hata:", error)
      return null
    }

    return data as OrderReceipt
  } catch (error) {
    console.error("Dekont alınırken hata:", error)
    return null
  }
}

/**
 * Takip numarasına göre dekontu al
 */
export async function getOrderReceiptByTrackingNumber(trackingNumber: string): Promise<OrderReceipt | null> {
  try {
    const { data, error } = await supabase
      .from("order_receipts")
      .select("*")
      .eq("tracking_number", trackingNumber)
      .single()

    if (error) {
      console.error("Dekont alınırken hata:", error)
      return null
    }

    return data as OrderReceipt
  } catch (error) {
    console.error("Dekont alınırken hata:", error)
    return null
  }
}

/**
 * Dekont dosyasını güncelle (eski dosyayı sil, yeni dosyayı kaydet)
 */
export async function updateOrderReceipt(
  receiptId: string,
  file: File
): Promise<OrderReceipt | null> {
  try {
    // Önce dekont bilgilerini al
    const { data, error } = await supabase.from("order_receipts").select("*").eq("id", receiptId).single()

    if (error || !data) {
      console.error("Dekont bilgileri alınırken hata:", error)
      return null
    }

    const receipt = data as OrderReceipt
    
    await ensureReceiptsDir()

    // Eski dosyayı sil
    try {
      const oldFilePath = path.join(process.cwd(), "public", receipt.file_path)
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath)
      }
    } catch (fileError) {
      console.error("Eski dekont dosyası silinirken hata:", fileError)
      // Devam et
    }

    // Yeni dosyayı kaydet (timestamp ekleyerek benzersiz isim oluştur)
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "pdf"
    const timestamp = new Date().getTime()
    const fileName = `receipt_${receipt.tracking_number}_${timestamp}.${fileExt}`
    const filePath = path.join(RECEIPTS_DIR, fileName)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Veritabanı kaydını güncelle
    const updateData = {
      file_path: `/receipts/${fileName}`,
      file_name: fileName,
      original_name: file.name,
      content_type: file.type,
      uploaded_at: new Date().toISOString(),
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("order_receipts")
      .update(updateData)
      .eq("id", receiptId)
      .select("*")
      .single()

    if (updateError) {
      console.error("Dekont veritabanı kaydı güncellenirken hata:", updateError)
      return null
    }

    return updatedData as OrderReceipt
  } catch (error) {
    console.error("Dekont güncellenirken hata:", error)
    return null
  }
}
