"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface DiaryDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DiaryDialog({ animals, open, onOpenChange }: DiaryDialogProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [entry, setEntry] = useState("")

  const handleSave = () => {
    if (!entry) return

    console.log("Saving diary entry for animals:", animals)
    // Save diary entry for all selected animals

    // Reset and close
    onOpenChange(false)
    setDate(new Date().toISOString().split("T")[0])
    setEntry("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl">Add New Diary Entry</DialogTitle>

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
          <Button onClick={handleSave} disabled={!entry}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
