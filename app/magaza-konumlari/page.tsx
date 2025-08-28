import Image from "next/image"
import { MapPin, Phone, Clock } from "lucide-react"

export default function StoreLocationsPage() {
  const stores = [
    {
      id: 1,
      name: "İstanbul Showroom",
      address: "Örnek Mah. Bahçe Cad. No:123 Ataşehir/İstanbul",
      phone: "0850 123 45 67",
      hours: "Pazartesi - Cumartesi: 10:00 - 20:00, Pazar: 12:00 - 18:00",
      image: "/modern-furniture-showroom.png",
      mapUrl: "https://maps.google.com/?q=Ataşehir,İstanbul",
    },
    {
      id: 2,
      name: "Ankara Mağaza",
      address: "Çankaya Cad. No:45 Çankaya/Ankara",
      phone: "0850 123 45 68",
      hours: "Pazartesi - Cumartesi: 10:00 - 20:00, Pazar: 12:00 - 18:00",
      image: "/furniture-store-interior.png",
      mapUrl: "https://maps.google.com/?q=Çankaya,Ankara",
    },
    {
      id: 3,
      name: "İzmir Mağaza",
      address: "Alsancak Mah. Kordon Cad. No:78 Konak/İzmir",
      phone: "0850 123 45 69",
      hours: "Pazartesi - Cumartesi: 10:00 - 20:00, Pazar: 12:00 - 18:00",
      image: "/outdoor-furniture-showroom.png",
      mapUrl: "https://maps.google.com/?q=Konak,İzmir",
    },
    {
      id: 4,
      name: "Antalya Mağaza",
      address: "Lara Cad. No:34 Muratpaşa/Antalya",
      phone: "0850 123 45 70",
      hours: "Pazartesi - Cumartesi: 10:00 - 20:00, Pazar: 12:00 - 18:00",
      image: "/garden-furniture-store.png",
      mapUrl: "https://maps.google.com/?q=Muratpaşa,Antalya",
    },
  ]

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Mağaza Konumları</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative h-64">
                <Image src={store.image || "/placeholder.svg"} alt={store.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">{store.name}</h2>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <p>{store.address}</p>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <p>{store.phone}</p>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                    <p>{store.hours}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Haritada Göster
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4">Randevu Alın</h2>
          <p className="text-gray-600 mb-6">
            Mağazalarımızı ziyaret etmeden önce randevu alarak size özel hizmet alabilirsiniz. Uzman ekibimiz,
            ihtiyaçlarınıza en uygun ürünleri seçmenizde yardımcı olacaktır.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Adınız Soyadınız" className="border rounded-md px-4 py-2" />
            <input type="tel" placeholder="Telefon Numaranız" className="border rounded-md px-4 py-2" />
            <input type="email" placeholder="E-posta Adresiniz" className="border rounded-md px-4 py-2" />
            <select className="border rounded-md px-4 py-2">
              <option value="">Mağaza Seçiniz</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            <div className="md:col-span-2">
              <textarea placeholder="Mesajınız" className="border rounded-md px-4 py-2 w-full h-32"></textarea>
            </div>
          </div>

          <button className="mt-4 bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90">
            Randevu Talebi Gönder
          </button>
        </div>
      </div>
    </div>
  )
}
