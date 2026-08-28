"use client"

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HelpCircle, CalendarIcon } from "lucide-react"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import {
  createPrescriptions,
  createPCO,
  fetchMedicines,
  fetchPCOHospitals,
  type Medicine,
  type PCOHospital,
  type PrescriptionDTO,
} from "@/lib/api"
import { formatIsoDateForTenant, getTenantDatePattern } from "@/lib/date-format"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface PrescriptionDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (items: PrescriptionDTO[]) => void
}

type DurationMode = "for" | "until"
type DurationUnit = "days" | "weeks" | "months"

const UNTIL_OPTIONS = [
  { value: "until otherwise directed", label: "Until Otherwise Directed" },
  { value: "stop reminder creation", label: "Stop Reminder Creation" },
]

const DEFAULT_UNTIL_OPTION = UNTIL_OPTIONS[0].value

const DURATION_UNIT_OPTIONS = [
  { value: "days", label: "Days" },
  { value: "weeks", label: "Weeks" },
  { value: "months", label: "Months" },
]

function getTodayIsoDate(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const d = String(now.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function FieldLabel({
  children,
  required,
  htmlFor,
}: {
  children: ReactNode
  required?: boolean
  htmlFor?: string
}) {
  return (
    <Label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
      {children}
      {required ? <span className="text-red-500">*</span> : null}
    </Label>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="text-xs text-red-500">{message}</p>
}

export function buildPrescriptionText(params: {
  medicineName: string
  dosage?: string
  timesADay: number
  durationMode: DurationMode
  durationValue: number
  durationUnit: DurationUnit
  untilOption: string
  startDate: string
}): string {
  const medicine = params.medicineName.trim()
  const dosage = (params.dosage || "").trim()
  const times = Math.max(1, params.timesADay)
  const startLabel = formatIsoDateForTenant(params.startDate) || params.startDate

  const parts: string[] = [medicine]
  if (dosage) parts.push(dosage)
  parts.push(`${times} time(s) a day`)

  if (params.durationMode === "for") {
    const unit = params.durationUnit.replace(/s$/, "")
    parts.push(`every day for ${Math.max(1, params.durationValue)} ${unit}(s)`)
  } else {
    const option = UNTIL_OPTIONS.find((o) => o.value === params.untilOption)
    parts.push(`every day, ${option?.label ?? UNTIL_OPTIONS[0].label}`)
  }

  parts.push(`beginning on ${startLabel}`)
  return parts.join(", ")
}

export function PrescriptionDialog({
  animals,
  open,
  onOpenChange,
  onSaved,
}: PrescriptionDialogProps) {
  const { toast } = useToast()
  const [clinics, setClinics] = useState<PCOHospital[]>([])
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [clinicId, setClinicId] = useState("")
  const [prescribingVet, setPrescribingVet] = useState("")
  const [medicineId, setMedicineId] = useState("")
  const [otherMedicineEnabled, setOtherMedicineEnabled] = useState(false)
  const [otherMedicine, setOtherMedicine] = useState("")
  const [dosage, setDosage] = useState("")
  const [timesADay, setTimesADay] = useState("1")
  const [durationMode, setDurationMode] = useState<DurationMode>("for")
  const [durationValue, setDurationValue] = useState("1")
  const [durationUnit, setDurationUnit] = useState<DurationUnit>("days")
  const [untilOption, setUntilOption] = useState(DEFAULT_UNTIL_OPTION)
  const [startDate, setStartDate] = useState(getTodayIsoDate())
  const [specialInstructions, setSpecialInstructions] = useState("")
  const [showAddHospital, setShowAddHospital] = useState(false)
  const [newHospitalName, setNewHospitalName] = useState("")
  const [isCreatingHospital, setIsCreatingHospital] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasAttemptedSave, setHasAttemptedSave] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingText, setPendingText] = useState("")

  const clinicOptions = useMemo(
    () =>
      clinics.map((clinic) => ({
        value: String(clinic.id),
        label:
          clinic.lastNameHospital ||
          clinic.lastName ||
          `${clinic.firstName} ${clinic.lastName}`.trim(),
      })),
    [clinics],
  )

  const medicineOptions = useMemo(
    () =>
      medicines.map((med) => ({
        value: String(med.id),
        label: med.medicineName,
      })),
    [medicines],
  )

  const selectedClinicName = useMemo(() => {
    const match = clinics.find((c) => String(c.id) === clinicId)
    if (!match) return ""
    return (
      match.lastNameHospital ||
      match.lastName ||
      `${match.firstName} ${match.lastName}`.trim()
    )
  }, [clinics, clinicId])

  const selectedMedicineName = useMemo(() => {
    if (otherMedicineEnabled) return otherMedicine.trim()
    const match = medicines.find((m) => String(m.id) === medicineId)
    return match?.medicineName?.trim() || ""
  }, [otherMedicineEnabled, otherMedicine, medicines, medicineId])

  const resetState = () => {
    setClinicId("")
    setPrescribingVet("")
    setMedicineId("")
    setOtherMedicineEnabled(false)
    setOtherMedicine("")
    setDosage("")
    setTimesADay("1")
    setDurationMode("for")
    setDurationValue("1")
    setDurationUnit("days")
    setUntilOption(DEFAULT_UNTIL_OPTION)
    setStartDate(getTodayIsoDate())
    setSpecialInstructions("")
    setShowAddHospital(false)
    setNewHospitalName("")
    setErrors({})
    setHasAttemptedSave(false)
    setConfirmOpen(false)
    setPendingText("")
  }

  useEffect(() => {
    if (!open) return

    const load = async () => {
      try {
        const [hospitals, meds] = await Promise.all([
          fetchPCOHospitals(),
          fetchMedicines(),
        ])
        setClinics(hospitals)
        setMedicines(meds)
      } catch (error) {
        console.error("Failed to load prescription form data", error)
        toast({
          title: "Error",
          description: "Failed to load clinics or medicines",
          variant: "destructive",
        })
      }
    }

    load()
    resetState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const computeErrors = useCallback((): Record<string, string> => {
    const next: Record<string, string> = {}
    const times = Number(timesADay)
    const duration = Number(durationValue)

    if (!clinicId) next.clinicId = "Clinic is required"
    if (otherMedicineEnabled) {
      if (!otherMedicine.trim()) next.otherMedicine = "Other medicine is required"
    } else if (!medicineId) {
      next.medicineId = "Medicine is required"
    }
    if (!Number.isFinite(times) || times < 1) {
      next.timesADay = "Times a day must be at least 1"
    }
    if (durationMode === "for" && (!Number.isFinite(duration) || duration < 1)) {
      next.durationValue = "Duration is required"
    }
    if (durationMode === "until" && !untilOption) {
      next.untilOption = "Until option is required"
    }
    if (!startDate) next.startDate = "Start date is required"

    return next
  }, [
    clinicId,
    medicineId,
    otherMedicine,
    otherMedicineEnabled,
    timesADay,
    durationMode,
    durationValue,
    untilOption,
    startDate,
  ])

  // Once the user has tried to save, keep messages in sync as fields are corrected.
  useEffect(() => {
    if (!hasAttemptedSave) return
    setErrors(computeErrors())
  }, [hasAttemptedSave, computeErrors])

  const validate = (): boolean => {
    const next = computeErrors()
    setErrors(next)
    setHasAttemptedSave(true)
    return Object.keys(next).length === 0
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
        (c) => c.lastName.toLowerCase() === newHospitalName.trim().toLowerCase(),
      )
      if (existing) {
        toast({
          title: "Error",
          description: "This hospital already exists",
          variant: "destructive",
        })
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
      setClinicId(String(newHospital.id))
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
        description: error.message || "Failed to create hospital",
        variant: "destructive",
      })
    } finally {
      setIsCreatingHospital(false)
    }
  }

  const handleSaveClick = () => {
    if (!animals.length) {
      onOpenChange(false)
      return
    }
    if (!validate()) return

    const text = buildPrescriptionText({
      medicineName: selectedMedicineName,
      dosage,
      timesADay: Number(timesADay),
      durationMode,
      durationValue: Number(durationValue) || 1,
      durationUnit,
      untilOption,
      startDate,
    })
    setPendingText(text)
    setConfirmOpen(true)
  }

  const handleConfirmYes = async () => {
    if (!animals.length || !pendingText) return

    try {
      setIsSaving(true)
      const items = await createPrescriptions({
        animalIds: animals.map((a) => a.id),
        prescriptionText: pendingText,
        clinic: selectedClinicName,
        veterinarian: prescribingVet.trim() || undefined,
        medicineName: selectedMedicineName,
        dosage: dosage.trim() || undefined,
        timesADay: Number(timesADay) || 1,
        durationMode,
        durationValue: Number(durationValue) || 1,
        durationUnit,
        untilOption: durationMode === "until" ? untilOption : undefined,
        startDate,
        specialInstructions: specialInstructions.trim() || undefined,
      })

      toast({
        title: "Success",
        description: "Prescription saved successfully",
        variant: "success",
      })

      onSaved?.(items)
      setConfirmOpen(false)
      onOpenChange(false)
      resetState()
    } catch (error) {
      console.error("Failed to save prescription", error)
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save prescription",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const selectTriggerClass = "h-9 w-full"

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            setConfirmOpen(false)
            resetState()
          }
          onOpenChange(next)
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto overflow-x-hidden sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Prescription</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 min-w-0">
            <SelectedAnimalsHeader animals={animals} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 min-w-0">
              <div className="space-y-4 min-w-0">
                <div className="space-y-1.5">
                  <FieldLabel required>Clinic</FieldLabel>
                  {!showAddHospital ? (
                    <Select
                      value={clinicId || undefined}
                      onValueChange={(value) => {
                        if (value === "__add_hospital__") {
                          setShowAddHospital(true)
                          setClinicId("")
                        } else {
                          setClinicId(value)
                        }
                      }}
                    >
                      <SelectTrigger
                        className={cn(selectTriggerClass, errors.clinicId && "border-red-500")}
                      >
                        <SelectValue placeholder="Select clinic" />
                      </SelectTrigger>
                      <SelectContent>
                        {clinicOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                        <SelectItem value="__add_hospital__">+ Add New Hospital</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="New hospital name"
                        value={newHospitalName}
                        onChange={(e) => setNewHospitalName(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddHospital}
                          disabled={isCreatingHospital}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Add
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowAddHospital(false)
                            setNewHospitalName("")
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  <FieldError message={errors.clinicId} />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor="prescribing-vet">Prescribing Vet</FieldLabel>
                  <Input
                    id="prescribing-vet"
                    placeholder="Optional"
                    value={prescribingVet}
                    onChange={(e) => setPrescribingVet(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel required>Medicine</FieldLabel>
                  <Select
                    value={medicineId || undefined}
                    onValueChange={(value) => {
                      setMedicineId(value)
                      setOtherMedicineEnabled(false)
                    }}
                    disabled={otherMedicineEnabled}
                  >
                    <SelectTrigger
                      className={cn(selectTriggerClass, errors.medicineId && "border-red-500")}
                    >
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicineOptions.length ? (
                        medicineOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-3 text-sm text-muted-foreground">
                          No medicines yet. Add them in Customization → Medicines.
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <FieldError message={errors.medicineId} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="other-medicine"
                      checked={otherMedicineEnabled}
                      onCheckedChange={(checked) => {
                        const enabled = checked === true
                        setOtherMedicineEnabled(enabled)
                        if (enabled) setMedicineId("")
                      }}
                    />
                    <Input
                      id="other-medicine-input"
                      placeholder="Other medicine"
                      value={otherMedicine}
                      onChange={(e) => setOtherMedicine(e.target.value)}
                      disabled={!otherMedicineEnabled}
                      className={cn(errors.otherMedicine && "border-red-500")}
                    />
                  </div>
                  <FieldError message={errors.otherMedicine} />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor="dosage">Dosage Concentration</FieldLabel>
                  <Input
                    id="dosage"
                    placeholder="Optional"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor="times-a-day" required>
                    Times a day
                  </FieldLabel>
                  <Input
                    id="times-a-day"
                    type="number"
                    min={1}
                    value={timesADay}
                    onChange={(e) => setTimesADay(e.target.value)}
                    className={cn("max-w-[140px]", errors.timesADay && "border-red-500")}
                  />
                  <FieldError message={errors.timesADay} />
                </div>
              </div>

              <div className="space-y-4 min-w-0">
                <div className="space-y-2">
                  <FieldLabel required={durationMode === "for"}>Duration</FieldLabel>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={durationMode === "for" ? "default" : "outline"}
                      className={cn(
                        "w-14 shrink-0",
                        durationMode === "for" && "bg-emerald-600 hover:bg-emerald-700 text-white",
                      )}
                      onClick={() => setDurationMode("for")}
                    >
                      For
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      value={durationValue}
                      onChange={(e) => {
                        setDurationMode("for")
                        setDurationValue(e.target.value)
                      }}
                      className={cn(
                        "w-20 shrink-0",
                        durationMode === "for" && errors.durationValue && "border-red-500",
                      )}
                    />
                    <Select
                      value={durationUnit}
                      onValueChange={(value) => {
                        setDurationMode("for")
                        setDurationUnit(value as DurationUnit)
                      }}
                    >
                      <SelectTrigger className={cn(selectTriggerClass, "flex-1")}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DURATION_UNIT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {durationMode === "for" ? <FieldError message={errors.durationValue} /> : null}

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={durationMode === "until" ? "default" : "outline"}
                      className={cn(
                        "w-14 shrink-0",
                        durationMode === "until" && "bg-emerald-600 hover:bg-emerald-700 text-white",
                      )}
                      onClick={() => setDurationMode("until")}
                    >
                      Or
                    </Button>
                    <Select
                      value={untilOption}
                      onValueChange={(value) => {
                        setDurationMode("until")
                        setUntilOption(value)
                      }}
                    >
                      <SelectTrigger
                        className={cn(
                          selectTriggerClass,
                          "flex-1",
                          durationMode === "until" && errors.untilOption && "border-red-500",
                        )}
                      >
                        <SelectValue placeholder="Until..." />
                      </SelectTrigger>
                      <SelectContent>
                        {UNTIL_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {durationMode === "until" ? <FieldError message={errors.untilOption} /> : null}
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor="start-date" required>
                    Start Date
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className={cn("pr-10", errors.startDate && "border-red-500")}
                    />
                    <input
                      type="date"
                      tabIndex={-1}
                      aria-hidden="true"
                      className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0 cursor-pointer"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format: {getTenantDatePattern().toUpperCase()}
                  </p>
                  <FieldError message={errors.startDate} />
                </div>

                <div className="space-y-1.5">
                  <FieldLabel htmlFor="special-instructions">Special Instructions</FieldLabel>
                  <Textarea
                    id="special-instructions"
                    placeholder="Optional"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={7}
                    className="resize-y min-h-[140px]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveClick}
                disabled={isSaving || !animals.length}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4 items-start">
            <div className="shrink-0 mt-0.5">
              <HelpCircle className="h-10 w-10 text-sky-600" />
            </div>
            <div className="space-y-3">
              <p className="text-base text-foreground">{pendingText}</p>
              <p className="text-base font-medium">Is this correct?</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isSaving}
            >
              No
            </Button>
            <Button
              onClick={handleConfirmYes}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
