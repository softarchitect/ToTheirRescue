"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, PawPrint, Mail, CheckCircle2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { postJson } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const [verificationError, setVerificationError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    // Step 1: Organization Info
    organizationName: "",
    acronym: "",
    street: "",
    city: "",
    state: "",
    country: "",
    website: "",
    // Step 2: Personal Info
    firstName: "",
    lastName: "",
    email: "",
    userId: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const handleSendVerificationCode = async () => {
    if (!formData.email) {
      setVerificationError("Please enter an email address first")
      return
    }

    setIsSendingCode(true)
    setVerificationError("")

    try {
      await postJson("/api/otp/otp-generate", {
        email: formData.email,
        firstName: formData.firstName,
      })
      setEmailVerificationSent(true)
    } catch (err: any) {
      setVerificationError(err.message || "Unable to send verification code. Please try again.")
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerificationError("Please enter the verification code")
      return
    }

    setIsVerifying(true)
    setVerificationError("")

    try {
      await postJson("/api/otp/otp-verify", {
        email: formData.email,
        otp: verificationCode,
      })
      setIsEmailVerified(true)
      setVerificationError("")
    } catch (err: any) {
      setVerificationError(err.message || "Invalid verification code. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleNext = () => {
    if (step < 2) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isEmailVerified) {
      setVerificationError("Please verify your email address before continuing")
      return
    }

    const run = async () => {
      setSubmitError(null)
      setIsSubmitting(true)
      try {
        await postJson("/api/authenticate/signup-admin", {
          organizationName: formData.organizationName,
          acronym: formData.acronym,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          website: formData.website,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          userId: formData.userId,
          password: formData.password,
          phone: formData.phone,
        })
        router.push("/auth/login")
      } catch (err: any) {
        setSubmitError(err.message || "Unable to create account. Please try again.")
      } finally {
        setIsSubmitting(false)
      }
    }

    void run()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 bg-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Link href="/auth">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-3xl blur-xl opacity-20" />
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <PawPrint className="w-8 h-8 text-emerald-600" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  To Their Rescue
                </h1>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create your account</h2>
              <p className="text-gray-600">Join us in making a difference for animals in need</p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= 1 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <span className="text-sm font-medium text-gray-700">Organization</span>
              </div>
              <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-600"
                  initial={{ width: "0%" }}
                  animate={{ width: step >= 2 ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= 2 ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium text-gray-700">Personal Info</span>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="organizationName" className="text-gray-700 font-medium">
                          Organization Name *
                        </Label>
                        <Input
                          id="organizationName"
                          placeholder="Happy Paws Rescue"
                          value={formData.organizationName}
                          onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="acronym" className="text-gray-700 font-medium">
                          Acronym
                        </Label>
                        <Input
                          id="acronym"
                          placeholder="HPR"
                          value={formData.acronym}
                          onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street" className="text-gray-700 font-medium">
                        Street Address *
                      </Label>
                      <Input
                        id="street"
                        placeholder="123 Main Street"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-gray-700 font-medium">
                          City *
                        </Label>
                        <Input
                          id="city"
                          placeholder="Springfield"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state" className="text-gray-700 font-medium">
                          State/Province *
                        </Label>
                        <Input
                          id="state"
                          placeholder="California"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="country" className="text-gray-700 font-medium">
                          Country *
                        </Label>
                        <Input
                          id="country"
                          placeholder="United States"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-gray-700 font-medium">
                          Website/Social Media
                        </Label>
                        <Input
                          id="website"
                          placeholder="www.happypaws.org"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button
                        type="button"
                        onClick={handleNext}
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Next
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">
                          First Name *
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">
                          Last Name *
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address *
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@happypaws.org"
                          value={formData.email}
                          onChange={(e) => {
                            setFormData({ ...formData, email: e.target.value })
                            setEmailVerificationSent(false)
                            setIsEmailVerified(false)
                            setVerificationCode("")
                            setVerificationError("")
                          }}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 flex-1"
                          required
                          disabled={isEmailVerified}
                        />
                        {!isEmailVerified && (
                          <Button
                            type="button"
                            onClick={handleSendVerificationCode}
                            disabled={!formData.email || isSendingCode || emailVerificationSent}
                            className="h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                          >
                            {isSendingCode ? (
                              "Sending..."
                            ) : emailVerificationSent ? (
                              "Code Sent"
                            ) : (
                              <>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Code
                              </>
                            )}
                          </Button>
                        )}
                        {isEmailVerified && (
                          <div className="h-12 px-4 flex items-center bg-emerald-50 border border-emerald-200 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
                            <span className="text-emerald-700 font-medium">Verified</span>
                          </div>
                        )}
                      </div>

                      <AnimatePresence>
                        {emailVerificationSent && !isEmailVerified && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-2 pt-2"
                          >
                            <Label htmlFor="verificationCode" className="text-gray-700 font-medium text-sm">
                              Enter Verification Code
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="verificationCode"
                                placeholder="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => {
                                  setVerificationCode(e.target.value)
                                  setVerificationError("")
                                }}
                                maxLength={6}
                                className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 flex-1"
                              />
                              <Button
                                type="button"
                                onClick={handleVerifyCode}
                                disabled={!verificationCode || isVerifying}
                                className="h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                              >
                                {isVerifying ? "Verifying..." : "Verify"}
                              </Button>
                            </div>
                            <p className="text-sm text-gray-600">
                              Check your email for the verification code. It may take a few minutes to arrive.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {verificationError && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex items-center gap-2 text-red-600 text-sm mt-2"
                        >
                          <XCircle className="w-4 h-4" />
                          {verificationError}
                        </motion.div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="userId" className="text-gray-700 font-medium">
                          User ID *
                        </Label>
                        <Input
                          id="userId"
                          placeholder="johndoe"
                          value={formData.userId}
                          onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">
                        Password *
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                        Confirm Password *
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        onClick={handleBack}
                        variant="outline"
                        size="lg"
                        className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                      >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                      </Button>
                      <Button
                        type="submit"
                        size="lg"
                        className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60"
                        disabled={!isEmailVerified || isSubmitting}
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                    {submitError && (
                      <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                        {submitError}
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
