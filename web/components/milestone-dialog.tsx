"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from 'lucide-react'
import type { Animal, MilestoneType } from "@/lib/types"
import { cn } from "@/lib/utils"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createMilestonesForAnimals } from "@/lib/api"
import {
  requiresPerson,
  requiresAmount,
  usesDefaultPCO,
  usesExistingPCO,
  getMinDate,
} from "@/lib/milestone-utils"
import { LastMilestoneInfo } from "./milestone/last-milestone-info"
import { MilestoneTypeSelector } from "./milestone/milestone-type-selector"
import { PCOSelector } from "./milestone/pco-selector"
import { MilestoneFormFields } from "./milestone/milestone-form-fields"
import { ExistingPCOInfo } from "./milestone/existing-pco-info"

interface MilestoneDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void | Promise<void>
}

export function MilestoneDialog({ animals, open, onOpenChange, onSuccess }: MilestoneDialogProps) {
  const [selectedMilestoneType, setSelectedMilestoneType] = useState<string>("")
  const [milestoneDate, setMilestoneDate] = useState("")
  const [selectedPCO, setSelectedPCO] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [amountPaidFee, setAmountPaidFee] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const needsPerson = requiresPerson(selectedMilestoneType)
  const needsAmount = requiresAmount(selectedMilestoneType)
  const usesDefault = usesDefaultPCO(selectedMilestoneType)
  const usesExisting = usesExistingPCO(selectedMilestoneType)

  const minDate = getMinDate(animals)
  const maxDate = new Date().toISOString().split("T")[0]

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0]
      const defaultDate = today >= minDate ? today : minDate
      setMilestoneDate(defaultDate)
      setAmountPaidFee("")
      setSelectedMilestoneType("")
      setSelectedPCO("")
      setNotes("")
      setErrors({})
    }
  }, [open, animals, minDate])

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {}

    if (!selectedMilestoneType) {
      newErrors.milestoneType = "Please select a milestone type"
    }
    if (!milestoneDate) {
      newErrors.milestoneDate = "Milestone date is required"
    }
    if (needsPerson && !selectedPCO && !usesDefault && !usesExisting) {
      newErrors.pco = "Person/Company/Organization is required for this milestone"
    }
    if ((selectedMilestoneType === "Adoption Return" || selectedMilestoneType === "Death") && !notes.trim()) {
      newErrors.notes = "Notes are required for this milestone"
    }

    return newErrors
  }

  const determinePCOId = (): number | undefined => {
    if (usesDefault) {
      // Use 0 to represent "no linked person/rescue" for default milestones
      // (e.g., Reintake) and avoid carrying over historical rescue names.
      return 0
    } else if (usesExisting && animals.length > 0) {
      const parsed = Number(selectedPCO)
      return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
    } else if (needsPerson && selectedPCO) {
      const parsed = Number(selectedPCO)
      return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined
    }
    return undefined
  }

  const handleSave = async () => {
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const pcoId = determinePCOId()
    const animalCount = animals.length
    const totalAmount = needsAmount && amountPaidFee ? parseFloat(amountPaidFee) || 0 : 0
    const amountPerAnimal = animalCount > 0 && totalAmount > 0 ? totalAmount / animalCount : totalAmount

    try {
      await createMilestonesForAnimals({
        animalIds: animals.map((a) => a.id),
        milestoneType: selectedMilestoneType as MilestoneType,
        date: milestoneDate,
        notes: notes.trim() || undefined,
        ...(pcoId !== undefined ? { pcoId } : {}),
        ...(needsAmount && amountPaidFee ? { amountPaidFee: amountPerAnimal } : {}),
      })

      onOpenChange(false)
      resetForm()

      if (onSuccess) {
        await onSuccess()
      }
    } catch (error: any) {
      setErrors({
        ...newErrors,
        api: error?.message || "Failed to save milestone",
      })
    }
  }

  const resetForm = () => {
    setSelectedMilestoneType("")
    setMilestoneDate("")
    setSelectedPCO("")
    setNotes("")
    setAmountPaidFee("")
    setErrors({})
  }

  const handleClose = () => {
    onOpenChange(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "flex flex-col p-4 sm:p-6 w-[95vw] sm:w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[50vw] !max-w-[95vw]"
      )}>
        <DialogHeader className="pb-1">
          <DialogTitle className="text-xl sm:text-2xl">Add New Milestone</DialogTitle>
          <DialogDescription className="sr-only">Create a new milestone for the selected animal(s)</DialogDescription>
        </DialogHeader>

        <div className="flex-1 max-h-[72vh] overflow-y-auto">
          <div className="space-y-3 h-full flex flex-col">
            <SelectedAnimalsHeader animals={animals} />
            <LastMilestoneInfo animals={animals} />

            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-4 flex-1 min-h-0">
              <MilestoneTypeSelector
                selectedType={selectedMilestoneType}
                onTypeChange={setSelectedMilestoneType}
                animals={animals}
                error={errors.milestoneType}
              />

              <div className="flex-1 bg-muted/20 rounded-lg p-2 sm:p-3 overflow-hidden flex flex-col">
                {selectedMilestoneType ? (
                  <div className="space-y-2 flex-1 flex flex-col min-h-0">
                    {usesExisting && (
                      <ExistingPCOInfo milestoneType={selectedMilestoneType} animals={animals} />
                    )}

                    {needsPerson && !usesExisting ? (
                      <>
                        <PCOSelector
                          milestoneType={selectedMilestoneType}
                          selectedPCO={selectedPCO}
                          onSelectPCO={setSelectedPCO}
                          error={errors.pco}
                        />
                        <MilestoneFormFields
                          milestoneType={selectedMilestoneType}
                          milestoneDate={milestoneDate}
                          amountPaidFee={amountPaidFee}
                          notes={notes}
                          minDate={minDate}
                          maxDate={maxDate}
                          errors={errors}
                          onDateChange={(date) => {
                            setMilestoneDate(date)
                            setErrors({ ...errors, milestoneDate: "" })
                          }}
                          onAmountChange={(amount) => {
                            setAmountPaidFee(amount)
                            setErrors({ ...errors, amountPaidFee: "" })
                          }}
                          onNotesChange={(notes) => {
                            setNotes(notes)
                            setErrors({ ...errors, notes: "" })
                          }}
                          animals={animals}
                          showCompact={true}
                        />
                      </>
                    ) : (
                      <MilestoneFormFields
                        milestoneType={selectedMilestoneType}
                        milestoneDate={milestoneDate}
                        amountPaidFee={amountPaidFee}
                        notes={notes}
                        minDate={minDate}
                        maxDate={maxDate}
                        errors={errors}
                        onDateChange={(date) => {
                          setMilestoneDate(date)
                          setErrors({ ...errors, milestoneDate: "" })
                        }}
                        onAmountChange={(amount) => {
                          setAmountPaidFee(amount)
                          setErrors({ ...errors, amountPaidFee: "" })
                        }}
                        onNotesChange={(notes) => {
                          setNotes(notes)
                          setErrors({ ...errors, notes: "" })
                        }}
                        animals={animals}
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Please select a milestone on the left</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-3 mt-3 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
