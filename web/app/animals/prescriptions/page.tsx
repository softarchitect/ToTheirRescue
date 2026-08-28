"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Plus, ChevronDown, HeartPulse, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Animal } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { PrescriptionDialog } from "@/components/prescription-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import {
  fetchPrescriptionsByAnimalId,
  deletePrescription,
  type PrescriptionDTO,
} from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { formatDateForTenant } from "@/lib/date-format"

export default function PrescriptionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [prescriptions, setPrescriptions] = useState<PrescriptionDTO[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [entryToDelete, setEntryToDelete] = useState<PrescriptionDTO | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setUserRole(getUserRole())
  }, [])

  const loadPrescriptions = async () => {
    if (selectedAnimals.length === 0) return

    setIsLoading(true)
    try {
      const all: PrescriptionDTO[] = []
      for (const animal of selectedAnimals) {
        if (!animal?.id) continue
        const animalId =
          typeof animal.id === "string" ? parseInt(animal.id, 10) : Number(animal.id)
        if (Number.isNaN(animalId)) continue
        const items = await fetchPrescriptionsByAnimalId(animalId)
        all.push(...items)
      }

      all.sort((a, b) => {
        const dateA = new Date(a.dateEntered || a.startDate || "").getTime()
        const dateB = new Date(b.dateEntered || b.startDate || "").getTime()
        return dateB - dateA
      })

      setPrescriptions(all)
    } catch (err) {
      console.error("Failed to load prescriptions", err)
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored) as Animal[]
      setSelectedAnimals(animals)
      if (animals.length > 1) {
        setIsAddDialogOpen(true)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedAnimals.length > 0) {
      loadPrescriptions()
    }
  }, [selectedAnimals])

  const handleDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open)
    if (!open) {
      if (selectedAnimals.length > 1) {
        router.push("/animals")
      } else {
        loadPrescriptions()
      }
    }
  }

  const handleDelete = async () => {
    if (!entryToDelete) return
    const entryId = entryToDelete.id
    setEntryToDelete(null)

    try {
      await deletePrescription(entryId)
      toast({
        title: "Success",
        description: "Prescription deleted. Ungiven med reminders were removed.",
        variant: "success",
      })
      loadPrescriptions()
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete prescription",
        variant: "destructive",
      })
    }
  }

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

  const columns: Column<PrescriptionDTO>[] = [
    {
      key: "dateEntered",
      header: "Action Date",
      render: (entry) => {
        const dateStr = entry.dateEntered || entry.startDate || ""
        if (!dateStr) return <span className="text-muted-foreground">-</span>
        return (
          <span className="text-muted-foreground">
            {formatDateForTenant(dateStr, {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      key: "clinic",
      header: "Clinic",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.clinic || "-"}</span>
      ),
    },
    {
      key: "veterinarian",
      header: "Veterinarian",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.veterinarian || "-"}</span>
      ),
    },
    {
      key: "prescriptionText",
      header: "Prescription",
      render: (entry) => (
        <span className="text-muted-foreground whitespace-pre-wrap">
          {entry.prescriptionText}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.duration || "-"}</span>
      ),
    },
    {
      key: "specialInstructions",
      header: "Special Instructions",
      render: (entry) => (
        <span className="text-muted-foreground whitespace-pre-wrap">
          {entry.specialInstructions || "-"}
        </span>
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
          <span className="font-semibold">Manage Prescriptions</span>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

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
                  <DropdownMenuItem onClick={() => handleHealthClick("Chronic Condition")} className="text-sm">
                    Chronic Condition
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Vaccinations")} className="text-sm">
                    Vaccinations
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleHealthClick("Procedures, Tests, & Treatments")}
                    className="text-sm"
                  >
                    Procedures, Tests, & Treatments
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Prescriptions")} className="text-sm">
                    Prescriptions
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Set Reminders")} className="text-sm">
                    Set Reminders
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Meds")} className="text-sm">
                    Meds
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Diet")} className="text-sm">
                    Diet
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("SOAPs")} className="text-sm">
                    SOAPs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleHealthClick("Health Notes")} className="text-sm">
                    Health Notes
                  </DropdownMenuItem>
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
                      <DropdownMenuItem onClick={() => handleActionClick("Milestones")} className="text-sm">
                        Milestones
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleActionClick("Behaviors")} className="text-sm">
                      Behaviors
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleActionClick("Location")} className="text-sm">
                      Location
                    </DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem
                        onClick={() => handleActionClick("Photos, Videos, and Documents")}
                        className="text-sm"
                      >
                        Photos, Videos, and Documents
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => handleActionClick("Diary")} className="text-sm">
                      Diary
                    </DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => handleActionClick("Publicity Bio")} className="text-sm">
                        Publicity Bio
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button
                onClick={() => setIsAddDialogOpen(true)}
                size="lg"
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={prescriptions}
                  getRowId={(entry) => entry.id.toString()}
                  emptyMessage={isLoading ? "Loading prescriptions..." : "No prescriptions recorded yet"}
                  headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                  actions={(entry) => (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEntryToDelete(entry)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                />
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <PrescriptionDialog
        animals={selectedAnimals}
        open={isAddDialogOpen}
        onOpenChange={handleDialogChange}
        onSaved={() => {
          if (selectedAnimals.length > 1) {
            router.push("/animals")
          } else {
            loadPrescriptions()
          }
        }}
      />

      <CustomConfirmDialog
        open={!!entryToDelete}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
        title="Delete Prescription"
        message="Are you sure you want to delete this prescription? Ungiven med reminders created from it will also be deleted. Administered meds will be kept."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
    </div>
  )
}
