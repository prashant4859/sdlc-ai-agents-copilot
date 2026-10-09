export interface ApiHealthStatus {
  status: string;
  service: string;
  database?: string;
  error?: string;
}

export const DEFAULT_API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "http://localhost:3000";

export async function fetchApiStatus(
  baseUrl: string = DEFAULT_API_BASE_URL,
): Promise<ApiHealthStatus> {
  const response = await fetch(`${baseUrl}/ready`, {
    headers: {
      Accept: "application/json",
    },
  });

  const payload = (await response.json().catch(() => ({}))) as ApiHealthStatus;

  if (!response.ok) {
    throw new Error(
      payload.error ??
        "The backend service is unavailable. Verify the API is running and reachable.",
    );
  }

  return payload;
}
