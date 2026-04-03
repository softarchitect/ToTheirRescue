"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pill, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchTodaysMeds, type TodaysMedVM } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { formatDateForTenant } from "@/lib/date-format"

export default function TodaysMedsPage() {
  const [meds, setMeds] = useState<TodaysMedVM[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [medCount, setMedCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    loadTodaysMeds()
  }, [])

  const loadTodaysMeds = async () => {
    setIsLoading(true)
    try {
      const data = await fetchTodaysMeds()
      setMeds(data)
      setMedCount(data.length)
    } catch (error) {
      console.error("Failed to load today's meds", error)
      toast({
        title: "Error",
        description: "Failed to load today's medications.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return formatDateForTenant(date, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }

  const columns: Column<TodaysMedVM>[] = [
    {
      key: "animalName",
      header: "Animal",
      accessor: (med) => med.animalName,
    },
    {
      key: "animalType",
      header: "Type",
      accessor: (med) => med.animalType || "N/A",
    },
    {
      key: "medicineName",
      header: "Medicine",
      accessor: (med) => med.medicineName,
    },
    {
      key: "dosage",
      header: "Dosage",
      accessor: (med) => med.dosage || "N/A",
    },
    {
      key: "dueDate",
      header: "Due Time",
      render: (med) => formatTime(med.dueDate),
    },
    {
      key: "clinic",
      header: "Clinic",
      accessor: (med) => med.clinic || "N/A",
    },
    {
      key: "veterinarian",
      header: "Veterinarian",
      accessor: (med) => med.veterinarian || "N/A",
    },
    {
      key: "notes",
      header: "Notes",
      accessor: (med) => med.notes || "N/A",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Meds</h1>
              <p className="text-muted-foreground">
                View medications due today for all animals.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medications Due Today</p>
                <p className="text-2xl font-bold text-blue-600">{medCount}</p>
              </div>
              <Pill className="h-8 w-8 text-blue-600" />
            </div>
          </Card>
        </motion.div>

        {/* Meds Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading medications...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={meds}
              getRowId={(med) => String(med.id)}
              actionsHeader=""
              emptyMessage="No medications due today"
              headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}

