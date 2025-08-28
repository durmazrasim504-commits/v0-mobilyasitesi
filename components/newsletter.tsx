import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const Newsletter = () => {
  return (
    <div className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Bültenimize Abone Olun</h2>
        <p className="mb-6 max-w-md mx-auto">Yeni ürünler, kampanyalar ve indirimlerden ilk siz haberdar olun.</p>

        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <Input type="email" placeholder="E-posta adresiniz" className="bg-white text-black" required />
          <Button className="bg-white text-primary hover:bg-gray-100">Abone Ol</Button>
        </form>
      </div>
    </div>
  )
}

export default Newsletter
