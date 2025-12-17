"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { ArrowLeft, Upload, Eye, Edit, Trash2, Download, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { createAnimalMedia, fetchAnimalMedia } from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"

interface MediaItem {
  id: string
  type: "photo" | "video" | "document"
  url: string
  date: string
  rank: number
  description: string
  notes: string
}

export default function MediaPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)

  const [newMedia, setNewMedia] = useState({
    type: "photo" as "photo" | "video" | "document",
    date: "",
    rank: 0,
    description: "",
    notes: "",
  })

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedAnimals") || "[]")
    setSelectedAnimals(selected)

    if (selected && selected.length > 0) {
      const first = selected[0]
      fetchAnimalMedia(first.id)
        .then((items) => {
          setMediaItems(
            items.map((m) => ({
              id: m.id,
              type: m.type,
              url: m.url,
              date: m.date,
              rank: m.rank,
              description: m.description,
              notes: m.notes,
            })),
          )
        })
        .catch((error) => {
          console.error("Failed to load media", error)
          setMediaItems([])
        })
    }
  }, [])

  const handleSave = async () => {
    if (!newMedia.date || !newMedia.description) return
    if (!selectedAnimals.length) return

    try {
      const primary = selectedAnimals[0]
      const created = await createAnimalMedia({
        animalId: primary.id,
        type: newMedia.type,
        date: newMedia.date,
        description: newMedia.description,
        notes: newMedia.notes,
        rank: newMedia.rank,
      })

      setMediaItems((prev) => [
        ...prev,
        {
          id: created.id,
          type: created.type,
          url: created.url,
          date: created.date,
          rank: created.rank,
          description: created.description,
          notes: created.notes,
        },
      ])
      setIsDialogOpen(false)
      setNewMedia({
        type: "photo",
        date: "",
        rank: 0,
        description: "",
        notes: "",
      })
    } catch (error) {
      console.error("Failed to save media item", error)
      if (typeof window !== "undefined") {
        window.alert("Failed to save media item. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Home className="h-4 w-4" />
          <span>/</span>
          <button onClick={() => router.push("/animals")} className="hover:text-foreground">
            Manage Animals
          </button>
          <span>/</span>
          <span className="text-foreground">Photos, Videos, & Documents</span>
        </nav>

        <h1 className="text-2xl font-semibold mb-4">Manage Photos, Videos, & Documents</h1>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          {selectedAnimals.length > 0 && (
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
              <CardContent className="px-3 py-0">
                <SelectedAnimalsHeader animals={selectedAnimals} />
              </CardContent>
            </Card>
          )}

          <div className="flex items-center gap-2 justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="text-sm">Health</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/vaccinations')}>
                  Vaccinations
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/procedures')}>
                  Procedures, Tests, & Treatments
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/reminders')}>
                  Set Reminders
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/meds')}>
                  Meds
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/diet')}>
                  Diet
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/soaps')}>
                  SOAPs
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/health-notes')}>
                  Health Notes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="text-sm">Actions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/milestones')}>
                    Milestones
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/behaviors')}>
                  Behaviors
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/location')}>
                  New Location
                </DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <>
                    <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/media')}>
                      Photos, Videos, & Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/gallery')}>
                      Gallery View
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem className="text-sm" onClick={() => router.push('/animals/diary')}>
                  Diary
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2">
              <Upload className="h-5 w-5" />
              Add
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
          {mediaItems.map((item) => (
            <Card key={item.id} className="overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className="relative h-48 bg-gray-100">
                <Image src={item.url || "/placeholder.svg"} alt={item.description} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <p className="font-medium mb-1">{item.description}</p>
                <p className="text-sm text-gray-600 mb-2">{new Date(item.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{item.notes}</p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-destructive bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Photo, Video, or Document</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {selectedAnimals.length > 0 && (
                <Card className="bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex flex-wrap gap-2">
                      {selectedAnimals.map((animal) => (
                        <div key={animal.id} className="flex items-center gap-2 bg-white rounded px-2 py-1">
                          <div className="relative w-10 h-10 rounded overflow-hidden">
                            <Image
                              src={animal.imageUrl || "/placeholder.svg"}
                              alt={animal.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-xs">
                              {animal.name} | {animal.id}
                            </p>
                            <p className="text-xs text-gray-600">
                              {animal.breed} | {animal.gender}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

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
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
