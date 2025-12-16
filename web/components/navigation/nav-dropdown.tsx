"use client"

import Link from "next/link"
import { ChevronDown, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface NavDropdownProps {
  label: string
  icon: LucideIcon
  items: Array<{ href: string; label: string }>
  pathname: string
  pathPrefix: string
}

export function NavDropdown({ label, icon: Icon, items, pathname, pathPrefix }: NavDropdownProps) {
  const isActive = pathname.startsWith(pathPrefix)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
            isActive
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
              : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {items.map((item) => (
          <DropdownMenuItem key={item.href} asChild>
            <Link href={item.href} className="cursor-pointer">
              {item.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

