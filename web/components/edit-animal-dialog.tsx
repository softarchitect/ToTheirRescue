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
import type { Animal, AnimalStatus } from "@/lib/types"
import { Sparkles } from "lucide-react"

interface EditAnimalDialogProps {
  animal: Animal | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (animal: Animal) => void
}

export function EditAnimalDialog({ animal, open, onOpenChange, onSave }: EditAnimalDialogProps) {
  const [formData, setFormData] = useState<
    Partial<
      Animal & {
        color?: string
        chronicCondition?: string
        spayedNeutered?: boolean
      }
    >
  >({
    name: "",
    breed: "",
    age: 0,
    gender: "female",
    status: "available",
    color: "",
    chronicCondition: "",
    description: "",
    spayedNeutered: false,
  })

  useEffect(() => {
    if (animal) {
      setFormData({
        ...animal,
        color: "",
        chronicCondition: "",
        spayedNeutered: false,
      })
    }
  }, [animal])

  const suggestName = () => {
    const names = ["Buddy", "Max", "Luna", "Bella", "Charlie", "Lucy", "Cooper", "Daisy"]
    const randomName = names[Math.floor(Math.random() * names.length)]
    setFormData({ ...formData, name: randomName })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (animal) {
      onSave({ ...animal, ...formData } as Animal)
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Button type="button" variant="outline" onClick={suggestName} className="gap-2 bg-transparent">
                  <Sparkles className="h-4 w-4" />
                  Suggest
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <FloatingInput
                id="edit-age"
                label="Age"
                type="number"
                min="0"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FloatingInput
                id="edit-breed"
                label="Breed/Species"
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
                className="gap-1.5 h-10 px-3 bg-transparent w-full"
                onValueChange={(value) => setFormData({ ...formData, gender: value as "male" | "female" })}
              >
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </FloatingSelect>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FloatingSelect
                id="edit-status"
                label="Status"
                value={formData.status}
                className="gap-1.5 h-10 px-3 bg-transparent w-full"
                onValueChange={(value) => setFormData({ ...formData, status: value as AnimalStatus })}
              >
                <SelectItem value="available">Adoptable</SelectItem>
                <SelectItem value="fostered">Permanent Resident</SelectItem>
                <SelectItem value="quarantine">Quarantine Hold</SelectItem>
                <SelectItem value="medical">Medical Care</SelectItem> 
                <SelectItem value="adopted">Adopted</SelectItem>
                <SelectItem value="released">Released</SelectItem>
              </FloatingSelect>
            </div>

            <div className="space-y-2">
              <FloatingInput
                id="edit-color"
                label="Color"
                value={formData.color}
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
    </Dialog>
  )
}
