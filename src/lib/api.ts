const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:4000/api/v1";

type ApiOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    auth = true,
    headers,
    ...requestOptions
  } = options;

  const requestHeaders = new Headers(headers);

  if (
    requestOptions.body &&
    !(requestOptions.body instanceof FormData)
  ) {
    requestHeaders.set(
      "Content-Type",
      "application/json"
    );
  }

  if (auth && typeof window !== "undefined") {
    const token = localStorage.getItem(
      "skillbridge_access_token"
    );

    if (token) {
      requestHeaders.set(
        "Authorization",
        `Bearer ${token}`
      );
    }
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...requestOptions,
      headers: requestHeaders,
    }
  );

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      result?.message ||
      result?.error ||
      `Request failed with status ${response.status}`
    );
  }

  return result;
}