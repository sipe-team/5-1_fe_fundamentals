import type { OptionsResponse } from '@/types/order';
import { api } from './client';

/**
 * 전체 옵션 목록을 조회합니다.
 * @returns 옵션 목록 (`options`)
 */
export function getOptions() {
  return api.get('catalog/options').json<OptionsResponse>();
}
