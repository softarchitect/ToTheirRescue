"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { searchAnimalMilestones, fetchAnimalTypes, fetchAcquisitionWays, fetchOtherRescues, type AnimalMilestoneSearchVM, type AnimalTypeDTO } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Badge } from "@/components/ui/badge"

const milestoneTypes = [
    { value: "Birth", label: "Birth" },
    { value: "Intake", label: "Intake" },
    { value: "Adoption", label: "Adoption" },
    { value: "Adoption Return", label: "Adoption Return" },
    { value: "Foster", label: "Foster" },
    { value: "Foster Return", label: "Foster Return" },
    { value: "Lost", label: "Lost" },
    { value: "Found", label: "Found" },
    { value: "Released", label: "Released" },
    { value: "Death", label: "Death" },
    { value: "Return To Owner", label: "Return To Owner" },
    { value: "Reintake", label: "ReIntake" },
    { value: "Transfer", label: "Transfer" },
]

export default function AnimalMilestonesSearchPage() {
    const router = useRouter()
    const [results, setResults] = useState<AnimalMilestoneSearchVM[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterApplied, setFilterApplied] = useState(false)
    const [animalTypes, setAnimalTypes] = useState<AnimalTypeDTO[]>([])
    const [acquisitionWays, setAcquisitionWays] = useState<any[]>([])
    const [otherRescues, setOtherRescues] = useState<any[]>([])
    const [filters, setFilters] = useState({
        milestoneType: "",
        animalTypeName: "",
        howAcquired: "",
        otherRescueShelterId: "",
        otherRescueIdNo: "",
        notes: "",
    })
    const { toast } = useToast()

    // Redirect AnimalCaretaker and Veterinarian users away from this page
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalCaretaker" || role === "Veterinarian") {
            router.push("/searches/animals")
        }
    }, [router])

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            const [types, ways, rescues] = await Promise.all([
                fetchAnimalTypes(),
                fetchAcquisitionWays(),
                fetchOtherRescues(),
            ])
            setAnimalTypes(types)
            setAcquisitionWays(ways)
            setOtherRescues(rescues)
        } catch (error) {
            console.error("Failed to load data", error)
        }
    }

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params: any = {}
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params[key] = value
                }
            })

            const data = await searchAnimalMilestones(params)
            setResults(data)
            setFilterApplied(true)
        } catch (error: any) {
            console.error("Failed to search animal milestones", error)
            toast({
                title: "Error",
                description: error.message || "Failed to search animal milestones.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearFilters = () => {
        setFilters({
            milestoneType: "",
            animalTypeName: "",
            howAcquired: "",
            otherRescueShelterId: "",
            otherRescueIdNo: "",
            notes: "",
        })
        setResults([])
        setFilterApplied(false)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        } catch {
            return dateString
        }
    }

    const isBirthMilestone = (milestoneType?: string | null) =>
        (milestoneType || "").trim().toLowerCase() === "birth"

    const columns: Column<AnimalMilestoneSearchVM>[] = [
        {
            key: "date",
            header: "Date",
            render: (item) => formatDate(item.date),
        },
        {
            key: "milestone",
            header: "Milestone",
            accessor: (item) => item.milestone || "N/A",
        },
        {
            key: "name",
            header: "Name",
            accessor: (item) => (isBirthMilestone(item.milestone) ? "N/A" : item.name || "N/A"),
        },
        {
            key: "animalType",
            header: "Animal Type",
            accessor: (item) => item.animalType || "N/A",
        },
        {
            key: "howAcquired",
            header: "How Acquired",
            accessor: (item) => item.howAcquired || "N/A",
        },
        {
            key: "otherRescue",
            header: "Other Rescue",
            accessor: (item) => item.otherRescue || "N/A",
        },
        {
            key: "otherRescueId",
            header: "Other Rescue Id",
            accessor: (item) => item.otherRescueId || "N/A",
        },
        {
            key: "notes",
            header: "Notes",
            accessor: (item) => item.notes || "N/A",
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 bg-pattern">
            <Navigation />

            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Animal Milestones Search</h1>
                            <p className="text-muted-foreground">
                                Search and filter animal milestones by type, animal type, and other criteria.
                            </p>
                        </div>
                        {filterApplied && (
                            <Button variant="outline" onClick={handleClearFilters}>
                                <X className="h-4 w-4 mr-2" />
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Filter Form */}
                {!filterApplied && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingSelect
                                    label="Milestone"
                                    value={filters.milestoneType}
                                    onValueChange={(value) => setFilters({ ...filters, milestoneType: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {milestoneTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingSelect
                                    label="Animal Type"
                                    value={filters.animalTypeName}
                                    onValueChange={(value) => setFilters({ ...filters, animalTypeName: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {animalTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.typeName}>
                                            {type.typeName}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                {filters.milestoneType === "Intake" && (
                                    <>
                                        <FloatingSelect
                                            label="How Acquired"
                                            value={filters.howAcquired}
                                            onValueChange={(value) => setFilters({ ...filters, howAcquired: value })}
                                            className="min-h-10 w-full"
                                        >
                                            <SelectItem value="all">All</SelectItem>
                                            {acquisitionWays.map((way) => (
                                                <SelectItem key={way.id} value={way.acquisitionWayName}>
                                                    {way.acquisitionWayName}
                                                </SelectItem>
                                            ))}
                                        </FloatingSelect>

                                        {filters.howAcquired && (
                                            <FloatingSelect
                                                label="Other Rescue/Shelter/Sanctuary"
                                                value={filters.otherRescueShelterId}
                                                onValueChange={(value) => setFilters({ ...filters, otherRescueShelterId: value })}
                                                className="min-h-10 w-full"
                                            >
                                                <SelectItem value="all">All</SelectItem>
                                                {otherRescues.map((rescue) => (
                                                    <SelectItem key={rescue.id} value={String(rescue.id)}>
                                                        {rescue.lastName || rescue.name || `Rescue ${rescue.id}`}
                                                    </SelectItem>
                                                ))}
                                            </FloatingSelect>
                                        )}
                                    </>
                                )}

                                <FloatingInput
                                    id="otherRescueIdNo"
                                    label="Other Rescue Id No"
                                    value={filters.otherRescueIdNo}
                                    onChange={(e) => setFilters({ ...filters, otherRescueIdNo: e.target.value })}
                                    maxLength={50}
                                />

                                <FloatingInput
                                    id="notes"
                                    label="Notes"
                                    value={filters.notes}
                                    onChange={(e) => setFilters({ ...filters, notes: e.target.value })}
                                    maxLength={200}
                                />
                            </div>

                            <div className="flex justify-center">
                                <Button onClick={handleSearch} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Active Filters */}
                {filterApplied && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-6 flex flex-wrap gap-2"
                    >
                        {Object.entries(filters).map(([key, value]) => {
                            if (!value) return null
                            let label = value
                            if (key === "milestoneType") {
                                label = milestoneTypes.find((t) => t.value === value)?.label || value
                            } else if (key === "animalTypeName") {
                                label = animalTypes.find((t) => t.typeName === value)?.typeName || value
                            } else if (key === "howAcquired") {
                                label = acquisitionWays.find((w) => w.acquisitionWayName === value)?.acquisitionWayName || value
                            } else if (key === "otherRescueShelterId") {
                                const rescue = otherRescues.find((r) => String(r.id) === value)
                                label = rescue ? (rescue.lastName || rescue.name || `Rescue ${rescue.id}`) : value
                            }
                            return (
                                <Badge key={key} variant="secondary" className="px-3 py-1">
                                    {key}: {label}
                                </Badge>
                            )
                        })}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilterApplied(false)}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Modify Search
                        </Button>
                    </motion.div>
                )}

                {/* Statistics Card */}
                {filterApplied && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="mb-6"
                    >
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Results Found</p>
                                    <p className="text-2xl font-bold text-emerald-600">{results.length}</p>
                                </div>
                                <Calendar className="h-8 w-8 text-emerald-600" />
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Results Table */}
                {filterApplied && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-pulse text-muted-foreground">Searching milestones...</div>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={results}
                                getRowId={(item) => String(item.id)}
                                actionsHeader=""
                                emptyMessage="No milestones found matching your criteria"
                                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                            />
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    )
}

