import ky from 'ky';

/** `/api` 프리픽스. 비 OK 응답은 ky가 `HTTPError` throw → `error.response.status` 사용 */
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
