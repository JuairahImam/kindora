import { ApiResponse, IEvent } from "@/types/event";

export const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5050";
    }
  }
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined" && window.location.hostname.endsWith(".vercel.app")
      ? "https://server-one-weld-92.vercel.app"
      : "http://localhost:5050")
  );
};

export const API_BASE_URL = getApiBaseUrl();

// Helper to get stored auth token
export const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("kindora_token") ||
    sessionStorage.getItem("kindora_token") ||
    null
  );
};

// Generic fetcher
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl.replace(/\/$/, "")}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
    cache: options.cache || "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage =
      data?.message || (data?.errors && JSON.stringify(data.errors)) || "An unexpected error occurred";
    throw new Error(errorMessage);
  }

  return data as T;
}

// Event API functions
export async function getRecentUpcomingEvents(): Promise<IEvent[]> {
  try {
    const res = await fetchApi<ApiResponse<IEvent[]>>("/api/events/recent");
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch recent events:", error);
    return [];
  }
}

export async function getAllUpcomingEvents(): Promise<IEvent[]> {
  try {
    const res = await fetchApi<ApiResponse<IEvent[]>>("/api/events");
    return res.data || [];
  } catch (error) {
    console.error("Failed to fetch all upcoming events:", error);
    return [];
  }
}

export async function getEventById(id: string): Promise<IEvent | null> {
  try {
    const res = await fetchApi<ApiResponse<IEvent>>(`/api/events/${id}`);
    return res.data || null;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
}
