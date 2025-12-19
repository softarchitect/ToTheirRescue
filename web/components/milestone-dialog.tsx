"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Calendar, Search, Plus } from 'lucide-react'
import type { Animal, MilestoneType, PCO } from "@/lib/types"
import { cn } from "@/lib/utils"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createMilestonesForAnimals, createPCO, fetchPCOs } from "@/lib/api"
import { AddPCODialog } from "@/components/pco/add-pco-dialog"

interface MilestoneDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PERSON_REQUIRED_MILESTONES = [
  "Adoption",
  "Foster",
  "Returned to Owner",
  "Transfer"
]

export function MilestoneDialog({ animals, open, onOpenChange }: MilestoneDialogProps) {
  const [selectedMilestoneType, setSelectedMilestoneType] = useState<string>("")
  const [milestoneDate, setMilestoneDate] = useState("")
  const [selectedPCO, setSelectedPCO] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [amountPaidFee, setAmountPaidFee] = useState<string>("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [pcos, setPCOs] = useState<PCO[]>([])
  const [isAddPCODialogOpen, setIsAddPCODialogOpen] = useState(false)

  const availableMilestoneTypes = [
    "Adoption",
    "Adoption Return",
    "Foster",
    "Foster Return",
    "Lost",
    "Found",
    "Released",
    "Death",
    "Returned to Owner",
    "Reintake",
    "Transfer",
  ]

  const disabledMilestones = ["Adoption Return", "Foster Return", "Found", "Reintake"]

  const requiresPerson = PERSON_REQUIRED_MILESTONES.includes(selectedMilestoneType)

  // Milestone types that require amount field
  const requiresAmount = selectedMilestoneType === "Adoption" || selectedMilestoneType === "Returned to Owner"

  // Define columns for PCO table
  const pcoColumns: Column<PCO>[] = [
    {
      key: "select",
      header: "",
      className: "w-[40px]",
      render: (pco) => (
        <div
          className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedPCO === pco.id ? "border-primary bg-primary" : "border-gray-300"
            }`}
        >
          {selectedPCO === pco.id && <div className="h-2 w-2 bg-white rounded-full" />}
        </div>
      ),
    },
    {
      key: "lastName",
      header: "Last Name",
      className: "w-[18%]",
      render: (pco) => <span className="font-medium">{pco.lastName}</span>,
    },
    {
      key: "firstName",
      header: "First Name",
      className: "w-[22%]",
      render: (pco) => <span>{pco.firstName}</span>,
    },
    {
      key: "address",
      header: "Address",
      className: "w-[35%]",
      render: (pco) => (
        <span className="text-muted-foreground">
          {[pco.street, pco.city, pco.state].filter(Boolean).join(", ")}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone",
      className: "w-[25%]",
      render: (pco) => <span className="text-muted-foreground">{pco.phone}</span>,
    },
  ]

  const filteredPCOs = pcos.filter(pco => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      pco.lastName.toLowerCase().includes(query) ||
      pco.firstName.toLowerCase().includes(query) ||
      pco.street.toLowerCase().includes(query) ||
      pco.city.toLowerCase().includes(query) ||
      pco.state.toLowerCase().includes(query) ||
      pco.phone.toLowerCase().includes(query)
    )
  })

  const loadPCOs = async (text?: string) => {
    try {
      const results = await fetchPCOs({ searchText: text, page: 1, limit: 25 })
      setPCOs(results)
    } catch (error) {
      console.error("Failed to load PCOs", error)
      setPCOs([])
    }
  }

  // Calculate minimum date (earliest arrival date among selected animals, or 10 years ago)
  const getMinDate = () => {
    if (animals.length === 0) {
      // Default to 10 years ago if no animals
      const tenYearsAgo = new Date()
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
      return tenYearsAgo.toISOString().split("T")[0]
    }

    // Find the earliest arrival date among selected animals
    const arrivalDates = animals
      .map(animal => animal.arrivalDate || animal.intakeDate)
      .filter(Boolean)
      .map(date => new Date(date!).getTime())

    if (arrivalDates.length > 0) {
      const earliestDate = new Date(Math.min(...arrivalDates))
      return earliestDate.toISOString().split("T")[0]
    }

    // Fallback to 10 years ago
    const tenYearsAgo = new Date()
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
    return tenYearsAgo.toISOString().split("T")[0]
  }

  // Set default date to today when dialog opens
  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0]
      setMilestoneDate(today)
      setAmountPaidFee("")
    }
  }, [open])

  // Load PCOs when dialog opens and a milestone type requiring a person is selected
  useEffect(() => {
    if (open && requiresPerson && pcos.length === 0) {
      loadPCOs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, selectedMilestoneType])

  const handleSave = async () => {
    const newErrors: Record<string, string> = {}

    if (!selectedMilestoneType) {
      newErrors.milestoneType = "Please select a milestone type"
    }
    if (!milestoneDate) {
      newErrors.milestoneDate = "Milestone date is required"
    }
    if (requiresPerson && !selectedPCO) {
      newErrors.pco = "Person/Company/Organization is required for this milestone"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await createMilestonesForAnimals({
        animalIds: animals.map((a) => a.id),
        milestoneType: selectedMilestoneType as MilestoneType,
        date: milestoneDate,
        notes,
        ...(selectedPCO ? { pcoId: selectedPCO } : {}),
        ...(requiresAmount && amountPaidFee ? { amountPaidFee: parseFloat(amountPaidFee) || 0 } : {}),
      })

      onOpenChange(false)

      setSelectedMilestoneType("")
      setMilestoneDate("")
      setSelectedPCO("")
      setNotes("")
      setAmountPaidFee("")
      setErrors({})

      if (typeof window !== "undefined") {
        window.location.reload()
      }
    } catch (error: any) {
      setErrors({
        ...newErrors,
        api: error?.message || "Failed to save milestone",
      })
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedMilestoneType("")
    setMilestoneDate("")
    setSelectedPCO("")
    setNotes("")
    setAmountPaidFee("")
    setErrors({})
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-h-[90vh] overflow-hidden flex flex-col p-6 w-[50vw] !max-w-[95vw]"
      )}>
        <DialogHeader className="pb-1">
          <DialogTitle className="text-2xl">Add New Milestone</DialogTitle>
          <DialogDescription className="sr-only">Create a new milestone for the selected animal(s)</DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0">
          <div className="space-y-3 h-full flex flex-col">
            <SelectedAnimalsHeader animals={animals} />

            {animals.length === 1 && animals[0].lastMilestone && (
              <div className="flex items-center gap-2 text-sm bg-muted/50 p-1.5 rounded">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="font-medium">Last Milestone:</span>
                <span className="text-muted-foreground">
                  {animals[0].lastMilestone} on{" "}
                  {animals[0].lastMilestoneDate
                    ? new Date(animals[0].lastMilestoneDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                    : "N/A"}
                </span>
              </div>
            )}

            <div className="grid grid-cols-[140px_1fr] gap-4 flex-1 min-h-0">
              <div className="space-y-1 overflow-y-auto">
                <Label className="text-xs font-semibold">Select Milestone Type</Label>
                <RadioGroup value={selectedMilestoneType} onValueChange={setSelectedMilestoneType} className="space-y-0.5">
                  {availableMilestoneTypes.map((type) => {
                    const isDisabled = disabledMilestones.includes(type)
                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <RadioGroupItem value={type} id={type} disabled={isDisabled} className="h-3.5 w-3.5" />
                        <Label
                          htmlFor={type}
                          className={`text-xs cursor-pointer ${isDisabled ? "text-muted-foreground opacity-50" : ""}`}
                        >
                          {type}
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
                {errors.milestoneType && <p className="text-[10px] text-destructive mt-1">{errors.milestoneType}</p>}
              </div>

              <div className="flex-1 bg-muted/20 rounded-lg p-2 overflow-hidden flex flex-col">
                {selectedMilestoneType ? (
                  <div className="space-y-2 flex-1 flex flex-col min-h-0">
                    {requiresPerson ? (
                      <>
                        <div>
                          <h3 className="text-base font-semibold">
                            {selectedMilestoneType === "Adoption" && "Adopted By:"}
                            {selectedMilestoneType === "Foster" && "Foster By:"}
                            {selectedMilestoneType === "Returned to Owner" && "Returned to:"}
                            {selectedMilestoneType === "Transfer" && "Transferred to:"}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="Search by name, address, or phone..."
                              value={searchQuery}
                              onChange={(e) => {
                                const value = e.target.value
                                setSearchQuery(value)
                                loadPCOs(value)
                              }}
                              className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <Button
                            size="sm"
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                            type="button"
                            onClick={() => setIsAddPCODialogOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                            Add
                          </Button>
                        </div>

                        <div className="border rounded-lg overflow-hidden bg-white flex-1 min-h-0 flex flex-col">
                          <div className="overflow-y-auto flex-1">
                            <DataTable
                              columns={pcoColumns}
                              data={filteredPCOs}
                              getRowId={(pco) => pco.id}
                              onRowClick={(pco) => setSelectedPCO(pco.id)}
                              rowClassName={(pco, index) =>
                                cn(
                                  "cursor-pointer transition-colors",
                                  selectedPCO === pco.id
                                    ? "bg-primary/10"
                                    : index % 2 === 0
                                      ? "bg-white hover:bg-muted/30"
                                      : "bg-gray-50/50 hover:bg-muted/30"
                                )
                              }
                              emptyMessage="No matching people found. Click 'Add' to create a new entry."
                              className="h-full "
                              headerClassName="text-primary-foreground sticky top-0 bg-emerald-600 hover:bg-emerald-700 text-white"
                            />
                          </div>
                        </div>
                        {errors.pco && <p className="text-xs text-destructive">{errors.pco}</p>}

                        <div className="space-y-2">
                          <FloatingInput
                            id="milestoneDate"
                            label="Milestone Date"
                            type="date"
                            value={milestoneDate}
                            min={getMinDate()}
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                              setMilestoneDate(e.target.value)
                              setErrors({ ...errors, milestoneDate: "" })
                            }}
                            required
                            error={errors.milestoneDate}
                          />
                          {requiresAmount && (
                            <FloatingInput
                              id="amountPaidFee"
                              label={selectedMilestoneType === "Adoption" ? "Adoption Fee (if any)" : "Amount (if any)"}
                              type="number"
                              step="0.01"
                              min="0"
                              value={amountPaidFee}
                              onChange={(e) => {
                                setAmountPaidFee(e.target.value)
                                setErrors({ ...errors, amountPaidFee: "" })
                              }}
                              placeholder="0.00"
                            />
                          )}
                          <FloatingTextarea
                            id="notes"
                            label="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={1}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <FloatingInput
                          id="milestoneDate"
                          label={
                            selectedMilestoneType === "Death" ? "Date of Death" :
                              selectedMilestoneType === "Lost" ? "Date Lost" :
                                selectedMilestoneType === "Released" ? "Date Released" :
                                  "Milestone Date"
                          }
                          type="date"
                          value={milestoneDate}
                          min={getMinDate()}
                          max={new Date().toISOString().split("T")[0]}
                          onChange={(e) => {
                            setMilestoneDate(e.target.value)
                            setErrors({ ...errors, milestoneDate: "" })
                          }}
                          required
                          error={errors.milestoneDate}
                        />
                        {requiresAmount && (
                          <FloatingInput
                            id="amountPaidFee"
                            label={selectedMilestoneType === "Adoption" ? "Adoption Fee (if any)" : "Amount (if any)"}
                            type="number"
                            step="0.01"
                            min="0"
                            value={amountPaidFee}
                            onChange={(e) => {
                              setAmountPaidFee(e.target.value)
                              setErrors({ ...errors, amountPaidFee: "" })
                            }}
                            placeholder="0.00"
                          />
                        )}
                        <FloatingTextarea
                          id="notes"
                          label="Notes"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={6}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <div>
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-sm font-medium">Please select a milestone on the left</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t pt-3 mt-3">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save</Button>
        </DialogFooter>
      </DialogContent>

      <AddPCODialog
        open={isAddPCODialogOpen}
        onOpenChange={setIsAddPCODialogOpen}
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
              entityType: data.type === "company" ? "CorO" : "Person",
            })
            setIsAddPCODialogOpen(false)
            // Refresh list and select the new PCO
            await loadPCOs(searchQuery)
            setSelectedPCO(created.id)
          } catch (error) {
            console.error("Failed to create PCO", error)
          }
        }}
      />
    </Dialog>
  )
}
