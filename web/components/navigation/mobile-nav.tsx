"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, LucideIcon, ComponentType } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { NavLink } from "./nav-link"

interface MobileNavProps {
  filteredNavItems: Array<{ href: string; label: string; icon: LucideIcon | ComponentType<{ className?: string }> }>
  filteredSearchItems: Array<{ href: string; label: string }>
  filteredQueriesItems: Array<{ href: string; label: string }>
  reportsItems: Array<{ href: string; label: string }>
  adminItems: Array<{ href: string; label: string }>
  showSearches: boolean
  showQueries: boolean
  showReports: boolean
  showAdmin: boolean
  onAnimalsNavClick: () => void
  onTopNavClick: () => void
}

function MobileNavSection({
  title,
  items,
  pathname,
  onLinkClick,
}: {
  title: string
  items: Array<{ href: string; label: string }>
  pathname: string
  onLinkClick?: () => void
}) {
  if (items.length === 0) return null

  return (
    <div className="space-y-1">
      <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                : "text-foreground hover:bg-emerald-50 hover:text-emerald-700",
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

export function MobileNav({
  filteredNavItems,
  filteredSearchItems,
  filteredQueriesItems,
  reportsItems,
  adminItems,
  showSearches,
  showQueries,
  showReports,
  showAdmin,
  onAnimalsNavClick,
  onTopNavClick,
}: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100vw-2rem,20rem)] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-6 px-1 pb-6">
          <div className="space-y-1">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                pathname={pathname}
                className="w-full justify-start"
                onClick={() => {
                  if (item.href === "/animals") {
                    onAnimalsNavClick()
                  } else {
                    onTopNavClick()
                  }
                  closeMenu()
                }}
              />
            ))}
          </div>

          {showSearches && (
            <MobileNavSection
              title="Searches"
              items={filteredSearchItems}
              pathname={pathname}
              onLinkClick={() => {
                onTopNavClick()
                closeMenu()
              }}
            />
          )}

          {showQueries && (
            <MobileNavSection
              title="Queries"
              items={filteredQueriesItems}
              pathname={pathname}
              onLinkClick={() => {
                onTopNavClick()
                closeMenu()
              }}
            />
          )}

          {showReports && (
            <MobileNavSection
              title="Reports"
              items={reportsItems}
              pathname={pathname}
              onLinkClick={() => {
                onTopNavClick()
                closeMenu()
              }}
            />
          )}

          {showAdmin && (
            <MobileNavSection
              title="Admin"
              items={adminItems}
              pathname={pathname}
              onLinkClick={() => {
                onTopNavClick()
                closeMenu()
              }}
            />
          )}

          <div className="space-y-1">
            <Link
              href="/help"
              onClick={() => {
                onTopNavClick()
                closeMenu()
              }}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/help"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                  : "text-foreground hover:bg-emerald-50 hover:text-emerald-700",
              )}
            >
              Help
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
