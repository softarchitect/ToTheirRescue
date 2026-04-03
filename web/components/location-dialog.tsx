import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { useState, useEffect } from "react"

interface LocationDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (location: string, animals: Animal[]) => void
}

export function LocationDialog({ animals, open, onOpenChange, onSave }: LocationDialogProps) {
  const [newLocation, setNewLocation] = useState("")

  useEffect(() => {
    if (!open) {
      setNewLocation("")
    }
  }, [open])

  const handleSave = () => {
    if (onSave) {
      onSave(newLocation, animals)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">New Location</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {animals.length > 0 && <SelectedAnimalsHeader animals={animals} />}

          <div>
            <Input
              placeholder="New Location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="text-base"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


