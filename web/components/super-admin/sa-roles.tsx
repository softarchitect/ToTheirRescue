"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { fetchUserRoles, createUserRole, updateUserRole, deleteUserRole, type UserRoleDTO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function SARoles() {
  const [roles, setRoles] = useState<UserRoleDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<UserRoleDTO | null>(null)
  const [deletingItem, setDeletingItem] = useState<UserRoleDTO | null>(null)
  const [newName, setNewName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadRoles()
  }, [])

  const loadRoles = async () => {
    setIsLoading(true)
    try {
      const data = await fetchUserRoles()
      setRoles(data)
    } catch (error) {
      console.error("Failed to load roles", error)
      toast({
        title: "Error",
        description: "Failed to load roles.",
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

  const handleEdit = (item: UserRoleDTO) => {
    setEditingItem(item)
    setNewName(item.name)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (item: UserRoleDTO) => {
    setDeletingItem(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingItem) return

    try {
      await deleteUserRole(deletingItem.id)
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
      setDeletingItem(null)
      await loadRoles()
    } catch (error: any) {
      console.error("Failed to delete role", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete role. The role may be assigned to users.",
        variant: "destructive",
      })
    }
  }

  const handleSaveAdd = async () => {
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Role name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await createUserRole(newName.trim())
      toast({
        title: "Success",
        description: "Role created successfully.",
      })
      setIsAddDialogOpen(false)
      setNewName("")
      await loadRoles()
    } catch (error: any) {
      console.error("Failed to create role", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create role. Role name may already exist.",
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
        description: "Role name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateUserRole(editingItem.id, newName.trim())
      toast({
        title: "Success",
        description: "Role updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setNewName("")
      await loadRoles()
    } catch (error: any) {
      console.error("Failed to update role", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update role. Role name may already exist.",
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
          <h2 className="text-2xl font-semibold mb-2">User Roles</h2>
          <p className="text-muted-foreground">
            Manage user roles that define permissions and access levels (e.g., Administrator, User, SuperAdministrator).
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

      {/* List of Roles */}
      <div className="space-y-0">
        {roles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No roles found. Click "Add" to create one.
          </div>
        ) : (
          roles.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <span className="text-gray-800">{item.name}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(item)}
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
            <DialogTitle>Add Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Role Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              autoFocus
              placeholder="e.g., Administrator"
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
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FloatingInput
              label="Role Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
              autoFocus
              placeholder="e.g., Administrator"
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to delete the role "{deletingItem?.name}"? This action cannot be undone.
              If the role is assigned to any users, it cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingItem(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
