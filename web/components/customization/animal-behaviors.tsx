"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { fetchAnimalTypes, fetchAnimalBehaviors, createAnimalBehavior, updateAnimalBehavior, deleteAnimalBehavior, type AnimalTypeDTO, type AnimalBehavior } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"

interface AnimalBehaviorsProps {
  animalIdToType: Record<number, string>
  onChangeAnimalType: (value: number | null) => void
  animalTypeList: any[]
  animalType: number | null
}

export function AnimalBehaviors({
  animalIdToType,
  onChangeAnimalType,
  animalTypeList,
  animalType,
}: AnimalBehaviorsProps) {
  const [animalBehaviors, setAnimalBehaviors] = useState<AnimalBehavior[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AnimalBehavior | null>(null)
  const [newName, setNewName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [selectedAnimalType, setSelectedAnimalType] = useState<number | null>(animalType)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedAnimalType) {
      loadAnimalBehaviors(selectedAnimalType)
    } else {
      setAnimalBehaviors([])
      setIsLoading(false)
    }
  }, [selectedAnimalType])

  useEffect(() => {
    if (animalType) {
      setSelectedAnimalType(animalType)
    }
  }, [animalType])

  const loadAnimalBehaviors = async (animalTypeId: number) => {
    setIsLoading(true)
    try {
      const data = await fetchAnimalBehaviors(animalTypeId)
      setAnimalBehaviors(data)
    } catch (error) {
      console.error("Failed to load animal behaviors", error)
      toast({
        title: "Error",
        description: "Failed to load animal behaviors.",
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

  const handleEdit = (item: AnimalBehavior) => {
    setEditingItem(item)
    setNewName(item.kind)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: AnimalBehavior) => {
    if (!selectedAnimalType) return
    if (!confirm(`Delete "${item.kind}"? This cannot be undone.`)) return
    try {
      await deleteAnimalBehavior(Number(item.id))
      toast({
        title: "Success",
        description: "Animal behavior deleted successfully.",
      })
      await loadAnimalBehaviors(selectedAnimalType)
    } catch (error: any) {
      console.error("Failed to delete animal behavior", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete animal behavior.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAdd = async () => {
    if (!newName.trim() || !selectedAnimalType) {
      toast({
        title: "Error",
        description: "Animal behavior name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await createAnimalBehavior(newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Animal behavior added successfully.",
      })
      setIsAddDialogOpen(false)
      setNewName("")
      await loadAnimalBehaviors(selectedAnimalType)
    } catch (error: any) {
      console.error("Failed to create animal behavior", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add animal behavior.",
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
        description: "Animal behavior name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateAnimalBehavior(Number(editingItem.id), newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Animal behavior updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      if (selectedAnimalType) {
        await loadAnimalBehaviors(selectedAnimalType)
      }
    } catch (error: any) {
      console.error("Failed to update animal behavior", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update animal behavior.",
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

  const selectedTypeName =
    selectedAnimalType != null
      ? (animalIdToType[selectedAnimalType] ||
        animalTypeList.find((t: any) => Number(t.id) === Number(selectedAnimalType))?.typeName ||
        "Animal Type")
      : "Animal Type"

  return (
    <div className="space-y-2">
      {/* Header with Add Button */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-2">Animal Behaviors</h2>
          <p className="text-muted-foreground">
            Manage behavior types for different animal types (e.g., Aggressive, Friendly, Shy, etc.).
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

      {/* List of Animal Behaviors */}
      <div className="space-y-0">
        {!selectedAnimalType ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select an animal type to view animal behaviors.
          </div>
        ) : animalBehaviors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No animal behaviors found. Click "Add" to create one.
          </div>
        ) : (
          animalBehaviors.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-28">
                  <span className="inline-flex w-full justify-center items-center rounded-md bg-emerald-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
                    {selectedTypeName}
                  </span>
                </div>
                <span className="text-gray-800 truncate">{item.kind}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleDelete(item)}
                  className="text-red-600 hover:text-red-700 hover:bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Animal Behavior</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveAdd()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Animal Behavior Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Animal Behavior</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Animal Behavior Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
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
    </div>
  )
}
