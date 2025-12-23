import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AVAILABLE_MILESTONE_TYPES, getEnabledMilestoneTypes } from "@/lib/milestone-utils"
import type { Animal } from "@/lib/types"

interface MilestoneTypeSelectorProps {
  selectedType: string
  onTypeChange: (type: string) => void
  animals: Animal[]
  error?: string
}

export function MilestoneTypeSelector({
  selectedType,
  onTypeChange,
  animals,
  error,
}: MilestoneTypeSelectorProps) {
  const lastMilestone = animals.length > 0 ? (animals[0].lastMilestone || "").toLowerCase() : null
  const enabledMilestoneTypes = getEnabledMilestoneTypes(lastMilestone)
  const disabledMilestones = AVAILABLE_MILESTONE_TYPES.filter(
    type => !enabledMilestoneTypes.includes(type)
  )

  return (
    <div className="space-y-1 overflow-y-auto max-h-[300px] md:max-h-none">
      <Label className="text-xs sm:text-sm font-semibold">Select Milestone Type</Label>
      <RadioGroup value={selectedType} onValueChange={onTypeChange} className="space-y-0.5">
        {AVAILABLE_MILESTONE_TYPES.map((type) => {
          const isDisabled = disabledMilestones.includes(type)
          return (
            <div key={type} className="flex items-center space-x-2">
              <RadioGroupItem value={type} id={type} disabled={isDisabled} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <Label
                htmlFor={type}
                className={`text-xs sm:text-sm cursor-pointer ${isDisabled ? "text-muted-foreground opacity-50" : ""}`}
              >
                {type}
              </Label>
            </div>
          )
        })}
      </RadioGroup>
      {error && <p className="text-[10px] sm:text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}

