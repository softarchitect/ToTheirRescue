"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { getUserRole } from "@/lib/auth-utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, X, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { fetchMailListQuery, type MailListQueryVM } from "@/lib/api"
import { DataTable, type Column } from "@/components/ui/data-table"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { FloatingInput } from "@/components/ui/floating-input"
import { Badge } from "@/components/ui/badge"

const queryTypes = [
    { value: "query1", label: "PCOs on the mail list with complete addresses" },
    { value: "query2", label: "PCOs on mail list with email addresses" },
    { value: "query3", label: "PCOs on mail list without email addresses" },
    { value: "query4", label: "PCOs not on the mail list" },
    { value: "query6", label: "PCOs on the mail list with incomplete addresses" },
]

export default function MailListQueryPage() {
    const router = useRouter()

    // Redirect AnimalCaretaker and Veterinarian users away from this page
    useEffect(() => {
        const role = getUserRole()
        if (role === "AnimalCaretaker" || role === "Veterinarian") {
            router.push("/queries/animal-health")
        }
    }, [router])
    const [results, setResults] = useState<MailListQueryVM[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [filterApplied, setFilterApplied] = useState(false)
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
    const [filters, setFilters] = useState({
        queryType: "",
        addedYears: "",
        adoptedYears: "",
        donatedYears: "",
    })
    const { toast } = useToast()

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {}

        if (!filters.queryType) {
            errors.queryType = "Please select a query type."
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
                queryType: filters.queryType,
            }

            if (filters.addedYears) {
                params.addedYears = filters.addedYears
            }
            if (filters.adoptedYears) {
                params.adoptedYears = filters.adoptedYears
            }
            if (filters.donatedYears) {
                params.donatedYears = filters.donatedYears
            }

            const data = await fetchMailListQuery(params)
            setResults(data)
            setFilterApplied(true)
        } catch (error: any) {
            console.error("Failed to search mail list", error)
            toast({
                title: "Error",
                description: error.message || "Failed to search mail list.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleClearFilters = () => {
        setFilters({
            queryType: "",
            addedYears: "",
            adoptedYears: "",
            donatedYears: "",
        })
        setValidationErrors({})
        setResults([])
        setFilterApplied(false)
    }

    const columns: Column<MailListQueryVM>[] = [
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
            key: "street",
            header: "Street",
            accessor: (item) => item.street || "N/A",
        },
        {
            key: "street2",
            header: "Street 2",
            accessor: (item) => item.street2 || "N/A",
        },
        {
            key: "city",
            header: "City",
            accessor: (item) => item.city || "N/A",
        },
        {
            key: "state",
            header: "State",
            accessor: (item) => item.state || "N/A",
        },
        {
            key: "zip",
            header: "Zip",
            accessor: (item) => item.zip || "N/A",
        },
        {
            key: "phone",
            header: "Phone",
            accessor: (item) => item.phone || "N/A",
        },
        {
            key: "email",
            header: "Email",
            accessor: (item) => item.email || "N/A",
        },
        {
            key: "mailList",
            header: "Mail List",
            accessor: (item) => item.mailList || "N/A",
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mail List Query</h1>
                            <p className="text-muted-foreground">
                                Search and filter PCOs for mail list based on various criteria.
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
                            <div>
                                <FloatingSelect
                                    label="Queries"
                                    value={filters.queryType}
                                    onValueChange={(value) => {
                                        setFilters({ ...filters, queryType: value })
                                        if (validationErrors.queryType) {
                                            setValidationErrors({ ...validationErrors, queryType: "" })
                                        }
                                    }}
                                    className="min-h-10 w-full"
                                    error={validationErrors.queryType}
                                >
                                    {queryTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </FloatingSelect>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <p className="text-sm text-blue-900 text-center">
                                    The below criteria is used to help you target the PCO's most likely to donate. You can exclude those that you've asked several times before and they've not positively responded.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 mb-2">Was added to the database in the last number of years</p>
                                    </div>
                                    <FloatingInput
                                        id="addedYears"
                                        label="Years"
                                        type="number"
                                        min="0"
                                        value={filters.addedYears}
                                        onChange={(e) => setFilters({ ...filters, addedYears: e.target.value })}
                                        className="w-32"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 mb-2">Adopted an animal in the last number of years</p>
                                    </div>
                                    <FloatingInput
                                        id="adoptedYears"
                                        label="Years"
                                        type="number"
                                        min="0"
                                        value={filters.adoptedYears}
                                        onChange={(e) => setFilters({ ...filters, adoptedYears: e.target.value })}
                                        className="w-32"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 mb-2">Made a donation in the last number of years</p>
                                    </div>
                                    <FloatingInput
                                        id="donatedYears"
                                        label="Years"
                                        type="number"
                                        min="0"
                                        value={filters.donatedYears}
                                        onChange={(e) => setFilters({ ...filters, donatedYears: e.target.value })}
                                        className="w-32"
                                    />
                                </div>
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
                        {filters.queryType && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Query: {queryTypes.find((t) => t.value === filters.queryType)?.label || filters.queryType}
                            </Badge>
                        )}
                        {filters.addedYears && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Added: {filters.addedYears} years
                            </Badge>
                        )}
                        {filters.adoptedYears && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Adopted: {filters.adoptedYears} years
                            </Badge>
                        )}
                        {filters.donatedYears && (
                            <Badge variant="secondary" className="px-3 py-1">
                                Donated: {filters.donatedYears} years
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
                                <Mail className="h-8 w-8 text-emerald-600" />
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
                                <div className="animate-pulse text-muted-foreground">Searching mail list...</div>
                            </div>
                        ) : (
                            <DataTable
                                columns={columns}
                                data={results}
                                getRowId={(item) => String(item.id)}
                                actionsHeader=""
                                emptyMessage="No PCOs found matching your criteria"
                                headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                            />
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    )
}

