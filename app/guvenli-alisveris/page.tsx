import type { Metadata } from "next"
import { ShieldCheck, CreditCard, Lock, AlertCircle, CheckCircle } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Güvenli Alışveriş | Divona Garden",
  description: "Divona Garden güvenli alışveriş bilgileri ve ödeme güvenliği.",
}

export default function SecureShoppingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Güvenli Alışveriş</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <ShieldCheck className="h-8 w-8 text-green-600 mr-3" />
          <h2 className="text-xl font-semibold">Güvenli Alışveriş Garantisi</h2>
        </div>

        <p className="mb-6">
          Divona Garden olarak, müşterilerimize güvenli bir alışveriş deneyimi sunmak için tüm önlemleri alıyoruz.
          Sitemizde yaptığınız tüm işlemler SSL sertifikası ile şifrelenerek korunmaktadır.
        </p>

        <div className="flex items-center mb-4">
          <CreditCard className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-medium">Ödeme Güvenliği</h3>
        </div>

        <p className="mb-4">
          Ödeme işlemleriniz sırasında girdiğiniz tüm bilgiler SSL sertifikası ile şifrelenerek korunmaktadır. Kredi
          kartı bilgileriniz sistemimizde saklanmaz ve üçüncü şahıslarla paylaşılmaz.
        </p>

        <div className="flex flex-wrap gap-4 justify-center my-6">
          <Image src="/visa-logo-new.png" alt="Visa" width={80} height={50} className="object-contain" />
          <Image
            src="/mastercard-logo-abstract.png"
            alt="Mastercard"
            width={80}
            height={50}
            className="object-contain"
          />
          <Image src="/amex-logo-new.png" alt="American Express" width={80} height={50} className="object-contain" />
          <Image src="/troy-logo.png" alt="Troy" width={80} height={50} className="object-contain" />
          <Image src="/iyzico-logo.png" alt="iyzico" width={80} height={50} className="object-contain" />
        </div>

        <div className="flex items-center mb-4">
          <Lock className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-medium">Kişisel Bilgi Güvenliği</h3>
        </div>

        <p className="mb-4">
          Kişisel bilgileriniz, KVKK (Kişisel Verilerin Korunması Kanunu) kapsamında korunmaktadır. Bilgileriniz sadece
          sipariş işlemlerinizin tamamlanması için kullanılır ve üçüncü şahıslarla paylaşılmaz.
        </p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="h-5 w-5 text-amber-600 mr-2" />
            <h4 className="font-medium">Güvenli Alışveriş İpuçları</h4>
          </div>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Tarayıcı adres çubuğunda "https://" ve kilit simgesinin olduğundan emin olun</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Güçlü ve benzersiz şifreler kullanın</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Hesabınızdan çıkış yapmayı unutmayın, özellikle ortak kullanılan bilgisayarlarda</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Şüpheli e-postalara ve bağlantılara dikkat edin</span>
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Image src="/etbis-logo-new.png" alt="ETBIS" width={120} height={120} className="object-contain" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Güvenlik Sertifikalarımız</h3>
        <p className="mb-4">
          Divona Garden olarak, e-ticaret sitemizin güvenliğini sağlamak için sektör standardı güvenlik sertifikalarını
          kullanıyoruz. SSL sertifikamız ve ETBIS (Elektronik Ticaret Bilgi Sistemi) kaydımız ile güvenli alışveriş
          garantisi sunuyoruz.
        </p>
        <p>Herhangi bir sorunuz veya endişeniz olursa, lütfen bizimle iletişime geçmekten çekinmeyin.</p>
      </div>
    </div>
  )
}
