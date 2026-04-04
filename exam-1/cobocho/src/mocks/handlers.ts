import { delay, HttpResponse, http } from 'msw';
import type {
	Category,
	ProductsSortOption,
} from '../domain/products/api/products.types';
import { autocompleteDictionary } from './autocomplete';
import { products } from './data';

/**
 * 간헐적으로 긴 지연(~5초)이 발생합니다.
 * 약 15%의 확률로 1.5~5초, 나머지는 300~800ms
 */
function randomDelay(): number {
	if (Math.random() < 0.15) {
		return Math.random() * 3500 + 1500; // 1500~5000ms
	}
	return Math.random() * 500 + 300; // 300~800ms
}

/**
 * 약 10%의 확률로 에러를 반환합니다.
 * 500 또는 503 상태 코드를 무작위로 선택합니다.
 */
function maybeError(): Response | null {
	if (Math.random() < 0.1) {
		const status = Math.random() < 0.5 ? 500 : 503;
		return HttpResponse.json(
			{
				error:
					status === 500
						? 'Internal Server Error'
						: 'Service Temporarily Unavailable',
				message:
					status === 500
						? '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
						: '서버가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.',
			},
			{ status },
		);
	}
	return null;
}

export const handlers = [
	// ── 상품 목록 ──────────────────────────────────────────
	http.get('/api/products', async ({ request }) => {
		await delay(randomDelay());

		// 간헐적 에러
		const errorResponse = maybeError();
		if (errorResponse) return errorResponse;

		const url = new URL(request.url);

		// 쿼리 파라미터 파싱
		const categoriesParam = url.searchParams.get('categories');
		const keyword = url.searchParams.get('keyword');
		const sort = url.searchParams.get('sort') as ProductsSortOption | null;
		const page = Number(url.searchParams.get('page') || '1');
		const size = Number(url.searchParams.get('size') || '20');

		let filtered = [...products];

		// 카테고리 필터
		if (categoriesParam) {
			const categories = categoriesParam.split(',') as Category[];
			filtered = filtered.filter((p) => categories.includes(p.category));
		}

		// 키워드 검색
		if (keyword) {
			const lowerKeyword = keyword.toLowerCase();
			filtered = filtered.filter((p) =>
				p.name.toLowerCase().includes(lowerKeyword),
			);
		}

		// 정렬
		switch (sort) {
			case 'price_asc':
				filtered.sort((a, b) => a.price - b.price);
				break;
			case 'price_desc':
				filtered.sort((a, b) => b.price - a.price);
				break;
			case 'newest':
				filtered.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);
				break;
			case 'rating':
				filtered.sort((a, b) => b.rating - a.rating);
				break;
			default:
				break;
		}

		// 페이지네이션
		const total = filtered.length;
		const totalPages = Math.ceil(total / size);
		const start = (page - 1) * size;
		const paged = filtered.slice(start, start + size);

		return HttpResponse.json({
			products: paged,
			total,
			page,
			size,
			totalPages,
		});
	}),

	// ── 자동완성 ──────────────────────────────────────────
	http.get('/api/autocomplete', async ({ request }) => {
		await delay(Math.random() * 300 + 100); // 100~400ms (자동완성은 빠르게)

		// 간헐적 에러 (자동완성도 실패할 수 있음)
		const errorResponse = maybeError();
		if (errorResponse) return errorResponse;

		const url = new URL(request.url);
		const keyword = url.searchParams.get('keyword')?.trim() ?? '';

		if (!keyword) {
			return HttpResponse.json({ suggestions: [] });
		}

		const lowerKeyword = keyword.toLowerCase();
		const suggestions = autocompleteDictionary
			.filter((term) => term.toLowerCase().startsWith(lowerKeyword))
			.slice(0, 10); // 최대 10개

		return HttpResponse.json({ suggestions });
	}),
];
