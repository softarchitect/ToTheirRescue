"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Filter, X, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchDonationQuery, type DonationQueryVM } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Badge } from "@/components/ui/badge"
import { getUserRole } from "@/lib/auth-utils"

const donationTypes = [
    { value: "money", label: "Money" },
    { value: "other", label: "Other" },
    { value: "all", label: "All" },
]

const topDonorsTypes = [
    { value: "byTotalAmount", label: "By Total Amount" },
    { value: "byNumberOfDonations", label: "By Number of Donations" },
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

export default function DonationsQueryPage() {
    const router = useRouter()
    const [results, setResults] = useState<DonationQueryVM[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterApplied, setFilterApplied] = useState(false)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [filters, setFilters] = useState({
        donationType: "all",
        topDonors: "",
        timeSpan: "",
        startDate: "",
        endDate: "",
    })
    const { toast } = useToast()

    // Redirect AnimalManager users away from donations page
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalManager") {
            router.push("/queries/animal-milestones")
        }
    }, [router])

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
                donationType: filters.donationType,
            }

            if (filters.topDonors && filters.donationType === "all") {
                params.topDonors = filters.topDonors
            }

            if (filters.timeSpan !== "sinceInception") {
                if (filters.startDate) {
                    params.startDate = `${filters.startDate}T00:00:00`
                }
                if (filters.endDate) {
                    params.endDate = `${filters.endDate}T23:59:59`
                }
            }

            const data = await fetchDonationQuery(params)
            setResults(data)
            setFilterApplied(true)
        } catch (error: any) {
            console.error("Failed to search donations", error)
            toast({
                title: "Error",
                description: error.message || "Failed to search donations.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearFilters = () => {
        setFilters({
            donationType: "all",
            topDonors: "",
            timeSpan: "",
            startDate: "",
            endDate: "",
        })
        setValidationErrors({})
        setResults([])
        setFilterApplied(false)
    }

    const columns: Column<DonationQueryVM>[] = [
        {
            key: "lastName",
            header: "Last Name",
            accessor: (item) => item.lastName || "N/A",
        },
        {
            key: "firstName",
            header: "First Name",
            accessor: (item) => item.firstName || "N/A",
        },
        {
            key: "numberOfDonations",
            header: "Number of Donations",
            accessor: (item) => item.numberOfDonations,
        },
        {
            key: "totalAmount",
            header: "Total Amount",
            accessor: (item) => item.totalAmount,
        },
        {
            key: "mailList",
            header: "Mail List",
            accessor: (item) => item.mailList || "N/A",
        },
        {
            key: "note",
            header: "Note",
            accessor: (item) => item.note || "N/A",
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donations Query</h1>
                            <p className="text-muted-foreground">
                                Search and filter donations by type, time span, and date range.
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
                                        label="Donations"
                                        value={filters.donationType}
                                        onValueChange={(value) => {
                                            setFilters({ ...filters, donationType: value })
                                            if (value !== "all") {
                                                setFilters({ ...filters, donationType: value, topDonors: "" })
                                            }
                                        }}
                                        className="min-h-10 w-full"
                                    >
                                        {donationTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </FloatingSelect>
                                </div>

                                {filters.donationType === "all" && (
                                    <div>
                                        <FloatingSelect
                                            label="Top Donors"
                                            value={filters.topDonors}
                                            onValueChange={(value) => setFilters({ ...filters, topDonors: value })}
                                            className="min-h-10 w-full"
                                        >
                                            {topDonorsTypes.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </FloatingSelect>
                                    </div>
                                )}

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
                        {filters.donationType && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Donations: {donationTypes.find((t) => t.value === filters.donationType)?.label || filters.donationType}
                            </Badge>
                        )}
                        {filters.topDonors && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Top Donors: {topDonorsTypes.find((t) => t.value === filters.topDonors)?.label || filters.topDonors}
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
                                <DollarSign className="h-8 w-8 text-emerald-600" />
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
                                <div className="animate-pulse text-muted-foreground">Searching donations...</div>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={results}
                                getRowId={(item) => String(item.id)}
                                actionsHeader=""
                                emptyMessage="No donations found matching your criteria"
                                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                            />
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    )
}

