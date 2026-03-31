"use client"

import { ReactNode } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SelectedAnimalsHeader } from "../selected-animals-header"
import { SelectedPCOHeader } from "../selected-pco-header"

interface PCODialogShellProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  pco?: any
  animals?: any[]
  headerMode?: "pco" | "animals"
  isEditMode?: boolean
  editSubmitLabel?: "Save" | "Update"
  onSave: () => void
  children: ReactNode
}

export function PCODialogShell({
  open,
  onOpenChange,
  title,
  pco,
  animals = [],
  headerMode = "pco",
  isEditMode = false,
  editSubmitLabel = "Save",
  onSave,
  children,
}: PCODialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[90vh] overflow-hidden grid grid-rows-[auto_minmax(0,1fr)_auto]">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto pr-1 min-h-0">
          {headerMode === "animals" ? (
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-3">
              <CardContent className="px-3 py-0">
                <SelectedAnimalsHeader animals={animals} />
              </CardContent>
            </Card>
          ) : (
            <SelectedPCOHeader pco={pco} />
          )}
          {/* {pco && (
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <p className="font-semibold">
                  {pco.firstName} {pco.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {pco.street} | {pco.phone}
                </p>
                {pco.city && pco.state && pco.zip && (
                  <p className="text-sm text-gray-600">
                    {pco.city} {pco.state} {pco.zip}
                  </p>
                )}
              </CardContent>
            </Card>
          )} */}

          {children}
        </div>

        <DialogFooter className="border-t bg-background pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onSave}>
            {isEditMode ? editSubmitLabel : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



