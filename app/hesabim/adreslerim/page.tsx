"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AccountSidebar } from "@/components/sidebar"
import { MobileAccountSidebar } from "@/components/mobile-account-sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { getAddressesByUserId, createAddress, updateAddress, deleteAddress, type Address } from "@/lib/address-service"

export default function AddressesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddressDialog, setShowAddressDialog] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [addressForm, setAddressForm] = useState({
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
    if (!authLoading && !user) {
      router.push("/giris-yap?redirect=/hesabim/adreslerim")
      return
    }

    const fetchAddresses = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const addressData = await getAddressesByUserId(user.id)
        setAddresses(addressData)
      } catch (error) {
        console.error("Error loading addresses:", error)
        toast({
          title: "Hata",
          description: "Adresler yüklenirken bir hata oluştu.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchAddresses()
    }
  }, [user, authLoading, router])

  const handleAddressFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAddressForm((prev) => ({ ...prev, [name]: value }))
  }

  const resetAddressForm = () => {
    setAddressForm({
      title: "",
      full_name: "",
      address: "",
      city: "",
      postal_code: "",
      country: "Türkiye",
      phone: "",
      is_default: false,
    })
    setEditingAddress(null)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setAddressForm({
      title: address.title,
      full_name: address.full_name,
      address: address.address,
      city: address.city,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone,
      is_default: address.is_default,
    })
    setShowAddressDialog(true)
  }

  const handleSaveAddress = async () => {
    if (!user) return

    try {
      if (editingAddress) {
        // Update existing address
        const updatedAddress = await updateAddress(editingAddress.id!, {
          ...addressForm,
          user_id: user.id,
        })

        setAddresses((prev) => prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr)))

        toast({
          title: "Adres güncellendi",
          description: "Adres başarıyla güncellendi.",
        })
      } else {
        // Create new address
        const newAddress = await createAddress({
          ...addressForm,
          user_id: user.id,
        })

        setAddresses((prev) => [...prev, newAddress])

        toast({
          title: "Adres eklendi",
          description: "Yeni adres başarıyla eklendi.",
        })
      }

      setShowAddressDialog(false)
      resetAddressForm()
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Adres kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAddress = async (addressId: number) => {
    if (!confirm("Bu adresi silmek istediğinizden emin misiniz?")) return

    try {
      await deleteAddress(addressId)
      setAddresses((prev) => prev.filter((addr) => addr.id !== addressId))

      toast({
        title: "Adres silindi",
        description: "Adres başarıyla silindi.",
      })
    } catch (error: any) {
      toast({
        title: "Hata",
        description: error.message || "Adres silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (authLoading || (isLoading && user)) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Adreslerim</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mobile Account Sidebar */}
          <MobileAccountSidebar />

          {/* Desktop Sidebar */}
          <div className="hidden md:block">
            <AccountSidebar />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Kayıtlı Adreslerim</h2>
                <Dialog
                  open={showAddressDialog}
                  onOpenChange={(open) => {
                    setShowAddressDialog(open)
                    if (!open) resetAddressForm()
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Yeni Adres Ekle
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Adres Başlığı</Label>
                          <Input
                            id="title"
                            name="title"
                            value={addressForm.title}
                            onChange={handleAddressFormChange}
                            placeholder="Ev, İş, vb."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="full_name">Ad Soyad</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={addressForm.full_name}
                            onChange={handleAddressFormChange}
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
                          value={addressForm.address}
                          onChange={handleAddressFormChange}
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
                            value={addressForm.city}
                            onChange={handleAddressFormChange}
                            placeholder="Şehir"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="postal_code">Posta Kodu</Label>
                          <Input
                            id="postal_code"
                            name="postal_code"
                            value={addressForm.postal_code}
                            onChange={handleAddressFormChange}
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
                            value={addressForm.country}
                            onChange={handleAddressFormChange}
                            placeholder="Ülke"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefon</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={addressForm.phone}
                            onChange={handleAddressFormChange}
                            placeholder="Telefon"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="is_default"
                          checked={addressForm.is_default}
                          onCheckedChange={(checked) => setAddressForm((prev) => ({ ...prev, is_default: !!checked }))}
                        />
                        <Label htmlFor="is_default">Bu adresi varsayılan olarak kaydet</Label>
                      </div>

                      <div className="flex justify-end mt-4">
                        <Button type="button" onClick={handleSaveAddress}>
                          {editingAddress ? "Güncelle" : "Kaydet"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {addresses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <h3 className="font-medium">{address.title}</h3>
                          {address.is_default && (
                            <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                              Varsayılan
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditAddress(address)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id!)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{address.full_name}</p>
                      <p className="text-sm text-gray-600">{address.address}</p>
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.postal_code}, {address.country}
                      </p>
                      <p className="text-sm text-gray-600">{address.phone}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500 mb-4">Henüz kayıtlı adresiniz bulunmuyor.</p>
                  <Button onClick={() => setShowAddressDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" /> Yeni Adres Ekle
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
