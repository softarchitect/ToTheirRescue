"use client"

import { Fragment, useCallback, useEffect, useRef, useState } from "react"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Plus, Users, ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomAlertDialog } from "@/components/custom-alert-dialog"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { PCOVolunteerDialog } from "@/components/pco/volunteer-dialog"
import { AddPCODialog } from "@/components/pco/add-pco-dialog"
import { DataTable, type Column } from "@/components/ui/data-table"
import { useRouter } from 'next/navigation'
import type { PCO } from "@/lib/types"
import { fetchPCOsPaged, createPCO, updatePCO, deletePCO } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type SortField =
  | "lastName"
  | "firstName"
  | "street"
  | "city"
  | "state"
  | "zip"
  | "phone"
  | "email"
  | "mailList"

export default function PCOsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [pcos, setPCOs] = useState<PCO[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showAlert, setShowAlert] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [pcoToDelete, setPcoToDelete] = useState<string | null>(null)
  const [showVolunteerDialog, setShowVolunteerDialog] = useState(false)
  const [showAddPCODialog, setShowAddPCODialog] = useState(false)
  const [pcoToEdit, setPcoToEdit] = useState<PCO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [sortField, setSortField] = useState<SortField>("lastName")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const filterStateRef = useRef({ filterType, searchQuery, pageSize, sortField, sortDirection })

  // Redirect AnimalCaretaker and Veterinarian users away from PCO pages
  useEffect(() => {
    const role = getUserRole()
    if (role === "AnimalCaretaker" || role === "Veterinarian") {
      router.push("/animals")
    }
  }, [router])

  const loadPCOs = useCallback(async (page: number, limit: number) => {
    try {
      setIsLoading(true)
      // Map filterType to entityType for API
      let entityType = ""
      if (filterType === "Person") {
        entityType = "Person"
      } else if (filterType === "CorO" || filterType === "Cor") {
        entityType = "CorO"
      }

      const result = await fetchPCOsPaged({
        page,
        limit,
        entityType: entityType || undefined,
        searchText: searchQuery || undefined,
        sortField,
        sortDirection,
      })
      setPCOs(result.pcos)
      setTotalItems(result.totalItems)
      setTotalPages(Math.max(1, result.totalPage))
      setSelectedIds(new Set())
    } catch (error) {
      console.error("Failed to load PCOs from API", error)
      toast({
        title: "Error",
        description: "Failed to load PCOs",
        variant: "destructive",
      })
      setPCOs([])
      setTotalItems(0)
      setTotalPages(1)
      setSelectedIds(new Set())
    } finally {
      setIsLoading(false)
    }
  }, [filterType, searchQuery, sortField, sortDirection, toast])

  useEffect(() => {
    const previous = filterStateRef.current
    const filtersChanged =
      previous.filterType !== filterType ||
      previous.searchQuery !== searchQuery ||
      previous.pageSize !== pageSize ||
      previous.sortField !== sortField ||
      previous.sortDirection !== sortDirection

    filterStateRef.current = { filterType, searchQuery, pageSize, sortField, sortDirection }

    if (filtersChanged && currentPage !== 1) {
      setCurrentPage(1)
      return
    }

    loadPCOs(currentPage, pageSize)
  }, [currentPage, filterType, pageSize, searchQuery, sortField, sortDirection, loadPCOs])

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
    setPcoToEdit(pco)
    setShowAddPCODialog(true)
  }

  const handleDeletePCO = (id: string) => {
    setPcoToDelete(id)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (pcoToDelete) {
      try {
        await deletePCO(pcoToDelete)
        await loadPCOs(currentPage, pageSize)
        toast({
          title: "Success",
          description: "PCO deleted successfully",
        })
        setPcoToDelete(null)
        setShowDeleteConfirm(false)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete PCO",
          variant: "destructive",
        })
      }
    }
  }

  const handleToggleMailList = async (pco: PCO, checked: boolean) => {
    try {
      const updated = await updatePCO({
        id: pco.id,
        firstName: pco.firstName,
        lastName: pco.lastName,
        street: pco.street,
        city: pco.city,
        state: pco.state,
        zip: pco.zip,
        phone: pco.phone,
        email: pco.email,
        mailList: checked,
        entityType: pco.entityType || "Person",
      })
      setPCOs((prev) => prev.map((p) => (p.id === pco.id ? { ...p, mailList: updated.mailList } : p)))
      await loadPCOs(currentPage, pageSize)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update mail list",
        variant: "destructive",
      })
    }
  }

  const handleActionClick = (action: string) => {
    if (selectedIds.size === 0) {
      setShowAlert(true)
      return
    }

    const selectedPCOIds = Array.from(selectedIds)
    sessionStorage.setItem(
      "selectedPCOs",
      JSON.stringify(selectedPCOIds.map((id) => pcos.find((p) => p.id === id))),
    )

    switch (action) {
      case "media":
      case "attachments":
        router.push("/pcos/attachments")
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

  const selectedPCO = selectedIds.size > 0 ? pcos.find((p) => p.id === Array.from(selectedIds)[0]) : null
  const userRole = getUserRole()
  const pageStartIndex = (currentPage - 1) * pageSize
  const pageEndIndex = pageStartIndex + pcos.length
  const paginationDisabled = isLoading || totalPages <= 1

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-white/80" />
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 text-white" />
    ) : (
      <ArrowDown className="h-4 w-4 text-white" />
    )
  }

  const renderSortableHeader = (label: string, field: SortField) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="inline-flex items-center gap-2 font-semibold text-white"
    >
      {label}
      {renderSortIcon(field)}
    </button>
  )

  const pageNumbers = (() => {
    const pages = new Set<number>()
    pages.add(1)
    pages.add(totalPages)
    pages.add(currentPage)
    pages.add(currentPage - 1)
    pages.add(currentPage + 1)
    return Array.from(pages)
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b)
  })()

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

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
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Person">People</SelectItem>
                <SelectItem value="CorO">Companies and Organizations</SelectItem>
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
                {userRole !== "AnimalManager" && (
                  <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("donate")}>Donate</DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("volunteer")}>Volunteer</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="lg" className="gap-2 shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setShowAddPCODialog(true)}>
              <Plus className="h-5 w-5" />
              Add PCO
            </Button>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-2 overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-sm text-muted-foreground">
              Loading...
            </div>
          )}
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
                header: renderSortableHeader("Last Name", "lastName"),
                accessor: (pco) => pco.lastName || "N/A",
              },
              {
                key: "firstName",
                header: renderSortableHeader("First Name", "firstName"),
                accessor: (pco) => pco.firstName || "N/A",
              },
              {
                key: "street",
                header: renderSortableHeader("Street", "street"),
                accessor: (pco) => pco.street || "N/A",
              },
              {
                key: "city",
                header: renderSortableHeader("City", "city"),
                accessor: (pco) => pco.city || "N/A",
              },
              {
                key: "state",
                header: renderSortableHeader("State", "state"),
                accessor: (pco) => pco.state || "N/A",
              },
              {
                key: "zip",
                header: renderSortableHeader("Zip", "zip"),
                accessor: (pco) => pco.zip || "N/A",
              },
              {
                key: "phone",
                header: renderSortableHeader("Phone", "phone"),
                accessor: (pco) => pco.phone || "N/A",
              },
              {
                key: "email",
                header: renderSortableHeader("Email", "email"),
                render: (pco) =>
                  pco.email ? (
                    <a href={`mailto:${pco.email}`} className="text-blue-600 hover:underline">
                      {pco.email}
                    </a>
                  ) : (
                    "N/A"
                  ),
              },
              {
                key: "mailList",
                header: renderSortableHeader("Mail List", "mailList"),
                render: (pco) => (
                  <Switch
                    checked={pco.mailList || false}
                    onCheckedChange={(checked) => handleToggleMailList(pco, checked)}
                    aria-label="Toggle mail list"
                  />
                ),
                className: "w-20",
              },
            ]}
            data={pcos}
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
            emptyMessage={isLoading ? "Loading..." : "No people, companies, or organizations found"}
            headerClassName="bg-emerald-600 hover:bg-emerald-700"
          />
          {totalItems > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3 text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center gap-3">
                <div>
                  Showing {Math.min(pageStartIndex + 1, totalItems)}-
                  {Math.min(pageEndIndex, totalItems)} of {totalItems}
                </div>
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => setPageSize(Number(value))}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="h-8 w-[90px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        if (!paginationDisabled && currentPage > 1) {
                          setCurrentPage(currentPage - 1)
                        }
                      }}
                      className={paginationDisabled || currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  {pageNumbers.map((page, index) => {
                    const previousPage = pageNumbers[index - 1]
                    const showEllipsis = previousPage && page - previousPage > 1
                    return (
                      <Fragment key={`page-${page}`}>
                        {showEllipsis && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            isActive={page === currentPage}
                            onClick={(event) => {
                              event.preventDefault()
                              if (!paginationDisabled) {
                                setCurrentPage(page)
                              }
                            }}
                            className={paginationDisabled ? "pointer-events-none opacity-50" : undefined}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      </Fragment>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        if (!paginationDisabled && currentPage < totalPages) {
                          setCurrentPage(currentPage + 1)
                        }
                      }}
                      className={paginationDisabled || currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
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
        onOpenChange={(open) => {
          setShowAddPCODialog(open)
          if (!open) {
            setPcoToEdit(null)
          }
        }}
        pco={pcoToEdit}
        onSave={async (data) => {
          try {
            if (pcoToEdit) {
              // Update existing PCO
              const updated = await updatePCO({
                id: pcoToEdit.id,
                firstName: data.firstName,
                lastName: data.lastName,
                street: data.street,
                street2: data.additionalStreet,
                city: data.city,
                state: data.state,
                zip: data.zip,
                phone: data.phone,
                otherPhone: data.otherPhone,
                email: data.email,
                website: data.website,
                notes: data.notes,
                entityType: data.type === "company" ? "Company" : "Person",
                hospital: data.isClinic,
                rescue: data.isRescue,
                mailList: data.isMailList,
                flag: data.hasFlag,
                flagReason: data.flagReason,
              })
              toast({
                title: "Success",
                description: "PCO updated successfully",
              })
              await loadPCOs(currentPage, pageSize)
            } else {
              // Create new PCO
              await createPCO({
                firstName: data.firstName,
                lastName: data.lastName,
                street: data.street,
                street2: data.additionalStreet,
                city: data.city,
                state: data.state,
                zip: data.zip,
                phone: data.phone,
                otherPhone: data.otherPhone,
                email: data.email,
                website: data.website,
                notes: data.notes,
                entityType: data.type === "company" ? "Company" : "Person",
                hospital: data.isClinic,
                rescue: data.isRescue,
                mailList: data.isMailList,
                flag: data.hasFlag,
                flagReason: data.flagReason,
              })
              toast({
                title: "Success",
                description: "PCO created successfully",
              })
              setCurrentPage(1)
              await loadPCOs(1, pageSize)
            }
            setShowAddPCODialog(false)
            setPcoToEdit(null)
          } catch (error: any) {
            toast({
              title: "Error",
              description: error.message || (pcoToEdit ? "Failed to update PCO" : "Failed to create PCO"),
              variant: "destructive",
            })
          }
        }}
      />
    </div>
  )
}
