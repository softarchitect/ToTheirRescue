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
  onSave: () => void
  children: ReactNode
}

export function PCODialogShell({
  open,
  onOpenChange,
  title,
  pco,
  onSave,
  children,
}: PCODialogShellProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <SelectedPCOHeader pco={pco} />
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



