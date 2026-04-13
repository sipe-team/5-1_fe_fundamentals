import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, OptionSelection } from '@/types/order';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

function clampQuantity(quantity: number): number {
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, quantity));
}

function cartItemKey(itemId: string, options: OptionSelection[]): string {
  const sortedOptions = [...options]
    .sort((a, b) => a.optionId - b.optionId)
    .map((o) => `${o.optionId}:${[...o.labels].sort().join(',')}`)
    .join('|');
  return `${itemId}::${sortedOptions}`;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string, options: OptionSelection[]) => void;
  updateQuantity: (
    itemId: string,
    options: OptionSelection[],
    quantity: number,
  ) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const key = cartItemKey(item.itemId, item.options);
          const existing = state.items.findIndex(
            (i) => cartItemKey(i.itemId, i.options) === key,
          );
          if (existing !== -1) {
            const updated = [...state.items];
            updated[existing] = {
              ...updated[existing],
              quantity: clampQuantity(
                updated[existing].quantity + item.quantity,
              ),
            };
            return { items: updated };
          }
          return {
            items: [
              ...state.items,
              { ...item, quantity: clampQuantity(item.quantity) },
            ],
          };
        }),

      removeItem: (itemId, options) =>
        set((state) => {
          const key = cartItemKey(itemId, options);
          return {
            items: state.items.filter(
              (i) => cartItemKey(i.itemId, i.options) !== key,
            ),
          };
        }),

      updateQuantity: (itemId, options, quantity) =>
        set((state) => {
          const key = cartItemKey(itemId, options);
          const nextQuantity = clampQuantity(quantity);
          return {
            items: state.items.map((i) =>
              cartItemKey(i.itemId, i.options) === key
                ? { ...i, quantity: nextQuantity }
                : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'exam-3/g-hoon:cart',
    },
  ),
);

export function selectCartTotalCount(state: CartState): number {
  return state.items.reduce((sum, item) => sum + item.quantity, 0);
}

export function selectCartTotalPrice(state: CartState): number {
  return state.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
}
