"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface VaccinationDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VaccinationDialog({ animals, open, onOpenChange }: VaccinationDialogProps) {
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }
  const KIND_OPTIONS = [
    { value: "rabies", label: "Rabies" },
    { value: "dhpp", label: "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)" },
    { value: "bordetella", label: "Bordetella (Kennel Cough)" },
    { value: "leptospirosis", label: "Leptospirosis" },
    { value: "lyme", label: "Lyme Disease" },
    { value: "canine-influenza", label: "Canine Influenza (H3N2/H3N8)" },
    { value: "coronavirus", label: "Coronavirus" },
    { value: "fvrcp", label: "FVRCP (Feline Distemper Complex)" },
    { value: "felv", label: "FeLV (Feline Leukemia)" },
    { value: "fiv", label: "FIV (Feline Immunodeficiency Virus)" },
    { value: "chlamydia", label: "Chlamydia (Feline)" },
    { value: "rattlesnake", label: "Rattlesnake Vaccine" },
    { value: "other", label: "Other" },
  ]

  const [newVaccination, setNewVaccination] = useState({
    kind: "",
    date: getTodayDate(),
    vaccSerialNo: "",
    clinic: "",
    tagNo: "",
    administerer: "",
    dueAgain: false,
    dueAgainInterval: 0,
    dueAgainUnit: "days",
    vaccMfg: "",
    notes: "",
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!newVaccination.kind) {
      errors.kind = "Kind is required"
    }
    if (!newVaccination.date) {
      errors.date = "Date is required"
    }
    if (newVaccination.dueAgain && !newVaccination.dueAgainInterval) {
      errors.dueAgain = "Due Again interval is required when checkbox is checked"
    }
    if (!newVaccination.clinic) {
      errors.clinic = "Clinic is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    // Save vaccination for all selected animals
    console.log("[v0] Saving vaccination for animals:", animals.map(a => a.name))
    
    // Reset form
    setNewVaccination({
      kind: "",
      date: getTodayDate(),
      vaccSerialNo: "",
      clinic: "",
      tagNo: "",
      administerer: "",
      dueAgain: false,
      dueAgainInterval: 0,
      dueAgainUnit: "days",
      vaccMfg: "",
      notes: "",
    })
    setValidationErrors({})
    onOpenChange(false)
  }

  const isTagNoEnabled = newVaccination.kind.toLowerCase() === "rabies"
  const isKindSelected = !!newVaccination.kind
  const selectedKindLabel =
    KIND_OPTIONS.find((o) => o.value === newVaccination.kind)?.label ?? ""
  const needsWiderModal = isKindSelected && selectedKindLabel.length > 22

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${needsWiderModal ? "sm:max-w-3xl" : "sm:max-w-2xl"} max-h-[95vh] overflow-y-auto overflow-x-hidden p-4`}>
        <DialogHeader className="pb-0 space-y-0">
          <DialogTitle className="text-2xl">Add New Completed Vaccination</DialogTitle>
        </DialogHeader>

        {animals.length > 0 && <SelectedAnimalsHeader animals={animals} className="mt-1" />}

        {/* Row 1: Kind and Date */}
        <div className="grid gap-3 mt-3" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <FloatingSelect
            label={
              <span>
                Kind <span className="text-red-500">*</span>
              </span>
            }
            value={newVaccination.kind}
            onValueChange={(value) => setNewVaccination({ ...newVaccination, kind: value })}
            error={validationErrors.kind}
            className="w-full"
            options={KIND_OPTIONS}
          />
          <FloatingInput
            label="Date"
            type="date"
            value={newVaccination.date}
            onChange={(e) => setNewVaccination({ ...newVaccination, date: e.target.value })}
            error={validationErrors.date}
            required
          />
        </div>

        {/* Row 2: Clinic and Administerer */}
        <div className="grid gap-3" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <FloatingSelect
            label={
              <span>
                Clinic <span className="text-red-500">*</span>
              </span>
            }
            value={newVaccination.clinic}
            onValueChange={(value) => setNewVaccination({ ...newVaccination, clinic: value })}
            className="w-full"
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
            error={validationErrors.clinic}
          />
          <FloatingInput
            label="Administerer (optional)"
            value={newVaccination.administerer}
            onChange={(e) => setNewVaccination({ ...newVaccination, administerer: e.target.value })}
          />
        </div>

        {/* Row 3: Vaccine Mfg and Vacc Serial No */}
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            label="Vacc. Mfg. (optional)"
            value={newVaccination.vaccMfg}
            onChange={(e) => setNewVaccination({ ...newVaccination, vaccMfg: e.target.value })}
          />
          <FloatingInput
            label="Vacc Serial No. (optional)"
            value={newVaccination.vaccSerialNo}
            onChange={(e) => setNewVaccination({ ...newVaccination, vaccSerialNo: e.target.value })}
          />
        </div>

        {/* Row 4: Due Again and Tag No */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-end gap-2">
            <Checkbox
              id="dueAgain"
              checked={newVaccination.dueAgain}
              onCheckedChange={(checked) => setNewVaccination({ ...newVaccination, dueAgain: checked as boolean })}
              className="mb-3"
            />
            <FloatingInput
              type="number"
              min={0}
              label={
                <span>
                  Due Again {newVaccination.dueAgain && <span className="text-red-500">*</span>}
                </span>
              }
              value={newVaccination.dueAgainInterval.toString()}
              onChange={(e) =>
                setNewVaccination({ ...newVaccination, dueAgainInterval: Number.parseInt(e.target.value) || 0 })
              }
              className="w-24"
              disabled={!newVaccination.dueAgain}
              error={validationErrors.dueAgain}
            />
            <FloatingSelect
              label="Interval"
              value={newVaccination.dueAgainUnit}
              onValueChange={(value) => setNewVaccination({ ...newVaccination, dueAgainUnit: value })}
              disabled={!newVaccination.dueAgain}
              className="w-28"
              options={[
                { value: "days", label: "Days" },
                { value: "weeks", label: "Weeks" },
                { value: "months", label: "Months" },
                { value: "years", label: "Years" },
              ]}
            />
          </div>
          <FloatingInput
            label="Tag No. (optional)"
            value={newVaccination.tagNo}
            onChange={(e) => setNewVaccination({ ...newVaccination, tagNo: e.target.value })}
            disabled={!isTagNoEnabled}
          />
        </div>

        {/* Row 5: Notes with reduced height */}
        <div>
          <FloatingTextarea
            label="Notes (optional)"
            value={newVaccination.notes}
            onChange={(e) => setNewVaccination({ ...newVaccination, notes: e.target.value })}
            rows={2}
            className="resize-none"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
