"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createHealthNotes, updateHealthNote, type HealthNoteEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { getMaxDateToday } from "@/lib/date-utils"

interface HealthNoteDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (items: HealthNoteEntry[]) => void
  editEntry?: HealthNoteEntry | null
}

export function HealthNoteDialog({ animals, open, onOpenChange, onSaved, editEntry }: HealthNoteDialogProps) {
  const { toast } = useToast()
  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  }
  const [date, setDate] = useState(getTodayDate())
  const [note, setNote] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (editEntry && open) {
      // Set form data from editEntry when editing
      const entryDate = editEntry.date ? new Date(editEntry.date).toISOString().split("T")[0] : getTodayDate()
      setDate(entryDate)
      setNote(editEntry.note || "")
    } else if (open && !editEntry) {
      // Reset form when opening for new entry
      setDate(getTodayDate())
      setNote("")
      setValidationErrors({})
    }
  }, [editEntry, open])

  const handleSave = async () => {
    const errors: Record<string, string> = {}
    if (!note.trim()) errors.note = "Note is required"
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
        const animalId = typeof editEntry.animalId === "string" ? parseInt(editEntry.animalId, 10) : editEntry.animalId
        const updatedEntry = await updateHealthNote(editEntry.id, {
          note: note.trim(),
          animalId,
          actionDate: date,
        })

        toast({
          title: "Success",
          description: "Health note updated successfully",
          variant: "success",
        })

        if (onSaved) {
          onSaved([updatedEntry])
        }

        // Close dialog and reset form after successful update
        onOpenChange(false)
        setDate(getTodayDate())
        setNote("")
        setValidationErrors({})
      } else {
        // Create new entry
        const items = await createHealthNotes({
          animalIds: animals.map((a) => a.id),
          note: note.trim(),
          actionDate: date,
        })

        toast({
          title: "Success",
          description: "Health note added successfully",
          variant: "success",
        })

        if (onSaved && items.length > 0) {
          onSaved(items)
        }

        // Close dialog and reset form after successful creation
        onOpenChange(false)
        setDate(getTodayDate())
        setNote("")
        setValidationErrors({})
      }
    } catch (error) {
      console.error("Failed to save health note", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save health note. Please try again."
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editEntry ? "Edit Health Note" : "Add New Health Note"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {animals.length > 0 && <SelectedAnimalsHeader animals={animals} />}

          <FloatingInput
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-40"
            max={getMaxDateToday()}
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
