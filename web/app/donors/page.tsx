"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { mockDonors, mockDonations } from "@/lib/mock-data"
import type { Donor, Donation } from "@/lib/types"
import { motion } from "framer-motion"
import { Search, Plus, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { DonorDialog } from "@/components/donor-dialog"
import { DonationDialog } from "@/components/donation-dialog"
import { Badge } from "@/components/ui/badge"

export default function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>(mockDonors)
  const [donations, setDonations] = useState<Donation[]>(mockDonations)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null)
  const [isDonorDialogOpen, setIsDonorDialogOpen] = useState(false)
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false)

  const filteredDonors = donors.filter(
    (donor) =>
      donor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0)
  const monthlyDonations = donations.filter((d) => d.type === "monthly").length
  const recentDonations = donations.slice(0, 5)

  const handleAddDonor = () => {
    setSelectedDonor(null)
    setIsDonorDialogOpen(true)
  }

  const handleEditDonor = (donor: Donor) => {
    setSelectedDonor(donor)
    setIsDonorDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold tracking-tight flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                <Users className="h-10 w-10 text-primary" />
                Donor Management
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsDonationDialogOpen(true)}
                size="lg"
                variant="outline"
                className="gap-2 shadow-lg"
              >
                <DollarSign className="h-5 w-5" />
                Record Donation
              </Button>
              <Button onClick={handleAddDonor} size="lg" className="gap-2 shadow-lg">
                <Plus className="h-5 w-5" />
                Add Donor
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Donations</p>
                      <p className="text-3xl font-bold mt-2">${totalDonations.toLocaleString('en-US')}</p>
                      <p className="text-sm text-green-600 mt-1 font-medium">+12% this month</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Donors</p>
                      <p className="text-3xl font-bold mt-2">{donors.length}</p>
                      <p className="text-sm text-green-600 mt-1 font-medium">+3 new this month</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Monthly Donors</p>
                      <p className="text-3xl font-bold mt-2">{monthlyDonations}</p>
                      <p className="text-sm text-green-600 mt-1 font-medium">Recurring support</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <TrendingUp className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="relative mb-6">
            <FloatingInput
              label="Search donors by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
              <CardHeader>
                <CardTitle>Donors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredDonors.map((donor, index) => (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 cursor-pointer border border-emerald-100"
                    onClick={() => handleEditDonor(donor)}
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{donor.name}</h3>
                      <p className="text-sm text-muted-foreground">{donor.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">{donor.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">${donor.totalDonated.toLocaleString('en-US')}</p>
                      <p className="text-xs text-muted-foreground">{donor.donationCount} donations</p>
                      <p className="text-xs text-muted-foreground">Last: {donor.lastDonation}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Donations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentDonations.map((donation, index) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{donation.donorName}</h3>
                        <Badge variant={donation.type === "monthly" ? "default" : "secondary"}>{donation.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{donation.purpose || "General support"}</p>
                      <p className="text-xs text-muted-foreground mt-1">{donation.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-primary">${donation.amount}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <DonorDialog
        donor={selectedDonor}
        open={isDonorDialogOpen}
        onOpenChange={setIsDonorDialogOpen}
        onSave={(donor) => {
          if (selectedDonor) {
            setDonors(donors.map((d) => (d.id === donor.id ? donor : d)))
          } else {
            setDonors([...donors, { ...donor, id: Date.now().toString() }])
          }
          setIsDonorDialogOpen(false)
        }}
      />

      <DonationDialog
        donors={donors}
        open={isDonationDialogOpen}
        onOpenChange={setIsDonationDialogOpen}
        onSave={(donation) => {
          setDonations([donation, ...donations])
          const donor = donors.find((d) => d.id === donation.donorId)
          if (donor) {
            setDonors(
              donors.map((d) =>
                d.id === donation.donorId
                  ? {
                      ...d,
                      totalDonated: d.totalDonated + donation.amount,
                      donationCount: d.donationCount + 1,
                      lastDonation: donation.date,
                    }
                  : d,
              ),
            )
          }
          setIsDonationDialogOpen(false)
        }}
      />
    </div>
  )
}
