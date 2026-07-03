"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Check } from "lucide-react"
import { postJson } from "@/lib/api"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function OnboardingPage() {
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [animalTypeSlots, setAnimalTypeSlots] = useState<string[]>(["", "", "", "", "", ""])
  const [animalTypes, setAnimalTypes] = useState<string[]>([])
  const [animalTypeError, setAnimalTypeError] = useState<string | null>(null)
  const [otherRescues, setOtherRescues] = useState<string[]>(["", "", ""])
  const [clinics, setClinics] = useState<string[]>(["", "", ""])
  const [showAddAnimalIntro, setShowAddAnimalIntro] = useState(false)
  const [showOnboardingWelcomeModal, setShowOnboardingWelcomeModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const firstClinicInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const isDemoMode =
    searchParams.get("onboardingMode") === "guided" || searchParams.get("demo") === "1"
  const needsDemoParamNormalization =
    searchParams.get("demo") === "1" && searchParams.get("onboardingMode") !== "guided"
  const onboardingQueryString = searchParams.toString()

  const isLastStep = currentStep === 3

  const handleNext = async () => {
    // Step 1 validation: require at least one animal type
    if (currentStep === 1) {
      const seen = new Set<string>()
      const cleaned: string[] = []

      for (const raw of animalTypeSlots) {
        const value = raw.trim()
        if (!value) continue
        const key = value.toLowerCase()
        if (seen.has(key)) {
          setAnimalTypeError("Please remove duplicate animal types.")
          return
        }
        seen.add(key)
        cleaned.push(value)
      }

      if (!isDemoMode && cleaned.length === 0) {
        setAnimalTypeError("Please add at least one animal type.")
        return
      }

      setAnimalTypes(cleaned)
      setAnimalTypeError(null)
    }

    if (!isLastStep) {
      setCurrentStep((s) => s + 1)
      return
    }

    // Last step: call onboarding API, then show Add Animal intro on success
    try {
      if (isDemoMode) {
        setShowAddAnimalIntro(true)
        return
      }

      setIsSubmitting(true)
      setSubmitError(null)

      await postJson("/api/onboarding/add-onboarding", {
        animalTypes,
        otherRescues: otherRescues.filter((r) => r.trim() !== ""),
        clinics: clinics.filter((c) => c.trim() !== ""),
      })

      // Success - related data (behaviors, vaccinations, procedures, medicines, volunteer activities)
      // has been automatically copied from Super Admin templates
      setShowAddAnimalIntro(true)
    } catch (err: any) {
      setSubmitError(err.message || "Unable to save onboarding information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  // Normalize legacy demo query param to the neutral onboarding mode key.
  useEffect(() => {
    if (!needsDemoParamNormalization) return
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete("demo")
    nextParams.set("onboardingMode", "guided")
    router.replace(`/onboarding?${nextParams.toString()}`)
  }, [needsDemoParamNormalization, router, searchParams])

  useEffect(() => {
    if (needsDemoParamNormalization) return

    const guardedUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`
    const createGuardState = () => ({
      ...(window.history.state ?? {}),
      onboardingBackGuard: true,
    })

    if (!window.history.state?.onboardingBackGuard) {
      window.history.pushState(createGuardState(), "", guardedUrl)
    }

    const handleBrowserBack = () => {
      window.history.pushState(createGuardState(), "", guardedUrl)
    }

    window.addEventListener("popstate", handleBrowserBack)
    return () => window.removeEventListener("popstate", handleBrowserBack)
  }, [needsDemoParamNormalization, onboardingQueryString])

  useEffect(() => {
    setShowOnboardingWelcomeModal(true)
  }, [])

  useEffect(() => {
    if (showAddAnimalIntro || currentStep !== 3) return
    const raf = requestAnimationFrame(() => {
      firstClinicInputRef.current?.focus()
    })
    return () => cancelAnimationFrame(raf)
  }, [currentStep, showAddAnimalIntro])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 bg-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-3xl blur-xl opacity-20" />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Image
                  src="/rabbit-logo.png"
                  alt="To Their Rescue"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  To Their Rescue
                </h1>
              </div>
              {!showAddAnimalIntro ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Let&apos;s get you onboarded</h2>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Now let&apos;s enter your first animal.</h2>
                </>
              )}
            </div>

            {!showAddAnimalIntro ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (isSubmitting) return
                  void handleNext()
                }}
              >
                {/* Progress Indicator - similar style to register page */}
                <div className="flex items-center justify-center gap-4 mb-8">
                  {/* Step 1 */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${currentStep >= 1
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                        : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {currentStep > 1 ? <Check className="w-5 h-5" /> : "1"}
                    </div>
                  </div>
                  {/* Connector 1 */}
                  <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                      initial={{ width: "0%" }}
                      animate={{ width: currentStep >= 2 ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {/* Step 2 */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${currentStep >= 2
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                        : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      {currentStep > 2 ? <Check className="w-5 h-5" /> : "2"}
                    </div>
                  </div>
                  {/* Connector 2 */}
                  <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                      initial={{ width: "0%" }}
                      animate={{ width: currentStep >= 3 ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {/* Step 3 */}
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${currentStep >= 3
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
                        : "bg-gray-200 text-gray-500"
                        }`}
                    >
                      3
                    </div>
                  </div>
                </div>

                {/* Step content */}
                <div className="space-y-4 mb-8">
                  {currentStep === 1 ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900">What types of animals do you rescue?</h3>
                      <p className="text-gray-700">Use plural. For example: Dogs, Cats, Horses.</p>
                      <p className="text-sm text-gray-500">Add each animal type your rescue works with.</p>
                      <p className="text-sm text-emerald-600 mt-2 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
                        <strong>Note:</strong> Related behaviors, vaccinations, procedures, medicines, and volunteer activities will be automatically copied from master templates.
                      </p>

                      <div className="space-y-3 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {animalTypeSlots.map((value, index) => (
                            <div
                              key={index}
                              className="rounded-xl border border-emerald-100 bg-white/60 p-4 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-gray-800">
                                  Animal type {index + 1}
                                </p>
                                {index >= 3 && <span className="text-xs text-gray-400">optional</span>}
                              </div>
                              <Input
                                autoFocus={index === 0}
                                value={value}
                                onChange={(e) => {
                                  const next = [...animalTypeSlots]
                                  next[index] = e.target.value
                                  setAnimalTypeSlots(next)
                                  if (animalTypeError) setAnimalTypeError(null)
                                }}
                                className="h-11"
                              />
                            </div>
                          ))}
                        </div>

                        {animalTypeError && <p className="text-sm text-red-600">{animalTypeError}</p>}
                      </div>
                    </>
                  ) : currentStep === 2 ? (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900">
                        What other rescues do you take animals from or transfer animals to?
                      </h3>
                      <p className="text-gray-700">List a few partner rescues you work with. These are optional.</p>
                      <div className="space-y-3 mt-4">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="w-4 text-right text-gray-700">{index + 1}.</span>
                            <div className="flex-1 relative">
                              <Input
                                autoFocus={index === 0 && currentStep === 2}
                                value={otherRescues[index]}
                                onChange={(e) => {
                                  const next = [...otherRescues]
                                  next[index] = e.target.value
                                  setOtherRescues(next)
                                }}
                                className="h-11 pr-20"
                              />
                              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                                optional
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold text-gray-900">
                        What are some of the animal clinics/hospitals that you work with?
                      </h3>
                      <p className="text-gray-700">
                        Add clinics or hospitals you partner with for veterinary care. These are optional.
                      </p>
                      <div className="space-y-3 mt-4">
                        {[0, 1, 2].map((index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="w-4 text-right text-gray-700">{index + 1}.</span>
                            <div className="flex-1 relative">
                              <Input
                                ref={index === 0 ? firstClinicInputRef : undefined}
                                autoFocus={index === 0 && currentStep === 3}
                                value={clinics[index]}
                                onChange={(e) => {
                                  const next = [...clinics]
                                  next[index] = e.target.value
                                  setClinics(next)
                                }}
                                className="h-11 pr-20"
                              />
                              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-400">
                                optional
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Navigation buttons */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentStep === 1 || isSubmitting}
                    onClick={handleBack}
                    className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
                  >
                    {isLastStep
                      ? (isDemoMode ? "Next" : (isSubmitting ? "Saving..." : "Finish"))
                      : "Next"}
                  </Button>
                </div>
                {submitError && (
                  <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {submitError}
                  </p>
                )}
              </form>
            ) : (
              <form
                className="text-center space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  router.push(
                    isDemoMode
                      ? "/animals?addAnimal=1&onboardingMode=guided"
                      : "/animals?addAnimal=1",
                  )
                }}
              >
                <p className="text-xl font-semibold text-gray-900">
                  Entering an animal requires 3 steps:
                </p>
                <ol className="inline-block text-left space-y-1 text-gray-800">
                  <li>1. Entering some details about the animal</li>
                  <li>2. Entering information about its age</li>
                  <li>3. Saying how you obtained this animal</li>
                </ol>
                <div className="pt-4">
                  <Button
                    type="submit"
                    className="px-10 py-6 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Add Animal
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
      <Dialog open={showOnboardingWelcomeModal} onOpenChange={() => { }}>
        <DialogContent
          showCloseButton={false}
          className="max-w-2xl"
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader className="space-y-3 text-left">
            <DialogTitle className="text-2xl font-bold text-gray-900">Welcome!</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 text-base text-gray-700 leading-relaxed">
                <p>
                  Our onboarding process will guide you through a brief set of questions designed to help us understand your mission and to automatically populate dropdowns throughout the system.
                </p>
                <p>
                  You&apos;ll also add your first animal. After that, you can continue by entering additional details about that animal, adding more animals, creating your family of people, partners, and volunteers, and exploring all the many features of TTR.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setShowOnboardingWelcomeModal(false)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
            >
              Next
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
