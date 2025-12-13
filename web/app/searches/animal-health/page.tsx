"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { searchAnimalHealth, fetchAnimalTypes, type AnimalHealthSearchVM, type AnimalTypeDTO } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Badge } from "@/components/ui/badge"

const healthTypes = [
    { value: "vaccination", label: "Vaccinations" },
    { value: "ptt", label: "Procedures, Tests, and Treatments" },
    { value: "prescription", label: "Prescriptions" },
    { value: "soaps", label: "SOAPs" },
    { value: "notes", label: "Notes" },
]

export default function AnimalHealthSearchPage() {
    const [results, setResults] = useState<AnimalHealthSearchVM[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterApplied, setFilterApplied] = useState(false)
    const [animalTypes, setAnimalTypes] = useState<AnimalTypeDTO[]>([])
    const [filters, setFilters] = useState({
        type: "",
        animalTypeName: "",
        clinic: "",
        vaccinationType: "",
        administerer: "",
        serialNumber: "",
        vaccineManufacturer: "",
        rabiesTagNo: "",
        veterinarian: "",
        personEntered: "",
        microchipNo: "",
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
        notes: "",
    })
    const { toast } = useToast()

    useEffect(() => {
        loadAnimalTypes()
    }, [])

    const loadAnimalTypes = async () => {
        try {
            const types = await fetchAnimalTypes()
            setAnimalTypes(types)
        } catch (error) {
            console.error("Failed to load animal types", error)
        }
    }

    const handleSearch = async () => {
        if (filters.type === "prescription") {
            toast({
                title: "Info",
                description: "Prescription search is coming soon!",
                variant: "default",
            })
            return
        }

        setIsLoading(true)
        try {
            const params: any = {}
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params[key] = value
                }
            })

            const data = await searchAnimalHealth(params)
            setResults(data)
            setFilterApplied(true)
        } catch (error: any) {
            console.error("Failed to search animal health", error)
            toast({
                title: "Error",
                description: error.message || "Failed to search animal health records.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearFilters = () => {
        setFilters({
            type: "",
            animalTypeName: "",
            clinic: "",
            vaccinationType: "",
            administerer: "",
            serialNumber: "",
            vaccineManufacturer: "",
            rabiesTagNo: "",
            veterinarian: "",
            personEntered: "",
            microchipNo: "",
            subjective: "",
            objective: "",
            assessment: "",
            plan: "",
            notes: "",
        })
        setResults([])
        setFilterApplied(false)
    }

    const columns: Column<AnimalHealthSearchVM>[] = [
        {
            key: "name",
            header: "Name",
            accessor: (item) => item.name || "N/A",
        },
        {
            key: "animalType",
            header: "Animal Type",
            accessor: (item) => item.animalType || "N/A",
        },
        {
            key: "breedSpecies",
            header: "Breed/Species",
            accessor: (item) => item.breedSpecies || "N/A",
        },
        {
            key: "clinic",
            header: "Clinic",
            accessor: (item) => item.clinic || "N/A",
        },
        {
            key: "type",
            header: "Type",
            accessor: (item) => item.type || "N/A",
        },
        {
            key: "kind",
            header: "Kind",
            accessor: (item) => item.kind || "N/A",
        },
        {
            key: "rabiesTag",
            header: "Rabies Tag",
            accessor: (item) => item.rabiesTag || "N/A",
        },
        {
            key: "microchipNo",
            header: "Microchip No.",
            accessor: (item) => item.microchipNo || "N/A",
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Animal Health Search</h1>
                            <p className="text-muted-foreground">
                                Search and filter animal health records by type and various criteria.
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
                        {filters.type !== "prescription" ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FloatingSelect
                                        label="Type"
                                        value={filters.type}
                                        onValueChange={(value) => setFilters({ ...filters, type: value })}
                                        className="min-h-10 w-full"
                                    >
                                        <SelectItem value="all">All</SelectItem>
                                        {healthTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </FloatingSelect>

                                    {filters.type === "vaccination" && (
                                        <FloatingInput
                                            id="vaccinationType"
                                            label="Vaccination Type"
                                            value={filters.vaccinationType}
                                            onChange={(e) => setFilters({ ...filters, vaccinationType: e.target.value })}
                                            maxLength={50}
                                        />
                                    )}

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

                                    <FloatingInput
                                        id="clinic"
                                        label="Clinic"
                                        value={filters.clinic}
                                        onChange={(e) => setFilters({ ...filters, clinic: e.target.value })}
                                        maxLength={50}
                                    />

                                    {["vaccination", "ptt"].includes(filters.type) && (
                                        <FloatingInput
                                            id="administerer"
                                            label="Administerer"
                                            value={filters.administerer}
                                            onChange={(e) => setFilters({ ...filters, administerer: e.target.value })}
                                            maxLength={50}
                                        />
                                    )}

                                    {filters.type === "vaccination" && (
                                        <>
                                            <FloatingInput
                                                id="serialNumber"
                                                label="Serial Number"
                                                value={filters.serialNumber}
                                                onChange={(e) => setFilters({ ...filters, serialNumber: e.target.value })}
                                                maxLength={50}
                                            />
                                            <FloatingInput
                                                id="vaccineManufacturer"
                                                label="Vaccine Manufacturer"
                                                value={filters.vaccineManufacturer}
                                                onChange={(e) => setFilters({ ...filters, vaccineManufacturer: e.target.value })}
                                                maxLength={50}
                                            />
                                        </>
                                    )}

                                    {["vaccination", "ptt"].includes(filters.type) && (
                                        <FloatingInput
                                            id="rabiesTagNo"
                                            label="Rabies Tag No."
                                            value={filters.rabiesTagNo}
                                            onChange={(e) => setFilters({ ...filters, rabiesTagNo: e.target.value })}
                                            maxLength={50}
                                        />
                                    )}

                                    {["soaps", "prescription"].includes(filters.type) && (
                                        <FloatingInput
                                            id="veterinarian"
                                            label="Veterinarian"
                                            value={filters.veterinarian}
                                            onChange={(e) => setFilters({ ...filters, veterinarian: e.target.value })}
                                            maxLength={50}
                                        />
                                    )}

                                    {filters.type === "notes" && (
                                        <FloatingInput
                                            id="personEntered"
                                            label="Person Entered"
                                            value={filters.personEntered}
                                            onChange={(e) => setFilters({ ...filters, personEntered: e.target.value })}
                                            maxLength={50}
                                        />
                                    )}

                                    {filters.type === "ptt" && (
                                        <FloatingInput
                                            id="microchipNo"
                                            label="Microchip No."
                                            value={filters.microchipNo}
                                            onChange={(e) => setFilters({ ...filters, microchipNo: e.target.value })}
                                            maxLength={50}
                                        />
                                    )}

                                    {filters.type === "soaps" && (
                                        <>
                                            <FloatingInput
                                                id="subjective"
                                                label="Subjective"
                                                value={filters.subjective}
                                                onChange={(e) => setFilters({ ...filters, subjective: e.target.value })}
                                                maxLength={200}
                                            />
                                            <FloatingInput
                                                id="objective"
                                                label="Objective"
                                                value={filters.objective}
                                                onChange={(e) => setFilters({ ...filters, objective: e.target.value })}
                                                maxLength={200}
                                            />
                                            <FloatingInput
                                                id="assessment"
                                                label="Assessment"
                                                value={filters.assessment}
                                                onChange={(e) => setFilters({ ...filters, assessment: e.target.value })}
                                                maxLength={200}
                                            />
                                            <FloatingInput
                                                id="plan"
                                                label="Plan"
                                                value={filters.plan}
                                                onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                                                maxLength={200}
                                            />
                                        </>
                                    )}

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
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <p className="text-lg text-muted-foreground">Coming Soon!</p>
                            </div>
                        )}
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
                            if (key === "type") {
                                label = healthTypes.find((t) => t.value === value)?.label || value
                            } else if (key === "animalTypeName") {
                                label = animalTypes.find((t) => t.typeName === value)?.typeName || value
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
                                <Heart className="h-8 w-8 text-emerald-600" />
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
                                <div className="animate-pulse text-muted-foreground">Searching health records...</div>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={results}
                                getRowId={(item) => String(item.id)}
                                actionsHeader=""
                                emptyMessage="No health records found matching your criteria"
                                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                            />
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    )
}

