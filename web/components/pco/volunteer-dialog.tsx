"use client"

import { useState, useEffect } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SelectedPCOHeader } from "@/components/selected-pco-header"
import { fetchVolunteerActivities, fetchPCOVolunteer, upsertPCOVolunteer, type VolunteerActivity, type PCOVolunteerData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import type { PCO } from "@/lib/types"

interface PCOVolunteerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pco: PCO
  onSave?: (data: any) => void
}

export function PCOVolunteerDialog({ open, onOpenChange, pco, onSave }: PCOVolunteerDialogProps) {
  const { toast } = useToast()
  const [volunteerActivities, setVolunteerActivities] = useState<VolunteerActivity[]>([])
  const [selectedActivityIds, setSelectedActivityIds] = useState<number[]>([])
  const [status, setStatus] = useState<"active" | "inactive">("active")
  const [activeDate, setActiveDate] = useState("")
  const [inactiveDate, setInactiveDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [existingVolunteer, setExistingVolunteer] = useState<PCOVolunteerData | null>(null)

  // Load volunteer activities on mount
  useEffect(() => {
    if (open) {
      loadVolunteerActivities()
    }
  }, [open])

  // Load existing volunteer data when dialog opens
  useEffect(() => {
    if (open && pco?.id) {
      loadExistingVolunteer()
    }
  }, [open, pco?.id])

  const loadVolunteerActivities = async () => {
    try {
      setIsLoading(true)
      const activities = await fetchVolunteerActivities()
      setVolunteerActivities(activities)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load volunteer activities",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadExistingVolunteer = async () => {
    if (!pco?.id) return

    try {
      setIsLoading(true)
      const pcoId = typeof pco.id === 'string' ? Number(pco.id) : pco.id
      const volunteer = await fetchPCOVolunteer(pcoId)

      if (volunteer) {
        setExistingVolunteer(volunteer)
        setSelectedActivityIds(volunteer.volunteerActivityCustoms.map(a => a.volunteerActivityId))
        setStatus(volunteer.active ? "active" : "inactive")
        setActiveDate(volunteer.dateActive ? new Date(volunteer.dateActive).toISOString().split("T")[0] : "")
        setInactiveDate(volunteer.dateInactive ? new Date(volunteer.dateInactive).toISOString().split("T")[0] : "")
        setNotes(volunteer.notes || "")
      } else {
        // Reset to defaults for new volunteer
        setSelectedActivityIds([])
        setStatus("active")
        setActiveDate("")
        setInactiveDate("")
        setNotes("")
        setExistingVolunteer(null)
      }
    } catch (error: any) {
      console.error("Failed to load volunteer:", error)
      // Don't show error toast for "not found" - it's okay for new volunteers
      if (!error.message?.includes("not found")) {
        toast({
          title: "Error",
          description: error.message || "Failed to load volunteer data",
          variant: "destructive",
        })
      }
      // Reset to defaults
      setSelectedActivityIds([])
      setStatus("active")
      setActiveDate("")
      setInactiveDate("")
      setNotes("")
      setExistingVolunteer(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleActivityToggle = (activityId: number) => {
    setSelectedActivityIds(prev => {
      if (prev.includes(activityId)) {
        return prev.filter(id => id !== activityId)
      } else {
        return [...prev, activityId]
      }
    })
  }

  const handleStatusChange = (newStatus: "active" | "inactive") => {
    setStatus(newStatus)
    // Clear the opposite date when switching status
    if (newStatus === "active") {
      setInactiveDate("")
    } else {
      setActiveDate("")
    }
  }

  const handleSave = async () => {
    // Validate required fields
    if (selectedActivityIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one volunteer activity",
        variant: "destructive",
      })
      return
    }

    if (!pco?.id) {
      toast({
        title: "Error",
        description: "PCO ID is required",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)

      const pcoId = typeof pco.id === 'string' ? Number(pco.id) : pco.id
      const payload = {
        pcoId,
        notes: notes.trim(),
        active: status === "active",
        dateActive: status === "active" && activeDate ? new Date(activeDate).toISOString() : undefined,
        dateInactive: status === "inactive" && inactiveDate ? new Date(inactiveDate).toISOString() : undefined,
        volunteerActivityIds: selectedActivityIds,
      }

      await upsertPCOVolunteer(payload)

      toast({
        title: "Success",
        description: "Volunteer saved successfully",
      })

      if (onSave) {
        onSave(payload)
      }

      onOpenChange(false)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save volunteer",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setSelectedActivityIds([])
    setStatus("active")
    setActiveDate("")
    setInactiveDate("")
    setNotes("")
    setExistingVolunteer(null)
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <>
      <div
        onClick={handleCancel}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-hidden flex flex-col">
          <div className="sticky top-0 bg-white px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold">Volunteer</h2>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">

            <SelectedPCOHeader pco={pco} columns={1} />


            {/* Volunteer Activities - Multi-select */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Interests <span className="text-destructive">*</span>
              </Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                {isLoading && volunteerActivities.length === 0 ? (
                  <div className="text-sm text-muted-foreground">Loading activities...</div>
                ) : volunteerActivities.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No volunteer activities available</div>
                ) : (
                  volunteerActivities.map((activity) => {
                    const activityId = activity.id
                    return (
                      <div key={activity.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`activity-${activity.id}`}
                          checked={selectedActivityIds.includes(activityId)}
                          onCheckedChange={() => handleActivityToggle(activityId)}
                        />
                        <Label
                          htmlFor={`activity-${activity.id}`}
                          className="text-sm font-normal cursor-pointer flex-1"
                        >
                          {activity.volunteerActivityName}
                        </Label>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Status with Dates */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Status</Label>
              <RadioGroup value={status} onValueChange={(v) => handleStatusChange(v as "active" | "inactive")}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="active" />
                      <Label htmlFor="active" className="cursor-pointer">Active</Label>
                    </div>
                    <FloatingInput
                      id="activeDate"
                      label="Date Active"
                      type="date"
                      value={activeDate}
                      onChange={(e) => setActiveDate(e.target.value)}
                      disabled={status !== "active"}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="inactive" />
                      <Label htmlFor="inactive" className="cursor-pointer">Inactive</Label>
                    </div>
                    <FloatingInput
                      id="inactiveDate"
                      label="Date Inactive"
                      type="date"
                      value={inactiveDate}
                      onChange={(e) => setInactiveDate(e.target.value)}
                      disabled={status !== "inactive"}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Notes */}

            <FloatingTextarea
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={isSaving || isLoading}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}
