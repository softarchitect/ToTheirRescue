/**
 * Date utility functions for form validation and restrictions
 */

/**
 * Gets the maximum date allowed (today's date) in YYYY-MM-DD format
 * Used to prevent selecting future dates in date inputs
 */
export function getMaxDateToday(): string {
  return new Date().toISOString().split("T")[0]
}

/**
 * Gets the minimum date allowed (10 years ago) in YYYY-MM-DD format
 * Used as a reasonable lower bound for date inputs
 */
export function getMinDateTenYearsAgo(): string {
  const tenYearsAgo = new Date()
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
  return tenYearsAgo.toISOString().split("T")[0]
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]
}

/**
 * Validates that a date is not in the future
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns true if date is today or in the past, false if in the future
 */
export function isDateNotInFuture(dateString: string): boolean {
  if (!dateString) return true
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date <= today
}

/**
 * Common date input props for preventing future dates
 * Use this object to spread into date input components
 */
export const dateInputPropsNoFuture = {
  max: getMaxDateToday(),
} as const

