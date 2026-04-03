"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Users as UsersIcon } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchVolunteers, deleteVolunteer, type VolunteerVM } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { VolunteerDialog } from "@/components/volunteers/volunteer-dialog"
import { formatDateForTenant } from "@/lib/date-format"
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

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerVM[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewInactive, setViewInactive] = useState(false)
  const [volunteerDialogOpen, setVolunteerDialogOpen] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState<VolunteerVM | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [volunteerToDelete, setVolunteerToDelete] = useState<VolunteerVM | null>(null)
  const [activeCount, setActiveCount] = useState(0)
  const [inactiveCount, setInactiveCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    loadVolunteers()
    loadCounts()
  }, [viewInactive])

  const loadVolunteers = async () => {
    setIsLoading(true)
    try {
      const data = await fetchVolunteers(!viewInactive)
      setVolunteers(data)
    } catch (error) {
      console.error("Failed to load volunteers", error)
      toast({
        title: "Error",
        description: "Failed to load volunteers.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCounts = async () => {
    try {
      const [active, inactive] = await Promise.all([
        fetchVolunteers(true),
        fetchVolunteers(false),
      ])
      setActiveCount(active.length)
      setInactiveCount(inactive.length)
    } catch (error) {
      console.error("Failed to load volunteer counts", error)
    }
  }

  const handleAdd = () => {
    setEditingVolunteer(null)
    setVolunteerDialogOpen(true)
  }

  const handleEdit = (volunteer: VolunteerVM) => {
    setEditingVolunteer(volunteer)
    setVolunteerDialogOpen(true)
  }

  const handleDelete = (volunteer: VolunteerVM) => {
    setVolunteerToDelete(volunteer)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!volunteerToDelete) return

    try {
      await deleteVolunteer(volunteerToDelete.id)
      toast({
        title: "Success",
        description: "Volunteer deactivated successfully.",
      })
      setDeleteDialogOpen(false)
      setVolunteerToDelete(null)
      await loadVolunteers()
      await loadCounts()
    } catch (error: any) {
      console.error("Failed to delete volunteer", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete volunteer.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return formatDateForTenant(date, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const columns: Column<VolunteerVM>[] = [
    {
      key: "name",
      header: "Name",
      render: (volunteer) => `${volunteer.firstName} ${volunteer.lastName}`,
    },
    {
      key: "email",
      header: "Email",
      accessor: (volunteer) => volunteer.email || "N/A",
    },
    {
      key: "phone",
      header: "Phone",
      accessor: (volunteer) => volunteer.phone || "N/A",
    },
    {
      key: "status",
      header: "Status",
      render: (volunteer) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            volunteer.active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {volunteer.status}
        </span>
      ),
    },
    {
      key: "dateActive",
      header: "Date Active",
      render: (volunteer) => formatDate(volunteer.dateActive),
    },
    {
      key: "dateInactive",
      header: "Date Inactive",
      render: (volunteer) => formatDate(volunteer.dateInactive),
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteers</h1>
              <p className="text-muted-foreground">
                Manage your organization's volunteers and their information.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setViewInactive(!viewInactive)}
              >
                View {viewInactive ? "Active" : "Inactive"} Volunteers
              </Button>
              <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Volunteer
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Volunteers</p>
                <p className="text-2xl font-bold text-green-600">{activeCount}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactive Volunteers</p>
                <p className="text-2xl font-bold text-red-600">{inactiveCount}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-red-600" />
            </div>
          </Card>
        </motion.div>

        {/* Volunteers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading volunteers...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={volunteers}
              getRowId={(volunteer) => String(volunteer.id)}
              actions={(volunteer) => (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(volunteer)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                  >
                    Edit
                  </Button>
                  {!viewInactive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(volunteer)}
                      className="text-red-600 hover:text-red-700 hover:bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              actionsHeader="Actions"
              emptyMessage="No volunteers found"
              headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
            />
          )}
        </motion.div>

        {/* Add/Edit Dialog */}
        <VolunteerDialog
          open={volunteerDialogOpen}
          onOpenChange={(open) => {
            setVolunteerDialogOpen(open)
            if (!open) {
              setEditingVolunteer(null)
            }
          }}
          volunteer={editingVolunteer}
          onSuccess={() => {
            loadVolunteers()
            loadCounts()
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to deactivate this volunteer? This action cannot be undone.
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

