export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export async function http<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new HttpError(
      response.status,
      body.message ?? `HTTP ${response.status} 오류가 발생했습니다.`,
    );
  }

  return response.json() as Promise<T>;
}
