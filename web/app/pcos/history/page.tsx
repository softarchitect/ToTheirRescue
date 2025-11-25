"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface HistoryItem {
  id: string
  date: string
  type: string
  category: string
  details: string
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    date: "May 31 2024",
    type: "Animal Milestone",
    category: "Adoption",
    details: "Animal Name: Henneman Thor Notes:",
  },
  {
    id: "2",
    date: "Dec 08 2024",
    type: "Donation",
    category: "others",
    details: "Notes: Dog Beds Amount: $ 0.60",
  },
]

export default function PCOHistoryPage() {
  const router = useRouter()
  const [selectedPCO, setSelectedPCO] = useState<any>(null)

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedPCOs") || "[]")
    if (selected.length > 0) {
      setSelectedPCO(selected[0])
    }
  }, [])

  const handleActionClick = (action: string) => {
    switch (action) {
      case "media":
        router.push("/pcos/media")
        break
      case "donate":
        router.push("/pcos/donations")
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
          <span className="text-foreground font-medium">History</span>
        </nav>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          {selectedPCO && (
            <Card className="bg-white/80 backdrop-blur-sm mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedPCO.firstName} {selectedPCO.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPCO.street} | +1 {selectedPCO.phone}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPCO.city} {selectedPCO.state} {selectedPCO.zip}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
        <div className="flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="gap-2 bg-transparent text-sm">
                  Actions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("donate")}>
                  Donate
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("history")}>
                  History
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("volunteer")}>
                  Volunteer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        <Card className="bg-white/80 backdrop-blur-sm mt-5">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  {mockHistory.map((item, index) => (
                    <tr
                      key={item.id}
                      className={`border-b border-border/40 hover:bg-emerald-50/50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}
                    >
                      <td className="p-4">
                        <div className="text-sm">
                          <span className="font-medium">{item.date}</span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                            {item.type}
                          </span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
                            {item.category}
                          </span>
                          <span className="mx-2 text-gray-400">|</span>
                          <span className="text-muted-foreground">{item.details}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
