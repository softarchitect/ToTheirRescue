"use client"

import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface CustomAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  message: string
}

export function CustomAlertDialog({ open, onOpenChange, title, message }: CustomAlertDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-200"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {title && <h3 className="text-xl font-semibold mb-3 pr-8">{title}</h3>}
            <p className="text-muted-foreground text-base leading-relaxed mb-6">{message}</p>

            {/* Action button */}
            <div className="flex justify-end">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 shadow-lg"
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
