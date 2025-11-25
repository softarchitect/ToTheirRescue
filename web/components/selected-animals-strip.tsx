import Image from "next/image"
import type { Animal } from "@/lib/types"
import { cn } from "@/lib/utils"

interface SelectedAnimalsStripProps {
  animals: Animal[]
  className?: string
}

export function SelectedAnimalsStrip({ animals, className }: SelectedAnimalsStripProps) {
  if (!animals || animals.length === 0) return null

  return (
    <div className={cn("mb-3", className)}>
      <div className="flex items-center gap-2 flex-wrap">
        {animals.slice(0, 4).map((animal) => (
          <div
            key={animal.id}
            className="flex items-center gap-2 p-1.5 rounded bg-muted/50 flex-1 min-w-0"
          >
            <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
              <Image
                src={animal.imageUrl || "/placeholder.svg"}
                alt={animal.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {animal.name} | ID: {animal.id}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {animal.breed} | {animal.gender} | {animal.age} {animal.age !== 1 ? 'Yrs' : 'Yr'}
              </p>
            </div>
          </div>
        ))}
        {animals.length > 4 && (
          <div className="bg-primary text-primary-foreground rounded px-3 py-1 text-xs font-semibold">
            +{animals.length - 4} more
          </div>
        )}
      </div>
    </div>
  )
}


