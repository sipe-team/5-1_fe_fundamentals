import { useSuspenseQuery } from '@tanstack/react-query';

import { getOrders } from '@/domains/orders/apis';

const QUERY_KEY = ['orders'] as const;

export default function useOrders() {
  return useSuspenseQuery({
    queryKey: useOrders.getQueryKeys(),
    queryFn: getOrders,
    select: (data) => data.orders,
  });
}

useOrders.getQueryKeys = () => QUERY_KEY;
