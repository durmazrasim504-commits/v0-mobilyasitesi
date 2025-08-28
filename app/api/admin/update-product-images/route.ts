import { NextResponse } from "next/server"
import { updateAllProductImages } from "@/lib/product-service"

export async function POST() {
  try {
    const success = await updateAllProductImages()

    if (success) {
      return NextResponse.json({ success: true, message: "All product images updated successfully" })
    } else {
      return NextResponse.json({ success: false, message: "Failed to update product images" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in update-product-images API:", error)
    return NextResponse.json({ success: false, message: "An error occurred" }, { status: 500 })
  }
}
