import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Define the public directory for product images
// Changed to /products instead of /uploads/products to match your requirements
const UPLOAD_DIR = join(process.cwd(), "public", "products")

// Ensure the upload directory exists
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    // Ensure upload directory exists
    await ensureUploadDir()

    // Get all images from the form data
    const images = formData.getAll("image") as File[]

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 400 })
    }

    // Array to store the URLs of the uploaded images
    const imageUrls: string[] = []

    // Process each image
    for (const image of images) {
      // Create a unique filename with the original extension
      const fileExt = image.name.split(".").pop()?.toLowerCase() || "jpg"
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = join(UPLOAD_DIR, fileName)

      // Save the file to disk
      const buffer = Buffer.from(await image.arrayBuffer())
      await writeFile(filePath, buffer)

      // Create the URL for the image (to be stored in the database)
      // Changed format to match the desired pattern: "/products/filename.ext"
      const imageUrl = `/products/${fileName}`
      imageUrls.push(imageUrl)
    }

    // Return response
    if (imageUrls.length === 1) {
      // For backward compatibility with code expecting a single image
      return NextResponse.json({
        success: true,
        imageUrl: imageUrls[0],
      })
    } else {
      // For multiple images
      return NextResponse.json({
        success: true,
        imageUrls: imageUrls,
      })
    }
  } catch (error) {
    console.error("Error uploading product image:", error)
    return NextResponse.json(
      {
        error: "An error occurred while uploading the image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
