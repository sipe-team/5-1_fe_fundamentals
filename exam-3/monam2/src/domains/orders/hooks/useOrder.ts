import { useSuspenseQuery } from '@tanstack/react-query';

import { getOrder } from '@/domains/orders/apis';

const QUERY_KEY = ['orders', 'detail'] as const;

export default function useOrder(orderId: string) {
  return useSuspenseQuery({
    queryKey: useOrder.getQueryKeys(orderId),
    queryFn: () => getOrder(orderId),
    select: (data) => data.order,
  });
}

useOrder.getQueryKeys = (orderId?: string) =>
  orderId ? [...QUERY_KEY, orderId] : QUERY_KEY;
