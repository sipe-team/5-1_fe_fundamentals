import type { MenuItem } from '@/domain/catalog/api';
import type { OptionSelection } from '../../api';
import type { CartItem } from './cart-context';

/**
 * 두 옵션 선택 배열이 동일한지 비교합니다.
 * optionId가 같고, 선택된 label 목록이 동일하면 같은 옵션으로 판단합니다.
 */
export function isSameOptions(
	a: OptionSelection[],
	b: OptionSelection[],
): boolean {
	if (a.length !== b.length) return false;

	return a.every((aOption) => {
		const bOption = b.find((x) => x.optionId === aOption.optionId);
		if (!bOption) return false;

		const aLabels = new Set(aOption.labels);
		const bLabels = new Set(bOption.labels);

		if (aLabels.size !== bLabels.size) return false;

		return [...aLabels].every((label) => bLabels.has(label));
	});
}

/**
 * 장바구니 항목의 고유 키를 생성합니다.
 * 같은 메뉴 + 같은 옵션 조합은 동일한 키를 반환합니다.
 */
export function cartItemKey(
	itemId: string,
	options: OptionSelection[],
): string {
	const optionParts = [...options]
		.sort((a, b) => a.optionId - b.optionId)
		.map((option) => {
			const labels = [...option.labels].sort().join(',');
			return `${option.optionId}:${labels}`;
		})
		.join('|');

	return `${itemId}::${optionParts}`;
}

/**
 * 장바구니에 항목을 추가합니다.
 * 같은 메뉴 + 같은 옵션 조합이 이미 있으면 수량을 합산하고,
 * 없으면 새 항목을 추가합니다.
 */
interface AddItemParams {
	prev: CartItem[];
	item: MenuItem;
	options: OptionSelection[];
	quantity: number;
	unitPrice: number;
}

export function addItemToCart({
	prev,
	item,
	options,
	quantity,
	unitPrice,
}: AddItemParams): CartItem[] {
	const existingIndex = prev.findIndex(
		(cartItem) =>
			cartItem.item.id === item.id && isSameOptions(cartItem.options, options),
	);

	const isExisting = existingIndex !== -1;

	if (isExisting) {
		return mergeQuantity(prev, existingIndex, quantity);
	}

	const newItem: CartItem = {
		item,
		options,
		quantity,
		unitPrice,
		totalPrice: unitPrice * quantity,
	};

	return [...prev, newItem];
}

function mergeQuantity(
	items: CartItem[],
	targetIndex: number,
	addedQuantity: number,
): CartItem[] {
	return items.map((cartItem, index) => {
		if (index !== targetIndex) return cartItem;

		const newQuantity = cartItem.quantity + addedQuantity;

		return {
			...cartItem,
			quantity: newQuantity,
			totalPrice: cartItem.unitPrice * newQuantity,
		};
	});
}

interface UpdateQuantityParams {
	prev: CartItem[];
	key: string;
	quantity: number;
}

export function updateQuantityInCart({
	prev,
	key,
	quantity,
}: UpdateQuantityParams): CartItem[] {
	return prev.map((cartItem) => {
		if (cartItemKey(cartItem.item.id, cartItem.options) !== key) {
			return cartItem;
		}

		return {
			...cartItem,
			quantity,
			totalPrice: cartItem.unitPrice * quantity,
		};
	});
}

/**
 * 장바구니 전체 금액을 계산합니다.
 */
export function calcTotalPrice(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.totalPrice, 0);
}

/**
 * 장바구니 전체 수량을 계산합니다.
 */
export function calcTotalQuantity(items: CartItem[]): number {
	return items.reduce((sum, item) => sum + item.quantity, 0);
}
