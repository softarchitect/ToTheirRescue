"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Spinner } from "@/components/ui/spinner"

export default function AnimalReportPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/animals")
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="py-16 text-center space-y-3">
          <Spinner className="h-8 w-8 text-emerald-600 mx-auto" />
          <p className="text-muted-foreground">Redirecting to Animal Management...</p>
        </div>
      </main>
    </div>
  )
}
