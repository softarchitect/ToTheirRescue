"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode
  error?: string
  leftAddon?: React.ReactNode
  optionalLabel?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, error, leftAddon, optionalLabel, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    React.useEffect(() => {
      setHasValue(!!props.value)
    }, [props.value])

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const isFloating = isFocused || hasValue || props.value || props.type === 'date' || props.type === 'time' || props.type === 'datetime-local'

    return (
      <div className="relative">
        {leftAddon ? (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
            {leftAddon}
          </div>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 pt-4 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            leftAddon ? "pl-8" : null,
            error ? "border-red-500 focus-visible:ring-red-500" : "border-input",
            className,
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={typeof label === "string" ? label : ""}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute transition-all duration-200 pointer-events-none",
            leftAddon ? "left-8" : "left-3",
            isFloating ? "top-1 text-xs" : "top-2.5 text-sm",
            error ? "text-red-500" : "text-muted-foreground",
          )}
        >
          {label}
          {props.required ? (
            <span className="text-red-500 ml-0.5">*</span>
          ) : (
            <span className="text-[0.8em]  text-muted-foreground ml-0.5">({optionalLabel || "Optional"})</span>
          )}
        </label>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  },
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
