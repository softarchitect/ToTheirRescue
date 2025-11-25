"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { Dialog } from "@/components/ui/dialog"
import { ArrowLeft, Plus, HeartPulse } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { ChevronRight, Home } from 'lucide-react'
import Link from "next/link"
import { SOAPDialog } from "@/components/soap-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

export default function SOAPsPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [soapDate, setSoapDate] = useState(new Date().toISOString().split("T")[0])
  const [clinic, setClinic] = useState("")
  const [veterinarian, setVeterinarian] = useState("")
  const [subjective, setSubjective] = useState("")
  const [objective, setObjective] = useState("")
  const [assessment, setAssessment] = useState("")
  const [plan, setPlan] = useState("")

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
      if (animals.length > 0) {
        setCurrentAnimal(animals[0])
        if (animals.length > 1) {
          setIsAddDialogOpen(true)
        }
      }
    }
  }, [])

  const handleSave = () => {
    selectedAnimals.forEach((animal) => {
      console.log("[v0] Saving SOAP:", {
        animal: animal.name,
        date: soapDate,
        clinic,
        veterinarian,
        subjective,
        objective,
        assessment,
        plan,
      })
    })
    setSoapDate(new Date().toISOString().split("T")[0])
    setClinic("")
    setVeterinarian("")
    setSubjective("")
    setObjective("")
    setAssessment("")
    setPlan("")
    setIsAddDialogOpen(false)
    if (selectedAnimals.length > 1) {
      router.push('/animals')
    }
  }

  const handleDialogChange = (open: boolean) => {
    if (!open && selectedAnimals.length > 1) {
      // Redirect back to animals page when cancelled with multiple animals
      router.push('/animals')
    } else {
      setIsAddDialogOpen(open)
    }
  }

  const handleHealthClick = (action: string) => {
    const healthRoutes: Record<string, string> = {
      Vaccinations: "/animals/vaccinations",
      "Procedures, Tests, & Treatments": "/animals/procedures",
      "Set Reminders": "/animals/reminders",
      Meds: "/animals/meds",
      Diet: "/animals/diet",
      SOAPs: "/animals/soaps",
      "Health Notes": "/animals/health-notes",
      "Health History": "/animals/health-history",
      "Animal Health Report": "/animals/health-report",
    }
    const route = healthRoutes[action]
    if (route) router.push(route)
  }

  const handleActionClick = (action: string) => {
    const actionRoutes: Record<string, string> = {
      Milestones: "/animals/milestones",
      Behaviors: "/animals/behaviors",
      "New Location": "/animals/location",
      "Photos, Videos, & Documents": "/animals/media",
      "Gallery View": "/animals/gallery",
      Diary: "/animals/diary",
      "Animal Report": "/animals/report",
    }
    const route = actionRoutes[action]
    if (route) router.push(route)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href="/animals" className="text-muted-foreground hover:text-foreground">
            Animals
          </Link>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">Manage SOAPs</span>
        </div>

        <SelectedAnimalsHeader animals={selectedAnimals} />

        {selectedAnimals.length === 1 && (
          <>
            <div className="flex items-center justify-end gap-2 mb-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                    <HeartPulse className="h-4 w-4" />
                    <span className="text-sm">Health</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleHealthClick("Vaccinations")} className="text-sm">Vaccinations</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Procedures, Tests, & Treatments")} className="text-sm">
                    Procedures, Tests, & Treatments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Set Reminders")} className="text-sm">Set Reminders</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Meds")} className="text-sm">Meds</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Diet")} className="text-sm">Diet</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("SOAPs")} className="text-sm">SOAPs</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Health Notes")} className="text-sm">Health Notes</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Health History")} className="text-sm">
                    Health History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Animal Health Report")} className="text-sm">
                    Animal Health Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                    <span className="text-sm">Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => handleActionClick("Milestones")} className="text-sm">Milestones</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("Behaviors")} className="text-sm">Behaviors</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("New Location")} className="text-sm">New Location</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("Photos, Videos, & Documents")} className="text-sm">
                    Photos, Videos, & Documents
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("Gallery View")} className="text-sm">Gallery View</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("Diary")} className="text-sm">Diary</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("Animal Report")} className="text-sm">Animal Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-2">
              <div className="grid grid-cols-4 bg-primary text-primary-foreground font-semibold">
                <div className="p-4 border-r border-primary-foreground/20">Date</div>
                <div className="p-4 border-r border-primary-foreground/20">Subjective</div>
                <div className="p-4 border-r border-primary-foreground/20">Objective</div>
                <div className="p-4">Plan</div>
              </div>
              <div className="p-8 text-center text-muted-foreground">
                <p>No SOAPs recorded yet</p>
              </div>
            </div>
          </>
        )}
      </main>

      <SOAPDialog animals={selectedAnimals} open={isAddDialogOpen} onOpenChange={handleDialogChange} />
    </div>
  )
}
