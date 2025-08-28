import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Servis rolü anahtarı ile Supabase istemcisi oluştur
// Bu anahtar RLS politikalarını atlayabilir
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function POST(request: Request) {
  try {
    const { email, password, userData } = await request.json()

    // Önce Supabase Auth ile kullanıcı oluştur
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: userData.first_name,
        last_name: userData.last_name,
      },
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Kullanıcı verilerini users tablosuna ekle
    if (authData.user) {
      const userInsertData = {
        id: authData.user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
      }

      const { error: profileError } = await supabaseAdmin.from("users").insert(userInsertData)

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
