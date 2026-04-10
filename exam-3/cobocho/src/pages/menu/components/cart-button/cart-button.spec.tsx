import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestProvider } from '@/test/test-provider';
import { CartButton } from './cart-button';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/domain/order/context/cart-context', () => ({
	useCartContext: vi.fn(),
}));

import { useCartContext } from '@/domain/order/context/cart-context';

function mockCart(totalQuantity: number, totalPrice: number) {
	vi.mocked(useCartContext).mockReturnValue({
		items: [],
		addItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		totalQuantity,
		totalPrice,
	});
}

describe('CartButton', () => {
	beforeEach(() => {
		mockNavigate.mockClear();
	});

	it('장바구니가 비어있으면 "장바구니 보기"만 표시한다', () => {
		mockCart(0, 0);

		render(
			<TestProvider>
				<CartButton />
			</TestProvider>,
		);

		expect(screen.getByRole('button')).toHaveTextContent('장바구니 보기');
		expect(screen.getByRole('button')).not.toHaveTextContent('개');
	});

	it('장바구니에 항목이 있으면 수량과 금액을 표시한다', () => {
		mockCart(3, 12000);

		render(
			<TestProvider>
				<CartButton />
			</TestProvider>,
		);

		expect(screen.getByRole('button')).toHaveTextContent('장바구니 보기 · 3개 · 12,000원');
	});

	it('클릭하면 /cart로 이동한다', async () => {
		const user = userEvent.setup();
		mockCart(0, 0);

		render(
			<TestProvider>
				<CartButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		expect(mockNavigate).toHaveBeenCalledWith('/cart');
	});
});
