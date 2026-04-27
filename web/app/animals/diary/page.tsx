"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import type { Animal } from "@/lib/types"
import { Plus, HeartPulse, ChevronRight, Trash2 } from 'lucide-react'
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"
import { DiaryDialog } from "@/components/diary-dialog"
import { fetchDiariesByAnimalId, deleteDiaryEntry, type DiaryEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { CustomAlertDialog } from "@/components/custom-alert-dialog"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { formatDateForTenant } from "@/lib/date-format"

export default function DiaryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<DiaryEntry | null>(null)
  const [entryToEdit, setEntryToEdit] = useState<DiaryEntry | null>(null)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")

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

  useEffect(() => {
    if (selectedAnimals.length > 0) {
      loadDiaryEntries()
    } else {
      setDiaryEntries([])
    }
  }, [selectedAnimals])

  const loadDiaryEntries = async () => {
    if (selectedAnimals.length === 0) return

    setIsLoading(true)
    try {
      // Fetch diaries for all selected animals and combine them
      const allEntries: DiaryEntry[] = []
      for (const animal of selectedAnimals) {
        try {
          // Convert animal.id (string) to number for API call
          const animalId = parseInt(animal.id, 10)
          if (!isNaN(animalId)) {
            const entries = await fetchDiariesByAnimalId(animalId)
            allEntries.push(...entries)
          }
        } catch (error) {
          console.error(`Failed to fetch diaries for animal ${animal.id}:`, error)
        }
      }

      // Sort by date descending (most recent first)
      allEntries.sort((a, b) => {
        const dateA = new Date(a.actionDate).getTime()
        const dateB = new Date(b.actionDate).getTime()
        return dateB - dateA
      })

      setDiaryEntries(allEntries)
    } catch (error) {
      console.error("Failed to load diary entries", error)
      setAlertMessage("Failed to load diary entries. Please try again.")
      setAlertOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!entryToDelete) return

    const entryId = entryToDelete.id
    // Clear entryToDelete immediately since CustomConfirmDialog will close the dialog
    setEntryToDelete(null)

    try {
      const response = await deleteDiaryEntry(entryId)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Diary entry deleted successfully",
          variant: "success",
        })
        // Reload diary entries
        await loadDiaryEntries()
      } else {
        const errorMessage = response.errors?.[0] || "Failed to delete diary entry"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete diary entry", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete diary entry. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = (open: boolean) => {
    setIsAddDialogOpen(open)
    if (!open) {
      // Reload diary entries when dialog closes
      loadDiaryEntries()
      setEntryToEdit(null)
    }
  }

  const handleEdit = (entry: DiaryEntry) => {
    setEntryToEdit(entry)
    setIsAddDialogOpen(true)
  }

  const filteredEntries = diaryEntries.filter((entry) =>
    selectedAnimals.some((animal) => animal.id === entry.animalId.toString())
  )

  const columns: Column<DiaryEntry>[] = [
    {
      key: "actionDate",
      header: "Date",
      render: (entry) => (
        <span className="text-muted-foreground">
          {formatDateForTenant(entry.actionDate, {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.notes}</span>
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
          {selectedAnimals.length > 0 && (
            <>
              <span className="hover:text-foreground transition-colors">{selectedAnimals[0].name}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground font-semibold">Manage Diary</span>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 justify-end mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <HeartPulse className="h-4 w-4" />
                <span className="text-sm">Health</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/animals')} className="text-sm">Chronic Condition</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/vaccinations')} className="text-sm">Vaccinations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/procedures')} className="text-sm">
                Procedures, Tests, & Treatments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/reminders')} className="text-sm">Set Reminders</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/meds')} className="text-sm">Meds</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals?openDiet=1')} className="text-sm">Diet</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/soaps')} className="text-sm">SOAPs</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/health-notes')} className="text-sm">Health Notes</DropdownMenuItem>
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
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <span className="text-sm">Actions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => router.push('/animals/milestones')} className="text-sm">Milestones</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push('/animals/behaviors')} className="text-sm">Behaviors</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/location')} className="text-sm">Location</DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <>
                    <DropdownMenuItem onClick={() => router.push('/animals/media')} className="text-sm">
                      Photos, Videos, and Documents
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push('/animals/diary')} className="text-sm">Diary</DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => router.push('/animals/report')} className="text-sm">Publicity Bio</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 " />
            Add
          </Button>
        </div>

        {selectedAnimals.length > 0 && (
          <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredEntries}
                getRowId={(entry) => entry.id.toString()}
                emptyMessage={isLoading ? "Loading diary entries..." : "No diary entries yet"}
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

      <DiaryDialog
        animals={selectedAnimals}
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        editEntry={entryToEdit}
      />

      <CustomConfirmDialog
        open={entryToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setEntryToDelete(null)
        }}
        title="Are you sure?"
        message="Are you sure you want to delete this diary entry? This action cannot be undone."
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />

      <CustomAlertDialog
        open={alertOpen}
        onOpenChange={setAlertOpen}
        message={alertMessage}
      />
    </div>
  )
}
