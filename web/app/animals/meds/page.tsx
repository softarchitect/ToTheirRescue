"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, ChevronDown, ChevronRight, Home, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from "next/link"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"
import { fetchMedsByAnimalId, markMedGiven, deleteMed, type MedDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { MedDialog } from "@/components/med-dialog"
import { formatDateForTenant } from "@/lib/date-format"

const formatDate = (value: string | null) =>
  value
    ? formatDateForTenant(value, { month: "short", day: "2-digit", year: "numeric" })
    : "-"

export default function MedsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [meds, setMeds] = useState<MedDTO[]>([])
  const [medReminders, setMedReminders] = useState<MedDTO[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [medToDelete, setMedToDelete] = useState<MedDTO | null>(null)
  const [showMedDialog, setShowMedDialog] = useState(false)
  const [givenIds, setGivenIds] = useState<Set<number>>(new Set())
  const [isSavingGiven, setIsSavingGiven] = useState(false)

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

  const loadMeds = async () => {
    if (selectedAnimals.length === 0) return

    setIsLoading(true)
    try {
      const all: MedDTO[] = []
      for (const animal of selectedAnimals) {
        if (!animal?.id) continue
        const animalId =
          typeof animal.id === "string" ? parseInt(animal.id, 10) : Number(animal.id)
        if (Number.isNaN(animalId)) continue
        all.push(...(await fetchMedsByAnimalId(animalId)))
      }

      const reminders = all
        .filter((m) => m.reminder)
        .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
      const given = all
        .filter((m) => !m.reminder)
        .sort((a, b) => (b.administeredDate || "").localeCompare(a.administeredDate || ""))

      setMedReminders(reminders)
      setMeds(given)
      setGivenIds(new Set())
    } catch (err) {
      console.error("Failed to load meds", err)
      toast({
        title: "Error",
        description: "Failed to load meds",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedAnimals.length > 0) {
      loadMeds()
    }
  }, [selectedAnimals])

  const toggleGiven = (medId: number, checked: boolean) => {
    setGivenIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(medId)
      } else {
        next.delete(medId)
      }
      return next
    })
  }

  const handleSaveGiven = async () => {
    const ids = Array.from(givenIds)
    if (ids.length === 0) return

    setIsSavingGiven(true)
    try {
      await Promise.all(ids.map((id) => markMedGiven(id)))
      setGivenIds(new Set())
      toast({
        title: "Success",
        description: `${ids.length} med${ids.length === 1 ? "" : "s"} recorded as given.`,
        variant: "success",
      })
      await loadMeds()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save meds as given",
        variant: "destructive",
      })
    } finally {
      setIsSavingGiven(false)
    }
  }

  const handleDelete = async () => {
    if (!medToDelete) return
    const med = medToDelete
    setMedToDelete(null)

    try {
      await deleteMed(med.id)
      toast({
        title: "Success",
        description: "Med deleted.",
        variant: "success",
      })
      loadMeds()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete med",
        variant: "destructive",
      })
    }
  }

  const handleHealthClick = (item: string) => {
    const routeMap: Record<string, string> = {
      'Chronic Condition': '',
      'Vaccinations': '/animals/vaccinations',
      'Procedures, Tests, & Treatments': '/animals/procedures',
      'Prescriptions': '/animals/prescriptions',
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

  const reminderColumns: Column<MedDTO>[] = [
    {
      key: "given",
      header: "Given",
      render: (med) => (
        <Checkbox
          checked={givenIds.has(med.id)}
          onCheckedChange={(checked) => toggleGiven(med.id, checked === true)}
          aria-label={`Mark ${med.medicine} as given`}
          className="size-5 border-2 border-gray-300 bg-white data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600"
        />
      ),
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (med) => (
        <span className="text-muted-foreground">{formatDate(med.dueDate)}</span>
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
        <span className="text-muted-foreground whitespace-pre-wrap">{med.notes || "-"}</span>
      ),
    },
  ]

  const givenColumns: Column<MedDTO>[] = [
    {
      key: "administeredDate",
      header: "Date",
      render: (med) => (
        <span className="text-muted-foreground">{formatDate(med.administeredDate)}</span>
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
      key: "personAdministering",
      header: "Person Administering",
      render: (med) => (
        <span className="text-muted-foreground">{med.personAdministering || "-"}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (med) => (
        <span className="text-muted-foreground whitespace-pre-wrap">{med.notes || "-"}</span>
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

              <p className="mb-2 text-sm text-muted-foreground">
                To Add Med Reminders use Set Reminders or Prescriptions
              </p>

              <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
                <CardContent className="p-0">
                  <DataTable
                    columns={reminderColumns}
                    data={medReminders}
                    getRowId={(med) => med.id.toString()}
                    emptyMessage={isLoading ? "Loading meds..." : "No med reminders set"}
                    headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                    actions={(med) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete reminder"
                        onClick={() => setMedToDelete(med)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  />
                </CardContent>
              </Card>

              <div className="mt-2 flex items-center justify-end gap-3">
                {givenIds.size > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {givenIds.size} flagged as given
                  </span>
                )}
                <Button
                  onClick={handleSaveGiven}
                  disabled={givenIds.size === 0 || isSavingGiven}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Check className="h-4 w-4" />
                  {isSavingGiven ? "Saving..." : "Save"}
                </Button>
              </div>
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-foreground">Meds Given</h2>
                <Button
                  onClick={() => setShowMedDialog(true)}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
                <CardContent className="p-0">
                  <DataTable
                    columns={givenColumns}
                    data={meds}
                    getRowId={(med) => med.id.toString()}
                    emptyMessage={isLoading ? "Loading meds..." : "No meds given recorded yet"}
                    headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                    actions={(med) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Delete record"
                        onClick={() => setMedToDelete(med)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
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

      <MedDialog
        animals={selectedAnimals}
        open={showMedDialog}
        onOpenChange={setShowMedDialog}
        onSaved={() => loadMeds()}
      />

      <CustomConfirmDialog
        open={!!medToDelete}
        onOpenChange={(open) => !open && setMedToDelete(null)}
        title={medToDelete?.reminder ? "Delete Med Reminder" : "Delete Med Record"}
        message="Are you sure you want to delete this record? This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
    </div>
  )
}
