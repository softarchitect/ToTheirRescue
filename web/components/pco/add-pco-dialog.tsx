"use client"

import { useState } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AddPCODialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => void
}

const countryStates: Record<string, string[]> = {
  "United States": [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ],
  "Canada": [
    "Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador",
    "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island",
    "Quebec", "Saskatchewan", "Yukon"
  ],
  "Mexico": [
    "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas", "Chihuahua",
    "Coahuila", "Colima", "Durango", "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Mexico City",
    "Michoacán", "Morelos", "Nayarit", "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo",
    "San Luis Potosí", "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
  ]
}

export function AddPCODialog({ open, onOpenChange, onSave }: AddPCODialogProps) {
  const [tab, setTab] = useState("person")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [street, setStreet] = useState("")
  const [additionalStreet, setAdditionalStreet] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("United States")
  const [state, setState] = useState("North Carolina")
  const [zip, setZip] = useState("")
  const [phone, setPhone] = useState("")
  const [otherPhone, setOtherPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [isClinic, setIsClinic] = useState(false)
  const [isMailList, setIsMailList] = useState(true)
  const [isRescue, setIsRescue] = useState(false)
  const [hasFlag, setHasFlag] = useState(false)
  const [flagReason, setFlagReason] = useState("")
  const [notes, setNotes] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleCountryChange = (newCountry: string) => {
    setCountry(newCountry)
    const states = countryStates[newCountry]
    if (states && states.length > 0) {
      setState(states[0])
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Last name is required for both person and company
    if (!lastName.trim()) {
      errors.lastName = "Last Name is required"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    onSave({
      type: tab,
      firstName,
      lastName,
      email,
      street,
      additionalStreet,
      city,
      country,
      state,
      zip,
      phone,
      otherPhone,
      website,
      isClinic,
      isMailList,
      isRescue,
      hasFlag,
      flagReason,
      notes,
    })

    // Clear validation errors on successful save
    setValidationErrors({})
  }

  const isCompany = tab === "company"

  if (!open) return null

  return (
    <>
      <div
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200 "
      />

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold">Add Person, Company or Organization</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <Tabs value={tab} onValueChange={setTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="person">Person</TabsTrigger>
                <TabsTrigger value="company">Company Or Organization</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isCompany}
                    error={validationErrors.firstName}
                  />
                  <FloatingInput
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    error={validationErrors.lastName}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={validationErrors.email}
                  />
                  <FloatingInput
                    label="Street Address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    error={validationErrors.street}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Additional Street"
                    value={additionalStreet}
                    onChange={(e) => setAdditionalStreet(e.target.value)}
                    error={validationErrors.additionalStreet}
                  />
                  <FloatingInput
                    label="City Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    error={validationErrors.city}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Select value={country} onValueChange={handleCountryChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[110]">
                      <SelectItem value="United States">United States</SelectItem>
                      <SelectItem value="Canada">Canada</SelectItem>
                      <SelectItem value="Mexico">Mexico</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[110]">
                      {countryStates[country]?.map((stateName) => (
                        <SelectItem key={stateName} value={stateName}>
                          {stateName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FloatingInput
                    label="Zip/Postal Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    error={validationErrors.zip}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2">
                    <Select defaultValue="+1">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[110]">
                        <SelectItem value="+1">+1</SelectItem>
                      </SelectContent>
                    </Select>
                    <FloatingInput
                      label="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={validationErrors.phone}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select defaultValue="+1">
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[110]">
                        <SelectItem value="+1">+1</SelectItem>
                      </SelectContent>
                    </Select>
                    <FloatingInput
                      label="Other Phone"
                      value={otherPhone}
                      onChange={(e) => setOtherPhone(e.target.value)}
                      error={validationErrors.otherPhone}
                      className="flex-1"
                    />
                  </div>
                </div>

                <FloatingInput
                  label="Website, Facebook, or any other URL"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  error={validationErrors.website}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Label>Animal Clinic/Hospital:</Label>
                    <Switch checked={isClinic} onCheckedChange={setIsClinic} disabled={!isCompany} />
                    <span className="text-xs text-muted-foreground">{isCompany ? "" : "disabled"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label>Mail List?:</Label>
                    <Switch checked={isMailList} onCheckedChange={setIsMailList} />
                    <span className="text-xs text-blue-600">Yes</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Label>Other Animal Rescue/Shelter:</Label>
                    <Switch checked={isRescue} onCheckedChange={setIsRescue} disabled={!isCompany} />
                    <span className="text-xs text-muted-foreground">{isCompany ? "" : "disabled"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label>Flag:</Label>
                    <Switch checked={hasFlag} onCheckedChange={setHasFlag} />
                    <span className="text-xs text-muted-foreground">optional</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FloatingTextarea
                    label="Flag Reason"
                    value={flagReason}
                    onChange={(e) => setFlagReason(e.target.value)}
                    rows={4}
                    disabled={!hasFlag}
                    error={validationErrors.flagReason}
                  />
                  <FloatingTextarea
                    label="Notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    error={validationErrors.notes}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-primary">
                Save and Add Another
              </Button>
              <Button onClick={handleSave} className="bg-primary">
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
