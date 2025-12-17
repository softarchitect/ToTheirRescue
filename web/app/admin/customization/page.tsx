"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import { Settings, Building2, PawPrint, ArrowRightLeft, Heart, Stethoscope, Syringe, Pill, Users } from 'lucide-react'
import { OrganizationInfo } from "@/components/customization/organization-info"
import { AnimalType } from "@/components/customization/animal-type"
import { AnimalAcquisitionWay } from "@/components/customization/animal-acquisition-way"
import { AnimalBehaviors } from "@/components/customization/animal-behaviors"
import { HealthProcedures } from "@/components/customization/health-procedures"
import { AnimalVaccinationType } from "@/components/customization/animal-vaccination-type"
import { AnimalMedicine } from "@/components/customization/animal-medicine"
import { VolunteerActivities } from "@/components/customization/volunteer-activities"
import { fetchAnimalTypes, type AnimalTypeDTO } from "@/lib/api"

export default function CustomizationPage() {
    const router = useRouter()
    const isMobile = useIsMobile()
    const [activeTab, setActiveTab] = useState("organization-info")
    const [animalIdToType, setAnimalIdToType] = useState<Record<number, string>>({})
    const [animalType, setAnimalType] = useState<number | null>(null)
    const [animalTypeList, setAnimalTypeList] = useState<AnimalTypeDTO[]>([])

    const onChangeAnimalType = (value: number | null) => {
        setAnimalType(value)
    }

    // Redirect AnimalManager, AnimalCaretaker, and Veterinarian users away from admin pages
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalManager" || role === "AnimalCaretaker" || role === "Veterinarian") {
            router.push("/animals")
        }
    }, [router])

    // Load animal types when needed (for tabs that require it)
    useEffect(() => {
        const tabsRequiringAnimalTypes = ["behaviors", "health-procedures", "vaccination-types"]
        if (tabsRequiringAnimalTypes.includes(activeTab)) {
            const loadAnimalTypes = async () => {
                try {
                    const types = await fetchAnimalTypes()
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
                    console.error("Failed to load animal types", error)
                }
            }
            loadAnimalTypes()
        }
    }, [activeTab, animalType])

    const tabConfig = [
        { value: "organization-info", label: "Organization Info", icon: Building2 },
        { value: "animal-types", label: "Animal Types", icon: PawPrint },
        { value: "animal-acquisition-ways", label: "Acquisition Ways", icon: ArrowRightLeft },
        { value: "behaviors", label: "Animal Behaviors", icon: Heart },
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
                            <Settings className="h-10 w-10 text-primary" />
                            Customization
                        </h1>
                        <p className="text-muted-foreground mt-2">
                            Manage organization settings and animal-related configurations
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
                                    <TabsContent value="organization-info" className="mt-0 p-6">
                                        <OrganizationInfo />
                                    </TabsContent>

                                    <TabsContent value="animal-types" className="mt-0 p-6">
                                        <AnimalType />
                                    </TabsContent>

                                    <TabsContent value="animal-acquisition-ways" className="mt-0 p-6">
                                        <AnimalAcquisitionWay />
                                    </TabsContent>

                                    <TabsContent value="behaviors" className="mt-0 p-6">
                                        <AnimalBehaviors
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="health-procedures" className="mt-0 p-6">
                                        <HealthProcedures
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="vaccination-types" className="mt-0 p-6">
                                        <AnimalVaccinationType
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="medicines" className="mt-0 p-6">
                                        <AnimalMedicine />
                                    </TabsContent>

                                    <TabsContent value="volunteer-activities" className="mt-0 p-6">
                                        <VolunteerActivities />
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
