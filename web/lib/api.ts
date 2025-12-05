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

async function request<T>(path: string, options: RequestInit): Promise<T> {
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

export interface PagedAnimalsResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: {
    currentPage: number;
    totalItems: number;
    totalPage: number;
    animalsList: Animal[];
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
  return res.data?.animalsList ?? [];
}

export interface CreateAnimalPayload {
  name: string;
  type: AnimalType;
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
  // Future support for multi-animal creation
  animalCount?: number;
  maleCount?: number;
  femaleCount?: number;
  unknownCount?: number;
}

export interface CreateAnimalResponse {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: { animals: Animal[] };
}

export async function createAnimal(
  payload: CreateAnimalPayload,
): Promise<Animal[]> {
  const res = await postJson<CreateAnimalResponse>(
    "/api/animal/create-animal",
    payload,
  );

  if (!res.success || !res.data || !res.data.animals) {
    throw new Error(res.message || "Failed to create animal");
  }

  return res.data.animals;
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

// Animal behaviors

export interface BehaviorUpdate {
  name: string;
  yesOrNo: boolean;
  notes?: string;
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

// Diary

export interface AddDiaryPayload {
  animalIds: (string | number)[];
  date: string;
  notes: string;
}

export async function addDiaryEntry(
  payload: AddDiaryPayload,
): Promise<void> {
  await postJson<{ success: boolean; statusCode: number; errors?: string[] }>(
    "/api/diary/add-diary",
    payload,
  )
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

export { API_BASE_URL };

