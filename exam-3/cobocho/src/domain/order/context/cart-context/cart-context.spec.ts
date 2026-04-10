import type { MenuItem } from '@/domain/catalog/api/catalog.types';
import type { OptionSelection } from '../../api/order.types';
import type { CartItem } from './cart-context';
import {
	isSameOptions,
	cartItemKey,
	addItemToCart,
	calcTotalPrice,
	calcTotalQuantity,
} from './cart-context.lib';

const mockItem: MenuItem = {
	id: 'espresso',
	category: '커피',
	title: '에스프레소',
	description: '진한 에스프레소',
	price: 3000,
	iconImg: '/images/espresso.png',
	optionIds: [1, 2],
};

const hotOption: OptionSelection = { optionId: 1, labels: ['HOT'] };
const iceOption: OptionSelection = { optionId: 1, labels: ['ICE'] };
const sizeOption: OptionSelection = { optionId: 2, labels: ['Grande'] };

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
	return {
		item: mockItem,
		options: [hotOption],
		quantity: 1,
		unitPrice: 3000,
		totalPrice: 3000,
		...overrides,
	};
}

describe('isSameOptions', () => {
	it('동일한 옵션이면 true를 반환한다', () => {
		expect(isSameOptions([hotOption], [hotOption])).toBe(true);
	});

	it('옵션 개수가 다르면 false를 반환한다', () => {
		expect(isSameOptions([hotOption], [hotOption, sizeOption])).toBe(false);
	});

	it('같은 optionId지만 다른 label이면 false를 반환한다', () => {
		expect(isSameOptions([hotOption], [iceOption])).toBe(false);
	});

	it('빈 옵션끼리는 true를 반환한다', () => {
		expect(isSameOptions([], [])).toBe(true);
	});

	it('label 순서가 달라도 동일하면 true를 반환한다', () => {
		const a: OptionSelection = { optionId: 1, labels: ['A', 'B'] };
		const b: OptionSelection = { optionId: 1, labels: ['B', 'A'] };
		expect(isSameOptions([a], [b])).toBe(true);
	});
});

describe('cartItemKey', () => {
	it('메뉴ID와 옵션으로 고유 키를 생성한다', () => {
		expect(cartItemKey('espresso', [hotOption])).toBe('espresso::1:HOT');
	});

	it('옵션이 없으면 빈 옵션 키를 생성한다', () => {
		expect(cartItemKey('espresso', [])).toBe('espresso::');
	});

	it('옵션 순서가 달라도 같은 키를 반환한다', () => {
		const key1 = cartItemKey('espresso', [sizeOption, hotOption]);
		const key2 = cartItemKey('espresso', [hotOption, sizeOption]);
		expect(key1).toBe(key2);
	});

	it('label 순서가 달라도 같은 키를 반환한다', () => {
		const a: OptionSelection = { optionId: 1, labels: ['B', 'A'] };
		const b: OptionSelection = { optionId: 1, labels: ['A', 'B'] };
		expect(cartItemKey('espresso', [a])).toBe(cartItemKey('espresso', [b]));
	});
});

describe('addItemToCart', () => {
	it('빈 장바구니에 항목을 추가한다', () => {
		const result = addItemToCart({
			prev: [],
			item: mockItem,
			options: [hotOption],
			quantity: 2,
			unitPrice: 3000,
		});

		expect(result).toHaveLength(1);
		expect(result[0].quantity).toBe(2);
		expect(result[0].totalPrice).toBe(6000);
	});

	it('같은 메뉴+옵션이면 수량을 합산한다', () => {
		const existing = createCartItem({ quantity: 1, totalPrice: 3000 });

		const result = addItemToCart({
			prev: [existing],
			item: mockItem,
			options: [hotOption],
			quantity: 3,
			unitPrice: 3000,
		});

		expect(result).toHaveLength(1);
		expect(result[0].quantity).toBe(4);
		expect(result[0].totalPrice).toBe(12000);
	});

	it('같은 메뉴라도 옵션이 다르면 별도 항목으로 추가한다', () => {
		const existing = createCartItem({ options: [hotOption] });

		const result = addItemToCart({
			prev: [existing],
			item: mockItem,
			options: [iceOption],
			quantity: 1,
			unitPrice: 3000,
		});

		expect(result).toHaveLength(2);
	});

	it('다른 항목은 변경하지 않는다', () => {
		const other = createCartItem({
			item: { ...mockItem, id: 'latte' },
			options: [hotOption],
		});
		const existing = createCartItem({ options: [hotOption] });

		const result = addItemToCart({
			prev: [other, existing],
			item: mockItem,
			options: [hotOption],
			quantity: 1,
			unitPrice: 3000,
		});

		expect(result[0]).toBe(other);
		expect(result[1].quantity).toBe(2);
	});
});

describe('calcTotalPrice', () => {
	it('빈 배열이면 0을 반환한다', () => {
		expect(calcTotalPrice([])).toBe(0);
	});

	it('모든 항목의 totalPrice를 합산한다', () => {
		const items = [
			createCartItem({ totalPrice: 3000 }),
			createCartItem({ totalPrice: 4500 }),
		];
		expect(calcTotalPrice(items)).toBe(7500);
	});
});

describe('calcTotalQuantity', () => {
	it('빈 배열이면 0을 반환한다', () => {
		expect(calcTotalQuantity([])).toBe(0);
	});

	it('모든 항목의 quantity를 합산한다', () => {
		const items = [
			createCartItem({ quantity: 2 }),
			createCartItem({ quantity: 3 }),
		];
		expect(calcTotalQuantity(items)).toBe(5);
	});
});
