import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with the service role key
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    console.log(`Fetching order details for ID: ${orderId}`)

    // Get the order
    const { data: order, error: orderError } = await supabaseAdmin.from("orders").select("*").eq("id", orderId).single()

    if (orderError) {
      console.error(`Error fetching order (ID: ${orderId}):`, orderError.message)
      return NextResponse.json({ error: orderError.message }, { status: 400 })
    }

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    console.log(`Found order: ${order.id}, tracking: ${order.tracking_number}`)

    // Get order items
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from("order_items")
      .select("*, product:products(id, name, slug, price)")
      .eq("order_id", orderId)

    if (itemsError) {
      console.error(`Error fetching order items (Order ID: ${orderId}):`, itemsError.message)
      // Continue with the order even if items can't be fetched
    }

    // Return the order with items
    return NextResponse.json({
      order: {
        ...order,
        order_items: orderItems || [],
      },
    })
  } catch (error: any) {
    console.error("Error in order details API:", error)
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 })
  }
}
