import type { MenuItem } from '@/domain/catalog/api';
import type { MenuOption } from '@/types/order';
import type { OptionSelection } from '../../api';
import type { CartItem } from './cart-context';

/**
 * 두 옵션 선택 배열이 동일한지 비교합니다.
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

interface AddItemParams {
  prev: CartItem[];
  itemId: string;
  options: OptionSelection[];
  quantity: number;
}

/**
 * 장바구니에 항목을 추가합니다.
 */
export function addItemToCart({
  prev,
  itemId,
  options,
  quantity,
}: AddItemParams): CartItem[] {
  const existingIndex = prev.findIndex(
    (cartItem) =>
      cartItem.itemId === itemId && isSameOptions(cartItem.options, options),
  );

  if (existingIndex !== -1) {
    return prev.map((cartItem, index) => {
      if (index !== existingIndex) return cartItem;
      return { ...cartItem, quantity: cartItem.quantity + quantity };
    });
  }

  return [...prev, { itemId, options, quantity }];
}

/**
 * 장바구니 전체 수량을 계산합니다.
 */
export function calcTotalQuantity(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * 옵션 선택에 따른 단가를 계산합니다.
 */
export function calcUnitPrice(
  item: MenuItem,
  selections: OptionSelection[],
  allOptions: MenuOption[],
): number {
  let price = item.price;

  for (const selection of selections) {
    const option = allOptions.find((o) => o.id === selection.optionId);
    if (!option) continue;

    for (const label of selection.labels) {
      const labelIndex = option.labels.indexOf(label);
      if (labelIndex !== -1) {
        price += option.prices[labelIndex];
      }
    }
  }

  return price;
}

/**
 * 장바구니 항목의 유효성 상태를 나타냅니다.
 */
export type CartItemStatus =
  | { kind: 'ok' }
  | { kind: 'invalid'; reasons: string[] };

/**
 * 장바구니 항목이 현재 서버 스펙(menuItem, allOptions)과 호환되는지 검증합니다.
 * 가격 변동은 invalid로 보지 않습니다 (자동 반영 영역).
 */
export function validateCartItem(
  cartItem: CartItem,
  menuItem: MenuItem,
  allOptions: MenuOption[],
): CartItemStatus {
  const reasons: string[] = [];
  const selectedMap = new Map(
    cartItem.options.map((s) => [s.optionId, s] as const),
  );

  for (const sel of cartItem.options) {
    if (!menuItem.optionIds.includes(sel.optionId)) {
      reasons.push('이 메뉴에 적용할 수 없는 옵션이 포함되어 있어요');
      continue;
    }
    const opt = allOptions.find((o) => o.id === sel.optionId);
    if (!opt) {
      reasons.push('옵션이 삭제되었어요');
      continue;
    }
    for (const label of sel.labels) {
      if (!opt.labels.includes(label)) {
        reasons.push(`"${label}" 선택지가 사라졌어요`);
      }
    }
    if (opt.type === 'list') {
      const n = sel.labels.length;
      if (n < opt.minCount || n > opt.maxCount) {
        reasons.push(`"${opt.name}" 선택 개수 규칙이 변경됐어요`);
      }
    }
  }

  for (const optId of menuItem.optionIds) {
    const opt = allOptions.find((o) => o.id === optId);
    if (opt?.required && !selectedMap.has(optId)) {
      reasons.push(`"${opt.name}" 옵션 선택이 필요해요`);
    }
  }

  return reasons.length ? { kind: 'invalid', reasons } : { kind: 'ok' };
}

/**
 * 장바구니 전체 금액을 계산합니다.
 * 서버에서 삭제된 항목(allItems에 없는 itemId)은 합산에서 제외합니다.
 */
export function calcCartTotalPrice(
  items: CartItem[],
  allItems: MenuItem[],
  allOptions: MenuOption[],
): number {
  const itemMap = new Map(allItems.map((i) => [i.id, i]));
  return items.reduce((sum, cartItem) => {
    const menuItem = itemMap.get(cartItem.itemId);
    if (!menuItem) return sum;
    const unitPrice = calcUnitPrice(menuItem, cartItem.options, allOptions);
    return sum + unitPrice * cartItem.quantity;
  }, 0);
}
