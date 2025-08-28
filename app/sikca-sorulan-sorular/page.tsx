import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Sıkça Sorulan Sorular</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">Siparişim ne zaman kargoya verilecek?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Siparişleriniz, ödeme onayından sonra genellikle 1-3 iş günü içerisinde kargoya verilmektedir. Özel
                üretim ürünlerde bu süre 7-14 iş gününe kadar uzayabilir. Siparişinizin durumunu "Sipariş Takibi"
                sayfasından kontrol edebilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">Kargo ücreti ne kadar?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                5.000 TL ve üzeri alışverişlerinizde kargo ücretsizdir. 5.000 TL altındaki siparişlerde ise 150 TL kargo
                ücreti uygulanmaktadır. Büyük hacimli ürünlerde özel kargo ücretleri uygulanabilir, bu durumda sipariş
                öncesinde bilgilendirilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">Ürün iade koşulları nelerdir?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Ürünlerimizi, teslim tarihinden itibaren 14 gün içerisinde iade edebilirsiniz. İade etmek istediğiniz
                ürünün kullanılmamış, hasarsız ve orijinal ambalajında olması gerekmektedir. İade işlemi için müşteri
                hizmetlerimizle iletişime geçmeniz yeterlidir. Özel üretim ve kişiselleştirilmiş ürünlerde iade kabul
                edilmemektedir.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">Havale/EFT ile ödeme nasıl yapılır?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Havale/EFT ile ödeme yapmak için, sipariş tamamlama aşamasında "Banka Havalesi/EFT" seçeneğini
                seçebilirsiniz. Siparişinizi onayladıktan sonra size verilen banka hesap bilgilerine ödemenizi
                yapabilirsiniz. Ödeme açıklamasına mutlaka sipariş numaranızı yazmanız gerekmektedir. Ödemeniz
                onaylandıktan sonra siparişiniz işleme alınacaktır.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg font-medium">Ürünlerin garanti süresi ne kadardır?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Tüm ürünlerimiz, üretim hatalarına karşı 2 yıl garantilidir. Garanti kapsamında değişim veya onarım
                hakkı firmamıza aittir. Kullanıcı hatası, yanlış kullanım, doğal aşınma ve yıpranma garanti kapsamı
                dışındadır. Garanti hizmetinden yararlanmak için fatura veya sipariş numarası ile müşteri hizmetlerimize
                başvurabilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg font-medium">Mağaza konumlarınız nerede?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                İstanbul Ataşehir'de ana showroom'umuz bulunmaktadır. Ayrıca Ankara, İzmir ve Antalya'da da
                mağazalarımız mevcuttur. Tüm mağaza adreslerimize ve çalışma saatlerimize "Mağaza Konumları" sayfasından
                ulaşabilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="text-lg font-medium">Ürünlerin bakımı nasıl yapılmalıdır?</AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Her ürünümüzün bakım talimatları farklılık gösterebilir. Genel olarak bahçe mobilyalarınızı direkt güneş
                ışığından ve yağmurdan korumak, düzenli temizlemek ve kış aylarında kapalı bir alanda muhafaza etmek
                ömrünü uzatacaktır. Ürün özelinde bakım talimatları için ürün sayfalarını inceleyebilir veya müşteri
                hizmetlerimizle iletişime geçebilirsiniz.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="text-lg font-medium">
                Özel ölçü ürün siparişi verebilir miyim?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600">
                Evet, özel ölçü ve tasarım ürünler için hizmet vermekteyiz. Özel siparişleriniz için müşteri
                hizmetlerimizle iletişime geçebilir veya mağazalarımızı ziyaret edebilirsiniz. Özel ürünlerde tasarım,
                ölçü ve malzeme seçeneklerine göre fiyatlandırma yapılmaktadır.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
