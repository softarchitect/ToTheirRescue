"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { Upload, Eye, Edit, Trash2, Download, File, Video, ImageIcon, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { PCODialogShell } from "@/components/pco/pco-dialog-shell"

interface MediaItem {
  id: string
  type: "photo" | "video" | "document"
  url: string
  date: string
  rank: number
  description: string
  notes: string
}

export default function PCOMediaPage() {
  const router = useRouter()
  const [selectedPCO, setSelectedPCO] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Redirect AnimalCaretaker and Veterinarian users away from PCO pages
  useEffect(() => {
    const role = getUserRole()
    if (role === "AnimalCaretaker" || role === "Veterinarian") {
      router.push("/animals")
    }
  }, [router])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])

  const [newMedia, setNewMedia] = useState({
    type: "photo" as "photo" | "video" | "document",
    date: new Date().toISOString().split("T")[0],
    rank: 0,
    description: "",
    notes: "",
  })

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedPCOs") || "[]")
    if (selected.length > 0) {
      setSelectedPCO(selected[0])
    }
  }, [])

  const handleSave = () => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      ...newMedia,
      url: "/document-stack.png",
    }
    setMediaItems([...mediaItems, newItem])
    setIsDialogOpen(false)
    setNewMedia({
      type: "photo",
      date: new Date().toISOString().split("T")[0],
      rank: 0,
      description: "",
      notes: "",
    })
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "photo":
        return <ImageIcon className="h-8 w-8" />
      case "video":
        return <Video className="h-8 w-8" />
      case "document":
        return <File className="h-8 w-8" />
      default:
        return <File className="h-8 w-8" />
    }
  }

  const handleActionClick = (action: string) => {
    switch (action) {
      case "donate":
        router.push("/pcos/donations")
        break
      case "history":
        router.push("/pcos/history")
        break
      case "volunteer":
        console.log("[v0] Navigate to volunteer")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="link" onClick={() => router.push("/")} className="p-0 h-auto text-muted-foreground">
            Home
          </Button>
          <span>/</span>
          <Button variant="link" onClick={() => router.push("/pcos")} className="p-0 h-auto text-muted-foreground">
            Manage People, Companies, and Organizations
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium">Manage Photos, Videos, and Documents</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          {selectedPCO && (
            <Card className="bg-white/80 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedPCO.firstName} {selectedPCO.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPCO.street} | {selectedPCO.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPCO.city} {selectedPCO.state} {selectedPCO.zip}
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-end gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 bg-transparent text-sm">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("donate")}>
                  Donate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("history")}>
                  History
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("volunteer")}>
                  Volunteer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Add
            </Button>
          </div>
        </motion.div>

        {mediaItems.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <Upload className="h-12 w-12 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">No media files yet</p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                Upload First File
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mediaItems.map((item) => (
              <Card key={item.id} className="overflow-hidden bg-white/80 backdrop-blur-sm">
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {item.type === "photo" ? (
                    <Image src={item.url || "/placeholder.svg"} alt={item.description} fill className="object-cover" />
                  ) : (
                    <div className="text-gray-400">{getMediaIcon(item.type)}</div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium flex-1">{item.description || "Untitled"}</p>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{item.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{new Date(item.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                  {item.notes && <p className="text-xs text-gray-500 line-clamp-2 mb-4">{item.notes}</p>}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <PCODialogShell
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="Add New Photo, Video, or Document"
          pco={selectedPCO}
          onSave={handleSave}
        >
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

            <div className="relative">
              <Input
                type="date"
                value={newMedia.date}
                onChange={(e) => setNewMedia({ ...newMedia, date: e.target.value })}
              />
              <span className="absolute -top-2 right-2 text-xs bg-white px-1 text-gray-400">optional</span>
            </div>

            <div className="relative">
              <Input
                type="number"
                placeholder="Rank"
                value={newMedia.rank || ""}
                onChange={(e) => setNewMedia({ ...newMedia, rank: Number.parseInt(e.target.value) || 0 })}
              />
              <span className="absolute -top-2 right-2 text-xs bg-white px-1 text-gray-400">optional</span>
            </div>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Short description"
              value={newMedia.description}
              onChange={(e) => setNewMedia({ ...newMedia, description: e.target.value })}
              rows={3}
            />
            <span className="absolute -top-2 right-2 text-xs bg-white px-1 text-gray-400">optional</span>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Notes"
              value={newMedia.notes}
              onChange={(e) => setNewMedia({ ...newMedia, notes: e.target.value })}
              rows={3}
            />
            <span className="absolute -top-2 right-2 text-xs bg-white px-1 text-gray-400">optional</span>
          </div>
        </PCODialogShell>
      </main>
    </div>
  )
}
