import { client } from '@/shared/apis';
import type { OrdersResponse } from '@/shared/types';

export default function getOrders() {
  return client.get('orders').json<OrdersResponse>();
}
