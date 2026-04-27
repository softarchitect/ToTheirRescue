"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, ChevronDown, ChevronRight, Edit, Trash2, Check } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { VaccinationDialog } from "@/components/vaccination-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"
import { fetchAnimalVaccinations, deleteAnimalVaccination, type AnimalVaccination } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDateForTenant } from "@/lib/date-format"

export default function VaccinationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [vaccinations, setVaccinations] = useState<AnimalVaccination[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedRadio, setSelectedRadio] = useState<1 | 2>(1) // 1 = completed, 2 = reminders
  const [isLoading, setIsLoading] = useState(false)
  const [vaccinationToEdit, setVaccinationToEdit] = useState<AnimalVaccination | null>(null)
  const [vaccinationToDelete, setVaccinationToDelete] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<AnimalVaccination | null>(null)
  const [isCompletingReminder, setIsCompletingReminder] = useState(false)

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
        setCurrentAnimal(animals[0])
      }
    }
  }, [])

  useEffect(() => {
    if (currentAnimal?.id) {
      loadVaccinations()
    }
  }, [currentAnimal?.id, selectedRadio])

  const loadVaccinations = async () => {
    if (!currentAnimal?.id) return

    try {
      setIsLoading(true)
      const reminder = selectedRadio === 2
      const data = await fetchAnimalVaccinations(Number(currentAnimal.id), reminder, false)
      setVaccinations(data)
    } catch (error: any) {
      console.error("Failed to load vaccinations", error)
      const errorMessage = error?.message || "Failed to load vaccinations"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setVaccinations([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!vaccinationToDelete) return

    try {
      await deleteAnimalVaccination(vaccinationToDelete)
      toast({
        title: "Success",
        description: "Vaccination deleted successfully",
      })
      loadVaccinations()
      setShowDeleteConfirm(false)
      setVaccinationToDelete(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vaccination",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (vaccination: AnimalVaccination) => {
    setVaccinationToEdit(vaccination)
    setIsAddDialogOpen(true)
  }

  const handleSave = (wasReminderCompletion?: boolean) => {
    loadVaccinations()
    setVaccinationToEdit(null)
    setIsAddDialogOpen(false)
    // If a reminder was completed, switch to completed vaccinations tab
    if (wasReminderCompletion) {
      setSelectedRadio(1)
      setSelectedReminder(null) // Clear reminder selection
    }
  }

  // Define columns for the DataTable
  const columns: Column<AnimalVaccination>[] = selectedRadio === 1 ? [
    {
      key: "actionDate",
      header: "Action Date",
      render: (vaccination) => (
        <span className="text-muted-foreground">
          {vaccination.actionDate ? formatDateForTenant(vaccination.actionDate) : ""}
        </span>
      ),
    },
    {
      key: "vaccinationKind",
      header: "Kind",
      render: (vaccination) => (
        <span className="font-medium text-primary">{vaccination.vaccinationKind}</span>
      ),
    },
    {
      key: "hospitalClinic",
      header: "Clinic",
      render: (vaccination) => (
        <span className="text-muted-foreground">{vaccination.hospitalClinic || ""}</span>
      ),
    },
    {
      key: "administerer",
      header: "Vet",
      render: (vaccination) => (
        <span className="text-muted-foreground">{vaccination.administerer || ""}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (vaccination) => (
        <span className="text-muted-foreground">{vaccination.notes || ""}</span>
      ),
    },

  ] : [
    {
      key: "select",
      header: "",
      render: (vaccination) => (
        <Checkbox
          checked={selectedReminder?.id === vaccination.id}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedReminder(vaccination)
            } else {
              setSelectedReminder(null)
            }
          }}
          aria-label="Select reminder"
        />
      ),
      className: "w-12",
    },
    {
      key: "dueDate",
      header: "Due Date",
      render: (vaccination) => (
        <span className="text-muted-foreground">
          {vaccination.dueDate ? formatDateForTenant(vaccination.dueDate) : ""}
        </span>
      ),
    },
    {
      key: "vaccinationKind",
      header: "Kind",
      render: (vaccination) => (
        <span className="font-medium text-primary">{vaccination.vaccinationKind}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (vaccination) => (
        <span className="text-muted-foreground">{vaccination.notes || ""}</span>
      ),
    },

  ]

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
        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={selectedRadio === 1 ? "default" : "outline"}
              size="sm"
              className={selectedRadio === 1
                ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
              onClick={() => {
                setSelectedRadio(1)
                setSelectedReminder(null) // Clear selection when switching tabs
              }}
            >
              Completed Vaccinations
            </Button>
            <Button
              variant={selectedRadio === 2 ? "default" : "outline"}
              size="sm"
              className={selectedRadio === 2
                ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
              onClick={() => {
                setSelectedRadio(2)
                setSelectedReminder(null) // Clear selection when switching tabs
              }}
            >
              Vaccination Reminders
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {selectedRadio === 2 && (
              <Button
                variant="outline"
                onClick={() => {
                  if (!selectedReminder) {
                    toast({
                      title: "Selection Required",
                      description: "You must select a reminder.",
                      variant: "destructive",
                    })
                    return
                  }
                  // Open dialog to complete the reminder with today's action date.
                  const actionDate = new Date().toISOString().split('T')[0]
                  setVaccinationToEdit({
                    ...selectedReminder,
                    actionDate: actionDate,
                    hospitalClinicId: 0,
                    dueAgain: undefined,
                  })
                  setIsCompletingReminder(true) // Mark that we're completing a reminder
                  // Keep on Vaccination Reminders tab
                  setIsAddDialogOpen(true)
                }}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Complete Reminder
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="text-sm">Health</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => router.push('/animals')} className="text-sm">
                  Chronic Condition
                </DropdownMenuItem>
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
                <DropdownMenuItem onClick={() => router.push('/animals?openDiet=1')} className="text-sm">
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
                    <DropdownMenuItem onClick={() => router.push('/animals/milestones')} className="text-sm">
                      Milestones
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/animals/behaviors')} className="text-sm">
                    Behaviors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/animals/location')} className="text-sm">
                    Location
                  </DropdownMenuItem>
                  {userRole !== "AnimalCaretaker" && (
                    <>
                      <DropdownMenuItem onClick={() => router.push('/animals/media')} className="text-sm">
                        Photos, Videos, and Documents
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => router.push('/animals/diary')} className="text-sm">
                    Diary
                  </DropdownMenuItem>
                  {userRole !== "AnimalCaretaker" && (
                    <DropdownMenuItem onClick={() => router.push('/animals/report')} className="text-sm">
                      Publicity Bio
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              onClick={() => {
                setVaccinationToEdit(null)
                setIsAddDialogOpen(true)
              }}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>

        {currentAnimal && (
          <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-muted-foreground">Loading vaccinations...</div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={vaccinations}
                  getRowId={(vaccination) => String(vaccination.id)}
                  emptyMessage={selectedRadio === 1 ? "No completed vaccinations recorded yet" : "No vaccination reminders set"}
                  headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                  actionsHeader=""
                  actions={(vaccination) => (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(vaccination)}
                        className="h-8 px-3 text-primary"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setVaccinationToDelete(vaccination.id)
                          setShowDeleteConfirm(true)
                        }}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>)}
                />
              )}
            </CardContent>
          </Card>
        )}

        {!currentAnimal && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please select an animal first</p>
            <Link href="/animals">
              <Button className="mt-4">Select Animals</Button>
            </Link>
          </div>
        )}
      </main>

      <VaccinationDialog
        animals={selectedAnimals}
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setVaccinationToEdit(null)
            setSelectedReminder(null) // Clear selection when dialog closes
            setIsCompletingReminder(false) // Reset completing reminder flag
          }
        }}
        vaccination={vaccinationToEdit}
        onSave={handleSave}
        // If completing a reminder, show completed vaccination form (isReminder=false)
        // Otherwise, if on reminders tab and editing a reminder, show reminder form (isReminder=true)
        isReminder={isCompletingReminder ? false : (selectedRadio === 2 && vaccinationToEdit?.reminder === true)}
      />

      <CustomConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this vaccination?"
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
