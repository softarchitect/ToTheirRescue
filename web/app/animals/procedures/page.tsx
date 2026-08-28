"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/ui/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, ChevronDown, ChevronRight, Trash2, Check } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { ProcedureDialog } from "@/components/procedure-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"
import { fetchAnimalProcedures, deleteAnimalProcedure, type AnimalProcedure } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { CustomAlertDialog } from "@/components/custom-alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { formatDateForTenant } from "@/lib/date-format"

function sortProceduresByDate(procedures: AnimalProcedure[], useDueDate: boolean) {
  return [...procedures].sort((a, b) => {
    const dateA = useDueDate ? a.dueDate : a.actionDate
    const dateB = useDueDate ? b.dueDate : b.actionDate
    const timeA = dateA ? new Date(dateA).getTime() : Number.MAX_SAFE_INTEGER
    const timeB = dateB ? new Date(dateB).getTime() : Number.MAX_SAFE_INTEGER
    return timeA - timeB
  })
}

export default function ProceduresPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [reminderProcedures, setReminderProcedures] = useState<AnimalProcedure[]>([])
  const [completedProcedures, setCompletedProcedures] = useState<AnimalProcedure[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [procedureToEdit, setProcedureToEdit] = useState<AnimalProcedure | null>(null)
  const [procedureToDelete, setProcedureToDelete] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedReminder, setSelectedReminder] = useState<AnimalProcedure | null>(null)
  const [isCompletingReminder, setIsCompletingReminder] = useState(false)
  const [dialogIsReminder, setDialogIsReminder] = useState(false)
  const [selectionAlertOpen, setSelectionAlertOpen] = useState(false)
  const [selectionAlertMessage, setSelectionAlertMessage] = useState("")

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
      void loadProcedures()
    }
  }, [currentAnimal?.id])

  const loadProcedures = async () => {
    if (!currentAnimal?.id) return

    try {
      setIsLoading(true)
      const animalId = Number(currentAnimal.id)
      const [reminders, completed] = await Promise.all([
        fetchAnimalProcedures(animalId, true, false),
        fetchAnimalProcedures(animalId, false, false),
      ])
      const sortedReminders = sortProceduresByDate(reminders, true)
      setReminderProcedures(sortedReminders)
      setCompletedProcedures(sortProceduresByDate(completed, false))
      setSelectedReminder((current) =>
        current && sortedReminders.some((item) => item.id === current.id) ? current : null,
      )
    } catch (error: any) {
      console.error("Failed to load procedures", error)
      const errorMessage = error?.message || "Failed to load procedures"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setReminderProcedures([])
      setCompletedProcedures([])
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
      void loadProcedures()
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

  const handleEdit = (procedure: AnimalProcedure, fromReminders: boolean) => {
    setProcedureToEdit(procedure)
    setDialogIsReminder(fromReminders && procedure.reminder === true)
    setIsCompletingReminder(false)
    setIsAddDialogOpen(true)
  }

  const handleSave = (wasReminderCompletion?: boolean) => {
    void loadProcedures()
    setProcedureToEdit(null)
    setIsAddDialogOpen(false)
    if (wasReminderCompletion) {
      setSelectedReminder(null)
    }
  }

  const renderRowActions = (procedure: AnimalProcedure, fromReminders: boolean) => (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEdit(procedure, fromReminders)}
        className="h-8 px-3 text-primary"
      >
        Edit
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setProcedureToDelete(procedure.id)
          setShowDeleteConfirm(true)
        }}
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )

  const reminderColumns: Column<AnimalProcedure>[] = [
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
          className="border-2 border-emerald-400/70 bg-white data-[state=checked]:border-primary"
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

  const completedColumns: Column<AnimalProcedure>[] = [
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
  ]

  const openNewReminderDialog = () => {
    setProcedureToEdit(null)
    setSelectedReminder(null)
    setIsCompletingReminder(false)
    setDialogIsReminder(true)
    setIsAddDialogOpen(true)
  }

  const openNewCompletedProcedureDialog = () => {
    setProcedureToEdit(null)
    setSelectedReminder(null)
    setIsCompletingReminder(false)
    setDialogIsReminder(false)
    setIsAddDialogOpen(true)
  }

  const handleCompleteReminder = () => {
    if (!selectedReminder) {
      setSelectionAlertMessage(
        reminderProcedures.length === 0
          ? "There are no procedure reminders to complete."
          : "You must select a reminder.",
      )
      setSelectionAlertOpen(true)
      return
    }

    const actionDate = new Date().toISOString().split('T')[0]
    setProcedureToEdit({
      ...selectedReminder,
      actionDate,
      hospitalClinicId: null,
      dueAgain: undefined,
    })
    setIsCompletingReminder(true)
    setDialogIsReminder(false)
    setIsAddDialogOpen(true)
  }

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

        {currentAnimal && (
          <div className="space-y-6 mt-2">
            <section>
              <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-foreground">Procedure Reminders</h2>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
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
                        <DropdownMenuItem onClick={() => router.push('/animals/prescriptions')} className="text-sm">
                          Prescriptions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/animals?openReminder=1')} className="text-sm">
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
                          <DropdownMenuItem onClick={() => undefined} className="text-sm">
                            Microchipping
                          </DropdownMenuItem>
                          {userRole !== "AnimalCaretaker" && (
                            <DropdownMenuItem onClick={() => router.push('/animals/report')} className="text-sm">
                              Publicity Bio
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="hidden h-6 w-px bg-border sm:block" />

                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleCompleteReminder} className="gap-2">
                      <Check className="h-4 w-4" />
                      Complete Reminder
                    </Button>
                    <Button
                      onClick={openNewReminderDialog}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Plus className="h-4 w-4" />
                      Set New Reminder
                    </Button>
                  </div>
                </div>
              </div>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-muted-foreground">Loading procedure reminders...</div>
                    </div>
                  ) : (
                    <DataTable
                      columns={reminderColumns}
                      data={reminderProcedures}
                      getRowId={(proc) => `reminder-${proc.id}`}
                      emptyMessage="No procedure reminders set"
                      headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                      actionsHeader="Action"
                      actions={(proc) => renderRowActions(proc, true)}
                    />
                  )}
                </CardContent>
              </Card>
            </section>

            <section>
              <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Completed Procedures, Tests, & Treatments
                </h2>
                <Button
                  onClick={openNewCompletedProcedureDialog}
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add New Completed Procedure
                </Button>
              </div>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-muted-foreground">Loading completed procedures...</div>
                    </div>
                  ) : (
                    <DataTable
                      columns={completedColumns}
                      data={completedProcedures}
                      getRowId={(proc) => `completed-${proc.id}`}
                      emptyMessage="No completed procedures recorded yet"
                      headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                      actionsHeader="Action"
                      actions={(proc) => renderRowActions(proc, false)}
                    />
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
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
            setDialogIsReminder(false)
          }
        }}
        procedure={procedureToEdit}
        onSave={handleSave}
        isReminder={isCompletingReminder ? false : dialogIsReminder}
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

      <CustomAlertDialog
        open={selectionAlertOpen}
        onOpenChange={setSelectionAlertOpen}
        title="Selection Required"
        message={selectionAlertMessage}
      />
    </div>
  )
}
