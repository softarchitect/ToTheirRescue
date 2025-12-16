"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { Users, FileText, Search, HelpCircle, Shield, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getUserRole } from "@/lib/auth-utils"
import { getCurrentUserPermissions, type Permissions } from "@/lib/permissions"
import { NavLink, RabbitNavIcon } from "./nav-link"
import { NavDropdown } from "./nav-dropdown"
import { UserMenu } from "./user-menu"

// Navigation configuration (base items - will be filtered by permissions)
const BASE_NAV_ITEMS = [
    { href: "/animals", label: "Animals", icon: RabbitNavIcon, permission: "canSeePCOs" as const }, // Always visible
    { href: "/pcos", label: "PCOs", icon: Users, permission: "canSeePCOs" as const },
]

const BASE_SEARCH_ITEMS = [
    { href: "/searches/animals", label: "Animals", permission: "canSeeSearchAnimals" as const },
    { href: "/searches/donations", label: "Donations", permission: "canSeeSearchDonations" as const },
    { href: "/searches/animal-milestones", label: "Animal Milestones", permission: "canSeeSearchAnimalMilestones" as const },
    { href: "/searches/animal-health", label: "Animal Health", permission: "canSeeSearchAnimalHealth" as const },
]

const BASE_QUERIES_ITEMS = [
    { href: "/queries/animal-milestones", label: "Animal Milestones", permission: "canSeeQueryAnimalMilestones" as const },
    { href: "/queries/animal-health", label: "Animal Health", permission: "canSeeQueryAnimalHealth" as const },
    { href: "/queries/donations", label: "Donations", permission: "canSeeQueryDonations" as const },
    { href: "/queries/mail-list", label: "Mail List", permission: "canSeeQueryMailList" as const },
]

const REPORTS_ITEMS = [
    { href: "/reports/volunteers", label: "Volunteers" },
    { href: "/reports/todays-meds", label: "Today's Meds" },
    { href: "/reports/current-fosters", label: "Current Fosters" },
]

const ADMIN_ITEMS = [
    { href: "/admin/customization", label: "Customization" },
    { href: "/admin/users", label: "Users" },
]

export function Navigation() {
    const pathname = usePathname()
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)
    const [permissions, setPermissions] = useState<Permissions | null>(null)

    useEffect(() => {
        const checkRole = () => {
            const role = getUserRole()
            setIsSuperAdmin(role === "SuperAdministrator")
            setPermissions(getCurrentUserPermissions())
        }

        checkRole()

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "auth" || e.key === null) {
                checkRole()
            }
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [pathname])

    // Filter navigation items based on permissions
    const navItems = useMemo(() => {
        if (!permissions) return BASE_NAV_ITEMS.filter(item => item.href === "/animals") // Always show Animals
        return BASE_NAV_ITEMS.filter(item => {
            if (item.href === "/animals") return true // Always show Animals
            return permissions[item.permission]
        })
    }, [permissions])

    const searchItems = useMemo(() => {
        if (!permissions) return []
        return BASE_SEARCH_ITEMS.filter(item => permissions[item.permission])
    }, [permissions])

    const queriesItems = useMemo(() => {
        if (!permissions) return []
        return BASE_QUERIES_ITEMS.filter(item => permissions[item.permission])
    }, [permissions])

    const handleTopNavClick = () => {
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
                    <Link
                        href="/"
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                        onClick={handleTopNavClick}
                    >
                        <Image
                            src="/rabbit-logo.png"
                            alt="Rabbit Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            To Their Rescue
                        </span>
                    </Link>

                    <div className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                pathname={pathname}
                                onClick={handleTopNavClick}
                            />
                        ))}

                        {searchItems.length > 0 && (
                            <NavDropdown
                                label="Searches"
                                icon={Search}
                                items={searchItems.map(item => ({ href: item.href, label: item.label }))}
                                pathname={pathname}
                                pathPrefix="/searches"
                            />
                        )}

                        {queriesItems.length > 0 && (
                            <NavDropdown
                                label="Queries"
                                icon={FileText}
                                items={queriesItems.map(item => ({ href: item.href, label: item.label }))}
                                pathname={pathname}
                                pathPrefix="/queries"
                            />
                        )}

                        <NavDropdown
                            label="Reports"
                            icon={FileText}
                            items={REPORTS_ITEMS}
                            pathname={pathname}
                            pathPrefix="/reports"
                        />

                        {permissions?.canSeeAdmin && (
                            <NavDropdown
                                label="Admin"
                                icon={Settings}
                                items={ADMIN_ITEMS}
                                pathname={pathname}
                                pathPrefix="/admin"
                            />
                        )}

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

                        <UserMenu onLogout={handleLogout} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

