"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { Plus, Trash2, Pencil } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  createCountry,
  deleteCountry,
  fetchCountries,
  updateCountry,
  type CountryDTO,
} from "@/lib/api"

export function SACountries() {
  const [countries, setCountries] = useState<CountryDTO[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CountryDTO | null>(null)
  const [countryName, setCountryName] = useState("")
  const [isdCode, setIsdCode] = useState("")
  const [currencyAbbreviation, setCurrencyAbbreviation] = useState("")
  const [dateFormat, setDateFormat] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const loadCountries = async () => {
    setIsLoading(true)
    try {
      const data = await fetchCountries()
      setCountries([...data].sort((a, b) => a.name.localeCompare(b.name)))
    } catch (err) {
      console.error("Failed to load countries", err)
      toast({
        title: "Error",
        description: "Failed to load countries.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadCountries()
  }, [])

  const resetForm = () => {
    setCountryName("")
    setIsdCode("")
    setCurrencyAbbreviation("")
    setDateFormat("")
    setError("")
  }

  const validateForm = (): boolean => {
    if (!countryName.trim()) {
      setError("Country name is required.")
      return false
    }
    setError("")
    return true
  }

  const handleCreate = async () => {
    if (!validateForm()) return
    setIsSaving(true)
    try {
      await createCountry({
        countryName: countryName.trim(),
        isdCode: isdCode.trim() ? Number(isdCode) : null,
        currencyAbbreviation: currencyAbbreviation.trim() || undefined,
        dateFormat: dateFormat.trim() || undefined,
      })
      toast({ title: "Success", description: "Country saved to cloud database." })
      setIsAddDialogOpen(false)
      resetForm()
      await loadCountries()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to add country.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingItem || !validateForm()) return
    setIsSaving(true)
    try {
      await updateCountry(editingItem.id, {
        countryName: countryName.trim(),
        isdCode: isdCode.trim() ? Number(isdCode) : null,
        currencyAbbreviation: currencyAbbreviation.trim() || undefined,
        dateFormat: dateFormat.trim() || undefined,
      })
      toast({ title: "Success", description: "Country saved to cloud database." })
      setIsEditDialogOpen(false)
      setEditingItem(null)
      resetForm()
      await loadCountries()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update country.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (country: CountryDTO) => {
    if (!confirm(`Delete "${country.name}"?`)) return
    try {
      await deleteCountry(country.id)
      toast({ title: "Success", description: "Country deleted successfully." })
      await loadCountries()
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete country.",
        variant: "destructive",
      })
    }
  }

  const openEdit = (country: CountryDTO) => {
    setEditingItem(country)
    setCountryName(country.name)
    setIsdCode(country.isdCode != null ? String(country.isdCode) : "")
    setCurrencyAbbreviation(country.currencyAbbreviation || "")
    setDateFormat(country.dateFormat || "")
    setError("")
    setIsEditDialogOpen(true)
  }

  if (isLoading) {
    return <div className="py-8 text-muted-foreground">Loading countries...</div>
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-semibold mb-2">Countries</h2>
          <p className="text-muted-foreground">
            Manage global country options for registration and customization.
          </p>
        </div>
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
      <div className="h-px bg-gray-300" />
      <div className="space-y-0">
        {countries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No countries found.</div>
        ) : (
          countries.map((country) => (
            <div key={country.id} className="flex items-center justify-between py-3 px-4 bg-gray-100 hover:bg-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-gray-800">{country.name}</span>
                {country.currencyAbbreviation && (
                  <span className="text-xs text-gray-500">{country.currencyAbbreviation}</span>
                )}
                {country.dateFormat && (
                  <span className="text-xs text-gray-500">{country.dateFormat}</span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-transparent"
                  onClick={() => openEdit(country)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-transparent"
                  onClick={() => void handleDelete(country)}
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
            <DialogTitle>Add Country</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleCreate()
            }}
            className="space-y-4 py-2"
            autoComplete="off"
          >
            <FloatingInput label="Country Name" value={countryName} onChange={(e) => setCountryName(e.target.value)} required autoFocus autoComplete="off" />
            <FloatingInput label="ISD Code" value={isdCode} onChange={(e) => setIsdCode(e.target.value.replace(/[^\d]/g, ""))} autoComplete="off" />
            <FloatingInput
              label="Currency Abbreviation"
              value={currencyAbbreviation}
              onChange={(e) => setCurrencyAbbreviation(e.target.value.toUpperCase())}
              maxLength={10}
              autoComplete="off"
            />
            <FloatingInput
              label="Date Format"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              placeholder="mm/dd/yyyy or dd/mm/yyyy"
              maxLength={20}
              autoComplete="off"
            />
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
            <DialogTitle>Edit Country</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              void handleUpdate()
            }}
            className="space-y-4 py-2"
            autoComplete="off"
          >
            <FloatingInput label="Country Name" value={countryName} onChange={(e) => setCountryName(e.target.value)} required autoFocus autoComplete="off" />
            <FloatingInput label="ISD Code" value={isdCode} onChange={(e) => setIsdCode(e.target.value.replace(/[^\d]/g, ""))} autoComplete="off" />
            <FloatingInput
              label="Currency Abbreviation"
              value={currencyAbbreviation}
              onChange={(e) => setCurrencyAbbreviation(e.target.value.toUpperCase())}
              maxLength={10}
              autoComplete="off"
            />
            <FloatingInput
              label="Date Format"
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              placeholder="mm/dd/yyyy or dd/mm/yyyy"
              maxLength={20}
              autoComplete="off"
            />
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
