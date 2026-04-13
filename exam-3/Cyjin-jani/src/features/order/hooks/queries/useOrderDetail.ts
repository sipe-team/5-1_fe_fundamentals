import { useSuspenseQuery } from '@tanstack/react-query';

import { getOrderDetail } from '@/features/order/api/order';
import type { Order, OrderResponse } from '@/types/order';

import { orderQueryKeys } from './queryKeys';

export function useOrderDetail(orderId: string) {
  return useSuspenseQuery<OrderResponse, Error, Order>({
    queryKey: orderQueryKeys.detail(orderId),
    queryFn: () => getOrderDetail(orderId),
    select: (response) => response.order,
  });
}
