"use client"

import type { Animal } from "@/lib/types"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

export interface BehaviorItem {
  name: string
  enabled: boolean
  comment: string
  note: string
}

interface BehaviorsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedAnimals: Animal[]
  behaviors: BehaviorItem[]
  newBehaviorName: string
  addBehaviorError: string
  onNewBehaviorNameChange: (value: string) => void
  onAddBehavior: () => void
  onUpdateBehavior: (index: number, field: "enabled" | "comment" | "note", value: boolean | string) => void
  onCancel: () => void
  onSave: () => void
}

export function BehaviorsDialog({
  open,
  onOpenChange,
  selectedAnimals,
  behaviors,
  newBehaviorName,
  addBehaviorError,
  onNewBehaviorNameChange,
  onAddBehavior,
  onUpdateBehavior,
  onCancel,
  onSave,
}: BehaviorsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl">Manage Behaviors, Traits, and Characteristics</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 flex-1 overflow-y-auto pr-1">
          <SelectedAnimalsHeader animals={selectedAnimals} />
          {/* Add Custom Behavior - keep consistent with Behaviors page */}
          <div className="flex gap-2 items-center justify-between">
            <div className="w-full">
                <FloatingInput
                label="Add Behavior"
                value={newBehaviorName}
                onChange={(e) => onNewBehaviorNameChange(e.target.value)}
                />
            </div>
            <Button onClick={onAddBehavior}>Add</Button>
          </div>
          {addBehaviorError && <p className="text-sm text-red-500">{addBehaviorError}</p>}
          <div className="space-y-3">
            {behaviors.map((behavior, index) => (
              <div
                key={behavior.name}
                className="rounded-lg border border-border bg-muted/40 px-3 py-2 space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate text-sm font-medium">{behavior.name}</span>
                    <span
                      className={`hidden text-xs px-2 py-0.5 rounded-full border md:inline ${
                        behavior.enabled
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {behavior.enabled ? "Tracking" : "Not tracking"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden text-xs text-muted-foreground sm:inline">
                      Track this behavior
                    </span>
                    <Switch
                      checked={behavior.enabled}
                      onCheckedChange={(checked) => onUpdateBehavior(index, "enabled", checked)}
                    />
                  </div>
                </div>
                <div>
                  <FloatingInput
                    label={`Notes about ${behavior.name}`}
                    value={behavior.comment}
                    onChange={(e) => onUpdateBehavior(index, "comment", e.target.value)}
                    className="w-full"
                    disabled={!behavior.enabled}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter className="mt-4 flex-shrink-0 border-t pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


