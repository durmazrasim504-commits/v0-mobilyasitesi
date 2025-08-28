import { supabase } from "./supabase-client"

export async function checkDatabaseSchema() {
  try {
    // Check users table
    const { data: usersColumns, error: usersError } = await supabase.rpc("get_table_columns", { table_name: "users" })

    if (usersError) {
      return { success: false, error: usersError }
    }

    // Check if email column exists
    const hasEmailColumn = usersColumns.some((col: any) => col.column_name === "email")
    if (!hasEmailColumn) {
      return {
        success: false,
        error: "Missing email column in users table",
        fix: "Run SQL: ALTER TABLE users ADD COLUMN email TEXT;",
      }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

// Function to create the get_table_columns RPC if it doesn't exist
export async function setupSchemaCheck() {
  const { error } = await supabase.rpc("get_table_columns", { table_name: "users" })

  if (error && error.message.includes('function "get_table_columns" does not exist')) {
    // Create the RPC function
    const { error: createError } = await supabase.rpc("create_schema_check_function")

    if (createError) {
      return { success: false, error: createError }
    }

    return { success: true, message: "Schema check function created" }
  }

  return { success: true, message: "Schema check function already exists" }
}
