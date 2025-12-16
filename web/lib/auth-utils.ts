/**
 * Authentication and user data utility functions
 */

export interface UserData {
  userName?: string
  firstName?: string
  lastName?: string
  roleName?: string
  tenantId?: number
  tenantName?: string
  countryId?: number
  countryName?: string
  countryISO2Code?: string
}

/**
 * Get user data from auth storage (localStorage or sessionStorage)
 */
export function getUserData(): UserData | null {
  if (typeof window === "undefined") return null

  try {
    const stored = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth")
    if (!stored) return null

    const parsed = JSON.parse(stored)
    return parsed?.user || null
  } catch {
    return null
  }
}

/**
 * Get user role (prefer stored roleName, fallback to JWT decoding)
 */
export function getUserRole(): string | null {
  if (typeof window === "undefined") return null

  try {
    // First try to get roleName from stored user data
    const userData = getUserData()
    if (userData?.roleName) {
      return userData.roleName
    }

    // Fallback to decoding JWT token
    const stored = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth")
    if (!stored) return null

    const parsed = JSON.parse(stored)
    const token = parsed?.token
    if (!token) return null

    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split(".")
    if (parts.length !== 3) return null

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")))
    return payload?.role || null
  } catch {
    return null
  }
}

/**
 * Format role name for display (e.g., "SuperAdministrator" -> "Super Administrator")
 */
export function formatRoleName(roleName: string | null | undefined): string {
  if (!roleName) return ""
  return roleName.replace(/([a-z])([A-Z])/g, "$1 $2")
}

/**
 * Get user's full name or fallback to username
 */
export function getUserDisplayName(userData: UserData | null, fallback: string = ""): string {
  if (!userData) return fallback

  if (userData.firstName && userData.lastName) {
    return `${userData.firstName} ${userData.lastName}`
  }

  if (userData.userName) {
    return userData.userName
  }

  return fallback
}

