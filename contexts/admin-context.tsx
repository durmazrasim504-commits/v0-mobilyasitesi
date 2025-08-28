"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { type AdminUser, adminLogin } from "@/lib/admin-service"

interface AdminContextType {
  user: AdminUser | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      // Check if user is logged in from localStorage
      const storedUser = localStorage.getItem("adminUser")
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (e) {
          console.error("Stored user data is invalid", e)
          localStorage.removeItem("adminUser")
        }
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const { user, error } = await adminLogin(email, password)

      if (error || !user) {
        setError(error || "Giriş başarısız")
        setLoading(false)
        return
      }

      setUser(user)
      if (typeof window !== "undefined") {
        localStorage.setItem("adminUser", JSON.stringify(user))
      }
      router.push("/admin/dashboard")
    } catch (e) {
      console.error("Login error", e)
      setError("Giriş sırasında bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminUser")
    }
    router.push("/admin/login")
  }

  return (
    <AdminContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider")
  }
  return context
}
