import type { OrderStatus } from '@/types/order';

const LABELS: Record<OrderStatus, string> = {
  pending: '접수 완료',
  preparing: '준비 중',
  completed: '픽업 완료',
  cancelled: '취소됨',
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return LABELS[status];
}
