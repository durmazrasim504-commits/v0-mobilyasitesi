import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

// Define the public directory for hero images
const UPLOAD_DIR = join(process.cwd(), "public", "hero")

// Log the upload directory for debugging
console.log("Upload directory:", UPLOAD_DIR)

// Ensure the upload directory exists
async function ensureUploadDir() {
  try {
    console.log("Checking if directory exists:", UPLOAD_DIR)
    const exists = existsSync(UPLOAD_DIR)
    console.log("Directory exists:", exists)
    
    if (!exists) {
      console.log("Creating directory...")
      await mkdir(UPLOAD_DIR, { recursive: true })
      console.log("Directory created successfully")
    }
    return true
  } catch (error) {
    console.error("Error creating upload directory:", error)
    return false
  }
}

export async function POST(request: Request) {
  try {
    console.log("Processing image upload request...")
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      console.error("No image found in request")
      return NextResponse.json({ error: "No image found" }, { status: 400 })
    }

    console.log("Image received:", image.name, "Size:", image.size, "Type:", image.type)

    // Ensure upload directory exists
    const dirCreated = await ensureUploadDir()
    if (!dirCreated) {
      return NextResponse.json({ error: "Failed to create upload directory" }, { status: 500 })
    }

    // Create a unique filename with the original extension
    const fileExt = image.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `hero-${uuidv4()}.${fileExt}`
    const filePath = join(UPLOAD_DIR, fileName)
    
    console.log("Saving file to:", filePath)

    try {
      // Save the file to disk
      const buffer = Buffer.from(await image.arrayBuffer())
      await writeFile(filePath, buffer)
      console.log("File saved successfully")
    } catch (fileError) {
      console.error("Error writing file:", fileError)
      return NextResponse.json({ error: "Failed to save uploaded file" }, { status: 500 })
    }

    // Create the URL for the image (to be stored in the database)
    const imageUrl = `/hero/${fileName}`
    console.log("Image URL:", imageUrl)

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
    })
  } catch (error) {
    console.error("Error uploading hero image:", error)
    return NextResponse.json(
      {
        error: "An error occurred while uploading the image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
