"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  createRegion,
  deleteRegion,
  fetchCountries,
  fetchRegions,
  updateRegion,
  type CountryDTO,
  type RegionDTO,
} from "@/lib/api"

export function SARegions() {
  const [countries, setCountries] = useState<CountryDTO[]>([])
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)
  const [regions, setRegions] = useState<RegionDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<RegionDTO | null>(null)
  const [regionName, setRegionName] = useState("")
  const [regionCode, setRegionCode] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const selectedCountryName = useMemo(() => {
    if (!selectedCountryId) return ""
    return countries.find((country) => country.id === selectedCountryId)?.name || ""
  }, [countries, selectedCountryId])

  const loadCountries = async () => {
    const allCountries = await fetchCountries()
    const sorted = [...allCountries].sort((a, b) => a.name.localeCompare(b.name))
    setCountries(sorted)
    if (sorted.length > 0 && !selectedCountryId) {
      setSelectedCountryId(sorted[0].id)
    }
  }

  const loadRegions = async (countryId?: number | null) => {
    if (!countryId) {
      setRegions([])
      return
    }
    const data = await fetchRegions(countryId)
    setRegions([...data].sort((a, b) => a.regionName.localeCompare(b.regionName)))
  }

  const loadData = async () => {
    setIsLoading(true)
    try {
      await loadCountries()
    } catch (err) {
      console.error("Failed to load countries/regions", err)
      toast({
        title: "Error",
        description: "Failed to load regions.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  useEffect(() => {
    void loadRegions(selectedCountryId)
  }, [selectedCountryId])

  const resetForm = () => {
    setRegionName("")
    setRegionCode("")
    setError("")
  }

  const validateForm = (): boolean => {
    if (!selectedCountryId) {
      setError("Country is required.")
      return false
    }
    if (!regionName.trim()) {
      setError("Region name is required.")
      return false
    }
    setError("")
    return true
  }

  const handleCreate = async () => {
    if (!validateForm() || !selectedCountryId) return
    setIsSaving(true)
    try {
      await createRegion({
        countryId: selectedCountryId,
        regionName: regionName.trim(),
        regionCode: regionCode.trim() || undefined,
      })
      toast({ title: "Success", description: "Region saved to cloud database." })
      setIsAddDialogOpen(false)
      resetForm()
      await loadRegions(selectedCountryId)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add region.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingItem || !validateForm() || !selectedCountryId) return
    setIsSaving(true)
    try {
      await updateRegion(editingItem.id, {
        countryId: selectedCountryId,
        regionName: regionName.trim(),
        regionCode: regionCode.trim() || undefined,
      })
      toast({ title: "Success", description: "Region saved to cloud database." })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      resetForm()
      await loadRegions(selectedCountryId)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update region.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (region: RegionDTO) => {
    if (!confirm(`Delete "${region.regionName}"?`)) return
    try {
      await deleteRegion(region.id)
      toast({ title: "Success", description: "Region deleted successfully." })
      await loadRegions(selectedCountryId)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete region.",
        variant: "destructive",
      })
    }
  }

  const openEdit = (region: RegionDTO) => {
    setEditingItem(region)
    setSelectedCountryId(region.countryId)
    setRegionName(region.regionName)
    setRegionCode(region.regionCode || "")
    setError("")
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return <div className="py-8 text-muted-foreground">Loading regions...</div>
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-2">States / Regions</h2>
          <p className="text-muted-foreground">
            Manage state/province/locality options by country.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedCountryId ? String(selectedCountryId) : ""}
            onValueChange={(value) => setSelectedCountryId(Number(value))}
          >
            <SelectTrigger className="w-[280px] bg-white">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.id} value={String(country.id)}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => {
              resetForm()
              setIsAddDialogOpen(true)
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
      <div className="h-px bg-gray-300" />
      <div className="space-y-0">
        {regions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No regions found for {selectedCountryName || "this country"}.
          </div>
        ) : (
          regions.map((region) => (
            <div key={region.id} className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-gray-800">{region.regionName}</span>
                <span className="text-xs text-gray-500">{region.regionCode || ""}</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                  onClick={() => openEdit(region)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-transparent"
                  onClick={() => void handleDelete(region)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Region</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleCreate()
            }}
            className="space-y-4 py-2"
            autoComplete="off"
          >
            <FloatingInput label="Country" value={selectedCountryName} disabled autoComplete="off" />
            <FloatingInput label="Region Name" value={regionName} onChange={(e) => setRegionName(e.target.value)} required autoFocus autoComplete="off" />
            <FloatingInput label="Region Code" value={regionCode} onChange={(e) => setRegionCode(e.target.value.toUpperCase())} autoComplete="off" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Region</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleUpdate()
            }}
            className="space-y-4 py-2"
            autoComplete="off"
          >
            <FloatingInput label="Country" value={selectedCountryName} disabled autoComplete="off" />
            <FloatingInput label="Region Name" value={regionName} onChange={(e) => setRegionName(e.target.value)} required autoFocus autoComplete="off" />
            <FloatingInput label="Region Code" value={regionCode} onChange={(e) => setRegionCode(e.target.value.toUpperCase())} autoComplete="off" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
