"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"

interface Med {
  id: string
  animalId: string
  date: string
  medicine: string
  dosage: string
  personAdministering: string
  notes?: string
}

interface MedReminder {
  id: string
  animalId: string
  dueDate: string
  medicine: string
  dosage?: string
  notes?: string
}

export default function MedsPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [meds] = useState<Med[]>([])
  const [medReminders] = useState<MedReminder[]>([])
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
    }
  }, [])

  const handleHealthClick = (item: string) => {
    const routeMap: Record<string, string> = {
      'Chronic Condition': '',
      'Vaccinations': '/animals/vaccinations',
      'Procedures, Tests, & Treatments': '/animals/procedures',
      'Set Reminders': '/animals?openReminder=1',
      'Meds': '/animals/meds',
      'Diet': '/animals?openDiet=1',
      'SOAPs': '/animals/soaps',
      'Health Notes': '/animals/health-notes',
      'Health History': '/animals/health-history',
      'Animal Health Report': '/animals/health-report',
    }

    if (item === 'Chronic Condition') {
      router.push('/animals')
      return
    }

    const route = routeMap[item]
    if (route && selectedAnimals.length > 0) {
      sessionStorage.setItem('selectedAnimals', JSON.stringify(selectedAnimals))
      router.push(route)
    }
  }

  const handleActionClick = (action: string) => {
    const routeMap: Record<string, string> = {
      'Milestones': 'milestones',
      'Behaviors': 'behaviors',
      'Location': 'location',
      'Photos, Videos, and Documents': 'media',
      'Diary': 'diary',
      'Publicity Bio': 'report',
    }

    const route = routeMap[action]
    if (route && selectedAnimals.length > 0) {
      sessionStorage.setItem('selectedAnimals', JSON.stringify(selectedAnimals))
      router.push(`/animals/${route}`)
    }
  }

  const reminderColumns: Column<MedReminder>[] = [
    {
      key: "dueDate",
      header: "Due Date",
      render: (med) => (
        <span className="text-muted-foreground">{med.dueDate}</span>
      ),
    },
    {
      key: "medicine",
      header: "Medicine",
      render: (med) => (
        <span className="font-medium text-primary">{med.medicine}</span>
      ),
    },
    {
      key: "dosage",
      header: "Dosage",
      render: (med) => (
        <span className="text-muted-foreground">{med.dosage || "-"}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (med) => (
        <span className="text-muted-foreground">{med.notes || "-"}</span>
      ),
    },
  ]

  const givenColumns: Column<Med>[] = [
    {
      key: "date",
      header: "Date",
      render: (med) => (
        <span className="text-muted-foreground">{med.date}</span>
      ),
    },
    {
      key: "medicine",
      header: "Medicine",
      render: (med) => (
        <span className="font-medium text-primary">{med.medicine}</span>
      ),
    },
    {
      key: "dosage",
      header: "Dosage",
      render: (med) => (
        <span className="text-muted-foreground">{med.dosage}</span>
      ),
    },
    {
      key: "personAdministering",
      header: "Person Administering",
      render: (med) => (
        <span className="text-muted-foreground">{med.personAdministering}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (med) => (
        <span className="text-muted-foreground">{med.notes || "-"}</span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground flex items-center gap-1">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/animals" className="hover:text-foreground">
            Animals
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-semibold">Manage Meds</span>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        {selectedAnimals.length > 0 ? (
          <div className="space-y-6 mt-2">
            <section>
              <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-foreground">Med Reminders</h2>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2 bg-transparent">
                        <span className="text-sm">Health</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Chronic Condition')}>Chronic Condition</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Vaccinations')}>Vaccinations</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Procedures, Tests, & Treatments')}>Procedures, Tests, & Treatments</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Prescriptions')}>Prescriptions</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Set Reminders')}>Set Reminders</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Meds')}>Meds</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Diet')}>Diet</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('SOAPs')}>SOAPs</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Health Notes')}>Health Notes</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Health History')}>Health History</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Animal Health Report')}>Animal Health Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {userRole !== "Veterinarian" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 bg-transparent">
                          <span className="text-sm">Actions</span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        {userRole !== "AnimalCaretaker" && (
                          <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Milestones')}>Milestones</DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Behaviors')}>Behaviors</DropdownMenuItem>
                        <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Location')}>Location</DropdownMenuItem>
                        {userRole !== "AnimalCaretaker" && (
                          <>
                            <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Photos, Videos, and Documents')}>Photos, Videos, and Documents</DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Diary')}>Diary</DropdownMenuItem>
                        <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Microchipping')}>Microchipping</DropdownMenuItem>
                        {userRole !== "AnimalCaretaker" && (
                          <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Publicity Bio')}>Publicity Bio</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>

              <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
                <CardContent className="p-0">
                  <DataTable
                    columns={reminderColumns}
                    data={medReminders}
                    getRowId={(med) => med.id}
                    emptyMessage="No med reminders set"
                    headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                  />
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-2">Meds Given</h2>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
                <CardContent className="p-0">
                  <DataTable
                    columns={givenColumns}
                    data={meds}
                    getRowId={(med) => med.id}
                    emptyMessage="No meds given recorded yet"
                    headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                  />
                </CardContent>
              </Card>
            </section>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please select an animal first</p>
            <Link href="/animals">
              <Button className="mt-4">Select Animals</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
