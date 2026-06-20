"use client"

import { useState, useEffect, useRef } from "react"
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { PCO } from "@/lib/types"

interface AddPCODialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: any) => Promise<boolean>
  pco?: PCO | null
  mode?: "full" | "personOnly" | "rescueOnly" | "personNameOnly"
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

const getDialCode = (country: string) => {
  const normalized = (country || "").trim().toLowerCase()
  if (normalized === "mexico") return "+52"
  // United States and Canada share +1 in our current country list.
  return "+1"
}

export function AddPCODialog({ open, onOpenChange, onSave, pco, mode = "full" }: AddPCODialogProps) {
  const isEditMode = !!pco
  const isPersonOnlyMode = mode === "personOnly"
  const isPersonNameOnlyMode = mode === "personNameOnly"
  const isRescueOnlyMode = mode === "rescueOnly"
  const firstNameInputRef = useRef<HTMLInputElement | null>(null)
  const lastNameInputRef = useRef<HTMLInputElement | null>(null)
  const [tab, setTab] = useState(isRescueOnlyMode ? "company" : "person")
  const [firstName, setFirstName] = useState("")
  const [personFirstNameBackup, setPersonFirstNameBackup] = useState("")
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
  const prevTabRef = useRef(tab)

  // Load PCO data when editing
  useEffect(() => {
    if (pco && open) {
      setFirstName(pco.firstName || "")
      setPersonFirstNameBackup(pco.firstName || "")
      setLastName(pco.lastName || "")
      setEmail(pco.email || "")
      setStreet(pco.street || "")
      setAdditionalStreet(pco.street2 || "")
      setCity(pco.city || "")
      setState(pco.state || "North Carolina")
      setZip(pco.zip || "")
      setPhone(pco.phone || "")
      setOtherPhone(pco.otherPhone || "")
      setWebsite(pco.website || "")
      setIsClinic(pco.hospital || false)
      setIsMailList(pco.mailList || false)
      setIsRescue(pco.rescue || false)
      setHasFlag(pco.flag || false)
      setFlagReason(pco.flagReason || "")
      setNotes(pco.notes || "")

      // Set tab based on entity type
      if (pco.entityType === "CorO" || pco.entityType === "Company" || pco.entityType === "Partner") {
        setTab("company")
      } else {
        setTab("person")
      }
    } else if (!pco && open) {
      // Reset form when adding new
      setFirstName("")
      setPersonFirstNameBackup("")
      setLastName("")
      setEmail("")
      setStreet("")
      setAdditionalStreet("")
      setCity("")
      setState("North Carolina")
      setZip("")
      setPhone("")
      setOtherPhone("")
      setWebsite("")
      setIsClinic(false)
      setIsMailList(true)
      setIsRescue(false)
      setHasFlag(false)
      setFlagReason("")
      setNotes("")
      setTab(isRescueOnlyMode ? "company" : "person")
    }
  }, [pco, open, isRescueOnlyMode])

  useEffect(() => {
    if (prevTabRef.current !== tab) {
      if (tab === "company") {
        if (firstName) {
          setPersonFirstNameBackup(firstName)
          setFirstName("")
        }
      } else if (tab === "person") {
        if (!firstName && personFirstNameBackup) {
          setFirstName(personFirstNameBackup)
        }
        // Company-only fields should not carry over when switching back to person.
        setIsClinic(false)
        setIsRescue(false)
      }
      prevTabRef.current = tab
    }
  }, [tab, firstName, personFirstNameBackup])

  useEffect(() => {
    if (!open) return
    const raf = requestAnimationFrame(() => {
      if (isRescueOnlyMode || tab === "company") {
        lastNameInputRef.current?.focus()
      } else {
        firstNameInputRef.current?.focus()
      }
    })
    return () => cancelAnimationFrame(raf)
  }, [open, tab, isRescueOnlyMode])

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

    // Match backend DB field limits (PCO model)
    const emailTrimmed = email.trim()
    if (emailTrimmed && emailTrimmed.length > 50) {
      errors.email = "Email must be 50 characters or less"
    }
    if (state.trim().length > 50) {
      errors.state = "State must be 50 characters or less"
    }
    if (zip.trim().length > 15) {
      errors.zip = "Zip/Postal Code must be 15 characters or less"
    }
    if (phone.trim().length > 20) {
      errors.phone = "Phone must be 20 characters or less"
    }
    if (otherPhone.trim().length > 20) {
      errors.otherPhone = "Other Phone must be 20 characters or less"
    }
    if (website.trim().length > 100) {
      errors.website = "Website must be 100 characters or less"
    }

    if (hasFlag && !flagReason.trim()) {
      errors.flagReason = "Flag Reason is required when Flag is enabled"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const resetForm = (options?: { keepTab?: boolean }) => {
    setFirstName("")
    setPersonFirstNameBackup("")
    setLastName("")
    setEmail("")
    setStreet("")
    setAdditionalStreet("")
    setCity("")
    setState("North Carolina")
    setZip("")
    setPhone("")
    setOtherPhone("")
    setWebsite("")
    setIsClinic(false)
    setIsMailList(true)
    setIsRescue(false)
    setHasFlag(false)
    setFlagReason("")
    setNotes("")
    setValidationErrors({})
    if (!options?.keepTab) {
      setTab("person")
    }
  }

  const handleSave = async (addAnother: boolean) => {
    if (!validateForm()) {
      return
    }

    const didSave = await onSave({
      id: pco?.id,
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
      addAnother,
    })

    if (didSave && addAnother) {
      resetForm({ keepTab: true })
    }
  }

  const isCompany = tab === "company"
  const showTabs = !isPersonOnlyMode && !isPersonNameOnlyMode && !isRescueOnlyMode
  const showNameOnlyFields = isPersonNameOnlyMode
  const showExtendedPersonFields = !isRescueOnlyMode && !showNameOnlyFields
  const showClinicAndRescueSwitches = mode === "full"
  const showFlagFields = !isRescueOnlyMode

  const dialogTitle = isEditMode
    ? isRescueOnlyMode
      ? "Edit Other Rescue, Shelter, or Sanctuary"
      : isPersonOnlyMode || isPersonNameOnlyMode
        ? "Edit Person"
        : "Edit Person or Partner"
    : isRescueOnlyMode
      ? "Add Other Rescue, Shelter, or Sanctuary"
      : isPersonOnlyMode || isPersonNameOnlyMode
        ? "Add Person"
        : "Add Person or Partner"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl min-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="p-2">
          {showTabs && (
            <Tabs value={tab} onValueChange={setTab} className="mb-6">
              <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0">
                <TabsTrigger
                  value="person"
                  disabled={isEditMode}
                  className="h-11 rounded-md border data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:bg-background data-[state=inactive]:text-foreground"
                >
                  Person
                </TabsTrigger>
                <TabsTrigger
                  value="company"
                  disabled={isEditMode}
                  className="h-11 rounded-md border data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=inactive]:bg-background data-[state=inactive]:text-foreground"
                >
                  Partner
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="space-y-4">
            {isRescueOnlyMode ? (
              <FloatingInput
                ref={lastNameInputRef}
                label="Other Rescue, Shelter, or Sanctuary"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                error={validationErrors.lastName}
              />
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput
                  ref={firstNameInputRef}
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={isCompany}
                  optionalLabel={isCompany ? "Disabled" : "Optional"}
                  error={validationErrors.firstName}
                />
                <FloatingInput
                  ref={lastNameInputRef}
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  error={validationErrors.lastName}
                />
              </div>
            )}

            {showExtendedPersonFields && (
              <>
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
                    <div
                      className="w-20 h-10 px-3 rounded-md border border-input bg-muted/40 text-sm text-muted-foreground flex items-center justify-center select-none"
                      aria-hidden="true"
                    >
                      {getDialCode(country)}
                    </div>
                    <FloatingInput
                      label="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={validationErrors.phone}
                      className="flex-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-20 h-10 px-3 rounded-md border border-input bg-muted/40 text-sm text-muted-foreground flex items-center justify-center select-none"
                      aria-hidden="true"
                    >
                      {getDialCode(country)}
                    </div>
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
              </>
            )}

            {showClinicAndRescueSwitches && (
              <div className="flex items-center justify-between">
                {isCompany ? (
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Label>Animal Clinic/Hospital:</Label>
                      <Switch checked={isClinic} onCheckedChange={setIsClinic} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Label>Other Rescues:</Label>
                      <Switch checked={isRescue} onCheckedChange={setIsRescue} />
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                <div className="flex items-center gap-3">
                  <Label>Mail List?:</Label>
                  <Switch checked={isMailList} onCheckedChange={setIsMailList} />
                  <span className="text-xs text-blue-600">Yes</span>
                </div>
              </div>
            )}

            {showFlagFields && showExtendedPersonFields && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label>Flag:</Label>
                  <Switch checked={hasFlag} onCheckedChange={setHasFlag} />
                  <span className="text-xs text-muted-foreground">optional</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {showFlagFields && showExtendedPersonFields && (
                <FloatingTextarea
                  label="Flag Reason"
                  value={flagReason}
                  onChange={(e) => setFlagReason(e.target.value)}
                  rows={4}
                  disabled={!hasFlag}
                  required={hasFlag}
                  error={validationErrors.flagReason}
                />
              )}
              <FloatingTextarea
                label="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                error={validationErrors.notes}
                className={showFlagFields && showExtendedPersonFields ? "" : "col-span-2"}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {!isEditMode && (
            <Button onClick={() => handleSave(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save and Add Another
            </Button>
          )}
          <Button onClick={() => handleSave(false)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {isEditMode ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
