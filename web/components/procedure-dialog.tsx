"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createAnimalProcedures } from "@/lib/api"

interface ProcedureDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProcedureDialog({ animals, open, onOpenChange }: ProcedureDialogProps) {
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const [procedureName, setProcedureName] = useState("")
  const [procedureDate, setProcedureDate] = useState(getTodayDate())
  const [clinic, setClinic] = useState("")
  const [person, setPerson] = useState("")
  const [weight, setWeight] = useState("")
  const [testResult, setTestResult] = useState("")
  const [microchipNumber, setMicrochipNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const errors: Record<string, string> = {}
    if (!procedureName) errors.procedureName = "Procedure is required"
    if (!clinic) errors.clinic = "Clinic is required"
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) {
      return
    }

    if (!animals.length) {
      onOpenChange(false)
      return
    }

    try {
      setIsSaving(true)
      await createAnimalProcedures({
        animalIds: animals.map((a) => a.id),
        kindId: 1, // placeholder; map to real procedure kind in a fuller implementation
        actionDate: procedureDate,
        hospitalClinicId: 1,
        administerer: person || undefined,
        microchipNumber: microchipNumber || undefined,
        results: testResult || undefined,
        notes: notes || undefined,
      })

      onOpenChange(false)
      setProcedureName("")
      setProcedureDate(getTodayDate())
      setClinic("")
      setPerson("")
      setWeight("")
      setTestResult("")
      setMicrochipNumber("")
      setNotes("")
    } catch (error) {
      console.error("Failed to save procedure", error)
      if (typeof window !== "undefined") {
        window.alert("Failed to save procedure. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Procedure, Test, or Treatment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animals} />

          <div className="grid grid-cols-2 gap-3">
            <FloatingSelect
              label={
                <span>
                  Procedure, Test or Treatment <span className="text-red-500">*</span>
                </span>
              }
              value={procedureName}
              onValueChange={setProcedureName}
              className="w-full"
              error={validationErrors.procedureName}
              options={[
                { value: "spay-neuter", label: "Spay/Neuter" },
                { value: "dental-cleaning", label: "Dental Cleaning" },
                { value: "blood-work", label: "Blood Work" },
                { value: "x-ray", label: "X-Ray" },
                { value: "ultrasound", label: "Ultrasound" },
                { value: "surgery", label: "Surgery" },
                { value: "microchipping", label: "Microchipping" },
                { value: "nail-trim", label: "Nail Trim" },
                { value: "other", label: "Other" },
              ]}
            />

            <FloatingInput
              label="Test Result (optional)"
              value={testResult}
              onChange={(e) => setTestResult(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FloatingInput
              label="Procedure Date"
              type="date"
              value={procedureDate}
              onChange={(e) => setProcedureDate(e.target.value)}
            />
            <FloatingInput
              label="Microchip Number"
              value={microchipNumber}
              onChange={(e) => setMicrochipNumber(e.target.value)}
              disabled
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-3">
              <FloatingSelect
                label={
                  <span>
                    Clinic <span className="text-red-500">*</span>
                  </span>
                }
                value={clinic}
                onValueChange={setClinic}
                className="w-full"
                error={validationErrors.clinic}
                options={[
                  { value: "main", label: "Main Clinic" },
                  { value: "emergency", label: "Emergency Vet" },
                  { value: "mobile", label: "Mobile Vet" },
                ]}
              />
              <FloatingInput
                label="Person (optional)"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
              />
            </div>
            <FloatingTextarea
              label="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="h-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div />
            <FloatingInput
              label="Weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              disabled
            />
          </div>

          {/* Save/Cancel */}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
