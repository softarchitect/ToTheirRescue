"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface MedDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MedDialog({ animals, open, onOpenChange }: MedDialogProps) {
  const [medName, setMedName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [startDate, setStartDate] = useState("")
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    console.log("Saving medication for animals:", animals)
    onOpenChange(false)
    setMedName("")
    setDosage("")
    setFrequency("")
    setStartDate("")
    setNotes("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Medication</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animals} />

          <FloatingInput
            label="Medication Name"
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              label="Dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
            <FloatingInput
              label="Frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
            />
          </div>

          <FloatingInput
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <FloatingTextarea
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
