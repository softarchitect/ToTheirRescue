"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Mail, Users as UsersIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchUsers, deleteUser, resendInvitation, type UserVM } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { UserDialog } from "@/components/users/user-dialog"
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

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserVM[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewInactive, setViewInactive] = useState(false)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserVM | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Redirect AnimalManager, AnimalCaretaker, and Veterinarian users away from admin pages
  useEffect(() => {
    const role = getUserRole()
    if (role === "AnimalManager" || role === "AnimalCaretaker" || role === "Veterinarian") {
      router.push("/animals")
    }
  }, [router])
  const [userToDelete, setUserToDelete] = useState<UserVM | null>(null)
  const [resendingEmail, setResendingEmail] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadUsers()
  }, [viewInactive])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await fetchUsers(!viewInactive)
      setUsers(data)
    } catch (error) {
      console.error("Failed to load users", error)
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingUser(null)
    setUserDialogOpen(true)
  }

  const handleEdit = (user: UserVM) => {
    setEditingUser(user)
    setUserDialogOpen(true)
  }

  const handleDelete = (user: UserVM) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete.id)
      toast({
        title: "Success",
        description: "User deactivated successfully.",
      })
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      await loadUsers()
    } catch (error: any) {
      console.error("Failed to delete user", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      })
    }
  }

  const handleResendInvitation = async (user: UserVM) => {
    setResendingEmail(user.email)
    try {
      await resendInvitation(user.email)
      toast({
        title: "Success",
        description: "Invitation resent successfully.",
      })
    } catch (error: any) {
      console.error("Failed to resend invitation", error)
      toast({
        title: "Error",
        description: error.message || "Failed to resend invitation.",
        variant: "destructive",
      })
    } finally {
      setResendingEmail(null)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatRole = (role: string) => {
    return role.replace(/([a-z])([A-Z])/g, "$1 $2")
  }

  const columns: Column<UserVM>[] = [
    {
      key: "name",
      header: "Name",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      key: "email",
      header: "Email",
      accessor: (user) => user.email,
    },
    {
      key: "role",
      header: "Role",
      render: (user) => formatRole(user.role),
    },
    {
      key: "dateActive",
      header: "Date Active",
      render: (user) => formatDate(user.dateActive),
    },
    {
      key: "dateInactive",
      header: "Date Inactive",
      render: (user) => formatDate(user.dateInactive),
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
              <p className="text-muted-foreground">
                Manage your organization's users and their permissions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="flex items-center justify-end gap-2 border-b border-gray-200 px-4 py-3">
            <Button
              variant="outline"
              onClick={() => setViewInactive(!viewInactive)}
            >
              View {viewInactive ? "Active" : "Inactive"} Users
            </Button>
            <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Invite New
            </Button>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading users...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={users}
              getRowId={(user) => user.id}
              actions={(user) => (
                <div className="flex items-center gap-2">
                  {!viewInactive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleResendInvitation(user)}
                      disabled={resendingEmail === user.email}
                      className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                      title="Resend Invitation"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                  {!viewInactive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                    >
                      Edit
                    </Button>
                  )}
                  {!viewInactive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              actionsHeader="Actions"
              emptyMessage="No users found"
              headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
            />
          )}
        </motion.div>

        {/* Add/Edit Dialog */}
        <UserDialog
          open={userDialogOpen}
          onOpenChange={(open) => {
            setUserDialogOpen(open)
            if (!open) {
              setEditingUser(null)
            }
          }}
          user={editingUser}
          onSuccess={loadUsers}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to deactivate this user? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Deactivate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}

