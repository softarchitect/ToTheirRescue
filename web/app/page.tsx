"use client"

import { StatCard } from "@/components/stat-card"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PawPrint, Heart, Users, AlertCircle, CheckCircle } from "lucide-react"
import { mockAnimals, mockAdoptions, mockPCOs, mockReminders } from "@/lib/mock-data"
import { motion } from "framer-motion"
import Image from "next/image"

export default function DashboardPage() {
  const totalAnimals = mockAnimals.length
  const animalsInCare = mockAnimals.filter((a) => a.status !== "adopted").length
  const animalsLeavingCare = mockAdoptions.filter((a) => a.status === "completed").length
  const totalPCOs = mockPCOs.length
  const recentAnimals = mockAnimals.slice(0, 3)
  const recentPCOAdds = mockPCOs.slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
      <Navigation />

      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Here's what's happening with your shelter today</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard
            title="Total Animals"
            value={totalAnimals}
            icon={PawPrint}
            trend="+2 this week"
            trendUp={true}
            delay={0.1}
          />
          <StatCard
            title="Animals in Care"
            value={animalsInCare}
            icon={Heart}
            trend={`${animalsInCare} currently`}
            trendUp={true}
            delay={0.2}
          />
          <StatCard
            title="Animals Leaving Care this Month"
            value={animalsLeavingCare}
            icon={CheckCircle}
            trend="+15% from last month"
            trendUp={true}
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PawPrint className="h-5 w-5 text-primary" />
                  Recent Arrivals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAnimals.map((animal, index) => (
                  <motion.div
                    key={animal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-300 border border-emerald-100"
                  >
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={animal.imageUrl || "/placeholder.svg"}
                        alt={animal.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{animal.name}</h3>
                        <Badge variant={animal.status === "available" ? "default" : "secondary"}>{animal.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {animal.breed} • {animal.age} years old
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Recent PCO Adds
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentPCOAdds.map((pco, index) => (
                  <motion.div
                    key={pco.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 border border-amber-100"
                  >
                    <div>
                      <h3 className="font-semibold">
                        {pco.firstName} {pco.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground">{pco.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{pco.phone}</p>
                      {pco.isVolunteer && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Volunteer
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="border-orange-200 backdrop-blur-sm bg-white/80 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                This Week's Reminders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={reminder.animalImage || "/placeholder.svg"}
                          alt={reminder.animalName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{reminder.animalName}</h3>
                        <p className="text-sm text-muted-foreground">{reminder.vaccination}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">Due: {reminder.dueDate}</p>
                        {reminder.rabies && (
                          <Badge
                            variant="outline"
                            className="border-orange-500 text-orange-700 dark:text-orange-400 mt-1"
                          >
                            Rabies
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
