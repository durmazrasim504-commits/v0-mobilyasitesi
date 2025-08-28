import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ReturnPolicy() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-card">
          <h1 className="text-2xl font-bold mb-6">İade Koşulları</h1>

          <div className="prose max-w-none">
            <p className="mb-4">Son güncelleme tarihi: 01.05.2023</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. İade Süresi</h2>
            <p className="mb-4">
              Müşterilerimiz, ürünü teslim aldıkları tarihten itibaren 14 gün içinde herhangi bir sebep göstermeksizin
              iade etme hakkına sahiptir. İade sürecini başlatmak için bu süre içinde bize bildirimde bulunmanız
              gerekmektedir.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. İade Koşulları</h2>
            <p className="mb-2">İade edilecek ürünler aşağıdaki koşulları karşılamalıdır:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Ürün kullanılmamış, yıpranmamış ve hasar görmemiş olmalıdır</li>
              <li>Ürün orijinal ambalajında, tüm etiketleri ve aksesuarları ile birlikte iade edilmelidir</li>
              <li>Montajı yapılmış ürünler, kusurlu olmadıkları sürece iade edilemez</li>
              <li>Özel sipariş veya kişiselleştirilmiş ürünler iade edilemez</li>
            </ul>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. İade Süreci</h2>
            <p className="mb-2">İade işlemi için aşağıdaki adımları izleyin:</p>
            <ol className="list-decimal pl-6 mb-4">
              <li>
                İade talebinizi <strong>info@divonagarden.com</strong> adresine e-posta göndererek veya müşteri
                hizmetlerimizi arayarak bildirin
              </li>
              <li>E-postanızda sipariş numaranızı, iade etmek istediğiniz ürünleri ve iade nedeninizi belirtin</li>
              <li>İade talebiniz onaylandıktan sonra, ürünleri orijinal ambalajında belirtilen adrese gönderin</li>
              <li>İade edilen ürünler tarafımızca kontrol edildikten sonra, ödemeniz iade edilecektir</li>
            </ol>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. İade Kargo Ücreti</h2>
            <p className="mb-4">
              Ürün, ayıplı veya yanlış gönderilmiş ise, iade kargo ücreti tarafımızca karşılanacaktır. Müşterinin fikir
              değişikliği nedeniyle yapılan iadelerde, kargo ücreti müşteri tarafından karşılanır.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Ödeme İadesi</h2>
            <p className="mb-4">
              İade işlemi onaylandıktan sonra, ödemeniz orijinal ödeme yönteminize iade edilecektir. Banka havalesi/EFT
              ile yapılan ödemelerin iadesi, banka hesabınıza yapılacaktır. İade işlemi, ürünün tarafımıza ulaşmasından
              ve kontrol edilmesinden sonra 14 iş günü içinde gerçekleştirilecektir.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Hasarlı veya Kusurlu Ürünler</h2>
            <p className="mb-4">
              Ürünü teslim aldığınızda hasarlı veya kusurlu olduğunu fark ederseniz, lütfen 24 saat içinde müşteri
              hizmetlerimize bildirin. Hasarlı ürünlerin fotoğraflarını çekerek <strong>info@divonagarden.com</strong>{" "}
              adresine göndermeniz, işlemin hızlandırılmasına yardımcı olacaktır.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. Değişim</h2>
            <p className="mb-4">
              Ürün değişimi için, önce ürünü iade etmeniz ve ardından yeni bir sipariş vermeniz gerekmektedir. Stok
              durumuna bağlı olarak, istediğiniz ürün mevcut olmayabilir.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. İletişim</h2>
            <p className="mb-4">
              İade ve değişim işlemleri hakkında sorularınız için <strong>info@divonagarden.com</strong> adresinden veya
              müşteri hizmetleri numaramızdan bizimle iletişime geçebilirsiniz.
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
