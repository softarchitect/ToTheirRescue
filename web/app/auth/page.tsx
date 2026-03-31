"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Heart, Shield } from "lucide-react"

const superAdminUserHint =
  process.env.NEXT_PUBLIC_SUPER_ADMIN_USERNAME_HINT?.trim() || "superadmin"
const superAdminPasswordHint =
  process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD_HINT?.trim() || "superadmin"

export default function AuthLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50 to-teal-50 bg-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <Image
                src="/rabbit-logo.png"
                alt="To Their Rescue"
                width={48}
                height={48}
                className="w-12 h-12"
              />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
              To Their Rescue
            </h1>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 3 }}
            >
              <Heart className="w-12 h-12 text-amber-500 fill-amber-500" />
            </motion.div>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 font-medium mb-4">Animal Rescue Management Software</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simplify record-keeping, enhance fundraising, and give you more time for your animals
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 rounded-3xl blur-xl opacity-20" />
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                  <p className="text-gray-600">Sign in to access your rescue management dashboard</p>
                </div>
                <Link href="/auth/login" className="block">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent self-stretch" />

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800">New Here?</h2>
                  <p className="text-gray-600">Create an account to start managing your rescue organization</p>
                </div>
                <Link href="/auth/register" className="block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6 bg-transparent"
                  >
                    Get Started
                  </Button>
                </Link>
              </motion.div>

              <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent self-stretch" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <Shield className="h-7 w-7 text-emerald-700" />
                    Super Admin
                  </h2>
                  <p className="text-gray-600">Use Super Admin credentials for global configuration access</p>
                  {/* <div className="rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-2 text-sm text-emerald-900">
                    <p>
                      <span className="font-semibold">User ID:</span> {superAdminUserHint}
                    </p>
                    <p>
                      <span className="font-semibold">Password:</span> {superAdminPasswordHint}
                    </p>
                  </div> */}
                </div>
                <Link href="/auth/login?mode=super-admin" className="block">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-2 border-emerald-700 text-emerald-800 hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-6 bg-transparent"
                  >
                    Super Admin Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600">Trusted by animal rescues, shelters, and sanctuaries worldwide</p>
        </motion.div>
      </div>
    </div>
  )
}
