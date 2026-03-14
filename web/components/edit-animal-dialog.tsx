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
import { fetchAnimalTypes, updateAnimal } from "@/lib/api"
import type { AnimalTypeDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Sparkles } from "lucide-react"
import { singularize } from "@/lib/text-utils"

interface EditAnimalDialogProps {
  animal: Animal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (animal: Animal) => void
}

export function EditAnimalDialog({ animal, open, onOpenChange, onSave }: EditAnimalDialogProps) {
  const { toast } = useToast()
  const [animalTypeOptions, setAnimalTypeOptions] = useState<AnimalTypeDTO[]>([])
  const [selectedAnimalTypeId, setSelectedAnimalTypeId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isFormerResident = Boolean(
    animal?.lastMilestone &&
      ["Adoption", "Lost", "Released", "Death", "Returned to Owner", "Transfer"].includes(
        animal.lastMilestone,
      ),
  )

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
    status: "",
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
      console.log("animal", animal)
      console.log("animal.status", animal.status)
      setFormData({
        name: animal.name,
        breed: animal.breed,
        type: animal.type ?? "",
        gender: animal.gender ?? "unknown",
        status: (animal.status ?? "").toLowerCase(),
        color: animal.color ?? "",
        chronicCondition: animal.chronicCondition ?? "",
        description: animal.description ?? "",
        spayedNeutered: animal.spayedNeutered ?? false,
      })

      // Set selected animal type ID based on animalTypeId (preferred) or fallback to type name
      if (animalTypeOptions.length > 0) {
        const animalTypeIdNum = Number(animal.animalTypeId)
        if (Number.isFinite(animalTypeIdNum) && animalTypeIdNum > 0) {
          const matchingType = animalTypeOptions.find((t) => Number(t.id) === animalTypeIdNum)
          if (matchingType) {
            setSelectedAnimalTypeId(Number(matchingType.id))
            setFormData(prev => ({ ...prev, type: matchingType.typeName }))
          }
        } else if (animal.type) {
          // Fallback: try to match by type name (for backwards compatibility)
          const raw = String(animal.type || "").trim().toLowerCase()
          const matchingType = animalTypeOptions.find((t) => {
            const opt = String(t.typeName || "").trim().toLowerCase()
            if (!opt || !raw) return false
            if (opt === raw) return true
            // Handle pluralization mismatch like "Dog" vs "Dogs"
            return opt === `${raw}s` || raw === `${opt}s`
          })
          if (matchingType) {
            setSelectedAnimalTypeId(Number(matchingType.id))
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!animal) return

    setIsSubmitting(true)

    try {
      // Get the animal type ID from selectedAnimalTypeId if available
      let finalAnimalTypeId = animal.animalTypeId

      if (selectedAnimalTypeId) {
        finalAnimalTypeId = selectedAnimalTypeId
      } else if (!finalAnimalTypeId) {
        // If no type is selected, show error
        toast({
          title: "Error",
          description: "Please select an animal type",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Map gender to sex (backend uses "sex" field)
      const sex = formData.gender === "male" ? "Male" : formData.gender === "female" ? "Female" : "Unknown"

      // Build payload matching backend expectations
      const payload = {
        animalName: formData.name || "",
        breed: formData.breed || "",
        color: formData.color || "",
        sex: sex,
        // Former residents should not have status changed.
        status: String((isFormerResident ? animal.status : formData.status) || animal.status || "available").toLowerCase(),
        animalTypeId: finalAnimalTypeId,
        chronicCondition: formData.chronicCondition || "",
        notes: formData.description || "",
        spayedOrNeutered: formData.spayedNeutered || false,
      }

      // Call the API to update the animal
      const updatedAnimal = await updateAnimal(animal.id, payload)

      // Show success notification
      toast({
        title: "Success",
        description: "Animal updated successfully",
        variant: "success",
      })

      // Call the onSave callback with the updated animal
      onSave(updatedAnimal)
      onOpenChange(false)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update animal"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
                          {singularize(type.typeName)}
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
                onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" | "unknown" })}
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
                onValueChange={(value) => setFormData({ ...formData, status: value.toLowerCase() })}
                disabled={isFormerResident}
              >
                <SelectItem value="adoptable">Adoptable</SelectItem>
                <SelectItem value="permanent resident">Permanent Resident</SelectItem>
                <SelectItem value="quarantine hold">Quarantine Hold</SelectItem>
                <SelectItem value="medical care hold">Medical Care Hold</SelectItem>
              </FloatingSelect>
              {isFormerResident ? (
                <p className="text-xs text-muted-foreground">
                  Status can’t be changed for Former Residents.
                </p>
              ) : null}
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
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}
