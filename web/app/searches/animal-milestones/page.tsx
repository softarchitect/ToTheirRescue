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

export default function AnimalMilestonesSearchPage() {
  const [searchParams, setSearchParams] = useState({
    milestone: "",
    animalType: "",
    otherRescueId: "",
    notes: "",
  })

  const handleSearch = () => {
    console.log("[v0] Animal milestone search params:", searchParams)
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
              <BreadcrumbPage>Animal Milestone Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Animal Milestone Search
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="milestone" className="text-sm text-muted-foreground">
                Milestone
              </Label>
              <Select
                value={searchParams.milestone}
                onValueChange={(value) => setSearchParams({ ...searchParams, milestone: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select milestone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intake">Intake</SelectItem>
                  <SelectItem value="medical">Medical Check</SelectItem>
                  <SelectItem value="vaccination">Vaccination</SelectItem>
                  <SelectItem value="spay-neuter">Spay/Neuter</SelectItem>
                  <SelectItem value="adoption">Adoption</SelectItem>
                  <SelectItem value="foster">Foster</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="animalType" className="text-sm text-muted-foreground">
                Animal Type <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.animalType}
                onValueChange={(value) => setSearchParams({ ...searchParams, animalType: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="bird">Bird</SelectItem>
                  <SelectItem value="rabbit">Rabbit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherRescueId" className="text-sm text-muted-foreground">
                Other Rescue Id No <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="otherRescueId"
                value={searchParams.otherRescueId}
                onChange={(e) => setSearchParams({ ...searchParams, otherRescueId: e.target.value })}
                className="bg-white"
              />
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
