"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Donor, Donation } from "@/lib/types"

interface DonationDialogProps {
  donors: Donor[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (donation: Donation) => void
}

export function DonationDialog({ donors, open, onOpenChange, onSave }: DonationDialogProps) {
  const [formData, setFormData] = useState<Partial<Donation>>({
    donorId: "",
    donorName: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    type: "one-time",
    purpose: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.donorId) newErrors.donorId = "Donor is required"
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Valid amount is required"
    if (!formData.date) newErrors.date = "Date is required"
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    onSave({ ...formData, id: Date.now().toString() } as Donation)
    setFormData({
      donorId: "",
      donorName: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      type: "one-time",
      purpose: "",
    })
    setErrors({})
  }

  const handleDonorChange = (donorId: string) => {
    const donor = donors.find((d) => d.id === donorId)
    if (donor) {
      setFormData({ ...formData, donorId, donorName: donor.name })
      if (errors.donorId) setErrors({ ...errors, donorId: "" })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record New Donation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Donor *</label>
            <Select value={formData.donorId} onValueChange={handleDonorChange}>
              <SelectTrigger className={errors.donorId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a donor" />
              </SelectTrigger>
              <SelectContent>
                {donors.map((donor) => (
                  <SelectItem key={donor.id} value={donor.id}>
                    {donor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.donorId && <p className="text-xs text-red-500">{errors.donorId}</p>}
          </div>

          <FloatingInput
            id="amount"
            label="Amount ($)"
            type="number"
            min="0"
            step="0.01"
            value={formData.amount?.toString() || ""}
            onChange={(e) => {
              setFormData({ ...formData, amount: Number.parseFloat(e.target.value) || 0 })
              if (errors.amount) setErrors({ ...errors, amount: "" })
            }}
            required
            error={errors.amount}
          />

          <FloatingInput
            id="date"
            label="Date"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            value={formData.date || ""}
            onChange={(e) => {
              setFormData({ ...formData, date: e.target.value })
              if (errors.date) setErrors({ ...errors, date: "" })
            }}
            required
            error={errors.date}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Type *</label>
            <Select
              value={formData.type}
              onValueChange={(value: "one-time" | "monthly" | "annual") => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-time">One-time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <FloatingInput
            id="purpose"
            label="Purpose (optional)"
            value={formData.purpose || ""}
            onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            placeholder="e.g., Medical care, Food supplies"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Record Donation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
