"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Home } from "lucide-react"

export default function DonationsSearchPage() {
  const [searchParams, setSearchParams] = useState({
    firstName: "",
    lastName: "",
    type: "",
    notes: "",
  })

  const handleSearch = () => {
    console.log("[v0] Donation search params:", searchParams)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Donation Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Donations Search
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm text-muted-foreground">
                First Name <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="firstName"
                value={searchParams.firstName}
                onChange={(e) => setSearchParams({ ...searchParams, firstName: e.target.value })}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm text-muted-foreground">
                Last Name <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="lastName"
                value={searchParams.lastName}
                onChange={(e) => setSearchParams({ ...searchParams, lastName: e.target.value })}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm text-muted-foreground">
                Type <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.type}
                onValueChange={(value) => setSearchParams({ ...searchParams, type: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monetary">Monetary</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="supplies">Supplies</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm text-muted-foreground">
                Notes <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="notes"
                value={searchParams.notes}
                onChange={(e) => setSearchParams({ ...searchParams, notes: e.target.value })}
                className="bg-white"
              />
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Button
              onClick={handleSearch}
              className="bg-white text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 px-12 py-6 text-base font-medium shadow-md"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
