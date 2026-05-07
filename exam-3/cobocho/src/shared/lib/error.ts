export class HttpError extends Error {
	public readonly status: number;
	public readonly data?: unknown;

	constructor(status: number, message: string, data?: unknown) {
		super(message);
		this.status = status;
		this.data = data;
	}
}

export class BadRequestError extends HttpError {
	constructor(message: string, data?: unknown) {
		super(400, message, data);
	}
}

export class NotFoundError extends HttpError {
	constructor(message: string, data?: unknown) {
		super(404, message, data);
	}
}

export class InternalServerError extends HttpError {
	constructor(message: string, data?: unknown) {
		super(500, message, data);
	}
}

export class ServiceUnavailableError extends HttpError {
	constructor(message: string, data?: unknown) {
		super(503, message, data);
	}
}
