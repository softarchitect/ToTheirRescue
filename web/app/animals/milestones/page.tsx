"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DataTable, type Column } from "@/components/ui/data-table"
import { motion } from "framer-motion"
import { Plus, Pencil, Trash2, ChevronDown, HeartPulse } from 'lucide-react'
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Animal, Milestone } from "@/lib/types"
import { EditMilestoneDialog } from "@/components/edit-milestone-dialog"
import { MilestoneDialog } from "@/components/milestone-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { deleteAnimalMilestone, fetchAnimalsByIds, fetchAnimalsAndMilestonesByIds } from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"

export default function AnimalMilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditBirthDialogOpen, setIsEditBirthDialogOpen] = useState(false)
  const [editingBirthMilestoneId, setEditingBirthMilestoneId] = useState<string | null>(null)
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      try {
        setSelectedAnimals(JSON.parse(stored))
      } catch {
        setSelectedAnimals([])
      }
    }
  }, [])

  // Function to refresh selected animals data from API
  const refreshSelectedAnimals = async () => {
    if (!selectedAnimals.length) return

    try {
      // Convert string IDs to numbers
      const animalIds: number[] = selectedAnimals
        .map(a => Number(a.id))
        .filter((id): id is number => !isNaN(id) && typeof id === 'number')
      if (animalIds.length === 0) return

      const refreshedAnimals = await fetchAnimalsByIds(animalIds)

      if (refreshedAnimals.length > 0) {
        setSelectedAnimals(refreshedAnimals)
        // Update sessionStorage with refreshed data
        sessionStorage.setItem("selectedAnimals", JSON.stringify(refreshedAnimals))
      }
    } catch (error) {
      console.error("Failed to refresh selected animals", error)
    }
  }

  useEffect(() => {
    if (!selectedAnimals.length) return

    const loadMilestones = async () => {
      try {
        const animalIds: number[] = selectedAnimals
          .map(a => Number(a.id))
          .filter((id): id is number => !isNaN(id) && typeof id === 'number')
        if (animalIds.length === 0) return

        const { milestones: apiMilestones } = await fetchAnimalsAndMilestonesByIds(animalIds)
        setMilestones(apiMilestones)
      } catch (error) {
        console.error("Failed to load animal milestones", error)
      }
    }

    loadMilestones()
  }, [selectedAnimals])

  const editingMilestone = editingBirthMilestoneId
    ? milestones.find((m) => m.id === editingBirthMilestoneId) || null
    : null

  // Get the last milestone (most recent date)
  const getLastMilestone = () => {
    if (milestones.length === 0) return null
    // Milestones are ordered by date ascending, so the last one is the most recent
    return milestones[milestones.length - 1]
  }

  const isLastMilestone = (milestoneId: string) => {
    const lastMilestone = getLastMilestone()
    return lastMilestone?.id === milestoneId
  }

  const canDeleteMilestone = (milestoneId: string) => {
    const milestone = milestones.find((m) => m.id === milestoneId)
    if (!milestone) return false

    // Cannot delete birth or intake milestones
    const milestoneTypeLower = (milestone.type || "").toLowerCase()
    if (milestoneTypeLower === "birth" || milestoneTypeLower === "intake") {
      return false
    }

    // Can only delete the last milestone
    return isLastMilestone(milestoneId)
  }

  const handleDeleteMilestone = async (id: string) => {
    const milestone = milestones.find((m) => m.id === id)
    if (!milestone) return

    const milestoneTypeLower = (milestone.type || "").toLowerCase()
    if (milestoneTypeLower === "birth" || milestoneTypeLower === "intake") {
      alert("Birth and Intake milestones cannot be deleted.")
      return
    }

    if (!isLastMilestone(id)) {
      alert("Only the last milestone can be deleted.")
      return
    }

    if (!confirm("Are you sure you want to delete this milestone?")) {
      return
    }

    try {
      await deleteAnimalMilestone(id)
      // Refresh animal data to get updated lastMilestone/lastMilestoneDate
      await refreshSelectedAnimals()
      // Refresh milestones list after successful deletion
      if (selectedAnimals.length > 0) {
        const animalIds: number[] = selectedAnimals
          .map(a => Number(a.id))
          .filter((id): id is number => !isNaN(id) && typeof id === 'number')
        if (animalIds.length > 0) {
          const { milestones: apiMilestones } = await fetchAnimalsAndMilestonesByIds(animalIds)
          setMilestones(apiMilestones)
        }
      }
    } catch (error) {
      console.error("Failed to delete milestone", error)
      alert("Failed to delete milestone. Please try again.")
    }
  }

  const columns: Column<Milestone>[] = [
    {
      key: "type",
      header: "Milestone",
      render: (milestone) => (
        <span className="font-medium text-primary">{milestone.type}</span>
      ),
    },
    {
      key: "date",
      header: "Milestone Date",
      render: (milestone) => (
        <span className="text-muted-foreground">
          {new Date(milestone.date).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          })}
        </span>
      ),
    },
    {
      key: "firstName",
      header: "First Name",
      render: (milestone) => (
        <span className="text-muted-foreground">{milestone.firstName || "-"}</span>
      ),
    },
    {
      key: "lastName",
      header: "Last Name",
      render: (milestone) => (
        <span className="text-muted-foreground">{milestone.lastName || "-"}</span>
      ),
    },
    {
      key: "notes",
      header: "Notes",
      render: (milestone) => (
        <span className="text-muted-foreground">{milestone.notes || "-"}</span>
      ),
    },
  ]

  // Handlers for Health and Actions navigation
  const handleHealthClick = (action: string) => {
    const healthRoutes: Record<string, string> = {
      Vaccinations: "/animals/vaccinations",
      Procedures: "/animals/procedures",
      "Set Reminders": "/animals/reminders",
      Meds: "/animals/meds",
      Diet: "/animals/diet",
      SOAPs: "/animals/soaps",
      "Health Notes": "/animals/health-notes",
      "Health History": "/animals/health-history",
      "Animal Health Report": "/animals/health-report",
    }

    const route = healthRoutes[action]
    if (route) {
      window.location.href = route
    }
  }

  const handleActionClick = (action: string) => {
    const actionRoutes: Record<string, string> = {
      Milestones: "/animals/milestones",
      Behaviors: "/animals/behaviors",
      "New Location": "/animals/location",
      Photos: "/animals/media",
      "Gallery View": "/animals/gallery",
      Diary: "/animals/diary",
      "Animal Report": "/animals/report",
    }

    const route = actionRoutes[action]
    if (route) {
      window.location.href = route
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/animals" className="hover:text-foreground">
              Manage Animals
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Manage Milestones</span>
          </nav>

          <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
            <CardContent className="px-3 py-0">
              <SelectedAnimalsHeader animals={selectedAnimals} />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
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
                <DropdownMenuItem onClick={() => handleHealthClick("Procedures")} className="text-sm">
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
                      <DropdownMenuItem onClick={() => handleActionClick("Photos")} className="text-sm">
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
            <Button onClick={() => setIsAddDialogOpen(true)} size="lg" className="gap-2 shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-5 w-5" />
              Add
            </Button>
          </div>

          <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0 mt-2">
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={milestones}
                getRowId={(milestone) => milestone.id}
                actions={(milestone) => (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-primary cursor-pointer"
                      onClick={() => {
                        setEditingBirthMilestoneId(milestone.id)
                        setIsEditBirthDialogOpen(true)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8",
                        canDeleteMilestone(milestone.id)
                          ? "text-destructive cursor-pointer"
                          : "text-muted-foreground cursor-not-allowed opacity-50"
                      )}
                      onClick={() => handleDeleteMilestone(milestone.id)}
                      disabled={!canDeleteMilestone(milestone.id)}
                      title={
                        canDeleteMilestone(milestone.id)
                          ? "Delete milestone"
                          : (() => {
                            const milestoneTypeLower = (milestone.type || "").toLowerCase()
                            if (milestoneTypeLower === "birth" || milestoneTypeLower === "intake") {
                              return "Birth and Intake milestones cannot be deleted"
                            }
                            return "Only the last milestone can be deleted"
                          })()
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                emptyMessage="No milestones found"
                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
              />
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <MilestoneDialog
        animals={selectedAnimals}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={async () => {
          // Refresh animal data to get updated lastMilestone/lastMilestoneDate
          await refreshSelectedAnimals()
          // Refresh milestones list after successful creation
          if (selectedAnimals.length > 0) {
            try {
              const animalIds: number[] = selectedAnimals
                .map(a => Number(a.id))
                .filter((id): id is number => !isNaN(id) && typeof id === 'number')
              if (animalIds.length > 0) {
                const { milestones: apiMilestones } = await fetchAnimalsAndMilestonesByIds(animalIds)
                setMilestones(apiMilestones)
              }
            } catch (error) {
              console.error("Failed to refresh milestones", error)
            }
          }
        }}
      />
      <EditMilestoneDialog
        animal={selectedAnimals[0]}
        open={isEditBirthDialogOpen}
        onOpenChange={(open) => {
          setIsEditBirthDialogOpen(open)
          if (!open) {
            setEditingBirthMilestoneId(null)
          }
        }}
        milestone={editingMilestone}
        onSubmit={({ date, notes }) => {
          if (!editingBirthMilestoneId) return
          setMilestones((prev) =>
            prev.map((m) =>
              m.id === editingBirthMilestoneId
                ? {
                  ...m,
                  date,
                  notes,
                }
                : m,
            ),
          )
        }}
        onSuccess={async () => {
          // Refresh animal data to get updated lastMilestone/lastMilestoneDate
          await refreshSelectedAnimals()
          // Refresh milestones list after successful update
          if (selectedAnimals.length > 0) {
            try {
              const animalIds: number[] = selectedAnimals
                .map(a => Number(a.id))
                .filter((id): id is number => !isNaN(id) && typeof id === 'number')
              if (animalIds.length > 0) {
                const { milestones: apiMilestones } = await fetchAnimalsAndMilestonesByIds(animalIds)
                setMilestones(apiMilestones)
              }
            } catch (error) {
              console.error("Failed to refresh milestones", error)
            }
          }
        }}
      />
    </div>
  )
}
