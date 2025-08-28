import { supabase } from "./supabase-client"

// Define AdminUser type
export type AdminUser = {
  id: number
  email: string
  full_name: string
  is_super_admin: boolean
  last_login: string
  created_at: string
  updated_at: string
}

export type ProductImage = {
  id: number
  product_id: number
  url: string
  is_primary: boolean
}

export type HeroSlide = {
  id: number
  image_url: string
  title: string
  subtitle: string | null
  description: string | null
  order_index: number
  is_active: boolean
}

export type Order = {
  id: number
  user_id: string | null
  total_amount: number
  status: string
  payment_method: string
  payment_status: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  contact_phone: string
  created_at: string
  updated_at: string
  guest_email: string | null
  tracking_number: string | null
  user_email?: string
  items?: any[]
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
}

// Kategori tipi
export type Category = {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
}

// Ürün tipi
export type Product = {
  id: number
  name: string
  slug: string
  description: string
  price: number
  original_price?: number
  discount_percentage?: number
  is_new?: boolean
  is_on_sale?: boolean
  stock: number
  category_id: number
  images: string[] // Client-side representation of images
  image_urls?: string[] // Database column for image URLs
  features?: string[]
  specifications?: Record<string, string>
  created_at: string
}

// Admin login function
export async function adminLogin(
  email: string,
  password: string,
): Promise<{ user: AdminUser | null; error: string | null }> {
  // Placeholder implementation - replace with actual login logic
  if (email === "admin@divonahome.com" && password === "password") {
    const user: AdminUser = {
      id: 1,
      email: "admin@divonahome.com",
      full_name: "Admin User",
      is_super_admin: true,
      last_login: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return { user, error: null }
  } else {
    return { user: null, error: "Invalid credentials" }
  }
}

// Get all categories
export async function getCategories(searchTerm = ""): Promise<Category[]> {
  try {
    let query = supabase.from("categories").select("*")

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`)
    }

    const { data, error } = await query.order("name")

    if (error) {
      console.error("Kategoriler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data as Category[]
  } catch (error) {
    console.error("Kategoriler alınırken hata:", error)
    return []
  }
}

// Create a new category
export async function createCategory(category: Omit<Category, "id">): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").insert([category]).select().single()

    if (error) {
      console.error("Kategori oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data as Category
  } catch (error) {
    console.error("Kategori oluşturulurken hata:", error)
    return null
  }
}

// Update a category
export async function updateCategory(id: number, category: Partial<Category>): Promise<Category | null> {
  try {
    const { data, error } = await supabase.from("categories").update(category).eq("id", id).select().single()

    if (error) {
      console.error(`Kategori (ID: ${id}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return data as Category
  } catch (error) {
    console.error(`Kategori (ID: ${id}) güncellenirken hata:`, error)
    return null
  }
}

// Delete a category
export async function deleteCategory(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      console.error(`Kategori (ID: ${id}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Kategori (ID: ${id}) silinirken hata:`, error)
    throw error
  }
}

// Get all products with optional filtering
export async function getProducts(
  page = 1,
  itemsPerPage = 10,
  searchTerm = "",
): Promise<{ products: Product[]; totalCount: number }> {
  try {
    let query = supabase.from("products").select(`*, category:categories(name)`, { count: "exact" })

    if (searchTerm) {
      query = query.ilike("name", `%${searchTerm}%`)
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Ürünler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return { products: data as Product[], totalCount: count || 0 }
  } catch (error) {
    console.error("Ürünler alınırken hata:", error)
    return { products: [], totalCount: 0 }
  }
}

// Get a single product by ID
export async function getProduct(id: number): Promise<Product | null> {
  try {
    // Check if id is valid
    if (isNaN(id) || id <= 0) {
      console.error(`Geçersiz ürün ID: ${id}`)
      return null
    }

    const { data, error } = await supabase.from("products").select(`*, category:categories(name)`).eq("id", id).single()

    if (error) {
      console.error(`Ürün (ID: ${id}) alınırken hata:`, error.message)
      return null
    }

    return data as Product
  } catch (error) {
    console.error(`Ürün (ID: ${id}) alınırken hata:`, error)
    return null
  }
}

// Create a new product
export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product | null> {
  try {
    // Eğer image_urls bir dizi ise, doğrudan kullan
    // Değilse ve string ise, tek elemanlı bir diziye dönüştür
    const processedProduct = {
      ...product,
      image_urls: product.image_urls
        ? Array.isArray(product.image_urls)
          ? product.image_urls
          : [product.image_urls]
        : [],
    }

    const { data, error } = await supabase.from("products").insert([processedProduct]).select().single()

    if (error) {
      console.error("Ürün oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data as Product
  } catch (error) {
    console.error("Ürün oluşturulurken hata:", error)
    return null
  }
}

// Update a product
export async function updateProduct(id: number, product: Partial<Product>): Promise<Product | null> {
  try {
    // Eğer image_urls bir dizi ise, doğrudan kullan
    // Değilse ve string ise, tek elemanlı bir diziye dönüştür
    const processedProduct = {
      ...product,
      image_urls: product.image_urls
        ? Array.isArray(product.image_urls)
          ? product.image_urls
          : [product.image_urls]
        : undefined,
    }

    const { data, error } = await supabase.from("products").update(processedProduct).eq("id", id).select().single()

    if (error) {
      console.error(`Ürün (ID: ${id}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return data as Product
  } catch (error) {
    console.error(`Ürün (ID: ${id}) güncellenirken hata:`, error)
    return null
  }
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error(`Ürün (ID: ${id}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Ürün (ID: ${id}) silinirken hata:`, error)
    throw error
  }
}

// Get site settings with fallback values
export async function getSiteSettings(): Promise<any[]> {
  try {
    // Supabase bağlantısını kontrol et
    if (!supabase) {
      console.error("Supabase bağlantısı bulunamadı")
      return []
    }

    const { data, error } = await supabase.from("site_settings").select("*")

    if (error) {
      console.error("Site ayarları alınırken hata:", error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Site ayarları alınırken hata:", error)
    // Hata durumunda boş dizi döndür, ama hatayı fırlatma
    return []
  }
}

// Update multiple settings
export async function updateMultipleSettings(settings: { key: string; value: string }[]): Promise<void> {
  try {
    for (const setting of settings) {
      const { error } = await supabase.from("site_settings").upsert(
        {
          key: setting.key,
          value: setting.value,
        },
        { onConflict: "key" },
      )

      if (error) {
        console.error(`Ayarlar (Key: ${setting.key}) güncellenirken hata:`, error.message)
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error("Ayarlar güncellenirken hata:", error)
    throw error
  }
}

// Create a hero slide
export async function createHeroSlide(slide: Omit<HeroSlide, "id">): Promise<HeroSlide | null> {
  try {
    const { data, error } = await supabase.from("hero_slides").insert([slide]).select().single()

    if (error) {
      console.error("Hero slayt oluşturulurken hata:", error.message)
      throw new Error(error.message)
    }

    return data as HeroSlide
  } catch (error) {
    console.error("Hero slayt oluşturulurken hata:", error)
    return null
  }
}

// Update a hero slide
export async function updateHeroSlide(id: number, slide: Partial<HeroSlide>): Promise<HeroSlide | null> {
  try {
    const { data, error } = await supabase.from("hero_slides").update(slide).eq("id", id).select().single()

    if (error) {
      console.error(`Hero slayt (ID: ${id}) güncellenirken hata:`, error.message)
      throw new Error(error.message)
    }

    return data as HeroSlide
  } catch (error) {
    console.error(`Hero slayt (ID: ${id}) güncellenirken hata:`, error)
    return null
  }
}

// Delete a hero slide
export async function deleteHeroSlide(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("hero_slides").delete().eq("id", id)

    if (error) {
      console.error(`Hero slayt (ID: ${id}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Hero slayt (ID: ${id}) silinirken hata:`, error)
    throw error
  }
}

// Update hero slide order
export async function updateHeroSlideOrder(slides: { id: number; order_index: number }[]): Promise<void> {
  try {
    for (const slide of slides) {
      const { error } = await supabase.from("hero_slides").update({ order_index: slide.order_index }).eq("id", slide.id)

      if (error) {
        console.error(`Hero slayt (ID: ${slide.id}) sırası güncellenirken hata:`, error.message)
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error("Hero slayt sırası güncellenirken hata:", error)
    throw error
  }
}

// Get order details
export async function getOrderDetails(orderId: number): Promise<Order | null> {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*, products(*))`)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error(`Sipariş detayları (ID: ${orderId}) alınırken hata:`, error.message)
      throw new Error(error.message)
    }

    return data as Order
  } catch (error) {
    console.error(`Sipariş detayları (ID: ${orderId}) alınırken hata:`, error)
    return null
  }
}

// Update order status
export async function updateOrderStatus(orderId: number, status: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId)

    if (error) {
      console.error(`Sipariş durumu (ID: ${orderId}) güncellenirken hata:`, error.message)
      return false
    }

    return true
  } catch (error) {
    console.error(`Sipariş durumu (ID: ${orderId}) güncellenirken hata:`, error)
    return false
  }
}

// Get all users
export async function getUsers(
  page = 1,
  itemsPerPage = 10,
  searchTerm = "",
): Promise<{ users: any[]; totalCount: number }> {
  try {
    let query = supabase.from("users").select("*", { count: "exact" })

    if (searchTerm) {
      query = query.ilike("email", `%${searchTerm}%`)
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Kullanıcılar alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return { users: data || [], totalCount: count || 0 }
  } catch (error) {
    console.error("Kullanıcılar alınırken hata:", error)
    return { users: [], totalCount: 0 }
  }
}

// Get all hero slides
export async function getHeroSlides(): Promise<HeroSlide[]> {
  try {
    const { data, error } = await supabase.from("hero_slides").select("*").order("order_index", { ascending: true })

    if (error) {
      console.error("Hero slaytları alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return data as HeroSlide[]
  } catch (error) {
    console.error("Hero slaytları alınırken hata:", error)
    return []
  }
}

// Delete product image
export async function deleteProductImage(imageId: number): Promise<void> {
  try {
    const { error } = await supabase.from("product_images").delete().eq("id", imageId)

    if (error) {
      console.error(`Ürün resmi (ID: ${imageId}) silinirken hata:`, error.message)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error(`Ürün resmi (ID: ${imageId}) silinirken hata:`, error)
    throw error
  }
}

// Function to get orders with pagination and search
export async function getOrders(
  page: number,
  itemsPerPage: number,
  statusFilter?: string,
  searchTerm?: string,
): Promise<{ orders: Order[]; totalCount: number }> {
  try {
    let query = supabase.from("orders").select("*", { count: "exact" })

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter)
    }

    // Apply search filter
    if (searchTerm) {
      query = query.ilike("shipping_address", `%${searchTerm}%`)
    }

    const from = (page - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false })

    if (error) {
      console.error("Siparişler alınırken hata:", error.message)
      throw new Error(error.message)
    }

    return { orders: data as Order[], totalCount: count || 0 }
  } catch (error) {
    console.error("Siparişler alınırken hata:", error)
    return { orders: [], totalCount: 0 }
  }
}
