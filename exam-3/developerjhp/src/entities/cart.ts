import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, MenuOption, OptionSelection } from '@/types/order';

export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 99;

interface CartState {
  items: Record<string, CartItem>;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: {},
      addItem: (item) =>
        set((state) => {
          const key = buildCartLineKey(item.itemId, item.options);
          const existing = state.items[key];
          const nextQuantity = Math.min(
            MAX_QUANTITY,
            (existing?.quantity ?? 0) + item.quantity,
          );
          const merged = existing
            ? { ...existing, quantity: nextQuantity }
            : { ...item, quantity: nextQuantity };
          return { items: { ...state.items, [key]: merged } };
        }),
      removeItem: (key) =>
        set((state) => {
          const items = { ...state.items };
          delete items[key];
          return { items };
        }),
      updateQuantity: (key, quantity) =>
        set((state) => {
          if (quantity < MIN_QUANTITY) {
            const items = { ...state.items };
            delete items[key];
            return { items };
          }
          const existing = state.items[key];
          if (!existing) return state;
          return {
            items: {
              ...state.items,
              [key]: {
                ...existing,
                quantity: Math.min(MAX_QUANTITY, quantity),
              },
            },
          };
        }),
      clear: () => set({ items: {} }),
    }),
    { name: 'cart-storage' },
  ),
);

export function selectTotalQuantity(state: CartState): number {
  return Object.values(state.items).reduce(
    (sum, cartItem) => sum + cartItem.quantity,
    0,
  );
}

export function selectTotalPrice(state: CartState): number {
  return Object.values(state.items).reduce(
    (sum, cartItem) => sum + cartItem.unitPrice * cartItem.quantity,
    0,
  );
}

export function buildCartLineKey(
  itemId: string,
  options: OptionSelection[],
): string {
  const sortedOptions = options
    .map((selection) => ({
      optionId: selection.optionId,
      labels: [...selection.labels].sort(),
    }))
    .sort((a, b) => a.optionId - b.optionId);

  const optionParts = sortedOptions.map(
    (selection) => `${selection.optionId}:${selection.labels.join(',')}`,
  );

  return `${itemId}|${optionParts.join('|')}`;
}

export function calculateUnitPrice(
  basePrice: number,
  options: MenuOption[],
  selection: OptionSelection[],
): number {
  const additionalPrice = selection
    .flatMap((pickedOption) => {
      const optionDef = options.find(
        (option) => option.id === pickedOption.optionId,
      );
      if (!optionDef) return [];

      return pickedOption.labels.map((label) => {
        const labelIndex = optionDef.labels.indexOf(label);
        const hasPrice = labelIndex !== -1;
        return hasPrice ? optionDef.prices[labelIndex] : 0;
      });
    })
    .reduce((sum, price) => sum + price, 0);

  return basePrice + additionalPrice;
}

export type ValidationResult = { ok: true } | { ok: false; reason: string };

export function validateSelection(
  options: MenuOption[],
  selection: OptionSelection[],
): ValidationResult {
  for (const option of options) {
    const labels =
      selection.find((sel) => sel.optionId === option.id)?.labels ?? [];
    const error = getOptionError(option, labels);
    if (error) return { ok: false, reason: error };
  }
  return { ok: true };
}

function getOptionError(
  option: MenuOption,
  labels: string[],
): string | null {
  if (labels.length === 0) {
    return option.required
      ? `${option.name} 옵션을 선택해주세요.`
      : null;
  }

  if (option.type !== 'list') return null;

  if (labels.length < option.minCount) {
    return `${option.name} 옵션은 최소 ${option.minCount}개 선택해주세요.`;
  }

  if (labels.length > option.maxCount) {
    return `${option.name} 옵션은 최대 ${option.maxCount}개까지 선택할 수 있어요.`;
  }

  return null;
}
