import { supabase } from "./supabase-client"
import path from "path"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import { writeFile, mkdir } from "fs/promises"

// Type definitions
export type ProductImage = {
  id: string
  product_id: number
  url: string
  is_primary: boolean
  created_at: string
}

// Constants
const UPLOADS_DIR = path.join(process.cwd(), "public", "products")

/**
 * Ensure the uploads directory exists
 */
export async function ensureUploadsDir() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true })
  }
}

/**
 * Upload a single product image file to disk
 */
export async function uploadProductImageFile(file: File): Promise<string> {
  await ensureUploadsDir()

  // Generate a unique filename
  const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const fileName = `${uuidv4()}.${fileExt}`
  const filePath = path.join(UPLOADS_DIR, fileName)

  // Write the file to disk
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  // Return the image URL to be stored in the database
  return `/products/${fileName}`
}

/**
 * Upload multiple product images
 */
export async function uploadProductImageFiles(files: File[]): Promise<string[]> {
  const imageUrls: string[] = []
  
  for (const file of files) {
    const imageUrl = await uploadProductImageFile(file)
    imageUrls.push(imageUrl)
  }
  
  return imageUrls
}

/**
 * Add an image URL to a product's image_urls array
 */
export async function addImageToProduct(productId: number, imageUrl: string): Promise<boolean> {
  try {
    // Get the current product data
    const { data, error } = await supabase
      .from("products")
      .select("image_urls")
      .eq("id", productId)
      .single()
    
    if (error) {
      console.error("Error fetching product data:", error)
      return false
    }
    
    // Get the current image URLs or initialize an empty array
    const imageUrls = data.image_urls && Array.isArray(data.image_urls) 
      ? [...data.image_urls] 
      : []
    
    // Add the new image URL
    imageUrls.push(imageUrl)
    
    // Update the product with the new image URLs
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: imageUrls })
      .eq("id", productId)
    
    if (updateError) {
      console.error("Error updating product image URLs:", updateError)
      return false
    }
    
    return true
  } catch (error) {
    console.error("Error adding image to product:", error)
    return false
  }
}

/**
 * Add multiple image URLs to a product's image_urls array
 */
export async function addImagesToProduct(productId: number, imageUrls: string[]): Promise<boolean> {
  try {
    if (imageUrls.length === 0) return true
    
    // Get the current product data
    const { data, error } = await supabase
      .from("products")
      .select("image_urls")
      .eq("id", productId)
      .single()
    
    if (error) {
      console.error("Error fetching product data:", error)
      return false
    }
    
    // Get the current image URLs or initialize an empty array
    const currentImageUrls = data.image_urls && Array.isArray(data.image_urls) 
      ? [...data.image_urls] 
      : []
    
    // Add the new image URLs
    const updatedImageUrls = [...currentImageUrls, ...imageUrls]
    
    // Update the product with the new image URLs
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: updatedImageUrls })
      .eq("id", productId)
    
    if (updateError) {
      console.error("Error updating product image URLs:", updateError)
      return false
    }
    
    return true
  } catch (error) {
    console.error("Error adding images to product:", error)
    return false
  }
}

/**
 * Delete a product image by URL
 */
export async function deleteProductImageByUrl(productId: number, imageUrl: string): Promise<boolean> {
  try {
    // Get the current product data
    const { data, error } = await supabase
      .from("products")
      .select("image_urls")
      .eq("id", productId)
      .single()
    
    if (error || !data || !data.image_urls) {
      console.error("Error fetching product data:", error)
      return false
    }
    
    // Filter out the image URL to delete
    const updatedImageUrls = data.image_urls.filter((url: string) => url !== imageUrl)
    
    // Update the product with the new image URLs
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: updatedImageUrls })
      .eq("id", productId)
    
    if (updateError) {
      console.error("Error updating product image URLs:", updateError)
      return false
    }
    
    // Try to delete the file from disk
    try {
      const filePath = path.join(process.cwd(), "public", imageUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (fileError) {
      console.error("Error deleting image file:", fileError)
      // Continue even if file deletion fails
    }
    
    return true
  } catch (error) {
    console.error("Error deleting product image:", error)
    return false
  }
}

/**
 * Set a product image as primary by moving it to the first position in the array
 */
export async function setProductImageAsPrimary(productId: number, imageUrl: string): Promise<boolean> {
  try {
    // Get the current product data
    const { data, error } = await supabase
      .from("products")
      .select("image_urls")
      .eq("id", productId)
      .single()
    
    if (error || !data || !data.image_urls) {
      console.error("Error fetching product data:", error)
      return false
    }
    
    // Find the index of the image to make primary
    const imageIndex = data.image_urls.findIndex((url: string) => url === imageUrl)
    
    if (imageIndex === -1) {
      console.error("Image URL not found in product images")
      return false
    }
    
    // If the image is already primary (first in array), do nothing
    if (imageIndex === 0) {
      return true
    }
    
    // Rearrange the array to make the selected image first
    const newImageUrls = [...data.image_urls]
    const primaryImage = newImageUrls.splice(imageIndex, 1)[0]
    newImageUrls.unshift(primaryImage)
    
    // Update the product with the new image URLs
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: newImageUrls })
      .eq("id", productId)
    
    if (updateError) {
      console.error("Error updating product image URLs:", updateError)
      return false
    }
    
    return true
  } catch (error) {
    console.error("Error setting product image as primary:", error)
    return false
  }
}

/**
 * Get all images for a product
 */
export async function getProductImages(productId: number): Promise<ProductImage[]> {
  try {
    // Get the product data
    const { data, error } = await supabase
      .from("products")
      .select("image_urls")
      .eq("id", productId)
      .single()
    
    if (error || !data || !data.image_urls) {
      console.error("Error fetching product data:", error)
      return []
    }
    
    // Convert the image URLs to ProductImage objects
    const productImages: ProductImage[] = data.image_urls.map((url: string, index: number) => ({
      id: `${productId}-${index}`,
      product_id: productId,
      url: url,
      is_primary: index === 0,
      created_at: new Date().toISOString()
    }))
    
    return productImages
  } catch (error) {
    console.error("Error getting product images:", error)
    return []
  }
}
