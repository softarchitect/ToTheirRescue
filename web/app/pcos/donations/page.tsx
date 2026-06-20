"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, DollarSign, Info, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AddPCODonationDialog } from "@/components/pco/add-donation-dialog"
import { fetchPCODonations, createPCODonation, updatePCODonation, deletePCODonation, type PCODonation } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { SelectedPCOHeader } from "@/components/selected-pco-header"
import { DataTable, type Column } from "@/components/ui/data-table"
import { formatDateForTenant } from "@/lib/date-format"

export default function PCODonationsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPCO, setSelectedPCO] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [donations, setDonations] = useState<PCODonation[]>([])
  const [totalDonations, setTotalDonations] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [donationToEdit, setDonationToEdit] = useState<PCODonation | null>(null)
  const [donationToDelete, setDonationToDelete] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Redirect AnimalCaretaker and Veterinarian users away from PCO pages
  useEffect(() => {
    const role = getUserRole()
    if (role === "AnimalCaretaker" || role === "Veterinarian") {
      router.push("/animals")
    }
  }, [router])

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedPCOs") || "[]")
    if (selected.length > 0) {
      setSelectedPCO(selected[0])
    }
  }, [])

  useEffect(() => {
    if (selectedPCO?.id) {
      loadDonations()
    }
  }, [selectedPCO?.id])

  const loadDonations = async () => {
    if (!selectedPCO?.id) return

    try {
      setIsLoading(true)
      const result = await fetchPCODonations(Number(selectedPCO.id))
      setDonations(result.donations)
      setTotalDonations(result.totalAmount)
    } catch (error) {
      console.error("Failed to load donations", error)
      toast({
        title: "Error",
        description: "Failed to load donations",
        variant: "destructive",
      })
      setDonations([])
      setTotalDonations(0)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data: any) => {
    if (!selectedPCO?.id) return

    try {
      if (donationToEdit) {
        // Update existing donation
        await updatePCODonation(Number(donationToEdit.id), {
          amount: data.amount,
          date: data.date,
          donationType: data.type,
          notes: data.notes,
        })
        toast({
          title: "Success",
          description: "Donation updated successfully",
        })
      } else {
        // Create new donation
        await createPCODonation({
          pcoId: Number(selectedPCO.id),
          amount: data.amount,
          date: data.date,
          donationType: data.type,
          notes: data.notes,
        })
        toast({
          title: "Success",
          description: "Donation created successfully",
        })
      }
      setIsDialogOpen(false)
      setDonationToEdit(null)
      await loadDonations()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || (donationToEdit ? "Failed to update donation" : "Failed to create donation"),
        variant: "destructive",
      })
    }
  }

  const handleEdit = (donation: PCODonation) => {
    setDonationToEdit(donation)
    setIsDialogOpen(true)
  }

  const handleDelete = (donationId: string) => {
    setDonationToDelete(donationId)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (donationToDelete) {
      try {
        await deletePCODonation(Number(donationToDelete))
        toast({
          title: "Success",
          description: "Donation deleted successfully",
        })
        setDonationToDelete(null)
        setShowDeleteConfirm(false)
        await loadDonations()
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete donation",
          variant: "destructive",
        })
      }
    }
  }

  const handleActionClick = (action: string) => {
    switch (action) {
      case "attachments":
        router.push("/pcos/attachments")
        break
      case "history":
        router.push("/pcos/history")
        break
      case "volunteer":
        console.log("[v0] Navigate to volunteer")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="link" onClick={() => router.push("/")} className="p-0 h-auto text-muted-foreground">
            Home
          </Button>
          <span>/</span>
          <Button variant="link" onClick={() => router.push("/pcos")} className="p-0 h-auto text-muted-foreground">
            Manage People and Partners
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium">Manage Donations</span>
        </nav>


        {selectedPCO && (
          <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
            <CardContent className="px-3 py-0">
              <SelectedPCOHeader pco={selectedPCO} />
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent text-sm">
                Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("attachments")}>
                Photos, Videos, and Documents
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("history")}>
                History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={() => {
              setDonationToEdit(null)
              setIsDialogOpen(true)
            }}
            size="lg"
            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-5 w-5 " />
            Add
          </Button>
        </div>


        <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-1 overflow-hidden">
          <DataTable
            headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
            columns={[
              {
                key: "date",
                header: "Donation Date",
                accessor: (donation) =>
                  donation.date
                    ? formatDateForTenant(donation.date, {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                    : "-",
              },
              {
                key: "amount",
                header: "Amount",
                render: (donation) => (
                  <span
                    className={
                      (donation.type || "").toLowerCase() === "money"
                        ? "text-primary font-medium"
                        : "text-gray-600 font-medium"
                    }
                  >
                    {(donation.type || "").toLowerCase() === "money"
                      ? `$${donation.amount.toFixed(2)}`
                      : String(donation.amount)}
                  </span>
                ),
              },
              {
                key: "type",
                header: "Type",
                render: (donation) => (
                  <span
                    className={`px-2 py-1 rounded text-xs capitalize ${(donation.type || "").toLowerCase() === "money"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                      }`}
                  >
                    {donation.type || "money"}
                  </span>
                ),
              },
              {
                key: "notes",
                header: "Notes",
                accessor: (donation) => donation.purpose || "-",

              },
            ]}
            data={donations}
            getRowId={(donation) => donation.id}
            actions={(donation) => (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEdit(donation)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(donation.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            // emptyMessage={
            //   <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
            //     <DollarSign className="h-16 w-16 text-gray-300" />
            //     <p className="text-gray-500">No donations recorded yet</p>
            //     <Button
            //       onClick={() => {
            //         setDonationToEdit(null)
            //         setIsDialogOpen(true)
            //       }}
            //       variant="outline"
            //     >
            //       Add First Donation
            //     </Button>
            //   </div>
            // }
            rowClassName={(donation, index) =>
              index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
            }
          />
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <div className="animate-pulse text-muted-foreground">Loading donations...</div>
            </div>
          )}
        </div>
        <AddPCODonationDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              setDonationToEdit(null)
            }
          }}
          pco={selectedPCO || { firstName: "", lastName: "", street: "", phone: "" }}
          donation={donationToEdit}
          onSave={handleSave}
        />

        <CustomConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Confirm Deletion"
          message="Are you sure you want to delete this donation?"
          onConfirm={confirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />
      </main>
    </div>
  )
}
