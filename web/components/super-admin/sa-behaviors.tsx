"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Pencil } from "lucide-react"
import { fetchSAAnimalTypes, fetchSABehaviors, createSABehavior, updateSABehavior, deleteSABehavior, type SAAnimalTypeDTO, type SABehaviorDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"

interface SABehaviorsProps {
  animalIdToType: Record<number, string>
  onChangeAnimalType: (value: number | null) => void
  animalTypeList: SAAnimalTypeDTO[]
  animalType: number | null
}

export function SABehaviors({
  animalIdToType,
  onChangeAnimalType,
  animalTypeList,
  animalType,
}: SABehaviorsProps) {
  const [behaviors, setBehaviors] = useState<SABehaviorDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SABehaviorDTO | null>(null)
  const [newName, setNewName] = useState("")
  const [newNameError, setNewNameError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [selectedAnimalType, setSelectedAnimalType] = useState<number | null>(animalType)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedAnimalType) {
      loadBehaviors(selectedAnimalType)
    } else {
      setBehaviors([])
      setIsLoading(false)
    }
  }, [selectedAnimalType])

  useEffect(() => {
    if (animalType) {
      setSelectedAnimalType(animalType)
    }
  }, [animalType])

  const loadBehaviors = async (animalTypeId: number) => {
    setIsLoading(true)
    try {
      const data = await fetchSABehaviors(animalTypeId)
      setBehaviors(data)
    } catch (error) {
      console.error("Failed to load SA behaviors", error)
      toast({
        title: "Error",
        description: "Failed to load behaviors.",
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
    setNewNameError("")
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item: SABehaviorDTO) => {
    setEditingItem(item)
    setNewName(item.behaviorName)
    setNewNameError("")
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: SABehaviorDTO) => {
    if (!selectedAnimalType) return
    if (!confirm(`Delete "${item.behaviorName}"? This cannot be undone.`)) return
    try {
      await deleteSABehavior(Number(item.id))
      toast({ title: "Success", description: "Behavior deleted successfully." })
      await loadBehaviors(selectedAnimalType)
    } catch (error: any) {
      console.error("Failed to delete behavior", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete behavior.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAdd = async () => {
    if (!newName.trim() || !selectedAnimalType) {
      if (!newName.trim()) {
        setNewNameError("This field is required.")
      }
      return
    }
    setNewNameError("")

    setIsSaving(true)
    try {
      await createSABehavior(newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Behavior added successfully.",
      })
      setIsAddDialogOpen(false)
      setNewName("")
      setNewNameError("")
      await loadBehaviors(selectedAnimalType)
    } catch (error: any) {
      console.error("Failed to create behavior", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add behavior.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingItem || !selectedAnimalType) return
    if (!newName.trim()) {
      setNewNameError("This field is required.")
      return
    }
    setNewNameError("")

    setIsSaving(true)
    try {
      await updateSABehavior(Number(editingItem.id), newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Behavior updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      setNewNameError("")
      if (selectedAnimalType) {
        await loadBehaviors(selectedAnimalType)
      }
    } catch (error: any) {
      console.error("Failed to update behavior", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update behavior.",
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
          <h2 className="text-2xl font-semibold mb-2">Behaviors</h2>
          <p className="text-muted-foreground">
            Manage global behavior types for different animal types (e.g., Aggressive, Friendly, Shy, etc.).
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

      {/* List of Behaviors */}
      <div className="space-y-0">
        {!selectedAnimalType ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select an animal type to view behaviors.
          </div>
        ) : behaviors.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No behaviors found. Click "Add" to create one.
          </div>
        ) : (
          behaviors.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-800">{item.behaviorName}</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                  aria-label={`Edit ${item.behaviorName}`}
                >
                  <Pencil className="h-4 w-4" />
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
            <DialogTitle>Add Behavior</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveAdd()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Behavior Name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value)
                  if (newNameError) setNewNameError("")
                }}
                error={newNameError}
                required
                autoFocus
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setNewNameError("")
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Behavior</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Behavior Name"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value)
                  if (newNameError) setNewNameError("")
                }}
                error={newNameError}
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
                  setNewNameError("")
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

