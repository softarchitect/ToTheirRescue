"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createSOAPEntries, updateSOAPEntry, fetchPCOHospitals, createPCO, type SOAPEntry, type PCOHospital } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { getMaxDateToday } from "@/lib/date-utils"
import { Plus, X } from "lucide-react"

interface SOAPDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (items: SOAPEntry[]) => void
  editEntry?: SOAPEntry | null
}

export function SOAPDialog({ animals, open, onOpenChange, onSaved, editEntry }: SOAPDialogProps) {
  const { toast } = useToast()
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
  const [hospitalClinics, setHospitalClinics] = useState<PCOHospital[]>([])
  const [isLoadingHospitals, setIsLoadingHospitals] = useState(false)
  const [isEditingHospital, setIsEditingHospital] = useState(false)
  const [newHospitalDraft, setNewHospitalDraft] = useState("")

  useEffect(() => {
    if (open) {
      // Load hospital/clinic list when dialog opens
      loadHospitalClinics()
    }
  }, [open])

  useEffect(() => {
    if (editEntry && open) {
      // Set form data from editEntry when editing
      const entryDate = editEntry.actionDate || editEntry.date
      const soapDate = entryDate ? new Date(entryDate).toISOString().split("T")[0] : getTodayDate()
      setDate(soapDate)
      setPerson(editEntry.veterinarian || "")
      setSubjective(editEntry.subjective || "")
      setObjective(editEntry.objective || "")
      setAssessment(editEntry.assessment || "")
      setPlan(editEntry.plan || editEntry.soapPlan || "")
      setClinic(editEntry.hospitalClinicId?.toString() || "")
    } else if (open && !editEntry) {
      // Reset form when opening for new entry
      setDate(getTodayDate())
      setClinic("")
      setPerson("")
      setSubjective("")
      setObjective("")
      setAssessment("")
      setPlan("")
      setValidationErrors({})
      setIsEditingHospital(false)
      setNewHospitalDraft("")
    }
  }, [editEntry, open])

  const loadHospitalClinics = async () => {
    setIsLoadingHospitals(true)
    try {
      const hospitals = await fetchPCOHospitals()
      setHospitalClinics(hospitals)
      // Set default clinic if none selected and hospitals are available (only for new entries)
      if (!clinic && hospitals.length > 0 && !editEntry && !isEditingHospital) {
        setClinic(hospitals[0].id.toString())
      }
    } catch (error) {
      console.error("Failed to load hospital/clinic list", error)
      toast({
        title: "Warning",
        description: "Failed to load hospital/clinic list. You can still proceed.",
        variant: "default",
      })
    } finally {
      setIsLoadingHospitals(false)
    }
  }

  const handleAddHospital = async () => {
    // First click: switch the Clinic field from dropdown to input mode
    if (!isEditingHospital) {
      setIsEditingHospital(true)
      setNewHospitalDraft("")
      setClinic("") // Clear selection when entering edit mode
      return
    }

    // Second click (while in input mode): save the new hospital
    const trimmed = newHospitalDraft.trim()
    if (!trimmed) {
      setIsEditingHospital(false)
      setNewHospitalDraft("")
      return
    }

    // Check if hospital already exists
    if (hospitalClinics.some(h =>
      (h.lastName || h.lastNameHospital || "").toLowerCase() === trimmed.toLowerCase()
    )) {
      toast({
        title: "Warning",
        description: "This hospital/clinic already exists.",
        variant: "default",
      })
      setIsEditingHospital(false)
      setNewHospitalDraft("")
      return
    }

    try {
      // Create the new hospital using createPCO API with hospital=true
      const newHospital = await createPCO({
        lastName: trimmed,
        firstName: "", // Empty for company/organization
        entityType: "company", // Will be converted to "CorO" by backend
        hospital: true, // Mark as hospital/clinic
      })

      // Refresh the list of hospitals
      const updatedHospitals = await fetchPCOHospitals()
      setHospitalClinics(updatedHospitals)

      // Set the newly created hospital as selected
      if (newHospital && newHospital.id) {
        setClinic(newHospital.id.toString())
      }

      setIsEditingHospital(false)
      setNewHospitalDraft("")

      toast({
        title: "Success",
        description: "Hospital/clinic added successfully",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to create hospital", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create hospital. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
      setIsEditingHospital(false)
      setNewHospitalDraft("")
    }
  }

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

    if (!animals.length && !editEntry) {
      onOpenChange(false)
      return
    }

    try {
      setIsSaving(true)

      if (editEntry) {
        // Update existing entry
        const response = await updateSOAPEntry(editEntry.id, {
          actionDate: new Date(date).toISOString(),
          subjective: subjective.trim(),
          objective: objective.trim(),
          assessment: assessment.trim(),
          plan: plan.trim(),
          veterinarian: person.trim(),
          hospitalClinicId: clinic ? parseInt(clinic, 10) : 1,
        })

        if (response.success) {
          toast({
            title: "Success",
            description: response.message || "SOAP entry updated successfully",
            variant: "success",
          })
          onOpenChange(false)
        } else {
          const errorMessage = response.errors?.[0] || "Failed to update SOAP entry"
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } else {
        // Create new entry
        const items = await createSOAPEntries({
          animalIds: animals.map((a) => a.id),
          actionDate: date,
          subjective: subjective.trim(),
          objective: objective.trim(),
          assessment: assessment.trim(),
          plan: plan.trim(),
          veterinarian: person.trim(),
          hospitalClinicId: clinic ? parseInt(clinic, 10) : 1,
        })

        if (onSaved && items.length > 0) {
          onSaved(items)
        }

        toast({
          title: "Success",
          description: "SOAP entry added successfully",
          variant: "success",
        })

        onOpenChange(false)
        setDate(getTodayDate())
        setClinic("")
        setPerson("")
        setSubjective("")
        setObjective("")
        setAssessment("")
        setPlan("")
        setValidationErrors({})
      }
    } catch (error) {
      console.error("Failed to save SOAP", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save SOAP. Please try again."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{editEntry ? "Edit SOAP Entry" : "Add New SOAP"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animals} />

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-end">
              <FloatingInput
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                error={validationErrors.date}
                className="w-full"
                max={getMaxDateToday()}
              />

              <div className="flex items-start gap-2">
                <div className="flex-1">
                  {isEditingHospital ? (
                    <FloatingInput
                      label="Clinic"
                      value={newHospitalDraft}
                      onChange={(e) => setNewHospitalDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddHospital()
                        }
                      }}
                      className="w-full"
                      error={validationErrors.clinic}
                      placeholder="Enter new hospital/clinic name"
                      required
                    />
                  ) : (
                    <FloatingSelect
                      label={
                        <span>
                          Clinic <span className="text-red-500">*</span>
                        </span>
                      }
                      value={clinic}
                      onValueChange={setClinic}
                      className="w-full min-h-10"
                      error={validationErrors.clinic}
                      disabled={isLoadingHospitals}
                      options={
                        isLoadingHospitals
                          ? [{ value: "0", label: "Loading..." }]
                          : hospitalClinics.length > 0
                            ? hospitalClinics.map((hospital) => {
                              const fullLabel = hospital.lastName || hospital.lastNameHospital || `${hospital.firstName} ${hospital.lastName}`.trim() || `Hospital #${hospital.id}`
                              const truncatedLabel = fullLabel.length > 15 ? fullLabel.substring(0, 15) + "..." : fullLabel
                              return {
                                value: hospital.id.toString(),
                                label: truncatedLabel,
                              }
                            })
                            : [{ value: "invalid", label: "No hospitals/clinics available" }]
                      }
                    />
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 mt-0"
                  onClick={handleAddHospital}
                  disabled={isLoadingHospitals}
                >
                  {isEditingHospital ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 items-start gap-2">
            <FloatingInput
              label="Person"
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              required
              error={validationErrors.person}
              className="w-full"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

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
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || (!animals.length && !editEntry)}
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
