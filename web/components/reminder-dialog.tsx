"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Calendar as CalendarIcon } from 'lucide-react'
import type { Animal } from "@/lib/types"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createVaccinationReminders, createProcedureReminders, createMedReminders } from "@/lib/api"
import { formatDateListDisplay, parseDateListInput } from "@/lib/date-input"
import { useToast } from "@/hooks/use-toast"

interface ReminderDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReminderDialog({ animals, open, onOpenChange }: ReminderDialogProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"vaccination" | "procedure" | "meds">("vaccination")
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customItem, setCustomItem] = useState("")
  const [reminderDates, setReminderDates] = useState<Date[]>([])
  const [reminderDateInput, setReminderDateInput] = useState("")
  const [orInDays, setOrInDays] = useState(0)
  const [orInUnit, setOrInUnit] = useState("days")
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [isReminderDatePickerOpen, setIsReminderDatePickerOpen] = useState(false)
  const ignoreReminderDateBlurRef = useRef(false)

  const isTodayOrPast = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const check = new Date(date)
    check.setHours(0, 0, 0, 0)
    return check <= today
  }

  const vaccinationOptions = [
    "Rabies",
    "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
    "Bordetella",
    "Leptospirosis",
    "Lyme Disease",
    "Canine Influenza",
    "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
    "FeLV (Feline Leukemia)",
  ]

  const procedureOptions = [
    "Spay/Neuter",
    "Dental Cleaning",
    "Blood Work",
    "X-Ray",
    "Ultrasound",
    "Surgery",
    "Microchipping",
    "Nail Trim",
  ]

  const medsOptions = [
    "Heartworm Prevention",
    "Flea & Tick Prevention",
    "Dewormer",
    "Antibiotics",
    "Pain Medication",
    "Anti-inflammatory",
  ]

  const getCurrentOptions = () => {
    switch (activeTab) {
      case "vaccination":
        return vaccinationOptions
      case "procedure":
        return procedureOptions
      case "meds":
        return medsOptions
      default:
        return []
    }
  }

  useEffect(() => {
    setSelectedItem("")
    setShowCustomInput(false)
    setCustomItem("")
  }, [activeTab])

  useEffect(() => {
    setReminderDateInput(formatDateListDisplay(reminderDates))
  }, [reminderDates])

  const computeDueDates = (): Date[] => {
    // If explicit dates were chosen, use them.
    if (reminderDates.length > 0) return reminderDates

    // Otherwise, fall back to "OR in" offset if provided.
    if (orInDays > 0) {
      const multiplier =
        orInUnit === "weeks" ? 7 : orInUnit === "months" ? 30 : 1
      const totalDays = orInDays * multiplier
      const base = new Date()
      const due = new Date(
        Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate()),
      )
      due.setUTCDate(due.getUTCDate() + totalDays)
      return [due]
    }

    return []
  }

  const resetState = () => {
    setSelectedItem("")
    setShowCustomInput(false)
    setCustomItem("")
    setReminderDates([])
    setReminderDateInput("")
    setOrInDays(0)
    setOrInUnit("days")
    setNotes("")
  }

  const handleReminderDateBlur = () => {
    if (ignoreReminderDateBlurRef.current) {
      ignoreReminderDateBlurRef.current = false
      return
    }
    if (isReminderDatePickerOpen) {
      return
    }
    if (!reminderDateInput.trim()) {
      // If user picked from calendar, keep that selection instead of clearing it.
      if (reminderDates.length > 0) {
        return
      }
      setReminderDates([])
      return
    }

    const parsed = parseDateListInput(reminderDateInput)
    if (parsed) {
      const futureOnly = parsed.filter((date) => !isTodayOrPast(date))
      setReminderDates(futureOnly)
      setReminderDateInput(formatDateListDisplay(futureOnly))
    }
  }

  const handleSave = async () => {
    const rawItemName = showCustomInput ? customItem : selectedItem
    const itemName = rawItemName.trim()
    if (!itemName || animals.length === 0) return

    const dueDateObjects = computeDueDates()
    if (dueDateObjects.length === 0) return

    const dueDates = dueDateObjects.map((d) =>
      d.toISOString().split("T")[0],
    )

    try {
      setIsSaving(true)
      const payload = {
        animalIds: animals.map((a) => a.id),
        itemName,
        dueDates,
        notes: notes.trim() || undefined,
      }

      if (activeTab === "vaccination") {
        await createVaccinationReminders(payload)
      } else if (activeTab === "procedure") {
        await createProcedureReminders(payload)
      } else {
        await createMedReminders({
          ...payload,
          dosage: undefined,
        })
      }

      toast({
        title: "Success",
        description: "Reminder saved successfully",
        variant: "success",
      })

      // Reset and close
      onOpenChange(false)
      resetState()
    } catch (error) {
      console.error("Failed to save reminder", error)
      if (typeof window !== "undefined") {
        window.alert("Failed to save reminder. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl">Set New Reminders</DialogTitle>

        {animals.length > 0 && <SelectedAnimalsHeader animals={animals} className="mt-1" />}

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="mt-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
            <TabsTrigger value="procedure">Procedure</TabsTrigger>
            <TabsTrigger value="meds">Meds</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            <div>
              <FloatingSelect
                label={
                  <span>
                    {activeTab === "vaccination" && "Vaccination"}
                    {activeTab === "procedure" && "Procedure"}
                    {activeTab === "meds" && "Meds"} <span className="text-red-500">*</span>
                  </span>
                }
                value={selectedItem}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomInput(true)
                    setSelectedItem("")
                  } else {
                    setSelectedItem(value)
                    setShowCustomInput(false)
                  }
                }}
                options={[
                  ...getCurrentOptions().map((opt) => ({ value: opt, label: opt })),
                  { value: "custom", label: "+ Add Other" },
                ]}
                className="w-full"
              />
            </div>

            {showCustomInput && (
              <div>
                <Label htmlFor="customItem">
                  Custom{" "}
                  {activeTab === "vaccination"
                    ? "Vaccination"
                    : activeTab === "procedure"
                      ? "Procedure"
                      : "Medication"}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input
                  id="customItem"
                  value={customItem}
                  onChange={(e) => setCustomItem(e.target.value)}
                  placeholder="Enter custom name"
                />
              </div>
            )}

            <div>
              <Popover open={isReminderDatePickerOpen} onOpenChange={setIsReminderDatePickerOpen}>
                <PopoverTrigger asChild>
                  <div className="relative cursor-pointer">
                    <FloatingInput
                      label="Reminder Date"
                      value={reminderDateInput}
                      onChange={(e) => setReminderDateInput(e.target.value)}
                      onBlur={handleReminderDateBlur}
                      placeholder="dd/mm/yyyy"
                      className="cursor-pointer pr-10"
                      required
                    />
                    <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-2">
                  <Calendar
                    mode="multiple"
                    selected={reminderDates}
                    onSelect={(dates) => {
                      ignoreReminderDateBlurRef.current = true
                      const nextDates = (dates ?? []).filter((date) => !isTodayOrPast(date))
                      setReminderDates(nextDates)
                      setReminderDateInput(formatDateListDisplay(nextDates))
                      setIsReminderDatePickerOpen(false)
                    }}
                    disabled={(date) => isTodayOrPast(date)}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">OR in</span>
              <Input
                type="number"
                placeholder="0"
                value={orInDays}
                onChange={(e) => setOrInDays(Number.parseInt(e.target.value) || 0)}
                className="w-20"
              />
              <Select value={orInUnit} onValueChange={setOrInUnit}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                  <SelectItem value="months">Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <FloatingTextarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isSaving ||
              (!selectedItem && !customItem) ||
              (reminderDates.length === 0 && orInDays === 0)
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
