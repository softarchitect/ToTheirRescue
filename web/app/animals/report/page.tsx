"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { updateAnimal } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { getUserRole } from "@/lib/auth-utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AnimalReportPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [publicityBio, setPublicityBio] = useState("")
  const [draftPublicityBio, setDraftPublicityBio] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setUserRole(getUserRole())
  }, [])

  const navigateBackToAnimalsWithSelection = (animal: Animal) => {
    const currentResidentMilestones = new Set([
      "Intake",
      "Adoption Return",
      "Found",
      "Foster",
      "Foster Return",
      "Reintake",
    ])

    const residentFilter = currentResidentMilestones.has(animal.lastMilestone || "")
      ? "current"
      : "former"

    sessionStorage.setItem("selectedAnimalIds", JSON.stringify([String(animal.id)]))
    sessionStorage.setItem("restoreResidentFilter", residentFilter)
    sessionStorage.setItem("restoreAnimalSelection", "1")
    router.push("/animals")
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
      if (animals.length > 0) {
        const animal = animals[0] as Animal
        const existingBio = animal.description || ""
        setCurrentAnimal(animal)
        setPublicityBio(existingBio)
        setDraftPublicityBio(existingBio)
        setIsEditing(!existingBio.trim())
      }
    }
  }, [])

  const handleCancel = () => {
    setDraftPublicityBio(publicityBio)
    if (currentAnimal) {
      navigateBackToAnimalsWithSelection(currentAnimal)
      return
    }
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!currentAnimal) return
    setIsSaving(true)
    try {
      const updated = await updateAnimal(currentAnimal.id, {
        notes: draftPublicityBio,
      })

      const updatedBio = updated.description || ""
      setPublicityBio(updatedBio)
      setDraftPublicityBio(updatedBio)
      setCurrentAnimal(updated)
      setIsEditing(false)

      const updatedSelectedAnimals = selectedAnimals.map((animal) =>
        String(animal.id) === String(updated.id)
          ? { ...animal, description: updatedBio }
          : animal,
      )
      setSelectedAnimals(updatedSelectedAnimals)
      sessionStorage.setItem("selectedAnimals", JSON.stringify(updatedSelectedAnimals))

      toast({
        title: "Success",
        description: "Publicity Bio saved.",
      })
      navigateBackToAnimalsWithSelection(updated)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save Publicity Bio.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50">
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
          {currentAnimal && (
            <>
              <span className="hover:text-foreground transition-colors">{currentAnimal.name}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground font-semibold">Publicity Bio</span>
        </div>

        <div className="mb-6">
          <div>
            <h1 className="text-4xl font-bold">Publicity Bio</h1>
            <p className="text-muted-foreground mt-1">Write the public-facing bio for this animal.</p>
          </div>
        </div>

        {currentAnimal && (
          <>
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
              <CardContent className="px-3 py-0">
                <SelectedAnimalsHeader animals={[currentAnimal]} />
              </CardContent>
            </Card>

            {userRole !== "Veterinarian" && (
              <div className="flex items-center justify-end gap-2 mb-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <span className="text-sm">Actions</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => router.push("/animals/milestones")} className="text-sm">Milestones</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push("/animals/behaviors")} className="text-sm">Behaviors</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/animals/location")} className="text-sm">Location</DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => router.push("/animals/media")} className="text-sm">
                        Photos, Videos, and Documents
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => router.push("/animals/diary")} className="text-sm">Diary</DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => router.push("/animals/report")} className="text-sm">Publicity Bio</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            <Card>
              <CardContent className="space-y-4 pt-6">
                <Textarea
                  value={isEditing ? draftPublicityBio : publicityBio}
                  onChange={(e) => setDraftPublicityBio(e.target.value)}
                  className="min-h-[220px]"
                  disabled={!isEditing || isSaving}
                />
                <div className="flex items-center justify-end gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? "Saving..." : publicityBio.trim() ? "Update" : "Save"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Update</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
