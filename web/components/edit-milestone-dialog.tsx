"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Animal, Milestone, MilestoneType } from "@/lib/types"
import type { AcquisitionWay, PCOOtherRescue } from "@/lib/api"
import { Calendar as CalendarIcon, Plus, X } from "lucide-react"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { SelectedAnimalsHeader } from "./selected-animals-header"
import { updateAnimalMilestone, fetchAcquisitionWays, fetchPCOOtherRescues, createAcquisitionWay, createPCOOtherRescue, type UpdateMilestonePayload } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { PCOSelectorWithPagination } from "@/components/milestone/pco-selector-with-pagination"

type BirthDateMode = "approximate" | "actual"

interface EditMilestoneDialogProps {
  animal?: Animal
  open: boolean
  onOpenChange: (open: boolean) => void
  milestone?: Milestone | null
  milestones?: Milestone[] // All milestones for date range calculation
  onSubmit?: (data: { date: string; notes: string; mode: BirthDateMode }) => void
  onSuccess?: () => void
}

export function EditMilestoneDialog({
  animal,
  open,
  onOpenChange,
  milestone,
  milestones = [],
  onSubmit,
  onSuccess,
}: EditMilestoneDialogProps) {
  const [mode, setMode] = useState<BirthDateMode>("approximate")
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dateInputRef = useRef<HTMLInputElement | null>(null)
  const { toast } = useToast()

  // Intake milestone fields
  const [acquisitionWayId, setAcquisitionWayId] = useState<number | undefined>(undefined)
  const [acquisitionWays, setAcquisitionWays] = useState<AcquisitionWay[]>([])
  const [isEditingHowAcquired, setIsEditingHowAcquired] = useState<boolean>(false)
  const [newHowAcquiredDraft, setNewHowAcquiredDraft] = useState("")
  const [otherRescueShelterId, setOtherRescueShelterId] = useState<number | undefined>(undefined)
  const [otherRescueShelters, setOtherRescueShelters] = useState<PCOOtherRescue[]>([])
  const [otherRescueID, setOtherRescueID] = useState<string>("")
  const [isEditingOtherRescue, setIsEditingOtherRescue] = useState<boolean>(false)
  const [newOtherRescueDraft, setNewOtherRescueDraft] = useState("")
  const [amountPaidFee, setAmountPaidFee] = useState<string>("")
  const [amountReceivedFee, setAmountReceivedFee] = useState<string>("")
  // PCO fields (for other milestones)
  const [selectedPCO, setSelectedPCO] = useState<string>("")

  // Calculate valid date range based on previous and next milestones (matching old system)
  const getValidDateRange = () => {
    if (!milestone || !milestones.length) {
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return {
        min: tenYearsAgo.toISOString().split("T")[0],
        max: tomorrow.toISOString().split("T")[0],
      }
    }

    // Find current milestone index in the list
    let currentIndex = -1
    milestones.forEach((m, i) => {
      if (m.id === milestone.id && m.type === milestone.type) {
        currentIndex = i
      }
    })

    if (currentIndex === -1) {
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      return {
        min: tenYearsAgo.toISOString().split("T")[0],
        max: tomorrow.toISOString().split("T")[0],
      }
    }

    // Get previous milestone date (minimum date - must be after this)
    const previousMilestone = currentIndex > 0 ? milestones[currentIndex - 1] : null
    let minDate = previousMilestone?.date
      ? new Date(previousMilestone.date)
      : new Date("1975-01-01")

    // Add 1 day to allow dates after the previous milestone
    minDate.setDate(minDate.getDate() + 1)

    // Get next milestone date (maximum date - must be before this)
    const nextMilestone = currentIndex < milestones.length - 1 ? milestones[currentIndex + 1] : null
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    let maxDate = nextMilestone?.date
      ? new Date(nextMilestone.date)
      : tomorrow

    // Subtract 1 day to allow dates before the next milestone
    maxDate.setDate(maxDate.getDate() - 1)

    // Ensure max date is not in the future
    const today = new Date()
    if (maxDate > today) {
      maxDate = new Date(today)
    }

    return {
      min: minDate.toISOString().split("T")[0],
      max: maxDate.toISOString().split("T")[0],
    }
  }

  const validDateRange = getValidDateRange()

  // Load acquisition ways and other rescue shelters for intake milestone
  useEffect(() => {
    if (open && milestone?.type === "Intake") {
      fetchAcquisitionWays().then(setAcquisitionWays).catch(console.error)
      fetchPCOOtherRescues().then(setOtherRescueShelters).catch(console.error)
    }
  }, [open, milestone?.type])

  useEffect(() => {
    setSelectedPCO("")
  }, [open])

  // Initialize form data when milestone changes
  useEffect(() => {
    if (milestone == null) return

    // Ensure date is in YYYY-MM-DD format for the date input
    const formattedMilestone = {
      ...milestone,
      date: milestone.date ? milestone.date.split("T")[0] : milestone.date,
    }
    setEditMilestone(formattedMilestone)

    // Set mode based on milestone type if it's a birth milestone
    if (milestone.type === "Birth") {
      // Use isApproxDOB from milestone data if available
      setMode(milestone.isApproxDOB ? "approximate" : "actual")
    }

    // Initialize form fields from milestone data
    if (open) {
      // Intake milestone fields
      if (milestone.type === "Intake") {
        setAcquisitionWayId(milestone.acquisitionWayId)
        setOtherRescueShelterId(milestone.otherRescueShelterId)
        setOtherRescueID(milestone.otherRescueIDNo || "")
        setAmountPaidFee(milestone.amountPaidFee ? String(milestone.amountPaidFee) : "")
        setAmountReceivedFee(milestone.amountReceivedFee ? String(milestone.amountReceivedFee) : "")
        if (milestone.pcoId) {
          setSelectedPCO(String(milestone.pcoId))
        }
      } else if (milestone.type !== "Birth") {
        // Other milestones
        setAmountPaidFee(milestone.amountPaidFee ? String(milestone.amountPaidFee) : "")
        if (milestone.pcoId) {
          setSelectedPCO(String(milestone.pcoId))
        }
        if (milestone.type === "Transfer") {
          setOtherRescueShelterId(milestone.otherRescueShelterId)
        }
      }
    } else {
      // Reset form when dialog closes
      setAcquisitionWayId(undefined)
      setOtherRescueShelterId(undefined)
      setOtherRescueID("")
      setAmountPaidFee("")
      setAmountReceivedFee("")
      setSelectedPCO("")
      setError(null)
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
    }
  }, [milestone, open])

  const handleClose = () => {
    setError(null)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleAddHowAcquired = async () => {
    // First click: switch the How Acquired field from dropdown to input mode
    if (!isEditingHowAcquired) {
      setIsEditingHowAcquired(true)
      setNewHowAcquiredDraft("")
      return
    }

    // Second click (while in input mode): save the new acquisition way
    const trimmed = newHowAcquiredDraft.trim()
    if (!trimmed) {
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
      return
    }

    try {
      // Create the new acquisition way via API
      const newAcquisitionWay = await createAcquisitionWay(trimmed)
      // Update local state with the new acquisition way (includes ID from backend)
      setAcquisitionWays((prev) => {
        // Check if already exists by name
        if (prev.some((w) => w.acquisitionWayName === trimmed)) return prev
        return [...prev, {
          id: newAcquisitionWay.id,
          acquisitionWayName: newAcquisitionWay.acquisitionWayName,
        }]
      })
      // Store the ID for backend submission
      setAcquisitionWayId(Number(newAcquisitionWay.id))
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
    } catch (error) {
      console.error("Failed to create acquisition way", error)
      // On error, still add to local state but without ID (will be sent as name)
      const fallbackWay: AcquisitionWay = {
        id: `temp-${Date.now()}`,
        acquisitionWayName: trimmed,
      }
      setAcquisitionWays((prev) => {
        if (prev.some((w) => w.acquisitionWayName === trimmed)) return prev
        return [...prev, fallbackWay]
      })
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
    }
  }

  const handleAddOtherRescue = async () => {
    // First click: switch the Other Rescue field from dropdown to input mode
    if (!isEditingOtherRescue) {
      setIsEditingOtherRescue(true)
      setNewOtherRescueDraft("")
      return
    }

    // Second click (while in input mode): save the new rescue
    const trimmed = newOtherRescueDraft.trim()
    if (!trimmed) {
      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
      return
    }

    try {
      // Create the new rescue via API
      const newRescue = await createPCOOtherRescue(trimmed)
      // Refresh the list of rescues
      const updatedRescues = await fetchPCOOtherRescues()
      setOtherRescueShelters(updatedRescues)
      // Set the newly created rescue as selected
      if (newRescue && newRescue.id) {
        setOtherRescueShelterId(newRescue.id)
      }
      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
    } catch (error) {
      console.error("Failed to create other rescue", error)
      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
    }
  }

  const handleUpdate = async () => {
    if (!editMilestone || !editMilestone.id) {
      setError("Milestone data is missing")
      return
    }

    if (!editMilestone.date) {
      setError("Date is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Convert date to ISO format if it's just a date string
      let milestoneDate = editMilestone.date
      if (!milestoneDate.includes("T")) {
        milestoneDate = `${milestoneDate}T00:00:00`
      }

      const milestoneType = editMilestone.type.toLowerCase()
      let payload: UpdateMilestonePayload

      if (milestoneType === "intake") {
        // Intake milestone payload
        const acquisitionWay = acquisitionWays.find(aw => aw.id === acquisitionWayId)
        const requiresPCO = ["Owner Surrender", "Public Surrender"].includes(acquisitionWay?.acquisitionWayName || "")

        payload = {
          milestoneType: editMilestone.type as MilestoneType,
          milestoneDate: milestoneDate,
          isApproxDOB: false, // Intake doesn't use this
          otherRescueIDNo: otherRescueID || "",
          acquisitionWayId: acquisitionWayId,
          acquisitionWayName: acquisitionWay?.acquisitionWayName || "",
          otherRescueShelterId: otherRescueShelterId || 0,
          amountPaidFee: amountPaidFee ? parseFloat(amountPaidFee) : 0,
          amountReceivedFee: amountReceivedFee ? parseFloat(amountReceivedFee) : 0,
          notes: editMilestone.notes || "",
          pcoId: requiresPCO && selectedPCO ? Number(selectedPCO) : 0,
        }
      } else if (milestoneType === "birth") {
        // Birth milestone payload
        payload = {
          milestoneType: editMilestone.type as MilestoneType,
          milestoneDate: milestoneDate,
          isApproxDOB: mode === "approximate",
          notes: editMilestone.notes || "",
        }
      } else {
        // Other milestones payload
        const requiresPCO = !["Adoption Return", "Foster Return", "Lost", "Found", "Released", "Reintake", "Death", "Transfer"].includes(editMilestone.type)
        const requiresAmount = !["Lost", "Found", "Released", "Reintake", "Death", "Foster", "Foster Return"].includes(editMilestone.type)

        payload = {
          milestoneType: editMilestone.type as MilestoneType,
          milestoneDate: milestoneDate,
          isApproxDOB: false,
          notes: editMilestone.notes || "",
          pcoId: requiresPCO && selectedPCO ? Number(selectedPCO) : (editMilestone.type === "Adoption Return" || editMilestone.type === "Foster Return" ? Number(animal?.id || 0) : 0),
          amountPaidFee: requiresAmount && amountPaidFee ? parseFloat(amountPaidFee) : 0,
          otherRescueShelterId: editMilestone.type === "Transfer" && otherRescueShelterId ? otherRescueShelterId : 0,
        }
      }

      await updateAnimalMilestone(editMilestone.id, payload)

      toast({
        title: "Success",
        description: "Milestone updated successfully",
        variant: "success",
      })

      if (onSubmit && milestone?.type === "Birth") {
        onSubmit({
          date: editMilestone.date,
          notes: editMilestone.notes || "",
          mode,
        })
      }

      if (onSuccess) {
        onSuccess()
      }

      onOpenChange(false)
    } catch (err: any) {
      setError(err?.message || "Failed to update milestone")
      console.error("Failed to update milestone:", err)
    } finally {
      setIsLoading(false)
    }
  }


  const milestoneType = milestone?.type?.toLowerCase() || ""
  const isBirth = milestoneType === "birth"
  const isIntake = milestoneType === "intake"
  const isOther = !isBirth && !isIntake

  // Determine if PCO is required for other milestones
  const requiresPCO = isOther && !["Adoption Return", "Foster Return", "Lost", "Found", "Released", "Reintake", "Death", "Transfer"].includes(milestone?.type || "")
  const requiresAmount = isOther && !["Lost", "Found", "Released", "Reintake", "Death", "Foster", "Foster Return"].includes(milestone?.type || "")
  const isTransfer = milestone?.type === "Transfer"

  // For intake milestone, check if PCO is required based on acquisition way
  const selectedAcquisitionWay = acquisitionWays.find(aw => aw.id === acquisitionWayId)
  const intakeRequiresPCO = isIntake && ["Owner Surrender", "Public Surrender"].includes(selectedAcquisitionWay?.acquisitionWayName || "")
  const intakeRequiresOtherRescue = isIntake && selectedAcquisitionWay?.acquisitionWayName === "Other Shelter/Rescue/Sanctuary"

  const formattedLabel = mode === "approximate" ? "Approximate Birth Date" : "Actual Birth Date"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-w-2xl overflow-y-auto p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold">Edit {milestone?.type} Milestone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animal ? [animal] : []} />

          {/* Birth Milestone Form */}
          {isBirth && (
            <div className="space-y-4 mt-4">
              <Tabs
                value={mode}
                onValueChange={(value) => setMode(value as BirthDateMode)}
                className="w-full"
              >
                <TabsList>
                  <TabsTrigger value="approximate">Approximate Birth Date</TabsTrigger>
                  <TabsTrigger value="actual">Actual Birth Date</TabsTrigger>
                </TabsList>
                <TabsContent value="approximate" />
                <TabsContent value="actual" />
              </Tabs>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)]">
                <div>
                  <div className="relative max-w-xs">
                    <FloatingInput
                      ref={dateInputRef}
                      id="birthDate"
                      label={formattedLabel}
                      type="date"
                      value={editMilestone?.date}
                      min={validDateRange.min}
                      max={validDateRange.max}
                      onChange={(e) => {
                        const selectedDate = e.target.value
                        const selectedDateObj = new Date(selectedDate + "T00:00:00")
                        const minDateObj = new Date(validDateRange.min + "T00:00:00")
                        const maxDateObj = new Date(validDateRange.max + "T00:00:00")

                        if (selectedDateObj < minDateObj || selectedDateObj > maxDateObj) {
                          const minFormatted = minDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          const maxFormatted = maxDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                          setError(`Date must be between ${minFormatted} and ${maxFormatted} (exclusive)`)
                          return
                        }
                        setEditMilestone({ ...editMilestone, date: selectedDate } as Milestone)
                        setError(null)
                      }}
                      aria-invalid={!!error}
                      className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:appearance-none"
                      error={error || undefined}
                      required
                    />
                    <CalendarIcon
                      className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
                      onClick={() => {
                        const input = dateInputRef.current
                        if (!input) return
                        const anyInput = input as HTMLInputElement & { showPicker?: () => void }
                        if (typeof anyInput.showPicker === "function") {
                          anyInput.showPicker()
                        } else {
                          input.focus()
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <FloatingTextarea
                  id="birthNotes"
                  label="Birth Notes"
                  value={editMilestone?.notes || ""}
                  onChange={(e) => setEditMilestone({ ...editMilestone, notes: e.target.value } as Milestone)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          )}

          {/* Intake Milestone Form */}
          {isIntake && (
            <div className="space-y-4 mt-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FloatingInput
                  id="intakeDate"
                  label="Date of Intake"
                  type="date"
                  value={editMilestone?.date}
                  min={validDateRange.min}
                  max={validDateRange.max}
                  onChange={(e) => {
                    setEditMilestone({ ...editMilestone, date: e.target.value } as Milestone)
                    setError(null)
                  }}
                  required
                  error={error || undefined}
                />

                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    {isEditingHowAcquired ? (
                      <FloatingInput
                        id="howAcquired"
                        label="New How Acquired"
                        value={newHowAcquiredDraft}
                        className="gap-1.5 min-h-10 px-3 bg-transparent w-full"
                        onChange={(e) => {
                          const value = e.target.value
                          const normalized =
                            value.length > 0
                              ? value.charAt(0).toUpperCase() + value.slice(1)
                              : value
                          setNewHowAcquiredDraft(normalized)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddHowAcquired()
                          }
                        }}
                        required
                      />
                    ) : (
                      <FloatingSelect
                        id="howAcquired"
                        label="How Acquired"
                        value={acquisitionWayId ? String(acquisitionWayId) : ""}
                        className="gap-1.5 min-h-10 px-3 bg-transparent w-full"
                        onValueChange={(value) => {
                          setAcquisitionWayId(value ? Number(value) : undefined)
                          setError(null)
                        }}
                      >
                        {acquisitionWays.length > 0 ? (
                          acquisitionWays.map((option) => (
                            <SelectItem key={String(option.id)} value={String(option.id)}>
                              {option.acquisitionWayName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="0">
                            No acquisition ways available
                          </SelectItem>
                        )}
                      </FloatingSelect>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10"
                    onClick={handleAddHowAcquired}
                  >
                    {isEditingHowAcquired ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {intakeRequiresPCO && (
                <PCOSelectorWithPagination
                  selectedPCO={selectedPCO}
                  onSelectPCO={setSelectedPCO}
                  existingPCOName={milestone?.firstName || milestone?.lastName ? [milestone.firstName, milestone.lastName].filter(Boolean).join(" ") : null}
                  initialPCOId={milestone?.pcoId}
                />
              )}

              {intakeRequiresOtherRescue && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      {isEditingOtherRescue ? (
                        <FloatingInput
                          id="otherRescueShelterSanctuary"
                          label="New Other Rescue/S..."
                          value={newOtherRescueDraft}
                          className="gap-1.5 min-h-10 px-3 bg-transparent w-full"
                          onChange={(e) => {
                            const value = e.target.value
                            const normalized =
                              value.length > 0
                                ? value.charAt(0).toUpperCase() + value.slice(1)
                                : value
                            setNewOtherRescueDraft(normalized)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddOtherRescue()
                            }
                          }}
                          required
                        />
                      ) : (
                        <FloatingSelect
                          id="otherRescueShelterSanctuary"
                          label="Other Rescue/Shelter/Sanctuary"
                          value={otherRescueShelterId ? String(otherRescueShelterId) : ""}
                          className="gap-1.5 min-h-10 px-3 bg-transparent w-full"
                          onValueChange={(value) => {
                            setOtherRescueShelterId(value ? Number(value) : undefined)
                            setError(null)
                          }}
                        >
                          {otherRescueShelters.length > 0 ? (
                            otherRescueShelters.map((rescue) => (
                              <SelectItem key={rescue.id} value={String(rescue.id)}>
                                {rescue.lastNameOtherRescue}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="0" disabled>
                              No rescues available
                            </SelectItem>
                          )}
                        </FloatingSelect>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 mt-0"
                      onClick={handleAddOtherRescue}
                    >
                      {isEditingOtherRescue ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </Button>
                  </div>
                  <FloatingInput
                    id="idNoUsedAtOtherRescue"
                    label="ID No. Used at other rescue"
                    value={otherRescueID}
                    className="gap-1.5 h-10 px-3 bg-transparent w-full"
                    onChange={(e) => setOtherRescueID(e.target.value)}
                    placeholder="ID No. used at other rescue"
                  />
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <FloatingInput
                  id="amountPaidFee"
                  label="Paid Amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountPaidFee}
                  onChange={(e) => {
                    setAmountPaidFee(e.target.value)
                    if (e.target.value) setAmountReceivedFee("")
                  }}
                  disabled={!!amountReceivedFee}
                  placeholder="0.00"
                />
                <FloatingInput
                  id="amountReceivedFee"
                  label="Received Amount "
                  type="number"
                  step="0.01"
                  min="0"
                  value={amountReceivedFee}
                  onChange={(e) => {
                    setAmountReceivedFee(e.target.value)
                    if (e.target.value) setAmountPaidFee("")
                  }}
                  disabled={!!amountPaidFee}
                  placeholder="0.00"
                />
              </div>

              <FloatingTextarea
                id="intakeNotes"
                label="Intake Notes"
                value={editMilestone?.notes || ""}
                onChange={(e) => setEditMilestone({ ...editMilestone, notes: e.target.value } as Milestone)}
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          {/* Other Milestones Form */}
          {isOther && (
            <div className="space-y-4 mt-4">
              {/* Show existing PCO info for Adoption Return and Foster Return */}
              {(milestone?.type === "Adoption Return" || milestone?.type === "Foster Return") && (() => {
                // Find the original Adoption or Foster milestone
                const originalMilestoneType = milestone?.type === "Adoption Return" ? "Adoption" : "Foster"
                const originalMilestone = milestones.find(m => m.type === originalMilestoneType)

                // Get the name from the original milestone
                const adopterName = originalMilestone?.firstName || originalMilestone?.lastName
                  ? [originalMilestone.firstName, originalMilestone.lastName].filter(Boolean).join(" ")
                  : originalMilestone?.lastName || originalMilestone?.firstName || animal?.location || "No PCO information available"

                return (
                  <div className="bg-muted/30 p-3 flex items-center gap-2 rounded-lg">
                    <p className="text-sm font-medium">
                      {milestone?.type === "Adoption Return" ? "Adopted By:" : "Fostered By:"}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {adopterName}
                      </p>
                    </div>
                  </div>
                )
              })()}

              {requiresPCO && (
                <PCOSelectorWithPagination
                  headerText={
                    milestone?.type === "Adoption" ? "Adopted By:" :
                      milestone?.type === "Foster" ? "Fostered By:" :
                        milestone?.type === "Returned to Owner" ? "Returned to:" :
                          milestone?.type === "Transfer" ? "Transferred to:" :
                            "Person/Company/Organization:"
                  }
                  selectedPCO={selectedPCO}
                  onSelectPCO={setSelectedPCO}
                  existingPCOName={milestone?.firstName || milestone?.lastName ? [milestone.firstName, milestone.lastName].filter(Boolean).join(" ") : null}
                  initialPCOId={milestone?.pcoId}
                />
              )}

              {isTransfer && (
                <div className="flex items-start gap-2">
                  <div className="flex-1">
                    {isEditingOtherRescue ? (
                      <FloatingInput
                        id="otherRescueShelterSanctuary"
                        label="New Other Rescue/S..."
                        value={newOtherRescueDraft}
                        className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                        onChange={(e) => {
                          const value = e.target.value
                          const normalized =
                            value.length > 0
                              ? value.charAt(0).toUpperCase() + value.slice(1)
                              : value
                          setNewOtherRescueDraft(normalized)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddOtherRescue()
                          }
                        }}
                        required
                      />
                    ) : (
                      <FloatingSelect
                        id="otherRescueShelterSanctuary"
                        label="Other Rescue/Shelter/Sanctuary"
                        value={otherRescueShelterId ? String(otherRescueShelterId) : ""}
                        className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                        onValueChange={(value) => {
                          setOtherRescueShelterId(value ? Number(value) : undefined)
                          setError(null)
                        }}
                      >
                        {otherRescueShelters.length > 0 ? (
                          otherRescueShelters.map((rescue) => (
                            <SelectItem key={rescue.id} value={String(rescue.id)}>
                              {rescue.lastNameOtherRescue}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="0" disabled>
                            No rescues available
                          </SelectItem>
                        )}
                      </FloatingSelect>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-15 w-10 mt-0"
                    onClick={handleAddOtherRescue}
                  >
                    {isEditingOtherRescue ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <FloatingInput
                  id="milestoneDate"
                  label="Milestone Date"
                  type="date"
                  value={editMilestone?.date}
                  min={validDateRange.min}
                  max={validDateRange.max}
                  onChange={(e) => {
                    setEditMilestone({ ...editMilestone, date: e.target.value } as Milestone)
                    setError(null)
                  }}
                  required
                  error={error || undefined}
                />

                {requiresAmount && (
                  <FloatingInput
                    id="amountPaidFee"
                    label={
                      milestone?.type === "Adoption" ? "Adoption Fee (if any)" :
                        milestone?.type === "Adoption Return" ? "Refund Amount (if any)" :
                          "Amount (if any)"
                    }
                    type="number"
                    step="0.01"
                    min="0"
                    value={amountPaidFee}
                    onChange={(e) => setAmountPaidFee(e.target.value)}
                    placeholder="0.00"
                  />
                )}
              </div>

              <FloatingTextarea
                id="notes"
                label="Notes"
                value={editMilestone?.notes || ""}
                onChange={(e) => setEditMilestone({ ...editMilestone, notes: e.target.value } as Milestone)}
                rows={4}
                className="resize-none"
              />
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isLoading || !editMilestone}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
