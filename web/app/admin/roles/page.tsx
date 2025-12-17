"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, UserCog } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchUserRoles, createUserRole, updateUserRole, deleteUserRole, type UserRoleDTO } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
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

export default function RolesPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<UserRoleDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<UserRoleDTO | null>(null)
  const [roleToDelete, setRoleToDelete] = useState<UserRoleDTO | null>(null)
  const [newName, setNewName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Redirect AnimalManager and AnimalCaretaker users away from admin pages
  useEffect(() => {
    const role = getUserRole()
    if (role === "AnimalManager" || role === "AnimalCaretaker") {
      router.push("/animals")
    }
  }, [router])

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
    setEditingRole(null)
    setNewName("")
    setIsAddDialogOpen(true)
  }

  const handleEdit = (role: UserRoleDTO) => {
    setEditingRole(role)
    setNewName(role.name)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (role: UserRoleDTO) => {
    setRoleToDelete(role)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!roleToDelete) return

    try {
      await deleteUserRole(roleToDelete.id)
      toast({
        title: "Success",
        description: "Role deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
      setRoleToDelete(null)
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
    if (!newName.trim() || !editingRole) {
      toast({
        title: "Error",
        description: "Role name is required.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      await updateUserRole(editingRole.id, newName.trim())
      toast({
        title: "Success",
        description: "Role updated successfully.",
      })
      setIsEditDialogOpen(false)
      setEditingRole(null)
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

  const formatRoleName = (name: string) => {
    // Format role names like "SuperAdministrator" to "Super Administrator"
    return name.replace(/([a-z])([A-Z])/g, "$1 $2")
  }

  const columns: Column<UserRoleDTO>[] = [
    {
      key: "name",
      header: "Role Name",
      render: (role) => formatRoleName(role.name),
    },
    {
      key: "normalizedName",
      header: "Normalized Name",
      accessor: (role) => role.normalizedName || role.name.toUpperCase(),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <UserCog className="h-8 w-8 text-emerald-600" />
                Role Management
              </h1>
              <p className="text-muted-foreground">
                Manage user roles that define permissions and access levels for your organization.
              </p>
            </div>
            <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </motion.div>

        {/* Roles Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading roles...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={roles}
              getRowId={(role) => role.id}
              actions={(role) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(role)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                    title="Edit Role"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(role)}
                    className="text-red-600 hover:text-red-700 hover:bg-transparent"
                    title="Delete Role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              actionsHeader="Actions"
              emptyMessage="No roles found. Click 'Add Role' to create one."
              headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
            />
          )}
        </motion.div>

        {/* Add Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <FloatingInput
                label="Role Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                autoFocus
                placeholder="e.g., Administrator, Manager, Viewer"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSaving && newName.trim()) {
                    handleSaveAdd()
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                Role names are case-insensitive and will be normalized automatically.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false)
                  setNewName("")
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAdd}
                disabled={isSaving || !newName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSaving ? "Creating..." : "Create Role"}
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
                placeholder="e.g., Administrator, Manager, Viewer"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isSaving && newName.trim()) {
                    handleSaveEdit()
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                Role names are case-insensitive and will be normalized automatically.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingRole(null)
                  setNewName("")
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSaving || !newName.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSaving ? "Saving..." : "Save Changes"}
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
                Do you want to delete the role <strong>"{roleToDelete?.name}"</strong>? This action cannot be undone.
                <br />
                <br />
                <span className="text-sm text-muted-foreground">
                  If this role is assigned to any users, it cannot be deleted. You must first remove the role from all users.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRoleToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Role
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
