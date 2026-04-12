import { api } from '@/shared/api/client';

/**
 * 예약을 취소(삭제)합니다.
 * @param id - 취소할 예약 ID
 * @returns 취소 완료 메시지
 */
export function deleteReservation(id: string) {
  return api.delete(`reservations/${id}`).json<{ message: string }>();
}
