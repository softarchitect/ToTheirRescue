"use client"

import { useState } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PCOVolunteerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pco: {
    firstName: string
    lastName: string
    street: string
    phone: string
  }
  onSave: (data: any) => void
}

export function PCOVolunteerDialog({ open, onOpenChange, pco, onSave }: PCOVolunteerDialogProps) {
  const [activities, setActivities] = useState("")
  const [status, setStatus] = useState<"active" | "inactive">("active")
  const [activeDate, setActiveDate] = useState("")
  const [inactiveDate, setInactiveDate] = useState("")
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    onSave({
      activities,
      status,
      activeDate,
      inactiveDate,
      notes,
    })
  }

  if (!open) return null

  return (
    <>
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <h2 className="text-2xl font-bold">Volunteer</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-semibold text-lg">
                {pco.firstName} {pco.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                {pco.street} | {pco.phone}
              </div>
            </div>

            <Select value={activities} onValueChange={setActivities}>
              <SelectTrigger>
                <SelectValue placeholder="Select all activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="fostering">Fostering</SelectItem>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="events">Events</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-y-4">
              <RadioGroup value={status} onValueChange={(v) => setStatus(v as "active" | "inactive")}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="active" id="active" />
                    <Label htmlFor="active">Active</Label>
                  </div>
                  <Input
                    type="date"
                    value={activeDate}
                    onChange={(e) => setActiveDate(e.target.value)}
                    className="w-[200px]"
                    placeholder="Select date"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="inactive" id="inactive" />
                    <Label htmlFor="inactive">Inactive</Label>
                  </div>
                  <Input
                    type="date"
                    value={inactiveDate}
                    onChange={(e) => setInactiveDate(e.target.value)}
                    className="w-[200px]"
                    placeholder="Select date"
                  />
                </div>
              </RadioGroup>
            </div>

            <div className="relative">
              <Textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
              <span className="absolute right-3 bottom-3 text-xs text-muted-foreground">optional</span>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
