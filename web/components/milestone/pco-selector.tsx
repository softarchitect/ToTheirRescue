import { useState, useEffect, useMemo } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/ui/data-table"
import type { PCO } from "@/lib/types"
import { cn } from "@/lib/utils"
import { fetchPCOs, createPCO } from "@/lib/api"
import { AddPCODialog } from "@/components/pco/add-pco-dialog"
import { getPCOHeaderText } from "@/lib/milestone-utils"

interface PCOSelectorProps {
  milestoneType: string
  selectedPCO: string
  onSelectPCO: (pcoId: string) => void
  error?: string
}

const createPCOColumns = (selectedPCO: string): Column<PCO>[] => [
  {
    key: "select",
    header: "",
    className: "w-[40px]",
    render: (pco) => (
      <div
        className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${selectedPCO === pco.id ? "border-primary bg-primary" : "border-gray-300"
          }`}
      >
        {selectedPCO === pco.id && <div className="h-2 w-2 bg-white rounded-full" />}
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
  // {
  //   key: "phone",
  //   header: "Phone",
  //   className: "w-[25%]",
  //   render: (pco) => <span className="text-muted-foreground">{pco.phone}</span>,
  // },
]

export function PCOSelector({ milestoneType, selectedPCO, onSelectPCO, error }: PCOSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [pcos, setPCOs] = useState<PCO[]>([])
  const [isAddPCODialogOpen, setIsAddPCODialogOpen] = useState(false)

  const filteredPCOs = useMemo(() => {
    const query = searchQuery.toLowerCase()
    if (!query) return pcos
    return pcos.filter(
      pco =>
        pco.lastName.toLowerCase().includes(query) ||
        pco.firstName.toLowerCase().includes(query) ||
        pco.street.toLowerCase().includes(query) ||
        pco.city.toLowerCase().includes(query) ||
        pco.state.toLowerCase().includes(query) ||
        pco.phone.toLowerCase().includes(query)
    )
  }, [pcos, searchQuery])

  const loadPCOs = async (text?: string) => {
    try {
      const results = await fetchPCOs({ searchText: text, page: 1, limit: 5, entityType: 'Person' })
      setPCOs(results)
    } catch (error) {
      console.error("Failed to load PCOs", error)
      setPCOs([])
    }
  }

  useEffect(() => {
    if (pcos.length === 0) {
      loadPCOs()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      setIsAddPCODialogOpen(false)
      setPCOs([created])
      onSelectPCO(created.id)
    } catch (error) {
      console.error("Failed to create PCO", error)
    }
  }

  return (
    <>
      <div>
        <h3 className="text-sm sm:text-base font-semibold">{getPCOHeaderText(milestoneType)}</h3>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, address, or phone..."
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value
              setSearchQuery(value)
              loadPCOs(value)
            }}
            className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <Button
          size="sm"
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
          type="button"
          onClick={() => setIsAddPCODialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white flex-1 min-h-0 flex flex-col">
        <div className="overflow-x-auto overflow-y-auto flex-1">
          <DataTable
            columns={createPCOColumns(selectedPCO)}
            data={filteredPCOs}
            getRowId={(pco) => pco.id}
            onRowClick={(pco) => onSelectPCO(pco.id)}
            rowClassName={(pco, index) =>
              cn(
                "cursor-pointer transition-colors",
                selectedPCO === pco.id
                  ? "bg-primary/10"
                  : index % 2 === 0
                    ? "bg-white hover:bg-muted/30"
                    : "bg-gray-50/50 hover:bg-muted/30"
              )
            }
            emptyMessage="No matching people found. Click 'Add' to create a new entry."
            className="h-full min-w-[600px]"
            headerClassName="text-primary-foreground sticky top-0 bg-emerald-600 hover:bg-emerald-700 text-white"
          />
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}

      <AddPCODialog
        open={isAddPCODialogOpen}
        onOpenChange={setIsAddPCODialogOpen}
        onSave={handlePCOCreated}
      />
    </>
  )
}

