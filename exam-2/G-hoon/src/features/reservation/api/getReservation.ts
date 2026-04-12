import { api } from '@/shared/api/client';
import type { ReservationResponse } from '@/types/reservation';

/**
 * 특정 예약의 상세 정보를 조회합니다.
 * @param id - 예약 ID
 * @returns 예약 상세 정보 (`reservation`)
 */
export function getReservation(id: string) {
  return api.get(`reservations/${id}`).json<ReservationResponse>();
}
