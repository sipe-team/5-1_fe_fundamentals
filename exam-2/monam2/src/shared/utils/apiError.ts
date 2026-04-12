import { HTTPError } from 'ky';

import type { ApiErrorResponse, ConflictError } from '@/shared/types';

type NotFoundError = ApiErrorResponse & { error: 'Not Found' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  return (
    isRecord(value) &&
    typeof value.error === 'string' &&
    typeof value.message === 'string'
  );
}

export function isConflictError(value: unknown): value is ConflictError {
  if (!isApiErrorResponse(value) || value.error !== 'Conflict') {
    return false;
  }

  const maybeConflict = value as ApiErrorResponse & {
    conflictWith?: Record<string, unknown>;
  };

  return (
    isRecord(maybeConflict.conflictWith) &&
    typeof maybeConflict.conflictWith.id === 'string' &&
    typeof maybeConflict.conflictWith.title === 'string' &&
    typeof maybeConflict.conflictWith.startTime === 'string' &&
    typeof maybeConflict.conflictWith.endTime === 'string'
  );
}

export function isNotFoundError(value: unknown): value is NotFoundError {
  return isApiErrorResponse(value) && value.error === 'Not Found';
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

export async function readConflictError(
  error: unknown,
): Promise<ConflictError | null> {
  const response = await readApiErrorResponse(error);

  return isConflictError(response) ? response : null;
}

export async function getApiErrorMessage(
  error: unknown,
  fallback: string,
): Promise<string> {
  const response = await readApiErrorResponse(error);

  return response?.message ?? fallback;
}
