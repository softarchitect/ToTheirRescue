"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, DollarSign } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { searchDonations, type DonationSearchVM } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Badge } from "@/components/ui/badge"
import { getUserRole } from "@/lib/auth-utils"
import { formatDateForTenant } from "@/lib/date-format"

const donationTypes = [
    { value: "money", label: "Money" },
    { value: "other", label: "Other" },
    { value: "all", label: "All" },
]

export default function DonationsSearchPage() {
    const router = useRouter()
    const [results, setResults] = useState<DonationSearchVM[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterApplied, setFilterApplied] = useState(false)
    const [filters, setFilters] = useState({
        firstName: "",
        lastName: "",
        donationType: "all",
        notes: "",
    })
    const { toast } = useToast()

    // Redirect AnimalManager, AnimalCaretaker, and Veterinarian users away from donations page
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalManager" || role === "AnimalCaretaker" || role === "Veterinarian") {
            router.push("/searches/animals")
        }
    }, [router])

    const handleSearch = async () => {
        setIsLoading(true)
        try {
            const params: any = {}
            Object.entries(filters).forEach(([key, value]) => {
                if (value && (key !== "donationType" || value !== "all")) {
                    params[key] = value
                }
            })

            const data = await searchDonations(params)
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
            firstName: "",
            lastName: "",
            donationType: "all",
            notes: "",
        })
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

    const columns: Column<DonationSearchVM>[] = [
        {
            key: "donationDate",
            header: "Donation Date",
            render: (item) => formatDate(item.donationDate),
        },
        {
            key: "firstName",
            header: "First Name",
            accessor: (item) => item.firstName || "N/A",
        },
        {
            key: "lastName",
            header: "Last Name",
            accessor: (item) => item.lastName || "N/A",
        },
        {
            key: "donationType",
            header: "Donation Type",
            accessor: (item) => item.donationType || "N/A",
        },
        {
            key: "amount",
            header: "Amount",
            accessor: (item) => item.amount || "N/A",
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Donations Search</h1>
                            <p className="text-muted-foreground">
                                Search and filter donations by donor name, type, and notes.
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
                                <FloatingInput
                                    id="firstName"
                                    label="First Name"
                                    value={filters.firstName}
                                    onChange={(e) => setFilters({ ...filters, firstName: e.target.value })}
                                    maxLength={50}
                                />

                                <FloatingInput
                                    id="lastName"
                                    label="Last Name"
                                    value={filters.lastName}
                                    onChange={(e) => setFilters({ ...filters, lastName: e.target.value })}
                                    maxLength={50}
                                />

                                <FloatingSelect
                                    label="Type"
                                    value={filters.donationType}
                                    onValueChange={(value) => setFilters({ ...filters, donationType: value })}
                                    className="min-h-10 w-full"
                                >
                                    {donationTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>

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
                            if (!value || (key === "donationType" && value === "all")) return null
                            let label = value
                            if (key === "donationType") {
                                label = donationTypes.find((t) => t.value === value)?.label || value
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

