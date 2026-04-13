import type { MenuItem } from '@/types/order';
import { api } from './client';

interface GetMenuItemsResponse {
  items: MenuItem[];
}

/**
 * 전체 메뉴 목록을 조회합니다.
 * @returns 메뉴 목록 (`items`)
 */
export function getMenuItems() {
  return api.get('catalog/items').json<GetMenuItemsResponse>();
}
