"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Eye, Download, FileText, Image as ImageIcon, Video, Paperclip, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchTenantAttachments, deleteTenantAttachment, type ArtifactAttachment, getTenantInfoWithId } from "@/lib/api"
import { useTenant } from "@/contexts/tenant-context"
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
import { UploadTenantAttachmentDialog } from "@/components/customization/upload-tenant-attachment-dialog"
import Image from "next/image"

export default function TenantAttachmentsPage() {
    const router = useRouter()
    const { tenantInfo } = useTenant()
    const [attachments, setAttachments] = useState<ArtifactAttachment[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [attachmentToDelete, setAttachmentToDelete] = useState<ArtifactAttachment | null>(null)
    const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string>("")
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const { toast } = useToast()

    // Redirect AnimalManager, AnimalCaretaker, and Veterinarian users away from admin pages
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalManager" || role === "AnimalCaretaker" || role === "Veterinarian") {
            router.push("/animals")
        }
    }, [router])

    useEffect(() => {
        loadAttachments()
    }, [tenantInfo])

    const loadAttachments = async () => {
        try {
            const tenantData = await getTenantInfoWithId()
            if (!tenantData || !tenantData.id) {
                setIsLoading(false)
                return
            }

            const data = await fetchTenantAttachments(tenantData.id)
            setAttachments(data)
        } catch (error) {
            console.error("Failed to load tenant attachments", error)
            toast({
                title: "Error",
                description: "Failed to load attachments.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = (attachment: ArtifactAttachment) => {
        setAttachmentToDelete(attachment)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!attachmentToDelete) return

        try {
            await deleteTenantAttachment(attachmentToDelete.id)
            toast({
                title: "Success",
                description: "Attachment deleted successfully.",
            })
            setDeleteDialogOpen(false)
            setAttachmentToDelete(null)
            await loadAttachments()
        } catch (error: any) {
            console.error("Failed to delete attachment", error)
            toast({
                title: "Error",
                description: error.message || "Failed to delete attachment.",
                variant: "destructive",
            })
        }
    }

    const handlePreview = (attachment: ArtifactAttachment) => {
        const url = attachment.originalBlobUrl || attachment.blobUrl || ""
        if (url) {
            setPreviewUrl(url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`)
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
            const fullUrl = url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${url}`

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


    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="mb-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight leading-tight flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                <Paperclip className="h-10 w-10 text-primary" />
                                Tenant Attachments
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Manage photos, videos, and documents for your organization
                            </p>
                        </div>
                        <Button onClick={() => setUploadDialogOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Plus className="h-4 w-4" />
                            Add Attachment
                        </Button>
                    </div>
                </motion.div>

                <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg p-6">
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {attachments.map((attachment) => {
                                const type = getAttachmentType(attachment)
                                const thumbnailUrl = attachment.thumbnailBlobUrl || attachment.blobUrl || ""
                                const fullThumbnailUrl = thumbnailUrl.startsWith("http")
                                    ? thumbnailUrl
                                    : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}${thumbnailUrl}`

                                return (
                                    <Card key={attachment.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
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
                </Card>
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to delete this {attachmentToDelete ? getAttachmentType(attachmentToDelete) : "attachment"}?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

            {/* Upload Dialog */}
            <UploadTenantAttachmentDialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
                onSuccess={loadAttachments}
            />
        </div>
    )
}