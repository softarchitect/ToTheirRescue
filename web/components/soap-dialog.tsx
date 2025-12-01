"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createSOAPEntries, type SOAPEntry } from "@/lib/api"

interface SOAPDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (items: SOAPEntry[]) => void
}

export function SOAPDialog({ animals, open, onOpenChange, onSaved }: SOAPDialogProps) {
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }

  const [date, setDate] = useState(getTodayDate())
  const [clinic, setClinic] = useState("")
  const [person, setPerson] = useState("")
  const [subjective, setSubjective] = useState("")
  const [objective, setObjective] = useState("")
  const [assessment, setAssessment] = useState("")
  const [plan, setPlan] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    const errors: Record<string, string> = {}
    if (!date) errors.date = "Date is required"
    if (!clinic) errors.clinic = "Clinic is required"
    if (!person) errors.person = "Person is required"
    if (!subjective.trim()) errors.subjective = "Subjective is required"
    if (!objective.trim()) errors.objective = "Objective is required"
    if (!assessment.trim()) errors.assessment = "Assessment is required"
    if (!plan.trim()) errors.plan = "Plan is required"
    setValidationErrors(errors)
    if (Object.keys(errors).length > 0) return

    if (!animals.length) {
      onOpenChange(false)
      return
    }

    try {
      setIsSaving(true)
      const items = await createSOAPEntries({
        animalIds: animals.map((a) => a.id),
        actionDate: date,
        subjective: subjective.trim(),
        objective: objective.trim(),
        assessment: assessment.trim(),
        plan: plan.trim(),
        veterinarian: person.trim(),
        hospitalClinicId: 1,
      })

      if (onSaved && items.length > 0) {
        onSaved(items)
      }

      onOpenChange(false)
      setDate(getTodayDate())
      setClinic("")
      setPerson("")
      setSubjective("")
      setObjective("")
      setAssessment("")
      setPlan("")
      setValidationErrors({})
    } catch (error) {
      console.error("Failed to save SOAP", error)
      if (typeof window !== "undefined") {
        window.alert("Failed to save SOAP. Please try again.")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Add New SOAP</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animals} />

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FloatingInput
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                error={validationErrors.date}
                className="w-full md:w-40"
              />
              <FloatingInput
                label="Person"
                value={person}
                onChange={(e) => setPerson(e.target.value)}
                required
                error={validationErrors.person}
                className="w-full md:w-56"
              />
            </div>
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
                { value: "main-clinic", label: "Main Clinic" },
                { value: "north-branch", label: "North Branch Veterinary" },
                { value: "south-branch", label: "South Branch Veterinary" },
                { value: "emergency-vet", label: "Emergency Vet Center" },
                { value: "mobile-vet", label: "Mobile Vet Service" },
                { value: "animal-hospital", label: "Animal Hospital" },
                { value: "spay-neuter-clinic", label: "Spay/Neuter Clinic" },
                { value: "wellness-center", label: "Wellness Center" },
                { value: "vaccination-clinic", label: "Vaccination Clinic" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>

          <FloatingTextarea
            label="Subjective"
            value={subjective}
            onChange={(e) => setSubjective(e.target.value)}
            rows={3}
            required
            error={validationErrors.subjective}
          />

          <FloatingTextarea
            label="Objective"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            rows={3}
            required
            error={validationErrors.objective}
          />

          <FloatingTextarea
            label="Assessment"
            value={assessment}
            onChange={(e) => setAssessment(e.target.value)}
            rows={3}
            required
            error={validationErrors.assessment}
          />

          <FloatingTextarea
            label="Plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            rows={3}
            required
            error={validationErrors.plan}
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving || !animals.length}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
