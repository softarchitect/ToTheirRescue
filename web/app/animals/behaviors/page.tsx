"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { BehaviorDialog } from "@/components/behavior-dialog"
import type { Animal } from "@/lib/types"

export default function BehaviorsPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(true)

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedAnimals") || "[]")
    setSelectedAnimals(selected)

    // If no animals selected, redirect to animals page
    if (selected.length === 0) {
      router.push("/animals")
    }
  }, [router])

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      router.push("/animals")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/animals" className="hover:text-foreground transition-colors">
            Animals
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-semibold">Manage Behaviors</span>
        </div>

        <BehaviorDialog
          animals={selectedAnimals}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          onSuccess={() => {
            // Optionally refresh data here
          }}
        />
      </main>
    </div>
  )
}
