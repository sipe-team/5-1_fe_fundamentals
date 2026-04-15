import { client } from '@/shared/apis';
import type { CreateOrderRequest, OrderCreatedResponse } from '@/shared/types';

export default function postOrder(payload: CreateOrderRequest) {
  return client.post('orders', { json: payload }).json<OrderCreatedResponse>();
}
