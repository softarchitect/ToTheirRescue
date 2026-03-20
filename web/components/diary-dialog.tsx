"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { addDiaryEntry, updateDiaryEntry, type DiaryEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface DiaryDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  editEntry?: DiaryEntry | null
}

export function DiaryDialog({ animals, open, onOpenChange, editEntry }: DiaryDialogProps) {
  const { toast } = useToast()
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [entry, setEntry] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (editEntry && open) {
      // Set form data from editEntry when editing
      const entryDate = editEntry.actionDate ? new Date(editEntry.actionDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
      setDate(entryDate)
      setEntry(editEntry.notes || "")
    } else if (open && !editEntry) {
      // Reset form when opening for new entry
      setDate(new Date().toISOString().split("T")[0])
      setEntry("")
    }
  }, [editEntry, open])

  const handleSave = async () => {
    if (!entry || animals.length === 0) return

    try {
      setIsSaving(true)

      if (editEntry) {
        // Update existing entry
        const response = await updateDiaryEntry(editEntry.id, {
          actionDate: new Date(date).toISOString(),
          notes: entry,
        })

        if (response.success) {
          toast({
            title: "Success",
            description: response.message || "Diary entry updated successfully",
            variant: "success",
          })
          onOpenChange(false)
        } else {
          const errorMessage = response.errors?.[0] || "Failed to update diary entry"
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      } else {
        // Create new entry
        const response = await addDiaryEntry({
          animalIds: animals.map((a) => a.id),
          date,
          notes: entry,
        })

        if (response.success) {
          toast({
            title: "Success",
            description: response.message || "Diary entry added successfully",
            variant: "success",
          })
          onOpenChange(false)
          setDate(new Date().toISOString().split("T")[0])
          setEntry("")
        } else {
          const errorMessage = response.errors?.[0] || "Failed to save diary entry"
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Failed to save diary entry", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to save diary entry. Please try again."
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl">
          {editEntry ? "Edit Diary Entry" : "Add New Diary Entry"}
        </DialogTitle>

        {animals.length > 0 && <SelectedAnimalsHeader animals={animals} className="mt-1" />}

        <div className="space-y-4 mt-4">
          <FloatingInput
            id="date"
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            max={new Date().toISOString().split("T")[0]}
          />

          <FloatingTextarea
            id="entry"
            label="Diary Entry"
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
            rows={8}
            required
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!entry || isSaving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isSaving ? (editEntry ? "Updating..." : "Saving...") : (editEntry ? "Update" : "Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
