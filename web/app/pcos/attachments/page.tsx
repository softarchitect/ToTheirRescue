"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SelectItem } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, Eye, Edit, Trash2, Download, FileText, Video, ImageIcon, ChevronDown, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { PCODialogShell } from "@/components/pco/pco-dialog-shell"
import { useToast } from "@/hooks/use-toast"
import { fetchPCOAttachments, deletePCOAttachment, uploadPCOAttachment, updatePCOAttachment, getTenantInfoWithId, type ArtifactAttachment, API_BASE_URL } from "@/lib/api"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FloatingSelect } from "@/components/ui/floating-select"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { SelectedPCOHeader } from "@/components/selected-pco-header"

export default function PCOAttachmentsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [selectedPCO, setSelectedPCO] = useState<any>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Redirect AnimalCaretaker and Veterinarian users away from PCO pages
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalCaretaker" || role === "Veterinarian") {
            router.push("/animals")
        }
    }, [router])
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingAttachment, setEditingAttachment] = useState<ArtifactAttachment | null>(null)
    const [attachments, setAttachments] = useState<ArtifactAttachment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [attachmentToDelete, setAttachmentToDelete] = useState<ArtifactAttachment | null>(null)
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [tenantId, setTenantId] = useState<number | null>(null)

    const [newAttachment, setNewAttachment] = useState({
        type: "photo" as "photo" | "video" | "document",
        date: new Date().toISOString().split("T")[0],
        rank: 0,
        description: "",
        notes: "",
        file: null as File | null,
    })
    const [formErrors, setFormErrors] = useState<{
        file?: string
        pco?: string
    }>({})

    useEffect(() => {
        const loadTenantId = async () => {
            const tenantInfo = await getTenantInfoWithId()
            if (tenantInfo?.id) {
                setTenantId(tenantInfo.id)
            }
        }
        loadTenantId()

        const selected = JSON.parse(sessionStorage.getItem("selectedPCOs") || "[]")
        if (selected.length > 0) {
            setSelectedPCO(selected[0])
        }
    }, [])

    useEffect(() => {
        if (selectedPCO?.id && tenantId) {
            loadAttachments()
        }
    }, [selectedPCO?.id, tenantId])

    const loadAttachments = async () => {
        if (!selectedPCO?.id || !tenantId) return

        try {
            setIsLoading(true)
            const data = await fetchPCOAttachments(selectedPCO.id, tenantId)
            setAttachments(data)
        } catch (error) {
            console.error("Failed to load attachments", error)
            toast({
                title: "Error",
                description: "Failed to load attachments",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewAttachment({ ...newAttachment, file })
            // Clear file error when file is selected
            if (formErrors.file) {
                setFormErrors({ ...formErrors, file: undefined })
            }
        }
    }

    const validateForm = (): boolean => {
        const errors: { file?: string; pco?: string } = {}

        if (!isEditMode) {
            if (!selectedPCO?.id) {
                errors.pco = "Please select a person or partner first"
            }
            if (!newAttachment.file) {
                errors.file = "Please select a file to upload"
            }
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSave = async () => {
        // Clear previous errors
        setFormErrors({})

        if (isEditMode && editingAttachment) {
            // Update existing attachment
            if (!newAttachment.file && !editingAttachment.id) {
                toast({
                    title: "Error",
                    description: "No changes to save",
                    variant: "destructive",
                })
                return
            }

            try {
                await updatePCOAttachment(
                    editingAttachment.id,
                    {
                        type: newAttachment.type,
                        date: newAttachment.date,
                        description: newAttachment.description || "",
                        notes: newAttachment.notes || "",
                        rank: newAttachment.rank || undefined,
                    },
                    newAttachment.file || undefined
                )

                toast({
                    title: "Success",
                    description: "Attachment updated successfully",
                })

                setIsDialogOpen(false)
                setIsEditMode(false)
                setEditingAttachment(null)
                setFormErrors({})
                setNewAttachment({
                    type: "photo",
                    date: new Date().toISOString().split("T")[0],
                    rank: 0,
                    description: "",
                    notes: "",
                    file: null,
                })
                await loadAttachments()
            } catch (error: any) {
                console.error("Failed to update attachment", error)
                toast({
                    title: "Error",
                    description: error.message || "Failed to update attachment",
                    variant: "destructive",
                })
            }
        } else {
            // Create new attachment - validate first
            if (!validateForm()) {
                return
            }

            try {
                if (!newAttachment.file) return
                await uploadPCOAttachment(selectedPCO.id, newAttachment.file, {
                    type: newAttachment.type,
                    date: newAttachment.date,
                    description: newAttachment.description || undefined,
                    notes: newAttachment.notes || undefined,
                    rank: newAttachment.rank || undefined,
                })

                toast({
                    title: "Success",
                    description: "Attachment uploaded successfully",
                })

                setIsDialogOpen(false)
                setFormErrors({})
                setNewAttachment({
                    type: "photo",
                    date: new Date().toISOString().split("T")[0],
                    rank: 0,
                    description: "",
                    notes: "",
                    file: null,
                })
                await loadAttachments()
            } catch (error: any) {
                console.error("Failed to upload attachment", error)
                toast({
                    title: "Error",
                    description: error.message || "Failed to upload attachment",
                    variant: "destructive",
                })
            }
        }
    }

    const handleEdit = (attachment: ArtifactAttachment) => {
        setEditingAttachment(attachment)
        setIsEditMode(true)
        const attachmentType = getAttachmentType(attachment)
        setNewAttachment({
            type: attachmentType,
            date: attachment.attachmentDate ? new Date(attachment.attachmentDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
            rank: attachment.publicityRank || 0,
            description: attachment.description || "",
            notes: attachment.notes || "",
            file: null,
        })
        setIsDialogOpen(true)
    }

    const handleDelete = (attachment: ArtifactAttachment) => {
        setAttachmentToDelete(attachment)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!attachmentToDelete) return

        try {
            await deletePCOAttachment(attachmentToDelete.id)
            toast({
                title: "Success",
                description: "Attachment deleted successfully",
            })
            setDeleteDialogOpen(false)
            setAttachmentToDelete(null)
            await loadAttachments()
        } catch (error: any) {
            console.error("Failed to delete attachment", error)
            toast({
                title: "Error",
                description: error.message || "Failed to delete attachment",
                variant: "destructive",
            })
        }
    }

    const handlePreview = (attachment: ArtifactAttachment) => {
        const url = attachment.originalBlobUrl || attachment.blobUrl || ""
        if (url) {
            setPreviewUrl(url.startsWith("http") ? url : `${API_BASE_URL}${url}`)
            setPreviewDialogOpen(true)
        }
    }

    const handleDownload = async (attachment: ArtifactAttachment) => {
        const url = attachment.originalBlobUrl || attachment.blobUrl || ""
        if (!url) {
            toast({
                title: "Error",
                description: "File URL not found.",
                variant: "destructive",
            })
            return
        }

        try {
            const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`

            // Get auth token for authenticated request
            const authToken = typeof window !== "undefined"
                ? (() => {
                    try {
                        const stored = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth")
                        if (!stored) return null
                        const parsed = JSON.parse(stored)
                        return parsed?.token ?? null
                    } catch {
                        return null
                    }
                })()
                : null

            // Fetch the file as a blob
            const response = await fetch(fullUrl, {
                headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
            })

            if (!response.ok) {
                throw new Error(`Failed to download file: ${response.statusText}`)
            }

            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)

            // Create download link
            const link = document.createElement("a")
            link.href = blobUrl
            link.download = attachment.originalFileName || attachment.fileName || "download"
            document.body.appendChild(link)
            link.click()

            // Cleanup
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
        } catch (error: any) {
            console.error("Failed to download attachment", error)
            toast({
                title: "Error",
                description: error.message || "Failed to download file.",
                variant: "destructive",
            })
        }
    }

    const getAttachmentType = (attachment: ArtifactAttachment): "photo" | "video" | "document" => {
        const type = (attachment.attachmentType || "").toLowerCase()
        if (type.includes("photo")) return "photo"
        if (type.includes("video")) return "video"
        return "document"
    }

    const getAttachmentIcon = (type: "photo" | "video" | "document") => {
        switch (type) {
            case "photo":
                return <ImageIcon className="h-12 w-12 text-muted-foreground" />
            case "video":
                return <Video className="h-12 w-12 text-muted-foreground" />
            default:
                return <FileText className="h-12 w-12 text-muted-foreground" />
        }
    }

    const handleActionClick = (action: string) => {
        switch (action) {
            case "donate":
                router.push("/pcos/donations")
                break
            case "history":
                router.push("/pcos/history")
                break
            case "media":
                router.push("/pcos/media")
                break
            case "volunteer":
                console.log("[v0] Navigate to volunteer")
                break
        }
    }

    const userRole = getUserRole()

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
            <Navigation />

            <main className="container mx-auto px-4 py-4">
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Button variant="link" onClick={() => router.push("/")} className="p-0 h-auto text-muted-foreground">
                        Home
                    </Button>
                    <span>/</span>
                    <Button variant="link" onClick={() => router.push("/pcos")} className="p-0 h-auto text-muted-foreground">
                        Manage People and Partners
                    </Button>
                    <span>/</span>
                    <span className="text-foreground font-medium">Photos, Videos, and Documents</span>
                </nav>

                <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
                    <CardContent className="px-3 py-0">
                        <SelectedPCOHeader pco={selectedPCO} />
                    </CardContent>
                </Card>

                <div className="flex items-center justify-end gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="lg" className="gap-2 bg-transparent text-sm">
                                Actions
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            {userRole !== "AnimalManager" && (
                                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("donate")}>
                                    Donate
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("history")}>
                                History
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button onClick={() => {
                        setIsEditMode(false)
                        setEditingAttachment(null)
                        setNewAttachment({
                            type: "photo",
                            date: new Date().toISOString().split("T")[0],
                            rank: 0,
                            description: "",
                            notes: "",
                            file: null,
                        })
                        setIsDialogOpen(true)
                    }} size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                        <Plus className="h-5 w-5" />
                        Add
                    </Button>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-pulse text-muted-foreground">Loading attachments...</div>
                    </div>
                ) : attachments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4 opacity-50" />
                        <p>No attachments found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {attachments.map((attachment) => {
                            const type = getAttachmentType(attachment)
                            const thumbnailUrl = attachment.thumbnailBlobUrl || attachment.blobUrl || ""
                            const fullThumbnailUrl = thumbnailUrl.startsWith("http")
                                ? thumbnailUrl
                                : `${API_BASE_URL}${thumbnailUrl}`

                            return (
                                <Card key={attachment.id} className="overflow-hidden group hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm">
                                    <div className="relative aspect-square bg-muted">
                                        {type === "photo" && thumbnailUrl ? (
                                            <Image
                                                src={fullThumbnailUrl}
                                                alt={attachment.originalFileName || attachment.fileName}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                {getAttachmentIcon(type)}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handlePreview(attachment)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleEdit(attachment)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => handleDownload(attachment)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Download className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(attachment)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs text-muted-foreground truncate" title={attachment.originalFileName || attachment.fileName}>
                                            {attachment.originalFileName || attachment.fileName}
                                        </p>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}

                <PCODialogShell
                    open={isDialogOpen}
                    onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                            setIsEditMode(false)
                            setEditingAttachment(null)
                            setFormErrors({})
                            setNewAttachment({
                                type: "photo",
                                date: new Date().toISOString().split("T")[0],
                                rank: 0,
                                description: "",
                                notes: "",
                                file: null,
                            })
                        }
                    }}
                    title={isEditMode ? "Edit Attachment" : "Add New Photo, Video, or Document"}
                    isEditMode={isEditMode}
                    editSubmitLabel="Update"
                    pco={selectedPCO}
                    onSave={handleSave}
                >
                    <div className="flex gap-2">
                        <FloatingSelect
                            label="Type"
                            value={newAttachment.type}
                            className="min-h-10"
                            onValueChange={(value: any) => setNewAttachment({ ...newAttachment, type: value })}
                        >
                            <SelectItem value="photo">Photo</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="document">Document</SelectItem>
                        </FloatingSelect>


                        <FloatingInput
                            id="attachment-date"
                            label="Date"
                            type="date"
                            value={newAttachment.date}
                            max={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setNewAttachment({ ...newAttachment, date: e.target.value })}
                        />

                        <FloatingInput
                            id="attachment-rank"
                            label="Rank"
                            type="number"
                            placeholder="Rank"
                            value={newAttachment.rank || ""}
                            onChange={(e) => setNewAttachment({ ...newAttachment, rank: Number.parseInt(e.target.value) || 0 })}
                        />
                    </div>
                    <FloatingTextarea
                        id="attachment-description"
                        label="Short Description"
                        placeholder="Short description"
                        value={newAttachment.description}
                        onChange={(e) => setNewAttachment({ ...newAttachment, description: e.target.value })}
                        rows={3}
                    />
                    {!isEditMode && (
                        <div>
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${formErrors.file ? "border-red-500 bg-red-50/50" : "border-gray-300"
                                }`}>
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <Upload className={`h-12 w-12 mx-auto mb-3 ${formErrors.file ? "text-red-400" : "text-gray-400"
                                        }`} />
                                    <p className={`text-sm ${formErrors.file ? "text-red-600" : "text-gray-600"
                                        }`}>
                                        {newAttachment.file ? newAttachment.file.name : "Click to upload or drag and drop"}
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
                            {formErrors.file && (
                                <p className="text-xs text-red-500 mt-1">{formErrors.file}</p>
                            )}
                        </div>
                    )}
                    {isEditMode && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                            <label htmlFor="file-upload-edit" className="cursor-pointer">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600">
                                    {newAttachment.file ? newAttachment.file.name : "Click to replace file (optional)"}
                                </p>
                                <p className="text-xs text-gray-400">Leave empty to keep current file</p>
                                <input
                                    id="file-upload-edit"
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                    accept="image/*,video/*,.pdf"
                                />
                            </label>
                        </div>
                    )}
                </PCODialogShell>

                {/* Delete Confirmation Dialog */}
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent className="bg-white">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Do you want to delete this {attachmentToDelete ? getAttachmentType(attachmentToDelete) : "attachment"}?
                                This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Preview Dialog */}
                <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Preview</DialogTitle>
                        </DialogHeader>
                        <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
                            {previewUrl && (
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div >
    )
}


