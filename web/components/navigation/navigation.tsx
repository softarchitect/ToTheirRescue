"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Users, FileText, Search, HelpCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { getUserRole } from "@/lib/auth-utils"
import { NavLink, RabbitNavIcon } from "./nav-link"
import { NavDropdown } from "./nav-dropdown"
import { UserMenu } from "./user-menu"
import { MobileNav } from "./mobile-nav"

// Navigation configuration
const NAV_ITEMS = [
    { href: "/animals", label: "Animals", icon: RabbitNavIcon },
    { href: "/pcos", label: "PCOs", icon: Users },
]

const SEARCH_ITEMS = [
    { href: "/searches/animals", label: "Animals" },
    { href: "/searches/donations", label: "Donations" },
    { href: "/searches/animal-milestones", label: "Animal Milestones" },
    { href: "/searches/animal-health", label: "Animal Health" },
]

const QUERIES_ITEMS = [
    { href: "/queries/animal-milestones", label: "Animal Milestones" },
    { href: "/queries/animal-health", label: "Animal Health" },
    { href: "/queries/donations", label: "Donations" },
    { href: "/queries/mail-list", label: "Mail List" },
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
    const [userRole, setUserRole] = useState<string | null>(null)

    useEffect(() => {
        const checkRole = () => {
            const role = getUserRole()
            setUserRole(role)
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

    // Filter items based on user role
    const isAnimalManager = userRole === "AnimalManager"
    const isAnimalCaretaker = userRole === "AnimalCaretaker"
    const isVeterinarian = userRole === "Veterinarian"

    // Filter main navigation items - AnimalCaretaker and Veterinarian only see Animals
    const filteredNavItems = (isAnimalCaretaker || isVeterinarian)
        ? NAV_ITEMS.filter((item) => item.href === "/animals")
        : NAV_ITEMS

    // Filter search items
    let filteredSearchItems = SEARCH_ITEMS
    if (isAnimalManager) {
        filteredSearchItems = SEARCH_ITEMS.filter((item) => item.href !== "/searches/donations")
    } else if (isVeterinarian) {
        // AnimalCaretaker and Veterinarian only see Animals and Animal Health
        filteredSearchItems = SEARCH_ITEMS.filter((item) =>
            item.href === "/searches/animals" || item.href === "/searches/animal-health"
        )
    }

    // Filter query items
    let filteredQueriesItems = QUERIES_ITEMS
    if (isAnimalManager) {
        filteredQueriesItems = QUERIES_ITEMS.filter((item) => item.href !== "/queries/donations")
    } else if (isVeterinarian) {
        // AnimalCaretaker and Veterinarian only see Animal Health
        filteredQueriesItems = QUERIES_ITEMS.filter((item) => item.href === "/queries/animal-health")
    }

    const handleTopNavClick = () => {
        sessionStorage.removeItem("selectedAnimalIds")
        sessionStorage.removeItem("selectedAnimals")
    }

    const handleAnimalsNavClick = () => {
        handleTopNavClick()
        // Always reset Animals landing state to Current Residents.
        sessionStorage.removeItem("restoreAnimalSelection")
        sessionStorage.removeItem("restoreResidentFilter")
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
            <div className="container mx-auto px-4 sm:px-6 max-w-full">
                <div className="flex h-16 items-center justify-between gap-2 min-w-0">
                    <Link
                        href="/"
                        className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-opacity shrink-0 min-w-0"
                        onClick={handleTopNavClick}
                    >
                        <Image
                            src="/rabbit-logo.png"
                            alt="Rabbit Logo"
                            width={40}
                            height={40}
                            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
                        />
                        <span className="flex flex-col leading-[0.95] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            <span className="text-sm sm:text-base lg:text-lg whitespace-nowrap">To Their</span>
                            <span className="text-sm sm:text-base lg:text-lg whitespace-nowrap">Rescue</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1 min-w-0">
                        {filteredNavItems.map((item) => (
                            <NavLink
                                key={item.href}
                                href={item.href}
                                label={item.label}
                                icon={item.icon}
                                pathname={pathname}
                                onClick={item.href === "/animals" ? handleAnimalsNavClick : handleTopNavClick}
                            />
                        ))}
                        {
                            !isAnimalCaretaker && <NavDropdown
                                label="Searches"
                                icon={Search}
                                items={filteredSearchItems}
                                pathname={pathname}
                                pathPrefix="/searches"
                            />
                        }

                        {!isAnimalCaretaker &&
                            <NavDropdown
                                label="Queries"
                                icon={FileText}
                                items={filteredQueriesItems}
                                pathname={pathname}
                                pathPrefix="/queries"
                            />}

                        {!isAnimalCaretaker && !isVeterinarian && (
                            <NavDropdown
                                label="Reports"
                                icon={FileText}
                                items={REPORTS_ITEMS}
                                pathname={pathname}
                                pathPrefix="/reports"
                            />
                        )}

                        {!isAnimalManager && !isAnimalCaretaker && !isVeterinarian && (
                            <NavDropdown
                                label="Admin"
                                icon={Settings}
                                items={ADMIN_ITEMS}
                                pathname={pathname}
                                pathPrefix="/admin"
                            />
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

                    <div className="flex lg:hidden items-center gap-1 shrink-0">
                        <MobileNav
                            filteredNavItems={filteredNavItems}
                            filteredSearchItems={filteredSearchItems}
                            filteredQueriesItems={filteredQueriesItems}
                            reportsItems={REPORTS_ITEMS}
                            adminItems={ADMIN_ITEMS}
                            showSearches={!isAnimalCaretaker}
                            showQueries={!isAnimalCaretaker}
                            showReports={!isAnimalCaretaker && !isVeterinarian}
                            showAdmin={!isAnimalManager && !isAnimalCaretaker && !isVeterinarian}
                            onAnimalsNavClick={handleAnimalsNavClick}
                            onTopNavClick={handleTopNavClick}
                        />
                        <UserMenu onLogout={handleLogout} />
                    </div>
                </div>
            </div>
        </nav>
    )
}

