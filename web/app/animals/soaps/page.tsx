"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { Dialog } from "@/components/ui/dialog"
import { ArrowLeft, Plus, HeartPulse } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { ChevronRight, Home } from 'lucide-react'
import Link from "next/link"
import { SOAPDialog } from "@/components/soap-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { fetchSOAPsByAnimalId, updateSOAPEntry, deleteSOAPEntry, type SOAPEntry } from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { CustomAlertDialog } from "@/components/custom-alert-dialog"
import { Pencil, Trash2 } from "lucide-react"

export default function SOAPsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)
  const [soaps, setSoaps] = useState<SOAPEntry[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [entryToEdit, setEntryToEdit] = useState<SOAPEntry | null>(null)
  const [entryToDelete, setEntryToDelete] = useState<SOAPEntry | null>(null)
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
      loadSOAPs()
    } else {
      setSoaps([])
    }
  }, [selectedAnimals])

  const loadSOAPs = async () => {
    if (selectedAnimals.length === 0) return

    setIsLoading(true)
    try {
      // Fetch SOAPs for all selected animals and combine them
      const allEntries: SOAPEntry[] = []
      for (const animal of selectedAnimals) {
        try {
          // Convert animal.id (string) to number for API call
          const animalId = parseInt(animal.id, 10)
          if (!isNaN(animalId)) {
            const entries = await fetchSOAPsByAnimalId(animalId)
            allEntries.push(...entries)
          }
        } catch (error) {
          console.error(`Failed to fetch SOAPs for animal ${animal.id}:`, error)
        }
      }
      
      // Sort by date descending (most recent first)
      allEntries.sort((a, b) => {
        const dateA = new Date(a.actionDate || a.date || "").getTime()
        const dateB = new Date(b.actionDate || b.date || "").getTime()
        return dateB - dateA
      })
      
      setSoaps(allEntries)
    } catch (error) {
      console.error("Failed to load SOAPs", error)
      setAlertMessage("Failed to load SOAPs. Please try again.")
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
      const response = await deleteSOAPEntry(entryId)
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "SOAP entry deleted successfully",
          variant: "success",
        })
        // Reload SOAPs
        await loadSOAPs()
      } else {
        const errorMessage = response.errors?.[0] || "Failed to delete SOAP entry"
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Failed to delete SOAP entry", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to delete SOAP entry. Please try again."
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
      // Reload SOAPs when dialog closes
      loadSOAPs()
      setEntryToEdit(null)
    }
  }

  const handleEdit = (entry: SOAPEntry) => {
    setEntryToEdit(entry)
    setIsAddDialogOpen(true)
  }

  const handleDialogChange = (open: boolean) => {
    if (!open && selectedAnimals.length > 1) {
      // Redirect back to animals page when cancelled with multiple animals
      router.push('/animals')
    } else {
      setIsAddDialogOpen(open)
    }
  }

  const handleHealthClick = (action: string) => {
    const healthRoutes: Record<string, string> = {
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
      "New Location": "/animals/location",
      "Photos, Videos, & Documents": "/animals/media",
      "Gallery View": "/animals/gallery",
      Diary: "/animals/diary",
      "Animal Report": "/animals/report",
    }
    const route = actionRoutes[action]
    if (route) router.push(route)
  }

  const columns: Column<SOAPEntry>[] = [
    {
      key: "actionDate",
      header: "Date",
      render: (soap) => {
        const dateStr = soap.actionDate || soap.date || ""
        if (!dateStr) return <span className="text-muted-foreground">-</span>
        return (
          <span className="text-muted-foreground">
            {new Date(dateStr).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        )
      },
    },
    {
      key: "subjective",
      header: "Subjective",
      render: (soap) => (
        <span className="text-muted-foreground truncate block">{soap.subjective}</span>
      ),
    },
    {
      key: "objective",
      header: "Objective",
      render: (soap) => (
        <span className="text-muted-foreground truncate block">{soap.objective}</span>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (soap) => (
        <span className="text-muted-foreground truncate block">{soap.plan || soap.soapPlan}</span>
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
          <span className="font-semibold">Manage SOAPs</span>
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
                    <DropdownMenuItem onClick={() => handleActionClick("New Location")} className="text-sm">New Location</DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <>
                        <DropdownMenuItem onClick={() => handleActionClick("Photos, Videos, & Documents")} className="text-sm">
                          Photos, Videos, & Documents
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick("Gallery View")} className="text-sm">Gallery View</DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => handleActionClick("Diary")} className="text-sm">Diary</DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => handleActionClick("Animal Report")} className="text-sm">Animal Report</DropdownMenuItem>
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
                  data={soaps}
                  getRowId={(soap) => soap.id.toString()}
                  emptyMessage={isLoading ? "Loading SOAPs..." : "No SOAPs recorded yet"}
                  headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                  actions={(soap) => (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(soap)}
                        className="text-primary hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEntryToDelete(soap)}
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

      <SOAPDialog
        animals={selectedAnimals}
        open={isAddDialogOpen}
        onOpenChange={handleDialogClose}
        editEntry={entryToEdit}
        onSaved={(items) => {
          if (selectedAnimals.length > 1) {
            router.push("/animals")
          }
        }}
      />

      <CustomConfirmDialog
        open={entryToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setEntryToDelete(null)
        }}
        title="Are you sure?"
        message="Are you sure you want to delete this SOAP entry? This action cannot be undone."
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
