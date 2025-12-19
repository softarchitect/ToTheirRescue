import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import type { Animal } from "@/lib/types"

interface AnimalListCardProps {
  animal: Animal
  isSelected: boolean
  isHovered: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
  onHover: (id: string | null) => void
}

export function AnimalListCard({
  animal,
  isSelected,
  isHovered,
  onSelect,
  onEdit,
  onDelete,
  onHover,
}: AnimalListCardProps) {
  return (
    <Card className="border-border/40 hover:shadow-lg transition-all backdrop-blur-sm bg-white/80">
      <CardContent
        className="px-2.5 cursor-pointer"
        onClick={onSelect}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-3 items-center">
            <div className="flex items-center gap-1.5">
              <p
                className="font-bold text-base cursor-pointer hover:text-primary leading-tight"
                onMouseEnter={() => onHover(animal.id)}
                onMouseLeave={() => onHover(null)}
              >
                {animal.name}
              </p>
              {animal.isWildlife && (
                <Badge variant="secondary" className="text-xs">
                  Wildlife
                </Badge>
              )}
            </div>
            <div className="text-xs flex flex-col justify-center leading-tight">
              <p className="font-medium text-muted-foreground capitalize">{animal.type}</p>
              <p>{animal.breed}</p>
            </div>
            <div className="text-xs flex flex-col justify-center leading-tight">
              <p className="font-medium text-muted-foreground">Age</p>
              <p>{animal.ageYears} Yrs | {animal.ageMonths} Mos</p>
            </div>
            <div className="text-xs flex flex-col justify-center leading-tight">
              <p className="font-medium text-muted-foreground">Gender</p>
              <p className="capitalize">{animal.gender}</p>
            </div>
            <div className="text-xs flex flex-col justify-center leading-tight">
              <p className="font-medium text-muted-foreground">Last Milestone</p>
              <p>{animal.lastMilestone || "-"}</p>
            </div>
            <div className="text-xs flex flex-col justify-center leading-tight">
              <p className="font-medium text-muted-foreground">Last Milestone Date</p>
              <p>
                {animal.lastMilestoneDate ? new Date(animal.lastMilestoneDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : "-"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
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
        </div>
      </CardContent>
    </Card>
  )
}
