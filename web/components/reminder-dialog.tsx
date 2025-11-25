"use client"

import { useState, useEffect } from "react"
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

interface ReminderDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReminderDialog({ animals, open, onOpenChange }: ReminderDialogProps) {
  const [activeTab, setActiveTab] = useState<"vaccination" | "procedure" | "meds">("vaccination")
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customItem, setCustomItem] = useState("")
  const [reminderDates, setReminderDates] = useState<Date[]>([])
  const [orInDays, setOrInDays] = useState(0)
  const [orInUnit, setOrInUnit] = useState("days")
  const [notes, setNotes] = useState("")

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

  const handleSave = () => {
    const itemName = showCustomInput ? customItem : selectedItem
    if (!itemName || reminderDates.length === 0) return

    console.log("Saving reminder for animals:", animals)
    // Save reminder for all selected animals
    
    // Reset and close
    onOpenChange(false)
    setSelectedItem("")
    setShowCustomInput(false)
    setCustomItem("")
    setReminderDates([])
    setOrInDays(0)
    setOrInUnit("days")
    setNotes("")
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
              <Popover>
                <PopoverTrigger asChild>
                  <div>
                    <FloatingInput
                      label="Reminder Date"
                      value={
                        reminderDates.length
                          ? reminderDates
                              .slice()
                              .sort((a, b) => a.getTime() - b.getTime())
                              .map((d) =>
                                `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
                              )
                              .join(", ")
                          : ""
                      }
                      readOnly
                      placeholder="dd/mm/yyyy"
                      className="cursor-pointer"
                      required
                    />
                    <CalendarIcon className="absolute right-4 top-[38px] h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-2">
                  <Calendar
                    mode="multiple"
                    selected={reminderDates}
                    onSelect={(dates) => setReminderDates(dates ?? [])}
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
          <Button onClick={handleSave} disabled={(!selectedItem && !customItem) || reminderDates.length === 0}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
