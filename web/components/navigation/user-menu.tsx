"use client"

import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUserData, getUserDisplayName } from "@/lib/auth-utils"

interface UserMenuProps {
    onLogout: () => void
}

export function UserMenu({ onLogout }: UserMenuProps) {
    const userData = getUserData()
    const tenantName = userData?.tenantName || "To Their Rescue"
    const displayName = getUserDisplayName(userData, tenantName)

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 rounded-lg px-2 sm:px-3 py-2 h-10 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 shrink-0"
                >
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold">
                            <User className="h-4 w-4" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start text-left min-w-0">
                        {tenantName && <span className="text-sm font-medium truncate max-w-[140px]">{tenantName}</span>}
                        {displayName && (
                            <span className="text-xs text-muted-foreground truncate max-w-[140px]">{displayName}</span>
                        )}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        {/* <p className="text-xs leading-none text-muted-foreground">
                            {userData?.userName || ""}
                        </p> */}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

