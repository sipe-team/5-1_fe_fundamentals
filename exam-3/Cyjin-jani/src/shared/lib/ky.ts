import ky from 'ky';

export const api = ky.create({
  prefix: '/api',
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        console.log(`[🚀 요청] ${request.method} ${request.url}`);
      },
    ],
    beforeError: [
      ({ error }) => {
        console.error(`[🚨 에러] ${error.name}: ${error.message}`);
        return error;
      },
    ],
    afterResponse: [
      ({ response }) => {
        if (response.ok) {
          console.log(`[✅ 응답] ${response.status} ${response.url}`);
        } else {
          console.error(`[❌ 실패] ${response.status} ${response.url}`);
        }
      },
    ],
  },
});
