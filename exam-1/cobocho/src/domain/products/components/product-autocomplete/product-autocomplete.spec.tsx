import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { ProductAutoComplete } from './product-autocomplete';

vi.mock('../../api/products.service', () => ({
	productsService: {
		getAutoComplete: vi.fn(),
	},
}));

import { productsService } from '../../api/products.service';

const mockGetAutoComplete = vi.mocked(productsService.getAutoComplete);

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('ProductAutoComplete', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('input을 렌더링한다', () => {
		render(
			<ProductAutoComplete value="" onChange={vi.fn()} debounceMs={0} />,
			{ wrapper: createWrapper() },
		);

		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('키워드 입력 후 디바운스 뒤 자동완성 목록이 표시된다', async () => {
		mockGetAutoComplete.mockResolvedValue({
			suggestions: ['나이키 에어맥스', '나이키 덩크'],
		});

		render(
			<ProductAutoComplete value="" onChange={vi.fn()} debounceMs={0} />,
			{ wrapper: createWrapper() },
		);

		await userEvent.type(screen.getByRole('combobox'), '나이키');

		await waitFor(() => {
			expect(screen.getByText('나이키 에어맥스')).toBeInTheDocument();
			expect(screen.getByText('나이키 덩크')).toBeInTheDocument();
		});
	});

	it('항목을 선택하면 onChange가 호출된다', async () => {
		const onChange = vi.fn();
		mockGetAutoComplete.mockResolvedValue({
			suggestions: ['나이키 에어맥스'],
		});

		render(
			<ProductAutoComplete value="" onChange={onChange} debounceMs={0} />,
			{ wrapper: createWrapper() },
		);

		await userEvent.type(screen.getByRole('combobox'), '나이키');

		await waitFor(() => {
			expect(screen.getByText('나이키 에어맥스')).toBeInTheDocument();
		});

		await userEvent.click(screen.getByText('나이키 에어맥스'));

		expect(onChange).toHaveBeenCalledWith('나이키 에어맥스');
	});

	it('키워드가 비어있으면 API를 호출하지 않는다', () => {
		render(
			<ProductAutoComplete value="" onChange={vi.fn()} debounceMs={0} />,
			{ wrapper: createWrapper() },
		);

		expect(mockGetAutoComplete).not.toHaveBeenCalled();
	});
});
