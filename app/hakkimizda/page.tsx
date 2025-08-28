import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AboutUs() {
  return (
    <div className="py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Hakkımızda</h1>

          <div className="bg-white rounded-lg shadow-card overflow-hidden mb-8">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Divona Garden</h2>

              <div className="prose max-w-none">
                <p className="mb-4">
                  2010 yılında kurulan Divona Garden, bahçe mobilyaları ve dış mekan dekorasyonu alanında Türkiye'nin
                  önde gelen markalarından biridir. Kaliteli malzemeler, şık tasarımlar ve müşteri memnuniyeti odaklı
                  hizmet anlayışımızla, müşterilerimize en iyi bahçe mobilya deneyimini sunmayı hedefliyoruz.
                </p>

                <p className="mb-4">
                  Ürün yelpazemizde bahçe oturma grupları, köşe takımları, masa takımları, şezlonglar, sandalyeler ve
                  daha birçok dış mekan mobilyası bulunmaktadır. Tüm ürünlerimiz, dayanıklılık ve estetik göz önünde
                  bulundurularak tasarlanmış ve üretilmiştir.
                </p>

                <p className="mb-4">
                  Divona Garden olarak, müşterilerimizin bahçelerini, teraslarını ve balkonlarını keyifli yaşam
                  alanlarına dönüştürmelerine yardımcı olmaktan gurur duyuyoruz. Ürünlerimiz, hava koşullarına dayanıklı
                  malzemelerden üretilmiş olup, uzun yıllar boyunca kullanım sağlar.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Misyonumuz</h2>
              <p className="text-gray-700">
                Müşterilerimize en kaliteli bahçe mobilyalarını sunarak, dış mekan yaşam alanlarını daha konforlu ve
                estetik hale getirmek. Dayanıklı, şık ve fonksiyonel ürünlerle müşteri memnuniyetini en üst düzeyde
                tutmak.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-card p-6">
              <h2 className="text-xl font-bold mb-4">Vizyonumuz</h2>
              <p className="text-gray-700">
                Bahçe mobilyaları sektöründe Türkiye'nin lider markası olmak ve uluslararası pazarda tanınan bir marka
                haline gelmek. Yenilikçi tasarımlar ve sürdürülebilir üretim anlayışıyla sektöre yön veren bir firma
                olmak.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Neden Bizi Tercih Etmelisiniz?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-primary text-3xl mb-2">✓</div>
                <h3 className="font-medium mb-2">Kaliteli Ürünler</h3>
                <p className="text-sm text-gray-600">En kaliteli malzemelerden üretilen dayanıklı bahçe mobilyaları</p>
              </div>

              <div className="border rounded-lg p-4 text-center">
                <div className="text-primary text-3xl mb-2">🚚</div>
                <h3 className="font-medium mb-2">Hızlı Teslimat</h3>
                <p className="text-sm text-gray-600">Türkiye'nin her yerine hızlı ve güvenli teslimat</p>
              </div>

              <div className="border rounded-lg p-4 text-center">
                <div className="text-primary text-3xl mb-2">💬</div>
                <h3 className="font-medium mb-2">Müşteri Desteği</h3>
                <p className="text-sm text-gray-600">Satış öncesi ve sonrası 7/24 müşteri desteği</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-xl font-bold mb-4">Bize Ulaşın</h2>
            <p className="mb-4">Sorularınız veya önerileriniz için bizimle iletişime geçebilirsiniz.</p>
            <Link href="/iletisim">
              <Button>İletişime Geç</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
