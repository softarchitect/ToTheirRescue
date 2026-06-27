import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverAnchor, PopoverContent } from "@/components/ui/popover"
import { Trash2 } from "lucide-react"
import type { Animal } from "@/lib/types"
import Image from "next/image"
import { formatDateForTenant } from "@/lib/date-format"

const singularizeAnimalType = (type: string) => {
  const normalized = type.trim().toLowerCase()
  if (!normalized) return "Animal"

  const irregularPlurals: Record<string, string> = {
    species: "Species",
    fish: "Fish",
  }

  if (irregularPlurals[normalized]) {
    return irregularPlurals[normalized]
  }

  if (normalized.endsWith("ies") && normalized.length > 3) {
    return `${normalized.slice(0, -3)}y`.replace(/^\w/, (char) => char.toUpperCase())
  }

  if (normalized.endsWith("s") && normalized.length > 1) {
    return normalized.slice(0, -1).replace(/^\w/, (char) => char.toUpperCase())
  }

  return normalized.replace(/^\w/, (char) => char.toUpperCase())
}

interface AnimalListCardProps {
  animal: Animal
  isSelected: boolean
  onSelect: () => void
  onSelectWithPreview: () => void
  onEdit: () => void
  onDelete: () => void
  previewOpen?: boolean
  previewImageUrl?: string | null
  previewImageLoading?: boolean
}

function AnimalName({
  animal,
  previewOpen,
  previewImageUrl,
  previewImageLoading,
  onSelectWithPreview,
}: {
  animal: Animal
  previewOpen: boolean
  previewImageUrl: string | null
  previewImageLoading: boolean
  onSelectWithPreview: () => void
}) {
  return (
    <div className="flex items-center gap-1.5 min-w-0">
      <Popover open={previewOpen}>
        <PopoverAnchor asChild>
          <button
            type="button"
            className="font-bold text-base cursor-pointer hover:text-primary leading-tight text-left truncate"
            onClick={(e) => {
              e.stopPropagation()
              onSelectWithPreview()
            }}
          >
            {animal.name}
          </button>
        </PopoverAnchor>
        <PopoverContent
          side="right"
          align="center"
          sideOffset={6}
          className="p-0 w-20 overflow-hidden shadow-2xl border-2 border-primary/20 backdrop-blur-sm bg-white/95 pointer-events-none"
        >
          <div className="relative w-20 h-20 bg-muted">
            {previewImageUrl ? (
              <Image
                src={previewImageUrl}
                alt={animal.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                {previewImageLoading ? "Loading photo..." : "No photo"}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
              <h3 className="text-white text-[10px] font-bold leading-tight truncate">{animal.name}</h3>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {animal.isWildlife && (
        <Badge variant="secondary" className="text-xs shrink-0">
          Wildlife
        </Badge>
      )}
    </div>
  )
}

function AnimalActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2 text-xs"
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
      >
        Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 px-2 text-destructive hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}

export function AnimalListCard({
  animal,
  isSelected,
  onSelect,
  onSelectWithPreview,
  onEdit,
  onDelete,
  previewOpen = false,
  previewImageUrl = null,
  previewImageLoading = false,
}: AnimalListCardProps) {
  return (
    <Card className="border-border/40 hover:shadow-lg transition-all backdrop-blur-sm bg-white/80 overflow-hidden">
      <CardContent
        className="p-3 sm:px-2.5 cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-start gap-3 sm:items-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelectWithPreview}
            className="border-2 border-emerald-400/70 bg-white data-[state=checked]:border-primary shrink-0 mt-0.5 sm:mt-0"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-3 md:hidden">
              <AnimalName
                animal={animal}
                previewOpen={previewOpen}
                previewImageUrl={previewImageUrl}
                previewImageLoading={previewImageLoading}
                onSelectWithPreview={onSelectWithPreview}
              />
              <AnimalActions onEdit={onEdit} onDelete={onDelete} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-8 gap-x-3 gap-y-2 sm:gap-3 items-start md:items-center">
              <div className="hidden md:flex items-center gap-1.5 min-w-0">
                <AnimalName
                  animal={animal}
                  previewOpen={previewOpen}
                  previewImageUrl={previewImageUrl}
                  previewImageLoading={previewImageLoading}
                  onSelectWithPreview={onSelectWithPreview}
                />
              </div>
              <div className="text-xs flex flex-col justify-center leading-tight min-w-0">
                <p className="font-medium text-muted-foreground">{singularizeAnimalType(animal.type)}</p>
                <p className="truncate">{animal.breed || "-"}</p>
              </div>
              <div className="text-xs flex flex-col justify-center leading-tight min-w-0">
                <p className="font-medium text-muted-foreground">Age</p>
                <p>{animal.ageYears} Yrs | {animal.ageMonths} Mos</p>
              </div>
              <div className="text-xs flex flex-col justify-center leading-tight min-w-0">
                <p className="font-medium text-muted-foreground">Gender</p>
                <p className="capitalize">{animal.gender}</p>
              </div>
              <div className="text-xs flex flex-col justify-center leading-tight min-w-0">
                <p className="font-medium text-muted-foreground">Location</p>
                <p className="truncate">{animal.location || "-"}</p>
              </div>
              <div className="text-xs flex flex-col justify-center leading-tight min-w-0">
                <p className="font-medium text-muted-foreground">Status</p>
                <p className="capitalize truncate">{animal.status || "-"}</p>
              </div>
              <div className="text-xs flex flex-col justify-center leading-tight min-w-0">
                <p className="font-medium text-muted-foreground">Last Milestone</p>
                <p className="truncate">{animal.lastMilestone || "-"}</p>
              </div>
              <div className="text-xs flex flex-col justify-center leading-tight min-w-0">
                <p className="font-medium text-muted-foreground">Last Milestone Date</p>
                <p>
                  {animal.lastMilestoneDate ? formatDateForTenant(animal.lastMilestoneDate, { month: 'short', day: '2-digit', year: 'numeric' }) : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <AnimalActions onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
