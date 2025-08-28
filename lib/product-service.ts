import { supabase } from "./supabase-client"
import type { Product } from "./supabase"

// Default image for products without specific images
const defaultProductImage = "/diverse-products-still-life.png"

// Fallback data for when Supabase is not available
const fallbackCategories = [
  {
    id: 1,
    name: "Bahçe Oturma Grupları",
    slug: "bahce-oturma-gruplari",
    image_url: "/categories/bahce-oturma-gruplari.jpg",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Bahçe Köşe Takımları",
    slug: "bahce-kose-takimlari",
    image_url: "/categories/bahce-kose-takimlari.jpg",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Masa Takımları",
    slug: "masa-takimlari",
    image_url: "/categories/masa-takimlari.jpg",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Şezlonglar",
    slug: "sezlonglar",
    image_url: "/categories/sezlonglar.jpg",
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Sandalyeler",
    slug: "sandalyeler",
    image_url: "/categories/sandalyeler.png",
    created_at: new Date().toISOString(),
  },
]

// Fallback products for when Supabase is not available
const fallbackProducts = [
  {
    id: 1,
    name: "Rattan Bahçe Oturma Grubu",
    slug: "rattan-bahce-oturma-grubu",
    description: "Şık ve dayanıklı rattan bahçe oturma grubu",
    price: 12999,
    discount_percentage: 10,
    category_id: 1,
    stock: 10,
    is_new: true,
    created_at: new Date().toISOString(),
    images: ["/products/rattan-bahce-oturma-grubu.jpg"],
    image_urls: ["/products/rattan-bahce-oturma-grubu.jpg"],
  },
  {
    id: 2,
    name: "Modern Bahçe Köşe Takımı",
    slug: "modern-bahce-kose-takimi",
    description: "Modern tasarımlı bahçe köşe takımı",
    price: 15999,
    discount_percentage: 15,
    category_id: 2,
    stock: 5,
    is_new: true,
    created_at: new Date().toISOString(),
    images: ["/products/modern-bahce-kose-takimi.jpg"],
    image_urls: ["/products/modern-bahce-kose-takimi.jpg"],
  },
  {
    id: 3,
    name: "Ahşap Masa Takımı",
    slug: "ahsap-masa-takimi",
    description: "Doğal ahşap masa takımı",
    price: 8999,
    discount_percentage: 0,
    category_id: 3,
    stock: 8,
    is_new: false,
    created_at: new Date().toISOString(),
    images: ["/products/ahsap-masa-takimi.jpg"],
    image_urls: ["/products/ahsap-masa-takimi.jpg"],
  },
  {
    id: 4,
    name: "Katlanabilir Şezlong",
    slug: "katlanabilir-sezlong",
    description: "Pratik katlanabilir şezlong",
    price: 2999,
    discount_percentage: 5,
    category_id: 4,
    stock: 15,
    is_new: false,
    created_at: new Date().toISOString(),
    images: ["/products/katlanabilir-sezlong.jpg"],
    image_urls: ["/products/katlanabilir-sezlong.jpg"],
  },
]

// Get all products with optional filtering
export async function getProducts(
  categoryId?: number,
  filters?: {
    minPrice?: number
    maxPrice?: number
    sortBy?: "price_asc" | "price_desc" | "newest" | "popular"
  },
  page = 1,
  limit = 12,
) {
  try {
    let query = supabase.from("products").select("*", { count: "exact" })

    // Apply category filter
    if (categoryId) {
      query = query.eq("category_id", categoryId)
    }

    // Apply price filters
    if (filters?.minPrice !== undefined) {
      query = query.gte("price", filters.minPrice)
    }
    if (filters?.maxPrice !== undefined) {
      query = query.lte("price", filters.maxPrice)
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          query = query.order("price", { ascending: true })
          break
        case "price_desc":
          query = query.order("price", { ascending: false })
          break
        case "newest":
          query = query.order("created_at", { ascending: false })
          break
        case "popular":
          // Değişiklik: sales_count yerine id'ye göre sıralama yapıyoruz
          query = query.order("id", { ascending: false })
          break
      }
    } else {
      // Default sorting
      query = query.order("created_at", { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error("Supabase error fetching products:", error)
      // Return fallback data if Supabase is not available
      return {
        products: fallbackProducts,
        total: fallbackProducts.length,
      }
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return {
      products: productsWithImages,
      total: count || 0,
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    // Return fallback data if there's an error
    return {
      products: fallbackProducts,
      total: fallbackProducts.length,
    }
  }
}

// Get a single product by ID
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

    if (error) {
      console.error("Supabase error fetching product by ID:", error)
      // Return fallback product if Supabase is not available
      return fallbackProducts.find((p) => p.id === id) || null
    }

    if (!data) {
      return null
    }

    // Use image_urls from database if available
    const images = data.image_urls && data.image_urls.length > 0 ? data.image_urls : [defaultProductImage]

    return { ...data, images }
  } catch (error) {
    console.error("Error fetching product by ID:", error)
    // Return fallback product if there's an error
    return fallbackProducts.find((p) => p.id === id) || null
  }
}

// Get a single product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single()

    if (error) {
      console.error("Supabase error fetching product by slug:", error)
      // Return fallback product if Supabase is not available
      return fallbackProducts.find((p) => p.slug === slug) || null
    }

    if (!data) {
      return null
    }

    // Use image_urls from database if available
    const images = data.image_urls && data.image_urls.length > 0 ? data.image_urls : [defaultProductImage]

    return { ...data, images }
  } catch (error) {
    console.error("Error fetching product by slug:", error)
    // Return fallback product if there's an error
    return fallbackProducts.find((p) => p.slug === slug) || null
  }
}

export async function getCategories() {
  try {
    // Make sure supabase client is initialized
    if (!supabase) {
      console.error("Supabase client is not initialized")
      return fallbackCategories
    }

    const { data, error } = await supabase.from("categories").select("*").order("name")

    if (error) {
      console.error("Supabase error fetching categories:", error)
      // Return fallback categories if Supabase is not available
      return fallbackCategories
    }

    return data as any[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    // Return fallback categories if there's an error
    return fallbackCategories
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    // Fix: Use .limit(1) and then access the first item instead of .single()
    const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).limit(1)

    if (error) {
      console.error("Supabase error fetching category by slug:", error)
      // Return fallback category if Supabase is not available
      return fallbackCategories.find((c) => c.slug === slug) || null
    }

    // Return the first item if it exists, otherwise null
    return data && data.length > 0 ? (data[0] as any) : null
  } catch (error) {
    console.error("Error fetching category:", error)
    // Return fallback category if there's an error
    return fallbackCategories.find((c) => c.slug === slug) || null
  }
}

// Get featured products
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    // Instead of using is_featured column which doesn't exist,
    // we'll use the newest products as featured
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Supabase error fetching featured products:", error)
      // Return fallback products if Supabase is not available
      return fallbackProducts.slice(0, limit)
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching featured products:", error)
    // Return fallback products if there's an error
    return fallbackProducts.slice(0, limit)
  }
}

// Get promotional products
export async function getPromotionalProducts(limit = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .not("discount_percentage", "is", null)
      .gt("discount_percentage", 0)
      .order("discount_percentage", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Supabase error fetching promotional products:", error)
      // Return fallback products with discount if Supabase is not available
      return fallbackProducts.filter((p) => p.discount_percentage > 0).slice(0, limit)
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching promotional products:", error)
    // Return fallback products with discount if there's an error
    return fallbackProducts.filter((p) => p.discount_percentage > 0).slice(0, limit)
  }
}

// Get related products
export async function getRelatedProducts(productId: number, categoryId: number, limit = 4): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", productId)
      .limit(limit)

    if (error) {
      console.error("Supabase error fetching related products:", error)
      // Return fallback products in the same category if Supabase is not available
      return fallbackProducts.filter((p) => p.category_id === categoryId && p.id !== productId).slice(0, limit)
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching related products:", error)
    // Return fallback products in the same category if there's an error
    return fallbackProducts.filter((p) => p.category_id === categoryId && p.id !== productId).slice(0, limit)
  }
}

export async function searchProducts(
  query: string,
  filters?: {
    minPrice?: number
    maxPrice?: number
    sortBy?: "price_asc" | "price_desc" | "newest" | "popular"
  },
  page = 1,
  limit = 24,
) {
  try {
    // Start with the search query
    let dbQuery = supabase
      .from("products")
      .select("*", { count: "exact" })
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Apply price filters
    if (filters?.minPrice !== undefined) {
      dbQuery = dbQuery.gte("price", filters.minPrice)
    }
    if (filters?.maxPrice !== undefined) {
      dbQuery = dbQuery.lte("price", filters.maxPrice)
    }

    // Apply sorting
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          dbQuery = dbQuery.order("price", { ascending: true })
          break
        case "price_desc":
          dbQuery = dbQuery.order("price", { ascending: false })
          break
        case "newest":
          dbQuery = dbQuery.order("created_at", { ascending: false })
          break
        case "popular":
          // Değişiklik: sales_count yerine id'ye göre sıralama yapıyoruz
          dbQuery = dbQuery.order("id", { ascending: false })
          break
      }
    } else {
      // Default sorting
      dbQuery = dbQuery.order("created_at", { ascending: false })
    }

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    dbQuery = dbQuery.range(from, to)

    const { data, count, error } = await dbQuery

    if (error) {
      console.error("Supabase error searching products:", error)
      // Return filtered fallback products if Supabase is not available
      const filteredProducts = fallbackProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()),
      )
      return {
        products: filteredProducts.slice((page - 1) * limit, page * limit),
        total: filteredProducts.length,
      }
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return {
      products: productsWithImages,
      total: count || 0,
    }
  } catch (error) {
    console.error("Error searching products:", error)
    // Return filtered fallback products if there's an error
    const filteredProducts = fallbackProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()),
    )
    return {
      products: filteredProducts.slice((page - 1) * limit, page * limit),
      total: filteredProducts.length,
    }
  }
}

// Get sale products
export async function getSaleProducts(limit = 8): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .not("discount_percentage", "is", null)
      .gt("discount_percentage", 0)
      .order("discount_percentage", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Supabase error fetching sale products:", error)
      // Return fallback products with discount if Supabase is not available
      return fallbackProducts.filter((p) => p.discount_percentage > 0).slice(0, limit)
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching sale products:", error)
    // Return fallback products with discount if there's an error
    return fallbackProducts.filter((p) => p.discount_percentage > 0).slice(0, limit)
  }
}

// Get new products
export async function getNewProducts(limit = 24): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_new", true)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Supabase error fetching new products:", error)
      // Return fallback new products if Supabase is not available
      return fallbackProducts.filter((p) => p.is_new).slice(0, limit)
    }

    // Process products to ensure they have images
    const productsWithImages =
      data?.map((product) => {
        // Use image_urls from database if available
        const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [defaultProductImage]

        return { ...product, images }
      }) || []

    return productsWithImages
  } catch (error) {
    console.error("Error fetching new products:", error)
    // Return fallback new products if there's an error
    return fallbackProducts.filter((p) => p.is_new).slice(0, limit)
  }
}

// Update product images
export async function updateProductImages(productId: number, imageUrls: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.from("products").update({ image_urls: imageUrls }).eq("id", productId)

    if (error) {
      console.error("Supabase error updating product images:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error updating product images:", error)
    return false
  }
}

// Update all product images based on slug patterns
export async function updateAllProductImages(): Promise<boolean> {
  try {
    // Get all products
    const { data: products, error } = await supabase.from("products").select("id, slug")

    if (error) {
      console.error("Supabase error fetching products for image update:", error)
      return false
    }

    // Product image mapping based on slug patterns
    const imagePatterns = [
      { pattern: "rattan", images: ["/products/rattan-bahce-oturma-grubu.jpg", "/rattan-garden-furniture.png"] },
      { pattern: "masa-takimi", images: ["/products/ahsap-masa-takimi.jpg", "/wooden-table-set.png"] },
      { pattern: "kose-takimi", images: ["/products/luks-bahce-kose-takimi.jpg", "/luxury-garden-corner-set.png"] },
      { pattern: "salincak", images: ["/products/rattan-salincak.jpg", "/rattan-swing.png"] },
      { pattern: "semsiye", images: ["/products/bahce-semsiyesi.jpg", "/garden-umbrella.png"] },
      { pattern: "sandalye", images: ["/products/aluminyum-bahce-sandalyesi.jpg"] },
      {
        pattern: "bistro",
        images: ["/bistro-masa-takimi-1.png", "/bistro-masa-takimi-2.png", "/bistro-masa-takimi-3.png"],
      },
      { pattern: "eva", images: ["/eva-masa-takimi.png", "/eva-masa-takimi-2.png"] },
      { pattern: "pisa", images: ["/pisa-bistro-rattan.png", "/pisa-ikili-rattan.png"] },
      { pattern: "garden", images: ["/space-garden-furniture.png", "/outdoor-garden-furniture-set.png"] },
      { pattern: "aluminum", images: ["/palm-aluminum-rattan.png"] },
      { pattern: "efes", images: ["/efes-midi-garden-set.png"] },
      { pattern: "sofa", images: ["/products/luxury-sofa-set.png"] },
      { pattern: "dining", images: ["/products/modern-dining-table.png", "/products/outdoor-dining-set.png"] },
      { pattern: "desk", images: ["/products/executive-desk.png"] },
      { pattern: "bed", images: ["/products/premium-bed.png"] },
      { pattern: "chair", images: ["/products/designer-chair.png"] },
      { pattern: "patio", images: ["/products/patio-umbrella.png"] },
      { pattern: "lounge", images: ["/products/garden-lounge.png"] },
      // Default images for products that don't match any pattern
      { pattern: "", images: ["/diverse-products-still-life.png", "/abstract-geometric-shapes.png"] },
    ]

    // Update each product
    for (const product of products || []) {
      // Find matching image pattern
      let matchedImages = ["/diverse-products-still-life.png"] // Default image

      for (const pattern of imagePatterns) {
        if (pattern.pattern && product.slug.includes(pattern.pattern)) {
          matchedImages = pattern.images
          break
        }
      }

      // Update product with matched images
      await supabase.from("products").update({ image_urls: matchedImages }).eq("id", product.id)
    }

    return true
  } catch (error) {
    console.error("Error updating all product images:", error)
    return false
  }
}
