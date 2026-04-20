import ky, { isHTTPError } from 'ky';
import { ApiError } from './error';

interface ApiErrorBody {
  error?: string;
  message?: string;
}

export const api = ky.create({
  prefix: '/api',
  retry: 0,
  hooks: {
    beforeError: [
      async ({ error }) => {
        if (!isHTTPError(error)) return error;

        const body = await parseErrorBody(error);
        return new ApiError(
          error.response.status,
          body,
          getMessageFromBody(body),
        );
      },
    ],
  },
});

async function parseErrorBody(error: unknown): Promise<unknown> {
  if (!isHTTPError(error)) return null;

  try {
    return await error.response.clone().json();
  } catch {
    return null;
  }
}

function getMessageFromBody(body: unknown): string | undefined {
  if (isApiErrorBody(body) && body.message) return body.message;
  return undefined;
}

function isApiErrorBody(body: unknown): body is ApiErrorBody {
  return body != null && typeof body === 'object';
}
