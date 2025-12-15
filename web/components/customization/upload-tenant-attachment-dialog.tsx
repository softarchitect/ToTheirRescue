"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { SelectItem } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { uploadTenantAttachment, getTenantInfoWithId } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UploadTenantAttachmentDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function UploadTenantAttachmentDialog({
    open,
    onOpenChange,
    onSuccess,
}: UploadTenantAttachmentDialogProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadForm, setUploadForm] = useState({
        type: "photo" as "photo" | "video" | "document",
        date: new Date().toISOString().split('T')[0],
        rank: 0,
        description: "",
        notes: "",
        file: null as File | null,
    })
    const { toast } = useToast()

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setUploadForm({ ...uploadForm, file })
        }
    }

    const handleUpload = async () => {
        if (!uploadForm.file) {
            toast({
                title: "Error",
                description: "Please select a file to upload.",
                variant: "destructive",
            })
            return
        }

        try {
            setUploading(true)
            const tenantData = await getTenantInfoWithId()
            if (!tenantData || !tenantData.id) {
                throw new Error("Tenant information not found")
            }

            await uploadTenantAttachment(tenantData.id, uploadForm.file, {
                type: uploadForm.type,
                date: uploadForm.date,
                description: uploadForm.description || undefined,
                notes: uploadForm.notes || undefined,
                rank: uploadForm.rank || undefined,
            })

            toast({
                title: "Success",
                description: "Attachment uploaded successfully.",
            })

            onOpenChange(false)
            setUploadForm({
                type: "photo",
                date: new Date().toISOString().split('T')[0],
                rank: 0,
                description: "",
                notes: "",
                file: null,
            })
            onSuccess?.()
        } catch (error: any) {
            console.error("Failed to upload attachment", error)
            toast({
                title: "Error",
                description: error.message || "Failed to upload attachment.",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">Add New Photo, Video, or Document</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Form Fields */}
                    <div className="flex gap-4">
                        <FloatingSelect
                            label="Type"
                            value={uploadForm.type}
                            className="min-h-10"
                            onValueChange={(value) =>
                                setUploadForm({ ...uploadForm, type: value as "photo" | "video" | "document" })
                            }
                        >
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                        </FloatingSelect>

                        <FloatingInput
                            id="attachment-date"
                            label="Date"
                            type="date"
                            value={uploadForm.date}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })}
                        />
                        <FloatingInput
                            id="attachment-rank"
                            label="Rank"
                            type="number"
                            value={uploadForm.rank || ""}
                            onChange={(e) =>
                                setUploadForm({ ...uploadForm, rank: Number.parseInt(e.target.value) || 0 })
                            }
                        />
                    </div>

                    <div>
                        <FloatingTextarea
                            id="attachment-description"
                            label="Short Description"
                            value={uploadForm.description}
                            onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    <div>
                        <FloatingTextarea
                            id="attachment-notes"
                            label="Notes"
                            value={uploadForm.notes}
                            onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">
                                {uploadForm.file ? uploadForm.file.name : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG, PDF, MP4 up to 10MB</p>
                            <input
                                id="file-upload"
                                type="file"
                                className="hidden"
                                onChange={handleFileSelect}
                                accept="image/*,video/*,.pdf"
                            />
                        </label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={uploading || !uploadForm.file}>
                        {uploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

