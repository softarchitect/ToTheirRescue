"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchTenantDiaries, deleteTenantDiaryEntry, type TenantDiaryEntry } from "@/lib/api"
import { TenantDiary } from "@/components/customization/tenant-diary"
import { TenantDiaryDialog } from "@/components/customization/tenant-diary-dialog"
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

export default function DiaryPage() {
    const router = useRouter()
    const [diaries, setDiaries] = useState<TenantDiaryEntry[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [diaryDialogOpen, setDiaryDialogOpen] = useState(false)
    const [editingEntry, setEditingEntry] = useState<TenantDiaryEntry | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [entryToDelete, setEntryToDelete] = useState<TenantDiaryEntry | null>(null)
    const { toast } = useToast()

    // Redirect AnimalManager, AnimalCaretaker, and Veterinarian users away from admin pages
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalManager" || role === "AnimalCaretaker" || role === "Veterinarian") {
            router.push("/animals")
        }
    }, [router])

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

    const handleAdd = () => {
        setEditingEntry(null)
        setDiaryDialogOpen(true)
    }

    const handleEdit = (entry: TenantDiaryEntry) => {
        setEditingEntry(entry)
        setDiaryDialogOpen(true)
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Diary</h1>
                            <p className="text-muted-foreground">
                                Manage your organization's diary entries and notes.
                            </p>
                        </div>
                        <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Entry
                        </Button>
                    </div>
                </motion.div>

                {/* Diary Entries */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-pulse text-muted-foreground">Loading diary entries...</div>
                        </div>
                    ) : diaries.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <p className="mb-4">No diary entries found.</p>
                            <Button onClick={handleAdd} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Entry
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {diaries.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="flex items-start justify-between py-4 px-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0 pr-4">
                                        <div className="text-sm font-medium text-gray-900 mb-2">
                                            {formatDate(entry.actionDate)}
                                        </div>
                                        <div className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                                            {entry.notes}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(entry)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(entry)}
                                            className="text-red-600 hover:text-red-700 hover:bg-transparent"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Add/Edit Dialog */}
                <TenantDiaryDialog
                    open={diaryDialogOpen}
                    onOpenChange={(open) => {
                        setDiaryDialogOpen(open)
                        if (!open) {
                            setEditingEntry(null)
                        }
                    }}
                    editEntry={editingEntry}
                    onSuccess={loadDiaries}
                />

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
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </main>
        </div>
    )
}

