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

export default function AnimalsSearchPage() {
  const [searchParams, setSearchParams] = useState({
    name: "",
    animalType: "",
    residencyStatus: "",
    breed: "",
    color: "",
    sex: "",
    location: "",
    notes: "",
    chronicCondition: "",
    dietPresent: "",
    flagged: "",
    status: "",
    spayedNeutered: "",
    additionalNotes: "",
  })

  const handleSearch = () => {
    console.log("[v0] Animal search params:", searchParams)
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
              <BreadcrumbPage>Animals Search</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Animals Search
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">
                Name <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="name"
                value={searchParams.name}
                onChange={(e) => setSearchParams({ ...searchParams, name: e.target.value })}
                className="bg-white"
              />
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
              <Label htmlFor="residencyStatus" className="text-sm text-muted-foreground">
                Select residency status <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.residencyStatus}
                onValueChange={(value) => setSearchParams({ ...searchParams, residencyStatus: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resident">Resident</SelectItem>
                  <SelectItem value="foster">Foster</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name2" className="text-sm text-muted-foreground">
                Name <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input id="name2" className="bg-white" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breed" className="text-sm text-muted-foreground">
                Breed <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="breed"
                value={searchParams.breed}
                onChange={(e) => setSearchParams({ ...searchParams, breed: e.target.value })}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color" className="text-sm text-muted-foreground">
                Color <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="color"
                value={searchParams.color}
                onChange={(e) => setSearchParams({ ...searchParams, color: e.target.value })}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex" className="text-sm text-muted-foreground">
                Select sex <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.sex}
                onValueChange={(value) => setSearchParams({ ...searchParams, sex: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm text-muted-foreground">
                Location <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="location"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
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

            <div className="space-y-2">
              <Label htmlFor="chronicCondition" className="text-sm text-muted-foreground">
                Chronic Condition <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.chronicCondition}
                onValueChange={(value) => setSearchParams({ ...searchParams, chronicCondition: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="diabetes">Diabetes</SelectItem>
                  <SelectItem value="arthritis">Arthritis</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flagged" className="text-sm text-muted-foreground">
                Flagged <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.flagged}
                onValueChange={(value) => setSearchParams({ ...searchParams, flagged: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select flagged" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietPresent" className="text-sm text-muted-foreground">
                Diet Present <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.dietPresent}
                onValueChange={(value) => setSearchParams({ ...searchParams, dietPresent: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm text-muted-foreground">
                Select status <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.status}
                onValueChange={(value) => setSearchParams({ ...searchParams, status: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spayedNeutered" className="text-sm text-muted-foreground">
                Spayed/Neutered <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select
                value={searchParams.spayedNeutered}
                onValueChange={(value) => setSearchParams({ ...searchParams, spayedNeutered: value })}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="residencyStatus2" className="text-sm text-muted-foreground">
                Select residency status <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resident">Resident</SelectItem>
                  <SelectItem value="foster">Foster</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalNotes" className="text-sm text-muted-foreground">
                Notes <span className="text-xs text-emerald-600">optional</span>
              </Label>
              <Input
                id="additionalNotes"
                value={searchParams.additionalNotes}
                onChange={(e) => setSearchParams({ ...searchParams, additionalNotes: e.target.value })}
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
