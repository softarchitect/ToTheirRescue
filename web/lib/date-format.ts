export function getTenantDateFormat(): string | null {
  if (typeof window === "undefined") return null

  try {
    const stored = window.localStorage.getItem("auth") || window.sessionStorage.getItem("auth")
    if (stored) {
      const parsed = JSON.parse(stored)
      const fromAuth = parsed?.user?.countryDateFormat
      if (typeof fromAuth === "string" && fromAuth.trim()) return fromAuth.trim().toLowerCase()
    }
  } catch {
    // ignore and fallback
  }

  try {
    const fromStorage = window.localStorage.getItem("dateFormat")
    if (fromStorage && fromStorage.trim()) return fromStorage.trim().toLowerCase()
  } catch {
    // ignore
  }

  return null
}

export function getTenantDatePattern(): string {
  const normalized = (getTenantDateFormat() || "").toLowerCase()
  if (normalized.startsWith("dd/")) return "dd/mm/yyyy"
  return "mm/dd/yyyy"
}

export function getDateLocaleByFormat(dateFormat: string | null): string {
  const normalized = (dateFormat || "").toLowerCase()
  if (normalized.startsWith("dd/")) return "en-GB"
  if (normalized.startsWith("mm/")) return "en-US"
  return "en-US"
}

export function getDateInputLangByFormat(dateFormat: string | null): string {
  return getDateLocaleByFormat(dateFormat)
}

export function getTenantDateInputLang(): string {
  return getDateInputLangByFormat(getTenantDateFormat())
}

export function formatDateForTenant(
  value: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value) return ""
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ""

  const locale = getDateLocaleByFormat(getTenantDateFormat())
  return date.toLocaleDateString(locale, options)
}

function pad2(v: number): string {
  return String(v).padStart(2, "0")
}

export function formatIsoDateForTenant(isoDate: string | null | undefined): string {
  if (!isoDate) return ""
  const parts = isoDate.split("-")
  if (parts.length !== 3) return ""
  const year = Number(parts[0])
  const month = Number(parts[1])
  const day = Number(parts[2])
  if (!year || !month || !day) return ""

  const pattern = getTenantDatePattern()
  if (pattern.startsWith("dd/")) {
    return `${pad2(day)}/${pad2(month)}/${year}`
  }
  return `${pad2(month)}/${pad2(day)}/${year}`
}

export function normalizeTenantDateInput(value: string): string {
  const digits = value.replace(/[^\d]/g, "").slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
}

export function parseTenantDisplayDateToIso(display: string): string | null {
  const parts = display.split("/")
  if (parts.length !== 3) return null
  const a = Number(parts[0])
  const b = Number(parts[1])
  const y = Number(parts[2])
  if (!a || !b || !y || parts[2].length !== 4) return null

  const pattern = getTenantDatePattern()
  const day = pattern.startsWith("dd/") ? a : b
  const month = pattern.startsWith("dd/") ? b : a

  if (month < 1 || month > 12 || day < 1 || day > 31) return null
  const dt = new Date(Date.UTC(y, month - 1, day))
  if (
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== month - 1 ||
    dt.getUTCDate() !== day
  ) {
    return null
  }
  return `${y}-${pad2(month)}-${pad2(day)}`
}
