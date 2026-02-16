"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { fetchTenantDiaries, deleteTenantDiaryEntry, type TenantDiaryEntry } from "@/lib/api"
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

interface TenantDiaryProps {
    minified?: boolean
    onEdit?: (entry: TenantDiaryEntry) => void
}

export function TenantDiary({ minified = false, onEdit }: TenantDiaryProps) {
    const [diaries, setDiaries] = useState<TenantDiaryEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [entryToDelete, setEntryToDelete] = useState<TenantDiaryEntry | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        loadDiaries()
    }, [])

    const loadDiaries = async () => {
        setIsLoading(true)
        try {
            const data = await fetchTenantDiaries()
            setDiaries(data)
        } catch (error) {
            console.error("Failed to load diary entries", error)
            toast({
                title: "Error",
                description: "Failed to load diary entries.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = (entry: TenantDiaryEntry) => {
        setEntryToDelete(entry)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!entryToDelete) return

        try {
            await deleteTenantDiaryEntry(entryToDelete.id)
            toast({
                title: "Success",
                description: "Diary entry deleted successfully.",
            })
            setDeleteDialogOpen(false)
            setEntryToDelete(null)
            await loadDiaries()
        } catch (error: any) {
            console.error("Failed to delete diary entry", error)
            toast({
                title: "Error",
                description: error.message || "Failed to delete diary entry.",
                variant: "destructive",
            })
        }
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        } catch {
            return dateString
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-pulse text-muted-foreground">Loading diary entries...</div>
            </div>
        )
    }

    if (diaries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <p>No diary entries found.</p>
            </div>
        )
    }

    return (
        <>
            <div className="space-y-0">
                {diaries.map((entry) => (
                    <div
                        key={entry.id}
                        className="flex items-start justify-between py-2 px-4 bg-gray-100 hover:bg-gray-200 transition-colors border-b border-gray-200 last:border-b-0"
                    >
                        <div className="flex w-full justify-between pr-4">
                            <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                {entry.notes}
                            </div>
                            <div className="text-sm font-medium text-gray-900 mb-1">
                                {formatDate(entry.actionDate)}
                            </div>
                        </div>
                        {!minified && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {onEdit && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(entry)}
                                        className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                                    >
                                        Edit
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(entry)}
                                    className="text-red-600 hover:text-red-700 hover:bg-transparent"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want to delete this diary entry? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

