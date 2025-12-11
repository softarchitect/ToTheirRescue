import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthGate } from "@/components/auth-gate"
import { Toaster } from "@/components/ui/toaster"
import { TenantProvider } from "@/contexts/tenant-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "To Their Rescue",
  description: "Manage your animal shelter with ease",
  generator: "v0.app",
  icons: {
    icon: "/rabbit-logo.png",
    shortcut: "/rabbit-logo.png",
    apple: "/rabbit-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <TenantProvider>
          <AuthGate>{children}</AuthGate>
          <Toaster />
          <Analytics />
        </TenantProvider>
      </body>
    </html>
  )
}
