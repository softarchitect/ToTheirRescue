"use client"

import Link from "next/link"
import { LucideIcon, ComponentType } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

export const RabbitNavIcon = ({ className }: { className?: string }) => (
  <Image
    src="/rabbit-logo.png"
    alt="Animals"
    width={16}
    height={16}
    className={className}
  />
)

interface NavLinkProps {
  href: string
  label: string
  icon: LucideIcon | ComponentType<{ className?: string }>
  pathname: string
  onClick?: () => void
}

export function NavLink({ href, label, icon: Icon, pathname, onClick }: NavLinkProps) {
  const isActive = pathname === href
  const isImageIcon = Icon === RabbitNavIcon

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
          : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
      )}
    >
      {isImageIcon ? (
        <Icon className={cn("h-4 w-4", isActive ? "brightness-0 invert" : "")} />
      ) : (
        <Icon className={cn("h-4 w-4", isActive ? "text-white" : "")} />
      )}
      {label}
    </Link>
  )
}

