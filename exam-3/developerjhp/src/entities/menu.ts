import { queryOptions } from '@tanstack/react-query';
import {
  ApiError,
  fetcher,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from '@/shared/fetcher';
import type { MenuCategory, MenuItem, MenuOption } from '@/types/order';

export function categoriesQueryOptions() {
  return queryOptions({
    queryKey: ['catalog', 'categories'] as const,
    queryFn: () =>
      fetcher<{ categories: MenuCategory[] }>('/api/catalog/categories'),
    retry: retryCatalogRequest,
  });
}

export function menuItemsQueryOptions() {
  return queryOptions({
    queryKey: ['catalog', 'items'] as const,
    queryFn: () => fetcher<{ items: MenuItem[] }>('/api/catalog/items'),
    retry: retryCatalogRequest,
  });
}

export function menuItemQueryOptions(itemId: string) {
  return queryOptions({
    queryKey: ['catalog', 'items', itemId] as const,
    queryFn: () => fetcher<{ item: MenuItem }>(`/api/catalog/items/${itemId}`),
    retry: retryCatalogRequest,
  });
}

export function optionsQueryOptions() {
  return queryOptions({
    queryKey: ['catalog', 'options'] as const,
    queryFn: () => fetcher<{ options: MenuOption[] }>('/api/catalog/options'),
    retry: retryCatalogRequest,
  });
}

function retryCatalogRequest(failureCount: number, error: unknown) {
  if (!(error instanceof ApiError)) {
    return failureCount < 1;
  }

  switch (error.status) {
    case HTTP_STATUS_NOT_FOUND:
      return false;
    case HTTP_STATUS_SERVICE_UNAVAILABLE:
      return failureCount < 2;
    case HTTP_STATUS_INTERNAL_SERVER_ERROR:
      return failureCount < 1;
    default:
      return failureCount < 1;
  }
}
