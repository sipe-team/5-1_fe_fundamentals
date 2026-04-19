import { client } from '@/shared/apis';
import type { OrderResponse } from '@/shared/types';

export default function getOrder(orderId: string) {
  return client.get(`orders/${orderId}`).json<OrderResponse>();
}
