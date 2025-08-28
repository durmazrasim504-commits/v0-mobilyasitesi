import { NextResponse } from "next/server"
import { deleteProductImage } from "@/lib/image-service"
import path from "path"
import fs from "fs"

export async function POST(request: Request) {
  try {
    const { imageId } = await request.json()

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Call the updated image service to delete the image
    const success = await deleteProductImage(imageId)

    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error deleting product image:", error)
    return NextResponse.json({ error: "An error occurred while deleting the image" }, { status: 500 })
  }
}
