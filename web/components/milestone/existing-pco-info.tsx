import type { Animal } from "@/lib/types"

interface ExistingPCOInfoProps {
  milestoneType: string
  animals: Animal[]
}

export function ExistingPCOInfo({ milestoneType, animals }: ExistingPCOInfoProps) {
  if (animals.length === 0 || !animals[0].lastMilestone) return null

  const label = milestoneType === "Adoption Return" ? "Adopted By:" : "Fostered By:"
  const pcoName = animals[0].location || "No PCO information available"

  return (
    <div className="bg-muted/30 p-3 flex items-center gap-2 rounded-lg">
      <p className="text-sm font-medium">{label}</p>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{pcoName}</p>
      </div>
    </div>
  )
}

