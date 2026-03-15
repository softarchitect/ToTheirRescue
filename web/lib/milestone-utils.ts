export const AVAILABLE_MILESTONE_TYPES = [
  "Adoption",
  "Adoption Return",
  "Foster",
  "Foster Return",
  "Lost",
  "Found",
  "Released",
  "Death",
  "Returned to Owner",
  "Reintake",
  "Transfer",
] as const

export const PERSON_REQUIRED_MILESTONES = [
  "Adoption",
  "Foster",
  "Returned to Owner",
  "Transfer"
] as const

export const DEFAULT_PCO_MILESTONES = [
  "Lost",
  "Found",
  "Released",
  "Reintake",
  "Death"
] as const

export const EXISTING_PCO_MILESTONES = [
  "Adoption Return",
  "Foster Return"
] as const

/**
 * Determines which milestone types should be enabled based on the last milestone
 * This matches the old system logic from MilestoneAddForm.tsx
 */
export function getEnabledMilestoneTypes(lastMilestone: string | null): string[] {
  if (!lastMilestone) {
    // If no last milestone, enable all except base disabled ones
    return AVAILABLE_MILESTONE_TYPES.filter(
      type => !["Adoption Return", "Foster Return", "Found", "Reintake"].includes(type)
    )
  }

  const normalizedLast = lastMilestone.toLowerCase()

  if (normalizedLast === "intake" || normalizedLast === "adoption-return" || normalizedLast === "found" || normalizedLast === "reintake") {
    return ["Adoption", "Foster", "Lost", "Released", "Death", "Returned to Owner", "Transfer"]
  } else if (normalizedLast === "adoption") {
    return ["Adoption Return", "Death", "Reintake"]
  } else if (normalizedLast === "foster") {
    return ["Adoption", "Foster Return", "Lost", "Released", "Death", "Returned to Owner", "Transfer"]
  } else if (normalizedLast === "lost") {
    return ["Found"]
  } else if (normalizedLast === "released") {
    return ["Death", "Intake"]
  } else if (normalizedLast === "returned to owner" || normalizedLast === "returned-to-owner") {
    return ["Reintake"]
  } else if (normalizedLast === "transfer") {
    return ["Reintake"]
  }

  // Default: enable all except base disabled ones
  return AVAILABLE_MILESTONE_TYPES.filter(
    type => !["Adoption Return", "Foster Return", "Found", "Reintake"].includes(type)
  )
}

/**
 * Checks if a milestone type requires a person/company/organization
 */
export function requiresPerson(milestoneType: string): boolean {
  return PERSON_REQUIRED_MILESTONES.includes(milestoneType as any)
}

/**
 * Checks if a milestone type requires an amount field
 */
export function requiresAmount(milestoneType: string): boolean {
  return milestoneType === "Adoption" ||
    milestoneType === "Adoption Return" ||
    milestoneType === "Returned to Owner"
}

/**
 * Checks if a milestone type requires notes
 */
export function requiresNotes(milestoneType: string): boolean {
  return milestoneType === "Adoption Return" || milestoneType === "Death"
}

/**
 * Checks if a milestone type uses default PCO (ID 1)
 */
export function usesDefaultPCO(milestoneType: string): boolean {
  return DEFAULT_PCO_MILESTONES.includes(milestoneType as any)
}

/**
 * Checks if a milestone type uses animal's existing PCO
 */
export function usesExistingPCO(milestoneType: string): boolean {
  return EXISTING_PCO_MILESTONES.includes(milestoneType as any)
}

/**
 * Gets the label for the amount field based on milestone type
 */
export function getAmountLabel(milestoneType: string): string {
  if (milestoneType === "Adoption") return "Adoption Fee (if any)"
  if (milestoneType === "Adoption Return") return "Refund Amount (if any)"
  return "Amount (if any)"
}

/**
 * Gets the label for the date field based on milestone type
 */
export function getDateLabel(milestoneType: string): string {
  if (milestoneType === "Death") return "Date of Death"
  if (milestoneType === "Lost") return "Date Lost"
  if (milestoneType === "Released") return "Date Released"
  return "Milestone Date"
}

/**
 * Gets the header text for PCO selection based on milestone type
 */
export function getPCOHeaderText(milestoneType: string): string {
  if (milestoneType === "Adoption") return "Select the Adopter Below"
  if (milestoneType === "Foster") return "Select the Fosterer Below"
  if (milestoneType === "Returned to Owner") return "Select the Owner Below"
  if (milestoneType === "Transfer") return "Select the shelter/rescue/sanctuary below"
  return "Person/Company/Organization"
}

/**
 * Formats a date for display
 */
export function formatMilestoneDate(date: string | null | undefined): string {
  if (!date) return "-"
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  })
}

/**
 * Calculates minimum date for milestone (last milestone date, or earliest arrival date, or 10 years ago)
 */
export function getMinDate(animals: Array<{ lastMilestoneDate?: string | null; arrivalDate?: string | null; intakeDate?: string | null }>): string {
  if (animals.length === 0) {
    const tenYearsAgo = new Date()
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
    return tenYearsAgo.toISOString().split("T")[0]
  }

  // Check if there's a last milestone date - if so, use that date
  const lastMilestoneDates = animals
    .map(animal => animal.lastMilestoneDate)
    .filter(Boolean)
    .map(date => new Date(date!))

  if (lastMilestoneDates.length > 0) {
    const lastMilestoneDate = new Date(Math.max(...lastMilestoneDates.map(d => d.getTime())))
    return lastMilestoneDate.toISOString().split("T")[0]
  }

  // If no last milestone date, use earliest arrival date
  const arrivalDates = animals
    .map(animal => animal.arrivalDate || animal.intakeDate)
    .filter(Boolean)
    .map(date => new Date(date!).getTime())

  if (arrivalDates.length > 0) {
    const earliestDate = new Date(Math.min(...arrivalDates))
    return earliestDate.toISOString().split("T")[0]
  }

  // Fallback to 10 years ago
  const tenYearsAgo = new Date()
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10)
  return tenYearsAgo.toISOString().split("T")[0]
}

