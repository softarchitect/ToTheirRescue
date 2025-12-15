import type { PCO } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SelectedPCOHeaderProps {
  pco: PCO;
  className?: string
  columns?: number
}

export function SelectedPCOHeader({
  pco,
  className,
  columns = 3,
}: SelectedPCOHeaderProps) {
  if (!pco) return null

  return (
    <div className={cn(`grid gap-2`, columns === 3 && "grid-cols-3", columns === 2 && "grid-cols-2", className)}>

      <div
        key={pco.id}
        className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-base"
      >
        <div className="font-semibold text-foreground truncate text-base">{pco.firstName} {pco.lastName} </div>
        <div className="text-sm text-muted-foreground truncate">
          {pco.street} |  {pco.city} | {pco.state} | {pco.zip} | {pco.phone}

        </div>
      </div>
    </div>
  )
}


