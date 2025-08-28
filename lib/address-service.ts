import { supabase } from "@/lib/supabase-client"

export type Address = {
  id?: number
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

export async function getAddressesByUserId(userId: string): Promise<Address[]> {
  try {
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    throw error
  }
}

export async function createAddress(address: Omit<Address, "id">): Promise<Address> {
  try {
    // If this address is set as default, update other default addresses
    if (address.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", address.user_id)
        .eq("is_default", true)
    }

    const { data, error } = await supabase.from("addresses").insert(address).select().single()

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

export async function updateAddress(id: number, address: Partial<Address>): Promise<Address> {
  try {
    // If this address is set as default, update other default addresses
    if (address.is_default) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", address.user_id)
        .eq("is_default", true)
    }

    const { data, error } = await supabase.from("addresses").update(address).eq("id", id).select().single()

    if (error) throw error

    return data
  } catch (error) {
    throw error
  }
}

export async function deleteAddress(id: number): Promise<void> {
  try {
    const { error } = await supabase.from("addresses").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    throw error
  }
}
