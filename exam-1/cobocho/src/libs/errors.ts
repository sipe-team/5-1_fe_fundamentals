export class HttpError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'HttpError';
	}
}

export class BadRequestError extends HttpError {
	public readonly status = 400;

	constructor(message: string) {
		super(message);
		this.name = 'BadRequestError';
	}
}

export class UnauthorizedError extends HttpError {
	public readonly status = 401;

	constructor(message: string) {
		super(message);
		this.name = 'UnauthorizedError';
	}
}

export class ForbiddenError extends HttpError {
	public readonly status = 403;

	constructor(message: string) {
		super(message);
		this.name = 'ForbiddenError';
	}
}

export class NotFoundError extends HttpError {
	public readonly status = 404;

	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export class InternalServerError extends HttpError {
	public readonly status = 500;

	constructor(message: string) {
		super(message);
		this.name = 'InternalServerError';
	}
}

export class ServiceUnavailableError extends HttpError {
	public readonly status = 503;

	constructor(message: string) {
		super(message);
		this.name = 'ServiceUnavailableError';
	}
}

export const createHttpError = (status: number, message: string) => {
	switch (status) {
		case 400:
			return new BadRequestError(message);
		case 401:
			return new UnauthorizedError(message);
		case 403:
			return new ForbiddenError(message);
		case 404:
			return new NotFoundError(message);
		case 500:
			return new InternalServerError(message);
		case 503:
			return new ServiceUnavailableError(message);
		default:
			return new HttpError(message);
	}
};
