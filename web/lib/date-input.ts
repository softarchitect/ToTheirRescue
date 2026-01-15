const pad2 = (value: number) => String(value).padStart(2, "0")

const formatDateDisplay = (date: Date) =>
  `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`

const isValidDateParts = (year: number, month: number, day: number) => {
  if (year < 1000 || month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(year, month - 1, day)
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export const parseDateInput = (value: string): Date | null => {
  const trimmed = value.trim()
  if (!trimmed) return null

  const dashMatch = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(trimmed)
  if (dashMatch) {
    const year = Number(dashMatch[1])
    const month = Number(dashMatch[2])
    const day = Number(dashMatch[3])
    if (!isValidDateParts(year, month, day)) return null
    return new Date(year, month - 1, day)
  }

  const slashMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed)
  if (slashMatch) {
    const day = Number(slashMatch[1])
    const month = Number(slashMatch[2])
    const year = Number(slashMatch[3])
    if (!isValidDateParts(year, month, day)) return null
    return new Date(year, month - 1, day)
  }

  return null
}

export const parseDateListInput = (value: string): Date[] | null => {
  const parts = value
    .split(/[,\n;]+/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (parts.length === 0) return []

  const dates: Date[] = []
  for (const part of parts) {
    const parsed = parseDateInput(part)
    if (!parsed) return null
    dates.push(parsed)
  }

  return dates
}

export const formatDateListDisplay = (dates: Date[]) => {
  const normalized = dates
    .filter((date) => date instanceof Date && !Number.isNaN(date.getTime()))
    .slice()
    .sort((a, b) => a.getTime() - b.getTime())

  return normalized.map(formatDateDisplay).join(", ")
}
