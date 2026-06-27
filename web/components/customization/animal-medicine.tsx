"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { fetchMedicines, createMedicine, updateMedicine, deleteMedicine, type Medicine } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { DataTable, type Column } from "@/components/ui/data-table"

export function AnimalMedicine() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Medicine | null>(null)
  const [medicineName, setMedicineName] = useState("")
  const [usedFor, setUsedFor] = useState("")
  const [medicineNameError, setMedicineNameError] = useState("")
  const [usedForError, setUsedForError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    setIsLoading(true)
    try {
      const data = await fetchMedicines()
      setMedicines(data)
    } catch (error) {
      console.error("Failed to load medicines", error)
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
    setMedicineNameError("")
    setUsedForError("")
    setIsAddDialogOpen(true)
  }

  const handleEdit = (item: Medicine) => {
    setEditingItem(item)
    setMedicineName(item.medicineName)
    setUsedFor(item.usedFor)
    setMedicineNameError("")
    setUsedForError("")
    setIsEditDialogOpen(true)
  }

  const validateMedicineForm = () => {
    let hasError = false

    if (!medicineName.trim()) {
      setMedicineNameError("This field is required.")
      hasError = true
    } else {
      setMedicineNameError("")
    }

    if (!usedFor.trim()) {
      setUsedForError("This field is required.")
      hasError = true
    } else {
      setUsedForError("")
    }

    return !hasError
  }

  const handleDelete = async (item: Medicine) => {
    if (!confirm(`Delete "${item.medicineName}"? This cannot be undone.`)) return
    try {
      await deleteMedicine(Number(item.id))
      toast({
        title: "Success",
        description: "Medicine deleted successfully.",
      })
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
    if (!validateMedicineForm()) {
      return
    }

    setIsSaving(true)
    try {
      await createMedicine(medicineName.trim(), usedFor.trim())
      toast({
        title: "Success",
        description: "Medicine added successfully.",
      })
      setIsAddDialogOpen(false)
      setMedicineName("")
      setUsedFor("")
      setMedicineNameError("")
      setUsedForError("")
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
    if (!editingItem) return
    if (!validateMedicineForm()) {
      return
    }

    setIsSaving(true)
    try {
      await updateMedicine(Number(editingItem.id), medicineName.trim(), usedFor.trim())
      toast({
        title: "Success",
        description: "Medicine updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setMedicineName("")
      setUsedFor("")
      setMedicineNameError("")
      setUsedForError("")
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

  const columns: Column<Medicine>[] = [
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
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div className="flex flex-col items-start min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">Medicines</h2>
          <p className="text-muted-foreground">
            Manage medicines and medications used in your organization.
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

      {/* Data Table */}
      <div className="min-w-0 overflow-x-auto">
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
        emptyMessage="No data"
        headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
      />
      </div>

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Medicine</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveAdd()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Medicine Name"
                value={medicineName}
                onChange={(e) => {
                  setMedicineName(e.target.value)
                  if (medicineNameError) setMedicineNameError("")
                }}
                error={medicineNameError}
                required
                autoFocus
              />
              <FloatingInput
                label="Used For"
                value={usedFor}
                onChange={(e) => {
                  setUsedFor(e.target.value)
                  if (usedForError) setUsedForError("")
                }}
                error={usedForError}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setMedicineNameError("")
                  setUsedForError("")
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
            <DialogTitle>Edit Medicine</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleSaveEdit()
            }}
          >
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Medicine Name"
                value={medicineName}
                onChange={(e) => {
                  setMedicineName(e.target.value)
                  if (medicineNameError) setMedicineNameError("")
                }}
                error={medicineNameError}
                required
                autoFocus
              />
              <FloatingInput
                label="Used For"
                value={usedFor}
                onChange={(e) => {
                  setUsedFor(e.target.value)
                  if (usedForError) setUsedForError("")
                }}
                error={usedForError}
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingItem(null)
                  setMedicineName("")
                  setUsedFor("")
                  setMedicineNameError("")
                  setUsedForError("")
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
