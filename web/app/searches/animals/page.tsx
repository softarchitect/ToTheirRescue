"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, PawPrint } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { searchAnimals, fetchAnimalTypes, type AnimalSearchVM, type AnimalTypeDTO } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Badge } from "@/components/ui/badge"

const currentResidentOptions = [
    { value: "current", label: "Current" },
    { value: "former", label: "Former" },
]

const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unknown", label: "Unknown" },
]

const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
]

const statusOptions = [
    { value: "Adoptable", label: "Adoptable" },
    { value: "Permanent Resident", label: "Permanent Resident" },
    { value: "Quarantine Hold", label: "Quarantine Hold" },
    { value: "Outdoor Feral", label: "Outdoor Feral" },
]

const spayedNeuteredOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
]

export default function AnimalsSearchPage() {
    const [results, setResults] = useState<AnimalSearchVM[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterApplied, setFilterApplied] = useState(false)
    const [animalTypes, setAnimalTypes] = useState<AnimalTypeDTO[]>([])
    const [filters, setFilters] = useState({
        name: "",
        animalType: "",
        currentResident: "",
        breed: "",
        color: "",
        sex: "",
        location: "",
        notes: "",
        chronicCondition: "",
        flagged: "",
        dietPresent: "",
        status: "",
        spayedNeutered: "",
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
        setIsLoading(true)
        try {
            const params: any = {}
            Object.entries(filters).forEach(([key, value]) => {
                if (value) {
                    params[key] = value
                }
            })

            const data = await searchAnimals(params)
            setResults(data)
            setFilterApplied(true)
        } catch (error: any) {
            console.error("Failed to search animals", error)
            toast({
                title: "Error",
                description: error.message || "Failed to search animals.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearFilters = () => {
        setFilters({
            name: "",
            animalType: "",
            currentResident: "",
            breed: "",
            color: "",
            sex: "",
            location: "",
            notes: "",
            chronicCondition: "",
            flagged: "",
            dietPresent: "",
            status: "",
            spayedNeutered: "",
        })
        setResults([])
        setFilterApplied(false)
    }

    const columns: Column<AnimalSearchVM>[] = [
        {
            key: "animalType",
            header: "Animal Type",
            accessor: (item) => item.animalType || "N/A",
        },
        {
            key: "name",
            header: "Name",
            accessor: (item) => item.name || "N/A",
        },
        {
            key: "color",
            header: "Color",
            accessor: (item) => item.color || "N/A",
        },
        {
            key: "spayedNeutered",
            header: "Spayed/Neutered",
            accessor: (item) => item.spayedNeutered || "N/A",
        },
        {
            key: "notes",
            header: "Notes",
            accessor: (item) => item.notes || "N/A",
        },
        {
            key: "flagged",
            header: "Flagged",
            accessor: (item) => item.flagged || "N/A",
        },
        {
            key: "status",
            header: "Status",
            accessor: (item) => item.status || "N/A",
        },
        {
            key: "currentResident",
            header: "Current Resident",
            accessor: (item) => item.currentResident || "N/A",
        },
        {
            key: "breed",
            header: "Breed",
            accessor: (item) => item.breed || "N/A",
        },
        {
            key: "sex",
            header: "Sex",
            accessor: (item) => item.sex || "N/A",
        },
        {
            key: "location",
            header: "Location",
            accessor: (item) => item.location || "N/A",
        },
        {
            key: "chronicCondition",
            header: "Chronic Condition",
            accessor: (item) => item.chronicCondition || "N/A",
        },
        {
            key: "dietPresent",
            header: "Diet Present",
            accessor: (item) => item.dietPresent || "N/A",
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Animals Search</h1>
                            <p className="text-muted-foreground">
                                Search and filter animals by various criteria.
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FloatingInput
                                    id="name"
                                    label="Name"
                                    value={filters.name}
                                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                    maxLength={50}
                                />

                                <FloatingSelect
                                    label="Animal Type"
                                    value={filters.animalType}
                                    onValueChange={(value) => setFilters({ ...filters, animalType: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="All">All</SelectItem>
                                    {animalTypes.map((type) => (
                                        <SelectItem key={type.id} value={type.typeName}>
                                            {type.typeName}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingSelect
                                    label="Current Resident"
                                    value={filters.currentResident}
                                    onValueChange={(value) => setFilters({ ...filters, currentResident: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {currentResidentOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingInput
                                    id="breed"
                                    label="Breed"
                                    value={filters.breed}
                                    onChange={(e) => setFilters({ ...filters, breed: e.target.value })}
                                    maxLength={50}
                                />

                                <FloatingInput
                                    id="color"
                                    label="Color"
                                    value={filters.color}
                                    onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                                    maxLength={50}
                                />

                                <FloatingSelect
                                    label="Sex"
                                    value={filters.sex}
                                    onValueChange={(value) => setFilters({ ...filters, sex: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {sexOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingInput
                                    id="location"
                                    label="Location"
                                    value={filters.location}
                                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                                    maxLength={50}
                                />

                                <FloatingInput
                                    id="notes"
                                    label="Notes"
                                    value={filters.notes}
                                    onChange={(e) => setFilters({ ...filters, notes: e.target.value })}
                                    maxLength={200}
                                />

                                <FloatingSelect
                                    label="Chronic Condition"
                                    value={filters.chronicCondition}
                                    onValueChange={(value) => setFilters({ ...filters, chronicCondition: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {yesNoOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingSelect
                                    label="Flagged"
                                    value={filters.flagged}
                                    onValueChange={(value) => setFilters({ ...filters, flagged: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {yesNoOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingSelect
                                    label="Diet Present"
                                    value={filters.dietPresent}
                                    onValueChange={(value) => setFilters({ ...filters, dietPresent: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {yesNoOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingSelect
                                    label="Status"
                                    value={filters.status}
                                    onValueChange={(value) => setFilters({ ...filters, status: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

                                <FloatingSelect
                                    label="Spayed/Neutered"
                                    value={filters.spayedNeutered}
                                    onValueChange={(value) => setFilters({ ...filters, spayedNeutered: value })}
                                    className="min-h-10 w-full"
                                >
                                    <SelectItem value="all">All</SelectItem>
                                    {spayedNeuteredOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>
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
                            if (key === "currentResident") {
                                label = currentResidentOptions.find((o) => o.value === value)?.label || value
                            } else if (key === "sex") {
                                label = sexOptions.find((o) => o.value === value)?.label || value
                            } else if (key === "animalType") {
                                label = animalTypes.find((t) => t.typeName === value)?.typeName || value
                            } else if (key === "status") {
                                label = statusOptions.find((o) => o.value === value)?.label || value
                            } else if (key === "spayedNeutered") {
                                label = spayedNeuteredOptions.find((o) => o.value === value)?.label || value
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
                                <PawPrint className="h-8 w-8 text-emerald-600" />
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
                                <div className="animate-pulse text-muted-foreground">Searching animals...</div>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={results}
                                getRowId={(item) => String(item.id)}
                                actionsHeader=""
                                emptyMessage="No animals found matching your criteria"
                                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                            />
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    )
}

