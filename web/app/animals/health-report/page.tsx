"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Printer, ChevronRight, Heart, Flag, PawPrint } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import type { Animal } from "@/lib/types"
import { SelectedAnimalsHeader } from "@/components/selected-animals-header"
import { getUserRole } from "@/lib/auth-utils"
import { fetchAnimalHealthReport, type AnimalHealthReportVM } from "@/lib/api"
import { formatDateForTenant } from "@/lib/date-format"
import { useToast } from "@/hooks/use-toast"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

type ReportLoadState = {
  animal: Animal
  report?: AnimalHealthReportVM
  error?: string
}

function resolveAnimalImageUrl(imageUrl?: string | null): string {
  const trimmed = (imageUrl || "").trim()
  if (!trimmed) return ""
  if (trimmed === "/placeholder.svg") return ""
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) return trimmed
  if (trimmed.startsWith("/api/") || trimmed.startsWith("/uploads/") || trimmed.startsWith("/static/")) {
    return `${API_BASE_URL}${trimmed}`
  }
  if (!trimmed.startsWith("/")) return ""
  return trimmed
}

function formatDate(value: string | null) {
  if (!value) return "N/A"

  try {
    return formatDateForTenant(new Date(value), {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return value
  }
}

function getAge(value: string | null) {
  if (!value) return "Age unknown"

  const birthDate = new Date(value)
  if (Number.isNaN(birthDate.getTime())) return "Age unknown"

  const today = new Date()
  let years = today.getFullYear() - birthDate.getFullYear()
  let months = today.getMonth() - birthDate.getMonth()

  if (today.getDate() < birthDate.getDate()) {
    months -= 1
  }

  if (months < 0) {
    years -= 1
    months += 12
  }

  if (years > 0) return `${years} yr${years === 1 ? "" : "s"} ${months} mo${months === 1 ? "" : "s"}`
  return `${Math.max(months, 0)} mo${months === 1 ? "" : "s"}`
}

function valueOrNone(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "None"
  return String(value)
}

function ReportTable({
  headers,
  rows,
  emptyMessage,
}: {
  headers: string[]
  rows: string[][]
  emptyMessage: string
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/60">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-3 py-2 text-left font-medium text-muted-foreground">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-white">
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={`${index}-${cellIndex}`} className="px-3 py-2 align-top">
                  {cell || "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChronologyEntry({ entry }: { entry: AnimalHealthReportVM["healthChronologyReports"][number] }) {
  if (entry.tableName === "SOAP") {
    return (
      <div className="rounded-md border bg-white p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">SOAP</Badge>
          <span className="text-sm text-muted-foreground">{formatDate(entry.actionDate)}</span>
          {entry.practitioner && <span className="text-sm text-muted-foreground">Vet: {entry.practitioner}</span>}
          {entry.clinic && <span className="text-sm text-muted-foreground">Clinic: {entry.clinic}</span>}
        </div>
        <div className="grid gap-2 text-sm md:grid-cols-2">
          <p><span className="font-medium">Subjective:</span> {valueOrNone(entry.subjective)}</p>
          <p><span className="font-medium">Objective:</span> {valueOrNone(entry.objective)}</p>
          <p><span className="font-medium">Assessment:</span> {valueOrNone(entry.assessment)}</p>
          <p><span className="font-medium">Plan:</span> {valueOrNone(entry.soapPlan)}</p>
        </div>
      </div>
    )
  }

  if (entry.tableName === "Health Note") {
    return (
      <div className="rounded-md border bg-white p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Health Note</Badge>
          <span className="text-sm text-muted-foreground">{formatDate(entry.actionDate)}</span>
        </div>
        <p className="text-sm">{valueOrNone(entry.notes)}</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border bg-white p-3">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">Procedure</Badge>
        <span className="text-sm font-medium">{valueOrNone(entry.kind)}</span>
        <span className="text-sm text-muted-foreground">{formatDate(entry.actionDate)}</span>
      </div>
      <div className="grid gap-2 text-sm md:grid-cols-2">
        <p><span className="font-medium">Clinic:</span> {valueOrNone(entry.clinic)}</p>
        <p><span className="font-medium">Practitioner:</span> {valueOrNone(entry.practitioner)}</p>
        <p><span className="font-medium">Weight:</span> {valueOrNone(entry.weight)}</p>
        <p><span className="font-medium">Result:</span> {valueOrNone(entry.results)}</p>
        <p><span className="font-medium">Microchip:</span> {valueOrNone(entry.microchipNumber)}</p>
        <p><span className="font-medium">Notes:</span> {valueOrNone(entry.notes)}</p>
      </div>
    </div>
  )
}

function ReportAnimalPhoto({
  sources,
  animalName,
}: {
  sources: Array<string | null | undefined>
  animalName: string
}) {
  const resolvedSources = sources.map(resolveAnimalImageUrl).filter(Boolean)
  const [sourceIndex, setSourceIndex] = useState(0)
  const currentSource = resolvedSources[sourceIndex]

  if (!currentSource) {
    return <PawPrint className="h-10 w-10 text-muted-foreground" />
  }

  return (
    <img
      src={currentSource}
      alt={animalName}
      className="h-full w-full object-cover"
      onError={() => setSourceIndex((index) => index + 1)}
    />
  )
}

function AnimalReport({ report, selectedAnimal }: { report: AnimalHealthReportVM; selectedAnimal: Animal }) {
  const tenant = report.tenantReport
  const animal = report.animalReport

  return (
    <section className="space-y-6 rounded-lg border bg-white p-6 shadow-sm print:break-after-page print:border-0 print:shadow-none">
      <header className="space-y-1 text-center">
        <h2 className="text-2xl font-bold text-gray-900">{tenant.name || "To Their Rescue"}</h2>
        <p className="text-sm text-muted-foreground">{[tenant.street, tenant.city, tenant.state, tenant.zip].filter(Boolean).join(", ")}</p>
        {tenant.phone && <p className="text-sm text-muted-foreground">{tenant.phone}</p>}
        <h3 className="pt-4 text-xl font-semibold">Animal Health Report</h3>
      </header>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
            <ReportAnimalPhoto
              animalName={animal.animalName}
              sources={[animal.artifactAttachment, selectedAnimal.imageUrl]}
            />
          </div>
          <div className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Animal</p>
              <p className="font-semibold">{animal.animalName}</p>
            </div>
            <div>
              <p className="text-muted-foreground">ID No.</p>
              <p className="font-semibold">{valueOrNone(animal.animalId)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Breed / Sex / Age</p>
              <p className="font-semibold">{valueOrNone(animal.breed)} / {valueOrNone(animal.sex)} / {getAge(animal.birthDate)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type / Color</p>
              <p className="font-semibold">{valueOrNone(animal.animalTypeName)} / {valueOrNone(animal.color)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Chronic Condition</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{valueOrNone(report.chronicConditionReport.chronicCondition)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Diet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{valueOrNone(report.dietReport.diet)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTable
            headers={["Due Date", "Kind"]}
            rows={report.reminderReports.map((reminder) => [
              formatDate(reminder.dueDate),
              valueOrNone(reminder.kind),
            ])}
            emptyMessage="No reminders recorded"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past Vaccinations</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportTable
            headers={["Date", "Vaccination", "Clinic", "Practitioner", "Tag No.", "MFG", "S.N."]}
            rows={report.vaccinationReports.map((vaccination) => [
              formatDate(vaccination.actionDate),
              valueOrNone(vaccination.vaccinationKind),
              valueOrNone(vaccination.clinic),
              valueOrNone(vaccination.practitioner),
              valueOrNone(vaccination.tagNumber),
              valueOrNone(vaccination.manufacturer),
              valueOrNone(vaccination.serialNo),
            ])}
            emptyMessage="No past vaccinations recorded"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Chronology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.healthChronologyReports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No health chronology recorded</p>
          ) : (
            report.healthChronologyReports.map((entry) => (
              <ChronologyEntry key={`${entry.tableName}-${entry.id}`} entry={entry} />
            ))
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export default function AnimalHealthReportPage() {
  const router = useRouter()
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([])
  const [reports, setReports] = useState<ReportLoadState[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const role = getUserRole()
    setUserRole(role)
  }, [])

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedAnimals")
    if (stored) {
      try {
        const animals = JSON.parse(stored) as Animal[]
        setSelectedAnimals(animals)
      } catch {
        setSelectedAnimals([])
      }
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadReports() {
      if (selectedAnimals.length === 0) {
        setReports([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      const loadedReports = await Promise.all(
        selectedAnimals.map(async (animal) => {
          try {
            const report = await fetchAnimalHealthReport(animal.id)
            return { animal, report }
          } catch (error) {
            return {
              animal,
              error: error instanceof Error ? error.message : "Failed to load report",
            }
          }
        })
      )

      if (!cancelled) {
        setReports(loadedReports)
        setIsLoading(false)

        const failedCount = loadedReports.filter((item) => item.error).length
        if (failedCount > 0) {
          toast({
            title: "Some reports could not be loaded",
            description: `${failedCount} animal report${failedCount === 1 ? "" : "s"} failed to load.`,
            variant: "destructive",
          })
        }
      }
    }

    loadReports()

    return () => {
      cancelled = true
    }
  }, [selectedAnimals, toast])

  const handleHealthClick = (page: string) => {
    if (page === "animals") {
      router.push("/animals")
      return
    }
    if (page === "reminders") {
      router.push("/animals?openReminder=1")
      return
    }
    if (page === "diet") {
      router.push("/animals?openDiet=1")
      return
    }
    router.push(`/animals/${page}`)
  }

  const handleActionClick = (page: string) => {
    router.push(`/animals/${page}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const loadedReports = reports.filter((item) => item.report)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-amber-50/30 to-teal-50 print:bg-white">
      <div className="print:hidden">
        <Navigation />
      </div>

      <main className="container mx-auto px-4 py-8 print:max-w-none print:px-0 print:py-0">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground print:hidden">
          <button onClick={() => router.push("/")} className="hover:text-foreground">
            Home
          </button>
          <ChevronRight className="h-4 w-4" />
          <button onClick={() => router.push("/animals")} className="hover:text-foreground">
            Animals
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-semibold">Animal Health Report</span>
        </div>

        <Card className="mb-2 border-border/40 bg-white/80 py-3 backdrop-blur-sm print:hidden">
          <CardContent className="px-3 py-0">
            <SelectedAnimalsHeader animals={selectedAnimals} />
          </CardContent>
        </Card>

        <div className="mb-6 flex items-center justify-between print:hidden">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent text-sm">
                  <Heart className="h-4 w-4" />
                  Health
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => handleHealthClick("animals")} className="text-sm">
                  Chronic Condition
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("vaccinations")} className="text-sm">
                  Vaccinations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("procedures")} className="text-sm">
                  Procedures, Tests, & Treatments
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("reminders")} className="text-sm">
                  Set Reminders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("meds")} className="text-sm">
                  Meds
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("diet")} className="text-sm">
                  Diet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("soaps")} className="text-sm">
                  SOAPs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("health-notes")} className="text-sm">
                  Health Notes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("health-history")} className="text-sm">
                  Health History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleHealthClick("health-report")} className="text-sm">
                  Animal Health Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {userRole !== "Veterinarian" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent text-sm">
                    <Flag className="h-4 w-4" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {userRole !== "AnimalCaretaker" && (
                    <DropdownMenuItem onClick={() => handleActionClick("milestones")} className="text-sm">
                      Milestones
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleActionClick("behaviors")} className="text-sm">
                    Behaviors
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleActionClick("location")} className="text-sm">
                    Location
                  </DropdownMenuItem>
                  {userRole !== "AnimalCaretaker" && (
                    <>
                      <DropdownMenuItem onClick={() => handleActionClick("media")} className="text-sm">
                        Photos, Videos, and Documents
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={() => handleActionClick("diary")} className="text-sm">
                    Diary
                  </DropdownMenuItem>
                  {userRole !== "AnimalCaretaker" && (
                    <DropdownMenuItem onClick={() => handleActionClick("report")} className="text-sm">
                      Publicity Bio
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent text-sm" onClick={handlePrint} disabled={loadedReports.length === 0}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
            <Button size="sm" className="gap-2 text-sm" onClick={handlePrint} disabled={loadedReports.length === 0}>
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {selectedAnimals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <PawPrint className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">No animals selected</p>
                <p className="text-sm text-muted-foreground">Select one or more animals from Animal Management to generate reports.</p>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Generating report...
              </CardContent>
            </Card>
          ) : (
            reports.map((item) => (
              item.report ? (
                <AnimalReport key={item.animal.id} report={item.report} selectedAnimal={item.animal} />
              ) : (
                <Card key={item.animal.id} className="border-destructive/30">
                  <CardContent className="py-6">
                    <p className="font-medium">Could not load report for {item.animal.name}</p>
                    <p className="text-sm text-muted-foreground">{item.error}</p>
                  </CardContent>
                </Card>
              )
            ))
          )}
        </div>
      </main>
    </div>
  )
}
