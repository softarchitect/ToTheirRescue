"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, PawPrint } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchCurrentFosters, type CurrentFosterVM } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"

export default function CurrentFostersPage() {
  const [fosters, setFosters] = useState<CurrentFosterVM[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [fosterCount, setFosterCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    loadFosters()
  }, [])

  const loadFosters = async () => {
    setIsLoading(true)
    try {
      const data = await fetchCurrentFosters()
      setFosters(data)
      setFosterCount(data.length)
    } catch (error) {
      console.error("Failed to load current fosters", error)
      toast({
        title: "Error",
        description: "Failed to load current fosters.",
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
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const columns: Column<CurrentFosterVM>[] = [
    {
      key: "name",
      header: "Name",
      accessor: (foster) => foster.name,
    },
    {
      key: "animalType",
      header: "Animal Type",
      accessor: (foster) => foster.animalType || "N/A",
    },
    {
      key: "breed",
      header: "Breed",
      accessor: (foster) => foster.breed || "N/A",
    },
    {
      key: "fosterersName",
      header: "Fosterer's Name",
      accessor: (foster) => foster.fosterersName,
    },
    {
      key: "fosterBeginDate",
      header: "Foster Begin Date",
      render: (foster) => formatDate(foster.fosterBeginDate),
    },
    {
      key: "email",
      header: "Email",
      accessor: (foster) => foster.email || "N/A",
    },
    {
      key: "phone",
      header: "Phone",
      accessor: (foster) => foster.phone || "N/A",
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Current Fosters</h1>
              <p className="text-muted-foreground">
                View animals currently in foster care and their fosterer information.
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
                <p className="text-sm text-muted-foreground">Animals in Foster Care</p>
                <p className="text-2xl font-bold text-emerald-600">{fosterCount}</p>
              </div>
              <Home className="h-8 w-8 text-emerald-600" />
            </div>
          </Card>
        </motion.div>

        {/* Fosters Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-pulse text-muted-foreground">Loading fosters...</div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={fosters}
              getRowId={(foster) => String(foster.id)}
              actionsHeader=""
              emptyMessage="No animals currently in foster care"
              headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
            />
          )}
        </motion.div>
      </main>
    </div>
  )
}

