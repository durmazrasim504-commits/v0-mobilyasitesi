"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)

      if (error) throw error

      toast({
        title: "Giriş başarılı",
        description: "Hesabınıza başarıyla giriş yaptınız.",
      })

      router.push("/")
    } catch (error: any) {
      toast({
        title: "Giriş başarısız",
        description: error.message || "Giriş yapılırken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Giriş Yap</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-posta adresiniz
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Parolanız
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Parolanız"
            required
            disabled={isLoading}
          />
          <div className="mt-1 text-right">
            <Link href="/sifremi-unuttum" className="text-sm text-gray-500 hover:text-primary">
              Parolanızı mı unuttunuz?
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Giriş yapılıyor...
            </>
          ) : (
            "Giriş yap"
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-gray-600 mb-4">Henüz hesabınız yok mu? Hemen üye olun ve avantajlardan yararlanın.</p>
        <Link href="/uye-ol">
          <Button variant="outline" className="w-full">
            Üye ol
          </Button>
        </Link>
      </div>
    </div>
  )
}
