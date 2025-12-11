"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { Label } from "@/components/ui/label"
import { SelectItem } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Animal, AnimalStatus, AnimalType } from "@/lib/types"
import { fetchAnimalTypes } from "@/lib/api"
import type { AnimalTypeDTO } from "@/lib/api"
import { Sparkles } from "lucide-react"

interface EditAnimalDialogProps {
  animal: Animal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (animal: Animal) => void
}

export function EditAnimalDialog({ animal, open, onOpenChange, onSave }: EditAnimalDialogProps) {
  const [animalTypeOptions, setAnimalTypeOptions] = useState<AnimalTypeDTO[]>([])
  const [selectedAnimalTypeId, setSelectedAnimalTypeId] = useState<number | null>(null)

  const [formData, setFormData] = useState<
    Partial<
      Animal & {
        color?: string
        chronicCondition?: string
      }
    >
  >({
    name: "",
    breed: "",
    type: "",
    gender: "female",
    status: "available",
    color: "",
    chronicCondition: "",
    description: "",
    spayedNeutered: false,
  })

  useEffect(() => {
    if (!open) return

    const fetchAnimalTypesData = async () => {
      try {
        const apiTypes = await fetchAnimalTypes()
        if (apiTypes.length === 0) return
        setAnimalTypeOptions(apiTypes.map((item) => ({
          id: item.id,
          typeName: item.typeName,
        })))
      } catch (error) {
        console.error("Failed to load animal types", error)
      }
    }

    fetchAnimalTypesData()
  }, [open])

  useEffect(() => {
    if (animal) {
      setFormData({
        name: animal.name,
        breed: animal.breed,
        type: animal.type ?? "",
        gender: animal.gender ?? "unknown",
        status: animal.status ?? "available",
        color: animal.color ?? "",
        chronicCondition: animal.chronicCondition ?? "",
        description: animal.description ?? "",
        spayedNeutered: animal.spayedNeutered ?? false,
      })

      // Set selected animal type ID based on animalTypeId (preferred) or fallback to type name
      if (animalTypeOptions.length > 0) {
        if (animal.animalTypeId) {
          const matchingType = animalTypeOptions.find(t => t.id === animal.animalTypeId)
          if (matchingType) {
            setSelectedAnimalTypeId(matchingType.id)
            setFormData(prev => ({ ...prev, type: matchingType.typeName }))
          }
        } else if (animal.type) {
          // Fallback: try to match by type name (for backwards compatibility)
          const matchingType = animalTypeOptions.find(t => t.typeName.toLowerCase() === animal.type?.toLowerCase())
          if (matchingType) {
            setSelectedAnimalTypeId(matchingType.id)
            setFormData(prev => ({ ...prev, type: matchingType.typeName }))
          }
        }
      }
    }
  }, [animal, animalTypeOptions])

  const suggestName = () => {
    const names = ["Buddy", "Max", "Luna", "Bella", "Charlie", "Lucy", "Cooper", "Daisy"]
    const randomName = names[Math.floor(Math.random() * names.length)]
    setFormData({ ...formData, name: randomName })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (animal) {
      // Get the type name from selectedAnimalTypeId if available
      let finalType = formData.type
      let finalAnimalTypeId = animal.animalTypeId

      if (selectedAnimalTypeId) {
        const selectedType = animalTypeOptions.find(t => t.id === selectedAnimalTypeId)
        if (selectedType) {
          finalType = selectedType.typeName
          finalAnimalTypeId = selectedType.id
        }
      }

      onSave({
        ...animal,
        ...formData,
        type: finalType,
        animalTypeId: finalAnimalTypeId,
      } as Animal)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Edit Animal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <FloatingInput
                  id="edit-name"
                  label="Name"
                  className="gap-1.5 h-15 px-3 bg-transparent w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Button type="button" variant="outline" onClick={suggestName} className="gap-2 bg-transparent h-15">
                  <Sparkles className="h-4 w-4" />
                  Suggest
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {
                animalTypeOptions.length > 0 ?
                  (<FloatingSelect
                    id="edit-type"
                    label="Type"
                    value={selectedAnimalTypeId ? animalTypeOptions.find(t => t.id === selectedAnimalTypeId)?.typeName || "" : formData.type || ""}
                    className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                    onValueChange={(value) => {
                      const selectedType = animalTypeOptions.find(t => t.typeName === value)
                      if (selectedType) {
                        setSelectedAnimalTypeId(selectedType.id)
                        setFormData({ ...formData, type: selectedType.typeName })
                      }
                    }}
                  >
                    {
                      animalTypeOptions.map((type) => (
                        <SelectItem key={type.id} value={type.typeName}>
                          {type.typeName}
                        </SelectItem>
                      ))
                    }
                  </FloatingSelect>
                  ) : (
                    <FloatingSelect label="Type">
                      <SelectItem value="unknown" disabled>
                        Loading types...
                      </SelectItem>
                    </FloatingSelect>
                  )
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FloatingInput
                id="edit-breed"
                label="Breed/Species"
                className="gap-1.5 h-15 px-3 bg-transparent w-full"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <FloatingSelect
                id="edit-gender"
                label="Gender"
                value={formData.gender}
                className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" })}
              >
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </FloatingSelect>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FloatingSelect
                id="edit-status"
                label="Status"
                value={formData.status}
                className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                onValueChange={(value) => setFormData({ ...formData, status: value as AnimalStatus })}
              >
                <SelectItem value="available">Adoptable</SelectItem>
                <SelectItem value="fostered">Permanent Resident</SelectItem>
                <SelectItem value="quarantine">Quarantine Hold</SelectItem>
                <SelectItem value="medical">Medical Care Hold</SelectItem>
              </FloatingSelect>
            </div>

            <div className="space-y-2">
              <FloatingInput
                id="edit-color"
                label="Color"
                value={formData.color}
                className="gap-1.5 h-15 px-3 bg-transparent w-full"
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g., Mostly white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <FloatingInput
              id="edit-chronic"
              label="Chronic Condition"
              value={formData.chronicCondition}
              className="gap-1.5 h-15 px-3 bg-transparent w-full"
              onChange={(e) => setFormData({ ...formData, chronicCondition: e.target.value })}
              placeholder="Any ongoing conditions"
            />
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <Switch
              id="edit-spayed"
              checked={formData.spayedNeutered}
              onCheckedChange={(checked) => setFormData({ ...formData, spayedNeutered: checked })}
            />
            <Label htmlFor="edit-spayed" className="font-medium">
              Spayed or Neutered <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
          </div>

          <div className="space-y-2">
            <FloatingTextarea
              id="edit-notes"
              label="Notes"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Additional information"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
