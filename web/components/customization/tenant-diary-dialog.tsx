"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { addTenantDiaryEntry, updateTenantDiaryEntry, type TenantDiaryEntry } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface TenantDiaryDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    editEntry?: TenantDiaryEntry | null
    onSuccess?: () => void
}

export function TenantDiaryDialog({
    open,
    onOpenChange,
    editEntry,
    onSuccess,
}: TenantDiaryDialogProps) {
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        actionDate: new Date().toISOString().split('T')[0],
        notes: "",
    })
    const [notesError, setNotesError] = useState("")
    const { toast } = useToast()

    useEffect(() => {
        if (open) {
            if (editEntry) {
                // Format date for input (YYYY-MM-DD)
                const date = editEntry.actionDate ? new Date(editEntry.actionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
                setFormData({
                    actionDate: date,
                    notes: editEntry.notes || "",
                })
            } else {
                setFormData({
                    actionDate: new Date().toISOString().split('T')[0],
                    notes: "",
                })
            }
            setNotesError("")
        }
    }, [open, editEntry])

    const handleSave = async () => {
        if (!formData.notes.trim()) {
            setNotesError("This field is required.")
            return
        }
        setNotesError("")

        try {
            setSaving(true)

            if (editEntry) {
                await updateTenantDiaryEntry(editEntry.id, {
                    actionDate: new Date(formData.actionDate).toISOString(),
                    notes: formData.notes,
                })
                toast({
                    title: "Success",
                    description: "Diary entry updated successfully.",
                })
            } else {
                await addTenantDiaryEntry({
                    actionDate: new Date(formData.actionDate).toISOString(),
                    notes: formData.notes,
                })
                toast({
                    title: "Success",
                    description: "Diary entry added successfully.",
                })
            }

            onOpenChange(false)
            setFormData({
                actionDate: new Date().toISOString().split('T')[0],
                notes: "",
            })
            setNotesError("")
            onSuccess?.()
        } catch (error: any) {
            console.error("Failed to save diary entry", error)
            toast({
                title: "Error",
                description: error.message || "Failed to save diary entry.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {editEntry ? "Edit" : "Add New"} Diary Entry
                    </DialogTitle>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        void handleSave()
                    }}
                >
                    <div className="space-y-6">
                        <FloatingInput
                            id="diary-date"
                            label="Date"
                            type="date"
                            value={formData.actionDate}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setFormData({ ...formData, actionDate: e.target.value })}
                            required
                        />

                        <FloatingTextarea
                            id="diary-notes"
                            label="Notes"
                            value={formData.notes}
                            onChange={(e) => {
                                setFormData({ ...formData, notes: e.target.value })
                                if (notesError) setNotesError("")
                            }}
                            error={notesError}
                            rows={8}
                            required
                            className="resize-none"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                onOpenChange(false)
                                setNotesError("")
                            }}
                            disabled={saving}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? (editEntry ? "Updating..." : "Saving...") : (editEntry ? "Update" : "Save")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

