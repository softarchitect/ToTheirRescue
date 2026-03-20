"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { ChronicConditionDialog } from "@/components/chronic-condition-dialog"
import { upsertAnimalBehaviors, updateAnimalLocation, deleteAnimal, fetchAnimalBehaviors, fetchAnimalBehaviorSelections } from "@/lib/api"
import { LocationDialog } from "@/components/location-dialog"
import { AnimalListCard } from "@/components/animal-list-card"
import { useToast } from "@/hooks/use-toast"
import { getUserRole } from "@/lib/auth-utils"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"

type ViewMode = "tiles" | "list" | "details"
type SortField =
  | "name"
  | "age"
  | "breed"
  | "gender"
  | "arrivalDate"
  | "status"
  | "location"
  | "lastMilestone"
  | "lastMilestoneDate"
type ResidentFilter = "current" | "former"

const SESSION_SELECTED_ANIMAL_IDS_KEY = "selectedAnimalIds"
const SESSION_RESTORE_ANIMAL_SELECTION_KEY = "restoreAnimalSelection"
const SESSION_RESTORE_RESIDENT_FILTER_KEY = "restoreResidentFilter"

export default function AnimalsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [animals, setAnimals] = useState<Animal[]>([])
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true)
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
  const [showChronicConditionDialog, setShowChronicConditionDialog] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [showDiaryDialog, setShowDiaryDialog] = useState(false)
  const [showLocationDialog, setShowLocationDialog] = useState(false)
  const [isSavingLocation, setIsSavingLocation] = useState(false)
  const [showBehaviorsDialog, setShowBehaviorsDialog] = useState(false)
  const [behaviorsState, setBehaviorsState] = useState<
    Array<{ name: string; enabled: boolean; comment: string; note: string; historical?: boolean }>
  >([])
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

  const [previewAnimalId, setPreviewAnimalId] = useState<string | null>(null)
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
  const [previewImageLoading, setPreviewImageLoading] = useState(false)
  const [showPhoto, setShowPhoto] = useState(false)
  const photoTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const [pendingScrollToIds, setPendingScrollToIds] = useState<string[] | null>(null)

  // Restore selection only when returning from an Animals action page.
  useEffect(() => {
    if (typeof window === "undefined") return

    const shouldRestore = window.sessionStorage.getItem(SESSION_RESTORE_ANIMAL_SELECTION_KEY) === "1"
    if (!shouldRestore) return

    window.sessionStorage.removeItem(SESSION_RESTORE_ANIMAL_SELECTION_KEY)

    const storedFilter = window.sessionStorage.getItem(SESSION_RESTORE_RESIDENT_FILTER_KEY) as ResidentFilter | null
    if (storedFilter === "current" || storedFilter === "former") {
      setResidentFilter(storedFilter)
    }

    const raw = window.sessionStorage.getItem(SESSION_SELECTED_ANIMAL_IDS_KEY)
    if (!raw) return

    try {
      const ids = JSON.parse(raw) as unknown
      if (Array.isArray(ids)) {
        const normalized = ids.map((v) => String(v)).filter(Boolean)
        setSelectedIds(new Set(normalized))
        // Also scroll the selected animal(s) to the top after returning.
        setPendingScrollToIds(normalized)
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  // If redirected from onboarding, auto-open Add Animal dialog once.
  useEffect(() => {
    if (!userRole) return

    const shouldOpen = searchParams.get("addAnimal") === "1"
    const canAddAnimal = userRole !== "AnimalCaretaker" && userRole !== "Veterinarian"

    if (!shouldOpen || !canAddAnimal) return

    setSelectedAnimal(null)
    setIsAddDialogOpen(true)

    // Clean URL so refresh doesn't reopen the dialog.
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete("addAnimal")
    const qs = nextParams.toString()
    router.replace(qs ? `/animals?${qs}` : "/animals")
  }, [router, searchParams, userRole])

  useEffect(() => {
    const loadAnimals = async () => {
      const loadStart = Date.now()
      setIsLoadingAnimals(true)
      try {
        const apiAnimals = await fetchAnimals({ isAvailable: true, page: 1, limit: 200 })
        setAnimals(apiAnimals)
      } catch (error) {
        console.error("Failed to load animals from API", error)
        setAnimals([])
      } finally {
        // Keep the loader visible briefly to prevent a "No animals found" flash.
        const elapsed = Date.now() - loadStart
        const minLoaderMs = 500
        if (elapsed < minLoaderMs) {
          await new Promise((resolve) => setTimeout(resolve, minLoaderMs - elapsed))
        }
        setIsLoadingAnimals(false)
      }
    }

    loadAnimals()
  }, [])

  // useEffect(() => {
  //   const storedSelections = sessionStorage.getItem("selectedAnimalIds")
  //   if (storedSelections) {
  //     try {
  //       const ids = JSON.parse(storedSelections)
  //       setSelectedIds(new Set(ids))
  //     } catch (error) {
  //       console.error("Failed to restore selections:", error)
  //     }
  //   }
  // }, [])

  // useEffect(() => {
  //   if (selectedIds.size > 0) {
  //     sessionStorage.setItem("selectedAnimalIds", JSON.stringify(Array.from(selectedIds)))
  //   } else {
  //     sessionStorage.removeItem("selectedAnimalIds")
  //   }
  // }, [selectedIds])

  // Load a primary photo URL for the currently previewed animal (checkbox-triggered)
  useEffect(() => {
    let cancelled = false

    const loadPreviewPhoto = async () => {
      if (!previewAnimalId) {
        setPreviewImageLoading(false)
        setPreviewImageUrl(null)
        setShowPhoto(false)
        return
      }

      setPreviewImageLoading(true)
      setPreviewImageUrl(null)
      setShowPhoto(false)

      try {
        const media = await fetchAnimalMedia(previewAnimalId)
        if (cancelled) return

        const photos = media.filter((m) => m.type === "photo" && !!m.url)
        const sorted = [...photos].sort((a, b) => (b.rank || 0) - (a.rank || 0))
        const primary = sorted[0]
        setPreviewImageUrl(primary?.url ?? null)
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load preview photo for animal", err)
          setPreviewImageUrl(null)
        }
      } finally {
        if (!cancelled) setPreviewImageLoading(false)
      }
    }

    loadPreviewPhoto()
    return () => {
      cancelled = true
    }
  }, [previewAnimalId])

  // Show the photo for 1.5 seconds after the URL is available, then hide it.
  useEffect(() => {
    if (!previewAnimalId || !previewImageUrl) return

    setShowPhoto(true)

    if (photoTimeoutRef.current) {
      clearTimeout(photoTimeoutRef.current)
    }

    photoTimeoutRef.current = setTimeout(() => {
      setShowPhoto(false)
      setPreviewAnimalId(null)
      setPreviewImageUrl(null)
      setPreviewImageLoading(false)
    }, 1500)

    return () => {
      if (photoTimeoutRef.current) {
        clearTimeout(photoTimeoutRef.current)
      }
    }
  }, [previewAnimalId, previewImageUrl])

  const filteredAnimals = useMemo(() => {
    return animals.filter((animal) => {
      const matchesSearch =
        animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === "all" || animal.status === filterStatus
      const matchesResident =
        residentFilter === "current"
          ? (animal.lastMilestone === "Intake"
            || animal.lastMilestone === "Adoption Return"
            || animal.lastMilestone === "Found"
            || animal.lastMilestone === "Foster"
            || animal.lastMilestone === "Foster Return"
            || animal.lastMilestone === "Reintake")
          : (animal.lastMilestone === "Adoption"
            || animal.lastMilestone === "Lost"
            || animal.lastMilestone === "Released"
            || animal.lastMilestone === "Death"
            || animal.lastMilestone === "Returned to Owner"
            || animal.lastMilestone === "Transfer")

      return matchesSearch && matchesFilter && matchesResident
    })
  }, [animals, searchQuery, filterStatus, residentFilter])

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
        case "location":
          comparison = (a.location || "").localeCompare(b.location || "")
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

  // Whenever we return to Animals with a selected animal, ensure it is visible and
  // scrolled to the top of the list.
  useEffect(() => {
    if (!pendingScrollToIds?.length) return

    const targetId = pendingScrollToIds[0]
    const targetIndex = sortedAnimals.findIndex((a) => String(a.id) === String(targetId))

    // If the target isn't in the current filtered/sorted list, stop trying.
    if (targetIndex < 0) {
      setPendingScrollToIds(null)
      return
    }

    const desiredPage = Math.floor(targetIndex / itemsPerPage) + 1
    if (desiredPage !== currentPage) {
      setCurrentPage(desiredPage)
      return
    }

    requestAnimationFrame(() => {
      const el = document.getElementById(`animal-row-${targetId}`)
      el?.scrollIntoView({ behavior: "smooth", block: "start" })
    })

    setPendingScrollToIds(null)
  }, [currentPage, itemsPerPage, pendingScrollToIds, sortedAnimals])

  // const statusColors: Record<AnimalStatus, string> = {
  //   available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  //   adopted: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  //   fostered: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  //   medical: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  //   released: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  //   quarantine: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  // }

  const handleAddAnimal = () => {
    setSelectedAnimal(null)
    setIsAddDialogOpen(true)
  }

  const persistSelectionForReturn = () => {
    if (typeof window === "undefined") return
    window.sessionStorage.setItem(SESSION_SELECTED_ANIMAL_IDS_KEY, JSON.stringify(Array.from(selectedIds)))
    window.sessionStorage.setItem(SESSION_RESTORE_RESIDENT_FILTER_KEY, residentFilter)
    window.sessionStorage.setItem(SESSION_RESTORE_ANIMAL_SELECTION_KEY, "1")
  }

  const changeResidentFilter = (next: ResidentFilter) => {
    // Clicking either filter button should clear selection.
    setSelectedIds(new Set())
    setPreviewAnimalId(null)
    setPreviewImageUrl(null)
    setPreviewImageLoading(false)
    setShowPhoto(false)

    // Also clear any stored selection so it won't reappear later.
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(SESSION_SELECTED_ANIMAL_IDS_KEY)
      window.sessionStorage.removeItem(SESSION_RESTORE_ANIMAL_SELECTION_KEY)
      window.sessionStorage.removeItem(SESSION_RESTORE_RESIDENT_FILTER_KEY)
    }

    if (next === residentFilter) return
    setResidentFilter(next)
  }

  const handleEditAnimal = (animal: Animal) => {
    setSelectedAnimal(animal)
    setIsEditDialogOpen(true)
  }

  const handleSelectAnimal = (id: string, options?: { preview?: boolean }) => {
    // Only show the photo preview when the animal is being selected,
    // not when it is being deselected.
    const wasSelected = selectedIds.has(id)
    if (options?.preview && !wasSelected) {
      setPreviewAnimalId(id)
    }
    if (!wasSelected && searchQuery) {
      setSearchQuery("")
    }

    setSelectedIds((prev) => {
      const newSelected = new Set(prev)
      const wasSelected = newSelected.has(id)

      if (wasSelected) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }

      return newSelected
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedAnimals.length && paginatedAnimals.length > 0) {
      setSelectedIds(new Set())
      setPreviewAnimalId(null)
      setPreviewImageUrl(null)
      setPreviewImageLoading(false)
      setShowPhoto(false)
    } else {
      const ids = new Set(paginatedAnimals.map((a) => a.id))
      setSelectedIds(ids)
      if (searchQuery) setSearchQuery("")
      // Selecting all doesn't trigger a preview automatically.
      setPreviewAnimalId(null)
      setPreviewImageUrl(null)
      setPreviewImageLoading(false)
      setShowPhoto(false)
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
      setPreviewAnimalId((prevPreview) => (prevPreview === animalToDelete.id ? null : prevPreview))
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
      "Publicity Bio": "/animals/report",
    }

    const route = actionRoutes[action]
    if (!route) return

    // If single animal, go directly to page
    if (selectedIds.size === 1) {
      persistSelectionForReturn()
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

    if (action === "Chronic Condition") {
      setShowChronicConditionDialog(true)
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
    persistSelectionForReturn()
    window.location.href = route
  }

  const handleConfirmSelection = () => {
    if (pendingAction) {
      if (pendingAction.type === "Milestones") {
        // Show the milestone dialog instead of navigating
        setConfirmDialogOpen(false)
        setShowMilestoneDialog(true)
      } else {
        persistSelectionForReturn()
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
    setBehaviorsState([{ name, enabled: false, comment: "", note: "", historical: false }, ...behaviorsState])
    setNewBehaviorName("")
    setAddBehaviorError("")
  }

  useEffect(() => {
    const loadBehaviorDialogData = async () => {
      if (!showBehaviorsDialog || selectedIds.size === 0) return

      const selected = animals.filter((a) => selectedIds.has(a.id))
      const firstAnimal = selected[0]
      const animalTypeId = Number(firstAnimal?.animalTypeId || 0)
      const animalId = Number(firstAnimal?.id || 0)
      if (!animalTypeId || !animalId) return

      try {
        // Load behavior definitions from customization for this animal type.
        const behaviorDefinitions = await fetchAnimalBehaviors(animalTypeId)
        const normalizedDefinitions = behaviorDefinitions
          .map((item) => (item.behaviorName || item.kind || "").trim())
          .filter((name) => name.length > 0)

        // Load saved yes/no + notes from the animal.
        const savedSelections = await fetchAnimalBehaviorSelections(animalId)
        const savedByName = new Map(
          savedSelections.map((item) => [item.name.trim().toLowerCase(), item]),
        )

        const merged = normalizedDefinitions.map((name) => {
          const saved = savedByName.get(name.toLowerCase())
          return {
            name,
            enabled: saved ? Boolean(saved.yesOrNo) : false,
            comment: saved?.notes || "",
            note: "",
            historical: false,
          }
        })

        // Keep any historical saved behaviors visible even if they are not
        // currently in customization, so users can still see and edit them.
        for (const selection of savedSelections) {
          const selectionName = selection.name.trim()
          if (!selectionName) continue
          const exists = merged.some(
            (item) => item.name.toLowerCase() === selectionName.toLowerCase(),
          )
          if (!exists) {
            merged.push({
              name: selectionName,
              enabled: Boolean(selection.yesOrNo),
              comment: selection.notes || "",
              note: "",
              historical: true,
            })
          }
        }

        setBehaviorsState(merged)
      } catch (error) {
        console.error("Failed to load behavior dialog data", error)
      }
    }

    void loadBehaviorDialogData()
  }, [showBehaviorsDialog, selectedIds, animals])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-1 animate-in fade-in slide-in-from-top-4 duration-500">
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
                onClick={() => changeResidentFilter("current")}
                size="sm"
                className={residentFilter === "current"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  : "text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"}
              >
                Current Residents
              </Button>
              <Button
                variant={residentFilter === "former" ? "default" : "outline"}
                onClick={() => changeResidentFilter("former")}
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
                  <SelectItem value="location">Location</SelectItem>
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
                  <DropdownMenuItem onClick={() => handleHealthClick("Chronic Condition")} className="text-sm">
                    Chronic Condition
                  </DropdownMenuItem>
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
                      <DropdownMenuItem onClick={() => handleActionClick("Publicity Bio")} className="text-sm">Publicity Bio</DropdownMenuItem>
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
          <div
            ref={scrollContainerRef}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-300 max-h-[calc(100vh-400px)] overflow-y-auto"
          >
            {paginatedAnimals.map((animal, index) => (
              <div
                key={animal.id}
                id={`animal-row-${animal.id}`}
                className="animate-in fade-in zoom-in-95 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Card className="overflow-hidden border-border/40 hover:shadow-xl transition-all group backdrop-blur-sm bg-white/80">
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <div className="absolute top-3 left-3 z-10" onClick={(e) => e.stopPropagation()}>
                      <div className="bg-white/90 backdrop-blur-sm rounded p-1">
                        <Checkbox
                          checked={selectedIds.has(animal.id)}
                          onCheckedChange={() => handleSelectAnimal(animal.id, { preview: true })}
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
                    <Popover open={!!(showPhoto && previewAnimalId === animal.id)}>
                      <PopoverAnchor asChild>
                        <button
                          type="button"
                          className="text-xl font-bold mb-2 text-left hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectAnimal(animal.id, { preview: true })
                          }}
                        >
                          {animal.name}
                        </button>
                      </PopoverAnchor>
                      <PopoverContent
                        side="right"
                        align="center"
                        sideOffset={6}
                        className="p-0 w-20 overflow-hidden shadow-2xl border-2 border-primary/20 backdrop-blur-sm bg-white/95 pointer-events-none"
                      >
                        <div className="relative w-20 h-20 bg-muted">
                          {previewImageUrl ? (
                            <Image
                              src={previewImageUrl}
                              alt={animal.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                              {previewImageLoading ? "Loading photo..." : "No photo"}
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                            <h3 className="text-white text-[10px] font-bold leading-tight truncate">{animal.name}</h3>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
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
                        {new Date(animal.arrivalDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
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
          <div
            ref={scrollContainerRef}
            className="space-y-3 animate-in fade-in duration-300 max-h-[calc(100vh-400px)] overflow-y-auto"
          >
            {paginatedAnimals.map((animal, index) => (
              <div
                key={animal.id}
                id={`animal-row-${animal.id}`}
                className="animate-in fade-in slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <AnimalListCard
                  animal={animal}
                  isSelected={selectedIds.has(animal.id)}
                  onSelect={() => handleSelectAnimal(animal.id)}
                  onSelectWithPreview={() => handleSelectAnimal(animal.id, { preview: true })}
                  onEdit={() => handleEditAnimal(animal)}
                  onDelete={() => handleRemoveAnimal(animal.id)}
                  previewOpen={!!(showPhoto && previewAnimalId === animal.id)}
                  previewImageUrl={previewImageUrl}
                  previewImageLoading={previewImageLoading}
                />
              </div>
            ))}
          </div>
        )}

        {viewMode === "details" && (
          <div
            ref={scrollContainerRef}
            className="grid gap-4 md:grid-cols-2 animate-in fade-in duration-300 max-h-[calc(100vh-400px)] overflow-y-auto"
          >
            {paginatedAnimals.map((animal, index) => (
              <div
                key={animal.id}
                id={`animal-row-${animal.id}`}
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
                        onCheckedChange={() => handleSelectAnimal(animal.id, { preview: true })}
                        className="mt-1"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Popover open={!!(showPhoto && previewAnimalId === animal.id)}>
                              <PopoverAnchor asChild>
                                <button
                                  type="button"
                                  className="text-2xl font-bold cursor-pointer hover:text-primary text-left"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleSelectAnimal(animal.id, { preview: true })
                                  }}
                                >
                                  {animal.name}
                                </button>
                              </PopoverAnchor>
                              <PopoverContent
                                side="right"
                                align="center"
                                sideOffset={6}
                                className="p-0 w-20 overflow-hidden shadow-2xl border-2 border-primary/20 backdrop-blur-sm bg-white/95 pointer-events-none"
                              >
                                <div className="relative w-20 h-20 bg-muted">
                                  {previewImageUrl ? (
                                    <Image
                                      src={previewImageUrl}
                                      alt={animal.name}
                                      fill
                                      className="object-cover"
                                    />
                                  ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                                      {previewImageLoading ? "Loading photo..." : "No photo"}
                                    </div>
                                  )}
                                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                                    <h3 className="text-white text-[10px] font-bold leading-tight truncate">{animal.name}</h3>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
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
                            <p>{new Date(animal.arrivalDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            })}</p>
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
                                ? new Date(animal.lastMilestoneDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                })
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

        {isLoadingAnimals ? (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <Spinner className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
            <Image
              src="/rabbit-loader.gif"
              alt="Loading animals"
              width={120}
              height={70}
              unoptimized
              className="mx-auto mb-3"
            />
            <h3 className="text-xl font-semibold mb-2">Loading animals...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the latest records</p>
          </div>
        ) : sortedAnimals.length === 0 && (
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

      <AnimalDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={(newAnimals) => {
          const createdIds = newAnimals.map((a) => String(a.id))

          // Clear search so the newly created animals aren't filtered out.
          setSearchQuery("")

          // Select the newly created animal(s). For group intake, this selects all created animals.
          setSelectedIds(new Set(createdIds))

          // Jump back to the first page so the new selection is easier to find.
          setCurrentPage(1)

          // Merge into local state (dedupe by id).
          setAnimals((prev) => {
            const merged = [...newAnimals, ...prev]
            const seen = new Set<string>()
            return merged.filter((a) => {
              const id = String(a.id)
              if (seen.has(id)) return false
              seen.add(id)
              return true
            })
          })

          // Scroll to the first newly created animal row.
          setPendingScrollToIds(createdIds)
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
              // Use functional update to avoid stale-closure bugs when the list changes while the dialog is open.
              setAnimals((prev) => prev.map((a) => (a.id === animal.id ? animal : a)))
              setSelectedAnimal(animal)
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
        onSuccess={async () => {
          // Refresh animals list to show updated lastMilestone and lastMilestoneDate
          try {
            const apiAnimals = await fetchAnimals({ isAvailable: true, page: 1, limit: 200 })
            setAnimals(apiAnimals)

            // Update selected animals if they're still selected
            if (selectedIds.size > 0) {
              const updatedSelectedAnimals = apiAnimals.filter((a) => selectedIds.has(a.id))
              if (updatedSelectedAnimals.length > 0) {
                sessionStorage.setItem("selectedAnimals", JSON.stringify(updatedSelectedAnimals))
              }
            }
          } catch (error) {
            console.error("Failed to refresh animals after milestone creation", error)
          }
        }}
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

      <ChronicConditionDialog
        animals={selectedAnimals}
        open={showChronicConditionDialog}
        onOpenChange={setShowChronicConditionDialog}
        onSaved={(updatedAnimals) => {
          setAnimals((prev) =>
            prev.map((animal) => {
              const updated = updatedAnimals.find((item) => String(item.id) === String(animal.id))
              return updated ? { ...animal, chronicCondition: updated.chronicCondition } : animal
            }),
          )
        }}
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
            const response = await updateAnimalLocation({ animalIds: ids, location })
            if (response.success) {
              // Update local state so UI reflects the new location
              setAnimals((prev) =>
                prev.map((a) =>
                  ids.includes(a.id) ? { ...a, location } : a,
                ),
              )
              setShowLocationDialog(false)
              toast({
                title: "Success",
                description: response.message || "Animal location updated successfully",
                variant: "success",
              })
            } else {
              const errorMessage = response.errors?.[0] || "Failed to update location"
              setAlertMessage(errorMessage)
              setAlertOpen(true)
            }
          } catch (error) {
            console.error("Failed to update location", error)
            const errorMessage = error instanceof Error ? error.message : "Failed to update location. Please try again."
            setAlertMessage(errorMessage)
            setAlertOpen(true)
          } finally {
            setIsSavingLocation(false)
          }
        }}
      />
    </div>
  )
}
