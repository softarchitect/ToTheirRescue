/**
 * Role-based permissions utility
 * Defines what each role can see and do
 */

import { getUserRole } from "./auth-utils"

export type Role = "Administrator" | "AnimalManager" | "AnimalCaretaker" | "Veterinarian" | "SuperAdministrator" | null

export interface Permissions {
  // Navigation items
  canSeePCOs: boolean
  canSeeAdmin: boolean
  canSeeDonations: boolean
  canRecordDonations: boolean // Permission to record/create donations
  
  // Search menu items
  canSeeSearchAnimals: boolean
  canSeeSearchDonations: boolean
  canSeeSearchAnimalMilestones: boolean
  canSeeSearchAnimalHealth: boolean
  
  // Query menu items
  canSeeQueryAnimalMilestones: boolean
  canSeeQueryAnimalHealth: boolean
  canSeeQueryDonations: boolean
  canSeeQueryMailList: boolean
  
  // Animals page
  canSeeActionsTab: boolean
  canSeeHealthLOVs: boolean
  canSeeAllHealthLOVs: boolean // All health LOVs vs limited
  
  // Actions LOVs (on Animals page)
  canSeeMilestones: boolean
  canSeeBehaviors: boolean
  canSeeLocation: boolean
  canSeePhotos: boolean
  canSeeDiary: boolean
  canSeeAnimalReport: boolean
}

/**
 * Get permissions for a specific role
 */
export function getPermissionsForRole(role: Role): Permissions {
  switch (role) {
    case "Administrator":
    case "SuperAdministrator":
      return {
        canSeePCOs: true,
        canSeeAdmin: true,
        canSeeDonations: true,
        canRecordDonations: true,
        canSeeSearchAnimals: true,
        canSeeSearchDonations: true,
        canSeeSearchAnimalMilestones: true,
        canSeeSearchAnimalHealth: true,
        canSeeQueryAnimalMilestones: true,
        canSeeQueryAnimalHealth: true,
        canSeeQueryDonations: true,
        canSeeQueryMailList: true,
        canSeeActionsTab: true,
        canSeeHealthLOVs: true,
        canSeeAllHealthLOVs: true,
        canSeeMilestones: true,
        canSeeBehaviors: true,
        canSeeLocation: true,
        canSeePhotos: true,
        canSeeDiary: true,
        canSeeAnimalReport: true,
      }
    
    case "AnimalManager":
      return {
        canSeePCOs: true,
        canSeeAdmin: false,
        canSeeDonations: false,
        canRecordDonations: false, // Cannot record donations
        canSeeSearchAnimals: true,
        canSeeSearchDonations: false,
        canSeeSearchAnimalMilestones: true,
        canSeeSearchAnimalHealth: true,
        canSeeQueryAnimalMilestones: true,
        canSeeQueryAnimalHealth: true,
        canSeeQueryDonations: false,
        canSeeQueryMailList: true,
        canSeeActionsTab: true,
        canSeeHealthLOVs: true,
        canSeeAllHealthLOVs: true,
        canSeeMilestones: true,
        canSeeBehaviors: true,
        canSeeLocation: true,
        canSeePhotos: true,
        canSeeDiary: true,
        canSeeAnimalReport: true,
      }
    
    case "AnimalCaretaker":
      return {
        canSeePCOs: false,
        canSeeAdmin: false,
        canSeeDonations: false,
        canRecordDonations: false,
        canSeeSearchAnimals: true,
        canSeeSearchDonations: false,
        canSeeSearchAnimalMilestones: false,
        canSeeSearchAnimalHealth: true,
        canSeeQueryAnimalMilestones: false,
        canSeeQueryAnimalHealth: true,
        canSeeQueryDonations: false,
        canSeeQueryMailList: false,
        canSeeActionsTab: true,
        canSeeHealthLOVs: true,
        canSeeAllHealthLOVs: true,
        canSeeMilestones: false,
        canSeeBehaviors: true,
        canSeeLocation: true,
        canSeePhotos: false,
        canSeeDiary: true,
        canSeeAnimalReport: false,
      }
    
    case "Veterinarian":
      return {
        canSeePCOs: false,
        canSeeAdmin: false,
        canSeeDonations: false,
        canRecordDonations: false,
        canSeeSearchAnimals: true,
        canSeeSearchDonations: false,
        canSeeSearchAnimalMilestones: false,
        canSeeSearchAnimalHealth: true,
        canSeeQueryAnimalMilestones: false,
        canSeeQueryAnimalHealth: true,
        canSeeQueryDonations: false,
        canSeeQueryMailList: false,
        canSeeActionsTab: false,
        canSeeHealthLOVs: true,
        canSeeAllHealthLOVs: true,
        canSeeMilestones: false,
        canSeeBehaviors: false,
        canSeeLocation: false,
        canSeePhotos: false,
        canSeeDiary: false,
        canSeeAnimalReport: false,
      }
    
    default:
      // Default: no permissions
      return {
        canSeePCOs: false,
        canSeeAdmin: false,
        canSeeDonations: false,
        canRecordDonations: false,
        canSeeSearchAnimals: false,
        canSeeSearchDonations: false,
        canSeeSearchAnimalMilestones: false,
        canSeeSearchAnimalHealth: false,
        canSeeQueryAnimalMilestones: false,
        canSeeQueryAnimalHealth: false,
        canSeeQueryDonations: false,
        canSeeQueryMailList: false,
        canSeeActionsTab: false,
        canSeeHealthLOVs: false,
        canSeeAllHealthLOVs: false,
        canSeeMilestones: false,
        canSeeBehaviors: false,
        canSeeLocation: false,
        canSeePhotos: false,
        canSeeDiary: false,
        canSeeAnimalReport: false,
      }
  }
}

/**
 * Get current user's permissions
 */
export function getCurrentUserPermissions(): Permissions {
  const role = getUserRole() as Role
  return getPermissionsForRole(role)
}

/**
 * Check if current user has a specific permission
 */
export function hasPermission(permission: keyof Permissions): boolean {
  const permissions = getCurrentUserPermissions()
  return permissions[permission] ?? false
}
