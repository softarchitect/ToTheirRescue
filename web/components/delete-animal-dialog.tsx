"use client"

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Animal } from "@/lib/types"

interface DeleteAnimalDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    animal: Animal | null
    onConfirm: () => void
}

export function DeleteAnimalDialog({
    open,
    onOpenChange,
    animal,
    onConfirm,
}: DeleteAnimalDialogProps) {
    const handleCancel = () => {
        onOpenChange(false)
    }

    const handleConfirm = () => {
        onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-amber-600 dark:text-amber-500">Are you sure?</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 text-lg">
                    {animal && (
                        <p className="text-muted-foreground text-center font-medium">
                            Are you sure you want to delete {animal.name}?
                        </p>
                    )}
                </div>
                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

