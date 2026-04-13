import { queryOptions } from '@tanstack/react-query';
import {
  ApiError,
  fetcher,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_SERVICE_UNAVAILABLE,
} from '@/shared/fetcher';
import type { CreateOrderRequest, Order } from '@/types/order';

export function orderQueryOptions(orderId: string) {
  return queryOptions({
    queryKey: ['orders', orderId] as const,
    queryFn: () => fetcher<{ order: Order }>(`/api/orders/${orderId}`),
    retry: retryOrderRequest,
  });
}

export function createOrder(
  body: CreateOrderRequest,
): Promise<{ orderId: string }> {
  return fetcher<{ orderId: string }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function retryOrderRequest(failureCount: number, error: unknown) {
  if (!(error instanceof ApiError)) {
    return false;
  }

  switch (error.status) {
    case HTTP_STATUS_NOT_FOUND:
      return false;
    case HTTP_STATUS_SERVICE_UNAVAILABLE:
      return failureCount < 1;
    case HTTP_STATUS_INTERNAL_SERVER_ERROR:
      return failureCount < 1;
    default:
      return false;
  }
}
