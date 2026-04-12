"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DietDialog } from "@/components/diet-dialog"
import { getAnimalDiet } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import type { Animal } from "@/lib/types"

interface DietRecord {
  id: string
  animalId: string
  animalName: string
  diet: string
}

export default function DietPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dietRecords, setDietRecords] = useState<DietRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedAnimals") || "[]")
    if (selected.length > 0) {
      setSelectedAnimals(selected)
      if (selected.length > 1) setIsDialogOpen(true)
    }
  }, [])

  const loadDietRecords = async (animals = selectedAnimals) => {
    if (!animals.length) {
      setDietRecords([])
      return
    }

    setIsLoading(true)
    try {
      const records = await Promise.all(
        animals.map(async (animal) => {
          const diet = await getAnimalDiet(animal.id)
          return {
            id: String(animal.id),
            animalId: String(animal.id),
            animalName: animal.name || `Animal ${animal.id}`,
            diet: diet.trim(),
          }
        }),
      )

      setDietRecords(records.filter((record) => record.diet.length > 0))
    } catch (error) {
      console.error("Failed to load diet records", error)
      toast({
        title: "Error",
        description: "Failed to load diets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!selectedAnimals.length) return
    loadDietRecords(selectedAnimals)
  }, [selectedAnimals])

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      loadDietRecords()
    }
  }

  const columns: Column<DietRecord>[] = [
    {
      key: "animalName",
      header: "Animal",
      render: (row) => <span className="font-medium text-primary">{row.animalName}</span>,
    },
    {
      key: "diet",
      header: "Diet",
      render: (row) => <span className="text-muted-foreground">{row.diet}</span>,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.push("/animals")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Animals
        </Button>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        <div className="flex justify-end mb-2">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Add Diet
          </Button>
        </div>

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 py-0">
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={dietRecords}
              getRowId={(row) => row.id}
              emptyMessage={isLoading ? "Loading diets..." : "No diets recorded yet"}
              headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
            />
          </CardContent>
        </Card>

        <DietDialog
          animals={selectedAnimals}
          open={isDialogOpen}
          onOpenChange={handleDialogChange}
          onSaved={() => {
            setIsDialogOpen(false)
            loadDietRecords()
          }}
        />
      </main>
    </div>
  )
}
