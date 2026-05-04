"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createCompletedMeds, type CompletedMedDTO } from "@/lib/api"

interface MedDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (items: CompletedMedDTO[]) => void
}

export function MedDialog({ animals, open, onOpenChange, onSaved }: MedDialogProps) {
  const [medName, setMedName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [startDate, setStartDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!medName.trim()) newErrors.medName = "Medication name is required"
    if (!startDate) newErrors.startDate = "Start date is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const resetState = () => {
    setMedName("")
    setDosage("")
    setFrequency("")
    setStartDate("")
    setNotes("")
    setErrors({})
  }

  const handleSave = async () => {
    if (!animals.length) {
      onOpenChange(false)
      return
    }

    if (!validate()) return

    try {
      setIsSaving(true)
      const items = await createCompletedMeds({
        animalIds: animals.map((a) => a.id),
        medicineName: medName.trim(),
        dosage: dosage.trim() || undefined,
        frequency: frequency.trim() || undefined,
        startDate,
        notes: notes.trim() || undefined,
      })

      if (onSaved && items.length > 0) {
        onSaved(items)
      }

      onOpenChange(false)
      resetState()
    } catch (error) {
      console.error("Failed to save medication", error)
      if (typeof window !== "undefined") {
        window.alert("Failed to save medication. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
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
            error={errors.medName}
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
            error={errors.startDate}
          />

          <FloatingTextarea
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !animals.length}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
