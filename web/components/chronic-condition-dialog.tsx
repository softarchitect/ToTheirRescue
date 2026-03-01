"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import type { Animal } from "@/lib/types"
import { updateAnimal } from "@/lib/api"

interface ChronicConditionDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: (updatedAnimals: Animal[]) => void
}

export function ChronicConditionDialog({
  animals,
  open,
  onOpenChange,
  onSaved,
}: ChronicConditionDialogProps) {
  const [value, setValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const initialValue = useMemo(() => {
    if (animals.length === 1) return animals[0].chronicCondition || ""
    return ""
  }, [animals])

  useEffect(() => {
    if (!open) return
    setValue(initialValue)
  }, [open, initialValue])

  const handleSave = async () => {
    if (animals.length === 0) return
    setIsSaving(true)
    try {
      const updated = await Promise.all(
        animals.map((animal) =>
          updateAnimal(animal.id, {
            chronicCondition: value.trim(),
          }),
        ),
      )
      onSaved(updated)
      onOpenChange(false)
    } catch (error) {
      // Keep behavior consistent with surrounding pages for now.
      if (typeof window !== "undefined") {
        window.alert(error instanceof Error ? error.message : "Failed to update chronic condition")
      }
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Chronic Condition</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {animals.length > 1
              ? `This value will be applied to ${animals.length} selected animals.`
              : "Set or clear the chronic condition for this animal."}
          </p>
          <FloatingInput
            id="chronic-condition"
            label="Chronic Condition"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g., Diabetes, Arthritis"
            autoFocus
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
