import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import type { ProductsRequest } from '../../api/products.types';
import { ProductSearchFilter } from './product-search-filter';

const defaultValue: ProductsRequest = {
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

const setup = (overrides: Partial<ProductsRequest> = {}) => {
	const value = { ...defaultValue, ...overrides };
	const onChange = vi.fn();
	const user = userEvent.setup();
	render(<ProductSearchFilter value={value} onChange={onChange} />, {
		wrapper: createWrapper(),
	});
	return { onChange, user };
};

describe('ProductSearchFilter', () => {
	describe('키워드 검색', () => {
		it('검색 입력창이 렌더링된다', () => {
			setup();

			expect(screen.getByRole('combobox')).toBeInTheDocument();
		});

		it('키워드 값이 입력창에 표시된다', () => {
			setup({ keyword: '나이키' });

			expect(screen.getByRole('combobox')).toHaveValue('나이키');
		});
	});

	describe('카테고리 필터', () => {
		it('체크박스를 클릭하면 해당 카테고리가 추가된다', async () => {
			const { onChange, user } = setup();

			await user.click(screen.getByLabelText('신발'));

			expect(onChange).toHaveBeenCalledWith({ categories: ['shoes'] });
		});

		it('이미 선택된 카테고리를 클릭하면 제거된다', async () => {
			const { onChange, user } = setup({ categories: ['shoes', 'tops'] });

			await user.click(screen.getByLabelText('신발'));

			expect(onChange).toHaveBeenCalledWith({ categories: ['tops'] });
		});

		it('마지막 카테고리를 해제하면 null로 호출된다', async () => {
			const { onChange, user } = setup({ categories: ['shoes'] });

			await user.click(screen.getByLabelText('신발'));

			expect(onChange).toHaveBeenCalledWith({ categories: null });
		});
	});

	describe('정렬', () => {
		it('정렬 버튼을 클릭하면 해당 옵션으로 onChange가 호출된다', async () => {
			const { onChange, user } = setup();

			await user.click(screen.getByText('가격 낮은순'));

			expect(onChange).toHaveBeenCalledWith({ sort: 'price_asc' });
		});

		it('이미 선택된 정렬을 클릭하면 null로 토글된다', async () => {
			const { onChange, user } = setup({ sort: 'price_asc' });

			await user.click(screen.getByText('가격 낮은순'));

			expect(onChange).toHaveBeenCalledWith({ sort: null });
		});
	});

	describe('초기화', () => {
		it('초기화 버튼을 클릭하면 모든 필터가 리셋된다', async () => {
			const { onChange, user } = setup({
				categories: ['shoes'],
				keyword: '나이키',
				sort: 'price_asc',
			});

			await user.click(screen.getByText('초기화'));

			expect(onChange).toHaveBeenCalledWith({
				categories: null,
				keyword: null,
				sort: null,
				page: 1,
				size: 20,
			});
		});
	});
});
