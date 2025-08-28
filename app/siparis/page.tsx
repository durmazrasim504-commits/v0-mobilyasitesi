"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle, Plus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"
import { getAddressesByUserId, createAddress, type Address } from "@/lib/address-service"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSiteSettings } from "@/contexts/site-settings-context"

export default function Checkout() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const { cartItems, subtotal, shipping, total, clearCart } = useCart()

  // Ödeme bilgilerini ekleyelim
  const { getSetting } = useSiteSettings()

  // Banka bilgileri
  const bankName = getSetting("bank_name") || getSetting("banka_adi") || "Örnek Bank"
  const accountHolder = getSetting("account_holder") || getSetting("hesap_sahibi") || "Divona Home Ltd. Şti."
  const iban = getSetting("iban") || "TR12 3456 7890 1234 5678 9012 34"

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new" | "guest">(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isProcessingOrder, setIsProcessingOrder] = useState(false) // New state for order processing
  const [isGuest, setIsGuest] = useState(false)
  const [guestEmail, setGuestEmail] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [acceptDistanceSales, setAcceptDistanceSales] = useState(false)
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer")

  // New address form state
  const [newAddress, setNewAddress] = useState({
    title: "",
    full_name: "",
    address: "",
    city: "",
    postal_code: "",
    country: "Türkiye",
    phone: "",
    is_default: false,
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoading(true)

      if (!cartItems || cartItems.length === 0) {
        router.push("/sepet")
        return
      }

      if (!user) {
        // Guest checkout
        setIsGuest(true)
        setSelectedAddressId("guest")
        setIsLoading(false)
        return
      }

      try {
        const addressData = await getAddressesByUserId(user.id)
        setAddresses(addressData)

        // Select default address or first address
        const defaultAddress = addressData.find((addr) => addr.is_default)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id!)
        } else if (addressData.length > 0) {
          setSelectedAddressId(addressData[0].id!)
        } else {
          setSelectedAddressId("new")
        }
      } catch (error) {
        console.error("Error loading addresses:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAddresses()
  }, [user, router, cartItems])

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleGuestAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddNewAddress = async () => {
    if (!user) return

    try {
      const newAddressData = await createAddress({
        ...newAddress,
        user_id: user.id,
      })

      // Add the new address to the list and select it
      setAddresses((prev) => [...prev, newAddressData])
      setSelectedAddressId(newAddressData.id!)
      setShowAddressDialog(false)

      // Reset the form
      setNewAddress({
        title: "",
        full_name: "",
        address: "",
        city: "",
        postal_code: "",
        country: "Türkiye",
        phone: "",
        is_default: false,
      })

      toast({
        title: "Adres eklendi",
        description: "Yeni adres başarıyla eklendi.",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Adres eklenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // Sadece PDF dosyalarını kabul et
      if (file.type !== "application/pdf") {
        toast({
          title: "Hata",
          description: "Lütfen sadece PDF formatında dekont yükleyin.",
          variant: "destructive",
        })
        return
      }
      setReceiptFile(file)
    }
  }

  // app/siparis/page.tsx - handleSubmit fonksiyonu (Final versiyon)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!cartItems || cartItems.length === 0) {
      router.push("/sepet")
      return
    }

    if (!acceptTerms || !acceptPrivacy || !acceptDistanceSales) {
      toast({
        title: "Hata",
        description: "Devam etmek için tüm sözleşmeleri kabul etmelisiniz.",
        variant: "destructive",
      })
      return
    }

    // Check if receipt file is uploaded
    if (!receiptFile && paymentMethod === "bank_transfer") {
      toast({
        title: "Hata",
        description: "Lütfen ödeme dekontunuzu yükleyin.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setIsProcessingOrder(true) // Show processing overlay

    try {
      let shippingAddress: Address

      if (isGuest) {
        // Guest checkout
        if (!guestEmail) {
          toast({
            title: "Hata",
            description: "Lütfen e-posta adresinizi girin.",
            variant: "destructive",
          })
          setIsSubmitting(false)
          setIsProcessingOrder(false)
          return
        }

        shippingAddress = {
          user_id: "guest",
          ...newAddress,
        }
      } else if (selectedAddressId === "new") {
        // Create new address for registered user
        if (!user) {
          router.push("/giris-yap?redirect=/siparis")
          return
        }

        const newAddressData = await createAddress({
          ...newAddress,
          user_id: user.id,
        })
        shippingAddress = newAddressData
      } else {
        // Use existing address
        const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)
        if (!selectedAddress) {
          throw new Error("Seçili adres bulunamadı")
        }
        shippingAddress = selectedAddress
      }

      console.log("Sipariş oluşturuluyor...", {
        userId: user?.id || null,
        cartItems: cartItems.length,
        shippingAddress: shippingAddress.address,
      })

      // Prepare cart items for API
      const simplifiedCartItems = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
        product: {
          price: item.product?.price || 0,
          name: item.product?.name || "",
          slug: item.product?.slug || "",
        },
      }))

      // Create order via API
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || null,
          cartItems: simplifiedCartItems,
          shippingAddress,
          contactPhone: shippingAddress.phone || "",
          guestEmail: isGuest ? guestEmail : undefined,
        }),
      })

      console.log("API yanıtı:", response.status, response.statusText)

      // Check if response is JSON
      const contentType = response.headers.get("content-type")
      console.log("Content-Type:", contentType)

      if (!response.ok) {
        let errorMessage = `Sunucu hatası (${response.status}): Sipariş oluşturulamadı`

        try {
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // If not JSON, try to get text
            const errorText = await response.text()
            console.error("Non-JSON error response:", errorText.substring(0, 200))
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError)
        }

        throw new Error(errorMessage)
      }

      let data
      try {
        data = await response.json()
        console.log("Sipariş başarıyla oluşturuldu:", data)
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError)
        throw new Error("Sunucu yanıtı işlenemedi")
      }

      if (!data.order || !data.order.id) {
        throw new Error("Sipariş oluşturuldu ancak sipariş bilgileri alınamadı")
      }

      // YENİ EKLENEN BÖLÜM: Dekontu yükle
      if (receiptFile && paymentMethod === "bank_transfer") {
        try {
          const formData = new FormData()
          formData.append("file", receiptFile)
          formData.append("orderId", data.order.id.toString())
          formData.append("trackingNumber", data.order.tracking_number || data.order.id.toString())
          
          console.log("Dekont yükleniyor...", {
            orderId: data.order.id,
            trackingNumber: data.order.tracking_number,
            fileName: receiptFile.name,
            fileSize: receiptFile.size
          })

          const receiptResponse = await fetch("/api/orders/receipt/upload", {
            method: "POST",
            body: formData,
          })
          
          if (!receiptResponse.ok) {
            const errorText = await receiptResponse.text()
            console.error("Dekont yükleme hatası:", errorText)
            // Dekont yükleme hatası oluşsa bile siparişe devam et
          } else {
            const receiptData = await receiptResponse.json()
            console.log("Dekont başarıyla yüklendi", receiptData)
          }
        } catch (receiptError) {
          console.error("Dekont yükleme işlemi sırasında hata:", receiptError)
          // Dekont yükleme hatası oluşsa bile siparişe devam et
        }
      }

      // Clear cart
      await clearCart()

      // Redirect to order confirmation page with tracking number
      const trackingNumber = data.order.tracking_number || data.order.id
      console.log("Teşekkürler sayfasına yönlendiriliyor:", `/siparis/tesekkurler?order_id=${data.order.id}`)

      // Doğrudan window.location kullanarak yönlendirme yapalım
      window.location.href = `/siparis/tesekkurler?order_id=${data.order.id}`
    } catch (error: any) {
      console.error("Order creation error:", error)
      setErrorMessage(error.message || "Sipariş oluşturulurken bir hata oluştu.")
      toast({
        title: "Hata",
        description: error.message || "Sipariş oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
      setIsProcessingOrder(false) // Hide processing overlay on error
    } finally {
      setIsSubmitting(false)
      // Note: We don't set isProcessingOrder to false here because we want to keep showing the overlay until redirect
    }
  }

  if (isLoading || authLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="py-6 relative">
      {/* Processing Order Overlay */}
      {isProcessingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Siparişiniz İşleniyor</h3>
            <p className="text-gray-600 mb-4">
              Lütfen bekleyin, siparişiniz oluşturuluyor. Bu işlem birkaç saniye sürebilir.
            </p>
            <p className="text-sm text-gray-500">Sayfadan ayrılmayın veya tarayıcınızı kapatmayın.</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Sipariş Tamamla</h1>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Hata oluştu</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Address */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-lg font-bold mb-4">Teslimat Adresi</h2>

                {isGuest ? (
                  // Guest checkout form
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="guest_email">E-posta Adresiniz</Label>
                      <Input
                        id="guest_email"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="E-posta adresiniz"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Sipariş bilgileriniz bu e-posta adresine gönderilecektir.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="full_name">Ad Soyad</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={newAddress.full_name}
                          onChange={handleGuestAddressChange}
                          placeholder="Ad Soyad"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleGuestAddressChange}
                          placeholder="Telefon"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adres</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={newAddress.address}
                        onChange={handleGuestAddressChange}
                        placeholder="Adres"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">Şehir</Label>
                        <Input
                          id="city"
                          name="city"
                          value={newAddress.city}
                          onChange={handleGuestAddressChange}
                          placeholder="Şehir"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="postal_code">Posta Kodu</Label>
                        <Input
                          id="postal_code"
                          name="postal_code"
                          value={newAddress.postal_code}
                          onChange={handleGuestAddressChange}
                          placeholder="Posta Kodu"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Ülke</Label>
                        <Input
                          id="country"
                          name="country"
                          value={newAddress.country}
                          onChange={handleGuestAddressChange}
                          placeholder="Ülke"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            router.push("/giris-yap?redirect=/siparis")
                          }}
                        >
                          Giriş Yap
                        </Button>
                        <span className="text-sm text-gray-500">
                          Hesabınız varsa giriş yaparak kayıtlı adreslerinizi kullanabilirsiniz.
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Registered user address selection
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Kayıtlı Adresleriniz</h3>
                      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Plus className="h-4 w-4" /> Yeni Adres Ekle
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Yeni Adres Ekle</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="title">Adres Başlığı</Label>
                                <Input
                                  id="title"
                                  name="title"
                                  value={newAddress.title}
                                  onChange={handleNewAddressChange}
                                  placeholder="Ev, İş, vb."
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="full_name">Ad Soyad</Label>
                                <Input
                                  id="full_name"
                                  name="full_name"
                                  value={newAddress.full_name}
                                  onChange={handleNewAddressChange}
                                  placeholder="Ad Soyad"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="address">Adres</Label>
                              <Textarea
                                id="address"
                                name="address"
                                value={newAddress.address}
                                onChange={handleNewAddressChange}
                                placeholder="Adres"
                                required
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="city">Şehir</Label>
                                <Input
                                  id="city"
                                  name="city"
                                  value={newAddress.city}
                                  onChange={handleNewAddressChange}
                                  placeholder="Şehir"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="postal_code">Posta Kodu</Label>
                                <Input
                                  id="postal_code"
                                  name="postal_code"
                                  value={newAddress.postal_code}
                                  onChange={handleNewAddressChange}
                                  placeholder="Posta Kodu"
                                  required
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="country">Ülke</Label>
                                <Input
                                  id="country"
                                  name="country"
                                  value={newAddress.country}
                                  onChange={handleNewAddressChange}
                                  placeholder="Ülke"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Telefon</Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  value={newAddress.phone}
                                  onChange={handleNewAddressChange}
                                  placeholder="Telefon"
                                  required
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id="is_default"
                                checked={newAddress.is_default}
                                onCheckedChange={(checked) =>
                                  setNewAddress((prev) => ({ ...prev, is_default: !!checked }))
                                }
                              />
                              <Label htmlFor="is_default">Bu adresi varsayılan olarak kaydet</Label>
                            </div>

                            <div className="flex justify-end mt-4">
                              <Button type="button" onClick={handleAddNewAddress}>
                                Adresi Kaydet
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {addresses.length > 0 ? (
                      <div className="mb-6">
                        <RadioGroup
                          value={selectedAddressId.toString()}
                          onValueChange={(value) =>
                            setSelectedAddressId(value === "new" ? "new" : Number.parseInt(value))
                          }
                        >
                          {addresses.map((address) => (
                            <div
                              key={address.id}
                              className="flex items-start space-x-2 mb-3 p-3 border rounded-md hover:bg-gray-50"
                            >
                              <RadioGroupItem value={address.id!.toString()} id={`address-${address.id}`} />
                              <div className="grid gap-1.5">
                                <Label htmlFor={`address-${address.id}`} className="font-medium">
                                  {address.title}{" "}
                                  {address.is_default && <span className="text-primary">(Varsayılan)</span>}
                                </Label>
                                <p className="text-sm text-gray-600">
                                  {address.full_name}, {address.address}, {address.city}, {address.postal_code},{" "}
                                  {address.country}
                                </p>
                                <p className="text-sm text-gray-600">{address.phone}</p>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    ) : (
                      <div className="text-center py-6 border rounded-md bg-gray-50">
                        <p className="text-gray-500 mb-4">Henüz kayıtlı adresiniz bulunmuyor.</p>
                        <Button onClick={() => setShowAddressDialog(true)}>
                          <Plus className="h-4 w-4 mr-2" /> Yeni Adres Ekle
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Ödeme Yöntemi</h2>
                <div className="mb-4">
                  <RadioGroup defaultValue="bank_transfer" onValueChange={(value) => setPaymentMethod(value)}>
                    <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
                      <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                      <Label htmlFor="bank_transfer">Banka Havalesi / EFT</Label>
                    </div>
                  </RadioGroup>
                </div>

                {paymentMethod === "bank_transfer" && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="font-medium mb-2">Havale/EFT Bilgileri</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Banka:</span> {bankName}
                      </p>
                      <p>
                        <span className="font-medium">Hesap Sahibi:</span> {accountHolder}
                      </p>
                      <p>
                        <span className="font-medium">IBAN:</span> {iban}
                      </p>
                      <p className="mt-2 text-xs">
                        Ödemenizi yaptıktan sonra sipariş numaranızı açıklama kısmına yazmayı unutmayınız.
                      </p>
                    </div>
                  </div>
                )}

                {/* Dekont Yükleme */}
                {paymentMethod === "bank_transfer" && (
                  <div className="mb-4">
                    <Label htmlFor="receipt" className="block mb-2">
                      Dekont Yükleme <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center">
                      <input
                        type="file"
                        id="receipt"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Dekont Yükle (Sadece PDF)
                      </Button>
                      {receiptFile && (
                        <span className="ml-3 text-sm text-gray-600">
                          {receiptFile.name} ({Math.round(receiptFile.size / 1024)} KB)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ödemenizi yaptıktan sonra dekontu PDF formatında yüklemeniz gerekmektedir.
                    </p>
                  </div>
                )}

                <div className="flex items-start bg-yellow-50 p-3 rounded-md">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <p className="text-sm text-yellow-800">
                    Ödemenizi yaptıktan sonra sipariş numaranızı açıklama kısmına yazmayı unutmayınız.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h2 className="text-lg font-bold mb-4">Sipariş Özeti</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ara Toplam</span>
                    <span>{subtotal?.toLocaleString("tr-TR") || "0"} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kargo</span>
                    <span>{shipping === 0 ? "Ücretsiz" : `${shipping?.toLocaleString("tr-TR") || "0"} ₺`}</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Toplam</span>
                      <span className="text-xl">{total?.toLocaleString("tr-TR") || "0"} ₺</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="accept_terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(!!checked)}
                      required
                    />
                    <Label htmlFor="accept_terms" className="text-sm">
                      <span className="text-gray-700">
                        <a
                          href="/kullanim-kosullari"
                          target="_blank"
                          className="text-primary hover:underline"
                          rel="noreferrer"
                        >
                          Kullanım Koşulları
                        </a>
                        'nı okudum ve kabul ediyorum.
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id="accept_privacy"
                      checked={acceptPrivacy}
                      onCheckedChange={(checked) => setAcceptPrivacy(!!checked)}
                      required
                    />
                    <Label htmlFor="accept_privacy" className="text-sm">
                      <span className="text-gray-700">
                        <a
                          href="/gizlilik-politikasi"
                          target="_blank"
                          className="text-primary hover:underline"
                          rel="noreferrer"
                        >
                          Gizlilik Politikası
                        </a>
                        'nı okudum ve kabul ediyorum.
                      </span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="accept_distance_sales"
                      checked={acceptDistanceSales}
                      onCheckedChange={(checked) => setAcceptDistanceSales(!!checked)}
                      required
                    />
                    <Label htmlFor="accept_distance_sales" className="text-sm">
                      <span className="text-gray-700">
                        <a
                          href="/mesafeli-satis-sozlesmesi"
                          target="_blank"
                          className="text-primary hover:underline"
                          rel="noreferrer"
                        >
                          Mesafeli Satış Sözleşmesi
                        </a>
                        'ni okudum ve kabul ediyorum.
                      </span>
                    </Label>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sipariş Oluşturuluyor...
                    </>
                  ) : (
                    "Siparişi Tamamla"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
