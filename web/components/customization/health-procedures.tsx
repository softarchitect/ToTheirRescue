"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { fetchAnimalTypes, fetchHealthProcedures, createHealthProcedure, updateHealthProcedure, deleteHealthProcedure, type AnimalTypeDTO, type HealthProcedure } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface HealthProceduresProps {
  animalIdToType: Record<number, string>
  onChangeAnimalType: (value: number | null) => void
  animalTypeList: any[]
  animalType: number | null
}

export function HealthProcedures({
  animalIdToType,
  onChangeAnimalType,
  animalTypeList,
  animalType,
}: HealthProceduresProps) {
  const [healthProcedures, setHealthProcedures] = useState<HealthProcedure[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<HealthProcedure | null>(null)
  const [newName, setNewName] = useState("")
  const [newNameError, setNewNameError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [selectedAnimalType, setSelectedAnimalType] = useState<number | null>(animalType)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedAnimalType) {
      loadHealthProcedures(selectedAnimalType)
    } else {
      setHealthProcedures([])
      setIsLoading(false)
    }
  }, [selectedAnimalType])

  useEffect(() => {
    if (animalType) {
      setSelectedAnimalType(animalType)
    }
  }, [animalType])

  const loadHealthProcedures = async (animalTypeId: number) => {
    setIsLoading(true)
    try {
      const data = await fetchHealthProcedures(animalTypeId)
      setHealthProcedures(data)
    } catch (error) {
      console.error("Failed to load health procedures", error)
      toast({
        title: "Error",
        description: "Failed to load health procedures.",
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

  const handleEdit = (item: HealthProcedure) => {
    setEditingItem(item)
    setNewName(item.kind)
    setNewNameError("")
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: HealthProcedure) => {
    if (!selectedAnimalType) return
    if (!confirm(`Delete "${item.kind}"? This cannot be undone.`)) return
    try {
      await deleteHealthProcedure(Number(item.id))
      toast({
        title: "Success",
        description: "Health procedure deleted successfully.",
      })
      await loadHealthProcedures(selectedAnimalType)
    } catch (error: any) {
      console.error("Failed to delete health procedure", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete health procedure.",
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
      await createHealthProcedure(newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Health procedure added successfully.",
      })
      setIsAddDialogOpen(false)
      setNewName("")
      setNewNameError("")
      await loadHealthProcedures(selectedAnimalType)
    } catch (error: any) {
      console.error("Failed to create health procedure", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add health procedure.",
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
      await updateHealthProcedure(Number(editingItem.id), newName.trim(), selectedAnimalType)
      toast({
        title: "Success",
        description: "Health procedure updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      setNewNameError("")
      if (selectedAnimalType) {
        await loadHealthProcedures(selectedAnimalType)
      }
    } catch (error: any) {
      console.error("Failed to update health procedure", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update health procedure.",
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
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-2xl font-semibold mb-2">Health Procedures</h2>
          <p className="text-muted-foreground">
            Manage health procedures and treatments for different animal types.
          </p>
          <div className="flex items-center gap-2">
            <Select
              value={selectedAnimalType ? String(selectedAnimalType) : ""}
              onValueChange={(value) => {
                const animalTypeId = value ? Number(value) : null
                setSelectedAnimalType(animalTypeId)
                onChangeAnimalType(animalTypeId)
              }}
            >
              <SelectTrigger className="w-44 border-emerald-700 bg-emerald-600 text-white data-[placeholder]:text-emerald-100 hover:bg-emerald-700 focus-visible:ring-emerald-500 [&_svg]:text-white">
                <SelectValue placeholder="Animal Type" />
              </SelectTrigger>
              <SelectContent>
                {animalTypeList.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.typeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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

      {/* Separator Line */}
      <div className="h-px bg-gray-300"></div>

      {/* List of Health Procedures */}
      <div className="space-y-0">
        {!selectedAnimalType ? (
          <div className="text-center py-8 text-muted-foreground">
            Please select an animal type to view health procedures.
          </div>
        ) : healthProcedures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No health procedures found. Click "Add" to create one.
          </div>
        ) : (
          healthProcedures.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center min-w-0">
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
            <DialogTitle>Add Health Procedure</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveAdd()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Health Procedure Name"
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
            <DialogTitle>Edit Health Procedure</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Health Procedure Name"
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
