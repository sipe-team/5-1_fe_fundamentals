import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import App from './App';

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

beforeEach(() => {
	window.history.replaceState({}, '', '/');
});

describe('URL 동기화', () => {
	it('카테고리를 선택하면 URL 쿼리스트링에 반영된다', async () => {
		const user = userEvent.setup();
		render(<App />, { wrapper: createWrapper() });

		await user.click(screen.getByText('신발'));

		const params = new URLSearchParams(window.location.search);
		expect(params.get('categories')).toBe('shoes');
	});

	it('검색 입력창이 렌더링된다', () => {
		render(<App />, { wrapper: createWrapper() });

		expect(screen.getByRole('combobox')).toBeInTheDocument();
	});

	it('정렬을 선택하면 URL 쿼리스트링에 반영된다', async () => {
		const user = userEvent.setup();
		render(<App />, { wrapper: createWrapper() });

		await user.click(screen.getByText('가격 낮은순'));

		const params = new URLSearchParams(window.location.search);
		expect(params.get('sort')).toBe('price_asc');
	});

	it('URL에 필터 상태가 있으면 해당 상태로 렌더링된다', () => {
		window.history.replaceState(
			{},
			'',
			'/?keyword=아디다스&categories=shoes,tops&sort=rating',
		);
		render(<App />, { wrapper: createWrapper() });

		expect(screen.getByRole('combobox')).toHaveDisplayValue('아디다스');
		expect(screen.getByText('신발')).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByText('상의')).toHaveAttribute('aria-pressed', 'true');
		expect(screen.getByText('하의')).toHaveAttribute('aria-pressed', 'false');
		expect(screen.getByText('평점순')).toHaveAttribute('aria-pressed', 'true');
	});

	it('초기화 버튼을 누르면 필터/정렬 쿼리스트링이 비워진다', async () => {
		window.history.replaceState(
			{},
			'',
			'/?categories=shoes&sort=price_asc',
		);
		const user = userEvent.setup();
		render(<App />, { wrapper: createWrapper() });

		await user.click(screen.getByText('초기화'));

		expect(window.location.search).toBe('');
	});
});
