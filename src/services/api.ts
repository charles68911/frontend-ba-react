
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:7000/api";

interface CsrfApiResponse {
  success: boolean;
  csrfToken: string;
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/csrf-token`, {
    method: "GET",
    credentials: "include",
  });

  const data = (await response.json()) as CsrfApiResponse;

  if (!response.ok || !data.csrfToken) {
    throw new Error("Unable to obtain CSRF token.");
  }

  return data.csrfToken;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  // Obtain a fresh CSRF token for requests that modify data.
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    const csrfToken = await getCsrfToken();
    headers.set("x-csrf-token", csrfToken);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    method,
    credentials: "include",
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || "Something went wrong. Please try again.",
    );
  }

  return data as T;
}
