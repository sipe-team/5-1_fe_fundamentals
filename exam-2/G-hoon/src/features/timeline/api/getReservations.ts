import { api } from '@/shared/api/client';
import type { ReservationsResponse } from '@/types/reservation';

/**
 * 특정 날짜의 전체 예약 목록을 조회합니다.
 * @param date - 조회할 날짜 (YYYY-MM-DD)
 * @returns 예약 목록 (`reservations`)
 */
export function getReservations(date: string) {
  return api
    .get('reservations', { searchParams: { date } })
    .json<ReservationsResponse>();
}
