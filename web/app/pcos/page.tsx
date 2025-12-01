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
            <Button size="lg" className="gap-2 shadow-lg" onClick={() => setShowAddPCODialog(true)}>
              <Plus className="h-5 w-5" />
              Add New
            </Button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-2">
          <div className="grid grid-cols-[repeat(7,minmax(0,1fr))_minmax(0,2fr)_minmax(0,1fr)] bg-primary text-primary-foreground font-semibold">
            <div className="p-4 border-r border-primary-foreground/10">Last Name</div>
            <div className="p-4 border-r border-primary-foreground/10">First Name</div>
            <div className="p-4 border-r border-primary-foreground/10">Street</div>
            <div className="p-4 border-r border-primary-foreground/10">City</div>
            <div className="p-4 border-r border-primary-foreground/10">State</div>
            <div className="p-4 border-r border-primary-foreground/10">Zip</div>
            <div className="p-4 border-r border-primary-foreground/10">Phone</div>
            <div className="p-4 border-r border-primary-foreground/10">Email</div>
            <div className="p-4 border-r border-primary-foreground/10">Actions</div>
          </div>

          {filteredPCOs.length === 0 ? (
            <div className="p-8 text-center">
              No people, companies, or organizations found
            </div>
          ) : (
            filteredPCOs.map((pco, index) => (
              <div
                key={pco.id}
                className="grid grid-cols-[repeat(7,minmax(0,1fr))_minmax(0,2fr)_minmax(0,1fr)] border-t border-border/40  transition-colors text-sm "
              >
                <div className="p-4 border-r">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedIds.has(pco.id)}
                      onCheckedChange={() => handleSelectPCO(pco.id)}
                      aria-label="Select PCO"
                    />
                    <span className="text-blue-600 hover:underline cursor-pointer font-medium">
                      {pco.lastName}
                    </span>
                  </div>
                </div>
                <div className="p-4 border-r">{pco.firstName}</div>
                <div className="p-4 border-r">{pco.street}</div>
                <div className="p-4 border-r">{pco.city}</div>
                <div className="p-4 border-r">{pco.state}</div>
                <div className="p-4 border-r">{pco.zip}</div>
                <div className="p-4 border-r">{pco.phone}</div>
                <div className="p-4 border-r">
                  {pco.email && (
                    <a href={`mailto:${pco.email}`} className="text-blue-600 hover:underline">
                      {pco.email}
                    </a>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-center gap-2">
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
                  </div>
                </div>
              </div>
            ))
          )}
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
