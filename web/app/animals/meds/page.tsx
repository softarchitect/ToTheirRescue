"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Dialog } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, ChevronRight, Home, Plus as PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import type { Animal } from "@/lib/types"
import { MedDialog } from "@/components/med-dialog"
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

export default function MedsPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [meds, setMeds] = useState<Med[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedRadio, setSelectedRadio] = useState<1 | 2>(1) // 1 = completed, 2 = reminders
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [newMed, setNewMed] = useState({
    date: new Date().toISOString().split("T")[0],
    medicine: "",
    dosage: "",
    personAdministering: "",
    notes: "",
  })

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
      if (animals.length > 1) {
        setIsAddDialogOpen(true)
      }
    }
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!newMed.date) newErrors.date = "Date is required"
    if (!newMed.medicine.trim()) newErrors.medicine = "Medicine is required"
    if (!newMed.dosage.trim()) newErrors.dosage = "Dosage is required"
    if (!newMed.personAdministering.trim()) newErrors.personAdministering = "Person administering is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    if (selectedAnimals.length > 0) {
      const newMeds = selectedAnimals.map((animal) => ({
        id: `${Date.now()}-${animal.id}`,
        animalId: animal.id,
        ...newMed,
      }))
      setMeds([...meds, ...newMeds])
      setIsAddDialogOpen(false)
      setNewMed({
        date: new Date().toISOString().split("T")[0],
        medicine: "",
        dosage: "",
        personAdministering: "",
        notes: "",
      })
      setErrors({})
      if (selectedAnimals.length > 1) {
        router.push('/animals')
      }
    }
  }

  const handleHealthClick = (item: string) => {
    const routeMap: Record<string, string> = {
      'Vaccinations': 'vaccinations',
      'Procedures, Tests, & Treatments': 'procedures',
      'Set Reminders': 'reminders',
      'Meds': 'meds',
      'Diet': 'diet',
      'SOAPs': 'soaps',
      'Health Notes': 'health-notes',
      'Health History': 'health-history',
      'Animal Health Report': 'health-report',
    }

    const route = routeMap[item]
    if (route && selectedAnimals.length > 0) {
      sessionStorage.setItem('selectedAnimals', JSON.stringify(selectedAnimals))
      router.push(`/animals/${route}`)
    }
  }

  const handleActionClick = (action: string) => {
    const routeMap: Record<string, string> = {
      'Milestones': 'milestones',
      'Behaviors': 'behaviors',
      'New Location': 'location',
      'Photos, Videos, & Documents': 'media',
      'Gallery View': 'gallery',
      'Diary': 'diary',
      'Animal Report': 'report',
    }

    const route = routeMap[action]
    if (route && selectedAnimals.length > 0) {
      sessionStorage.setItem('selectedAnimals', JSON.stringify(selectedAnimals))
      router.push(`/animals/${route}`)
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

  const today = new Date().toISOString().split("T")[0]

  const displayAnimals = selectedAnimals.slice(0, 4)
  const remainingCount = selectedAnimals.length - 4

  const columns: Column<Med>[] = [
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

        {selectedAnimals.length === 1 && (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedRadio === 1 ? "default" : "outline"}
                  size="sm"
                  className={selectedRadio === 1
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
                  onClick={() => setSelectedRadio(1)}
                >
                  Completed Meds
                </Button>
                <Button
                  variant={selectedRadio === 2 ? "default" : "outline"}
                  size="sm"
                  className={selectedRadio === 2
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                    : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
                  onClick={() => setSelectedRadio(2)}
                >
                  Med Reminders
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
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Vaccinations')}>Vaccinations</DropdownMenuItem>
                    <DropdownMenuItem className="text-sm" onClick={() => handleHealthClick('Procedures, Tests, & Treatments')}>Procedures, Tests, & Treatments</DropdownMenuItem>
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
                    <DropdownMenuContent align="start">
                      {userRole !== "AnimalCaretaker" && (
                        <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Milestones')}>Milestones</DropdownMenuItem>
                      )}
                      <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Behaviors')}>Behaviors</DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('New Location')}>New Location</DropdownMenuItem>
                      {userRole !== "AnimalCaretaker" && (
                        <>
                          <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Photos, Videos, & Documents')}>Photos, Videos, & Documents</DropdownMenuItem>
                          <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Gallery View')}>Gallery View</DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Diary')}>Diary</DropdownMenuItem>
                      {userRole !== "AnimalCaretaker" && (
                        <DropdownMenuItem className="text-sm" onClick={() => handleActionClick('Animal Report')}>Animal Report</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>

            <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={meds}
                  getRowId={(med) => med.id}
                  emptyMessage="No medications recorded yet"
                  headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                />
              </CardContent>
            </Card>
          </>
        )}

        <MedDialog
          animals={selectedAnimals}
          open={isAddDialogOpen}
          onOpenChange={handleDialogChange}
          onSaved={(items) => {
            const mapped = items.map((item) => ({
              id: String(item.id),
              animalId: String(item.animalId),
              date: item.date,
              medicine: item.medicine,
              dosage: item.dosage,
              personAdministering: item.personAdministering || "",
              notes: item.notes,
            }))
            setMeds((prev) => [...prev, ...mapped])
          }}
        />
      </main>
    </div>
  )
}
