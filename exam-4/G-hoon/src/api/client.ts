import ky from 'ky';

export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_NOT_FOUND = 404;
export const HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;
export const HTTP_STATUS_SERVICE_UNAVAILABLE = 503;

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

  switch (error.status) {
    case HTTP_STATUS_BAD_REQUEST:
    case HTTP_STATUS_NOT_FOUND:
      return false;
    case HTTP_STATUS_SERVICE_UNAVAILABLE:
      return failureCount < 2;
    case HTTP_STATUS_INTERNAL_SERVER_ERROR:
      return failureCount < 1;
    default:
      return error.status >= 500 && failureCount < 1;
  }
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

  switch (status) {
    case HTTP_STATUS_NOT_FOUND:
      return NOT_FOUND_ERROR_MESSAGE;
    case HTTP_STATUS_INTERNAL_SERVER_ERROR:
    case HTTP_STATUS_SERVICE_UNAVAILABLE:
      return SERVER_ERROR_MESSAGE;
    default:
      return DEFAULT_ERROR_MESSAGE;
  }
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
