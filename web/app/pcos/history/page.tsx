"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SelectedPCOHeader } from "@/components/selected-pco-header"
import { fetchPCOHistory, type PCOHistoryItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

function formatDate(dateString: string | null): string {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    })
  } catch {
    return dateString
  }
}

function startCase(str: string | null | undefined): string {
  if (!str) return ""
  return str
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

export default function PCOHistoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPCO, setSelectedPCO] = useState<any>(null)
  const [historyList, setHistoryList] = useState<PCOHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Redirect AnimalCaretaker and Veterinarian users away from PCO pages
  useEffect(() => {
    const role = getUserRole()
    if (role === "AnimalCaretaker" || role === "Veterinarian") {
      router.push("/animals")
    }
  }, [router])

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedPCOs") || "[]")
    if (selected.length > 0) {
      setSelectedPCO(selected[0])
    }
  }, [])

  useEffect(() => {
    if (selectedPCO?.id) {
      loadHistory()
    }
  }, [selectedPCO?.id])

  const loadHistory = async () => {
    if (!selectedPCO?.id) return

    try {
      setIsLoading(true)
      const data = await fetchPCOHistory(selectedPCO.id)
      setHistoryList(data)
    } catch (error) {
      console.error("Failed to load history", error)
      toast({
        title: "Error",
        description: "Failed to load history",
        variant: "destructive",
        className: "bg-white"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionClick = (action: string) => {
    switch (action) {
      case "media":
      case "attachments":
        router.push("/pcos/attachments")
        break
      case "donate":
        router.push("/pcos/donations")
        break
      case "volunteer":
        console.log("[v0] Navigate to volunteer")
        break
    }
  }

  const renderHistoryItem = (item: PCOHistoryItem, index: number) => {
    if (item.tableName === "Animal Milestone") {
      return (
        <AccordionItem key={`${item.tableName}-${index}`} value={`item-${index}`} className="border-b">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-wrap items-center gap-2 text-sm w-full text-left">
              <span className="font-medium text-[#326394]">{formatDate(item.date)}</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-[#326394]">
                {item.tableName}
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-[#326394]">
                {startCase(item.milestoneAttachmentType)}
              </span>
              {item.animalName && (
                <span>
                  Animal Name: <span className="font-medium text-[#326394]">{startCase(item.animalName)}</span>
                </span>
              )}
              {item.firstName && (
                <span>
                  First Name: <span className="font-medium text-[#326394]">{startCase(item.firstName)}</span>
                </span>
              )}
              {item.lastName && (
                <span>
                  Last Name: <span className="font-medium text-[#326394]">{startCase(item.lastName)}</span>
                </span>
              )}
              {item.amount > 0 && (
                <span>
                  Amount Paid: <span className="font-medium text-[#326394]">{item.amount}</span>
                </span>
              )}
              {item.milestoneAmountReceivedFee > 0 && (
                <span>
                  Amount Received: <span className="font-medium text-[#326394]">{item.milestoneAmountReceivedFee}</span>
                </span>
              )}
              {item.notes && (
                <span>
                  Notes: <span className="font-medium text-[#326394]">{item.notes}</span>
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-muted-foreground">Additional details can be shown here</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      )
    }

    if (item.tableName === "PVD") {
      return (
        <AccordionItem key={`${item.tableName}-${index}`} value={`item-${index}`} className="border-b">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-wrap items-center gap-2 text-sm w-full text-left">
              <span className="font-medium text-[#326394]">{formatDate(item.date)}</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-[#326394]">
                {item.tableName}
              </span>
              <span>
                Attachment Type: <span className="font-medium text-[#326394]">{item.milestoneAttachmentType}</span>
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-gray-50 rounded">
              {item.notes && (
                <p className="text-sm">
                  <span className="font-medium">Notes: </span>
                  <span className="text-muted-foreground">{item.notes}</span>
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )
    }

    if (item.tableName === "Donation") {
      return (
        <AccordionItem key={`${item.tableName}-${index}`} value={`item-${index}`} className="border-b">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-wrap items-center gap-2 text-sm w-full text-left">
              <span className="font-medium text-[#326394]">{formatDate(item.date)}</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-[#326394]">
                {item.tableName}
              </span>
              <span>
                Donation Type: <span className="font-medium text-[#326394]">{item.milestoneAttachmentType}</span>
              </span>
              {item.notes && (
                <span>
                  Notes: <span className="font-medium text-[#326394]">{item.notes}</span>
                </span>
              )}
              {item.amount > 0 && (
                <span>
                  Amount: <span className="font-medium text-[#326394]">${item.amount}</span>
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-gray-50 rounded">
              <p className="text-sm text-muted-foreground">Donation details</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      )
    }

    if (item.tableName === "Volunteer") {
      return (
        <AccordionItem key={`${item.tableName}-${index}`} value={`item-${index}`} className="border-b">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-wrap items-center gap-2 text-sm w-full text-left">
              <span className="font-medium text-[#326394]">{formatDate(item.date)}</span>
              <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-[#326394]">
                {item.tableName}
              </span>
              <span>
                Volunteer Type: <span className="font-medium text-[#326394]">{item.milestoneAttachmentType || "N/A"}</span>
              </span>
              {item.volDateInactive && (
                <span>
                  Inactive Date: <span className="font-medium text-[#326394]">{formatDate(item.volDateInactive)}</span>
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-gray-50 rounded">
              {item.notes && (
                <p className="text-sm">
                  <span className="font-medium">Notes: </span>
                  <span className="text-muted-foreground">{item.notes}</span>
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-4">
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

        <Card className="border-border/40 backdrop-blur-sm bg-white/80 mb-2 py-3">
          <CardContent className="px-3 py-0">
            <SelectedPCOHeader pco={selectedPCO} />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-2 mb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent text-sm">
                Actions
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("attachments")}>
                Photos, Videos, and Documents
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("donate")}>
                Donate
              </DropdownMenuItem>
              <DropdownMenuItem className="text-sm" onClick={() => handleActionClick("volunteer")}>
                Volunteer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-pulse text-muted-foreground">Loading history...</div>
              </div>
            ) : historyList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <p>No history found.</p>
              </div>
            ) : (
              <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
                <Accordion type="single" collapsible className="w-full">
                  {historyList.map((item, index) => renderHistoryItem(item, index))}
                </Accordion>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
