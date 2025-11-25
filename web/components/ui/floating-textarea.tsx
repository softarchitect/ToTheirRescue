"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string | React.ReactNode
  error?: string
}

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, FloatingTextareaProps>(
  ({ className, label, id, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      props.onBlur?.(e)
    }

    const isFloating = isFocused || hasValue || props.value

    return (
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border bg-background px-3 pt-5 pb-2 text-sm ring-offset-background placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
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
            "absolute left-3 transition-all duration-200 pointer-events-none",
            isFloating ? "top-1.5 text-xs" : "top-3 text-sm",
            error ? "text-red-500" : "text-muted-foreground",
          )}
        >
          {label}
          {props.required ? <span className="text-red-500 ml-0.5">*</span> : <span className="text-[0.8em]  text-muted-foreground ml-0.5">(Optional)</span>}
        </label>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    )
  },
)
FloatingTextarea.displayName = "FloatingTextarea"

export { FloatingTextarea }
