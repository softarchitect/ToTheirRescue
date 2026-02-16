"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { fetchAcquisitionWays, createAcquisitionWay, updateAcquisitionWay, deleteAcquisitionWay, type AcquisitionWay } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"

export function AnimalAcquisitionWay() {
  const [acquisitionWays, setAcquisitionWays] = useState<AcquisitionWay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<AcquisitionWay | null>(null)
  const [newName, setNewName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadAcquisitionWays()
  }, [])

  const loadAcquisitionWays = async () => {
    setIsLoading(true)
    try {
      const data = await fetchAcquisitionWays()
      setAcquisitionWays(data)
    } catch (error) {
      console.error("Failed to load acquisition ways", error)
      toast({
        title: "Error",
        description: "Failed to load acquisition ways.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setNewName("")
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item: AcquisitionWay) => {
    setEditingItem(item)
    setNewName(item.acquisitionWayName)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: AcquisitionWay) => {
    if (!confirm(`Delete "${item.acquisitionWayName}"? This cannot be undone.`)) return
    try {
      await deleteAcquisitionWay(Number(item.id))
      toast({
        title: "Success",
        description: "Acquisition way deleted successfully.",
      })
      await loadAcquisitionWays()
    } catch (error: any) {
      console.error("Failed to delete acquisition way", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete acquisition way.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAdd = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Acquisition way name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await createAcquisitionWay(newName.trim())
      toast({
        title: "Success",
        description: "Acquisition way added successfully.",
      })
      setIsAddDialogOpen(false)
      setNewName("")
      await loadAcquisitionWays()
    } catch (error: any) {
      console.error("Failed to create acquisition way", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add acquisition way.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!newName.trim() || !editingItem) {
      toast({
        title: "Error",
        description: "Acquisition way name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateAcquisitionWay(Number(editingItem.id), newName.trim())
      toast({
        title: "Success",
        description: "Acquisition way updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      await loadAcquisitionWays()
    } catch (error: any) {
      console.error("Failed to update acquisition way", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update acquisition way.",
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
          <h2 className="text-2xl font-semibold mb-2">Animal Acquisition Ways</h2>
          <p className="text-muted-foreground">
            Manage how animals are acquired (e.g., Owner Surrender, Stray, Transfer, etc.).
          </p>
        </div>
        <div className="flex items-center">
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

      {/* List of Acquisition Ways */}
      <div className="space-y-0">
        {acquisitionWays.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No acquisition ways found. Click "Add" to create one.
          </div>
        ) : (
          acquisitionWays.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-800">{item.acquisitionWayName}</span>
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
            <DialogTitle>Add Acquisition Way</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveAdd()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Acquisition Way Name"
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
            <DialogTitle>Edit Acquisition Way</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Acquisition Way Name"
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
