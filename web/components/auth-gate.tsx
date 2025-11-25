"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Only run on client
    const stored =
      (typeof window !== "undefined" && window.localStorage.getItem("auth")) ||
      (typeof window !== "undefined" && window.sessionStorage.getItem("auth"))

    const isAuthed = !!stored

    if (!isAuthed && !pathname.startsWith("/auth")) {
      router.replace("/auth")
      return
    }

    if (isAuthed && pathname.startsWith("/auth")) {
      router.replace("/")
      return
    }

    setReady(true)
  }, [pathname, router])

  if (!ready) {
    return null
  }

  return <>{children}</>
}


