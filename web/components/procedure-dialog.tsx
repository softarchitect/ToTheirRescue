import { useState, useEffect } from "react"
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
  updateAnimalProcedure,
  fetchHealthProcedures,
  fetchPCOHospitals,
  createHealthProcedure,
  createPCO,
  postJson,
  fetchAnimalWeightHistory,
  type AnimalProcedure,
  type HealthProcedure,
  type PCOHospital,
  type AnimalWeightHistory,
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { formatDateListDisplay, parseDateListInput } from "@/lib/date-input"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"

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

  const [procedureTypes, setProcedureTypes] = useState<HealthProcedure[]>([])
  const [clinics, setClinics] = useState<PCOHospital[]>([])
  const [weightHistory, setWeightHistory] = useState<AnimalWeightHistory[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [showAddNewType, setShowAddNewType] = useState(false)
  const [newTypeName, setNewTypeName] = useState("")
  const [isCreatingType, setIsCreatingType] = useState(false)
  const [showAddHospital, setShowAddHospital] = useState(false)
  const [newHospitalName, setNewHospitalName] = useState("")
  const [isCreatingHospital, setIsCreatingHospital] = useState(false)
  const [isFormTouched, setIsFormTouched] = useState(false)
  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
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

  const [microchipRequired, setMicrochipRequired] = useState(false)
  const [microchipDisabled, setMicrochipDisabled] = useState(true)
  const [weightRequired, setWeightRequired] = useState(false)

  // Check if we're completing a reminder (reminder exists but isReminder is false)
  const isCompletingReminder = procedure?.reminder && !isReminder

  // Load procedure types, clinics, and weight history
  useEffect(() => {
    if (open && animals.length > 0 && animals[0].animalTypeId) {
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
        weight: "", // Weight is usually recorded per action, not stored on the procedure object itself in the same way in the list? Old system has it in animalProcedureVm.
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

  const handleReminderDateBlur = () => {
    if (!reminderDateInput.trim()) {
      setReminderDates([])
      return
    }

    const parsed = parseDateListInput(reminderDateInput)
    if (!parsed) return

    setReminderDates(isEditMode ? parsed.slice(0, 1) : parsed)
  }

  const loadData = async () => {
    if (!animals.length || !animals[0].animalTypeId) return

    try {
      setIsLoadingData(true)
      const animalTypeId = Number(animals[0].animalTypeId)

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

  const updateFieldStatus = (kindId: string) => {
    const selectedType = procedureTypes.find(t => String(t.id) === kindId)
    if (!selectedType) return

    const kindName = selectedType.kind.toLowerCase().replace(/\s/g, '')
    const isMicrochipType = ['microchipcheck', 'microchipimplant'].includes(kindName)
    const isWeightType = ['weight', 'weights'].includes(kindName)

    setMicrochipDisabled(!isMicrochipType)
    setMicrochipRequired(kindName === 'microchipimplant')
    setWeightRequired(isWeightType)
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

    if (!animals.length || !animals[0].animalTypeId) return

    try {
      setIsCreatingType(true)
      const animalTypeId = Number(animals[0].animalTypeId)

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

    if (!newProcedure.kindId) {
      errors.kindId = "Kind is required"
    }

    if (isCompletingReminder || (!isReminder && !procedure?.reminder)) {
      if (!newProcedure.date) {
        errors.date = "Date is required"
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
    } else if (isReminder || procedure?.reminder) {
      if (reminderDates.length === 0) {
        errors.dueDate = "At least one due date is required for reminders"
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
            microchipNumber: newProcedure.microchipNumber || undefined,
            results: newProcedure.results || undefined,
            notes: newProcedure.notes || undefined,
            dueAgain: dueAgainStr,
            reminder: false,
          })

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
    if (isFormTouched) {
      setShowConfirmCancel(true)
    } else {
      onOpenChange(false)
    }
  }

  const handleConfirmCancel = () => {
    setIsFormTouched(false)
    setShowConfirmCancel(false)
    onOpenChange(false)
  }

  const isMultipleAnimals = animals.length > 1

  const kindOptions = procedureTypes.map((type) => {
    const kindName = type.kind.toLowerCase().replace(/\s/g, '')
    const isAnimalSpecific = ['microchipcheck', 'microchipimplant', 'weight', 'weights'].includes(kindName)
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

  const title = isCompletingReminder
    ? "Complete Procedure Reminder"
    : isReminder || procedure?.reminder
      ? isEditMode
        ? "Edit Procedure Reminder"
        : "Add New Procedure Reminder"
      : isEditMode
        ? "Edit Completed Procedure"
        : "Add New Completed Procedure"

  const weightHistoryContent = (
    <div className="w-64 p-2">
      <h4 className="font-semibold mb-2">Weight History</h4>
      <Separator className="mb-2" />
      {weightHistory.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {weightHistory.map((item) => (
            <div key={item.id} className="flex justify-between items-center text-sm">
              <span>{item.weight}</span>
              <Badge variant="secondary" className="text-xs">
                {new Date(item.actionDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
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
      <Dialog open={open} onOpenChange={handleCancel}>
        <DialogContent className="sm:max-w-3xl max-h-[95vh] overflow-y-auto p-6">
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
                  label={
                    <span>
                      Procedure, Test or Treatment <span className="text-red-500">*</span>
                    </span>
                  }
                  value={newProcedure.kindId}
                  onValueChange={(value) => {
                    setIsFormTouched(true)
                    if (value === "__add_new__") {
                      setShowAddNewType(true)
                    } else {
                      setNewProcedure({ ...newProcedure, kindId: value })
                      updateFieldStatus(value)
                    }
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
                      label="New Type Name"
                      value={newTypeName}
                      onChange={(e) => setNewTypeName(e.target.value)}
                      placeholder="e.g., Blood Work, X-Ray"
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
                />
              ) : (
                <div className="relative">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative cursor-pointer">
                        <FloatingInput
                          label="Due Date"
                          value={reminderDateInput}
                          onChange={(e) => setReminderDateInput(e.target.value)}
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
                          onChange={(e) => setNewHospitalName(e.target.value)}
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

      <CustomConfirmDialog
        open={showConfirmCancel}
        onOpenChange={setShowConfirmCancel}
        title="Unsaved Changes"
        message="You have unsaved changes. Do you want to save them before closing?"
        onConfirm={handleSave}
        confirmText="Save & Close"
        cancelText="Discard Changes"
      />
    </>
  )
}
