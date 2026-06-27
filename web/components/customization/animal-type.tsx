"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { fetchAnimalTypes, createAnimalType, updateAnimalType, deleteAnimalType, type AnimalTypeDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"

export function AnimalType() {
  const [animalTypes, setAnimalTypes] = useState<AnimalTypeDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AnimalTypeDTO | null>(null)
  const [newName, setNewName] = useState("")
  const [newNameError, setNewNameError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadAnimalTypes()
  }, [])

  const loadAnimalTypes = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAnimalTypes()
      setAnimalTypes(data)
    } catch (error) {
      console.error("Failed to load animal types", error)
      toast({
        title: "Error",
        description: "Failed to load animal types.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setNewName("")
    setNewNameError("")
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item: AnimalTypeDTO) => {
    setEditingItem(item)
    setNewName(item.typeName)
    setNewNameError("")
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: AnimalTypeDTO) => {
    if (!confirm(`Delete "${item.typeName}"? This cannot be undone.`)) return
    try {
      await deleteAnimalType(Number(item.id))
      toast({
        title: "Success",
        description: "Animal type deleted successfully.",
      })
      await loadAnimalTypes()
    } catch (error: any) {
      console.error("Failed to delete animal type", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete animal type.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAdd = async () => {
    if (!newName.trim()) {
      setNewNameError("This field is required.")
      return
    }
    setNewNameError("")

    setIsSaving(true)
    try {
      await createAnimalType(newName.trim())
      toast({
        title: "Success",
        description: "Animal type added successfully. Related behaviors, vaccinations, and procedures have been automatically copied from master templates if available.",
        duration: 5000,
      })
      setIsAddDialogOpen(false)
      setNewName("")
      setNewNameError("")
      await loadAnimalTypes()
    } catch (error: any) {
      console.error("Failed to create animal type", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add animal type.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return
    if (!newName.trim()) {
      setNewNameError("This field is required.")
      return
    }
    setNewNameError("")

    setIsSaving(true)
    try {
      await updateAnimalType(Number(editingItem.id), newName.trim())
      toast({
        title: "Success",
        description: "Animal type updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      setNewNameError("")
      await loadAnimalTypes()
    } catch (error: any) {
      console.error("Failed to update animal type", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update animal type.",
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
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div className="flex flex-col items-start min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Animal Types</h2>
          <p className="text-muted-foreground">
            Manage the types of animals in your system (e.g., Dogs, Cats, Parrots, etc.).
            <br />
            <span className="text-sm text-emerald-600">
              When you add a new animal type, related behaviors, vaccinations, and procedures will be automatically copied from master templates if available.
            </span>
          </p>
        </div>

        <div className="flex items-center shrink-0 self-start sm:self-auto">
          <Button
            onClick={handleAdd}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

      </div>

      {/* Separator Line */}
      <div className="h-px bg-gray-300"></div>

      {/* List of Animal Types */}
      <div className="space-y-0">
        {animalTypes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No animal types found. Click "Add" to create one.
          </div>
        ) : (
          animalTypes.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-800 min-w-0 break-words">{item.typeName}</span>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
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
            <DialogTitle>Add Animal Type</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveAdd()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Animal Type Name"
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
            <DialogTitle>Edit Animal Type</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Animal Type Name"
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
