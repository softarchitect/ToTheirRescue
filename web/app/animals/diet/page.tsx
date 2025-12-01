"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { DietDialog } from "@/components/diet-dialog"
import { updateAnimalDiet } from "@/lib/api"

export default function DietPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [dietInfo, setDietInfo] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedAnimals") || "[]")
    if (selected.length > 0) {
      setSelectedAnimals(selected)
      if (selected.length === 1) {
        setDietInfo(selected[0].diet || "")
      }
    }
  }, [])

  const handleSave = async () => {
    const newErrors: Record<string, string> = {}
    
    if (!dietInfo.trim()) {
      newErrors.dietInfo = "Diet information is required"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await updateAnimalDiet({
        animalIds: selectedAnimals.map((a) => a.id),
        diet: dietInfo.trim(),
      })
      setIsDialogOpen(false)
      router.push("/animals")
    } catch (error) {
      console.error("Failed to save diet", error)
      if (typeof window !== "undefined") {
        window.alert("Failed to save diet. Please try again.")
      }
    }
  }

  const handleCancel = () => {
    handleDialogChange(false)
  }

  const handleDialogChange = (open: boolean) => {
    if (!open && selectedAnimals.length > 1) {
      // Redirect back to animals page when cancelled with multiple animals
      router.push('/animals')
    } else {
      setIsDialogOpen(open)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/animals")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Animals
        </Button>

        <DietDialog
          animals={selectedAnimals}
          open={isDialogOpen}
          onOpenChange={handleDialogChange}
          onSaved={async () => {
            // When coming through the dedicated Diet page, also sync dietInfo box and navigate back.
            if (selectedAnimals.length) {
              await updateAnimalDiet({
                animalIds: selectedAnimals.map((a) => a.id),
                diet: dietInfo.trim(),
              })
            }
            setIsDialogOpen(false)
            router.push("/animals")
          }}
        />
      </main>
    </div>
  )
}
