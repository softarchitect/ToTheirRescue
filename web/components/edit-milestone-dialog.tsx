"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type Column } from "@/components/ui/data-table"
import type { Animal, Milestone, MilestoneType, PCO } from "@/lib/types"
import type { AcquisitionWay, PCOOtherRescue } from "@/lib/api"
import { Calendar as CalendarIcon, Search, Plus, DollarSign, X } from "lucide-react"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { SelectedAnimalsHeader } from "./selected-animals-header"
import { updateAnimalMilestone, fetchPCOs, fetchAcquisitionWays, fetchPCOOtherRescues, createPCO, createAcquisitionWay, type UpdateMilestonePayload } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AddPCODialog } from "@/components/pco/add-pco-dialog"
import { cn } from "@/lib/utils"

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
  const [isEditingHowAcquired, setIsEditingHowAcquired] = useState(false)
  const [newHowAcquiredDraft, setNewHowAcquiredDraft] = useState("")
  const [otherRescueShelterId, setOtherRescueShelterId] = useState<number | undefined>(undefined)
  const [otherRescueShelters, setOtherRescueShelters] = useState<PCOOtherRescue[]>([])
  const [otherRescueID, setOtherRescueID] = useState<string>("")
  const [amountPaidFee, setAmountPaidFee] = useState<string>("")
  const [amountReceivedFee, setAmountReceivedFee] = useState<string>("")

  // PCO fields (for other milestones)
  const [selectedPCO, setSelectedPCO] = useState<string>("")
  const [pcos, setPCOs] = useState<PCO[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddPCODialogOpen, setIsAddPCODialogOpen] = useState(false)

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

  // Load PCOs when needed
  const loadPCOs = async (query: string = "") => {
    try {
      const result = await fetchPCOs({ searchText: query, limit: 100 })
      setPCOs(result || [])
    } catch (error) {
      console.error("Failed to load PCOs:", error)
    }
  }

  useEffect(() => {
    if (open && milestone?.type !== "Birth" && milestone?.type !== "Intake") {
      const requiresPCO = !["Adoption Return", "Foster Return", "Lost", "Found", "Released", "Reintake", "Death", "Transfer"].includes(milestone?.type || "")
      if (requiresPCO) {
        loadPCOs(searchQuery)
      }
    }
  }, [open, milestone?.type, searchQuery])

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
      setSearchQuery("")
      setError(null)
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
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
        const requiresPCO = ["Owner Surrender", "Public Surrender", "Person", "Public"].includes(acquisitionWay?.acquisitionWayName || "")

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

  // PCO columns for DataTable
  const pcoColumns: Column<PCO>[] = [
    {
      key: "select",
      header: "",
      className: "w-[40px]",
      render: (pco) => (
        <div
          className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedPCO === pco.id ? "border-primary bg-primary" : "border-gray-300"
            }`}
        >
          {selectedPCO === pco.id && <div className="h-2 w-2 bg-white rounded-full" />}
        </div>
      ),
    },
    {
      key: "lastName",
      header: "Last Name",
      className: "w-[18%]",
      render: (pco) => <span className="font-medium">{pco.lastName}</span>,
    },
    {
      key: "firstName",
      header: "First Name",
      className: "w-[22%]",
      render: (pco) => <span>{pco.firstName}</span>,
    },
    {
      key: "address",
      header: "Address",
      className: "w-[35%]",
      render: (pco) => (
        <span className="text-muted-foreground">
          {[pco.street, pco.city, pco.state].filter(Boolean).join(", ")}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      className: "w-[25%]",
      render: (pco) => <span className="text-muted-foreground">{pco.phone || "-"}</span>,
    },
  ]

  const filteredPCOs = pcos.filter(pco =>
    !searchQuery ||
    `${pco.firstName} ${pco.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pco.street?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pco.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pco.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
  const intakeRequiresPCO = isIntake && ["Owner Surrender", "Public Surrender", "Person", "Public"].includes(selectedAcquisitionWay?.acquisitionWayName || "")
  const intakeRequiresOtherRescue = isIntake && selectedAcquisitionWay?.acquisitionWayName === "Other Rescue/Shelter/Sanctuary"

  const formattedLabel = mode === "approximate" ? "Approximate Birth Date" : "Actual Birth Date"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
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
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">Person/Company/Organization</h3>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by name, address, or phone..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          loadPCOs(e.target.value)
                        }}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      type="button"
                      onClick={() => setIsAddPCODialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-white max-h-64">
                    <DataTable
                      columns={pcoColumns}
                      data={filteredPCOs}
                      getRowId={(pco) => pco.id}
                      onRowClick={(pco) => setSelectedPCO(pco.id)}
                      headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                      rowClassName={(pco) =>
                        cn(
                          "cursor-pointer transition-colors",
                          selectedPCO === pco.id ? "bg-primary/10" : "bg-white hover:bg-muted/30"
                        )
                      }
                      emptyMessage="No matching people found. Click 'Add' to create a new entry."
                    />
                  </div>
                </div>
              )}

              {intakeRequiresOtherRescue && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Other Rescue/Shelter/Sanctuary</label>
                  <select
                    value={otherRescueShelterId || ""}
                    onChange={(e) => {
                      setOtherRescueShelterId(e.target.value ? Number(e.target.value) : undefined)
                      setError(null)
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  >
                    <option value="">Select rescue/shelter</option>
                    {otherRescueShelters.map((rs) => (
                      <option key={rs.id} value={rs.id}>
                        {rs.lastNameOtherRescue}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedAcquisitionWay && (
                <FloatingInput
                  id="otherRescueID"
                  label="ID No. at Other Rescue"
                  value={otherRescueID}
                  onChange={(e) => setOtherRescueID(e.target.value)}
                  disabled={!intakeRequiresOtherRescue}
                  placeholder="ID No. used at other rescue"
                />
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
              {requiresPCO && (
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">
                    {milestone?.type === "Adoption" && "Adopted By:"}
                    {milestone?.type === "Foster" && "Foster By:"}
                    {milestone?.type === "Returned to Owner" && "Returned to:"}
                    {milestone?.type === "Transfer" && "Transferred to:"}
                    {!["Adoption", "Foster", "Returned to Owner", "Transfer"].includes(milestone?.type || "") && "Person/Company/Organization:"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search by name, address, or phone..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          loadPCOs(e.target.value)
                        }}
                        className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <Button
                      size="sm"
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      type="button"
                      onClick={() => setIsAddPCODialogOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <div className="border rounded-lg overflow-hidden bg-white max-h-64">
                    <DataTable
                      columns={pcoColumns}
                      data={filteredPCOs}
                      getRowId={(pco) => pco.id}
                      onRowClick={(pco) => setSelectedPCO(pco.id)}
                      headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                      // rowClassName={(pco) =>
                      //   cn(
                      //     "cursor-pointer transition-colors",
                      //     selectedPCO === pco.id ? "bg-primary/10" : "bg-white hover:bg-muted/30"
                      //   )
                      // }
                      emptyMessage="No matching people found. Click 'Add' to create a new entry."
                    />
                  </div>
                </div>
              )}

              {isTransfer && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Other Rescue/Shelter/Sanctuary</label>
                  <select
                    value={otherRescueShelterId || ""}
                    onChange={(e) => {
                      setOtherRescueShelterId(e.target.value ? Number(e.target.value) : undefined)
                      setError(null)
                    }}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select rescue/shelter</option>
                    {otherRescueShelters.map((rs) => (
                      <option key={rs.id} value={rs.id}>
                        {rs.lastNameOtherRescue}
                      </option>
                    ))}
                  </select>
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

      <AddPCODialog
        open={isAddPCODialogOpen}
        onOpenChange={setIsAddPCODialogOpen}
        onSave={async (data) => {
          try {
            const created = await createPCO({
              firstName: data.firstName,
              lastName: data.lastName,
              street: data.street,
              city: data.city,
              state: data.state,
              zip: data.zip,
              phone: data.phone,
              email: data.email,
              entityType: data.type === "company" ? "CorO" : "Person",
            })
            setIsAddPCODialogOpen(false)
            // Refresh list and select the new PCO
            await loadPCOs(searchQuery)
            setSelectedPCO(created.id)
          } catch (error) {
            console.error("Failed to create PCO", error)
          }
        }}
      />
    </Dialog>
  )
}
