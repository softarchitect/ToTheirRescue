"use client"

import type React from "react"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Lock, XCircle } from "lucide-react"
import { postJson } from "@/lib/api"

const PASSWORD_MIN_LENGTH = 8

type TokenState = "checking" | "valid" | "invalid"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""

  const [tokenState, setTokenState] = useState<TokenState>("checking")
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!token) {
      setTokenState("invalid")
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await postJson<{ data?: { email?: string } }>(
          "/api/authenticate/verify-reset-token",
          { token },
        )
        if (cancelled) return
        setEmail(res?.data?.email ?? null)
        setTokenState("valid")
      } catch {
        if (!cancelled) setTokenState("invalid")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)
    try {
      await postJson("/api/authenticate/reset-password", { token, password })
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "Unable to reset your password. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {submitted ? "Password updated" : "Choose a new password"}
              </h2>
              {!submitted && email && (
                <p className="text-gray-600">
                  for <span className="font-medium text-gray-800">{email}</span>
                </p>
              )}
            </div>

            {tokenState === "checking" && (
              <p className="text-center text-gray-600">Checking your reset link...</p>
            )}

            {tokenState === "invalid" && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-lg">This link is no longer valid</h3>
                  <p className="text-gray-600">
                    Password reset links expire after a while and can only be used once. Please request a
                    new one.
                  </p>
                </div>
                <Link href="/auth/forgot-password" className="block">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                    Request a new link
                  </Button>
                </Link>
              </div>
            )}

            {tokenState === "valid" && !submitted && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
                    <p className="text-sm text-gray-700">
                      Pick a password of at least {PASSWORD_MIN_LENGTH} characters that you don&apos;t use
                      anywhere else.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    New password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pr-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirm new password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update password"}
                </Button>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                    {error}
                  </p>
                )}
              </motion.form>
            )}

            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-gray-600">
                  Your password has been updated. You can now sign in with your new password.
                </p>
                <Link href="/auth/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white">
                    Return to login
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
