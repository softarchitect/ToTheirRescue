"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import { Shield, PawPrint, Heart, Stethoscope, Syringe, Pill, Users } from 'lucide-react'
import { SAAnimalType } from "@/components/super-admin/sa-animal-type"
import { SABehaviors } from "@/components/super-admin/sa-behaviors"
import { SAHealthProcedures } from "@/components/super-admin/sa-health-procedures"
import { SAVaccinationTypes } from "@/components/super-admin/sa-vaccination-types"
import { SAMedicines } from "@/components/super-admin/sa-medicines"
import { SAVolunteerActivities } from "@/components/super-admin/sa-volunteer-activities"
import { fetchSAAnimalTypes, type SAAnimalTypeDTO } from "@/lib/api"

export default function SuperAdminPage() {
    const isMobile = useIsMobile()
    const [activeTab, setActiveTab] = useState("animal-types")
    const [animalIdToType, setAnimalIdToType] = useState<Record<number, string>>({})
    const [animalType, setAnimalType] = useState<number | null>(null)
    const [animalTypeList, setAnimalTypeList] = useState<SAAnimalTypeDTO[]>([])

    const onChangeAnimalType = (value: number | null) => {
        setAnimalType(value)
    }

    // Load animal types when needed (for tabs that require it)
    useEffect(() => {
        const tabsRequiringAnimalTypes = ["behaviors", "health-procedures", "vaccination-types"]
        if (tabsRequiringAnimalTypes.includes(activeTab)) {
            const loadAnimalTypes = async () => {
                try {
                    const types = await fetchSAAnimalTypes()
                    setAnimalTypeList(types)
                    const idToTypeMap: Record<number, string> = {}
                    types.forEach((type) => {
                        idToTypeMap[type.id] = type.typeName
                    })
                    setAnimalIdToType(idToTypeMap)
                    if (types.length > 0 && !animalType) {
                        setAnimalType(types[0].id)
                    }
                } catch (error) {
                    console.error("Failed to load SA animal types", error)
                }
            }
            loadAnimalTypes()
        }
    }, [activeTab, animalType])

    const tabConfig = [
        { value: "animal-types", label: "Animal Types", icon: PawPrint },
        { value: "behaviors", label: "Behaviors", icon: Heart },
        { value: "health-procedures", label: "Health Procedures", icon: Stethoscope },
        { value: "vaccination-types", label: "Vaccination Types", icon: Syringe },
        { value: "medicines", label: "Medicines", icon: Pill },
        { value: "volunteer-activities", label: "Volunteer Activities", icon: Users },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold tracking-tight leading-tight flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            <Shield className="h-10 w-10 text-primary" />
                            Super Admin
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage global master data templates for all tenants
                        </p>
                    </div>
                </motion.div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <div className={isMobile ? "w-full" : "flex gap-6"}>
                        <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg p-4 shrink-0">
                            <TabsList
                                className={isMobile ? "w-full grid grid-cols-2 mb-4 rounded-none" : "flex-col h-fit w-64 bg-transparent items-start justify-start gap-4 mt-5 rounded-none"}
                            >
                                {tabConfig.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <TabsTrigger
                                            key={tab.value}
                                            value={tab.value}
                                            className="justify-start gap-2 text-md w-full rounded-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-l-4 data-[state=active]:border-l-emerald-600 data-[state=active]:pl-3"
                                        >
                                            <Icon className="h-5 w-5" />
                                            {tab.label}
                                        </TabsTrigger>
                                    )
                                })}
                            </TabsList>
                        </Card>

                        <div className={isMobile ? "w-full mt-4" : "flex-1 min-w-0"}>
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg">
                                    <TabsContent value="animal-types" className="mt-0 p-6">
                                        <SAAnimalType />
                                    </TabsContent>

                                    <TabsContent value="behaviors" className="mt-0 p-6">
                                        <SABehaviors
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="health-procedures" className="mt-0 p-6">
                                        <SAHealthProcedures
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="vaccination-types" className="mt-0 p-6">
                                        <SAVaccinationTypes
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="medicines" className="mt-0 p-6">
                                        <SAMedicines />
                                    </TabsContent>

                                    <TabsContent value="volunteer-activities" className="mt-0 p-6">
                                        <SAVolunteerActivities />
                                    </TabsContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </Tabs>
            </main>
        </div>
    )
}

