import {
  type UseMutationOptions,
  type UseMutationResult,
  useMutation,
} from '@tanstack/react-query';
import type { HTTPError } from 'ky';

import {
  type CreateOrderResponse,
  createOrder,
} from '@/features/order/api/order';
import type { CreateOrderRequest } from '@/features/order/types';

export function useCreateOrder(
  options?: UseMutationOptions<
    CreateOrderResponse,
    HTTPError,
    CreateOrderRequest
  >,
): UseMutationResult<CreateOrderResponse, HTTPError, CreateOrderRequest> {
  return useMutation<CreateOrderResponse, HTTPError, CreateOrderRequest>({
    mutationFn: (body) => createOrder(body),
    ...options,
  });
}
