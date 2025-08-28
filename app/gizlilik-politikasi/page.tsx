import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PrivacyPolicy() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-card">
          <h1 className="text-2xl font-bold mb-6">Gizlilik Politikası</h1>

          <div className="prose max-w-none">
            <p className="mb-4">Son güncelleme tarihi: 01.05.2023</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Giriş</h2>
            <p className="mb-4">
              Divona Garden ("biz", "bizim" veya "şirketimiz") olarak, web sitemizi ziyaret ettiğinizde veya
              hizmetlerimizi kullandığınızda gizliliğinize saygı duyuyoruz. Bu Gizlilik Politikası, kişisel
              bilgilerinizi nasıl topladığımızı, kullandığımızı, paylaştığımızı ve koruduğumuzu açıklar.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Topladığımız Bilgiler</h2>
            <p className="mb-2">Sizden aşağıdaki bilgileri toplayabiliriz:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Ad, e-posta adresi, telefon numarası, fatura ve teslimat adresi gibi kişisel bilgiler</li>
              <li>Sipariş geçmişi ve satın alma tercihleri</li>
              <li>IP adresi, tarayıcı türü ve cihaz bilgileri gibi teknik bilgiler</li>
              <li>Çerezler ve benzer teknolojiler aracılığıyla toplanan bilgiler</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Bilgilerinizi Nasıl Kullanıyoruz</h2>
            <p className="mb-2">Topladığımız bilgileri şu amaçlarla kullanabiliriz:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Size ürün ve hizmetlerimizi sunmak</li>
              <li>Siparişlerinizi işleme koymak ve yönetmek</li>
              <li>Müşteri desteği sağlamak</li>
              <li>Web sitemizi ve hizmetlerimizi geliştirmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Bilgilerinizin Paylaşılması</h2>
            <p className="mb-4">
              Kişisel bilgilerinizi, hizmetlerimizi sağlamak için gerekli olduğunda üçüncü taraf hizmet sağlayıcılarla
              (ödeme işlemcileri, kargo şirketleri gibi) paylaşabiliriz. Bu üçüncü taraflar, bilgilerinizi yalnızca
              belirtilen hizmetleri sağlamak için kullanabilir ve bilgilerinizin gizliliğini korumakla yükümlüdür.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Veri Güvenliği</h2>
            <p className="mb-4">
              Kişisel bilgilerinizi korumak için uygun teknik ve organizasyonel önlemler alıyoruz. Ancak, internet
              üzerinden hiçbir veri iletiminin veya elektronik depolamanın %100 güvenli olmadığını unutmayın.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Çerezler</h2>
            <p className="mb-4">
              Web sitemiz, deneyiminizi geliştirmek için çerezleri ve benzer teknolojileri kullanır. Tarayıcı
              ayarlarınızı değiştirerek çerezleri devre dışı bırakabilirsiniz, ancak bu, web sitemizin bazı
              özelliklerinin düzgün çalışmamasına neden olabilir.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Haklarınız</h2>
            <p className="mb-2">Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Kişisel verilerinize erişim talep etme</li>
              <li>Yanlış veya eksik bilgilerin düzeltilmesini isteme</li>
              <li>Belirli koşullar altında kişisel verilerinizin silinmesini talep etme</li>
              <li>Kişisel verilerinizin işlenmesine itiraz etme</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Değişiklikler</h2>
            <p className="mb-4">
              Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda, web
              sitemizde bir bildirim yayınlayacağız.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. İletişim</h2>
            <p className="mb-4">
              Bu Gizlilik Politikası hakkında sorularınız veya endişeleriniz varsa, lütfen{" "}
              <strong>info@divonagarden.com</strong> adresinden bizimle iletişime geçin.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="outline">Ana Sayfaya Dön</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
