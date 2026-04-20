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
    .map((option) => ({
      optionId: option.optionId,
      labels: [...option.labels].sort(),
    }));
  return JSON.stringify([itemId, sortedOptions]);
}

type AddCartItem = Omit<CartItem, 'id'>;
type StoredCartItem = AddCartItem & Partial<Pick<CartItem, 'id'>>;

function getCartItemId(item: StoredCartItem): string {
  return item.id ?? cartItemKey(item.itemId, item.options);
}

function withCartItemId(item: AddCartItem): CartItem {
  return {
    ...item,
    id: cartItemKey(item.itemId, item.options),
  };
}

interface CartState {
  items: CartItem[];
  addItem: (item: AddCartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
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
            (i) => getCartItemId(i) === key,
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
              withCartItemId({
                ...item,
                quantity: clampQuantity(item.quantity),
              }),
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => {
          return {
            items: state.items.filter((i) => getCartItemId(i) !== id),
          };
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const nextQuantity = clampQuantity(quantity);
          return {
            items: state.items.map((i) =>
              getCartItemId(i) === id ? { ...i, quantity: nextQuantity } : i,
            ),
          };
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'exam-3/g-hoon:cart',
      version: 1,
      migrate: (persistedState) => {
        // persist version 0 -> 1: id 필드가 없던 장바구니 항목을 복원합니다.
        const state = (persistedState ?? {}) as Partial<{
          items: StoredCartItem[];
        }>;

        return {
          ...state,
          items: (state.items ?? []).map((item) => ({
            ...item,
            id: getCartItemId(item),
          })),
        };
      },
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
