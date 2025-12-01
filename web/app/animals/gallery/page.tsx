"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Animal } from "@/lib/types"
import { motion } from "framer-motion"
import { ChevronRight, Home } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { fetchAnimalMedia } from "@/lib/api"

export default function GalleryViewPage() {
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [galleryAnimals, setGalleryAnimals] = useState<Animal[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const parsed: Animal[] = JSON.parse(stored)
      setSelectedAnimals(parsed)
      setGalleryAnimals(parsed)
    }
  }, [])

  useEffect(() => {
    const loadMedia = async () => {
      if (!selectedAnimals.length) return

      const updated = await Promise.all(
        selectedAnimals.map(async (animal) => {
          try {
            const media = await fetchAnimalMedia(animal.id)
            if (!media.length) return { ...animal }
            const sorted = [...media].sort((a, b) => (b.rank || 0) - (a.rank || 0))
            const primary = sorted.find((m) => m.type === "photo") ?? sorted[0]
            return {
              ...animal,
              imageUrl: primary?.url || animal.imageUrl,
            } as Animal
          } catch {
            return { ...animal }
          }
        }),
      )

      setGalleryAnimals(updated)
    }

    loadMedia()
  }, [selectedAnimals])

  const normalizeType = (value: string | undefined) => {
    const t = (value || "").toLowerCase()
    if (t.includes("dog")) return "dog"
    if (t.includes("cat")) return "cat"
    if (t.includes("bird")) return "bird"
    if (t.includes("rabbit") || t.includes("bunny")) return "rabbit"
    if (t.includes("wild")) return "wildlife"
    return value || ""
  }

  const filteredAnimals = galleryAnimals.filter((animal) => {
    const matchesStatus = statusFilter === "all" || animal.status === statusFilter
    const animalTypeKey = normalizeType(animal.type)
    const matchesType = typeFilter === "all" || animalTypeKey === typeFilter
    return matchesStatus && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/animals" className="hover:text-foreground transition-colors">
            Manage Animals
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Gallery View</span>
        </nav>

        {galleryAnimals.length > 0 && (
          <div className="mb-3">
            <SelectedAnimalsHeader animals={galleryAnimals} />
          </div>
        )}

        <div className="flex items-center justify-end gap-4 mb-3">
          <Button variant="outline">Show All</Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Former Residents" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="adopted">Adopted</SelectItem>
              <SelectItem value="fostered">Fostered</SelectItem>
              <SelectItem value="medical">Medical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Cats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cat">Cats</SelectItem>
              <SelectItem value="dog">Dogs</SelectItem>
              <SelectItem value="bird">Birds</SelectItem>
              <SelectItem value="rabbit">Rabbits</SelectItem>
              <SelectItem value="wildlife">Wildlife</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* </CHANGE> */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAnimals.map((animal, index) => (
            <motion.div
              key={animal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden border-border/40 hover:shadow-xl transition-all backdrop-blur-sm bg-white/80">
                <div className="relative aspect-square bg-muted">
                  <Image src={animal.imageUrl || "/placeholder.svg"} alt={animal.name} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-primary">{animal.name}</h3>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredAnimals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No animals to display in gallery view</p>
            <Link href="/animals">
              <Button className="mt-4">Select Animals</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
