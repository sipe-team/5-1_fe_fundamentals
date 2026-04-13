import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestProvider } from '@/test/test-provider';
import { BadRequestError, InternalServerError } from '@/shared/lib/error';
import { OrderButton } from './order-button';

const mockNavigate = vi.fn();
const mockClear = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual('react-router-dom');
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/domain/order/context/cart-context', () => ({
	useCartContext: vi.fn(),
}));

vi.mock('@/domain/order/api', () => ({
	orderService: {
		createOrder: vi.fn(),
	},
}));

const mockInvalidateQueries = vi.fn();

const mockMenuItem = {
	id: 'americano',
	category: '커피' as const,
	title: '아메리카노',
	description: '',
	price: 4500,
	iconImg: '',
	optionIds: [1],
};

const mockOption = {
	id: 1,
	name: '온도',
	type: 'grid',
	required: true,
	col: 2,
	labels: ['HOT', 'ICE'],
	icons: ['🔥', '🧊'],
	prices: [0, 500],
};

vi.mock('@tanstack/react-query', async () => {
	const actual = await vi.importActual('@tanstack/react-query');
	return {
		...actual,
		useSuspenseQuery: (opts: { queryKey: readonly unknown[] }) => {
			const key = opts.queryKey;
			if (key.includes('items')) {
				return { data: { items: [mockMenuItem] } };
			}
			return { data: { options: [mockOption] } };
		},
		useQueryClient: () => ({
			invalidateQueries: mockInvalidateQueries,
		}),
	};
});

const mockToastError = vi.fn();
vi.mock('sonner', () => ({
	toast: { error: (...args: unknown[]) => mockToastError(...args) },
}));

import { useCartContext } from '@/domain/order/context/cart-context';
import { orderService } from '@/domain/order/api';

const mockItems = [
	{
		itemId: 'americano',
		options: [{ optionId: 1, labels: ['HOT'] }],
		quantity: 2,
	},
];

function mockCart() {
	vi.mocked(useCartContext).mockReturnValue({
		items: mockItems,
		addItem: vi.fn(),
		removeItem: vi.fn(),
		updateQuantity: vi.fn(),
		clear: mockClear,
		totalQuantity: 2,
	});
}

beforeEach(() => {
	vi.clearAllMocks();
});

describe('OrderButton', () => {
	it('총 금액을 버튼에 표시한다', () => {
		mockCart();

		render(
			<TestProvider>
				<OrderButton />
			</TestProvider>,
		);

		expect(screen.getByRole('button')).toHaveTextContent('9,000원 주문하기');
	});

	it('클릭 시 주문 API를 호출하고 성공하면 장바구니를 비우고 주문 페이지로 이동한다', async () => {
		mockCart();
		vi.mocked(orderService.createOrder).mockResolvedValue({
			orderId: 'order-123',
		});

		const user = userEvent.setup();

		render(
			<TestProvider>
				<OrderButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockClear).toHaveBeenCalled();
		});
		expect(mockNavigate).toHaveBeenCalledWith('/orders/order-123');
	});

	it('주문 API 실패 시 clear와 navigate가 호출되지 않는다', async () => {
		mockCart();
		vi.mocked(orderService.createOrder).mockRejectedValue(
			new Error('잘못된 주문이에요.'),
		);

		const user = userEvent.setup();

		render(
			<TestProvider>
				<OrderButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByRole('button')).not.toBeDisabled();
		});
		expect(mockNavigate).not.toHaveBeenCalled();
		expect(mockClear).not.toHaveBeenCalled();
	});

	it('주문 시 최신 옵션 기준의 totalPrice와 unitPrice를 서버로 전송한다', async () => {
		mockCart();
		vi.mocked(orderService.createOrder).mockResolvedValue({
			orderId: 'order-xyz',
		});

		const user = userEvent.setup();

		render(
			<TestProvider>
				<OrderButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(orderService.createOrder).toHaveBeenCalledTimes(1);
		});

		// 아메리카노(4500) + HOT(+0) = 4500, quantity=2 => total 9000
		const payload = vi.mocked(orderService.createOrder).mock.calls[0][0];
		expect(payload).toEqual(
			expect.objectContaining({
				totalPrice: 9000,
				customerName: '고객',
				items: [
					expect.objectContaining({
						itemId: 'americano',
						quantity: 2,
						unitPrice: 4500,
						options: [{ optionId: 1, labels: ['HOT'] }],
					}),
				],
			}),
		);
	});

	it('400 에러 응답 시 options/items 쿼리를 invalidate 하고 toast로 에러 메시지를 표시한다', async () => {
		mockCart();
		vi.mocked(orderService.createOrder).mockRejectedValue(
			new BadRequestError('주문금액이 잘못되었어요.'),
		);

		const user = userEvent.setup();

		render(
			<TestProvider>
				<OrderButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(mockToastError).toHaveBeenCalledWith('주문금액이 잘못되었어요.');
		});

		// options, items 두 쿼리 모두 invalidate
		expect(mockInvalidateQueries).toHaveBeenCalledWith({
			queryKey: ['catalog', 'options'],
		});
		expect(mockInvalidateQueries).toHaveBeenCalledWith({
			queryKey: ['catalog', 'items'],
		});
	});

	it('400 이외의 에러에서는 invalidate 및 toast가 호출되지 않는다', async () => {
		mockCart();
		vi.mocked(orderService.createOrder).mockRejectedValue(
			new InternalServerError('서버 내부 오류'),
		);

		const user = userEvent.setup();

		render(
			<TestProvider>
				<OrderButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		await waitFor(() => {
			expect(screen.getByRole('button')).not.toBeDisabled();
		});

		expect(mockInvalidateQueries).not.toHaveBeenCalled();
		expect(mockToastError).not.toHaveBeenCalled();
	});

	it('주문 중 버튼이 비활성화된다', async () => {
		mockCart();
		let resolveOrder!: (value: { orderId: string }) => void;
		vi.mocked(orderService.createOrder).mockImplementation(
			() => new Promise((resolve) => { resolveOrder = resolve; }),
		);

		const user = userEvent.setup();

		render(
			<TestProvider>
				<OrderButton />
			</TestProvider>,
		);

		await user.click(screen.getByRole('button'));

		expect(screen.getByRole('button')).toBeDisabled();

		resolveOrder({ orderId: 'order-123' });
	});
});
