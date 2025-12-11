"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { getTenantInfo, type TenantInfo } from "@/lib/api"

interface TenantContextType {
  tenantInfo: TenantInfo | null
  tenantName: string
  isLoading: boolean
  error: string | null
  refreshTenantInfo: () => Promise<void>
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null)
  const [tenantName, setTenantName] = useState<string>("To Their Rescue")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTenantInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const info = await getTenantInfo()
      if (info) {
        setTenantInfo(info)
        
        // Use tenant name if it's short enough, otherwise use acronym
        const displayName = info.name && info.name.length < 35
          ? info.name
          : info.tenantAcronym || "To Their Rescue"
        setTenantName(displayName)

        // Store country info in localStorage (matching old behavior)
        if (info.countryId) {
          localStorage.setItem('countryId', String(info.countryId))
        }
        if (info.countryISO2Code) {
          localStorage.setItem('countryCode', info.countryISO2Code)
        }
        if (info.state) {
          localStorage.setItem('stateCode', info.state)
        }
        if (info.emailAddress) {
          localStorage.setItem('email', info.emailAddress)
        }
      } else {
        setTenantInfo(null)
        setTenantName("To Their Rescue")
      }
    } catch (err) {
      console.error("Failed to load tenant info", err)
      setError(err instanceof Error ? err.message : "Failed to load tenant info")
      setTenantInfo(null)
      setTenantName("To Their Rescue")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check if user is authenticated
    if (typeof window !== "undefined") {
      const auth = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth")
      if (auth) {
        fetchTenantInfo()
      } else {
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }, [])

  // Listen for auth changes (e.g., login/logout)
  useEffect(() => {
    if (typeof window === "undefined") return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth" || e.key === null) {
        const auth = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth")
        if (auth) {
          fetchTenantInfo()
        } else {
          setTenantInfo(null)
          setTenantName("To Their Rescue")
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const refreshTenantInfo = async () => {
    await fetchTenantInfo()
  }

  return (
    <TenantContext.Provider
      value={{
        tenantInfo,
        tenantName,
        isLoading,
        error,
        refreshTenantInfo,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

