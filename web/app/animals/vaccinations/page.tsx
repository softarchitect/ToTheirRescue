"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, ChevronDown, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { VaccinationDialog } from "@/components/vaccination-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface Vaccination {
  id: string
  animalId: string
  kind: string
  date: string
  vaccSerialNo?: string
  clinic?: string
  tagNo?: string
  administerer?: string
  dueAgain: boolean
  dueAgainInterval?: number
  dueAgainUnit?: string
  vaccMfg?: string
  notes?: string
}

export default function VaccinationsPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  // Local listing state only; Add dialog will use shared VaccinationDialog component
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
      if (animals.length > 0) {
        setCurrentAnimal(animals[0])
      }
    }
  }, [])

  useEffect(() => {
    if (selectedAnimals.length > 1) {
      setIsAddDialogOpen(true)
    }
  }, [selectedAnimals.length])

  // Listing-only mock save; the shared dialog currently logs and closes

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/animals" className="hover:text-foreground">
            Animals
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-semibold">Manage Vaccinations</span>
        </div>

        <SelectedAnimalsHeader animals={selectedAnimals} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="font-semibold bg-transparent">
              Completed Vaccinations
            </Button>
            <Button variant="ghost" size="sm">
              Vaccination Reminders
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="text-sm">Health</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push('/animals/vaccinations')} className="text-sm">
                  Vaccinations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/procedures')} className="text-sm">
                  Procedures, Tests, & Treatments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/reminders')} className="text-sm">
                  Set Reminders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/meds')} className="text-sm">
                  Meds
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/diet')} className="text-sm">
                  Diet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/soaps')} className="text-sm">
                  SOAPs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/health-notes')} className="text-sm">
                  Health Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/health-history')} className="text-sm">
                  Health History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/health-report')} className="text-sm">
                  Animal Health Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="text-sm">Actions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push('/animals/milestones')} className="text-sm">
                  Milestones
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/behaviors')} className="text-sm">
                  Behaviors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/location')} className="text-sm">
                  New Location
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/media')} className="text-sm">
                  Photos, Videos, & Documents
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/gallery')} className="text-sm">
                  Gallery View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/diary')} className="text-sm">
                  Diary
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/report')} className="text-sm">
                  Animal Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-2">
          <div className="grid grid-cols-2 bg-primary text-primary-foreground font-semibold">
            <div className="p-4 border-r border-primary-foreground/20">Action Date</div>
            <div className="p-4">Kind</div>
          </div>

          {vaccinations
            .filter((vacc) => vacc.animalId === currentAnimal?.id)
            .map((vacc) => (
              <div key={vacc.id} className="grid grid-cols-2 border-t hover:bg-muted/50 transition-colors">
                <div className="p-4 border-r">{new Date(vacc.date).toLocaleDateString()}</div>
                <div className="p-4">{vacc.kind}</div>
              </div>
            ))}

          {vaccinations.filter((vacc) => vacc.animalId === currentAnimal?.id).length === 0 && (
            <div className="p-8 text-center text-muted-foreground">No vaccinations recorded yet</div>
          )}
        </div>

        {!currentAnimal && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please select an animal first</p>
            <Link href="/animals">
              <Button className="mt-4">Select Animals</Button>
            </Link>
          </div>
        )}
      </main>

      <VaccinationDialog animals={selectedAnimals} open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
