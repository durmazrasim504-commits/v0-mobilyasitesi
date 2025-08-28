import { createClient as createClientBase } from "@supabase/supabase-js"

// createClient fonksiyonunu güncelleyelim
export function createClient() {
  // Önce .env.local'den, yoksa normal çevre değişkenlerinden al
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL ve Service Role Key sağlanmalıdır")
    throw new Error("Supabase URL ve Service Role Key sağlanmalıdır")
  }

  return createClientBase(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false, // Admin işlemleri için oturum bilgilerini saklamayalım
    },
  })
}

// Kullanıcı tipi
export type User = {
  id: string
  first_name?: string
  last_name?: string
  phone?: string
  created_at?: string
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

// Kategori tipi
export type Category = {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
}

// Sepet öğesi tipi
export type CartItem = {
  id: number
  user_id: string
  product_id: number
  quantity: number
  product?: Product
  created_at: string
}

// Sipariş tipi
export type Order = {
  id: number
  user_id: string
  total_amount: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  payment_method: "bank_transfer"
  payment_status: "pending" | "completed"
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  shipping_country: string
  contact_phone: string
  created_at: string
  order_items?: OrderItem[]
}

// Sipariş öğesi tipi
export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: Product
}

// Adres tipi
export type Address = {
  id: number
  user_id: string
  title: string
  full_name: string
  address: string
  city: string
  postal_code: string
  country: string
  phone: string
  is_default: boolean
}
