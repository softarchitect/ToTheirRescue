import type { Animal } from "@/lib/types"
import { cn } from "@/lib/utils"
import NextImage from "next/image"

interface SelectedAnimalsHeaderProps {
  animals: Animal[]
  className?: string
  maxVisible?: number
  columns?: number
}

export function SelectedAnimalsHeader({
  animals,
  className,
  maxVisible = 6,
  columns = 3,
}: SelectedAnimalsHeaderProps) {
  if (!animals || animals.length === 0) return null

  const visible = animals.slice(0, maxVisible)
  const remaining = animals.length - visible.length

  return (
    <div className={cn(`grid gap-2`, columns === 3 && "grid-cols-3", columns === 2 && "grid-cols-2", className)}>
      {visible.map((animal) => (
        <div
          key={animal.id}
          className="rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-base flex items-center gap-3"
        >
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-white/70">
            <NextImage
              src={animal.imageUrl || "/placeholder.svg"}
              alt={animal.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate text-base">{animal.name}</div>
            <div className="text-sm text-muted-foreground truncate">
              {animal.id} | {animal.breed} | {animal.gender} | {animal.age} {animal.age !== 1 ? "Yrs" : "Yr"}
            </div>
          </div>
        </div>
      ))}
      {remaining > 0 && (
        <div className="rounded-lg border border-dashed border-blue-300 bg-blue-50 px-3 py-2 text-sm flex items-center justify-center text-muted-foreground">
          +{remaining} more
        </div>
      )}
    </div>
  )
}


