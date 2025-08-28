import { Loader2 } from "lucide-react"

export default function OrderConfirmationLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Siparişiniz Hazırlanıyor</h2>
        <p className="text-gray-600 mb-6">Sipariş bilgileri yükleniyor...</p>
        <div className="max-w-md mx-auto bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm">
          Lütfen sayfayı kapatmayın veya yenilemeyin. Siparişiniz işleniyor...
        </div>

        <div className="mt-8 flex justify-center">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
              <span className="text-green-600 font-medium">Sipariş alındı</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
              <span className="text-green-600 font-medium">Ödeme onaylandı</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse mr-3"></div>
              <span className="font-medium">Sipariş detayları hazırlanıyor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
