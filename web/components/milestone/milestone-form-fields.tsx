import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import {
  requiresAmount,
  requiresNotes,
  getAmountLabel,
  getDateLabel,
} from "@/lib/milestone-utils"
import type { Animal } from "@/lib/types"

interface MilestoneFormFieldsProps {
  milestoneType: string
  milestoneDate: string
  amountPaidFee: string
  notes: string
  minDate: string
  maxDate: string
  errors: Record<string, string>
  onDateChange: (date: string) => void
  onAmountChange: (amount: string) => void
  onNotesChange: (notes: string) => void
  animals: Animal[]
  showCompact?: boolean
}

export function MilestoneFormFields({
  milestoneType,
  milestoneDate,
  amountPaidFee,
  notes,
  minDate,
  maxDate,
  errors,
  onDateChange,
  onAmountChange,
  onNotesChange,
  showCompact = false,
}: MilestoneFormFieldsProps) {
  const needsAmount = requiresAmount(milestoneType)
  const needsNotes = requiresNotes(milestoneType)

  return (
    <div className={showCompact ? "space-y-2" : "space-y-3"}>
      <FloatingInput
        id="milestoneDate"
        label={getDateLabel(milestoneType)}
        type="date"
        value={milestoneDate}
        min={minDate}
        max={maxDate}
        onChange={(e) => {
          onDateChange(e.target.value)
        }}
        required
        error={errors.milestoneDate}
      />
      {needsAmount && (
        <FloatingInput
          id="amountPaidFee"
          label={getAmountLabel(milestoneType)}
          type="number"
          step="0.01"
          min="0"
          value={amountPaidFee}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.00"
        />
      )}
      <FloatingTextarea
        id="notes"
        label="Notes"
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={showCompact ? 1 : 6}
        required={needsNotes}
        error={errors.notes}
      />
    </div>
  )
}

