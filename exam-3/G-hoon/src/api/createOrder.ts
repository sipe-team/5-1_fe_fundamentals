import type { CreateOrderRequest } from '@/types/order';
import { api } from './client';

interface CreateOrderResponse {
  orderId: string;
}

/**
 * 새 주문을 생성합니다.
 * @param body - 주문 생성 요청 데이터 (totalPrice, customerName, items)
 * @returns 생성된 주문 ID (`orderId`)
 * @throws 400 Bad Request - 잘못된 주문 데이터
 */
export function createOrder(body: CreateOrderRequest) {
  return api.post('orders', { json: body }).json<CreateOrderResponse>();
}
