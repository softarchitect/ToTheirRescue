"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, X, Search, Plus } from 'lucide-react'
import type { Animal } from "@/lib/types"
import { cn } from "@/lib/utils"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

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

const mockPCOs = [
  { id: "1", lastName: "Sivley", firstName: "Bob and Francoise", street: "4391 Belfair Court", phone: "+1 (910) 555-0123", isVolunteer: false },
  { id: "2", lastName: "Potter", firstName: "Kat", street: "123 Main St", phone: "+1 (910) 555-0456", isVolunteer: true },
  { id: "3", lastName: "Ratti", firstName: "Mary", street: "456 Oak Ave", phone: "+1 (910) 555-0789", isVolunteer: false },
  { id: "4", lastName: "Bauer", firstName: "Mella and Johnathan", street: "247 E. 11th St. Apt. H", phone: "+1 (814) 599-2247", isVolunteer: true },
]

export function MilestoneDialog({ animals, open, onOpenChange }: MilestoneDialogProps) {
  const [selectedMilestoneType, setSelectedMilestoneType] = useState<string>("")
  const [milestoneDate, setMilestoneDate] = useState("")
  const [selectedPCO, setSelectedPCO] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchQuery, setSearchQuery] = useState("")

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

  const filteredPCOs = mockPCOs.filter(pco => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      pco.lastName.toLowerCase().includes(query) ||
      pco.firstName.toLowerCase().includes(query) ||
      pco.street.toLowerCase().includes(query) ||
      pco.phone.includes(query)
    )
  })

  const handleSave = () => {
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

    console.log("Saving milestone for animals:", animals)
    onOpenChange(false)
    
    setSelectedMilestoneType("")
    setMilestoneDate("")
    setSelectedPCO("")
    setNotes("")
    setErrors({})
  }

  const handleClose = () => {
    onOpenChange(false)
    setSelectedMilestoneType("")
    setMilestoneDate("")
    setSelectedPCO("")
    setNotes("")
    setErrors({})
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-h-[90vh] overflow-hidden flex flex-col p-6",
        requiresPerson && selectedMilestoneType ? "w-[95vw] !max-w-[95vw]" : "max-w-3xl"
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
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                          </div>
                          <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            Add
                          </Button>
                        </div>
                        
                        <div className="border rounded-lg overflow-hidden bg-white flex-1 min-h-0 flex flex-col">
                          <div className="overflow-y-auto flex-1">
                            <table className="w-full text-sm">
                              <thead className="bg-primary text-primary-foreground sticky top-0">
                                <tr>
                                  <th className="p-2 text-left w-[40px]"></th>
                                  <th className="p-2 text-left font-semibold w-[18%]">Last Name</th>
                                  <th className="p-2 text-left font-semibold w-[22%]">First Name</th>
                                  <th className="p-2 text-left font-semibold w-[35%]">Address</th>
                                  <th className="p-2 text-left font-semibold w-[25%]">Phone</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredPCOs.length > 0 ? (
                                  filteredPCOs.map((pco, index) => (
                                    <tr
                                      key={pco.id}
                                      onClick={() => setSelectedPCO(pco.id)}
                                      className={`cursor-pointer border-b transition-colors ${
                                        selectedPCO === pco.id
                                          ? "bg-primary/10"
                                          : index % 2 === 0
                                          ? "bg-white hover:bg-muted/30"
                                          : "bg-gray-50/50 hover:bg-muted/30"
                                      }`}
                                    >
                                      <td className="p-2">
                                        <div
                                          className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                            selectedPCO === pco.id ? "border-primary bg-primary" : "border-gray-300"
                                          }`}
                                        >
                                          {selectedPCO === pco.id && <div className="h-2 w-2 bg-white rounded-full" />}
                                        </div>
                                      </td>
                                      <td className="p-2 font-medium">{pco.lastName}</td>
                                      <td className="p-2">{pco.firstName}</td>
                                      <td className="p-2 text-muted-foreground">{pco.street}</td>
                                      <td className="p-2 text-muted-foreground">{pco.phone}</td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                      No matching people found. Click "Add" to create a new entry.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                        {errors.pco && <p className="text-xs text-destructive">{errors.pco}</p>}

                        <div className="space-y-2">
                          <FloatingInput
                            id="milestoneDate"
                            label="Milestone Date"
                            type="date"
                            value={milestoneDate}
                            onChange={(e) => {
                              setMilestoneDate(e.target.value)
                              setErrors({ ...errors, milestoneDate: "" })
                            }}
                            required
                            error={errors.milestoneDate}
                          />
                          <FloatingTextarea
                            id="notes"
                            label="Notes (optional)"
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
                          onChange={(e) => {
                            setMilestoneDate(e.target.value)
                            setErrors({ ...errors, milestoneDate: "" })
                          }}
                          required
                          error={errors.milestoneDate}
                        />
                        <FloatingTextarea
                          id="notes"
                          label="Notes (optional)"
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
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
