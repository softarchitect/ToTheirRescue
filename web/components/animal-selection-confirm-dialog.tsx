"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface AnimalSelectionConfirmDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function AnimalSelectionConfirmDialog({
  animals,
  open,
  onOpenChange,
  onConfirm,
}: AnimalSelectionConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Are you sure</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animals} />

          <p className="text-center text-lg font-medium">Is this correct ?</p>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="lg" onClick={() => onOpenChange(false)}>
              No
            </Button>
            <Button size="lg" onClick={onConfirm}>
              Yes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
