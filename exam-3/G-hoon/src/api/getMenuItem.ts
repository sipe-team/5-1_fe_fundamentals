import type { MenuItemResponse } from '@/types/order';
import { api } from './client';

/**
 * 특정 메뉴의 상세 정보를 조회합니다.
 * @param itemId - 메뉴 ID
 * @returns 메뉴 상세 정보 (`item`)
 */
export function getMenuItem(itemId: string) {
  return api.get(`catalog/items/${itemId}`).json<MenuItemResponse>();
}
