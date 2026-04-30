import ky from 'ky';

const DEFAULT_ERROR_MESSAGE =
  '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.';
const NOT_FOUND_ERROR_MESSAGE = '요청한 데이터를 찾을 수 없습니다.';
const SERVER_ERROR_MESSAGE =
  '일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
const NETWORK_ERROR_MESSAGE = '네트워크 상태를 확인한 뒤 다시 시도해주세요.';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message = DEFAULT_ERROR_MESSAGE) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export const api = ky.create({
  prefix: '/api/',
  retry: 0,
  hooks: {
    afterResponse: [
      async ({ response }) => {
        if (!response.ok) {
          const body = await parseErrorBody(response);
          throw new ApiError(
            response.status,
            body,
            getApiErrorMessage(response.status, body),
          );
        }
      },
    ],
  },
});

export function shouldRetryQuery(failureCount: number, error: unknown) {
  if (!(error instanceof ApiError)) {
    return failureCount < 1;
  }

  if (error.status >= 400 && error.status < 500) {
    return false;
  }

  if (error.status === 503) {
    return failureCount < 2;
  }

  if (error.status >= 500) {
    return failureCount < 1;
  }

  return false;
}

export function getFriendlyErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return NETWORK_ERROR_MESSAGE;
}

async function parseErrorBody(response: Response) {
  try {
    return await response.clone().json();
  } catch {
    return null;
  }
}

function getApiErrorMessage(status: number, body: unknown) {
  const message = getMessageFromBody(body);
  if (message) return message;

  if (status === 404) {
    return NOT_FOUND_ERROR_MESSAGE;
  }

  if (status >= 500) {
    return SERVER_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
}

function getMessageFromBody(body: unknown) {
  if (
    body != null &&
    typeof body === 'object' &&
    'message' in body &&
    typeof body.message === 'string'
  ) {
    return body.message;
  }

  return null;
}
