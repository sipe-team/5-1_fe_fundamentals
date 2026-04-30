export class HttpError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class BadRequestError extends HttpError {
  constructor(message = '잘못된 요청입니다.') {
    super(400, message);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends HttpError {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class InternalServerError extends HttpError {
  constructor(
    message = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  ) {
    super(500, message);
    this.name = 'InternalServerError';
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(
    message = '서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
  ) {
    super(503, message);
    this.name = 'ServiceUnavailableError';
  }
}

export function createHttpError(status: number, message?: string): HttpError {
  switch (status) {
    case 400:
      return new BadRequestError(message);
    case 404:
      return new NotFoundError(message);
    case 500:
      return new InternalServerError(message);
    case 503:
      return new ServiceUnavailableError(message);
    default:
      return new HttpError(
        status,
        message ?? `서버 오류가 발생했습니다. (${status})`,
      );
  }
}
