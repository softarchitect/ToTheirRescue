"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { fetchSAVolunteerActivities, createSAVolunteerActivity, updateSAVolunteerActivity, deleteSAVolunteerActivity, type SAVolunteerActivityDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"

export function SAVolunteerActivities() {
  const [activities, setActivities] = useState<SAVolunteerActivityDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SAVolunteerActivityDTO | null>(null)
  const [newName, setNewName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    setIsLoading(true)
    try {
      const data = await fetchSAVolunteerActivities()
      setActivities(data)
    } catch (error) {
      console.error("Failed to load SA volunteer activities", error)
      toast({
        title: "Error",
        description: "Failed to load volunteer activities.",
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

  const handleEdit = (item: SAVolunteerActivityDTO) => {
    setEditingItem(item)
    setNewName(item.saVolunteerActivityName)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: SAVolunteerActivityDTO) => {
    if (!confirm(`Delete "${item.saVolunteerActivityName}"? This cannot be undone.`)) return
    try {
      await deleteSAVolunteerActivity(Number(item.id))
      toast({ title: "Success", description: "Volunteer activity deleted successfully." })
      await loadActivities()
    } catch (error: any) {
      console.error("Failed to delete volunteer activity", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete volunteer activity.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAdd = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Volunteer activity name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await createSAVolunteerActivity(newName.trim())
      toast({
        title: "Success",
        description: "Volunteer activity added successfully.",
      })
      setIsAddDialogOpen(false)
      setNewName("")
      await loadActivities()
    } catch (error: any) {
      console.error("Failed to create volunteer activity", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add volunteer activity.",
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
        description: "Volunteer activity name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateSAVolunteerActivity(Number(editingItem.id), newName.trim())
      toast({
        title: "Success",
        description: "Volunteer activity updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      await loadActivities()
    } catch (error: any) {
      console.error("Failed to update volunteer activity", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update volunteer activity.",
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
          <h2 className="text-2xl font-semibold mb-2">Volunteer Activities</h2>
          <p className="text-muted-foreground">
            Manage global volunteer activities that will be available as templates for all tenants.
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

      {/* List of Volunteer Activities */}
      <div className="space-y-0">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No volunteer activities found. Click "Add" to create one.
          </div>
        ) : (
          activities.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-800">{item.saVolunteerActivityName}</span>
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
            <DialogTitle>Add Volunteer Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Volunteer Activity Name"
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
            <DialogTitle>Edit Volunteer Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Volunteer Activity Name"
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

