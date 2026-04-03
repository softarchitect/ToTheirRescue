"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Plus, ChevronDown, HeartPulse } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronRight, Home } from 'lucide-react'
import Link from "next/link"
import { HealthNoteDialog } from "@/components/health-note-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { fetchAnimalHealthNotes, deleteHealthNote, type HealthNoteEntry } from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { Trash2 } from "lucide-react"
import { formatDateForTenant } from "@/lib/date-format"

export default function HealthNotesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [notes, setNotes] = useState<HealthNoteEntry[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [entryToEdit, setEntryToEdit] = useState<HealthNoteEntry | null>(null)
  const [entryToDelete, setEntryToDelete] = useState<HealthNoteEntry | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  const loadHealthNotes = async () => {
    if (selectedAnimals.length === 0) return
    
    setIsLoading(true)
    try {
      const allNotes: HealthNoteEntry[] = []
      
      for (const animal of selectedAnimals) {
        if (animal?.id) {
          const animalId = typeof animal.id === "string" ? parseInt(animal.id, 10) : animal.id
          const animalNotes = await fetchAnimalHealthNotes(animalId)
          allNotes.push(...animalNotes)
        }
      }
      
      // Sort by date descending
      allNotes.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })
      
      setNotes(allNotes)
    } catch (err) {
      console.error("Failed to load health notes", err)
      toast({
        title: "Error",
        description: "Failed to load health notes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  useEffect(() => {
    if (selectedAnimals.length > 0) {
      loadHealthNotes()
    }
  }, [selectedAnimals])

  const handleDialogChange = (open: boolean) => {
    setIsAddDialogOpen(open)
    
    if (!open) {
      if (selectedAnimals.length > 1) {
        // Redirect back to animals page when cancelled with multiple animals
        router.push('/animals')
      } else {
        // Reload notes when dialog closes
        loadHealthNotes()
      }
      setEntryToEdit(null)
    }
  }

  const handleEdit = (entry: HealthNoteEntry) => {
    setEntryToEdit(entry)
    setIsAddDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!entryToDelete) return

    const entryId = entryToDelete.id
    setEntryToDelete(null)

    try {
      await deleteHealthNote(entryId)
      toast({
        title: "Success",
        description: "Health note deleted successfully",
        variant: "success",
      })
      loadHealthNotes()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete health note"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleHealthClick = (action: string) => {
    const healthRoutes: Record<string, string> = {
      "Chronic Condition": "/animals",
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
      Location: "/animals/location",
      "Photos, Videos, and Documents": "/animals/media",
      Diary: "/animals/diary",
      "Publicity Bio": "/animals/report",
    }
    const route = actionRoutes[action]
    if (route) router.push(route)
  }

  const columns: Column<HealthNoteEntry>[] = [
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
      key: "note",
      header: "Notes",
      render: (entry) => <span className="whitespace-pre-wrap">{entry.note}</span>,
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
          <span className="font-semibold">Manage Health Notes</span>
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
                  <DropdownMenuItem onClick={() => handleHealthClick("Chronic Condition")} className="text-sm">Chronic Condition</DropdownMenuItem>
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
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => handleActionClick("Publicity Bio")} className="text-sm">Publicity Bio</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
              <CardContent className="p-0">
                <DataTable
                  columns={columns}
                  data={notes}
                  getRowId={(entry) => entry.id.toString()}
                  emptyMessage={isLoading ? "Loading health notes..." : "No notes recorded yet"}
                  headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                  actions={(entry) => (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(entry)}
                        className="text-primary hover:text-primary"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEntryToDelete(entry)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                />
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <HealthNoteDialog
        animals={selectedAnimals}
        open={isAddDialogOpen}
        onOpenChange={handleDialogChange}
        editEntry={entryToEdit}
        onSaved={(items) => {
          if (selectedAnimals.length > 1) {
            router.push("/animals")
          } else {
            loadHealthNotes()
          }
        }}
      />

      <CustomConfirmDialog
        open={!!entryToDelete}
        onOpenChange={(open) => !open && setEntryToDelete(null)}
        title="Delete Health Note"
        message="Are you sure you want to delete this health note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
      />
    </div>
  )
}
