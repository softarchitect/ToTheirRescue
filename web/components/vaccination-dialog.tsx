"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Animal, PCO } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import {
  createAnimalVaccinations,
  updateAnimalVaccination,
  fetchVaccinationTypes,
  fetchPCOHospitals,
  createVaccinationType,
  createPCO,
  postJson,
  type AnimalVaccination,
  type VaccinationType,
  type CreateVaccinationResponse,
  type PCOHospital,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface VaccinationDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  vaccination?: AnimalVaccination | null
  onSave?: (wasReminderCompletion?: boolean) => void
  isReminder?: boolean
}

export function VaccinationDialog({
  animals,
  open,
  onOpenChange,
  vaccination,
  onSave,
  isReminder = false,
}: VaccinationDialogProps) {
  const { toast } = useToast()
  const isEditMode = !!vaccination

  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const parseDateOnly = (value: string) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (!match) return null

    const [, year, month, day] = match
    return new Date(Number(year), Number(month) - 1, Number(day))
  }

  const isFutureActionDate = (value: string) => {
    const selectedDate = parseDateOnly(value)
    const todayDate = parseDateOnly(getTodayDate())
    if (!selectedDate || !todayDate) return false

    return selectedDate.getTime() > todayDate.getTime()
  }

  const [vaccinationTypes, setVaccinationTypes] = useState<VaccinationType[]>([])
  const [clinics, setClinics] = useState<PCOHospital[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [showAddNewType, setShowAddNewType] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [isCreatingType, setIsCreatingType] = useState(false)
  const [showAddHospital, setShowAddHospital] = useState(false)
  const [newHospitalName, setNewHospitalName] = useState("")
  const [isCreatingHospital, setIsCreatingHospital] = useState(false)

  const [newVaccination, setNewVaccination] = useState({
    kindId: "",
    date: getTodayDate(),
    dueDate: "",
    vaccSerialNo: "",
    clinicId: "",
    tagNo: "",
    administerer: "",
    dueAgain: false,
    dueAgainInterval: 0,
    dueAgainUnit: "days",
    vaccMfg: "",
    notes: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const kindSelectRef = useRef<HTMLButtonElement | null>(null)
  const newTypeInputRef = useRef<HTMLInputElement | null>(null)
  const newHospitalInputRef = useRef<HTMLInputElement | null>(null)
  const shouldFocusNewHospitalInputRef = useRef(false)

  // Check if we're completing a reminder (reminder exists but isReminder is false)
  const isCompletingReminder = vaccination?.reminder && !isReminder

  // Load vaccination types and clinics
  useEffect(() => {
    if (open && animals.length > 0 && animals[0].animalTypeId) {
      loadData()
    }
  }, [open, animals])

  // Load vaccination data when editing
  useEffect(() => {
    if (vaccination && open && vaccination.reminder && !isReminder) {
      const actionDate = vaccination.actionDate
        ? vaccination.actionDate.split("T")[0]
        : vaccination.dueDate
          ? vaccination.dueDate.split("T")[0]
          : getTodayDate()
      setNewVaccination({
        kindId: String(vaccination.kindId),
        date: actionDate,
        dueDate: vaccination.dueDate ? vaccination.dueDate.split("T")[0] : "",
        vaccSerialNo: "",
        clinicId: "",
        tagNo: "",
        administerer: "",
        dueAgain: false,
        dueAgainInterval: 0,
        dueAgainUnit: "days",
        vaccMfg: "",
        notes: vaccination.notes || "",
      })
    } else if (vaccination && open) {
      const dueAgainParts = vaccination.dueAgain?.split("-") || []
      const interval = Math.max(0, dueAgainParts[0] ? parseInt(dueAgainParts[0], 10) : 0)
      const unit = dueAgainParts[1] || "days"

      setNewVaccination({
        kindId: String(vaccination.kindId),
        date: vaccination.actionDate ? vaccination.actionDate.split("T")[0] : getTodayDate(),
        dueDate: vaccination.dueDate ? vaccination.dueDate.split("T")[0] : "",
        vaccSerialNo: vaccination.vaccineSerialNo || "",
        clinicId: vaccination.hospitalClinicId ? String(vaccination.hospitalClinicId) : "",
        tagNo: vaccination.tagNumber || "",
        administerer: vaccination.administerer || "",
        dueAgain: !!vaccination.dueAgain,
        dueAgainInterval: interval,
        dueAgainUnit: unit,
        vaccMfg: vaccination.vaccineManufacturer || "",
        notes: vaccination.notes || "",
      })
    } else if (!vaccination && open) {
      // Reset form when adding new
      setNewVaccination({
        kindId: "",
        date: getTodayDate(),
        dueDate: "",
        vaccSerialNo: "",
        clinicId: "",
        tagNo: "",
        administerer: "",
        dueAgain: false,
        dueAgainInterval: 0,
        dueAgainUnit: "days",
        vaccMfg: "",
        notes: "",
      })
      setValidationErrors({})
      // Keep "Add New Vaccination Type" collapsed until user explicitly chooses it.
      setShowAddNewType(false)
      setNewTypeName("")
      setShowAddHospital(false)
      setNewHospitalName("")
    }
  }, [vaccination, open, isReminder])

  // Keep initial focus on Kind when the modal opens.
  useEffect(() => {
    if (!open || isLoadingData || showAddNewType) return
    requestAnimationFrame(() => {
      kindSelectRef.current?.focus()
    })
  }, [open, isLoadingData, showAddNewType])

  // When user chooses + Add New Hospital, move focus into the new hospital input.
  useEffect(() => {
    if (!open || !showAddHospital) return
    requestAnimationFrame(() => {
      newHospitalInputRef.current?.focus()
    })
  }, [open, showAddHospital])

  const loadData = async () => {
    if (!animals.length || !animals[0].animalTypeId) return

    try {
      setIsLoadingData(true)
      const animalTypeId = Number(animals[0].animalTypeId)

      // Load vaccination types
      const types = await fetchVaccinationTypes(animalTypeId)
      setVaccinationTypes(types)

      // Load clinics (hospitals) using the dedicated endpoint
      const hospitals = await fetchPCOHospitals()
      setClinics(hospitals)
    } catch (error) {
      console.error("Failed to load data", error)
      toast({
        title: "Error",
        description: "Failed to load vaccination types or clinics",
        variant: "destructive",
      })
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleAddNewType = async () => {
    if (!newTypeName.trim()) {
      toast({
        title: "Error",
        description: "Vaccination type name is required",
        variant: "destructive",
      })
      return
    }

    if (!animals.length || !animals[0].animalTypeId) return

    try {
      setIsCreatingType(true)
      const animalTypeId = Number(animals[0].animalTypeId)

      // Check if type already exists
      const existing = vaccinationTypes.find(
        (t) => t.kind.toLowerCase() === newTypeName.trim().toLowerCase()
      )

      if (existing) {
        toast({
          title: "Error",
          description: "This vaccination type already exists",
          variant: "destructive",
        })
        setIsCreatingType(false)
        return
      }

      // Create new vaccination type
      const newType = await createVaccinationType(newTypeName.trim(), animalTypeId)

      // Refresh the list
      const types = await fetchVaccinationTypes(animalTypeId)
      setVaccinationTypes(types)

      // Select the newly created type
      setNewVaccination({ ...newVaccination, kindId: String(newType.id) })

      // Reset and hide the add form
      setNewTypeName("")
      setShowAddNewType(false)

      toast({
        title: "Success",
        description: "Vaccination type created successfully",
      })
    } catch (error: any) {
      console.error("Failed to create vaccination type", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create vaccination type. Please try again.",
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

      // Check if hospital already exists
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

      // Create new hospital PCO (matching old system format)
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

      // Refresh the list
      const hospitals = await fetchPCOHospitals()
      setClinics(hospitals)

      // Select the newly created hospital
      setNewVaccination({ ...newVaccination, clinicId: String(newHospital.id) })

      // Reset and hide the add form
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
    const clinicIdNum = Number(newVaccination.clinicId)

    if (!newVaccination.kindId) {
      errors.kindId = "Kind is required"
    }
    // When completing a reminder, validate as completed vaccination (requires action date)
    if (isCompletingReminder || (!isReminder && !vaccination?.reminder)) {
      if (!newVaccination.date) {
        errors.date = "Date is required"
      } else if (isFutureActionDate(newVaccination.date)) {
        errors.date = "Future dates are not allowed for completed vaccinations"
      }
    } else if (isReminder || vaccination?.reminder) {
      if (!newVaccination.dueDate) {
        errors.dueDate = "Due date is required for reminders"
      }
    }
    if (newVaccination.dueAgain && !newVaccination.dueAgainInterval) {
      errors.dueAgain = "Due Again interval is required when checkbox is checked"
    }
    if (
      (isCompletingReminder || !isReminder) &&
      (!newVaccination.clinicId || Number.isNaN(clinicIdNum) || clinicIdNum <= 0)
    ) {
      errors.clinicId = "Clinic is required"
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

      if (isEditMode && vaccination) {
        // Update existing vaccination
        const dueAgainInterval = Math.max(0, newVaccination.dueAgainInterval)
        const dueAgainStr = newVaccination.dueAgain
          ? `${dueAgainInterval}-${newVaccination.dueAgainUnit}`
          : undefined

        // If completing a reminder (was reminder, now completing), use completeReminder flag
        const isCompletingReminderForSave = Boolean(vaccination.reminder && !isReminder && newVaccination.date)
        const shouldPersistDueDate = (isReminder || vaccination.reminder) && !isCompletingReminderForSave

        const updateResponse = await updateAnimalVaccination(
          vaccination.id,
          {
            kindId: Number(newVaccination.kindId),
            actionDate: isReminder ? undefined : newVaccination.date,
            dueDate: shouldPersistDueDate ? newVaccination.dueDate : undefined,
            hospitalClinicId: Number(newVaccination.clinicId) > 0 ? Number(newVaccination.clinicId) : undefined,
            administerer: newVaccination.administerer || undefined,
            tagNumber: newVaccination.tagNo || undefined,
            vaccineManufacturer: newVaccination.vaccMfg || undefined,
            vaccineSerialNo: newVaccination.vaccSerialNo || undefined,
            notes: newVaccination.notes || undefined,
            dueAgain: dueAgainStr,
            // When completing a reminder, set reminder to false
            reminder: isCompletingReminderForSave ? false : (isReminder || vaccination.reminder),
          },
          isCompletingReminderForSave
        )

        toast({
          title: "Success",
          description: updateResponse.message || "Vaccination updated successfully",
        })

        // If completing a reminder, notify parent to switch tabs
        if (isCompletingReminderForSave) {
          setNewVaccination({
            kindId: "",
            date: getTodayDate(),
            dueDate: "",
            vaccSerialNo: "",
            clinicId: "",
            tagNo: "",
            administerer: "",
            dueAgain: false,
            dueAgainInterval: 0,
            dueAgainUnit: "days",
            vaccMfg: "",
            notes: "",
          })
          setValidationErrors({})
          onOpenChange(false)
          if (onSave) {
            onSave(true) // Pass true to indicate reminder was completed
          }
          return // Early return to prevent duplicate save callback
        }
      } else {
        // Create new vaccination
        const dueAgainInterval = Math.max(0, newVaccination.dueAgainInterval)
        const dueAgainStr = newVaccination.dueAgain
          ? `${dueAgainInterval}-${newVaccination.dueAgainUnit}`
          : ""

        if (isReminder) {
          // For reminders, use old format to support multiple due dates
          // Convert single dueDate to array format expected by old system
          // Format dueDate as ISO string for backend
          const dueDates = newVaccination.dueDate
            ? [new Date(newVaccination.dueDate).toISOString()]
            : []

          if (dueDates.length === 0) {
            toast({
              title: "Error",
              description: "Due date is required for reminders",
              variant: "destructive",
            })
            setIsSaving(false)
            return
          }

          const response = await postJson<CreateVaccinationResponse>(
            "/api/animal-vaccination/add-animal-vaccinations",
            {
              animalIds: animals.map((a) => a.id),
              animalVaccinationVm: [{
                kindId: Number(newVaccination.kindId),
                reminder: true,
                dueDate: dueDates,
                notes: newVaccination.notes || "",
              }],
            }
          )

          if (!response.success) {
            throw new Error(response.message || response.errors?.[0] || "Failed to create reminder")
          }

          toast({
            title: "Success",
            description: response.message || "Vaccination reminder created successfully",
          })
        } else {
          // For completed vaccinations, reminder should always be false
          // The backend will automatically create a reminder if dueAgain is set
          const response = await createAnimalVaccinations({
            animalIds: animals.map((a) => a.id),
            kindId: Number(newVaccination.kindId),
            hospitalClinicId: Number(newVaccination.clinicId),
            actionDate: newVaccination.date,
            administerer: newVaccination.administerer || undefined,
            tagNumber: newVaccination.tagNo || undefined,
            vaccineManufacturer: newVaccination.vaccMfg || undefined,
            vaccineSerialNo: newVaccination.vaccSerialNo || undefined,
            notes: newVaccination.notes || undefined,
            dueAgain: dueAgainStr,
            reminder: false, // Always false for completed vaccinations - backend creates reminder if dueAgain is set
          })

          toast({
            title: "Success",
            description: response.message || "Vaccination created successfully",
          })
        }
      }

      setNewVaccination({
        kindId: "",
        date: getTodayDate(),
        dueDate: "",
        vaccSerialNo: "",
        clinicId: "",
        tagNo: "",
        administerer: "",
        dueAgain: false,
        dueAgainInterval: 0,
        dueAgainUnit: "days",
        vaccMfg: "",
        notes: "",
      })
      setValidationErrors({})
      onOpenChange(false)
      if (onSave) {
        onSave(false) // Not a reminder completion (for new vaccinations)
      }
    } catch (error: any) {
      console.error("Failed to save vaccination", error)
      const errorMessage = error?.message || error?.response?.data?.message || error?.response?.data?.errors?.[0] || "Failed to save vaccination. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectedKind = vaccinationTypes.find((t) => String(t.id) === newVaccination.kindId)
  const isTagNoEnabled = selectedKind?.kind?.toLowerCase().includes("rabies") || false

  const kindOptions = vaccinationTypes.map((type) => ({
    value: String(type.id),
    label: type.kind,
  }))

  const clinicOptions = clinics.map((clinic) => ({
    value: String(clinic.id),
    label: clinic.lastNameHospital || clinic.lastName || `${clinic.firstName} ${clinic.lastName}`.trim(),
  }))

  const isKindSelected = !!newVaccination.kindId
  const selectedKindLabel = selectedKind?.kind ?? ""
  const needsWiderModal = isKindSelected && selectedKindLabel.length > 22
  const lockKindSelection = Boolean(vaccination?.reminder)

  const title = isCompletingReminder
    ? "Complete Vaccination Reminder"
    : isReminder || vaccination?.reminder
      ? isEditMode
        ? "Edit Vaccination Reminder"
        : "Add New Vaccination Reminder"
      : isEditMode
        ? "Edit Completed Vaccination"
        : "Add New Completed Vaccination"

  const handleOpenAutoFocus = (event: Event) => {
    event.preventDefault()
    if (!isEditMode && showAddNewType) {
      requestAnimationFrame(() => {
        newTypeInputRef.current?.focus()
      })
      return
    }
    kindSelectRef.current?.focus()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${needsWiderModal ? "sm:max-w-3xl" : "sm:max-w-2xl"} max-h-[95vh] overflow-y-auto overflow-x-hidden p-4`}
        onOpenAutoFocus={handleOpenAutoFocus}
      >
        <DialogHeader className="pb-0 space-y-0">
          <DialogTitle className="text-2xl">{title}</DialogTitle>
        </DialogHeader>

        {animals.length > 0 && <SelectedAnimalsHeader animals={animals} className="mt-1" />}

        {isLoadingData && (
          <div className="text-center py-4 text-muted-foreground">Loading...</div>
        )}

        {/* Row 1: Kind and Date */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="w-full">
            <FloatingSelect
              ref={kindSelectRef}
              label={
                <span>
                  Kind <span className="text-red-500">*</span>
                </span>
              }
              value={newVaccination.kindId}
              onValueChange={(value) => {
                if (lockKindSelection) return
                if (value === "__add_new__") {
                  setShowAddNewType(true)
                } else {
                  setNewVaccination({ ...newVaccination, kindId: value })
                }
              }}
              error={validationErrors.kindId}
              className="w-full min-h-10"
              options={[
                ...kindOptions,
                { value: "__add_new__", label: "+ Add New Vaccination Type" },
              ]}
              disabled={isLoadingData || isCreatingType || lockKindSelection}
            />
            {showAddNewType && (
              <div className="mt-2 p-3 border rounded-lg bg-gray-50 space-y-2">
                <FloatingInput
                  ref={newTypeInputRef}
                  label="New Vaccination Type Name"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="e.g., Rabies, DHPP, etc."
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
          {isCompletingReminder || (!isReminder && !vaccination?.reminder) ? (
            <FloatingInput
              label="Action Date"
              type="date"
              value={newVaccination.date}
              onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
              error={validationErrors.date}
              required
              max={getTodayDate()}
            />
          ) : (
            <FloatingInput
              label="Due Date"
              type="date"
              value={newVaccination.dueDate}
              onChange={(e) => setNewVaccination({ ...newVaccination, dueDate: e.target.value })}
              error={validationErrors.dueDate}
              required
              min={getTodayDate()}
            />
          )}
        </div>

        {/* Row 2: Clinic and Administerer - only for completed vaccinations */}
        {(isCompletingReminder || (!isReminder && !vaccination?.reminder)) && (
          <div className="grid gap-3" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="w-full">
              <FloatingSelect
                label={
                  <span>
                    Clinic <span className="text-red-500">*</span>
                  </span>
                }
                value={newVaccination.clinicId}
                onValueChange={(value) => {
                  if (value === "__add_hospital__") {
                    shouldFocusNewHospitalInputRef.current = true
                    setShowAddHospital(true)
                  } else {
                    setNewVaccination({ ...newVaccination, clinicId: value })
                  }
                }}
                onCloseAutoFocus={(event) => {
                  if (!shouldFocusNewHospitalInputRef.current) return
                  event.preventDefault()
                  shouldFocusNewHospitalInputRef.current = false
                  requestAnimationFrame(() => {
                    newHospitalInputRef.current?.focus()
                  })
                }}
                className="w-full min-h-10"
                options={[
                  ...clinicOptions,
                  { value: "__add_hospital__", label: "+ Add New Hospital" },
                ]}
                error={validationErrors.clinicId}
                disabled={isLoadingData || isCreatingHospital}
              />
              {showAddHospital && (
                <div className="mt-2 p-3 border rounded-lg bg-gray-50 space-y-2">
                  <FloatingInput
                    ref={newHospitalInputRef}
                    label="New Hospital Name"
                    value={newHospitalName}
                    onChange={(e) => setNewHospitalName(e.target.value)}
                    placeholder="e.g., Animal Hospital, Vet Clinic, etc."
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
              label="Administerer"
              value={newVaccination.administerer}
              onChange={(e) => setNewVaccination({ ...newVaccination, administerer: e.target.value })}
            />
          </div>
        )}

        {/* Row 3: Vaccine Mfg and Vacc Serial No - only for completed vaccinations */}
        {(isCompletingReminder || (!isReminder && !vaccination?.reminder)) && (
          <div className="grid grid-cols-2 gap-3">
            <FloatingInput
              label="Vacc. Mfg."
              value={newVaccination.vaccMfg}
              onChange={(e) => setNewVaccination({ ...newVaccination, vaccMfg: e.target.value })}
            />
            <FloatingInput
              label="Vacc Serial No."
              value={newVaccination.vaccSerialNo}
              onChange={(e) => setNewVaccination({ ...newVaccination, vaccSerialNo: e.target.value })}
            />
          </div>
        )}

        {/* Row 4: Due Again and Tag No - only for completed vaccinations */}
        {(isCompletingReminder || (!isReminder && !vaccination?.reminder)) && (
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-end gap-2">
              <Checkbox
                id="dueAgain"
                checked={newVaccination.dueAgain}
                onCheckedChange={(checked) => {
                  const dueAgainChecked = checked as boolean
                  setNewVaccination((prev) => ({
                    ...prev,
                    dueAgain: dueAgainChecked,
                    ...(dueAgainChecked ? {} : { dueAgainInterval: 0, dueAgainUnit: "days" }),
                  }))
                  if (!dueAgainChecked) {
                    setValidationErrors((prev) => {
                      if (!prev.dueAgain) return prev
                      const { dueAgain: _dueAgain, ...rest } = prev
                      return rest
                    })
                  }
                }}
                className="mb-3"
              />
              <div
                className={`flex items-end gap-2 transition-opacity ${
                  newVaccination.dueAgain ? "opacity-100" : "opacity-50"
                }`}
              >
                <FloatingInput
                  type="number"
                  min={0}
                  label={
                    <span>
                      Due Again {newVaccination.dueAgain && <span className="text-red-500">*</span>}
                    </span>
                  }
                  value={newVaccination.dueAgain ? newVaccination.dueAgainInterval.toString() : ""}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "+" || e.key === "e" || e.key === "E") {
                      e.preventDefault()
                    }
                  }}
                  onChange={(e) => {
                    if (!newVaccination.dueAgain) return
                    const raw = e.target.value
                    if (raw === "") {
                      setNewVaccination({ ...newVaccination, dueAgainInterval: 0 })
                      return
                    }
                    const parsed = Number.parseInt(raw, 10)
                    if (Number.isNaN(parsed)) return
                    setNewVaccination({
                      ...newVaccination,
                      dueAgainInterval: Math.max(0, parsed),
                    })
                  }}
                  className="w-35"
                  disabled={!newVaccination.dueAgain}
                  error={validationErrors.dueAgain}
                  required={newVaccination.dueAgain}
                />
                <FloatingSelect
                  label="Interval"
                  value={newVaccination.dueAgainUnit}
                  onValueChange={(value) => {
                    if (!newVaccination.dueAgain) return
                    setNewVaccination({ ...newVaccination, dueAgainUnit: value })
                  }}
                  disabled={!newVaccination.dueAgain}
                  className="w-35 min-h-10"
                  options={[
                    { value: "days", label: "Days" },
                    { value: "weeks", label: "Weeks" },
                    { value: "months", label: "Months" },
                    { value: "years", label: "Years" },
                  ]}
                />
              </div>
            </div>
            <FloatingInput
              label="Tag No."
              value={newVaccination.tagNo}
              onChange={(e) => setNewVaccination({ ...newVaccination, tagNo: e.target.value })}
              disabled={!isTagNoEnabled}
            />
          </div>
        )}

        {/* Row 5: Notes */}
        <div>
          <FloatingTextarea
            label="Notes"
            value={newVaccination.notes}
            onChange={(e) => setNewVaccination({ ...newVaccination, notes: e.target.value })}
            rows={2}
            className="resize-none"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleSave} disabled={isSaving || isLoadingData}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
