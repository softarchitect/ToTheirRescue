"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Animal, Adoption } from "@/lib/types"

interface AdoptionDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (adoption: Adoption) => void
}

export function AdoptionDialog({ animals, open, onOpenChange, onSave }: AdoptionDialogProps) {
  const [formData, setFormData] = useState<Partial<Adoption>>({
    animalId: "",
    animalName: "",
    adopterName: "",
    adopterEmail: "",
    adopterPhone: "",
    adoptionDate: new Date().toISOString().split("T")[0],
    adoptionFee: 150,
    status: "pending",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.animalId) newErrors.animalId = "Animal is required"
    if (!formData.adopterName?.trim()) newErrors.adopterName = "Adopter name is required"
    if (!formData.adopterEmail?.trim()) newErrors.adopterEmail = "Email is required"
    if (!formData.adopterPhone?.trim()) newErrors.adopterPhone = "Phone is required"
    if (!formData.adoptionDate) newErrors.adoptionDate = "Adoption date is required"
    if (!formData.adoptionFee || formData.adoptionFee < 0) newErrors.adoptionFee = "Valid adoption fee is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSave({ ...formData, id: Date.now().toString() } as Adoption)
    setFormData({
      animalId: "",
      animalName: "",
      adopterName: "",
      adopterEmail: "",
      adopterPhone: "",
      adoptionDate: new Date().toISOString().split("T")[0],
      adoptionFee: 150,
      status: "pending",
    })
    setErrors({})
  }

  const handleAnimalChange = (animalId: string) => {
    const animal = animals.find((a) => a.id === animalId)
    if (animal) {
      setFormData({ ...formData, animalId, animalName: animal.name })
      if (errors.animalId) {
        setErrors({ ...errors, animalId: "" })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New Adoption Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Animal *</label>
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
            id="adopterName"
            label="Adopter Name"
            value={formData.adopterName || ""}
            onChange={(e) => {
              setFormData({ ...formData, adopterName: e.target.value })
              if (errors.adopterName) setErrors({ ...errors, adopterName: "" })
            }}
            required
            error={errors.adopterName}
          />

          <FloatingInput
            id="adopterEmail"
            label="Email"
            type="email"
            value={formData.adopterEmail || ""}
            onChange={(e) => {
              setFormData({ ...formData, adopterEmail: e.target.value })
              if (errors.adopterEmail) setErrors({ ...errors, adopterEmail: "" })
            }}
            required
            error={errors.adopterEmail}
          />

          <FloatingInput
            id="adopterPhone"
            label="Phone"
            type="tel"
            value={formData.adopterPhone || ""}
            onChange={(e) => {
              setFormData({ ...formData, adopterPhone: e.target.value })
              if (errors.adopterPhone) setErrors({ ...errors, adopterPhone: "" })
            }}
            required
            error={errors.adopterPhone}
          />

          <FloatingInput
            id="adoptionDate"
            label="Adoption Date"
            type="date"
            value={formData.adoptionDate || ""}
            onChange={(e) => {
              setFormData({ ...formData, adoptionDate: e.target.value })
              if (errors.adoptionDate) setErrors({ ...errors, adoptionDate: "" })
            }}
            required
            error={errors.adoptionDate}
          />

          <FloatingInput
            id="adoptionFee"
            label="Adoption Fee ($)"
            type="number"
            min="0"
            value={formData.adoptionFee?.toString() || ""}
            onChange={(e) => {
              setFormData({ ...formData, adoptionFee: Number.parseInt(e.target.value) || 0 })
              if (errors.adoptionFee) setErrors({ ...errors, adoptionFee: "" })
            }}
            required
            error={errors.adoptionFee}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Submit Application</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
