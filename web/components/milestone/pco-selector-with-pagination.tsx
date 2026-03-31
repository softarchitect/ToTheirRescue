"use client"

import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import type { PCO } from "@/lib/types"
import { fetchPCOs, createPCO } from "@/lib/api"
import { AddPCODialog } from "@/components/pco/add-pco-dialog"

interface PCOSelectorWithPaginationProps {
    headerText?: string
    selectedPCO: string
    onSelectPCO: (pcoId: string) => void
    existingPCOName?: string | null
    initialPCOId?: number
    onPCOCreated?: (pco: PCO) => void
}

const createPCOColumns = (selectedPCO: string): Column<PCO>[] => [
    {
        key: "select",
        header: "",
        render: (pco) => (
            <div
                className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedPCO === String((pco as any).id) ? "border-primary bg-primary" : "border-gray-300"
                    }`}
            >
                {selectedPCO === String((pco as any).id) && <div className="h-2 w-2 bg-white rounded-full" />}
            </div>
        ),
    },
    {
        key: "lastName",
        header: "Last Name",
        render: (pco) => <span className="font-medium">{pco.lastName}</span>,
    },
    {
        key: "firstName",
        header: "First Name",
        render: (pco) => <span>{pco.firstName}</span>,
    },
    {
        key: "address",
        header: "Address",
        render: (pco) => (
            <span className="text-muted-foreground">
                {[pco.street, pco.city, pco.state].filter(Boolean).join(", ")}
            </span>
        ),
    },
]

export function PCOSelectorWithPagination({
    headerText,
    selectedPCO,
    onSelectPCO,
    existingPCOName,
    initialPCOId,
    onPCOCreated,
}: PCOSelectorWithPaginationProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [pcos, setPCOs] = useState<PCO[]>([])
    const [isAddPCODialogOpen, setIsAddPCODialogOpen] = useState(false)
    const [pcoPage, setPcoPage] = useState(1)
    const [hasMorePCOs, setHasMorePCOs] = useState(false)
    const [isLoadingMorePCOs, setIsLoadingMorePCOs] = useState(false)
    const [isShowAllMode, setIsShowAllMode] = useState(false)
    const [isCreatedPCO, setIsCreatedPCO] = useState(false)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Load PCOs when needed
    const loadPCOs = useCallback(async (query: string = "", id?: number) => {
        try {
            // If ID is provided, fetch only that PCO (ignore search query)
            if (id) {
                const result = await fetchPCOs({ id, entityType: 'Person' })
                const filtered = (result || [])
                    .map((pco: any) => ({ ...pco, id: String(pco.id) }))
                    .filter((pco: any) => String(pco.entityType || "").trim().toLowerCase() !== "coro")
                setPCOs(filtered)
                setIsShowAllMode(false)
                setPcoPage(1)
                setHasMorePCOs(false)
            } else {
                // Otherwise, use search query
                const result = await fetchPCOs({ searchText: query, limit: 5, entityType: 'Person' })
                const filtered = (result || [])
                    .map((pco: any) => ({ ...pco, id: String(pco.id) }))
                    .filter((pco: any) => String(pco.entityType || "").trim().toLowerCase() !== "coro")
                setPCOs(filtered)
                setIsShowAllMode(false)
                setPcoPage(1)
                setHasMorePCOs(false)
            }
        } catch (error) {
            console.error("Failed to load PCOs:", error)
        }
    }, [])

    // Load all PCOs with pagination (for "Show All" button)
    const loadAllPCOs = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            setIsLoadingMorePCOs(true)
            const result = await fetchPCOs({ page, limit: 20, entityType: 'Person' })
            const filteredResult = (result || [])
                .map((pco: any) => ({ ...pco, id: String(pco.id) }))
                .filter((pco: any) => String(pco.entityType || "").trim().toLowerCase() !== "coro")

            if (append) {
                // Filter out duplicates based on PCO ID when appending
                setPCOs(prev => {
                    const existingIds = new Set(prev.map((pco: any) => String(pco.id)))
                    const newPCOs = filteredResult.filter((pco: any) => !existingIds.has(String(pco.id)))
                    return [...prev, ...newPCOs]
                })
            } else {
                setPCOs(filteredResult)
                setPcoPage(1)
            }

            // Check if there are more results (if we got 20, there might be more)
            setHasMorePCOs(filteredResult.length === 20)
            setIsShowAllMode(true)
        } catch (error) {
            console.error("Failed to load all PCOs:", error)
            setHasMorePCOs(false)
        } finally {
            setIsLoadingMorePCOs(false)
        }
    }, [])

    // Handle scroll to load more PCOs
    const handlePCOScroll = useCallback(() => {
        const container = scrollContainerRef.current
        if (!container || !isShowAllMode || isLoadingMorePCOs || !hasMorePCOs) return

        const { scrollTop, scrollHeight, clientHeight } = container
        // Load more when user is within 50px of the bottom
        if (scrollHeight - scrollTop - clientHeight < 50) {
            const nextPage = pcoPage + 1
            setPcoPage(nextPage)
            loadAllPCOs(nextPage, true)
        }
    }, [isShowAllMode, isLoadingMorePCOs, hasMorePCOs, loadAllPCOs, pcoPage])

    // Load initial PCO if ID is provided
    useEffect(() => {
        if (initialPCOId) {
            loadPCOs("", initialPCOId)
        }
    }, [initialPCOId, loadPCOs])

    // When no initial PCO is provided (e.g., switching intake to Owner/Public Surrender),
    // load a default people list so the table is immediately populated.
    useEffect(() => {
        if (!initialPCOId) {
            loadPCOs("")
        }
    }, [initialPCOId, loadPCOs])

    // Add scroll event listener when in show all mode
    useEffect(() => {
        const container = scrollContainerRef.current
        if (container && isShowAllMode) {
            container.addEventListener('scroll', handlePCOScroll)
            return () => {
                container.removeEventListener('scroll', handlePCOScroll)
            }
        }
    }, [isShowAllMode, handlePCOScroll])

    const filteredPCOs = useMemo(() => pcos.filter(pco => {
        const query = searchQuery.toLowerCase()
        if (!query) return pco;
        return (
            pco.lastName.toLowerCase().includes(query) ||
            pco.firstName.toLowerCase().includes(query) ||
            pco.street.toLowerCase().includes(query) ||
            pco.city.toLowerCase().includes(query) ||
            pco.state.toLowerCase().includes(query) ||
            pco.phone.toLowerCase().includes(query)
        )
    }), [pcos, searchQuery])

    const handlePCOCreated = async (data: any) => {
        try {
            const created = await createPCO({
                firstName: data.firstName,
                lastName: data.lastName,
                street: data.street,
                city: data.city,
                state: data.state,
                zip: data.zip,
                phone: data.phone,
                email: data.email,
                entityType: "Person",
            })
            // Refresh list and select the new PCO
            const createdNormalized: any = { ...created, id: String((created as any).id) }
            setPCOs([createdNormalized])
            setIsCreatedPCO(true)
            onSelectPCO(String((created as any).id))
            if (onPCOCreated) {
                onPCOCreated(createdNormalized)
            }
            if (!data.addAnother) {
                setIsAddPCODialogOpen(false)
            }
            return true
        } catch (error) {
            console.error("Failed to create PCO", error)
            return false
        }
    }

    return (
        <div className="space-y-2">
            {headerText && (
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold">{headerText}</h3>
                    {existingPCOName && (
                        <span className="text-base font-medium text-primary">
                            {existingPCOName}
                        </span>
                    )}
                </div>
            )}
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by name, address, or phone..."
                        value={searchQuery}
                        onChange={(e) => {
                            const newQuery = e.target.value
                            setSearchQuery(newQuery)
                            setIsShowAllMode(false)
                            setPcoPage(1)
                            loadPCOs(newQuery)
                        }}
                        className="w-80 pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent hover:text-foreground"
                    type="button"
                    onClick={() => {
                        setSearchQuery("")
                        loadAllPCOs(1, false)
                    }}
                >
                    <Plus className="h-4 w-4" />
                    Show All
                </Button>
                {!isCreatedPCO && (
                    <Button
                        size="sm"
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                        type="button"
                        onClick={() => setIsAddPCODialogOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add
                    </Button>
                )}
            </div>
            <div
                ref={scrollContainerRef}
                className="border rounded-lg overflow-auto bg-white max-h-64"
            >
                <DataTable
                    columns={createPCOColumns(selectedPCO)}
                    data={filteredPCOs}
                    getRowId={(pco) => String((pco as any).id)}
                    onRowClick={(pco) => onSelectPCO(String((pco as any).id))}
                    headerClassName="bg-emerald-600 hover:bg-emerald-700 text-white"
                    emptyMessage="No matching people found. Click 'Add' to create a new entry."
                />
                {isLoadingMorePCOs && (
                    <div className="text-center p-4 text-muted-foreground text-sm">
                        Loading more...
                    </div>
                )}
            </div>

            <AddPCODialog
                open={isAddPCODialogOpen}
                onOpenChange={setIsAddPCODialogOpen}
                onSave={handlePCOCreated}
                mode="personOnly"
            />
        </div>
    )
}

