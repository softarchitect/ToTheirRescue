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
import { ProcedureDialog } from "@/components/procedure-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"
import { fetchAnimalProcedures, deleteAnimalProcedure, type AnimalProcedure } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDateForTenant } from "@/lib/date-format"

export default function ProceduresPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [procedures, setProcedures] = useState<AnimalProcedure[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedRadio, setSelectedRadio] = useState<1 | 2>(1) // 1 = completed, 2 = reminders
  const [isLoading, setIsLoading] = useState(false)
  const [procedureToEdit, setProcedureToEdit] = useState<AnimalProcedure | null>(null)
  const [procedureToDelete, setProcedureToDelete] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<AnimalProcedure | null>(null)
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
      loadProcedures()
    }
  }, [currentAnimal?.id, selectedRadio])

  const loadProcedures = async () => {
    if (!currentAnimal?.id) return

    try {
      setIsLoading(true)
      const reminder = selectedRadio === 2
      const data = await fetchAnimalProcedures(Number(currentAnimal.id), reminder, false)
      setProcedures(data)
    } catch (error: any) {
      console.error("Failed to load procedures", error)
      const errorMessage = error?.message || "Failed to load procedures"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setProcedures([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!procedureToDelete) return

    try {
      await deleteAnimalProcedure(procedureToDelete)
      toast({
        title: "Success",
        description: "Procedure deleted successfully",
      })
      loadProcedures()
      setShowDeleteConfirm(false)
      setProcedureToDelete(null)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete procedure",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (procedure: AnimalProcedure) => {
    setProcedureToEdit(procedure)
    setIsAddDialogOpen(true)
  }

  const handleSave = (wasReminderCompletion?: boolean) => {
    loadProcedures()
    setProcedureToEdit(null)
    setIsAddDialogOpen(false)
    if (wasReminderCompletion) {
      setSelectedRadio(1)
      setSelectedReminder(null)
    }
  }

  const columns: Column<AnimalProcedure>[] = selectedRadio === 1 ? [
    {
      key: "actionDate",
      header: "Action Date",
      render: (proc) => (
        <span className="text-muted-foreground">
          {proc.actionDate ? formatDateForTenant(proc.actionDate) : ""}
        </span>
      ),
    },
    {
      key: "healthProcedureKind",
      header: "Kind",
      render: (proc) => (
        <span className="font-medium text-primary">{proc.healthProcedureKind}</span>
      ),
    },
    {
      key: "hospitalClinic",
      header: "Clinic",
      render: (proc) => (
        <span className="text-muted-foreground">{proc.hospitalClinic || ""}</span>
      ),
    },
    {
      key: "administerer",
      header: "Vet",
      render: (proc) => (
        <span className="text-muted-foreground">{proc.administerer || ""}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (proc) => (
        <span className="text-muted-foreground">{proc.notes || ""}</span>
      ),
    },
  ] : [
    {
      key: "select",
      header: "",
      render: (proc) => (
        <Checkbox
          checked={selectedReminder?.id === proc.id}
          onCheckedChange={(checked) => {
            if (checked) {
              setSelectedReminder(proc)
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
      render: (proc) => (
        <span className="text-muted-foreground">
          {proc.dueDate ? formatDateForTenant(proc.dueDate) : ""}
        </span>
      ),
    },
    {
      key: "healthProcedureKind",
      header: "Kind",
      render: (proc) => (
        <span className="font-medium text-primary">{proc.healthProcedureKind}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (proc) => (
        <span className="text-muted-foreground">{proc.notes || ""}</span>
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
                setSelectedReminder(null)
              }}
            >
              Completed Procedures, Tests, & Treatments
            </Button>
            <Button
              variant={selectedRadio === 2 ? "default" : "outline"}
              size="sm"
              className={selectedRadio === 2
                ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
              onClick={() => {
                setSelectedRadio(2)
                setSelectedReminder(null)
              }}
            >
              Procedure Reminders
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
                  const actionDate = new Date().toISOString().split('T')[0]
                  setProcedureToEdit({
                    ...selectedReminder,
                    actionDate: actionDate,
                    hospitalClinicId: null,
                    dueAgain: undefined,
                  })
                  setIsCompletingReminder(true)
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
                setProcedureToEdit(null)
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
                  <div className="text-muted-foreground">Loading procedures...</div>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={procedures}
                  getRowId={(proc) => String(proc.id)}
                  emptyMessage={selectedRadio === 1 ? "No completed procedures recorded yet" : "No procedure reminders set"}
                  headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                  actionsHeader="Action"
                  actions={(proc) => (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(proc)}
                        className="h-8 px-3 text-primary"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setProcedureToDelete(proc.id)
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

      <ProcedureDialog
        animals={selectedAnimals}
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open)
          if (!open) {
            setProcedureToEdit(null)
            setSelectedReminder(null)
            setIsCompletingReminder(false)
          }
        }}
        procedure={procedureToEdit}
        onSave={handleSave}
        isReminder={isCompletingReminder ? false : (selectedRadio === 2)}
      />

      <CustomConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to delete this procedure?"
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  )
}
