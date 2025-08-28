import { supabase } from "./supabase-client"
import fs from "fs"
import path from "path"
import { readFile } from "fs/promises"

// Define types
export type ProductImage = {
  id: string
  product_id: number
  url: string
  is_primary: boolean
  created_at: string
}

// Path to the JSON file that stores our image data as fallback
const DATA_DIR = path.join(process.cwd(), "data")
const PRODUCT_IMAGES_FILE = path.join(DATA_DIR, "product-images.json")

// Get product images from JSON file
async function getProductImagesFromFile(productId: number) {
  try {
    if (!fs.existsSync(PRODUCT_IMAGES_FILE)) {
      return []
    }

    const fileData = await readFile(PRODUCT_IMAGES_FILE, "utf8")
    const images = JSON.parse(fileData || "[]")

    return images.filter((img: any) => img.product_id === productId)
  } catch (error) {
    console.error("Error reading product images from file:", error)
    return []
  }
}

// Save product image to JSON file
export async function saveProductImage(productId: number, url: string, isPrimary = false) {
  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true })
    }

    // Read existing images
    let images = []
    if (fs.existsSync(PRODUCT_IMAGES_FILE)) {
      const fileData = await readFile(PRODUCT_IMAGES_FILE, "utf8")
      images = JSON.parse(fileData || "[]")
    }

    // Create new image entry
    const newImage = {
      id: `${productId}-${Date.now()}`,
      product_id: productId,
      url: url,
      is_primary: isPrimary,
      created_at: new Date().toISOString(),
    }

    // Add to images array
    images.push(newImage)

    // Write back to file
    await fs.promises.writeFile(PRODUCT_IMAGES_FILE, JSON.stringify(images, null, 2), "utf8")

    return newImage
  } catch (error) {
    console.error("Error saving product image to file:", error)
    return null
  }
}

// Get product images
export async function getProductImages(productId: number) {
  try {
    // Get product from database to access image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error) {
      console.log("Database error when fetching product images, using fallback:", error)
      return await getProductImagesFromFile(productId)
    }

    // Convert image_urls array to ProductImage format
    if (data && data.image_urls && Array.isArray(data.image_urls)) {
      return data.image_urls.map((url, index) => ({
        id: `${productId}-${index}`,
        product_id: productId,
        url: url,
        is_primary: index === 0, // First image is primary
        created_at: new Date().toISOString(),
      }))
    }

    return []
  } catch (error) {
    // If any error, fall back to file storage
    console.error("Error fetching product images:", error)
    return await getProductImagesFromFile(productId)
  }
}

// Set primary image
export async function setPrimaryImage(imageId: string, productId: number) {
  try {
    // Get current image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error || !data || !data.image_urls) {
      throw new Error("Database error when updating primary image")
    }

    // Find the index of the image to make primary
    const imageIndex = Number.parseInt(imageId.split("-")[1], 10)

    if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= data.image_urls.length) {
      throw new Error("Invalid image index")
    }

    // Reorder the array to make the selected image first
    const newImageUrls = [...data.image_urls]
    const primaryImage = newImageUrls.splice(imageIndex, 1)[0]
    newImageUrls.unshift(primaryImage)

    // Update the product with the new image_urls order
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: newImageUrls })
      .eq("id", productId)

    if (updateError) {
      throw new Error("Database error when setting primary image")
    }

    return true
  } catch (error) {
    console.error("Error updating primary image:", error)
    return false
  }
}

// Delete product image
export async function deleteProductImage(imageId: string) {
  try {
    // Parse the image ID to get product ID and image index
    const parts = imageId.split("-")
    const productId = Number(parts[0])
    const imageIndex = Number(parts[1])

    if (isNaN(productId) || isNaN(imageIndex)) {
      throw new Error("Invalid image ID format")
    }

    // Get current image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error || !data || !data.image_urls) {
      throw new Error("Database error when deleting image")
    }

    // Remove the image at the specified index
    const newImageUrls = [...data.image_urls]
    if (imageIndex < 0 || imageIndex >= newImageUrls.length) {
      throw new Error("Image index out of bounds")
    }

    // Get the file path to delete from disk
    const imageUrl = newImageUrls[imageIndex]
    const filePath = path.join(process.cwd(), "public", imageUrl)

    // Remove from array
    newImageUrls.splice(imageIndex, 1)

    // Update the product with the new image_urls array
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: newImageUrls })
      .eq("id", productId)

    if (updateError) {
      throw new Error("Database error when updating image_urls")
    }

    // Try to delete the file from disk if it exists
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (fileError) {
      console.error("Error deleting image file:", fileError)
      // Continue even if file deletion fails
    }

    return true
  } catch (error) {
    console.error("Error deleting image:", error)
    return false
  }
}

// Add new image to product
export async function addProductImage(productId: number, imageUrl: string) {
  try {
    // Get current image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error) {
      throw new Error("Database error when adding image")
    }

    // Get current image URLs or initialize empty array
    const currentImageUrls = data?.image_urls && Array.isArray(data.image_urls) ? [...data.image_urls] : []
    
    // Add new image URL
    currentImageUrls.push(imageUrl)

    // Update the product with the new image_urls array
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: currentImageUrls })
      .eq("id", productId)

    if (updateError) {
      throw new Error("Database error when updating image_urls")
    }

    // Return the index of the new image
    return {
      id: `${productId}-${currentImageUrls.length - 1}`,
      product_id: productId,
      url: imageUrl,
      is_primary: currentImageUrls.length === 1, // First image is primary
      created_at: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error adding product image:", error)
    return null
  }
}

// Add multiple images to product
export async function addMultipleProductImages(productId: number, imageUrls: string[]) {
  try {
    if (!imageUrls.length) return []

    // Get current image_urls
    const { data, error } = await supabase.from("products").select("image_urls").eq("id", productId).single()

    if (error) {
      throw new Error("Database error when adding images")
    }

    // Get current image URLs or initialize empty array
    const currentImageUrls = data?.image_urls && Array.isArray(data.image_urls) ? [...data.image_urls] : []
    
    // Add new image URLs
    const updatedImageUrls = [...currentImageUrls, ...imageUrls]

    // Update the product with the new image_urls array
    const { error: updateError } = await supabase
      .from("products")
      .update({ image_urls: updatedImageUrls })
      .eq("id", productId)

    if (updateError) {
      throw new Error("Database error when updating image_urls")
    }

    // Return the new images with metadata
    const newImages = imageUrls.map((url, idx) => ({
      id: `${productId}-${currentImageUrls.length + idx}`,
      product_id: productId,
      url: url,
      is_primary: currentImageUrls.length === 0 && idx === 0, // First image is primary only if there were no existing images
      created_at: new Date().toISOString(),
    }))

    return newImages
  } catch (error) {
    console.error("Error adding multiple product images:", error)
    return []
  }
}
