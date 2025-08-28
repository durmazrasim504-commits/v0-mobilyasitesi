import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function POST(request: Request) {
  try {
    console.log("Sipariş oluşturma API'si çağrıldı")

    // Parse JSON body
    let body
    try {
      body = await request.json()
      console.log("Request body parsed:", JSON.stringify(body).substring(0, 200) + "...")
    } catch (error) {
      console.error("JSON parse error:", error)
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { userId, cartItems, shippingAddress, contactPhone, guestEmail } = body

    // Validate input data
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("Invalid cart items:", cartItems)
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 })
    }

    if (!shippingAddress) {
      console.error("Missing shipping address")
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 })
    }

    // Calculate total amount
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price || 0
      return total + price * item.quantity
    }, 0)

    // Calculate shipping
    const shipping = subtotal > 5000 ? 0 : 150
    const finalTotal = subtotal + shipping

    // Generate tracking number
    const trackingNumber = generateTrackingNumber()
    console.log("Generated tracking number:", trackingNumber)

    // Create order data object
    const orderData = {
      user_id: userId || null,
      total_amount: finalTotal,
      status: "pending",
      payment_method: "bank_transfer",
      payment_status: "pending",
      shipping_address: shippingAddress.address || "",
      shipping_city: shippingAddress.city || "",
      shipping_postal_code: shippingAddress.postal_code || "",
      shipping_country: shippingAddress.country || "Türkiye",
      contact_phone: contactPhone || "",
      guest_email: !userId && guestEmail ? guestEmail : null,
      tracking_number: trackingNumber,
    }

    console.log("Creating order with data:", JSON.stringify(orderData).substring(0, 200) + "...")

    // Create order using admin client
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").insert(orderData).select().single()

    if (orderError) {
      console.error("Order creation error:", orderError)
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    if (!order || !order.id) {
      console.error("Failed to create order: No order data returned")
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    console.log("Order created successfully:", order.id)

    // Create order items using admin client
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product?.price || item.price || 0,
    }))

    console.log("Creating order items:", orderItems.length)

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Order items creation error:", itemsError)
      return NextResponse.json({ error: itemsError.message }, { status: 400 })
    }

    // Update product stock using admin client
    for (const item of cartItems) {
      if (item.product_id) {
        // First get current stock
        const { data: productData } = await supabaseAdmin
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single()

        const currentStock = productData?.stock || 0
        const newStock = Math.max(0, currentStock - item.quantity)

        console.log(`Updating stock for product ${item.product_id}: ${currentStock} -> ${newStock}`)

        const { error: stockError } = await supabaseAdmin
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product_id)

        if (stockError) {
          console.error("Stock update error:", stockError)
        }
      }
    }

    console.log("Order process completed successfully")
    return NextResponse.json({ success: true, order })
  } catch (error: any) {
    console.error("Error in order creation API:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}

// Generate a tracking number
function generateTrackingNumber(): string {
  const prefix = "TR"
  const randomPart = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0")
  const timestamp = Date.now().toString().slice(-4)
  return `${prefix}${randomPart}${timestamp}`
}
