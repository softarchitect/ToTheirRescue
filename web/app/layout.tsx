import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthGate } from "@/components/auth-gate"
import { Toaster } from "@/components/ui/toaster"
import { TenantProvider } from "@/contexts/tenant-context"

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
      <body className="font-sans antialiased overflow-x-hidden">
        <TenantProvider>
          <AuthGate>{children}</AuthGate>
          <Toaster />
          <Analytics />
        </TenantProvider>
      </body>
    </html>
  )
}
