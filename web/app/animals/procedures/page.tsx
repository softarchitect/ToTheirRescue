"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Dialog } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Calendar, ChevronDown, ChevronRight } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { ProcedureDialog } from "@/components/procedure-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface Procedure {
  id: string
  animalId: string
  procedure: string
  date: string
  testResult?: string
  clinic?: string
  person?: string
  weight?: number
  microchipNumber?: string
  notes?: string
}

export default function ProceduresPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newProcedure, setNewProcedure] = useState({
    procedure: "",
    date: "",
    testResult: "",
    clinic: "",
    person: "",
    weight: 0,
    microchipNumber: "",
    notes: "",
  })

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
    if (selectedAnimals.length > 1) {
      const newProcedures = selectedAnimals.map((animal) => ({
        id: `${Date.now()}-${animal.id}`,
        animalId: animal.id,
        ...newProcedure,
      }))
      setProcedures([...procedures, ...newProcedures])
      setIsAddDialogOpen(false)
      router.push('/animals')
      return
    } else if (currentAnimal) {
      const procedure: Procedure = {
        id: Date.now().toString(),
        animalId: currentAnimal.id,
        ...newProcedure,
      }
      setProcedures([...procedures, procedure])
    }
    setIsAddDialogOpen(false)
    setNewProcedure({
      procedure: "",
      date: "",
      testResult: "",
      clinic: "",
      person: "",
      weight: 0,
      microchipNumber: "",
      notes: "",
    })
  }

  const handleDialogChange = (open: boolean) => {
    if (!open && selectedAnimals.length > 1) {
      // Redirect back to animals page when cancelled with multiple animals
      router.push('/animals')
    } else {
      setIsAddDialogOpen(open)
    }
  }

  const filteredProcedures = procedures.filter(
    (proc) => proc.animalId === currentAnimal?.id
  )

  const columns: Column<Procedure>[] = [
    {
      key: "date",
      header: "Action Date",
      render: (proc) => (
        <span className="text-muted-foreground">
          {new Date(proc.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
        </span>
      ),
    },
    {
      key: "procedure",
      header: "Proc., Test or Treatment",
      render: (proc) => (
        <span className="font-medium text-primary">{proc.procedure}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (proc) => (
        <span className="text-muted-foreground">{proc.notes || "-"}</span>
      ),
    },
  ]

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
          <span className="text-foreground font-semibold">Manage Procedures, Tests, & Treatments</span>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        {selectedAnimals.length === 1 && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="font-semibold bg-transparent">
                  Completed Procedures, Tests, & Treatments
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

            {currentAnimal && (
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
                <CardContent className="p-0">
                  <DataTable
                    columns={columns}
                    data={filteredProcedures}
                    getRowId={(proc) => proc.id}
                    emptyMessage="No procedures recorded yet"
                  />
                </CardContent>
              </Card>
            )}
          </>
        )}

        {selectedAnimals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please select an animal first</p>
            <Link href="/animals">
              <Button className="mt-4">Select Animals</Button>
            </Link>
          </div>
        )}
      </main>

      <ProcedureDialog animals={selectedAnimals} open={isAddDialogOpen} onOpenChange={handleDialogChange} />
    </div>
  )
}
