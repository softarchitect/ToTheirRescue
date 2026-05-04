"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function RemindersPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/animals?openReminder=1")
  }, [router])

  return null
}
