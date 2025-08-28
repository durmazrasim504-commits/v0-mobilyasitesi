import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Sayfa Bulunamadı</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Aradığınız sayfa bulunamadı. Sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanılamıyor olabilir.
      </p>
      <Link href="/">
        <Button>Ana Sayfaya Dön</Button>
      </Link>
    </div>
  )
}
