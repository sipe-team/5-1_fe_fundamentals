import { api } from '@/shared/api/client';
import type { ReservationsResponse } from '@/types/reservation';

/**
 * 내가 생성한 예약 목록을 조회합니다.
 * @returns 내 예약 목록 (`reservations`)
 */
export function getMyReservations() {
  return api.get('my-reservations').json<ReservationsResponse>();
}
