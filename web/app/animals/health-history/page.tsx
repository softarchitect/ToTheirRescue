"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Home, ChevronDown, ChevronRight, HeartPulse } from 'lucide-react'
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

export default function HealthHistoryPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)

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
          <span className="font-semibold">Health History</span>
        </div>

        <SelectedAnimalsHeader animals={selectedAnimals} />

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
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-2">
          <div className="grid grid-cols-5 bg-primary text-primary-foreground font-semibold">
            <div className="p-4 border-r border-primary-foreground/20">Date</div>
            <div className="p-4 border-r border-primary-foreground/20">Type</div>
            <div className="p-4 border-r border-primary-foreground/20">Kind</div>
            <div className="p-4 border-r border-primary-foreground/20">Clinic</div>
            <div className="p-4">Notes</div>
          </div>
          <div className="p-8 text-center text-muted-foreground">
            <p>No data</p>
          </div>
        </div>
      </main>
    </div>
  )
}
