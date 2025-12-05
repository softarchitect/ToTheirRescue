"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { Plus, Edit, Trash2, DollarSign, Info, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { PCODialogShell } from "@/components/pco/pco-dialog-shell"

interface Donation {
  id: string
  date: string
  amount: number
  type: "money" | "other"
  notes: string
}

export default function PCODonationsPage() {
  const router = useRouter()
  const [selectedPCO, setSelectedPCO] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [donationType, setDonationType] = useState<"money" | "other">("money")
  const [donations, setDonations] = useState<Donation[]>([])

  const [newDonation, setNewDonation] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: 0,
    notes: "",
  })

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedPCOs") || "[]")
    if (selected.length > 0) {
      setSelectedPCO(selected[0])
    }
  }, [])

  const handleSave = () => {
    const donation: Donation = {
      id: Date.now().toString(),
      ...newDonation,
      type: donationType,
    }
    setDonations([donation, ...donations])
    setIsDialogOpen(false)
    setNewDonation({
      date: new Date().toISOString().split("T")[0],
      amount: 0,
      notes: "",
    })
  }

  const totalDonations = donations.reduce((sum, d) => sum + (d.type === "money" ? d.amount : 0), 0)

  const handleActionClick = (action: string) => {
    switch (action) {
      case "media":
        router.push("/pcos/media")
        break
      case "history":
        router.push("/pcos/history")
        break
      case "volunteer":
        console.log("[v0] Navigate to volunteer")
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Button variant="link" onClick={() => router.push("/")} className="p-0 h-auto text-muted-foreground">
            Home
          </Button>
          <span>/</span>
          <Button variant="link" onClick={() => router.push("/pcos")} className="p-0 h-auto text-muted-foreground">
            Manage People, Companies, and Organizations
          </Button>
          <span>/</span>
          <span className="text-foreground font-medium">Manage Donations</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-2">
          {selectedPCO && (
            <Card className="bg-white/80 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedPCO.firstName} {selectedPCO.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPCO.street} | {selectedPCO.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPCO.city} {selectedPCO.state} {selectedPCO.zip}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        Total Donations : <Info className="h-4 w-4" />
                      </p>
                      <p className="text-2xl font-bold text-primary">${totalDonations}</p>
                    </div>
                    
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent text-sm">
                Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("media")}>
                  Photos, Videos, and Documents
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("history")}>
                  History
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("volunteer")}>
                  Volunteer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={() => setIsDialogOpen(true)} size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Add
            </Button>
          </div>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg border mt-5">
          <div className="grid grid-cols-5 bg-primary text-primary-foreground font-semibold">
            <div className="p-4 border-r border-primary-foreground/10">Donation Date</div>
            <div className="p-4 border-r border-primary-foreground/10">Amount</div>
            <div className="p-4 border-r border-primary-foreground/10">Type</div>
            <div className="p-4 border-r border-primary-foreground/10">Notes</div>
            <div className="p-4 border-r border-primary-foreground/10">Actions</div>
          </div>

          {donations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 p-16 text-center">
              <DollarSign className="h-16 w-16 text-gray-300" />
              <p className="text-gray-500">No donations recorded yet</p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                Add First Donation
              </Button>
            </div>
          ) : (
            donations.map((donation, index) => (
              <div
                key={donation.id}
                className={`grid grid-cols-5 border-t border-border/40 hover:bg-emerald-50/50 transition-colors ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                }`}
              >
                <div className="p-4">
                  {new Date(donation.date).toLocaleDateString("en-US", { timeZone: "UTC" })}
                </div>
                <div className="p-4 font-medium">
                  {donation.type === "money" ? (
                    <span className="text-primary">${donation.amount}</span>
                  ) : (
                    <span className="text-gray-600">{donation.amount}</span>
                  )}
                </div>
                <div className="p-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      donation.type === "money" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {donation.type}
                  </span>
                </div>
                <div className="p-4 text-gray-600">{donation.notes}</div>
                <div className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <PCODialogShell
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title="Add New Donation"
          pco={selectedPCO}
          onSave={handleSave}
        >
          <div className="grid grid-cols-2 gap-4">
            <FloatingInput
              id="date"
              label="Donation Date"
              type="date"
              value={newDonation.date}
              onChange={(e) => setNewDonation({ ...newDonation, date: e.target.value })}
              required
            />
            <FloatingInput
              id="amount"
              label="Amount"
              type="number"
              value={newDonation.amount || ""}
              onChange={(e) => setNewDonation({ ...newDonation, amount: Number.parseFloat(e.target.value) || 0 })}
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant={donationType === "money" ? "default" : "outline"}
              onClick={() => setDonationType("money")}
              className="flex-1"
            >
              Money
            </Button>
            <Button
              type="button"
              variant={donationType === "other" ? "default" : "outline"}
              onClick={() => setDonationType("other")}
              className="flex-1"
            >
              Other
            </Button>
          </div>

          <FloatingTextarea
            id="notes"
            label="Notes"
            value={newDonation.notes}
            onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })}
            rows={4}
          />
        </PCODialogShell>
      </main>
    </div>
  )
}
