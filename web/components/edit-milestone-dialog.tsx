"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Animal } from "@/lib/types"
import { Calendar as CalendarIcon } from "lucide-react"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { SelectedAnimalsHeader } from "./selected-animals-header"

type BirthDateMode = "approximate" | "actual"

interface BirthMilestoneDialogProps {
  animal?: Animal
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDate?: string
  initialNotes?: string
  onSubmit?: (data: { date: string; notes: string; mode: BirthDateMode }) => void
}

export function EditMilestoneDialog({
  animal,
  open,
  onOpenChange,
  initialDate,
  initialNotes,
  onSubmit,
}: BirthMilestoneDialogProps) {
  const [mode, setMode] = useState<BirthDateMode>("approximate")
  const [birthDate, setBirthDate] = useState(initialDate ?? "")
  const [notes, setNotes] = useState(initialNotes ?? "")
  const [error, setError] = useState<string | null>(null)
  const dateInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (open) {
      setBirthDate(initialDate ?? "")
      setNotes(initialNotes ?? "")
      setMode("approximate")
      setError(null)
    }
  }, [open, initialDate, initialNotes])

  const handleClose = () => {
    onOpenChange(false)
  }

  const handleUpdate = () => {
    if (!birthDate) {
      setError("Birth date is required")
      return
    }

    onSubmit?.({
      date: birthDate,
      notes: notes ?? "",
      mode,
    })

    onOpenChange(false)
  }

  const formattedLabel = mode === "approximate" ? "Approximate Birth Date" : "Actual Birth Date"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-semibold">Edit Birth Milestone</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectedAnimalsHeader animals={animal ? [animal] : []} />
          <div className="space-y-4 mt-4">
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as BirthDateMode)}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="approximate">Approximate Birth Date</TabsTrigger>
                <TabsTrigger value="actual">Actual Birth Date</TabsTrigger>
              </TabsList>
              <TabsContent value="approximate" />
              <TabsContent value="actual" />
            </Tabs>

            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)]">
              <div>
                <div className="relative max-w-xs">
                  <FloatingInput
                    ref={dateInputRef}
                    id="birthDate"
                    label={formattedLabel}
                    type="date"
                    value={birthDate}
                    onChange={(e) => {
                      setBirthDate(e.target.value)
                      setError(null)
                    }}
                    aria-invalid={!!error}
                    className="pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:appearance-none"
                    error={error || undefined}
                    required
                  />
                  <CalendarIcon
                    className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-muted-foreground"
                    onClick={() => {
                      const input = dateInputRef.current
                      if (!input) return

                      // Try to open the native date picker if supported
                      const anyInput = input as HTMLInputElement & { showPicker?: () => void }
                      if (typeof anyInput.showPicker === "function") {
                        anyInput.showPicker()
                      } else {
                        input.focus()
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <FloatingTextarea
                id="birthNotes"
                label="Birth notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


