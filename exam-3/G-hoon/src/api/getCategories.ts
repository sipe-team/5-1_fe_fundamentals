import type { CategoriesResponse } from '@/types/order';
import { api } from './client';

/**
 * 카테고리 목록을 조회합니다.
 * @returns 카테고리 목록 (`categories`)
 */
export function getCategories() {
  return api.get('catalog/categories').json<CategoriesResponse>();
}
