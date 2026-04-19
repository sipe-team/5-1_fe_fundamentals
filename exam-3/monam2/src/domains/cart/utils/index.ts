import type { CartItem, MenuOption, OptionSelection } from '@/shared/types';
import {
  createLocalStorageStore,
  formatCurrencyKRW,
  readJsonStorage,
  writeJsonStorage,
} from '@/shared/utils';

export const CART_STORAGE_KEY = 'sipe-order';
export const EMPTY_CART = '[]';
export const MAX_QUANTITY = 99;

export const cartStore = createLocalStorageStore(CART_STORAGE_KEY, EMPTY_CART);

export function getCartKey(item: Pick<CartItem, 'itemId' | 'options'>) {
  const options = [...item.options]
    .sort((left, right) => left.optionId - right.optionId)
    .map((option) => ({
      optionId: option.optionId,
      labels: [...option.labels].sort(),
    }));

  return JSON.stringify({
    itemId: item.itemId,
    options,
  });
}

export function mergeCartItems(items: CartItem[]) {
  const grouped = new Map<string, CartItem>();

  for (const item of items) {
    const key = getCartKey(item);
    const current = grouped.get(key);

    if (current) {
      current.quantity = Math.min(
        MAX_QUANTITY,
        current.quantity + item.quantity,
      );
      continue;
    }

    grouped.set(key, {
      ...item,
      quantity: Math.min(MAX_QUANTITY, item.quantity),
    });
  }

  return [...grouped.values()];
}

export function readCart() {
  return mergeCartItems(readJsonStorage<CartItem[]>(CART_STORAGE_KEY, []));
}

export function saveCart(items: CartItem[]) {
  writeJsonStorage(CART_STORAGE_KEY, mergeCartItems(items));
}

export function addToCart(item: CartItem) {
  saveCart([...readCart(), item]);
}

export function removeFromCart(key: string) {
  saveCart(readCart().filter((item) => getCartKey(item) !== key));
}

export function changeCartQuantity(key: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(key);
    return;
  }

  saveCart(
    readCart().map((item) =>
      getCartKey(item) === key
        ? { ...item, quantity: Math.min(MAX_QUANTITY, quantity) }
        : item,
    ),
  );
}

export function clearCart() {
  saveCart([]);
}

export function formatOptionLabels(
  selection: OptionSelection,
  option?: MenuOption,
) {
  const labels = selection.labels.join(', ');

  if (!option) {
    return labels;
  }

  const extraPrice = selection.labels.reduce((total, label) => {
    const index = option.labels.indexOf(label);
    return total + (index === -1 ? 0 : (option.prices[index] ?? 0));
  }, 0);

  if (extraPrice === 0) {
    return labels;
  }

  return `${labels} (+${formatCurrencyKRW(extraPrice)})`;
}
