"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Filter, X, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchAnimalHealthQuery, fetchAnimalTypes, type AnimalHealthQueryVM, type AnimalTypeDTO } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Badge } from "@/components/ui/badge"
import { getUserRole } from "@/lib/auth-utils"
import { formatDateForTenant } from "@/lib/date-format"

const kindTypes = [
    { value: "vaccinations", label: "Vaccinations" },
    { value: "procedures", label: "Procedures" },
    { value: "prescriptions", label: "Prescriptions" },
    { value: "soaps", label: "SOAPs" },
    { value: "diet", label: "Diet" },
    { value: "notes", label: "Notes" },
    { value: "all", label: "All" },
]

const timeSpans = [
    { value: "lastWeek", label: "Last Week" },
    { value: "lastMonth", label: "Last Month" },
    { value: "yearToDate", label: "Year to Date" },
    { value: "lastYear", label: "Last Year" },
    { value: "lastTwoYears", label: "Last Two Years" },
    { value: "lastThreeYears", label: "Last Three Years" },
    { value: "sinceInception", label: "Since Inception" },
]

export default function AnimalHealthQueryPage() {
    const router = useRouter()

    const [results, setResults] = useState<AnimalHealthQueryVM[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterApplied, setFilterApplied] = useState(false)
    const [animalTypes, setAnimalTypes] = useState<AnimalTypeDTO[]>([])
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [filters, setFilters] = useState({
        kind: "",
        animalTypeName: "",
        timeSpan: "",
        startDate: "",
        endDate: "",
    })
    const { toast } = useToast()

    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalCaretaker") {
            router.push("/animals")
        }
    }, [router])

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

    const getDateRangeFromTimeSpan = (timeSpan: string): { start: string; end: string } | null => {
        const today = new Date()
        let start: Date
        let end: Date = today

        switch (timeSpan) {
            case "lastWeek":
                start = new Date(today)
                start.setDate(today.getDate() - 7)
                start.setHours(0, 0, 0, 0)
                end = new Date(today)
                end.setHours(23, 59, 59, 999)
                break
            case "lastMonth":
                start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
                end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59, 999)
                break
            case "yearToDate":
                start = new Date(today.getFullYear(), 0, 1)
                end = today
                break
            case "lastYear":
                start = new Date(today.getFullYear() - 1, 0, 1)
                end = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
                break
            case "lastTwoYears":
                start = new Date(today.getFullYear() - 2, 0, 1)
                end = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
                break
            case "lastThreeYears":
                start = new Date(today.getFullYear() - 3, 0, 1)
                end = new Date(today.getFullYear() - 1, 11, 31, 23, 59, 59, 999)
                break
            case "sinceInception":
                return null
            default:
                return null
        }

        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
        }
    }

    const handleTimeSpanChange = (value: string) => {
        setFilters({ ...filters, timeSpan: value })
        if (value === "sinceInception") {
            setFilters({ ...filters, timeSpan: value, startDate: "", endDate: "" })
        } else {
            const dateRange = getDateRangeFromTimeSpan(value)
            if (dateRange) {
                setFilters({
                    ...filters,
                    timeSpan: value,
                    startDate: dateRange.start,
                    endDate: dateRange.end,
                })
            }
        }
    }

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!filters.kind) {
            errors.kind = "Please select a kind."
        }

        if (!filters.timeSpan) {
            errors.timeSpan = "Please select a time span."
        }

        if (filters.timeSpan && filters.timeSpan !== "sinceInception" && (!filters.startDate || !filters.endDate)) {
            errors.dateRange = "Please select a date range."
        }

        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    const handleSearch = async () => {
        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        try {
            const params: any = {
                kind: filters.kind,
            }

            if (filters.animalTypeName && filters.animalTypeName !== "All") {
                params.animalTypeName = filters.animalTypeName
            }

            if (filters.timeSpan !== "sinceInception") {
                if (filters.startDate) {
                    params.startDate = `${filters.startDate}T00:00:00`
                }
                if (filters.endDate) {
                    params.endDate = `${filters.endDate}T23:59:59`
                }
            }

            const data = await fetchAnimalHealthQuery(params)
            setResults(data)
            setFilterApplied(true)
        } catch (error: any) {
            console.error("Failed to search animal health records", error)
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
            kind: "",
            animalTypeName: "",
            timeSpan: "",
            startDate: "",
            endDate: "",
        })
        setValidationErrors({})
        setResults([])
        setFilterApplied(false)
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return ""
        try {
            const date = new Date(dateString)
            return formatDateForTenant(date, {
                year: "numeric",
                month: "short",
                day: "numeric",
            })
        } catch {
            return dateString
        }
    }

    const columns: Column<AnimalHealthQueryVM>[] = [
        {
            key: "animalName",
            header: "Name",
            accessor: (item) => item.animalName,
        },
        {
            key: "animalType",
            header: "Animal",
            accessor: (item) => item.animalType || "N/A",
        },
        {
            key: "breedSpecies",
            header: "Breed/Species",
            accessor: (item) => item.breedSpecies || "N/A",
        },
        {
            key: "date",
            header: "Date",
            render: (item) => formatDate(item.date),
        },
        {
            key: "type",
            header: "Type",
            accessor: (item) => item.type,
        },
        {
            key: "kind",
            header: "Kind",
            accessor: (item) => item.kind || "N/A",
        },
        {
            key: "tagNumber",
            header: "Tag Number",
            accessor: (item) => item.tagNumber || "N/A",
        },
        {
            key: "microchipNo",
            header: "Microchip Number",
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Animal Health Query</h1>
                            <p className="text-muted-foreground">
                                Search and filter animal health records by kind, animal type, and date range.
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
                                <div>
                                    <FloatingSelect
                                        label="Kind"
                                        value={filters.kind}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, kind: value })
                                            if (validationErrors.kind) {
                                                setValidationErrors({ ...validationErrors, kind: "" })
                                            }
                                        }}
                                        className="min-h-10 w-full"
                                        error={validationErrors.kind}
                                    >
                                        {kindTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </FloatingSelect>
                                </div>

                                <div>
                                    <FloatingSelect
                                        label="Animal Type"
                                        value={filters.animalTypeName}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, animalTypeName: value })
                                        }}
                                        className="min-h-10 w-full"
                                    >
                                        <SelectItem value="All">All</SelectItem>
                                        {animalTypes.map((type) => (
                                            <SelectItem key={type.id} value={type.typeName}>
                                                {type.typeName}
                                            </SelectItem>
                                        ))}
                                    </FloatingSelect>
                                </div>

                                <div>
                                    <FloatingSelect
                                        label="Time Span"
                                        value={filters.timeSpan}
                                        onValueChange={handleTimeSpanChange}
                                        className="min-h-10 w-full"
                                        error={validationErrors.timeSpan}
                                    >
                                        {timeSpans.map((span) => (
                                            <SelectItem key={span.value} value={span.value}>
                                                {span.label}
                                            </SelectItem>
                                        ))}
                                    </FloatingSelect>
                                </div>
                            </div>

                            {filters.timeSpan && filters.timeSpan !== "sinceInception" && (
                                <div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FloatingInput
                                            id="startDate"
                                            label="Start Date"
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => {
                                                setFilters({ ...filters, startDate: e.target.value })
                                                if (validationErrors.dateRange) {
                                                    setValidationErrors({ ...validationErrors, dateRange: "" })
                                                }
                                            }}
                                            disabled={filters.timeSpan === "sinceInception"}
                                            className={validationErrors.dateRange ? "border-red-500" : ""}
                                        />
                                        <FloatingInput
                                            id="endDate"
                                            label="End Date"
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => {
                                                setFilters({ ...filters, endDate: e.target.value })
                                                if (validationErrors.dateRange) {
                                                    setValidationErrors({ ...validationErrors, dateRange: "" })
                                                }
                                            }}
                                            disabled={filters.timeSpan === "sinceInception"}
                                            className={validationErrors.dateRange ? "border-red-500" : ""}
                                        />
                                    </div>
                                    {validationErrors.dateRange && (
                                        <p className="text-sm text-red-600 mt-1">{validationErrors.dateRange}</p>
                                    )}
                                </div>
                            )}

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
                        {filters.kind && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Kind: {kindTypes.find((t) => t.value === filters.kind)?.label || filters.kind}
                            </Badge>
                        )}
                        {filters.animalTypeName && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Animal Type: {filters.animalTypeName}
                            </Badge>
                        )}
                        {filters.timeSpan && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Time Span: {timeSpans.find((t) => t.value === filters.timeSpan)?.label || filters.timeSpan}
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setFilterApplied(false)}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Modify Query
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

