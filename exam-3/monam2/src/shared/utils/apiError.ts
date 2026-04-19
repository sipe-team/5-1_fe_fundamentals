import { HTTPError } from "ky";

import type { ApiErrorResponse } from "@/shared/types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    typeof value.error === "string" &&
    typeof value.message === "string"
  );
}

export async function readApiErrorResponse(
  error: unknown,
): Promise<ApiErrorResponse | null> {
  if (!(error instanceof HTTPError)) {
    return null;
  }

  try {
    const response = (await error.response.clone().json()) as unknown;
    return isApiErrorResponse(response) ? response : null;
  } catch {
    return null;
  }
}

export async function getApiErrorMessage(
  error: unknown,
  fallback: string,
): Promise<string> {
  const response = await readApiErrorResponse(error);
  return response?.message ?? fallback;
}
