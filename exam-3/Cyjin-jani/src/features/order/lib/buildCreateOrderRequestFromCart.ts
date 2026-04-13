import { selectTotalPrice } from '@/features/cart/lib/cartSelectors';
import type { CartItem } from '@/features/cart/types';
import type { CreateOrderRequest } from '@/features/order/types';

export function buildCreateOrderRequestFromCart(
  items: CartItem[],
): CreateOrderRequest {
  return {
    totalPrice: selectTotalPrice(items),
    customerName: 'SIPER 5TH',
    items: items.map(({ itemId, quantity, options }) => ({
      itemId,
      quantity,
      options,
    })),
  };
}
