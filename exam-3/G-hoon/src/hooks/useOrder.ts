import { useSuspenseQuery } from '@tanstack/react-query';
import { getOrder } from '@/api/getOrder';
import { queryKeys } from '@/api/queryKeys';

export function useOrder(orderId: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => getOrder(orderId),
    select: (data) => data.order,
  });
}
