import { NextResponse } from "next/server"
import { setPrimaryImage } from "@/lib/image-service"

export async function POST(request: Request) {
  try {
    const { imageId, productId } = await request.json()

    if (!imageId || !productId) {
      return NextResponse.json({ error: "Image ID and Product ID are required" }, { status: 400 })
    }

    const success = await setPrimaryImage(imageId, productId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to set primary image" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error setting primary image:", error)
    return NextResponse.json({ error: "An error occurred while setting primary image" }, { status: 500 })
  }
}
