"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, Save, ArrowLeft, Trash2, Upload, X, ImageIcon, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCategories, getProduct, updateProduct, deleteProduct, createProduct } from "@/lib/admin-service"
import type { Category, Product, ProductImage } from "@/lib/admin-service"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EditProductPage({ params }: { params: { id: string } }) {
  const isNewProduct = params.id === "new"
  const productId = isNewProduct ? 0 : Number.parseInt(params.id, 10)

  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountPercentage, setDiscountPercentage] = useState("")
  const [isOnSale, setIsOnSale] = useState(false)
  const [isNew, setIsNew] = useState(false)
  const [stock, setStock] = useState("0")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [images, setImages] = useState<ProductImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tempImages, setTempImages] = useState<File[]>([])
  const [tempImagePreviews, setTempImagePreviews] = useState<string[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // Add refs to track manual changes
  const priceChangedManually = useRef(false)
  const originalPriceChangedManually = useRef(false)
  const discountChangedManually = useRef(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Always fetch categories
        const categoriesData = await getCategories()
        setCategories(categoriesData)

        // If creating a new product, don't fetch product data
        if (isNewProduct) {
          setIsLoading(false)
          return
        }

        // Get existing product
        const productData = await getProduct(productId)

        if (!productData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Product not found.",
          })
          router.push("/admin/products")
          return
        }

        // Set product data
        setProduct(productData)
        setName(productData.name)
        setSlug(productData.slug)
        setDescription(productData.description || "")
        setPrice(productData.price.toString())
        setOriginalPrice(productData.original_price ? productData.original_price.toString() : "")
        setDiscountPercentage(productData.discount_percentage ? productData.discount_percentage.toString() : "")
        setIsOnSale(productData.is_on_sale || false)
        setIsNew(productData.is_new || false)
        setStock(productData.stock.toString())
        setCategoryId(productData.category_id.toString())

        // Convert image_urls array to ProductImage format
        if (productData.image_urls && Array.isArray(productData.image_urls)) {
          const formattedImages = productData.image_urls.map((url, index) => ({
            id: `${productId}-${index}`,
            product_id: productId,
            url: url,
            is_primary: index === 0,
            created_at: new Date().toISOString(),
          }))
          setImages(formattedImages)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "An error occurred while fetching data.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [productId, router, toast, isNewProduct])

  // Auto-generate slug (only when name changes and slug wasn't manually changed)
  useEffect(() => {
    if (name && ((product && name !== product.name && slug === product.slug) || (!product && !slug))) {
      const slugified = name
        .toLowerCase()
        .replace(/ğ/g, "g")
        .replace(/ü/g, "u")
        .replace(/ş/g, "s")
        .replace(/ı/g, "i")
        .replace(/ö/g, "o")
        .replace(/ç/g, "c")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
      setSlug(slugified)
    }
  }, [name, product, slug])

  // Calculate discount percentage when original price changes manually
  useEffect(() => {
    if (originalPriceChangedManually.current && price && originalPrice && Number(originalPrice) > Number(price)) {
      discountChangedManually.current = false
      const discount = Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
      setDiscountPercentage(discount.toString())
    }
    // Reset the flag after the effect runs
    originalPriceChangedManually.current = false
  }, [price, originalPrice])

  // Calculate original price when discount percentage changes manually
  useEffect(() => {
    if (discountChangedManually.current && price && discountPercentage && Number(discountPercentage) > 0) {
      originalPriceChangedManually.current = false
      const original = Math.round((Number(price) * 100) / (100 - Number(discountPercentage)))
      setOriginalPrice(original.toString())
    }
    // Reset the flag after the effect runs
    discountChangedManually.current = false
  }, [price, discountPercentage])

  // Handle price change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    priceChangedManually.current = true
    setPrice(e.target.value)
  }

  // Handle original price change
  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    originalPriceChangedManually.current = true
    setOriginalPrice(e.target.value)
  }

  // Handle discount percentage change
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    discountChangedManually.current = true
    setDiscountPercentage(e.target.value)
  }

  const handleTempImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newFiles = Array.from(files)
    setTempImages((prev) => [...prev, ...newFiles])

    // Create preview URLs
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setTempImagePreviews((prev) => [...prev, ...newPreviews])

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveTempImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(tempImagePreviews[index])

    setTempImages((prev) => prev.filter((_, i) => i !== index))
    setTempImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !slug || !price || !categoryId) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsSaving(true)
    try {
      // Upload temporary images first if there are any
      const uploadedImageUrls: string[] = []

      if (tempImages.length > 0) {
        for (const file of tempImages) {
          const formData = new FormData()
          formData.append("image", file)
          formData.append("productId", productId.toString())

          const response = await fetch("/api/admin/product-images", {
            method: "POST",
            body: formData,
          })

          const data = await response.json()

          if (!response.ok) {
            throw new Error(data.error || "Error uploading image")
          }

          if (data.imageUrl) {
            uploadedImageUrls.push(data.imageUrl)
          } else if (data.imageUrls && Array.isArray(data.imageUrls)) {
            uploadedImageUrls.push(...data.imageUrls)
          }
        }
      }

      // Prepare product data
      const productData = {
        name,
        slug,
        description,
        price: Number.parseFloat(price),
        original_price: originalPrice ? Number.parseFloat(originalPrice) : null,
        discount_percentage: discountPercentage ? Number.parseInt(discountPercentage, 10) : null,
        is_new: isNew,
        is_on_sale: isOnSale,
        stock: Number.parseInt(stock, 10),
        category_id: Number.parseInt(categoryId, 10),
        // For new products or if there are existing images
        image_urls: isNewProduct ? uploadedImageUrls : undefined,
      }

      if (isNewProduct) {
        // Create new product
        const newProduct = await createProduct(productData)
        if (newProduct) {
          toast({
            title: "Success",
            description: "Product created successfully.",
          })
          router.push(`/admin/products/${newProduct.id}`)
        }
      } else {
        // Update existing product
        await updateProduct(productId, productData)
        toast({
          title: "Success",
          description: "Product updated successfully.",
        })

        // Refresh the page
        router.refresh()
      }
    } catch (error) {
      console.error(isNewProduct ? "Error creating product:" : "Error updating product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: isNewProduct ? "Error creating product." : "Error updating product.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (isNewProduct) return

    setIsDeleting(true)
    try {
      await deleteProduct(productId)
      toast({
        title: "Success",
        description: "Product deleted successfully.",
      })
      router.push("/admin/products")
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting product.",
      })
      setIsDeleting(false)
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      // Parse the image ID to get the index
      const parts = imageId.split("-")
      const imageIndex = Number(parts[1])
      
      // Get the image URL
      const imageUrl = images[imageIndex]?.url
      
      if (!imageUrl) {
        throw new Error("Image not found")
      }
      
      // Delete the image using the new API
      const response = await fetch(`/api/admin/product-images?productId=${productId}&imageUrl=${encodeURIComponent(imageUrl)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error deleting image")
      }

      const data = await response.json()
      
      if (data.success && data.images) {
        setImages(data.images)
      } else {
        // Fallback: Remove from local state if API doesn't return updated images
        setImages(images.filter((img) => img.id !== imageId))
      }
      
      toast({
        title: "Success",
        description: "Image deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error deleting image.",
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null)

    const files = e.target.files
    if (!files || files.length === 0) return

    // For new product, store images temporarily
    if (isNewProduct) {
      handleTempImageUpload(e)
      return
    }

    // For existing product, upload immediately
    const formData = new FormData()

    // Add all files to formData
    for (let i = 0; i < files.length; i++) {
      formData.append("image", files[i])
    }
    
    // Add the product ID
    formData.append("productId", productId.toString())

    try {
      const response = await fetch("/api/admin/product-images", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error uploading image")
      }

      // Update images with the response data
      if (data.images && Array.isArray(data.images)) {
        setImages(data.images)
      } else if (data.imageUrl) {
        // Backwards compatibility for single image uploads
        const newImage = {
          id: `${productId}-${images.length}`,
          product_id: productId,
          url: data.imageUrl,
          is_primary: images.length === 0,
          created_at: new Date().toISOString(),
        }
        setImages([...images, newImage])
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      setUploadError(error instanceof Error ? error.message : "Error uploading image")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error uploading image.",
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSetPrimaryImage = async (imageId: string) => {
    try {
      // Parse the image ID to get the index
      const parts = imageId.split("-")
      const imageIndex = Number(parts[1])
      
      // Get the image URL
      const imageUrl = images[imageIndex]?.url
      
      if (!imageUrl) {
        throw new Error("Image not found")
      }
      
      // Set the image as primary using the new API
      const response = await fetch("/api/admin/product-images", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Error setting primary image")
      }

      const data = await response.json()
      
      if (data.success && data.images) {
        setImages(data.images)
      } else {
        // Fallback: Update local state if API doesn't return updated images
        const updatedImages = images.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
        setImages(updatedImages)
      }

      toast({
        title: "Success",
        description: "Primary image updated.",
      })
    } catch (error) {
      console.error("Error updating primary image:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Error updating primary image.",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{isNewProduct ? "Add New Product" : "Edit Product"}</h1>
          <p className="text-muted-foreground">
            {isNewProduct ? "Add a new product." : "Edit and update product information."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </Link>
          {!isNewProduct && (
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Product
            </Button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isNewProduct ? "New Product Information" : "Product Information"}</CardTitle>
            <CardDescription>
              {isNewProduct
                ? "Add information and images for the new product."
                : "Edit product information and images."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="product-slug"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description"
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Sale Price (₺)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={handlePriceChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Regular Price (₺)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={originalPrice}
                    onChange={handleOriginalPriceChange}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-muted-foreground">Regular price for discounted products</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discountPercentage">Discount Percentage (%)</Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    min="0"
                    max="99"
                    value={discountPercentage}
                    onChange={handleDiscountChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="block mb-2">New Product</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="is-new" checked={isNew} onCheckedChange={setIsNew} />
                    <Label htmlFor="is-new">Mark as new product</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="block mb-2">On Sale</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="is-on-sale" checked={isOnSale} onCheckedChange={setIsOnSale} />
                    <Label htmlFor="is-on-sale">Mark as on sale</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Images */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Product Images</h3>

              {uploadError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{uploadError}</AlertDescription>
                </Alert>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="image-upload">Upload Image</Label>
                <div className="flex items-center">
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="w-auto"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    multiple
                  />
                  <Button variant="outline" className="ml-2" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.length === 0 && tempImagePreviews.length === 0 ? (
                  <div className="col-span-full text-center p-8 border border-dashed rounded-md">
                    <ImageIcon className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No images added yet</p>
                  </div>
                ) : (
                  <>
                    {/* Existing product images */}
                    {!isNewProduct &&
                      images.map((image) => (
                        <div key={image.id} className="relative group">
                          <div
                            className={`relative aspect-square rounded-md overflow-hidden border ${
                              image.is_primary ? "border-primary border-2" : "border-gray-200"
                            }`}
                          >
                            <Image
                              src={image.url || "/placeholder.svg"}
                              alt="Product image"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {!image.is_primary && (
                              <Button size="sm" variant="secondary" onClick={() => handleSetPrimaryImage(image.id)}>
                                Set as Primary
                              </Button>
                            )}
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteImage(image.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {image.is_primary && (
                            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                              Primary
                            </div>
                          )}
                        </div>
                      ))}

                    {/* Temporary image previews for new product */}
                    {tempImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="relative aspect-square rounded-md overflow-hidden border border-gray-200">
                          <Image
                            src={preview || "/placeholder.svg"}
                            alt="Product image preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRemoveTempImage(index)}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isNewProduct ? "Creating" : "Saving"}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isNewProduct ? "Create" : "Save"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Are you sure you want to delete this product? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={isDeleting}>
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
