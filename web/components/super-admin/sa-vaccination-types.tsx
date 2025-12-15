"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil } from "lucide-react"
import { fetchSAAnimalTypes, fetchSAVaccinationTypes, createSAVaccinationType, updateSAVaccinationType, type SAAnimalTypeDTO, type SAVaccinationTypeDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"

interface SAVaccinationTypesProps {
  animalIdToType: Record<number, string>
  onChangeAnimalType: (value: number | null) => void
  animalTypeList: SAAnimalTypeDTO[]
  animalType: number | null
}

export function SAVaccinationTypes({
  animalIdToType,
  onChangeAnimalType,
  animalTypeList,
  animalType,
}: SAVaccinationTypesProps) {
  const [vaccinationTypes, setVaccinationTypes] = useState<SAVaccinationTypeDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SAVaccinationTypeDTO | null>(null)
  const [newName, setNewName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [selectedAnimalType, setSelectedAnimalType] = useState<number | null>(animalType)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedAnimalType) {
      loadVaccinationTypes(selectedAnimalType)
    } else {
      setVaccinationTypes([])
      setIsLoading(false)
    }
  }, [selectedAnimalType])

  useEffect(() => {
    if (animalType) {
      setSelectedAnimalType(animalType)
    }
  }, [animalType])

  const loadVaccinationTypes = async (animalTypeId: number) => {
    setIsLoading(true)
    try {
      const data = await fetchSAVaccinationTypes(animalTypeId)
      setVaccinationTypes(data)
    } catch (error) {
      console.error("Failed to load SA vaccination types", error)
      toast({
        title: "Error",
        description: "Failed to load vaccination types.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    if (!selectedAnimalType) {
      toast({
        title: "Error",
        description: "Please select an animal type first.",
        variant: "destructive",
      })
      return
    }
    setNewName("")
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item: SAVaccinationTypeDTO) => {
    setEditingItem(item)
    setNewName(item.kind)
    setIsEditDialogOpen(true)
  }

  const handleSaveAdd = async () => {
    if (!newName.trim() || !selectedAnimalType) {
      toast({
        title: "Error",
        description: "Vaccination type name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await createSAVaccinationType(newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Vaccination type added successfully.",
      })
      setIsAddDialogOpen(false)
      setNewName("")
      await loadVaccinationTypes(selectedAnimalType)
    } catch (error: any) {
      console.error("Failed to create vaccination type", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add vaccination type.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!newName.trim() || !editingItem || !selectedAnimalType) {
      toast({
        title: "Error",
        description: "Vaccination type name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateSAVaccinationType(Number(editingItem.id), newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Vaccination type updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      if (selectedAnimalType) {
        await loadVaccinationTypes(selectedAnimalType)
      }
    } catch (error: any) {
      console.error("Failed to update vaccination type", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update vaccination type.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-muted rounded"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Header with Add Button */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-2">Vaccination Types</h2>
          <p className="text-muted-foreground">
            Manage global vaccination types for different animal types (e.g., Rabies, DHPP, FVRCP, etc.).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-full">
            <FloatingSelect
              label="Animal Type"
              className="w-30"
              value={selectedAnimalType ? String(selectedAnimalType) : ""}
              onValueChange={(value) => {
                const animalTypeId = value ? Number(value) : null
                setSelectedAnimalType(animalTypeId)
                onChangeAnimalType(animalTypeId)
              }}
            >
              {animalTypeList.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.typeName}
                </SelectItem>
              ))}
            </FloatingSelect>
          </div>
          <Button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={!selectedAnimalType}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-px bg-gray-300"></div>

      {/* List of Vaccination Types */}
      <div className="space-y-0">
        {!selectedAnimalType ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select an animal type to view vaccination types.
          </div>
        ) : vaccinationTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No vaccination types found. Click "Add" to create one.
          </div>
        ) : (
          vaccinationTypes.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-800">{item.kind}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Vaccination Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Vaccination Type Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAdd}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Vaccination Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Vaccination Type Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingItem(null)
                setNewName("")
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

