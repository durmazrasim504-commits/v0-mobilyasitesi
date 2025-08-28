import type { Metadata } from "next"
import { Shield, Lock, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "SSL Sertifikası | Divona Garden",
  description: "Divona Garden SSL sertifikası ve güvenlik bilgileri.",
}

export default function SSLCertificatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">SSL Sertifikası</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="h-8 w-8 text-green-600 mr-3" />
          <h2 className="text-xl font-semibold">Güvenli Alışveriş</h2>
        </div>

        <p className="mb-4">
          Divona Garden olarak, müşterilerimizin güvenliğini en üst düzeyde tutmak için SSL sertifikası kullanıyoruz. Bu
          sayede sitemizde gerçekleştirdiğiniz tüm işlemler şifrelenerek korunmaktadır.
        </p>

        <div className="flex items-center mb-4 mt-6">
          <Lock className="h-6 w-6 text-green-600 mr-3" />
          <h3 className="text-lg font-medium">SSL Nedir?</h3>
        </div>

        <p className="mb-6">
          SSL (Secure Sockets Layer), internet üzerinden gönderilen verilerin güvenliğini sağlayan bir şifreleme
          protokolüdür. SSL sertifikası, web sitesi ile kullanıcı arasındaki iletişimin şifrelenmesini sağlayarak,
          kişisel bilgilerinizin güvenliğini garanti eder.
        </p>

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">SSL Sertifikamız Size Şunları Sağlar:</h4>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Kişisel ve ödeme bilgilerinizin şifrelenerek korunması</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Güvenli bir alışveriş deneyimi</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Tarayıcınızda adres çubuğunda güvenli bağlantı simgesi</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
              <span>Veri bütünlüğünün korunması</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Nasıl Kontrol Edebilirsiniz?</h3>
        <p className="mb-4">
          Web sitemizin güvenli olduğunu kontrol etmek için, tarayıcınızın adres çubuğunda yer alan kilit simgesine
          tıklayabilirsiniz. Bu simge, bağlantınızın güvenli olduğunu ve SSL sertifikamızın geçerli olduğunu gösterir.
        </p>
        <p>
          Divona Garden olarak, müşterilerimizin güvenliğini her zaman ön planda tutuyoruz. Herhangi bir sorunuz veya
          endişeniz olursa, lütfen bizimle iletişime geçmekten çekinmeyin.
        </p>
      </div>
    </div>
  )
}
