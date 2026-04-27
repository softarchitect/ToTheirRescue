import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from 'lucide-react'
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import {
  createAnimalProcedures,
  createProcedureReminders,
  updateAnimalProcedure,
  fetchHealthProcedures,
  fetchPCOHospitals,
  createHealthProcedure,
  createPCO,
  postJson,
  fetchAnimalWeightHistory,
  fetchAnimalTypes,
  type AnimalProcedure,
  type HealthProcedure,
  type PCOHospital,
  type AnimalWeightHistory,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { formatDateListDisplay, parseDateListInput } from "@/lib/date-input"
import { formatDateForTenant } from "@/lib/date-format"
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog"

interface ProcedureDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  procedure?: AnimalProcedure | null
  onSave?: (wasReminderCompletion?: boolean) => void
  isReminder?: boolean
}

export function ProcedureDialog({
  animals,
  open,
  onOpenChange,
  procedure,
  onSave,
  isReminder = false,
}: ProcedureDialogProps) {
  const { toast } = useToast()
  const isEditMode = !!procedure

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const addIntervalToDate = (baseDate: string, interval: number, unit: string): string => {
    const date = new Date(`${baseDate}T00:00:00`)
    if (Number.isNaN(date.getTime())) return baseDate
    switch (unit) {
      case "weeks":
        date.setDate(date.getDate() + interval * 7)
        break
      case "months":
        date.setMonth(date.getMonth() + interval)
        break
      case "years":
        date.setFullYear(date.getFullYear() + interval)
        break
      case "days":
      default:
        date.setDate(date.getDate() + interval)
        break
    }
    return date.toISOString().split("T")[0]
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const check = new Date(date)
    check.setHours(0, 0, 0, 0)
    return check < today
  }

  const [procedureTypes, setProcedureTypes] = useState<HealthProcedure[]>([])
  const [clinics, setClinics] = useState<PCOHospital[]>([])
  const [weightHistory, setWeightHistory] = useState<AnimalWeightHistory[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [showAddNewType, setShowAddNewType] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [isCreatingType, setIsCreatingType] = useState(false)
  const newTypeInputRef = useRef<HTMLInputElement | null>(null)
  const procedureTypeSelectRef = useRef<HTMLButtonElement | null>(null)
  const shouldRedirectTypeFocusRef = useRef(false)
  const newTypeFocusGuardTimerRef = useRef<number | null>(null)
  const [showAddHospital, setShowAddHospital] = useState(false)
  const [newHospitalName, setNewHospitalName] = useState("")
  const [isCreatingHospital, setIsCreatingHospital] = useState(false)
  const [isFormTouched, setIsFormTouched] = useState(false)
  const [reminderDates, setReminderDates] = useState<Date[]>([])
  const [reminderDateInput, setReminderDateInput] = useState("")

  const [newProcedure, setNewProcedure] = useState({
    kindId: "",
    date: getTodayDate(),
    dueDate: "",
    clinicId: "",
    administerer: "",
    microchipNumber: "",
    results: "",
    weight: "",
    dueAgain: false,
    dueAgainInterval: 0,
    dueAgainUnit: "days",
    notes: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const [isUnsavedChangesDialogOpen, setIsUnsavedChangesDialogOpen] = useState(false)
  const bypassUnsavedCheckRef = useRef(false)

  const [microchipRequired, setMicrochipRequired] = useState(false)
  const [microchipDisabled, setMicrochipDisabled] = useState(true)
  const [weightRequired, setWeightRequired] = useState(false)
  const [resultsRequired, setResultsRequired] = useState(false)

  // Check if we're completing a reminder (reminder exists but isReminder is false)
  const isCompletingReminder = procedure?.reminder && !isReminder

  const normalizeTypeName = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ")

  const resolveAnimalTypeId = useCallback(async () => {
    const explicitTypeId = animals
      .map((animal) => Number(animal.animalTypeId))
      .find((id) => Number.isFinite(id) && id > 0)
    if (explicitTypeId) {
      return explicitTypeId
    }

    const selectedAnimalTypeName = normalizeTypeName(animals[0]?.type || "")
    if (!selectedAnimalTypeName) {
      return null
    }

    try {
      const availableTypes = await fetchAnimalTypes()
      const matchedType = availableTypes.find((type) => {
        const candidate = normalizeTypeName(type.typeName || "")
        if (!candidate) return false
        return (
          candidate === selectedAnimalTypeName
          || candidate.replace(/s$/, "") === selectedAnimalTypeName.replace(/s$/, "")
        )
      })
      return matchedType ? Number(matchedType.id) : null
    } catch (error) {
      console.error("Failed to resolve animal type id for procedures", error)
      return null
    }
  }, [animals])

  // Load procedure types, clinics, and weight history
  useEffect(() => {
    if (open && animals.length > 0) {
      loadData()
      if (animals.length === 1) {
        loadWeightHistory()
      }
    }
  }, [open, animals])

  // Load procedure data when editing
  useEffect(() => {
    if (procedure && open) {
      const dueAgainParts = procedure.dueAgain?.split("-") || []
      const interval = dueAgainParts[0] ? parseInt(dueAgainParts[0]) : 0
      const unit = dueAgainParts[1] || "days"

      setNewProcedure({
        kindId: String(procedure.kindId),
        date: procedure.actionDate ? procedure.actionDate.split("T")[0] : getTodayDate(),
        dueDate: procedure.dueDate ? procedure.dueDate.split("T")[0] : "",
        clinicId: procedure.hospitalClinicId ? String(procedure.hospitalClinicId) : "",
        administerer: procedure.administerer || "",
        microchipNumber: procedure.microchipNumber || "",
        results: procedure.results || "",
        weight: procedure.weight || "",
        dueAgain: !!procedure.dueAgain,
        dueAgainInterval: interval,
        dueAgainUnit: unit,
        notes: procedure.notes || "",
      })

      // Update microchip/weight status based on existing kind
      updateFieldStatus(String(procedure.kindId))

      // If it's a reminder, initialize reminderDates
      if (isReminder && procedure.dueDate) {
        setReminderDates([new Date(procedure.dueDate)])
      }
    } else if (!procedure && open) {
      // Reset form when adding new
      setNewProcedure({
        kindId: "",
        date: getTodayDate(),
        dueDate: "",
        clinicId: "",
        administerer: "",
        microchipNumber: "",
        results: "",
        weight: "",
        dueAgain: false,
        dueAgainInterval: 0,
        dueAgainUnit: "days",
        notes: "",
      })
      setReminderDates([])
      setValidationErrors({})
      setShowAddNewType(false)
      setNewTypeName("")
      setShowAddHospital(false)
      setNewHospitalName("")
      setIsFormTouched(false)
      setMicrochipDisabled(true)
      setMicrochipRequired(false)
      setWeightRequired(false)
      setResultsRequired(false)
    } else if (procedure && open && procedure.reminder && !isReminder) {
      // When completing a reminder, use due date as action date
      const actionDate = procedure.dueDate
        ? procedure.dueDate.split("T")[0]
        : getTodayDate()
      setNewProcedure({
        kindId: String(procedure.kindId),
        date: actionDate,
        dueDate: procedure.dueDate ? procedure.dueDate.split("T")[0] : "",
        clinicId: "",
        administerer: "",
        microchipNumber: "",
        results: "",
        weight: "",
        dueAgain: false,
        dueAgainInterval: 0,
        dueAgainUnit: "days",
        notes: procedure.notes || "",
      })
      setReminderDates([])
      updateFieldStatus(String(procedure.kindId))
    }
  }, [procedure, open, isReminder])

  useEffect(() => {
    setReminderDateInput(formatDateListDisplay(reminderDates))
  }, [reminderDates])

  const focusNewTypeInput = useCallback(() => {
    procedureTypeSelectRef.current?.blur()
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur()
    }

    const input = newTypeInputRef.current
    if (!input) return

    input.focus({ preventScroll: true })
    const cursorPosition = input.value.length
    input.setSelectionRange(cursorPosition, cursorPosition)
  }, [])

  const clearNewTypeFocusGuard = useCallback(() => {
    if (newTypeFocusGuardTimerRef.current == null) return
    window.clearInterval(newTypeFocusGuardTimerRef.current)
    newTypeFocusGuardTimerRef.current = null
  }, [])

  useLayoutEffect(() => {
    if (!showAddNewType) return

    const frameId = window.requestAnimationFrame(focusNewTypeInput)
    const timeoutIds = [0, 50, 150, 300].map((delay) => window.setTimeout(focusNewTypeInput, delay))

    // Guard against late focus restoration from Radix/select internals.
    clearNewTypeFocusGuard()
    let attempts = 0
    const maxAttempts = 20
    newTypeFocusGuardTimerRef.current = window.setInterval(() => {
      attempts += 1
      const input = newTypeInputRef.current
      if (!input) {
        if (attempts >= maxAttempts) clearNewTypeFocusGuard()
        return
      }

      if (document.activeElement !== input) {
        focusNewTypeInput()
      } else {
        clearNewTypeFocusGuard()
        return
      }

      if (attempts >= maxAttempts) {
        clearNewTypeFocusGuard()
      }
    }, 50)

    return () => {
      window.cancelAnimationFrame(frameId)
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
      clearNewTypeFocusGuard()
    }
  }, [clearNewTypeFocusGuard, focusNewTypeInput, showAddNewType])

  const setNewTypeInputNode = useCallback(
    (node: HTMLInputElement | null) => {
      newTypeInputRef.current = node
      if (!node || !showAddNewType) return

      focusNewTypeInput()
      window.requestAnimationFrame(focusNewTypeInput)
      window.setTimeout(focusNewTypeInput, 0)
    },
    [focusNewTypeInput, showAddNewType],
  )

  const handleReminderDateBlur = () => {
    if (!reminderDateInput.trim()) {
      // If user picked from calendar, keep that selection instead of clearing it.
      if (reminderDates.length > 0) {
        return
      }
      setReminderDates([])
      return
    }

    const parsed = parseDateListInput(reminderDateInput)
    if (!parsed) return

    setReminderDates(isEditMode ? parsed.slice(0, 1) : parsed)
  }

  const loadData = async () => {
    if (!animals.length) return

    try {
      setIsLoadingData(true)
      const animalTypeId = await resolveAnimalTypeId()
      if (!animalTypeId) {
        setProcedureTypes([])
        return
      }

      // Load procedure types
      const types = await fetchHealthProcedures(animalTypeId)
      setProcedureTypes(types)

      // Load clinics (hospitals)
      const hospitals = await fetchPCOHospitals()
      setClinics(hospitals)
    } catch (error) {
      console.error("Failed to load data", error)
      toast({
        title: "Error",
        description: "Failed to load procedure types or clinics",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const loadWeightHistory = async () => {
    if (animals.length !== 1) return
    try {
      const history = await fetchAnimalWeightHistory(animals[0].id)
      setWeightHistory(history)
    } catch (error) {
      console.error("Failed to load weight history", error)
    }
  }

  const getKindRequirementFlags = (kindId: string) => {
    const selectedType = procedureTypes.find((t) => String(t.id) === kindId)
    const normalizedKindName = selectedType?.kind.toLowerCase().replace(/[^a-z0-9]/g, "") ?? ""
    const isMicrochipType = normalizedKindName.includes("microchip")
    const isMicrochipCheckType =
      normalizedKindName.includes("microchipcheck") ||
      (normalizedKindName.includes("microchip") && normalizedKindName.includes("check"))
    const isMicrochipImplantType =
      normalizedKindName.includes("microchipimplant") ||
      (normalizedKindName.includes("microchip") && normalizedKindName.includes("implant"))
    const isWeightType = normalizedKindName.includes("weight")

    return {
      isMicrochipType,
      isMicrochipCheckType,
      isMicrochipImplantType,
      isWeightType,
    }
  }

  const updateFieldStatus = (kindId: string) => {
    const {
      isMicrochipType,
      isMicrochipCheckType,
      isMicrochipImplantType,
      isWeightType,
    } = getKindRequirementFlags(kindId)

    setMicrochipDisabled(!isMicrochipType)
    setMicrochipRequired(isMicrochipImplantType)
    setWeightRequired(isWeightType)
    setResultsRequired(isMicrochipCheckType)
  }

  const handleAddNewType = async () => {
    if (!newTypeName.trim()) {
      toast({
        title: "Error",
        description: "Procedure type name is required",
        variant: "destructive",
      })
      return
    }

    if (!animals.length) return

    try {
      setIsCreatingType(true)
      const animalTypeId = await resolveAnimalTypeId()
      if (!animalTypeId) {
        toast({
          title: "Error",
          description: "Animal type could not be determined for this selection.",
          variant: "destructive",
        })
        setIsCreatingType(false)
        return
      }

      const existing = procedureTypes.find(
        (t) => t.kind.toLowerCase() === newTypeName.trim().toLowerCase()
      )

      if (existing) {
        toast({
          title: "Error",
          description: "This procedure type already exists",
          variant: "destructive",
        })
        setIsCreatingType(false)
        return
      }

      const newType = await createHealthProcedure(newTypeName.trim(), animalTypeId)
      const types = await fetchHealthProcedures(animalTypeId)
      setProcedureTypes(types)
      setNewProcedure({ ...newProcedure, kindId: String(newType.id) })
      updateFieldStatus(String(newType.id))
      setNewTypeName("")
      setShowAddNewType(false)

      toast({
        title: "Success",
        description: "Procedure type created successfully",
      })
    } catch (error: any) {
      console.error("Failed to create procedure type", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create procedure type. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingType(false)
    }
  }

  const handleAddHospital = async () => {
    if (!newHospitalName.trim()) {
      toast({
        title: "Error",
        description: "Hospital name is required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreatingHospital(true)
      const existing = clinics.find(
        (c) => c.lastName.toLowerCase() === newHospitalName.trim().toLowerCase()
      )

      if (existing) {
        toast({
          title: "Error",
          description: "This hospital already exists",
          variant: "destructive",
        })
        setIsCreatingHospital(false)
        return
      }

      const newHospital = await createPCO({
        firstName: "",
        lastName: newHospitalName.trim(),
        entityType: "CorO",
        hospital: true,
        rescue: false,
        mailList: false,
        flag: false,
        flagReason: "",
      })

      const hospitals = await fetchPCOHospitals()
      setClinics(hospitals)
      setNewProcedure({ ...newProcedure, clinicId: String(newHospital.id) })
      setNewHospitalName("")
      setShowAddHospital(false)

      toast({
        title: "Success",
        description: "Hospital clinic added successfully",
      })
    } catch (error: any) {
      console.error("Failed to create hospital", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create hospital. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingHospital(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    const today = getTodayDate()
    const { isMicrochipCheckType } = getKindRequirementFlags(newProcedure.kindId)

    if (!newProcedure.kindId) {
      errors.kindId = "Kind is required"
    }

    if (isCompletingReminder || (!isReminder && !procedure?.reminder)) {
      if (!newProcedure.date) {
        errors.date = "Date is required"
      } else if (newProcedure.date > today) {
        errors.date = "Future dates are not allowed for completed procedures"
      }
      if (!newProcedure.clinicId) {
        errors.clinicId = "Clinic is required"
      }
      if (weightRequired && !newProcedure.weight) {
        errors.weight = "Weight is required for this procedure"
      }
      if (microchipRequired && !newProcedure.microchipNumber) {
        errors.microchipNumber = "Microchip number is required for this procedure"
      }
      if ((isMicrochipCheckType || newProcedure.microchipNumber.trim().length > 0) && !newProcedure.results.trim()) {
        errors.results = "Test Results is required for Microchip Check or when Microchip Number is entered"
      }
    } else if (isReminder || procedure?.reminder) {
      if (reminderDates.length === 0) {
        errors.dueDate = "At least one due date is required for reminders"
      } else if (reminderDates.some((d) => isPastDate(d))) {
        errors.dueDate = "Past dates are not allowed for reminders"
      }
    }

    if (newProcedure.dueAgain && !newProcedure.dueAgainInterval) {
      errors.dueAgain = "Due Again interval is required when checkbox is checked"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    if (!animals.length) return

    try {
      setIsSaving(true)

      const dueAgainStr = newProcedure.dueAgain
        ? `${newProcedure.dueAgainInterval}-${newProcedure.dueAgainUnit}`
        : undefined
      const followUpDueDate =
        newProcedure.dueAgain && newProcedure.dueAgainInterval > 0
          ? addIntervalToDate(newProcedure.date, newProcedure.dueAgainInterval, newProcedure.dueAgainUnit)
          : undefined

      if (isEditMode && procedure) {
        const isCompletingReminderForSave = Boolean(procedure.reminder && !isReminder && newProcedure.date)

        await updateAnimalProcedure(
          procedure.id,
          {
            kindId: Number(newProcedure.kindId),
            actionDate: isReminder ? undefined : newProcedure.date,
            dueDate: (isReminder || procedure.reminder) && reminderDates.length > 0
              ? reminderDates[0].toISOString()
              : undefined,
            hospitalClinicId: newProcedure.clinicId ? Number(newProcedure.clinicId) : null,
            administerer: newProcedure.administerer || undefined,
            weight: newProcedure.weight || undefined,
            microchipNumber: newProcedure.microchipNumber || undefined,
            results: newProcedure.results || undefined,
            notes: newProcedure.notes || undefined,
            dueAgain: dueAgainStr,
            reminder: isCompletingReminderForSave ? false : (isReminder || procedure.reminder),
          },
          isCompletingReminderForSave
        )

        toast({
          title: "Success",
          description: "Procedure updated successfully",
        })

        if (isCompletingReminderForSave) {
          onOpenChange(false)
          if (onSave) onSave(true)
          return
        }
      } else {
        if (isReminder) {
          const dueDates = reminderDates.map(d => d.toISOString())

          if (dueDates.length === 0) {
            toast({
              title: "Error",
              description: "At least one due date is required for reminders",
              variant: "destructive",
            })
            setIsSaving(false)
            return
          }

          await postJson(
            "/api/animal-procedure/add-animal-procedures",
            {
              animalIds: animals.map((a) => a.id),
              animalProcedureVm: {
                kindId: Number(newProcedure.kindId),
                reminder: true,
                dueDate: dueDates,
                notes: newProcedure.notes || "",
              },
            }
          )

          toast({
            title: "Success",
            description: "Procedure reminder created successfully",
          })
        } else {
          await createAnimalProcedures({
            animalIds: animals.map((a) => a.id),
            kindId: Number(newProcedure.kindId),
            hospitalClinicId: Number(newProcedure.clinicId),
            actionDate: newProcedure.date,
            administerer: newProcedure.administerer || undefined,
            weight: newProcedure.weight || undefined,
            microchipNumber: newProcedure.microchipNumber || undefined,
            results: newProcedure.results || undefined,
            notes: newProcedure.notes || undefined,
            dueAgain: dueAgainStr,
            reminder: false,
          })

          if (followUpDueDate) {
            const selectedProcedureType = procedureTypes.find(
              (type) => String(type.id) === String(newProcedure.kindId),
            )
            await createProcedureReminders({
              animalIds: animals.map((a) => a.id),
              itemName: selectedProcedureType?.kind || "Procedure",
              dueDates: [followUpDueDate],
              notes: newProcedure.notes || undefined,
            })
          }

          toast({
            title: "Success",
            description: "Procedure created successfully",
          })
        }
      }

      setIsFormTouched(false)
      onOpenChange(false)
      if (onSave) onSave(false)
    } catch (error: any) {
      console.error("Failed to save procedure", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save procedure. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    handleDialogOpenChange(false)
  }

  const handleDialogOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && !isSaving && isFormTouched && !bypassUnsavedCheckRef.current) {
      setIsUnsavedChangesDialogOpen(true)
      return
    }
    onOpenChange(nextOpen)
  }

  const isMultipleAnimals = animals.length > 1

  const kindOptions = procedureTypes.map((type) => {
    const normalizedKindName = type.kind.toLowerCase().replace(/[^a-z0-9]/g, "")
    const isAnimalSpecific =
      normalizedKindName.includes("microchipcheck") ||
      normalizedKindName.includes("microchipimplant") ||
      normalizedKindName.includes("weight")
    return {
      value: String(type.id),
      label: type.kind,
      disabled: isMultipleAnimals && isAnimalSpecific
    }
  })

  const clinicOptions = clinics.map((clinic) => ({
    value: String(clinic.id),
    label: clinic.lastNameHospital || clinic.lastName || `${clinic.firstName} ${clinic.lastName}`.trim(),
  }))

  const getWeightSourceLabel = (sourceType?: string) => {
    switch (sourceType) {
      case "procedure":
        return "Procedure"
      case "vaccination":
        return "Vaccination"
      case "medication":
        return "Medication"
      case "soap":
        return "SOAP"
      case "healthNote":
        return "Health Note"
      default:
        return "Health Entry"
    }
  }

  const title = isCompletingReminder
    ? "Complete Procedure Reminder"
    : isReminder || procedure?.reminder
      ? isEditMode
        ? "Edit Procedure Reminder"
        : "Add New Procedure Reminder"
      : isEditMode
        ? "Edit Completed Procedure"
        : "Add New Completed Procedure"
  const shouldRequireTestResults = resultsRequired || newProcedure.microchipNumber.trim().length > 0

  const weightHistoryContent = (
    <div className="w-64 p-2">
      <h4 className="font-semibold mb-2">Weight History</h4>
      <Separator className="mb-2" />
      {weightHistory.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {weightHistory.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span>{item.weight}</span>
                <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                  {getWeightSourceLabel(item.sourceType)}
                </Badge>
              </div>
              <Badge variant="secondary" className="text-xs">
                {item.actionDate
                  ? formatDateForTenant(item.actionDate, { month: 'short', day: '2-digit', year: 'numeric' })
                  : "No date"}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">No weight history found</p>
      )}
    </div>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogOpenChange}>
        <DialogContent
          className="sm:max-w-3xl max-h-[95vh] overflow-y-auto p-6"
          onOpenAutoFocus={(event) => {
            event.preventDefault()
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-emerald-800">{title}</DialogTitle>
          </DialogHeader>

          {animals.length > 0 && <SelectedAnimalsHeader animals={animals} className="mt-2" />}

          {isLoadingData && (
            <div className="text-center py-4 text-muted-foreground animate-pulse">Loading data...</div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="w-full">
                <FloatingSelect
                  ref={procedureTypeSelectRef}
                  label={
                    <span>
                      Procedure, Test or Treatment <span className="text-red-500">*</span>
                    </span>
                  }
                  value={newProcedure.kindId}
                  onValueChange={(value) => {
                    setIsFormTouched(true)
                    if (value === "__add_new__") {
                      shouldRedirectTypeFocusRef.current = true
                      setShowAddNewType(true)
                      window.setTimeout(focusNewTypeInput, 0)
                    } else {
                      setNewProcedure({ ...newProcedure, kindId: value })
                      updateFieldStatus(value)
                    }
                  }}
                  onCloseAutoFocus={(event) => {
                    if (!shouldRedirectTypeFocusRef.current) return
                    event.preventDefault()
                    shouldRedirectTypeFocusRef.current = false
                    window.setTimeout(focusNewTypeInput, 0)
                  }}
                  error={validationErrors.kindId}
                  className="w-full"
                  options={[
                    ...kindOptions,
                    { value: "__add_new__", label: "+ Add New Procedure Type" },
                  ]}
                  disabled={isLoadingData || isCreatingType || isCompletingReminder}
                />
                {showAddNewType && (
                  <div className="mt-2 p-4 border-2 border-emerald-100 rounded-lg bg-emerald-50/30 space-y-3">
                    <FloatingInput
                      ref={setNewTypeInputNode}
                      autoFocus
                      label="New Type Name (Optional)"
                      value={newTypeName}
                      onChange={(e) => {
                        setIsFormTouched(true)
                        setNewTypeName(e.target.value)
                      }}
                      placeholder="New Type Name (Optional)"
                      disabled={isCreatingType}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAddNewType}
                        disabled={isCreatingType || !newTypeName.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {isCreatingType ? "Creating..." : "Add"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowAddNewType(false)
                          setNewTypeName("")
                        }}
                        disabled={isCreatingType}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {isCompletingReminder || (!isReminder && !procedure?.reminder) ? (
                <FloatingInput
                  label="Action Date"
                  type="date"
                  value={newProcedure.date}
                  onChange={(e) => {
                    setIsFormTouched(true)
                    setNewProcedure({ ...newProcedure, date: e.target.value })
                  }}
                  error={validationErrors.date}
                  required
                  max={getTodayDate()}
                />
              ) : (
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative cursor-pointer">
                        <FloatingInput
                          label="Due Date"
                          value={reminderDateInput}
                          onChange={(e) => {
                            setIsFormTouched(true)
                            setReminderDateInput(e.target.value)
                          }}
                          onBlur={handleReminderDateBlur}
                          placeholder="dd/mm/yyyy"
                          className="cursor-pointer"
                          required
                          error={validationErrors.dueDate}
                        />
                        <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-2 w-auto">
                      {isEditMode ? (
                        <Calendar
                          mode="single"
                          selected={reminderDates[0]}
                          onSelect={(date) => {
                            setIsFormTouched(true)
                            setReminderDates(date ? [date] : [])
                          }}
                          disabled={(date) => isPastDate(date)}
                          numberOfMonths={1}
                        />
                      ) : (
                        <Calendar
                          mode="multiple"
                          selected={reminderDates}
                          onSelect={(dates) => {
                            setIsFormTouched(true)
                            setReminderDates(dates ?? [])
                          }}
                          disabled={(date) => isPastDate(date)}
                          numberOfMonths={1}
                        />
                      )}
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              {(isCompletingReminder || (!isReminder && !procedure?.reminder)) && (
                <>
                  <div className="w-full">
                    <FloatingSelect
                      label={
                        <span>
                          Clinic <span className="text-red-500">*</span>
                        </span>
                      }
                      value={newProcedure.clinicId}
                      onValueChange={(value) => {
                        setIsFormTouched(true)
                        if (value === "__add_hospital__") {
                          setShowAddHospital(true)
                        } else {
                          setNewProcedure({ ...newProcedure, clinicId: value })
                        }
                      }}
                      className="w-full"
                      options={[
                        ...clinicOptions,
                        { value: "__add_hospital__", label: "+ Add New Hospital" },
                      ]}
                      error={validationErrors.clinicId}
                      disabled={isLoadingData || isCreatingHospital}
                    />
                    {showAddHospital && (
                      <div className="mt-2 p-4 border-2 border-emerald-100 rounded-lg bg-emerald-50/30 space-y-3">
                        <FloatingInput
                          label="New Hospital Name"
                          value={newHospitalName}
                          onChange={(e) => {
                            setIsFormTouched(true)
                            setNewHospitalName(e.target.value)
                          }}
                          placeholder="e.g., Animal Hospital"
                          disabled={isCreatingHospital}
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={handleAddHospital}
                            disabled={isCreatingHospital || !newHospitalName.trim()}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            {isCreatingHospital ? "Creating..." : "Add"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowAddHospital(false)
                              setNewHospitalName("")
                            }}
                            disabled={isCreatingHospital}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <FloatingInput
                    label="Vet / Administerer"
                    value={newProcedure.administerer}
                    onChange={(e) => {
                      setIsFormTouched(true)
                      setNewProcedure({ ...newProcedure, administerer: e.target.value })
                    }}
                  />

                  <div className="flex gap-2 items-start">
                    <div className="flex-1">
                      <FloatingInput
                        label="Weight"
                        value={newProcedure.weight}
                        onChange={(e) => {
                          setIsFormTouched(true)
                          setNewProcedure({ ...newProcedure, weight: e.target.value })
                        }}
                        disabled={isMultipleAnimals}
                        error={validationErrors.weight}
                        required={weightRequired}
                      />
                    </div>
                    {!isMultipleAnimals && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="mt-1">History</Button>
                        </PopoverTrigger>
                        <PopoverContent side="right">
                          {weightHistoryContent}
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {(isCompletingReminder || (!isReminder && !procedure?.reminder)) && (
                <>
                  <FloatingInput
                    label="Test Results (if applicable)"
                    value={newProcedure.results}
                    onChange={(e) => {
                      setIsFormTouched(true)
                      setNewProcedure({ ...newProcedure, results: e.target.value })
                    }}
                    required={shouldRequireTestResults}
                    error={validationErrors.results}
                  />

                  <FloatingInput
                    label="Microchip Number"
                    value={newProcedure.microchipNumber}
                    onChange={(e) => {
                      setIsFormTouched(true)
                      setNewProcedure({ ...newProcedure, microchipNumber: e.target.value })
                    }}
                    disabled={microchipDisabled || isMultipleAnimals}
                    error={validationErrors.microchipNumber}
                    required={microchipRequired}
                  />

                  <div className="p-4 border rounded-lg space-y-3 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="dueAgain"
                        checked={newProcedure.dueAgain}
                        onCheckedChange={(checked) => {
                          setIsFormTouched(true)
                          setNewProcedure({ ...newProcedure, dueAgain: checked as boolean })
                        }}
                      />
                      <label htmlFor="dueAgain" className="text-sm font-medium leading-none cursor-pointer">
                        Set Follow-up / Reminder
                      </label>
                    </div>
                    {newProcedure.dueAgain && (
                      <div className="flex gap-2 animate-in fade-in duration-200">
                        <FloatingInput
                          type="number"
                          min={0}
                          label="Interval"
                          value={newProcedure.dueAgainInterval.toString()}
                          onChange={(e) => {
                            setIsFormTouched(true)
                            setNewProcedure({
                              ...newProcedure,
                              dueAgainInterval: Number.parseInt(e.target.value) || 0,
                            })
                          }}
                          className="w-24"
                          error={validationErrors.dueAgain}
                        />
                        <FloatingSelect
                          label="Unit"
                          value={newProcedure.dueAgainUnit}
                          onValueChange={(value) => {
                            setIsFormTouched(true)
                            setNewProcedure({ ...newProcedure, dueAgainUnit: value })
                          }}
                          className="flex-1"
                          options={[
                            { value: "days", label: "Days" },
                            { value: "weeks", label: "Weeks" },
                            { value: "months", label: "Months" },
                            { value: "years", label: "Years" },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              <FloatingTextarea
                label="Notes"
                value={newProcedure.notes}
                onChange={(e) => {
                  setIsFormTouched(true)
                  setNewProcedure({ ...newProcedure, notes: e.target.value })
                }}
                rows={isReminder ? 10 : 4}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter className="mt-8 gap-2 border-t pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[100px]" onClick={handleSave} disabled={isSaving || isLoadingData}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <UnsavedChangesDialog
        open={isUnsavedChangesDialogOpen}
        onOpenChange={setIsUnsavedChangesDialogOpen}
        onConfirm={() => {
          setIsUnsavedChangesDialogOpen(false)
          bypassUnsavedCheckRef.current = true
          onOpenChange(false)
          window.setTimeout(() => {
            bypassUnsavedCheckRef.current = false
          }, 100)
        }}
      />
    </>
  )
}
