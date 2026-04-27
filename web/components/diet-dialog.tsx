"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { updateAnimalDiet } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface DietDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

export function DietDialog({ animals, open, onOpenChange, onSaved }: DietDialogProps) {
  const { toast } = useToast()
  const [foodType, setFoodType] = useState("")
  const [amount, setAmount] = useState("")
  const [frequency, setFrequency] = useState("")
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildDietString = () => {
    const parts: string[] = []
    if (foodType.trim()) parts.push(foodType.trim())
    if (amount.trim()) parts.push(`Amount: ${amount.trim()}`)
    if (frequency.trim()) parts.push(`Frequency: ${frequency.trim()}`)
    if (notes.trim()) parts.push(`Notes: ${notes.trim()}`)
    return parts.join(" | ")
  }

  const resetState = () => {
    setFoodType("")
    setAmount("")
    setFrequency("")
    setNotes("")
    setError(null)
  }

  const handleSave = async () => {
    if (!animals.length) {
      onOpenChange(false)
      return
    }

    const diet = buildDietString()
    if (!diet) {
      setError("Please enter at least one field for the diet.")
      return
    }

    try {
      setIsSaving(true)
      const response = await updateAnimalDiet({
        animalIds: animals.map((a) => a.id),
        diet,
      })
      
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Diet updated successfully",
          variant: "success",
        })
        if (onSaved) onSaved()
        onOpenChange(false)
        resetState()
      } else {
        const errorMessage = response.errors?.[0] || "Failed to save diet"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Failed to save diet", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to save diet. Please try again."
      setError(errorMessage)
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
          <DialogTitle>Set Current Diet</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animals} />

          <div>
            <FloatingInput
              label="Food Type"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FloatingInput
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div>
              <FloatingInput
                label="Frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>
          </div>

          <div>
            <FloatingTextarea
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isSaving || !animals.length}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Save
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-right pt-1">{error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
