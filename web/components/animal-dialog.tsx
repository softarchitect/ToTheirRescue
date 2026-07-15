"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { Animal, AnimalType, AnimalStatus } from "@/lib/types"
import { createAnimal, uploadAnimalImage, fetchPCOOtherRescues, fetchAcquisitionWays, createAcquisitionWay, createPCOOtherRescue, fetchAnimalTypes } from "@/lib/api"
import type { PCOOtherRescue, AcquisitionWay, AnimalTypeDTO } from "@/lib/api"
import type { PCO } from "@/lib/types"
import { Check, Upload, Sparkles, Search } from 'lucide-react'
import { UnsavedChangesDialog } from "@/components/unsaved-changes-dialog"
import { PCOSelector } from "@/components/milestone/pco-selector"
import { dateInputPropsNoFuture, isDateNotInFuture } from "@/lib/date-utils"
import { singularize } from "@/lib/text-utils"

interface AnimalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (animals: Animal[]) => void
  demoMode?: boolean
}

export function AnimalDialog({ open, onOpenChange, onSave, demoMode = false }: AnimalDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [birthDateType, setBirthDateType] = useState<"approximate" | "actual">("approximate")
  const [animalTypeOptions, setAnimalTypeOptions] = useState<AnimalTypeDTO[]>([])
  const [animalTypeError, setAnimalTypeError] = useState<string | null>(null)
  const [selectedAnimalTypeId, setSelectedAnimalTypeId] = useState<number | null>(null)
  const [otherRescues, setOtherRescues] = useState<PCOOtherRescue[]>([])
  const [howAcquiredOptions, setHowAcquiredOptions] = useState<AcquisitionWay[]>([])
  const [isEditingHowAcquired, setIsEditingHowAcquired] = useState(false)
  const [newHowAcquiredDraft, setNewHowAcquiredDraft] = useState("")
  const [isEditingOtherRescue, setIsEditingOtherRescue] = useState(false)
  const [newOtherRescueDraft, setNewOtherRescueDraft] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedPCO, setSelectedPCO] = useState<string>("")
  const [isUnsavedChangesDialogOpen, setIsUnsavedChangesDialogOpen] = useState(false)
  const [intakeCostText, setIntakeCostText] = useState("")
  const [donationAmountText, setDonationAmountText] = useState("")

  const [formData, setFormData] = useState<
    Partial<
      Animal & {
        animalCount: number
        maleCount: number
        femaleCount: number
        unknownCount: number
        color?: string
        chronicCondition?: string
        birthNotes?: string
        approximateYears: number
        approximateMonths: number
        actualBirthDate?: string
        intakeDate: string
        howAcquired?: string
        intakeCost?: number
        donationAmount?: number
        intakeNotes?: string
        otherRescueShelterSanctuary?: string
        idNoUsedAtOtherRescue?: string
        personOrRescueId?: string
        spayedNeutered?: boolean
      }
    >
  >({
    animalCount: 1,
    maleCount: 0,
    femaleCount: 0,
    unknownCount: 0,
    name: "",
    type: "",
    breed: "",
    age: 0,
    gender: "",
    status: "",
    color: "",
    chronicCondition: "",
    arrivalDate: new Date().toISOString().split("T")[0],
    description: "",
    medicalNotes: "",
    imageUrl: "/placeholder.svg?height=400&width=400",
    isWildlife: false,
    birthNotes: "",
    approximateYears: 0,
    approximateMonths: 0,
    intakeDate: new Date().toISOString().split("T")[0],
    howAcquired: undefined,
    intakeCost: 0,
    donationAmount: 0,
    intakeNotes: "",
    otherRescueShelterSanctuary: "",
    idNoUsedAtOtherRescue: "",
    spayedNeutered: false,
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const isSavingRef = useRef(false)
  const submitModeRef = useRef<"save" | "addAnother">("save")

  const isFormDirty = () => {
    // Check if any significant field has been filled
    const hasName = formData.name && formData.name.trim() !== ""
    const hasBreed = formData.breed && formData.breed.trim() !== ""
    const hasCount = (formData.animalCount ?? 1) > 1
    const hasImage = !!imageFile
    const hasNotes = formData.description && formData.description.trim() !== ""
    const hasColor = formData.color && formData.color.trim() !== ""
    const hasChronic = formData.chronicCondition && formData.chronicCondition.trim() !== ""

    return currentStep > 1 || hasName || hasBreed || hasCount || hasImage || hasNotes || hasColor || hasChronic
  }

  const handleDialogClose = (newOpen: boolean) => {
    if (!newOpen && !isSavingRef.current && isFormDirty()) {
      setIsUnsavedChangesDialogOpen(true)
      return
    }
    onOpenChange(newOpen)
  }

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // Reset all form data when dialog is closed
      setFormData({
        animalCount: 1,
        maleCount: 0,
        femaleCount: 0,
        unknownCount: 0,
        name: "",
        type: undefined,
        breed: "",
        age: 0,
        gender: "",
        status: undefined,
        color: "",
        chronicCondition: "",
        arrivalDate: new Date().toISOString().split("T")[0],
        description: "",
        medicalNotes: "",
        imageUrl: "/placeholder.svg?height=400&width=400",
        isWildlife: false,
        birthNotes: "",
        approximateYears: 0,
        approximateMonths: 0,
        intakeDate: new Date().toISOString().split("T")[0],
        howAcquired: undefined,
        intakeCost: 0,
        donationAmount: 0,
        intakeNotes: "",
        otherRescueShelterSanctuary: "",
        idNoUsedAtOtherRescue: "",
        spayedNeutered: false,
      })
      setCurrentStep(1)
      setBirthDateType("approximate")
      setSelectedAnimalTypeId(null)
      setImageFile(null)
      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
      setImagePreviewUrl(null)
      setSelectedPCO("")
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
      setValidationErrors({})
      setAnimalTypeError(null)
      setIntakeCostText("")
      setDonationAmountText("")
    }
  }, [open])

  const sanitizeCurrencyInput = (raw: string) => {
    // Allow only digits and a single decimal point. Keep up to 2 decimals.
    const cleaned = raw.replace(/[^\d.]/g, "")
    const [whole, ...rest] = cleaned.split(".")
    const decimals = rest.join("")
    const normalizedWhole = whole ?? ""
    const normalizedDecimals = decimals.slice(0, 2)
    const hasDot = cleaned.includes(".")
    if (hasDot) {
      return `${normalizedWhole}.${normalizedDecimals}`.replace(/^\./, "0.")
    }
    return normalizedWhole
  }

  const toMoneyNumber = (raw: string) => {
    const n = Number.parseFloat(raw)
    return Number.isFinite(n) ? n : 0
  }

  const normalizeApproximateAge = (yearsRaw?: number, monthsRaw?: number) => {
    const safeYears =
      Number.isFinite(yearsRaw as number) ? Math.max(0, Math.trunc(yearsRaw as number)) : 0
    const safeMonths =
      Number.isFinite(monthsRaw as number) ? Math.max(0, Math.trunc(monthsRaw as number)) : 0
    const totalMonths = safeYears * 12 + safeMonths
    return {
      years: Math.floor(totalMonths / 12),
      months: totalMonths % 12,
    }
  }

  const howAcquiredName =
    howAcquiredOptions.find((w) => String(w.id) === String(formData.howAcquired))?.acquisitionWayName || ""
  const normalizedHowAcquiredName = howAcquiredName.trim().toLowerCase()
  const isOwnerSurrenderIntake =
    normalizedHowAcquiredName.includes("owner") && normalizedHowAcquiredName.includes("surrender")
  const isPublicSurrenderIntake =
    normalizedHowAcquiredName.includes("public") && normalizedHowAcquiredName.includes("surrender")
  const isSurrenderIntake = isOwnerSurrenderIntake || isPublicSurrenderIntake
  const isOtherRescueIntake =
    normalizedHowAcquiredName.includes("other") &&
    (normalizedHowAcquiredName.includes("rescue") ||
      normalizedHowAcquiredName.includes("shelter") ||
      normalizedHowAcquiredName.includes("sanctuary"))

  useEffect(() => {
    if (!open) return

    const fetchAnimalTypesData = async () => {
      try {
        // Fetch animal types for the current user's tenant
        // If roleName is not provided, it will use the authenticated user's tenant
        const apiTypes = await fetchAnimalTypes()

        const validTypes = apiTypes.filter((t) => (t.typeName || "").trim().length > 0)

        if (validTypes.length > 0) {
          setAnimalTypeOptions(validTypes)
          // If there is only one possible type, auto-select it for the user.
          if (validTypes.length === 1) {
            const only = validTypes[0]
            const parsedId = typeof only.id === "number" ? only.id : Number(only.id)
            if (!Number.isNaN(parsedId) && parsedId > 0) {
              setSelectedAnimalTypeId(parsedId)
            }
            setFormData((prev) => ({
              ...prev,
              type: only.typeName,
            }))
            setValidationErrors((prev) => {
              if (!prev.type) return prev
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { type, ...rest } = prev
              return rest
            })
          }
          setAnimalTypeError(null)
        } else {
          setAnimalTypeError("No animal types found.")
        }
      } catch (error) {
        console.error("Failed to load animal types", error)
        setAnimalTypeError("Could not load animal types.")
      }
    }

    const fetchOtherRescues = async () => {
      try {
        const rescues = await fetchPCOOtherRescues()
        setOtherRescues(rescues)
      } catch (error) {
        console.error("Failed to load other rescues", error)
      }
    }

    const fetchHowAcquiredOptions = async () => {
      try {
        const ways = await fetchAcquisitionWays()
        const validWays = ways.filter(
          (w) => w.id && (w.acquisitionWayName || "").trim().length > 0,
        )
        if (validWays.length > 0) {
          setHowAcquiredOptions(validWays)
        } else {
          // Fallback to default options if API returns empty
          // Using placeholder IDs for fallback options
          setHowAcquiredOptions([

          ])
        }
      } catch (error) {
        console.error("Failed to load acquisition ways", error)
        // Fallback to default options on error
        setHowAcquiredOptions([])
      }
    }

    fetchAnimalTypesData()
    fetchOtherRescues()
    fetchHowAcquiredOptions()
  }, [open])


  // Removed auto-selection of first type - type should remain undefined until user selects

  // Removed auto-selection of first howAcquired option - should remain undefined until user selects

  const suggestName = () => {
    const names = {
      dog: ["Buddy", "Max", "Charlie", "Cooper", "Luna", "Bailey", "Daisy", "Rocky"],
      cat: ["Whiskers", "Shadow", "Luna", "Oliver", "Milo", "Simba", "Bella", "Chloe"],
      bird: ["Tweety", "Polly", "Kiwi", "Sky", "Phoenix", "Robin", "Sunny", "Chirp"],
      rabbit: ["Thumper", "Cotton", "Snowball", "Clover", "Hazel", "Pepper", "Bunny", "Hoppy"],
      wildlife: ["Scout", "River", "Forest", "Meadow", "Sage", "Willow", "Storm", "Creek"],
      other: ["Lucky", "Spirit", "Hope", "Joy", "Peace", "Grace", "Star", "Angel"],
    }

    const normalizeTypeForNames = (rawType: string | undefined): keyof typeof names => {
      const t = (rawType || "").toLowerCase()
      if (t.includes("dog")) return "dog"
      if (t.includes("cat")) return "cat"
      if (t.includes("bird")) return "bird"
      if (t.includes("rabbit") || t.includes("bunny")) return "rabbit"
      if (t.includes("wild")) return "wildlife"
      return "other"
    }

    const key = normalizeTypeForNames(formData.type as string | undefined)
    const typeNames = names[key] || names.other
    const randomName = typeNames[Math.floor(Math.random() * typeNames.length)]
    setFormData({ ...formData, name: randomName })
  }

  const handleAddHowAcquired = async () => {
    // First click: switch the How Acquired field from dropdown to input mode
    if (!isEditingHowAcquired) {
      setIsEditingHowAcquired(true)
      setNewHowAcquiredDraft("")
      return
    }

    // Second click (while in input mode): save the new acquisition way
    const trimmed = newHowAcquiredDraft.trim()
    if (!trimmed) {
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
      return
    }

    try {
      // Create the new acquisition way via API
      const newAcquisitionWay = await createAcquisitionWay(trimmed)
      // Update local state with the new acquisition way (includes ID from backend)
      setHowAcquiredOptions((prev) => {
        // Check if already exists by name
        if (prev.some((w) => w.acquisitionWayName === trimmed)) return prev
        return [...prev, {
          id: newAcquisitionWay.id,
          acquisitionWayName: newAcquisitionWay.acquisitionWayName,
        }]
      })
      // Store the ID for backend submission
      setFormData({ ...formData, howAcquired: String(newAcquisitionWay.id) })
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
    } catch (error) {
      console.error("Failed to create acquisition way", error)
      // On error, still add to local state but without ID (will be sent as name)
      const fallbackWay: AcquisitionWay = {
        id: `temp-${Date.now()}`,
        acquisitionWayName: trimmed,
      }
      setHowAcquiredOptions((prev) => {
        if (prev.some((w) => w.acquisitionWayName === trimmed)) return prev
        return [...prev, fallbackWay]
      })
      // Store the name as fallback (backend can handle it)
      setFormData({ ...formData, howAcquired: trimmed })
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
    }
  }

  const handleAddOtherRescue = async () => {
    // First click: switch the Other Rescue field from dropdown to input mode
    if (!isEditingOtherRescue) {
      setIsEditingOtherRescue(true)
      setNewOtherRescueDraft("")
      return
    }

    // Second click (while in input mode): save the new rescue
    const trimmed = newOtherRescueDraft.trim()
    if (!trimmed) {
      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
      return
    }

    try {
      // Use the dedicated endpoint for other rescues to ensure consistent persistence.
      const newRescue = await createPCOOtherRescue(trimmed)

      // Refresh the list of rescues
      const updatedRescues = await fetchPCOOtherRescues()
      setOtherRescues(updatedRescues)

      // Set the newly created rescue as selected.
      if (newRescue && newRescue.id) {
        setFormData({ ...formData, otherRescueShelterSanctuary: String(newRescue.id) })
      }

      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
    } catch (error) {
      console.error("Failed to create other rescue", error)
      alert("Failed to create rescue. Please try again.")
      setIsEditingOtherRescue(false)
      setNewOtherRescueDraft("")
    }
  }

  const validateStep = (step: number): boolean => {
    if (demoMode) {
      setValidationErrors({})
      return true
    }

    const errors: Record<string, string> = {}

    if (step === 1) {
      const count = formData.animalCount ?? 1
      const isGroup = count > 1

      if (!formData.name?.trim()) {
        errors.name = isGroup ? "Group Name is required" : "Name is required"
      }
      if (!formData.breed?.trim()) {
        errors.breed = "Breed/Species is required"
      }

      // Validate animal type is selected
      if (
        !selectedAnimalTypeId ||
        !animalTypeOptions.find((t) => Number(t.id) === Number(selectedAnimalTypeId))
      ) {
        if (animalTypeOptions.length === 0) {
          errors.type = "Animal types are loading. Please wait..."
        } else {
          errors.type = "Please select an animal type"
        }
      }

      // For single-animal intake, sex is required.
      // For group intake, the M/F/Unknown counts capture the distribution.
      if (!isGroup && (!formData.gender || formData.gender.trim() === "")) {
        errors.gender = "Sex is required"
      }

      // Validate status is selected
      if (!formData.status || formData.status.trim() === "") {
        errors.status = "Status is required"
      }

      if (isGroup) {
        const males = formData.maleCount ?? 0
        const females = formData.femaleCount ?? 0
        const unknown = formData.unknownCount ?? 0
        if (males + females + unknown !== count) {
          errors.maleCount = "Males + Females + Unknown must equal Count"
          errors.femaleCount = "Males + Females + Unknown must equal Count"
          errors.unknownCount = "Males + Females + Unknown must equal Count"
        }
      }
    }

    if (step === 2) {
      if (birthDateType === "approximate") {
        const { years, months } = normalizeApproximateAge(
          formData.approximateYears,
          formData.approximateMonths,
        )
        if (years === 0 && months === 0) {
          errors.approximateYears = "Please enter at least one value (Years or Months)"
          errors.approximateMonths = "Please enter at least one value (Years or Months)"
        }
      }
      if (birthDateType === "actual") {
        if (!formData.actualBirthDate || formData.actualBirthDate.trim() === "") {
          errors.actualBirthDate = "Birth Date is required"
        } else if (!isDateNotInFuture(formData.actualBirthDate)) {
          errors.actualBirthDate = "Birth Date cannot be in the future"
        }
      }
    }

    if (step === 3) {
      if (!formData.howAcquired || formData.howAcquired.trim() === "") {
        errors.howAcquired = "How Acquired is required"
      }

      // Intake date must be on/after birth date (but may be equal).
      if (birthDateType === "actual") {
        const intake = (formData.intakeDate || "").trim()
        const birth = (formData.actualBirthDate || "").trim()
        // Both are YYYY-MM-DD; lexicographic compare is safe.
        if (intake && birth && intake < birth) {
          errors.intakeDate = "Intake Date cannot be before Birth Date"
        }
      }

      // Owner Surrender requires selecting a person (owner).
      // Public Surrender shows the list but does not require a selection.
      if (isOwnerSurrenderIntake) {
        if (!selectedPCO && !formData.personOrRescueId) {
          errors.personOrRescueId = "Please select the owner"
        }
      }

      // "Other Rescue/Shelter/Sanctuary" intake requires selecting a rescue.
      if (isOtherRescueIntake) {
        const selectedOtherRescueId = Number(formData.otherRescueShelterSanctuary || "")
        if (
          !formData.otherRescueShelterSanctuary ||
          formData.otherRescueShelterSanctuary.trim() === "" ||
          !Number.isFinite(selectedOtherRescueId) ||
          selectedOtherRescueId <= 0
        ) {
          errors.otherRescueShelterSanctuary = "Please select the rescue/shelter/sanctuary"
        }
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
        setValidationErrors({}) // Clear errors when moving to next step
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    isSavingRef.current = true
    const submitMode = submitModeRef.current
    // Reset back to default so Enter-to-submit behaves like "Save"
    submitModeRef.current = "save"

    try {
      if (demoMode) {
        setValidationErrors({})
        setCurrentStep(1)
        onOpenChange(false)
        return
      }

      // Validate current step before submitting
      if (!validateStep(currentStep)) {
        isSavingRef.current = false
        return
      }

      // Ensure animal types are loaded before proceeding
      if (animalTypeOptions.length === 0) {
        window.alert("Animal types are still loading. Please wait a moment and try again.")
        isSavingRef.current = false
        return
      }

      // Persist animal core fields plus birth / intake milestone-related data.
      const animalCount = formData.animalCount && formData.animalCount > 0 ? formData.animalCount : 1

      // Get the selected animal type ID - ensure it's a valid number
      let animalTypeId: number | null = null

      // First, try to get from selectedAnimalTypeId state
      if (selectedAnimalTypeId !== null && selectedAnimalTypeId !== undefined) {
        const parsed = typeof selectedAnimalTypeId === 'number' ? selectedAnimalTypeId : Number(selectedAnimalTypeId)
        if (!isNaN(parsed) && parsed > 0) {
          animalTypeId = parsed
        }
      }

      // Fallback to first option if selectedAnimalTypeId is invalid
      if (!animalTypeId && animalTypeOptions.length > 0 && animalTypeOptions[0]?.id) {
        const parsed = typeof animalTypeOptions[0].id === 'number' ? animalTypeOptions[0].id : Number(animalTypeOptions[0].id)
        if (!isNaN(parsed) && parsed > 0) {
          animalTypeId = parsed
          // Update state to match
          setSelectedAnimalTypeId(parsed)
        }
      }

      // Validate animal type ID - must be a positive integer
      if (!animalTypeId || isNaN(animalTypeId) || animalTypeId <= 0 || !Number.isInteger(animalTypeId)) {
        window.alert("Please select an animal type. If no types are available, please contact your administrator.")
        isSavingRef.current = false
        return
      }

      // Build payload matching backend expectations
      const normalizedApproximateAge = normalizeApproximateAge(
        formData.approximateYears,
        formData.approximateMonths,
      )
      const payload: any = {
        name: (formData.name || "").trim(),
        animalTypeId: animalTypeId, // Ensure this is always a valid positive integer
        breed: (formData.breed || "").trim(),
        gender: (animalCount > 1 ? "unknown" : (formData.gender || "female")) as "male" | "female" | "unknown",
        status: (formData.status || "") as AnimalStatus,
        color: (formData.color || "").trim() || undefined,
        chronicCondition: (formData.chronicCondition || "").trim() || undefined,
        description: (formData.description || "").trim() || undefined,
        intakeDate: formData.intakeDate,
        animalCount,
        maleCount: animalCount > 1 ? formData.maleCount ?? 0 : undefined,
        femaleCount: animalCount > 1 ? formData.femaleCount ?? 0 : undefined,
        unknownCount: animalCount > 1 ? formData.unknownCount ?? 0 : undefined,
        approximateYears: birthDateType === "approximate" ? normalizedApproximateAge.years : undefined,
        approximateMonths: birthDateType === "approximate" ? normalizedApproximateAge.months : undefined,
        actualBirthDate: birthDateType === "actual" ? formData.actualBirthDate : undefined,
        birthNotes: (formData.birthNotes || "").trim() || undefined,
        howAcquired: (formData.howAcquired || "").trim() || undefined,
        intakeCost: formData.intakeCost || 0,
        donationAmount: formData.donationAmount || 0,
        intakeNotes: (formData.intakeNotes || "").trim() || undefined,
        spayedNeutered: formData.spayedNeutered || false,
      }

      // Add PCO ID if selected (backend accepts both pcoId and personOrRescueId)
      if (formData.personOrRescueId) {
        const parsedPCOId = Number(formData.personOrRescueId)
        if (Number.isFinite(parsedPCOId) && parsedPCOId > 0) {
          payload.pcoId = parsedPCOId
          payload.personOrRescueId = parsedPCOId
        }
      }

      // Add other rescue shelter ID if provided (convert string to number)
      if (isOtherRescueIntake) {
        const selectedOtherRescueId = Number(formData.otherRescueShelterSanctuary || "")
        if (!Number.isFinite(selectedOtherRescueId) || selectedOtherRescueId <= 0) {
          window.alert("Please select the rescue/shelter/sanctuary before saving.")
          isSavingRef.current = false
          return
        }
      }

      if (formData.otherRescueShelterSanctuary) {
        const otherRescueId = Number(formData.otherRescueShelterSanctuary)
        if (!isNaN(otherRescueId) && otherRescueId > 0) {
          payload.otherRescueShelterId = otherRescueId
        }
      }

      // Add other rescue ID number if provided
      if (formData.idNoUsedAtOtherRescue) {
        payload.otherRescueID = (formData.idNoUsedAtOtherRescue || "").trim()
      }

      const createdAnimals = await createAnimal(payload)

      // If an image was chosen, upload it as the primary photo.
      // For multi-animal intake we mirror the legacy behaviour and
      // only allow a photo when there is a single animal.
      if (imageFile && createdAnimals.length === 1 && createdAnimals[0]?.id) {
        try {
          const target = createdAnimals[0]
          const media = await uploadAnimalImage(target.id, imageFile, {
            description: target.name,
            rank: 0,
          })
            ; (target as Animal).imageUrl = media.url
        } catch (err) {
          console.error("Failed to upload animal image", err)
        }
      }

      // Derive age from approximate years if user provided it.
      if (birthDateType === "approximate") {
        const calculatedAge = normalizedApproximateAge.years
        createdAnimals.forEach((a) => {
          ; (a as Animal).age = calculatedAge
        })
      }

      onSave(createdAnimals as Animal[])
      setCurrentStep(1)
      setValidationErrors({}) // Clear errors on successful save

      // Reset form back to defaults for the next add.
      const defaultType = animalTypeOptions.length === 1 ? animalTypeOptions[0] : null
      setFormData({
        animalCount: 1,
        maleCount: 0,
        femaleCount: 0,
        unknownCount: 0,
        name: "",
        type: defaultType?.typeName as AnimalType | undefined,
        breed: "",
        age: 0,
        gender: "female",
        status: "",
        color: "",
        chronicCondition: "",
        arrivalDate: new Date().toISOString().split("T")[0],
        description: "",
        medicalNotes: "",
        imageUrl: "/placeholder.svg?height=400&width=400",
        isWildlife: false,
        birthNotes: "",
        approximateYears: 0,
        approximateMonths: 0,
        intakeDate: new Date().toISOString().split("T")[0],
        howAcquired: undefined,
        intakeCost: 0,
        donationAmount: 0,
        intakeNotes: "",
        otherRescueShelterSanctuary: "",
        idNoUsedAtOtherRescue: "",
        spayedNeutered: false,
      })
      setSelectedAnimalTypeId(defaultType?.id ? Number(defaultType.id) : null)
      setImageFile(null)
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
      setImagePreviewUrl(null)
      setIsEditingHowAcquired(false)
      setNewHowAcquiredDraft("")
      setIntakeCostText("")
      setDonationAmountText("")

      if (submitMode === "save") {
        onOpenChange(false)
      }
    } catch (error: any) {
      console.error("Failed to create animal", error)
      // Basic error feedback for now; can be replaced with a toast later.
      if (typeof window !== "undefined") {
        window.alert(error?.message || "Failed to create animal")
      }
    } finally {
      isSavingRef.current = false
    }
  }

  const count = formData.animalCount ?? 1
  const isGroup = count > 1
  const singleAvailableTypeName =
    animalTypeOptions.length === 1 ? animalTypeOptions[0]?.typeName || "" : ""
  const stepHeading =
    currentStep === 1 ? "Animal Details" : currentStep === 2 ? "Birth Milestone" : "Intake Milestone"

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent className="w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:w-[95vw] sm:max-w-6xl max-h-[90vh] lg:min-w-[42rem] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="relative flex-shrink-0 px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
            <DialogTitle className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 pr-8 text-left">
              <span className="text-lg sm:text-xl font-bold">Add Animal -</span>
              <span className="text-sm font-bold">{stepHeading}</span>
            </DialogTitle>

            <div className="hidden sm:flex items-center justify-between w-full mt-3 min-w-0">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div
                      className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center font-semibold text-xs ${currentStep > step
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white text-primary-foreground"
                        : currentStep === step
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {currentStep > step ? <Check className="h-3 w-3" /> : step}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground truncate">
                      {step === 1 ? "Animal Detail" : step === 2 ? "Birth Milestone" : "Intake Milestone"}
                    </span>
                  </div>
                  {step < 3 && (
                    <div className={`h-0.5 flex-1 mx-2 min-w-2 ${currentStep > step ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="flex sm:hidden items-center justify-center gap-1.5 mt-3" aria-label={`Step ${currentStep} of 3: ${stepHeading}`}>
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${currentStep > step
                      ? "bg-emerald-600 text-white"
                      : currentStep === step
                        ? "bg-emerald-600 text-white"
                        : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {currentStep > step ? <Check className="h-3 w-3" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`h-0.5 w-6 ${currentStep > step ? "bg-emerald-600" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overflow-x-hidden px-4 sm:px-6">
            {/* Step 1: Animal Details */}
            {currentStep === 1 && (
              <div className="py-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-5 max-w-4xl">
                    <div
                      className={`grid gap-3 items-start ${
                        count <= 1
                          ? "grid-cols-1 sm:grid-cols-[180px_minmax(0,1fr)_auto]"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      <FloatingInput
                        id="animalCount"
                        label="Number of Animals"
                        type="number"
                        min="1"
                        className="gap-1.5 min-h-12 px-3 bg-transparent w-full max-w-[180px]"
                        value={formData.animalCount}
                        onChange={(e) => {
                          const parsed = Number.parseInt(e.target.value, 10)
                          setFormData({
                            ...formData,
                            animalCount: Number.isNaN(parsed) ? 1 : Math.max(1, parsed),
                          })
                        }}
                      />

                      <FloatingInput
                        id="name"
                        label={isGroup ? "Group Name" : "Name"}
                        value={formData.name}
                        autoFocus
                        className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required={!demoMode}
                        error={validationErrors.name}
                      />

                      {count <= 1 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={suggestName}
                          className="h-12 px-3 gap-1.5 bg-transparent justify-center w-fit min-w-[108px]"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Suggest
                        </Button>
                      ) : (
                        <FloatingSelect
                          id="type"
                          label="Type"
                          value={formData.type || singleAvailableTypeName}
                          className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                          onValueChange={(value) => {
                            const selectedType = animalTypeOptions.find((t) => t.typeName === value)
                            if (selectedType) {
                              setSelectedAnimalTypeId(Number(selectedType.id))
                              setFormData({ ...formData, type: selectedType.typeName as AnimalType })
                              // Clear validation error when type is selected
                              if (validationErrors.type) {
                                setValidationErrors((prev) => {
                                  const updated = { ...prev }
                                  delete updated.type
                                  return updated
                                })
                              }
                            }
                          }}
                          error={validationErrors.type}
                        >
                          {animalTypeOptions.map((type) => (
                            <SelectItem key={type.id} value={type.typeName}>
                              {count === 1 ? singularize(type.typeName) : type.typeName}
                            </SelectItem>
                          ))}
                        </FloatingSelect>
                      )}
                    </div>
                    {
                      count > 1 ? (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                          <FloatingInput
                            id="breed"
                            label="Breed/Species"
                            value={formData.breed}
                            className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                            required={!demoMode}
                            error={validationErrors.breed}
                          />
                          <FloatingInput
                            id="maleCount"
                            label="Males"
                            type="number"
                            min="0"
                            className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                            value={formData.maleCount}
                            onChange={(e) => {
                              const parsed = Number.parseInt(e.target.value, 10)
                              setFormData({
                                ...formData,
                                maleCount: Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
                              })
                            }}
                            error={validationErrors.maleCount}
                          />
                          <FloatingInput
                            id="femaleCount"
                            label="Females"
                            type="number"
                            min="0"
                            className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                            value={formData.femaleCount}
                            onChange={(e) => {
                              const parsed = Number.parseInt(e.target.value, 10)
                              setFormData({
                                ...formData,
                                femaleCount: Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
                              })
                            }}
                            error={validationErrors.femaleCount}
                          />
                          <FloatingInput
                            id="unknownCount"
                            label="Unknown"
                            type="number"
                            min="0"
                            className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                            value={formData.unknownCount}
                            onChange={(e) => {
                              const parsed = Number.parseInt(e.target.value, 10)
                              setFormData({
                                ...formData,
                                unknownCount: Number.isNaN(parsed) ? 0 : Math.max(0, parsed),
                              })
                            }}
                            error={validationErrors.unknownCount}
                          />
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                          <FloatingSelect
                            id="type"
                            label="Type"
                            value={formData.type || singleAvailableTypeName}
                            className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                            onValueChange={(value) => {
                              const selectedType = animalTypeOptions.find((t) => t.typeName === value)
                              if (selectedType) {
                                setSelectedAnimalTypeId(Number(selectedType.id))
                                setFormData({ ...formData, type: selectedType.typeName as AnimalType })
                                // Clear validation error when type is selected
                                if (validationErrors.type) {
                                  setValidationErrors((prev) => {
                                    const updated = { ...prev }
                                    delete updated.type
                                    return updated
                                  })
                                }
                              }
                            }}
                            error={validationErrors.type}
                          >
                            {animalTypeOptions.map((type) => (
                              <SelectItem key={type.id} value={type.typeName}>
                                {count === 1 ? singularize(type.typeName) : type.typeName}
                              </SelectItem>
                            ))}
                          </FloatingSelect>
                          <FloatingInput
                            id="breed"
                            label="Breed/Species"
                            value={formData.breed}
                            className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                            required={!demoMode}
                            error={validationErrors.breed}
                          />
                          <FloatingSelect
                            id="gender"
                            label="Sex"
                            value={formData.gender || ""}
                            className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                            onValueChange={(value) => {
                              setFormData({ ...formData, gender: value as "male" | "female" | "unknown" })
                              // Clear validation error when gender is selected
                              if (validationErrors.gender) {
                                setValidationErrors((prev) => {
                                  const updated = { ...prev }
                                  delete updated.gender
                                  return updated
                                })
                              }
                            }}
                            error={validationErrors.gender}
                          >
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </FloatingSelect>

                        </div>
                      )
                    }

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-start">
                      <FloatingSelect
                        id="status"
                        label="Status"
                        value={formData.status || ""}
                        className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                        onValueChange={(value) => {
                          setFormData({ ...formData, status: value as AnimalStatus })
                          // Clear validation error when status is selected
                          if (validationErrors.status) {
                            setValidationErrors((prev) => {
                              const updated = { ...prev }
                              delete updated.status
                              return updated
                            })
                          }
                        }}
                        error={validationErrors.status}
                      >
                        <SelectItem value="Adoptable">Adoptable</SelectItem>
                        <SelectItem value="Permanent Resident">Permanent Resident</SelectItem>
                        <SelectItem value="Quarantine Hold">Quarantine Hold</SelectItem>
                        <SelectItem value="Medical Care Hold">Medical Care Hold</SelectItem>
                      </FloatingSelect>
                      <FloatingInput
                        id="color"
                        label="Color"
                        value={formData.color}
                        className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      />
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <Switch
                        id="spayed-neutered"
                        checked={formData.spayedNeutered}
                        onCheckedChange={(checked) => setFormData({ ...formData, spayedNeutered: checked })}
                      />
                      <Label htmlFor="spayed-neutered" className="font-medium">
                        Spayed or Neutered <span className="text-muted-foreground text-xs">(optional)</span>
                      </Label>
                    </div>

                    <FloatingTextarea
                      id="description"
                      label="Notes"
                      labelHint="What do you know about the history of this animal"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {/* Right: Photo area */}
                  <div className="space-y-1.5 lg:sticky lg:top-4 self-start">
                    <label className="text-sm font-medium">
                      Animal Image Upload <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    {count <= 1 ? (
                      <>
                        <div
                          className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
                          onClick={() => {
                            if ((formData.animalCount ?? 1) <= 1) {
                              fileInputRef.current?.click()
                            }
                          }}
                        >
                          {imagePreviewUrl ? (
                            <div className="relative w-full h-64 overflow-hidden rounded-md">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imagePreviewUrl}
                                alt="Selected animal"
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <>
                              <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                              <p className="text-xs font-medium mb-0.5">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                            </>
                          )}
                        </div>

                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/png,image/jpeg"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            if (imagePreviewUrl) {
                              URL.revokeObjectURL(imagePreviewUrl)
                            }
                            setImageFile(file)
                            const url = URL.createObjectURL(file)
                            setImagePreviewUrl(url)
                          }}
                        />
                        {imagePreviewUrl && (
                          <div className="flex justify-end">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-8 px-3 text-red-600 hover:text-red-700"
                              onClick={() => {
                                if (imagePreviewUrl) {
                                  URL.revokeObjectURL(imagePreviewUrl)
                                }
                                setImagePreviewUrl(null)
                                setImageFile(null)
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = ""
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
                        Image upload is available when adding a single animal.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Birth Milestone */}
            {currentStep === 2 && (
              <div className="space-y-3 py-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <Tabs value={birthDateType} onValueChange={(v) => setBirthDateType(v as "approximate" | "actual")}>
                  <TabsList className="grid w-full grid-cols-2 gap-3 bg-transparent p-0">
                    <TabsTrigger
                      value="approximate"
                      className="h-11 rounded-md border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background data-[state=inactive]:text-foreground"
                    >
                      Approximate Age
                    </TabsTrigger>
                    <TabsTrigger
                      value="actual"
                      className="h-11 rounded-md border data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-background data-[state=inactive]:text-foreground"
                    >
                      Actual Birth Date
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="approximate" className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-3">
                      <FloatingInput
                        id="years"
                        label="Years"
                        type="number"
                        min="0"
                        className="gap-1.5 h-15 px-3 bg-transparent w-full"
                        value={formData.approximateYears}
                        onChange={(e) => {
                          const parsedYears = Number.parseInt(e.target.value, 10)
                          const { years, months } = normalizeApproximateAge(
                            Number.isNaN(parsedYears) ? 0 : parsedYears,
                            formData.approximateMonths,
                          )
                          setFormData({ ...formData, approximateYears: years, approximateMonths: months })
                          // Clear validation errors when user starts typing
                          if (validationErrors.approximateYears || validationErrors.approximateMonths) {
                            if (years > 0 || months > 0) {
                              setValidationErrors((prev) => {
                                const updated = { ...prev }
                                delete updated.approximateYears
                                delete updated.approximateMonths
                                return updated
                              })
                            }
                          }
                        }}
                        required={!demoMode}
                        error={validationErrors.approximateYears}
                      />
                      <FloatingInput
                        id="months"
                        label="Months"
                        type="number"
                        min="0"
                        max="11"
                        className="gap-1.5 h-15 px-3 bg-transparent w-full"
                        value={formData.approximateMonths}
                        onChange={(e) => {
                          const parsedMonths = Number.parseInt(e.target.value, 10)
                          const { years, months } = normalizeApproximateAge(
                            formData.approximateYears,
                            Number.isNaN(parsedMonths) ? 0 : parsedMonths,
                          )
                          setFormData({ ...formData, approximateYears: years, approximateMonths: months })
                          // Clear validation errors when user starts typing
                          if (validationErrors.approximateYears || validationErrors.approximateMonths) {
                            if (years > 0 || months > 0) {
                              setValidationErrors((prev) => {
                                const updated = { ...prev }
                                delete updated.approximateYears
                                delete updated.approximateMonths
                                return updated
                              })
                            }
                          }
                        }}
                        required={!demoMode}
                        error={validationErrors.approximateMonths}
                      />
                    </div>
                    <p className="text-sm text-orange-600 bg-orange-50 p-2.5 rounded-lg">
                      Note: If you enter an approximate age, the system will compute an approximate birthdate.
                    </p>
                  </TabsContent>

                  <TabsContent value="actual" className="space-y-3 mt-3">
                    <FloatingInput
                      id="actualBirthDate"
                      label="Birth Date"
                      type="date"
                      className="gap-1.5 h-15 px-3 bg-transparent w-full"
                      value={formData.actualBirthDate}
                      {...dateInputPropsNoFuture}
                      onChange={(e) => {
                        const newDate = e.target.value
                        setFormData({ ...formData, actualBirthDate: newDate })
                        // Clear validation error only when the selected date is valid.
                        if (
                          validationErrors.actualBirthDate &&
                          newDate &&
                          newDate.trim() !== "" &&
                          isDateNotInFuture(newDate)
                        ) {
                          setValidationErrors((prev) => {
                            const updated = { ...prev }
                            delete updated.actualBirthDate
                            return updated
                          })
                        }
                      }}
                      required={!demoMode}
                      error={validationErrors.actualBirthDate}
                    />
                  </TabsContent>
                </Tabs>

                <FloatingTextarea
                  id="birthNotes"
                  label="Birth notes"
                  value={formData.birthNotes}
                  onChange={(e) => setFormData({ ...formData, birthNotes: e.target.value })}
                  rows={3}
                />
              </div>
            )}

            {/* Step 3: Intake Milestone */}
            {currentStep === 3 && (
              <div className="space-y-3 py-3 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <FloatingInput
                    id="intakeDate"
                    label="Intake Date"
                    className="gap-1.5 h-15 px-3 bg-transparent w-full"
                    type="date"
                    value={formData.intakeDate}
                    {...dateInputPropsNoFuture}
                    min={
                      birthDateType === "actual" && formData.actualBirthDate
                        ? formData.actualBirthDate
                        : dateInputPropsNoFuture.min
                    }
                    onChange={(e) => {
                      const next = e.target.value
                      setFormData({ ...formData, intakeDate: next })
                      if (validationErrors.intakeDate) {
                        setValidationErrors((prev) => {
                          const updated = { ...prev }
                          delete updated.intakeDate
                          return updated
                        })
                      }
                    }}
                    error={validationErrors.intakeDate}
                  />
                  <div className="space-y-2">
                    {isEditingHowAcquired ? (
                      <>
                        <FloatingInput
                          id="howAcquired"
                          label="New How Acquired"
                          value={newHowAcquiredDraft}
                          className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                          onChange={(e) => {
                            const value = e.target.value
                            const normalized =
                              value.length > 0
                                ? value.charAt(0).toUpperCase() + value.slice(1)
                                : value
                            setNewHowAcquiredDraft(normalized)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddHowAcquired()
                            }
                          }}
                          required={!demoMode}
                        />
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => {
                            setIsEditingHowAcquired(false)
                            setNewHowAcquiredDraft("")
                          }}>
                            Cancel
                          </Button>
                          <Button type="button" onClick={handleAddHowAcquired}>
                            Add
                          </Button>
                        </div>
                      </>
                    ) : (
                      <FloatingSelect
                        id="howAcquired"
                        label="How Acquired"
                        value={formData.howAcquired}
                        className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                        onValueChange={(value) => {
                          if (value === "__add_new__") {
                            setIsEditingHowAcquired(true)
                            setNewHowAcquiredDraft("")
                            return
                          }
                          setFormData({ ...formData, howAcquired: value })
                          if (validationErrors.howAcquired) {
                            setValidationErrors((prev) => {
                              const updated = { ...prev }
                              delete updated.howAcquired
                              return updated
                            })
                          }
                        }}
                        error={validationErrors.howAcquired}
                      >
                        {howAcquiredOptions.length > 0 ? (
                          howAcquiredOptions.map((option) => (
                            <SelectItem key={String(option.id)} value={String(option.id)}>
                              {option.acquisitionWayName}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="0">
                            No acquisition ways available
                          </SelectItem>
                        )}
                        <SelectItem value="__add_new__">+ Add New How Acquired</SelectItem>
                      </FloatingSelect>
                    )}
                  </div>
                </div>

                {(isOtherRescueIntake) && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        {isEditingOtherRescue ? (
                          <>
                            <FloatingInput
                              id="otherRescueShelterSanctuary"
                              label="New Other Rescue/S..."
                              value={newOtherRescueDraft}
                              className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                              onChange={(e) => {
                                const value = e.target.value
                                const normalized =
                                  value.length > 0
                                    ? value.charAt(0).toUpperCase() + value.slice(1)
                                    : value
                                setNewOtherRescueDraft(normalized)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault()
                                  handleAddOtherRescue()
                                }
                              }}
                              error={validationErrors.otherRescueShelterSanctuary}
                              required={!demoMode}
                            />
                            <div className="flex justify-end gap-2">
                              <Button type="button" variant="outline" onClick={() => {
                                setIsEditingOtherRescue(false)
                                setNewOtherRescueDraft("")
                              }}>
                                Cancel
                              </Button>
                              <Button type="button" onClick={handleAddOtherRescue}>
                                Add
                              </Button>
                            </div>
                          </>
                        ) : (
                          <FloatingSelect
                            id="otherRescueShelterSanctuary"
                            label="Other Shelter/Rescue/Sanctuary"
                            value={formData.otherRescueShelterSanctuary || ""}
                            className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                            onValueChange={(value) => {
                              if (value === "__add_new__") {
                                setIsEditingOtherRescue(true)
                                setNewOtherRescueDraft("")
                                return
                              }
                              setFormData({ ...formData, otherRescueShelterSanctuary: value })
                              if (validationErrors.otherRescueShelterSanctuary) {
                                setValidationErrors((prev) => {
                                  const updated = { ...prev }
                                  delete updated.otherRescueShelterSanctuary
                                  return updated
                                })
                              }
                            }}
                            error={validationErrors.otherRescueShelterSanctuary}
                          >
                            {otherRescues.length > 0 ? (
                              otherRescues.map((rescue) => (
                                <SelectItem key={rescue.id} value={String(rescue.id)}>
                                  {rescue.lastNameOtherRescue || rescue.lastName || rescue.name || `Rescue ${rescue.id}`}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="0" disabled>
                                No rescues available
                              </SelectItem>
                            )}
                            <SelectItem value="__add_new__">+ Add New Other Rescue/Shelter/Sanctuary</SelectItem>
                          </FloatingSelect>
                        )}
                      </div>
                      <FloatingInput
                        id="idNoUsedAtOtherRescue"
                        label="ID No. Used at other rescue"
                        value={formData.idNoUsedAtOtherRescue}
                        className="gap-1.5 h-15 px-3 bg-transparent w-full"
                        onChange={(e) => setFormData({ ...formData, idNoUsedAtOtherRescue: e.target.value })}
                      />
                      <p className="col-span-2 text-xs text-muted-foreground -mt-1">
                        Select the rescue this animal came from.
                      </p>
                    </div>
                  )}
                {isSurrenderIntake && (
                    <div className="space-y-3">
                      {/* <div className="flex items-center gap-2 mb-2">
                        <Button
                          size="sm"
                          className="gap-2 bg-black text-white border-black hover:bg-black/90 hover:text-white"
                          type="button"
                          onClick={() => {
                            if (selectedPCO) {
                              // Navigate to PCO history page
                              sessionStorage.setItem("selectedPCOs", JSON.stringify([{ id: selectedPCO }]))
                              window.open("/pcos/history", "_blank")
                            }
                          }}
                          disabled={!selectedPCO}
                        >
                          PCO History
                        </Button>
                      </div> */}
                      <PCOSelector
                        headerText={
                          isOwnerSurrenderIntake
                            ? "Owner (required)"
                            : "Person (optional)"
                        }
                        addDialogModeOverride={isOwnerSurrenderIntake ? "personNameOnly" : undefined}
                        selectedPCO={selectedPCO}
                        error={validationErrors.personOrRescueId}
                        onSelectPCO={(pcoId) => {
                          setSelectedPCO(pcoId)
                          setFormData((prev) => ({ ...prev, personOrRescueId: pcoId }))
                          if (validationErrors.personOrRescueId) {
                            setValidationErrors((prev) => {
                              const updated = { ...prev }
                              delete updated.personOrRescueId
                              return updated
                            })
                          }
                        }}
                      />
                    </div>
                  )}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <FloatingInput
                      id="intakeCost"
                      label="Intake Cost (USD)"
                      type="text"
                      inputMode="decimal"
                      pattern="^\d*\.?\d{0,2}$"
                      className="gap-1.5 h-15 px-3 bg-transparent w-full"
                      value={intakeCostText}
                      disabled={Number.parseFloat(donationAmountText || "0") > 0}
                      onFocus={() => {
                        if (intakeCostText === "0") setIntakeCostText("")
                      }}
                      onBlur={() => {
                        if (intakeCostText.trim() === "") {
                          setIntakeCostText("")
                          setFormData({ ...formData, intakeCost: 0 })
                        }
                      }}
                      onChange={(e) => {
                        const nextText = sanitizeCurrencyInput(e.target.value)
                        const val = toMoneyNumber(nextText)
                        setIntakeCostText(nextText)
                        setFormData({
                          ...formData,
                          intakeCost: val,
                          ...(val > 0 ? { donationAmount: 0 } : {}),
                        })
                        if (val > 0) {
                          setDonationAmountText("")
                        }
                      }}
                    />
                  </div>
                  <span className="text-muted-foreground text-sm">OR</span>
                  <div className="flex-1">
                    <FloatingInput
                      id="donationAmount"
                      label="Donation Amount (USD)"
                      className="gap-1.5 h-15 px-3 bg-transparent w-full"
                      type="text"
                      inputMode="decimal"
                      pattern="^\d*\.?\d{0,2}$"
                      value={donationAmountText}
                      disabled={Number.parseFloat(intakeCostText || "0") > 0}
                      onFocus={() => {
                        if (donationAmountText === "0") setDonationAmountText("")
                      }}
                      onBlur={() => {
                        if (donationAmountText.trim() === "") {
                          setDonationAmountText("")
                          setFormData({ ...formData, donationAmount: 0 })
                        }
                      }}
                      onChange={(e) => {
                        const nextText = sanitizeCurrencyInput(e.target.value)
                        const val = toMoneyNumber(nextText)
                        setDonationAmountText(nextText)
                        setFormData({
                          ...formData,
                          donationAmount: val,
                          ...(val > 0 ? { intakeCost: 0 } : {}),
                        })
                        if (val > 0) {
                          setIntakeCostText("")
                        }
                      }}
                    />
                  </div>
                </div>

                <FloatingTextarea
                  id="intakeNotes"
                  label="Notes"
                  value={formData.intakeNotes}
                  onChange={(e) => setFormData({ ...formData, intakeNotes: e.target.value })}
                  rows={3}
                />
              </div>
            )}
          </form>

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 flex-shrink-0 border-t">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <Button
                type="button"
                onClick={() => handleDialogClose(false)}
                variant="outline"
                className="h-9 px-4 sm:px-6 flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              {currentStep > 1 && (
                <Button
                  type="button"
                  onClick={handlePrevious}
                  className="h-9 flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Previous
                </Button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext} className="h-9 px-6 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white">
                  Next
                </Button>
              ) : demoMode ? (
                <Button
                  type="button"
                  onClick={(e: any) => {
                    submitModeRef.current = "save"
                    handleSubmit(e)
                  }}
                  className="h-9 px-6 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Next
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={(e: any) => {
                      submitModeRef.current = "addAnother"
                      handleSubmit(e)
                    }}
                    className="h-9 px-4 sm:px-6 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Save and Add Another
                  </Button>
                  <Button
                    type="button"
                    onClick={(e: any) => {
                      submitModeRef.current = "save"
                      handleSubmit(e)
                    }}
                    className="h-9 px-6 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Save
                  </Button>

                </>
              )}
            </div>

          </DialogFooter>
        </DialogContent >
      </Dialog >

      <UnsavedChangesDialog
        open={isUnsavedChangesDialogOpen}
        onOpenChange={setIsUnsavedChangesDialogOpen}
        onConfirm={() => {
          setIsUnsavedChangesDialogOpen(false)
          // We use a small timeout or just set the ref to bypass the check
          // so the parent's onOpenChange(false) can proceed without being blocked
          // by the dirty check in handleDialogClose
          isSavingRef.current = true
          onOpenChange(false)
          // Reset the ref after a tick
          setTimeout(() => {
            isSavingRef.current = false
          }, 100)
        }}
      />
    </>
  )
}
