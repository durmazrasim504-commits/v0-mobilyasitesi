"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  FileText,
  Settings,
  Users,
  CreditCard,
  Phone,
  LogOut,
  ImageIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useAdmin } from "@/contexts/admin-context"
import { useState } from "react"

interface SidebarItemProps {
  href?: string
  icon: React.ReactNode
  title: string
  isActive?: boolean
  isExpanded?: boolean
  hasChildren?: boolean
  onClick?: () => void
}

function SidebarItem({ href, icon, title, isActive, isExpanded, hasChildren, onClick }: SidebarItemProps) {
  if (hasChildren && onClick) {
    return (
      <button
        className={cn(
          "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-all hover:bg-muted",
          isActive ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" : "text-muted-foreground",
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          {icon}
          <span>{title}</span>
        </div>
        {hasChildren && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
      </button>
    )
  }

  return (
    <Link
      href={href || "#"}
      className={cn(
        "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-all hover:bg-muted",
        isActive ? "bg-primary text-primary-foreground font-medium hover:bg-primary/90" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </div>
      {hasChildren && (isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
    </Link>
  )
}

export function AdminSidebar() {
  const { logout } = useAdmin()
  const pathname = usePathname()
  const [settingsExpanded, setSettingsExpanded] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-background">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold">Divona Home Admin</h1>
        </div>
        <div className="flex flex-col flex-1 px-3 mt-6 space-y-1">
          <SidebarItem
            href="/admin/dashboard"
            icon={<LayoutDashboard className="h-5 w-5" />}
            title="Dashboard"
            isActive={isActive("/admin/dashboard")}
          />
          <SidebarItem
            href="/admin/products"
            icon={<ShoppingBag className="h-5 w-5" />}
            title="Ürünler"
            isActive={isActive("/admin/products") || pathname.startsWith("/admin/products/")}
          />
          <SidebarItem
            href="/admin/categories"
            icon={<Tag className="h-5 w-5" />}
            title="Kategoriler"
            isActive={isActive("/admin/categories")}
          />
          <SidebarItem
            href="/admin/orders"
            icon={<FileText className="h-5 w-5" />}
            title="Siparişler"
            isActive={isActive("/admin/orders") || pathname.startsWith("/admin/orders/")}
          />
          <SidebarItem
            href="/admin/users"
            icon={<Users className="h-5 w-5" />}
            title="Kullanıcılar"
            isActive={isActive("/admin/users") || pathname.startsWith("/admin/users/")}
          />
          <SidebarItem
            href="/admin/hero-carousel"
            icon={<ImageIcon className="h-5 w-5" />}
            title="Hero Carousel"
            isActive={isActive("/admin/hero-carousel")}
          />

          {/* Ayarlar Grubu */}
          <div className="pt-4 mt-2">
            <SidebarItem
              icon={<Settings className="h-5 w-5" />}
              title="Ayarlar"
              hasChildren={true}
              isExpanded={settingsExpanded}
              onClick={() => setSettingsExpanded(!settingsExpanded)}
            />
            {settingsExpanded && (
              <div className="ml-4 mt-1 space-y-1 border-l pl-3 border-muted">
                <SidebarItem
                  href="/admin/settings"
                  icon={<Settings className="h-4 w-4" />}
                  title="Genel Ayarlar"
                  isActive={isActive("/admin/settings")}
                />
                <SidebarItem
                  href="/admin/payment-settings"
                  icon={<CreditCard className="h-4 w-4" />}
                  title="Ödeme Ayarları"
                  isActive={isActive("/admin/payment-settings")}
                />
                <SidebarItem
                  href="/admin/contact-settings"
                  icon={<Phone className="h-4 w-4" />}
                  title="İletişim Ayarları"
                  isActive={isActive("/admin/contact-settings")}
                />
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-destructive transition-all hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
