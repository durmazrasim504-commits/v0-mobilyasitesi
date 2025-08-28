import { NextResponse } from "next/server"
import { join } from "path"
import { unlink } from "fs/promises"
import { existsSync } from "fs"
import { supabase } from "@/lib/supabase-client"

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { slideId } = data

    if (!slideId) {
      return NextResponse.json({ error: "No slide ID provided" }, { status: 400 })
    }

    // 1. Get the hero slide to find the image URL
    const { data: slide, error: slideError } = await supabase
      .from("hero_slides")
      .select("image_url")
      .eq("id", slideId)
      .single()

    if (slideError) {
      console.error("Error fetching slide:", slideError)
      return NextResponse.json({ error: "Failed to fetch slide information" }, { status: 500 })
    }

    if (!slide || !slide.image_url) {
      return NextResponse.json({ error: "No image found for this slide" }, { status: 404 })
    }

    // 2. Extract the filename from the image URL path
    // Example: /hero/hero-123e4567-e89b-12d3-a456-426614174000.jpg
    const filename = slide.image_url.split("/").pop()
    
    if (!filename) {
      return NextResponse.json({ success: true, message: "No file to delete" })
    }

    // 3. Construct the file path
    const filePath = join(process.cwd(), "public", "hero", filename)

    // 4. Delete the file if it exists
    if (existsSync(filePath)) {
      try {
        await unlink(filePath)
      } catch (fileError) {
        console.error("Error deleting file:", fileError)
        // Continue even if file deletion fails - we'll still update the database
      }
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully"
    })
  } catch (error) {
    console.error("Error deleting hero image:", error)
    return NextResponse.json(
      {
        error: "An error occurred while deleting the image",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
