"use client"

import { useState, useEffect } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { SelectedPCOHeader } from "@/components/selected-pco-header"
import type { PCODonation } from "@/lib/api"
import type { PCO } from "@/lib/types"

interface AddPCODonationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pco: PCO | {
    firstName: string
    lastName: string
    street: string
    phone: string
    city?: string
    state?: string
    zip?: string
    id?: string | number
  }
  onSave: (data: any) => void
  donation?: PCODonation | null
}

export function AddPCODonationDialog({ open, onOpenChange, pco, onSave, donation }: AddPCODonationDialogProps) {
  const isEditMode = !!donation
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"money" | "other">("money")
  const [notes, setNotes] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  // Load donation data when editing
  useEffect(() => {
    if (donation && open) {
      setDate(donation.date || new Date().toISOString().split("T")[0])
      setAmount(String(donation.amount || ""))
      setType((donation.type || "money").toLowerCase() === "money" ? "money" : "other")
      setNotes(donation.purpose || donation.notes || "")
    } else if (!donation && open) {
      // Reset form when adding new
      setDate(new Date().toISOString().split("T")[0])
      setAmount("")
      setType("money")
      setNotes("")
    }
  }, [donation, open])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      onSave({
        id: donation?.id,
        date,
        amount: parseFloat(amount) || 0,
        type,
        notes,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form
    setDate(new Date().toISOString().split("T")[0])
    setAmount("")
    setType("money")
    setNotes("")
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
            <h2 className="text-2xl font-bold">{isEditMode ? "Edit Donation" : "Add New Donation"}</h2>
            <button
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            <SelectedPCOHeader pco={pco as PCO} columns={1} />

            <div className="grid grid-cols-2 gap-4">
              <FloatingInput
                id="date"
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <FloatingInput
                id="amount"
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setType("money")}
                className={`flex-1 border-2 ${
                  type === "money"
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white"
                    : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                Money
              </Button>
              <Button
                variant="outline"
                onClick={() => setType("other")}
                className={`flex-1 border-2 ${
                  type === "other"
                    ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 hover:text-white"
                    : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                Other
              </Button>
            </div>

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
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
