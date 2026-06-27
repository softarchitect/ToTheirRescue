"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { motion } from "framer-motion"
import {
    Settings,
    Building2,
    PawPrint,
    ArrowRightLeft,
    Heart,
    Stethoscope,
    Syringe,
    Pill,
    Users,
    PanelLeft,
    type LucideIcon,
} from 'lucide-react'
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
    const [activeTab, setActiveTab] = useState("organization-info")
    const [animalIdToType, setAnimalIdToType] = useState<Record<number, string>>({})
    const [animalType, setAnimalType] = useState<number | null>(null)
    const [animalTypeList, setAnimalTypeList] = useState<AnimalTypeDTO[]>([])
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

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

    const tabConfig: Array<{ value: string; label: string; icon: LucideIcon }> = [
        { value: "organization-info", label: "Organization Info", icon: Building2 },
        { value: "animal-types", label: "Animal Types", icon: PawPrint },
        { value: "animal-acquisition-ways", label: "Acquisition Ways", icon: ArrowRightLeft },
        { value: "behaviors", label: "Animal Behaviors", icon: Heart },
        { value: "health-procedures", label: "Health Procedures", icon: Stethoscope },
        { value: "vaccination-types", label: "Vaccination Types", icon: Syringe },
        { value: "medicines", label: "Medicines", icon: Pill },
        { value: "volunteer-activities", label: "Volunteer Activities", icon: Users },
    ]

    const activeTabConfig = tabConfig.find((tab) => tab.value === activeTab) ?? tabConfig[0]
    const ActiveTabIcon = activeTabConfig.icon
    const tabTriggerClassName =
        "justify-start gap-2 text-sm md:text-base w-full min-w-0 rounded-none data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-l-4 data-[state=active]:border-l-emerald-600 data-[state=active]:pl-3"

    const renderTabTriggers = (onSelect?: () => void) =>
        tabConfig.map((tab) => {
            const Icon = tab.icon
            return (
                <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    onClick={onSelect}
                    className={tabTriggerClassName}
                >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                </TabsTrigger>
            )
        })

    return (
        <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
            <Navigation />

            <main className="container mx-auto max-w-full px-4 sm:px-6 py-6 sm:py-8">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                            <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-primary shrink-0" />
                            Customization
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
                            Manage organization settings and animal-related configurations
                        </p>
                    </div>
                </motion.div>

                <Tabs
                    value={activeTab}
                    onValueChange={(value) => {
                        setActiveTab(value)
                        setMobileSidebarOpen(false)
                    }}
                    className="w-full min-w-0"
                >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 min-w-0">
                        <Card className="hidden md:block border-border/40 backdrop-blur-sm bg-white/80 shadow-lg p-4 shrink-0 overflow-hidden">
                            <TabsList className="flex flex-col h-fit w-64 bg-transparent items-start justify-start gap-4 mt-5 rounded-none">
                                {renderTabTriggers()}
                            </TabsList>
                        </Card>

                        <div className="flex-1 min-w-0">
                            <div className="md:hidden mb-4">
                                <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between gap-3 h-11 bg-white/80 backdrop-blur-sm border-border/40 shadow-sm"
                                        >
                                            <span className="flex items-center gap-2 min-w-0">
                                                <ActiveTabIcon className="h-5 w-5 shrink-0 text-emerald-600" />
                                                <span className="truncate font-medium">{activeTabConfig.label}</span>
                                            </span>
                                            <PanelLeft className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[min(100vw-2rem,18rem)] p-0 gap-0">
                                        <SheetHeader className="border-b px-4 py-4 text-left">
                                            <SheetTitle>Sections</SheetTitle>
                                        </SheetHeader>
                                        <TabsList className="flex flex-col h-fit w-full bg-transparent items-stretch justify-start gap-2 p-4 rounded-none">
                                            {renderTabTriggers(() => setMobileSidebarOpen(false))}
                                        </TabsList>
                                    </SheetContent>
                                </Sheet>
                            </div>

                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card className="border-border/40 backdrop-blur-sm bg-white/80 shadow-lg overflow-hidden min-w-0">
                                    <TabsContent value="organization-info" className="mt-0 p-4 sm:p-6">
                                        <OrganizationInfo />
                                    </TabsContent>

                                    <TabsContent value="animal-types" className="mt-0 p-4 sm:p-6">
                                        <AnimalType />
                                    </TabsContent>

                                    <TabsContent value="animal-acquisition-ways" className="mt-0 p-4 sm:p-6">
                                        <AnimalAcquisitionWay />
                                    </TabsContent>

                                    <TabsContent value="behaviors" className="mt-0 p-4 sm:p-6">
                                        <AnimalBehaviors
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="health-procedures" className="mt-0 p-4 sm:p-6">
                                        <HealthProcedures
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="vaccination-types" className="mt-0 p-4 sm:p-6">
                                        <AnimalVaccinationType
                                            animalIdToType={animalIdToType}
                                            onChangeAnimalType={onChangeAnimalType}
                                            animalTypeList={animalTypeList}
                                            animalType={animalType}
                                        />
                                    </TabsContent>

                                    <TabsContent value="medicines" className="mt-0 p-4 sm:p-6">
                                        <AnimalMedicine />
                                    </TabsContent>

                                    <TabsContent value="volunteer-activities" className="mt-0 p-4 sm:p-6">
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
