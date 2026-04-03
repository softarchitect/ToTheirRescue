import * as React from 'react'

import { cn } from '@/lib/utils'
import {
  formatIsoDateForTenant,
  getTenantDateInputLang,
  getTenantDatePattern,
  normalizeTenantDateInput,
  parseTenantDisplayDateToIso,
} from "@/lib/date-format"

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  const {
    value,
    onChange,
    onBlur,
    lang,
    inputMode,
    pattern,
    maxLength,
    title,
    placeholder,
    ['aria-invalid']: ariaInvalidProp,
    ...restProps
  } = props
  const isTenantDateInput = type === "date"
  const [tenantDateValue, setTenantDateValue] = React.useState("")
  const [dateInvalid, setDateInvalid] = React.useState(false)

  React.useEffect(() => {
    if (!isTenantDateInput) return
    const raw = typeof value === "string" ? value : ""
    setTenantDateValue(formatIsoDateForTenant(raw))
  }, [isTenantDateInput, value])

  const resolvedLang =
    lang || (type === "date" ? getTenantDateInputLang() : undefined)
  const datePatternLabel = getTenantDatePattern().toUpperCase()

  const emitDateValueChange = (nextIsoValue: string) => {
    if (!onChange) return
    const syntheticEvent = {
      target: { value: nextIsoValue },
      currentTarget: { value: nextIsoValue },
    } as React.ChangeEvent<HTMLInputElement>
    onChange(syntheticEvent)
  }

  return (
    <input
      type={isTenantDateInput ? "text" : type}
      data-slot="input"
      value={isTenantDateInput ? tenantDateValue : value}
      lang={resolvedLang}
      inputMode={isTenantDateInput ? "numeric" : inputMode}
      pattern={isTenantDateInput ? "^\\d{2}/\\d{2}/\\d{4}$" : pattern}
      maxLength={isTenantDateInput ? 10 : maxLength}
      title={isTenantDateInput ? `Use ${datePatternLabel} format` : title}
      placeholder={isTenantDateInput ? (placeholder || datePatternLabel) : placeholder}
      aria-invalid={isTenantDateInput ? (dateInvalid || ariaInvalidProp) : ariaInvalidProp}
      onChange={(e) => {
        if (!isTenantDateInput) {
          onChange?.(e)
          return
        }
        const normalized = normalizeTenantDateInput(e.target.value)
        setTenantDateValue(normalized)
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
      onBlur={(e) => {
        if (isTenantDateInput) {
          if (!tenantDateValue) {
            setDateInvalid(false)
          } else {
            setDateInvalid(parseTenantDisplayDateToIso(tenantDateValue) == null)
          }
        }
        onBlur?.(e)
      }}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        // Hide native browser password reveal controls so custom toggles do not duplicate.
        '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...restProps}
    />
  )
}

export { Input }
