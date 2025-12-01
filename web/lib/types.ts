// Backend-configured animal types can be arbitrary strings (e.g. "Dogs", "Horses").
// We still commonly use canonical categories like "dog", "cat", etc. in the UI,
// but the underlying type is a plain string so we can support tenant-specific types.
export type AnimalType = string
export type AnimalStatus = "available" | "adopted" | "fostered" | "medical" | "released" | "quarantine"

export interface Animal {
  id: string
  name: string
  type: AnimalType
  breed: string
  age: number
  gender: "male" | "female" | "unknown"
  status: AnimalStatus
  arrivalDate: string
  description: string
  medicalNotes?: string
  imageUrl: string
  isWildlife: boolean
  color?: string
  chronicCondition?: string
  birthNotes?: string
  intakeDate?: string
  howAcquired?: string
  intakeCost?: number
  intakeNotes?: string
  lastMilestone?: string
  lastMilestoneDate?: string
}

export interface Donor {
  id: string
  name: string
  email: string
  phone: string
  totalDonated: number
  lastDonation: string
  donationCount: number
}

export interface Donation {
  id: string
  donorId: string
  donorName: string
  amount: number
  date: string
  type: "one-time" | "monthly" | "annual"
  purpose?: string
}

export interface Adoption {
  id: string
  animalId: string
  animalName: string
  adopterName: string
  adopterEmail: string
  adopterPhone: string
  adoptionDate: string
  adoptionFee: number
  status: "pending" | "approved" | "completed"
}

export interface Release {
  id: string
  animalId: string
  animalName: string
  releaseDate: string
  location: string
  notes: string
}

export type MilestoneType =
  | "Adoption"
  | "Adoption Return"
  | "Foster"
  | "Foster Return"
  | "Lost"
  | "Found"
  | "Released"
  | "Death"
  | "Returned to Owner"
  | "Reintake"
  | "Transfer"
  | "Birth"
  | "Intake"

export interface Milestone {
  id: string
  animalId: string
  type: MilestoneType
  date: string
  firstName?: string
  lastName?: string
  notes?: string
}

export interface Behavior {
  id: string
  animalId: string
  trait: string
  enabled: boolean
  comment: string
  date: string
}

export interface Location {
  id: string
  animalId: string
  location: string
  date: string
}

export interface MediaFile {
  id: string
  animalId: string
  type: "photo" | "video" | "document"
  url: string
  date: string
  rank?: number
  description?: string
  notes?: string
}

export interface PCO {
  id: string
  lastName: string
  firstName: string
  street: string
  city: string
  state: string
  zip: string
  phone: string
  email: string
  isVolunteer: boolean
  totalDonations?: number
}

export interface PCOMedia {
  id: string
  pcoId: string
  type: "photo" | "video" | "document"
  url: string
  date: string
  rank?: number
  description?: string
  notes?: string
}

export interface PCODonation {
  id: string
  pcoId: string
  date: string
  amount: number
  type: "money" | "other"
  notes?: string
}

export interface PCOHistory {
  id: string
  pcoId: string
  date: string
  type: string
  description: string
}

export interface PCOVolunteer {
  id: string
  pcoId: string
  activities: string[]
  status: "active" | "inactive"
  activeDate?: string
  inactiveDate?: string
  notes?: string
}

export interface Reminder {
  id: string
  animalName: string
  animalImage: string
  dueDate: string
  vaccination: string
  rabies: boolean
}
