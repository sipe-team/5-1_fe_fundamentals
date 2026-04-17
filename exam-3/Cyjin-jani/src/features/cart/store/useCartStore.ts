import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { buildCartItemKey } from '@/features/cart/lib/buildCartItemKey';
import {
  MIN_CART_ITEM_QUANTITY,
  normalizeCartItemQuantity,
} from '@/features/cart/lib/cartItemQuantity';
import { selectTotalPrice, selectTotalQuantity } from '@/features/cart/lib/cartSelectors';
import type { CartItem } from '@/features/cart/types';

export const CART_STORAGE_KEY = 'coffee-order-cart';

export interface CartStore {
  items: CartItem[];

  addItem: (item: CartItem) => void;
  removeItem: (cartItemKey: string) => void;
  updateQuantity: (cartItemKey: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const incomingKey = buildCartItemKey(item.itemId, item.options);
          const index = state.items.findIndex(
            (row) => buildCartItemKey(row.itemId, row.options) === incomingKey,
          );

          if (index === -1) {
            return {
              items: [
                ...state.items,
                {
                  ...item,
                  quantity: normalizeCartItemQuantity(item.quantity),
                },
              ],
            };
          }

          const existing = state.items[index];
          const mergedQuantity = normalizeCartItemQuantity(existing.quantity + item.quantity);
          const nextItems = state.items.slice();
          nextItems[index] = { ...existing, quantity: mergedQuantity };
          return { items: nextItems };
        }),

      removeItem: (cartItemKey) =>
        set((state) => ({
          items: state.items.filter(
            (row) => buildCartItemKey(row.itemId, row.options) !== cartItemKey,
          ),
        })),

      updateQuantity: (cartItemKey, quantity) =>
        set((state) => {
          if (quantity < MIN_CART_ITEM_QUANTITY) {
            return {
              items: state.items.filter(
                (row) => buildCartItemKey(row.itemId, row.options) !== cartItemKey,
              ),
            };
          }

          const index = state.items.findIndex(
            (row) => buildCartItemKey(row.itemId, row.options) === cartItemKey,
          );
          if (index === -1) {
            return state;
          }

          const nextItems = state.items.slice();
          nextItems[index] = {
            ...nextItems[index],
            quantity: normalizeCartItemQuantity(quantity),
          };
          return { items: nextItems };
        }),

      clear: () => set({ items: [] }),
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const useCartItems = (): CartItem[] => useCartStore((state) => state.items);

export const useCartTotalQuantity = (): number =>
  useCartStore((state) => selectTotalQuantity(state.items));

export const useCartTotalPrice = (): number =>
  useCartStore((state) => selectTotalPrice(state.items));

export const useAddCartItem = (): CartStore['addItem'] => useCartStore((state) => state.addItem);

export const useRemoveCartItem = (): CartStore['removeItem'] =>
  useCartStore((state) => state.removeItem);

export const useUpdateCartItemQuantity = (): CartStore['updateQuantity'] =>
  useCartStore((state) => state.updateQuantity);

export const useClearCart = (): CartStore['clear'] => useCartStore((state) => state.clear);
