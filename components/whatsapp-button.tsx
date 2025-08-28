"use client"

import { useState } from "react"
import { useSiteSettings } from "@/contexts/site-settings-context"
import { useCart } from "@/contexts/cart-context"

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const { getSetting } = useSiteSettings()
  const { cartItems, total } = useCart()

  const whatsappNumber = getSetting("whatsapp_number") || getSetting("whatsapp_numarasi") || "+905551234567"

  // Sepetteki ürünleri ve toplam tutarı içeren mesaj oluştur
  let defaultMessage =
    getSetting("whatsapp_message") || getSetting("varsayilan_mesaj") || "Merhaba, bilgi almak istiyorum."

  // Eğer sepette ürün varsa, ürün bilgilerini mesaja ekle
  if (cartItems && cartItems.length > 0) {
    defaultMessage = "Merhaba, aşağıdaki ürünler hakkında bilgi almak istiyorum:\n\n"

    cartItems.forEach((item, index) => {
      defaultMessage += `${index + 1}. ${item.product?.name || "Ürün"} - ${item.quantity} adet - ${item.product?.price?.toLocaleString("tr-TR") || "0"} ₺\n`
    })

    defaultMessage += `\nToplam Tutar: ${total?.toLocaleString("tr-TR") || "0"} ₺`
  }

  // WhatsApp numarasından + ve boşlukları temizle
  const cleanNumber = whatsappNumber.replace(/\s+/g, "").replace(/\+/g, "")

  // WhatsApp bağlantısını oluştur
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(defaultMessage)}`

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 z-40 md:bottom-8 md:right-8 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="WhatsApp ile iletişime geç"
    >
      <div className="flex items-center">
        {isHovered && (
          <div className="bg-white text-gray-800 rounded-l-full shadow-lg py-2 px-4 mr-2 transition-all duration-300 text-sm font-medium hidden md:block">
            WhatsApp&apos;tan Yazın
          </div>
        )}
        <div className="bg-green-500 hover:bg-green-600 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20.5027 3.49786C18.2087 1.20386 15.2057 0 12.0537 0C5.47573 0 0.114725 5.36101 0.114725 11.939C0.114725 14.0619 0.651725 16.131 1.67873 17.9894L0 24L6.16573 22.356C7.96373 23.286 9.98973 23.7719 12.0527 23.7719H12.0537C18.6307 23.7719 23.9997 18.4109 23.9997 11.833C23.9997 8.68096 22.7967 5.79186 20.5027 3.49786ZM12.0537 21.7648C10.2787 21.7648 8.54073 21.3 6.99673 20.412L6.62573 20.199L2.86473 21.174L3.85373 17.517L3.61773 17.133C2.63473 15.5318 2.12273 13.7598 2.12273 11.939C2.12273 6.46696 6.58173 2.007 12.0547 2.007C14.6867 2.007 17.1587 2.99996 19.0497 4.89196C20.9407 6.78296 21.9897 9.252 21.9907 11.832C21.9907 17.305 17.5267 21.7648 12.0537 21.7648ZM17.5087 14.4419C17.1987 14.2869 15.7107 13.5559 15.4277 13.4539C15.1457 13.3519 14.9407 13.3009 14.7357 13.6119C14.5307 13.9219 13.9517 14.6019 13.7737 14.8069C13.5957 15.0109 13.4177 15.0369 13.1087 14.8819C12.7997 14.7269 11.8207 14.4139 10.6557 13.3779C9.73873 12.5639 9.11473 11.5699 8.93573 11.2599C8.75773 10.9499 8.91673 10.7849 9.06773 10.6319C9.20273 10.4939 9.36673 10.2749 9.51773 10.0969C9.66873 9.91893 9.71973 9.79093 9.82173 9.58694C9.92373 9.38294 9.87273 9.20494 9.79773 9.04994C9.72273 8.89494 9.09973 7.40698 8.84273 6.78698C8.59973 6.17598 8.34973 6.26398 8.15373 6.26398C7.97573 6.26398 7.77073 6.23798 7.56573 6.23798C7.36073 6.23798 7.02773 6.31298 6.74573 6.62298C6.46373 6.93298 5.68273 7.66394 5.68273 9.15194C5.68273 10.64 6.77173 12.0769 6.92273 12.2809C7.07373 12.4849 9.09973 15.5699 12.1637 16.8859C12.9167 17.2189 13.5057 17.4199 13.9647 17.5749C14.6987 17.8329 15.3647 17.7959 15.8897 17.7199C16.4737 17.6349 17.6637 16.9859 17.9197 16.2649C18.1767 15.5439 18.1767 14.9229 18.1017 14.8069C18.0267 14.6909 17.8217 14.6019 17.5087 14.4419Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </a>
  )
}
