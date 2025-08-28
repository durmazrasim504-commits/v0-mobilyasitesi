import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Kategori resimleri için hedef dizin - public/categories olarak düzeltildi
const UPLOAD_DIR = join(process.cwd(), "public", "categories")

// Dizinin var olduğundan emin ol
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Dizinin var olduğundan emin ol
    await ensureUploadDir()

    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "Resim bulunamadı" }, { status: 400 })
    }

    // Benzersiz dosya adı oluştur
    const fileExt = image.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = join(UPLOAD_DIR, fileName)

    // Dosyayı diske kaydet
    const buffer = Buffer.from(await image.arrayBuffer())
    await writeFile(filePath, buffer)

    // Web'den erişilebilir path - /categories/ olarak düzeltildi
    const imageUrl = `/categories/${fileName}`

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
    })
  } catch (error) {
    console.error("Kategori resmi yükleme hatası:", error)
    return NextResponse.json(
      {
        error: "Resim yüklenirken bir hata oluştu",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
