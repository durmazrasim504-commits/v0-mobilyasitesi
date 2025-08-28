"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function RegisterForm() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Şifreler eşleşmiyor",
        description: "Lütfen şifrenizi doğru girdiğinizden emin olun.",
        variant: "destructive",
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: "Kullanım koşulları",
        description: "Devam etmek için kullanım koşullarını kabul etmelisiniz.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        first_name: firstName,
        last_name: lastName,
        phone,
      }

      const { error } = await signUp(email, password, userData)

      if (error) {
        toast({
          title: "Kayıt başarısız",
          description: error.message || "Kayıt olurken bir hata oluştu.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Kayıt başarılı",
        description: "Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.",
      })

      router.push("/giris-yap")
    } catch (error: any) {
      toast({
        title: "Kayıt başarısız",
        description: error.message || "Kayıt olurken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">Üye Ol</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-1">
              Adınız
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Adınız"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-1">
              Soyadınız
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Soyadınız"
              required
              disabled={isLoading}
            />
          </div>
        </div>

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
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Telefon numaranız
          </label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Telefon numaranız"
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
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
            Parolanızı tekrar girin
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Parolanızı tekrar girin"
            required
            disabled={isLoading}
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(checked) => setAcceptTerms(!!checked)} />
          <label htmlFor="terms" className="text-sm text-gray-600">
            Kişisel verilerimin işlenmesine ilişkin{" "}
            <Link href="/kullanim-kosullari" className="text-primary hover:underline">
              kullanım koşullarını
            </Link>{" "}
            ve{" "}
            <Link href="/gizlilik-politikasi" className="text-primary hover:underline">
              gizlilik politikasını
            </Link>{" "}
            okudum ve kabul ediyorum.
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Kayıt yapılıyor...
            </>
          ) : (
            "Üye ol"
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-gray-600">
          Zaten hesabınız var mı?{" "}
          <Link href="/giris-yap" className="text-primary hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  )
}
