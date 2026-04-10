import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MenuItem, MenuOption } from '@/domain/catalog/api/catalog.types';
import {
	NotFoundError,
	InternalServerError,
	ServiceUnavailableError,
} from '@/shared/lib/error';
import { QueryErrorBoundary } from '@/shared/components/query-error-boundary';
import { MenuDetailError } from './components/menu-detail-error';
import { TestProvider } from '@/test/test-provider';
import { MenuDetailPage } from './menu-detail-page';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return {
		...actual,
		useParams: () => ({ itemId: 'espresso' }),
		useNavigate: () => mockNavigate,
	};
});

vi.mock('./hooks/use-menu-options', () => ({
	useMenuOptions: vi.fn(),
}));

vi.mock('@/domain/order/context/cart-context', () => ({
	useCartContext: () => ({
		items: [],
		addItem: mockAddItem,
		removeItem: vi.fn(),
		clear: vi.fn(),
		totalQuantity: 0,
		totalPrice: 0,
	}),
}));

import { useMenuOptions } from './hooks/use-menu-options';

const mockAddItem = vi.fn();

const mockItem: MenuItem = {
	id: 'espresso',
	category: '커피',
	title: '에스프레소',
	description: '진한 에스프레소',
	price: 3000,
	iconImg: '/images/espresso.png',
	optionIds: [1, 3],
};

const gridOption: MenuOption = {
	id: 1,
	name: '온도',
	type: 'grid',
	required: true,
	col: 2,
	labels: ['HOT', 'ICE'],
	icons: ['🔥', '🧊'],
	prices: [0, 0],
};

const selectOption: MenuOption = {
	id: 3,
	name: '진하기',
	type: 'select',
	required: false,
	labels: ['연하게', '보통', '진하게'],
	prices: [0, 0, 0],
};

function setup(options: MenuOption[] = [gridOption, selectOption]) {
	vi.mocked(useMenuOptions).mockReturnValue({
		item: mockItem,
		options,
	});
	mockAddItem.mockClear();
	mockNavigate.mockClear();
}

describe('MenuDetailPage', () => {
	it('메뉴 정보를 렌더링한다', () => {
		setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		expect(screen.getByText('에스프레소')).toBeInTheDocument();
		expect(screen.getByText('3,000원')).toBeInTheDocument();
	});

	it('grid 옵션을 렌더링한다', () => {
		setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		expect(screen.getByText('온도')).toBeInTheDocument();
		expect(screen.getByText('HOT')).toBeInTheDocument();
		expect(screen.getByText('ICE')).toBeInTheDocument();
	});

	it('grid 옵션을 선택할 수 있다', async () => {
		setup();
		const user = userEvent.setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		await user.click(screen.getByText('HOT'));

		// 가격이 CTA에 반영되는지 확인
		expect(screen.getByText('3,000원 담기')).toBeInTheDocument();
	});

	it('수량을 변경할 수 있다', async () => {
		setup();
		const user = userEvent.setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		await user.click(screen.getByText('HOT'));
		await user.click(screen.getByText('+'));

		expect(screen.getByText('2')).toBeInTheDocument();
		expect(screen.getByText('6,000원 담기')).toBeInTheDocument();
	});

	it('필수 옵션 미선택 시 담기를 누르면 toast가 표시된다', async () => {
		setup();
		const user = userEvent.setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		await user.click(screen.getByText(/담기/));

		// validateSelections가 에러를 반환하므로 addItem이 호출되지 않음
		expect(mockAddItem).not.toHaveBeenCalled();
	});

	it('옵션 선택 후 담기를 누르면 장바구니에 추가되고 메뉴판으로 이동한다', async () => {
		setup();
		const user = userEvent.setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		await user.click(screen.getByText('HOT'));
		await user.click(screen.getByText(/담기/));

		expect(mockAddItem).toHaveBeenCalledWith(
			mockItem,
			expect.arrayContaining([
				expect.objectContaining({ optionId: 1, labels: ['HOT'] }),
			]),
			1,
		);
		expect(mockNavigate).toHaveBeenCalledWith('/');
	});

	it('수량이 1일 때 감소 버튼이 비활성화된다', () => {
		setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		expect(screen.getByText('-').closest('button')).toBeDisabled();
	});

	it('수량이 99일 때 증가 버튼이 비활성화된다', async () => {
		setup();
		const user = userEvent.setup();

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		// 99번 클릭하는 대신, 98번 증가시킴
		for (let i = 0; i < 98; i++) {
			await user.click(screen.getByText('+'));
		}

		expect(screen.getByText('99')).toBeInTheDocument();
		expect(screen.getByText('+').closest('button')).toBeDisabled();
	});

	it('옵션이 없는 메뉴도 렌더링된다', () => {
		setup([]);

		render(
			<TestProvider>
				<MenuDetailPage />
			</TestProvider>,
		);

		expect(screen.getByText('에스프레소')).toBeInTheDocument();
		expect(screen.getByText('3,000원 담기')).toBeInTheDocument();
	});
});

describe('MenuDetailPage 에러 처리', () => {
	function renderWithErrorBoundary() {
		return render(
			<TestProvider>
				<QueryErrorBoundary fallback={<MenuDetailError />}>
					<MenuDetailPage />
				</QueryErrorBoundary>
			</TestProvider>,
		);
	}

	it('404 에러 시 메뉴를 찾을 수 없다는 메시지를 표시한다', () => {
		vi.mocked(useMenuOptions).mockImplementation(() => {
			throw new NotFoundError('메뉴를 찾을 수 없습니다.');
		});

		renderWithErrorBoundary();

		expect(screen.getByText('메뉴를 찾을 수 없습니다.')).toBeInTheDocument();
		expect(screen.getByText('메뉴 페이지로 이동')).toBeInTheDocument();
	});

	it('500 에러 시 서버 오류 메시지와 다시 시도 버튼을 표시한다', () => {
		vi.mocked(useMenuOptions).mockImplementation(() => {
			throw new InternalServerError('서버 내부 오류');
		});

		renderWithErrorBoundary();

		expect(screen.getByText('오류가 발생했습니다.')).toBeInTheDocument();
		expect(screen.getByText('서버 내부 오류')).toBeInTheDocument();
		expect(screen.getByText('다시 시도')).toBeInTheDocument();
	});

	it('503 에러 시 서버 오류 메시지와 다시 시도 버튼을 표시한다', () => {
		vi.mocked(useMenuOptions).mockImplementation(() => {
			throw new ServiceUnavailableError('서버 과부하');
		});

		renderWithErrorBoundary();

		expect(screen.getByText('오류가 발생했습니다.')).toBeInTheDocument();
		expect(screen.getByText('서버 과부하')).toBeInTheDocument();
		expect(screen.getByText('다시 시도')).toBeInTheDocument();
	});

	it('404 에러 시 메뉴 페이지로 이동 버튼을 클릭하면 /로 이동한다', async () => {
		vi.mocked(useMenuOptions).mockImplementation(() => {
			throw new NotFoundError('메뉴를 찾을 수 없습니다.');
		});
		const user = userEvent.setup();

		renderWithErrorBoundary();

		await user.click(screen.getByText('메뉴 페이지로 이동'));

		expect(mockNavigate).toHaveBeenCalledWith('/');
	});
});
