import { NextResponse } from "next/server"
import * as CategoryImageService from "@/lib/category-image-service"

/**
 * POST: Kategori resmi yükle
 * Kullanım: Form verisi ile 'image' alanı ve 'categoryId' (opsiyonel)
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const categoryId = formData.get("categoryId")
    
    if (!image) {
      return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 })
    }
    
    // Yeni bir kategori mi oluşturuluyor yoksa mevcut bir kategori mi güncelleniyor?
    if (categoryId) {
      // Mevcut kategoriyi güncelle
      const categoryIdNum = Number(categoryId)
      
      if (isNaN(categoryIdNum)) {
        return NextResponse.json({ error: "Geçersiz kategori ID'si" }, { status: 400 })
      }
      
      // Eski resmi sil ve yenisini yükle
      const imageUrl = await CategoryImageService.changeCategoryImage(categoryIdNum, image)
      
      if (!imageUrl) {
        return NextResponse.json(
          { error: "Kategori resmi güncellenirken bir hata oluştu" },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        imageUrl: imageUrl,
      })
    } else {
      // Sadece resmi yükle (kategori henüz oluşturulmadı)
      const imageUrl = await CategoryImageService.uploadCategoryImage(image)
      
      return NextResponse.json({
        success: true,
        imageUrl: imageUrl,
      })
    }
  } catch (error) {
    console.error("Kategori resmi yükleme hatası:", error)
    return NextResponse.json(
      {
        error: "Resim yüklenirken bir hata oluştu",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Kategori resmini sil
 * Kullanım: /api/admin/category-images?categoryId=1
 */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url)
    const categoryId = url.searchParams.get("categoryId")
    
    if (!categoryId) {
      return NextResponse.json({ error: "Kategori ID'si gerekli" }, { status: 400 })
    }
    
    const categoryIdNum = Number(categoryId)
    
    if (isNaN(categoryIdNum)) {
      return NextResponse.json({ error: "Geçersiz kategori ID'si" }, { status: 400 })
    }
    
    // Kategori resmini sil
    const success = await CategoryImageService.deleteCategoryImage(categoryIdNum)
    
    if (!success) {
      return NextResponse.json(
        { error: "Kategori resmi silinirken bir hata oluştu" },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Kategori resmi silme hatası:", error)
    return NextResponse.json(
      {
        error: "Resim silinirken bir hata oluştu",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
