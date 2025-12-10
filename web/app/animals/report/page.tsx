"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Printer, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import Link from "next/link"

export default function AnimalReportPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      const animals = JSON.parse(stored)
      setSelectedAnimals(animals)
      if (animals.length > 0) {
        setCurrentAnimal(animals[0])
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50">
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
          {currentAnimal && (
            <>
              <span className="hover:text-foreground transition-colors">{currentAnimal.name}</span>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground font-semibold">Animal Report</span>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Animal Report</h1>
            <p className="text-muted-foreground mt-1">Complete animal information</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {currentAnimal && (
          <>
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
              <CardContent className="px-3 py-0">
                <SelectedAnimalsHeader animals={[currentAnimal]} />
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                    <Image
                      src={currentAnimal.imageUrl || "/placeholder.svg"}
                      alt={currentAnimal.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-2">{currentAnimal.name}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">ID Number</p>
                        <p className="font-semibold">{currentAnimal.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Type</p>
                        <p className="font-semibold capitalize">{currentAnimal.type}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Breed</p>
                        <p className="font-semibold">{currentAnimal.breed}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gender</p>
                        <p className="font-semibold capitalize">{currentAnimal.gender}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Age</p>
                        <p className="font-semibold">{currentAnimal.age} years</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold capitalize">{currentAnimal.status}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Arrival Date</p>
                        <p className="font-semibold">{new Date(currentAnimal.arrivalDate).toLocaleDateString('en-US', { timeZone: 'UTC' })}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wildlife</p>
                        <p className="font-semibold">{currentAnimal.isWildlife ? "Yes" : "No"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{currentAnimal.description}</p>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No milestones recorded</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Behaviors</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No behaviors recorded</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Location History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No location history available</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No media files uploaded</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Diary Entries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">No diary entries recorded</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
