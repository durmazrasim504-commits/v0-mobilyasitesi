import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TermsOfService() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-card">
          <h1 className="text-2xl font-bold mb-6">Kullanım Koşulları</h1>

          <div className="prose max-w-none">
            <p className="mb-4">Son güncelleme tarihi: 01.05.2023</p>

            <h2 className="text-xl font-semibold mt-6 mb-3">1. Kabul Edilen Şartlar</h2>
            <p className="mb-4">
              Divona Garden web sitesine ("Site") erişerek veya kullanarak, bu Kullanım Koşullarını ("Koşullar") kabul
              etmiş olursunuz. Bu Koşulları kabul etmiyorsanız, lütfen Siteyi kullanmayın.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">2. Değişiklikler</h2>
            <p className="mb-4">
              Bu Koşulları herhangi bir zamanda değiştirme hakkını saklı tutarız. Değişiklikler, Site üzerinde
              yayınlandıktan sonra geçerli olacaktır. Değişikliklerden sonra Siteyi kullanmaya devam etmeniz,
              güncellenmiş Koşulları kabul ettiğiniz anlamına gelir.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">3. Hesap Oluşturma</h2>
            <p className="mb-4">
              Sitemizin bazı bölümlerini kullanmak için bir hesap oluşturmanız gerekebilir. Hesap bilgilerinizin
              gizliliğini korumak ve hesabınız altında gerçekleşen tüm etkinliklerden sorumlu olmak sizin
              sorumluluğunuzdadır.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">4. Ürünler ve Siparişler</h2>
            <p className="mb-4">
              Sitede gösterilen ürünlerin renkleri ve diğer detayları, ekran ayarlarınıza bağlı olarak gerçek ürünlerden
              farklılık gösterebilir. Tüm ürün açıklamaları, fiyatlar ve promosyonlar önceden haber verilmeksizin
              değiştirilebilir.
            </p>
            <p className="mb-4">
              Bir sipariş verdiğinizde, siparişinizi kabul etme hakkını saklı tutarız. Siparişinizi aldıktan sonra,
              siparişinizin onaylandığını belirten bir e-posta alacaksınız.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">5. Ödeme ve Fiyatlandırma</h2>
            <p className="mb-4">
              Tüm fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir. Ödeme sırasında, banka havalesi/EFT yöntemini
              kullanabilirsiniz. Ödemeniz onaylanana kadar siparişiniz işleme alınmayacaktır.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">6. Teslimat</h2>
            <p className="mb-4">
              Teslimat süreleri tahminidir ve garanti edilmez. Teslimat süresi, stok durumuna, ödeme onayına ve teslimat
              adresinize bağlı olarak değişebilir. Teslimat sırasında ürünleri kontrol etmeniz ve herhangi bir hasar
              veya eksiklik durumunda hemen bildirmeniz önerilir.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">7. İade ve Değişim</h2>
            <p className="mb-4">
              İade ve değişim politikamız hakkında detaylı bilgi için lütfen "İade Koşulları" sayfamızı ziyaret edin.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">8. Fikri Mülkiyet</h2>
            <p className="mb-4">
              Site ve içeriği (metin, grafikler, logolar, düğme simgeleri, görüntüler, ses klipleri, dijital indirmeler,
              veri derlemeleri) şirketimizin veya içerik sağlayıcılarımızın mülkiyetindedir ve telif hakkı, ticari marka
              ve diğer fikri mülkiyet yasaları tarafından korunmaktadır.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">9. Sorumluluk Sınırlaması</h2>
            <p className="mb-4">
              Sitemizi kullanımınızdan kaynaklanan doğrudan, dolaylı, arızi, özel veya sonuç olarak ortaya çıkan
              zararlardan sorumlu olmayacağız.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">10. Geçerli Yasa</h2>
            <p className="mb-4">
              Bu Koşullar, Türkiye Cumhuriyeti yasalarına tabidir ve bu yasalara göre yorumlanacaktır.
            </p>

            <h2 className="text-xl font-semibold mt-6 mb-3">11. İletişim</h2>
            <p className="mb-4">
              Bu Kullanım Koşulları hakkında sorularınız veya endişeleriniz varsa, lütfen{" "}
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
