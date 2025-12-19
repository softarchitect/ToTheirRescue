"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FloatingInput } from "@/components/ui/floating-input"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import type { Animal } from "@/lib/types"
import {
  getBehaviorsByAnimalTypeId,
  getAnimalBehaviors,
  upsertAnimalBehaviors,
  type BehaviorItem
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface BehaviorDialogProps {
  animals: Animal[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void | Promise<void>
}

interface BehaviorFormData {
  id?: number
  behaviorId: number
  behaviorName: string
  yesOrNo: boolean
  notes: string
}

export function BehaviorDialog({ animals, open, onOpenChange, onSuccess }: BehaviorDialogProps) {
  const [behaviors, setBehaviors] = useState<BehaviorFormData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isFormChanged, setIsFormChanged] = useState(false)
  const { toast } = useToast()

  // Fetch behaviors when dialog opens
  useEffect(() => {
    if (!open || animals.length === 0) {
      setBehaviors([])
      setIsFormChanged(false)
      return
    }

    const fetchBehaviors = async () => {
      setIsLoading(true)
      try {
        const firstAnimal = animals[0]
        const animalTypeId = firstAnimal.animalTypeId

        if (!animalTypeId) {
          toast({
            title: "Error",
            description: "Animal type not found",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Get master list of behaviors for this animal type
        const behaviorList = await getBehaviorsByAnimalTypeId(animalTypeId)

        if (behaviorList.length === 0) {
          setBehaviors([])
          setIsLoading(false)
          return
        }

        // If multiple animals selected, use template from animal type
        // If single animal, fetch existing behaviors
        if (animals.length === 1) {
          const animalId = Number(animals[0].id)
          const existingBehaviors = await getAnimalBehaviors(animalId)

          // Create a map of existing behaviors by behaviorId
          const existingMap = new Map<number, { yesOrNo: boolean; notes: string }>()
          existingBehaviors.forEach(eb => {
            existingMap.set(eb.behaviorId, {
              yesOrNo: eb.yesOrNo,
              notes: eb.notes || ""
            })
          })

          // Merge behavior list with existing data
          const mergedBehaviors: BehaviorFormData[] = behaviorList.map(behavior => {
            const existing = existingMap.get(Number(behavior.id))
            return {
              id: existing ? Number(behavior.id) : undefined,
              behaviorId: Number(behavior.id),
              behaviorName: behavior.behaviorName || behavior.kind,
              yesOrNo: existing?.yesOrNo || false,
              notes: existing?.notes || "",
            }
          })
          setBehaviors(mergedBehaviors)
        } else {
          // Multiple animals - use template (all behaviors set to false/no notes)
          const templateBehaviors: BehaviorFormData[] = behaviorList.map(behavior => ({
            behaviorId: Number(behavior.id),
            behaviorName: behavior.behaviorName || behavior.kind,
            yesOrNo: false,
            notes: "",
          }))
          setBehaviors(templateBehaviors)
        }
      } catch (error: any) {
        console.error("Failed to fetch behaviors:", error)
        toast({
          title: "Error",
          description: error?.message || "Failed to load behaviors",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBehaviors()
  }, [open, animals, toast])

  const handleBehaviorChange = (behaviorId: number, checked: boolean) => {
    setBehaviors(prev => prev.map(b =>
      b.behaviorId === behaviorId
        ? { ...b, yesOrNo: checked }
        : b
    ))
    setIsFormChanged(true)
  }

  const handleCommentChange = (behaviorId: number, value: string) => {
    setBehaviors(prev => prev.map(b =>
      b.behaviorId === behaviorId
        ? { ...b, notes: value }
        : b
    ))
    setIsFormChanged(true)
  }

  const handleSave = async () => {
    if (animals.length === 0) return

    setIsSaving(true)
    try {
      const animalIds = animals.map(a => Number(a.id))
      const behaviorVms: BehaviorItem[] = behaviors.map(b => ({
        id: b.id,
        behaviorId: b.behaviorId,
        behaviorName: b.behaviorName,
        yesOrNo: b.yesOrNo,
        notes: b.notes || "",
      }))

      await upsertAnimalBehaviors({
        animalIds,
        AnimalBehaviorVms: behaviorVms,
      })

      toast({
        title: "Success",
        description: "Behaviors updated successfully",
        variant: "success",
      })

      setIsFormChanged(false)
      if (onSuccess) {
        await onSuccess()
      }
      onOpenChange(false)
    } catch (error: any) {
      console.error("Failed to save behaviors:", error)
      toast({
        title: "Error",
        description: error?.message || "Failed to save behaviors",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (isFormChanged) {
      if (confirm("Do you want to save your changes?")) {
        handleSave()
      } else {
        onOpenChange(false)
      }
    } else {
      onOpenChange(false)
    }
  }

  const firstAnimal = animals[0]
  const animalTypeName = firstAnimal?.type || "animals"

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">Manage Behaviors, Traits, and Characteristics</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 flex-1 overflow-y-auto pr-1">
          <SelectedAnimalsHeader animals={animals} />

          {isLoading ? (
            <div className="space-y-3">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 bg-muted animate-pulse rounded" />
            </div>
          ) : behaviors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Enter behaviors you would like to track for {animalTypeName} in your customization section
            </div>
          ) : (
            <div className="space-y-3">
              {behaviors.map((behavior) => (
                <div
                  key={behavior.behaviorId}
                  className="rounded-lg border border-border bg-muted/40 px-3 py-2 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate text-sm font-medium">{behavior.behaviorName}</span>
                      <span
                        className={`hidden text-xs px-2 py-0.5 rounded-full border md:inline ${behavior.yesOrNo
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                      >
                        {behavior.yesOrNo ? "Tracking" : "Not tracking"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden text-xs text-muted-foreground sm:inline">
                        Track this behavior
                      </span>
                      <Switch
                        checked={behavior.yesOrNo}
                        onCheckedChange={(checked) => handleBehaviorChange(behavior.behaviorId, checked)}
                      />
                    </div>
                  </div>
                  <div>
                    <FloatingInput
                      label={`Notes about ${behavior.behaviorName}`}
                      value={behavior.notes}
                      onChange={(e) => handleCommentChange(behavior.behaviorId, e.target.value)}
                      className="w-full"
                      disabled={!behavior.yesOrNo}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="mt-4 flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isLoading || behaviors.length === 0}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
