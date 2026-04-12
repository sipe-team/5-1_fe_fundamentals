import ky from 'ky';

export const client = ky.create({
  prefixUrl: '/api',
  // 로깅
  hooks: {
    beforeRequest: [
      (request) => {
        console.log(`[🚀 요청] ${request.method} ${request.url}`);
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        if (response.ok) {
          console.log(`[✅ 응답] ${response.status} ${response.url}`);
        } else {
          console.error(`[❌ 실패] ${response.status} ${response.url}`);
        }
      },
    ],
    beforeError: [
      (error) => {
        console.error(`[🚨 에러] ${error.name}: ${error.message}`);
        return error;
      },
    ],
  },
});
