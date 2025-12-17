"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import type { Animal } from "@/lib/types"
import { Plus, HeartPulse, ChevronRight } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"

interface DiaryEntry {
  id: string
  animalId: string
  date: string
  entry: string
}

export default function DiaryPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    entry: "",
  })

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
    }
  }, [])

  const handleSave = () => {
    if (selectedAnimals.length > 0) {
      const entry: DiaryEntry = {
        id: Date.now().toString(),
        animalId: selectedAnimals[0].id,
        date: newEntry.date,
        entry: newEntry.entry,
      }
      setDiaryEntries([...diaryEntries, entry])
      setIsAddDialogOpen(false)
      setNewEntry({ date: new Date().toISOString().split("T")[0], entry: "" })
    }
  }

  const displayAnimals = selectedAnimals.slice(0, 4)
  const remainingCount = selectedAnimals.length - 4

  const filteredEntries = diaryEntries.filter((entry) =>
    selectedAnimals.some((animal) => animal.id === entry.animalId)
  )

  const columns: Column<DiaryEntry>[] = [
    {
      key: "date",
      header: "Date",
      render: (entry) => (
        <span className="text-muted-foreground">
          {new Date(entry.date).toLocaleDateString('en-US', { timeZone: 'UTC' })}
        </span>
      ),
    },
    {
      key: "entry",
      header: "Notes",
      render: (entry) => (
        <span className="text-muted-foreground">{entry.entry}</span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/animals" className="hover:text-foreground transition-colors">
            Animals
          </Link>
          <ChevronRight className="h-4 w-4" />
          {selectedAnimals.length > 0 && (
            <>
              <span className="hover:text-foreground transition-colors">{selectedAnimals[0].name}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground font-semibold">Manage Diary</span>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 justify-end mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <HeartPulse className="h-4 w-4" />
                <span className="text-sm">Health</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/animals/vaccinations')} className="text-sm">Vaccinations</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/procedures')} className="text-sm">
                Procedures, Tests, & Treatments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/reminders')} className="text-sm">Set Reminders</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/meds')} className="text-sm">Meds</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/diet')} className="text-sm">Diet</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/soaps')} className="text-sm">SOAPs</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/health-notes')} className="text-sm">Health Notes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/health-history')} className="text-sm">
                Health History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/health-report')} className="text-sm">
                Animal Health Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {userRole !== "Veterinarian" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <span className="text-sm">Actions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => router.push('/animals/milestones')} className="text-sm">Milestones</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push('/animals/behaviors')} className="text-sm">Behaviors</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/location')} className="text-sm">New Location</DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <>
                    <DropdownMenuItem onClick={() => router.push('/animals/media')} className="text-sm">
                      Photos, Videos, & Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/animals/gallery')} className="text-sm">Gallery View</DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push('/animals/diary')} className="text-sm">Diary</DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => router.push('/animals/report')} className="text-sm">Animal Report</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button onClick={() => setIsAddDialogOpen(true)} size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 " />
            Add
          </Button>
        </div>

        {selectedAnimals.length > 0 && (
          <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
            <CardContent className="p-0">
              <DataTable
                columns={columns}
                data={filteredEntries}
                getRowId={(entry) => entry.id}
                emptyMessage="No diary entries yet"
                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
              />
            </CardContent>
          </Card>
        )}

        {selectedAnimals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please select an animal first</p>
            <Link href="/animals">
              <Button className="mt-4">Select Animals</Button>
            </Link>
          </div>
        )}
      </main>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Diary Entry</DialogTitle>
          </DialogHeader>

          {selectedAnimals.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                    <Image
                      src={selectedAnimals[0].imageUrl || "/placeholder.svg"}
                      alt={selectedAnimals[0].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {selectedAnimals[0].name} | ID NO: {selectedAnimals[0].id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedAnimals[0].breed} | {selectedAnimals[0].gender} | {selectedAnimals[0].age} Yrs 0 Mo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4 mt-4">
            <FloatingInput
              id="date"
              label="Date"
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              required
              max={new Date().toISOString().split("T")[0]}
            />

            <FloatingTextarea
              id="entry"
              label="Diary Entry"
              value={newEntry.entry}
              onChange={(e) => setNewEntry({ ...newEntry, entry: e.target.value })}
              rows={8}
              required
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
