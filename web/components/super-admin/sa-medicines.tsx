"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { fetchSAMedicines, createSAMedicine, updateSAMedicine, deleteSAMedicine, type SAMedicineDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { DataTable, type Column } from "@/components/ui/data-table"

export function SAMedicines() {
  const [medicines, setMedicines] = useState<SAMedicineDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SAMedicineDTO | null>(null)
  const [medicineName, setMedicineName] = useState("")
  const [usedFor, setUsedFor] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    setIsLoading(true)
    try {
      const data = await fetchSAMedicines()
      setMedicines(data)
    } catch (error) {
      console.error("Failed to load SA medicines", error)
      toast({
        title: "Error",
        description: "Failed to load medicines.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setMedicineName("")
    setUsedFor("")
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item: SAMedicineDTO) => {
    setEditingItem(item)
    setMedicineName(item.medicineName)
    setUsedFor(item.usedFor)
    setIsEditDialogOpen(true)
  }

  const handleDelete = async (item: SAMedicineDTO) => {
    if (!confirm(`Delete "${item.medicineName}"? This cannot be undone.`)) return
    try {
      await deleteSAMedicine(Number(item.id))
      toast({ title: "Success", description: "Medicine deleted successfully." })
      await loadMedicines()
    } catch (error: any) {
      console.error("Failed to delete medicine", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete medicine.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAdd = async () => {
    if (!medicineName.trim()) {
      toast({
        title: "Error",
        description: "Medicine name is required.",
        variant: "destructive",
      })
      return
    }
    if (!usedFor.trim()) {
      toast({
        title: "Error",
        description: "Used for is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await createSAMedicine(medicineName.trim(), usedFor.trim())
      toast({
        title: "Success",
        description: "Medicine added successfully.",
      })
      setIsAddDialogOpen(false)
      setMedicineName("")
      setUsedFor("")
      await loadMedicines()
    } catch (error: any) {
      console.error("Failed to create medicine", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add medicine.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveEdit = async () => {
    if (!medicineName.trim() || !usedFor.trim() || !editingItem) {
      toast({
        title: "Error",
        description: "Medicine name and used for are required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateSAMedicine(Number(editingItem.id), medicineName.trim(), usedFor.trim())
      toast({
        title: "Success",
        description: "Medicine updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setMedicineName("")
      setUsedFor("")
      await loadMedicines()
    } catch (error: any) {
      console.error("Failed to update medicine", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update medicine.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const columns: Column<SAMedicineDTO>[] = [
    {
      key: "medicineName",
      header: "Medicine Name",
      render: (medicine) => (
        <span className="text-gray-800">{medicine.medicineName}</span>
      ),
    },
    {
      key: "usedFor",
      header: "Used For",
      render: (medicine) => (
        <span className="text-gray-800">{medicine.usedFor}</span>
      ),
    },
  ]

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
          <h2 className="text-2xl font-semibold mb-2">Medicines</h2>
          <p className="text-muted-foreground">
            Manage global medicines and medications that will be available as templates for all tenants.
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

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={medicines}
        getRowId={(medicine) => medicine.id}
        actions={(medicine) => (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(medicine)}
              className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void handleDelete(medicine)}
              className="text-red-600 hover:text-red-700 hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        actionsHeader="Action"
        emptyMessage="No medicines found. Click 'Add' to create one."
        headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
      />

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Medicine Name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              required
              autoFocus
            />
            <FloatingInput
              label="Used For"
              value={usedFor}
              onChange={(e) => setUsedFor(e.target.value)}
              required
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
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Medicine Name"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              required
              autoFocus
            />
            <FloatingInput
              label="Used For"
              value={usedFor}
              onChange={(e) => setUsedFor(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false)
                setEditingItem(null)
                setMedicineName("")
                setUsedFor("")
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

