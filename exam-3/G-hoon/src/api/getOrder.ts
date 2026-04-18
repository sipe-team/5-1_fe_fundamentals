import type { OrderResponse } from '@/types/order';
import { api } from './client';

/**
 * 특정 주문의 상세 정보를 조회합니다.
 * @param orderId - 주문 ID
 * @returns 주문 상세 정보 (`order`)
 */
export function getOrder(orderId: string) {
  return api.get(`orders/${orderId}`).json<OrderResponse>();
}
