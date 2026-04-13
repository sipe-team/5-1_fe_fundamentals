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

vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual('@tanstack/react-query');
	return {
		...actual,
		useSuspenseQuery: (opts: { queryKey: readonly unknown[] }) => {
			if (opts.queryKey.includes('items')) {
				return {
					data: {
						items: [
							{
								id: 'latte',
								category: '커피',
								title: '라떼',
								description: '',
								price: 4000,
								iconImg: '',
								optionIds: [1],
							},
						],
					},
				};
			}
			return {
				data: {
					options: [
						{
							id: 1,
							name: '온도',
							type: 'grid',
							required: true,
							col: 2,
							labels: ['HOT', 'ICE'],
							icons: ['🔥', '🧊'],
							prices: [0, 500],
						},
					],
				},
			};
		},
	};
});

import { useCartContext } from '@/domain/order/context/cart-context';

function mockCart(items: Array<{ itemId: string; options: Array<{ optionId: number; labels: string[] }>; quantity: number }>) {
	const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
	vi.mocked(useCartContext).mockReturnValue({
		items: items as never[],
		addItem: vi.fn(),
		removeItem: vi.fn(),
		clear: vi.fn(),
		updateQuantity: vi.fn(),
		totalQuantity,
	});
}

describe('CartButton', () => {
	beforeEach(() => {
		mockNavigate.mockClear();
	});

	it('장바구니가 비어있으면 "장바구니 보기"만 표시한다', () => {
		mockCart([]);

		render(
			<TestProvider>
				<CartButton />
			</TestProvider>,
		);

		expect(screen.getByRole('button')).toHaveTextContent('장바구니 보기');
		expect(screen.getByRole('button')).not.toHaveTextContent('개');
	});

	it('장바구니에 항목이 있으면 수량과 금액을 표시한다', () => {
		mockCart([
			{
				itemId: 'latte',
				options: [{ optionId: 1, labels: ['ICE'] }],
				quantity: 3,
			},
		]);

		render(
			<TestProvider>
				<CartButton />
			</TestProvider>,
		);

		// 4000 + 500(ICE) = 4500 * 3 = 13,500
		expect(screen.getByRole('button')).toHaveTextContent('장바구니 보기 · 3개 · 13,500원');
	});

	it('클릭하면 /cart로 이동한다', async () => {
		const user = userEvent.setup();
		mockCart([]);

		render(
			<TestProvider>
				<CartButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		expect(mockNavigate).toHaveBeenCalledWith('/cart');
	});
});
