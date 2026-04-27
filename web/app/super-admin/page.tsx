"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { motion } from "framer-motion"
import { Shield, PawPrint, Heart, Stethoscope, Syringe, Pill, Users, Globe, MapPinned } from 'lucide-react'
import { SAAnimalType } from "@/components/super-admin/sa-animal-type"
import { SABehaviors } from "@/components/super-admin/sa-behaviors"
import { SAHealthProcedures } from "@/components/super-admin/sa-health-procedures"
import { SAVaccinationTypes } from "@/components/super-admin/sa-vaccination-types"
import { SAMedicines } from "@/components/super-admin/sa-medicines"
import { SAVolunteerActivities } from "@/components/super-admin/sa-volunteer-activities"
import { SACountries } from "@/components/super-admin/sa-countries"
import { SARegions } from "@/components/super-admin/sa-regions"
import {
    fetchOnboardingDemoSetting,
    fetchSAAnimalTypes,
    type SAAnimalTypeDTO,
    updateOnboardingDemoSetting,
} from "@/lib/api"
import { getUserRole } from "@/lib/auth-utils"

export default function SuperAdminPage() {
    const router = useRouter()
    const isMobile = useIsMobile()
    const [activeTab, setActiveTab] = useState("animal-types")
    const [animalIdToType, setAnimalIdToType] = useState<Record<number, string>>({})
    const [animalType, setAnimalType] = useState<number | null>(null)
    const [animalTypeList, setAnimalTypeList] = useState<SAAnimalTypeDTO[]>([])
    const [onboardingDemoEnabled, setOnboardingDemoEnabled] = useState(false)
    const [isOnboardingDemoLoading, setIsOnboardingDemoLoading] = useState(true)
    const [isOnboardingDemoSaving, setIsOnboardingDemoSaving] = useState(false)

    const onChangeAnimalType = (value: number | null) => {
        setAnimalType(value)
    }

    useEffect(() => {
        const role = getUserRole()
        if (role !== "SuperAdministrator") {
            router.push("/auth/login")
        }
    }, [router])

    useEffect(() => {
        const loadOnboardingDemoSetting = async () => {
            try {
                setIsOnboardingDemoLoading(true)
                const enabled = await fetchOnboardingDemoSetting()
                setOnboardingDemoEnabled(enabled)
            } catch (error) {
                console.error("Failed to load onboarding demo setting", error)
            } finally {
                setIsOnboardingDemoLoading(false)
            }
        }

        void loadOnboardingDemoSetting()
    }, [])

    const handleLogout = () => {
        if (typeof window !== "undefined") {
            window.sessionStorage.removeItem("auth")
            window.localStorage.removeItem("auth")
            sessionStorage.clear()
        }
        router.push("/auth/login")
    }

    const handleOnboardingDemoToggle = async (enabled: boolean) => {
        const previous = onboardingDemoEnabled
        setOnboardingDemoEnabled(enabled)
        setIsOnboardingDemoSaving(true)
        try {
            const persisted = await updateOnboardingDemoSetting(enabled)
            setOnboardingDemoEnabled(persisted)
        } catch (error) {
            console.error("Failed to update onboarding demo setting", error)
            setOnboardingDemoEnabled(previous)
        } finally {
            setIsOnboardingDemoSaving(false)
        }
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
        { value: "countries", label: "Countries", icon: Globe },
        { value: "regions", label: "States / Regions", icon: MapPinned },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
            <header className="border-b border-border/40 bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="h-6 w-6 text-emerald-700" />
                        <div className="flex flex-col leading-tight">
                            <span className="text-sm font-semibold text-muted-foreground">To Their Rescue</span>
                            <span className="text-base font-bold text-emerald-700">Super Admin Workspace</span>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        Log out
                    </Button>
                </div>
            </header>

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
                    <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-sm p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="font-semibold text-gray-900">Onboarding Demo</p>
                                <p className="text-sm text-muted-foreground">
                                    When enabled, new customer registrations auto-enter no-input onboarding walkthrough mode.
                                </p>
                            </div>
                            <Button
                                type="button"
                                variant={onboardingDemoEnabled ? "default" : "outline"}
                                disabled={isOnboardingDemoLoading || isOnboardingDemoSaving}
                                onClick={() => handleOnboardingDemoToggle(!onboardingDemoEnabled)}
                                aria-pressed={onboardingDemoEnabled}
                            >
                                Demo
                            </Button>
                        </div>
                    </Card>
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

                                    <TabsContent value="countries" className="mt-0 p-6">
                                        <SACountries />
                                    </TabsContent>

                                    <TabsContent value="regions" className="mt-0 p-6">
                                        <SARegions />
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

