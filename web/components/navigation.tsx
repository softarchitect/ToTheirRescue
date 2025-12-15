"use client"

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState, useEffect } from "react"
import { Users, FileText, Search, ChevronDown, HelpCircle, Shield, Settings, LogOut, User } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { useTenant } from "@/contexts/tenant-context"

// Utility function to decode JWT token and get user role
function getUserRole(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth");
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    const token = parsed?.token;
    if (!token) return null;

    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.role || null;
  } catch {
    return null;
  }
}

const RabbitNavIcon = ({ className }: { className?: string }) => (
  <Image
    src="/rabbit-logo.png"
    alt="Animals"
    width={16}
    height={16}
    className={className}
  />
)

const navItems = [
  { href: "/animals", label: "Animals", icon: RabbitNavIcon },
  { href: "/pcos", label: "PCOs", icon: Users },
]

const searchItems = [
  { href: "/searches/animals", label: "Animals" },
  { href: "/searches/donations", label: "Donations" },
  { href: "/searches/animal-milestones", label: "Animal Milestones" },
  { href: "/searches/animal-health", label: "Animal Health" },
]

const queriesItems = [
  { href: "/queries/animal-milestones", label: "Animal Milestones" },
  { href: "/queries/animal-health", label: "Animal Health" },
  { href: "/queries/donations", label: "Donations" },
  { href: "/queries/mail-list", label: "Mail List" },
]

const reportsItems = [
  { href: "/reports/volunteers", label: "Volunteers" },
  { href: "/reports/todays-meds", label: "Today's Meds" },
  { href: "/reports/current-fosters", label: "Current Fosters" },
]

const adminItems = [
  { href: "/admin/customization", label: "Customization" },
  { href: "/admin/users", label: "Users" },
]

export function Navigation() {
  const pathname = usePathname()
  const { tenantName, tenantInfo } = useTenant()
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  useEffect(() => {
    const checkRole = () => {
      const role = getUserRole()
      setIsSuperAdmin(role === "SuperAdministrator")
    }

    // Check role on mount and when pathname changes
    checkRole()

    // Listen for auth changes in other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth" || e.key === null) {
        checkRole()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [pathname]) // Re-check when pathname changes (e.g., after login redirect)

  const handleTopNavClick = (href: string) => {
    sessionStorage.removeItem("selectedAnimalIds")
    sessionStorage.removeItem("selectedAnimals")
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem("auth")
      window.localStorage.removeItem("auth")
      sessionStorage.clear()
    }
    window.location.href = "/auth"
  }

  return (
    <nav className="border-b border-border/40 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => handleTopNavClick("/")}>
            <Image src="/rabbit-logo.png" alt="Rabbit Logo" width={40} height={40} className="h-10 w-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              To Their Rescue
            </span>
          </Link>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              const isImageIcon = item.icon === RabbitNavIcon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => handleTopNavClick(item.href)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
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
                  {item.label}
                </Link>
              )
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    pathname.startsWith("/searches")
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                      : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
                  )}
                >
                  <Search className="h-4 w-4" />
                  Searches
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {searchItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    pathname.startsWith("/queries")
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                      : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
                  )}
                >
                  <FileText className="h-4 w-4" />
                  Queries
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {queriesItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    pathname.startsWith("/reports")
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                      : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
                  )}
                >
                  <FileText className="h-4 w-4" />
                  Reports
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {reportsItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    pathname.startsWith("/admin")
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                      : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Admin
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {adminItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href} className="cursor-pointer">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {isSuperAdmin && (
              <Link
                href="/super-admin"
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                  pathname === "/super-admin"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                    : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
                )}
              >
                <Shield className="h-4 w-4" />
                Super Admin
              </Link>
            )}

            <Link
              href="/help"
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                pathname === "/help"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700",
              )}
            >
              <HelpCircle className="h-4 w-4" />
              Help
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 h-10 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{tenantName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{tenantName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {typeof window !== "undefined" && localStorage.getItem("email") || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
