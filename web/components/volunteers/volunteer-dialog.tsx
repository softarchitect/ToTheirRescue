"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { createVolunteer, updateVolunteer, fetchPCOs, type VolunteerVM } from "@/lib/api"
import type { PCO } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

interface VolunteerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    volunteer?: VolunteerVM | null
    onSuccess?: () => void
}

export function VolunteerDialog({ open, onOpenChange, volunteer, onSuccess }: VolunteerDialogProps) {
    const [saving, setSaving] = useState(false)
    const [pcos, setPcos] = useState<PCO[]>([])
    const [loadingPcos, setLoadingPcos] = useState(false)
    const [formData, setFormData] = useState({
        pcoId: "",
        notes: "",
        active: true,
    })
    const { toast } = useToast()

    useEffect(() => {
        if (open && !volunteer) {
            // Load PCOs for new volunteer
            loadPCOs()
        }
    }, [open, volunteer])

    useEffect(() => {
        if (open) {
            if (volunteer) {
                setFormData({
                    pcoId: String(volunteer.pcoId),
                    notes: volunteer.notes || "",
                    active: volunteer.active,
                })
            } else {
                setFormData({
                    pcoId: "",
                    notes: "",
                    active: true,
                })
            }
        }
    }, [open, volunteer])

    const loadPCOs = async () => {
        setLoadingPcos(true)
        try {
            const data = await fetchPCOs({ limit: 500 })
            setPcos(data)
        } catch (error) {
            console.error("Failed to load people and partners", error)
            toast({
                title: "Error",
                description: "Failed to load people and partners.",
                variant: "destructive",
            })
        } finally {
            setLoadingPcos(false)
        }
    }

    const handleSave = async () => {
        if (!volunteer && !formData.pcoId) {
            toast({
                title: "Error",
                description: "Please select a person or partner.",
                variant: "destructive",
            })
            return
        }

        try {
            setSaving(true)

            if (volunteer) {
                await updateVolunteer(volunteer.id, {
                    notes: formData.notes.trim(),
                    active: formData.active,
                })
                toast({
                    title: "Success",
                    description: "Volunteer updated successfully.",
                })
            } else {
                await createVolunteer({
                    pcoId: Number(formData.pcoId),
                    notes: formData.notes.trim(),
                    active: formData.active,
                })
                toast({
                    title: "Success",
                    description: "Volunteer created successfully.",
                })
            }

            onOpenChange(false)
            setFormData({
                pcoId: "",
                notes: "",
                active: true,
            })
            onSuccess?.()
        } catch (error: any) {
            console.error("Failed to save volunteer", error)
            toast({
                title: "Error",
                description: error.message || "Failed to save volunteer.",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const selectedPco = pcos.find((p) => String(p.id) === formData.pcoId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        {volunteer ? "Edit Volunteer" : "Add New Volunteer"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {volunteer ? (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <div className="mt-1 text-sm text-gray-900">{volunteer.firstName}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <div className="mt-1 text-sm text-gray-900">{volunteer.lastName}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <div className="mt-1 text-sm text-gray-900">{volunteer.email || "N/A"}</div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <div className="mt-1 text-sm text-gray-900">{volunteer.phone || "N/A"}</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <FloatingSelect
                                label="PCO"
                                value={formData.pcoId}
                                onValueChange={(value) => setFormData({ ...formData, pcoId: value })}
                                disabled={saving || loadingPcos}
                                className="min-h-10 w-full"
                            >
                                {pcos.map((pco) => (
                                    <SelectItem key={pco.id} value={String(pco.id)}>
                                        {pco.firstName} {pco.lastName} {pco.email ? `(${pco.email})` : ""}
                                    </SelectItem>
                                ))}
                            </FloatingSelect>
                            {loadingPcos && (
                                <p className="text-sm text-muted-foreground">Loading PCOs...</p>
                            )}
                        </>
                    )}

                    <FloatingTextarea
                        id="volunteer-notes"
                        label="Notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        disabled={saving}
                        rows={4}
                    />

                    <FloatingSelect
                        label="Status"
                        value={formData.active ? "active" : "inactive"}
                        onValueChange={(value) => setFormData({ ...formData, active: value === "active" })}
                        disabled={saving}
                        className="min-h-10 w-30"
                    >
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </FloatingSelect>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        {saving ? "Saving..." : volunteer ? "Update" : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

