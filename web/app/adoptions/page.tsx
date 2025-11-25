"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockAdoptions, mockReleases, mockAnimals } from "@/lib/mock-data"
import type { Adoption, Release } from "@/lib/types"
import { motion } from "framer-motion"
import { Heart, Plus, CheckCircle, Clock, Leaf } from 'lucide-react'
import { AdoptionDialog } from "@/components/adoption-dialog"
import { ReleaseDialog } from "@/components/release-dialog"

export default function AdoptionsPage() {
  const [adoptions, setAdoptions] = useState<Adoption[]>(mockAdoptions)
  const [releases, setReleases] = useState<Release[]>(mockReleases)
  const [isAdoptionDialogOpen, setIsAdoptionDialogOpen] = useState(false)
  const [isReleaseDialogOpen, setIsReleaseDialogOpen] = useState(false)

  const pendingAdoptions = adoptions.filter((a) => a.status === "pending")
  const completedAdoptions = adoptions.filter((a) => a.status === "completed")
  const totalAdoptionFees = adoptions.filter((a) => a.status === "completed").reduce((sum, a) => sum + a.adoptionFee, 0)

  const availableAnimals = mockAnimals.filter((a) => a.status === "available" && !a.isWildlife)
  const wildlifeAnimals = mockAnimals.filter((a) => a.isWildlife)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-5xl font-bold tracking-tight flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                <Heart className="h-10 w-10 text-primary" />
                Adoptions & Releases
              </h1>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completed Adoptions</p>
                      <p className="text-3xl font-bold mt-2">{completedAdoptions.length}</p>
                      <p className="text-sm text-green-600 mt-1 font-medium">This month</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <CheckCircle className="h-6 w-6 text-primary" />
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
                      <p className="text-sm font-medium text-muted-foreground">Pending Applications</p>
                      <p className="text-3xl font-bold mt-2">{pendingAdoptions.length}</p>
                      <p className="text-sm text-orange-600 mt-1 font-medium">Awaiting review</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <Clock className="h-6 w-6 text-primary" />
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
                      <p className="text-sm font-medium text-muted-foreground">Wildlife Releases</p>
                      <p className="text-3xl font-bold mt-2">{releases.length}</p>
                      <p className="text-sm text-green-600 mt-1 font-medium">Successful returns</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                      <Leaf className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        <Tabs defaultValue="adoptions" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="adoptions">Adoptions</TabsTrigger>
            <TabsTrigger value="releases">Wildlife Releases</TabsTrigger>
          </TabsList>

          <TabsContent value="adoptions" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsAdoptionDialogOpen(true)} className="gap-2 shadow-lg">
                <Plus className="h-5 w-5" />
                New Adoption
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                      Pending Applications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {pendingAdoptions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No pending applications</p>
                    ) : (
                      pendingAdoptions.map((adoption, index) => (
                        <motion.div
                          key={adoption.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{adoption.animalName}</h3>
                              <p className="text-sm text-muted-foreground">{adoption.adopterName}</p>
                            </div>
                            <Badge variant="outline" className="border-orange-500 text-orange-700 dark:text-orange-400">
                              {adoption.status}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="text-muted-foreground">{adoption.adopterEmail}</p>
                            <p className="text-muted-foreground">{adoption.adopterPhone}</p>
                            <p className="font-medium mt-2">
                              Adoption Fee: ${adoption.adoptionFee} • Date: {adoption.adoptionDate}
                            </p>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => {
                                setAdoptions(
                                  adoptions.map((a) =>
                                    a.id === adoption.id ? { ...a, status: "completed" as const } : a,
                                  ),
                                )
                              }}
                            >
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Contact
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Completed Adoptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {completedAdoptions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">No completed adoptions yet</p>
                    ) : (
                      completedAdoptions.map((adoption, index) => (
                        <motion.div
                          key={adoption.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05 }}
                          className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{adoption.animalName}</h3>
                              <p className="text-sm text-muted-foreground">{adoption.adopterName}</p>
                            </div>
                            <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                              {adoption.status}
                            </Badge>
                          </div>
                          <div className="text-sm space-y-1">
                            <p className="text-muted-foreground">{adoption.adopterEmail}</p>
                            <p className="font-medium mt-2">
                              Fee: ${adoption.adoptionFee} • Adopted: {adoption.adoptionDate}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
              <CardHeader>
                <CardTitle>Available for Adoption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {availableAnimals.map((animal) => (
                    <div
                      key={animal.id}
                      className="p-4 rounded-lg border border-border/40 bg-card hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold text-lg">{animal.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {animal.breed} • {animal.age} years
                      </p>
                      <p className="text-sm mt-2 line-clamp-2">{animal.description}</p>
                      <Button size="sm" className="mt-3 w-full" onClick={() => setIsAdoptionDialogOpen(true)}>
                        Start Adoption
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="releases" className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={() => setIsReleaseDialogOpen(true)} className="gap-2 shadow-lg">
                <Plus className="h-5 w-5" />
                Schedule Release
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-green-500" />
                    Scheduled Releases
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {releases.map((release, index) => (
                    <motion.div
                      key={release.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                      className="p-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{release.animalName}</h3>
                          <p className="text-sm text-muted-foreground">{release.location}</p>
                        </div>
                        <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                          Scheduled
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{release.notes}</p>
                      <p className="text-sm font-medium">Release Date: {release.releaseDate}</p>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                <CardHeader>
                  <CardTitle>Wildlife in Care</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {wildlifeAnimals.map((animal) => (
                      <div
                        key={animal.id}
                        className="p-4 rounded-lg border border-border/40 bg-card hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{animal.name}</h3>
                            <p className="text-sm text-muted-foreground">{animal.breed}</p>
                            <p className="text-sm mt-2">{animal.description}</p>
                            {animal.medicalNotes && (
                              <p className="text-sm text-orange-600 mt-1">Medical: {animal.medicalNotes}</p>
                            )}
                          </div>
                          <Badge className="bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400">
                            {animal.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <AdoptionDialog
        animals={availableAnimals}
        open={isAdoptionDialogOpen}
        onOpenChange={setIsAdoptionDialogOpen}
        onSave={(adoption) => {
          setAdoptions([adoption, ...adoptions])
          setIsAdoptionDialogOpen(false)
        }}
      />

      <ReleaseDialog
        animals={wildlifeAnimals}
        open={isReleaseDialogOpen}
        onOpenChange={setIsReleaseDialogOpen}
        onSave={(release) => {
          setReleases([release, ...releases])
          setIsReleaseDialogOpen(false)
        }}
      />
    </div>
  )
}
