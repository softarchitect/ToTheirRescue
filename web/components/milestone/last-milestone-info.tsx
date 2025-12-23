import { Calendar } from "lucide-react"
import type { Animal } from "@/lib/types"
import { formatMilestoneDate } from "@/lib/milestone-utils"

interface LastMilestoneInfoProps {
  animals: Animal[]
}

export function LastMilestoneInfo({ animals }: LastMilestoneInfoProps) {
  const animalsWithLastMilestone = animals.filter(a => a.lastMilestone)

  if (animalsWithLastMilestone.length === 0) return null

  // Single animal - show detailed info
  if (animals.length === 1 && animals[0].lastMilestone) {
    return (
      <div className="flex items-center gap-2 text-sm bg-muted/50 p-1.5 rounded">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="font-medium">Last Milestone:</span>
        <span className="text-muted-foreground">
          {animals[0].lastMilestone} on {formatMilestoneDate(animals[0].lastMilestoneDate)}
        </span>
      </div>
    )
  }

  // Multiple animals
  if (animals.length > 1) {
    // Check if all animals with milestones have the same last milestone
    if (animalsWithLastMilestone.length > 1) {
      const firstMilestone = animalsWithLastMilestone[0].lastMilestone
      const firstDate = animalsWithLastMilestone[0].lastMilestoneDate
      const allSame = animalsWithLastMilestone.every(
        a => a.lastMilestone === firstMilestone && a.lastMilestoneDate === firstDate
      )

      if (allSame && firstMilestone) {
        return (
          <div className="flex items-center gap-2 text-sm bg-muted/50 p-1.5 rounded">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">
              Last Milestone ({animalsWithLastMilestone.length} of {animals.length} animals):
            </span>
            <span className="text-muted-foreground">
              {firstMilestone} on {formatMilestoneDate(firstDate)}
            </span>
          </div>
        )
      }
    }

    // Animals have different last milestones or some don't have milestones - show summary
    const uniqueMilestones = new Set(animalsWithLastMilestone.map(a => a.lastMilestone).filter(Boolean))
    return (
      <div className="flex items-center gap-2 text-sm bg-muted/50 p-1.5 rounded">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="font-medium">Last Milestones:</span>
        <span className="text-muted-foreground">
          {animalsWithLastMilestone.length} of {animals.length} animals have milestones
          {uniqueMilestones.size > 0 && ` (${uniqueMilestones.size} different type${uniqueMilestones.size > 1 ? 's' : ''})`}
        </span>
      </div>
    )
  }

  return null
}

