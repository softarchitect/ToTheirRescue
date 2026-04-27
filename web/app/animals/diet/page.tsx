"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DietPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/animals?openDiet=1")
  }, [router])

  return null
}
