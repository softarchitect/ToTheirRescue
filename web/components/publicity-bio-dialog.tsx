"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { updateAnimal } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface PublicityBioDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: (updatedAnimals: Animal[]) => void
}

export function PublicityBioDialog({ animals, open, onOpenChange, onSaved }: PublicityBioDialogProps) {
  const { toast } = useToast()
  const [value, setValue] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const initialValue = useMemo(() => {
    if (animals.length === 1) return animals[0].description || ""
    return ""
  }, [animals])

  useEffect(() => {
    if (!open) return
    setValue(initialValue)
  }, [open, initialValue])

  const handleSave = async () => {
    if (animals.length === 0) {
      onOpenChange(false)
      return
    }

    setIsSaving(true)
    try {
      const updated = await Promise.all(
        animals.map((animal) =>
          updateAnimal(animal.id, {
            notes: value.trim(),
          }),
        ),
      )

      if (onSaved) onSaved(updated)
      toast({
        title: "Success",
        description: "Publicity Bio saved.",
        variant: "success",
      })
      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save Publicity Bio.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void handleSave()
          }}
        >
          <DialogHeader>
            <DialogTitle>Publicity Bio</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <SelectedAnimalsHeader animals={animals} />
            <Textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  if (!isSaving) void handleSave()
                }
              }}
              className="min-h-[220px] bg-white"
              disabled={isSaving}
              placeholder="Write the public-facing bio for selected animal(s)."
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
