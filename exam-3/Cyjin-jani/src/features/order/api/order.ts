import { api } from '@/shared/lib/ky';
import type { CreateOrderRequest, OrderResponse } from '@/features/order/types';

export interface CreateOrderResponse {
  orderId: string;
}

export async function createOrder(
  body: CreateOrderRequest,
): Promise<CreateOrderResponse> {
  return api.post('orders', { json: body }).json<CreateOrderResponse>();
}

export async function getOrderDetail(orderId: string): Promise<OrderResponse> {
  return api.get(`orders/${orderId}`).json<OrderResponse>();
}
