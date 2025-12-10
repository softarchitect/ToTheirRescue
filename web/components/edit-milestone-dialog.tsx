"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Animal, Milestone } from "@/lib/types"
import { Calendar as CalendarIcon } from "lucide-react"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { SelectedAnimalsHeader } from "./selected-animals-header"
import { updateAnimalMilestone } from "@/lib/api"

type BirthDateMode = "approximate" | "actual"

interface BirthMilestoneDialogProps {
  animal?: Animal
  open: boolean
  onOpenChange: (open: boolean) => void
  milestone?: Milestone | null
  onSubmit?: (data: { date: string; notes: string; mode: BirthDateMode }) => void
  onSuccess?: () => void
}

export function EditMilestoneDialog({
  animal,
  open,
  onOpenChange,
  milestone,
  onSubmit,
  onSuccess,
}: BirthMilestoneDialogProps) {
  const [mode, setMode] = useState<BirthDateMode>("approximate")
  const [editMilestone, setEditMilestone] = useState<Milestone | null>(null);
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const dateInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (milestone == null) return;
    // Ensure date is in YYYY-MM-DD format for the date input
    const formattedMilestone = {
      ...milestone,
      date: milestone.date ? milestone.date.split("T")[0] : milestone.date,
    };
    setEditMilestone(formattedMilestone);
    // Set mode based on milestone type if it's a birth milestone
    if (milestone.type === "Birth") {
      // You might want to check isApproxDOB from the milestone if available
      // For now, defaulting to approximate
      setMode("approximate");
    }
  }, [milestone])

  const handleClose = () => {
    setError(null)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleUpdate = async () => {
    if (!editMilestone || !editMilestone.id) {
      setError("Milestone data is missing")
      return
    }

    if (!editMilestone.date) {
      setError("Date is required")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Convert date to ISO format if it's just a date string
      let milestoneDate = editMilestone.date
      if (!milestoneDate.includes("T")) {
        milestoneDate = `${milestoneDate}T00:00:00`
      }

      const payload = {
        milestoneType: editMilestone.type,
        milestoneDate: milestoneDate,
        isApproxDOB: mode === "approximate",
        notes: editMilestone.notes || "",
      }

      await updateAnimalMilestone(editMilestone.id, payload)

      // Call the onSubmit callback if provided (for backward compatibility)
      if (onSubmit) {
        onSubmit({
          date: editMilestone.date,
          notes: editMilestone.notes || "",
          mode,
        })
      }

      // Call onSuccess callback to refresh the milestones list
      if (onSuccess) {
        onSuccess()
      }

      onOpenChange(false)
    } catch (err: any) {
      setError(err?.message || "Failed to update milestone")
      console.error("Failed to update milestone:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const formattedLabel = mode === "approximate" ? "Approximate Birth Date" : "Actual Birth Date"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold">Edit {editMilestone?.type} Milestone for {animal?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animal ? [animal] : []} />
          <div className="space-y-4 mt-4">
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as BirthDateMode)}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="approximate">Approximate Birth Date</TabsTrigger>
                <TabsTrigger value="actual">Actual Birth Date</TabsTrigger>
              </TabsList>
              <TabsContent value="approximate" />
              <TabsContent value="actual" />
            </Tabs>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)]">
              <div>
                <div className="relative max-w-xs">
                  <FloatingInput
                    ref={dateInputRef}
                    id="birthDate"
                    label={formattedLabel}
                    type="date"
                    value={editMilestone?.date}
                    onChange={(e) => {
                      setEditMilestone({ ...editMilestone, date: e.target.value } as Milestone)
                      setError(null)
                    }}
                    aria-invalid={!!error}
                    className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:appearance-none"
                    error={error || undefined}
                    required
                  />
                  <CalendarIcon
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
                    onClick={() => {
                      const input = dateInputRef.current
                      if (!input) return

                      // Try to open the native date picker if supported
                      const anyInput = input as HTMLInputElement & { showPicker?: () => void }
                      if (typeof anyInput.showPicker === "function") {
                        anyInput.showPicker()
                      } else {
                        input.focus()
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <FloatingTextarea
                id="birthNotes"
                label="Notes"
                value={editMilestone?.notes || ""}
                onChange={(e) => setEditMilestone({ ...editMilestone, notes: e.target.value } as Milestone)}
                rows={4}
                className="resize-none"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isLoading || !editMilestone}>
            {isLoading ? "Updating..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


