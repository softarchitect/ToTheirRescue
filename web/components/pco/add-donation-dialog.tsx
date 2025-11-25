"use client"

import { useState } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"

interface AddPCODonationDialogProps {
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

export function AddPCODonationDialog({ open, onOpenChange, pco, onSave }: AddPCODonationDialogProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<"money" | "other">("money")
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    onSave({
      date,
      amount,
      type,
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
            <h2 className="text-2xl font-bold">Add New Donation</h2>
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
                variant={type === "money" ? "default" : "outline"}
                onClick={() => setType("money")}
                className="flex-1"
              >
                Money
              </Button>
              <Button
                variant={type === "other" ? "default" : "outline"}
                onClick={() => setType("other")}
                className="flex-1"
              >
                Other
              </Button>
            </div>

            <div className="relative">
              <FloatingTextarea
                label="Notes (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
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
