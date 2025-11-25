"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ArrowLeft, PawPrint, User, Lock, CheckCircle2 } from "lucide-react"
import { postJson } from "@/lib/api"

type RecoveryType = "userid" | "password" | null

export default function ForgotCredentialsPage() {
  const [recoveryType, setRecoveryType] = useState<RecoveryType>(null)
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (recoveryType === "userid") {
        await postJson("/api/authenticate/forgot-username", { email })
      } else if (recoveryType === "password") {
        await postJson("/api/authenticate/forgot-password", { email })
      }
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Unable to send recovery email. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setRecoveryType(null)
    setEmail("")
    setSubmitted(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 bg-pattern flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Link href="/auth/login">
          <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {submitted ? "Check your email" : "Recover your credentials"}
              </h2>
              <p className="text-gray-600">
                {submitted ? "We've sent recovery instructions to your email" : "What do you need help with?"}
              </p>
            </div>

            {!submitted ? (
              <>
                {!recoveryType ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <button
                      onClick={() => setRecoveryType("userid")}
                      className="w-full p-6 bg-white/50 hover:bg-white/80 border-2 border-gray-200 hover:border-emerald-500 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                          <User className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800 text-lg">Forgot User ID</h3>
                          <p className="text-sm text-gray-600">Recover your username</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setRecoveryType("password")}
                      className="w-full p-6 bg-white/50 hover:bg-white/80 border-2 border-gray-200 hover:border-emerald-500 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                          <Lock className="w-6 h-6 text-teal-600" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-gray-800 text-lg">Forgot Password</h3>
                          <p className="text-sm text-gray-600">Reset your password</p>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        {recoveryType === "userid" ? (
                          <User className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Lock className="w-5 h-5 text-emerald-600" />
                        )}
                        <p className="text-sm text-gray-700">
                          {recoveryType === "userid"
                            ? "We'll send your User ID to your registered email address"
                            : "We'll send a password reset link to your email address"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                      />
                      <p className="text-xs text-gray-500">Enter the email address associated with your account</p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleReset}
                        className="flex-1 border-2 border-gray-300 hover:bg-gray-50 bg-transparent"
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Recovery Email"}
                      </Button>
                    </div>
                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                        {error}
                      </p>
                    )}
                  </motion.form>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-lg">Email sent successfully!</h3>
                  <p className="text-gray-600">
                    We've sent {recoveryType === "userid" ? "your User ID" : "a password reset link"} to{" "}
                    <span className="font-medium text-gray-800">{email}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    If you don't see the email within a few minutes, please check your spam folder.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link href="/auth/login" className="block">
                    <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                      Return to login
                    </Button>
                  </Link>
                  <Button variant="ghost" onClick={handleReset} className="w-full text-gray-600 hover:text-gray-800">
                    Try another recovery option
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
