import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type {
	ProductsRequest,
	ProductsResponse,
} from '../../api/products.types';
import { ProductsInfinityList } from './products-infinity-list';

vi.mock('sonner', () => ({
	toast: { error: vi.fn() },
}));

vi.mock('../../api/products.service', () => ({
	productsService: {
		getProducts: vi.fn(),
	},
}));

import { productsService } from '../../api/products.service';

const mockGetProducts = vi.mocked(productsService.getProducts);

const mockResponse = (page: number, totalPages: number): ProductsResponse => ({
	products: [
		{
			id: page,
			name: `상품 ${page}`,
			price: 10000 * page,
			category: 'shoes',
			imageUrl: 'https://picsum.photos/200',
			createdAt: '2026-01-01T00:00:00Z',
			rating: 4.5,
		},
	],
	total: totalPages,
	page,
	size: 1,
	totalPages,
});

const defaultFilters: ProductsRequest = {
	categories: null,
	keyword: null,
	sort: null,
	page: 1,
	size: 20,
};

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('ProductsInfinityList', () => {
	beforeEach(() => {
		window.IntersectionObserver = vi.fn().mockImplementation(() => ({
			observe: vi.fn(),
			disconnect: vi.fn(),
			unobserve: vi.fn(),
		}));
	});

	afterEach(() => {
		vi.resetAllMocks();
	});

	it('상품 데이터를 불러와 카드로 렌더링한다', async () => {
		mockGetProducts.mockResolvedValue(mockResponse(1, 1));

		render(<ProductsInfinityList options={defaultFilters} />, {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(screen.getByText('상품 1')).toBeInTheDocument();
		});
	});

	it('API 에러 시 다시 시도 버튼이 표시된다', async () => {
		mockGetProducts.mockRejectedValue(new Error('server error'));

		render(<ProductsInfinityList options={defaultFilters} />, {
			wrapper: createWrapper(),
		});

		await waitFor(
			() => {
				expect(screen.getByText('다시 시도')).toBeInTheDocument();
			},
			{ timeout: 5000 },
		);
	});

	it('다시 시도 버튼을 클릭하면 재요청한다', async () => {
		mockGetProducts
			.mockRejectedValueOnce(new Error('server error'))
			.mockRejectedValueOnce(new Error('server error'))
			.mockResolvedValueOnce(mockResponse(1, 1));

		render(<ProductsInfinityList options={defaultFilters} />, {
			wrapper: createWrapper(),
		});

		await waitFor(
			() => {
				expect(screen.getByText('다시 시도')).toBeInTheDocument();
			},
			{ timeout: 5000 },
		);

		await userEvent.click(screen.getByText('다시 시도'));

		await waitFor(() => {
			expect(screen.getByText('상품 1')).toBeInTheDocument();
		});
	});

	it('결과가 없으면 빈 상태 안내가 표시된다', async () => {
		mockGetProducts.mockResolvedValue({
			products: [],
			total: 0,
			page: 1,
			size: 20,
			totalPages: 0,
		});

		render(<ProductsInfinityList options={defaultFilters} />, {
			wrapper: createWrapper(),
		});

		await waitFor(() => {
			expect(screen.getByText('검색 결과가 없습니다.')).toBeInTheDocument();
		});
	});
});
