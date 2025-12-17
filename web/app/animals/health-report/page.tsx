"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, Printer, ChevronRight, Heart, Flag } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"

export default function AnimalHealthReportPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [userRole, setUserRole] = useState<string | null>(null)

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

  const handleHealthClick = (page: string) => {
    router.push(`/animals/${page}`)
  }

  const handleActionClick = (page: string) => {
    router.push(`/animals/${page}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <button onClick={() => router.push("/")} className="hover:text-foreground">
            Home
          </button>
          <ChevronRight className="h-4 w-4" />
          <button onClick={() => router.push("/animals")} className="hover:text-foreground">
            Animals
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-semibold">Animal Health Report</span>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent text-sm">
                  <Heart className="h-4 w-4" />
                  Health
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleHealthClick("vaccinations")} className="text-sm">
                  Vaccinations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("procedures")} className="text-sm">
                  Procedures, Tests, & Treatments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("reminders")} className="text-sm">
                  Set Reminders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("meds")} className="text-sm">
                  Meds
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("diet")} className="text-sm">
                  Diet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("soaps")} className="text-sm">
                  SOAPs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("health-notes")} className="text-sm">
                  Health Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("health-history")} className="text-sm">
                  Health History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("health-report")} className="text-sm">
                  Animal Health Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {userRole !== "Veterinarian" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent text-sm">
                    <Flag className="h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {userRole !== "AnimalCaretaker" && (
                    <DropdownMenuItem onClick={() => handleActionClick("milestones")} className="text-sm">
                      Milestones
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleActionClick("behaviors")} className="text-sm">
                    Behaviors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("location")} className="text-sm">
                    New Location
                  </DropdownMenuItem>
                  {userRole !== "AnimalCaretaker" && (
                    <>
                      <DropdownMenuItem onClick={() => handleActionClick("media")} className="text-sm">
                        Photos, Videos, & Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleActionClick("gallery")} className="text-sm">
                        Gallery View
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleActionClick("diary")} className="text-sm">
                    Diary
                  </DropdownMenuItem>
                  {userRole !== "AnimalCaretaker" && (
                    <DropdownMenuItem onClick={() => handleActionClick("report")} className="text-sm">
                      Animal Report
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent text-sm">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button size="sm" className="gap-2 text-sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vaccinations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No vaccinations recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Medications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No medications recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Procedures & Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No procedures recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No health notes recorded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No weight history available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Diet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No diet information recorded</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
