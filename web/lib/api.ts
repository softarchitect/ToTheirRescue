const API_BASE_URL =
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
  if (!res.ok || (json && json.success === false)) {
    const message =
      json?.message ||
      json?.errors?.[0] ||
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

export { API_BASE_URL };


