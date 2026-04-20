const DEFAULT_ERROR_MESSAGE =
  '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.';

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
