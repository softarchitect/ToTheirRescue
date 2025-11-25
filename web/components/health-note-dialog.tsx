"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface HealthNoteDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HealthNoteDialog({ animals, open, onOpenChange }: HealthNoteDialogProps) {
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }
  const [date, setDate] = useState(getTodayDate())
  const [note, setNote] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleSave = () => {
    const errors: Record<string, string> = {}
    if (!note.trim()) errors.note = "Note is required"
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    console.log("Saving health note for animals:", animals)
    onOpenChange(false)
    setDate(getTodayDate())
    setNote("")
    setValidationErrors({})
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Health Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animals} />

          <FloatingInput
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-40"
          />

          <FloatingTextarea
            label="Health Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={6}
            required
            error={validationErrors.note}
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
