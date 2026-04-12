"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  formatIsoDateForTenant,
  getTenantDateInputLang,
  getTenantDatePattern,
  normalizeTenantDateInput,
  parseTenantDisplayDateToIso,
} from "@/lib/date-format"

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string | React.ReactNode
  error?: string
  leftAddon?: React.ReactNode
  optionalLabel?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, error, leftAddon, optionalLabel, ...props }, ref) => {
    const {
      type,
      value,
      onChange,
      onBlur,
      min,
      max,
      disabled,
      lang,
      inputMode,
      pattern,
      maxLength,
      title,
      ...restProps
    } = props
    const [isFocused, setIsFocused] = React.useState(false)
    const [hasValue, setHasValue] = React.useState(false)
    const isTenantDateInput = type === "date"
    const [tenantDateValue, setTenantDateValue] = React.useState("")
    const [dateInvalid, setDateInvalid] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const datePickerInputRef = React.useRef<HTMLInputElement | null>(null)

    const setInputRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref],
    )

    React.useEffect(() => {
      setHasValue(!!value)
    }, [value])

    React.useEffect(() => {
      if (!isTenantDateInput) return
      const raw = typeof value === "string" ? value : ""
      setTenantDateValue(formatIsoDateForTenant(raw))
    }, [isTenantDateInput, value])

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(!!e.target.value)
      if (isTenantDateInput) {
        if (!tenantDateValue) {
          setDateInvalid(false)
        } else {
          setDateInvalid(parseTenantDisplayDateToIso(tenantDateValue) == null)
        }
      }
      onBlur?.(e)
    }

    const isFloating = isFocused || hasValue || value || type === 'date' || type === 'time' || type === 'datetime-local'
    const resolvedLang =
      lang || (type === "date" ? getTenantDateInputLang() : undefined)

    const emitDateValueChange = (nextIsoValue: string) => {
      if (!onChange) return
      const syntheticEvent = {
        target: { value: nextIsoValue },
        currentTarget: { value: nextIsoValue },
      } as React.ChangeEvent<HTMLInputElement>
      onChange(syntheticEvent)
    }

    const datePatternLabel = getTenantDatePattern().toUpperCase()

    return (
      <div className="relative">
        {leftAddon ? (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-muted-foreground">
            {leftAddon}
          </div>
        ) : null}
        <input
          ref={setInputRefs}
          id={id}
          {...restProps}
          type={isTenantDateInput ? "text" : type}
          value={isTenantDateInput ? tenantDateValue : value}
          className={cn(
            "flex h-10 w-full rounded-md border bg-background px-3 pt-4 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            leftAddon ? "pl-8" : null,
            isTenantDateInput ? "pr-10" : null,
            error || dateInvalid ? "border-red-500 focus-visible:ring-red-500" : "border-input",
            className,
          )}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => {
            if (!isTenantDateInput) {
              onChange?.(e)
              return
            }
            const normalized = normalizeTenantDateInput(e.target.value)
            setTenantDateValue(normalized)
            setHasValue(!!normalized)
            if (normalized.length < 10) {
              setDateInvalid(false)
            }
            if (!normalized) {
              setDateInvalid(false)
              emitDateValueChange("")
              return
            }
            const parsedIso = parseTenantDisplayDateToIso(normalized)
            if (parsedIso) {
              setDateInvalid(false)
              emitDateValueChange(parsedIso)
              return
            }
            if (normalized.length === 10) setDateInvalid(true)
          }}
          placeholder={typeof label === "string" ? label : ""}
          lang={resolvedLang}
          inputMode={isTenantDateInput ? "numeric" : inputMode}
          pattern={isTenantDateInput ? "^\\d{2}/\\d{2}/\\d{4}$" : pattern}
          maxLength={isTenantDateInput ? 10 : maxLength}
          title={isTenantDateInput ? `Use ${datePatternLabel} format` : title}
          aria-invalid={dateInvalid || undefined}
        />
        {isTenantDateInput ? (
          <>
            <input
              ref={datePickerInputRef}
              type="date"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 opacity-0"
              value={typeof value === "string" ? value : ""}
              min={typeof min === "string" ? min : undefined}
              max={typeof max === "string" ? max : undefined}
              disabled={disabled}
              onChange={(e) => {
                const nextIsoValue = e.target.value
                setTenantDateValue(formatIsoDateForTenant(nextIsoValue))
                setHasValue(!!nextIsoValue)
                setDateInvalid(false)
                emitDateValueChange(nextIsoValue)
                inputRef.current?.focus()
              }}
            />
            <CalendarIcon
              className={cn(
                "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
              )}
              onClick={() => {
                if (disabled) return
                const pickerInput = datePickerInputRef.current
                if (!pickerInput) return
                const anyInput = pickerInput as HTMLInputElement & { showPicker?: () => void }
                if (typeof anyInput.showPicker === "function") {
                  anyInput.showPicker()
                } else {
                  pickerInput.focus()
                }
              }}
            />
          </>
        ) : null}
        <label
          htmlFor={id}
          className={cn(
            "absolute transition-all duration-200 pointer-events-none",
            leftAddon ? "left-8" : "left-3",
            isFloating ? "top-1 text-xs" : "top-2.5 text-sm",
            error || dateInvalid ? "text-red-500" : "text-muted-foreground",
          )}
        >
          {label}
          {restProps.required ? (
            <span className="text-red-500 ml-0.5">*</span>
          ) : (
            <span className="text-[0.8em]  text-muted-foreground ml-0.5">({optionalLabel || "Optional"})</span>
          )}
        </label>
        {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
        {!error && isTenantDateInput ? (
          <p className={cn("text-xs mt-1", dateInvalid ? "text-red-500" : "text-muted-foreground")}>
            {dateInvalid ? `Enter a valid date in ${datePatternLabel} format.` : `Format: ${datePatternLabel}`}
          </p>
        ) : null}
      </div>
    )
  },
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
