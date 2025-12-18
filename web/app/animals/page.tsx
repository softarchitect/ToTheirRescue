"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Checkbox } from "@/components/ui/checkbox"
import type { Animal, AnimalStatus } from "@/lib/types"
import { fetchAnimals, fetchAnimalMedia } from "@/lib/api"
import { Search, Plus, Grid3x3, List, LayoutGrid, ChevronLeft, ChevronRight, ArrowUpDown, Trash2, ChevronDown, HeartPulse } from 'lucide-react'
import Image from "next/image"
import { AnimalDialog } from "@/components/animal-dialog"
import { EditAnimalDialog } from "@/components/edit-animal-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomAlertDialog } from "@/components/custom-alert-dialog"
import { AnimalSelectionConfirmDialog } from "@/components/animal-selection-confirm-dialog"
import { DeleteAnimalDialog } from "@/components/delete-animal-dialog"
import { MilestoneDialog } from "@/components/milestone-dialog"
import { VaccinationDialog } from "@/components/vaccination-dialog"
import { ProcedureDialog } from "@/components/procedure-dialog"
import { MedDialog } from "@/components/med-dialog"
import { SOAPDialog } from "@/components/soap-dialog"
import { DietDialog } from "@/components/diet-dialog"
import { HealthNoteDialog } from "@/components/health-note-dialog"
import { ReminderDialog } from "@/components/reminder-dialog"
import { DiaryDialog } from "@/components/diary-dialog"
import { BehaviorsDialog } from "@/components/behaviors-dialog"
import { upsertAnimalBehaviors, updateAnimalLocation, deleteAnimal } from "@/lib/api"
import { LocationDialog } from "@/components/location-dialog"
import { useToast } from "@/hooks/use-toast"
import { getUserRole } from "@/lib/auth-utils"

type ViewMode = "tiles" | "list" | "details"
type SortField = "name" | "age" | "breed" | "gender" | "arrivalDate" | "status" | "lastMilestone" | "lastMilestoneDate"
type ResidentFilter = "current" | "former"

export default function AnimalsPage() {
  const { toast } = useToast()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<AnimalStatus | "all">("all")
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<{ type: string; route: string } | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [animalToDelete, setAnimalToDelete] = useState<Animal | null>(null)
  const [showMilestoneDialog, setShowMilestoneDialog] = useState(false)
  const [showVaccinationDialog, setShowVaccinationDialog] = useState(false)
  const [showProcedureDialog, setShowProcedureDialog] = useState(false)
  const [showMedDialog, setShowMedDialog] = useState(false)
  const [showSOAPDialog, setShowSOAPDialog] = useState(false)
  const [showDietDialog, setShowDietDialog] = useState(false)
  const [showHealthNoteDialog, setShowHealthNoteDialog] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [showDiaryDialog, setShowDiaryDialog] = useState(false)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const [showBehaviorsDialog, setShowBehaviorsDialog] = useState(false)
  const [behaviorsState, setBehaviorsState] = useState<
    Array<{ name: string; enabled: boolean; comment: string; note: string }>
  >([
    { name: "Aggressive", enabled: false, comment: "", note: "" },
    { name: "Introvert", enabled: false, comment: "", note: "" },
    { name: "Shy", enabled: false, comment: "", note: "" },
    { name: "Friendly", enabled: false, comment: "", note: "" },
    { name: "Playful", enabled: false, comment: "", note: "" },
    { name: "Calm", enabled: false, comment: "", note: "" },
  ])
  const [newBehaviorName, setNewBehaviorName] = useState("")
  const [addBehaviorError, setAddBehaviorError] = useState<string>("")
  const [isSavingBehaviors, setIsSavingBehaviors] = useState(false)

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(9)
  const [sortField, setSortField] = useState<SortField>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [residentFilter, setResidentFilter] = useState<ResidentFilter>("current")

  const [hoveredAnimalId, setHoveredAnimalId] = useState<string | null>(null)
  const [showPhoto, setShowPhoto] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const photoTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const apiAnimals = await fetchAnimals({ isAvailable: true, page: 1, limit: 200 })
        setAnimals(apiAnimals)
      } catch (error) {
        console.error("Failed to load animals from API", error)
        setAnimals([])
      }
    }

    loadAnimals()
  }, [])

  useEffect(() => {
    const storedSelections = sessionStorage.getItem("selectedAnimalIds")
    if (storedSelections) {
      try {
        const ids = JSON.parse(storedSelections)
        setSelectedIds(new Set(ids))
      } catch (error) {
        console.error("Failed to restore selections:", error)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedIds.size > 0) {
      sessionStorage.setItem("selectedAnimalIds", JSON.stringify(Array.from(selectedIds)))
    } else {
      sessionStorage.removeItem("selectedAnimalIds")
    }
  }, [selectedIds])

  const previewAnimal = useMemo(() => {
    if (hoveredAnimalId) {
      return animals.find((a) => a.id === hoveredAnimalId)
    }
    if (selectedIds.size === 1) {
      const selectedId = Array.from(selectedIds)[0]
      return animals.find((a) => a.id === selectedId)
    }
    return null
  }, [hoveredAnimalId, selectedIds, animals])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Lazily load a primary photo for the currently previewed animal (hovered or single-selected)
  useEffect(() => {
    const loadPreviewPhoto = async () => {
      if (!previewAnimal) return
      if (previewAnimal.imageUrl && !previewAnimal.imageUrl.includes("/placeholder.svg")) {
        return
      }

      try {
        const media = await fetchAnimalMedia(previewAnimal.id)
        if (!media.length) return
        const sorted = [...media].sort((a, b) => (b.rank || 0) - (a.rank || 0))
        const primary = sorted.find((m) => m.type === "photo") ?? sorted[0]
        if (!primary?.url) return

        setAnimals((prev) =>
          prev.map((a) =>
            a.id === previewAnimal.id ? { ...a, imageUrl: primary.url } : a,
          ),
        )
      } catch (err) {
        console.error("Failed to load preview photo for animal", err)
      }
    }

    loadPreviewPhoto()
    // Only re-run when the specific previewed animal changes
  }, [previewAnimal?.id])

  useEffect(() => {
    const shouldShowPhoto =
      (hoveredAnimalId || selectedIds.size > 0) &&
      previewAnimal?.imageUrl &&
      !previewAnimal.imageUrl.includes("/placeholder.svg")

    if (shouldShowPhoto) {
      setShowPhoto(true)

      if (photoTimeoutRef.current) {
        clearTimeout(photoTimeoutRef.current)
      }

      photoTimeoutRef.current = setTimeout(() => {
        setShowPhoto(false)
      }, 1000)
    } else {
      setShowPhoto(false)
      if (photoTimeoutRef.current) {
        clearTimeout(photoTimeoutRef.current)
      }
    }

    return () => {
      if (photoTimeoutRef.current) {
        clearTimeout(photoTimeoutRef.current)
      }
    }
  }, [hoveredAnimalId, selectedIds, previewAnimal])

  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || animal.status === filterStatus
    const matchesResident =
      residentFilter === "current"
        ? animal.status !== "adopted" && animal.status !== "released"
        : animal.status === "adopted" || animal.status === "released"

    return matchesSearch && matchesFilter && matchesResident
  })

  const sortedAnimals = useMemo(() => {
    const sorted = [...filteredAnimals].sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "age":
          comparison = a.age - b.age
          break
        case "breed":
          comparison = a.breed.localeCompare(b.breed)
          break
        case "gender":
          comparison = a.gender.localeCompare(b.gender)
          break
        case "arrivalDate":
          comparison = new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
          break
        case "status":
          comparison = a.status!.localeCompare(b.status!)
          break
        case "lastMilestone":
          comparison = (a.lastMilestone || "").localeCompare(b.lastMilestone || "")
          break
        case "lastMilestoneDate":
          const dateA = a.lastMilestoneDate ? new Date(a.lastMilestoneDate).getTime() : 0
          const dateB = b.lastMilestoneDate ? new Date(b.lastMilestoneDate).getTime() : 0
          comparison = dateA - dateB
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return sorted
  }, [filteredAnimals, sortField, sortDirection])

  const totalPages = Math.ceil(sortedAnimals.length / itemsPerPage)
  const paginatedAnimals = sortedAnimals.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const statusColors: Record<AnimalStatus, string> = {
    available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    adopted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    fostered: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    medical: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    released: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
    quarantine: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  const handleAddAnimal = () => {
    setSelectedAnimal(null)
    setIsAddDialogOpen(true)
  }

  const handleEditAnimal = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsEditDialogOpen(true)
  }

  const handleSelectAnimal = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedAnimals.length && paginatedAnimals.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedAnimals.map((a) => a.id)))
    }
  }

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleRemoveAnimal = (id: string) => {
    const animal = animals.find(a => a.id === id)
    setAnimalToDelete(animal || null)
    setDeleteConfirmOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!animalToDelete) return

    try {
      await deleteAnimal(animalToDelete.id)
      // Remove from local state
      setAnimals(animals.filter((a) => a.id !== animalToDelete.id))
      selectedIds.delete(animalToDelete.id)
      setSelectedIds(new Set(selectedIds))
      setDeleteConfirmOpen(false)
      setAnimalToDelete(null)

      // Show success notification
      toast({
        title: "Success",
        description: `Animal "${animalToDelete.name}" deleted successfully`,
        variant: "success",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete animal"
      setDeleteConfirmOpen(false)
      setAnimalToDelete(null)

      // Show error notification
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }


  const handleActionClick = (action: string) => {
    if (selectedIds.size === 0) {
      setAlertMessage("Please select at least one animal first")
      setAlertOpen(true)
      return
    }

    // Restricted actions for single animal only
    if ((action === "Health History" || action === "Photos") && selectedIds.size > 1) {
      setAlertMessage("Please select only one animal")
      setAlertOpen(true)
      return
    }

    if (action === "Behaviors" && selectedIds.size > 1) {
      const selected = animals.filter((a) => selectedIds.has(a.id))
      const animalTypes = selected.map((a) => a.type)
      const uniqueTypes = new Set(animalTypes)

      if (uniqueTypes.size > 1) {
        setAlertMessage(
          "Please select animals of the same type for Behaviors. All selected animals must be dogs, cats, birds, etc."
        )
        setAlertOpen(true)
        return
      }
    }

    if (action === "Milestones" && selectedIds.size > 1) {
      const selected = animals.filter((a) => selectedIds.has(a.id))

      // Check if all animals have the same last milestone
      const lastMilestones = selected.map((a) => a.lastMilestone || "none")
      const uniqueMilestones = new Set(lastMilestones)

      if (uniqueMilestones.size > 1) {
        setAlertMessage("Selected animals have different last milestones. Please select animals with the same last milestone.")
        setAlertOpen(true)
        return
      }
    }

    const selected = animals.filter((a) => selectedIds.has(a.id))

    // For Behaviors, always open the inline dialog instead of navigating
    if (action === "Behaviors") {
      sessionStorage.setItem("selectedAnimals", JSON.stringify(selected))
      setShowBehaviorsDialog(true)
      return
    }

    sessionStorage.setItem("selectedAnimals", JSON.stringify(selected))

    if (action === "Behaviors" && selectedIds.size > 1) {
      setShowBehaviorsDialog(true)
      return
    }

    if (selectedIds.size > 1 && action === "Milestones") {
      setShowMilestoneDialog(true)
      return
    }

    if (selectedIds.size > 1 && action === "Diary") {
      setShowDiaryDialog(true)
      return
    }

    // For New Location, always open the inline dialog on the Animals page
    if (action === "Location") {
      setShowLocationDialog(true)
      return
    }

    const actionRoutes: Record<string, string> = {
      Milestones: "/animals/milestones",
      Photos: "/animals/media",
      "Gallery View": "/animals/gallery",
      Diary: "/animals/diary",
      "Animal Report": "/animals/report",
    }

    const route = actionRoutes[action]
    if (!route) return

    // If single animal, go directly to page
    if (selectedIds.size === 1) {
      window.location.href = route
    } else {
      // Multiple animals - show confirmation dialog
      setPendingAction({ type: action, route })
      setConfirmDialogOpen(true)
    }
  }

  const handleHealthClick = (action: string) => {
    if (selectedIds.size === 0) {
      setAlertMessage("Please select at least one animal first")
      setAlertOpen(true)
      return
    }

    if (action === "Health History" && selectedIds.size > 1) {
      setAlertMessage("Health History can only be viewed for one animal at a time. Please select a single animal.")
      setAlertOpen(true)
      return
    }

    if (action !== "Animal Health Report" && selectedIds.size > 1) {
      const selected = animals.filter((a) => selectedIds.has(a.id))
      const animalTypes = selected.map((a) => a.type)
      const uniqueTypes = new Set(animalTypes)

      if (uniqueTypes.size > 1) {
        setAlertMessage("Please select animals of the same type for Health options. All selected animals must be dogs, cats, birds, etc.")
        setAlertOpen(true)
        return
      }
    }

    const selected = animals.filter((a) => selectedIds.has(a.id))

    const healthRoutes: Record<string, string> = {
      Vaccinations: "/animals/vaccinations",
      Procedures: "/animals/procedures",
      "Set Reminders": "/animals/reminders",
      Meds: "/animals/meds",
      SOAPs: "/animals/soaps",
      "Health Notes": "/animals/health-notes",
      "Health History": "/animals/health-history",
      "Animal Health Report": "/animals/health-report",
    }

    const route = healthRoutes[action]
    if (!route && action !== "Diet") return

    sessionStorage.setItem("selectedAnimals", JSON.stringify(selected))

    // For Diet, always open the dialog instead of navigating
    if (action === "Diet") {
      setShowDietDialog(true)
      return
    }

    if (selectedIds.size > 1) {
      if (action === "Vaccinations") {
        setShowVaccinationDialog(true)
        return
      } else if (action === "Procedures") {
        setShowProcedureDialog(true)
        return
      } else if (action === "Set Reminders") {
        setShowReminderDialog(true)
        return
      } else if (action === "Meds") {
        setShowMedDialog(true)
        return
      } else if (action === "SOAPs") {
        setShowSOAPDialog(true)
        return
      } else if (action === "Health Notes") {
        setShowHealthNoteDialog(true)
        return
      }
    }

    // Navigate to page for single animal or for Health History/Animal Health Report
    window.location.href = route
  }

  const handleConfirmSelection = () => {
    if (pendingAction) {
      if (pendingAction.type === "Milestones") {
        // Show the milestone dialog instead of navigating
        setConfirmDialogOpen(false)
        setShowMilestoneDialog(true)
      } else {
        window.location.href = pendingAction.route
        setConfirmDialogOpen(false)
      }
      setPendingAction(null)
    }
  }

  const selectedAnimals = useMemo(() => {
    return animals.filter((a) => selectedIds.has(a.id))
  }, [animals, selectedIds])

  const handleCancelConfirmation = () => {
    setConfirmDialogOpen(false)
    setPendingAction(null)
  }

  const handleCloseVaccinationDialog = () => {
    setShowVaccinationDialog(false)
  }

  const handleCloseProcedureDialog = () => {
    setShowProcedureDialog(false)
  }

  const handleCloseMedDialog = () => {
    setShowMedDialog(false)
  }

  const handleCloseSOAPDialog = () => {
    setShowSOAPDialog(false)
  }

  const handleCloseDietDialog = () => {
    setShowDietDialog(false)
  }

  const handleCloseHealthNoteDialog = () => {
    setShowHealthNoteDialog(false)
  }

  const handleCloseReminderDialog = () => {
    setShowReminderDialog(false)
  }

  const handleCloseDiaryDialog = () => {
    setShowDiaryDialog(false)
  }

  const updateBehaviorInline = (
    index: number,
    field: "enabled" | "comment" | "note",
    value: boolean | string
  ) => {
    const updated = [...behaviorsState]
    updated[index] = { ...updated[index], [field]: value }
    setBehaviorsState(updated)
  }

  const addBehaviorInline = () => {
    const name = newBehaviorName.trim()
    if (!name) {
      setAddBehaviorError("Enter a behavior name")
      return
    }
    const exists = behaviorsState.some((b) => b.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      setAddBehaviorError("That behavior already exists")
      return
    }
    setBehaviorsState([{ name, enabled: false, comment: "", note: "" }, ...behaviorsState])
    setNewBehaviorName("")
    setAddBehaviorError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight leading-tight flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              <Image
                src="/rabbit-logo.png"
                alt="Animal Management"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              Animal Management
            </h1>
          </div>

          <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
            <div className="flex gap-2">
              <Button
                variant={residentFilter === "current" ? "default" : "outline"}
                onClick={() => setResidentFilter("current")}
                size="sm"
                className={residentFilter === "current"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
              >
                Current Residents
              </Button>
              <Button
                variant={residentFilter === "former" ? "default" : "outline"}
                onClick={() => setResidentFilter("former")}
                size="sm"
                className={residentFilter === "former"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
              >
                Former Residents
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="relative min-w-[260px] max-w-md w-[320px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <FloatingInput
                  label="Search by name or breed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sort by:</span>
                <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="age">Age</SelectItem>
                    <SelectItem value="breed">Breed</SelectItem>
                    <SelectItem value="gender">Gender</SelectItem>
                    <SelectItem value="arrivalDate">Intake Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="lastMilestone">Last Milestone</SelectItem>
                    <SelectItem value="lastMilestoneDate">Last Milestone Date</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown
                    className={`h-4 w-4 transition-transform ${sortDirection === "desc" ? "rotate-180" : ""}`}
                  />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">View:</span>
                <div className="flex gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "tiles" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "tiles" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
                    onClick={() => setViewMode("tiles")}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "list" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "details" ? "default" : "ghost"}
                    size="sm"
                    className={viewMode === "details" ? "bg-emerald-600 text-white hover:bg-emerald-700" : ""}
                    onClick={() => setViewMode("details")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
                    <DropdownMenuItem onClick={() => handleActionClick("Location")} className="text-sm">Location</DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => handleActionClick("Photos")} className="text-sm">
                        Photos, Videos, & Documents
                      </DropdownMenuItem>
                    )}
                    {/* <DropdownMenuItem
                      onClick={handleBulkDelete}
                      className="text-sm text-destructive hover:text-destructive"
                    >
                      Delete Selected
                    </DropdownMenuItem> */}
                    {/* <DropdownMenuItem onClick={() => handleActionClick("Gallery View")} className="text-sm">Gallery View</DropdownMenuItem> */}
                    <DropdownMenuItem onClick={() => handleActionClick("Diary")} className="text-sm">Diary</DropdownMenuItem>
                    {userRole !== "AnimalCaretaker" && (
                      <DropdownMenuItem onClick={() => handleActionClick("Animal Report")} className="text-sm">Animal Report</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {userRole !== "AnimalCaretaker" && userRole !== "Veterinarian" && (
                <Button onClick={handleAddAnimal} size="lg" className="gap-2 shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                  <Plus className="h-5 w-5" />
                  Add Animal
                </Button>
              )}
            </div>
          </div>
        </div>

        {viewMode === "tiles" && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300 max-h-[calc(100vh-400px)] overflow-y-auto">
            {paginatedAnimals.map((animal, index) => (
              <div
                key={animal.id}
                className="animate-in fade-in zoom-in-95 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden border-border/40 hover:shadow-xl transition-all group backdrop-blur-sm bg-white/80">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-white/90 backdrop-blur-sm rounded p-1">
                        <Checkbox
                          checked={selectedIds.has(animal.id)}
                          onCheckedChange={() => handleSelectAnimal(animal.id)}
                        />
                      </div>
                    </div>
                    <Image
                      src={animal.imageUrl || "/placeholder.svg"}
                      alt={animal.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                      onClick={() => handleEditAnimal(animal)}
                    />
                    {animal.isWildlife && (
                      <div className="absolute bottom-3 left-3">
                        <Badge variant="secondary">Wildlife</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 cursor-pointer" onClick={() => handleEditAnimal(animal)}>
                    <h3
                      className="text-xl font-bold mb-2"
                      onMouseEnter={() => setHoveredAnimalId(animal.id)}
                      onMouseLeave={() => setHoveredAnimalId(null)}
                    >
                      {animal.name}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        <span className="font-medium text-foreground">Breed:</span> {animal.breed}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Age:</span> {animal.age} years
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Gender:</span> {animal.gender}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">Intake:</span>{" "}
                        {new Date(animal.arrivalDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                      </p>
                    </div>
                    <p className="mt-3 text-sm line-clamp-2">{animal.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-3 animate-in fade-in duration-300 max-h-[calc(100vh-400px)] overflow-y-auto">
            {paginatedAnimals.map((animal, index) => (
              <div
                key={animal.id}
                className="animate-in fade-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Card className="border-border/40 hover:shadow-lg transition-all backdrop-blur-sm bg-white/80">
                  <CardContent
                    className="p-2.5 cursor-pointer"
                    onClick={() => handleSelectAnimal(animal.id)}
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedIds.has(animal.id)}
                        onCheckedChange={() => handleSelectAnimal(animal.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                        <div>
                          <p
                            className="font-bold text-lg cursor-pointer hover:text-primary"
                            onMouseEnter={() => setHoveredAnimalId(animal.id)}
                            onMouseLeave={() => setHoveredAnimalId(null)}
                          >
                            {animal.name}
                          </p>
                          {animal.isWildlife && (
                            <Badge variant="secondary" className="text-xs mt-1">
                              Wildlife
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground capitalize">{animal.type}</p>
                          <p>{animal.breed}</p>
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground">Age</p>
                          <p>{animal.ageYears} Yrs | {animal.ageMonths} Mos</p>
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground">Gender</p>
                          <p className="capitalize">{animal.gender}</p>
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground">Last Milestone</p>
                          <p>{animal.lastMilestone || "-"}</p>
                        </div>
                        <div className="text-xs">
                          <p className="font-medium text-muted-foreground">Last Milestone Date</p>
                          <p>
                            {animal.lastMilestoneDate ? new Date(animal.lastMilestoneDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditAnimal(animal)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveAnimal(animal.id)
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {viewMode === "details" && (
          <div className="grid gap-4 md:grid-cols-2 animate-in fade-in duration-300 max-h-[calc(100vh-400px)] overflow-y-auto">
            {paginatedAnimals.map((animal, index) => (
              <div
                key={animal.id}
                className="animate-in fade-in zoom-in-95 duration-300"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <Card className="border-border/40 hover:shadow-xl transition-all backdrop-blur-sm bg-white/80">
                  <CardContent
                    className="p-4 min-h-32 cursor-pointer"
                    onClick={() => handleSelectAnimal(animal.id)}
                  >
                    <div className="flex gap-4">
                      <Checkbox
                        checked={selectedIds.has(animal.id)}
                        onCheckedChange={() => handleSelectAnimal(animal.id)}
                        className="mt-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-2xl font-bold cursor-pointer hover:text-primary"
                              onMouseEnter={() => setHoveredAnimalId(animal.id)}
                              onMouseLeave={() => setHoveredAnimalId(null)}
                            >
                              {animal.name}
                            </h3>
                            {animal.isWildlife && (
                              <Badge variant="secondary" className="text-xs">
                                Wildlife
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-3">
                          <div>
                            <p className="font-medium text-muted-foreground">Type</p>
                            <p className="capitalize">{animal.type}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Breed</p>
                            <p>{animal.breed}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Age</p>
                            <p>{animal.age} years</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Gender</p>
                            <p className="capitalize">{animal.gender}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Intake Date</p>
                            <p>{new Date(animal.arrivalDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Status</p>
                            <p className="capitalize">{animal.status}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Last Milestone</p>
                            <p>{animal.lastMilestone || "-"}</p>
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground">Last Milestone Date</p>
                            <p>
                              {animal.lastMilestoneDate
                                ? new Date(animal.lastMilestoneDate).toLocaleDateString('en-US', { timeZone: 'UTC' })
                                : "-"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{animal.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditAnimal(animal)
                          }}
                          className="w-full"
                        >
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {sortedAnimals.length > 0 && (
          <div className="mt-8 flex items-center justify-between animate-in fade-in duration-300">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedIds.size === paginatedAnimals.length && paginatedAnimals.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, sortedAnimals.length)} of {sortedAnimals.length} animals
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {sortedAnimals.length === 0 && (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <Image
              src="/rabbit-logo.png"
              alt="No animals found"
              width={64}
              height={64}
              className="h-16 w-16 mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold mb-2">No animals found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {showPhoto && previewAnimal && (
        <div className="fixed bottom-8 right-8 z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <Card className="overflow-hidden shadow-2xl border-2 border-primary/20 backdrop-blur-sm bg-white/95">
            <div className="relative w-48 h-48">
              <Image
                src={previewAnimal.imageUrl || "/placeholder.svg"}
                alt={previewAnimal.name}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h3 className="text-white text-lg font-bold">{previewAnimal.name}</h3>
                <p className="text-white/90 text-xs">{previewAnimal.breed}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      <AnimalDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={(newAnimals) => {
          setAnimals([...animals, ...newAnimals])
          setIsAddDialogOpen(false)
        }}
      />
      {
        selectedAnimal && (
          <EditAnimalDialog
            animal={selectedAnimal}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={(animal) => {
              setAnimals(animals.map((a) => (a.id === animal.id ? animal : a)))
              setIsEditDialogOpen(false)
            }}
          />
        )
      }

      <AnimalSelectionConfirmDialog
        animals={selectedAnimals}
        open={confirmDialogOpen}
        onOpenChange={handleCancelConfirmation}
        onConfirm={handleConfirmSelection}
      />

      <DeleteAnimalDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        animal={animalToDelete}
        onConfirm={handleConfirmDelete}
      />

      <MilestoneDialog
        animals={selectedAnimals}
        open={showMilestoneDialog}
        onOpenChange={setShowMilestoneDialog}
      />

      <VaccinationDialog
        animals={selectedAnimals}
        open={showVaccinationDialog}
        onOpenChange={setShowVaccinationDialog}
      />

      <ProcedureDialog
        animals={selectedAnimals}
        open={showProcedureDialog}
        onOpenChange={setShowProcedureDialog}
      />

      <MedDialog
        animals={selectedAnimals}
        open={showMedDialog}
        onOpenChange={setShowMedDialog}
      />

      <SOAPDialog
        animals={selectedAnimals}
        open={showSOAPDialog}
        onOpenChange={setShowSOAPDialog}
        onSaved={undefined}
      />

      <DietDialog
        animals={selectedAnimals}
        open={showDietDialog}
        onOpenChange={setShowDietDialog}
        onSaved={undefined}
      />

      <HealthNoteDialog
        animals={selectedAnimals}
        open={showHealthNoteDialog}
        onOpenChange={setShowHealthNoteDialog}
        onSaved={undefined}
      />

      <ReminderDialog
        animals={selectedAnimals}
        open={showReminderDialog}
        onOpenChange={setShowReminderDialog}
      />

      <DiaryDialog animals={selectedAnimals} open={showDiaryDialog} onOpenChange={handleCloseDiaryDialog} />

      <CustomAlertDialog open={alertOpen} onOpenChange={setAlertOpen} message={alertMessage} />

      <BehaviorsDialog
        open={showBehaviorsDialog}
        onOpenChange={setShowBehaviorsDialog}
        selectedAnimals={selectedAnimals}
        behaviors={behaviorsState}
        newBehaviorName={newBehaviorName}
        addBehaviorError={addBehaviorError}
        onNewBehaviorNameChange={setNewBehaviorName}
        onAddBehavior={addBehaviorInline}
        onUpdateBehavior={updateBehaviorInline}
        onCancel={() => setShowBehaviorsDialog(false)}
        onSave={async () => {
          if (selectedIds.size === 0) {
            setShowBehaviorsDialog(false)
            return
          }
          try {
            setIsSavingBehaviors(true)
            await upsertAnimalBehaviors({
              animalIds: Array.from(selectedIds),
              behaviors: behaviorsState.map((b) => ({
                name: b.name,
                yesOrNo: b.enabled,
                notes: b.comment,
              })),
            })
            setShowBehaviorsDialog(false)
          } catch (error) {
            console.error("Failed to save behaviors", error)
            setAlertMessage("Failed to save behaviors. Please try again.")
            setAlertOpen(true)
          } finally {
            setIsSavingBehaviors(false)
          }
        }}
      />

      <LocationDialog
        animals={selectedIds.size > 0 ? animals.filter((a) => selectedIds.has(a.id)) : []}
        open={showLocationDialog}
        onOpenChange={setShowLocationDialog}
        onSave={async (location, animalsToUpdate) => {
          const ids =
            animalsToUpdate && animalsToUpdate.length > 0
              ? animalsToUpdate.map((a) => a.id)
              : Array.from(selectedIds)
          if (!ids.length) {
            setShowLocationDialog(false)
            return
          }

          try {
            setIsSavingLocation(true)
            await updateAnimalLocation({ animalIds: ids, location })
            // Update local state so UI reflects the new location
            setAnimals((prev) =>
              prev.map((a) =>
                ids.includes(a.id) ? { ...a, location } : a,
              ),
            )
            setShowLocationDialog(false)
          } catch (error) {
            console.error("Failed to update location", error)
            setAlertMessage("Failed to update location. Please try again.")
            setAlertOpen(true)
          } finally {
            setIsSavingLocation(false)
          }
        }}
      />
    </div>
  )
}
