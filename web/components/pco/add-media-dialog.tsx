"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from 'lucide-react'

interface AddPCOMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pco: {
    firstName: string
    lastName: string
    street: string
    phone: string
  }
  onSave: (data: any) => void
}

export function AddPCOMediaDialog({ open, onOpenChange, pco, onSave }: AddPCOMediaDialogProps) {
  const [newMedia, setNewMedia] = useState({
    type: "photo" as "photo" | "video" | "document",
    date: "",
    rank: 0,
    description: "",
    notes: "",
  })

  const today = new Date().toISOString().split('T')[0]

  const handleSave = () => {
    onSave(newMedia)
    // Reset form
    setNewMedia({
      type: "photo",
      date: "",
      rank: 0,
      description: "",
      notes: "",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Photo, Video, or Document</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-gray-50">
            <CardContent className="p-4">
              <div>
                <p className="font-semibold">
                  {pco.firstName} {pco.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {pco.street} | {pco.phone}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
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

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Rank"
                value={newMedia.rank || ""}
                onChange={(e) => setNewMedia({ ...newMedia, rank: Number.parseInt(e.target.value) || 0 })}
              />
              <span className="text-xs text-gray-400">optional</span>
            </div>
          </div>

          <div>
            <Textarea
              placeholder="Short description"
              value={newMedia.description}
              onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
              rows={3}
            />
            <span className="text-xs text-gray-400 float-right mt-1">optional</span>
          </div>

          <div>
            <Textarea
              placeholder="Notes"
              value={newMedia.notes}
              onChange={(e) => setNewMedia({ ...newMedia, notes: e.target.value })}
              rows={3}
            />
            <span className="text-xs text-gray-400 float-right mt-1">optional</span>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
