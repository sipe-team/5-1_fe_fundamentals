import { queryOptions } from '@tanstack/react-query';
import { catalogService } from './catalog.service';

export const catalogQuery = {
	all: () => ['catalog'] as const,

	categories: () =>
		queryOptions({
			queryKey: [...catalogQuery.all(), 'categories'] as const,
			queryFn: () => catalogService.getCategories(),
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			retry: 1,
		}),

	items: () =>
		queryOptions({
			queryKey: [...catalogQuery.all(), 'items'] as const,
			queryFn: () => catalogService.getItems(),
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			retry: 1,
		}),

	item: (itemId: string) =>
		queryOptions({
			queryKey: [...catalogQuery.all(), 'item', itemId] as const,
			queryFn: () => catalogService.getItem(itemId),
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			retry: 1,
		}),

	options: () =>
		queryOptions({
			queryKey: [...catalogQuery.all(), 'options'] as const,
			queryFn: () => catalogService.getOptions(),
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			retry: 1,
		}),
};
