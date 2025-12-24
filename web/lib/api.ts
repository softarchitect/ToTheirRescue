import type {
  Animal,
  AnimalStatus,
  AnimalType,
  Milestone,
  MilestoneType,
  PCO,
} from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const stored =
      window.localStorage.getItem("auth") ||
      window.sessionStorage.getItem("auth");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const stored =
      window.localStorage.getItem("auth") ||
      window.sessionStorage.getItem("auth");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.refreshToken ?? null;
  } catch {
    return null;
  }
}

function setAuthTokens(token: string, refreshToken: string): void {
  if (typeof window === "undefined") return;

  try {
    const stored =
      window.localStorage.getItem("auth") ||
      window.sessionStorage.getItem("auth");
    const authData = stored ? JSON.parse(stored) : {};
    
    authData.token = token;
    authData.refreshToken = refreshToken;
    
    const authString = JSON.stringify(authData);
    
    // Save to the same storage location it was retrieved from
    if (window.localStorage.getItem("auth")) {
      window.localStorage.setItem("auth", authString);
    } else if (window.sessionStorage.getItem("auth")) {
      window.sessionStorage.setItem("auth", authString);
    }
  } catch {
    // Ignore errors
  }
}

async function refreshAuthToken(): Promise<boolean> {
  const token = getAuthToken();
  const refreshToken = getRefreshToken();
  
  if (!token || !refreshToken) {
    return false;
  }
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/authenticate/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, refreshToken }),
    });
    
    const json = await res.json().catch(() => ({}));
    
    if (res.ok && json.success && json.token && json.refreshToken) {
      setAuthTokens(json.token, json.refreshToken);
      return true;
    }
    
    return false;
  } catch {
    return false;
  }
}

async function request<T>(path: string, options: RequestInit, retryCount = 0): Promise<T> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const json = await res.json().catch(() => ({}));
  
  // If token expired (401) and we haven't retried yet, try to refresh
  if (res.status === 401 && retryCount === 0) {
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      // Retry the request with the new token
      return request<T>(path, options, retryCount + 1);
    } else {
      // Refresh failed, clear auth and redirect to login
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("auth");
        window.sessionStorage.removeItem("auth");
        window.location.href = "/auth";
      }
      throw new Error("Session expired. Please login again.");
    }
  }
  
  if (!res.ok || (json && (json as any).success === false)) {
    const message =
      (json as any)?.message ||
      (json as any)?.errors?.[0] ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return json as T;
}

export async function postJson<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getJson<TResponse>(path: string): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "GET",
  });
}

// For some legacy endpoints we may want to explicitly bypass auth headers,
// e.g. when @jwt_required(optional=True) is used but an invalid token would 401.
export async function getJsonNoAuth<TResponse>(path: string): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok || (json && (json as any).success === false)) {
    const message =
      (json as any)?.message ||
      (json as any)?.errors?.[0] ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return json as TResponse;
}

export async function patchJson<TResponse, TBody = unknown>(
  path: string,
  body?: TBody,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function putJson<TResponse, TBody = unknown>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteJson<TResponse = unknown>(
  path: string,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: "DELETE",
  });
}

// Backend response structure for get-animal endpoint
export interface BackendAnimalResponse {
  id: number;
  animalId: number;
  animalName: string;
  animalTypeId: number;
  currentResident: boolean;
  breed: string;
  color: string;
  notes: string;
  flag: boolean;
  flagReason: string;
  isDeleted: boolean;
  location: string;
  pcoId: number | null;
  sex: string;
  spayedOrNeutered: boolean;
  lastMilestone: string;
  lastMilestoneDate: string | null;
  tenantId: number;
  animalType: string;
  chronicCondition: string;
  status: string;
  birthMilestone?: any;
  intakeMilestone?: any;
  artifactAttachment?: any;
  attachmentCountData?: any;
  animalMilestoneCountData?: any;
}

export interface PagedAnimalsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    currentPage: number;
    totalItems: number;
    totalPage: number;
    animalsList: BackendAnimalResponse[];
  };
}

// Helper function to calculate age in years and months from birth date
function calculateAge(birthDate: string | null | undefined): { years: number; months: number; totalYears: number } {
  if (!birthDate) {
    return { years: 0, months: 0, totalYears: 0 };
  }

  try {
    const birth = new Date(birthDate);
    const now = new Date();
    
    // Check if birth date is valid
    if (isNaN(birth.getTime())) {
      return { years: 0, months: 0, totalYears: 0 };
    }

    // Calculate the difference in years and months
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    
    // Adjust if current day hasn't reached birth day yet (we haven't completed the current month)
    if (now.getDate() < birth.getDate()) {
      months--;
    }
    
    // If months is negative, borrow from years
    if (months < 0) {
      months += 12;
      years--;
    }

    // Calculate total years as a decimal for backward compatibility
    const totalYears = years + months / 12;

    return { years, months, totalYears };
  } catch {
    return { years: 0, months: 0, totalYears: 0 };
  }
}

// Helper function to map backend animal response to frontend Animal type
function mapBackendAnimalToFrontend(backendAnimal: BackendAnimalResponse): Animal {
  // Determine if wildlife based on animalType
  const isWildlife = (backendAnimal.animalType || "").toLowerCase().includes("wild");
  
  // Map animalType to frontend format
  const animalType = (backendAnimal.animalType || "").toLowerCase();
  let mappedType: string = "other";
  if (animalType.includes("dog")) mappedType = "dog";
  else if (animalType.includes("cat")) mappedType = "cat";
  else if (animalType.includes("bird")) mappedType = "bird";
  else if (animalType.includes("rabbit") || animalType.includes("bunny")) mappedType = "rabbit";
  else if (isWildlife) mappedType = "wildlife";
  
  // Get image URL from artifact attachment if available
  let imageUrl = "/placeholder.svg";
  if (backendAnimal.artifactAttachment?.thumbnailBlobUrl) {
    imageUrl = backendAnimal.artifactAttachment.thumbnailBlobUrl;
  } else if (backendAnimal.artifactAttachment?.blobUrl) {
    imageUrl = backendAnimal.artifactAttachment.blobUrl;
  }
  
  // Map sex to gender
  const gender = (backendAnimal.sex || "").toLowerCase();
  let mappedGender: "male" | "female" | "unknown" = "unknown";
  if (gender === "male" || gender === "m") mappedGender = "male";
  else if (gender === "female" || gender === "f") mappedGender = "female";
  // Calculate arrival date from intake milestone or use date_entered
  let arrivalDate = "";
  if (backendAnimal.intakeMilestone?.milestoneDate) {
    arrivalDate = backendAnimal.intakeMilestone.milestoneDate.split("T")[0];
  }
  
  // Calculate age from birth milestone
  const birthDate = backendAnimal.birthMilestone?.milestoneDate || null;
  const age = calculateAge(birthDate);
  
  return {
    id: String(backendAnimal.id),
    name: backendAnimal.animalName || "",
    type: mappedType,
    animalTypeId: backendAnimal.animalTypeId || 0,
    breed: backendAnimal.breed || "",
    age: Math.floor(age.totalYears), // Keep age as integer years for backward compatibility
    ageYears: age.years,
    ageMonths: age.months,
    gender: mappedGender,
    status: backendAnimal.status || "",
    arrivalDate: arrivalDate,
    description: backendAnimal.notes || "",
    medicalNotes: backendAnimal.chronicCondition || undefined,
    imageUrl: imageUrl,
    isWildlife: isWildlife,
    color: backendAnimal.color || undefined,
    chronicCondition: backendAnimal.chronicCondition || undefined,
    lastMilestone: backendAnimal.lastMilestone || undefined,
    lastMilestoneDate: backendAnimal.lastMilestoneDate || undefined,
    spayedNeutered: backendAnimal.spayedOrNeutered || false,
    location: backendAnimal.location || "",
  };
}

export async function fetchAnimals(params?: {
  searchText?: string;
  isAvailable?: boolean;
  page?: number;
  limit?: number;
}): Promise<Animal[]> {
  const search = new URLSearchParams();

  if (params?.searchText) search.set("searchText", params.searchText);
  if (params?.isAvailable !== undefined) {
    search.set("isAvailable", params.isAvailable ? "true" : "false");
  }
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

  const queryString = search.toString();
  const path = `/api/animal/get-animal${queryString ? `?${queryString}` : ""}`;

  const res = await getJson<PagedAnimalsResponse>(path);
  const backendAnimals = res.data?.animalsList ?? [];
  
  // Map backend response to frontend Animal type
  return backendAnimals.map(mapBackendAnimalToFrontend);
}

export interface GetAnimalsByIdsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    animalList: any[];
  };
}

export async function fetchAnimalsByIds(animalIds: number[]): Promise<Animal[]> {
  if (!animalIds || animalIds.length === 0) {
    return [];
  }

  const idsParam = animalIds.join(",");
  const path = `/api/animal/get-animals-by-animalIds?ids=${idsParam}`;

  const res = await getJson<GetAnimalsByIdsResponse>(path);
  const backendAnimals = res.data?.animalList ?? [];
  
  // Map backend response to frontend Animal type
  return backendAnimals.map(mapBackendAnimalToFrontend);
}

// Helper function to extract milestones from animal data returned by fetchAnimalsByIds
export function extractMilestonesFromAnimals(animals: Animal[], backendAnimals: any[]): Milestone[] {
  const milestones: Milestone[] = [];
  
  // Find the first animal's milestone data from backend response
  if (backendAnimals.length > 0) {
    const firstAnimal = backendAnimals[0];
    const milestoneData = firstAnimal.animalMilestoneCountData;
    
    if (milestoneData?.animalMilestones && Array.isArray(milestoneData.animalMilestones)) {
      // Backend returns milestones ordered by ID ascending (oldest first) to match old system
      // No need to reverse - they're already in the correct order
      milestoneData.animalMilestones.forEach((m: any) => {
        milestones.push({
          id: String(m.id),
          animalId: String(firstAnimal.id),
          type: m.milestoneType as MilestoneType,
          date: m.milestoneDate || "",
          notes: m.notes || undefined,
          firstName: m.firstName || undefined,
          lastName: m.lastName || undefined,
          // Additional fields for editing
          amountPaidFee: m.amountPaidFee,
          amountReceivedFee: m.amountReceivedFee,
          acquisitionWayId: m.acquisitionWayId,
          acquisitionWayName: m.acquisitionWayName,
          pcoId: m.pcoId,
          isApproxDOB: m.isApproxDOB,
          otherRescueIDNo: m.otherRescueIDNo,
          otherRescueShelterId: m.otherRescueShelterId,
        } as any);
      });
    }
  }
  
  return milestones;
}

// Function to fetch animals and extract milestones
export async function fetchAnimalsAndMilestonesByIds(animalIds: number[]): Promise<{ animals: Animal[]; milestones: Milestone[] }> {
  if (!animalIds || animalIds.length === 0) {
    return { animals: [], milestones: [] };
  }

  const idsParam = animalIds.join(",");
  const path = `/api/animal/get-animals-by-animalIds?ids=${idsParam}`;

  const res = await getJson<GetAnimalsByIdsResponse>(path);
  const backendAnimals = res.data?.animalList ?? [];
  
  // Map backend response to frontend Animal type
  const animals = backendAnimals.map(mapBackendAnimalToFrontend);
  
  // Extract milestones from backend response
  const milestones = extractMilestonesFromAnimals(animals, backendAnimals);
  
  return { animals, milestones };
}

export interface CreateAnimalPayload {
  name: string;
  animalTypeId: number;
  breed: string;
  gender: "male" | "female" | "unknown";
  status?: string;
  color?: string;
  chronicCondition?: string;
  description?: string;
  intakeDate?: string;
  // Birth milestone fields
  approximateYears?: number;
  approximateMonths?: number;
  actualBirthDate?: string;
  birthNotes?: string;
  // Intake milestone fields
  howAcquired?: string;
  intakeCost?: number;
  donationAmount?: number;
  intakeNotes?: string;
  // Multi-animal creation
  animalCount?: number;
  maleCount?: number;
  femaleCount?: number;
  unknownCount?: number;
  spayedNeutered?: boolean;
  // PCO and other rescue fields
  pcoId?: string | number;
  personOrRescueId?: string | number;
  otherRescueShelterId?: number;
  otherRescueID?: string;
}

export interface CreateAnimalResponseItem {
  id: number;
  animal: Animal;
  birthMilestoneId?: number | null;
  birthAnimalMilestone?: any;
  intakeMilestoneId?: number | null;
  intakeAnimalMilestone?: any;
  animalList: Animal[];
}

export interface CreateAnimalResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: CreateAnimalResponseItem[];
}

export async function createAnimal(
  payload: CreateAnimalPayload,
): Promise<Animal[]> {
  const res = await postJson<CreateAnimalResponse>(
    "/api/animal/create-animal",
    payload,
  );

  if (!res.success || !res.data || !Array.isArray(res.data) || res.data.length === 0) {
    throw new Error(res.message || "Failed to create animal");
  }

  // Extract animals from the response array
  // Each item in data has an 'animal' property and an 'animalList' array
  // We'll use the 'animal' property as it contains the full animal object (from to_dict_basic())
  // Fallback to animalList[0] if animal is not available
  return res.data.map((item) => {
    let animal: Animal;
    
    if (item.animal) {
      animal = item.animal;
    } else if (item.animalList && item.animalList.length > 0) {
      // Fallback to animalList if animal property is missing
      animal = item.animalList[0];
    } else {
      // Last resort: create a minimal animal object from the id
      animal = {
        id: String(item.id),
        name: "",
        type: "other",
        breed: "",
        age: 0,
        gender: "unknown",
        status: undefined,
        arrivalDate: new Date().toISOString().split("T")[0],
        description: "",
        imageUrl: "/placeholder.svg",
        isWildlife: false,
      } as Animal;
    }

    // Calculate age from birth milestone date (similar to get-animal response)
    const birthDate = item.birthAnimalMilestone?.milestoneDate || null;
    const age = calculateAge(birthDate);
    
    // Add ageYears and ageMonths to the animal object
    animal.ageYears = age.years;
    animal.ageMonths = age.months;
    // Update the age field to use totalYears for backward compatibility
    animal.age = Math.floor(age.totalYears);

    return animal;
  });
}

export interface AnimalMilestoneListResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: { milestones: Milestone[] };
}

export async function fetchAnimalMilestones(
  animalId: string | number,
): Promise<Milestone[]> {
  if (!animalId) return [];

  const res = await getJson<AnimalMilestoneListResponse>(
    `/api/animal-milestone/by-animal/${animalId}`,
  );

  return res.data?.milestones ?? [];
}

export interface CreateMilestonesPayload {
  animalIds: (string | number)[];
  milestoneType: MilestoneType;
  date: string;
  notes?: string;
  amountPaidFee?: number;
  pcoId?: string | number;
}

export async function createMilestonesForAnimals(
  payload: CreateMilestonesPayload,
): Promise<Milestone[]> {
  const res = await postJson<AnimalMilestoneListResponse>(
    "/api/animal-milestone/add-by-animals",
    payload,
  );

  return res.data?.milestones ?? [];
}

export interface UpdateMilestonePayload {
  milestoneType: MilestoneType;
  milestoneDate: string;
  isApproxDOB?: boolean;
  otherRescueIDNo?: string;
  amountPaidFee?: number;
  amountReceivedFee?: number;
  notes?: string;
  acquisitionWayId?: number;
  acquisitionWayName?: string;
  pcoId?: number;
  otherRescueShelterId?: number;
}

export interface UpdateMilestoneResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    id: number;
    animalMilestone: {
      id: number;
      animalId: number;
      milestoneType: string;
      milestoneDate: string;
      isApproxDOB: boolean;
      otherRescueIDNo: string;
      amountPaidFee: number;
      amountReceivedFee: number;
      notes: string;
      acquisitionWayId: number;
      acquisitionWayName: string;
      pcoId: number;
      otherRescueShelterId: number;
    };
  };
}

export async function updateAnimalMilestone(
  milestoneId: string | number,
  payload: UpdateMilestonePayload,
): Promise<UpdateMilestoneResponse> {
  const res = await postJson<UpdateMilestoneResponse>(
    `/api/animal-milestone/update-animal-milestone/${milestoneId}`,
    payload,
  );

  return res;
}

export interface DeleteMilestoneResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    id: number;
  };
}

export async function deleteAnimalMilestone(
  milestoneId: string | number,
): Promise<DeleteMilestoneResponse> {
  const res = await patchJson<DeleteMilestoneResponse>(
    `/api/animal-milestone/delete-animal-milestone/${milestoneId}`,
  );

  return res;
}

// PCO (Person/Company/Organization) helpers

export interface PagedPCOResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    currentPage: number;
    totalItems: number;
    totalPage: number;
    pcos: PCO[];
  };
}

export async function fetchPCOs(params?: {
  searchText?: string;
  page?: number;
  limit?: number;
  entityType?: string;
  isDeleted?: boolean;
  id?: number;
}): Promise<PCO[]> {
  const search = new URLSearchParams();
  if (params?.id) search.set("id", String(params.id));
  if (params?.searchText) search.set("searchText", params.searchText);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.entityType) search.set("entityType", params.entityType);
  if (params?.isDeleted !== undefined) search.set("isDeleted", String(params.isDeleted));

  const qs = search.toString();
  const res = await getJson<PagedPCOResponse>(
    `/api/pco/get-pco${qs ? `?${qs}` : ""}`,
  );

  return res.data?.pcos ?? [];
}

export interface CreatePCOPayload {
  firstName?: string;
  lastName: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  otherPhone?: string;
  email?: string;
  website?: string;
  notes?: string;
  entityType?: string;
  hospital?: boolean;
  rescue?: boolean;
  mailList?: boolean;
  flag?: boolean;
  flagReason?: string;
  countryId?: number;
}

export async function createPCO(payload: CreatePCOPayload): Promise<PCO> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: any;
  }>("/api/pco/create-pco", payload);

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create PCO");
  }

  return res.data.pco;
}

export interface UpdatePCOPayload {
  id: string | number;
  firstName?: string;
  lastName: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  otherPhone?: string;
  email?: string;
  website?: string;
  notes?: string;
  entityType?: string;
  hospital?: boolean;
  rescue?: boolean;
  mailList?: boolean;
  flag?: boolean;
  flagReason?: string;
  countryId?: number;
}

export async function updatePCO(payload: UpdatePCOPayload): Promise<PCO> {
  const res = await putJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      pco: PCO;
    };
  }>(`/api/pco/update-pco/${payload.id}`, payload);

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update PCO");
  }

  return res.data.pco;
}

export async function deletePCO(pcoId: string | number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/pco/delete-pco/${pcoId}`);

  if (!res.success) {
    const errorMessage = res.errors?.[0] || res.message || "Failed to delete PCO";
    throw new Error(errorMessage);
  }
}

export interface PCOOtherRescue {
  id: number;
  lastNameOtherRescue: string;
}

export async function fetchPCOOtherRescues(): Promise<PCOOtherRescue[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      pcoOtherRescues?: PCOOtherRescue[];
    };
  }>("/api/pco/get-pco-other-rescues");

  return res.data?.pcoOtherRescues ?? [];
}

export async function createPCOOtherRescue(rescueName: string): Promise<PCOOtherRescue> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: PCOOtherRescue;
  }>("/api/pco/create-pco-other-rescue", {
    lastNameOtherRescue: rescueName,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create rescue");
  }

  return res.data;
}

export interface PCOHospital {
  id: number;
  firstName: string;
  lastName: string;
  lastNameHospital: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  hospital: boolean;
  entityType: string;
  [key: string]: any;
}

export async function fetchPCOHospitals(): Promise<PCOHospital[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      pcoHospitals: PCOHospital[];
    };
  }>("/api/pco/get-pco-hospitals");

  if (!res.success) {
    throw new Error(res.message || "Failed to fetch PCO hospitals");
  }

  return res.data?.pcoHospitals ?? [];
}

// PCO Donations
export interface PCODonation {
  id: string;
  donorId: string;
  donorName: string;
  amount: number;
  date: string;
  type: string;
  purpose?: string | null;
  notes?: string | null;
}

export interface PCODonationsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    donations: PCODonation[];
    totalCount: number;
  };
}

export async function fetchPCODonations(pcoId: number): Promise<{ donations: PCODonation[]; totalAmount: number }> {
  const res = await getJson<PCODonationsResponse>(`/api/donation/get-donation?pcoId=${pcoId}`);

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to fetch donations");
  }

  return {
    donations: res.data.donations || [],
    totalAmount: res.data.totalCount || 0,
  };
}

export interface CreatePCODonationPayload {
  pcoId: number;
  amount: number;
  date?: string;
  donationType?: string;
  notes?: string;
}

export async function createPCODonation(payload: CreatePCODonationPayload): Promise<PCODonation> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: PCODonation;
  }>("/api/donation/add-donation", {
    pcoId: payload.pcoId,
    amount: payload.amount,
    date: payload.date,
    donationType: payload.donationType || "money",
    notes: payload.notes,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create donation");
  }

  return res.data;
}

export interface UpdatePCODonationPayload {
  amount: number;
  date?: string;
  donationType?: string;
  notes?: string;
}

export async function updatePCODonation(
  donationId: number,
  payload: UpdatePCODonationPayload
): Promise<PCODonation> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: PCODonation;
  }>(`/api/donation/update-donation/${donationId}`, payload);

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update donation");
  }

  return res.data;
}

export async function deletePCODonation(donationId: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/donation/delete-donation/${donationId}`);

  if (!res.success) {
    const errorMessage = res.errors?.[0] || res.message || "Failed to delete donation";
    throw new Error(errorMessage);
  }
}

// Acquisition Ways
export interface AcquisitionWay {
  id: string | number;
  acquisitionWayName: string;
}

export async function fetchAcquisitionWays(): Promise<AcquisitionWay[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      acquisitionWays?: AcquisitionWay[];
    };
  }>("/api/acquisition-way/get-acquisition-way");

  return res.data?.acquisitionWays ?? [];
}

export interface OtherRescue {
  id: number;
  lastNameOtherRescue: string;
  lastName?: string;
  name?: string;
}

export async function fetchOtherRescues(): Promise<OtherRescue[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      pcoOtherRescues?: OtherRescue[];
    };
  }>("/api/pco/get-pco-other-rescues");

  return res.data?.pcoOtherRescues ?? [];
}

// Animal Types

export interface AnimalTypeDTO {
  id: number;
  typeName: string;
}

export interface AnimalTypesResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    animalTypes: AnimalTypeDTO[];
  };
}

export async function fetchAnimalTypes(params?: {
  roleName?: string;
}): Promise<AnimalTypeDTO[]> {
  const search = new URLSearchParams();
  if (params?.roleName) {
    search.set("roleName", params.roleName);
  }

  const queryString = search.toString();
  const path = `/api/animaltype/get-animal-types${queryString ? `?${queryString}` : ""}`;

  const res = await getJson<AnimalTypesResponse>(path);
  return res.data?.animalTypes ?? [];
}

export async function createAnimalType(typeName: string, roleName?: string): Promise<AnimalTypeDTO> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: AnimalTypeDTO;
  }>("/api/animaltype/create-animal-type", {
    typeName,
    roleName: roleName || undefined,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create animal type");
  }

  return res.data;
}

export async function updateAnimalType(id: number, typeName: string, roleName?: string): Promise<AnimalTypeDTO> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      animalType: AnimalTypeDTO;
    };
  }>(`/api/animaltype/update-animal-type/${id}`, {
    typeName,
    roleName: roleName || undefined,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update animal type");
  }

  return res.data.animalType;
}

export async function deleteAnimalType(id: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
  }>(`/api/animaltype/delete-animal-type/${id}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete animal type");
  }
}

export async function checkAnimalTypeAvailable(typeName: string, roleName: string): Promise<boolean> {
  const search = new URLSearchParams();
  search.set("typeName", typeName);
  search.set("roleName", roleName);

  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      isAvailable: boolean;
    };
  }>(`/api/animaltype/available-animal-type?${search.toString()}`);

  if (!res.success || res.data === undefined) {
    throw new Error(res.message || "Failed to check animal type availability");
  }

  return res.data.isAvailable;
}

export async function createAcquisitionWay(acquisitionWayName: string): Promise<AcquisitionWay> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: AcquisitionWay;
  }>("/api/acquisition-way/create-acquisition-way", {
    acquisitionWayName,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create acquisition way");
  }

  return res.data;
}

export async function updateAcquisitionWay(id: number, acquisitionWayName: string): Promise<AcquisitionWay> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      acquisitionWay: AcquisitionWay;
    };
  }>(`/api/acquisition-way/update-acquisition-way/${id}`, {
    acquisitionWayName,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update acquisition way");
  }

  return res.data.acquisitionWay;
}

export async function deleteAcquisitionWay(id: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
  }>(`/api/acquisition-way/delete-acquisition-way/${id}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete acquisition way");
  }
}

export async function checkAcquisitionWayAvailable(acquisition: string): Promise<boolean> {
  const search = new URLSearchParams();
  search.set("acquisition", acquisition);

  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      isAvailable: boolean;
    };
  }>(`/api/acquisition-way/available-acquisition-way?${search.toString()}`);

  if (!res.success || res.data === undefined) {
    throw new Error(res.message || "Failed to check acquisition way availability");
  }

  return res.data.isAvailable;
}

// Animal behaviors

export interface AnimalBehavior {
  id: string | number;
  kind: string;
  behaviorName?: string;
  animalTypeId?: number;
}

export async function fetchAnimalBehaviors(animalTypeId: number): Promise<AnimalBehavior[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      behaviors?: AnimalBehavior[];
      animalBehaviors?: AnimalBehavior[];
    };
  }>(`/api/animal-behavior/get-animal-behavior-by-animalId?animalTypeId=${animalTypeId}`);

  return res.data?.animalBehaviors ?? res.data?.behaviors ?? [];
}

export async function createAnimalBehavior(kind: string, animalTypeId: number): Promise<AnimalBehavior> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: AnimalBehavior;
  }>("/api/animal-behavior/create-animal-behavior", {
    kind,
    animalTypeId,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create animal behavior");
  }

  return res.data;
}

export async function updateAnimalBehavior(id: number, kind: string, animalTypeId: number): Promise<AnimalBehavior> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      behavior: AnimalBehavior;
    };
  }>(`/api/animal-behavior/update-behavior/${id}`, {
    behaviorName: kind,
    animalTypeId,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update animal behavior");
  }

  return res.data.behavior;
}

export async function deleteAnimalBehavior(id: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
  }>(`/api/animal-behavior/delete-behavior/${id}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete animal behavior");
  }
}

export interface BehaviorUpdate {
  name: string;
  yesOrNo: boolean;
  notes?: string;
}

// Health Procedures

export interface HealthProcedure {
  id: string | number;
  kind: string;
  animalTypeId?: number;
}

export async function fetchHealthProcedures(animalTypeId: number): Promise<HealthProcedure[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      healthProcedures?: HealthProcedure[];
    };
  }>(`/api/health-procedure/get-health-procedure-by-animalId?animalTypeId=${animalTypeId}`);

  return res.data?.healthProcedures ?? [];
}

export async function createHealthProcedure(kind: string, animalTypeId: number): Promise<HealthProcedure> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: HealthProcedure;
  }>("/api/health-procedure/create-health-procedure", {
    kind,
    animalTypeId,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create health procedure");
  }

  return res.data;
}

export async function updateHealthProcedure(id: number, kind: string, animalTypeId: number): Promise<HealthProcedure> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      healthProcedure: HealthProcedure;
    };
  }>(`/api/health-procedure/update-health-procedure/${id}`, {
    kind,
    animalTypeId,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update health procedure");
  }

  return res.data.healthProcedure;
}

export async function deleteHealthProcedure(id: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
  }>(`/api/health-procedure/delete-health-procedure/${id}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete health procedure");
  }
}

// Vaccination Types

export interface VaccinationType {
  id: string | number;
  kind: string;
  animalTypeId?: number;
}

export async function fetchVaccinationTypes(animalTypeId: number): Promise<VaccinationType[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      vaccinationTypes?: VaccinationType[];
    };
  }>(`/api/vaccination-type/get-vaccination-type-by-animalId?animalTypeId=${animalTypeId}`);

  return res.data?.vaccinationTypes ?? [];
}

export async function createVaccinationType(kind: string, animalTypeId: number): Promise<VaccinationType> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: VaccinationType | { isAvailable: boolean };
  }>("/api/vaccination-type/create-vaccination-type", {
    kind,
    animalTypeId,
  });

  // Handle case where vaccination type already exists
  if (!res.success && res.statusCode === 200 && res.data && "isAvailable" in res.data) {
    throw new Error(res.message || "Vaccination type already exists");
  }

  if (!res.success || !res.data || "isAvailable" in res.data) {
    throw new Error(res.message || "Failed to create vaccination type");
  }

  return res.data as VaccinationType;
}

export async function updateVaccinationType(id: number, kind: string, animalTypeId: number): Promise<VaccinationType> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      vaccinationType: VaccinationType;
    };
  }>(`/api/vaccination-type/update-vaccination-type/${id}`, {
    kind,
    animalTypeId,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update vaccination type");
  }

  return res.data.vaccinationType;
}

export async function deleteVaccinationType(id: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
  }>(`/api/vaccination-type/delete-vaccination-type/${id}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete vaccination type");
  }
}

// Medicines

export interface Medicine {
  id: string | number;
  medicineName: string;
  usedFor: string;
}

export async function fetchMedicines(): Promise<Medicine[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      medicines?: Medicine[];
    };
  }>("/api/medicine/get-medicine");

  return res.data?.medicines ?? [];
}

export async function createMedicine(medicineName: string, usedFor: string): Promise<Medicine> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: Medicine;
  }>("/api/medicine/create-medicine", {
    medicineName,
    usedFor,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create medicine");
  }

  return res.data;
}

export async function updateMedicine(id: number, medicineName: string, usedFor: string): Promise<Medicine> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      medicine: Medicine;
    };
  }>(`/api/medicine/update-medicine/${id}`, {
    medicineName,
    usedFor,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update medicine");
  }

  return res.data.medicine;
}

export async function deleteMedicine(id: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
  }>(`/api/medicine/delete-medicine/${id}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete medicine");
  }
}

// Volunteer Activities

export interface VolunteerActivity {
  id: number;
  volunteerActivityName: string;
}

export async function fetchVolunteerActivities(): Promise<VolunteerActivity[]> {
  const res = await getJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      volunteerActivities?: VolunteerActivity[];
    };
  }>("/api/volunteer-activity/get-volunteer-activity");

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to fetch volunteer activities");
  }

  return res.data.volunteerActivities ?? [];
}

export async function createVolunteerActivity(volunteerActivityName: string): Promise<VolunteerActivity> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: VolunteerActivity;
  }>("/api/volunteer-activity/create-volunteer-activity", {
    volunteerActivityName,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create volunteer activity");
  }

  return res.data;
}

export async function updateVolunteerActivity(id: number, volunteerActivityName: string): Promise<VolunteerActivity> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      id: number;
      volunteerActivity: VolunteerActivity;
    };
  }>(`/api/volunteer-activity/update-volunteer-activity/${id}`, {
    volunteerActivityName,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to update volunteer activity");
  }

  return res.data.volunteerActivity;
}

export async function deleteVolunteerActivity(id: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
  }>(`/api/volunteer-activity/delete-volunteer-activity/${id}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete volunteer activity");
  }
}

export interface UpsertBehaviorsPayload {
  animalIds: (string | number)[];
  behaviors: BehaviorUpdate[];
}

export async function upsertAnimalBehaviors(
  payload: UpsertBehaviorsPayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/animal-behavior/upsert-animal-behaviors",
    {
      animalIds: payload.animalIds,
      behaviors: payload.behaviors,
    },
  )
}

// Animal location updates

export interface UpdateLocationPayload {
  animalIds: (string | number)[];
  location: string;
}

export interface UpdateLocationResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
}

export async function updateAnimalLocation(
  payload: UpdateLocationPayload,
): Promise<UpdateLocationResponse> {
  return await putJson<UpdateLocationResponse, UpdateLocationPayload>(
    "/api/animal/update-animal-location",
    payload,
  )
}

// Delete Animal

export interface DeleteAnimalResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    isDeleted: boolean;
  };
}

export async function deleteAnimal(id: string | number): Promise<void> {
  await patchJson<DeleteAnimalResponse>(
    `/api/animal/delete-animal/${id}`,
  );
}

// Update Animal

export interface UpdateAnimalPayload {
  animalName?: string;
  breed?: string;
  color?: string;
  sex?: string;
  status?: string;
  animalTypeId?: number;
  chronicCondition?: string;
  notes?: string;
  location?: string;
  spayedOrNeutered?: boolean;
  flag?: boolean;
  flagReason?: string;
  currentResident?: boolean;
  pcoId?: number;
  lastMilestone?: string;
  lastMilestoneDate?: string;
}

export interface UpdateAnimalResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    id: number;
    animal: any;
  };
}

export async function updateAnimal(
  id: string | number,
  payload: UpdateAnimalPayload,
): Promise<Animal> {
  const res = await putJson<UpdateAnimalResponse>(
    `/api/animal/update-animal?Id=${id}`,
    payload,
  );

  if (!res.success || !res.data) {
    throw new Error(res.message || res.errors?.[0] || "Failed to update animal");
  }

  // Map the backend response to frontend Animal type
  const backendAnimal = res.data.animal;
  return mapBackendAnimalToFrontend(backendAnimal as BackendAnimalResponse);
}

// Diary

export interface AddDiaryPayload {
  animalIds: (string | number)[];
  date: string;
  notes: string;
}

export interface DiaryEntry {
  id: number;
  animalId: number;
  tenantOrAnimal: string;
  actionDate: string;
  notes: string;
  dateEntered: string | null;
  dateModified: string | null;
  enteredBy: string;
  modifiedBy: string;
  isDeleted: boolean;
  tenantId: number;
  animal: string;
}

export type TenantDiaryEntry = DiaryEntry;

export interface DiaryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    diaries: DiaryEntry[];
  };
  errors?: string[];
}

export interface TenantDiaryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    diaries: TenantDiaryEntry[];
  };
}

export interface AddTenantDiaryPayload {
  actionDate: string;
  notes: string;
}

export interface UpdateTenantDiaryPayload {
  actionDate?: string;
  notes?: string;
}

export async function addDiaryEntry(
  payload: AddDiaryPayload,
): Promise<DiaryResponse> {
  return await postJson<DiaryResponse>(
    "/api/diary/add-diary",
    payload,
  )
}

export async function fetchDiariesByAnimalId(
  animalId: number,
): Promise<DiaryEntry[]> {
  const res = await getJson<DiaryResponse>(`/api/diary/get-diary?animalId=${animalId}`);
  return res.data?.diaries ?? [];
}

export async function fetchTenantDiaries(): Promise<TenantDiaryEntry[]> {
  const res = await getJson<TenantDiaryResponse>("/api/diary/get-diary-tenant");
  return res.data?.diaries ?? [];
}

export async function addTenantDiaryEntry(
  payload: AddTenantDiaryPayload,
): Promise<TenantDiaryEntry> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      diaries: TenantDiaryEntry[];
    };
  }>("/api/diary/add-diary", {
    animalIds: [0],
    entityType: "tenant",
    diaryVm: {
      actionDate: payload.actionDate,
      notes: payload.notes,
    },
  });

  if (!res.success || !res.data?.diaries || res.data.diaries.length === 0) {
    throw new Error("Failed to add diary entry");
  }

  return res.data.diaries[0];
}

export interface UpdateDiaryPayload {
  actionDate?: string;
  notes?: string;
}

export interface UpdateDiaryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    diary: DiaryEntry;
  };
}

export async function updateDiaryEntry(
  diaryId: number,
  payload: UpdateDiaryPayload,
): Promise<UpdateDiaryResponse> {
  return await postJson<UpdateDiaryResponse>(`/api/diary/update-diary/${diaryId}`, payload);
}

export async function updateTenantDiaryEntry(
  diaryId: number,
  payload: UpdateTenantDiaryPayload,
): Promise<TenantDiaryEntry> {
  const res = await updateDiaryEntry(diaryId, payload);

  if (!res.success || !res.data?.diary) {
    throw new Error(res.errors?.[0] || res.message || "Failed to update diary entry");
  }

  return res.data.diary;
}

export interface DeleteDiaryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    isDeleted: boolean;
  };
}

export async function deleteDiaryEntry(diaryId: number): Promise<DeleteDiaryResponse> {
  return await patchJson<DeleteDiaryResponse>(`/api/diary/delete-diary/${diaryId}`, {});
}

export async function deleteTenantDiaryEntry(diaryId: number): Promise<void> {
  const res = await deleteDiaryEntry(diaryId);

  if (!res.success) {
    throw new Error(res.errors?.[0] || res.message || "Failed to delete diary entry");
  }
}

// Media (Photos, Videos, Documents)

export interface MediaItemDTO {
  id: string;
  type: "photo" | "video" | "document";
  url: string;
  date: string;
  rank: number;
  description: string;
  notes: string;
}

export interface MediaListResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: { media: MediaItemDTO[] };
}

export async function fetchAnimalMedia(
  animalId: string | number,
): Promise<MediaItemDTO[]> {
  if (!animalId) return []
  const res = await getJson<MediaListResponse>(
    `/api/artifact-attachment/by-animal/${animalId}`,
  )
  const items = res.data?.media ?? []
  return items.map((item) => ({
    ...item,
    url: item.url.startsWith("/static/") ? `${API_BASE_URL}${item.url}` : item.url,
  }))
}

// Tenant Attachments

export interface ArtifactAttachment {
  id: number;
  entity: string;
  attachmentType: string;
  fileName: string;
  fileNameExtension: string;
  attachmentDate: string | null;
  publicityRank: number;
  sequenceNo: number;
  notes: string;
  originalBlobUrl: string;
  blobUrl: string;
  thumbnailBlobUrl: string;
  dateEntered: string | null;
  dateModified: string | null;
  enteredBy: string;
  modifiedBy: string;
  isDeleted: boolean;
  pcoId: number | null;
  animalId: number | null;
  tenantId: number;
  animal: string;
  description: string;
  person: string;
  originalFileName: string;
}

export interface TenantAttachmentsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    artifactAttachments: ArtifactAttachment[];
  };
}

export async function fetchTenantAttachments(tenantId: number): Promise<ArtifactAttachment[]> {
  const res = await getJson<TenantAttachmentsResponse>(
    `/api/artifact-attachment/get-allartifact-by-tenantid/${tenantId}`
  );
  return res.data?.artifactAttachments ?? [];
}

export async function deleteTenantAttachment(attachmentId: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/artifact-attachment/delete-artifactattachment/${attachmentId}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete attachment");
  }
}

// PCO Attachments

export interface PCOAttachmentsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    artifactAttachments: ArtifactAttachment[];
  };
}

export async function fetchPCOAttachments(pcoId: number, tenantId?: number): Promise<ArtifactAttachment[]> {
  const url = tenantId 
    ? `/api/artifact-attachment/get-allartifact-by-pcoid/${pcoId}?tenantId=${tenantId}`
    : `/api/artifact-attachment/get-allartifact-by-pcoid/${pcoId}`;
  const res = await getJson<PCOAttachmentsResponse>(url);
  return res.data?.artifactAttachments ?? [];
}

export async function deletePCOAttachment(attachmentId: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/artifact-attachment/delete-artifactattachment/${attachmentId}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete attachment");
  }
}

export interface UploadPCOAttachmentOptions {
  type: "photo" | "video" | "document";
  date: string;
  description?: string;
  notes?: string;
  rank?: number;
}

export async function uploadPCOAttachment(
  pcoId: number,
  file: File,
  options: UploadPCOAttachmentOptions,
): Promise<ArtifactAttachment> {
  const formData = new FormData();
  formData.append("pcoId", String(pcoId));
  formData.append("entity", "PCO");
  formData.append("file", file);
  formData.append("attachmentType", options.type.charAt(0).toUpperCase() + options.type.slice(1));
  formData.append("attachmentDate", new Date(options.date).toISOString());
  if (options.description) formData.append("description", options.description);
  if (options.notes) formData.append("notes", options.notes);
  if (typeof options.rank === "number") {
    formData.append("publicityRank", String(options.rank));
  }

  const response = await postFormData<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      artifactAttachment: ArtifactAttachment;
    };
  }>("/api/artifact-attachment/create-artifactattachment", formData);

  if (!response.success || !response.data?.artifactAttachment) {
    throw new Error(response.message || "Failed to upload PCO attachment");
  }

  return response.data.artifactAttachment;
}

async function putFormData<TResponse>(
  path: string,
  formData: FormData,
  retryCount = 0,
): Promise<TResponse> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: {
      // Don't set Content-Type header - browser will set it with boundary for FormData
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  
  // If token expired (401) and we haven't retried yet, try to refresh
  if (res.status === 401 && retryCount === 0) {
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      // Retry the request with the new token
      return putFormData<TResponse>(path, formData, retryCount + 1);
    } else {
      // Refresh failed, clear auth and redirect to login
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("auth");
        window.sessionStorage.removeItem("auth");
        window.location.href = "/auth";
      }
      throw new Error("Session expired. Please login again.");
    }
  }
  
  if (!res.ok || (json && (json as any).success === false)) {
    const message =
      (json as any)?.message ||
      (json as any)?.errors?.[0] ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return json as TResponse;
}

export async function updatePCOAttachment(
  attachmentId: number,
  options: UploadPCOAttachmentOptions,
  file?: File,
): Promise<ArtifactAttachment> {
  const formData = new FormData();
  formData.append("attachmentType", options.type.charAt(0).toUpperCase() + options.type.slice(1));
  formData.append("attachmentDate", new Date(options.date).toISOString());
  if (options.description !== undefined) formData.append("description", options.description || "");
  if (options.notes !== undefined) formData.append("notes", options.notes || "");
  if (typeof options.rank === "number") {
    formData.append("publicityRank", String(options.rank));
  }
  if (file) {
    formData.append("file", file);
  }

  const response = await putFormData<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      artifactAttachment: ArtifactAttachment;
    };
  }>(`/api/artifact-attachment/update-artifactattachment/${attachmentId}`, formData);

  if (!response.success || !response.data?.artifactAttachment) {
    throw new Error(response.message || "Failed to update PCO attachment");
  }

  return response.data.artifactAttachment;
}

// PCO History

export interface PCOHistoryItem {
  tenantId: number;
  animalMilestoneId: number;
  animalId: number;
  pcoId: number;
  donationId: number;
  volunteerId: number;
  pvdId: number;
  tableName: "Animal Milestone" | "Donation" | "Volunteer" | "PVD";
  date: string | null;
  volDateInactive: string | null;
  milestoneAttachmentType: string;
  amount: number;
  milestoneAmountReceivedFee: number;
  animalType: string;
  animalName: string;
  notes: string;
  firstName: string;
  lastName: string;
  animalMilestoneDeleted: boolean;
  animalDeleted: boolean;
  donationDeleted: boolean;
  volunteerDeleted: boolean;
  pvdDeleted: boolean;
}

export interface PCOHistoryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    pcosHistory: PCOHistoryItem[];
  };
}

export async function fetchPCOHistory(pcoId: number): Promise<PCOHistoryItem[]> {
  const res = await getJson<PCOHistoryResponse>(`/api/pco/get-pco-history?pcoId=${pcoId}`);
  return res.data?.pcosHistory ?? [];
}

export interface CreateMediaPayload {
  animalId: string | number;
  type: "photo" | "video" | "document";
  date: string;
  description: string;
  notes: string;
  rank?: number;
}

export async function createAnimalMedia(
  payload: CreateMediaPayload,
): Promise<MediaItemDTO> {
  const res = await postJson<{
    success: boolean
    statusCode: number
    data?: MediaItemDTO
    message?: string
  }>("/api/artifact-attachment/create-for-animal", payload)

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create media item")
  }

  return res.data
}

async function postFormData<TResponse>(
  path: string,
  formData: FormData,
  retryCount = 0,
): Promise<TResponse> {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      // Don't set Content-Type header - browser will set it with boundary for FormData
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const json = await res.json().catch(() => ({}));
  
  // If token expired (401) and we haven't retried yet, try to refresh
  if (res.status === 401 && retryCount === 0) {
    const refreshed = await refreshAuthToken();
    if (refreshed) {
      // Retry the request with the new token
      return postFormData<TResponse>(path, formData, retryCount + 1);
    } else {
      // Refresh failed, clear auth and redirect to login
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("auth");
        window.sessionStorage.removeItem("auth");
        window.location.href = "/auth";
      }
      throw new Error("Session expired. Please login again.");
    }
  }
  
  if (!res.ok || (json && (json as any).success === false)) {
    const message =
      (json as any)?.message ||
      (json as any)?.errors?.[0] ||
      `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return json as TResponse;
}

export async function uploadAnimalImage(
  animalId: string | number,
  file: File,
  options?: { description?: string; notes?: string; rank?: number },
): Promise<MediaItemDTO> {
  const formData = new FormData()
  formData.append("animalId", String(animalId))
  formData.append("file", file)
  formData.append("attachmentDate", new Date().toISOString())
  if (options?.description) formData.append("description", options.description)
  if (options?.notes) formData.append("notes", options.notes)
  if (typeof options?.rank === "number") {
    formData.append("publicityRank", String(options.rank))
  }

  const response = await fetch(`${API_BASE_URL}/api/artifact-attachment/upload-image`, {
    method: "POST",
    body: formData,
  })

  const json = (await response.json()) as {
    success: boolean
    statusCode: number
    message?: string
    data?: MediaItemDTO
  }

  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message || "Failed to upload animal image")
  }

  const media = json.data
  return {
    ...media,
    url: media.url.startsWith("/static/") ? `${API_BASE_URL}${media.url}` : media.url,
  }
}

export interface UploadTenantAttachmentOptions {
  type: "photo" | "video" | "document"
  date: string
  description?: string
  notes?: string
  rank?: number
}

export async function uploadTenantAttachment(
  tenantId: number,
  file: File,
  options: UploadTenantAttachmentOptions,
): Promise<ArtifactAttachment> {
  const formData = new FormData()
  formData.append("tenantId", String(tenantId))
  formData.append("file", file)
  formData.append("attachmentType", options.type.toUpperCase())
  formData.append("attachmentDate", new Date(options.date).toISOString())
  if (options.description) formData.append("description", options.description)
  if (options.notes) formData.append("notes", options.notes)
  if (typeof options.rank === "number") {
    formData.append("publicityRank", String(options.rank))
  }

  const response = await postFormData<{
    success: boolean
    statusCode: number
    message?: string
    data?: {
      artifactAttachment: ArtifactAttachment
    }
  }>("/api/artifact-attachment/create-artifactattachment", formData)

  if (!response.success || !response.data?.artifactAttachment) {
    throw new Error(response.message || "Failed to upload tenant attachment")
  }

  return response.data.artifactAttachment
}

// Vaccinations

export interface CreateVaccinationPayload {
  animalIds: (string | number)[];
  kindId: number;
  actionDate: string;
  hospitalClinicId: number;
  administerer?: string;
  tagNumber?: string;
  vaccineManufacturer?: string;
  vaccineSerialNo?: string;
  notes?: string;
  dueAgain?: string;
  reminder?: boolean;
}

export interface CreateVaccinationResponse {
  success: boolean
  statusCode: number
  message?: string
  errors?: string[]
  data?: {
    items?: Array<{
      animalId: number
      kindId: number
      actionDate?: string
      dueDate?: string
      reminder: boolean
    }>
  } | Array<{
    animalId: number
    animalVaccinations: Array<{
      id: number
      kindId: number
      animalId: number
      actionDate?: string
      dueDate?: string
      reminder: boolean
    }>
  }>
}

export async function createAnimalVaccinations(
  payload: CreateVaccinationPayload,
): Promise<CreateVaccinationResponse> {
  const response = await postJson<CreateVaccinationResponse>(
    "/api/animal-vaccination/add-animal-vaccinations",
    payload,
  )
  
  if (!response.success) {
    throw new Error(response.message || response.errors?.[0] || "Failed to create vaccination")
  }
  
  return response
}

export interface AnimalVaccination {
  id: number
  kindId: number
  animalId: number
  animalName?: string
  animalType?: string
  animalTypeId?: number
  vaccinationKind: string
  reminder: boolean
  dueDate?: string
  actionDate?: string
  hospitalClinicId: number
  hospitalClinic: string
  administerer?: string
  tagNumber?: string
  vaccineManufacturer?: string
  vaccineSerialNo?: string
  notes?: string
  dueAgain?: string
  vaccRecordNo?: string
  dateEntered?: string
  modifiedBy?: string
  isDeleted: boolean
  tenantId: number
}

export interface GetAnimalVaccinationsResponse {
  success: boolean
  statusCode: number
  data?: {
    animalVaccinations: AnimalVaccination[]
  }
}

export async function fetchAnimalVaccinations(
  animalId: number | string,
  reminder: boolean = false,
  isDeleted: boolean = false,
): Promise<AnimalVaccination[]> {
  const params = new URLSearchParams({
    animalId: String(animalId),
    reminder: String(reminder),
    isDeleted: String(isDeleted),
  })
  
  const res = await getJson<GetAnimalVaccinationsResponse>(
    `/api/animal-vaccination/get-animal-vaccination?${params.toString()}`
  )
  
  return res.data?.animalVaccinations ?? []
}

export interface UpdateVaccinationPayload {
  kindId?: number
  actionDate?: string
  dueDate?: string
  hospitalClinicId?: number
  administerer?: string
  tagNumber?: string
  vaccineManufacturer?: string
  vaccineSerialNo?: string
  notes?: string
  dueAgain?: string
  reminder?: boolean
}

export interface UpdateVaccinationResponse {
  success: boolean
  statusCode: number
  message?: string
  errors?: string[]
}

export async function updateAnimalVaccination(
  vaccinationId: number,
  payload: UpdateVaccinationPayload,
  completeReminder: boolean = false,
): Promise<UpdateVaccinationResponse> {
  const params = completeReminder ? "?completeReminder=true" : ""
  const response = await postJson<UpdateVaccinationResponse>(
    `/api/animal-vaccination/update-animal-vaccination/${vaccinationId}${params}`,
    payload,
  )
  
  if (!response.success) {
    throw new Error(response.message || response.errors?.[0] || "Failed to update vaccination")
  }
  
  return response
}

export async function deleteAnimalVaccination(vaccinationId: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/animal-vaccination/delete-animal-vaccination/${vaccinationId}`, {});
  
  if (!res.success) {
    throw new Error(res.message || res.errors?.[0] || "Failed to delete vaccination");
  }
}

// Procedures / Tests / Treatments

export interface AnimalProcedure {
  id: number
  kindId: number
  animalId: number
  animalName?: string
  animalType?: string
  animalTypeId?: number
  healthProcedureKind: string
  reminder: boolean
  dueDate?: string
  actionDate?: string
  hospitalClinicId: number | null
  hospitalClinic: string
  administerer?: string
  microchipNumber?: string
  results?: string
  notes?: string
  dueAgain?: string
  procedureRecordNo?: string
  dateEntered?: string
  modifiedBy?: string
  isDeleted: boolean
  tenantId: number
}

export interface GetAnimalProceduresResponse {
  success: boolean
  statusCode: number
  data?: {
    animalProcedures: AnimalProcedure[]
  }
}

export async function fetchAnimalProcedures(
  animalId: number | string,
  reminder: boolean = false,
  isDeleted: boolean = false,
): Promise<AnimalProcedure[]> {
  const params = new URLSearchParams({
    animalId: String(animalId),
    reminder: String(reminder),
    isDeleted: String(isDeleted),
  })

  const res = await getJson<GetAnimalProceduresResponse>(
    `/api/animal-procedure/get-animal-procedure?${params.toString()}`
  )

  return res.data?.animalProcedures ?? []
}

export interface CreateProcedurePayload {
  animalIds: (string | number)[];
  kindId: number;
  actionDate: string;
  hospitalClinicId: number | null;
  administerer?: string;
  microchipNumber?: string;
  results?: string;
  notes?: string;
  dueAgain?: string;
  reminder?: boolean;
}

export async function createAnimalProcedures(
  payload: CreateProcedurePayload,
): Promise<void> {
  const { animalIds, ...procedureData } = payload;
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/animal-procedure/add-animal-procedures",
    {
      animalIds,
      animalProcedureVm: procedureData,
    },
  )
}

export interface UpdateProcedurePayload {
  kindId?: number
  actionDate?: string
  dueDate?: string
  hospitalClinicId?: number | null
  administerer?: string
  microchipNumber?: string
  results?: string
  notes?: string
  dueAgain?: string
  reminder?: boolean
}

export async function updateAnimalProcedure(
  procedureId: number,
  payload: UpdateProcedurePayload,
  completeReminder: boolean = false,
): Promise<void> {
  const params = completeReminder ? "?completeReminder=true" : ""
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    `/api/animal-procedure/update-animal-procedure/${procedureId}${params}`,
    payload,
  )
}

export async function deleteAnimalProcedure(procedureId: number): Promise<void> {
  await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/animal-procedure/delete-animal-procedure/${procedureId}`, {});
}

export interface AnimalWeightHistory {
  id: number
  animalId: number
  weight: string
  actionDate: string
}

export interface GetAnimalWeightHistoryResponse {
  success: boolean
  statusCode: number
  data?: {
    animalWeightHistory: AnimalWeightHistory[]
  }
}

export async function fetchAnimalWeightHistory(
  animalId: number | string,
): Promise<AnimalWeightHistory[]> {
  const res = await getJson<GetAnimalWeightHistoryResponse>(
    `/api/animal-procedure/get-animal-weight-history?animalId=${animalId}`
  )

  return res.data?.animalWeightHistory ?? []
}

// Health reminders (vaccinations / procedures / meds)

export interface CreateReminderBasePayload {
  animalIds: (string | number)[]
  itemName: string
  dueDates: string[]
  notes?: string
}

export async function createVaccinationReminders(
  payload: CreateReminderBasePayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/animal-vaccination/add-reminders",
    payload,
  )
}

export async function createProcedureReminders(
  payload: CreateReminderBasePayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/animal-procedure/add-reminders",
    payload,
  )
}

export interface CreateMedReminderPayload extends CreateReminderBasePayload {
  dosage?: string
}

export async function createMedReminders(
  payload: CreateMedReminderPayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/med/add-meds",
    payload,
  )
}

// Completed meds

export interface CompletedMedDTO {
  id: string | number
  animalId: string | number
  date: string
  medicine: string
  dosage: string
  personAdministering?: string
  notes?: string
}

export interface CompletedMedListResponse {
  success: boolean
  statusCode: number
  message?: string
  data?: { items: CompletedMedDTO[] }
}

export interface CreateCompletedMedPayload {
  animalIds: (string | number)[]
  medicineName: string
  dosage?: string
  frequency?: string
  startDate: string
  notes?: string
  personAdministering?: string
}

export async function createCompletedMeds(
  payload: CreateCompletedMedPayload,
): Promise<CompletedMedDTO[]> {
  const res = await postJson<CompletedMedListResponse>(
    "/api/med/create-completed-meds",
    payload,
  )

  return res.data?.items ?? []
}

// Diet (simple text stored on Animal)

export interface UpdateDietPayload {
  animalIds: (string | number)[]
  diet: string
}

export async function updateAnimalDiet(
  payload: UpdateDietPayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/animal/update-animal-diet",
    payload,
  )
}

// SOAP (Subjective / Objective / Assessment / Plan)

export interface SOAPEntry {
  id: number
  animalId: number
  actionDate?: string
  date?: string
  subjective: string
  objective: string
  assessment: string
  soapPlan?: string
  plan?: string
  hospitalClinicId?: number
  veterinarian: string
  dateEntered?: string | null
  dateModified?: string | null
  enteredBy?: string
  modifiedBy?: string
  isDeleted?: boolean
  tenantId?: number
}

export interface SOAPListResponse {
  success: boolean
  statusCode: number
  message?: string
  data?: {
    items?: SOAPEntry[]
    soaPs?: SOAPEntry[]
  }
  errors?: string[]
}

export interface CreateSOAPPayload {
  animalIds: (string | number)[]
  actionDate: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  veterinarian: string
  hospitalClinicId?: number
}

export interface UpdateSOAPPayload {
  actionDate?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  soapPlan?: string;
  plan?: string;
  veterinarian?: string;
  hospitalClinicId?: number;
}

export interface UpdateSOAPResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    soap: SOAPEntry;
  };
}

export interface DeleteSOAPResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    isDeleted: boolean;
  };
}

export async function fetchSOAPsByAnimalId(
  animalId: number,
): Promise<SOAPEntry[]> {
  const res = await getJson<SOAPListResponse>(`/api/soap/get-soap?animalId=${animalId}`);
  return res.data?.soaPs ?? [];
}

export async function fetchAnimalSOAPs(
  animalId: string | number,
): Promise<SOAPEntry[]> {
  if (!animalId) return []

  const res = await getJson<SOAPListResponse>(`/api/soap/by-animal/${animalId}`)
  return res.data?.items ?? []
}

export async function fetchTenantSOAPs(): Promise<SOAPEntry[]> {
  const res = await getJson<SOAPListResponse>("/api/soap/get-soap-tenant");
  return res.data?.soaPs ?? [];
}

export async function createSOAPEntries(
  payload: CreateSOAPPayload,
): Promise<SOAPEntry[]> {
  const res = await postJson<SOAPListResponse>("/api/soap/add-soap", payload)
  return res.data?.items ?? []
}

export async function updateSOAPEntry(
  soapId: number,
  payload: UpdateSOAPPayload,
): Promise<UpdateSOAPResponse> {
  // Map plan to soapPlan if needed
  const updatePayload: any = { ...payload };
  if (payload.plan && !payload.soapPlan) {
    updatePayload.soapPlan = payload.plan;
  }
  
  return await postJson<UpdateSOAPResponse>(`/api/soap/update-soap/${soapId}`, updatePayload);
}

export async function deleteSOAPEntry(soapId: number): Promise<DeleteSOAPResponse> {
  return await patchJson<DeleteSOAPResponse>(`/api/soap/delete-soap/${soapId}`, {});
}

// Health Notes

export interface HealthNoteEntry {
  id: string | number
  animalId: string | number
  date: string
  note: string
}

export interface HealthNoteListResponse {
  success: boolean
  statusCode: number
  message?: string
  data?: { items: HealthNoteEntry[] }
}

export interface CreateHealthNotePayload {
  animalIds: (string | number)[]
  note: string
  actionDate?: string
}

export async function fetchAnimalHealthNotes(
  animalId: string | number,
): Promise<HealthNoteEntry[]> {
  if (!animalId) return []

  const res = await getJson<HealthNoteListResponse>(
    `/api/health-note/by-animal/${animalId}`,
  )
  return res.data?.items ?? []
}

export async function createHealthNotes(
  payload: CreateHealthNotePayload,
): Promise<HealthNoteEntry[]> {
  const res = await postJson<HealthNoteListResponse>(
    "/api/health-note/add-healthnote",
    payload,
  )
  return res.data?.items ?? []
}

export interface UpdateHealthNotePayload {
  note: string
  animalId: string | number
  actionDate?: string
}

export interface UpdateHealthNoteResponse {
  success: boolean
  statusCode: number
  message?: string
  errors?: string[]
  data?: {
    id: number
    healthNote: HealthNoteEntry
  }
}

export async function updateHealthNote(
  healthNoteId: string | number,
  payload: UpdateHealthNotePayload,
): Promise<HealthNoteEntry> {
  const res = await postJson<UpdateHealthNoteResponse>(
    `/api/health-note/update-healthnote/${healthNoteId}`,
    payload,
  )
  if (!res.success || !res.data?.healthNote) {
    throw new Error(res.errors?.[0] || "Failed to update health note")
  }
  return res.data.healthNote
}

export interface DeleteHealthNoteResponse {
  success: boolean
  statusCode: number
  message?: string
  errors?: string[]
  data?: {
    isDeleted: boolean
  }
}

export async function deleteHealthNote(
  healthNoteId: string | number,
): Promise<void> {
  const res = await patchJson<DeleteHealthNoteResponse>(
    `/api/health-note/delete-healthnote/${healthNoteId}`,
  )
  if (!res.success) {
    throw new Error(res.errors?.[0] || "Failed to delete health note")
  }
}

// Health history (combined view)

export interface HealthHistoryEntry {
  date: string
  type: string
  kind: string
  clinic: string
  notes: string
}

export interface HealthHistoryResponse {
  success: boolean
  statusCode: number
  message?: string
  data?: { healthHistories: HealthHistoryEntry[] }
}

export async function fetchHealthHistory(
  animalId: string | number,
): Promise<HealthHistoryEntry[]> {
  if (!animalId) return []

  const res = await getJson<HealthHistoryResponse>(
    `/api/health-history/get-health-history?animalId=${animalId}`,
  )
  return res.data?.healthHistories ?? []
}

export interface TenantInfo {
  name: string;
  tenantAcronym: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  website: string;
  emailAddress: string;
  countryId: number;
  countryName: string;
  countryISO2Code: string;
  countryISDCode: number | null;
  notes?:string
}

export interface GetTenantInfoResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  errors?: string[];
  data?: {
    id: number;
    tenant: TenantInfo;
  };
}

export async function getTenantInfo(): Promise<TenantInfo | null> {
  try {
    const res = await getJson<GetTenantInfoResponse>("/api/tenant/get-tenant-info");
    if (!res.success || !res.data?.tenant) {
      return null;
    }
    return res.data.tenant;
  } catch (error) {
    console.error("Failed to fetch tenant info", error);
    return null;
  }
}

export async function getTenantInfoWithId(): Promise<{ id: number; tenant: TenantInfo } | null> {
  try {
    const res = await getJson<GetTenantInfoResponse>("/api/tenant/get-tenant-info");
    if (!res.success || !res.data) {
      return null;
    }
    return res.data;
  } catch (error) {
    console.error("Failed to fetch tenant info", error);
    return null;
  }
}

export async function updateTenantInfo(tenantId: number, tenantInfo: Partial<TenantInfo>): Promise<TenantInfo> {
  const res = await postJson<GetTenantInfoResponse>(`/api/tenant/update-tenant/${tenantId}`, {
    name: tenantInfo.name,
    tenantAcronym: tenantInfo.tenantAcronym,
    street: tenantInfo.street,
    city: tenantInfo.city,
    state: tenantInfo.state,
    zip: tenantInfo.zip,
    phone: tenantInfo.phone,
    website: tenantInfo.website,
    emailAddress: tenantInfo.emailAddress,
    countryId: tenantInfo.countryId,
    notes: tenantInfo.notes,
    // mailList: tenantInfo.mailList,
    // numberUsersPurchased: tenantInfo.numberUsersPurchased,
  });

  if (!res.success || !res.data?.tenant) {
    throw new Error("Failed to update tenant info");
  }

  return res.data.tenant;
}

// Users

export interface UserVM {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  dateActive: string | null;
  dateInactive: string | null;
  status: string;
}

export interface GetUsersResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    usersVMs: UserVM[];
  };
}

export interface InviteUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
}

export interface UpdateUserPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
}

export async function fetchUsers(active: boolean = true): Promise<UserVM[]> {
  const status = active ? "true" : "false";
  const res = await getJson<GetUsersResponse>(`/api/user/get-users/${status}`);
  return res.data?.usersVMs ?? [];
}

export async function inviteUser(payload: InviteUserPayload): Promise<UserVM> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      usersVM: UserVM;
    };
  }>("/api/user/inviteuser", payload);

  if (!res.success || !res.data?.usersVM) {
    throw new Error(res.message || "Failed to invite user");
  }

  return res.data.usersVM;
}

export async function updateUser(userId: string, payload: UpdateUserPayload): Promise<UserVM> {
  const res = await putJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      usersVM: UserVM;
    };
  }>(`/api/user/update-user/${userId}`, payload);

  if (!res.success || !res.data?.usersVM) {
    throw new Error(res.message || "Failed to update user");
  }

  return res.data.usersVM;
}

export async function deleteUser(userId: string): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/user/delete-user/${userId}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete user");
  }
}

export async function resendInvitation(email: string): Promise<void> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/user/resend-invitation?email=${encodeURIComponent(email)}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to resend invitation");
  }
}

// Volunteers API
export interface VolunteerVM {
  id: number;
  pcoId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: string;
  active: boolean;
  status: string;
  dateActive: string | null;
  dateInactive: string | null;
  dateEntered: string | null;
  dateModified: string | null;
}

export interface GetVolunteersResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    volunteers: VolunteerVM[];
  };
}

export interface CreateVolunteerPayload {
  pcoId: number;
  notes?: string;
  active?: boolean;
  dateActive?: string;
}

export interface UpdateVolunteerPayload {
  notes?: string;
  active?: boolean;
  dateActive?: string;
  dateInactive?: string;
}

export async function fetchVolunteers(active: boolean = true): Promise<VolunteerVM[]> {
  const res = await getJson<GetVolunteersResponse>(`/api/volunteer/get-volunteers/${active}`);
  return res.data?.volunteers ?? [];
}

export async function createVolunteer(payload: CreateVolunteerPayload): Promise<VolunteerVM> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      volunteer: VolunteerVM;
    };
  }>("/api/volunteer/create-volunteer", payload);

  if (!res.success || !res.data?.volunteer) {
    throw new Error(res.message || "Failed to create volunteer");
  }

  return res.data.volunteer;
}

export async function updateVolunteer(volunteerId: number, payload: UpdateVolunteerPayload): Promise<VolunteerVM> {
  const res = await putJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      volunteer: VolunteerVM;
    };
  }>(`/api/volunteer/update-volunteer/${volunteerId}`, payload);

  if (!res.success || !res.data?.volunteer) {
    throw new Error(res.message || "Failed to update volunteer");
  }

  return res.data.volunteer;
}

export async function deleteVolunteer(volunteerId: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/volunteer/delete-volunteer/${volunteerId}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete volunteer");
  }
}

// PCO Volunteer API (for getting volunteer by PCO ID)
export interface PCOVolunteerData {
  id: number;
  pcoId: number;
  notes: string;
  active: boolean;
  dateActive: string | null;
  dateInactive: string | null;
  volunteerActivityCustoms: Array<{
    volunteerActivityId: number;
    volunteerActivityName: string;
    pcoId: number;
    tenantId: number;
  }>;
}

export interface GetPCOVolunteerResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    volunteerPersonCustom: PCOVolunteerData | null;
  };
}

export async function fetchPCOVolunteer(pcoId: number): Promise<PCOVolunteerData | null> {
  const res = await getJson<GetPCOVolunteerResponse>(`/api/volunteer/get-volunteers?pcoId=${pcoId}`);
  
  if (!res.success) {
    throw new Error(res.message || "Failed to fetch volunteer");
  }
  
  return res.data?.volunteerPersonCustom || null;
}

export interface UpsertVolunteerPayload {
  pcoId: number;
  notes?: string;
  active: boolean;
  dateActive?: string;
  dateInactive?: string;
  volunteerActivityIds: number[];
}

export interface UpsertVolunteerResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    volunteerPersonCustom: PCOVolunteerData;
  };
}

export async function upsertPCOVolunteer(payload: UpsertVolunteerPayload): Promise<PCOVolunteerData> {
  const res = await postJson<UpsertVolunteerResponse>("/api/volunteer/upsert-volunteer", payload);
  
  if (!res.success || !res.data?.volunteerPersonCustom) {
    throw new Error(res.message || "Failed to save volunteer");
  }
  
  return res.data.volunteerPersonCustom;
}

// Reports API
export interface CurrentFosterVM {
  id: number;
  name: string;
  animalType: string;
  breed: string;
  fosterersName: string;
  fosterBeginDate: string | null;
  email: string;
  phone: string;
  pcoId: number | null;
}

export interface TodaysMedVM {
  id: number;
  animalId: number;
  animalName: string;
  animalType: string;
  medicineName: string;
  dosage: string;
  dueDate: string | null;
  administeredDate: string | null;
  administeredBy: string;
  notes: string;
  clinic: string;
  veterinarian: string;
  reminder: boolean;
}

export interface GetCurrentFostersResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    fosters: CurrentFosterVM[];
    count: number;
  };
}

export interface GetTodaysMedsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    meds: TodaysMedVM[];
    count: number;
  };
}

export async function fetchCurrentFosters(): Promise<CurrentFosterVM[]> {
  const res = await getJson<GetCurrentFostersResponse>("/api/report/current-fosters");
  return res.data?.fosters ?? [];
}

export async function fetchTodaysMeds(): Promise<TodaysMedVM[]> {
  const res = await getJson<GetTodaysMedsResponse>("/api/report/todays-meds");
  return res.data?.meds ?? [];
}

// Animal Milestone Query API
export interface AnimalMilestoneQueryVM {
  id: number;
  animalId: number;
  pcoId: number;
  tenantId: number;
  milestoneDate: string | null;
  animalName: string;
  animalTypeName: string;
  milestoneType: string;
  otherRescue: string;
  howAcquired: string;
  lastName: string;
  firstName: string;
  notes: string;
  animalMilestoneDeleted: boolean;
  animalDeleted: boolean;
  pcoDeleted: boolean;
}

export interface GetAnimalMilestoneQueryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    animalMilestoneQueries: AnimalMilestoneQueryVM[];
    count: number;
  };
}

export interface AnimalMilestoneQueryParams {
  milestoneType: string;
  animalTypeName?: string;
  milestoneStartDate?: string;
  milestoneEndDate?: string;
}

export async function fetchAnimalMilestoneQuery(
  params: AnimalMilestoneQueryParams
): Promise<AnimalMilestoneQueryVM[]> {
  const search = new URLSearchParams();
  search.set("milestoneType", params.milestoneType);
  if (params.animalTypeName) {
    search.set("animalTypeName", params.animalTypeName);
  }
  if (params.milestoneStartDate) {
    search.set("milestoneStartDate", params.milestoneStartDate);
  }
  if (params.milestoneEndDate) {
    search.set("milestoneEndDate", params.milestoneEndDate);
  }

  const res = await getJson<GetAnimalMilestoneQueryResponse>(
    `/api/query/animal-milestone-query?${search.toString()}`
  );
  return res.data?.animalMilestoneQueries ?? [];
}

// Animal Health Query API
export interface AnimalHealthQueryVM {
  id: number;
  animalId: number;
  animalName: string;
  animalType: string;
  breedSpecies: string;
  date: string | null;
  type: string;
  kind: string;
  tagNumber: string;
  microchipNo: string;
  notes: string;
}

export interface AnimalHealthQueryParams {
  kind: string;
  animalTypeName?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetAnimalHealthQueryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    healthRecords: AnimalHealthQueryVM[];
    count: number;
  };
}

export async function fetchAnimalHealthQuery(
  params: AnimalHealthQueryParams
): Promise<AnimalHealthQueryVM[]> {
  const search = new URLSearchParams();
  search.set("kind", params.kind);
  if (params.animalTypeName) {
    search.set("animalTypeName", params.animalTypeName);
  }
  if (params.startDate) {
    search.set("startDate", params.startDate);
  }
  if (params.endDate) {
    search.set("endDate", params.endDate);
  }

  const res = await getJson<GetAnimalHealthQueryResponse>(
    `/api/query/animal-health-query?${search.toString()}`
  );
  return res.data?.healthRecords ?? [];
}

// Donations Query API
export interface DonationQueryVM {
  id: number;
  lastName: string;
  firstName: string;
  numberOfDonations: number;
  totalAmount: string;
  mailList: string;
  note: string;
}

export interface DonationQueryParams {
  donationType: string;
  topDonors?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetDonationQueryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    donations: DonationQueryVM[];
    count: number;
  };
}

export async function fetchDonationQuery(
  params: DonationQueryParams
): Promise<DonationQueryVM[]> {
  const search = new URLSearchParams();
  search.set("donationType", params.donationType);
  if (params.topDonors) {
    search.set("topDonors", params.topDonors);
  }
  if (params.startDate) {
    search.set("startDate", params.startDate);
  }
  if (params.endDate) {
    search.set("endDate", params.endDate);
  }

  const res = await getJson<GetDonationQueryResponse>(
    `/api/query/donations-query?${search.toString()}`
  );
  return res.data?.donations ?? [];
}

// Mail List Query API
export interface MailListQueryVM {
  id: number;
  lastName: string;
  firstName: string;
  street: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  mailList: string;
  notes: string;
}

export interface MailListQueryParams {
  queryType: string;
  addedYears?: string;
  adoptedYears?: string;
  donatedYears?: string;
}

export interface GetMailListQueryResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    pcos: MailListQueryVM[];
    count: number;
  };
}

export async function fetchMailListQuery(
  params: MailListQueryParams
): Promise<MailListQueryVM[]> {
  const search = new URLSearchParams();
  search.set("queryType", params.queryType);
  if (params.addedYears) {
    search.set("addedYears", params.addedYears);
  }
  if (params.adoptedYears) {
    search.set("adoptedYears", params.adoptedYears);
  }
  if (params.donatedYears) {
    search.set("donatedYears", params.donatedYears);
  }

  const res = await getJson<GetMailListQueryResponse>(
    `/api/query/mail-list-query?${search.toString()}`
  );
  return res.data?.pcos ?? [];
}

// Search API
export interface AnimalSearchVM {
  id: number;
  animalType: string;
  name: string;
  color: string;
  spayedNeutered: string;
  notes: string;
  flagged: string;
  status: string;
  currentResident: string;
  breed: string;
  sex: string;
  location: string;
  chronicCondition: string;
  dietPresent: string;
}

export interface AnimalSearchParams {
  name?: string;
  animalType?: string;
  currentResident?: string;
  breed?: string;
  color?: string;
  sex?: string;
  location?: string;
  notes?: string;
  chronicCondition?: string;
  flagged?: string;
  dietPresent?: string;
  status?: string;
  spayedNeutered?: string;
}

export interface GetAnimalSearchResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    animals: AnimalSearchVM[];
    count: number;
  };
}

export async function searchAnimals(params: AnimalSearchParams): Promise<AnimalSearchVM[]> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const res = await getJson<GetAnimalSearchResponse>(
    `/api/search/animals?${search.toString()}`
  );
  return res.data?.animals ?? [];
}

export interface DonationSearchVM {
  id: number;
  donationDate: string | null;
  firstName: string;
  lastName: string;
  donationType: string;
  amount: string;
  notes: string;
}

export interface DonationSearchParams {
  firstName?: string;
  lastName?: string;
  donationType?: string;
  notes?: string;
}

export interface GetDonationSearchResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    donations: DonationSearchVM[];
    count: number;
  };
}

export async function searchDonations(params: DonationSearchParams): Promise<DonationSearchVM[]> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const res = await getJson<GetDonationSearchResponse>(
    `/api/search/donations?${search.toString()}`
  );
  return res.data?.donations ?? [];
}

export interface AnimalMilestoneSearchVM {
  id: number;
  date: string | null;
  milestone: string;
  name: string;
  animalType: string;
  howAcquired: string;
  otherRescue: string;
  otherRescueId: string;
  notes: string;
}

export interface AnimalMilestoneSearchParams {
  milestoneType?: string;
  animalTypeName?: string;
  howAcquired?: string;
  otherRescueShelterId?: string;
  otherRescueIdNo?: string;
  notes?: string;
}

export interface GetAnimalMilestoneSearchResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    milestones: AnimalMilestoneSearchVM[];
    count: number;
  };
}

export async function searchAnimalMilestones(
  params: AnimalMilestoneSearchParams
): Promise<AnimalMilestoneSearchVM[]> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const res = await getJson<GetAnimalMilestoneSearchResponse>(
    `/api/search/animal-milestones?${search.toString()}`
  );
  return res.data?.milestones ?? [];
}

export interface AnimalHealthSearchVM {
  id: number;
  name: string;
  animalType: string;
  breedSpecies: string;
  clinic: string;
  type: string;
  kind: string;
  rabiesTag: string;
  microchipNo: string;
  notes: string;
}

export interface AnimalHealthSearchParams {
  type?: string;
  animalTypeName?: string;
  clinic?: string;
  vaccinationType?: string;
  administerer?: string;
  serialNumber?: string;
  vaccineManufacturer?: string;
  rabiesTagNo?: string;
  veterinarian?: string;
  personEntered?: string;
  microchipNo?: string;
  subjective?: string;
  objective?: string;
  assessment?: string;
  plan?: string;
  notes?: string;
}

export interface GetAnimalHealthSearchResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    healthRecords: AnimalHealthSearchVM[];
    count: number;
  };
}

export async function searchAnimalHealth(
  params: AnimalHealthSearchParams
): Promise<AnimalHealthSearchVM[]> {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      search.set(key, value);
    }
  });

  const res = await getJson<GetAnimalHealthSearchResponse>(
    `/api/search/animal-health?${search.toString()}`
  );
  return res.data?.healthRecords ?? [];
}

// ============================================================================
// Super Admin API Functions
// ============================================================================

// SA Animal Types
export interface SAAnimalTypeDTO {
  id: number;
  typeName: string;
  dateEntered?: string;
  dateModified?: string;
  enteredBy?: string;
  modifiedBy?: string;
}

export interface GetSAAnimalTypesResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    saAnimalTypes: SAAnimalTypeDTO[];
  };
}

export async function fetchSAAnimalTypes(): Promise<SAAnimalTypeDTO[]> {
  const res = await getJson<GetSAAnimalTypesResponse>(
    `/api/saanimaltype/get-sa-animal-type`
  );
  return res.data?.saAnimalTypes ?? [];
}

export async function createSAAnimalType(
  typeName: string,
  roleName?: string
): Promise<SAAnimalTypeDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; typeName: string } }>(
    `/api/saanimaltype/create-sa-animal-type`,
    { typeName, roleName: roleName || "SuperAdministrator" }
  );
  return { id: res.data.id, typeName: res.data.typeName };
}

export async function updateSAAnimalType(
  id: number,
  typeName: string
): Promise<SAAnimalTypeDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; typeName: string } }>(
    `/api/saanimaltype/update-sa-animal-type/${id}`,
    { typeName }
  );
  return { id: res.data.id, typeName: res.data.typeName };
}

export async function deleteSAAnimalType(id: number): Promise<void> {
  await patchJson(`/api/saanimaltype/delete-sa-animal-type/${id}`, {});
}

// SA Behaviors
export interface SABehaviorDTO {
  id: number;
  behaviorName: string;
  saAnimalTypeId: number;
}

export interface GetSABehaviorsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    saBehaviors: SABehaviorDTO[];
  };
}

export async function fetchSABehaviors(animalTypeId: number): Promise<SABehaviorDTO[]> {
  const res = await getJson<GetSABehaviorsResponse>(
    `/api/sabehavior/get-sa-behavior-by-animalId?animalTypeId=${animalTypeId}`
  );
  return res.data?.saBehaviors ?? [];
}

export async function createSABehavior(
  behaviorName: string,
  saAnimalTypeId: number
): Promise<SABehaviorDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; behaviorName: string; saAnimalTypeId: number } }>(
    `/api/sabehavior/create-sa-behavior`,
    { behaviorName, saAnimalTypeId }
  );
  return res.data;
}

export async function updateSABehavior(
  id: number,
  behaviorName: string,
  saAnimalTypeId: number
): Promise<SABehaviorDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; behaviorName: string; saAnimalTypeId: number } }>(
    `/api/sabehavior/update-sa-behavior/${id}`,
    { behaviorName, saAnimalTypeId }
  );
  return res.data;
}

export async function deleteSABehavior(id: number): Promise<void> {
  await patchJson(`/api/sabehavior/delete-sa-behavior/${id}`, {});
}

// SA Health Procedures
export interface SAHealthProcedureDTO {
  id: number;
  kind: string;
  saAnimalTypeId: number;
}

export interface GetSAHealthProceduresResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    saHealthProcedures: SAHealthProcedureDTO[];
  };
}

export async function fetchSAHealthProcedures(animalTypeId: number): Promise<SAHealthProcedureDTO[]> {
  const res = await getJson<GetSAHealthProceduresResponse>(
    `/api/sahealthprocedure/get-sa-health-procedure-by-animalId?animalTypeId=${animalTypeId}`
  );
  return res.data?.saHealthProcedures ?? [];
}

export async function createSAHealthProcedure(
  kind: string,
  saAnimalTypeId: number
): Promise<SAHealthProcedureDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; kind: string; saAnimalTypeId: number } }>(
    `/api/sahealthprocedure/create-sa-health-procedure`,
    { kind, saAnimalTypeId }
  );
  return res.data;
}

export async function updateSAHealthProcedure(
  id: number,
  kind: string,
  saAnimalTypeId: number
): Promise<SAHealthProcedureDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; kind: string; saAnimalTypeId: number } }>(
    `/api/sahealthprocedure/update-sa-health-procedure/${id}`,
    { kind, saAnimalTypeId }
  );
  return res.data;
}

export async function deleteSAHealthProcedure(id: number): Promise<void> {
  await patchJson(`/api/sahealthprocedure/delete-sa-health-procedure/${id}`, {});
}

// SA Vaccination Types
export interface SAVaccinationTypeDTO {
  id: number;
  kind: string;
  saAnimalTypeId: number;
}

export interface GetSAVaccinationTypesResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    saVaccinationTypes: SAVaccinationTypeDTO[];
  };
}

export async function fetchSAVaccinationTypes(animalTypeId: number): Promise<SAVaccinationTypeDTO[]> {
  const res = await getJson<GetSAVaccinationTypesResponse>(
    `/api/savaccinationtype/get-sa-vaccination-type-by-animalId?animalTypeId=${animalTypeId}`
  );
  return res.data?.saVaccinationTypes ?? [];
}

export async function createSAVaccinationType(
  kind: string,
  saAnimalTypeId: number
): Promise<SAVaccinationTypeDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; kind: string; saAnimalTypeId: number } }>(
    `/api/savaccinationtype/create-sa-vaccination-type`,
    { kind, saAnimalTypeId }
  );
  return res.data;
}

export async function updateSAVaccinationType(
  id: number,
  kind: string,
  saAnimalTypeId: number
): Promise<SAVaccinationTypeDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; kind: string; saAnimalTypeId: number } }>(
    `/api/savaccinationtype/update-sa-vaccination-type/${id}`,
    { kind, saAnimalTypeId }
  );
  return res.data;
}

export async function deleteSAVaccinationType(id: number): Promise<void> {
  await patchJson(`/api/savaccinationtype/delete-sa-vaccination-type/${id}`, {});
}

// SA Medicines
export interface SAMedicineDTO {
  id: number;
  medicineName: string;
  usedFor: string;
  formulation?: string;
  notes?: string;
  monthlyMed?: boolean;
}

export interface GetSAMedicinesResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    medicines: SAMedicineDTO[];
  };
}

export async function fetchSAMedicines(): Promise<SAMedicineDTO[]> {
  const res = await getJson<GetSAMedicinesResponse>(
    `/api/samedicine/get-samedicine`
  );
  return res.data?.medicines ?? [];
}

export async function createSAMedicine(
  medicineName: string,
  usedFor: string,
  formulation?: string,
  notes?: string,
  monthlyMed?: boolean
): Promise<SAMedicineDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; medicineName: string; usedFor: string; formulation?: string; notes?: string; monthlyMed?: boolean } }>(
    `/api/samedicine/create-samedicine`,
    { 
      medicineName, 
      usedFor, 
      formulation: formulation || "",  // Default to empty string if not provided
      notes: notes || "", 
      monthlyMed: monthlyMed || false 
    }
  );
  return res.data;
}

export async function updateSAMedicine(
  id: number,
  medicineName: string,
  usedFor: string,
  formulation?: string,
  notes?: string,
  monthlyMed?: boolean
): Promise<SAMedicineDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; medicineName: string; usedFor: string; formulation?: string; notes?: string; monthlyMed?: boolean } }>(
    `/api/samedicine/update-samedicine/${id}`,
    { medicineName, usedFor, formulation, notes, monthlyMed }
  );
  return res.data;
}

export async function deleteSAMedicine(id: number): Promise<void> {
  await patchJson(`/api/samedicine/delete-samedicine/${id}`, {});
}

// SA Volunteer Activities
export interface SAVolunteerActivityDTO {
  id: number;
  saVolunteerActivityName: string;
}

export interface GetSAVolunteerActivitiesResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    saVolunteerActivities: SAVolunteerActivityDTO[];
  };
}

export async function fetchSAVolunteerActivities(): Promise<SAVolunteerActivityDTO[]> {
  const res = await getJson<GetSAVolunteerActivitiesResponse>(
    `/api/savolunteeractivity/get-savolunteeractivity`
  );
  return res.data?.saVolunteerActivities ?? [];
}

export async function createSAVolunteerActivity(
  saVolunteerActivityName: string
): Promise<SAVolunteerActivityDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; saVolunteerActivityName: string } }>(
    `/api/savolunteeractivity/create-savolunteeractivity`,
    { saVolunteerActivityName }
  );
  return res.data;
}

export async function updateSAVolunteerActivity(
  id: number,
  saVolunteerActivityName: string
): Promise<SAVolunteerActivityDTO> {
  const res = await postJson<{ success: boolean; data: { id: number; saVolunteerActivityName: string } }>(
    `/api/savolunteeractivity/update-savolunteeractivity/${id}`,
    { saVolunteerActivityName }
  );
  return res.data;
}

export async function deleteSAVolunteerActivity(id: number): Promise<void> {
  await patchJson(`/api/savolunteeractivity/delete-savolunteeractivity/${id}`, {});
}

// User Roles
export interface UserRoleDTO {
  id: string;
  name: string;
  normalizedName?: string;
  concurrencyStamp?: string;
}

export interface GetUserRolesResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    roles: UserRoleDTO[];
  };
}

export async function fetchUserRoles(): Promise<UserRoleDTO[]> {
  const res = await getJson<GetUserRolesResponse>(
    `/api/user-role/get-user-roles`
  );
  return res.data?.roles ?? [];
}

export async function createUserRole(name: string): Promise<UserRoleDTO> {
  const res = await postJson<{ success: boolean; data: { id: string; name: string } }>(
    `/api/user-role/create-user-role`,
    { name }
  );
  return { id: res.data.id, name: res.data.name };
}

export async function updateUserRole(
  id: string,
  name: string
): Promise<UserRoleDTO> {
  const res = await postJson<{ success: boolean; data: { id: string; identityRole: UserRoleDTO } }>(
    `/api/user-role/update-user-role/${id}`,
    { name }
  );
  return res.data.identityRole;
}

export async function deleteUserRole(id: string): Promise<void> {
  await deleteJson(`/api/user-role/delete-user-role/${id}`);
}

