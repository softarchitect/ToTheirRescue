"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockAnimals, mockDonations, mockAdoptions, mockReleases } from "@/lib/mock-data"
import { motion } from "framer-motion"
import { FileText, Download } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  const totalAnimals = mockAnimals.length
  const totalDonations = mockDonations.reduce((sum, d) => sum + d.amount, 0)
  const totalAdoptions = mockAdoptions.filter((a) => a.status === "completed").length
  const totalReleases = mockReleases.length

  const animalsByType = mockAnimals.reduce(
    (acc, animal) => {
      acc[animal.type!] = (acc[animal.type!] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const animalsByStatus = mockAnimals.reduce(
    (acc, animal) => {
      acc[animal.status!] = (acc[animal.status!] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground mt-2">Overview of shelter operations</p>
            </div>
            <Button className="gap-2">
              <Download className="h-5 w-5" />
              Export Report
            </Button>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                  <span className="font-medium">Total Animals in Care</span>
                  <span className="text-2xl font-bold text-primary">{totalAnimals}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                  <span className="font-medium">Total Donations</span>
                  <span className="text-2xl font-bold text-primary">${totalDonations.toLocaleString('en-US')}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                  <span className="font-medium">Successful Adoptions</span>
                  <span className="text-2xl font-bold text-primary">{totalAdoptions}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-accent/50">
                  <span className="font-medium">Wildlife Releases</span>
                  <span className="text-2xl font-bold text-primary">{totalReleases}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Animals by Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(animalsByType).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{type}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / totalAnimals) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Animals by Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(animalsByStatus).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize font-medium">{status}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / totalAnimals) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-8 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg border border-border/40">
                  <p className="text-sm text-muted-foreground mb-1">Adoption Rate</p>
                  <p className="text-2xl font-bold text-green-600">85%</p>
                  <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
                </div>
                <div className="p-4 rounded-lg border border-border/40">
                  <p className="text-sm text-muted-foreground mb-1">Average Stay Duration</p>
                  <p className="text-2xl font-bold">45 days</p>
                  <p className="text-xs text-muted-foreground mt-1">-3 days from last month</p>
                </div>
                <div className="p-4 rounded-lg border border-border/40">
                  <p className="text-sm text-muted-foreground mb-1">Donor Retention</p>
                  <p className="text-2xl font-bold text-green-600">92%</p>
                  <p className="text-xs text-muted-foreground mt-1">Excellent retention rate</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
