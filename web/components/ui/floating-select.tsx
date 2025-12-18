"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FloatingSelectProps {
  label: string | React.ReactNode
  id?: string
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  options?: Array<{ value: string; label: string; disabled?: boolean }>
  className?: string
  disabled?: boolean
  error?: string
}

const FloatingSelect = React.forwardRef<HTMLButtonElement, FloatingSelectProps>(
  ({ className, label, id, value, children, options, disabled, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const hasValue = !!value

    const isFloating = isFocused || hasValue

    return (
      <div className="relative">
        <Select value={value} onValueChange={props.onValueChange} disabled={disabled}>
          <SelectTrigger
            ref={ref}
            id={id}
            className={cn(
              "h-10 pt-4 pb-1",
              error && "border-red-500",
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <SelectValue placeholder=" " />
          </SelectTrigger>
          <SelectContent>
            {options
              ? options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))
              : children}
          </SelectContent>
        </Select>
        <label
          htmlFor={id}
          className={cn(
            "absolute left-3 text-muted-foreground transition-all duration-200 pointer-events-none z-10",
            isFloating ? "top-1 text-xs" : "top-2.5 text-sm",
          )}
        >
          {label}
        </label>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  },
)
FloatingSelect.displayName = "FloatingSelect"

export { FloatingSelect }
