import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
	window.history.replaceState({}, '', '/');
});

describe('URL 동기화', () => {
	it('카테고리를 선택하면 URL 쿼리스트링에 반영된다', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByLabelText('신발'));

		const params = new URLSearchParams(window.location.search);
		expect(params.get('categories')).toBe('shoes');
	});

	it('검색어를 입력하면 URL 쿼리스트링에 반영된다', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.type(screen.getByRole('textbox'), '나이키');

		const params = new URLSearchParams(window.location.search);
		expect(params.get('keyword')).toBe('나이키');
	});

	it('정렬을 선택하면 URL 쿼리스트링에 반영된다', async () => {
		const user = userEvent.setup();
		render(<App />);

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
		render(<App />);

		expect(screen.getByRole('textbox')).toHaveValue('아디다스');
		expect(screen.getByLabelText('신발')).toBeChecked();
		expect(screen.getByLabelText('상의')).toBeChecked();
		expect(screen.getByLabelText('하의')).not.toBeChecked();
		expect(screen.getByText('평점순')).toHaveClass('text-black');
	});

	it('초기화 버튼을 누르면 URL 쿼리스트링이 비워진다', async () => {
		window.history.replaceState(
			{},
			'',
			'/?keyword=나이키&categories=shoes&sort=price_asc',
		);
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByText('초기화'));

		expect(window.location.search).toBe('');
	});
});
