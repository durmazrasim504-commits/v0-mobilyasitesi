import { supabase } from "./supabase-client"

export async function addToWishlist(userId: string, productId: number) {
  try {
    const { error } = await supabase.from("wishlist_items").insert({
      user_id: userId,
      product_id: productId,
    })

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation - item already in wishlist
        return true
      }
      throw error
    }

    return true
  } catch (error) {
    throw error
  }
}

export async function removeFromWishlist(userId: string, productId: number) {
  try {
    const { error } = await supabase.from("wishlist_items").delete().eq("user_id", userId).eq("product_id", productId)

    if (error) throw error

    return true
  } catch (error) {
    throw error
  }
}

export async function isInWishlist(userId: string, productId: number) {
  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned"
      throw error
    }

    return !!data
  } catch (error) {
    return false
  }
}

export async function getWishlistItems(userId: string) {
  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*, products(*)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data.map((item) => item.products)
  } catch (error) {
    return []
  }
}
