"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, PawPrint } from "lucide-react"
import { useRouter } from "next/navigation"
import { postJson } from "@/lib/api"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    staySignedIn: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await postJson<{
        token: string
        refreshToken: string
        data: { userName: string; tenantId: number | null }
      }>("/api/authenticate/signin", {
        username: formData.userId,
        password: formData.password,
      })

      const storage = formData.staySignedIn ? window.localStorage : window.sessionStorage
      storage.setItem(
        "auth",
        JSON.stringify({
          token: response.token,
          refreshToken: response.refreshToken,
          user: response.data,
        }),
      )

      router.push("/")
    } catch (err: any) {
      setError(err.message || "Unable to sign in. Please check your credentials.")
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
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign in to your account</h2>
              <p className="text-gray-600">Welcome back! Please enter your details</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="userId" className="text-gray-700 font-medium">
                  User ID
                </Label>
                <Input
                  id="userId"
                  type="text"
                  placeholder="Enter your user ID"
                  value={formData.userId}
                  onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                  className="h-12 bg-white/50 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="staySignedIn"
                    checked={formData.staySignedIn}
                    onCheckedChange={(checked) => setFormData({ ...formData, staySignedIn: checked as boolean })}
                  />
                  <label htmlFor="staySignedIn" className="text-sm text-gray-600 cursor-pointer">
                    Stay signed in
                  </label>
                </div>
                <Link
                  href="/auth/forgot-credentials"
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Forgot credentials?
                </Link>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6 disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Log in"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link href="/auth/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
