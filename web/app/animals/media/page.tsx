"use client"

import { useState, useEffect, useMemo, useRef, useCallback, type ChangeEvent, type MouseEvent, type DragEvent } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import {
  Upload,
  Eye,
  Edit,
  Trash2,
  Download,
  Home,
  FileText,
  Image as ImageIcon,
  Video,
  Pencil,
  ImagePlus,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import NextImage from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import {
  fetchAnimalsByIds,
  fetchAnimalAttachments,
  uploadAnimalAttachment,
  updateAnimalAttachment,
  updateArtifactAttachmentRank,
  deleteAnimalAttachment,
  type ArtifactAttachment,
} from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CustomConfirmDialog } from "@/components/custom-confirm-dialog"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type MediaType = "photo" | "video" | "document"

const getAttachmentType = (attachment: ArtifactAttachment): MediaType => {
  const type = (attachment.attachmentType || "").toLowerCase()
  if (type.includes("photo")) return "photo"
  if (type.includes("video")) return "video"
  return "document"
}

const toInputDate = (value?: string | null) => {
  if (!value) return new Date().toISOString().split("T")[0]
  return value.split("T")[0]
}

const getAttachmentLabel = (attachment: ArtifactAttachment) =>
  attachment.description ||
  attachment.originalFileName ||
  attachment.fileName ||
  "Attachment"

const getAttachmentUrl = (attachment: ArtifactAttachment, useThumbnail = false) => {
  const url = useThumbnail
    ? attachment.thumbnailBlobUrl || attachment.blobUrl || attachment.originalBlobUrl
    : attachment.originalBlobUrl || attachment.blobUrl || attachment.thumbnailBlobUrl
  if (!url) return ""
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`
}

const getPrimaryPhotoUrl = (attachments: ArtifactAttachment[]) => {
  const photos = attachments.filter((a) => getAttachmentType(a) === "photo")
  if (photos.length === 0) return ""
  // Prefer rank 1, otherwise lowest rank > 0, otherwise first photo
  const sorted = [...photos].sort((a, b) => {
    const ar = a.publicityRank || 0
    const br = b.publicityRank || 0
    if (ar === 0 && br === 0) return 0
    if (ar === 0) return 1
    if (br === 0) return -1
    return ar - br
  })
  return getAttachmentUrl(sorted[0], true)
}

export default function MediaPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [attachments, setAttachments] = useState<ArtifactAttachment[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isReordering, setIsReordering] = useState(false)
  const [draggingAttachmentId, setDraggingAttachmentId] = useState<number | null>(null)
  const [dragOverAttachmentId, setDragOverAttachmentId] = useState<number | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedAttachment, setSelectedAttachment] = useState<ArtifactAttachment | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [attachmentToDelete, setAttachmentToDelete] = useState<ArtifactAttachment | null>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [previewAttachment, setPreviewAttachment] = useState<ArtifactAttachment | null>(null)
  const [imageEditorOpen, setImageEditorOpen] = useState(false)
  const [imageEditorRotation, setImageEditorRotation] = useState(0)
  const [imageEditorFlipX, setImageEditorFlipX] = useState(false)
  const [imageEditorFlipY, setImageEditorFlipY] = useState(false)
  const [imageEditorZoom, setImageEditorZoom] = useState(1)
  const [imageEditorCropSquare, setImageEditorCropSquare] = useState(false)
  const [imageEditorFreeformCrop, setImageEditorFreeformCrop] = useState(false)
  const [imageEditorCropRect, setImageEditorCropRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [imageEditorLoadError, setImageEditorLoadError] = useState<string | null>(null)
  const imageEditorCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const handleImageEditorCanvasRef = useCallback((node: HTMLCanvasElement | null) => {
    imageEditorCanvasRef.current = node
  }, [])

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imageEditorRenderRef = useRef<{
    canvasWidth: number
    canvasHeight: number
    drawWidth: number
    drawHeight: number
    rotation: number
    flipX: boolean
    flipY: boolean
    previewScale: number
  } | null>(null)
  const cropDragRef = useRef<{
    mode: "new" | "move" | "resize" | null
    handle?: "nw" | "ne" | "sw" | "se"
    startX: number
    startY: number
    offsetX: number
    offsetY: number
    initialRect: { x: number; y: number; width: number; height: number } | null
  }>({
    mode: null,
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    initialRect: null,
  })
  const [imageEditorFile, setImageEditorFile] = useState<File | null>(null)
  const [imageEditorFilename, setImageEditorFilename] = useState<string>("edited-image.png")
  const { toast } = useToast()

  const [newMedia, setNewMedia] = useState({
    type: "photo" as MediaType,
    date: new Date().toISOString().split("T")[0],
    rank: 0,
    description: "",
    notes: "",
    file: null as File | null,
  })

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  // Use the rank #1 photo as the selected animal image in the header.
  useEffect(() => {
    if (!selectedAnimals.length) return
    const url = getPrimaryPhotoUrl(attachments)
    if (!url) return
    setSelectedAnimals((prev) => {
      if (!prev.length) return prev
      if (prev[0]?.imageUrl === url) return prev
      const next = [...prev]
      next[0] = { ...next[0], imageUrl: url }
      return next
    })
  }, [attachments])

  useEffect(() => {
    let cancelled = false

    const loadSelected = async () => {
      // Preferred: full objects from Animals page actions
      let selected: any[] = []
      try {
        selected = JSON.parse(sessionStorage.getItem("selectedAnimals") || "[]")
      } catch {
        selected = []
      }

      // Fallback: restore from selected animal IDs if present (more robust)
      if (!Array.isArray(selected) || selected.length === 0) {
        try {
          const ids = JSON.parse(sessionStorage.getItem("selectedAnimalIds") || "[]") as Array<string | number>
          const firstId = ids?.[0]
          const parsed = Number(firstId)
          if (Number.isFinite(parsed) && parsed > 0) {
            const animals = await fetchAnimalsByIds([parsed])
            selected = animals as any[]
            sessionStorage.setItem("selectedAnimals", JSON.stringify(selected))
          }
        } catch {
          // ignore
        }
      }

      if (cancelled) return
      setSelectedAnimals(Array.isArray(selected) ? selected : [])

      const primaryId = Number(Array.isArray(selected) && selected[0]?.id)
      if (Number.isFinite(primaryId) && primaryId > 0) {
        await loadAttachments(primaryId)
      }
    }

    void loadSelected()

    return () => {
      cancelled = true
    }
  }, [])

  const loadAttachments = async (animalId: number) => {
    try {
      setIsLoading(true)
      const data = await fetchAnimalAttachments(animalId)
      setAttachments(data)
    } catch (error: any) {
      console.error("Failed to load attachments", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load attachments.",
        variant: "destructive",
      })
      setAttachments([])
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setNewMedia({
      type: "photo",
      date: today,
      rank: 0,
      description: "",
      notes: "",
      file: null,
    })
    setSelectedAttachment(null)
    setIsEditMode(false)
    setFileInputKey((prev) => prev + 1)
  }

  const openAddDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (attachment: ArtifactAttachment) => {
    setSelectedAttachment(attachment)
    setIsEditMode(true)
    setNewMedia({
      type: getAttachmentType(attachment),
      date: toInputDate(attachment.attachmentDate || attachment.dateEntered),
      rank: attachment.publicityRank || 0,
      description: attachment.description || "",
      notes: attachment.notes || "",
      file: null,
    })
    setFileInputKey((prev) => prev + 1)
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    if (!selectedAnimals.length) {
      toast({
        title: "No animal selected",
        description: "Please select an animal before uploading.",
        variant: "destructive",
      })
      return
    }

    if (!newMedia.date) {
      toast({
        title: "Missing date",
        description: "Please select a date for this attachment.",
        variant: "destructive",
      })
      return
    }

    if (!isEditMode && !newMedia.file) {
      toast({
        title: "Missing file",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return
    }

    if (newMedia.type === "document" && !newMedia.description.trim()) {
      toast({
        title: "Missing description",
        description: "Document attachments require a short description.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSaving(true)
      const primary = selectedAnimals[0]
      const primaryId = Number(primary?.id)
      if (!Number.isFinite(primaryId) || primaryId <= 0) {
        toast({
          title: "No animal selected",
          description: "Please select an animal before uploading.",
          variant: "destructive",
        })
        return
      }

      if (isEditMode && selectedAttachment) {
        await updateAnimalAttachment(
          selectedAttachment.id,
          {
            type: newMedia.type,
            date: newMedia.date,
            description: newMedia.description || undefined,
            notes: newMedia.notes || undefined,
            rank: newMedia.rank || undefined,
          },
          newMedia.file || undefined,
        )
      } else {
        if (!newMedia.file) return
        await uploadAnimalAttachment(primaryId, newMedia.file, {
          type: newMedia.type,
          date: newMedia.date,
          description: newMedia.description || undefined,
          notes: newMedia.notes || undefined,
          rank: newMedia.rank || undefined,
        })
      }

      await loadAttachments(primaryId)
      setIsDialogOpen(false)
      resetForm()
      toast({
        title: "Success",
        description: isEditMode ? "Attachment updated successfully." : "Attachment uploaded successfully.",
      })
    } catch (error: any) {
      console.error("Failed to save attachment", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save attachment.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = (attachment: ArtifactAttachment) => {
    setAttachmentToDelete(attachment)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!attachmentToDelete || !selectedAnimals.length) return

    try {
      await deleteAnimalAttachment(attachmentToDelete.id)
      toast({
        title: "Success",
        description: "Attachment deleted successfully.",
      })
      setDeleteDialogOpen(false)
      setAttachmentToDelete(null)
      const primaryId = Number(selectedAnimals[0]?.id)
      if (Number.isFinite(primaryId) && primaryId > 0) {
        await loadAttachments(primaryId)
      }
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
    setPreviewAttachment(attachment)
    setPreviewDialogOpen(true)
  }

  const handleDownload = async (attachment: ArtifactAttachment) => {
    const url = getAttachmentUrl(attachment)
    if (!url) {
      toast({
        title: "Error",
        description: "File URL not found.",
        variant: "destructive",
      })
      return
    }

    try {
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

      const response = await fetch(url, {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      })

      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`)
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = attachment.originalFileName || attachment.fileName || "download"
      document.body.appendChild(link)
      link.click()
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

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setNewMedia((prev) => ({ ...prev, file }))
    // Important: allow selecting another file with the same name (common on mobile where
    // photos may all come through as "image.jpg"). Without clearing the input value,
    // some browsers won't fire `onChange` when the "same" filename is picked again.
    event.target.value = ""
  }

  const fileAccept =
    newMedia.type === "photo"
      ? "image/*"
      : newMedia.type === "video"
        ? "video/*"
        : ".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"

  const localPreviewUrl = useMemo(() => {
    if (!newMedia.file) return ""
    return URL.createObjectURL(newMedia.file)
  }, [newMedia.file])

  useEffect(() => {
    if (!localPreviewUrl) return
    return () => {
      URL.revokeObjectURL(localPreviewUrl)
    }
  }, [localPreviewUrl])

  const imageEditorPreviewUrl = useMemo(() => {
    if (!imageEditorFile) return ""
    return URL.createObjectURL(imageEditorFile)
  }, [imageEditorFile])

  useEffect(() => {
    if (!imageEditorPreviewUrl) return
    return () => {
      URL.revokeObjectURL(imageEditorPreviewUrl)
    }
  }, [imageEditorPreviewUrl])

  const modalPreviewType = newMedia.file
    ? newMedia.type
    : selectedAttachment
      ? getAttachmentType(selectedAttachment)
      : null

  const modalPreviewUrl = newMedia.file
    ? localPreviewUrl
    : selectedAttachment
      ? getAttachmentUrl(selectedAttachment)
      : ""

  const modalPreviewIsPdf = (() => {
    if (!modalPreviewUrl) return false
    if (newMedia.file) {
      const name = newMedia.file.name.toLowerCase()
      return newMedia.file.type === "application/pdf" || name.endsWith(".pdf")
    }
    if (selectedAttachment) {
      const name = (
        selectedAttachment.originalFileName ||
        selectedAttachment.fileName ||
        modalPreviewUrl
      ).toLowerCase()
      return name.endsWith(".pdf")
    }
    return false
  })()

  const fetchAuthToken = () => {
    if (typeof window === "undefined") return null
    try {
      const stored = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth")
      if (!stored) return null
      const parsed = JSON.parse(stored)
      return parsed?.token ?? null
    } catch {
      return null
    }
  }

  const fetchImageFile = async (url: string, filename: string) => {
    const tryFetch = async (withAuth: boolean) => {
      const token = withAuth ? fetchAuthToken() : null
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }
      const blob = await response.blob()
      return new File([blob], filename, { type: blob.type || "image/jpeg" })
    }

    try {
      return await tryFetch(false)
    } catch {
      return await tryFetch(true)
    }
  }

  const openImageEditor = async () => {
    if (newMedia.type !== "photo") {
      toast({
        title: "Select an image first",
        description: "Choose an image file to edit.",
        variant: "destructive",
      })
      return
    }

    let fileToEdit = newMedia.file
    if (!fileToEdit && selectedAttachment && getAttachmentType(selectedAttachment) === "photo") {
      const url = getAttachmentUrl(selectedAttachment)
      if (!url) {
        toast({
          title: "Image not available",
          description: "Unable to load the existing image.",
          variant: "destructive",
        })
        return
      }
      try {
        const filename = selectedAttachment.originalFileName || selectedAttachment.fileName || "attachment.jpg"
        fileToEdit = await fetchImageFile(url, filename)
      } catch (error: any) {
        toast({
          title: "Failed to load image",
          description: error.message || "Unable to open image editor.",
          variant: "destructive",
        })
        return
      }
    }

    if (!fileToEdit) {
      toast({
        title: "Select an image first",
        description: "Choose an image file to edit.",
        variant: "destructive",
      })
      return
    }

    setImageEditorRotation(0)
    setImageEditorFlipX(false)
    setImageEditorFlipY(false)
    setImageEditorZoom(1)
    setImageEditorCropSquare(false)
    // Default to enabling crop so users can quickly capture just the portion they want.
    setImageEditorFreeformCrop(true)
    setImageEditorCropRect(null)
    setImageEditorLoadError(null)
    setImageEditorFilename(fileToEdit.name || "edited-image.png")
    setImageEditorFile(fileToEdit)
    setImageEditorOpen(true)
  }

  useEffect(() => {
    if (!imageEditorOpen || !imageEditorFile) return

    let cancelled = false
    let rafId = 0
    setImageEditorLoadError(null)

    const waitForCanvas = (): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null => {
      if (cancelled) return null
      const canvas = imageEditorCanvasRef.current
      if (!canvas) {
        rafId = window.requestAnimationFrame(waitForCanvas)
        return null
      }
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        rafId = window.requestAnimationFrame(waitForCanvas)
        return null
      }
      return { canvas, ctx }
    }

    const drawCanvas = (
      canvas: HTMLCanvasElement,
      ctx: CanvasRenderingContext2D,
      source: { width: number; height: number; draw: (sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) => void },
    ) => {
      const maxSize = 480
      const rotation = ((imageEditorRotation % 360) + 360) % 360
      const cropSize = Math.min(source.width, source.height)
      const baseWidth = imageEditorCropSquare ? cropSize : source.width
      const baseHeight = imageEditorCropSquare ? cropSize : source.height
      const srcWidth = Math.max(1, baseWidth / imageEditorZoom)
      const srcHeight = Math.max(1, baseHeight / imageEditorZoom)
      const srcX = (source.width - srcWidth) / 2
      const srcY = (source.height - srcHeight) / 2

      const scale = Math.min(
        maxSize / (rotation === 90 || rotation === 270 ? srcHeight : srcWidth),
        maxSize / (rotation === 90 || rotation === 270 ? srcWidth : srcHeight),
        1,
      )
      const displayWidth = srcWidth * scale
      const displayHeight = srcHeight * scale

      if (rotation === 90 || rotation === 270) {
        canvas.width = displayHeight
        canvas.height = displayWidth
      } else {
        canvas.width = displayWidth
        canvas.height = displayHeight
      }

      ctx.save()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(imageEditorFlipX ? -1 : 1, imageEditorFlipY ? -1 : 1)
      source.draw(
        srcX,
        srcY,
        srcWidth,
        srcHeight,
        -displayWidth / 2,
        -displayHeight / 2,
        displayWidth,
        displayHeight,
      )
      ctx.restore()

      imageEditorRenderRef.current = {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        drawWidth: displayWidth,
        drawHeight: displayHeight,
        rotation,
        flipX: imageEditorFlipX,
        flipY: imageEditorFlipY,
        previewScale: scale,
      }

      if (imageEditorFreeformCrop && imageEditorCropRect) {
        ctx.save()
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(imageEditorFlipX ? -1 : 1, imageEditorFlipY ? -1 : 1)
        ctx.strokeStyle = "#22c55e"
        ctx.lineWidth = 2
        ctx.setLineDash([6, 4])
        const drawX = -displayWidth / 2 + imageEditorCropRect.x
        const drawY = -displayHeight / 2 + imageEditorCropRect.y
        ctx.strokeRect(drawX, drawY, imageEditorCropRect.width, imageEditorCropRect.height)
        ctx.setLineDash([])
        ctx.fillStyle = "#22c55e"
        const handleSize = 8
        const handles = [
          { x: drawX, y: drawY },
          { x: drawX + imageEditorCropRect.width, y: drawY },
          { x: drawX, y: drawY + imageEditorCropRect.height },
          { x: drawX + imageEditorCropRect.width, y: drawY + imageEditorCropRect.height },
        ]
        handles.forEach((handle) => {
          ctx.fillRect(handle.x - handleSize / 2, handle.y - handleSize / 2, handleSize, handleSize)
        })
        ctx.restore()
      }
    }

    const load = async () => {
      try {
        const ctxState = waitForCanvas()
        if (!ctxState) return
        const { canvas, ctx } = ctxState

        if ("createImageBitmap" in window) {
          const bitmap = await createImageBitmap(imageEditorFile)
          if (!cancelled) {
            drawCanvas(canvas, ctx, {
              width: bitmap.width,
              height: bitmap.height,
              draw: (sx, sy, sw, sh, dx, dy, dw, dh) => {
                ctx.drawImage(bitmap, sx, sy, sw, sh, dx, dy, dw, dh)
              },
            })
          }
          bitmap.close()
        } else {
          const img = new window.Image()
          img.onload = () => {
            if (cancelled) return
            drawCanvas(canvas, ctx, {
              width: img.width,
              height: img.height,
              draw: (sx, sy, sw, sh, dx, dy, dw, dh) => {
                ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
              },
            })
          }
          img.onerror = () => {
            if (!cancelled) setImageEditorLoadError("Failed to load image preview.")
          }
          img.src = imageEditorPreviewUrl
        }
      } catch (error: any) {
        if (!cancelled) {
          setImageEditorLoadError(error?.message || "Failed to load image preview.")
        }
      }
    }

    void load()

    return () => {
      cancelled = true
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [
    imageEditorOpen,
    imageEditorFile,
    imageEditorPreviewUrl,
    imageEditorRotation,
    imageEditorFlipX,
    imageEditorFlipY,
    imageEditorZoom,
    imageEditorCropSquare,
    imageEditorFreeformCrop,
    imageEditorCropRect,
  ])

  const applyImageEdits = async () => {
    if (!imageEditorFile) return

    const srcUrl = URL.createObjectURL(imageEditorFile)
    const mimeType = imageEditorFile.type || "image/png"

    try {
      const source = await new Promise<{
        width: number
        height: number
        draw: (ctx: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number) => void
        cleanup: () => void
      }>((resolve, reject) => {
        if ("createImageBitmap" in window) {
          createImageBitmap(imageEditorFile)
            .then((bitmap) => {
              resolve({
                width: bitmap.width,
                height: bitmap.height,
                draw: (ctx, sx, sy, sw, sh, dx, dy, dw, dh) => {
                  ctx.drawImage(bitmap, sx, sy, sw, sh, dx, dy, dw, dh)
                },
                cleanup: () => bitmap.close(),
              })
            })
            .catch(() => {
              const img = new window.Image()
              img.onerror = () => reject(new Error("Failed to load image"))
              img.onload = () => {
                resolve({
                  width: img.width,
                  height: img.height,
                  draw: (ctx, sx, sy, sw, sh, dx, dy, dw, dh) => {
                    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
                  },
                  cleanup: () => {},
                })
              }
              img.src = srcUrl
            })
        } else {
          const img = new window.Image()
          img.onerror = () => reject(new Error("Failed to load image"))
          img.onload = () => {
            resolve({
              width: img.width,
              height: img.height,
              draw: (ctx, sx, sy, sw, sh, dx, dy, dw, dh) => {
                ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
              },
              cleanup: () => {},
            })
          }
          img.src = srcUrl
        }
      })

      const rotation = ((imageEditorRotation % 360) + 360) % 360
      const cropSize = Math.min(source.width, source.height)
      const baseWidth = imageEditorCropSquare ? cropSize : source.width
      const baseHeight = imageEditorCropSquare ? cropSize : source.height
      const srcWidth = Math.max(1, baseWidth / imageEditorZoom)
      const srcHeight = Math.max(1, baseHeight / imageEditorZoom)
      const srcX = (source.width - srcWidth) / 2
      const srcY = (source.height - srcHeight) / 2

      const renderMeta = imageEditorRenderRef.current
      const scale = renderMeta?.previewScale || 1

      let cropX = srcX
      let cropY = srcY
      let cropWidth = srcWidth
      let cropHeight = srcHeight

      if (imageEditorFreeformCrop && imageEditorCropRect && scale > 0) {
        cropX = srcX + imageEditorCropRect.x / scale
        cropY = srcY + imageEditorCropRect.y / scale
        cropWidth = Math.min(srcWidth, imageEditorCropRect.width / scale)
        cropHeight = Math.min(srcHeight, imageEditorCropRect.height / scale)
      }

      const baseCanvas = document.createElement("canvas")
      baseCanvas.width = Math.max(1, Math.floor(cropWidth))
      baseCanvas.height = Math.max(1, Math.floor(cropHeight))
      const baseCtx = baseCanvas.getContext("2d")
      if (!baseCtx) {
        throw new Error("Canvas not supported")
      }

      source.draw(
        baseCtx,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        baseCanvas.width,
        baseCanvas.height,
      )

      const swapDimensions = rotation === 90 || rotation === 270
      const outputWidth = swapDimensions ? baseCanvas.height : baseCanvas.width
      const outputHeight = swapDimensions ? baseCanvas.width : baseCanvas.height

      const transformCanvas = document.createElement("canvas")
      transformCanvas.width = outputWidth
      transformCanvas.height = outputHeight
      const ctx = transformCanvas.getContext("2d")
      if (!ctx) {
        throw new Error("Canvas not supported")
      }

      ctx.save()
      ctx.translate(outputWidth / 2, outputHeight / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(imageEditorFlipX ? -1 : 1, imageEditorFlipY ? -1 : 1)
      ctx.drawImage(
        baseCanvas,
        -baseCanvas.width / 2,
        -baseCanvas.height / 2,
        baseCanvas.width,
        baseCanvas.height,
      )
      ctx.restore()

      const blob = await new Promise<Blob>((resolve, reject) => {
        transformCanvas.toBlob((result) => {
          if (!result) {
            reject(new Error("Failed to generate image"))
            return
          }
          resolve(result)
        }, mimeType)
      })

      source.cleanup()
      const editedFile = new File([blob], imageEditorFilename, { type: mimeType })
      setNewMedia((prev) => ({ ...prev, file: editedFile }))
      setImageEditorOpen(false)
    } catch (error: any) {
      toast({
        title: "Failed to apply edits",
        description: error?.message || "Unable to process image.",
        variant: "destructive",
      })
    } finally {
      URL.revokeObjectURL(srcUrl)
    }
  }

  const mapMouseToDrawCoords = (event: MouseEvent<HTMLCanvasElement>) => {
    const canvas = imageEditorCanvasRef.current
    const renderMeta = imageEditorRenderRef.current
    if (!canvas || !renderMeta) return null

    const rect = canvas.getBoundingClientRect()
    const mx = event.clientX - rect.left
    const my = event.clientY - rect.top

    let cx = mx - renderMeta.canvasWidth / 2
    let cy = my - renderMeta.canvasHeight / 2

    const angle = (-renderMeta.rotation * Math.PI) / 180
    const ux = cx * Math.cos(angle) - cy * Math.sin(angle)
    const uy = cx * Math.sin(angle) + cy * Math.cos(angle)

    const fx = renderMeta.flipX ? -1 : 1
    const fy = renderMeta.flipY ? -1 : 1
    const dx = ux * fx
    const dy = uy * fy

    const x = dx + renderMeta.drawWidth / 2
    const y = dy + renderMeta.drawHeight / 2

    if (x < 0 || y < 0 || x > renderMeta.drawWidth || y > renderMeta.drawHeight) {
      return null
    }

    return { x, y, drawWidth: renderMeta.drawWidth, drawHeight: renderMeta.drawHeight }
  }

  const clampRect = (
    rect: { x: number; y: number; width: number; height: number },
    bounds: { width: number; height: number },
  ) => {
    const width = Math.max(1, Math.min(rect.width, bounds.width))
    const height = Math.max(1, Math.min(rect.height, bounds.height))
    const x = Math.min(Math.max(0, rect.x), bounds.width - width)
    const y = Math.min(Math.max(0, rect.y), bounds.height - height)
    return { x, y, width, height }
  }

  const getResizeHandle = (x: number, y: number, rect: { x: number; y: number; width: number; height: number }) => {
    const size = 12
    const handles = [
      { key: "nw", hx: rect.x, hy: rect.y },
      { key: "ne", hx: rect.x + rect.width, hy: rect.y },
      { key: "sw", hx: rect.x, hy: rect.y + rect.height },
      { key: "se", hx: rect.x + rect.width, hy: rect.y + rect.height },
    ] as const

    for (const handle of handles) {
      if (Math.abs(x - handle.hx) <= size && Math.abs(y - handle.hy) <= size) {
        return handle.key
      }
    }
    return null
  }

  const handleCropMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!imageEditorFreeformCrop) return
    const point = mapMouseToDrawCoords(event)
    if (!point) return

    const { x, y, drawWidth, drawHeight } = point
    const current = imageEditorCropRect
    const inRect = current
      ? x >= current.x &&
        y >= current.y &&
        x <= current.x + current.width &&
        y <= current.y + current.height
      : false

    const handle = current ? getResizeHandle(x, y, current) : null

    if (handle && current) {
      cropDragRef.current = {
        mode: "resize",
        handle,
        startX: x,
        startY: y,
        offsetX: 0,
        offsetY: 0,
        initialRect: current,
      }
      event.preventDefault()
      return
    }

    if (inRect && current) {
      cropDragRef.current = {
        mode: "move",
        startX: x,
        startY: y,
        offsetX: x - current.x,
        offsetY: y - current.y,
        initialRect: current,
      }
    } else {
      cropDragRef.current = {
        mode: "new",
        startX: x,
        startY: y,
        offsetX: 0,
        offsetY: 0,
        initialRect: null,
      }
      setImageEditorCropRect({
        x,
        y,
        width: 1,
        height: 1,
      })
    }

    event.preventDefault()
  }

  const handleCropMouseMove = (event: MouseEvent<HTMLCanvasElement>) => {
    if (!imageEditorFreeformCrop) return
    if (!cropDragRef.current.mode) return
    const point = mapMouseToDrawCoords(event)
    if (!point) return

    const { x, y, drawWidth, drawHeight } = point

    if (cropDragRef.current.mode === "move" && imageEditorCropRect) {
      const newX = x - cropDragRef.current.offsetX
      const newY = y - cropDragRef.current.offsetY
      const next = clampRect(
        {
          x: newX,
          y: newY,
          width: imageEditorCropRect.width,
          height: imageEditorCropRect.height,
        },
        { width: drawWidth, height: drawHeight },
      )
      setImageEditorCropRect(next)
      return
    }

    if (cropDragRef.current.mode === "resize" && cropDragRef.current.initialRect && cropDragRef.current.handle) {
      const start = cropDragRef.current.initialRect
      let next = { ...start }

      if (cropDragRef.current.handle === "nw") {
        next = {
          x: Math.min(x, start.x + start.width - 1),
          y: Math.min(y, start.y + start.height - 1),
          width: start.width + (start.x - x),
          height: start.height + (start.y - y),
        }
      } else if (cropDragRef.current.handle === "ne") {
        next = {
          x: start.x,
          y: Math.min(y, start.y + start.height - 1),
          width: Math.max(1, x - start.x),
          height: start.height + (start.y - y),
        }
      } else if (cropDragRef.current.handle === "sw") {
        next = {
          x: Math.min(x, start.x + start.width - 1),
          y: start.y,
          width: start.width + (start.x - x),
          height: Math.max(1, y - start.y),
        }
      } else if (cropDragRef.current.handle === "se") {
        next = {
          x: start.x,
          y: start.y,
          width: Math.max(1, x - start.x),
          height: Math.max(1, y - start.y),
        }
      }

      const clamped = clampRect(next, { width: drawWidth, height: drawHeight })
      setImageEditorCropRect(clamped)
      return
    }

    if (cropDragRef.current.mode === "new") {
      const startX = cropDragRef.current.startX
      const startY = cropDragRef.current.startY
      const rect = {
        x: Math.min(startX, x),
        y: Math.min(startY, y),
        width: Math.abs(x - startX),
        height: Math.abs(y - startY),
      }
      const next = clampRect(rect, { width: drawWidth, height: drawHeight })
      setImageEditorCropRect(next)
    }
  }

  const handleCropMouseUp = () => {
    cropDragRef.current.mode = null
    cropDragRef.current.handle = undefined
  }

  const arrayMove = <T,>(array: T[], from: number, to: number) => {
    const copy = [...array]
    const [item] = copy.splice(from, 1)
    copy.splice(to, 0, item)
    return copy
  }

  const persistAttachmentOrder = async (next: ArtifactAttachment[], previous: ArtifactAttachment[]) => {
    if (!selectedAnimals.length) return
    const primaryId = selectedAnimals[0].id as number

    const oldRankById = new Map(previous.map((a) => [a.id, a.publicityRank || 0]))
    const changed = next
      .map((a, idx) => ({ attachment: a, newRank: idx + 1 }))
      .filter(({ attachment, newRank }) => (oldRankById.get(attachment.id) ?? 0) !== newRank)

    if (changed.length === 0) return

    setIsReordering(true)
    try {
      await Promise.all(
        changed.map(({ attachment, newRank }) => updateArtifactAttachmentRank(attachment.id, newRank)),
      )
      toast({ title: "Order updated" })
      await loadAttachments(primaryId)
    } catch (error: any) {
      console.error("Failed to reorder attachments", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update item order.",
        variant: "destructive",
      })
      await loadAttachments(primaryId)
    } finally {
      setIsReordering(false)
    }
  }

  const handleCardDragStart = (attachmentId: number, event: DragEvent) => {
    if (isReordering) return
    const target = event.target as HTMLElement | null
    if (target?.closest?.("button, a, input, textarea, select, option")) {
      event.preventDefault()
      return
    }
    setDraggingAttachmentId(attachmentId)
    try {
      event.dataTransfer.setData("text/plain", String(attachmentId))
      event.dataTransfer.effectAllowed = "move"
    } catch {
      // ignore
    }
  }

  const handleCardDragOver = (attachmentId: number, event: DragEvent) => {
    if (isReordering) return
    event.preventDefault()
    if (dragOverAttachmentId !== attachmentId) {
      setDragOverAttachmentId(attachmentId)
    }
  }

  const handleCardDrop = (targetAttachmentId: number, event: DragEvent) => {
    if (isReordering) return
    event.preventDefault()
    const draggedId =
      draggingAttachmentId ??
      (() => {
        try {
          return Number(event.dataTransfer.getData("text/plain"))
        } catch {
          return NaN
        }
      })()

    if (!draggedId || Number.isNaN(draggedId) || draggedId === targetAttachmentId) {
      setDraggingAttachmentId(null)
      setDragOverAttachmentId(null)
      return
    }

    const previous = attachments
    const from = previous.findIndex((a) => a.id === draggedId)
    const to = previous.findIndex((a) => a.id === targetAttachmentId)
    if (from < 0 || to < 0) {
      setDraggingAttachmentId(null)
      setDragOverAttachmentId(null)
      return
    }

    const moved = arrayMove(previous, from, to).map((a, idx) => ({ ...a, publicityRank: idx + 1 }))
    setAttachments(moved)
    setDraggingAttachmentId(null)
    setDragOverAttachmentId(null)
    void persistAttachmentOrder(moved, previous)
  }

  const handleCardDragEnd = () => {
    setDraggingAttachmentId(null)
    setDragOverAttachmentId(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4" />
          <span>/</span>
          <button onClick={() => router.push("/animals")} className="hover:text-foreground">
            Manage Animals
          </button>
          <span>/</span>
          <span className="text-foreground">Photos, Videos, & Documents</span>
        </nav>

        <h1 className="text-2xl font-semibold mb-4">Manage Photos, Videos, & Documents</h1>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {selectedAnimals.length > 0 && (
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
              <CardContent className="px-3 py-0">
                <SelectedAnimalsHeader animals={selectedAnimals} />
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="text-sm">Health</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/vaccinations')}>
                  Vaccinations
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/procedures')}>
                  Procedures, Tests, & Treatments
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/reminders')}>
                  Set Reminders
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/meds')}>
                  Meds
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/diet')}>
                  Diet
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/soaps')}>
                  SOAPs
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/health-notes')}>
                  Health Notes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {userRole !== "Veterinarian" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <span className="text-sm">Actions</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {userRole !== "AnimalCaretaker" && (
                    <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/milestones')}>
                      Milestones
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/behaviors')}>
                    Behaviors
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/location')}>
                    New Location
                  </DropdownMenuItem>
                  {userRole !== "AnimalCaretaker" && (
                    <>
                      <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/media')}>
                        Photos, Videos, & Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/gallery')}>
                        Gallery View
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/diary')}>
                    Diary
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button onClick={openAddDialog} size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Add
            </Button>
          </div>
        </motion.div>

        {isReordering && (
          <div className="mt-4 text-sm text-muted-foreground">
            Saving order...
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {isLoading && (
            <Card className="col-span-full bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                Loading attachments...
              </CardContent>
            </Card>
          )}

          {!isLoading && attachments.length === 0 && (
            <Card className="col-span-full bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6 text-center text-muted-foreground">
                No attachments found.
              </CardContent>
            </Card>
          )}

          {attachments.map((attachment) => {
            const type = getAttachmentType(attachment)
            const thumbnailUrl = getAttachmentUrl(attachment, true)

            const isDragging = draggingAttachmentId === attachment.id
            const isDragOver = dragOverAttachmentId === attachment.id

            return (
              <Card
                key={attachment.id}
                draggable={!isReordering}
                onDragStart={(e) => handleCardDragStart(attachment.id, e)}
                onDragOver={(e) => handleCardDragOver(attachment.id, e)}
                onDrop={(e) => handleCardDrop(attachment.id, e)}
                onDragEnd={handleCardDragEnd}
                className={[
                  "overflow-hidden bg-white/80 backdrop-blur-sm",
                  !isReordering ? "cursor-move" : "",
                  isDragging ? "opacity-60" : "",
                  isDragOver ? "ring-2 ring-emerald-400" : "",
                ].join(" ")}
              >
                <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                  {type === "photo" && thumbnailUrl ? (
                    <NextImage
                      src={thumbnailUrl}
                      alt={getAttachmentLabel(attachment)}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      {type === "photo" && <ImageIcon className="h-12 w-12 text-muted-foreground" />}
                      {type === "video" && <Video className="h-12 w-12 text-muted-foreground" />}
                      {type === "document" && <FileText className="h-12 w-12 text-muted-foreground" />}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="font-medium mb-1 line-clamp-2">{getAttachmentLabel(attachment)}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {attachment.attachmentDate
                      ? new Date(attachment.attachmentDate).toLocaleDateString('en-US', { timeZone: 'UTC' })
                      : "No date"}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">{attachment.notes}</p>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handlePreview(attachment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => openEditDialog(attachment)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      onClick={() => handleDownload(attachment)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive bg-transparent"
                      onClick={() => handleDelete(attachment)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) {
              resetForm()
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {isEditMode ? "Edit Photo, Video, or Document" : "Add New Photo, Video, or Document"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {selectedAnimals.length > 0 && (
                <Card className="bg-gray-50 py-0 gap-0">
                  <CardContent className="px-2 py-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedAnimals.map((animal) => (
                        <div key={animal.id} className="flex items-center gap-2 bg-white rounded px-2 py-0">
                          <div className="relative w-6 h-6 rounded overflow-hidden">
                            <NextImage
                              src={animal.imageUrl || "/placeholder.svg"}
                              alt={animal.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-xs leading-tight">
                              {animal.name} | {animal.id}
                            </p>
                            <p className="text-xs text-gray-600 leading-tight">
                              {animal.breed} | {animal.gender}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-3 gap-4">
                <Select value={newMedia.type} onValueChange={(value: any) => setNewMedia({ ...newMedia, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="photo">Photo</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  value={newMedia.date}
                  max={today}
                  onChange={(e) => setNewMedia({ ...newMedia, date: e.target.value })}
                />

                <Input
                  type="number"
                  placeholder="Rank (Optional)"
                  value={newMedia.rank || ""}
                  onChange={(e) => setNewMedia({ ...newMedia, rank: Number.parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <Textarea
                  placeholder={newMedia.type === "document" ? "Short description (Required)" : "Short description (Optional)"}
                  value={newMedia.description}
                  onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Textarea
                  placeholder="Notes (Optional)"
                  value={newMedia.notes}
                  onChange={(e) => setNewMedia({ ...newMedia, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                    <div className="absolute right-2 top-2 z-10 flex items-center gap-2">
                      {modalPreviewType === "photo" && (newMedia.file || selectedAttachment) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="secondary"
                              onClick={openImageEditor}
                              disabled={isSaving}
                              className="gap-2"
                            >
                              <Pencil className="h-4 w-4" />
                              Crop / Resize
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Crop / resize image</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="secondary"
                            size="icon"
                            onClick={() => {
                              const input = fileInputRef.current
                              if (input) {
                                input.value = ""
                                input.click()
                              }
                            }}
                            disabled={isSaving}
                          >
                            <ImagePlus className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Upload new</TooltipContent>
                      </Tooltip>
                    </div>

                    {modalPreviewType && modalPreviewUrl ? (
                      <div className="p-4">
                        {modalPreviewType === "photo" && (
                          <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
                            <NextImage
                              src={modalPreviewUrl}
                              alt="Selected preview"
                              fill
                              className="object-cover object-center"
                              unoptimized
                            />
                          </div>
                        )}
                        {modalPreviewType === "video" && (
                          <video src={modalPreviewUrl} controls className="w-full rounded-lg" />
                        )}
                        {modalPreviewType === "document" && (
                          modalPreviewIsPdf ? (
                            <iframe
                              src={modalPreviewUrl}
                              title="Document preview"
                              className="w-full min-h-[360px] rounded-lg bg-white"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span>Document selected. Preview not available.</span>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                          Click the upload icon to add a file
                        </p>
                        <p className="text-xs text-gray-400">Images, videos, or documents up to 10MB</p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      key={fileInputKey}
                      id={`animal-media-upload-${fileInputKey}`}
                      type="file"
                      className="hidden"
                      accept={fileAccept}
                      onChange={handleFileSelect}
                      disabled={isSaving}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : isEditMode ? "Update" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <CustomConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Are you sure?"
          message="Do you want to delete this attachment? This action cannot be undone."
          onConfirm={confirmDelete}
          confirmText="Delete"
          cancelText="Cancel"
        />

        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>
            <div className="relative w-full min-h-[300px] bg-muted rounded-lg overflow-hidden">
              {previewAttachment && getAttachmentType(previewAttachment) === "photo" && (
                <NextImage
                  src={getAttachmentUrl(previewAttachment)}
                  alt={getAttachmentLabel(previewAttachment)}
                  fill
                  className="object-cover object-center"
                  unoptimized
                />
              )}
              {previewAttachment && getAttachmentType(previewAttachment) === "video" && (
                <video
                  src={getAttachmentUrl(previewAttachment)}
                  controls
                  className="w-full h-full"
                />
              )}
              {previewAttachment && getAttachmentType(previewAttachment) === "document" && (
                <iframe
                  src={getAttachmentUrl(previewAttachment)}
                  title="Document Preview"
                  className="w-full min-h-[70vh]"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Dialog
          open={imageEditorOpen}
          onOpenChange={(open) => {
            setImageEditorOpen(open)
            if (!open) {
              setImageEditorFile(null)
              setImageEditorCropRect(null)
            }
          }}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setImageEditorRotation((prev) => (prev + 270) % 360)}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rotate left</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setImageEditorRotation((prev) => (prev + 90) % 360)}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rotate right</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setImageEditorFlipX((prev) => !prev)}
                    >
                      <FlipHorizontal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Flip horizontal</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setImageEditorFlipY((prev) => !prev)}
                    >
                      <FlipVertical className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Flip vertical</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setImageEditorRotation(0)
                        setImageEditorFlipX(false)
                        setImageEditorFlipY(false)
                        setImageEditorZoom(1)
                        setImageEditorCropSquare(false)
                        setImageEditorFreeformCrop(false)
                      }}
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Reset</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <label className="flex items-center gap-2">
                  <span>Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={imageEditorZoom}
                    onChange={(event) => setImageEditorZoom(Number(event.target.value))}
                  />
                  <span>{imageEditorZoom.toFixed(2)}x</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={imageEditorCropSquare}
                    onChange={(event) => setImageEditorCropSquare(event.target.checked)}
                  />
                  <span>Crop to square</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={imageEditorFreeformCrop}
                    onChange={(event) => {
                      setImageEditorFreeformCrop(event.target.checked)
                      setImageEditorCropRect(null)
                    }}
                  />
                  <span>Freeform crop</span>
                </label>
                {imageEditorFreeformCrop && (
                  <>
                    <span className="text-xs text-muted-foreground">
                      Drag to draw a crop box, drag inside to move. Use corners to resize.
                    </span>
                    {imageEditorCropRect && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setImageEditorCropRect(null)}
                      >
                        Clear crop
                      </Button>
                    )}
                  </>
                )}
              </div>
              <div className="flex items-center justify-center bg-muted rounded-lg p-4">
                <canvas
                  ref={handleImageEditorCanvasRef}
                  className="max-w-full h-auto rounded-md cursor-crosshair"
                  onMouseDown={handleCropMouseDown}
                  onMouseMove={handleCropMouseMove}
                  onMouseUp={handleCropMouseUp}
                  onMouseLeave={handleCropMouseUp}
                />
              </div>
              {imageEditorLoadError && (
                <div className="text-sm text-destructive">
                  {imageEditorLoadError}
                </div>
              )}
              {imageEditorLoadError && imageEditorPreviewUrl && (
                <div className="flex items-center justify-center">
                  <img
                    src={imageEditorPreviewUrl}
                    alt="Image preview"
                    className="max-h-64 rounded-md"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setImageEditorOpen(false)}>
                Cancel
              </Button>
              <Button onClick={applyImageEdits}>
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
