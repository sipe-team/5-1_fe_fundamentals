import ky from 'ky';
import { createHttpError } from './errors';

export const BASE_URL = '';

export const kyInstance = ky.create({
	prefixUrl: BASE_URL,
	hooks: {
		afterResponse: [
			async (_, __, response) => {
				if (response.status >= 400) {
					const data = (await response.json()) as { message: string };
					const error = createHttpError(response.status, data.message);
					throw error;
				}

				return response;
			},
		],
	},
});
