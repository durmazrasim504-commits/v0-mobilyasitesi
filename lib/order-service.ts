import type { Order } from "@/lib/admin-service"
import { supabase } from "./supabase-client"

// Türleri tanımla
export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  product?: {
    id: number
    name: string
    slug: string
    price: number
    image_urls?: string[]
  }
}

export type DetailedOrder = Order & {
  items: OrderItem[]
  user_name?: string
  user_email?: string
  receipt?: {
    id: string
    file_path: string
    uploaded_at: string
  }
}

/**
 * Sipariş detaylarını ID'ye göre al
 */
export async function getOrderDetailsById(orderId: number): Promise<DetailedOrder | null> {
  try {
    // Siparişi al
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, user:user_id(*)")
      .eq("id", orderId)
      .single()

    if (orderError) {
      console.error("Sipariş alınırken hata:", orderError)
      return null
    }

    // Sipariş kalemlerini al
    const { data: orderItems, error: itemsError } = await supabase
      .from("order_items")
      .select("*, product:products(*)")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error("Sipariş kalemleri alınırken hata:", itemsError)
      return null
    }

    // Dekontu al
    const { data: receipt, error: receiptError } = await supabase
      .from("order_receipts")
      .select("id, file_path, uploaded_at")
      .eq("order_id", orderId)
      .single()

    // Sipariş ögelerini düzenle
    const formattedItems = orderItems.map((item) => ({
      id: item.id,
      order_id: item.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            slug: item.product.slug,
            price: item.product.price,
            image_urls: item.product.image_urls || [],
          }
        : undefined,
    }))

    // Kullanıcı bilgilerini düzenle
    const userName = order.user ? `${order.user.first_name || ""} ${order.user.last_name || ""}`.trim() : undefined
    const userEmail = order.user ? order.user.email : order.guest_email

    // Detaylı siparişi oluştur
    const detailedOrder: DetailedOrder = {
      ...order,
      items: formattedItems,
      user_name: userName,
      user_email: userEmail,
      receipt: receipt || undefined,
    }

    return detailedOrder
  } catch (error) {
    console.error("Sipariş detayları alınırken hata:", error)
    return null
  }
}

/**
 * Sipariş detaylarını takip numarasına göre al
 */
export async function getOrderDetailsByTrackingNumber(trackingNumber: string): Promise<DetailedOrder | null> {
  try {
    // Siparişi takip numarasına göre al
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("tracking_number", trackingNumber)
      .single()

    if (orderError) {
      console.error("Sipariş alınırken hata:", orderError)
      return null
    }

    // Sipariş ID'sini kullanarak detaylı bilgileri al
    return await getOrderDetailsById(order.id)
  } catch (error) {
    console.error("Sipariş detayları alınırken hata:", error)
    return null
  }
}

/**
 * Tüm siparişleri sayfalama ve filtreleme ile al
 */
export async function getOrders(
  page: number = 1,
  limit: number = 10,
  status?: string,
  searchTerm?: string
): Promise<{ orders: Order[]; totalCount: number }> {
  try {
    // Sorguyu oluştur
    let query = supabase.from("orders").select("*", { count: "exact" })

    // Durum filtresi
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    // Arama filtresi
    if (searchTerm) {
      query = query.or(
        `id.eq.${searchTerm},tracking_number.ilike.%${searchTerm}%,shipping_address.ilike.%${searchTerm}%`
      )
    }

    // Sayfalama
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Sorguyu çalıştır
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to)

    if (error) {
      console.error("Siparişler alınırken hata:", error)
      throw error
    }

    return {
      orders: data || [],
      totalCount: count || 0,
    }
  } catch (error) {
    console.error("Siparişler alınırken hata:", error)
    return { orders: [], totalCount: 0 }
  }
}

/**
 * Sipariş durumunu güncelle
 */
export async function updateOrderStatus(orderId: number, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", orderId)

    if (error) {
      console.error("Sipariş durumu güncellenirken hata:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Sipariş durumu güncellenirken hata:", error)
    return false
  }
}
