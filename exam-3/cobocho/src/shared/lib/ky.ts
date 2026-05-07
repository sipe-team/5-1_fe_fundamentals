import ky from 'ky';

import {
	BadRequestError,
	HttpError,
	InternalServerError,
	NotFoundError,
	ServiceUnavailableError,
} from './error';

export const api = ky.create({
	headers: {
		'Content-Type': 'application/json',
	},
	prefix: '/api',
	hooks: {
		afterResponse: [
			async ({ response }) => {
				if (!response.ok) {
					const data = await response.json().catch(() => undefined);
					const message =
						typeof data === 'object' && data !== null && 'message' in data
							? String((data as Record<string, unknown>).message)
							: response.statusText;

					switch (response.status) {
						case 400:
							throw new BadRequestError(message, data);
						case 404:
							throw new NotFoundError(message, data);
						case 500:
							throw new InternalServerError(message, data);
						case 503:
							throw new ServiceUnavailableError(message, data);
						default:
							throw new HttpError(response.status, message, data);
					}
				}
			},
		],
	},
});
