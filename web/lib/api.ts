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

    // Calculate the difference
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    
    // Adjust if current month/day hasn't reached birth month/day yet
    if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
      years--;
      months += 12;
    }
    
    // Adjust months if day hasn't been reached yet
    if (now.getDate() < birth.getDate()) {
      months--;
      if (months < 0) {
        months += 12;
        years--;
      }
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
  
  // Map status
  const status = (backendAnimal.status || "available").toLowerCase() as AnimalStatus;
  
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
    status: status,
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

export interface CreateAnimalPayload {
  name: string;
  animalTypeId: number;
  breed: string;
  gender: "male" | "female" | "unknown";
  status: AnimalStatus;
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
    if (item.animal) {
      return item.animal;
    }
    // Fallback to animalList if animal property is missing
    if (item.animalList && item.animalList.length > 0) {
      return item.animalList[0];
    }
    // Last resort: create a minimal animal object from the id
    return {
      id: String(item.id),
      name: "",
      type: "other",
      breed: "",
      age: 0,
      gender: "unknown",
      status: "available",
      arrivalDate: new Date().toISOString().split("T")[0],
      description: "",
      imageUrl: "/placeholder.svg",
      isWildlife: false,
    } as Animal;
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
}): Promise<PCO[]> {
  const search = new URLSearchParams();
  if (params?.searchText) search.set("searchText", params.searchText);
  if (params?.page) search.set("page", String(params.page));
  if (params?.limit) search.set("limit", String(params.limit));

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
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  entityType?: string;
  rescue?: boolean;
  countryId?: number;
}

export async function createPCO(payload: CreatePCOPayload): Promise<PCO> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: PCO;
  }>("/api/pco/create-pco", payload);

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create PCO");
  }

  return res.data;
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
    data?: VaccinationType;
  }>("/api/vaccination-type/create-vaccination-type", {
    kind,
    animalTypeId,
  });

  if (!res.success || !res.data) {
    throw new Error(res.message || "Failed to create vaccination type");
  }

  return res.data;
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
  id: string | number;
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

  return res.data?.volunteerActivities ?? [];
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

export async function updateAnimalLocation(
  payload: UpdateLocationPayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
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

export interface TenantDiaryEntry {
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
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/diary/add-diary",
    payload,
  )
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

export async function updateTenantDiaryEntry(
  diaryId: number,
  payload: UpdateTenantDiaryPayload,
): Promise<TenantDiaryEntry> {
  const res = await postJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    data?: {
      diary: TenantDiaryEntry;
    };
  }>(`/api/diary/update-diary/${diaryId}`, payload);

  if (!res.success || !res.data?.diary) {
    throw new Error(res.message || "Failed to update diary entry");
  }

  return res.data.diary;
}

export async function deleteTenantDiaryEntry(diaryId: number): Promise<void> {
  const res = await patchJson<{
    success: boolean;
    statusCode: number;
    message?: string;
    errors?: string[];
  }>(`/api/diary/delete-diary/${diaryId}`, {});

  if (!res.success) {
    throw new Error(res.message || "Failed to delete diary entry");
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

export async function createAnimalVaccinations(
  payload: CreateVaccinationPayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/animal-vaccination/add-animal-vaccinations",
    payload,
  )
}

// Procedures / Tests / Treatments

export interface CreateProcedurePayload {
  animalIds: (string | number)[];
  kindId: number;
  actionDate: string;
  hospitalClinicId: number;
  administerer?: string;
  microchipNumber?: string;
  results?: string;
  notes?: string;
}

export async function createAnimalProcedures(
  payload: CreateProcedurePayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/animal-procedure/add-animal-procedures",
    payload,
  )
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
  id: string | number
  animalId: string | number
  date: string
  subjective: string
  objective: string
  assessment: string
  plan: string
  veterinarian: string
}

export interface SOAPListResponse {
  success: boolean
  statusCode: number
  message?: string
  data?: { items: SOAPEntry[] }
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

export async function fetchAnimalSOAPs(
  animalId: string | number,
): Promise<SOAPEntry[]> {
  if (!animalId) return []

  const res = await getJson<SOAPListResponse>(`/api/soap/by-animal/${animalId}`)
  return res.data?.items ?? []
}

export async function createSOAPEntries(
  payload: CreateSOAPPayload,
): Promise<SOAPEntry[]> {
  const res = await postJson<SOAPListResponse>("/api/soap/add-soap", payload)
  return res.data?.items ?? []
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
    mailList: tenantInfo.mailList,
    numberUsersPurchased: tenantInfo.numberUsersPurchased,
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

