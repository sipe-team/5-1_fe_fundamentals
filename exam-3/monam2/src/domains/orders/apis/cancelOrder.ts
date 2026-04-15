import { client } from '@/shared/apis';
import type { ApiMessageResponse } from '@/shared/types';

export default function cancelOrder(orderId: string) {
  return client.patch(`orders/${orderId}/cancel`).json<ApiMessageResponse>();
}
