"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ArrowLeft, Home, ChevronDown, ChevronRight, HeartPulse } from 'lucide-react'
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { fetchHealthHistory, type HealthHistoryEntry } from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"
import { formatDateForTenant } from "@/lib/date-format"

export default function HealthHistoryPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [history, setHistory] = useState<HealthHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
      if (animals.length > 0) {
        const first = animals[0]
        setCurrentAnimal(first)
        if (first?.id) {
          setIsLoading(true)
          fetchHealthHistory(first.id)
            .then(setHistory)
            .catch((err) => {
              console.error("Failed to load health history", err)
            })
            .finally(() => setIsLoading(false))
        }
      }
    }
  }, [])

  const handleHealthClick = (action: string) => {
    const healthRoutes: Record<string, string> = {
      "Chronic Condition": "/animals",
      Vaccinations: "/animals/vaccinations",
      "Procedures, Tests, & Treatments": "/animals/procedures",
      Prescriptions: "/animals/prescriptions",
      "Set Reminders": "/animals?openReminder=1",
      Meds: "/animals/meds",
      Diet: "/animals?openDiet=1",
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
      Location: "/animals/location",
      "Photos, Videos, and Documents": "/animals/media",
      Diary: "/animals/diary",
      "Publicity Bio": "/animals/report",
    }
    const route = actionRoutes[action]
    if (route) router.push(route)
  }

  const columns: Column<HealthHistoryEntry>[] = [
    {
      key: "date",
      header: "Date",
      render: (entry) => (
        <span className="text-muted-foreground">
          {formatDateForTenant(entry.date, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "type",
      header: "Type",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.type}</span>
      ),
    },
    {
      key: "kind",
      header: "Kind",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.kind}</span>
      ),
    },
    {
      key: "clinic",
      header: "Clinic",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.clinic}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (entry) => (
        <span className="text-muted-foreground whitespace-pre-wrap">{entry.notes}</span>
      ),
    },
  ]

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

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

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
              <DropdownMenuItem onClick={() => handleHealthClick("Chronic Condition")} className="text-sm">Chronic Condition</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleHealthClick("Vaccinations")} className="text-sm">Vaccinations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleHealthClick("Procedures, Tests, & Treatments")} className="text-sm">
                Procedures, Tests, & Treatments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleHealthClick("Prescriptions")} className="text-sm">Prescriptions</DropdownMenuItem>
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
          {userRole !== "Veterinarian" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  <span className="text-sm">Actions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => handleActionClick("Milestones")} className="text-sm">Milestones</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => handleActionClick("Behaviors")} className="text-sm">Behaviors</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("Location")} className="text-sm">Location</DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <>
                    <DropdownMenuItem onClick={() => handleActionClick("Photos, Videos, and Documents")} className="text-sm">
                      Photos, Videos, and Documents
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => handleActionClick("Diary")} className="text-sm">Diary</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleActionClick("Microchipping")} className="text-sm">Microchipping</DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => handleActionClick("Publicity Bio")} className="text-sm">Publicity Bio</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isLoading ? (
          <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>Loading health history...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={history}
                getRowId={(entry, idx) => `${entry.date}-${entry.type}-${idx}`}
                emptyMessage="No data"
                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
