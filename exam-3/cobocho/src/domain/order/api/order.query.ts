import { queryOptions } from '@tanstack/react-query';
import { orderService } from './order.service';

export const orderQuery = {
	all: () => ['orders'] as const,

	list: () =>
		queryOptions({
			queryKey: [...orderQuery.all(), 'list'] as const,
			queryFn: () => orderService.getOrders(),
			staleTime: 1000 * 60,
			gcTime: 1000 * 60 * 5,
			retry: 1,
		}),

	detail: (orderId: string) =>
		queryOptions({
			queryKey: [...orderQuery.all(), 'detail', orderId] as const,
			queryFn: () => orderService.getOrder(orderId),
			staleTime: 1000 * 60,
			gcTime: 1000 * 60 * 5,
			retry: 1,
		}),
};
