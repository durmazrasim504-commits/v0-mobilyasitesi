import { supabase } from "./supabase-client"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import { writeFile, mkdir } from "fs/promises"

// Type tanımları
export type CategoryImage = {
  id: number
  category_id: number
  url: string
  created_at: string
}

// Sabitler
const UPLOADS_DIR = path.join(process.cwd(), "public", "categories")

/**
 * Upload dizininin var olduğundan emin ol
 */
export async function ensureUploadDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true })
  }
}

/**
 * Kategori resmi yükle
 */
export async function uploadCategoryImage(file: File): Promise<string> {
  await ensureUploadDir()

  // Benzersiz dosya adı oluştur
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = path.join(UPLOADS_DIR, fileName)

  // Dosyayı diske kaydet
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  // Veritabanına kaydedilecek resim URL'sini döndür
  return `/categories/${fileName}`
}

/**
 * Kategorinin resim URL'sini güncelle
 */
export async function updateCategoryImage(categoryId: number, imageUrl: string): Promise<boolean> {
  try {
    // Kategoriyi güncelle
    const { error } = await supabase
      .from("categories")
      .update({ image_url: imageUrl })
      .eq("id", categoryId)
    
    if (error) {
      console.error("Kategori resmi güncellenirken hata:", error)
      return false
    }
    
    return true
  } catch (error) {
    console.error("Kategori resmi güncellenirken hata:", error)
    return false
  }
}

/**
 * Kategori resmini sil
 */
export async function deleteCategoryImage(categoryId: number): Promise<boolean> {
  try {
    // Önce kategoriyi ve mevcut resim URL'sini al
    const { data, error } = await supabase
      .from("categories")
      .select("image_url")
      .eq("id", categoryId)
      .single()
    
    if (error || !data || !data.image_url) {
      console.error("Kategori bilgisi alınırken hata:", error)
      return false
    }
    
    const oldImageUrl = data.image_url
    
    // Kategoriyi güncelle (image_url'i null yap)
    const { error: updateError } = await supabase
      .from("categories")
      .update({ image_url: null })
      .eq("id", categoryId)
    
    if (updateError) {
      console.error("Kategori resmi kaldırılırken hata:", updateError)
      return false
    }
    
    // Eski resim dosyasını diskten sil
    try {
      const filePath = path.join(process.cwd(), "public", oldImageUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (fileError) {
      console.error("Resim dosyası silinirken hata:", fileError)
      // Dosya silinmese bile devam et
    }
    
    return true
  } catch (error) {
    console.error("Kategori resmi silinirken hata:", error)
    return false
  }
}

/**
 * Kategori ile ilgili resim işlemleri için yardımcı fonksiyonlar
 */

// Kategori resmini değiştir (eski resmi siler ve yenisini kaydeder)
export async function changeCategoryImage(categoryId: number, file: File): Promise<string | null> {
  try {
    // Önce kategoriyi ve mevcut resim URL'sini al
    const { data, error } = await supabase
      .from("categories")
      .select("image_url")
      .eq("id", categoryId)
      .single()
    
    if (error) {
      console.error("Kategori bilgisi alınırken hata:", error)
      return null
    }
    
    const oldImageUrl = data?.image_url
    
    // Yeni resmi yükle
    const newImageUrl = await uploadCategoryImage(file)
    
    // Kategoriyi güncelle
    const { error: updateError } = await supabase
      .from("categories")
      .update({ image_url: newImageUrl })
      .eq("id", categoryId)
    
    if (updateError) {
      console.error("Kategori resmi güncellenirken hata:", updateError)
      // Yeni yüklenen resmi sil (işlem başarısız oldu)
      try {
        const newFilePath = path.join(process.cwd(), "public", newImageUrl)
        if (fs.existsSync(newFilePath)) {
          fs.unlinkSync(newFilePath)
        }
      } catch (fileError) {
        console.error("Hatalı resim dosyası silinirken hata:", fileError)
      }
      return null
    }
    
    // Eski resim dosyasını diskten sil
    if (oldImageUrl) {
      try {
        const filePath = path.join(process.cwd(), "public", oldImageUrl)
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath)
        }
      } catch (fileError) {
        console.error("Eski resim dosyası silinirken hata:", fileError)
        // Dosya silinmese bile devam et
      }
    }
    
    return newImageUrl
  } catch (error) {
    console.error("Kategori resmi değiştirilirken hata:", error)
    return null
  }
}
