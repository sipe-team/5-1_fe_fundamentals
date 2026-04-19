import { useMemo, useSyncExternalStore } from 'react';

import {
  cartStore,
  EMPTY_CART,
  getCartKey,
  mergeCartItems,
} from '@/domains/cart/utils';
import type { CartItem } from '@/shared/types';

function parseCartItems(snapshot: string) {
  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return [];
  }
}

export default function useCartList(storage = cartStore) {
  const cartSnapshot = useSyncExternalStore(
    storage.subscribe,
    storage.getSnapshot,
    () => EMPTY_CART,
  );

  const items = useMemo(
    () =>
      mergeCartItems(parseCartItems(cartSnapshot)).map((item) => ({
        ...item,
        cartKey: getCartKey(item),
        totalPrice: item.unitPrice * item.quantity,
      })),
    [cartSnapshot],
  );

  return useMemo(() => {
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    return {
      items,
      totalPrice,
      totalQuantity,
    };
  }, [items]);
}
