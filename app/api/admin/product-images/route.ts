import { NextRequest, NextResponse } from "next/server"
import * as ProductImageService from "@/lib/product-image-service"

/**
 * GET: Get all images for a product
 * Usage: /api/admin/product-images?productId=1
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }
    
    const images = await ProductImageService.getProductImages(Number(productId))
    return NextResponse.json({ success: true, images })
  } catch (error) {
    console.error("Error getting product images:", error)
    return NextResponse.json(
      { error: "An error occurred while getting product images" },
      { status: 500 }
    )
  }
}

/**
 * POST: Upload one or more product images
 * Usage: Multi-part form data with 'image' field (can be multiple) and 'productId' field
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const productId = formData.get("productId")
    const images = formData.getAll("image")
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }
    
    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images found" }, { status: 400 })
    }
    
    // Cast product ID to number and images to File array
    const productIdNum = Number(productId)
    const imageFiles = images.filter(img => img instanceof File) as File[]
    
    if (imageFiles.length === 0) {
      return NextResponse.json({ error: "Invalid image files" }, { status: 400 })
    }
    
    // Upload the image files
    const imageUrls = await ProductImageService.uploadProductImageFiles(imageFiles)
    
    // Add the image URLs to the product
    const success = await ProductImageService.addImagesToProduct(productIdNum, imageUrls)
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to add images to product" },
        { status: 500 }
      )
    }
    
    // Get the updated images list
    const updatedImages = await ProductImageService.getProductImages(productIdNum)
    
    return NextResponse.json({
      success: true,
      images: updatedImages,
      imageUrls: imageUrls,
      // For backward compatibility
      imageUrl: imageUrls.length === 1 ? imageUrls[0] : undefined
    })
  } catch (error) {
    console.error("Error uploading product images:", error)
    return NextResponse.json(
      { error: "An error occurred while uploading product images" },
      { status: 500 }
    )
  }
}

/**
 * PUT: Set product image as primary
 * Usage: { "productId": 1, "imageUrl": "/products/image.jpg" }
 */
export async function PUT(request: NextRequest) {
  try {
    const { productId, imageUrl } = await request.json()
    
    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "Product ID and image URL are required" },
        { status: 400 }
      )
    }
    
    const success = await ProductImageService.setProductImageAsPrimary(
      Number(productId),
      imageUrl
    )
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to set image as primary" },
        { status: 500 }
      )
    }
    
    // Get the updated images list
    const updatedImages = await ProductImageService.getProductImages(Number(productId))
    
    return NextResponse.json({ success: true, images: updatedImages })
  } catch (error) {
    console.error("Error setting image as primary:", error)
    return NextResponse.json(
      { error: "An error occurred while setting image as primary" },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Delete a product image
 * Usage: /api/admin/product-images?productId=1&imageUrl=/products/image.jpg
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")
    const imageUrl = searchParams.get("imageUrl")
    
    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "Product ID and image URL are required" },
        { status: 400 }
      )
    }
    
    const success = await ProductImageService.deleteProductImageByUrl(
      Number(productId),
      imageUrl
    )
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      )
    }
    
    // Get the updated images list
    const updatedImages = await ProductImageService.getProductImages(Number(productId))
    
    return NextResponse.json({ success: true, images: updatedImages })
  } catch (error) {
    console.error("Error deleting product image:", error)
    return NextResponse.json(
      { error: "An error occurred while deleting product image" },
      { status: 500 }
    )
  }
}
