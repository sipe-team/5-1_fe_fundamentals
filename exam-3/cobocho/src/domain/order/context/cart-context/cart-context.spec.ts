import type { MenuItem } from '@/domain/catalog/api/catalog.types';
import type { GridOption, MenuOption } from '@/types/order';
import type { OptionSelection } from '../../api/order.types';
import type { CartItem } from './cart-context';
import {
	isSameOptions,
	cartItemKey,
	addItemToCart,
	calcTotalQuantity,
	calcUnitPrice,
	calcCartTotalPrice,
	validateCartItem,
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

const mockOptions: MenuOption[] = [
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
	{
		id: 2,
		name: '사이즈',
		type: 'select',
		required: false,
		labels: ['Regular', 'Grande'],
		prices: [0, 1000],
	},
];

function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
	return {
		itemId: mockItem.id,
		options: [hotOption],
		quantity: 1,
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
			itemId: mockItem.id,
			options: [hotOption],
			quantity: 2,
		});

		expect(result).toHaveLength(1);
		expect(result[0].quantity).toBe(2);
	});

	it('같은 메뉴+옵션이면 수량을 합산한다', () => {
		const existing = createCartItem({ quantity: 1 });

		const result = addItemToCart({
			prev: [existing],
			itemId: mockItem.id,
			options: [hotOption],
			quantity: 3,
		});

		expect(result).toHaveLength(1);
		expect(result[0].quantity).toBe(4);
	});

	it('같은 메뉴라도 옵션이 다르면 별도 항목으로 추가한다', () => {
		const existing = createCartItem({ options: [hotOption] });

		const result = addItemToCart({
			prev: [existing],
			itemId: mockItem.id,
			options: [iceOption],
			quantity: 1,
		});

		expect(result).toHaveLength(2);
	});

	it('다른 항목은 변경하지 않는다', () => {
		const other = createCartItem({
			itemId: 'latte',
			options: [hotOption],
		});
		const existing = createCartItem({ options: [hotOption] });

		const result = addItemToCart({
			prev: [other, existing],
			itemId: mockItem.id,
			options: [hotOption],
			quantity: 1,
		});

		expect(result[0]).toBe(other);
		expect(result[1].quantity).toBe(2);
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

describe('calcUnitPrice', () => {
	it('옵션이 없으면 베이스 가격만 반환한다', () => {
		expect(calcUnitPrice(mockItem, [], mockOptions)).toBe(3000);
	});

	it('추가 가격이 없는 옵션은 베이스 가격만 반환한다', () => {
		expect(calcUnitPrice(mockItem, [hotOption], mockOptions)).toBe(3000);
	});

	it('추가 가격이 있는 옵션을 반영한다', () => {
		// ICE는 500원 추가
		expect(calcUnitPrice(mockItem, [iceOption], mockOptions)).toBe(3500);
	});

	it('여러 옵션의 추가 가격을 합산한다', () => {
		// ICE(500) + Grande(1000)
		expect(
			calcUnitPrice(mockItem, [iceOption, sizeOption], mockOptions),
		).toBe(4500);
	});

	it('카탈로그에 없는 옵션은 무시한다', () => {
		const unknownOption: OptionSelection = { optionId: 999, labels: ['X'] };
		expect(calcUnitPrice(mockItem, [unknownOption], mockOptions)).toBe(3000);
	});
});

describe('calcCartTotalPrice', () => {
	it('빈 장바구니이면 0을 반환한다', () => {
		expect(calcCartTotalPrice([], [mockItem], mockOptions)).toBe(0);
	});

	it('단가 × 수량으로 총 금액을 계산한다', () => {
		const items = [
			createCartItem({ options: [iceOption], quantity: 2 }), // 3500 * 2
			createCartItem({ options: [hotOption, sizeOption], quantity: 1 }), // 4000 * 1
		];
		expect(calcCartTotalPrice(items, [mockItem], mockOptions)).toBe(11000);
	});

	it('allItems에 없는 itemId는 합산에서 제외한다', () => {
		const items = [
			createCartItem({ options: [iceOption], quantity: 2 }),
			createCartItem({ itemId: 'deleted', options: [hotOption], quantity: 5 }),
		];
		// deleted 항목은 제외되고 iceOption 항목만 계산
		expect(calcCartTotalPrice(items, [mockItem], mockOptions)).toBe(7000);
	});
});

describe('서버 가격 변동 시나리오', () => {
	it('allOptions가 바뀌면 calcUnitPrice가 최신 옵션 가격을 반영한다', () => {
		const before = calcUnitPrice(mockItem, [iceOption], mockOptions);
		expect(before).toBe(3500); // 3000 + 500

		const updatedOptions: MenuOption[] = mockOptions.map((opt) =>
			opt.id === 1 ? { ...opt, prices: [0, 800] } : opt,
		);

		const after = calcUnitPrice(mockItem, [iceOption], updatedOptions);
		expect(after).toBe(3800);
	});

	it('서버에서 메뉴 기본가가 바뀌면 calcCartTotalPrice가 자동으로 최신가를 반영한다', () => {
		const items = [createCartItem({ options: [iceOption], quantity: 2 })];

		// 기본가 3000 -> 3500 으로 변경된 상황
		const updatedItems: MenuItem[] = [{ ...mockItem, price: 3500 }];

		// (3500 + 500) * 2 = 8000
		expect(calcCartTotalPrice(items, updatedItems, mockOptions)).toBe(8000);
	});

	it('allOptions가 바뀌면 calcCartTotalPrice도 재계산된다', () => {
		const items = [createCartItem({ options: [iceOption], quantity: 2 })];

		expect(calcCartTotalPrice(items, [mockItem], mockOptions)).toBe(7000);

		const updatedOptions: MenuOption[] = mockOptions.map((opt) =>
			opt.id === 1 ? { ...opt, prices: [0, 800] } : opt,
		);

		expect(calcCartTotalPrice(items, [mockItem], updatedOptions)).toBe(7600);
	});
});

describe('validateCartItem', () => {
	const listOption: MenuOption = {
		id: 3,
		name: '토핑',
		type: 'list',
		required: false,
		labels: ['펄', '휘핑', '시럽'],
		prices: [500, 500, 0],
		minCount: 0,
		maxCount: 2,
	};

	const itemWithList: MenuItem = {
		...mockItem,
		optionIds: [1, 2, 3],
	};

	it('옵션/라벨이 모두 유효하면 ok를 반환한다', () => {
		const cartItem = createCartItem({ options: [hotOption] });
		const result = validateCartItem(cartItem, mockItem, mockOptions);
		expect(result).toEqual({ kind: 'ok' });
	});

	it('라벨이 삭제되면 invalid를 반환한다', () => {
		const cartItem = createCartItem({ options: [iceOption] });
		// ICE 라벨이 제거된 상황
		const updatedOptions: MenuOption[] = [
			{ ...(mockOptions[0] as GridOption), labels: ['HOT'], prices: [0] },
			mockOptions[1],
		];
		const result = validateCartItem(cartItem, mockItem, updatedOptions);
		expect(result.kind).toBe('invalid');
		if (result.kind === 'invalid') {
			expect(result.reasons.some((r) => r.includes('ICE'))).toBe(true);
		}
	});

	it('옵션 자체가 삭제되면 invalid를 반환한다', () => {
		const cartItem = createCartItem({ options: [hotOption] });
		const result = validateCartItem(cartItem, mockItem, [mockOptions[1]]);
		expect(result.kind).toBe('invalid');
	});

	it('메뉴의 optionIds에 포함되지 않은 옵션이 담겨있으면 invalid', () => {
		const cartItem = createCartItem({ options: [hotOption] });
		const menuWithoutOption: MenuItem = { ...mockItem, optionIds: [2] };
		const result = validateCartItem(cartItem, menuWithoutOption, mockOptions);
		expect(result.kind).toBe('invalid');
	});

	it('필수 옵션이 누락되면 invalid', () => {
		// 사이즈가 required:true로 바뀐 경우
		const cartItem = createCartItem({ options: [hotOption] });
		const updatedOptions: MenuOption[] = [
			mockOptions[0],
			{ ...mockOptions[1], required: true },
		];
		const result = validateCartItem(cartItem, mockItem, updatedOptions);
		expect(result.kind).toBe('invalid');
		if (result.kind === 'invalid') {
			expect(result.reasons.some((r) => r.includes('사이즈'))).toBe(true);
		}
	});

	it('list 타입의 개수 규칙이 바뀌어 위배되면 invalid', () => {
		const cartItem = createCartItem({
			options: [{ optionId: 3, labels: ['펄', '휘핑'] }],
		});
		const stricter: MenuOption[] = [
			...mockOptions,
			{ ...listOption, maxCount: 1 },
		];
		const result = validateCartItem(cartItem, itemWithList, stricter);
		expect(result.kind).toBe('invalid');
	});

	it('가격만 바뀐 경우는 invalid가 아니다', () => {
		const cartItem = createCartItem({ options: [iceOption] });
		const updatedOptions: MenuOption[] = mockOptions.map((o) =>
			o.id === 1 ? { ...o, prices: [0, 999] } : o,
		);
		expect(validateCartItem(cartItem, mockItem, updatedOptions)).toEqual({
			kind: 'ok',
		});
	});

	it('여러 위반이 동시에 발생하면 모두 reasons에 담긴다', () => {
		// required 누락 + 라벨 삭제를 동시에
		const cartItem = createCartItem({ options: [iceOption] });
		const updatedOptions: MenuOption[] = [
			{ ...(mockOptions[0] as GridOption), labels: ['HOT'], prices: [0] },
			{ ...mockOptions[1], required: true },
		];
		const result = validateCartItem(cartItem, mockItem, updatedOptions);
		expect(result.kind).toBe('invalid');
		if (result.kind === 'invalid') {
			expect(result.reasons.length).toBeGreaterThanOrEqual(2);
		}
	});
});
