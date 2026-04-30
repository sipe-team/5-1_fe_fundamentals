import { createHttpError } from '@/shared/api/errors';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw createHttpError(res.status, body?.message);
  }
  return res.json();
}

export const http = {
  get<T>(url: string): Promise<T> {
    return request<T>(url);
  },
};
