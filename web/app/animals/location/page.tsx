"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import Link from "next/link"
import { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { LocationDialog } from "@/components/location-dialog"

export default function LocationPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(true)

  useEffect(() => {
    // Get selected animal from sessionStorage
    const selected = JSON.parse(sessionStorage.getItem("selectedAnimals") || "[]")
    if (selected.length > 0) {
      setSelectedAnimals(selected)
    }
  }, [])

  const handleSave = () => {
    // Placeholder for persistence logic
    setIsDialogOpen(false)
    router.push("/animals")
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
          <span className="text-foreground font-semibold">New Location</span>
        </div>

        <LocationDialog
          animals={selectedAnimals}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
        />
      </main>
    </div>
  )
}
