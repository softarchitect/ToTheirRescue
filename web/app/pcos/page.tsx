"use client"

import { useEffect, useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { Search, Plus, Users, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomAlertDialog } from "@/components/custom-alert-dialog"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { PCOVolunteerDialog } from "@/components/pco/volunteer-dialog"
import { AddPCODialog } from "@/components/pco/add-pco-dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { useRouter } from 'next/navigation'
import type { PCO } from "@/lib/types"
import { fetchPCOs, createPCO } from "@/lib/api"

export default function PCOsPage() {
  const router = useRouter()
  const [pcos, setPCOs] = useState<PCO[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAlert, setShowAlert] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pcoToDelete, setPcoToDelete] = useState<string | null>(null)
  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false)
  const [showAddPCODialog, setShowAddPCODialog] = useState(false)

  useEffect(() => {
    const loadPCOs = async () => {
      try {
        const results = await fetchPCOs({ page: 1, limit: 200 })
        setPCOs(results)
      } catch (error) {
        console.error("Failed to load PCOs from API", error)
        setPCOs([])
      }
    }

    loadPCOs()
  }, [])

  const handleSelectPCO = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const handleEditPCO = (pco: PCO) => {
    console.log("[v0] Editing PCO:", pco)
    // TODO: Implement edit dialog
  }

  const handleDeletePCO = (id: string) => {
    setPcoToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (pcoToDelete) {
      console.log("[v0] Deleting PCO:", pcoToDelete)
      // TODO: Implement delete functionality
      setPcoToDelete(null)
    }
  }

  const handleActionClick = (action: string) => {
    if (selectedIds.size === 0) {
      setShowAlert(true)
      return
    }

    const selectedPCOIds = Array.from(selectedIds)
    sessionStorage.setItem("selectedPCOs", JSON.stringify(selectedPCOIds.map((id) => pcos.find((p) => p.id === id))))

    switch (action) {
      case "media":
        router.push("/pcos/media")
        break
      case "history":
        router.push("/pcos/history")
        break
      case "donate":
        router.push("/pcos/donations")
        break
      case "volunteer":
        setShowVolunteerDialog(true)
        break
    }
  }

  const filteredPCOs = pcos.filter((pco) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      pco.lastName.toLowerCase().includes(query) ||
      pco.firstName.toLowerCase().includes(query) ||
      pco.street.toLowerCase().includes(query) ||
      pco.city.toLowerCase().includes(query) ||
      pco.state.toLowerCase().includes(query) ||
      pco.email.toLowerCase().includes(query)

    return matchesSearch
  })

  const selectedPCO = selectedIds.size > 0 ? pcos.find((p) => p.id === Array.from(selectedIds)[0]) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div>
          <div className="mb-6">
            <h1 className="text-4xl font-bold tracking-tight leading-tight flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              <Users className="h-10 w-10 text-primary" />
              Manage People, Companies, and Organizations
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="volunteers">Volunteers</SelectItem>
                <SelectItem value="donors">Donors</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1">
              <FloatingInput
                label="Search Last Name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 bg-transparent text-sm">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("media")}>
                  Photos, Videos, and Documents
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("history")}>History</DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("donate")}>Donate</DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("volunteer")}>Volunteer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="lg" className="gap-2 shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShowAddPCODialog(true)}>
              <Plus className="h-5 w-5" />
              Add New
            </Button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-2 overflow-hidden">
          <DataTable
            columns={[
              {
                key: "select",
                header: "",
                render: (pco) => (
                  <Checkbox
                    checked={selectedIds.has(pco.id)}
                    onCheckedChange={() => handleSelectPCO(pco.id)}
                    aria-label="Select PCO"
                  />
                ),
                className: "w-12",
              },
              {
                key: "lastName",
                header: "Last Name",
                accessor: (pco) => pco.lastName || "N/A",
              },
              {
                key: "firstName",
                header: "First Name",
                accessor: (pco) => pco.firstName || "N/A",
              },
              {
                key: "street",
                header: "Street",
                accessor: (pco) => pco.street || "N/A",
              },
              {
                key: "city",
                header: "City",
                accessor: (pco) => pco.city || "N/A",
              },
              {
                key: "state",
                header: "State",
                accessor: (pco) => pco.state || "N/A",
              },
              {
                key: "zip",
                header: "Zip",
                accessor: (pco) => pco.zip || "N/A",
              },
              {
                key: "phone",
                header: "Phone",
                accessor: (pco) => pco.phone || "N/A",
              },
              {
                key: "email",
                header: "Email",
                render: (pco) =>
                  pco.email ? (
                    <a href={`mailto:${pco.email}`} className="text-blue-600 hover:underline">
                      {pco.email}
                    </a>
                  ) : (
                    "N/A"
                  ),
              },
            ]}
            data={filteredPCOs}
            getRowId={(pco) => pco.id}
            actions={(pco) => (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPCO(pco)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePCO(pco.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            actionsHeader="Actions"
            emptyMessage="No people, companies, or organizations found"
            headerClassName="bg-emerald-600 hover:bg-emerald-700"
          />
        </div>
      </main>

      <CustomAlertDialog
        open={showAlert}
        onOpenChange={setShowAlert}
        message="Please select at least one person, company, or organization first"
      />

      <CustomConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Confirm Deletion"
        message="Are you sure you want to remove this PCO?"
        onConfirm={confirmDelete}
        confirmText="OK"
        cancelText="Cancel"
      />

      {selectedPCO && (
        <PCOVolunteerDialog
          open={showVolunteerDialog}
          onOpenChange={setShowVolunteerDialog}
          pco={selectedPCO}
          onSave={(data) => {
            console.log("[v0] Saving PCO volunteer:", data)
            setShowVolunteerDialog(false)
          }}
        />
      )}

      <AddPCODialog
        open={showAddPCODialog}
        onOpenChange={setShowAddPCODialog}
        onSave={async (data) => {
          try {
            const created = await createPCO({
              firstName: data.firstName,
              lastName: data.lastName,
              street: data.street,
              city: data.city,
              state: data.state,
              zip: data.zip,
              phone: data.phone,
              email: data.email,
              entityType: data.type === "company" ? "Company" : "Person",
            })
            setPCOs((prev) => [...prev, created])
            setShowAddPCODialog(false)
          } catch (error) {
            console.error("Failed to create PCO", error)
          }
        }}
      />
    </div>
  )
}
