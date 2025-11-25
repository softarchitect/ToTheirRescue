"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Animal, Release } from "@/lib/types"

interface ReleaseDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (release: Release) => void
}

export function ReleaseDialog({ animals, open, onOpenChange, onSave }: ReleaseDialogProps) {
  const [formData, setFormData] = useState<Partial<Release>>({
    animalId: "",
    animalName: "",
    releaseDate: new Date().toISOString().split("T")[0],
    location: "",
    notes: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.animalId) newErrors.animalId = "Animal is required"
    if (!formData.releaseDate) newErrors.releaseDate = "Release date is required"
    if (!formData.location?.trim()) newErrors.location = "Location is required"
    if (!formData.notes?.trim()) newErrors.notes = "Notes are required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSave({ ...formData, id: Date.now().toString() } as Release)
    setFormData({
      animalId: "",
      animalName: "",
      releaseDate: new Date().toISOString().split("T")[0],
      location: "",
      notes: "",
    })
    setErrors({})
  }

  const handleAnimalChange = (animalId: string) => {
    const animal = animals.find((a) => a.id === animalId)
    if (animal) {
      setFormData({ ...formData, animalId, animalName: animal.name })
      if (errors.animalId) setErrors({ ...errors, animalId: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Wildlife Release</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Wildlife Animal *</label>
            <Select value={formData.animalId} onValueChange={handleAnimalChange}>
              <SelectTrigger className={errors.animalId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select an animal" />
              </SelectTrigger>
              <SelectContent>
                {animals.map((animal) => (
                  <SelectItem key={animal.id} value={animal.id}>
                    {animal.name} - {animal.breed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.animalId && <p className="text-xs text-red-500">{errors.animalId}</p>}
          </div>

          <FloatingInput
            id="releaseDate"
            label="Release Date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={formData.releaseDate || ""}
            onChange={(e) => {
              setFormData({ ...formData, releaseDate: e.target.value })
              if (errors.releaseDate) setErrors({ ...errors, releaseDate: "" })
            }}
            required
            error={errors.releaseDate}
          />

          <FloatingInput
            id="location"
            label="Release Location"
            value={formData.location || ""}
            onChange={(e) => {
              setFormData({ ...formData, location: e.target.value })
              if (errors.location) setErrors({ ...errors, location: "" })
            }}
            placeholder="e.g., Mountain Ridge Wildlife Area"
            required
            error={errors.location}
          />

          <FloatingTextarea
            id="notes"
            label="Notes"
            value={formData.notes || ""}
            onChange={(e) => {
              setFormData({ ...formData, notes: e.target.value })
              if (errors.notes) setErrors({ ...errors, notes: "" })
            }}
            placeholder="Recovery status, special considerations..."
            rows={3}
            required
            error={errors.notes}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Release</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
