"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { FloatingSelect } from "@/components/ui/floating-select"
import { SelectItem } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { Animal, AnimalType, AnimalStatus } from "@/lib/types"
import { getJson, createAnimal } from "@/lib/api"
import { Check, Upload, Sparkles, Copy, Plus, SaveIcon, X, ChevronLeft } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AnimalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (animal: Animal) => void
}

export function AnimalDialog({ open, onOpenChange, onSave }: AnimalDialogProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [birthDateType, setBirthDateType] = useState<"approximate" | "actual">("approximate")
  const [animalTypeOptions, setAnimalTypeOptions] = useState<string[]>([
    "Dog",
    "Cat",
    "Bird",
    "Rabbit",
    "Wildlife",
    "Other",
  ])
  const [animalTypeError, setAnimalTypeError] = useState<string | null>(null)
  const [isEditingType, setIsEditingType] = useState(false)
  const [newTypeDraft, setNewTypeDraft] = useState("")

  const [formData, setFormData] = useState<
    Partial<
      Animal & {
        animalCount: number
        color?: string
        chronicCondition?: string
        birthNotes?: string
        approximateYears: number
        approximateMonths: number
        actualBirthDate?: string
        intakeDate: string
        howAcquired?: string
        intakeCost?: number
        intakeNotes?: string
      }
    >
  >({
    animalCount: 1,
    name: "",
    type: "dog",
    breed: "",
    age: 0,
    gender: "female",
    status: "available",
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
    howAcquired: "",
    intakeCost: 0,
    intakeNotes: "",
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open) return

    const fetchAnimalTypes = async () => {
      try {
        const res = await getJson<{
          success?: boolean
          statusCode?: number
          data?: { animalTypes?: { id: number | string; typeName: string }[] }
        }>("/api/animaltype/get-animal-types?roleName=Administrator")

        const apiTypes = res?.data?.animalTypes ?? []
        const names = Array.from(
          new Set(
            apiTypes
              .map((t) => (t.typeName || "").trim())
              .filter((t) => t.length > 0),
          ),
        )

        if (names.length > 0) {
          setAnimalTypeOptions(names)
        }
      } catch (error) {
        console.error("Failed to load animal types", error)
        setAnimalTypeError("Could not load animal types, using defaults.")
      }
    }

    fetchAnimalTypes()
  }, [open])

  useEffect(() => {
    // Ensure the current formData.type is always one of the available options,
    // defaulting to the first option if needed.
    setFormData((prev) => {
      if (animalTypeOptions.length === 0) return prev
      if (!prev.type || !animalTypeOptions.includes(prev.type)) {
        return { ...prev, type: animalTypeOptions[0] as AnimalType }
      }
      return prev
    })
  }, [animalTypeOptions])

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

  const handleAddAnimalType = () => {
    // First click: switch the Type field from dropdown to input mode
    if (!isEditingType) {
      setIsEditingType(true)
      setNewTypeDraft("")
      return
    }

    // Second click (while in input mode): save the new type
    const trimmed = newTypeDraft.trim()
    if (!trimmed) {
      setIsEditingType(false)
      setNewTypeDraft("")
      return
    }

    setAnimalTypeOptions((prev) => {
      if (prev.includes(trimmed)) return prev
      return [...prev, trimmed]
    })
    setFormData({ ...formData, type: trimmed as AnimalType })
    setIsEditingType(false)
    setNewTypeDraft("")
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.name?.trim()) {
        errors.name = "Name is required"
      }
      if (!formData.breed?.trim()) {
        errors.breed = "Breed/Species is required"
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

    // Validate current step before submitting
    if (!validateStep(currentStep)) {
      return
    }

    // Persist animal core fields plus birth / intake milestone-related data.
    const payload = {
      name: (formData.name || "").trim(),
      type: (formData.type ||
        (animalTypeOptions[0] as AnimalType)) as AnimalType,
      breed: (formData.breed || "").trim(),
      gender: (formData.gender || "female") as "male" | "female" | "unknown",
      status: (formData.status || "available") as AnimalStatus,
      color: (formData.color || "").trim() || undefined,
      chronicCondition: (formData.chronicCondition || "").trim() || undefined,
      description: (formData.description || "").trim() || undefined,
      intakeDate: formData.intakeDate,
      animalCount: formData.animalCount,
      approximateYears: birthDateType === "approximate" ? formData.approximateYears : undefined,
      approximateMonths: birthDateType === "approximate" ? formData.approximateMonths : undefined,
      actualBirthDate: birthDateType === "actual" ? formData.actualBirthDate : undefined,
      birthNotes: (formData.birthNotes || "").trim() || undefined,
      howAcquired: (formData.howAcquired || "").trim() || undefined,
      intakeCost: formData.intakeCost,
      // The Donation Amount input is currently not bound into formData
      // so we only send intakeCost + notes for now.
      intakeNotes: (formData.intakeNotes || "").trim() || undefined,
    }

    try {
      const created = await createAnimal(payload)

      // Derive age from approximate years if user provided it.
      if (birthDateType === "approximate") {
        const calculatedAge = formData.approximateYears || 0
        created.age = calculatedAge
      }

      onSave(created as Animal)
      setCurrentStep(1)
      setValidationErrors({}) // Clear errors on successful save
      onOpenChange(false)

      // Reset form back to defaults for the next add.
      setFormData({
        animalCount: 1,
        name: "",
        type: "dog",
        breed: "",
        age: 0,
        gender: "female",
        status: "available",
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
        howAcquired: "",
        intakeCost: 0,
        intakeNotes: "",
      })
    } catch (error: any) {
      console.error("Failed to create animal", error)
      // Basic error feedback for now; can be replaced with a toast later.
      if (typeof window !== "undefined") {
        window.alert(error?.message || "Failed to create animal")
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] min-w-2xl flex flex-col p-0">
        <DialogHeader className="relative flex-shrink-0 px-6 pt-6 pb-3">
          <DialogTitle className="text-xl font-bold">Add Animal - Animal Details</DialogTitle>

          <div className="flex items-center gap-2 mt-3">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs ${
                      currentStep > step
                        ? "bg-primary text-primary-foreground"
                        : currentStep === step
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step ? <Check className="h-3 w-3" /> : step}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">
                    {step === 1 ? "Animal Detail" : step === 2 ? "Birth Milestone" : "Intake Milestone"}
                  </span>
                </div>
                {step < 3 && <div className={`h-0.5 w-8 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6">
          {/* Step 1: Animal Details */}
          {currentStep === 1 && (
            <div className="space-y-5 py-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-3 gap-3 items-start">
                <FloatingInput
                  id="animalCount"
                  label="Count"
                  type="number"
                  min="1"
                  className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                  value={formData.animalCount}
                  onChange={(e) =>
                    setFormData({ ...formData, animalCount: Number.parseInt(e.target.value) || 1 })
                  }
                />

                <FloatingInput
                  id="name"
                  label="Name"
                  value={formData.name}
                  className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  error={validationErrors.name}
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={suggestName}
                  className="gap-1.5 min-h-12 bg-transparent justify-start"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Suggest
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-3 items-start">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    {isEditingType ? (
                      <FloatingInput
                        id="type"
                        label="New Type"
                        value={newTypeDraft}
                        className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                        onChange={(e) => {
                          const value = e.target.value
                          const normalized =
                            value.length > 0
                              ? value.charAt(0).toUpperCase() + value.slice(1)
                              : value
                          setNewTypeDraft(normalized)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddAnimalType()
                          }
                        }}
                        required
                      />
                    ) : (
                      <FloatingSelect
                        id="type"
                        label="Type"
                        value={formData.type}
                          className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value as AnimalType })
                        }
                      >
                        {animalTypeOptions.map((typeName) => (
                          <SelectItem key={typeName} value={typeName}>
                            {typeName}
                          </SelectItem>
                        ))}
                      </FloatingSelect>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-10"
                    onClick={handleAddAnimalType}
                  >
                    {isEditingType ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  </Button>
                </div>

                <FloatingInput
                  id="breed"
                  label="Breed/Species"
                  value={formData.breed}
                  className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  required
                  error={validationErrors.breed}
                />

                <FloatingSelect
                  id="gender"
                  label="Gender"
                  value={formData.gender}
                  className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value as "male" | "female" })
                  }
                >
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                </FloatingSelect>
              </div>

              <div className="grid grid-cols-3 gap-3 items-start">
                <FloatingInput
                  id="color"
                  label="Color"
                  value={formData.color}
                  className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />

                <FloatingInput
                  id="chronicCondition"
                  label="Condition"
                  value={formData.chronicCondition}
                  className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                  onChange={(e) => setFormData({ ...formData, chronicCondition: e.target.value })}
                />

                <FloatingSelect
                  id="status"
                  label="Status"
                  value={formData.status}
                  className="gap-1.5 min-h-12 px-3 bg-transparent w-full"
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value as AnimalStatus })
                  }
                >
                  <SelectItem value="available">Adoptable</SelectItem>
                  <SelectItem value="fostered">Permanent Resident</SelectItem>
                  <SelectItem value="quarantine">Quarantine Hold</SelectItem>
                  <SelectItem value="medical">Medical Care</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                  <SelectItem value="released">Released</SelectItem>
                </FloatingSelect>
              </div>

              <FloatingTextarea
                id="description"
                label="Notes"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Animal Image Upload</label>
                <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xs font-medium mb-0.5">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Birth Milestone */}
          {currentStep === 2 && (
            <div className="space-y-3 py-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <Tabs value={birthDateType} onValueChange={(v) => setBirthDateType(v as "approximate" | "actual")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="approximate">Approximate Age</TabsTrigger>
                  <TabsTrigger value="actual">Actual Birth Date</TabsTrigger>
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
                      onChange={(e) =>
                        setFormData({ ...formData, approximateYears: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                    <FloatingInput
                      id="months"
                      label="Months"
                      type="number"
                      min="0"
                      max="11"
                      className="gap-1.5 h-15 px-3 bg-transparent w-full"
                      value={formData.approximateMonths}
                      onChange={(e) =>
                        setFormData({ ...formData, approximateMonths: Number.parseInt(e.target.value) || 0 })
                      }
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
                    value={formData.actualBirthDate}
                    onChange={(e) => setFormData({ ...formData, actualBirthDate: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, intakeDate: e.target.value })}
                />
                <FloatingSelect
                  id="howAcquired"
                  label="How Acquired"
                  value={formData.howAcquired}
                  className="gap-1.5 min-h-15 px-3 bg-transparent w-full"
                  onValueChange={(value) => setFormData({ ...formData, howAcquired: value })}
                >
                  <SelectItem value="stray">Stray</SelectItem>
                  <SelectItem value="surrender">Owner Surrender</SelectItem>
                  <SelectItem value="rescue">Rescue</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="wildlife">Wildlife Rescue</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </FloatingSelect>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <FloatingInput
                    id="intakeCost"
                    label="Intake Cost"
                    type="number"
                    min="0"
                    step="0.01"
                    className="gap-1.5 h-15 px-3 bg-transparent w-full"
                    value={formData.intakeCost}
                    onChange={(e) => setFormData({ ...formData, intakeCost: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <span className="text-muted-foreground text-sm">OR</span>
                <div className="flex-1">
                  <FloatingInput id="donationAmount" label="Donation Amount"   className="gap-1.5 h-15 px-3 bg-transparent w-full" type="number" min="0" step="0.01" />
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

        <DialogFooter className="flex items-center justify-between px-6 py-3 border-t flex-shrink-0">
          <TooltipProvider>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="h-9 w-9"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cancel</TooltipContent>
              </Tooltip>

              {currentStep > 1 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handlePrevious}
                      className="h-9 w-9 bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Previous</TooltipContent>
                </Tooltip>
              )}
            </div>

            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNext} className="h-9 px-6">
                  Next
                </Button>
              ) : (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={(e: any) => handleSubmit(e)}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save and Clone</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={(e: any) => handleSubmit(e)}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save and Add Another</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" onClick={(e: any) => handleSubmit(e)} size="icon" className="h-9 w-9">
                        <SaveIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Save</TooltipContent>
                  </Tooltip>
                </>
              )}
            </div>
          </TooltipProvider>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
