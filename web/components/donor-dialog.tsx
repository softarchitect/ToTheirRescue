"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import type { Donor } from "@/lib/types"

interface DonorDialogProps {
  donor: Donor | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (donor: Donor) => void
}

export function DonorDialog({ donor, open, onOpenChange, onSave }: DonorDialogProps) {
  const [formData, setFormData] = useState<Partial<Donor>>({
    name: "",
    email: "",
    phone: "",
    totalDonated: 0,
    lastDonation: new Date().toISOString().split("T")[0],
    donationCount: 0,
  })

  useEffect(() => {
    if (donor) {
      setFormData(donor)
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        totalDonated: 0,
        lastDonation: new Date().toISOString().split("T")[0],
        donationCount: 0,
      })
    }
  }, [donor, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Donor)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{donor ? "Edit Donor" : "Add New Donor"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FloatingInput
            id="name"
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <FloatingInput
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <FloatingInput
            id="phone"
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{donor ? "Save Changes" : "Add Donor"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
