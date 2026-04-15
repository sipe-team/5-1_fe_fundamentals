import ky from 'ky';

const isDev = import.meta.env.DEV;

export const client = ky.create({
  prefix: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: isDev
    ? {
        beforeRequest: [
          ({ request }) => {
            console.log(`[request] ${request.method} ${request.url}`);
          },
        ],
        afterResponse: [
          ({ response }) => {
            if (response.ok) {
              console.log(`[response] ${response.status} ${response.url}`);
              return;
            }

            console.error(`[response] ${response.status} ${response.url}`);
          },
        ],
        beforeError: [
          ({ error }) => {
            console.error(`[error] ${error.name}: ${error.message}`);
            return error;
          },
        ],
      }
    : undefined,
});
