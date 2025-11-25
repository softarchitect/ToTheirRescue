"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { Switch } from "@/components/ui/switch"
import { motion } from "framer-motion"
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from "next/image"
import Link from "next/link"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"

interface BehaviorTrait {
  name: string
  enabled: boolean
  comment: string
}

export default function BehaviorsPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(true)
  const [behaviors, setBehaviors] = useState<BehaviorTrait[]>([
    { name: "Aggressive", enabled: false, comment: "" },
    { name: "Introvert", enabled: false, comment: "" },
    { name: "Shy", enabled: false, comment: "" },
    { name: "Friendly", enabled: false, comment: "" },
    { name: "Playful", enabled: false, comment: "" },
    { name: "Calm", enabled: false, comment: "" },
  ])
  const [newBehaviorName, setNewBehaviorName] = useState("")
  const [addError, setAddError] = useState<string>("")

  useEffect(() => {
    const selected = JSON.parse(sessionStorage.getItem("selectedAnimals") || "[]")
    setSelectedAnimals(selected)
  }, [])

  const handleSave = () => {
    // Save behaviors logic here
    setIsDialogOpen(false)
    router.push("/animals")
  }

  const updateBehavior = (index: number, field: "enabled" | "comment", value: boolean | string) => {
    const updated = [...behaviors]
    updated[index] = { ...updated[index], [field]: value }
    setBehaviors(updated)
  }

  const addBehavior = () => {
    const name = newBehaviorName.trim()
    if (!name) {
      setAddError("Enter a behavior name")
      return
    }
    const exists = behaviors.some(b => b.name.toLowerCase() === name.toLowerCase())
    if (exists) {
      setAddError("That behavior already exists")
      return
    }
    setBehaviors([{ name, enabled: false, comment: "" }, ...behaviors])
    setNewBehaviorName("")
    setAddError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
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
          <span className="text-foreground font-semibold">Manage Behaviors</span>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Manage Behaviors, Traits, and Characteristics</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <SelectedAnimalsHeader animals={selectedAnimals} />

              {/* Add Custom Behavior */}
              <div className="flex gap-2 items-start">
                <FloatingInput
                  label="Add Behavior"
                  value={newBehaviorName}
                  onChange={(e) => setNewBehaviorName(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={addBehavior}>Add</Button>
              </div>
              {addError && <p className="text-sm text-red-500">{addError}</p>}

              {/* Behavior Toggles */}
              <div className="space-y-4">
                {behaviors.map((behavior, index) => (
                  <div key={behavior.name} className="flex items-start gap-4">
                    <div className="flex items-center gap-3 w-40">
                      <span className="text-sm font-medium">{behavior.name}</span>
                      <Switch
                        checked={behavior.enabled}
                        onCheckedChange={(checked) => updateBehavior(index, "enabled", checked)}
                      />
                    </div>
                    <FloatingInput
                      label={`Comment for ${behavior.name}`}
                      value={behavior.comment}
                      onChange={(e) => updateBehavior(index, "comment", e.target.value)}
                      className="flex-1"
                      disabled={!behavior.enabled}
                    />
                    <span className="text-xs text-gray-400 self-center">optional</span>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => router.push("/animals")}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
