"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import type { Animal } from "@/lib/types"
import { Plus, Calendar, ChevronRight, ChevronDown } from 'lucide-react'
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import { ReminderDialog } from "@/components/reminder-dialog"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"

interface Reminder {
  id: string
  animalId: string
  type: "vaccination" | "procedure" | "meds"
  itemName: string
  reminderDate: string
  orInDays?: number
  orInUnit?: string
  notes?: string
}

export default function RemindersPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"vaccination" | "procedure" | "meds">("vaccination")
  const [selectedItem, setSelectedItem] = useState<string>("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customItem, setCustomItem] = useState("")
  const [newReminder, setNewReminder] = useState({
    type: "vaccination" as "vaccination" | "procedure" | "meds",
    reminderDate: "",
    orInDays: 0,
    orInUnit: "days",
    notes: "",
  })

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  const vaccinationOptions = [
    "Rabies",
    "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
    "Bordetella",
    "Leptospirosis",
    "Lyme Disease",
    "Canine Influenza",
    "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
    "FeLV (Feline Leukemia)",
  ]

  const procedureOptions = [
    "Spay/Neuter",
    "Dental Cleaning",
    "Blood Work",
    "X-Ray",
    "Ultrasound",
    "Surgery",
    "Microchipping",
    "Nail Trim",
  ]

  const medsOptions = [
    "Heartworm Prevention",
    "Flea & Tick Prevention",
    "Dewormer",
    "Antibiotics",
    "Pain Medication",
    "Anti-inflammatory",
  ]

  const getCurrentOptions = () => {
    switch (activeTab) {
      case "vaccination":
        return vaccinationOptions
      case "procedure":
        return procedureOptions
      case "meds":
        return medsOptions
      default:
        return []
    }
  }

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
    }
  }, [])

  useEffect(() => {
    setSelectedItem("")
    setShowCustomInput(false)
    setCustomItem("")
  }, [activeTab])

  const handleSave = () => {
    const itemName = showCustomInput ? customItem : selectedItem
    if (!itemName || !newReminder.reminderDate) return

    if (selectedAnimals.length > 0) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        animalId: selectedAnimals[0].id,
        itemName,
        ...newReminder,
        type: activeTab,
      }
      setReminders([...reminders, reminder])
      setIsAddDialogOpen(false)
      setNewReminder({
        type: "vaccination",
        reminderDate: "",
        orInDays: 0,
        orInUnit: "days",
        notes: "",
      })
      setSelectedItem("")
      setShowCustomInput(false)
      setCustomItem("")
    }
  }

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
          <span className="text-foreground font-semibold">Set Reminders</span>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2 mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <span className="text-sm">Health</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => router.push('/animals/vaccinations')} className="text-sm">
                Vaccinations
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/procedures')} className="text-sm">
                Procedures, Tests, & Treatments
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/reminders')} className="text-sm">
                Set Reminders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/meds')} className="text-sm">
                Meds
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/diet')} className="text-sm">
                Diet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/soaps')} className="text-sm">
                SOAPs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/animals/health-notes')} className="text-sm">
                Health Notes
              </DropdownMenuItem>
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
                <Button variant="outline" className="gap-2 bg-transparent">
                  <span className="text-sm">Actions</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => router.push('/animals/milestones')} className="text-sm">
                    Milestones
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push('/animals/behaviors')} className="text-sm">
                  Behaviors
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/animals/location')} className="text-sm">
                  New Location
                </DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <>
                    <DropdownMenuItem onClick={() => router.push('/animals/media')} className="text-sm">
                      Photos, Videos, & Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/animals/gallery')} className="text-sm">
                      Gallery View
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => router.push('/animals/diary')} className="text-sm">
                  Diary
                </DropdownMenuItem>
                {userRole !== "AnimalCaretaker" && (
                  <DropdownMenuItem onClick={() => router.push('/animals/report')} className="text-sm">
                    Animal Report
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border p-6">
          <div className="grid grid-cols-3 gap-4">
            {reminders
              .filter((reminder) => selectedAnimals.some(animal => animal.id === reminder.animalId))
              .map((reminder) => (
                <Card key={reminder.id} className="border">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{reminder.itemName}</h3>
                    <p className="text-xs text-muted-foreground capitalize">{reminder.type}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {reminder.reminderDate
                        ? new Date(reminder.reminderDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })
                        : `In ${reminder.orInDays} ${reminder.orInUnit}`}
                    </p>
                    {reminder.notes && <p className="text-sm mt-2">{reminder.notes}</p>}
                  </CardContent>
                </Card>
              ))}

            {reminders.filter((reminder) => selectedAnimals.some(animal => animal.id === reminder.animalId)).length === 0 && (
              <div className="col-span-3 text-center py-8 text-muted-foreground">No reminders set yet</div>
            )}
          </div>
        </div>

        {selectedAnimals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Please select an animal first</p>
            <Link href="/animals">
              <Button className="mt-4">Select Animals</Button>
            </Link>
          </div>
        )}
      </main>

      <ReminderDialog animals={selectedAnimals} open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
