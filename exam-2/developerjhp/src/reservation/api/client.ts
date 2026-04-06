export class HttpError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    super(`HTTP ${status}`);
    this.name = "HttpError";
    this.status = status;
    this.body = body;
  }
}

export function buildUrl(
  path: string,
  searchParams?: Record<string, string | number | undefined>,
) {
  if (!searchParams) {
    return path;
  }

  const query = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    query.set(key, String(value));
  });

  const queryString = query.toString();

  return queryString ? `${path}?${queryString}` : path;
}

export async function requestJson<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  const body = await res.json();

  if (!res.ok) {
    throw new HttpError(res.status, body);
  }

  return body as T;
}
