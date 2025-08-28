import type { Metadata } from "next"
import { FileText, Shield, User, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Divona Garden",
  description: "Divona Garden KVKK Kişisel Verilerin Korunması Kanunu Aydınlatma Metni.",
}

export default function KVKKPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">KVKK Aydınlatma Metni</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center mb-4">
          <FileText className="h-8 w-8 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold">Kişisel Verilerin Korunması Kanunu Aydınlatma Metni</h2>
        </div>

        <div className="prose max-w-none">
          <p>
            Divona Garden olarak kişisel verilerinizin güvenliği ve gizliliği konusunda azami hassasiyet göstermekteyiz.
            Bu bilinçle, Divona Garden olarak ürün ve hizmetlerimizden faydalanan müşterilerimiz dahil, tüm
            paydaşlarımıza ait her türlü kişisel verilerin 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK")'na
            uygun olarak işlenmesine, kaydedilmesine, aktarılmasına, paylaşılmasına ve saklanmasına büyük önem
            vermekteyiz.
          </p>

          <h3 className="flex items-center mt-6 mb-3">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span>Veri Sorumlusu</span>
          </h3>

          <p>
            6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak
            Divona Garden Ltd. Şti. tarafından aşağıda açıklanan kapsamda işlenebilecektir.
          </p>

          <h3 className="flex items-center mt-6 mb-3">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <span>Kişisel Verilerin İşlenme Amacı</span>
          </h3>

          <p>
            Kişisel verileriniz KVKK'nın 5. ve 6. maddelerinde belirtilen kişisel veri işleme şartları ve amaçları
            dahilinde işlenecektir. Divona Garden tarafından kişisel verileriniz aşağıda belirtilen amaç ve hukuki
            sebepler gibi ancak bunlarla sınırlı olmayan benzer amaç ve sebeplerle işlenebilir:
          </p>

          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Ürün ve hizmetlerimizin sunulabilmesi</li>
            <li>Siparişlerinizin alınması, ödeme işlemlerinizin gerçekleştirilmesi ve teslimatların yapılabilmesi</li>
            <li>Müşteri ilişkileri ve destek hizmetlerinin sağlanması</li>
            <li>İletişim bilgilerinizin güncellenmesi</li>
            <li>Yasal yükümlülüklerimizin yerine getirilmesi</li>
            <li>Ürün ve hizmetlerimizin iyileştirilmesi ve geliştirilmesi</li>
            <li>Ticari elektronik ileti onayı mevcut müşterilerimize kampanya ve fırsatların duyurulması</li>
          </ul>

          <h3 className="flex items-center mt-6 mb-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
            <span>Kişisel Verilerin Aktarılması</span>
          </h3>

          <p>
            Kişisel verileriniz, yukarıda belirtilen amaçların gerçekleştirilmesi ile sınırlı olmak üzere, iş
            ortaklarımıza, tedarikçilerimize, kanunen yetkili kamu kurumlarına ve özel kişilere KVKK'nın 8. ve 9.
            maddelerinde belirtilen kişisel veri işleme şartları ve amaçları çerçevesinde aktarılabilecektir.
          </p>

          <h3 className="flex items-center mt-6 mb-3">
            <Shield className="h-5 w-5 text-blue-600 mr-2" />
            <span>Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</span>
          </h3>

          <p>
            Kişisel verileriniz, her türlü sözlü, yazılı ya da elektronik ortamda, yukarıda yer verilen amaçlar
            doğrultusunda ürün ve hizmetlerimizin sunulabilmesi ve bu kapsamda sözleşmesel ve yasal yükümlülüklerimizin
            tam ve gereği gibi ifa edilebilmesi için toplanmaktadır.
          </p>

          <h3 className="flex items-center mt-6 mb-3">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            <span>KVKK'nın 11. Maddesi Kapsamındaki Haklarınız</span>
          </h3>

          <p>KVKK'nın 11. maddesi uyarınca, Divona Garden'a başvurarak aşağıdaki haklarınızı kullanabilirsiniz:</p>

          <ul className="list-disc pl-5 mt-2 mb-4">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
            <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
            <li>
              KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok
              edilmesini isteme
            </li>
            <li>
              Kişisel verilerinizin aktarıldığı üçüncü kişilere yukarıda belirtilen düzeltme, silme veya yok edilme
              işlemlerinin bildirilmesini isteme
            </li>
            <li>
              İşlenen verilerinizin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir
              sonucun ortaya çıkmasına itiraz etme
            </li>
            <li>
              Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın
              giderilmesini talep etme
            </li>
          </ul>

          <p>
            Bu haklarınızı kullanmak için, kimliğinizi tespit edici gerekli bilgiler ile KVKK'nın 11. maddesinde
            belirtilen haklardan kullanmayı talep ettiğiniz hakkınıza yönelik açıklamalarınızı içeren talebinizi yazılı
            olarak veya kayıtlı elektronik posta (KEP) adresi, güvenli elektronik imza, mobil imza ya da tarafımıza daha
            önce bildirdiğiniz ve sistemimizde kayıtlı bulunan elektronik posta adresinizi kullanmak suretiyle
            info@divonagarden.com adresine iletebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
