import type { RoomsResponse } from '@/types/reservation';
import { api } from './client';

/**
 * 전체 회의실 목록을 조회합니다.
 * @returns 회의실 목록 (`rooms`)
 */
export function getRooms() {
  return api.get('rooms').json<RoomsResponse>();
}
