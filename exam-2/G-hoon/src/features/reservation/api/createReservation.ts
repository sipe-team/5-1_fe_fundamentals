import { api } from '@/shared/api/client';
import type {
  CreateReservationRequest,
  ReservationResponse,
} from '@/types/reservation';

/**
 * 새 예약을 생성합니다.
 * @param body - 예약 생성 요청 데이터 (회의실, 날짜, 시간, 제목, 예약자, 참석 인원)
 * @returns 생성된 예약 정보 (`reservation`)
 * @throws 409 Conflict - 해당 시간대에 이미 예약이 존재하는 경우
 */
export function createReservation(body: CreateReservationRequest) {
  return api.post('reservations', { json: body }).json<ReservationResponse>();
}
